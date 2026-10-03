import { useState } from 'react'
import { drawLeaderRole } from '../gameEngine.js'
import { Button } from '../../components/ui/button.jsx'

const ROLE_BLURB = {
    Dictator: 'Can act without the table’s approval. Amendments always stand.',
    President: 'Needs the table’s approval to act. Amendments need a majority vote.',
    Commander: 'Can only enforce rules that already exist. Cannot amend the Constitution.',
}

const RoleDrawPanel = ({ roomCode, me, leaderUid }) => {
    const [busy, setBusy] = useState(false)
    const isNewLeader = me.uid === leaderUid

    if (!isNewLeader) {
        return <div className="surface-card p-6 mb-6 text-center text-white-600">Waiting for the new Leader to draw their role...</div>
    }

    return (
        <div className="surface-card p-6 mb-6 text-center">
            <p className="font-semibold text-white-800 mb-1">You&apos;re the new Leader</p>
            <p className="text-white-600 mb-4">Draw your Leader type: Dictator, President or Commander.</p>
            <Button
                onClick={async () => {
                    setBusy(true)
                    try {
                        await drawLeaderRole(roomCode)
                    } finally {
                        setBusy(false)
                    }
                }}
                disabled={busy}
            >
                Draw role
            </Button>
        </div>
    )
}

export { ROLE_BLURB }
export default RoleDrawPanel
