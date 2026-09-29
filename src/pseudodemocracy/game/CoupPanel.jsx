import { useState } from 'react'
import { attemptCoup } from '../gameEngine.js'
import { canAttemptCoup, COUP_COST, COUP_GAP } from '../engine/coup.js'

// Coups can happen "at any point during any term" per the locked coup
// rule, so this panel shows whenever there's a sitting Leader who isn't
// the current player - regardless of what phase the round is in.
const CoupPanel = ({ roomCode, me, leader }) => {
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')

    if (!leader || !me || me.uid === leader.uid) return null

    const eligible = canAttemptCoup({
        challengerPsd: me.psd,
        challengerCoupCards: me.coupCards || 0,
        challengerPopularity: me.popularity || 0,
        leaderPopularity: leader.popularity || 0,
    })

    const handleCoup = async () => {
        setBusy(true)
        try {
            const result = await attemptCoup(roomCode, me.uid)
            setMessage(result.success ? 'Coup successful - you are the new Leader!' : 'Coup failed.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="surface-card p-4 mb-6 border border-dashed border-red-400">
            <p className="font-semibold text-white-800">Attempt a coup</p>
            <p className="text-white-600 text-sm mt-1">
                Costs {COUP_COST} PSD + 1 coup card, and needs {COUP_GAP}+ more popularity than the Leader.
                You have {me.psd} PSD, {me.coupCards || 0} coup card(s), {me.popularity || 0} popularity vs their{' '}
                {leader.popularity || 0}.
            </p>
            <button
                onClick={handleCoup}
                disabled={!eligible || busy}
                className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50 mt-3"
            >
                {eligible ? 'Attempt coup' : 'Not eligible yet'}
            </button>
            {message && <p className="text-white-600 mt-2">{message}</p>}
        </div>
    )
}

export default CoupPanel
