import { useState } from 'react'

const ClipCard = ({ clip }) => {
    const { type, youtubeId, start, title } = clip
    const [playing, setPlaying] = useState(false)
    const [thumbFailed, setThumbFailed] = useState(false)
    const isShort = type === 'short'

    const embedSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1${start ? `&start=${start}` : ''}`

    return (
        <div
            className={`
                relative overflow-hidden surface-card
                ${isShort ? 'w-[calc((100%-3.5rem-1.5rem)/2)] flex-shrink-0 aspect-[9/16] sm:w-auto sm:h-40 md:h-48' : 'w-full aspect-video sm:w-auto sm:flex-shrink-0 sm:h-40 md:h-48'}
            `}
        >
            {isShort && (
                <span className="absolute top-2 left-2 z-10 text-xs font-semibold uppercase tracking-wide text-white bg-black/70 px-2 py-1 rounded-full">
                    Short
                </span>
            )}

            {playing ? (
                <iframe
                    src={embedSrc}
                    title={title || 'Bulfighter clip'}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play ${title || 'clip'}`}
                    className="group w-full h-full block"
                >
                    {!thumbFailed && (
                        <img
                            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt={title || 'Video thumbnail'}
                            loading="lazy"
                            onError={() => setThumbFailed(true)}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <span className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 group-hover:bg-[rgb(var(--theme-accent))] transition-colors">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </span>
                    </span>
                </button>
            )}
        </div>
    )
}

export default ClipCard
