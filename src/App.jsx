import Navbar from './sections/Navbar'
import { navLinks } from "./constants/index.js"
import Contact from './sections/Contact'
import Footer from './sections/Footer'
const App = () => {
  return (
    <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
      <div className="absolute bg-[url('/assets/cherry.gif')] w-1/2 h-1/2 bg-cover bg-no-repeat" ></div>
      <Navbar navLinks={navLinks}/>
      {/* flex-1: grows to fill any leftover height so Footer lands at the
          true bottom of the screen instead of floating above it */}
      <div className="flex-1">
        <Contact />
      </div>
      <Footer />
    </main>
  )
}

export default App