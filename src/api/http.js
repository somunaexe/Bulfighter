// Thin fetch + JSON-parse helper shared by the api/ modules. Deliberately
// does not enforce a single error-handling contract (throw vs. return) since
// callers previously handled failures differently (some throw on !ok, some
// just inspect the parsed body) - this only cuts the fetch+parse boilerplate.
export async function requestJson(url, options) {
    const response = await fetch(url, options)
    const data = await response.json()
    return { response, data }
}
