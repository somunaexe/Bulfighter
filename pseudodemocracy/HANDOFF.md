# Pseudodemocracy — Handoff for the Bulfighter website

Read this file first. It tells a new Claude Code session (or a developer) everything needed to work on Pseudodemocracy inside this repo.

## What the game is
A satirical Nigerian-themed political party game for 3+ players. One player is Leader at a time; everyone else tries to take the seat. The winner has the most rounds as Leader. Full rules: `Pseudodemocracy_Rules.docx` (15-page Player's Handbook, including the Constitution).

## Files in this folder
| File | What it is |
|---|---|
| `build/game_data.js` | **The single source of truth for every number** (money, coup cost, levy, swing table, card names…). Includes derived values and fail-fast checks. |
| `build/articles.js` | The 31 Constitution articles. `__word__` marks a highlighted (amendable) word. Numbers come from `game_data.js`. |
| `build/psd_style.js` | Georgia handbook styling for the Word document. |
| `build/build_rulebook.js` | Generates `Pseudodemocracy_Rules.docx` from the files above (`node build_rulebook.js`, needs the `docx` npm package). |
| `DESIGN_NOTES.md` | Every design decision and why, plus playtest watch items. |
| `Pseudodemocracy_Rules.docx` | The current generated handbook. |

## Rules for working on this (please follow)
1. **Single source of truth.** Never retype a game number or article. The website must import `game_data.js` and `articles.js` — the same files the rulebook is built from — so the site and the printed rules can never disagree.
2. **Fail fast.** Keep the sanity checks in `game_data.js`; add new ones rather than silently accepting bad values.
3. **Rules vs articles.** Rulebook entries are *rules* (locked). Constitution entries are *articles* (amendable; only highlighted words change).
4. **Coup principle.** Anything that decides whether, how or by whom a coup can happen must stay a locked rule.
5. **Teach as you go.** The owner is learning — explain decisions and ask him questions, don't just do the work.

## What to build (decide first)
Options discussed:
- **Companion app (recommended first step):** players meet in person or on a call; the site tracks popularity, PSD, the treasury, the live Constitution and Amendment Record, and who is sick/immune (fixes the "players forget who is sick" playtest risk).
- **Online rulebook:** the handbook as a web page generated from the same data files.
- **Full online game:** everything in the browser; performances would need voice/video. Largest build.

## Starter prompt to paste into the website chat
> I've added a `pseudodemocracy/` folder to this repo. Read `pseudodemocracy/HANDOFF.md` first, then `DESIGN_NOTES.md`. I want to add Pseudodemocracy to the Bulfighter website. Look at how the site is built, then help me decide between a companion app, an online rulebook and a full online game. Reuse `build/game_data.js` and `build/articles.js` as the single source of truth — don't retype any numbers. Teach me as you go.
