# Tools

Small node scripts that keep the story world consistent. No dependencies; each is a CLI over pure
functions that a test also calls. The vault (`lore/`, see `lore/README.md`) is the canon; the story
data (`src/data/story/`) is the truth of what the game does. These tools compare the two.

| Command | Writes | Run by `npm test` |
|---|---|---|
| `npm run lore check` | `notes/tools.md` | yes (`tests/lore.test.mjs`: no errors) |
| `npm run lore gen` | `lore/tratti/`, `lore/scelte/`, `lore/finali/` | yes (`gen --check`: up to date) |
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

1. Write the script in `src/data/story/scripts/<file>.js`, a CAST entry in `cast.js` (or `extras.js` for
   someone already playing), flags that are set by an option or `flag()` and tested by a later `IF`.
2. Add a fatto in `lore/fatti/` with `flag: "cast <id>; flag a / b"` and `scena: "<file>.js#<scene>"`;
   list who knows it in `chi_lo_sa`, with the `file.js#scene` where they learn it in `come`.
3. `npm run lore gen`, then `npm run lore check`: the fatto warning disappears, new choices get pages.
4. `npm run coverage`: the scene should not be in "never played"; if it is, its CAST conditions are too narrow.

## Adding a person

1. Lines with `say('<id>', ...)` in the scripts, and a CAST entry with `who: '<id>'` if she stands somewhere.
2. `lore/persone/<name>.md` with `id: "<id>"`, the fields of the README table, `sa` for what she knows
   (`da` must be a fatto whose scene plays after the fact). `lore check` refuses an id the code lacks and a
   knowledge that comes before its fact.

## Adding a world

A new world is a new `lore/` vault and new story data with the same shapes. Copy `lore/README.md` (its table
is the schema: change rows to change types), keep `scripts/lore/` as it is, point `story.mjs` at the new
script files (the list at the top of `loadStory`), then: `lore check` until no errors, `lore gen`,
`coverage` to see what the new world leaves unreachable.
