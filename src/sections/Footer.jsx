const Footer = () => {
  return (
    // bottom-0/left-0/z-20 only affect a POSITIONED element (fixed/sticky/
    // absolute/relative) - this footer is none of those, so all three were
    // no-ops. The actual fix lives one level up: each page's <main> is now
    // min-h-screen + flex flex-col, with the content between Navbar and
    // Footer set to flex-1, so THIS footer naturally lands at the true
    // bottom of the viewport on short pages instead of floating in the
    // middle - no position/z-index needed here at all.
    //
    // This footer lives inside <main className="max-w-7xl mx-auto">, so its
    // own box is capped to that same 1280px column - it can't touch the
    // real screen edges just by being a normal child of it. Navbar solves
    // this by being position: fixed (which ignores ancestor width entirely),
    // but this footer needs to stay in normal document flow for the
    // stick-to-the-bottom-on-short-pages behaviour above, so it needs a
    // different trick: w-screen makes it exactly viewport-wide, and
    // "relative left-1/2 -mx-[50vw]" re-centers a viewport-wide box on the
    // viewport regardless of how narrow/off-center its actual parent is -
    // this is the standard "full-bleed section inside a centered max-width
    // container" technique. The inner div then re-applies max-w-7xl mx-auto
    // so the actual text still lines up with the rest of the page's content
    // column - only the background/border go edge-to-edge, same look as
    // Navbar's outer <header> + inner max-w-7xl div split.
    <footer className="navbar-surface w-screen relative left-1/2 -mx-[50vw] mt-10 border-t border-black-300">
        <div className="max-w-7xl mx-auto c-space py-7 flex justify-between items-center flex-wrap gap-3 text-sm">
            <div className="text-white-700 flex gap-2">
                <p>Terms & Conditions</p>
                <p>|</p>
                <p>Privacy Policy</p>
            </div>
            <p className="text-white-700">© 2026 Bulfighter. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer