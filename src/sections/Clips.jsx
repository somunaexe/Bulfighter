import { useEffect, useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ClipCard from '../components/ClipCard.jsx'
import CastAvatars from '../components/CastAvatars.jsx'
import { navLinks } from '../constants/index.js'
import { getTopics } from '../api/topics.js'
import { parseYoutubeVideo } from '../utils/youtube.js'

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

    return (
        <main className="max-w-7xl mx-auto">
            <Navbar navLinks={navLinks} />

            <section className="c-space pt-24 pb-16">
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

                {loading && (
                    <p className="text-white-600 text-center text-xl">Loading clips...</p>
                )}

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

                <div className="flex flex-col gap-8">
                    {collections.map((collection) => {
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
            </section>

            <Footer />
        </main>
    )
}

export default Clips
