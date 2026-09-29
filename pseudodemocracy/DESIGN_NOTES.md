# Pseudodemocracy — Constitution Design Notes (working)

## Terminology
- Things in the rulebook are **rules**. Things in the constitution are **articles**.

## Core idea
- Rulebook = rules that can't change (the game's "physics"). Constitution = rules Leaders can amend ("politics").
- Soft limits over visible "CAN NOT": players accept consequences more easily than prohibitions.

## Amendment system (all in the rulebook — locked)
- Leaders may only rewrite existing articles. No new articles, no repeals.
- Only **highlighted words** in an article can be changed. Each highlighted word is replaced by exactly one word (a 2-word highlight → 2 words).
- If a/an/the comes before a highlighted word, it is highlighted too (e.g. "an agreed" → "a fixed").
- Symbols such as − and + can be highlighted; each counts as one word.
- Writing an amendment (rule): the Leader writes the new wording privately, then announces it. The table checks that only highlighted words changed and the article still makes grammatical sense. The grammar check is decided by correct English, not by a player vote (a vote would be too corrupt). If the check fails, the article reverts, that amendment window is used up, and the Leader pays 100 PSD to the treasury.
- Dictator: amendment always stands. President: stands only if a majority votes for it. Commander: cannot amend.
- Amendment vote: immediate, no discussion. Each vote for = +1 Leader popularity, each vote against = −1.
- Three amendment windows per term: inauguration, mid-term, farewell.
- A term = one round (every player takes one turn). Mid-term = once at least half the players have played (round up: 5 players → after the 3rd).

## Design principles found
- Any rule deciding whether, how, or by whom a coup can happen must be locked. Coups are the guaranteed exit. This check comes first.
- Highlighting guide: numbers, frequency and costs are usually safe. Verbs can be highlighted too, if they pass the coup check.
- Check highlights in combination, not only one at a time.
- Watch for chains: sickness blocks role powers (coup cards are role cards), so anything controlling sickness length affects who can coup.
- Decisions interact: "a term is one round" turned the Doctor's 2 charges per term into 2 per round.

## Changes to existing rules
- Exam answers: sealed answer key. Leader writes answers before the exam and reveals them after (locked).
- Exam pass mark: more than 50% (amendable).
- Starting money: 1,000 PSD per player — 1 (10×), 5 (10×), 10 (10×), 20 (12×), 50 (6×), 100 (3×). 100 is the highest note (no 500).
- The treasury gives change for any payment (rule).
- Dose prices scrapped (payment is whatever is agreed; lost on either outcome).
- Money in the box (sized for 10 players): player stacks 10,000 PSD + treasury reserve 2,550 PSD = 630 notes / 12,550 PSD.
  - 1 PSD: 100 player + 50 treasury = 150 · 5: 100 + 20 = 120 · 10: 100 + 10 = 110 · 20: 120 + 15 = 135 · 50: 60 + 10 = 70 · 100: 30 + 15 = 45.
  - Any money not dealt to a player goes into the treasury: treasury starts with 12,550 − 1,000 × players (2,550 with 10 players, 7,550 with 5). Richer treasury in small games is intended — it fits the tone.
- Coup cost lowered to 300 PSD (rule, locked).
- No "major decision" concept exists.
- Unions: recruit, kick or act only on the unionizer's turn and on the Leader's turn if the Leader is a member (replaces the 2-turn cooldown). The unionizer kicks members just by saying so, on those turns. A union lasts until its members choose to disperse (or it drops to 1 member).
- Elimination: roles and memberships are "rescinded" (not removed/dispersed).
- Coups can happen at any point during any term. The overthrower starts a new term from the beginning (role draw → Inauguration → every player takes a turn), so they get all three amendment windows.
- The unionizer owns the union and makes its decisions. Agberos can form a new mob straight away after dispersing, as long as they hold an Agbero role card.
- A successful coup stops the round immediately; the overthrower starts the next round (e.g. during player 2's turn, player 6 coups → player 6 starts). A couped Leader scores ½ round for that term instead of 1.
- Merged from the other chat's rulebook: Levy (flat fee every round set by the Leader within the band; starts 25, band 25–50), Levy Band Shift at term end, Doctor writes dose type + Cure/Poison.
- Secret Agent: still in the game; its rule is locked (not in the constitution).
- Doctor terminology: umbrella term for anything a Doctor gives = **Dose**. Herbs renamed **Agbo**; Medicine renamed **Concoction**. Surgery keeps its name.
- Sickness length comes from the dose: Agbo ±1 round, Concoction ±2 rounds, Surgery = instant recovery or elimination.
- **No stacking (rule):** a Doctor can't Sicken someone who is already sick. After recovering, the player gets **immunity** as long as their original sickening. Sabotage extensions don't lengthen it (e.g. sickened 2 + sabotaged 2 = 4 rounds sick → 2 rounds of immunity, not 4). Tracked by memory only (no tokens), like Monopoly jail.
- Doctors can offer cures; the patient doesn't have to ask first. A patient can reject any offered cure.
- Surgery can't be used to Sicken openly. It can only cause elimination through Sabotage.

## Sorting so far
- Parts 1–2 (Welcome, Setup): all locked.
- Part 3: amendable = pass mark, tax. Everything else locked (including coup cost and popularity gap).
- Part 4: amendable = malpractice fine. Everything else locked (including ties and CANCELLED).
- Part 5 (roles & unions): Doctor charges, Civilians and Secret Agent locked; the rest amendable.
- Doctor & Health: prescription writing and no-stacking are rules; the rest amendable (see articles 16–23).
- Wills & Inheritance: missed payment → on hold, Lawyer reads the will, and role dispersal are rules; articles 24–28 amendable.
- Single source of truth: every number lives in claude/build/game_data.js; articles in claude/build/articles.js; style in psd_style.js; build_rulebook.js generates the whole handbook (Quick-Start Summary at the front, rules, Constitution, Amendment Record). The old Quick Reference was replaced by the Quick-Start Summary. Build: `node build_rulebook.js`.
- **Sorting complete.** Rulebook built with the Constitution as its own section at the back (single file, Pseudodemocracy_Rules.docx). Article numbers in the rules are looked up by name from one data source. Amendment windows are named Inauguration, Mid-term and Farewell.

## Open questions
- Watch: articles 25 + 27 + 28 can chain (every will names the Leader, debuff flipped to +) to pump the Leader's popularity. Popularity above +30 makes a Leader coup-proof, since challengers need +20 and the cap is +50. Rare (needs deaths), but test it.
- Playtest: do players argue over who is sick/immune? If so, bring back tokens.

## Constitution articles (bold = highlighted, amendable words; numbered as in the rulebook)
### Chapter I — Elections & the Treasury
1. Exam Pass Mark — Players pass the exam by answering **more** than **50%** of questions correctly.
2. Tax — Tax: **20%** of income goes to **the treasury** every **round**.
3. Levy — **Every** **player** **pays** a levy of **25** **PSD** to **the treasury** every round, regardless of income. The levy must stay within the levy band.
4. Levy Band — **The Leader** sets the levy between 25 and 50 PSD.
5. Levy Band Shift — When a term **ends**, **a** **Leader** below **−20** **popularity** **raises** the levy band by 10 PSD, and **a** **Leader** **above** **+20** **popularity** **lowers** it by 10 PSD. The band never drops below 25 PSD. If the levy ends up outside the band, it moves to the closest value inside it.
6. Malpractice — An out-of-sync hand is a null vote and a **25** PSD fine, paid to **the treasury**.
### Chapter II — Unions
7. Union Size — A union starts with **1** member and needs **2** members to act.
8. Recruiting — Unions can’t recruit **the Leader** or a member of **another** union.
9. Union Turns — A union may recruit, kick or act only on **the unionizer’s** turn and on **the Leader’s** turn if the Leader is a member.
10. Leaving & Kicking — A member may leave on **their** turn. **The unionizer** kicks a member just by saying so.
11. Dissolving — If a union drops to **1** member, it dissolves.
12. Activists — Activist gains and losses are **shared**, and the union **lingers** after acting.
13. Agberos — Agbero gains and losses are **personal**, and the mob **disperses** after acting.
14. Activist Confront — Activists confronting the Leader **double** their votes against the Leader.
15. Agbero Confront — Agberos confronting the Leader block the decision and steal **50** × union size.
16. Command Performance — The Leader performs a scenario scripted by **the unionizer**.
17. Leader in Union — If the Leader is in the union, its actions target a rival of **the Leader’s** choice.
### Chapter III — Health
18. Sabotage Guess — **Anyone** may guess Sabotage **before** **the patient** **touches** the card.
19. Right Guess — If right, **the Doctor** **pays** **the guesser**, gives a real Cure and **loses** **their licence**.
20. Wrong Guess — If wrong, **the guesser** **pays** **the Doctor** the amount **the patient paid**.
21. Sickness — Sick players **can’t** use **role powers**, **write exams**, **vote** or **be voted for**.
22. Agbo — Agbo: ±1 round sick **and** payment lost.
23. Concoction — Concoction: ±2 rounds sick **and** payment lost.
24. Surgery — Surgery: instant **cure** or **elimination**.
25. Elimination — Eliminated players’ PSD goes to **the treasury** and their roles are **rescinded**, unless willed.
### Chapter IV — Wills & Inheritance
26. Lawyer — The Lawyer signs wills for **an agreed** fee and collects upkeep every **round**.
27. Will on Hold — If you **die** while your will is **on hold**, it **doesn’t count**.
28. Heirs — You can name **the same heir** or **different heirs** for your **PSD** and your **roles**.
29. Unclaimed PSD — Unwilled or rejected PSD goes to **the treasury**.
30. Nepo Baby — An heir who **accepts** **an inheritance** becomes a Nepo Baby.
31. Nepo Baby Debuff — Nepo Babies get **−**30, **−**20 and **−**10 **popularity** over the next 3 rounds.

## Consistency audit (2026-09-29)
Resolved: Legislative, Banker, Teacher and PM roles were removed. Popularity votes use the player-count swing table (3 buckets dropped). Coup zone at ≤ 0 scrapped — challenger only needs +20. Coup cost 300 PSD confirmed. Card types: Performance cards, then a Result card — Reward if the vote is good, Punishment if bad (renaming under discussion). Punishment example restored: eye contact spreads the COVID sickness.
Levy, Levy Band and Levy Band Shift are now articles (levy clamps to the nearest band value after a shift). Levy Band Shift highlights chosen; the band has no ceiling (by choice). Result cards named: **Settlement** (good vote) and **Scandal** (bad vote).
Still open:
Mentioned in older notes/other chats but NOT in the current handbook:
1. Card types: older notes say "Subjection and Performance"; handbook says "Performance and Result".
2. Legislative role (House of Rep was folded into it) — not in the handbook.
3. Banker role and loan terms — not in the handbook.
4. Teacher role ("Teacher/Leader exam dynamic") — handbook has the Leader write the exam.
5. PM role / PM approval — "major decision" was scrapped; is PM still a role?
7. Popularity votes: older notes say 3 weight buckets; handbook uses the base-swing table by player count.
8. Board Popularity Track zones (coup zone ≤ 0, keys-to-the-city > +20) — not in the rules.
9. "rules-spec.md" is referenced in old notes but doesn't exist in the project.
Housekeeping:
10. The project's Pseudodemocracy_Rules.docx is the older version; replace it with the newly built handbook (Claude can't upload .docx to the project).
11. The Game Info sheet (first document) is outdated (coup 500, starting money TBC, etc.); regenerate it from game_data.js.
Already merged: Levy, Levy Band Shift, Surgery sabotage-only, dose type on prescription, Secret Agent "on their turn" wording.

## Rulebook review (2026-09-29) — resolved
1. Confront the Leader triggers when the Leader is amending an article, and is the exception to union turns (usable on any turn). Agbero Confront blocks the amendment.
2. Amendment votes: everyone except the Leader. Performance votes: everyone except the performer.
3. Tie-break: (popularity + 50) × PSD — popularity mapped to 0–100 times money; highest wins.
4. If the group stops mid-term, the current Leader's term counts as a full round (it wasn't couped).
5–6. A sick or CANCELLED Leader keeps the seat and still collects income, but can't use Leader powers or amend.
7. No Stacking and immunity apply to sickness from any source, including cards. Mass sickness from the rare Scandal card is fine.
8. A Leader above +30 popularity being coup-proof is intended.
An amendment blocked by an Agbero Confront uses up that amendment window.
