import { useEffect, useRef, useState } from 'react'

// Placeholder photo count per person - once real photos exist, swap the
// lettered/text placeholders below for actual <img> tiles (see the
// photoUrl field getCastNames.js already returns), one per real photo
// instead of this fixed count.
const PHOTOS_PER_PERSON = 3
const SWIPE_THRESHOLD_PX = 50

const firstNameOf = (name) => name.trim().split(/\s+/)[0]

const CastModal = ({ isOpen, onClose, names }) => {
    const [mounted, setMounted] = useState(false)
    const [visible, setVisible] = useState(false)
    // Mobile only: 'list' shows the scrollable name row, 'story' is the
    // full-bleed Instagram-style photo viewer.
    const [view, setView] = useState('list')
    const [slideIndex, setSlideIndex] = useState(0)
    const dragStartX = useRef(null)

    // Flat sequence of every photo across every person, in order - moving
    // to the next slide past someone's last photo naturally lands on the
    // next person's first photo, since each person occupies a contiguous
    // run of PHOTOS_PER_PERSON slides.
    const slides = names.flatMap((name) =>
        Array.from({ length: PHOTOS_PER_PERSON }, (_, photoIndex) => ({ name, photoIndex }))
    )

    useEffect(() => {
        if (isOpen) {
            setMounted(true)
            const raf = requestAnimationFrame(() => setVisible(true))
            return () => cancelAnimationFrame(raf)
        }

        setVisible(false)
        const timeout = setTimeout(() => {
            setMounted(false)
            setView('list')
        }, 200)
        return () => clearTimeout(timeout)
    }, [isOpen])

    useEffect(() => {
        if (!mounted) return

        const onKeyDown = (e) => {
            if (e.key !== 'Escape') return
            if (view === 'story') {
                setView('list')
            } else {
                onClose()
            }
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [mounted, onClose, view])

    if (!mounted) return null

    const openStoryFor = (name) => {
        setSlideIndex(names.indexOf(name) * PHOTOS_PER_PERSON)
        setView('story')
    }

    const goToSlide = (index) => {
        setSlideIndex(Math.max(0, Math.min(slides.length - 1, index)))
    }

    const onDragStart = (e) => {
        dragStartX.current = e.clientX
    }
    const onDragEnd = (e) => {
        if (dragStartX.current === null) return
        const delta = e.clientX - dragStartX.current
        dragStartX.current = null
        if (delta <= -SWIPE_THRESHOLD_PX) goToSlide(slideIndex + 1)
        else if (delta >= SWIPE_THRESHOLD_PX) goToSlide(slideIndex - 1)
    }

    const currentSlide = slides[slideIndex]
    const isStoryView = view === 'story'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-5">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
                className={`
                    relative w-full h-full sm:h-auto overflow-hidden
                    transition-all duration-200
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                    ${isStoryView ? 'bg-black-100' : 'surface-card sm:max-w-2xl sm:max-h-[80vh] overflow-y-auto p-6 sm:p-8'}
                `}
            >
                {isStoryView ? (
                    <div className="sm:hidden absolute inset-0 flex flex-col">
                        <div className="flex items-center justify-between p-4">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                aria-label="Back to cast list"
                                className="text-white-800"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="text-white-800"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round">
                                    <path d="M6 6l12 12M6 18L18 6" />
                                </svg>
                            </button>
                        </div>

                        <div
                            className="flex-1 flex items-center justify-center select-none touch-pan-y"
                            onPointerDown={onDragStart}
                            onPointerUp={onDragEnd}
                        >
                            {currentSlide && (
                                <p className="text-white-800 text-2xl font-semibold text-center px-8">
                                    {firstNameOf(currentSlide.name)}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white-600 hover:text-white-800 transition-colors z-10"
                        >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round">
                                <path d="M6 6l12 12M6 18L18 6" />
                            </svg>
                        </button>

                        <h3 className="head-text text-2xl mb-6">Cast</h3>

                        {/* Small screens: scrollable row of names, tap opens the story viewer */}
                        <div className="sm:hidden overflow-x-auto pb-2">
                            <div className="flex gap-6 w-fit min-w-full mx-auto justify-center">
                                {names.map((name) => {
                                    const initial = name.trim().charAt(0).toUpperCase()
                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => openStoryFor(name)}
                                            className="flex flex-col items-center gap-2 shrink-0"
                                        >
                                            <span className="w-16 h-16 rounded-full bg-black-500 flex items-center justify-center text-2xl font-semibold text-white-800">
                                                {initial}
                                            </span>
                                            <p className="text-sm font-semibold text-white-800">{firstNameOf(name)}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Large screens: seamless magazine-style grid, no gap/border
                            between tiles, name overlaid on each person's first photo */}
                        <div
                            className="hidden sm:grid"
                            style={{ gridTemplateColumns: `repeat(${names.length}, 1fr)` }}
                        >
                            {names.flatMap((name, colIndex) =>
                                Array.from({ length: PHOTOS_PER_PERSON }, (_, rowIndex) => (
                                    <div
                                        key={`${name}-${rowIndex}`}
                                        style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 1 }}
                                        className="relative aspect-[3/4] bg-black-500 flex items-center justify-center overflow-hidden"
                                    >
                                        {rowIndex === 0 && (
                                            <p
                                                style={{ fontFamily: 'Georgia, serif' }}
                                                className="text-white-800 text-lg text-center px-2"
                                            >
                                                &ldquo;{firstNameOf(name)}&rdquo;
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CastModal
