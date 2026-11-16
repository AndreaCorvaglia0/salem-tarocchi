# Balance (16 Nov): experience, HUD and missions, the final reading, the bot

## 1. Experience

**Problem.** In the first real play the broom (level 6) came in about half an hour, in chapter 1. Measured with
the old numbers (`node scripts/balance.mjs`, before the change): a player who only follows the story arrived at
the chapter-2 gate at level 5.1 and at the chapter-3 gate at level 8; a normal one at 7.8 and 9; an explorer at
8.8 and 9 (broom at `c1.cart`). The main causes: every card found gave 20 xp, Minors included (they come every
20-25 s of tall grass), stars gave 10, and a reading gave 10-30 whatever its length.

**What changed.**
- `src/core/progress.js`: `LEVEL_XP` = `[0, 20, 70, 270, 345, 465, 570, 700, 950, 1250, 1650, 2150]` (was
  `[0, 30, 70, 200, 280, 370, 470, 590, 730, 950, 1250, 1650]`). New `XP` gains: Major found 10 (was 20),
  Minor found 2 (was 20), star 5 (was 10), told 5 (same).
- `src/systems/reading.rules.js`: `xpFor(score, total) = 6 + round(5 * score * total)`: a reading pays for the
  questions it asks. 1 card (2 questions): 16 all right, 11 one right, 6 none. 3 cards (7): 41 all right, 31 with
  5. Cross (21): 86 with 16. Before: 10-30 for any spread. `consult.js` and the old flow pass the count.
- Old saves: `keepLevel()` (progress.js, runs once at load, marker `state.world.once['xp.table.2']`): a save made
  with the old table keeps its level; its xp is raised to the new threshold of that level, never lowered; powers
  and flags stay. A game started with the new table is marked at its first xp, so nothing moves on reload.
- `src/glue/debug.rules.js` (not mine, one-line data change): the skip doors' xp 230/470/640 became 290/580/720,
  so `skip=c2` is level 4, `c3` level 7, `trial` level 8 as before.

**XP sources** (printed by the script from the code, current tree):

| source | amount | where |
|---|---|---|
| Major found / Minor found | 10 / 2 | core/progress.js `XP` |
| star / told | 5 / 5 | core/progress.js `XP` |
| reading | 6 + 5 per right answer | systems/reading.rules.js `xpFor` |
| story nodes | 5-20 each: c0 5, c1 20, c1b 35, c2 35, c3 50, end 45, lessons 35, post 5, clients 5 | data/story |
| story client served (first time) / generated client | 5 / 3 | glue/clients.js |
| visit of the Reader | 10 | story/visit.js |
| Exam passed | 10 | systems/exam.js |
| review, per right answer | 3 | systems/review.js |
| card of the day | 5 | glue/day.js |
| reading for herself (real deck), once a day | 5 | glue/selfread.rules.js |
| chests | 10-20 (5 chests) | data/world |

**The simulation** (`scripts/balance.mjs`): plays the real story (runner, scripts, CAST, gates, sessions, the
lessons offered as missions) with fake screens, the real progress functions and the real reading/exam/visit/
client rules; between steps the optional things of each chapter are spread over its steps. Profiles:
straight = only what the story requires (the hidden Majors the gates ask for, one constable per chapter,
~10 Minors on the way); normal = half the optional things (hidden Majors beyond the need, chests, the cottage
clients after the first), one review and two constables per chapter, ~15 Minors, the card of the day;
explorer = everything once, two reviews and three constables per chapter, ~22 Minors. Accuracy 75%. When a gate
refuses for rank she studies, alternating a cottage client and a review; the script counts how many.
24 seeds per profile. The output today:

| | gate 1 (level 4) | studies | gate 2 (level 7) | studies | broom (6) | level 9 |
|---|---|---|---|---|---|---|
| straight | level 3.0 (xp 197 of 270) | 3.4 | level 5.4 (xp 469 of 570) | 3.0 | c3.trapdoor 58%, c2.home 25%, c2.plan 17% | f.last 58%, f.dawn 21%, c3.trial 21% |
| normal | 4.25 | 0 | 7.25 | 0 | c2.fire 88%, c2.client 13% | c3.jail 71%, c3.trial 17%, c3.coven 13% |
| explorer | 5.0 | 0 | 8.0 | 0 | c2.mill 54%, c2.ortica 42%, c1.gate 4% | c3.client 96% |

Level 2 at `p.road` (Tartufo), 3 at `c1.read`/`c1.back`. End of story: straight 9 (xp ~1070), normal 10,
explorer 11 (levels 10-12 open after `ending.seen`). Accuracy 60%: 4.3 and 4.0 studies; 90%: 2.6 and 2.3.

Pinned by `tests/balance.test.mjs` (10 seeds): straight short at both gates with 2-4.5 studies, normal 3.8-5 and
6.8-8, explorer at most +1, broom in chapter 2 for straight and normal, level 9 in chapter 3 and at the very end
for the straight player; plus the old-save rule.

**Coins.** The old bonuses on pay stay dropped. A straight player has 9 coins at the first gate (after the
scripted incense), 14 when chapter 2 opens, 24 at the trapdoor, 36 when chapter 3 opens, 46 at the end. Tools
cost 10-12, a treat 3, a card 30/45/60: she can buy one tool in chapter 2 and two or three by the trial. The only
tool the story requires (the incense, `c1.shop`) is paid by the story itself (Malva's 12). Prices and pay unchanged.

## 2. HUD and missions

- HUD slip (`ui/hud.js`): with a tracked secondary mission it shows its text in pencil (grey, dashed underline,
  the "in più" label like the list, up to three lines); otherwise the main step in ink. It changes on `step`,
  `track`, `extra:done`, `card:found`, with the same red strike. `slipLine()` is exported.
- Missions list (`ui/mappa.js`): "fatte N di M" now counts exactly the listed entries (done among listed / listed);
  hidden when the list is empty.
- Map at 390 px: the side missions' long pencil notes were drawn over the zone titles and the places. Now each
  open side mission is a short pencil tag `✎ n` on the sketch, and the same `✎ n` is in its row of the list.
  `placeTags()` puts each tag beside its place in the first spot that touches no label, no mark, no other tag
  and stays in the drawing (sketch.js untouched; positions computed after layout).

## 3. The final reading for herself

`systems/reading.js` sends `client: 'self'` to the engine screens too (`engineFor({ self: true })`,
`questionOf('self')` = ambito se, forma quadro); the spread stays the Celtic cross with the ten cards of
`finale.rules.js`. In `consult.js`, `self` has no tone and no client reaction: after the final answer it shows her
answer, «N su M» and the Reader's line (`thanks` of the `self` client), then «Chiudo il libro». No pay. The header:
her name and «Un quadro generale, su di me». The session around it (her card, portrait, diary) is unchanged.
Seen on screen (`skip=trial`, shots below): ten cards one at a time, «Ricordamela» on a Major, the summary of ten
scrolls with the final question reachable, the end screen. «Ricordamela» on a Minor: only `helpNote` checked in
node (the trial skip owns no Minors).

## 4. The bot (`scripts/playthrough.mjs`)

Added: the chapter card (`.cc`, tap when the cue shows), lesson practice questions answered at random (detected by
their question line: «che cosa ti aspetti?» / «che cosa diventa quando…»; lessons are ordinary dialogue and play
through); after a level-up the bot tries the step again (it used to keep studying at the table after reaching the
gate's rank); when the cottage table offers nothing (action '·') it goes back to the step for 30 s.

Final run (built tree of 15:25, preview on 5402, both sides in parallel, `timeout 1500` each), zero page errors in
both, neither reached `ending.seen` within 25 minutes:
- `--only first` (A): chapter 2 gate reached at 329 s with xp 182, level 4 after 135 s of study (xp 276), chapter
  card «Il bosco»; trapdoor at 768 s with xp 395, broom (6) at 935 s and level 7 at 1016 s, both while studying at
  the trapdoor; level 8 at `c3.client`. Stopped at **`c3.coven`** (xp ~770, 16 cards): the coven asks for 19 Majors;
  run A fails its third street Exam on purpose (1288 s, cards confiscated), went to the deposit once, then looped
  between the coven (refused), the depths' hiding places and the cottage table, where «Leggi» opened no reading the
  bot could see. Not diagnosed further.
- `--only last` (B): gate 1 at 325 s (xp 187), level 4 at 482 s; trapdoor at 794 s (xp 441), broom 932 s, level 7
  1007 s; chapter card «L'alba» at 1438 s, level 9 at 1474 s on **`f.last`**, the last step: it was inside the
  epilogue when the limit came.

## Verified

`npm test` green; `npm run build`; screens at 390x844 in `/home/claude/shots-balance/`: `hud-main.png`,
`hud-side.png` (tracked mission on the slip), `mappa-top.png`, `mappa-tracked.png`, `mappa-forest-seen.png`
(tags beside places, no overlap), `mappa-village.png`, `self-q1.png`, `self-help.png`, `self-summary.png`,
`self-summary-end.png`, `self-end.png`.

## Not verified

A real phone; the HUD slip with a mission text on a very narrow screen below 390 px; how long a gate really takes
in minutes (the script counts readings, not minutes); generated clients and street readings are counted as a
cottage client giving 3 xp; the lessons' practice questions may give stars through other agents' code (not
counted).
