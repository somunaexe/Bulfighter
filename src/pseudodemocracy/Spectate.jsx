import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { subscribeToRoom, subscribeToPlayers } from './gameRoom.js'
import GameBoard from './GameBoard.jsx'

// A read-only window onto a live room, for watching the chaos bot swarm
// play without needing a real player seat (no join, no name, no auth
// required - games/players/rounds are all publicly readable per
// firestore.rules). Open one of these per bot (or per player you care
// about) alongside your terminal logs: `?room=CODE&as=<uid>` pins a tab
// to one player's-eye view, so a crash in the terminal can be matched up
// against exactly what that player's screen looked like at the time.
//
// Every button on the board still works and will act as whoever you're
// viewing as - useful if you want to nudge a stuck bot by hand, but easy
// to fat-finger. The "Interact" toggle below defaults off, greying the
// board out (pointer-events disabled) until you deliberately turn it on.
const Spectate = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const roomParam = searchParams.get('room') || ''
    const asParam = searchParams.get('as') || ''

    const [roomCodeInput, setRoomCodeInput] = useState(roomParam)
    const [room, setRoom] = useState(null)
    const [players, setPlayers] = useState([])
    const [interact, setInteract] = useState(false)

    useEffect(() => {
        if (!roomParam) {
            setRoom(null)
            setPlayers([])
            return
        }
        const unsubRoom = subscribeToRoom(roomParam, setRoom)
        const unsubPlayers = subscribeToPlayers(roomParam, setPlayers)
        return () => {
            unsubRoom()
            unsubPlayers()
        }
    }, [roomParam])

    const watchRoom = () => {
        if (!roomCodeInput.trim()) return
        setSearchParams({ room: roomCodeInput.trim().toUpperCase() })
    }

    const setViewAs = (uid) => {
        setSearchParams(uid ? { room: roomParam, as: uid } : { room: roomParam })
    }

    if (!roomParam) {
        return (
            <div className="max-w-md mx-auto mt-24 surface-card p-6 sm:p-8">
                <p className="font-semibold text-white-800 mb-4">Spectate a room</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Room code"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-md bg-transparent border border-black-300 uppercase"
                    />
                    <button onClick={watchRoom} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                        Watch
                    </button>
                </div>
            </div>
        )
    }

    if (!room) {
        return <div className="max-w-md mx-auto mt-24 text-center text-white-600">Looking for room {roomParam}...</div>
    }

    const viewingAs = players.find((p) => p.uid === asParam) || players[0]

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="surface-card p-4 mb-6 flex flex-wrap items-center gap-3">
                <span className="text-white-600">Spectating room</span>
                <span className="font-bold tracking-widest text-[rgb(var(--theme-accent))]">{roomParam}</span>
                <span className="text-white-600">as</span>
                <select
                    value={viewingAs?.uid || ''}
                    onChange={(e) => setViewAs(e.target.value)}
                    className="px-2 py-1 rounded border border-black-300 bg-transparent"
                >
                    {players.map((p) => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
                <label className="flex items-center gap-2 ml-auto text-white-600 text-sm">
                    <input type="checkbox" checked={interact} onChange={(e) => setInteract(e.target.checked)} />
                    Interact (acts as {viewingAs?.name})
                </label>
            </div>

            {room.status !== 'active' ? (
                <div className="surface-card p-6 text-center text-white-600">
                    Waiting for the host to start ({players.length} joined)...
                </div>
            ) : viewingAs ? (
                <div className={interact ? '' : 'pointer-events-none opacity-90'}>
                    <GameBoard roomCode={roomParam} room={room} players={players} viewAsUid={viewingAs.uid} />
                </div>
            ) : (
                <div className="surface-card p-6 text-center text-white-600">No players in this room yet.</div>
            )}
        </div>
    )
}

export default Spectate
