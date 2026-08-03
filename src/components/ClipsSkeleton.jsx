// One placeholder "topic row" - stands in for a single real topic block in
// Clips.jsx (title + description + watch button + clip cards + cast
// avatars) while the real data is still loading. Every box below just uses
// the "skeleton" CSS class (defined in index.css) for its gray fill + the
// animated shimmer sweep - the actual work in this file is getting each
// box's SIZE to match its real counterpart, so swapping from skeleton to
// real content doesn't visibly jump around once the data arrives.
const ClipsSkeletonRow = () => (
    <div>
        {/* Mimics the title/description (left) + "Watch full episode"
            button (right) row from Clips.jsx. These don't need to match
            any specific component's size like the boxes below do - they're
            just plain bars sized by eye (h-7/h-4 for two lines of text,
            h-12 w-44 roughly matching the real button's height/width). */}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 mb-3">
            <div className="max-w-xl w-full">
                <div className="skeleton rounded-md h-7 w-2/3" />
                <div className="skeleton rounded-md h-4 w-1/2 mt-2" />
            </div>
            <div className="skeleton rounded-lg h-12 w-44 shrink-0" />
        </div>

        <div className="flex flex-wrap gap-3 justify-start items-start">
            {/* These three boxes' className strings are copy-pasted from
                ClipCard.jsx's own sizing classes (not approximated) - one
                "video" shape (16:9, full width on mobile / fixed height on
                desktop) and two "short" shapes (9:16 vertical, half-width on
                mobile). Copying the exact classes, rather than eyeballing
                similar-looking ones, is what makes the swap-in seamless. */}
            <div className="skeleton rounded-xl w-full aspect-video sm:w-auto sm:flex-shrink-0 sm:h-40 md:h-48" />
            <div className="skeleton rounded-xl w-[calc((100%-3.5rem-1.5rem)/2)] flex-shrink-0 aspect-[9/16] sm:w-auto sm:h-40 md:h-48" />
            <div className="skeleton rounded-xl w-[calc((100%-3.5rem-1.5rem)/2)] flex-shrink-0 aspect-[9/16] sm:w-auto sm:h-40 md:h-48" />

            {/* Two overlapping circles stand in for the cast avatar stack
                (CastAvatars.jsx). Mobile and desktop render completely
                different circle sizes/layouts there (a single small column
                vs. larger circles that can wrap into rows), so this mimics
                that same sm:hidden / hidden sm:flex split rather than
                trying to make one set of circles work for both. */}
            <div className="flex-shrink-0 ml-auto flex flex-col items-center sm:hidden">
                <span className="skeleton w-14 h-14 rounded-full border-2 border-black-100" />
                <span className="skeleton w-14 h-14 rounded-full border-2 border-black-100 -mt-7" />
            </div>
            <div className="hidden sm:flex flex-shrink-0 ml-auto">
                <span className="skeleton w-24 h-24 rounded-full border-2 border-black-100" />
                <span className="skeleton w-24 h-24 rounded-full border-2 border-black-100 -ml-10" />
            </div>
        </div>
    </div>
)

// How many placeholder rows to show while loading. Not tied to anything
// real (we don't know yet how many topics are coming) - 3 is just enough
// to suggest "a list is coming" without the page looking mostly empty.
const ROW_COUNT = 3

const ClipsSkeleton = () => (
    <div className="flex flex-col gap-8">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
            <ClipsSkeletonRow key={index} />
        ))}
    </div>
)

export default ClipsSkeleton
