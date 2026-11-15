# Story: map and needs

Data in `src/data/story/` (index.js aggregates: `SCRIPTS`, `SESSIONS`, `STEPS`, `SIDE`, `CAST`, `CLIENTS`, `BARKS`).
Scripts: `scripts/c0.js` (prologue), `c1.js` (the guided opening), `c1b.js` (rest of chapter 1), `c2.js`, `c3.js`,
`end.js`, `post.js` (optional encounters, the small cards, after the ending), `props.js`.
Tests: `tests/story.data.test.mjs` (integrity, choices and replies, traits, gates, visits, side missions),
`tests/story.path.test.mjs` (plays the whole path with the real runner and fake services, both fork sides).
The sessions, the visits' texts, the hints, the portrait and the lessons belong to the other writer.

## Main path

| Step | Where | Script (CAST) | What it does / unlocks |
|---|---|---|---|
| p.session | session | s0 | name, birth, Il Matto -> p.road, travel village.arrival |
| p.road | village.arrival (zone, once) | p.arrive | the arrival tableau, two lines; then she walks |
| p.road | village.road_card (zone r 1) | p.road | first card (draw 1 of m01-m06), Tartufo joins (level 2 comes here), chapter 1, xp 5 -> c1.malva |
| c1.malva | village.malva_door (zone) | c1.malva | travel malva.hearth, 2 fan draws, lesson deck -> c1.read |
| c1.read | malva.table (prop "Siediti") | c1.read | first reading, for Malva (client c0.malva); teach single, lesson single; coins 12; flag shop.open; xp 5 -> c1.shop |
| c1.shop | shop.counter (prop) / shop.keeper | c1.shop | ERRAND 1: the incense (coins -10, tool incense), side.m01, then shop.open; xp 5 -> c1.back |
| c1.back | malva.hearth (npc) | c1.back | Malva on the incense and on her first night; ERRAND 2 given; the constables, told as a person would -> c1.deliver |
| c1.deliver | village.meeting_door (npc washer) | c1.deliver | the washerwoman Tabita; side.m05; coins 3; xp 5 -> c1.cottage |
| c1.cottage | village.cottage_door (zone) | c1.cottage | travel cottage.table; the cottage; Tartufo and the bread -> c1.grimoire |
| c1.grimoire | cottage.table (prop "Siediti") | c1.grimoire | opens the grimoire (`grimoire.open`, tab io); someone knocks; xp 5 -> c1.client |
| c1.client | cottage.table (prop "Leggi") | client.c1 | first cottage reading; VISIT 1; xp 5 -> c1.cart |
| c1.cart | village.cart (zone) | c1.cart | Ginepra takes Il Carro; a lantern in the square; xp 5 -> c1.explore |
| c1.explore | village.square (zone) | c1.exam1 | the first Exam, a scare; flag exam1.done; xp 5 -> c1.venus |
| c1.venus | village.venusglass (npc ginepra) | c1.venus | Venus glass; m07 (giveCard); VISIT 2; xp 5 -> c1.square |
| c1.square | village.square (zone) | c1.square | FORK 1 b1.spoke / b1.hid; xp 10 -> c1.gate |
| c1.gate | village.forest_gate (npc malva) | c1.gate | GATE: majorsMin 6 and level 4 (Fattucchiera); refusal sets gate1.refused; s1; chapter 2; xp 10; travel forest.entry -> c2.ortica |
| c2.ortica | forest.ortica_hut (npc) | c2.ortica | she asks her opinion; fan draw 'row', teach ppf, lessons ppf + suits; ERRAND 3 asked; xp 5; VISIT 1 -> c2.mill |
| c2.mill | forest.mill (npc miller) | c2.mill | the miller; side.m12; coins 4; "the last errand" said by Tartufo; xp 5 -> c2.client |
| c2.client | cottage.table | client.c2 | first ppf reading; xp 5 -> c2.fire |
| c2.fire | forest.campfire (npc ginepra) | c2.fire | Ginepra reads La Ruota, asks a question; xp 10; VISIT 2 -> c2.plan |
| c2.plan | village.court_door (npc ginepra when 11 Majors, else a zone) | c2.plan | gate majorsMin 11 (until then she waits at the campfire: trade.ginepra); FORK 2 b2.went / b2.stayed; xp 5 -> c2.home |
| c2.home | village.cottage_door (zone) | c2.arrest | "Sono io."; xp 10; s2 -> c3.trapdoor (the chapter stays 2) |
| c3.trapdoor | village.trapdoor (npc malva) | c3.trapdoor | GATE: level 7 (Strega); refusal sets gate2.refused; chapter 3; travel depths.entry; xp 5 -> c3.edera |
| c3.edera | depths.edera_nook (npc) | c3.edera | fan draw m15-m18, teach celtic, lessons celtic + astro; xp 5; VISIT 1 -> c3.client |
| c3.client | cottage.table | client.c3 | first celtic reading; xp 5 -> c3.coven |
| c3.coven | depths.coven (zone) | c3.coven | gate majorsMin 19; she decides: FORK 3 -> c3.jail or c3.court; then gives the tasks; xp 10; VISIT 2 |
| c3.jail / c3.court | depths.jail / village.court_door (zone) | c3.jail / c3.court | travel court.dock; xp 5 -> c3.trial, goto c3.trial |
| c3.trial | court.dock | c3.trial | exam judge; m20; xp 20 -> f.dawn, goto f.dawn |
| f.dawn | village.forest_gate | f.dawn | m19; a broom for Ginepra at the gate (she already flies); flight; xp 15; s3 -> f.last, travel forest.entry |
| f.last | forest.campfire (npc ginepra) | f.last | epilogue from flags/trust/traits; s4; ending.seen; chapter 4; xp 10 -> post.minors |

Story xp: 170 in all (chapter 1: 55, chapter 2: 40, chapter 3 and finale: 75). With the 22 Majors (440) a run
without any reading, visit, Exam or star ends at 610. The rank gates count on the rest: a reading gives 10-30,
a visit 10, a passed Exam 10, a star 10. Measured with the path test's fake player (who gets none of those):
155 xp on reaching the forest gate (needs 200), 325 on reaching the trapdoor (needs 470). A real player who
does only the main path adds Malva's reading and two first clients (about 60), four visits (40), the first
Exam and some stars: she arrives near the threshold, and two or three more readings carry her over.

## Flags

Forks: `b1.spoke` `b1.hid` `b2.went` `b2.stayed` `b3.stealth` `b3.open`.
Colour/callbacks: `p.grab` `p.looked` `malva.wood` `malva.cheeky` `cat.fed` `cat.proud` `exam1.malva` `lied.constable`
`ginepra.chased` `ginepra.let` `venus.looked` `venus.refused` `fire.carriage` `fire.promised` `fire.joked`
`edera.rosalba`; the tasks she gives at the council: `coven.watch.edera` / `coven.watch.malva`,
`coven.ortica.talk` / `coven.ortica.brooms` (they change lines in the trial, at the jail or the court door, at dawn).
State: `met.ginepra` `ginepra.snatched` `ginepra.returned` `ginepra.taken` `trial.won` `trial.lost` `ending.seen`
`seen.road` `ortica.gossip` `ortica.broom` `edera.told` `post.met` `client.<id>.done` `enc.<name>` `exam1.done`
`gate1.refused` `gate2.refused` `shop.open` (also set by Malva when she sends her) `fog.lost` `minor.first`
`minor.dup` `ginepra.minor` `ginepra.dup` `side.<card>` (m01 m02 m03 m05 m09 m11 m12 m18).
Read from the runner: `exam.passed` (set after every `{ do: 'exam' }`; c1.venus reads it).
Set by the sessions and read by them: `s0.*`, `leaf.*`, `rd.*`.

## Choices, traits, rank

- Every option of a non-repeatable choice carries a `trait` (one or two axes, one point), and the two options
  pull different ways. The repeatable chats (`malva.chat`, `ortica.chat`, `edera.chat`, `trade.ginepra`,
  `post.ginepra`) carry none, so a trait cannot be farmed.
- Lines that only appear when a trait is marked (threshold 3, or `steady`, or `torn`): Malva 7 (frank / wary,
  kind / sharp), Ortica 4 (curious / straight), Edera 5 (kind / sharp), Ginepra 6 (bold / careful, torn tono),
  the Judge 4 (sharp, kind, frank, wary) and a constable 1, Tartufo 7 (bed, court door, epilogue, idle bark).
- Rank: Malva orders (chapter 1), Ortica asks her opinion (chapter 2), at the council the mistresses wait
  for her word and she gives each her task. `{ level: n }` lines: malva.chat (4), c2.fire and ortica.chat (7).
- Errands end with the mill: Tartufo says so there, Malva says it again at the trapdoor.

## What the other systems must do

Things I rely on that are not mine. The first block is needed for the opening to work as written.

- **World, patrols**: `src/data/world/village.js` `EARLY` lists the steps before the first, scripted Exam. The
  opening now has more steps: please use `{ notFlag: 'exam1.done' }` instead (or add `c1.read`, `c1.shop`,
  `c1.back`, `c1.deliver`, `c1.grimoire`, `c1.cart` to `EARLY`). Until then a patrol can stop her before the scare.
- **World, cast**: `village.road_card` is a zone with `r: 1` (the first card: a glint there helps); Malva is an npc
  at `village.forest_gate` during `c1.gate` and at `village.trapdoor` during `c3.trapdoor`; the washerwoman
  (`who: 'washer'`) and the miller (`who: 'miller'`) are main-path npcs now; Ginepra stands at `forest.campfire`
  during `c2.plan` until there are 11 Majors, then at `village.court_door`.
- **World, chapter 3**: the chapter becomes 3 when Malva lets her down (c3.trapdoor), not at the arrest: the
  trapdoor door (`chapterMin: 3`) stays shut until then with no change. Between the arrest and the descent
  the season and the clients are still those of chapter 2.
- **World, fog**: when the thick fog of the deep wood (or of the swamp) brings her back, `story.run('fog.lost')`
  (narration, Tartufo's line, flag `fog.lost`; Ortica then answers about it in `ortica.chat`).
- **World, the small cards**: on the first Minor found `story.run('minor.first')`, on the first duplicate
  `story.run('minor.dup')`; for the later ones `BARKS.tartufo` has `on: 'minor'` and `on: 'minor.dup'`.
  Ginepra's lines about them are in `trade.ginepra` (she is not there when a card is found).
- **Systems**: a service `trade.open` (swapping duplicates), called by `trade.ginepra` and `post.ginepra`.
- **Systems, the opening**: `c1.grimoire` calls `grimoire.open({ tab: 'io' })` and `c1.shop` calls `shop.open`
  in the middle of a script: the dialogue box should step aside while they are open. `c1.shop` takes the
  10 coins and gives the incense itself (she cannot fail to buy it): if the price changes, the bottegaio's
  line "Fanno dieci monete" changes with it.
- **Grimoire, map**: `SIDE = [{ id, chapter, at, note, when, done }]`: show `note` in pencil at `at` while
  `when` holds and `done` does not. `STEPS` now carry `rank` (4 or 7) next to `need`.
- **HUD**: with `need`, `ui/logic.js` writes "Trovare ancora N carte, poi: devo...". The step texts are full
  sentences now; a prefix like "Mi mancano ancora N carte. Poi devo..." would read better, and with `rank`
  "Devo prima diventare Fattucchiera." / "...Strega.". The fallbacks "Leggere. Per me." and "Guardarmi intorno."
  are clipped too.
- **Narrative**: `{ do: 'visit' }` may be a no-op (fewer than two untold cards): the line before each visit is
  written to stand alone. `draw` with an explicit pool skips found cards (done). `cinema` scenes used:
  arrival, door, square, campfire, cellar (the deposit and the cells), arrest, coven, trial, dawn.
- **Play**: `exam.start({ kind: 'judge' })` applies the mistresses' help from `trusts()`; the story only
  promises it ("troverà il modo di darti una mano"). `BARKS.judge` is written as the opening line of the trial.
  The Exam and the reading keep their own interface lines.
- **Glue**: `glue/clients.js` has a narrator line of its own ("Bussano. È di nuovo ...") in the old clipped
  style. Suggested: "Bussano di nuovo alla porta, ed è {name}. Dice che l'altra volta avevi visto giusto, e che ha
  un'altra domanda." and "Stanotte non bussa nessuno. Si sente soltanto il vento." `BARKS.diaryFor` has new keys:
  `power.sense`, `power.move`, `minor.first`, `fog.lost`, `gate1.refused`, `gate2.refused` (all flags or powers).
- **Core**: level 2 gives the cat, and it comes with the first card on the road: the story introduces Tartufo
  right there (and calls `power cat` itself, harmless). The story gives no other power. The level 7 text
  ("Ti basta uno sguardo...") should speak of air, as the characters do (a breath: Spade).
- **Debug**: `glue/debug.rules.js` jump `c3` (chapter 3, step c3.trapdoor, xp 460) meets the Strega gate:
  make it chapter 2 with xp 470 or more, or start at `c3.edera`.

### Hints I need (interface lines, the other writer's `hints.js`; who emits them is the systems')

| Hint | When | What it should say |
|---|---|---|
| `move` | on the road, after the tableau | exists |
| `action` | first prop: Malva's table ("Siediti") | exists |
| `draw` | the first fan (the card in the snow) | tap one of the face-down cards to choose it |
| `detail`, `words` | the first card ceremony | exist |
| `reading` | the reading for Malva | exists |
| `shop` | `shop.open` inside c1.shop | tap a thing to see what it costs; coins come from readings |
| `map` | step c1.deliver | in the grimoire, the map page: the red circle is where to go |
| `grimoire` | when the grimoire closes in c1.grimoire | to open it again, tap the book at the top (the current text speaks of a card) |
| `exam` | the first Exam (c1.exam1) | exists; if the incense has a button there, one line for it |
| `rank` | after `gate1.refused` / `gate2.refused` | how experience grows: read for who knocks, review, find cards; the bar shows how much is missing |
| `side` | the first `side.*` flag (c1.shop) | a pencil note has appeared on the map of the grimoire |
| `fly` | when the broom comes | from the map she can fly to outdoor places she has seen |
| `trade` | first `trade.open` | how to swap a duplicate |

### The path test

`tests/story.path.test.mjs` is not mine. Its fake player earns xp only from cards and story beats, so at the
Strega gate she has 405 xp with every chapter 1-2 card (the gate asks for 470); its owner has added that she
"studies" when a gate still refuses with every card found, and with that both sides reach the end with no
warnings (695 xp). I did not inflate story xp to carry the fake over: it would make the gate never refuse a
real player.
