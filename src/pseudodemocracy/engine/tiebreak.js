import { V } from '../psdData.js'

// Win tie-break: (popularity + 50) x PSD - highest wins. Only used to break
// ties in rounds-as-leader; it is not itself the win condition.
export function tiebreakScore(popularity, psd) {
    return (popularity - V.popMin) * psd
}
