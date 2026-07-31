// Headshot placeholder stack - shows each cast member's initial since no
// profile images are stored yet. Swap the <span> for an <img> per person
// once photos exist. Sized to match ClipCard's height so it reads as part
// of the same row instead of a small aside tucked under the CTA.
const CastAvatars = ({ names }) => {
    if (!names?.length) return null

    return (
        <div
            className="flex flex-col items-center justify-between h-48 sm:h-64 md:h-80 py-1 flex-shrink-0"
            aria-label={`Cast: ${names.join(', ')}`}
        >
            {names.map((name) => (
                <span
                    key={name}
                    title={name}
                    className="w-10 h-10 rounded-full border-2 border-black-100 bg-black-500 flex items-center justify-center text-sm font-semibold text-white-800"
                >
                    {name.trim().charAt(0).toUpperCase()}
                </span>
            ))}
        </div>
    )
}

export default CastAvatars
