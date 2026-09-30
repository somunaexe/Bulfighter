import { useEffect, useState } from 'react'
import { auth } from './firebase.js'
import { subscribeToRound, advancePhaseAfterInauguration, midTermThreshold } from './gameEngine.js'
import Scoreboard from './game/Scoreboard.jsx'
import CoupPanel from './game/CoupPanel.jsx'
import CorruptionPanel from './game/CorruptionPanel.jsx'
import HealthPanel from './game/HealthPanel.jsx'
import UnionPanel from './game/UnionPanel.jsx'
import WillsPanel from './game/WillsPanel.jsx'
import ExamPanel from './game/ExamPanel.jsx'
import VotePanel from './game/VotePanel.jsx'
import RoleDrawPanel from './game/RoleDrawPanel.jsx'
import AmendmentPanel from './game/AmendmentPanel.jsx'
import LevyPanel from './game/LevyPanel.jsx'
import TurnsPanel from './game/TurnsPanel.jsx'
import TermEndPanel from './game/TermEndPanel.jsx'

// Routes to the right panel for the room's current phase. See
// gameEngine.js for the full phase list and what advances each one.
const GameBoard = ({ roomCode, room: game, players }) => {
    const [roundState, setRoundState] = useState(null)

    useEffect(() => {
        if (!game.round) return
        return subscribeToRound(roomCode, game.round, setRoundState)
    }, [roomCode, game.round])

    const me = players.find((p) => p.uid === auth.currentUser?.uid)
    const leader = players.find((p) => p.uid === game.leaderUid)

    if (!me || !roundState) {
        return <div className="surface-card p-6 mb-6 text-center text-white-600">Loading round...</div>
    }

    const activePlayerCount = players.filter((p) => !p.eliminated).length

    const renderPhase = () => {
        switch (game.phase) {
            case 'exam':
                return (
                    <ExamPanel
                        roomCode={roomCode}
                        round={game.round}
                        roundState={roundState}
                        me={me}
                        players={players}
                        isLeader={me.uid === game.leaderUid}
                    />
                )
            case 'vote':
                return <VotePanel roomCode={roomCode} round={game.round} roundState={roundState} me={me} players={players} />
            case 'roleDraw':
                return <RoleDrawPanel roomCode={roomCode} me={me} leaderUid={game.leaderUid} />
            case 'inauguration':
                if (game.amendmentsUsedThisTerm.inauguration && !game.pendingAmendment) {
                    return (
                        <div className="surface-card p-6 mb-6 text-center">
                            <button onClick={() => advancePhaseAfterInauguration(roomCode)} className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors">
                                Continue to Levy
                            </button>
                        </div>
                    )
                }
                return <AmendmentPanel roomCode={roomCode} game={game} me={me} players={players} window="inauguration" />
            case 'levy':
                return <LevyPanel roomCode={roomCode} game={game} me={me} />
            case 'turns': {
                const threshold = midTermThreshold(activePlayerCount)
                if (game.turnsCompletedUids.length >= threshold && !game.amendmentsUsedThisTerm.midterm) {
                    return <AmendmentPanel roomCode={roomCode} game={game} me={me} players={players} window="midterm" />
                }
                return <TurnsPanel roomCode={roomCode} game={game} me={me} players={players} />
            }
            case 'farewell':
                if (game.amendmentsUsedThisTerm.farewell && !game.pendingAmendment) {
                    return <TermEndPanel roomCode={roomCode} game={game} players={players} />
                }
                return <AmendmentPanel roomCode={roomCode} game={game} me={me} players={players} window="farewell" />
            default:
                return null
        }
    }

    return (
        <div>
            <Scoreboard players={players} leaderUid={game.leaderUid} />
            <CoupPanel roomCode={roomCode} me={me} leader={leader} players={players} />
            <CorruptionPanel roomCode={roomCode} me={me} />
            <HealthPanel roomCode={roomCode} game={game} me={me} players={players} />
            <UnionPanel roomCode={roomCode} game={game} me={me} players={players} />
            <WillsPanel roomCode={roomCode} game={game} me={me} players={players} />
            {renderPhase()}
        </div>
    )
}

export default GameBoard
