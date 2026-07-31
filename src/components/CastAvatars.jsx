// Headshot placeholder stack - shows each cast member's initial since no
// profile images are stored yet. Swap the <span> for an <img> per person
// once photos exist. Sits alongside the clip cards, so it's sized to fit
// on the same line rather than dominate the row.
const CastAvatars = ({ names }) => {
    if (!names?.length) return null

    return (
        <div className="flex items-center flex-shrink-0" aria-label={`Cast: ${names.join(', ')}`}>
            {names.map((name, index) => (
                <span
                    key={name}
                    title={name}
                    className={`
                        w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-black-100 bg-black-500
                        flex items-center justify-center text-lg sm:text-2xl font-semibold text-white-800
                        ${index > 0 ? '-ml-7 sm:-ml-10 md:-ml-12' : ''}
                    `}
                >
                    {name.trim().charAt(0).toUpperCase()}
                </span>
            ))}
        </div>
    )
}

export default CastAvatars
