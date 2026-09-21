import { requestJson } from './http.js'
import { EQUIPMENT_RENTAL_API_URL } from './config.js'

// Public "request to rent" submission from the Rentals page.
export async function submitRentalRequest(payload) {
    const { response, data } = await requestJson(EQUIPMENT_RENTAL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}`)
    }
    return data
}

// Admin-only list of every rental request ever submitted.
export async function getRentalRequests() {
    const { response, data } = await requestJson(EQUIPMENT_RENTAL_API_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    return data.rentals
}
