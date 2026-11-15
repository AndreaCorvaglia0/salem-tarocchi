# World maps

One file per map, `export default { ... }`, listed in `index.js`. The engine (`src/world/`) reads
them with `src/world/maps.js`; `npm test` (tests/world.maps.test.mjs) checks every map.

```js
export default {
  id: 'village',            // also the prefix of its anchors: 'village.square'
  name: 'Il villaggio',     // shown when you arrive
  season: 'winter',         // 'winter' | 'spring' | 'autumn': the same art re-tints
  inside: false,            // true for rooms: dimmer night, walls, no weather
  dark: [[3, 33, 7, 6]],    // rects [x, y, w, h] of short sight; or `true` for the whole map
  ground: '_',              // optional: what is painted under blocks (default: the ground around them)
  wall: 'wood',             // optional for rooms: 'wood' | 'stone' | 'cave' (default from the map)
  start: 'arrival',         // anchor used when nothing else says where to stand
  rows: [ '....', ... ],    // the tiles, one string per row, all the same length
  key: { M: { kind: 'house', roof: 'plum' } },   // what each uppercase letter is
  anchors: { square: [18, 22, 'La piazza'] },    // named tiles: [x, y, label]
  doors: [{ at: 'malva_door', to: 'malva.door', when, refuse, look, seal }],
  gates: [{ at: [15, 27], when, refuse }],       // tiles shut until `when` holds
  chests: [{ id, at: [x, y] | 'anchor', ask: { kind, cardId, label }, give: { coins, xp, tool, n }, seal }],
  patrols: [{ id, kind: 'constable' | 'afflicted', route: [[x, y], ...], pause, speed, face, look, when }],
  under: true,              // underground (the depths): no sky, the broom does not fly here
  obstacles: [{ kind, need, at: [x, y] | 'anchor' | on: chestId }],  // see "Obstacles"
  fog: [{ id: 'deepfog', area: [x, y, w, h] }],                       // thick fog zones
  suits: [{ suit: 'p' | 's' | 'w' | 'c', area: [x, y, w, h] }],       // tall grass with Minor Arcana
};
```

## Tiles (one character, 16 px)

| ch | what | walk |
|---|---|---|
| `.` | ground: snow, grass or leaf litter by season | yes |
| `,` | tall grass (short sight; constables see you only up close) | yes |
| `=` | path | yes |
| `#` | cobbles | yes |
| `_` | wooden floor | yes |
| `:` | flagstones | yes |
| `;` | rug | yes |
| `h` | herb bed | yes |
| `+` | a door: stepping on it travels (needs an entry in `doors`, or sits inside a building) | yes |
| `~` | water (ice in winter) | no |
| `w` | wall: the top row of a room is a dark cap, a wall with floor below shows its face | no |
| ` ` | nothing (outside a room) | no |
| `t` `p` `y` | tree (bare in winter, blossoming in spring, red in autumn), pine, dead tree | no |
| `b` `r` | bush, rock | no |
| `f` | fence (joins its neighbours; a `+` in a fence line is a gate) | no |
| `s` | low stone wall | no |
| `g` | grave | no |
| `i` | iron bars | no |
| `x` | invisible obstacle | no |

## Blocks (uppercase letters)

Each connected group of the same letter is one block; its bounding box is its footprint and is
solid (except `+` inside it, the building's door). Declare the letter in `key` with a `kind`:

- buildings: `house` (`roof`: plum slate moss brown red; `lit: [1, 0]` windows lit in turn; `door`:
  column of a painted door that does not open; `curtain`: column of the curtained window; `sill`:
  column of the window with a glass on the sill; `chimney: true`; `sign: 'herb'`), `cottage`,
  `meeting`, `court`, `shop`, `hut`, `mill`
- outside: `stall` (`awning`: violet ochre red cream; `goods`: 'odd' | 'apples'), `cart`, `well`
  (`old: true`), `lamp`, `barrel`, `crate`, `bench`, `woodpile`, `pillory`, `board`, `hay`, `snowman`,
  `trough`, `campfire`, `lantern`, `stump`, `log`, `spring`, `cross` (boundary stone), `torch`,
  `chains`, `pillar`, `ruin`, `bones`, `mushrooms`, `candles`, `cauldron`
- rooms: `hearth` (`small`), `table` (`cloth`, `cards: true`), `chair` (`high`), `bed` (`quilt`;
  2x1 or 1x2), `shelf` (`jars`), `counter`, `lectern`, `pews`, `dais`, `dock`, `cabinet`, `window`
  (`tall`; put it in the wall's face row), `stairs`, `candle`, `herbsHang`, `chest`, `plant`

Lamps, fires, candles, torches and hearths light the night by themselves.

## Anchors, doors, cards

- An anchor must be a walkable tile: it is where the player stands (in front of a door, beside a
  thing). The story's CAST and the cards' `spot` (`data/cards.base.js`) point at anchors.
- A door is found from its anchor: the `+` tile next to it. `to` is an anchor on any map. `when` is a
  condition (`core/cond.js`); if it fails, `refuse` is said. `seal: true` needs the seals power and a
  question. `look`: 'gate' | 'trapdoor' | 'stairs' | 'mat' (a building's own door needs none).
- A person (CAST `npc`) standing on a door's anchor steps one tile aside, so the door stays usable.
- Hidden cards appear by themselves at their `spot` anchors (`MAJORS[].spot`).

## Obstacles, thick fog, Minors in the grass

- `obstacles`: each is solid until opened with its magic, then gone for good (`state.world.opened[id]`).
  `kind` and `need` go together: `brambles` / `fire` (Fuoco burns them), `roots` / `move` and `stone` /
  `move` (Terra draws them aside; the stone carries a faintly glowing carved mark). `at` is a walkable
  tile; `on: 'forest.chest.grove'` puts it over a chest instead (the chest opens once it is gone).
  Roots and stones only ever guard optional things (shortcuts, chests): the tests check that Earth
  gates no Major spot.
- `fog`: thick fog. Without the Air (`stun`) she can walk in, sight closes in, her steps wander, and
  after a few steps (`FOG.lost` in src/world/reach.js) she is back at the edge. With the Air she walks
  through. Nothing in it can be seen or used without the Air. A spot that must need the Air should lie
  more than `FOG.lost` fog steps from every edge (tested for the Hermit's lantern).
- `suits`: tall grass `,` inside an area holds Minor Arcana of that suit (Denari `p` round the market,
  Spade `s` in the upper village, Bastoni `w` in the woods, Coppe `c` by the water). Nothing on the
  arrival road. Odds and cooldown: src/world/minors.js; numbers: `node --test tests/world.minors.test.mjs`.
- Block `signpost`: `{ kind: 'signpost', arrows: [['left', 'bottle'], ['up', 'bell']] }`, one small board
  per arrow (`left` `right` `up` `down`), symbols `bottle` (shop) `bell` (meetinghouse) `house` (cottage)
  `scales` (court) `coin` (market) `hut` `drop` (water) `wheel` (mill) `tree` `fire`.

To check a map: `npm test`, then `harness/world.html?at=<map>.<anchor>` (see harness/world.js).
