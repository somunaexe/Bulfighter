import { useState } from "react"
// import { navLinks } from "../constants/index.js"
import Links from "../components/Links.jsx"
import { Link } from "react-router"

const Navbar = ({navLinks}) => {
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
                <button
                onClick={toggleMenu}
                className="
                text-neutral-400
                hover:text-white
                focus:outline-none
                sm:hidden
                flex"
                aria-label="Toggle menu">
                    <img 
                    src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"} 
                    alt="toggle" 
                    className="w-6 h-6"/>
                </button>
                <nav className="sm:flex hidden">
                    <NavItems />
                </nav>
            </div>
        </div>
        <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <nav className="p-5">
                <NavItems />
            </nav>
        </div>
    </header>
  )
}

export default Navbar