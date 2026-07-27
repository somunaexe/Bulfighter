import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import Navbar from '../sections/Navbar'
import { adminLinks } from '../constants/index.js'
import Interests from './Interests.jsx'
import Consents from './Consents.jsx'
import Topics from './Topics.jsx'

const SESSION_KEY = 'ram_admin_token'

// Deploy the paired Lambda in src/backend/adminAuth.js and put its API
// Gateway URL here (via a .env file: VITE_ADMIN_AUTH_URL=...). The password
// is checked server-side there - nothing secret ships in this bundle.
// const ADMIN_AUTH_URL = import.meta.env.VITE_ADMIN_AUTH_URL

const Admin = () => {
    const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY))
    const [password, setPassword] = useState('')
    const [checking, setChecking] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        // if (!ADMIN_AUTH_URL) {
        //     setError('Admin login endpoint is not configured yet.')
        //     return
        // }

        setChecking(true)
        try {
            const response = await fetch('https://fheqb7045j.execute-api.eu-north-1.amazonaws.com/dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })
            const data = await response.json()

            if (!response.ok || !data.token) {
                setError(data.error || 'Incorrect password')
                return
            }

            sessionStorage.setItem(SESSION_KEY, data.token)
            setToken(data.token)
        } catch {
            setError('Could not reach the login service, please try again.')
        } finally {
            setChecking(false)
            setPassword('')
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem(SESSION_KEY)
        setToken(null)
    }

    if (!token) {
        return (
            <main className="max-w-7xl mx-auto min-h-screen flex items-center justify-center c-space">
                <form onSubmit={handleLogin} className="surface-card p-8 w-full max-w-sm space-y-5">
                    <h1 className="head-text text-2xl">Admin Login</h1>
                    <label className="space-y-3 block">
                        <p className="field-label">Password <span className="text-red-500">*</span></p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="field-input"
                            placeholder="Enter password"
                            required
                        />
                    </label>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="field-btn w-full" disabled={checking}>
                        {checking ? 'Checking...' : 'Log in'}
                    </button>
                </form>
            </main>
        )
    }

    return (
        <main className="max-w-7xl mx-auto">
            <Navbar navLinks={adminLinks} admin />

            <div className="c-space pt-28 flex justify-end">
                <button onClick={handleLogout} className="text-white-600 hover:text-white text-sm transition-colors">
                    Log out
                </button>
            </div>

            <Routes>
                <Route index element={<Navigate to="/admin/interests" replace />} />
                <Route path="interests" element={<Interests />} />
                <Route path="consents" element={<Consents />} />
                <Route path="topics" element={<Topics />} />
            </Routes>
        </main>
    )
}

export default Admin
