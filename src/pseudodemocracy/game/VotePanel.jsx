import { useEffect, useRef } from 'react'
import { castLeaderVote, tallyLeaderVoteAndAdvance } from '../gameEngine.js'

// Eligible = passed the exam (or round 1 / post-coup, where everyone is
// eligible since there was no exam to fail).
const VotePanel = ({ roomCode, round, roundState, me, players }) => {
    const eligible = players.filter((p) => !p.eliminated && p.examPassedThisRound !== false)
    const myVote = roundState.votes?.[me.uid]
    const iAmEligible = eligible.some((p) => p.uid === me.uid)
    const votesIn = Object.keys(roundState.votes || {}).length

    const vote = async (candidateUid) => {
        await castLeaderVote(roomCode, round, me.uid, candidateUid)
    }

    // Advances automatically once everyone eligible has voted, rather than
    // trusting any one player to click a shared "tally" button - that was
    // an easy way to lock in a result before everyone had actually voted.
    // Every client that sees the same fully-voted state will call this,
    // but tallyLeaderVoteAndAdvance is a no-op once the phase has already
    // moved on, so the redundant calls are harmless.
    const tallied = useRef(false)
    useEffect(() => {
        if (eligible.length > 0 && votesIn >= eligible.length && !tallied.current) {
            tallied.current = true
            tallyLeaderVoteAndAdvance(roomCode, round)
        }
    }, [votesIn, eligible.length, roomCode, round])

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">Vote for the next Leader</p>
            <p className="text-white-600 text-sm mb-4">
                {votesIn} / {eligible.length} eligible votes cast - moves on automatically once everyone has voted.
            </p>
            {!iAmEligible && <p className="text-white-600 mb-4">You didn&apos;t pass the exam, so you can&apos;t vote or run this round.</p>}
            {iAmEligible && (
                <div className="space-y-2">
                    {eligible.map((p) => (
                        <button
                            key={p.uid}
                            onClick={() => vote(p.uid)}
                            disabled={Boolean(myVote)}
                            className={`block w-full text-left px-4 py-2 rounded-md border disabled:opacity-50 ${
                                myVote === p.uid ? 'border-[rgb(var(--theme-accent))]' : 'border-black-300'
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VotePanel
