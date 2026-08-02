import { useState } from 'react'
import CastModal from './CastModal.jsx'

// Headshot placeholder stack - shows each cast member's initial since no
// profile images are stored yet. Swap the <span> for an <img> per person
// once photos exist. Sits alongside the clip cards, so it's sized to fit
// on the same line rather than dominate the row. Clicking opens a modal
// with bigger avatars and a column reserved for more photos per person.
const CastAvatars = ({ names }) => {
    const [modalOpen, setModalOpen] = useState(false)

    if (!names?.length) return null

    return (
        <>
            <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label={`View cast: ${names.join(', ')}`}
                className="flex flex-col sm:flex-row items-center flex-shrink-0 ml-auto"
            >
                {names.map((name, index) => (
                    <span
                        key={name}
                        title={name}
                        className={`
                            w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-black-100 bg-black-500
                            flex items-center justify-center text-lg sm:text-2xl font-semibold text-white-800
                            ${index > 0 ? '-mt-7 sm:mt-0 sm:-ml-10' : ''}
                        `}
                    >
                        {name.trim().charAt(0).toUpperCase()}
                    </span>
                ))}
            </button>

            <CastModal isOpen={modalOpen} onClose={() => setModalOpen(false)} names={names} />
        </>
    )
}

export default CastAvatars
