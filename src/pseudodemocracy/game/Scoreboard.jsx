import { isCancelled } from '../gameEngine.js'

const Scoreboard = ({ players, leaderUid }) => (
    <div className="surface-card p-4 mb-6">
        <p className="font-semibold text-white-800 mb-2">Scoreboard</p>
        <div className="grid sm:grid-cols-2 gap-2">
            {players.map((p) => (
                <div key={p.uid} className="flex justify-between text-white-600">
                    <span>
                        {p.name}
                        {p.uid === leaderUid && <span className="text-[rgb(var(--theme-accent))] font-semibold"> (Leader)</span>}
                        {p.roles?.length > 0 && <span className="text-white-600"> ({p.roles.join(', ')})</span>}
                        {isCancelled(p.popularity || 0) && <span className="text-red-500"> CANCELLED</span>}
                        {p.frozen && <span className="text-red-500"> FROZEN</span>}
                        {p.sicknessRoundsRemaining > 0 && <span className="text-red-500"> SICK ({p.sicknessRoundsRemaining})</span>}
                        {p.immunityRoundsRemaining > 0 && <span className="text-[rgb(var(--theme-accent))]"> IMMUNE ({p.immunityRoundsRemaining})</span>}
                        {p.eliminated && <span className="text-red-500"> ELIMINATED</span>}
                    </span>
                    <span>
                        {p.roundsAsLeader || 0} rounds &middot; {p.psd ?? 0} PSD &middot; {p.popularity ?? 0} pop
                        {p.corruptionMarkers > 0 && <> &middot; {p.corruptionMarkers} corruption marker{p.corruptionMarkers === 1 ? '' : 's'}</>}
                    </span>
                </div>
            ))}
        </div>
    </div>
)

export default Scoreboard
