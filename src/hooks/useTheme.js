import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ram_theme'

// Same two files index.html's bootstrap script picks between on first paint
// - kept in sync here so toggling later doesn't just update data-theme but
// leave the tab icon on whichever theme the page happened to load with.
const FAVICON_LIGHT = 'assets/bulfighter-logo1.png'
const FAVICON_DARK = 'assets/bulfighter-logo1-dark.png'

const getInitialTheme = () => (localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light')

export const useTheme = () => {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)

        const favicon = document.querySelector('link[rel="icon"]')
        if (favicon) favicon.href = theme === 'dark' ? FAVICON_DARK : FAVICON_LIGHT
    }, [theme])

    const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

    return [theme, toggleTheme]
}
