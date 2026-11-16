# Small paths: specials, deviations, false doors, callbacks (16 Nov)

The macro story, its order, the three forks and the ending are unchanged. Everything here is a small
branch that rejoins inside the same scene, carried by a flag when it is remembered later.
Test: `tests/story.paths.test.mjs` (every script of the scenes through its combinations of answers, in four
states; what each scene must leave behind is the table `NEED` there; then 60 random runs of the whole story).

Kinds: **A** special answer (gold, tagged) · **B** small real deviation · **C** cosmetic choice ·
**D** false door · **E** a later line that remembers · **G** a witch asks a card for herself.

## Table

| Scene | Kind | What unlocks it | What it changes | Rejoins | Remembered by |
|---|---|---|---|---|---|
| p.road (cat speaks) | E | `cat.shout` (existing option) | — | — | c1.cottage, Tartufo on her shouting |
| c1.malva: showing the card | C | — | two replies of Malva | next line | — |
| c1.malva | E | `p.grab` / `p.looked` | — | — | Malva on her red fingers / snowy shoes |
| c1.read: mixing or cutting | C | — | Malva's reply | the reading | — |
| c1.shop: sniffing the bag | C | — | `shop.sniffed` | next line | c1.back, Malva on the knot |
| c1.back: the cottage | C | — | `malva.hutstory` (who lived there) | next line | c2.ortica: "dormi nella mia capanna" |
| c1.back | G | — | Malva turns La Temperanza upright, and sends the ointment | — | — |
| c1.deliver: bundle closed / opened | D | — | `bundle.closed` / `bundle.peeked`; Tabita's first two lines | Tabita's third line | c1.gate (Malva, both), enc.washer, Reader opener `peeked` |
| c1.deliver: the three coins | B | — | keep: 3 coins. Refuse: `tabita.owes`, no coins | next line | c1.gate (Malva), enc.washer (blanket, trust Malva +1), f.last, Reader opener `tabita` |
| c1.grimoire: the knock | D | — | `door.opened` / `door.window`; how the widow Bray comes in; echo of `s0.knock` / `s0.window` | Tartufo's line | session s1 (the Reader on the door) |
| c1.cart: Tartufo takes the card | A+B | `tartufo: 1` | `cart.cat`, trust Ginepra +1 | next line | c1.venus (how Il Carro comes back), Tartufo idle bark |
| c1.cart: across the square or along the wall | D | — | `square.front` / `square.wall` | — | c1.exam1 opens differently (narration and constable), c1.venus (Ginepra) |
| c1.exam1: the widow Bray | A+B | `pop: 1` «[Ti conoscono]» | `exam1.bray` | the Exam | c2.arrest (constable), constable bark in chapter 1 |
| c1.exam1: goodnight | C | Exam passed | constable's reply | — | — |
| c1.venus: Gli Amanti on the sill | A | `has: m06` «[Hai Gli Amanti]» | `venus.card` (+ `venus.looked`) | the egg | c2.fire (Ginepra) |
| c1.venus | G | — | Ginepra turns La Luna: contrary, she does it anyway; the coffin follows | — | — |
| c1.venus: coming to the square | C | — | Ginepra's reply | — | — |
| c1.square: the candles | A | `rischio >= 3` «[È da te]» | `b1.candles` + `b1.spoke` | the fork's common lines | Hale's return and diary differ; enc.hale, f.last, Reader opener `candles` |
| c1.square: watching in silence | A | `parola <= -3` «[È da te]» | `b1.watched` + `b1.hid` | the fork's common lines | her thought differs; c2.ortica, the Judge at the trial, Reader opener `watched` |
| c1.square: a word to Malva | C | — | Malva's reply | — | — |
| c1.gate | G | — | Malva turns Il Matto upright, and opens | — | — |
| c1.gate: over the gate | A | `power: broom` | `gate.flew` | the farewell | c2.ortica |
| c1.gate: a real piece of advice | A+B | trust Malva >= 2 «[Malva si fida]» | `gate.advice`, incense +1 | the farewell | c2.ortica |
| c1.gate refused (first time only) | C | — | Malva's reply | — | — |
| c2.ortica: the herbs on the roof | A | `esplora >= 3` | trust Ortica +1 | next line | — |
| c2.ortica: what her clients say | A | `pop: 2` «[Ti conoscono]» | Ortica's reply | next line | — |
| c2.ortica | G | — | Ortica turns L'Imperatrice upright, and gives | — | — |
| c2.ortica: Ginepra asked of her | C | — | Ortica's reply | — | — |
| c2.ortica: flying to the mill | A+B | broom and `lesson.fly` | `mill.flew` | — | c2.mill opens differently, c2.fire (Ginepra) |
| c2.mill: a card for the wheel | A | `readings >= 3` «[Sai leggere]» | `mill.read` | the rumour | enc.miller (the debt paid) |
| c2.mill: the willow | C | — | the miller's reply | — | — |
| c2.mill: the four coins | B | — | keep: 4 coins. Take them to Ortica: `mill.honest`, no coins | next line | ortica.chat (6 coins, trust +1, once: `mill.paid`), c2.fire (Ginepra), Reader opener `honest` |
| c2.fire: teaching her the fire | E | existing option, now `fire.taught` | — | — | c3.jail (Ginepra) |
| c2.fire: her three words for the Wheel | A | `wrote: m10` «[L'hai scritto tu]» | trust Ginepra +1 | next line | — |
| c2.fire: the bread of the cells | A | `jailed >= 1` «[Ci sei passata]» | `fire.promised` | next line | the existing callbacks of the promise |
| c2.fire: the deck | C | — | Ginepra's reply | — | — |
| c2.plan | G | — | Ginepra turns La Ruota reversed: contrary, she goes in anyway; the lantern, the bell and the arrest follow | — | — |
| c2.plan (went): door or window | D | — | `depot.door` / `depot.window` | the deposit | Ginepra's shout while running, c2.arrest (the footprint) |
| c2.plan (went): the air, the cat | A ×2 | `power: stun`; `tartufo: 2` | a different way in (`depot.door`) | the deposit | — |
| c2.plan (went): the other labels | B | — | `depot.bray` (she takes the widow's deck) | the lantern | c3.trapdoor (6 coins from the widow), the Judge at the trial, Reader opener `bray` |
| c2.plan (stayed): lookout or home | D | — | `plan.lookout`; narration and diary differ | the bell | c2.arrest (Ginepra), c3.trapdoor (Malva), session s2 |
| c2.arrest: to the door or behind the woodshed | D | — | `arrest.front` / `arrest.hid` (a hand in the dark) | the constable's lines | c2.arrest and c3.jail (Ginepra), session s2 |
| c2.arrest: the air, her name | A ×2 | `power: stun`; `pop: 2` | a few lines | "Sono io." | — |
| c2.arrest | E | `lied.constable` (existing) | — | — | the constable; also a constable bark from chapter 2 |
| c3.trapdoor | G | — | open: Malva has turned La Forza upright. Refused (first time): L'Appeso, and she waits | — | — |
| c3.trapdoor: her own light | A+B | `power: fire` | `trapdoor.light`: Malva stays up, narration and diary differ | the cellars | c3.edera (Edera saw the light coming) |
| c3.trapdoor refused (first time only) | C | — | Malva's reply | — | — |
| c3.edera: the light or the water | D | — | `edera.light` / `edera.well`; arrival and Edera's greeting | "Rosalba" | Edera on the Star she passed by |
| c3.edera: her first card, the glasses | C | — | Edera's reply | — | — |
| c3.edera: bringing her the cards | B | — | `edera.promise`, or a hint to the Star at once | next line | edera.chat with La Stella: incense +1, trust +1 (once: `edera.star`) |
| c3.edera: her sign | A | birth data «[Il tuo segno]» | `edera.sign`, trust +1, reply by element | next line | edera.chat |
| c3.coven: the cells she slept in | A | `jailed >= 1` «[Ci sei passata]» | `coven.cells` | the fork | — |
| c3.coven | G | — | Edera turns La Giustizia upright, and the council moves | — | — |
| c3.coven: Ortica chooses | A | trust Ortica >= 2 «[Ortica si fida]» | `coven.ortica.free` | next task | c3.jail / c3.court (what Ortica chose) |
| c3.coven: Tartufo's task | B | she has the cat | `coven.cat.out` / `coven.cat.in` | the visit | the trial (where he is), session s3, Tartufo idle bark |
| c3.jail: chains or barrels | D | — | `jail.chains` / `jail.barrels`; the tableau and Ginepra's first line; a glimpse of Il Diavolo | "Sei venuta davvero!" | — |
| c3.jail: the four existing specials | E | now `jail.hinges` / `.keys` / `.ortica` / `.jailer` | — | — | f.dawn (Ginepra, one line each) |
| c3.jail: before the Judge | C | — | the Judge's reply | — | — |
| c3.court: the Judge's cook | A+B | she read for the cook (`client.c3.cook.done`) «[Hai letto per lei]» | `court.cook` | Ginepra's line | the trial (the Judge), f.last |
| c3.court: her card | A | her card is not Il Matto «[La tua carta]» | `court.card` | Ginepra's line | f.dawn (Ginepra), session s3 |
| c3.court: a word to Ginepra | C | — | Ginepra's reply | — | — |
| c3.trial: the candles | A | `tono <= -3` | `trial.candles` | the Exam | f.dawn (Ginepra) |
| c3.trial: never caught out | A | `examsPassed >= 5`, none failed «[Non ti hanno mai colta]» | the Judge's reply | the Exam | — |
| c3.trial: after the verdict (won / lost) | C ×2 | — | the Judge's reply / how they run | the card on the bench | — |
| f.dawn: taking Il Sole | C | — | Ginepra's reply | the card | — |
| f.dawn: the cat on the broom | A | `tartufo: 3` | two lines | — | — |
| f.last: where she sits | C | — | one line | the epilogue | — |
| f.last: thanking the three | A | all three trust her «[Si fidano di te]» | two lines | the last session | — |
| enc.miller: seen from above | A | broom and `lesson.fly` | the miller's reply | — | — |
| enc.miller | E | `client.c2.miller.done`, `mill.read` | — | — | his wife Prudenza at her table; the debt paid |
| enc.guard: the ghost | E | existing option, now `guard.ghost` | — | — | constable bark in chapter 3 |
| enc.guard: back to sleep | A | `power: stun` | `guard.asleep` | the rumour | constable bark in chapter 3 |
| minor.first: where she puts it | C | first time only | her thought | — | — |

## Counts

- A, new special answers: 29, on 21 choices (the eighteen that existed are untouched). Kinds: trait 12 (two traits
  proper twice over, and under the same kind a card she has, her three words, her sign, her card, what happened
  to her), pop 4, magic 4, tartufo 3, broom 3, witch 3.
- B, small real deviations: 11 (c1.deliver coins, c1.cart cat, c1.exam1 Bray, c1.gate advice; c2.ortica flight,
  c2.mill coins, c2.plan the widow's deck; c3.trapdoor light, c3.edera promise, c3.coven Tartufo, c3.court cook).
  All on the main path: 4 in chapter 1, 3 in chapter 2, 4 in chapter 3.
- C, cosmetic choices: 20.
- D, false doors: 8 (bundle, knock, square, deposit door/window, lookout, woodshed, light/water, chains/barrels).
- E, later lines that depend on what she did: 49 conditional lines in the scenes and barks, 6 Reader openers
  (visits.js, once each), 6 lines in the long sessions (s1 2, s2 2, s3 2).
- G, the gesture: 8 (Malva ×4, Ginepra ×2, Ortica, Edera). Upright and she acts: 5. Contrary and she waits: 1
  (L'Appeso, trapdoor refused). Contrary and she goes anyway: 2 (La Luna before the glass -> the coffin;
  La Ruota reversed before the deposit -> the lantern, the bell, the arrest). The meanings are the cards'
  `essenza` in the witch's words.

## Rules I kept

- A fork's special answers set the fork's own flag (`b1.candles` sets `b1.spoke`), so every later line of the
  fork still holds. Fork 1's common lines moved out of the options, under `IF b1.spoke`.
- No choice shows more than six answers (the UI cuts at six): c3.jail was already full, so it got none.
- Choices that can come back (the two refusals, minor.first) are asked the first time only: traits cannot be farmed.
- Refusing coins is never a loss: Tabita's blanket gives trust, Ortica gives back six for four.
- malva.chat keeps exactly its two specials (tests/core.bonds.test.mjs pins them).

## Conditions and actions I wished existed (not invented)

- `{ stars: ['m19', 2] }`, `{ starsMin: [n, 2] }` (n cards known at two stars): "sai leggere il Sole" cannot be
  asked today; I used `readings`, `examsPassed`, `wrote` and `has` instead.
- `{ told: 'm10' }` / `{ toldMin: n }`: cards the Reader has told.
- `{ client: 'c3.cook' }` would read better than the flag `client.c3.cook.done`, and `{ clientsMin: n }`.
- `{ extra: id }` (a thing of the registry done) and `{ treats: n }`.
- An action `{ do: 'treat', n }` (a morsel for Tartufo as a reward) and `{ do: 'pop', n }` (a deed that makes
  the village talk: the candles, the cook).
- Special kinds `card`, `tool`, `born`, `past` with their own default tags: today they all go under `trait` with a
  written tag. The tools (bottle, pendulum) open no answer yet: c3.jail, the natural place, is full.
- A node that asks a card of HER deck at a fork (the first half of "un solo gesto"): the witches' gesture is
  written as lines; hers needs the engine.

## Outside my files (one line each)

- `tests/story.data.test.mjs`: `COND_KEYS` + `wrote` (it exists in core/cond.js); a string `tag` is accepted on
  special answers.
- `tests/story.reader.test.mjs`: `STORY_FLAGS` + the twelve flags the Reader now reads.
