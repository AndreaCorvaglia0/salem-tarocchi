# Stage: the shadow theatre (src/story/stage/)

Still tableaux of paper-cut silhouettes over a warm lantern light. Only the flame, the fire, snow,
dust, smoke and the slow camera drift move; figures never move. Real cards are DOM images with a CSS flip.

## Files

| File | Job |
|---|---|
| `index.js` | `createStage(container, { session, found?, tableau? })`, `playTableau(name, lines)` |
| `tableaux.js` | the named tableaux (pure data), `sceneFor(node)` |
| `painter.js` | paints one tableau: field, three cached sheets, fx, vignette |
| `silhouettes.js`, `shapes.js` | figures (pure path data): heads in profile, hair, hats, bodies |
| `scenery.js` | procedural paper: trees, skyline, ground, crowd, arches, mill, tower, table, house front, bench, vines, clouds |
| `light.js`, `flame.js`, `smoke.js`, `symbols.js` | light and paper, candle and fire, smoke wisps and smoke symbols |
| `cards.js` | the real cards: lay, show, turn, row, celtic, highlight, shuffle (no hands) |
| `cameos.js` | `cameo(who, size)`: profile cameo portraits for the dialogue box |
| `draw.js`, `kit.js` | canvas helpers; pure helpers (`toPath`, `taper`, `validPath`) |

Tableaux: `reader`, `cards`, `arrival`, `door`, `square`, `campfire`, `arrest`, `cellar`, `coven`,
`trial`, `dawn`, `last`, plus `tower` (the prison tower, for c3.jail). Symbols: moon, star, eye, key,
wheel, tower, sun, cup, sword, wand, coin.

## Swap instructions (lead)

### session.js (2 lines, plus 2 optional nodes)

```js
// was: import { createScene } from './scene.js';
import { createStage } from './stage/index.js';
// was: const scene = createScene(stage, { level, found: foundIds() });
const scene = createStage(stage, { session: level, found: foundIds() });
// optional, in ext(), next to node.shuffle:
if (node.symbol) { dropCap(); await scene.symbol(node.symbol); return true; }   // { symbol: 'moon' }
if (node.tableau) { dropCap(); await scene.tableau(node.tableau); return true; } // { tableau: 'last' }
```

`harness/stage.session.js` is a snapshot of session.js with exactly these changes (marked `SWAP`):
the `?view=session` demo runs on it.

Same methods as scene.js: `layCard(id)`, `clearCards()`, `shuffle()`, `wait(ms)`, `speak()`,
`setLevel(n)`, `setFound(ids)`, `cards` (ids), `dispose()`. New: `tableau(name, { via: 'ink'|'fade'|'cut' })`,
`symbol(name)`, `candle(level)`, `table` (`show`, `turn`, `row(ids)`, `celtic(ids)`, `highlight(i)`), `destroy()`.

Behaviour differences:
- `layCard`: the card rises face down out of the dark and turns by itself (about 2.2 s; old: about 2.5 s
  with a hand). At most three in a row, the oldest fades upward (as before).
- `shuffle`: a fan of card backs opens and closes twice while the smoke draws a star (about 4.5 s). No hands.
- The candle shortens by `session` 0..4 (`CANDLE_LEVEL` in painter.js). `speak()` leans the flame.
- Found cards hang as small dim thumbnails on threads at the top (were pinned to a wall).
- Reduced motion: no drift, no flicker, still flame and snow, symbols fade in place, plain dissolves.

### cinema (story/index.js)

The runner already passes the node as the second argument of `ui.cinema(lines, node)`. In `story/index.js`:

```js
import { cinema as barsCinema } from './cinema.js';
import { playTableau } from './stage/index.js';
import { sceneFor } from './stage/tableaux.js';
const cinema = (lines, node = {}) => { const s = sceneFor(node); return s ? playTableau(s, lines) : barsCinema(lines); };
```

`sceneFor(node)` takes `node.scene` if it names a tableau, else guesses from `node.pan`. When every
cinema node has a scene, `cinema.js` (black bars) can go. `playTableau` emits `cinema` true/false and
has "salta" and a soft dark band under the text, like the old one.

Proposed node: `{ do: 'cinema', scene: 'arrest', lines: [...] }` (in `h.js`: `cinema(lines, pan, scene)`).
Check that `tests/story.data.test.mjs` accepts the `scene` key.

### Suggested scene for each cinema node in src/data/story/scripts/

| Script | `pan` now | Scene | Note |
|---|---|---|---|
| p.road | village.arrival | `arrival` | guessed from pan already |
| c1.square | village.square | `square` | guessed |
| c2.plan | none | `cellar` | the court deposit, a lantern: please add `scene: 'cellar'` |
| c2.arrest | village.cottage_door | `arrest` | guessed |
| c3.coven | depths.coven | `coven` | guessed |
| c3.jail | depths.jail | `tower` | guessed (or `cellar`, if you prefer the inside) |
| c3.court | court.dock | `trial` | guessed |
| f.dawn (1st) | village.forest_gate | `dawn` | guessed |
| f.dawn (2nd) | none | `dawn` | please add `scene: 'dawn'` |

Unused today, ready if wanted: `door` (Malva's lit doorway: c1.malva could open with it), `campfire`
(c2.fire), `last` (the end of s4: `{ tableau: 'last' }` before the final line), `cards`.

### dialogue.js (cameos instead of pixel busts)

```js
// was: import { portrait } from './portraits.js';
import { cameo } from './stage/cameos.js';
// was: const cv = portrait(who);
const cv = who === 'lettrice' ? null : cameo(who, matchMedia('(min-width:720px)').matches ? 96 : 72);
// in the box: put `cv` itself where `h('canvas.sy-port', { width: 24, height: 24 })` was
// (cv?.classList.add('sy-port')), and drop the drawImage line.
```

CSS for `.sy-port`: drop `image-rendering:pixelated`, the border, outline and background (the cameo is
an oval with its own rim and transparent corners). `cameo()` sets its own CSS width and height.
It returns null only for `narra`; the Lettrice has a veiled cameo, but DESIGN wants her faceless in the
world, so keep her null there. Villagers `child`, `washer`, `hale`, `gravedigger`, `miller` have cameos.

### Old files that become unused after the swap

`src/story/scene.js`, `src/story/table.js`, `src/story/hands.js`, `src/story/portraits.js`, `src/story/paint.js`
(used only by those), and `src/story/cinema.js` once every cinema node has a scene. `harness/story.js`
imports `cinema.js` and `portraits.js`: update or drop those views. (`src/systems/table.js` is a different file.)

## Checked

- `npm test` (tests/stage.data.test.mjs: every tableau resolves, every PEOPLE id and villager has a cameo,
  every path parses, symbols sample, every script cinema node gets a scene except c2.plan and the 2nd f.dawn).
- Screens with scripts/shot.mjs, phone and desktop: every tableau, the cameo sheet, the session demo
  (`harness/stage.steps.mjs`), cinema, reduced motion.
- `OUT=/tmp/stage-dist npx vite build`; the harness page also builds (vite API, input harness/stage.html).

## Not checked / to know

- Smoothness on a real phone. Canvas is capped at 0.72 MP, frames are skipped if slow, paused when hidden.
  scripts/shot.mjs (networkidle0) timed out on a scene that drew a large rotated image every frame: a useful
  alarm for per-frame cost. That sun is now baked into the field.
- DESIGN gives Ginepra a juniper-blue cloak; the world sprite (`world/art/people.js`) has a red coat. The
  cameo follows DESIGN.

## Retouch (stage 2)

Public API of `index.js` and `cameos.js` unchanged.

- `dawn`: new broom riders (side-saddle, leaning into the wind, hair, cloak and skirt streaming, bristles
  trailing, sleeve to the stick, no hands); Tartufo rides at the back of yours. Salem small below, three
  layers of woods (`woods`) fill the lower screen.
- `campfire` / seated: you sit on the ground hugging your knees (arms over the shins), Ginepra on a log
  with forearms on her knees; a light gap under the thighs shows the legs. No hands.
- `square`: mixed standing crowd (`throng`: men, tall hats, bonnets, a child, an elder with a stick, gaps),
  the Afflicted apart, the accused (`accused`, head bowed) alone in a pool of light (`glow` with `under`),
  spectators' backs in front (`backs`).
- `trial`: heavy bench reaching the floor seen from below, the Judge (tall hat, cut-out bands), rail,
  fading light shafts (`fx: 'shafts'`, painted once into a sheet), Ginepra from behind (`ginepraBack`)
  small in a pool with a long shadow (`castShadow`).
- Phone composition: items take `tall: {...}` overrides and `only: 'tall'|'wide'` (Painter.pick). Banks,
  fences, vines frame the bottom on phones; bust necks shortened a little (reader untouched).
- Perf: empty sheets are skipped. Headless Chrome, software raster, 576x1248 canvas: build 10-45 ms,
  frame 5-13 ms (heaviest: reader ~13, coven ~12, dawn ~11), noisy between runs.
