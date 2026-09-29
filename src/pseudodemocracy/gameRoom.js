// Lobby data access: creating/joining a room and watching who's in it live.
// This is Phase 1 (lobby only) - the actual round loop (exam/vote/role
// draw/etc.) is a separate follow-up once this is working end to end.
//
// Firestore layout:
//   games/{roomCode}                - { hostUid, status, createdAt }
//   games/{roomCode}/players/{uid}  - { name, joinedAt, isHost }
// status is 'lobby' | 'active' | 'ended'. The round-loop fields (whose
// term it is, treasury, votes, etc.) get added to the games/{roomCode}
// doc once Phase 2 starts.
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore'
import { db, ensureSignedIn } from './firebase.js'

// Excludes 0/O and 1/I so a code read aloud on a call isn't ambiguous.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 4

function randomCode() {
    let code = ''
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
    }
    return code
}

async function findUnusedCode() {
    for (let attempt = 0; attempt < 10; attempt++) {
        const code = randomCode()
        const snap = await getDoc(doc(db, 'games', code))
        if (!snap.exists()) return code
    }
    throw new Error('Could not find an unused room code, try again')
}

export async function createRoom(hostName) {
    const user = await ensureSignedIn()
    const roomCode = await findUnusedCode()

    await setDoc(doc(db, 'games', roomCode), {
        hostUid: user.uid,
        status: 'lobby',
        createdAt: serverTimestamp(),
    })
    await setDoc(doc(db, 'games', roomCode, 'players', user.uid), {
        name: hostName,
        isHost: true,
        joinedAt: serverTimestamp(),
    })

    return roomCode
}

export async function joinRoom(roomCode, playerName) {
    const user = await ensureSignedIn()
    const gameRef = doc(db, 'games', roomCode)
    const gameSnap = await getDoc(gameRef)

    if (!gameSnap.exists()) {
        throw new Error(`No game found with room code "${roomCode}"`)
    }
    if (gameSnap.data().status !== 'lobby') {
        throw new Error('That game has already started')
    }

    await setDoc(doc(db, 'games', roomCode, 'players', user.uid), {
        name: playerName,
        isHost: false,
        joinedAt: serverTimestamp(),
    })

    return roomCode
}

export function subscribeToRoom(roomCode, callback) {
    return onSnapshot(doc(db, 'games', roomCode), (snap) => {
        callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
}

export function subscribeToPlayers(roomCode, callback) {
    const playersQuery = query(collection(db, 'games', roomCode, 'players'), orderBy('joinedAt', 'asc'))
    return onSnapshot(playersQuery, (snap) => {
        callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() })))
    })
}

export async function startGame(roomCode) {
    await updateDoc(doc(db, 'games', roomCode), { status: 'active' })
}
