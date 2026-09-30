import { useState } from 'react'
import { endTerm } from '../gameEngine.js'

const TermEndPanel = ({ roomCode, game, players }) => {
    const [busy, setBusy] = useState(false)
    const leader = players.find((p) => p.uid === game.leaderUid)

    return (
        <div className="surface-card p-6 mb-6 text-center">
            <p className="font-semibold text-white-800 mb-1">Term {game.round} ends</p>
            <p className="text-white-600 mb-4">
                {leader?.name} served a full round as Leader ({leader?.popularity ?? 0} popularity at term end - the
                levy band will shift based on that).
            </p>
            <button
                onClick={async () => {
                    setBusy(true)
                    try {
                        await endTerm(roomCode, players)
                    } finally {
                        setBusy(false)
                    }
                }}
                disabled={busy}
                className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
            >
                Start next round
            </button>
        </div>
    )
}

export default TermEndPanel
