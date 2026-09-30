// Unions (Activist/Agbero) - a union can recruit, kick or act (Confront
// excepted - see below) only on the unionizer's turn, or on the Leader's
// turn if the Leader is a member.
export function canActOnTurn(union, currentTurnUid, leaderUid) {
    if (currentTurnUid === union.unionizerUid) return true
    return currentTurnUid === leaderUid && union.memberUids.includes(leaderUid)
}

// Recruiting is free but can't take the Leader or a member of another union.
export function canRecruit(targetUid, leaderUid, targetAlreadyInAUnion) {
    if (targetUid === leaderUid) return false
    return !targetAlreadyInAUnion
}

// A union that drops to 1 member dissolves.
export function shouldDissolve(memberCount) {
    return memberCount <= 1
}

// Activists double their union's total vote, automatically against the
// Leader, when confronting. "Double" is the article's current wording,
// not a separately-tracked live number.
export function activistConfrontVotesAgainst(unionSize) {
    return unionSize * 2
}

// Agberos steal 50 x union size from the Leader when confronting -
// personal gains, split evenly across members rather than going to the
// Capon alone (Agbero gains/losses are personal, not shared).
export function agberoConfrontSteal(unionSize, stealPerMember) {
    const total = unionSize * stealPerMember
    return { total, perMember: Math.floor(total / unionSize) }
}

// If the Leader is a member of the union, its actions target a rival of
// the Leader's choice instead of the Leader themselves.
export function resolveTarget(union, leaderUid, chosenRivalUid) {
    return union.memberUids.includes(leaderUid) ? chosenRivalUid : leaderUid
}
