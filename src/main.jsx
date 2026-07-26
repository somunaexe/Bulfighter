import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './admin/Admin.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import ConsentsForm from './sections/ConsentForm.jsx'
import Clips from './sections/Clips.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Page for customers */}
        <Route path="/" element={<App />} />

        {/* Fallback / Default Route */}
        <Route path="*" element={<App />} />

        <Route path="/clips" element={<Clips />} />

        {/* Page for casted members */}
        <Route path="consent" element={<ConsentsForm />} />

        {/* ADMIN Pages for Somuna and Wunmi */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
