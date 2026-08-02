import { requestJson } from './http.js'
import { CONSENT_INVITE_API_URL } from './config.js'

// Validates an interest's invite token/id and returns the matched interest
// record(s), used by the public consent form to confirm the link is real.
export async function getInterestByToken(interestId) {
    const { data } = await requestJson(`${CONSENT_INVITE_API_URL}?interestId=${interestId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    return data
}

// Admin-triggered "send the consent form" email for a given interest.
export async function sendConsentInvite(payload) {
    const { response, data } = await requestJson(CONSENT_INVITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    return data
}
