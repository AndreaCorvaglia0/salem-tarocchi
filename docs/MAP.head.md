# Map

Where things are and how they reach each other. Read this before `DESIGN.md` when you only need to find
your way. The hand-written part is `docs/MAP.head.md`; the tables are written by `node scripts/map.mjs`
by the lead before each commit (a test fails when a service is called but never provided).

## How the parts talk

- **By name, not by import.** An area never imports another area. It offers `provide('x.y', fn)` and others
  `call('x.y')` (`src/core/services.js`). Glue changes a service with `wrap('x.y', (prev, ...a) => …)`.
  So to find who uses something, search the NAME (or read the table below), not the imports.
- **Events.** `emit('name', data)` / `on('name', fn)` from `src/core/bus.js`.
- **Anyone may import** `src/core/*` and `src/data/*`.

## Where a thing goes

| You are adding | Put it in | Then |
|---|---|---|
| Words the player reads (scenes, people, cards, herbs, daily) | `src/data/…` | a data test in `tests/` (limits, ids that exist) |
| A rule (when, how much, who) | `src/glue/<name>.rules.js`, pure, no DOM | `tests/<name>.test.mjs` |
| The wiring of that rule | `src/glue/<name>.js` | one import line in `src/glue/index.js` |
| A screen | `src/ui/<name>.js`, built with `h()`/`css()` and `ui/paper.js` | a service so others can open it |
| Something in the pixel world | `src/world/scene/<name>.js`, art in `src/world/art/` | spots in `src/data/world/` |
| A side story, a person, a world | `docs/KIT.md` (the recipe; trials: `docs/TRIALS.md`) | `npm test`, `node scripts/lore.mjs check` |
| A new key in the save | default in `fresh()` of `src/core/state.js` | old saves must load: test it |

## Three rules that are easy to break

1. **She is already playing.** Whatever you add must depend on what she HAS (a flag, a card, a person met),
   never on the current step. Optional pieces are entries in `src/core/extras.js` (`after`, `key`).
2. **Taps.** New buttons ignore taps for 650 ms (`core/dom.js`); scripted tests set `window.__salemNoGuard = true`.
3. **The title is a place** (`ui/title.js`, `glue/threshold.js`): the moon, the card of the day, the garden
   live outside the story and keep working after a reset.

## Looking at it

`npm test` · `npm run build && npx vite preview` · `/?debug&skip=c2` (or `c3`) · `window.__salem` ·
`node scripts/shot.mjs <url> <out.png> --phone --until domcontentloaded --steps <file.mjs>` (details, selectors and the `?debug&skip=` points: `docs/TOOLS.md`, "Looking at it") · publish: `sh scripts/deploy.sh` (lead only).
