// Builds the complete Player's Handbook: Quick-Start Summary, rules, Constitution.
// Every number comes from game_data.js; every article from articles.js.
import fs from 'fs'
import { Paragraph, TextRun, Packer, PageBreak, BorderStyle, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx'
import * as S from './psd_style.js'
import { V, fmt, ord, notesList } from './game_data.js'
import chapters from './articles.js'
const { p, bullet, step, newList, h1, h2, gap, table, box, muted, W } = S;

// ---- Article lookup by name (fails loudly on a typo) ----
const ARTICLE_NO = {};
let total = 0;
for (const ch of chapters) for (const [name] of ch.articles) ARTICLE_NO[name] = ++total;
const num = (name) => {
  if (!(name in ARTICLE_NO)) throw new Error(`Unknown article: ${name}`);
  return ARTICLE_NO[name];
};
const art = (name) => `_(Article ${num(name)})_`;
const artShort = (name) => `Art. ${num(name)}`;

const L = V.levy;
const POPMIN = `−${Math.abs(V.popMin)}`;
const [n1, n2, n3] = V.nepoDebuff;
const swingText = `±${V.swing[0][1]} with ${V.swing[0][0]} players down to ±${V.swing[V.swing.length - 1][1]} with ${V.swing[V.swing.length - 1][0]}`;
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

// ============================================================
// QUICK-START SUMMARY (one page, two columns)
// ============================================================
function quickStart() {
  const SZ = 18;
  const head = (t) => new Paragraph({ spacing: { before: 90, after: 30 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: S.GOLD, space: 2 } },
    children: [new TextRun({ text: t.toUpperCase(), bold: true, size: 19, color: S.INK, characterSpacing: 20 })] });
  const line = (t) => new Paragraph({ spacing: { after: 30 }, children: S.runs(t, { size: SZ }) });
  const dot = (t) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 20 }, children: S.runs(t, { size: SZ }) });
  const n = (t) => new Paragraph({ numbering: { reference: 'steps', level: 0, instance: 900 }, spacing: { after: 20 }, children: S.runs(t, { size: SZ }) });

  const left = [
    head('Goal'),
    line(`Most rounds as Leader wins; a couped term counts **${V.coupedScore}**. Ties: (popularity + ${-V.popMin}) \u00D7 PSD.`),
    head('Setup'),
    dot(`Each player: **${fmt(V.startMoney)} PSD**. Everything else goes to the **treasury**, which also gives change.`),
    dot('Shuffle the action deck. Keep the Constitution where everyone can see it.'),
    dot('Vote on the first Leader (no exam in round 1).'),
    head('Each round = one term'),
    n(`**Exam** — the Leader’s ${V.examQuestions}+ question test, sealed answer key. Pass (more than ${V.passMark}%) to vote or run.`),
    n('**Vote** for the next Leader.'),
    n('**Role draw** — Dictator, President or Commander.'),
    n('**Inauguration** — the Leader may amend one article.'),
    n(`**Levy** (starts ${L.start} PSD) and **${V.taxRate}% tax** to the treasury.`),
    n('**Turns** — everyone plays once. **Mid-term** amendment once half have played (round up).'),
    n('**Farewell** amendment, then the term ends.'),
    head('Leader types'),
    dot('**Dictator** — acts freely; amendments always stand.'),
    dot('**President** — needs table approval; amendments need a majority.'),
    dot('**Commander** — only enforces existing rules; can’t amend.'),
    head('Wills'),
    dot(`The Lawyer keeps your will. Heirs who accept become **Nepo Babies** (−${n1}, −${n2}, −${n3} popularity).`),
  ];
  const right = [
    head('Coups — any time'),
    line(`**${V.coupCost} PSD + 1 coup card**, and you must be **${V.coupGap}+ points** more popular than the Leader. Success stops the round; you draw a Leader role and start the next round.`),
    head('Amending the Constitution'),
    dot(`Write it privately, then announce. Only __highlighted__ words, one for one, in correct English \u2014 or it\u2019s reverted, the window is used up, and you pay ${V.amendPenalty} PSD.`),
    dot(`Everyone except the Leader votes at once, no discussion: **+${V.amendVote}** Leader popularity per vote for, **\u2212${V.amendVote}** per vote against.`),
    head('Performance votes'),
    dot(`Perform the card, then ${V.discussionMinutes} minute of discussion (you stay silent). Vote on 3: good \u2192 **${V.goodCard}**, bad \u2192 **${V.badCard}**.`),
    dot(`Popularity moves by the base swing (${swingText}). Ties: no change. Out of sync: null vote + ${V.malpracticeFine} PSD fine.`),
    dot(`At ${POPMIN} you’re **CANCELLED**: no roles until you climb back.`),
    head('Health'),
    dot(`Doctor: ${V.doctorCharges} charges per term to **Sicken** or **Heal**. **Agbo** \u00B1${V.agboRounds} round, **Concoction** \u00B1${V.concoctionRounds}, **Surgery** cure or death (sabotage only).`),
    dot('Sick: no powers, exams or votes. You can reject a cure.'),
    dot('No stacking. After recovering you\u2019re **immune** for as long as you were first sick.'),
    head('Unions'),
    dot('**Activists** share gains and losses; **Agberos** keep them personal and disperse after acting.'),
    dot(`Act on the unionizer\u2019s turn (and the Leader\u2019s, if a member). Need ${V.unionMin} members.`),
  ];
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const colW = Math.floor(W / 2);
  const col = (kids) => new TableCell({ width: { size: colW, type: WidthType.DXA },
    borders: { top: none, bottom: none, left: none, right: none }, margins: { left: 80, right: 160 }, children: kids });
  return [
    h1('Quick-Start Summary'),
    muted('Numbers shown are the starting values — check the Constitution for the current law.'),
    new Table({ width: { size: colW * 2, type: WidthType.DXA }, columnWidths: [colW, colW],
      rows: [new TableRow({ children: [col(left), col(right)] })] }),
  ];
}

// ============================================================
// FRONT MATTER
// ============================================================
const children = [
  ...S.title('PSEUDODEMOCRACY', 'Player’s Handbook — Working Draft'),
  h2('Contents'),
  ...['Quick-Start Summary', 'Part 1 — Welcome', 'Part 2 — Setup', 'Part 3 — How a Round Works', 'Part 4 — The Constitution',
    'Part 5 — Performance Votes', 'Part 6 — Non-Leader Roles', 'The Constitution (articles)', 'Open Questions'].map(bullet),
  gap(),
  box([
    new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Rules and articles', bold: true, color: S.INK })] }),
    p('This handbook holds the **rules**, which never change. Rules that Leaders can change live in the **Constitution**, at the back of this handbook, as **articles**. When a rule points to an article, the wording shown here is how the article starts the game — always check the Constitution for the current wording.', { spacing: { after: 0 } }),
  ]),
  pageBreak(),
  ...quickStart(),

  // PART 1
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true, children: [new TextRun('Part 1 \u2014 Welcome')] }),
  p(`Pseudodemocracy is a game for ${V.minPlayers}+ players. One player is Leader at a time; everyone else maneuvers to take or keep that seat. Power shifts through exams, votes, money, the Constitution and a deck of action cards.`),
  p(`**Win condition:** accumulate the most total rounds as Leader. Reigns don\u2019t need to be consecutive. A term cut short by a coup counts as ${V.coupedScore} round. A term still running when the group stops counts as a full round. Tie-break: turn popularity into a 0\u2013100 score (popularity + ${-V.popMin}) and multiply it by your PSD. Highest total wins.`),
  p('No fixed round count — you play until your group decides to stop.'),
  h2('The Three Systems'),
  bullet(`**Popularity** — a public score from ${POPMIN} to +${V.popMax}. Changes when a player performs, when the Leader amends the Constitution, and through some cards.`),
  bullet('**Money (PSD)** — PseudoDemocracy Currency. Earned via roles and cards; spent on tax, the levy and services.'),
  bullet('**Power** — everyone holds power shaped by whichever role they’ve drawn.'),

  // PART 2
  h1('Part 2 — Setup'),
];
newList();
children.push(
  step(`Every player starts with **${fmt(V.startMoney)} PSD**: ${notesList(V.playerNotes)}. The ${V.highestNote} note is the highest. The treasury gives change for any payment.`),
  step(`**All money not dealt to a player goes into the treasury.** The box holds ${fmt(V.boxTotal)} PSD, so the treasury starts with ${fmt(V.boxTotal)} − (${fmt(V.startMoney)} × players): ${fmt(V.treasuryFor(10))} PSD with 10 players, ${fmt(V.treasuryFor(5))} PSD with 5.`),
  step(`Shuffle the action card deck: Performance cards and Result cards (${V.goodCard} and ${V.badCard} cards) (see Part 3).`),
  step('Keep the Constitution (at the back of this handbook) where everyone can read it. Every article starts at its printed wording.'),
  step('Everyone votes on who leads first, because the very first round has no prior exam.'),

  // PART 3
  h1('Part 3 — How a Round Works'),
  p('A **round** is one Leader’s **term**: every player takes one turn. Each round you serve as Leader counts toward the win.'),
);
newList();
children.push(
  step(`**Exam** — the Leader writes a multiple-choice exam of at least ${V.examQuestions} questions with at least ${V.examOptions} options each. Before the exam, the Leader writes a **sealed answer key**; it is revealed after everyone answers and can’t be changed. Players pass by answering more than ${V.passMark}% correctly ${art('Exam Pass Mark')}. You must pass to vote or run for the next Leader. If no exam is ready, everyone can vote and run. Exams are skipped after a coup.`),
  step('**Vote** — eligible voters choose the next Leader.'),
  step('**Leader Role Card Draw** — the new Leader draws one of the following:'),
);
children.push(table([2000, 4026, 3000], ['Leader Type', 'What They Can Do', 'Amending the Constitution'], [
  ['Dictator', 'Can act without the table’s approval.', 'Amendments always stand.'],
  ['President', 'Can not act without the table’s approval.', 'Amendments stand only with a majority.'],
  ['Commander', 'Can not act. Can only enforce rules that already exist.', 'Can’t amend.'],
]));
children.push(gap());
children.push(
  step('**Leader status** \u2014 a Leader who is **sick** or **CANCELLED** keeps the seat and still collects income, but can\u2019t use Leader powers or amend articles.'),
  step('**Inauguration** — the new Leader may amend one article (see Part 4).'),
  step(`**Levy** — every player pays a flat levy to the government treasury every round, regardless of income. It starts at ${L.start} PSD ${art('Levy')}. The Leader sets it within the **levy band**, which starts at ${L.bandLow}–${L.bandHigh} PSD ${art('Levy Band')}.`),
  step(`**Income & Tax** — collect role/card income and pay ${V.taxRate}% tax to the government treasury every round ${art('Tax')}.`),
  step(`**Leader\u2019s Term** \u2014 every player takes one turn. The Leader governs within their role\u2019s limits. Play Performance cards on your turn; if the vote on your performance is good, draw a **${V.goodCard}** card, and if it\u2019s bad, draw a **${V.badCard}** card (see Part 5).`),
  step('**Mid-term** — once at least half the players have taken their turn, the Leader may amend one article.'),
  step('**Farewell** — after every player has taken their turn, the Leader may amend one article.'),
  step('**Term Ends** \u2014 track who held power. The next round begins with the exam. If the group stops mid-term, the current Leader\u2019s term still counts as a full round.'),
  step(`**Levy Band Shift** — when a Leader’s term ends (voted out, or removed by a coup), check their popularity at that moment. Below −${L.trigger}: the levy band rises by ${L.shift} PSD. Above +${L.trigger}: it drops by ${L.shift} PSD, but never below ${L.floor} PSD. From −${L.trigger} to +${L.trigger}: no change. If the levy is now outside the band, it moves to the closest value inside it ${art('Levy Band Shift')}. Write the current band on the Levy Band article’s “Amended” line.`),
);
children.push(gap(), h2('When is mid-term?'), p('Round up: mid-term comes once **at least half** the players have played.'));
children.push(table([3000, 3000], ['Players', 'Mid-term after player'],
  [3, 4, 5, 6, 7, 8].map(k => [String(k), ord(V.midTermAfter(k))])));
children.push(gap(), h2('Coups'));
children.push(
  bullet(`A coup can happen **at any point during any term**. Any player with ${V.coupCost} PSD + 1 coup card may attempt one. Coup cards are role cards marked with coup symbols.`),
  bullet(`The coup succeeds if the challenger is at least ${V.coupGap} points more popular than the Leader.`),
  bullet('If it succeeds, the round stops immediately. The challenger makes a Leader role draw and **starts a new term from the beginning**: no exam or vote, straight to the role draw, then Inauguration.'),
  bullet('The new Leader takes the first turn of the new term, and play continues from them. _Example: during player 2’s turn, player 6 succeeds in a coup, so player 6 starts the next round._'),
  bullet(`A Leader who is couped partway through their term scores **${V.coupedScore} round** for it instead of 1.`),
  bullet('The challenger may negotiate a deal instead and lose only the coup card.'),
);
children.push(gap(), h2('Action cards'));
children.push(table([1800, 3613, 3613], ['Type', 'Meaning', 'Example'], [
  ['Performance', 'Players play scenarios and have their popularity voted on based on their performance.', 'You have a useless product you need to sell in 45 seconds.'],
  ['Result', `Drawn after a performance vote: a **${V.goodCard}** card if the vote is good, a **${V.badCard}** card if it\u2019s bad.`, `${V.goodCard}: You are now a Lawyer. You can keep wills. ${V.badCard}: You have been infected with COVID for the next 3 rounds. Anyone who makes eye contact with you becomes sick for 3 rounds.`],
]));
children.push(gap(), p('Repeat until your group decides to stop. The player with the most total rounds as Leader wins.'));

// PART 4
children.push(
  h1('Part 4 — The Constitution'),
  p(`The Constitution is a set of ${total} articles, printed at the back of this handbook. Leaders can rewrite them; nobody can add or remove them.`),
  h2('What can change'),
  bullet('Only the **highlighted words** in an article can be changed.'),
  bullet('Each highlighted word is replaced by exactly one word. A two-word highlight becomes two words.'),
  bullet('If _a_, _an_ or _the_ comes before a highlighted word, it is highlighted too.'),
  bullet('Symbols such as − and + count as one word.'),
  h2('When'),
  bullet('Three times per term, one article each time: **Inauguration**, **Mid-term** and **Farewell**.'),
  h2('Writing an amendment'),
  bullet('The Leader writes the new wording down privately, then announces it.'),
  bullet('It is then checked: only highlighted words may have changed, and the article must still be correct English. This is a matter of grammar, not opinion, so nobody votes on it.'),
  bullet(`If the check fails, the article goes back to its old wording, that amendment window is used up, and the Leader pays **${V.amendPenalty} PSD** to the treasury.`),
  bullet('An amendment blocked by an Agbero Confront also uses up that window.'),
  h2('The amendment vote'),
  bullet('Straight after an amendment, everyone **except the Leader** votes for or against it. No discussion.'),
  bullet(`Each vote **for** gives the Leader **+${V.amendVote}** popularity. Each vote **against** gives **−${V.amendVote}**.`),
  bullet('**Dictator:** the amendment stands whatever the result. **President:** it stands only if more players vote for it than against; otherwise the old wording returns. **Commander:** can’t amend.'),
  bullet('Record every amendment in the Amendment Record at the end of the Constitution.'),
);

// PART 5
children.push(
  h1('Part 5 — Performance Votes'),
  p('Triggered only by action cards — a player performs the scenario, the table votes.'),
  bullet(`${V.discussionMinutes} minute of open discussion (performer stays silent), then everyone **except the performer** raises \u201Cgood\u201D or \u201Cbad\u201D on a count of 3. Good consensus: draw a **${V.goodCard}** card. Bad consensus: draw a **${V.badCard}** card.`),
  bullet(`An out-of-sync hand counts as electoral malpractice: null vote + ${V.malpracticeFine} PSD fine to the treasury ${art('Malpractice')}.`),
  bullet('Ties = no change.'),
  bullet(`If a player’s popularity reaches ${POPMIN} or lower, they are **CANCELLED** and can’t hold any roles until their popularity goes above ${POPMIN}.`),
  p('Base swing per current number of active players (scales with table size):'),
);
children.push(table([3000, 3000], ['Players', 'Base Swing / Hand'],
  V.swing.map(([k, v], i) => [k, `±${v}${i === V.swing.length - 1 ? ' (floor)' : ''}`])));

// PART 6
children.push(h1('Part 6 — Non-Leader Roles'));
children.push(table([2000, W - 2000], ['Role', 'What They Do'], [
  ['Doctor', 'Gives doses that sicken or heal; can secretly sabotage a heal. See Doctor & Health.'],
  ['Lawyer', `Signs wills for an agreed fee and collects upkeep every round ${art('Lawyer')}. See Wills & Inheritance.`],
  ['Secret Agent', 'Can check one role card for coup-card status and will contents on their turn. Can check prescriptions before they are handed over. Can not be caught sharing what they’ve discovered, or they lose the role. Can only use this power once per round.'],
  ['Activist', 'Peaceful union member. See Activists & Agberos.'],
  ['Agbero', 'Violent mob member. See Activists & Agberos.'],
  ['Civilian', 'Votes only in elections.'],
]));
children.push(
  h2('Activists & Agberos'),
  p('Two ways to organize — peacefully (Activist) or violently (Agbero) — for or against the Leader.'),
  bullet(`Formed by playing a union card. Starts at ${V.unionStart} person (“recruiting”); needs ${V.unionMin} to act ${art('Union Size')}.`),
  bullet(`Recruiting is a free social ask. Can’t recruit the Leader or a member of another union ${art('Recruiting')}.`),
  bullet(`**Union turns:** a union can only recruit, kick or act on the unionizer’s turn and on the Leader’s turn if the Leader is a member ${art('Union Turns')}.`),
  bullet(`A member may leave on their turn. The unionizer kicks a member just by saying so (on a union turn) ${art('Leaving & Kicking')}.`),
  bullet('The unionizer owns the union and makes its decisions.'),
  bullet('**Confront the Leader** is the exception to union turns: a union can use it whenever the Leader is amending an article.'),
  bullet(`A union lasts until its members choose to disperse, or until it drops to ${V.unionStart} member. Agberos can form a new mob straight away after dispersing, as long as they hold an Agbero role card.`),
  bullet(`If a union drops to ${V.unionStart} member, it dissolves and the card is lost ${art('Dissolving')}.`),
  bullet(`**Activist:** gains and losses are shared across members; the union can linger after acting ${art('Activists')}.`),
  bullet(`**Agbero:** gains and losses are personal to each member; the mob disperses the instant it acts ${art('Agberos')}.`),
);
children.push(table([1900, 1700, 2713, 2713], ['Action', 'Trigger', 'Activist', 'Agbero'], [
  ['Confront the Leader (once only)', 'The Leader is amending an article (any turn).', `The union’s total vote is ${V.activistVote}d and automatically against the Leader ${art('Activist Confront')}.`, `Blocks the amendment and steals ${V.agberoSteal} × union size from the Leader ${art('Agbero Confront')}.`],
  ['Command Performance', 'On a unionizer’s turn.', `The Leader performs a scenario scripted by the unionizer; the Leader’s popularity is voted on after ${art('Command Performance')}.`, 'Same as Activist.'],
]));
children.push(gap(), p(`If the Leader is part of the union, its actions are used on a rival of the Leader’s choice ${art('Leader in Union')}.`));

children.push(
  h2('Doctor & Health'),
  p('Anything a Doctor gives is a **dose**: Agbo, Concoction or Surgery.'),
  bullet(`Doctors get **${V.doctorCharges} charges per term**, spent openly as **Sicken** and/or **Heal** in any combination.`),
  bullet('**Sicken** uses Agbo or Concoction. Surgery can’t be used to sicken.'),
  bullet('**Heal:** the patient can ask, or the Doctor can offer. The patient may **reject** any cure they are offered.'),
  bullet(`**Sabotage:** when healing, the Doctor privately writes the dose type followed by “Cure” or “Poison” on the prescription card. Writing “Poison” is Sabotage. Anyone may guess Sabotage before the patient touches the card ${art('Sabotage Guess')}.`),
  bullet(`Right guess: the Doctor pays the guesser, gives a genuine Cure and loses their licence ${art('Right Guess')}. Wrong guess: the guesser pays the Doctor the same amount the patient paid ${art('Wrong Guess')}.`),
  bullet(`Sick players can’t use role powers, write exams, vote or be voted for ${art('Sickness')}.`),
);
const rounds = (k) => `${k} round${k === 1 ? '' : 's'}`;
children.push(table([2200, 3413, 3413], ['Dose', 'As a Cure', 'As Poison'], [
  [`Agbo ${art('Agbo')}`, `−${rounds(V.agboRounds)} sick; payment lost`, `+${rounds(V.agboRounds)} sick; payment lost`],
  [`Concoction ${art('Concoction')}`, `−${rounds(V.concoctionRounds)} sick; payment lost`, `+${rounds(V.concoctionRounds)} sick; payment lost`],
  [`Surgery ${art('Surgery')}`, 'Instant recovery', 'Instant elimination (Sabotage only)'],
]));
const c = V.concoctionRounds;
children.push(
  gap(),
  h2('No Stacking'),
  bullet('A player who is already sick can\u2019t be sickened again, however they became sick (a dose or a card).'),
  bullet('When a sick player recovers, they gain **immunity**: for as many rounds as their original sickness lasted, they can\u2019t be sickened. This applies to sickness from cards too.'),
  bullet('Sabotage makes the sickness longer, but not the immunity.'),
  bullet('Keep track of who is sick and who is immune yourselves.'),
  p(`_Example: a Concoction dose makes you sick for ${rounds(c)}. A sabotaged “cure” adds ${c} more, so you’re sick for ${rounds(2 * c)}. When you recover, you’re immune for ${rounds(c)}, not ${2 * c}._`),
  h2('Elimination'),
  bullet(`Eliminated players’ PSD goes to the treasury and their roles and memberships are rescinded, unless willed ${art('Elimination')}.`),
  bullet('If an eliminated player has a will, the Lawyer reads it out and carries it out.'),
);
children.push(
  h2('Wills & Inheritance'),
  bullet(`A Lawyer maintains wills for players and receives upkeep each round to maintain them ${art('Lawyer')}.`),
  bullet(`Miss a payment and the will goes “on hold”. Reactivate it anytime by catching up. Die while it is on hold and the will doesn’t count ${art('Will on Hold')}.`),
  bullet(`Name the same or separate heirs for your PSD and your roles ${art('Heirs')}. Each heir accepts or rejects independently.`),
  bullet(`Unwilled or rejected PSD goes to the treasury ${art('Unclaimed PSD')}. Unwilled or rejected roles are rescinded.`),
  bullet(`An heir who accepts an inheritance becomes a **NEPO BABY** ${art('Nepo Baby')}. Nepo Babies’ popularity is debuffed by ${n1} (1st round), ${n2} (2nd) and ${n3} (3rd) ${art('Nepo Baby Debuff')}. The debuff is removed in the ${ord(V.nepoDebuff.length + 1)} round.`),
);

// ============================================================
// THE CONSTITUTION (generated from articles.js)
// ============================================================
children.push(pageBreak());
children.push(...S.title('THE CONSTITUTION', 'of Pseudodemocracy — “A fairer tomorrow, in theory.”'));
children.push(muted('Only the highlighted words can be changed. See Part 4 for how, when and who.'));
for (const ch of chapters) {
  children.push(h1(ch.chapter));
  for (const [name, text] of ch.articles) {
    children.push(new Paragraph({ keepNext: true, spacing: { before: 160, after: 40 }, children: [
      new TextRun({ text: `ARTICLE ${ARTICLE_NO[name]}`, bold: true, size: 18, color: S.GOLD, characterSpacing: 30 }),
      new TextRun({ text: `   ${name}`, bold: true, color: S.INK }),
    ] }));
    children.push(new Paragraph({ keepNext: true, spacing: { after: 60 }, indent: { left: 240 }, children: S.runs(text) }));
    children.push(new Paragraph({ spacing: { before: 120, after: 80 }, indent: { left: 240 },
      border: { bottom: { style: BorderStyle.DOTTED, size: 6, color: 'B9AE92', space: 2 } },
      children: [new TextRun({ text: 'Amended: ', italics: true, size: 18, color: S.MUTED })] }));
  }
}
children.push(pageBreak());
children.push(h1('Amendment Record'));
children.push(muted('Log every amendment so the table always knows the current law.'));
children.push(table([1150, 1450, 1150, 3776, 1500], ['Round', 'Leader', 'Article', 'New wording', 'For / Against'],
  Array.from({ length: 18 }, () => [' ', ' ', ' ', ' ', ' '])));

// OPEN QUESTIONS
children.push(pageBreak());
children.push(
  h1('Open Questions'),
  h2('Watch in playtesting'),
  bullet('Do players argue over who is sick or immune? If so, add tokens.'),
  bullet(`Is ${total} articles too many to read at the table?`),
  bullet(`Articles ${num('Heirs')}, ${num('Nepo Baby')} and ${num('Nepo Baby Debuff')} can chain to boost a Leader’s popularity. Rare, since deaths are rare.`),
);

Packer.toBuffer(S.makeDoc('Pseudodemocracy — Player’s Handbook', 'Pseudodemocracy — Player’s Handbook', children))
  .then(b => { fs.writeFileSync('Pseudodemocracy_Rules.docx', b); console.log('ok', total, 'articles'); });
