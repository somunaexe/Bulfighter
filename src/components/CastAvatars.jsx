// Headshot placeholder stack - shows each cast member's initial since no
// profile images are stored yet. Swap the <span> for an <img> per person
// once photos exist. Sized to match ClipCard's height so the cast reads as
// a prominent feature, not a small icon row.
const CastAvatars = ({ names }) => {
    if (!names?.length) return null

    return (
        <div className="flex items-center" aria-label={`Cast: ${names.join(', ')}`}>
            {names.map((name, index) => (
                <span
                    key={name}
                    title={name}
                    className={`
                        w-18 h-18 sm:w-24 sm:h-24 md:w-30 md:h-30 rounded-full border-4 border-black-100 bg-black-500
                        flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-semibold text-white-800
                        ${index > 0 ? '-ml-8 sm:-ml-10 md:-ml-12' : ''}
                    `}
                >
                    {name.trim().charAt(0).toUpperCase()}
                </span>
            ))}
        </div>
    )
}

export default CastAvatars
