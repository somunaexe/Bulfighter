// Prints a room's raw Firestore state - useful for debugging what a bot
// (or a real game) actually did, without opening Firebase console or
// browser devtools.
// Usage: node inspect_room.mjs <roomCode>
import { getDoc, doc, collection, getDocs } from 'firebase/firestore'
import { db, ensureSignedIn } from '../../src/pseudodemocracy/firebase.js'

const roomCode = process.argv[2]
if (!roomCode) {
    console.error('Usage: node inspect_room.mjs <roomCode>')
    process.exit(1)
}

await ensureSignedIn()
const gameSnap = await getDoc(doc(db, 'games', roomCode))
if (!gameSnap.exists()) {
    console.error(`No game found with room code "${roomCode}"`)
    process.exit(1)
}
console.log('GAME:', JSON.stringify(gameSnap.data(), null, 2))

const round = gameSnap.data().round
if (round) {
    const roundSnap = await getDoc(doc(db, 'games', roomCode, 'rounds', String(round)))
    console.log('ROUND:', JSON.stringify(roundSnap.data(), null, 2))
}

const playersSnap = await getDocs(collection(db, 'games', roomCode, 'players'))
playersSnap.forEach((d) => console.log('PLAYER', d.id, JSON.stringify(d.data())))
process.exit(0)
