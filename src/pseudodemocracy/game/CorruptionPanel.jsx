import { useState } from 'react'
import { payOffCorruption } from '../gameEngine.js'
import { V } from '../psdData.js'

// Shows only to a frozen player themselves - the two ways out (pay, or
// wait V.corruption.wait terms) are both self-serve: paying is a button
// here, waiting just happens automatically at each term's end
// (endTerm/attemptCoup check it for every player).
const CorruptionPanel = ({ roomCode, me }) => {
    const [busy, setBusy] = useState(false)
    if (!me.frozen) return null

    return (
        <div className="surface-card p-4 mb-6 border border-dashed border-red-400">
            <p className="font-semibold text-white-800">You&apos;re frozen (corruption)</p>
            <p className="text-white-600 text-sm mt-1">
                Your roles are frozen and you can&apos;t pick Settlement cards. Pay {V.corruption.fine} PSD to clear
                it and restore everything, or wait it out ({V.corruption.wait} terms) - the freeze lifts on its own
                but the popularity you lost stays and your roles are gone for good.
            </p>
            <button
                onClick={async () => {
                    setBusy(true)
                    try {
                        await payOffCorruption(roomCode, me.uid)
                    } finally {
                        setBusy(false)
                    }
                }}
                disabled={busy || me.psd < V.corruption.fine}
                className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50 mt-3"
            >
                Pay {V.corruption.fine} PSD to clear it
            </button>
        </div>
    )
}

export default CorruptionPanel
