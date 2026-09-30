import { useState } from 'react'
import { makeWill, payWillUpkeep, acceptInheritance, rejectInheritance } from '../gameEngine.js'

const selectClass = 'px-2 py-1 rounded border border-black-300 bg-transparent'

const MakeWill = ({ roomCode, me, players }) => {
    const lawyers = players.filter((p) => p.roles?.includes('Lawyer') && p.uid !== me.uid)
    const others = players.filter((p) => !p.eliminated)
    const [lawyerUid, setLawyerUid] = useState(lawyers[0]?.uid)
    const [psdHeirUid, setPsdHeirUid] = useState(others[0]?.uid)
    const [roleHeirUid, setRoleHeirUid] = useState(others[0]?.uid)
    const [error, setError] = useState('')

    if (lawyers.length === 0) {
        return <div className="surface-card p-4 mb-6 text-white-600">No Lawyer at the table yet to sign a will.</div>
    }

    return (
        <div className="surface-card p-4 mb-6">
            <p className="font-semibold text-white-800">Make a will</p>
            <p className="text-white-600 text-sm mt-1">You can name the same heir or different heirs for your PSD and your roles.</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-white-600 text-sm">Lawyer:</span>
                <select value={lawyerUid} onChange={(e) => setLawyerUid(e.target.value)} className={selectClass}>
                    {lawyers.map((p) => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
                <span className="text-white-600 text-sm">PSD heir:</span>
                <select value={psdHeirUid} onChange={(e) => setPsdHeirUid(e.target.value)} className={selectClass}>
                    {others.map((p) => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
                <span className="text-white-600 text-sm">Role heir:</span>
                <select value={roleHeirUid} onChange={(e) => setRoleHeirUid(e.target.value)} className={selectClass}>
                    {others.map((p) => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
                <button
                    onClick={async () => {
                        setError('')
                        try {
                            await makeWill(roomCode, me.uid, lawyerUid, psdHeirUid, roleHeirUid)
                        } catch (err) {
                            setError(err.message)
                        }
                    }}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors"
                >
                    Sign will
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}

const MyWill = ({ roomCode, me, players }) => {
    const [amount, setAmount] = useState(0)
    const lawyer = players.find((p) => p.uid === me.will.lawyerUid)
    const psdHeir = players.find((p) => p.uid === me.will.psdHeirUid)
    const roleHeir = players.find((p) => p.uid === me.will.roleHeirUid)

    return (
        <div className="surface-card p-4 mb-6">
            <p className="font-semibold text-white-800">
                Your will {me.willOnHold && <span className="text-red-500">(ON HOLD)</span>}
            </p>
            <p className="text-white-600 text-sm mt-1">
                Lawyer: {lawyer?.name} &middot; PSD heir: {psdHeir?.name} &middot; Role heir: {roleHeir?.name}
            </p>
            {me.willOnHold && <p className="text-white-600 text-sm mt-1">Die while on hold and it doesn&apos;t count. Catch up any time.</p>}
            <div className="flex items-center gap-2 mt-3">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Upkeep (PSD)"
                    className="w-32 px-2 py-1 rounded border border-black-300 bg-transparent"
                />
                <button onClick={() => payWillUpkeep(roomCode, me.uid, amount)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                    Pay upkeep
                </button>
            </div>
        </div>
    )
}

const InheritancePanel = ({ roomCode, game, me, players }) => {
    const pending = game.pendingInheritance
    const deceased = players.find((p) => p.uid === pending.deceasedUid)
    const isPsdHeir = me.uid === pending.psdHeirUid && !pending.psdDecision
    const isRoleHeir = me.uid === pending.roleHeirUid && !pending.roleDecision
    if (!isPsdHeir && !isRoleHeir) return null

    return (
        <div className="surface-card p-4 mb-6 border border-dashed border-[rgb(var(--theme-accent))]">
            <p className="font-semibold text-white-800">{deceased?.name}&apos;s will names you as heir</p>
            <p className="text-white-600 text-sm mt-1">Accepting makes you a Nepo Baby (-30/-20/-10 popularity over the next 3 rounds).</p>
            <div className="flex flex-wrap gap-3 mt-3">
                {isPsdHeir && (
                    <>
                        <button onClick={() => acceptInheritance(roomCode, me.uid, 'psd')} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                            Accept {pending.psdAmount} PSD
                        </button>
                        <button onClick={() => rejectInheritance(roomCode, me.uid, 'psd')} className="field-btn">
                            Reject PSD
                        </button>
                    </>
                )}
                {isRoleHeir && pending.roleList.length > 0 && (
                    <>
                        <button onClick={() => acceptInheritance(roomCode, me.uid, 'role')} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                            Accept role(s): {pending.roleList.join(', ')}
                        </button>
                        <button onClick={() => rejectInheritance(roomCode, me.uid, 'role')} className="field-btn">
                            Reject role(s)
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

const WillsPanel = ({ roomCode, game, me, players }) => {
    if (me.eliminated) return null
    return (
        <>
            {game.pendingInheritance && <InheritancePanel roomCode={roomCode} game={game} me={me} players={players} />}
            {me.will ? <MyWill roomCode={roomCode} me={me} players={players} /> : <MakeWill roomCode={roomCode} me={me} players={players} />}
        </>
    )
}

export default WillsPanel
