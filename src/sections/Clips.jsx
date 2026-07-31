import { useEffect, useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ClipCard from '../components/ClipCard.jsx'
import CastAvatars from '../components/CastAvatars.jsx'
import { navLinks } from '../constants/index.js'
import { clipCollections } from '../constants/clips.js'

// Video links aren't in the Topics Lambda yet - this stands in for that
// fetch so swapping in the real request later is a one-line change.
const fetchClips = async () => clipCollections

// Same Topics table the admin page reads from - used here only to pull
// cast names (by topicId) for the avatar stack under each episode's CTA.
const TOPICS_URL = 'https://m0umxkjpy6.execute-api.eu-north-1.amazonaws.com/dev'

const fetchTopics = async () => {
    const response = await fetch(TOPICS_URL, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.topics
}

const Clips = () => {
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)
    const [topicsById, setTopicsById] = useState({})

    useEffect(() => {
        let active = true
        fetchClips().then((data) => {
            if (!active) return
            setCollections(data)
            setLoading(false)
        })
        return () => { active = false }
    }, [])

    useEffect(() => {
        let active = true
        fetchTopics()
            .then((topics) => {
                if (!active) return
                setTopicsById(Object.fromEntries(topics.map((topic) => [topic.topicId, topic])))
            })
            .catch(() => {}) // cast avatars are decorative - a failed fetch shouldn't block the clips list
        return () => { active = false }
    }, [])

    return (
        <main className="max-w-7xl mx-auto">
            <Navbar navLinks={navLinks} />
            
            <section className="c-space pt-24 pb-16">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <p className="text-white-600 mt-4 text-lg">
                        Highlights from the videos we&apos;ve filmed. Catch the full episodes on{' '}
                        <a
                            href="https://www.youtube.com/@rankandmatch"
                            target="_blank"
                            rel="noreferrer"
                            className="link-accent"
                        >
                            YouTube @rankandmatch
                        </a>.
                    </p>
                </div>

                {loading && (
                    <p className="text-white-600 text-center text-xl">Loading clips...</p>
                )}

                {!loading && collections.length === 0 && (
                    <p className="text-white-600 text-center text-xl">No clips yet, check back soon.</p>
                )}

                <div className="flex flex-col gap-8">
                    {collections.map((collection) => {
                        const fullEpisodeId = collection.clips.find((clip) => clip.type === 'video')?.youtubeId
                        const topic = topicsById[collection.topicId]
                        const cast = topic
                            ? [...new Set([...(topic.judges ?? []), ...(topic.contestants ?? []), ...(topic.castMembers ?? [])])]
                            : []

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

                                    {fullEpisodeId && (
                                        <a
                                            href={`https://www.youtube.com/watch?v=${fullEpisodeId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors shrink-0"
                                        >
                                            Watch full episode
                                            <img src="/assets/arrow-up.png" alt="" className="field-btn_arrow" />
                                        </a>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-between gap-4">
                                    <div className="flex flex-wrap gap-3 justify-start">
                                        {collection.clips.map((clip) => (
                                            <ClipCard key={clip.id} clip={{ ...clip, title: collection.title }} />
                                        ))}
                                    </div>
                                    <CastAvatars names={cast} />
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
