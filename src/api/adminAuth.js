import { requestJson } from './http.js'
import { ADMIN_AUTH_API_URL } from './config.js'

// Returns both the raw response and parsed body since the caller needs to
// check response.ok *and* inspect data.token/data.error to decide success.
export async function loginAdmin(password) {
    return requestJson(ADMIN_AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    })
}
