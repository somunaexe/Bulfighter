import { useState } from 'react'
import { parseHighlights } from '../parseHighlights.js'
import { proposeAmendment, ruleAmendment, castAmendmentVoteOutcome, skipAmendmentWindow } from '../gameEngine.js'
import { Button } from '../../components/ui/button.jsx'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select.jsx'

const WINDOW_LABEL = { inauguration: 'Inauguration', midterm: 'Mid-term', farewell: 'Farewell' }

const ProposeForm = ({ roomCode, game, window, isLeader }) => {
    const [chapterIndex, setChapterIndex] = useState(0)
    const [articleIndex, setArticleIndex] = useState(0)
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const chapter = game.constitution[chapterIndex]
    const { text } = chapter.articles[articleIndex]
    const segments = parseHighlights(text)
    const [replacements, setReplacements] = useState(segments.filter((s) => s.highlighted).map((s) => s.text))

    const changeArticle = (cIndex, aIndex) => {
        setChapterIndex(cIndex)
        setArticleIndex(aIndex)
        const nextSegments = parseHighlights(game.constitution[cIndex].articles[aIndex].text)
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
                <Button variant="outline" onClick={() => skipAmendmentWindow(roomCode, window)}>
                    Continue
                </Button>
            </div>
        )
    }

    let segmentIndex = -1
    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">{WINDOW_LABEL[window]} amendment</p>
            <p className="text-white-600 text-sm mb-4">Pick an article, then rewrite only its highlighted words - one word for one word.</p>
            <Select
                value={`${chapterIndex}-${articleIndex}`}
                onValueChange={(value) => {
                    const [c, a] = value.split('-').map(Number)
                    changeArticle(c, a)
                }}
            >
                <SelectTrigger className="w-full mb-4"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {game.constitution.map((ch, cIndex) =>
                        ch.articles.map((article, aIndex) => (
                            <SelectItem key={`${cIndex}-${aIndex}`} value={`${cIndex}-${aIndex}`}>
                                {article.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
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
            <Button
                onClick={async () => {
                    setBusy(true)
                    setError('')
                    const result = await proposeAmendment(roomCode, chapterIndex, articleIndex, replacements)
                    if (!result.valid) setError(result.reason)
                    setBusy(false)
                }}
                disabled={busy}
            >
                Announce amendment
            </Button>
            <Button variant="outline" onClick={() => skipAmendmentWindow(roomCode, window)} className="ml-3">
                Skip this window
            </Button>
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
                <Button onClick={() => ruleAmendment(roomCode, window, true)}>
                    Passes - it&apos;s valid English
                </Button>
                <Button variant="outline" onClick={() => ruleAmendment(roomCode, window, false)}>
                    Fails - revert it
                </Button>
            </div>
        </div>
    )
}

const AmendmentVote = ({ roomCode, game, window, playerCount }) => {
    const [forVotes, setForVotes] = useState(0)
    const [againstVotes, setAgainstVotes] = useState(0)
    const isDictator = game.leaderType === 'Dictator'
    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">Amendment vote</p>
            <p className="text-white-600 text-sm mb-4">
                Everyone except the Leader votes, no discussion - each vote moves their popularity by the base swing
                for {playerCount} players.{' '}
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
            <Button onClick={() => castAmendmentVoteOutcome(roomCode, window, forVotes, againstVotes, playerCount)}>
                Submit vote result
            </Button>
        </div>
    )
}

const AmendmentPanel = ({ roomCode, game, me, window, players }) => {
    const isLeader = me.uid === game.leaderUid
    const playerCount = players.filter((p) => !p.eliminated).length

    if (game.pendingAmendment?.awaitingVote) {
        return <AmendmentVote roomCode={roomCode} game={game} window={window} playerCount={playerCount} />
    }
    if (game.pendingAmendment) {
        return <PendingRuling roomCode={roomCode} game={game} window={window} />
    }
    return <ProposeForm roomCode={roomCode} game={game} window={window} isLeader={isLeader} />
}

export default AmendmentPanel
