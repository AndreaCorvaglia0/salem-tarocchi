# Contract between modules

What the game must be: `DESIGN.md` (Italian). This file is how the parts fit. If something here is
wrong or missing, do not change `src/core/`: write it in `notes/<your-area>.md` and work around it.

## Stack

Phaser 3.90 for the pixel world only. Everything else (grimoire, dialogue, sessions, Exam, readings,
title, HUD) is DOM in `#ui`, built with `h()` and `css()` from `core/dom.js`. Vite 6, ES modules, no
TypeScript, no framework, no new dependency. Art is drawn in code (canvas), except the card images:
`public/cards/<id>.webp`, 350x600, use `cardUrl(id)`. Italian for every word the player reads; English
for code and comments. Phone first: 390x844 portrait must work with touch only; desktop also works.

## Who owns what

| Area | Folder | Services it provides |
|---|---|---|
| core (lead) | `src/core/`, `src/data/cards.base.js`, `src/main.js` | none: import directly |
| cards | `src/data/cards.js`, `src/data/spreads.js`, `src/data/lessons.js`, `src/data/questions.js` | none: import directly |
| story text | `src/data/story/` | none: import directly |
| narrative | `src/story/` | `story.run`, `story.session`, `story.say`, `story.choose` |
| world | `src/world/`, `src/data/world/` | `world.start`, `world.travel`, `world.where`, `world.anchors` |
| grimoire | `src/ui/` | `title.open`, `grimoire.open`, `card.found`, `card.show`, `hud.mount`, `hud.toast`, `shop.open` |
| play | `src/systems/` | `exam.start`, `exam.recover`, `lock.ask`, `reading.open`, `reading.free`, `draw.pick`, `review.open` |

Rules: `src/core/*` and `src/data/*` may be imported by anyone. A module in one area never imports a
module of another area: it calls `call('name', args)` from `core/services.js`, and offers its own with
`provide('name', fn)` at import time. Each area has an `index.js` that registers its services.

## State

`src/core/state.js` (`state`, `save`, `setState`) is the shape. Never write to `state` for things
`core/progress.js` already does (xp, cards, stars, points, trust, flags, diary, steps): call it.
You may add your own keys only under `state.world` (world) or by asking in notes.

Bus events (`core/bus.js`): `xp`, `level:up {level,title,gift}`, `coins`, `card:found {id}`,
`card:star {id,stars}`, `cards:confiscated {ids}`, `card:recovered {id}`, `yourcard:changed {from,to}`,
`trust`, `flag {k,v}`, `diary {t}`, `step {id}`, `chapter {n}`.

## Services (all return a Promise)

| Service | Signature | Meaning |
|---|---|---|
| `title.open` | `() -> 'new' \| 'continue' \| 'study'` | title screen |
| `hud.mount` | `() -> void` | next step line, level bar, grimoire button; listens to the bus; shows level-up and "la tua carta" changes |
| `hud.toast` | `(text, {icon?}) -> void` | short message |
| `grimoire.open` | `({ tab?: 'io'\|'carte'\|'mappa', study?: boolean }) -> void` | the menu; `study: true` from the title (no world: the map tab is read only) |
| `card.found` | `(id) -> void` | the ceremony: big image, tap the detail that strikes you, three words. It calls `findCard`, `setDetail`, `setWords` |
| `card.show` | `(id) -> void` | the page of one card |
| `shop.open` | `() -> void` | the shop: four tools and two cards |
| `story.run` | `(scriptId) -> void` | plays a script from `data/story` in the pixel world's dialogue box |
| `story.session` | `(sessionId) -> void` | plays a session with the Reader, illustrated |
| `story.say` | `(who, text) -> void` | one line in the dialogue box |
| `story.choose` | `([{ t }]) -> index` | a choice in the dialogue box |
| `exam.start` | `({ kind: 'constable'\|'afflicted'\|'judge', place }) -> { passed, right, wrong, suspicion }` | the Exam; it handles its own consequences (confiscation, `stat`s) except moving the player: on failure the caller does `world.travel('depths.jail')` |
| `exam.recover` | `() -> void` | at the court deposit: win back confiscated cards by answering on them |
| `lock.ask` | `({ cardId?, kind?, label? }) -> boolean` | one question to open a chest or a sealed door |
| `reading.open` | `({ spread, client?, cards?, script? }) -> { score, coins }` | guided reading by alternatives; `cards` forces the cards (the finale) |
| `reading.free` | `() -> void` | reading with your real deck: pick the cards you drew, get the walk-through |
| `draw.pick` | `({ mode: 'fan'\|'number'\|'top', pool: ids[], weights?, title? }) -> cardId` | drawing: face-down fan, say a number, turn the first |
| `review.open` | `({ ids? }) -> void` | calm flashcard review, no stakes |
| `world.start` | `() -> void` | creates the Phaser game in `#game` at `state.pos` or the chapter's start |
| `world.travel` | `(anchor) -> void` | moves the player to an anchor (any map) |
| `world.where` | `() -> { map, x, y, near: anchor \| null }` | |
| `world.anchors` | `() -> { [anchor]: { map, x, y, label } }` | for the grimoire map |

## Data: cards (`src/data/cards.js`)

```js
export const SHEETS = { m02: {
  see: 'Cosa si vede: due o tre frasi sui simboli dell\'immagine.',
  details: [{ id: 'veil', label: 'la tenda', x: 50, y: 30, r: 14, note: 'Cosa c\'è dietro?' }], // 3-4, x y r in % of the image
  says: 'Cosa dice in una lettura: una o due frasi, dando del tu.',
  core: 'Una frase sola, breve: il messaggio.',
  keywords: ['intuito', 'segreti'], // 6-8, "altri modi di vederla"
  reversed: 'La carta capovolta: una o due frasi.',
  embody: 'Come incarnarla: una cosa da fare.',
  ask: 'Una domanda su cui riflettere.',
  as: { present, cross, root, past, possible, future, self, environment, hopefear, outcome }, // one sentence each, "tu"
  confusables: ['m18', 'm09'], // cards a beginner mixes it up with
  rumour: 'Si dice che ... (where to look for it, vague)',
} };
export const sheet = (id) => ({ ...CARD[id], ...SHEETS[id] }); // minors: see, core, keywords (4), reversed only
```

`src/data/spreads.js`: `SPREADS = { single, ppf, celtic }`, each `{ id, name, taughtBy, positions: [{ id, n, label, hint, x, y, rot? }] }`
with `id` one of the `as` keys above (`single` uses `present`), `x y` in % for the layout.

`src/data/lessons.js`: `LESSONS = [{ id, title, by, pages: [{ h, body, spread?, cards? }] }]`, ids `deck`,
`single`, `ppf`, `celtic`, `suits`, `astro`. Short, in the voice of the mistress who teaches it.

`src/data/questions.js`:
```js
makeQuestion({ pool, kinds?, level = 1, rng? }) ->
  { cardId, kind, star: 'image'|'meaning'|'astro', prompt, show?: { card, crop? }, options: [{ t?, card?, ok }], explain }
// kinds: 'name' (image -> name), 'meaning' (card -> what it says), 'which' (meaning -> one of 3 images),
// 'detail' (cropped detail -> card), 'odd' (keyword that does not belong), 'astro' (card -> planet/sign),
// 'order' (what comes before/after), 'position' (a spread position -> its meaning). Distractors prefer confusables.
makeExam({ kind, pool, level, n }) -> question[]
```

## Data: story (`src/data/story/`)

`index.js` exports `SCRIPTS`, `SESSIONS`, `STEPS`, `CAST`, `CLIENTS`, `BARKS`.

A script is an array of nodes:
```js
{ say: 'malva', t: 'Chiudi la porta.' }            // who: a key of PEOPLE, or 'tu' (thought), or 'narra'
{ choice: [ { t: 'Scusa.', tag: { card: 'm14', suit: 'c' }, trust: { malva: 1 }, flag: 'x', then: [nodes] }, ... ] }  // >= 2
{ if: <cond>, then: [nodes], else: [nodes] }        // cond: core/cond.js
{ do: 'giveCard', id: 'm01' }      // through the card.found ceremony
{ do: 'draw', mode: 'fan', pool: 'row' | ids, give: true, title }   // 'row' = missing majors of this chapter
{ do: 'teach', spread: 'single' }  { do: 'lesson', id: 'deck' }
{ do: 'reading', spread: 'single', client: 'c1.widow' }
{ do: 'exam', kind: 'constable' }  { do: 'session', id: 's1' }
{ do: 'xp', n: 10 }  { do: 'coins', n: 5 }  { do: 'flag', k: 'met.malva' }  { do: 'trust', who: 'malva', n: 1 }
{ do: 'point', card: 'm09', suit: 's' }  { do: 'word', k: 'fear', v: 'essere lasciata' }
{ do: 'diary', t: 'Ho mentito al conestabile.' }  { do: 'step', id: 'c1.find3' }  { do: 'chapter', n: 2 }
{ do: 'travel', to: 'forest.entry' }  { do: 'tool', id: 'bottle', n: 1 }  { do: 'power', id: 'cat' }
{ do: 'cinema', lines: ['...'], pan?: 'village.square' }   // black bars, one line at a time
{ do: 'wait', ms: 600 }  { do: 'goto', script: 'c1.x' }
```
Text is filled with `fill()` (`{name}`, `{yourCard}`, `{stat:exams}` ...).

Sessions use the same nodes plus `{ ask: 'name' }`, `{ ask: 'birth' }`, `{ turn: 'm00' }` (a card turned
on the table), `{ pick: 'number', then: [...] }` (say a number 1-22; `{picked}` is the card's name),
`{ observe: [ { when: <cond>, t } ... ] }` (the first that holds: the confrontation with a true fact).

`STEPS = [{ id, chapter, text, at }]`: the main path in order; `text` is the line in the grimoire and
the HUD, first person, short; `at` an anchor for the map circle.

`CAST = [{ id, kind: 'npc'|'zone'|'prop', who?, at: anchor, when?: cond, script, once?: true, label? }]`:
who stands where and what happens. The world shows the first matching entry per id and re-checks on
`step`, `flag`, `chapter` events. `CLIENTS = [{ id, name, look, chapter, question | null, theme, hello, thanks, pay }]`.
`BARKS = { tartufo: [{ when, t }], constable: [...], diaryFor: {...} }` short lines.

## World

Tile maps written by hand in `src/data/world/` (your format), 16px tiles, integer zoom, camera follows.
Maps and the anchors the story uses (all must exist; add more freely):

- `village` (winter, night): `village.arrival`, `village.square`, `village.malva_door`, `village.cottage_door`,
  `village.stall`, `village.curtain`, `village.garden`, `village.venusglass`, `village.cart`,
  `village.court_door`, `village.meeting_door`, `village.shop_door`, `village.forest_gate`, `village.trapdoor`
- `malva` (interior): `malva.hearth`, `malva.table`
- `cottage` (interior, the hub): `cottage.table` (readings), `cottage.bed` (card of the day), `cottage.door`
- `court` (interior): `court.chair`, `court.dock`, `court.deposit`, `court.stairs`
- `meeting` (interior): `meeting.bible` · `shop` (interior): `shop.counter`
- `forest` (spring): `forest.entry`, `forest.ortica_hut`, `forest.campfire`, `forest.den`, `forest.lantern`,
  `forest.mill`, `forest.boundary`, `forest.pond`, `forest.graveyard`, `forest.spring`
- `depths` (autumn, dark): `depths.entry`, `depths.edera_nook`, `depths.coven`, `depths.chains`, `depths.tower`,
  `depths.well`, `depths.swamp`, `depths.jail`

World objects: hidden card spots (from `cards.base.js` `spot`; a glint when near, stronger with the cat;
interact -> `card.found`), locks (`lock.ask`), doors between maps (with `when`), tall grass and dark
areas (short sight), patrols (constables with a sight cone -> `exam.start`; `state.tools.bottle` and the
stun power avoid them), the CAST entries (npc talk -> `story.run`). Movement: arrows/WASD, tap to walk,
an action button on phones. `core/dom.js` `blocked()` true -> the world ignores input.

## Portrait and visits (added after the first playtest)

State: `state.traits = { esplora, parola, tono, rischio, guida }`, integers -6..6. Positive pole first:
esplora + curiosa / - dritta; parola + schietta / - accorta; tono + gentile / - pungente; rischio + audace /
- prudente; guida + cuore / - testa. `state.told = { [cardId]: true }` once the Reader has told a card.
`state.visits = n`.

`core/progress.js`: `addTrait({ parola: 1, tono: -1 })` (clamped, emits `trait`), `traitWord(axis)` (the
Italian adjective when |value| >= 3, else null), `traitWords()` (up to three, strongest first),
`yourCard()` now = nearest card signature to the trait vector (signatures in `data/portrait.js`), plus the
old points and a head start for the birth card. `core/cond.js`: `{ trait: ['tono', '<=', -3] }`,
fill `{traits}` (e.g. "curiosa, schietta e gentile").

Story nodes: a choice option may carry `trait: { axis: +-1 }` next to (or instead of) `tag`. New nodes:
`{ do: 'trait', ... }`, `{ do: 'visit' }` (plays a visit composed from the untold found cards; no-op when
fewer than two are untold unless `force`), and in sessions `{ portrait: true }` (says the final portrait).

`src/data/portrait.js` (story text area): `SIGNATURES = { m07: { rischio: 2, esplora: -2 }, ... }` for the 22
Majors; `PORTRAIT = { esplora: { plus: '...', mid: '...', minus: '...' }, ... }` one sentence each for the
finale; `ADJ = { esplora: ['curiosa', 'dritta al punto'], ... }`.

`src/data/story/visits.js`: `TALK = { m02: { tell: 'two or three sentences in the Reader\'s voice: from the
picture to what the card says', details: { veil: 'one sentence: what that hook suggests', ... }, words:
'one sentence that picks up her own three words: use {words:m02}', ask: { q: '...', a: [{ t, trait, re }, { t,
trait, re }] } } }` for the 22 Majors; `OPENERS = [{ when: <cond>, t }]` (the opening observation, most
specific first, last one always true); `CLOSERS = [{ when, t }]`.

Behaviour feeds traits in `src/glue/` (never in the world): seeing a new place off the main path, an
optional chat -> esplora +1; reaching a step quickly without detours -> esplora -1; being seen by a patrol
while it could be avoided, using stun, choosing the bold side of a fork -> rischio +1; using the bottle,
hiding -> rischio -1. Each feed at most once per few minutes.

Guidance (interface, not fiction): bus `hint { id }` -> a plain interface line near the bottom, once each
(`move`, `action`, `grimoire`, `exam`, `reading`); texts in `src/data/story/hints.js`. `world.guide(anchor)`
is on for the whole of chapter 0-1 towards the current step's `at`; from chapter 2 only for a few seconds
after the player taps the next-step line in the HUD.

Pacing: in sessions, visits and cinema a line stays until tapped, a tap is accepted only after the text is
fully shown plus a short pause, and one tap never advances two lines.

Portrait over time (added). State: `state.hits = { axis: { plus, minus } }` counts every contribution;
`state.traitLog = [{ at, traits, card }]` a snapshot at the end of every encounter with the Reader;
`state.verdicts = [cardId]`. Node `{ do: 'verdict' }` records `yourCard()` after she states it.
Conditions: `{ trend: [axis, op, n] }` (change since the previous snapshot), `{ steady: axis }` (|value| >= 3
with the same sign in the last two snapshots), `{ turned: axis }` (sign flipped since the previous snapshot,
|change| >= 4), `{ torn: axis }` (plus >= 3 and minus >= 3 and |value| <= 1), `{ verdict: 'first' | 'same' |
'changed' }`, `{ yourCardIsBirth: true }`, `{ hasBirth: true }`, `{ hasYear: true }`, `{ element: 'Fuoco' }`,
`{ modality: 'cardinale' | 'fisso' | 'mobile' }`, `{ moon: 'nuova' | 'crescente' | 'piena' | 'calante' }`,
`{ bornOn: 'giovedì' }`. Fill tokens: `{lastVerdict}`, `{element}`, `{modality}`, `{ruler}` (traditional
ruler of the sign), `{rulerCard}`, `{birthDay}` (weekday), `{dayPlanet}`, `{dayPlanetCard}`, `{moon}`
("luna crescente"). Signs: Ariete cardinale Marte, Toro fisso Venere, Gemelli mobile Mercurio, Cancro
cardinale Luna, Leone fisso Sole, Vergine mobile Mercurio, Bilancia cardinale Venere, Scorpione fisso Marte,
Sagittario mobile Giove, Capricorno cardinale Saturno, Acquario fisso Saturno, Pesci mobile Giove. Weekdays:
lunedì Luna, martedì Marte, mercoledì Mercurio, giovedì Giove, venerdì Venere, sabato Saturno, domenica Sole.
Planet cards: Luna m02, Marte m16, Mercurio m01, Giove m10, Venere m03, Saturno m21, Sole m19.

## After the consolidation of DESIGN.md (15 Nov)

DESIGN.md was rewritten as one document; where this file and DESIGN.md disagree, DESIGN.md wins. Deltas:
power ids are `cat`, `fire`, `sense`, `move`, `stun`, `broom` (no `seals`, `sense2`, `light2`; no flag
`sight.far`); levels 2 cat, 3 shop, 4 fire, 5 sense, 6 broom, 7 stun (also parts the thick fog), 8 move; the broom
is a teleport from the grimoire map to any seen outdoor anchor, refused indoors, underground, in thick
fog, from the cell, during a script, or while a patrol has seen her;
levels continue to 12 after the ending (Gran Maestra), each only widening the sixth sense
(`senseRadius(level)`); tools are `bottle`, `incense`, `pendulum` (the sieve is gone); `yourSuit()` is
derived from the traits; chapter gates need `{ level: 4 }` and `{ level: 7 }`; the story index may export
`SIDE` (side missions shown as pencil notes on the grimoire map); Minor Arcana are found in tall grass by
zone from chapter 1; `review.open` is a short mixed quiz. World obstacles: brambles (fire), roots and warded
stones (move), thick fog where one loses the way (stun/air), dark (fire).

## Working rules

- No git commands. No edits outside your folders (plus `harness/<area>.*`, `tests/<area>.*.test.mjs`, `notes/<area>.md`).
- Check your work: `npm test` for logic; for screens, a harness page `harness/<area>.html` that imports
  `core/fonts.js`, prepares a state with `setState`, and mounts your module; run `npx vite --port <yours> --strictPort`
  in the background and shoot with `node scripts/shot.mjs http://127.0.0.1:<port>/harness/<area>.html /tmp/<area>-1.png --phone`
  (and without `--phone`). Look at your screenshots (Read the PNG). Build with `OUT=/tmp/<area>-dist npx vite build` only.
- Files under about 400 lines; one job per file; a header comment that says what the file is for.
- End with a report under 200 words: what exists, what you checked and how, what you did not check, what you need from others.
