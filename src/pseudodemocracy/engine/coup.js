// Coup eligibility - LOCKED per the handoff's coup principle ("anything
// deciding whether, how, or by whom a coup can happen must stay a locked
// rule"). coupCost and coupGap come straight from game_data.js and are
// never read from a room's live/amendable state - no Constitution article
// can ever touch them.
import { V } from '../psdData.js'

/**
 * @param {object} p
 * @param {number} p.challengerPsd
 * @param {number} p.challengerCoupCards - how many coup-flagged role cards the challenger currently holds
 * @param {number} p.challengerPopularity
 * @param {number} p.leaderPopularity
 * @returns {boolean} true if the coup succeeds
 */
export function canAttemptCoup({ challengerPsd, challengerCoupCards, challengerPopularity, leaderPopularity }) {
    if (challengerCoupCards < 1) return false
    if (challengerPsd < V.coupCost) return false
    return challengerPopularity - leaderPopularity >= V.coupGap
}

export const COUP_COST = V.coupCost
export const COUP_GAP = V.coupGap
