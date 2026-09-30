// Firestore data access for an in-progress game (Phase 2a: the round
// skeleton - exam, vote, role draw, amendments, levy/tax, turns, coups,
// term scoring). Lobby-only concerns (create/join a room) live in
// gameRoom.js; this file only runs once a room's status is 'active'.
//
// Data layout, in addition to what gameRoom.js already documents:
//   games/{roomCode}
//     round, phase, leaderUid, leaderType, turnOrder, currentTurnIndex,
//     turnsCompletedUids, amendmentsUsedThisTerm, levy, rules,
//     constitution, treasury, amendmentLog, performanceDeck/DrawIndex,
//     settlementDeck/DrawIndex, scandalDeck/DrawIndex, currentPerformance
//   games/{roomCode}/players/{uid}
//     + psd, popularity, eliminated, examPassedThisRound, coupCards
//   games/{roomCode}/rounds/{round}
//     leaderUid, questions, answers, revealed, votes
//   games/{roomCode}/rounds/{round}/secret/answerKey
//     key - readable only by that round's leaderUid until revealed
//
// `rules` mirrors the handful of amendable numbers this phase's gameplay
// actually reads (pass mark, tax rate, malpractice fine) so an amendment to
// those articles has a real effect without re-parsing article text on every
// read. `constitution` is a full deep copy of articles.js so amendments have
// somewhere to write new wording - the two are kept in sync by
// applyAmendmentEffect() below, in one place, so they can't drift apart.
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    onSnapshot,
    runTransaction,
    deleteField,
    increment,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { V, constitutionChapters, cardData } from './psdData.js'
import { canAttemptCoup } from './engine/coup.js'
import { isCancelled, applyAmendmentVotes, applyPerformanceVote, clampPopularity } from './engine/popularity.js'
import { didPass, scoreAnswers } from './engine/exam.js'
import { shiftLevyBand, clampLevyToBand } from './engine/levy.js'
import { tiebreakScore } from './engine/tiebreak.js'
import { applyAmendment } from './engine/amendment.js'
import { shuffle, drawFromDeck } from './engine/deck.js'

// data/cards.js numbers cards by array position, not a separate id field -
// a "card number" everywhere below is just an index into these arrays.
const { performance: performanceCards, settlement: settlementCards, scandal: scandalCards } = cardData
const PERFORMANCE_NUMBERS = performanceCards.map((_, i) => i)
const SETTLEMENT_NUMBERS = settlementCards.map((_, i) => i)
const SCANDAL_NUMBERS = scandalCards.map((_, i) => i)

const gameRef = (roomCode) => doc(db, 'games', roomCode)
const playerRef = (roomCode, uid) => doc(db, 'games', roomCode, 'players', uid)
const roundRef = (roomCode, round) => doc(db, 'games', roomCode, 'rounds', String(round))
const answerKeyRef = (roomCode, round) => doc(db, 'games', roomCode, 'rounds', String(round), 'secret', 'answerKey')

// Firestore rejects an array whose elements are themselves arrays, but
// articles.js stores each article as a [name, text] tuple - fine for the
// site's static rules page, not fine once it needs to live in a Firestore
// document. This is the one place that shape gets converted to
// {name, text} objects for storage; every read/write of a room's
// `constitution` field below uses the object shape.
const toStorableConstitution = (chapters) =>
    chapters.map((ch) => ({
        chapter: ch.chapter,
        articles: ch.articles.map(([name, text]) => ({ name, text })),
    }))

// ---------------------------------------------------------------
// Starting a game (called once, when the host moves the room out of
// the lobby). Every player gets the same starting PSD/popularity; round 1
// has no exam, so it starts straight at the leader vote.
// ---------------------------------------------------------------
export async function initializeActiveGame(roomCode, playerUids) {
    await runTransaction(db, async (tx) => {
        tx.update(gameRef(roomCode), {
            status: 'active',
            round: 1,
            phase: 'vote',
            leaderUid: null,
            leaderType: null,
            turnOrder: playerUids,
            currentTurnIndex: 0,
            turnsCompletedUids: [],
            amendmentsUsedThisTerm: { inauguration: false, midterm: false, farewell: false },
            levy: { amount: V.levy.start, bandLow: V.levy.bandLow, bandHigh: V.levy.bandHigh },
            rules: { passMark: V.passMark, taxRate: V.taxRate, malpracticeFine: V.malpracticeFine },
            constitution: toStorableConstitution(constitutionChapters),
            treasury: V.treasuryFor(playerUids.length),
            amendmentLog: [],
            performanceDeck: shuffle(PERFORMANCE_NUMBERS),
            performanceDrawIndex: 0,
            settlementDeck: shuffle(SETTLEMENT_NUMBERS),
            settlementDrawIndex: 0,
            scandalDeck: shuffle(SCANDAL_NUMBERS),
            scandalDrawIndex: 0,
            currentPerformance: null,
        })
        for (const uid of playerUids) {
            tx.update(playerRef(roomCode, uid), {
                psd: V.startMoney,
                popularity: 0,
                eliminated: false,
                examPassedThisRound: true,
                coupCards: 0,
                roundsAsLeader: 0,
            })
        }
        tx.set(roundRef(roomCode, 1), { leaderUid: null, questions: [], answers: {}, revealed: true, votes: {} })
    })
}

export function subscribeToRound(roomCode, round, callback) {
    return onSnapshot(roundRef(roomCode, round), (snap) => {
        callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
}

// ---------------------------------------------------------------
// Exam
// ---------------------------------------------------------------
export async function writeExam(roomCode, round, leaderUid, questions, answerKey) {
    await setDoc(roundRef(roomCode, round), {
        leaderUid,
        questions: questions.map((q) => ({ text: q.text, options: q.options })),
        answers: {},
        revealed: false,
        votes: {},
    })
    await setDoc(answerKeyRef(roomCode, round), { key: answerKey })
}

export async function submitExamAnswers(roomCode, round, uid, answers) {
    await updateDoc(roundRef(roomCode, round), { [`answers.${uid}`]: answers })
}

export async function revealExam(roomCode, roundNum, players) {
    const keySnap = await getDoc(answerKeyRef(roomCode, roundNum))
    const key = keySnap.data().key
    const roundSnap = await getDoc(roundRef(roomCode, roundNum))
    const { answers, questions } = roundSnap.data()

    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        for (const p of players) {
            // The Leader wrote the questions and the sealed key, so they
            // never submit answers of their own - treat them as passing
            // automatically rather than scoring an empty submission as 0%.
            const passed =
                p.uid === game.leaderUid ? true : didPass(scoreAnswers(answers[p.uid] || [], key), questions.length, game.rules.passMark)
            tx.update(playerRef(roomCode, p.uid), { examPassedThisRound: passed })
        }
        tx.update(roundRef(roomCode, roundNum), { revealed: true, key })
        tx.update(gameRef(roomCode), { phase: 'vote' })
    })
}

// ---------------------------------------------------------------
// Leader vote
// ---------------------------------------------------------------
export async function castLeaderVote(roomCode, round, voterUid, candidateUid) {
    await updateDoc(roundRef(roomCode, round), { [`votes.${voterUid}`]: candidateUid })
}

export async function tallyLeaderVoteAndAdvance(roomCode, round) {
    const roundSnap = await getDoc(roundRef(roomCode, round))
    const votes = roundSnap.data().votes || {}
    const tally = {}
    for (const candidate of Object.values(votes)) tally[candidate] = (tally[candidate] || 0) + 1
    let winner = null
    let winnerVotes = -1
    for (const [uid, count] of Object.entries(tally)) {
        if (count > winnerVotes) {
            winner = uid
            winnerVotes = count
        }
    }
    await updateDoc(gameRef(roomCode), { leaderUid: winner, phase: 'roleDraw' })
    return winner
}

// ---------------------------------------------------------------
// Role draw - Dictator / President / Commander, equal odds
// ---------------------------------------------------------------
const LEADER_TYPES = ['Dictator', 'President', 'Commander']

export async function drawLeaderRole(roomCode) {
    const roleType = LEADER_TYPES[Math.floor(Math.random() * LEADER_TYPES.length)]
    await updateDoc(gameRef(roomCode), { leaderType: roleType, phase: 'inauguration' })
    return roleType
}

// ---------------------------------------------------------------
// Amendments (Inauguration / Mid-term / Farewell) - shared logic.
// window is one of 'inauguration' | 'midterm' | 'farewell'.
// ---------------------------------------------------------------
export async function proposeAmendment(roomCode, chapterIndex, articleIndex, replacements) {
    const game = (await getDoc(gameRef(roomCode))).data()
    if (game.leaderType === 'Commander') {
        return { valid: false, reason: 'Commanders cannot amend the Constitution' }
    }
    const { name, text } = game.constitution[chapterIndex].articles[articleIndex]
    const result = applyAmendment(text, replacements)
    if (!result.valid) return result

    await updateDoc(gameRef(roomCode), {
        pendingAmendment: { chapterIndex, articleIndex, name, oldText: text, newText: result.text },
    })
    return result
}

// The table's "is this still correct English" ruling - a human judgement
// call per the rulebook, not something this code decides. `passesGrammar`
// is whatever the table agreed on. If it passes, the amendment always goes
// to a vote next (both Dictators and Presidents) - the vote's +/-1
// popularity per vote happens either way; only whether the new wording
// actually takes effect depends on leader type (see castAmendmentVoteOutcome).
export async function ruleAmendment(roomCode, window, passesGrammar) {
    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        const pending = game.pendingAmendment
        if (!pending) return

        if (!passesGrammar) {
            const leader = (await tx.get(playerRef(roomCode, game.leaderUid))).data()
            tx.update(playerRef(roomCode, game.leaderUid), { psd: leader.psd - V.amendPenalty })
            tx.update(gameRef(roomCode), {
                treasury: game.treasury + V.amendPenalty,
                pendingAmendment: deleteField(),
                [`amendmentsUsedThisTerm.${window}`]: true,
                amendmentLog: [
                    ...game.amendmentLog,
                    { round: game.round, article: pending.name, leaderUid: game.leaderUid, outcome: 'reverted' },
                ],
            })
        } else {
            tx.update(gameRef(roomCode), { pendingAmendment: { ...pending, awaitingVote: true } })
        }
    })
}

// The amendment vote: everyone except the Leader votes for/against, always
// (Dictator or President) - it always moves the Leader's popularity.
// Whether the new wording actually takes effect differs: a Dictator's
// amendment stands regardless of the vote; a President's only stands if
// more voted for than against.
export async function castAmendmentVoteOutcome(roomCode, window, votesFor, votesAgainst, playerCount) {
    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        const pending = game.pendingAmendment
        if (!pending) return
        const leader = (await tx.get(playerRef(roomCode, game.leaderUid))).data()
        const newPopularity = applyAmendmentVotes(leader.popularity, votesFor, votesAgainst, playerCount)
        tx.update(playerRef(roomCode, game.leaderUid), { popularity: newPopularity })

        const stands = game.leaderType === 'Dictator' || votesFor > votesAgainst
        const nextConstitution = JSON.parse(JSON.stringify(game.constitution))
        if (stands) {
            nextConstitution[pending.chapterIndex].articles[pending.articleIndex].text = pending.newText
        }
        tx.update(gameRef(roomCode), {
            constitution: nextConstitution,
            pendingAmendment: deleteField(),
            [`amendmentsUsedThisTerm.${window}`]: true,
            amendmentLog: [
                ...game.amendmentLog,
                {
                    round: game.round,
                    article: pending.name,
                    leaderUid: game.leaderUid,
                    outcome: stands ? `stands (${game.leaderType})` : 'rejected (majority)',
                },
            ],
        })
    })
}

export async function skipAmendmentWindow(roomCode, window) {
    await updateDoc(gameRef(roomCode), { [`amendmentsUsedThisTerm.${window}`]: true })
}

export async function advancePhaseAfterInauguration(roomCode) {
    await updateDoc(gameRef(roomCode), { phase: 'levy' })
}

// ---------------------------------------------------------------
// Levy - the Leader sets it within the current band, then everyone pays
// levy + tax on their income for the term. A card's text says what a
// player collects/loses (see drawPerformanceCard below); income here is
// whatever they end up with in hand once that's been applied manually.
// ---------------------------------------------------------------
export async function setLevy(roomCode, amount) {
    const game = (await getDoc(gameRef(roomCode))).data()
    const clamped = clampLevyToBand(amount, { low: game.levy.bandLow, high: game.levy.bandHigh })
    await updateDoc(gameRef(roomCode), { 'levy.amount': clamped, phase: 'turns' })
    return clamped
}

// ---------------------------------------------------------------
// Performance cards - the actual content of a turn. A player draws a
// scenario and performs it live (on your call, per the site owner's
// choice to keep performances off-platform); everyone else votes
// good/bad; the swing from engine/popularity.js applies; a Settlement or
// Scandal card is drawn to match. What a drawn card's text actually DOES
// (transfer PSD, change popularity, hand out a role, mark a corruption
// marker, etc.) is wildly varied across the 150-card deck and often needs
// a human judgement call anyway ("the table votes on whether they
// believed you") - rather than trying to parse and auto-execute every
// card, the table applies it themselves with adjustPlayerStat below, the
// same self-reporting trust model the rest of this game already uses.
// ---------------------------------------------------------------
export async function drawPerformanceCard(roomCode, performerUid) {
    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        const { cardNumber, deckOrder, drawIndex } = drawFromDeck(game.performanceDeck, game.performanceDrawIndex, PERFORMANCE_NUMBERS)
        tx.update(gameRef(roomCode), {
            performanceDeck: deckOrder,
            performanceDrawIndex: drawIndex,
            currentPerformance: { performerUid, cardNumber, votes: {}, resolved: false },
        })
    })
}

export async function castPerformanceVote(roomCode, voterUid, vote) {
    await updateDoc(gameRef(roomCode), { [`currentPerformance.votes.${voterUid}`]: vote })
}

// Auto-resolves once every eligible voter (everyone except the performer)
// has voted - same "no button to misuse" pattern as the leader vote.
export async function resolvePerformanceVote(roomCode, playerCount) {
    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        const current = game.currentPerformance
        if (!current || current.resolved) return

        const votes = Object.values(current.votes)
        const goodVotes = votes.filter((v) => v === 'good').length
        const badVotes = votes.filter((v) => v === 'bad').length

        if (goodVotes === badVotes) {
            tx.update(gameRef(roomCode), { currentPerformance: { ...current, resolved: true, resultType: 'tie' } })
            return
        }

        const performer = (await tx.get(playerRef(roomCode, current.performerUid))).data()
        const newPopularity = applyPerformanceVote(performer.popularity, goodVotes, badVotes, playerCount)
        tx.update(playerRef(roomCode, current.performerUid), { popularity: newPopularity })

        const resultType = goodVotes > badVotes ? 'settlement' : 'scandal'
        const deckKey = resultType === 'settlement' ? 'settlementDeck' : 'scandalDeck'
        const indexKey = resultType === 'settlement' ? 'settlementDrawIndex' : 'scandalDrawIndex'
        const allNumbers = resultType === 'settlement' ? SETTLEMENT_NUMBERS : SCANDAL_NUMBERS
        const { cardNumber, deckOrder, drawIndex } = drawFromDeck(game[deckKey], game[indexKey], allNumbers)

        tx.update(gameRef(roomCode), {
            [deckKey]: deckOrder,
            [indexKey]: drawIndex,
            currentPerformance: { ...current, resolved: true, resultType, resultCardNumber: cardNumber },
        })
    })
}

export async function clearPerformance(roomCode) {
    await updateDoc(gameRef(roomCode), { currentPerformance: null })
}

// Lets the table self-apply what a drawn card's text says (see the note
// above on why this isn't automated) - field is 'psd' or 'popularity'.
// PSD has no stated floor in the rules (a card can put you in debt), but
// popularity is always clamped to [-50, 50] everywhere else it changes,
// so this clamps it too rather than using a raw, unbounded increment.
export async function adjustPlayerStat(roomCode, uid, field, delta) {
    if (field === 'psd') {
        await updateDoc(playerRef(roomCode, uid), { psd: increment(delta) })
        return
    }
    await runTransaction(db, async (tx) => {
        const player = (await tx.get(playerRef(roomCode, uid))).data()
        tx.update(playerRef(roomCode, uid), { popularity: clampPopularity(player.popularity + delta) })
    })
}

export function getCardText(resultType, cardNumber) {
    if (resultType === 'settlement') return settlementCards[cardNumber]
    if (resultType === 'scandal') return scandalCards[cardNumber]
    return undefined
}

export function getPerformanceCardText(cardNumber) {
    return performanceCards[cardNumber]
}

// Pays levy + tax and advances the turn order as one atomic, idempotent
// step. These used to be two separate calls (payLevyAndTax then
// completeTurn) - if a player's "end my turn" click fired twice (a fast
// double-click, or a click landing before the button had visually
// disabled), completeTurn ran twice and advanced currentTurnIndex by 2
// instead of 1, silently skipping the next player. Guarding on
// turnsCompletedUids already containing this uid makes a second call a
// no-op instead of a double-advance.
export async function payTaxAndCompleteTurn(roomCode, uid, incomeThisTurn) {
    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        if (game.turnsCompletedUids.includes(uid)) return // already completed - ignore a duplicate call

        const player = (await tx.get(playerRef(roomCode, uid))).data()
        const tax = Math.round((incomeThisTurn * game.rules.taxRate) / 100)
        const total = game.levy.amount + tax
        tx.update(playerRef(roomCode, uid), { psd: player.psd + incomeThisTurn - total })
        tx.update(gameRef(roomCode), {
            treasury: game.treasury + total,
            turnsCompletedUids: [...game.turnsCompletedUids, uid],
            currentTurnIndex: game.currentTurnIndex + 1,
        })
    })
}

export async function advanceToFarewell(roomCode) {
    await updateDoc(gameRef(roomCode), { phase: 'farewell' })
}

// ---------------------------------------------------------------
// Coups - LOCKED. Eligibility is decided purely by engine/coup.js, using
// game_data.js's coupCost/coupGap - never anything from `rules` or
// `constitution`, which hold the amendable state.
// ---------------------------------------------------------------
export async function attemptCoup(roomCode, challengerUid) {
    return runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        const challenger = (await tx.get(playerRef(roomCode, challengerUid))).data()
        const leader = (await tx.get(playerRef(roomCode, game.leaderUid))).data()

        const eligible = canAttemptCoup({
            challengerPsd: challenger.psd,
            challengerCoupCards: challenger.coupCards,
            challengerPopularity: challenger.popularity,
            leaderPopularity: leader.popularity,
        })
        if (!eligible) return { success: false }

        // Couped Leader scores half a round instead of a full one.
        tx.update(playerRef(roomCode, game.leaderUid), { roundsAsLeader: (leader.roundsAsLeader || 0) + 0.5 })
        tx.update(playerRef(roomCode, challengerUid), {
            psd: challenger.psd - V.coupCost,
            coupCards: challenger.coupCards - 1,
        })
        tx.update(gameRef(roomCode), {
            treasury: game.treasury + V.coupCost,
            leaderUid: challengerUid,
            leaderType: null,
            phase: 'roleDraw',
            round: game.round + 1,
            currentTurnIndex: 0,
            turnsCompletedUids: [],
            amendmentsUsedThisTerm: { inauguration: false, midterm: false, farewell: false },
            pendingAmendment: deleteField(),
        })
        // Exams are skipped after a coup, straight to the role draw - but
        // GameBoard still subscribes to this round number, so it needs a
        // document to exist (revealed: true mirrors round 1's "no exam"
        // doc from initializeActiveGame) or the UI is stuck on "Loading".
        tx.set(roundRef(roomCode, game.round + 1), {
            leaderUid: challengerUid,
            questions: [],
            answers: {},
            revealed: true,
            votes: {},
        })
        return { success: true }
    })
}

// ---------------------------------------------------------------
// Term end - award the round to the sitting Leader, shift the levy band
// off their popularity, then start the next round's exam.
// ---------------------------------------------------------------
export async function endTerm(roomCode) {
    await runTransaction(db, async (tx) => {
        const game = (await tx.get(gameRef(roomCode))).data()
        const leader = (await tx.get(playerRef(roomCode, game.leaderUid))).data()

        tx.update(playerRef(roomCode, game.leaderUid), { roundsAsLeader: (leader.roundsAsLeader || 0) + 1 })

        const nextBand = shiftLevyBand(
            { low: game.levy.bandLow, high: game.levy.bandHigh },
            leader.popularity,
            { trigger: V.levy.trigger, shift: V.levy.shift, floor: V.levy.floor }
        )
        const nextAmount = clampLevyToBand(game.levy.amount, { low: nextBand.low, high: nextBand.high })

        tx.update(gameRef(roomCode), {
            round: game.round + 1,
            phase: 'exam',
            currentTurnIndex: 0,
            turnsCompletedUids: [],
            amendmentsUsedThisTerm: { inauguration: false, midterm: false, farewell: false },
            levy: { amount: nextAmount, bandLow: nextBand.low, bandHigh: nextBand.high },
        })
        tx.set(roundRef(roomCode, game.round + 1), {
            leaderUid: game.leaderUid,
            questions: [],
            answers: {},
            revealed: false,
            votes: {},
        })
    })
}

export function leaderboard(players) {
    return [...players]
        .map((p) => ({ ...p, tiebreak: tiebreakScore(p.popularity, p.psd) }))
        .sort((a, b) => (b.roundsAsLeader || 0) - (a.roundsAsLeader || 0) || b.tiebreak - a.tiebreak)
}

export { isCancelled }
export const midTermThreshold = (playerCount) => V.midTermAfter(playerCount)
export { LEADER_TYPES }
