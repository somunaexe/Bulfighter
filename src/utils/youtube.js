// Parses a YouTube URL (watch, youtu.be, or /shorts/) into its video id and,
// if present, a start-time offset in seconds. Handles the DB's malformed
// youtu.be links where a timestamp got appended with "&" instead of "?"
// (e.g. https://youtu.be/Gc1O1e99SzA&t=1322) - the id capture stops at the
// first non-id character either way, so this still works.
export function parseYoutubeVideo(url) {
    if (!url) return null

    const idMatch = url.match(/(?:youtu\.be\/|\/shorts\/|[?&]v=)([a-zA-Z0-9_-]{6,})/)
    const id = idMatch?.[1]
    if (!id) return null

    const startMatch = url.match(/[?&]t=(\d+)/)
    const start = startMatch ? Number(startMatch[1]) : undefined

    return { id, start }
}
