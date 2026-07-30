import { useTheme } from '../hooks/useTheme.js'

const ThemeToggle = () => {
    const [theme, toggleTheme] = useTheme()
    const isLight = theme === 'light'

    return (
        <button
            type="button"
            onClick={toggleTheme}
            role="switch"
            aria-checked={isLight}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className="relative w-16 h-8 rounded-full bg-black-500 border border-black-300 shrink-0 transition-colors"
        >
            <span
                aria-hidden="true"
                className={`absolute top-0.5 left-0.5 w-7 h-7 rounded-full bg-brand-pink shadow-md transition-transform duration-200 ${isLight ? 'translate-x-8' : 'translate-x-0'}`}
            />
            <svg viewBox="0 0 24 24" className="absolute left-1.5 top-1.5 w-5 h-5 z-10 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <svg viewBox="0 0 24 24" className="absolute right-1.5 top-1.5 w-5 h-5 z-10 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        </button>
    )
}

export default ThemeToggle
