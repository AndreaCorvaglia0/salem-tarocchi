# Lessons, chapter card, special answers (16 Nov)

## What exists

- **Three lessons as missions** (`src/data/story/missions.js` `LESSON_MISSIONS`, scenes in `scripts/lessons.js`):
  `lesson.fly` (Malva, zone at `village.malva_door`, the scene moves to her kitchen garden), `lesson.minors`
  (Ortica at her hut, npc entry before `ortica.chat`), `lesson.reversed` (Edera in her nook, before `edera.chat`).
  Each has an announcing script (`fly.offer`, `minors.offer`, `reversed.offer`: Tartufo brings the word, a diary
  line, flag `<x>.offered`) and sets `lesson.fly` / `lesson.minors` / `lesson.reversed`. Minors and reversed also
  do `{ do: 'lesson' }` (grimoire pages `minors`, `reversed` in `src/data/lessons.js`, the grid built from grid.js).
- **Order and availability**: fly when she has the broom (any chapter); Minors when fly is done, chapter >= 2 and
  Ortica has received her; reversed when Minors is done, chapter >= 3 and Edera has received her.
- **Glue** `src/glue/lessons.js`: pushes the three entries into `EXTRAS` (kind `lesson`, `now: true`), announces
  the due lesson when she is free (on `level:up`, `power`, `flag lesson.*`, `chapter`, `step`, `world.start`: so
  old saves get it on loading), shows hint `lesson` after an announcement and hint `fly` once after Malva's scene.
  It imports `src/story/chapter.js`.
- **Practice**: ordinary choices, right option `ok: true` (+5 xp), wrong ones get a correction and the lesson
  goes on. Texts are the cards' `essenza` imported from the voices. 3 questions (Minors), 2 (reversed).
- **Chapter card** `src/story/chapter.js`, service `story.chapterCard(n)`; `chapterCard(n)` in `h.js`. Called
  before s1 (card 2), s2 (card 3), s4 (card 4).
- **Special answers** (helper `sp()` in `h.js`) on eight choices: c1.venus (tartufo, magic), enc.child (magic,
  tartufo), enc.gravedigger (tartufo), ortica.chat (broom, rank), c3.jail (magic, tartufo, witch, pop: the same
  grate), edera.chat (tartufo, explore), post.ginepra (broom, explore), f.dawn (broom).
- **Reader**: OPENERS `tartufo` (level 3) and `pop` (level 2), once each.

## Decisions the brief did not cover

- Malva teaches flying (Ortica has given up her broom, Ginepra cannot fly, Edera cannot walk).
- Reversed cards wait for chapter 3, because Edera is not reachable before.
- Card 4 goes before s4, not s3; card 1 is unused (it belongs before s0, started by main.js).
- The first lift is narrated, there is no real flight inside the scene.
- The lesson is not auto-tracked: the trail keeps pointing at the main story.
- New flags: `fly.offered`, `minors.offered`, `reversed.offered`, `lesson.fly`, `lesson.minors`,
  `lesson.reversed`, `post.shared`, `ortica.listened`, `edera.cat`; `state.world.once['hint.lesson']`,
  `['hint.fly.lesson']`. No new state key.

## Edits outside my files (small)

- `tests/story.data.test.mjs`: `REPEATABLE` + `minors.lesson`, `reversed.lesson` (practice options carry no trait).
- `tests/cards.sheets.test.mjs`: the lesson ids and teachers (2 lines).
- `tests/story.reader.test.mjs`: `COND_KEYS` + `pop`, `tartufo`.
- `src/glue/index.js`: one import.
- `ortica.chat`: the line "ti ho vista passare sopra i faggi" now also asks for `lesson.fly`.

## For the lead

- `LEVEL_GIFTS[6].text` (core) says the broom takes her to the places she knows, before Malva does.
- `glue/wire.js` asks for hint `fly` on bus `power`, which a level-up never emits; `glue/lessons.js` now owns
  that hint, so that line can go.
- `ui/mappa.js` could mark `kind: 'lesson'` / `now: true` entries; they also get a pencil number with no note.
- `story.chapterCard(1)` before s0 in main.js, if wanted.
- c3.edera says "la Torre a nord", but `depths.tower` is south of the coven.
