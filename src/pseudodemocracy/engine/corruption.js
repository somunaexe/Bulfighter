// Corruption markers (card glossary, via V.corruption = {limit, pop, fine, wait}):
// on the `limit`-th marker, a player is frozen (roles frozen, can't pick
// Settlement/{GOOD} cards) and loses `pop` popularity once. The freeze
// lifts by paying `fine` PSD (restores everything) or waiting `wait`
// terms (freeze lifts, popularity drop stays, roles are gone for good).
export function shouldFreeze(markerCount, limit) {
    return markerCount >= limit
}

export function canWaitOut(frozenSinceRound, currentRound, waitTerms) {
    return frozenSinceRound != null && currentRound - frozenSinceRound >= waitTerms
}
