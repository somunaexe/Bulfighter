// ============================================================
// THE single source of truth for every number in Pseudodemocracy.
// Rules, articles and the Quick-Start Summary all read from here.
// Change a value once here and every document updates.
// ============================================================

const V = {
  minPlayers: 3,
  boxPlayers: 10,                 // the box holds money for this many players

  // Money
  playerNotes:   { 1: 10, 5: 10, 10: 10, 20: 12, 50: 6, 100: 3 },   // per player
  treasuryNotes: { 1: 50, 5: 20, 10: 10, 20: 15, 50: 10, 100: 15 }, // extra reserve in the box

  // Popularity
  popMin: -50, popMax: 50,

  // Exam
  examQuestions: 5, examOptions: 2, passMark: 50,            // passMark is an article

  // Treasury income
  taxRate: 20,                                              // article
  levy: { start: 25, bandLow: 25, bandHigh: 50, shift: 10, trigger: 20, floor: 25 },

  // Coups (locked rules)
  coupCost: 300, coupGap: 20, coupedScore: '½',

  // Cards: after a Performance card, draw a Result card
  goodCard: 'Settlement', badCard: 'Scandal',
  corruption: { limit: 3, pop: 30, fine: 200, wait: 3 },   // corruption markers (card glossary)

  // Votes
  discussionMinutes: 1, malpracticeFine: 25,                // fine is an article
  amendVote: 1,                                             // +1 / -1 per vote deciding whether an amendment stands (see articles.js/CHANGES.md)
  amendPenalty: 100,                                        // failed amendment check
  // Base swing per current number of active players - used for performance
  // votes (good/bad consensus) AND to size the Leader's popularity swing
  // from an amendment vote (the vote's for/against COUNT still decides
  // whether the amendment stands - amendVote above - this swing only
  // scales the resulting popularity change).
  swing: [['3', 10], ['4', 7], ['5', 6], ['6', 5], ['7', 4], ['8–10', 3], ['11+', 1]],

  // Health
  doctorCharges: 2, agboRounds: 1, concoctionRounds: 2,

  // Unions
  unionStart: 1, unionMin: 2, agberoSteal: 50, activistVote: 'double',

  // Inheritance
  nepoDebuff: [30, 20, 10],
};

// ---- Derived values (computed, never typed) ----
const sum = (notes) => Object.entries(notes).reduce((a, [d, n]) => a + Number(d) * n, 0);
V.startMoney = sum(V.playerNotes);
V.treasuryReserve = sum(V.treasuryNotes);
V.boxTotal = V.startMoney * V.boxPlayers + V.treasuryReserve;
V.highestNote = Math.max(...Object.keys(V.playerNotes).map(Number));
V.treasuryFor = (players) => V.boxTotal - V.startMoney * players;
V.midTermAfter = (players) => Math.ceil(players / 2);

// ---- Fail fast: sanity checks ----
const EXPECTED_START_MONEY = 1000; // change this on purpose if you change starting money
if (V.startMoney !== EXPECTED_START_MONEY)
  throw new Error(`Starting money is ${V.startMoney} PSD, expected ${EXPECTED_START_MONEY}. Check the note counts, or update EXPECTED_START_MONEY if the change is intentional.`);
if (V.coupCost > V.startMoney) throw new Error('Coup cost is more than a player starts with');
if (V.levy.start < V.levy.bandLow || V.levy.start > V.levy.bandHigh) throw new Error('Starting levy is outside the levy band');

// ---- Formatting helpers ----
const fmt = (n) => n.toLocaleString('en-GB');
const ord = (n) => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
const notesList = (notes) => {
  const parts = Object.entries(notes).map(([d, n]) => `${d} (${n}×)`);
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
};

// Converted from CommonJS (module.exports/require) to a plain ES module so
// the Bulfighter website can `import` this file directly in the browser -
// `module`/`require` only exist in Node, not in a browser/Vite context.
export { V, fmt, ord, notesList };
