# Herbs in the world

The 21 plants of the herbarium grow in the village and the forest. She notices them: on or beside one,
the action button says «Guarda» over «Una pianta» (or the plant's name once she has looked at it), and
using it calls `herb.look(id)` (src/glue/herbs.js, the lead's).

## Files

- `src/world/art/herbs.js`: one sprite per plant, drawn in code from its plate (public/herbs/<id>.webp).
  16 px wide, 12-28 px tall, base on the last row, a soft dark rim (not a hard INK outline: thin stems
  would turn into black bars). Each texture `herb-<id>` is a 2-frame sheet: still / top leaning 1 px.
  `herbArt(id)` gives the bare canvas (contact sheets).
- `src/data/world/herbs.js`: `HERB_SPOTS` (54 spots: village 31, forest 23).
- `src/world/scene/herbs.js`: class `Herbs` (like `Minors`): draws the map's plants, `usableAt`, `near`,
  `use`, `update` (sway + glimmer). `HERBS_OFF` = steps where plants are drawn but not usable
  (`p.session`, `p.road`, `c1.malva`). Also not usable when the service `herb.look` is missing.
- `tests/world.herbs.test.mjs`.

## Hooks in existing files

- `scene/World.js`: import `Herbs`; `this.herbs = new Herbs(this, map)` after Minors; `this.herbs.update(time)`
  after `this.minors.update(time)`.
- `scene/things.js`: `usableAt` appends the herb entry last (before the door), so a tap on a plant walks
  there and looks; `current()` skips herbs on her tile and in front of her and asks `scene.herbs.near(p)`
  only after everything else (a person, a card, a prop beside her always win); `use()` routes `type: 'herb'`.

## Placement

- Village: Malva's front and garden bed (salvia, menta, timo, alloro, calendula, camomilla, melissa,
  lavanda and rosmarino across the lane), the arrival road (camomilla, achillea: drawn in the prologue,
  usable later), the cottage (rosmarino, timo, alloro), the fenced beds of the upper village (lavanda,
  salvia), by the forest gate (artemisia, assenzio), the lower houses (melissa, valeriana, verbena,
  achillea, calendula), round the shop (rosmarino, ruta, ortica, calendula), the lane (ruta); behind the
  court in the dark yard: belladonna, giusquiamo, stramonio.
- Forest: Ortica's hut and herb patch (ortica, valeriana, menta, melissa, camomilla, artemisia), the
  path to the den (achillea, verbena, camomilla), the pond (menta, valeriana), the crossing and the
  spring (ortica, verbena), campfire and boundary stone (assenzio, achillea, artemisia); the graveyard
  behind the brambles: cicuta, aconito, belladonna, giusquiamo, stramonio; the den (cicuta), the forest
  edge (aconito).
- Rules (tested): open ground or herb bed only (no path, cobbles, door, tall grass, fog), not an anchor,
  chest, gate, obstacle, door or patrol round, a walkable neighbour, one plant per tile, poisonous at
  most 2 spots. Avoid also tiles beside a door anchor (a CAST person steps aside onto them).

## Glimmer

Unseen plants within 7 tiles: once every ~5 s a single pale 1 px mote rises 7 px from the top of the
plant and fades, plus a barely visible pale-green halo (ADD, alpha ≤ 0.14). Distinct from the card's
golden star, the Minors' turning glint and the guide's dots. Nothing once seen, nothing while not usable.

## Not done / open

- Plants are the same in every season (green in the winter village). A winter look (dry, a snow cap)
  would be a small addition in art/herbs.js keyed by `scene.season`.
- `state.herbs` default and the extras registration are the lead's (core/state.js already has `herbs: {}`).
