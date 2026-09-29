// Levy Band Shift (Article 5): at a term's end, check the outgoing Leader's
// popularity. Below -trigger, the band rises by `shift`; above +trigger, it
// drops by `shift` (never below `floor`); in between, no change. If the
// current levy amount ends up outside the new band, it moves to the
// nearest value inside it.
export function shiftLevyBand(band, outgoingLeaderPopularity, { trigger, shift, floor }) {
    let { low, high } = band
    if (outgoingLeaderPopularity < -trigger) {
        low += shift
        high += shift
    } else if (outgoingLeaderPopularity > trigger) {
        low = Math.max(floor, low - shift)
        high = Math.max(floor, high - shift)
    }
    return { low, high }
}

export function clampLevyToBand(amount, band) {
    return Math.max(band.low, Math.min(band.high, amount))
}
