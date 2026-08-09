// The one thing in the onboarding sheet that actually changes as new videos
// get cast: the list of topics currently being filmed. Update this array
// whenever that changes - OnboardingModal.jsx renders it directly and
// phrases its wording around however many topics are listed, so nothing
// else needs to change alongside it.
export const CURRENT_CASTING_TOPICS = [
    'Spotify Wrapped',
    'Food Order History',
    '3 Hot Takes',
]

// Matches the @bulfighter.exe handle already used for Instagram/Snapchat
// (see socialLinks in constants/index.js) - kept here rather than repeated
// inline in OnboardingModal.jsx so it only needs updating in one place.
export const ONBOARDING_CONTACT_EMAIL = 'bulfighter.exe@gmail.com'
