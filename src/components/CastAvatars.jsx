// Headshot placeholder stack - shows each cast member's initial since no
// profile images are stored yet. Swap the <span> for an <img> per person
// once photos exist.
const CastAvatars = ({ names }) => {
    if (!names?.length) return null

    return (
        <div className="flex items-center" aria-label={`Cast: ${names.join(', ')}`}>
            {names.map((name, index) => (
                <span
                    key={name}
                    title={name}
                    className={`
                        w-9 h-9 rounded-full border-2 border-black-100 bg-black-500
                        flex items-center justify-center text-sm font-semibold text-white-800
                        ${index > 0 ? '-ml-3' : ''}
                    `}
                >
                    {name.trim().charAt(0).toUpperCase()}
                </span>
            ))}
        </div>
    )
}

export default CastAvatars
