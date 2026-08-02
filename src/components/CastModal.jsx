import { useEffect, useRef, useState } from 'react'

// Placeholder photo count per person - once real photos exist, swap the
// lettered/text placeholders below for actual <img> tiles (see the
// photoUrl field getCastNames.js already returns), one per real photo
// instead of this fixed count.
const PHOTOS_PER_PERSON = 3
const SWIPE_THRESHOLD_PX = 50
// Desktop grid: size columns so exactly this many people are visible at
// once; beyond this the row overflows horizontally and scrolls.
const MAX_VISIBLE_DESKTOP = 3

// These mirror the Tailwind classes used elsewhere for the modal's large-
// screen width (max-w-7xl = 80rem, and c-space's sm:px-10 = 2.5rem each
// side). They're duplicated here as plain numbers because the column-width
// formula below needs to do real arithmetic with them - a Tailwind class
// name can't be divided by 3. If those classes change, update these too.
const DESKTOP_MAX_WIDTH_PX = 1280
const DESKTOP_HORIZONTAL_PADDING_PX = 80

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

    // A fixed column width, independent of how many people there are: always
    // 1/MAX_VISIBLE_DESKTOP of the full-size modal's content area. Anchoring
    // it to the viewport (min(100vw, ...)) rather than to the grid's own
    // container is what makes it stay the same size whether the modal ends
    // up full-width (MAX_VISIBLE_DESKTOP+ people) or shrunk to fit fewer
    // people below - it never has to ask its own container "how wide am I?"
    const desktopColumnWidth = `calc((min(100vw, ${DESKTOP_MAX_WIDTH_PX}px) - ${DESKTOP_HORIZONTAL_PADDING_PX}px) / ${MAX_VISIBLE_DESKTOP})`

    // How many of those fixed-width columns the modal itself should make
    // room for: capped at MAX_VISIBLE_DESKTOP, but shrinks for fewer people
    // so the card doesn't sit there full-width with one column and empty
    // space next to it.
    const visibleColumnCount = Math.min(names.length, MAX_VISIBLE_DESKTOP)

    // The modal's own large-screen width: enough for visibleColumnCount
    // columns, plus the same horizontal padding the content area uses
    // (c-space). When there are MAX_VISIBLE_DESKTOP+ people this comes out
    // to the same full width as before; below that, it's proportionally
    // narrower and centers itself (see justify-center on the overlay).
    const desktopCardWidth = `calc(${visibleColumnCount} * ${desktopColumnWidth} + ${DESKTOP_HORIZONTAL_PADDING_PX}px)`

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
        // items-end (instead of items-center) aligns the card to the BOTTOM of
        // this flex container's cross axis (vertical, since flex-direction is
        // the default "row"). justify-center still centers it horizontally -
        // the two are independent axes. Net effect: any leftover vertical
        // space collapses to the top, and the card's bottom edge sits flush
        // against the viewport's bottom edge (inset-0 pins this div to the
        // full screen, so "bottom of this container" IS "bottom of screen").
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
                // Set as a CSS custom property, not a plain inline `width`, because a
                // plain `width` style applies at EVERY screen size and would override
                // the mobile "w-full h-full" full-screen layout. A custom property does
                // nothing on its own - it only takes effect where the sm:w-[var(...)]
                // class below reads it, so mobile stays untouched.
                style={{ '--desktop-card-width': desktopCardWidth }}
                className={`
                    relative w-full h-full sm:h-auto overflow-hidden flex flex-col
                    transition-all duration-200
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                    ${isStoryView ? 'bg-black-100' : 'surface-card sm:rounded-b-none sm:w-[var(--desktop-card-width)] sm:max-h-[80vh]'}
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
                        {/* Sibling of the scrollable div below, not a child of it - this is
                            what keeps it fixed in place while the cast list scrolls. If it
                            were inside the scrolling div, "position: absolute" wouldn't save
                            it: absolute positioning only opts an element out of normal layout
                            flow, it doesn't opt it out of an ancestor's scrolling. */}
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

                        {/* flex-1 makes this fill whatever vertical space is left in the
                            outer flex column (the close button above takes up none, since
                            it's absolutely positioned). min-h-0 overrides flexbox's default
                            of never shrinking a flex item below its content's natural height
                            - without it, overflow-y-auto below would never actually trigger,
                            because the box would just keep growing taller instead of
                            capping and scrolling. */}
                        <div className="flex-1 min-h-0 overflow-y-auto c-space py-6 sm:py-8">
                            <h3 className="head-text !text-3xl mb-6">Cast</h3>

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

                            {/* Large screens: magazine-style grid, each person's own photos
                                flow with no gap/border between them, but a small gap between
                                different people hints there's more to scroll/browse through.
                                Every column is the SAME fixed width (desktopColumnWidth),
                                never a fraction ("1fr") of the available space, so it can't
                                stretch when there are few people or shrink when there are
                                many. Beyond MAX_VISIBLE_DESKTOP people the grid is simply
                                wider than this overflow-x-auto wrapper and scrolls; below
                                that count, the wrapper (and the whole modal - see
                                desktopCardWidth above) is sized to match exactly, so there's
                                no leftover empty space. */}
                            <div className="hidden sm:block overflow-x-auto">
                                <div
                                    className="grid gap-x-2"
                                    style={{ gridTemplateColumns: `repeat(${names.length}, ${desktopColumnWidth})` }}
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
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CastModal
