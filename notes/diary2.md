# Reading for herself and the diary of readings (16 Nov)

## What exists
- `src/glue/selfread.rules.js` (pure): `canSelfRead` (stats.readings >= 1), `spreadsFor` (single, ppf, celtic when
  `state.spreads.celtic`), `PICK_TABS`/`pickerCards`/`realCards` (picker of all 78), `makeEntry` (the saved shape),
  `addReading` (newest first, cap 60; an `at` clash moves on by 1 ms), `removeReading`, `seedOf` + `compose`
  (engine `plan` + `say` with `seeded(seedOf(entry))`, opening 'never': the same text every time), `clientEntry`,
  `xpDue`, `dateIt` ("16 novembre 2026").
- `src/glue/selfread.js`: services `readings.keep`, `readings.note`, `readings.delete`, `selfread.intro` (returns
  seen, then marks it). Wraps `reading.open`: engine client readings (result with `cards`) go to the diary
  automatically; old flow and the finale (`self`) do not. Self reading: `SELF_XP` 5 xp the first of each
  calendar day (`state.world.once['selfread.day']`), no coins, no popularity, no `stats.readings`.
- `src/ui/selfread.js`: «Una lettura per me». The Reader's four lines the first time only
  (`state.world.once['selfread.intro']`); the engine TREE one question at a time, two large buttons, «Indietro»;
  the theme box + optional line «Scrivi la domanda con parole tue»; «Quante carte?»; «Pesco qui» (a line, then
  `draw.pick` fan per position from owned voiced cards; reversed only with `lesson.reversed`) or «Le ho pescate io»
  (per position: «Rovesciata» toggle, tabs Maggiori/Bastoni/Coppe/Spade/Denari, 4-column grid, used cards
  disabled); the composed reading card by card (mini card rotated + «rovesciata», position, name, essenza in hand
  font, sentence), «Colpo d'occhio», closing, advice; «Una nota mia»; «Tieni nel diario». `readingScreen(entry)`
  reopens a saved one: note editable (saved on close), «Cancella» → «Sì, la cancello» / «No, la tengo».
- `src/ui/readings.js`: «Le mie letture», a paper sheet: «Per me»/«Per <client>», date, question or field, thumbs.
- Hooks: `src/ui/io.js` two `gx-link` entries under the diary (Io page); `src/glue/index.js` one import line;
  `src/core/state.js` default `readings: []` + migrate to [] when not an array.

## Verified
- `tests/selfread.test.mjs` (8 tests): shape, cap, same text reopened, every tree path → valid question and reading,
  picker (78 unique valid voiced ids, realCards validation), client entries, unlock/spreads/once a day/date,
  the glue (xp once a day, no coins/pop, client wrap, finale skipped, delete, intro once).
- `npm test`: my tests pass; 3 failures in `tests/story.reader.test.mjs` come from another agent's Minors lesson text.
- Build OK. Puppeteer 390x844 on the built app (`?debug&skip=c2`), screens in `/home/claude/shots-diary/`
  (script `run.mjs`): Io entries, intro, tree, theme, spread, method, picker (Maggiori, Coppe reversed), composed
  reading with a reversed card, end with note, the fan, single-card reading, diary list, reopened, delete confirm,
  a client entry reopened, after delete. No page errors. xp 290 → 295 on the first, unchanged on the second.

## Not verified
- A real client reading feeding the diary in the browser (the client entry on screen was injected; the wrap is unit
  tested). Desktop layout. A real phone, keyboard over the text fields. Sound.

## Decisions not in the brief
- When she owns fewer voiced cards than positions, «Pesco qui» draws from all voiced cards.
- The diary entry for a client stores the client's question text in `question.text` and a recomposed closing (seeded),
  not the exact words she saw during the quiz (those used Math.random).
- Title: no entry added; «Sfoglia il grimorio» opens the grimoire (on Carte), and the Io page has the entries.
- UI imports the pure `glue/selfread.rules.js` and `src/reading/` directly; mutations go through services.
- The self reading screen has its own small dark theme (`sr-*`, copied look of `sx-*`) instead of importing systems.
