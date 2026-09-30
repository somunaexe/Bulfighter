// A fake player for stress-testing Pseudodemocracy without a browser tab -
// two birds, one stone: it fills out a room so you don't need 3+ heavy
// Chrome tabs to test with, AND it behaves like a chaos monkey, trying
// every action available to it (including the ones a cooperative bot
// would skip - amendments, coups, corruption markers, deliberately
// invalid inputs) specifically to shake out crashes.
//
// It reuses the site's real gameRoom.js/gameEngine.js unchanged - a bot
// is not a reimplementation of the rules, it calls the exact same
// functions a real browser client would, so results reflect real bugs,
// not bugs in a separate test harness.
//
// Usage: node bot.js <roomCode> <botName>
// Run several (see run-bots.js) to fill a room. Watch the terminal:
// every action prints what it tried; anything that throws prints as
// "CRASH" with the full error and the bot keeps running past it, so one
// bad path doesn't stop the rest of the stress test.
import { joinRoom, subscribeToRoom, subscribeToPlayers } from '../../src/pseudodemocracy/gameRoom.js'
import {
    subscribeToRound,
    writeExam,
    submitExamAnswers,
    revealExam,
    castLeaderVote,
    tallyLeaderVoteAndAdvance,
    drawLeaderRole,
    proposeAmendment,
    ruleAmendment,
    castAmendmentVoteOutcome,
    skipAmendmentWindow,
    advancePhaseAfterInauguration,
    setLevy,
    drawPerformanceCard,
    castPerformanceVote,
    resolvePerformanceVote,
    clearPerformance,
    payTaxAndCompleteTurn,
    advanceToFarewell,
    attemptCoup,
    addCorruptionMarker,
    payOffCorruption,
    adjustPlayerStat,
    endTerm,
    midTermThreshold,
} from '../../src/pseudodemocracy/gameEngine.js'
import { parseHighlights } from '../../src/pseudodemocracy/parseHighlights.js'
import { V } from '../../src/pseudodemocracy/psdData.js'
import { auth } from '../../src/pseudodemocracy/firebase.js'

const [, , roomCode, botName] = process.argv
if (!roomCode || !botName) {
    console.error('Usage: node bot.js <roomCode> <botName>')
    process.exit(1)
}

const log = (...args) => console.log(`[${botName}]`, ...args)
const rand = (n) => Math.floor(Math.random() * n)
const pick = (arr) => arr[rand(arr.length)]

async function run(label, fn) {
    log('->', label)
    try {
        const result = await fn()
        if (result !== undefined) log('   ok:', JSON.stringify(result))
    } catch (err) {
        console.error(`[${botName}] *** CRASH in "${label}" ***`, err)
    }
}

process.on('unhandledRejection', (err) => {
    console.error(`[${botName}] *** UNHANDLED REJECTION ***`, err)
})
process.on('uncaughtException', (err) => {
    console.error(`[${botName}] *** UNCAUGHT EXCEPTION ***`, err)
})

let players = []
let game = null
let round = null
let myUid = null
const acted = new Set() // dedupe for the baseline "keep it moving" actions only
const once = (key, fn) => {
    if (acted.has(key)) return
    acted.add(key)
    setTimeout(() => run(key, fn), 300 + rand(700))
}

async function main() {
    await joinRoom(roomCode, botName)
    myUid = auth.currentUser.uid
    log('joined as', myUid)

    subscribeToRoom(roomCode, (g) => {
        game = g
        progressionTick()
    })
    subscribeToPlayers(roomCode, (p) => {
        players = p
    })

    let subscribedRound = null
    setInterval(() => {
        if (game?.round && game.round !== subscribedRound) {
            subscribedRound = game.round
            subscribeToRound(roomCode, game.round, (r) => {
                round = r
                progressionTick()
            })
        }
    }, 200)

    // The chaos loop runs independently of state changes, on its own
    // clock, so bots keep hammering the game even while "waiting" -
    // that's when races are most likely to surface.
    setInterval(chaosTick, 1200 + rand(1200))
}

// ---------------------------------------------------------------
// Baseline progression - the boring stuff a real player would do without
// thinking about it. Needed so the game actually reaches the phases
// where the interesting chaos actions apply (amendments, turns, coups
// all require the round skeleton to be running).
// ---------------------------------------------------------------
function progressionTick() {
    if (!game || !players.length || game.status !== 'active') return
    const me = players.find((p) => p.uid === myUid)
    if (!me) return
    const activePlayers = players.filter((p) => !p.eliminated)
    const isLeader = game.leaderUid === myUid

    if (game.phase === 'exam' && round) {
        if (isLeader && round.questions.length === 0) {
            once(`exam-write-${game.round}`, () => {
                const questions = Array.from({ length: V.examQuestions }, (_, i) => ({
                    text: `Bot question ${i + 1}`,
                    options: ['Correct', 'Wrong'],
                }))
                return writeExam(roomCode, game.round, myUid, questions, questions.map(() => 0))
            })
        } else if (!isLeader && round.questions.length > 0 && !round.answers?.[myUid]) {
            once(`exam-answer-${game.round}`, () =>
                submitExamAnswers(roomCode, game.round, myUid, round.questions.map(() => 0))
            )
        } else if (isLeader && round.questions.length > 0 && !round.revealed) {
            const answered = activePlayers.filter((p) => p.uid !== myUid).every((p) => round.answers?.[p.uid])
            if (answered) once(`exam-reveal-${game.round}`, () => revealExam(roomCode, game.round, players))
        }
    }

    if (game.phase === 'vote' && round) {
        const eligible = activePlayers.filter((p) => p.examPassedThisRound !== false)
        if (eligible.some((p) => p.uid === myUid) && !round.votes?.[myUid]) {
            once(`vote-${game.round}`, () => castLeaderVote(roomCode, game.round, myUid, pick(eligible).uid))
        }
        const votesIn = Object.keys(round.votes || {}).length
        if (votesIn >= eligible.length && eligible.length > 0) {
            once(`tally-${game.round}`, () => tallyLeaderVoteAndAdvance(roomCode, game.round))
        }
    }

    if (game.phase === 'roleDraw' && isLeader) {
        once(`roleDraw-${game.round}`, () => drawLeaderRole(roomCode))
    }

    if (game.phase === 'levy' && isLeader) {
        once(`levy-${game.round}`, () => setLevy(roomCode, game.levy.amount))
    }

    if (game.phase === 'turns') {
        const activeOrder = game.turnOrder.filter((uid) => !players.find((p) => p.uid === uid)?.eliminated)
        const currentUid = activeOrder[game.currentTurnIndex % activeOrder.length]
        const isMyTurn = currentUid === myUid

        if (game.currentPerformance) {
            const current = game.currentPerformance
            if (!current.resolved && current.performerUid !== myUid && !current.votes?.[myUid]) {
                once(`perfvote-${game.round}-${game.currentTurnIndex}`, () =>
                    castPerformanceVote(roomCode, myUid, Math.random() < 0.7 ? 'good' : 'bad')
                )
            }
            if (!current.resolved) {
                const eligibleVoters = activeOrder.filter((uid) => uid !== current.performerUid)
                const votesIn = Object.keys(current.votes || {}).length
                if (votesIn >= eligibleVoters.length && eligibleVoters.length > 0) {
                    once(`perfresolve-${game.round}-${game.currentTurnIndex}`, () =>
                        resolvePerformanceVote(roomCode, activePlayers.length)
                    )
                }
            }
            if (current.resolved && current.performerUid === myUid) {
                once(`perfclear-${game.round}-${game.currentTurnIndex}`, () => clearPerformance(roomCode))
            }
        } else if (isMyTurn) {
            once(`draw-${game.round}-${game.currentTurnIndex}`, () => drawPerformanceCard(roomCode, myUid))
            once(`endturn-${game.round}-${game.currentTurnIndex}`, () => payTaxAndCompleteTurn(roomCode, myUid, rand(100)))
        }

        const threshold = midTermThreshold(activePlayers.length)
        if (
            isLeader &&
            game.turnsCompletedUids.length >= threshold &&
            !game.amendmentsUsedThisTerm.midterm &&
            !game.pendingAmendment
        ) {
            once(`skip-midterm-${game.round}`, () => skipAmendmentWindow(roomCode, 'midterm'))
        }
        if (game.turnsCompletedUids.length >= activeOrder.length) {
            once(`advance-farewell-${game.round}`, () => advanceToFarewell(roomCode))
        }
    }

    // Amendment windows: fall back to a skip after a few seconds so the
    // game doesn't stall forever if no bot's chaos tick proposes one.
    for (const window of ['inauguration', 'farewell']) {
        if (game.phase === window && isLeader && !game.amendmentsUsedThisTerm[window] && !game.pendingAmendment) {
            setTimeout(() => {
                if (game.phase === window && !game.amendmentsUsedThisTerm[window] && !game.pendingAmendment) {
                    run(`fallback-skip-${window}-${game.round}`, () => skipAmendmentWindow(roomCode, window))
                }
            }, 4000)
        }
    }
    if (game.phase === 'inauguration' && game.amendmentsUsedThisTerm.inauguration && !game.pendingAmendment) {
        once(`continue-inauguration-${game.round}`, () => advancePhaseAfterInauguration(roomCode))
    }
    if (game.phase === 'farewell' && game.amendmentsUsedThisTerm.farewell && !game.pendingAmendment) {
        once(`endterm-${game.round}`, () => endTerm(roomCode, players))
    }
}

// ---------------------------------------------------------------
// Chaos actions - the interesting stuff. Each tick, gather whatever's
// currently applicable and fire one at random, including deliberately
// malformed inputs to test that validation rejects them cleanly instead
// of corrupting state or throwing.
// ---------------------------------------------------------------
function chaosTick() {
    if (!game || !players.length || game.status !== 'active') return
    const me = players.find((p) => p.uid === myUid)
    if (!me) return
    const others = players.filter((p) => p.uid !== myUid)
    const isLeader = game.leaderUid === myUid
    const actions = []

    // Coups: try even when we don't look eligible, to test the guard.
    actions.push(() => run('attemptCoup (maybe ineligible)', () => attemptCoup(roomCode, myUid, players)))

    // Corruption markers on a random player, including self.
    actions.push(() => {
        const target = pick(players)
        return run(`addCorruptionMarker -> ${target.name}`, () => addCorruptionMarker(roomCode, target.uid))
    })
    if (me.frozen) {
        actions.push(() => run('payOffCorruption (self)', () => payOffCorruption(roomCode, myUid)))
    }

    // Manual stat adjustment with a mix of ordinary and extreme deltas.
    actions.push(() => {
        const target = pick(players)
        const field = pick(['psd', 'popularity'])
        const delta = pick([1, -1, 10, -10, 100, -100, 1000, -1000])
        return run(`adjustPlayerStat -> ${target.name} ${field} ${delta}`, () => adjustPlayerStat(roomCode, target.uid, field, delta))
    })

    // Amendments: only while a window's open and nothing's pending, and
    // only the sitting Leader can propose (matches the real UI gate) -
    // but try it whether or not we're actually a Dictator/President, to
    // exercise the Commander-rejection and structural-validation paths.
    if (['inauguration', 'midterm', 'farewell'].includes(game.phase) || game.phase === 'turns') {
        if (isLeader && !game.pendingAmendment) {
            actions.push(() => {
                const chapterIndex = rand(game.constitution.length)
                const chapter = game.constitution[chapterIndex]
                const articleIndex = rand(chapter.articles.length)
                const { text } = chapter.articles[articleIndex]
                const segments = parseHighlights(text).filter((s) => s.highlighted)
                const validReplacements = segments.map((s) => s.text) // no-op but structurally valid
                const window = game.phase === 'turns' ? 'midterm' : game.phase
                if (Math.random() < 0.5) {
                    return run(`proposeAmendment (valid, ${chapter.chapter} #${articleIndex})`, () =>
                        proposeAmendment(roomCode, chapterIndex, articleIndex, validReplacements)
                    )
                }
                // Deliberately wrong replacement count - should be rejected, not crash.
                return run(`proposeAmendment (deliberately INVALID count)`, () =>
                    proposeAmendment(roomCode, chapterIndex, articleIndex, validReplacements.slice(1))
                )
            })
        }
        if (game.pendingAmendment && !game.pendingAmendment.awaitingVote) {
            const window = game.phase === 'turns' ? 'midterm' : game.phase
            actions.push(() => run(`ruleAmendment (${Math.random() < 0.5 ? 'pass' : 'fail'})`, () => ruleAmendment(roomCode, window, Math.random() < 0.5)))
        }
        if (game.pendingAmendment?.awaitingVote) {
            const window = game.phase === 'turns' ? 'midterm' : game.phase
            actions.push(() =>
                run('castAmendmentVoteOutcome', () =>
                    castAmendmentVoteOutcome(roomCode, window, rand(5), rand(5), players.filter((p) => !p.eliminated).length)
                )
            )
        }
    }

    if (actions.length === 0) return
    pick(actions)()
}

main().catch((err) => {
    console.error(`[${botName}] fatal on startup:`, err)
    process.exit(1)
})
