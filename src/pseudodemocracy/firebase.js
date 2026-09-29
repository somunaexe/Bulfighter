// Firebase project for Pseudodemocracy's realtime multiplayer state.
// This apiKey is not a secret - Firebase apps are meant to be initialized
// client-side, and access to data is controlled by Firestore Security
// Rules (server-side), not by hiding this config. Same reasoning as the
// hardcoded Lambda URLs in src/api/config.js.
import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyBGV2WuMRU2ZXVJWSKgiC_ZWW8I2xUP3Xs',
    authDomain: 'bulfighter-pseudodemocracy.firebaseapp.com',
    projectId: 'bulfighter-pseudodemocracy',
    storageBucket: 'bulfighter-pseudodemocracy.firebasestorage.app',
    messagingSenderId: '128231344077',
    appId: '1:128231344077:web:9431e59f4f062dd25be684',
}

const app = initializeApp(firebaseConfig)
// Firestore's default realtime transport (WebChannel streaming) hangs
// silently instead of erroring behind some corporate/proxy networks -
// auto-detecting long-polling instead is the documented fix, and it's
// harmless for players on ordinary connections too.
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
export const auth = getAuth(app)

// Every browser tab gets a stable anonymous uid with no login screen.
// Security rules use this uid to check "is this player editing their own
// seat" - it's identity, not a real account.
export function ensureSignedIn() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe()
                if (user) {
                    resolve(user)
                } else {
                    signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(reject)
                }
            },
            reject
        )
    })
}
