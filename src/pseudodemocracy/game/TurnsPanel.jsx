import { useEffect, useRef, useState } from 'react'
import {
    payTaxAndCompleteTurn,
    advanceToFarewell,
    drawPerformanceCard,
    castPerformanceVote,
    resolvePerformanceVote,
    clearPerformance,
    adjustPlayerStat,
    addCorruptionMarker,
    getCardText,
    getPerformanceCardText,
} from '../gameEngine.js'

const AdjustStat = ({ roomCode, players }) => {
    const [uid, setUid] = useState(players[0]?.uid)
    const [field, setField] = useState('psd')
    const [delta, setDelta] = useState(0)
    return (
        <div className="flex flex-wrap items-center gap-2 mt-3">
            <select value={uid} onChange={(e) => setUid(e.target.value)} className="px-2 py-1 rounded border border-black-300 bg-transparent">
                {players.map((p) => (
                    <option key={p.uid} value={p.uid}>{p.name}</option>
                ))}
            </select>
            <select value={field} onChange={(e) => setField(e.target.value)} className="px-2 py-1 rounded border border-black-300 bg-transparent">
                <option value="psd">PSD</option>
                <option value="popularity">Popularity</option>
            </select>
            <input
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                className="w-24 px-2 py-1 rounded border border-black-300 bg-transparent"
                placeholder="+/- amount"
            />
            <button onClick={() => adjustPlayerStat(roomCode, uid, field, delta)} className="field-btn">
                Apply
            </button>
            <button onClick={() => addCorruptionMarker(roomCode, uid)} className="field-btn">
                + Corruption marker
            </button>
        </div>
    )
}

const PerformancePanel = ({ roomCode, game, me, players, performer, activeOrder }) => {
    const current = game.currentPerformance
    const isPerformer = me.uid === performer.uid
    const eligibleVoters = activeOrder.filter((uid) => uid !== performer.uid)
    const votesIn = Object.keys(current.votes || {}).length
    const myVote = current.votes?.[me.uid]

    const resolvedRef = useRef(false)
    useEffect(() => {
        if (!current.resolved && votesIn >= eligibleVoters.length && eligibleVoters.length > 0 && !resolvedRef.current) {
            resolvedRef.current = true
            resolvePerformanceVote(roomCode, activeOrder.length)
        }
    }, [current.resolved, votesIn, eligibleVoters.length, roomCode, activeOrder.length])

    if (!current.resolved) {
        return (
            <div className="surface-card p-6 mb-6">
                <p className="font-semibold text-white-800 mb-1">{performer.name} is performing</p>
                <p className="text-white-800 mb-4 italic">&quot;{getPerformanceCardText(current.cardNumber)}&quot;</p>
                {isPerformer ? (
                    <p className="text-white-600">Perform it live, then stay silent during discussion. Waiting for votes...</p>
                ) : (
                    <>
                        <p className="text-white-600 text-sm mb-2">{votesIn} / {eligibleVoters.length} votes cast.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => castPerformanceVote(roomCode, me.uid, 'good')}
                                disabled={Boolean(myVote)}
                                className={`field-btn disabled:opacity-50 ${myVote === 'good' ? 'bg-[rgb(var(--theme-accent))] text-white' : ''}`}
                            >
                                Good
                            </button>
                            <button
                                onClick={() => castPerformanceVote(roomCode, me.uid, 'bad')}
                                disabled={Boolean(myVote)}
                                className={`field-btn disabled:opacity-50 ${myVote === 'bad' ? 'bg-[rgb(var(--theme-accent))] text-white' : ''}`}
                            >
                                Bad
                            </button>
                        </div>
                    </>
                )}
            </div>
        )
    }

    const resultLabel = {
        tie: 'Tied vote - no change',
        settlement: 'Settlement card',
        scandal: 'Scandal card',
        'settlement-blocked': `${performer.name} is frozen - no Settlement card`,
    }[current.resultType]

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">{resultLabel}</p>
            {current.resultType === 'settlement-blocked' && (
                <p className="text-white-600 mb-4">
                    The vote was good, but {performer.name} has 3 corruption markers and can&apos;t pick Settlement
                    cards while frozen - the popularity swing still applied, just no card.
                </p>
            )}
            {(current.resultType === 'settlement' || current.resultType === 'scandal') && (
                <p className="text-white-800 mb-4 italic">&quot;{getCardText(current.resultType, current.resultCardNumber)}&quot;</p>
            )}
            <p className="text-white-600 text-sm mb-1">
                Apply whatever the card says using the tool below - PSD/popularity changes for anyone, including {performer.name}.
            </p>
            <AdjustStat roomCode={roomCode} players={players} />
            <div className="mt-4">
                <button
                    onClick={() => clearPerformance(roomCode)}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors"
                >
                    Done - continue my turn
                </button>
            </div>
        </div>
    )
}

// A "turn" is: draw and perform a Performance card, resolve the vote and
// its Settlement/Scandal card, then declare whatever taxable income came
// out of it and pay levy + tax on that. Card effects that aren't income
// (losses, payments to another player, popularity, corruption markers...)
// are applied directly via the adjustment tool above, not taxed again here.
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

    if (game.currentPerformance) {
        return (
            <PerformancePanel
                roomCode={roomCode}
                game={game}
                me={me}
                players={players}
                performer={currentPlayer}
                activeOrder={activeOrder}
            />
        )
    }

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">
                Turn {game.turnsCompletedUids.length + 1} / {activeOrder.length}: {currentPlayer?.name}&apos;s turn
            </p>
            {isMyTurn ? (
                <>
                    <p className="text-white-600 text-sm mb-4">Draw a Performance card to start your turn.</p>
                    <button
                        onClick={() => drawPerformanceCard(roomCode, me.uid)}
                        className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors mb-4"
                    >
                        Draw a Performance card
                    </button>
                    <div>
                        <p className="text-white-600 text-sm mb-2">
                            Once resolved, declare any taxable income you collected (not losses/payments - those were
                            already applied above) so levy ({game.levy.amount} PSD) and {game.rules.taxRate}% tax come
                            out of it.
                        </p>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            placeholder="Taxable income this term"
                            className="w-48 px-3 py-2 rounded-md bg-transparent border border-black-300 mb-4"
                        />
                        <div>
                            <button
                                onClick={async () => {
                                    setBusy(true)
                                    try {
                                        await payTaxAndCompleteTurn(roomCode, me.uid, income)
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
                    </div>
                </>
            ) : (
                <p className="text-white-600">Waiting for {currentPlayer?.name} to finish their turn...</p>
            )}
        </div>
    )
}

export default TurnsPanel
