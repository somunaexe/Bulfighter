import { V } from '../psdData.js'

export function clampPopularity(value) {
    return Math.max(V.popMin, Math.min(V.popMax, value))
}

export function isCancelled(popularity) {
    return popularity <= V.popMin
}

// V.swing is [['3', 10], ['4', 7], ..., ['8–10', 3], ['11+', 1]] - a table of
// base popularity swing per hand, keyed by player-count bucket. Buckets
// below the table's lowest key clamp to it (the game needs 3+ players, so
// this only matters if players are eliminated below 3).
export function swingForPlayerCount(playerCount) {
    for (const [bucket, value] of V.swing) {
        if (bucket.includes('+')) return value
        if (bucket.includes('–') || bucket.includes('-')) {
            const [lo, hi] = bucket.split(/[–-]/).map(Number)
            if (playerCount >= lo && playerCount <= hi) return value
        } else if (playerCount <= Number(bucket)) {
            return value
        }
    }
    return V.swing[V.swing.length - 1][1]
}

// Amendment votes: everyone except the Leader votes for/against right after
// an amendment. Each vote moves popularity by one base swing for the
// current player count - the same table performance votes use (updated
// 2026-09-30; this used to be a flat +1/-1 per vote regardless of table size).
export function applyAmendmentVotes(currentPopularity, votesFor, votesAgainst, playerCount) {
    const swing = swingForPlayerCount(playerCount)
    const delta = (votesFor - votesAgainst) * swing
    return clampPopularity(currentPopularity + delta)
}

// Performance votes: ties = no change; otherwise the whole base swing
// applies in the direction of the majority.
export function applyPerformanceVote(currentPopularity, goodVotes, badVotes, playerCount) {
    if (goodVotes === badVotes) return currentPopularity
    const swing = swingForPlayerCount(playerCount)
    const direction = goodVotes > badVotes ? 1 : -1
    return clampPopularity(currentPopularity + direction * swing)
}
