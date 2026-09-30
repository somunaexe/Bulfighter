import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'

// Lazy-loaded per route so visiting one page (e.g. /pseudodemocracy)
// doesn't pull in every other page's code - App.jsx alone drags in the
// homepage's 3D/animation libraries (three.js, GSAP), which were
// previously loaded into every tab regardless of which route it was on.
const App = lazy(() => import('./App.jsx'))
const Admin = lazy(() => import('./admin/Admin.jsx'))
const ConsentsForm = lazy(() => import('./sections/ConsentForm.jsx'))
const Clips = lazy(() => import('./sections/Clips.jsx'))
const Rentals = lazy(() => import('./sections/Rentals.jsx'))
const Pseudodemocracy = lazy(() => import('./sections/Pseudodemocracy.jsx'))
const PseudodemocracySpectate = lazy(() => import('./pseudodemocracy/Spectate.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          {/* Page for customers */}
          <Route path="/" element={<App />} />

          {/* Fallback / Default Route */}
          <Route path="*" element={<App />} />

          <Route path="/clips" element={<Clips />} />

          <Route path="/rentals" element={<Rentals />} />

          <Route path="/pseudodemocracy" element={<Pseudodemocracy />} />
          <Route path="/pseudodemocracy/spectate" element={<PseudodemocracySpectate />} />

          {/* Page for casted members */}
          <Route path="consent" element={<ConsentsForm />} />

          {/* ADMIN Pages for Somuna and Wunmi */}
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
)
