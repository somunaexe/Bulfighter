// Base URLs for the site's Lambda endpoints. Centralized here so every
// component calls through src/api/ instead of inlining its own fetch() and
// URL - this is the single place to update if an endpoint ever changes.
export const TOPICS_API_URL = 'https://m0umxkjpy6.execute-api.eu-north-1.amazonaws.com/dev'
export const INTERESTS_API_URL = 'https://9rbgl7kyu7.execute-api.eu-north-1.amazonaws.com/dev'
export const CONSENTS_API_URL = 'https://9llxstbhji.execute-api.eu-north-1.amazonaws.com/dev'
export const CONSENT_INVITE_API_URL = 'https://x12ex8za7c.execute-api.eu-north-1.amazonaws.com/dev'
export const ADMIN_AUTH_API_URL = 'https://fheqb7045j.execute-api.eu-north-1.amazonaws.com/dev'
export const CAST_NAMES_API_URL = 'https://xmlaj7xft3.execute-api.eu-north-1.amazonaws.com/dev'
