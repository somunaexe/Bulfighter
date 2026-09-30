// Re-exports the Pseudodemocracy handoff's canonical data files, rather than
// copying their contents - per the handoff's own rule #1 ("never retype a
// game number or article"), the website and the printed rulebook
// (pseudodemocracy/build/build_rulebook.js) must read the exact same files,
// so they can never quietly drift out of sync with each other.
// pseudodemocracy/data/ is the source of truth (CHANGES.md, 2026-09-30);
// pseudodemocracy/build/ now holds only the rulebook-generation tooling.
//
// This file just forwards the imports so the rest of the site's code
// doesn't need to know the real path depth (../../../pseudodemocracy/...)
// or juggle two separate import statements every time it needs both.
export { V, fmt, ord, notesList } from '../../pseudodemocracy/data/game_data.js'
export { default as constitutionChapters } from '../../pseudodemocracy/data/articles.js'

// data/cards.js exports { glossary, settlement, scandal, performance } as
// plain arrays (a card's number is just its position in the array - no
// separate {n, text} shape) - re-exported under the site's existing names.
export { default as cardData } from '../../pseudodemocracy/data/cards.js'
