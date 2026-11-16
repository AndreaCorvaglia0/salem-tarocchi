# Clients 2 (16 Nov): generated clients, the ones sent away, readings in the street

## What exists

- `src/data/reading/people.js` (Italian material): 47 first names (24 f, 23 m), 36 trades/ties with f/m forms,
  a look and tiers; family / village / beloved / spouse pools; `QUANDO` by tier; `TEMPLATES` = 5 per pair for
  all 30 pairs (150; every pair at every tier), each `{ t, s (situation), q, di, x?, ties?, notTies? }`;
  `GREET` and `THANKS` 6 per tier; `MUTTERS` (Tartufo, 3 per tier, gender neutral); `REFUSALS` 14 (3 wrong
  door, 3 curses, 2 death, 2 illness, 2 lottery, 1 "is she a witch", 1 love potion; 10 can be turned into a
  `fare` reading); `STREET` lines; `QUEUE` (second visitor).
- `src/reading/clients.js` (pure): `makePerson`, `makeClient({ tier, rng, avoid, person })`, `streetClient`,
  `streetAsk`, `makeRefusal`; grammar helpers `join` (di + il -> del ...), `toYou` (mia -> tua for ref),
  `render` (slots `{x}`, `{di:x}`..., `{o}` client ending, pronouns). Client shape = story clients' plus
  `gen, tier, first, gender, tie, keys`. avoid = keys `n:` `q:` `t:` `r:`; names, questions and refusals do
  not repeat within the recent list, ties only when nothing else is left.
- `src/glue/clients.rules.js` (added, `nextClient` untouched): `tierFor` (pop level + rank, 25% one tier
  lower), `pickVisitor` (refuse 1/4, 1/6, 0.12 by tier; back 0.2), `spreadFor` (tier 0 single, tier 1 up to
  ppf, tier 2 the chapter's), `canQueue` (pop >= 2), `pushRecent`, `rememberRead`, `readEntry`, `STORY_PEOPLE`,
  `streetDue`, `STREET_GAP` (6, 5, 4, 3, 2.5 min by pop), `streetChance`, `streetPerson`.
- `src/glue/clients.js`: story clients of the chapter first (unchanged path); when none is left: back /
  refusal / generated. Refusals and the queue choice play through `story.run` with inline nodes (the question
  stays above the answers; traits `tono` +1 kind / -1 curt / +1 turn; turn -> `{ do: 'reading' }` with an
  object client). Opts for debug: `{ force: 'gen'|'refuse'|'back', tier }`.
- `src/glue/street.js`: remembers people read for (`state.world.gen.read`, wraps `reading.open`); every 20 s
  of play (after the first 90 s) checks `streetDue` + chance; `world.stranger` puts the person on a road
  tile 2-5 steps away; they leave after 60 s, after the exchange, or when a patrol comes within 6 tiles.
  Exchange via `story.run`: line, yes/no, one-card `reading.open` (pay 1/2/4). Service `street.now()`.
- World: `scene/stranger.js` (new), `Things.extra` (people outside CAST, merged in `castHere`), npc `e.run`
  instead of a script, `World.stranger` + update hook, service `world.stranger(spec | null | undefined)`.
- State: only `state.world.gen = { recent, read }`, created lazily (old saves fine).

## Verified

`npm test` 318 green; `tests/clients.test.mjs`: 2000 clients (no unfilled slot, no double space, no
"di il"-style errors, question ends with "?", valid `makeQuestion`, ref.di starts with di/del..., no
first person in ref.di, no repeat of name/question within 12), a brute force of every template x every
filler x both genders, 3000 refusals, the rules. Build OK. Screens (390x844, built app, `?debug&skip=c2`) in
`/home/claude/shots-clients/`: 01-03 tier 0 client (knock, Tartufo, hello), 04 tier 2, 05/07 refusal with three
answers (the question under them), 08 street person on the map, 09 her two answers, 11 the one-card reading.

## Not verified

The rest of a generated reading on screen (shuffle onwards: it is the existing reading screen), the queue
choice on screen, the timed street spawn in real play (only `street.now`), a finger tap on the stranger, sound.

## Decisions not in the brief

- Tier 2 people only through popularity + rank; a quarter of visitors come from the tier below.
- Templates naming a trade (`ties`) pick a person of that trade, whatever the tier (a poor fornaio).
- Street people: only village and forest, not in fog; the story's twins and the woman without a shadow never.
- The refusal "ask" line may end with a full stop (two of them are requests, not questions).
- The street toast "Una persona ti fa cenno dal bordo della strada." is an interface line.
- Generated readings give +3 xp (story clients +5).

## For the lead

- One-line hook added in `src/glue/index.js`: `import './street.js'`.
- `src/world/scene/things.js` got two small edits (extra map, `e.run`); `World.js` two lines; `world/index.js` the service.
- `docs/CONTRACT.md`: service `world.stranger`, `street.now`, `clients.next(opts)`, `state.world.gen`.
