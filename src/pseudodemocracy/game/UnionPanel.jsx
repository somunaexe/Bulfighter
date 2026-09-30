import { useState } from 'react'
import {
    foundUnion,
    recruitMember,
    leaveUnion,
    kickMember,
    disperseUnion,
    confrontLeader,
    commandPerformance,
} from '../gameEngine.js'

const selectClass = 'px-2 py-1 rounded border border-black-300 bg-transparent'

const FoundUnion = ({ roomCode, me }) => {
    const [type, setType] = useState('activist')
    return (
        <div className="surface-card p-4 mb-6">
            <p className="font-semibold text-white-800">Found a union</p>
            <p className="text-white-600 text-sm mt-1">Played from a card that says so - you become its Unionizer (Activist) or Capon (Agbero).</p>
            <div className="flex items-center gap-2 mt-3">
                <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                    <option value="activist">Activist</option>
                    <option value="agbero">Agbero</option>
                </select>
                <button onClick={() => foundUnion(roomCode, me.uid, type)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                    Found union
                </button>
            </div>
        </div>
    )
}

const UnionControls = ({ roomCode, union, me, players, leaderUid, isMyActionTurn }) => {
    const isUnionizer = union.unionizerUid === me.uid
    const nonMembers = players.filter((p) => !union.memberUids.includes(p.uid) && !p.eliminated)
    const [recruitUid, setRecruitUid] = useState(nonMembers[0]?.uid)
    const [scenario, setScenario] = useState('')
    const [error, setError] = useState('')
    const members = union.memberUids.map((uid) => players.find((p) => p.uid === uid)?.name || uid).join(', ')

    // "Leader in Union": if the Leader is a member, actions target a
    // rival of the Leader's choice instead of the Leader themselves -
    // resolveTarget on the engine side needs that choice, or it has
    // nothing to target.
    const leaderIsMember = union.memberUids.includes(leaderUid)
    const rivalOptions = players.filter((p) => p.uid !== leaderUid && !p.eliminated)
    const [rivalUid, setRivalUid] = useState(rivalOptions[0]?.uid)

    const handleCommand = async () => {
        setError('')
        try {
            await commandPerformance(roomCode, union.id, scenario, leaderIsMember ? rivalUid : undefined)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="surface-card p-4 mb-6">
            <p className="font-semibold text-white-800">
                Your {union.type === 'activist' ? 'Activist union' : 'Agbero mob'} ({union.memberUids.length} member{union.memberUids.length === 1 ? '' : 's'})
            </p>
            <p className="text-white-600 text-sm mt-1">{members}</p>
            {!isMyActionTurn && (
                <p className="text-white-600 text-sm mt-2">
                    Recruiting, kicking and Command Performance only work on the unionizer&apos;s turn (or the Leader&apos;s, if a member).
                </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
                <button onClick={() => leaveUnion(roomCode, union.id, me.uid)} className="field-btn">
                    Leave
                </button>
                {isUnionizer && (
                    <button onClick={() => disperseUnion(roomCode, union.id)} className="field-btn">
                        Disperse
                    </button>
                )}
            </div>
            {isUnionizer && isMyActionTurn && (
                <>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <select value={recruitUid} onChange={(e) => setRecruitUid(e.target.value)} className={selectClass}>
                            {nonMembers.map((p) => (
                                <option key={p.uid} value={p.uid}>{p.name}</option>
                            ))}
                        </select>
                        <button onClick={() => recruitMember(roomCode, union.id, recruitUid)} className="field-btn" disabled={!recruitUid}>
                            Recruit
                        </button>
                        {union.memberUids.filter((u) => u !== me.uid).map((uid) => (
                            <button key={uid} onClick={() => kickMember(roomCode, union.id, uid)} className="field-btn">
                                Kick {players.find((p) => p.uid === uid)?.name}
                            </button>
                        ))}
                    </div>
                    {leaderIsMember && (
                        <p className="text-white-600 text-sm mt-2">
                            The Leader is in your union, so this targets a rival of their choice instead:
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <input
                            type="text"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            placeholder="Scripted scenario to perform"
                            className="flex-1 min-w-[16rem] px-3 py-2 rounded-md bg-transparent border border-black-300"
                        />
                        {leaderIsMember && (
                            <select value={rivalUid} onChange={(e) => setRivalUid(e.target.value)} className={selectClass}>
                                {rivalOptions.map((p) => (
                                    <option key={p.uid} value={p.uid}>{p.name}</option>
                                ))}
                            </select>
                        )}
                        <button onClick={handleCommand} disabled={!scenario || (leaderIsMember && !rivalUid)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                            Command Performance
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </>
            )}
        </div>
    )
}

const ConfrontPanel = ({ roomCode, union, me, players, leaderUid }) => {
    const [error, setError] = useState('')
    const isMember = union.memberUids.includes(me.uid)
    const leaderIsMember = union.memberUids.includes(leaderUid)
    const rivalOptions = players.filter((p) => p.uid !== leaderUid && !p.eliminated)
    const [rivalUid, setRivalUid] = useState(rivalOptions[0]?.uid)
    if (!isMember) return null

    return (
        <div className="surface-card p-4 mb-6 border border-dashed border-red-400">
            <p className="font-semibold text-white-800">The Leader is amending an article - Confront?</p>
            <p className="text-white-600 text-sm mt-1">
                {union.type === 'activist'
                    ? "Doubles your union's total vote, automatically against the Leader."
                    : `Blocks the amendment and steals ${50 * union.memberUids.length} PSD from the Leader, split evenly among your mob.`}{' '}
                Once only per amendment.
                {leaderIsMember && ' The Leader is in your union, so this targets a rival of their choice instead.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
                {leaderIsMember && (
                    <select value={rivalUid} onChange={(e) => setRivalUid(e.target.value)} className={selectClass}>
                        {rivalOptions.map((p) => (
                            <option key={p.uid} value={p.uid}>{p.name}</option>
                        ))}
                    </select>
                )}
                <button
                    onClick={async () => {
                        setError('')
                        try {
                            await confrontLeader(roomCode, union.id, leaderIsMember ? rivalUid : undefined)
                        } catch (err) {
                            setError(err.message)
                        }
                    }}
                    disabled={leaderIsMember && !rivalUid}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors"
                >
                    Confront the Leader
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}

// Unions live entirely in game.unions (no per-player field), so this just
// scans it for the current player's union, if any. Founding one, and
// Confronting the Leader (the explicit exception to union-turn gating),
// show regardless of phase; recruit/kick/Command Performance are gated to
// the unionizer's turn (or the Leader's, if a member) inside UnionControls.
const UnionPanel = ({ roomCode, game, me, players }) => {
    if (me.eliminated) return null
    const myUnion = (game.unions || []).find((u) => u.memberUids.includes(me.uid))
    const activeOrder = game.turnOrder.filter((uid) => !players.find((p) => p.uid === uid)?.eliminated)
    const currentTurnUid = activeOrder[game.currentTurnIndex % activeOrder.length]

    return (
        <>
            {game.pendingAmendment && myUnion && (
                <ConfrontPanel roomCode={roomCode} union={myUnion} me={me} players={players} leaderUid={game.leaderUid} />
            )}
            {myUnion ? (
                <UnionControls
                    roomCode={roomCode}
                    union={myUnion}
                    me={me}
                    players={players}
                    leaderUid={game.leaderUid}
                    isMyActionTurn={currentTurnUid === myUnion.unionizerUid || (currentTurnUid === game.leaderUid && myUnion.memberUids.includes(game.leaderUid))}
                />
            ) : (
                <FoundUnion roomCode={roomCode} me={me} />
            )}
        </>
    )
}

export default UnionPanel
