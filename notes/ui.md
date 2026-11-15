# Grimoire area (src/ui): notes for the lead and the other areas

Services in `src/ui/index.js`: title.open, hud.mount, hud.toast, grimoire.open, card.found, card.show, shop.open.

## Layers (z-index inside #ui)
HUD 20, toasts 25, title 50, grimoire and shop 60, sheets (card page, lessons, Minors) 70, found ceremony 80,
level-up moment 85, image zoom 90. When the grimoire calls `review.open` or `reading.free` it hides itself
(visibility) until their promise resolves, then redraws: those overlays only need z-index above 20.
The shop hides itself the same way while `card.found` runs.

## Behaviour other areas rely on
- `card.found(id)` calls `findCard`, `setDetail`, `setWords` at the END of the ceremony (so the +20 xp and a
  possible level-up appear after it). The HUD also holds level-up moments while a ceremony is open.
- The shop writes `state.tools[id] += 1` (no progress.js mutator exists for tools) and spends with `addCoins(-n)`.
  Prices are mine (`src/ui/logic.js` TOOLS, CARD_PRICE by row 30/45/60): tune freely. Using up tools is play's job.
- Settings toggle `state.settings.music` / `.sfx` (saveNow); the sound module should read them.
  "Ricomincia da capo" calls `reset()` then `location.reload()`.
- The map reads `state.stats.seen[anchor]` (world must set it when the player first sees/enters a place;
  interior anchors like `malva.hearth` count for their door) and `world.where().near`.
  The sketch has its own hand layout of the contract's anchors (`src/ui/sketch.js` REGIONS); an anchor the
  world adds later will not show on the map unless added there. "Vola qui" calls `world.travel(<door anchor>)`.
- Tapping the HUD slip opens the grimoire on the map; the book button opens it on "Io".
- In study mode ("Sfoglia il grimorio") the map is read only and Io hides "Adesso" when there is no save.

## Wishes
- Lessons: the harness shows each page's `spread` drawn from SPREADS; a page with `cards` shows thumbnails.
- The celtic cross diagram uses SPREADS x/y as given; positions 1 and 2 share a spot (2 drawn across).
