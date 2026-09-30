import { useState } from 'react'
import { sicken, offerHeal, rejectHeal, guessSabotage, acceptHeal, clearPrescription } from '../gameEngine.js'
import { V } from '../psdData.js'

const selectClass = 'px-2 py-1 rounded border border-black-300 bg-transparent'

const DoctorActions = ({ roomCode, me, players }) => {
    const others = players.filter((p) => p.uid !== me.uid && !p.eliminated)
    const [action, setAction] = useState('sicken')
    const [doseType, setDoseType] = useState('agbo')
    const [choice, setChoice] = useState('cure')
    const [price, setPrice] = useState(0)
    const [error, setError] = useState('')
    const chargesLeft = V.doctorCharges - (me.doctorChargesUsedThisTerm || 0)

    // Sicken can target anyone not already sick/immune; a Heal only makes
    // sense on someone already sick (offerHeal rejects it otherwise).
    const eligiblePatients = action === 'heal' ? others.filter((p) => p.sicknessRoundsRemaining > 0) : others
    const [patientUid, setPatientUid] = useState(eligiblePatients[0]?.uid)
    const patient = eligiblePatients.find((p) => p.uid === patientUid) || eligiblePatients[0]

    if (chargesLeft <= 0) {
        return <div className="surface-card p-4 mb-6 text-white-600">Doctor: no charges left this term.</div>
    }
    if (!patient) {
        return action === 'heal' ? (
            <div className="surface-card p-4 mb-6 text-white-600">
                Doctor - {chargesLeft} charge(s) left. Nobody is sick to heal right now.{' '}
                <button onClick={() => setAction('sicken')} className="underline">Sicken someone instead?</button>
            </div>
        ) : null
    }

    const handleSubmit = async () => {
        setError('')
        try {
            if (action === 'sicken') {
                await sicken(roomCode, me.uid, patient.uid, doseType)
            } else {
                await offerHeal(roomCode, me.uid, patient.uid, doseType, choice, price)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="surface-card p-4 mb-6 border border-dashed border-[rgb(var(--theme-accent))]">
            <p className="font-semibold text-white-800">Doctor - {chargesLeft} charge(s) left this term</p>
            <p className="text-white-600 text-sm mt-1">
                Sicken is open (no secrecy). Offering a Heal is secret - you privately choose a real Cure or Sabotage
                (Poison); anyone can guess Sabotage before the patient accepts.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
                <select
                    value={action}
                    onChange={(e) => {
                        setAction(e.target.value)
                        setPatientUid(undefined) // let eligiblePatients recompute and re-pick a default below
                        if (e.target.value === 'sicken' && doseType === 'surgery') setDoseType('agbo')
                    }}
                    className={selectClass}
                >
                    <option value="sicken">Sicken</option>
                    <option value="heal">Offer Heal</option>
                </select>
                <select value={patient.uid} onChange={(e) => setPatientUid(e.target.value)} className={selectClass}>
                    {eligiblePatients.map((p) => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
                <select value={doseType} onChange={(e) => setDoseType(e.target.value)} className={selectClass}>
                    <option value="agbo">Agbo</option>
                    <option value="concoction">Concoction</option>
                    {action === 'heal' && <option value="surgery">Surgery</option>}
                </select>
                {action === 'heal' && (
                    <>
                        <select value={choice} onChange={(e) => setChoice(e.target.value)} className={selectClass}>
                            <option value="cure">Real Cure (secret)</option>
                            <option value="poison">Poison / Sabotage (secret)</option>
                        </select>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="Price (PSD)"
                            className="w-28 px-2 py-1 rounded border border-black-300 bg-transparent"
                        />
                    </>
                )}
                <button onClick={handleSubmit} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                    {action === 'sicken' ? 'Sicken' : 'Offer Heal'}
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}

const PrescriptionPanel = ({ roomCode, game, me, players }) => {
    const p = game.currentPrescription
    const doctor = players.find((pl) => pl.uid === p.doctorUid)
    const patient = players.find((pl) => pl.uid === p.patientUid)
    const isPatient = me.uid === p.patientUid

    if (p.status === 'offered') {
        return (
            <div className="surface-card p-4 mb-6 border border-dashed border-red-400">
                <p className="font-semibold text-white-800">
                    {doctor?.name} is offering {patient?.name} a {p.doseType} ({p.price} PSD)
                </p>
                <p className="text-white-600 text-sm mt-1">Anyone may guess Sabotage before {patient?.name} accepts.</p>
                <div className="flex gap-3 mt-3">
                    <button onClick={() => guessSabotage(roomCode, me.uid)} className="field-btn">
                        Guess Sabotage
                    </button>
                    {isPatient && (
                        <>
                            <button onClick={() => acceptHeal(roomCode)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                                Accept
                            </button>
                            <button onClick={() => rejectHeal(roomCode)} className="field-btn">
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
        )
    }

    const outcomeText = {
        'guessed-right': `Sabotage confirmed - ${doctor?.name} loses the Doctor role and gives a real Cure.`,
        'guessed-wrong': `Not Sabotage - the guesser pays ${doctor?.name} ${p.price} PSD, and it was a real Cure anyway.`,
        accepted: 'Resolved as written - check the Scoreboard for the effect.',
    }[p.status]

    return (
        <div className="surface-card p-4 mb-6">
            <p className="font-semibold text-white-800">{outcomeText}</p>
            <button onClick={() => clearPrescription(roomCode)} className="field-btn mt-3">
                Dismiss
            </button>
        </div>
    )
}

// Doctor actions (Sicken/Heal) can happen any time a Doctor has charges
// left this term, not just on their own turn - so this shows persistently
// like CoupPanel/CorruptionPanel, not gated to the Turns phase.
const HealthPanel = ({ roomCode, game, me, players }) => {
    if (me.eliminated) return null
    if (game.currentPrescription) {
        return <PrescriptionPanel roomCode={roomCode} game={game} me={me} players={players} />
    }
    if (me.roles?.includes('Doctor')) {
        return <DoctorActions roomCode={roomCode} me={me} players={players} />
    }
    return null
}

export default HealthPanel
