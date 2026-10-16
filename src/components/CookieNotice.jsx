import { useEffect, useState } from 'react'

const DISMISSED_KEY = 'ram_cookie_notice_dismissed'

// This site sets no analytics/tracking cookies itself - the only
// cookie-setting third party is an embedded YouTube video, and only once a
// visitor presses play on one (see ClipCard.jsx). There's nothing here to
// "accept/reject" since nothing loads until that explicit click, so this is
// a one-time, dismissible NOTICE rather than a full consent-gate banner -
// proportionate to what the site actually does. See Privacy Policy >
// "Cookies and embedded video" for the full explanation this links to.
const CookieNotice = () => {
    const [dismissed, setDismissed] = useState(true)

    useEffect(() => {
        try {
            setDismissed(localStorage.getItem(DISMISSED_KEY) === 'true')
        } catch {
            // localStorage unavailable (e.g. private browsing) - just show it
            // every visit rather than crash.
            setDismissed(false)
        }
    }, [])

    const dismiss = () => {
        setDismissed(true)
        try {
            localStorage.setItem(DISMISSED_KEY, 'true')
        } catch {
            // Ignore - worst case it shows again next visit.
        }
    }

    if (dismissed) return null

    return (
        <div
            role="region"
            aria-label="Cookie notice"
            className="fixed bottom-0 inset-x-0 z-40 navbar-surface border-t border-black-300"
        >
            <div className="max-w-7xl mx-auto c-space py-4 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                <p className="text-white-700 flex-1">
                    We don&apos;t use tracking or advertising cookies. Pressing play on an embedded video loads
                    content from YouTube, which may set its own cookies.{' '}
                    <a href="/privacy#cookies" className="link-accent">Read our Cookie Policy</a>.
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] shrink-0 !min-h-0 py-2 px-4 text-sm"
                >
                    Got it
                </button>
            </div>
        </div>
    )
}

export default CookieNotice
