// Placeholder shown in place of a single topic row while topics are
// loading. Sizing mirrors ClipCard.jsx's actual video/short dimensions
// exactly, so there's no layout jump when the real content swaps in.
const ClipsSkeletonRow = () => (
    <div>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 mb-3">
            <div className="max-w-xl w-full">
                <div className="skeleton rounded-md h-7 w-2/3" />
                <div className="skeleton rounded-md h-4 w-1/2 mt-2" />
            </div>
            <div className="skeleton rounded-lg h-12 w-44 shrink-0" />
        </div>

        <div className="flex flex-wrap gap-3 justify-start items-start">
            <div className="skeleton rounded-xl w-full aspect-video sm:w-auto sm:flex-shrink-0 sm:h-40 md:h-48" />
            <div className="skeleton rounded-xl w-[calc((100%-3.5rem-1.5rem)/2)] flex-shrink-0 aspect-[9/16] sm:w-auto sm:h-40 md:h-48" />
            <div className="skeleton rounded-xl w-[calc((100%-3.5rem-1.5rem)/2)] flex-shrink-0 aspect-[9/16] sm:w-auto sm:h-40 md:h-48" />

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

const ROW_COUNT = 3

const ClipsSkeleton = () => (
    <div className="flex flex-col gap-8">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
            <ClipsSkeletonRow key={index} />
        ))}
    </div>
)

export default ClipsSkeleton
