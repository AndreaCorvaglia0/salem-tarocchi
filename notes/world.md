# World: notes for the others

## What the world reads and writes
- Writes `state.pos` on every step (save is debounced), `stat('steps')`, `stat('fires')` (entering a
  dark area with the fire power), `stat('stuns')`, `state.world.opened[id]` (chests, sealed doors),
  `state.world.talked[id]` (count), `state.world.once[id]` (CAST entries with `once`), and
  `state.tools[tool]` when a chest gives a tool (progress.js has no helper for tools).
- Reads `state.world.bottleUntil` (a `Date.now()` timestamp): while it is in the future, nobody
  stops you. **Whoever uses the witch bottle should set it** (e.g. `Date.now() + 90000`).
- Reads `state.powers` (cat, fire, stun, seals), flag `sight.far`, `state.chapter`, `state.player.birthCard`.

## Services added
- `world.refresh()` re-reads CAST and state (the world also refreshes on bus `step`, `flag`, `chapter`,
  `card:found`, `level:up`, `card:recovered`).

## Conventions the story can use
- CAST `label` is shown above the person or prop; the action button says "Parla" (npc) or
  `verb` (prop, default "Usa"). Zones accept `r` (radius in tiles, default 0).
- CAST `npc` may set `face: 'left'|'right'|'up'|'down'`.
- BARKS: `tartufo: [{ on: 'card' | 'patrol', when?, t }]`; `constable` / `afflicted`: `[{ on?: 'seen', when?, t }]`.
  Built-in fallbacks exist (scene/barks.js).
- Extra anchors: `village.market`, `village.well`, `village.lane`, `village.reeds`, `shop.keeper`
  (behind the counter), `depths.cells` (stairs to the court), every room has `<room>.door`.
- Gates: the forest gate opens at chapter 2, the trapdoor at chapter 3, the cells-to-caves grate at
  chapter 3; the black shop door needs flag `shop.open` (level 3 gift). Change `when` in the map files.
- Exam `place` is the nearest anchor within 8 tiles, else the map id.

## Asks
- core/scripts: `scripts/shot.mjs` waits for `networkidle0`; a running Phaser game at 60 fps in
  headless Chrome never reaches it, so the world caps itself at 30 fps only when `navigator.webdriver`
  is true. If other areas mount the world in their harness, the same applies.
