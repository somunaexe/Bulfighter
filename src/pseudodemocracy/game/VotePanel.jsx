import { useState } from 'react'
import { castLeaderVote, tallyLeaderVoteAndAdvance } from '../gameEngine.js'

// Eligible = passed the exam (or round 1 / post-coup, where everyone is
// eligible since there was no exam to fail).
const VotePanel = ({ roomCode, round, roundState, me, players }) => {
    const [busy, setBusy] = useState(false)
    const eligible = players.filter((p) => !p.eliminated && p.examPassedThisRound !== false)
    const myVote = roundState.votes?.[me.uid]
    const iAmEligible = eligible.some((p) => p.uid === me.uid)

    const vote = async (candidateUid) => {
        await castLeaderVote(roomCode, round, me.uid, candidateUid)
    }

    const votesIn = Object.keys(roundState.votes || {}).length

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">Vote for the next Leader</p>
            <p className="text-white-600 text-sm mb-4">
                {votesIn} / {eligible.length} eligible votes cast.
            </p>
            {!iAmEligible && <p className="text-white-600 mb-4">You didn&apos;t pass the exam, so you can&apos;t vote or run this round.</p>}
            {iAmEligible && (
                <div className="space-y-2 mb-4">
                    {eligible.map((p) => (
                        <button
                            key={p.uid}
                            onClick={() => vote(p.uid)}
                            className={`block w-full text-left px-4 py-2 rounded-md border ${
                                myVote === p.uid ? 'border-[rgb(var(--theme-accent))]' : 'border-black-300'
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            )}
            <button
                onClick={async () => {
                    setBusy(true)
                    try {
                        await tallyLeaderVoteAndAdvance(roomCode, round)
                    } finally {
                        setBusy(false)
                    }
                }}
                disabled={votesIn === 0 || busy}
                className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
            >
                Tally votes
            </button>
        </div>
    )
}

export default VotePanel
