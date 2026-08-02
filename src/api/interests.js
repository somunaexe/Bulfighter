import { requestJson } from './http.js'
import { INTERESTS_API_URL } from './config.js'

export async function getInterests() {
    const { response, data } = await requestJson(INTERESTS_API_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    return data.interests
}

// Public "show your interest" submission from the Contact form. Response
// carries pre-signed upload URLs (orderUrlsKey/spotifyUrlsKey) for the
// caller to PUT files to directly.
export async function createInterest(payload) {
    const { data } = await requestJson(INTERESTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    return data
}
