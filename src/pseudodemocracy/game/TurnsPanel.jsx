import { useState } from 'react'
import { payLevyAndTax, completeTurn, advanceToFarewell } from '../gameEngine.js'

// A "turn" here is a placeholder for Phase 2b's performance-card deck -
// for now a player just declares their income for the term (from whatever
// happens live on your call) and pays levy + tax on it. Once cards exist,
// this becomes automatic instead of self-reported.
const TurnsPanel = ({ roomCode, game, me, players }) => {
    const [income, setIncome] = useState(0)
    const [busy, setBusy] = useState(false)
    const activeOrder = game.turnOrder.filter((uid) => !players.find((p) => p.uid === uid)?.eliminated)
    const currentUid = activeOrder[game.currentTurnIndex % activeOrder.length]
    const currentPlayer = players.find((p) => p.uid === currentUid)
    const allDone = game.turnsCompletedUids.length >= activeOrder.length
    const isMyTurn = me.uid === currentUid

    if (allDone) {
        return (
            <div className="surface-card p-6 mb-6 text-center">
                <p className="text-white-600 mb-3">Everyone has taken their turn this term.</p>
                <button onClick={() => advanceToFarewell(roomCode)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                    Continue to Farewell amendment
                </button>
            </div>
        )
    }

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">
                Turn {game.turnsCompletedUids.length + 1} / {activeOrder.length}: {currentPlayer?.name}&apos;s turn
            </p>
            <p className="text-white-600 text-sm mb-4">
                Play out your turn on your call (a performance card, a union action, seeing the Doctor...), then
                declare what you earned this term so the levy ({game.levy.amount} PSD) and {game.rules.taxRate}%
                tax come out of it.
            </p>
            {isMyTurn ? (
                <>
                    <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        placeholder="Income this term"
                        className="w-40 px-3 py-2 rounded-md bg-transparent border border-black-300 mb-4"
                    />
                    <div>
                        <button
                            onClick={async () => {
                                setBusy(true)
                                try {
                                    await payLevyAndTax(roomCode, me.uid, income)
                                    await completeTurn(roomCode, me.uid)
                                } finally {
                                    setBusy(false)
                                }
                            }}
                            disabled={busy}
                            className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                        >
                            Pay and end my turn
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-white-600">Waiting for {currentPlayer?.name} to finish their turn...</p>
            )}
        </div>
    )
}

export default TurnsPanel
