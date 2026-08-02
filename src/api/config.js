// Base URLs for the site's Lambda endpoints. Kept out of source control via
// .env (see .env.example for the required keys) so they aren't committed to
// git - note this does NOT hide them from end users, since a browser app has
// to call these URLs directly; it only keeps them out of the repo itself.
export const TOPICS_API_URL = import.meta.env.VITE_TOPICS_API_URL
export const INTERESTS_API_URL = import.meta.env.VITE_INTERESTS_API_URL
export const CONSENTS_API_URL = import.meta.env.VITE_CONSENTS_API_URL
export const CONSENT_INVITE_API_URL = import.meta.env.VITE_CONSENT_INVITE_API_URL
export const ADMIN_AUTH_API_URL = import.meta.env.VITE_ADMIN_AUTH_API_URL
