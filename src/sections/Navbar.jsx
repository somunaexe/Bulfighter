import { useState } from "react"
// import { navLinks } from "../constants/index.js"
import Links from "../components/Links.jsx"
import ThemeToggle from "../components/ThemeToggle.jsx"
import { Link } from "react-router"

const Navbar = ({navLinks, onLogout}) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleMenu = () => setIsOpen((prevIsOpen) => !prevIsOpen)

    const NavItems = () => {
        return (
            <ul className="nav-ul">
                {navLinks.map(({id, href, name }) => (
                    <li key={id} className="nav-li">
                        <b><Link to={href} className="nav-li_a">{name}</Link></b>
                    </li>
                ))}
            </ul>
        )
    }
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-black-300">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
                <div className="flex items-center gap-5">
                    <a
                        href="/"
                        className="text-neutral-400 font-bold text-xl hover:text-brand-pink transition-colors">
                        Rank & Match
                    </a>
                    <Links />
                </div>
                <div className="flex items-center gap-3 sm:hidden">
                    <ThemeToggle />
                    <button
                    onClick={toggleMenu}
                    className="
                    text-neutral-400
                    hover:text-white
                    focus:outline-none
                    flex"
                    aria-label="Toggle menu">
                        <img
                        src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
                        alt="toggle"
                        className="w-6 h-6"/>
                    </button>
                </div>
                <nav className="sm:flex hidden items-center gap-6">
                    <NavItems />
                    <ThemeToggle />
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="text-sm font-semibold text-white-600 border border-black-500 rounded-md px-3 py-1.5 hover:text-white hover:border-brand-pink transition-colors"
                        >
                            Log out
                        </button>
                    )}
                </nav>
            </div>
        </div>
        <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <nav className="p-5 flex flex-col items-center gap-4">
                <NavItems />
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="text-sm font-semibold text-white-600 border border-black-500 rounded-md px-3 py-1.5 w-full hover:text-white hover:border-brand-pink transition-colors"
                    >
                        Log out
                    </button>
                )}
            </nav>
        </div>
    </header>
  )
}

export default Navbar
