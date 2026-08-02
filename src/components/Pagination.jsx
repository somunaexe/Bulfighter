const Pagination = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                className="field-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="text-white-600 text-sm font-semibold">
                Page {page} of {totalPages}
            </span>
            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                className="field-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    )
}

export default Pagination
