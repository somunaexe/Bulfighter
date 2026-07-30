import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ram_theme'

const getInitialTheme = () => (localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light')

export const useTheme = () => {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

    return [theme, toggleTheme]
}
