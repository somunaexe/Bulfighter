import Navbar from './sections/Navbar'
import { navLinks } from "./constants/index.js"
import Contact from './sections/Contact'
import Footer from './sections/Footer'
const App = () => {
  return (
    <main className="max-w-7xl mx-auto">
      <div className="absolute bg-[url('/assets/cherry.gif')] w-1/2 h-1/2 bg-cover bg-no-repeat" ></div>
      <Navbar navLinks={navLinks}/>
      <Contact /> 
      <Footer />
    </main>
  )
}

export default App