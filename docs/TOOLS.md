# Tools

Small node scripts that keep the story world consistent. No dependencies; each is a CLI over pure
functions that a test also calls. The vault (`lore/`, see `lore/README.md`) is the canon; the story
data (`src/data/story/`) is the truth of what the game does. These tools compare the two.

| Command | Writes | Run by `npm test` |
|---|---|---|
| `npm run lore check` | `notes/tools.md` | yes (`tests/lore.test.mjs`: no errors) |
| `npm run lore gen` | `lore/tratti/`, `lore/scelte/`, `lore/finali/` | yes (`gen --check`: up to date) |
| `npm run lore sapere` | `src/data/sapere.js`, the tables of `lore/sapere/_il-cerchio.md` (from `lore/sapere/`) | yes (`tests/sapere.test.mjs`: in step, the circle closes) |
| `npm run coverage -- --runs 1000` | `docs/COVERAGE.md` | a small run (`tests/coverage.test.mjs`) |
| `npm run map` | `docs/MAP.md` | yes (`tests/map.test.mjs`) |

Code: `scripts/lore.mjs`, `scripts/coverage.mjs`, helpers in `scripts/lore/` (`frontmatter.mjs` reads the
YAML subset of the vault, `story.mjs` walks every scene once and records what it says, sets and reads,
`vault.mjs`, `check.mjs`, `gen.mjs`, `play.mjs`). A story generator should target `story.mjs`'s model
and the README table: those are the contract.

## `lore check`: the linter

**Errors** (fail the tests), each certainly wrong:
- a file without `tipo`, or missing a field its `tipo` requires. The fields come from the table in
  `lore/README.md` (backticked names outside parentheses), so adding a row there adds a type. Pages whose
  name starts with `_` are indices: no frontmatter needed. A `tipo` with no README row is a warning.
- a `[[link]]` that resolves to no file; a file name that is not lowercase-hyphen-ascii, or not unique.
- in `lore/fatti`, the `flag` field: names after `step`, `flag`, `session`, `cast` that do not exist
  (a step of STEPS; a flag that something sets or reads, in the data or in the code; a session; a CAST id).
  Clauses with another keyword are not checked (their count is in `notes/tools.md`).
- in `lore/persone`, an `id` that is not a speaker, a CAST id, a client or a script id.
- a `meccanica` with no `serve`; an `obiettivo` with no `meccaniche` and an empty `aperto`.
- **continuity**: a claim "P knows fact F from scene S" (`sa: { fatto, da }` in persone, where `da` is a
  fatto whose `scena` names the scenes; or `chi_lo_sa: { chi, come }` in fatti, where `come` names a
  `file.js#scene`) is an error when F happens at a main-path step (its scene is the CAST entry of one step)
  and S can play at that step or earlier (from its CAST conditions `step`, `stepIn`, `chapter`,
  `chapterMin`, or the scene that calls or jumps to it), and nothing in S tests a flag of F or a later step.

It does **not** catch: what a line of dialogue means (it never reads the text); claims with no
`file#scene` (82 of the 120 `chi_lo_sa` today) or whose fact or scene is not on the main path (side
encounters, clients, trials: skipped and counted, never guessed); a person who speaks about a fact in a
scene the vault does not list; facts gated by stats or the world. Zero continuity errors means "no
contradiction found among the claims it could place", not "the story is consistent".

**Warnings** (in `notes/tools.md`): a flag set by a scene and tested elsewhere that no fatto names; a scene
named in a fatto's `scena` that is not in that file; a principio no meccanica serves; an unknown `tipo`.

## `lore gen`: the generated pages

Written from the story data, never invented; first line `# generato da scripts/lore.mjs, non modificare a
mano`. `npm test` fails when they are out of date, or when a page is left that is no longer generated:
after changing a script, a session, a visit or a fatto's `scena`, run `npm run lore gen`.
- `tratti/tratto-<id>.md`: the five axes, affinity and bond for each witch, popularity, Tartufo: every place
  that moves it (`stabilisce`, with the choice) and every condition that reads it (`mette_alla_prova`).
- `scelte/<file>-<scene>-<n>.md`: every choice of the scripts, sessions and visits: options (60 chars),
  what each sets, its class: `stabilisce` (sets something read somewhere: a read flag, a trait, trust, a
  card or suit point), `mette_alla_prova` (an option has `when`, or what follows tests the state),
  `entrambe`, `colore`. Linked to the fatto of the scene. `_indice-scelte.md`: counts, traits never
  tested, traits tested but moved in fewer than 3 scenes, flags set and never read, flags read and never set.
- `finali/`: one page per conditional piece of the trial, the dawn, the campfire, the last session, plus
  the final portrait (one per axis, the pairs, the suit), each with `si_guadagna`: where every condition is
  earned. `_tabella-finali.md` reads the endings backwards.

"Read" for a flag means: a condition reads it, or its name appears in the code outside `src/data` (as a
literal, a data key, or a template like `` `leaf.${kind}.` ``). This is generous on purpose: a flag reported
as never read is really never read by name.

## `coverage`: random play

`scripts/lore/play.mjs` plays the whole story with the real runner and a seeded RNG (same seed, same page),
half the runs as a newcomer and half with popularity, Tartufo, trust and the broom; it also plays the
sessions, the Reader's visits, the optional CAST scenes along the way (30% each time they are available),
patrol exams (25% per step) and the post-ending scenes. Every IF branch, option, observation and visit
remark is marked; `docs/COVERAGE.md` lists scenes never played, units never shown or rare (< 1%), the trait
and trust distributions at the end, her card and suit, and how often each ending variant appeared.

It cannot reach, by construction: the lessons (offered by glue), the garden, opinions, props, the trials
themselves and the doors after them, the clients' readings, world events (fog, tall grass), anything gated
on days, on stats it does not simulate (`fires`, `stuns`, `locks`) or on popularity/Tartufo values between
0 and 40. A zero there is not a bug. A zero elsewhere is worth a look; a rare line is not a failure.
`tests/coverage.test.mjs` only checks that runs end without warnings, are reproducible, and that every
main-path scene and every top-level ordinary option of it is reached.

## Adding a side story

The recipe, in order, is `docs/KIT.md` section 1 (Italian). This is the machinery behind it.

**Which kind.** If the cards must decide something in the story (forks exist only there) it is a **trial**:
data in `src/data/trials/<id>.js` (rules the tests enforce: `docs/TRIALS.md`), the scenes round it in
`src/data/story/scripts/<id>.js`. If it is only dialogue it is a **dialogue story**: a script, a CAST entry
(`cast.js`, or `extras.js` for someone already playing), a fatto, flags set by an option or `flag()` and
tested by a later `IF`. `SIDE` in `steps.js` is only for a hidden card someone tells about. Worked example of a
trial with two places and a person who changes with her affinity: `src/data/trials/hat.js` +
`src/data/story/scripts/hat.js` («Il cappello in soffitta»).

1. **Script files are discovered.** `scripts/lore/story.mjs` reads every `.js` file of
   `src/data/story/scripts/` and takes each exported map `{ sceneId: [nodes] }`; a new file is seen by `lore gen`
   and `lore check` with no list to edit. A scene exported by two files (merged into another map, like `hat.js`
   into `TRIAL_SCRIPTS` at the end of `trials.js`) is listed once, under the file that defines it: write that
   file in the fatto's `scena` (`hat.js#trial.hat.door`).
2. **The fatto.** `lore/fatti/<name>.md` with `flag: "cast <id>; flag a / b"` and `scena: "<file>.js#<scene>"`;
   list who knows it in `chi_lo_sa`, with the `file.js#scene` where they learn it in `come`. `fonte: proposto`
   until Andrea says yes; the persons get a line in `aperto`, not in `arco` (`lore/README.md`).
3. **Conditions** are the keys of `src/core/cond.js` (syntax in the comment at its top; the list `COND_KEYS`
   is exported and is what the data tests accept, so nothing is copied by hand any more). Not expressible:
   «a trial failed today» (`wait`) and «talked to her once» (`once`); see `docs/TRIALS.md`.
4. `npm run lore gen`, then `npm run lore check`: the fatto warning disappears, new choices get pages.
5. `npm run coverage`: a dialogue scene should not be in "never played" (if it is, its CAST conditions are too
   narrow); trials and the doors after them cannot be reached by random play, so a zero there is expected.
6. `npm test`, `node scripts/prose.mjs`. `node scripts/map.mjs --check` fails after any new file (the line
   counts per folder change): the lead rewrites `docs/MAP.md` with `node scripts/map.mjs`.
7. Screens: `Looking at it` below.
8. **The grimoire's map.** A new anchor in a region's map (`village.js`, `forest.js`, `depths.js`) needs an
   entry in that file's `map`: `{ label, kind }` (a place: its pencil name and its drawing in
   `src/ui/sketchink.js`), `{ in: '<anchor>' }` (part of a place: a card's hiding spot) or `{ off: 'why' }`. A new
   room or Altrove map needs `mapDoor: 'village.<door>'`. Positions, lanes and her mark are computed from the tiles
   (`src/ui/sketchmap.js`); `tests/map.sketch.test.mjs` fails until the new anchor, door or story target has a
   place, and checks that no two names overlap from 300 to 520 px.
9. **Its slip on the map.** Every entry of the extras registry is a paper slip beside its place on the Mappa
   page, with a card on tap (`src/ui/missions/`: `model.js` pure, `page.js` draws, `pins.js` places the slips,
   `titles.js` the cards). A new entry needs a card in `TITLES` of `titles.js` (title, kind, who told her,
   what she gets): `tests/missions.page.test.mjs` fails until it has one, and also when a new file pushes
   entries into `EXTRAS` (add that file's ids to `registryIds()` in the test). Harness:
   `harness/missions.html?s=1..6[&tall=1][&tap=<id>][&done=1]` (the real page in six hand-made states).

## The vault in a browser: `<site>/lore/`

A small read-only viewer of `lore/` for a phone, with no Obsidian: home (`lore/inizio.md`, search, the
types), one page per note (frontmatter as a card, body, «Collegato da», a local graph), lists per type
(fatti in `quando` order), and the whole graph (`#/grafo`; choices, endings and indices start hidden).
Routes are hashes (`#/n/<id>`, `#/t/<tipo>`, `#/grafo[/<id>]`, `#/cerca/<q>`), so links can be shared.

- `scripts/lore/site.mjs` builds the data from the vault with `vault.mjs`: every note (id, tipo, title,
  frontmatter, body, links, broken links, backlinks), the type colours of `lore/.obsidian/graph.json`, and
  the graph positions (computed once here with `lore-site/layout.js`, so the phone only draws). Above
  1.5 MB the bodies go to `bodies.json`.
- `lore-site/` is the page: vanilla ES modules, no framework, no CDN (`app.js`, `graph.js` canvas with pan,
  pinch and tap, `md.js` minimal markdown, `style.css`; the title font is copied from `@fontsource`).
- `vite.config.js` (`lorePlugin`) emits all of it under `dist/lore/` at every `npm run build`, so the
  hosted copy is always the vault of that commit; `npx vite` serves `/lore/` rebuilt on every request (edit a
  note, reload). `npx vite preview` serves the built copy.
- `tests/lore.site.test.mjs`: built from the real vault, every link resolves or is flagged, backlinks mirror
  links, the plugin emits `lore/index.html` and `lore/data.json`.

## Looking at it

`scripts/shot.mjs` drives headless Chrome (puppeteer-core; set `CHROME` if it is not `/usr/bin/google-chrome`
or `chromium`). Start a server first: `npx vite` (or `npm run build && npx vite preview`).

    node scripts/shot.mjs 'http://localhost:5173/?debug&skip=trial' /tmp/a.png --phone --until domcontentloaded --steps steps.mjs

- The village and forest in the real game, building by building (districts, doors, seasons, her cottage's
  three stages, the grimoire's maps): `harness/village.steps.mjs` (`OUT=<folder> ONLY=<names>`, the list of
  shots at its top; it hides the labels and toasts so a naive reader cannot read the answer). New buildings
  close up, before they go into a map: `harness/buildings.html` (the proof board, `harness/buildings.steps.mjs`).
- `--phone`: 390 x 844, scale 2, touch. `--wait ms`: pause before the shot (default 1200).
- `--until domcontentloaded`: the page never reaches network idle (the default), so without it the shot times out.
- `--steps file.mjs`: `export default async (page) => {...}` runs before the shot and may take its own shots
  with `page.screenshot({ path })`. Examples: `harness/play.steps.mjs` (exam, readings, draws); `harness/trial.steps.mjs`
  plays a whole post-ending side story (the hat) from a hand-made state, shooting every moment (`OUT` is the
  folder, it must exist).
- New buttons ignore taps for 650 ms: in the steps set `window.__salemNoGuard = true` via `page.evaluate`.
- Never `return` the promise of a service that opens a screen (`window.__salem.call('grimoire.open')`) from
  `page.evaluate`: it resolves only when the screen closes, and the step hangs. Wrap it in braces.
- The map tab: `window.__salem.call('grimoire.open', { tab: 'mappa' })` (in braces, see below). To see every
  place, mark them seen first: `s.stats.seen[a] = true` for each key of `await window.__salem.call('world.anchors')`
  (and `s.flags['garden.given'] = true` for her garden). `window.__salem.travel({ map, x, y })` puts her on an exact
  tile, to see her mark between two places.
- `?debug` gives `window.__salem` (`state`, `call(name, ...)`, `travel(anchor)`, `where()`, `give(ids)`,
  `setStep(id)`, `jump(key)`). The skip points that exist (`SKIPS` in `src/glue/debug.rules.js`) are
  `?debug&skip=c2`, `c3` and `trial` (the start of chapter 2, chapter 3, and just before the trial; the hosted
  page takes `#skip-c2` etc.). There is no skip for after the ending.
- **After the ending**: prepare the state by hand in `page.evaluate`, as the tests do (`ENDED()` in
  `tests/trials.content.test.mjs`): `s = window.__salem.state; s.chapter = 4; s.step = 'post.minors'`, set
  the flags the story reads (`ending.seen`, and what the piece asks: `side.m12`, `lesson.fly`,
  `trial.dare.pass`...), `s.powers.broom = true`, `s.cards[id] = { found: true, stars: 1 }` for the Majors,
  `s.trials.<id>`, then `window.__salem.travel('<map>.<anchor>')`.
- Taps: the action button is `.w-act` (dispatch `new PointerEvent('pointerdown', { bubbles: true })`); a line of
  dialogue advances with `pointerdown` on `.sy-layer` (once to finish the line, once to go on), her answers are
  `.sy-opt`; in a trial the fan is `.tr-fc`, the options `.tr-opt`, the screens' button `.tr-btn`, and a
  witch's card turns with `pointerup` on the parent of `.trw-veil`.

## Adding a person

1. Lines with `say('<id>', ...)` in the scripts, and a CAST entry with `who: '<id>'` if she stands somewhere.
2. `lore/persone/<name>.md` with `id: "<id>"`, the fields of the README table, `sa` for what she knows
   (`da` must be a fatto whose scene plays after the fact). `lore check` refuses an id the code lacks and a
   knowledge that comes before its fact.

## Adding a world

A new world is a new `lore/` vault and new story data with the same shapes. Copy `lore/README.md` (its table
is the schema: change rows to change types), keep `scripts/lore/` as it is, put the new script files in
`src/data/story/scripts/` (`story.mjs` discovers them), then: `lore check` until no errors, `lore gen`,
`coverage` to see what the new world leaves unreachable.
