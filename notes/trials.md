# Trials, asking the cards, the library, the witches' two axes (16 Nov, afternoon)

Mechanisms for DESIGN.md "La logica del gioco, ridefinita", with one worked example (`demo`, debug only).

## What exists
- `src/trials/ask.js` (pure): `faceOf`, `matches(tags, face)`, `rightOptions`, `fair`, `fairFaces`, `dealFor`,
  `dealFan`, `askCards({ pool, rng, kind, options, rule, by, reversed })`, `judge`, `saidLine`, `knownPool(state)`.
  Kinds `segno` (option `sign: go|slow|stop`; favore 0 = the cautious option), `idea` and `quesito` (option
  `tags`: suit, moto, favore '+|-|0', group, arcana, rev, cards, words in the essenza). Only faces that make
  exactly one option right are ever dealt; each possible right option gets an even chance. Pool = owned Majors
  + Minors taught (`minorTaught`); reversed only with `lesson.reversed`; if nothing in the pool fits, the whole
  deck is used (`widened`).
- `src/trials/run.js` (pure): `runTrial(def, io)` (format in the header), `outcomeOf` (0 perfect, 1-2 pass, 3+
  fail), `planReward`, `planLoss`, `gateCards`, `safeToLose`, `pickLostCard`, `trialStatus`, `trialDone`.
- `src/trials/topics.js` (pure): library pages and two questions per topic (Major id, suit, '1-3'/'4-6'/'7-10',
  'court', 'reversed', 'sign'), `taughtTopics`, `studyXp` (3 xp once per topic per day), `isFresh`.
- `src/core/witches.js` (pure + `addBond`): `affinity(witch, traits, yourCard)` 0..4 (three poles, value/4
  each, -1..1, +1 for her card being the witch's card, rounded, clamped), `bondLevel` (points 0,1,2,4,6),
  `attitude` (affine >= 2, bound >= 2 → pari/prova/brontola/fredda), `metWitch`, `carryTrust`.
  Edera's third pole, derived: **testa** (guida −), from "esatta".
- `src/ui/trial.js`: ask screen (own 5-card fan, card turns big with only its picture, rule note for
  quesito, options, feedback panel: name, essenza, what it said, right or not), witch's gesture (card small
  beside her line, bottom of screen), title card, end screen with gains/losses.
- `src/ui/library.js` (grimoire paper sheet), `src/ui/witches.js` (page from Io: card portrait, two ink
  bars, one sentence by attitude).
- `src/glue/trials.js`: services `trial.start(id)`, `trial.witchDraw(n)`, `trial.ask(fork)`, `trial.sense(id)`,
  `library.open()`. Registers real trials in EXTRAS (`kind: 'trial'`, `done: { trial: id }`, main = key) and
  `library.first` (key, `when: { trialPending: true }`, done by flag `library.first`). Pushes CAST props
  (library desk; side trials with `start.at`) and tiny SCRIPTS (`library.desk`, `trial.<id>`, LIBRARY_SCRIPTS).
  Outcomes stored in `state.trials[id]` and flag `trial.<id>.<outcome>`.
- `src/glue/witches.js`: every `trust` event also adds bond; `witches.open`, `witches.bond(who, n, why)`.
- `src/world/escape.js` + `escape.plan.js` (pure): `world.escape({ from?, to: anchor | 'auto', seconds? })`.
  Pursuer = constable sprite starting ~6 steps behind, step = 8000 ms / gap (≈1.3 s per tile) so standing
  still is caught in ~6.5-8 s and walking straight always makes it; time = 3× the walk + 10 s. Patrols off,
  `exam` mood, glowing target, a top band with a timer. A door taken on the way counts as safe.
- Library room: `src/data/world/library.js` (anchors `library.door`, `library.desk`), door in the slate house
  of the upper village (`village.library_door`, open from chapter 1).
- Data: `src/data/trials/` — `demo.js` (worked example), `intro.js` (TODO-writer `library.first`, 3 lines),
  `witches.js` (16 TODO-writer sentences), `index.js`.
- State (defaults + migrate): `bonds` (from trust on old saves), `trials`, `studied`, `studiedXp`, `trialSense`.
- Conditions: `{ affinity: { malva: 2 } }`, `{ bond: { ortica: 3 } }`, `{ attitude: { edera: 'brontola' } }`,
  `{ trial: 'id' }` / `{ trial: ['id', 'fail'] }`, `{ trialPending: true }`, `{ studied: 'm13' }`.

## Hooks outside my files (one line each)
- `src/glue/index.js`: `import './trials.js'`, `import './witches.js'`.
- `src/story/runner.js` ACTIONS: `witchDraw` (`{ do: 'witchDraw', who, card, rev, t }`), `trial` (`{ do: 'trial', id }`),
  `bond` (`{ do: 'bond', who, n }`).
- `src/ui/io.js`: import + one line, the entry «Le streghe» (shown once she has met a witch).
- `src/world/index.js`: the `world.escape` service (import + provide).
- `src/data/world/index.js` (library map), `src/data/world/village.js` (anchor `library_door` + its door).

## Decisions the brief did not cover
- No `draw.pick`: it prints the card's name under the picture and has no reversal; the ask screen has its
  own small fan (same idea, no name).
- Witch portraits on the page are the card each witch embodies (no portrait module in the ui area).
- Losses: a card is taken only if no story condition `{ has }`/`{ lacks }` names it; `random-minor` never
  takes a Major. Taken cards are confiscated, so they wait at the court deposit (`exam.recover`).
- A trial's lines go through `story.say` one at a time (works inside a running script: no queue deadlock).
- Trials and the library desk are added to EXTRAS/CAST/SCRIPTS by mutation at import (as glue/lessons.js does).

## How to see it (debug)
`window.__salem.call('trial.start', 'demo')`; `call('trial.sense', 'demo')` then `call('library.open')`;
`call('witches.open')`; `travel('library.desk')`. Screens: /home/claude/shots-trials/.

## Open points
- With few cards (chapter 2: eight Majors, mostly favourable and "cresce"), the right answer is often the
  same option: dealFor balances only among the options the pool can make right. Writers should pick tags
  that the cards she has at that point can split.
- The escape's pursuer walks slowly (≈1.3 s a tile) to honour "hesitating ~8 s"; it looks unhurried. Tune
  `HESITATE`/`GAP` in escape.plan.js after a phone test.
- Not verified: a real phone, audio (exam mood during the escape), a trial started from a story script.
