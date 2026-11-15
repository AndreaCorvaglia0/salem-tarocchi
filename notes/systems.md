# Systems: portrait, visits, pacing, guidance

## Core (src/core) — what the next agents should know
- State keys added (with migration in `state.js` `migrate()`): `traits`, `hits {axis:{plus,minus}}`, `traitLog`,
  `verdicts`, `cardNow` (the last announced "la tua carta", for stability), `told`, `visits`. Removed on load:
  `powers.seals|sense2|light2`, `tools.sieve`, flag `sight.far`.
- `progress.js`: `addTrait`, `traitWord`, `traitWords`, `yourCard()` (nearest SIGNATURE: dot with the
  normalised signature + 0.25×points + birth head start 2.5 fading over 8 trait points + 0.6 for `cardNow`;
  all traits 0 -> birth card or m00), `snapshot()`, `recordVerdict()`, `tellCard(id)` (told + second star),
  `untoldMajors()`, `yourSuit()` from the traits (`SUIT_OF_TRAITS`, legacy `state.suit` ×0.1, sign tie-break).
- Levels: `LEVEL_XP` has 12 entries; `levelOf` stops at 9 until `ending.seen` (`maxLevel()`); `levelProgress().top`.
  Powers: `POWERS = cat, fire, sense, move, stun, broom`; gifts 2 cat, 3 shop.open, 4 fire, 5 sense, 6 broom,
  7 stun, 8 move, 9 a line (flag level.nine), 10-12 a wider sense. `senseRadius(level)` (0 below 5; 10,14,18,
  24,32,44,64; Infinity at 12), `lightStep(level)` (0/1/2 by title; night.js adds 7 px per step).
  `syncPowers()` runs at import: old saves get the powers of the levels they have.
- `cond.js`: trait, trend, steady (|v|>=3 now AND at the last snapshot, same sign), turned, torn, verdict,
  yourCardIsBirth, hasBirth, hasYear, element, modality, moon, bornOn; tokens {traits} {trait:x} {lastVerdict}
  {element} {modality} {ruler} {rulerCard} {birthDay} {dayPlanet} {dayPlanetCard} {moon}, all safe without data.
- `data/cards.base.js`: `SIGN_LORE`, `WEEKDAYS`, `PLANET_CARD`, `weekdayOf`, `moonAge`, `moonOf` (mean synodic
  month from the new moon of 6 Jan 2000 18:14 UTC, noon UTC of the birth day; tested on known dates).

## Story (src/story)
- `pace.js`: the tap gate used by sessions, visits, both cinemas and the dialogue box (350 ms after the text
  is whole; the cue only then; Space auto-repeat ignored). A line followed by a choice is a question: the
  runner passes `{ ask: true }` and the options come without a tap.
- `tableui.js`: captions and choices of the Reader's table (sessions and visits share it).
- `visit.js` / `visit.plan.js`: `story.visit({ force })`. Order: OPENERS, THREAD, per card detail -> tell ->
  words (+ the one ask), RITUALS, CLOSERS; each remark's `then` runs with a runner. Card without TALK: the
  sheet's `says`. Marks told, +1 visit, 10 xp, snapshot. Sessions also snapshot at the end.
- `portrait.js`: the `{ portrait: true }` lines (torn / plus>=3 / minus<=-3 / mid, two PAIRS, SEEDS[yourSuit()]).
- `session.js`: no own lines after the birth paper; the year may be empty; `pick` supports `read`.
- `story.busy` service (a script is running).

## Glue and UI
- `glue/traits.js` (+rules): esplora from `seen` (new place off the STEPS anchors), `talk` (chat away from
  the step's anchor), straight-to-step (-1, <=70 tiles walked, no detour); rischio from `patrol:seen`, `stun`
  (+1), the bottle (-1). Each kind once per 3 min. "Hiding" is not fed (no signal for it yet).
- World hooks added (small): bus `seen {anchor}`, `talk {id, at}`, `patrol:seen {kind}`, `stun`; service
  `world.ahead(n)` (screen point of the trail's n-th tile). Seals no longer gate chests and doors.
- `glue/hints.js`: emits `grimoire` (after the first ceremony), `exam`, `reading`; the trail via `world.guide`
  in chapters 0-1 (to `village.road_card` while only the Fool is found and the step's `at` is the arrival);
  service `guide.ask` (chapter 2+: 8 s of trail; the HUD line calls it, else opens the map).
- `ui/hint.js`: shows hints (waits while a scene covers the world), tap marker for `move` on touch.
- HUD: compass on the step line, wraps to two lines, the book beckons until opened once.
- `glue/fly.js` (+rules): `fly.check()` / `fly.to(anchor)`; Mappa's "Vola qui" only on seen village/forest
  places; the reason line shows when she cannot take off. Fog: reads `world.where().fog` if the world adds it.
- Sieve removed (shop, Io, glue, things). Review is now a 5-question calm quiz (systems/review.js).
- Exams/locks: meaning kinds only on told cards (`exam.rules.js buildQuestions`).

## For the writers / lead
- `tests/story.data.test.mjs` must learn the new condition keys, tokens, actions (`trait`, `visit`, `verdict`).
- Data `barks.js` still has a `{ tool: 'sieve' }` line: it never holds now.
- `{ portrait: true }` no longer says a closing "{yourCard}" line: the session data should.
