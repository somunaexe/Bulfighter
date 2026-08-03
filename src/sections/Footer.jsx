const Footer = () => {
  return (
    // bottom-0/left-0/z-20 only affect a POSITIONED element (fixed/sticky/
    // absolute/relative) - this footer is none of those, so all three were
    // no-ops. The actual fix lives one level up: each page's <main> is now
    // min-h-screen + flex flex-col, with the content between Navbar and
    // Footer set to flex-1, so THIS footer naturally lands at the true
    // bottom of the viewport on short pages instead of floating in the
    // middle - no position/z-index needed here at all.
    <footer className="navbar-surface c-space py-7 mt-10 border-t border-black-300 flex justify-between items-center flex-wrap gap-3 text-sm">
        <div className="text-white-700 flex gap-2">
            <p>Terms & Conditions</p>
            <p>|</p>
            <p>Privacy Policy</p>
        </div>
        <p className="text-white-700">© 2026 Bulfighter. All rights reserved.</p>
    </footer>
  )
}

export default Footer