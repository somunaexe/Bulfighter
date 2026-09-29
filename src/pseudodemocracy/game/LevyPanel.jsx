import { useState } from 'react'
import { setLevy } from '../gameEngine.js'

const LevyPanel = ({ roomCode, game, me }) => {
    const [amount, setAmount] = useState(game.levy.amount)
    const [busy, setBusy] = useState(false)
    const isLeader = me.uid === game.leaderUid

    if (!isLeader) {
        return (
            <div className="surface-card p-6 mb-6 text-center text-white-600">
                Waiting for the Leader to set this term&apos;s levy ({game.levy.bandLow}-{game.levy.bandHigh} PSD band)...
            </div>
        )
    }

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">Set the levy</p>
            <p className="text-white-600 text-sm mb-4">
                Every player pays this flat amount, plus {game.rules.taxRate}% tax on their income, every round.
                Must stay within the current band: {game.levy.bandLow}-{game.levy.bandHigh} PSD.
            </p>
            <input
                type="number"
                min={game.levy.bandLow}
                max={game.levy.bandHigh}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-32 px-3 py-2 rounded-md bg-transparent border border-black-300 mb-4"
            />
            <div>
                <button
                    onClick={async () => {
                        setBusy(true)
                        try {
                            await setLevy(roomCode, amount)
                        } finally {
                            setBusy(false)
                        }
                    }}
                    disabled={busy}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                >
                    Set levy and begin turns
                </button>
            </div>
        </div>
    )
}

export default LevyPanel
