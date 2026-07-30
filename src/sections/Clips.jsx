import { useEffect, useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ClipCard from '../components/ClipCard.jsx'
import { navLinks } from '../constants/index.js'
import { clipCollections } from '../constants/clips.js'

// Video links aren't in the Topics Lambda yet - this stands in for that
// fetch so swapping in the real request later is a one-line change.
const fetchClips = async () => clipCollections

const Clips = () => {
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        fetchClips().then((data) => {
            if (!active) return
            setCollections(data)
            setLoading(false)
        })
        return () => { active = false }
    }, [])

    return (
        <main className="max-w-7xl mx-auto">
            <Navbar navLinks={navLinks} />
            
            <section className="c-space pt-32 pb-20">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    {/* <p className="text-white-600 text-lg"> */}
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

                <div className="flex flex-col gap-16">
                    {collections.map((collection) => (
                        <div key={collection.id}>
                            <h2 className="text-2xl font-semibold text-white mb-6">
                                {collection.title}
                            </h2>
                            <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                                {collection.clips.map((clip) => (
                                    <ClipCard key={clip.id} clip={{ ...clip, title: collection.title }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default Clips
