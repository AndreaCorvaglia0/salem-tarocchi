# Altrove: the small worlds outside Salem (16 Nov)

DESIGN.md "Altrove". Two worlds, playable, all lines are placeholders (TODO-writer).

## What exists
- `elsewhere.go(id)` (glue/elsewhere.js): a passage (potion: green swirl; pages: three pages turning; `nightmare`:
  dark tilt, ready, unused), then she is in the other map. HUD = one line «Altrove · <name>» (+ three dots for falls
  on the clouds). No patrols or Minors (the maps have none), no broom (`world.canFly` says `inside`), no grimoire (the
  HUD is hidden), no strangers, no guide trail, no "seen" places, no Tartufo treats. Tartufo: map `cat` (clouds no,
  book yes). Music: the map's `mood` (clouds `title`, book `reading`).
  Returns at once (the visit runs detached: a prop script that awaited it would leave the world busy).
- The visit is a trial on `runTrial` (src/trials/run.js) with its own io: forks ask the cards (`askScreen`), then change
  the world; rooms with `at` wait until she walks there (r 1). Outcome by the engine (0/1-2/3+ wrong forks), and on the
  clouds 3 falls end the visit as a fail. Gains/losses applied like glue/trials.js. Then the passage back to the exact
  `{ map, x, y }` she left (world.travel now takes a place object), and the end screen.
- `elsewhere.leave(result)`: ends a running visit early ('fail' records a fail, nothing: no record).
- State `state.world.elsewhere = { in, from, results: { id: { result, errors, falls, day, at } } }` (made on first use).
  Reload mid-visit: at glue import `restore()` puts `state.pos` back to `from`; `world.start` also never starts inside an
  Altrove map. Nothing is recorded, she can go again. Fail: retry another day (as side trials). Flags:
  `elsewhere.<id>.<outcome>`, `elsewhere.<id>.done` (pass/perfect), `item.<id>` for the perfect prize.
- Registry: `elsewhere.book` (after `library.first`), `elsewhere.clouds` (after `elsewhere.book`), kind `trial`,
  when `{ any: [{ chapterMin: 2 }, { flag: 'lesson.fly' }] }` + the chain as flags. Triggers: CAST props with a
  placeholder script ending in `{ do: 'elsewhere', id }`: an open book on the library table (`library.book`), a green
  bottle on the cottage shelf (`cottage.shelf`), each drawn in the world while its prop is there.

## The rules (src/world/elsewhere.rules.js, pure; tests/elsewhere.test.mjs)
- Clouds: bridges are digits in the map (fork = (d-1)/3, option = (d-1)%3), closed (faint) until she asks; the chosen
  one opens, the others melt. Wrong: ~30% of its tiles thin (scattered, each kept only if a solid way remains).
  Thin = cloud partly erased + a faint additive shimmer. Stepping on one: fall animation, hole, back to the last landing
  tile. After the first fall the shimmer shows more and tapped walks keep off thin cloud (step-by-step walking does not).
  'u' tiles are always thin (three, off the straight way).
- Page: she stands only on written lines. At a fork the word goes into the blank (two tiles right of the fork's anchor)
  and a line is routed (Dijkstra, prefers straight/horizontal strokes, never beside a door or into another blank) to the
  next fork's sentence / the page corner / the capital, or into the blot; after a blot room the line goes on from there.
  The page corner is a real door book1 -> book2 with a page sweep.

## Engine changes (src/world, my area)
maps.js `def.tiles` (own legend), `elsewhere`; tiles.js kinds skydoor ladder teatable glyph capital blot; art/elsewhere.js
(all art), art/blocks.js; scene/elsewhere.js (rules in the scene, beacon, trinkets); World.js hooks (rule.canStand /
arrived / update / beforeTravel, `away` skips), build.js (look painters), night.js (`def.sky`), cat.js (`def.cat`),
input.js (rule.avoid), index.js (`world.elsewhere(cmd, arg)`, travel to a place, canFly, stranger, startPoint).

## Hooks outside my files (one line each)
- src/glue/index.js: `import './elsewhere.js';`
- src/story/runner.js ACTIONS: `elsewhere: (n) => call('elsewhere.go', n.id)`

## TODO-writer ids
clouds: title note trigger(2 lines) intro at1 fork1 (+options) wrong1 at2 fork2 (+options) wrong2 at3 fork3 (+rule,
options) wrong3 end perfect pass fail item. book: title note trigger(2) intro at1 sentence1 fork1.options blot1 at2
sentence2 fork2.options blot2 at3 sentence3 fork3 (+rule, options) blot3 end perfect pass fail item.
Keep each option's tags/sign (they decide which is right); a sentence keeps its ___ at the end.

## Debug
`window.__salem.call('elsewhere.go','clouds' | 'book')` (with ?debug the done/wait status is ignored).
Screens: /home/claude/shots-elsewhere/. Drivers: /home/claude/elsewhere-scripts/drive.mjs, salem.mjs.
