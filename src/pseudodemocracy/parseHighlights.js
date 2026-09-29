// Splits an article's text into plain and highlighted (amendable) segments,
// e.g. "Tax: __20%__ of income..." becomes
// [{ text: 'Tax: ', highlighted: false }, { text: '20%', highlighted: true }, ...]
// Kept separate from psdData.js since this is presentation logic (how the
// website shows a highlight), not data - the __word__ markers themselves
// come straight from articles.js.
export function parseHighlights(text) {
    return text
        .split(/(__[^_]+__)/g)
        .filter(Boolean)
        .map((part) => {
            const match = part.match(/^__([^_]+)__$/)
            return match ? { text: match[1], highlighted: true } : { text: part, highlighted: false }
        })
}
