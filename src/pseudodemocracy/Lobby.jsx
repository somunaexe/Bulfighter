import { useEffect, useState } from 'react'
import { createRoom, joinRoom, subscribeToRoom, subscribeToPlayers } from './gameRoom.js'
import { initializeActiveGame } from './gameEngine.js'
import { auth } from './firebase.js'
import GameBoard from './GameBoard.jsx'

const Lobby = () => {
    const [name, setName] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [roomCode, setRoomCode] = useState(null)
    const [room, setRoom] = useState(null)
    const [players, setPlayers] = useState([])
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (!roomCode) return
        const unsubRoom = subscribeToRoom(roomCode, setRoom)
        const unsubPlayers = subscribeToPlayers(roomCode, setPlayers)
        return () => {
            unsubRoom()
            unsubPlayers()
        }
    }, [roomCode])

    const handleCreate = async () => {
        if (!name.trim()) return setError('Enter a name first')
        setBusy(true)
        setError('')
        try {
            const code = await createRoom(name.trim())
            setRoomCode(code)
        } catch (err) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    const handleJoin = async () => {
        if (!name.trim()) return setError('Enter a name first')
        if (!joinCode.trim()) return setError('Enter a room code')
        setBusy(true)
        setError('')
        try {
            const code = await joinRoom(joinCode.trim().toUpperCase(), name.trim())
            setRoomCode(code)
        } catch (err) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    const handleStart = async () => {
        setBusy(true)
        try {
            await initializeActiveGame(roomCode, players.map((p) => p.uid))
        } catch (err) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    if (roomCode && room) {
        const isHost = room.hostUid === auth.currentUser?.uid

        if (room.status === 'active') {
            return <GameBoard roomCode={roomCode} room={room} players={players} />
        }

        return (
            <div className="surface-card p-6 sm:p-8 mb-10">
                <p className="text-white-600">Room code</p>
                <p className="text-4xl font-bold tracking-widest text-[rgb(var(--theme-accent))] mb-4">{roomCode}</p>
                <p className="text-white-600 mb-2">Players ({players.length})</p>
                <ul className="space-y-1 mb-4">
                    {players.map((p) => (
                        <li key={p.uid} className="text-white-800">
                            {p.name} {p.isHost && <span className="text-white-600 text-sm">(host)</span>}
                        </li>
                    ))}
                </ul>
                {isHost ? (
                    <button
                        onClick={handleStart}
                        disabled={busy || players.length < 3}
                        className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                    >
                        {players.length < 3 ? `Need ${3 - players.length} more player(s)` : 'Start game'}
                    </button>
                ) : (
                    <p className="text-white-600">Waiting for the host to start...</p>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        )
    }

    return (
        <div className="surface-card p-6 sm:p-8 mb-10">
            <p className="font-semibold text-white-800 mb-4">Play online</p>
            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded-md bg-transparent border border-black-300"
            />
            <div className="flex flex-wrap gap-4 items-center">
                <button
                    onClick={handleCreate}
                    disabled={busy}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                >
                    Create a room
                </button>
                <span className="text-white-600">or</span>
                <input
                    type="text"
                    placeholder="Room code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="px-4 py-2 rounded-md bg-transparent border border-black-300 w-32 uppercase"
                />
                <button
                    onClick={handleJoin}
                    disabled={busy}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                >
                    Join
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}

export default Lobby
