import { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ClipCard from '../components/ClipCard.jsx'
import CastAvatars from '../components/CastAvatars.jsx'
import Pagination from '../components/Pagination.jsx'
import ClipsSkeleton from '../components/ClipsSkeleton.jsx'
import { navLinks } from '../constants/index.js'
import { getTopics } from '../api/topics.js'
import { parseYoutubeVideo } from '../utils/youtube.js'

const PAGE_SIZE = 10

// castMembers/crew entries are either a display name (older topics) or a
// consentId uuid referencing the Consents table (newer topics, cast by
// getCastNames.js once deployed - see src/backend/getCastNames.js). This
// page is public, and the full Consents endpoint returns everyone's phone
// number/email/age/allergies, so uuid entries are skipped here rather than
// shown as raw ids or resolved by fetching that PII on a public page.
const CONSENT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const getDisplayCast = (rawList) => rawList.filter((entry) => !CONSENT_ID_RE.test(entry))

const buildCollection = (topic) => {
    const video = parseYoutubeVideo(topic.video)
    if (!topic.Uploaded || !video) return null

    const shorts = (topic.shorts ?? [])
        .map(parseYoutubeVideo)
        .filter(Boolean)

    const clips = [
        { id: `${topic.topicId}-video`, type: 'video', youtubeId: video.id, start: video.start },
        ...shorts.map((short, index) => ({ id: `${topic.topicId}-short-${index}`, type: 'short', youtubeId: short.id })),
    ]

    const rawCast = [...new Set([...(topic.castMembers ?? []), ...(topic.judges ?? []), ...(topic.contestants ?? [])])]

    return {
        id: topic.topicId,
        title: topic.Topic,
        description: topic.description,
        cast: getDisplayCast(rawCast),
        clips,
    }
}

// The Topics endpoint is slow (1.5-2s server-side, every call - not just a
// cold start) and occasionally fails outright. A couple of quick retries
// smooths over transient failures without the user having to notice.
const RETRY_ATTEMPTS = 2
const RETRY_DELAY_MS = 800
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getTopicsWithRetry = async () => {
    let lastError
    for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
        try {
            return await getTopics()
        } catch (err) {
            lastError = err
            if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS)
        }
    }
    throw lastError
}

const Clips = () => {
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [retryKey, setRetryKey] = useState(0)
    const [page, setPage] = useState(1)
    const listRef = useRef(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(false)
        getTopicsWithRetry()
            .then((topics) => {
                if (!active) return
                setTopics(topics)
                setLoading(false)
            })
            .catch(() => {
                if (!active) return
                setError(true)
                setLoading(false)
            })
        return () => { active = false }
    }, [retryKey])

    const collections = topics
        .map(buildCollection)
        .filter(Boolean)
        .sort((a, b) => Number(b.id) - Number(a.id))

    const totalPages = Math.max(1, Math.ceil(collections.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const pageCollections = collections.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const goToPage = (nextPage) => {
        setPage(nextPage)
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Navbar navLinks={navLinks} />

            {/* flex-1: grows to fill any leftover height so Footer lands at
                the true bottom of the screen instead of floating above it */}
            <section className="c-space pt-24 pb-16 flex-1">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <p className="text-white-600 mt-4 text-lg">
                        Highlights from the videos we&apos;ve filmed. Catch the full episodes on{' '}
                        <a
                            href="https://www.youtube.com/@bulfighter"
                            target="_blank"
                            rel="noreferrer"
                            className="link-accent"
                        >
                            YouTube @bulfighter
                        </a>.
                    </p>
                </div>

                {loading && <ClipsSkeleton />}

                {!loading && error && (
                    <div className="text-center">
                        <p className="text-red-500 text-xl">Couldn&apos;t load clips right now.</p>
                        <button
                            type="button"
                            onClick={() => setRetryKey((key) => key + 1)}
                            className="field-btn mt-4 mx-auto"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && collections.length === 0 && (
                    <p className="text-white-600 text-center text-xl">No clips yet, check back soon.</p>
                )}

                {!loading && !error && collections.length > 0 && (
                    <div className="mb-8">
                        <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                    </div>
                )}

                <div ref={listRef} className="flex flex-col gap-8">
                    {pageCollections.map((collection) => {
                        const videoClip = collection.clips.find((clip) => clip.type === 'video')
                        const shortClips = collection.clips.filter((clip) => clip.type !== 'video')

                        return (
                            <div key={collection.id}>
                                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 mb-3">
                                    <div className="max-w-xl">
                                        <h2 className="text-2xl font-semibold text-white-800">
                                            {collection.title}
                                        </h2>
                                        {collection.description && (
                                            <p className="text-white-600 mt-1">{collection.description}</p>
                                        )}
                                    </div>

                                    {videoClip && (
                                        <a
                                            href={`https://www.youtube.com/watch?v=${videoClip.youtubeId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors shrink-0"
                                        >
                                            Watch full episode
                                            <img src="/assets/arrow-up.png" alt="" className="field-btn_arrow" />
                                        </a>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 justify-start items-start">
                                    {videoClip && (
                                        <ClipCard clip={{ ...videoClip, title: collection.title }} />
                                    )}
                                    {shortClips.map((clip) => (
                                        <ClipCard key={clip.id} clip={{ ...clip, title: collection.title }} />
                                    ))}
                                    <CastAvatars names={collection.cast} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {!loading && !error && collections.length > 0 && (
                    <div className="mt-8">
                        <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                    </div>
                )}
            </section>

            <Footer />
        </main>
    )
}

export default Clips
