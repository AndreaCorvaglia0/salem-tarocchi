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

<!-- Everything below is written by scripts/map.mjs: do not edit by hand. -->

## Folders

| Folder | Files | Lines |
|---|---:|---:|
| `src/.` | 1 | 50 |
| `src/core` | 11 | 1143 |
| `src/data` | 13 | 1468 |
| `src/data/cards` | 4 | 748 |
| `src/data/daily` | 3 | 1571 |
| `src/data/elsewhere` | 3 | 179 |
| `src/data/herbs` | 2 | 351 |
| `src/data/reading` | 5 | 758 |
| `src/data/reading/voices` | 81 | 6645 |
| `src/data/story` | 12 | 2034 |
| `src/data/story/scripts` | 13 | 2892 |
| `src/data/trials` | 7 | 920 |
| `src/data/world` | 17 | 1216 |
| `src/glue` | 45 | 3219 |
| `src/reading` | 9 | 702 |
| `src/sound` | 11 | 1014 |
| `src/story` | 12 | 1136 |
| `src/story/stage` | 14 | 1925 |
| `src/systems` | 20 | 1605 |
| `src/trials` | 3 | 471 |
| `src/ui` | 37 | 4170 |
| `src/ui/missions` | 5 | 542 |
| `src/ui/rite` | 2 | 509 |
| `src/world` | 19 | 1428 |
| `src/world/art` | 20 | 3485 |
| `src/world/scene` | 21 | 2193 |

## Services

Provided by one file, sometimes wrapped by glue, called by name from anywhere.

| Service | Provided by | Wrapped by | Called from |
|---|---|---|---|
| `card.found` | ui/index | glue/hints | glue/elsewhere, glue/trials, story/runner, ui/shop, ui/trade, world/scene/minors … (+1) |
| `card.show` | ui/index |  | — |
| `clients.next` | glue/clients |  | — |
| `collect.show` | glue/collect |  | — |
| `day.draw` | glue/day |  | — |
| `draw.pick` | systems/index | glue/wire | glue/day, story/runner, ui/selfread |
| `elsewhere.go` | glue/elsewhere |  | story/runner |
| `elsewhere.leave` | glue/elsewhere |  | — |
| `elsewhere.status` | glue/elsewhere |  | — |
| `exam.recover` | systems/index |  | — |
| `exam.start` | systems/index | glue/diary, glue/hints | glue/trials, story/runner, world/scene/World |
| `find.take` | glue/collect |  | world/scene/finds |
| `fly.check` | glue/fly |  | ui/mappa |
| `fly.to` | glue/fly |  | ui/mappa |
| `garden.lesson` | glue/garden |  | — |
| `garden.open` | glue/garden |  | ui/title |
| `garden.ready` | glue/garden |  | — |
| `garden.thirsty` | glue/garden |  | — |
| `garden.unlock` | glue/garden |  | — |
| `grimoire.open` | ui/index | glue/wire | main, ui/hud |
| `guide.ask` | glue/hints |  | ui/hud |
| `herb.look` | glue/herbs |  | world/scene/herbs |
| `hud.mount` | ui/index |  | main |
| `hud.toast` | ui/index |  | glue/bonds, glue/collect, glue/day, glue/diary, glue/elsewhere, glue/garden … (+8) |
| `library.open` | glue/trials |  | — |
| `lock.ask` | systems/index | glue/diary | world/scene/things |
| `opinions.answer` | glue/opinions |  | glue/opinions |
| `opinions.dream` | glue/opinions |  | glue/opinions |
| `opinions.heard` | glue/opinions |  | glue/opinions |
| `opinions.open` | glue/opinions |  | — |
| `opinions.reader` | glue/opinions |  | story/visit |
| `reading.free` | systems/index |  | — |
| `reading.open` | systems/index | glue/bonds, glue/diary, glue/finale, glue/hints, glue/selfread, glue/street | glue/clients, story/runner |
| `readings.delete` | glue/selfread |  | ui/selfread |
| `readings.keep` | glue/selfread |  | ui/selfread |
| `readings.note` | glue/selfread |  | ui/selfread |
| `review.open` | systems/index |  | ui/title |
| `rite.after` | glue/rite |  | systems/consult, systems/reading, ui/selfread |
| `rite.malva` | glue/rite |  | — |
| `rite.overlay` | ui/rite/index |  | glue/rite |
| `rite.preview` | ui/rite/index |  | glue/rite |
| `rite.run` | glue/rite |  | systems/reading, ui/selfread |
| `rite.state` | glue/rite |  | — |
| `selfread.intro` | glue/selfread |  | ui/selfread |
| `shop.open` | ui/index | glue/wire | — |
| `sibyl.pairs` | glue/sibylpairs |  | — |
| `sound.back` | glue/mood |  | glue/elsewhere, story/session, story/visit, systems/theme, ui/selfread, world/escape |
| `sound.hold` | glue/mood |  | story/session, story/visit |
| `sound.mood` | sound/index |  | glue/mood, glue/rite, story/session, story/visit, systems/theme, ui/rite/index … (+4) |
| `sound.music` | sound/index |  | — |
| `sound.play` | sound/index |  | glue/bonds, glue/collect, glue/fly, glue/herbs, glue/rite, story/dialogue … (+10) |
| `sound.preload` | sound/index |  | ui/rite/index |
| `sound.sample` | sound/index |  | ui/rite/index |
| `sound.sfx` | sound/index |  | — |
| `sound.stop` | sound/index |  | story/chapter |
| `sound.want` | sound/index |  | glue/rite |
| `story.busy` | story/index |  | glue/bonds, glue/collect, glue/fly, glue/home, glue/lessons, glue/street … (+1) |
| `story.chapterCard` | story/chapter |  | main |
| `story.choose` | story/index |  | glue/clients, glue/elsewhere, glue/trials |
| `story.run` | story/index | glue/opinions | glue/bonds, glue/clients, glue/collect, glue/lessons, glue/street, glue/wire … (+1) |
| `story.say` | story/index |  | glue/clients, glue/day, glue/diary, glue/elsewhere, glue/trials, world/scene/things |
| `story.session` | story/index |  | main, story/runner |
| `story.visit` | story/index |  | story/runner |
| `street.now` | glue/street |  | — |
| `title.open` | ui/index |  | main |
| `tool.use` | glue/tools | glue/traits | ui/io |
| `trade.open` | glue/wire |  | — |
| `trial.ask` | glue/trials |  | — |
| `trial.sense` | glue/trials |  | — |
| `trial.start` | glue/trials |  | story/runner |
| `trial.witchDraw` | glue/trials |  | glue/elsewhere, story/runner |
| `witches.bond` | glue/witches |  | story/runner |
| `witches.open` | glue/witches |  | — |
| `world.ahead` | world/index |  | ui/hint |
| `world.anchors` | world/index |  | glue/debug, glue/lessons |
| `world.canFly` | world/index |  | — |
| `world.elsewhere` | world/index |  | glue/elsewhere |
| `world.escape` | world/index |  | glue/trials |
| `world.fly` | world/index |  | glue/fly |
| `world.guide` | world/index |  | glue/hints |
| `world.hint` | world/index |  | — |
| `world.mission` | world/index |  | glue/bonds |
| `world.refresh` | world/index |  | — |
| `world.sensed` | world/index |  | — |
| `world.start` | world/index | glue/bonds, glue/garden, glue/hints, glue/lessons | main |
| `world.stranger` | world/index |  | glue/street |
| `world.travel` | world/index | glue/diary | glue/debug, glue/elsewhere, glue/fly, glue/trials, story/runner, world/scene/World |
| `world.where` | world/index |  | glue/debug, glue/elsewhere, glue/fly, glue/home, glue/lessons, glue/mood … (+2) |

Every service that is called is provided.

## Bus events

| Event | Emitted by | Heard by |
|---|---|---|
| `blocked` | world/scene/obstacles | glue/wire |
| `bond` | core/witches | — |
| `card:found` | core/progress | glue/diary, glue/lessons, glue/wire, sound/index, ui/hint, ui/hud |
| `card:recovered` | core/progress | — |
| `card:star` | core/progress | sound/index, ui/hud |
| `cards:confiscated` | core/progress | — |
| `cell` | world/scene/World | glue/bonds, glue/home |
| `chapter` | core/progress | glue/hints, sound/index |
| `cinema` | story/chapter, story/cinema, story/session, story/stage/index, story/visit | sound/index, ui/hud |
| `coins` | core/progress | sound/index, ui/hud |
| `collect` | glue/collect | — |
| `diary` | core/progress | — |
| `dupe` | world/scene/minors | glue/wire |
| `elsewhere:fall` | world/scene/elsewhere | glue/elsewhere |
| `exam` | glue/diary | glue/fly |
| `extra:done` | core/extras | ui/hud |
| `flag` | core/progress, glue/garden | glue/diary, glue/lessons, glue/wire, sound/index |
| `garden` | glue/garden | — |
| `grimoire:open` | ui/grimoire | ui/hint, ui/hud |
| `herb` | glue/herbs | — |
| `hint` | core/progress, glue/lessons, glue/trials, world/scene/World | ui/hint, ui/hud |
| `hint.fly.lesson` | — | glue/lessons |
| `level:up` | core/progress | glue/diary, glue/lessons, sound/index, ui/hud |
| `lost` | world/scene/fog | glue/wire |
| `map:enter` | world/scene/World | glue/bonds, glue/collect, glue/home, glue/street |
| `minor` | — | glue/wire |
| `opened` | world/scene/obstacles | — |
| `opinion` | glue/opinions | — |
| `pairs` | glue/sibylpairs | — |
| `patrol:seen` | world/scene/World | glue/fly, glue/traits, sound/index |
| `power` | story/runner | glue/diary, glue/lessons, glue/wire |
| `readings` | glue/selfread | — |
| `seen` | world/scene/World | glue/bonds, glue/home, glue/traits |
| `settings` | sound/index | sound/index |
| `step` | core/progress | glue/traits, glue/wire, ui/hud |
| `stun` | world/scene/World | glue/traits |
| `talk` | world/scene/things | glue/bonds, glue/collect, glue/traits |
| `tartufo:tap` | world/scene/World | glue/bonds |
| `track` | core/extras | ui/hud |
| `trait` | core/progress | — |
| `treats` | core/bonds | — |
| `trust` | core/progress | glue/witches |
| `vault` | core/vault | ui/title |
| `visit` | story/visit | — |
| `xp` | core/progress | ui/hud |
| `yourcard:changed` | core/progress | ui/hud |

## Most imported files

Touch these with care: many files depend on them.

- `src/core/state.js` (78)
- `src/core/dom.js` (67)
- `src/core/services.js` (59)
- `src/core/progress.js` (56)
- `src/data/cards.base.js` (54)
- `src/core/bus.js` (41)
- `src/core/cond.js` (30)
- `src/ui/paper.js` (27)
- `src/data/story/index.js` (25)
- `src/world/art/px.js` (22)
- `src/data/story/h.js` (21)
- `src/core/fonts.js` (16)
- `src/world/art/palette.js` (15)
- `src/data/cards.js` (14)
- `src/world/maps.js` (12)
