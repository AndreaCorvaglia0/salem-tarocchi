# Systems 2 (16 Nov): popularity, Tartufo, special answers, extras and missions

## What exists

- **State** (`core/state.js`): `pop`, `tartufo`, `treats` (numbers), `extras` ({ id: 'seen'|'active'|'done' }),
  `track` (id of the followed side mission or null). Old saves: defaults merged, `migrate` coerces them.
  The world keeps visited 8x8 cells in `state.world.cells[map]['cx,cy']`; one-offs in `state.world.once`
  (`pop.said.<level>`, `pop.back.<client>`, `tartufo.map.<map>`).
- **`core/bonds.js`** (re-exported by `core/progress.js`): `POP` (names), `popLevel`, `popProgress`, `addPop`
  (emits `pop`, `pop:up {level}`), `popForReading({ wrong, firstBack })`, `wrongOf(result, n)`; `TARTUFO`
  (judgements), `tartufoLevel`, `tartufoJudge`, `addTartufo` (emits `tartufo`, `tartufo:up {level}`),
  `addTreats`, `tapOutcome`, `treatChance` (0.25 new cell off the way, 0.02 otherwise, 0 in a script or
  within 40 s of the last find).
- **`core/extras.js`**: `EXTRAS` (today = the 8 `SIDE` entries, `text` = their note), `extraStatus`,
  `extrasShown`, `extrasDone`, `extrasTotal` (also from progress), `trackedExtra`, `track(id|null)` (emits
  `track`), `markSeen`, `syncExtras()` (stores 'done', drops a finished tracked mission).
- **Conditions** (`core/cond.js`): `{ pop: n }`, `{ tartufo: n }` (level ≥ n), `{ explored: n }` (distinct
  anchors in `state.stats.seen` ≥ n), `{ title: 'fattucchiera'|'strega'|'gran maestra' }` (same as
  `{ level: 4 }` / `{ level: 7 }` / the `ending.seen` flag; `{ level }` already existed and still works).
- **Special answers** (`story/special.js`): option `special` + `when` + optional string `tag`. The runner
  orders them after the ordinary ones and calls `ui.choose(texts, metas)` (metas only when a special is
  present, so old fakes and UIs are untouched). `story.choose` accepts `[{ t, special, tag }]`.
  Dialogue box: gold border, ★ badge, tag in small caps above. Reader's table (`tableui.js`): same shape,
  gold-edged card, `✦ [tag]` above. Up to 6 options, keys 1-6.
- **Glue** `glue/bonds.js` (+ pure `bonds.rules.js`): popularity from client readings (wraps `reading.open`;
  `client` set and not `'self'`), +1 the first time a returning client is served (`clients.js` calls
  `markBack`); the popularity line of Malva/Ginepra on a free talk; Tartufo tap/treat/pat; +1 the first
  entry in each map with him; +1 each new anchor seen with him (the `seen` event); treat finds on `cell`;
  the mission target (`world.mission`) = tracked side mission or the step's anchor.
- **World**: `cell` bus event `{ map, cell, fresh, nearRoute }`, `map:enter {map}`, `tartufo:tap`; tap on
  Tartufo within 3 tiles (he hops); service `world.mission(anchor)`: its walkable way from where she was
  when it was set is the "mission path" (within 3 tiles = on the way); with no target, road tiles count.
- **Trail**: `trailTarget({ ..., track })` uses the tracked anchor (same chapter rules: always in ch. 0-1,
  on HUD tap later). Map circle in the grimoire follows it too.
- **Shop**: a fourth tag "Un manicaretto per Tartufo", 3 coins, any number of times.
- **Grimoire**: Io page: "Popolarità" (name + thin bar), "Tartufo" (5 paws, filled level+1, and his
  judgement; only once she has the cat); treats in the things row. Mappa: "Missioni" at the top on a
  phone (under the village sketch on a desktop): main step in ink, side missions in pencil with a dashed
  underline, an "in più" label, a red "nuova" mark until tapped, state (da fare / la sto seguendo / fatta),
  "in più: fatte N di M". Tapping a side mission follows it; tapping the main one goes back.
- **Data**: `BARKS.pop` (the three lines, exact text), `BARKS['tartufo.treat']` (4), `['tartufo.pat']` (3),
  `['tartufo.found']` (3). Worked example: `malva.chat` (Malva at home, chapter 1, `c1b.js`), two specials
  after "Niente, passavo soltanto a salutare.": `tartufo` (`when: { tartufo: 1 }`) and `pop` (`when: { pop: 1 }`).

## Decisions not in the brief

- "New area discovered with him" = a new anchor in `state.stats.seen` (already recorded); cells are used
  only for the treat finds.
- A popularity line plays only if the talk's script does not move the main path (no `step`/`chapter`
  node, following `goto`): it is queued before their own script. The highest unsaid line of that person
  is said, and their lower ones are marked said. Guillemets are stripped in the dialogue box.
- Wrong answers of a reading: `result.wrong` if the reading returns it, else `round((1 - score) * n)`.
  The new reading engine (src/reading/**) should return `{ wrong }` to be exact.
- Pat cooldown counts play time (page visible), kept in memory: a reload resets it.
- `fatte N di M` counts as done a side card found before anyone spoke of it; such entries are not listed.
- A string `tag` on an option is a special label; an object `tag` is still a card point.
- Paws: level 0 shows one filled paw, level 4 all five.

## Verified

`npm test` green (279; new file `tests/core.bonds.test.mjs`). One run under load (Chrome + preview running)
showed 3 failures that did not reproduce in three later runs; I did not identify them. Screenshots at
390x844 via `scripts/shot.mjs` on the built app with `?debug&skip=c2`, in `/home/claude/shots2/`: `io.png`,
`missions-before.png`, `missions-tracked.png`, `missions-map.png` (red circle on the tracked pond),
`special-choice.png`, `special-reply.png`, `treat-toast.png`, `pat-toast.png`.

## Not verified

The popularity line on a real talk with Malva/Ginepra in the browser (only its pure rules), the treat
finds while walking, the walk points, a tap on Tartufo by finger (the shots call `scene.tapCat()`), the
Reader's-table special style on screen, the shop tag on screen, desktop layout, sound.

## For the lead

- HUD next-step line still shows the main step while a side mission is tracked (only trail and map circle follow).
- docs/CONTRACT.md: new state keys, events (`pop`, `pop:up`, `tartufo`, `tartufo:up`, `treats`, `track`,
  `extra:done`, `cell`, `map:enter`, `tartufo:tap`), service `world.mission`, `ui.choose(texts, metas)`.
- New optional content: add entries to the registry (today `EXTRAS` is built from `SIDE` in `core/extras.js`).
