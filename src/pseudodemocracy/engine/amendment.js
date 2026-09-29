// Applies a Leader's amendment to an article's text. The rulebook's
// structural rule ("only highlighted words can change, one word for one
// word") is enforced here by construction: the UI only ever lets a Leader
// edit the content of __highlighted__ segments, never the plain text around
// them, and this rejects a replacement whose word count doesn't match.
//
// The other half of the rule - "the article must still be correct English"
// - is explicitly a human judgement call in the rulebook ("decided by
// correct English, not a player vote"), so it is NOT checked here. The UI
// asks the table to rule on that separately (see ruleAmendment in
// gameEngine.js).
import { parseHighlights } from '../parseHighlights.js'

function wordCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * @param {string} originalText - the article's current text, with __word__ markers
 * @param {string[]} replacements - one new value per highlighted segment, in order
 * @returns {{ text: string, valid: boolean, reason?: string }}
 */
export function applyAmendment(originalText, replacements) {
    const segments = parseHighlights(originalText)
    const highlightedIndexes = segments.map((s, i) => (s.highlighted ? i : -1)).filter((i) => i >= 0)

    if (replacements.length !== highlightedIndexes.length) {
        return { text: originalText, valid: false, reason: 'Wrong number of replacements for this article' }
    }

    for (let i = 0; i < highlightedIndexes.length; i++) {
        const original = segments[highlightedIndexes[i]].text
        const next = replacements[i]
        if (wordCount(next) !== wordCount(original)) {
            return { text: originalText, valid: false, reason: `"${original}" must be replaced with exactly ${wordCount(original)} word(s)` }
        }
    }

    const next = segments
        .map((s, i) => {
            const replacementIndex = highlightedIndexes.indexOf(i)
            return replacementIndex >= 0 ? replacements[replacementIndex] : s.text
        })
        .join('')

    return { text: next, valid: true }
}
