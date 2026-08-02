const ConfirmModal = ({isOpen, interestKey, children}) => {
    if(!isOpen) return null
    return (
        // p-4 keeps the card off the screen edges on small screens instead of
        // touching them corner-to-corner.
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10 p-4">
            {/*
                Was "w-100" - not a real Tailwind class (the default width
                scale stops at w-96), so it did nothing at all: the box had
                no width cap and would stretch to fill the screen. Replaced
                with a real max-width.

                Also had no height cap or scrolling: content (like the error
                text shown on a failed send) could grow the box taller than
                the viewport, and since it's centered with no way to scroll,
                the top of the box - including the close button, always the
                first child passed in - would render ABOVE the visible
                screen with no way to reach it. max-h + overflow-y-auto
                means it scrolls internally instead once it gets too tall.
            */}
            <div className="bg-black-600 p-6 rounded shadow-lg w-full max-w-md max-h-[85vh] overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

export default ConfirmModal