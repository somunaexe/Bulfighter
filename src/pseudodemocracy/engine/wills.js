// A will only counts if it isn't on hold when its owner dies - a missed
// upkeep payment puts it on hold; catching up anytime reactivates it.
export function isWillValid(will, onHold) {
    return Boolean(will) && !onHold
}

// Nepo Baby popularity debuff: V.nepoDebuff = [30, 20, 10] applied as
// -30/-20/-10 over 3 rounds after accepting an inheritance, then nothing
// from the 4th round on.
export function nepoDebuffForStage(nepoDebuffSchedule, stage) {
    if (stage < 0 || stage >= nepoDebuffSchedule.length) return 0
    return -nepoDebuffSchedule[stage]
}

export function isNepoBabyDebuffActive(stage, scheduleLength) {
    return stage < scheduleLength
}
