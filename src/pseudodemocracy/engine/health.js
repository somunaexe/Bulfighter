// Sickness/immunity - a player who is already sick can't be sickened
// again (no stacking), and after recovering they're immune for as long
// as their ORIGINAL sickness lasted, even if a sabotaged "cure" extended
// the actual sick time. Applies to sickness from any source (a dose or a
// card).
export function canSicken(sicknessRoundsRemaining, immunityRoundsRemaining) {
    return sicknessRoundsRemaining <= 0 && immunityRoundsRemaining <= 0
}

// Starting a fresh sickness (via Sicken, or a card) - sets both the
// active countdown and the original duration immunity will later use.
export function startSickness(rounds) {
    return { sicknessRoundsRemaining: rounds, sicknessOriginalDuration: rounds }
}

// A sabotaged heal attempt extends an EXISTING sickness - this is exempt
// from no-stacking (it's not a fresh sicken, the cure attempt backfired),
// and it does not change the original duration immunity will use.
export function extendSickness(sicknessRoundsRemaining, extraRounds) {
    return sicknessRoundsRemaining + extraRounds
}

// One round/term ticking by - call once per ended term. Recovering grants
// immunity for the ORIGINAL sickness length, not however long it ended
// up extended to.
export function tickSicknessAndImmunity(player) {
    const next = { ...player }
    if (next.sicknessRoundsRemaining > 0) {
        next.sicknessRoundsRemaining -= 1
        if (next.sicknessRoundsRemaining === 0) {
            next.immunityRoundsRemaining = next.sicknessOriginalDuration || 0
            next.sicknessOriginalDuration = 0
        }
    } else if (next.immunityRoundsRemaining > 0) {
        next.immunityRoundsRemaining -= 1
    }
    return next
}
