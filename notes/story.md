# Story: map and needs

Data in `src/data/story/` (index.js aggregates). Tests: `tests/story.data.test.mjs` (integrity),
`tests/story.path.test.mjs` (plays the whole path with the real runner and fake services, both fork sides).

## Main path

| Step | Where | Script (CAST) | What it does / unlocks |
|---|---|---|---|
| p.session | session | s0 | name, birth, Il Matto, one question -> p.road, travel village.arrival |
| p.road | village.arrival (zone) | p.road | draw 1 of m01-m06, chapter 1 -> c1.malva |
| c1.malva | village.malva_door (zone) | c1.malva | travel malva.hearth, 2 fan draws, lesson deck, teach single -> c1.cottage |
| c1.cottage | village.cottage_door (zone) | c1.cottage | Tartufo arrives (power cat) -> c1.client |
| c1.client | cottage.table (prop) | client.c1 | first single reading -> c1.explore |
| c1.explore | village.square (zone) | c1.exam1 | first Exam, explained by Tartufo -> c1.cart |
| c1.cart | village.cart (zone) | c1.cart | Ginepra snatches Il Carro -> c1.venus |
| c1.venus | village.venusglass (npc ginepra) | c1.venus | Venus glass; she gives m07 back (giveCard) -> c1.square |
| c1.square | village.square (zone) | c1.square | FORK 1 b1.spoke / b1.hid -> c1.gate |
| c1.gate | village.forest_gate (zone) | c1.gate | gate majorsMin 6 (Fool + 5); s1; chapter 2; travel forest.entry -> c2.ortica |
| c2.ortica | forest.ortica_hut (npc) | c2.ortica | fan draw 'row', teach ppf, lessons ppf+suits -> c2.client |
| c2.client | cottage.table | client.c2 | first ppf reading -> c2.fire |
| c2.fire | forest.campfire (npc ginepra) | c2.fire | needs power fire (level 4); Ginepra reads La Ruota, asks a question -> c2.plan |
| c2.plan | village.court_door (npc ginepra) | c2.plan | gate majorsMin 11; FORK 2 b2.went / b2.stayed -> c2.home |
| c2.home | village.cottage_door (zone) | c2.arrest | "Sono io."; s2; chapter 3 -> c3.trapdoor |
| c3.trapdoor | village.trapdoor (npc malva) | c3.trapdoor | travel depths.entry -> c3.edera |
| c3.edera | depths.edera_nook (npc) | c3.edera | fan draw m15-m18, teach celtic, lessons celtic+astro -> c3.client |
| c3.client | cottage.table | client.c3 | first celtic reading -> c3.coven |
| c3.coven | depths.coven (zone) | c3.coven | gate majorsMin 19 (every spot card); FORK 3 -> c3.jail or c3.court |
| c3.jail / c3.court | depths.jail / village.court_door (zone) | c3.jail / c3.court | travel court.dock -> c3.trial, goto c3.trial |
| c3.trial | court.dock | c3.trial | exam judge; m20; -> f.dawn, goto f.dawn |
| f.dawn | village.forest_gate | f.dawn | m19, power broom, flight; s3 -> f.last, travel forest.entry |
| f.last | forest.campfire (npc ginepra) | f.last | epilogue from flags/trust; s4 (celtic reading for 'self', m21); ending.seen; chapter 4 -> post.minors |

Simulated xp at the end without any star: 580 (cards 22 x 20 + story). Stars (+10) bring it past 730.

## Flags

Forks: `b1.spoke` `b1.hid` `b2.went` `b2.stayed` `b3.stealth` `b3.open`.
Colour/callbacks: `p.grab` `p.looked` `malva.wood` `malva.cheeky` `cat.fed` `cat.proud` `exam1.malva` `lied.constable`
`ginepra.chased` `ginepra.let` `venus.looked` `venus.refused` `fire.carriage` `fire.promised` `fire.joked`
`edera.rosalba` `s0.knock` `s0.window`.
State: `met.ginepra` `ginepra.snatched` `ginepra.returned` `ginepra.taken` `trial.won` `trial.lost` `ending.seen`
`seen.road` `ortica.gossip` `edera.told` `post.met` `client.<id>.done` `enc.<name>`.
Session leaves: `leaf.value.<card>` `leaf.fear.<card>` `leaf.dream.<card>` (one per session; the card is the leaf's point).
Read from the runner: `exam.passed` (set after every `{ do: 'exam' }`).

## What the other systems must do

- **Narrative**: `draw` with an explicit id pool must skip ids already found (the Malva and Edera draws use
  explicit pools to keep Il Carro and m19-m21 out). Today the runner passes the pool as is: please filter
  `pool.filter(id => !state.cards[id]?.found)` (fallback to 'row' if empty).
- **Narrative**: `{ turn: 'm00' }` must `findCard('m00')`: all gates count Il Matto (`majorsMin` 6 / 11 / 19).
- **Narrative**: `observe` entries use `when: true` as the last fallback.
- **World**: hide the m07 spot at `village.cart` (Il Carro is given by script c1.venus); show m19/m20/m21 nowhere.
- **World**: patrols near `village.square` off while step is `c1.explore` or `c1.square` (scripted scenes), near
  `village.court_door` during `c2.plan`/`c3.court`, near `village.cottage_door` during `c2.home`, near `depths.jail` during `c3.jail`.
- **World**: CAST npc `who` values not in PEOPLE need a sprite: `child`, `washer`, `hale`, `gravedigger`, `miller`.
- **World**: on a failed Exam inside a script (c1.exam1), travel to jail only after the script ends.
- **Play**: `exam.start({kind:'judge'})` applies the mistresses' help from `trusts()` (Malva cancels an error, Ortica
  skips a question, Edera removes a wrong answer); the story only announces it.
- **Play**: the court deposit (`court.deposit`) opens `exam.recover`; the story points there in barks and the coven refusal.
- **Barks**: `tartufo` entries carry `on` ('card' | 'patrol' | 'failed' | 'passed' | 'idle') besides `when`; `diaryFor` keys are
  bus events (`card:found`...) and a few named events (`exam.passed`, `jailed`, `stun`, `fire`, `reading`, `lock`).
- **Card of the day** at `cottage.bed` is not scripted: the systems own it.
