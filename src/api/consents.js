import { requestJson } from './http.js'
import { CONSENTS_API_URL } from './config.js'

export async function getConsents() {
    const { response, data } = await requestJson(CONSENTS_API_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    return data.consents
}

export async function submitConsent(payload) {
    const { data } = await requestJson(CONSENTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    return data
}
