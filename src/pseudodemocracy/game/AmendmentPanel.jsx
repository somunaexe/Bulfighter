import { useState } from 'react'
import { parseHighlights } from '../parseHighlights.js'
import { proposeAmendment, ruleAmendment, castAmendmentVoteOutcome, skipAmendmentWindow } from '../gameEngine.js'

const WINDOW_LABEL = { inauguration: 'Inauguration', midterm: 'Mid-term', farewell: 'Farewell' }

const ProposeForm = ({ roomCode, game, window, isLeader }) => {
    const [chapterIndex, setChapterIndex] = useState(0)
    const [articleIndex, setArticleIndex] = useState(0)
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const chapter = game.constitution[chapterIndex]
    const [, text] = chapter.articles[articleIndex]
    const segments = parseHighlights(text)
    const [replacements, setReplacements] = useState(segments.filter((s) => s.highlighted).map((s) => s.text))

    const changeArticle = (cIndex, aIndex) => {
        setChapterIndex(cIndex)
        setArticleIndex(aIndex)
        const nextSegments = parseHighlights(game.constitution[cIndex].articles[aIndex][1])
        setReplacements(nextSegments.filter((s) => s.highlighted).map((s) => s.text))
        setError('')
    }

    if (!isLeader) {
        return <div className="surface-card p-6 mb-6 text-center text-white-600">Waiting for the Leader ({WINDOW_LABEL[window]})...</div>
    }
    if (game.leaderType === 'Commander') {
        return (
            <div className="surface-card p-6 mb-6 text-center">
                <p className="text-white-600 mb-3">Commanders can&apos;t amend the Constitution.</p>
                <button onClick={() => skipAmendmentWindow(roomCode, window)} className="field-btn">
                    Continue
                </button>
            </div>
        )
    }

    let segmentIndex = -1
    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">{WINDOW_LABEL[window]} amendment</p>
            <p className="text-white-600 text-sm mb-4">Pick an article, then rewrite only its highlighted words - one word for one word.</p>
            <select
                value={`${chapterIndex}-${articleIndex}`}
                onChange={(e) => {
                    const [c, a] = e.target.value.split('-').map(Number)
                    changeArticle(c, a)
                }}
                className="w-full mb-4 px-3 py-2 rounded-md bg-transparent border border-black-300"
            >
                {game.constitution.map((ch, cIndex) =>
                    ch.articles.map(([n], aIndex) => (
                        <option key={`${cIndex}-${aIndex}`} value={`${cIndex}-${aIndex}`}>
                            {n}
                        </option>
                    ))
                )}
            </select>
            <p className="text-white-800 mb-4 leading-relaxed">
                {segments.map((s, i) => {
                    if (!s.highlighted) return <span key={i}>{s.text}</span>
                    segmentIndex++
                    const ri = segmentIndex
                    return (
                        <input
                            key={i}
                            value={replacements[ri] ?? ''}
                            onChange={(e) => setReplacements((r) => r.map((v, idx) => (idx === ri ? e.target.value : v)))}
                            className="inline-block mx-1 px-2 py-1 rounded border border-[rgb(var(--theme-accent))] bg-transparent text-[rgb(var(--theme-accent))] font-semibold"
                            style={{ width: `${Math.max(4, (replacements[ri] || '').length)}ch` }}
                        />
                    )
                })}
            </p>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <button
                onClick={async () => {
                    setBusy(true)
                    setError('')
                    const result = await proposeAmendment(roomCode, chapterIndex, articleIndex, replacements)
                    if (!result.valid) setError(result.reason)
                    setBusy(false)
                }}
                disabled={busy}
                className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
            >
                Announce amendment
            </button>
            <button onClick={() => skipAmendmentWindow(roomCode, window)} className="field-btn ml-3">
                Skip this window
            </button>
        </div>
    )
}

const PendingRuling = ({ roomCode, game, window }) => {
    const { pendingAmendment } = game
    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-2">Amendment announced: {pendingAmendment.name}</p>
            <p className="text-white-600 mb-1"><s>{pendingAmendment.oldText}</s></p>
            <p className="text-white-800 mb-4">{pendingAmendment.newText}</p>
            <p className="text-white-600 text-sm mb-3">
                The table checks this by eye: did only the highlighted words change, and does it still read as
                correct English? This is a judgement call, not a vote.
            </p>
            <div className="flex gap-3">
                <button onClick={() => ruleAmendment(roomCode, window, true)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                    Passes - it&apos;s valid English
                </button>
                <button onClick={() => ruleAmendment(roomCode, window, false)} className="field-btn">
                    Fails - revert it
                </button>
            </div>
        </div>
    )
}

const AmendmentVote = ({ roomCode, game, window }) => {
    const [forVotes, setForVotes] = useState(0)
    const [againstVotes, setAgainstVotes] = useState(0)
    const isDictator = game.leaderType === 'Dictator'
    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">Amendment vote</p>
            <p className="text-white-600 text-sm mb-4">
                Everyone except the Leader votes, no discussion - it always moves their popularity.{' '}
                {isDictator
                    ? 'As Dictator, the wording stands either way.'
                    : 'As President, the wording only stands if more voted for than against.'}{' '}
                Enter the count.
            </p>
            <div className="flex gap-4 mb-4">
                <label className="text-white-600">
                    For: <input type="number" min="0" value={forVotes} onChange={(e) => setForVotes(Number(e.target.value))} className="w-16 ml-2 px-2 py-1 rounded border border-black-300 bg-transparent" />
                </label>
                <label className="text-white-600">
                    Against: <input type="number" min="0" value={againstVotes} onChange={(e) => setAgainstVotes(Number(e.target.value))} className="w-16 ml-2 px-2 py-1 rounded border border-black-300 bg-transparent" />
                </label>
            </div>
            <button
                onClick={() => castAmendmentVoteOutcome(roomCode, window, forVotes, againstVotes)}
                className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors"
            >
                Submit vote result
            </button>
        </div>
    )
}

const AmendmentPanel = ({ roomCode, game, me, window }) => {
    const isLeader = me.uid === game.leaderUid

    if (game.pendingAmendment?.awaitingVote) {
        return <AmendmentVote roomCode={roomCode} game={game} window={window} />
    }
    if (game.pendingAmendment) {
        return <PendingRuling roomCode={roomCode} game={game} window={window} />
    }
    return <ProposeForm roomCode={roomCode} game={game} window={window} isLeader={isLeader} />
}

export default AmendmentPanel
