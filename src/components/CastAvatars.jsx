import { useState } from 'react'
import CastModal from './CastModal.jsx'

// Small screens: single column, capped for viewing/UI sake - tapping still
// opens the modal with everyone regardless of this cap.
const MOBILE_VISIBLE_CAP = 10

// Large screens: the stack must never exceed the "Watch full episode"
// button's width (208px, measured live). At <=3 people the circles keep
// their original size/overlap (96px, 40px - an exact 208px fit for 3).
// Above that, circles shrink (same overlap fraction) so any row of up to
// MAX_ROW_SIZE stays within that same budget; beyond 5 people it wraps
// into further rows at that same (smaller) size instead of growing past
// the button's width. Looks like separate stacks once wrapped, but the
// whole thing is still one button - see the single onClick below.
const MAX_STACK_WIDTH = 208
const MAX_ROW_SIZE = 5
const BASE_SIZE = 96
const BASE_OVERLAP_FRACTION = 40 / 96

const sizeForRowLength = (n) => {
    if (n <= 3) return BASE_SIZE
    return MAX_STACK_WIDTH / (1 + (n - 1) * (1 - BASE_OVERLAP_FRACTION))
}

const chunk = (list, size) => {
    const chunks = []
    for (let i = 0; i < list.length; i += size) {
        chunks.push(list.slice(i, i + size))
    }
    return chunks
}

const CastAvatars = ({ names }) => {
    const [modalOpen, setModalOpen] = useState(false)

    if (!names?.length) return null

    const mobileNames = names.slice(0, MOBILE_VISIBLE_CAP)
    const rows = chunk(names, MAX_ROW_SIZE)
    const largeScreenSize = sizeForRowLength(Math.min(names.length, MAX_ROW_SIZE))
    const largeScreenOverlap = largeScreenSize * BASE_OVERLAP_FRACTION

    return (
        <>
            <button
                type="button"
                // onClick={() => setModalOpen(true)}
                aria-label={`View cast: ${names.join(', ')}`}
                className="flex-shrink-0 ml-auto"
            >
                <div className="flex flex-col items-center sm:hidden">
                    {mobileNames.map((name, index) => (
                        <span
                            key={name}
                            title={name}
                            className={`
                                w-14 h-14 rounded-full border-2 border-black-100 bg-black-500
                                flex items-center justify-center text-lg font-semibold text-white-800
                                ${index > 0 ? '-mt-7' : ''}
                            `}
                        >
                            {name.trim().charAt(0).toUpperCase()}
                        </span>
                    ))}
                </div>

                <div className="hidden sm:flex sm:flex-col sm:gap-1">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex items-center">
                            {row.map((name, index) => (
                                <span
                                    key={name}
                                    title={name}
                                    style={{
                                        width: largeScreenSize,
                                        height: largeScreenSize,
                                        marginLeft: index > 0 ? -largeScreenOverlap : 0,
                                        fontSize: Math.max(largeScreenSize * 0.28, 12),
                                    }}
                                    className="rounded-full border-2 border-black-100 bg-black-500 flex items-center justify-center font-semibold text-white-800"
                                >
                                    {name.trim().charAt(0).toUpperCase()}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </button>

            {/* <CastModal isOpen={modalOpen} onClose={() => setModalOpen(false)} names={names} /> */}
        </>
    )
}

export default CastAvatars
