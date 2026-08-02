import { requestJson } from './http.js'
import { TOPICS_API_URL } from './config.js'

export async function getTopics() {
    const { response, data } = await requestJson(TOPICS_API_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    return data.topics
}
