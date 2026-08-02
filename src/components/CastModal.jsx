import { useEffect, useState } from 'react'

// Placeholder tile count per person in the "more photos" column below their
// big avatar - once real photos exist, swap this for an actual photos array
// per person (see the photoUrl field getCastNames.js already returns) and
// map real <img> tiles instead of these lettered squares.
const PHOTO_PLACEHOLDER_COUNT = 3

const CastModal = ({ isOpen, onClose, names }) => {
    const [mounted, setMounted] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setMounted(true)
            const raf = requestAnimationFrame(() => setVisible(true))
            return () => cancelAnimationFrame(raf)
        }

        setVisible(false)
        const timeout = setTimeout(() => setMounted(false), 200)
        return () => clearTimeout(timeout)
    }, [isOpen])

    useEffect(() => {
        if (!mounted) return

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [mounted, onClose])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
                className={`
                    relative surface-card w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 sm:p-8
                    transition-all duration-200
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white-600 hover:text-white-800 transition-colors"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round">
                        <path d="M6 6l12 12M6 18L18 6" />
                    </svg>
                </button>

                <h3 className="head-text text-2xl mb-6">Cast</h3>

                <div className="flex flex-wrap gap-6">
                    {names.map((name) => {
                        const initial = name.trim().charAt(0).toUpperCase()
                        return (
                            <div key={name} className="flex flex-col items-center gap-3 w-24">
                                <span className="w-20 h-20 rounded-full bg-black-500 flex items-center justify-center text-3xl font-semibold text-white-800">
                                    {initial}
                                </span>
                                <p className="text-sm font-semibold text-white-800 text-center">{name}</p>

                                <div className="flex flex-col gap-2 w-full">
                                    {Array.from({ length: PHOTO_PLACEHOLDER_COUNT }).map((_, i) => (
                                        <span
                                            key={i}
                                            className="aspect-square w-full rounded-lg bg-black-500 flex items-center justify-center text-lg font-semibold text-white-800"
                                        >
                                            {initial}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CastModal
