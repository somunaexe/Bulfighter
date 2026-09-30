// Fisher-Yates shuffle - used to seed each room's three card decks
// (Performance, Settlement, Scandal) in random order at game start, and to
// reshuffle a deck once it's been fully drawn through.
export function shuffle(items) {
    const arr = [...items]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

// Draws the next card number from a deck's shuffled order, reshuffling
// automatically once every card has been drawn (a fresh shuffle of all
// card numbers, not just the discards - simpler than tracking a discard
// pile separately, and reshuffling "the whole deck" is normal for a lot of
// party games).
export function drawFromDeck(deckOrder, drawIndex, allCardNumbers) {
    if (drawIndex >= deckOrder.length) {
        const reshuffled = shuffle(allCardNumbers)
        return { cardNumber: reshuffled[0], deckOrder: reshuffled, drawIndex: 1 }
    }
    return { cardNumber: deckOrder[drawIndex], deckOrder, drawIndex: drawIndex + 1 }
}
