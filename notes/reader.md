# Reader: the one path, the data, the needs

Files: `src/data/story/sessions.js` (five sessions, `PICKED`), `src/data/story/visits.js` (`TALK`, `OPENERS`,
`THREAD`, `RITUALS`, `CLOSERS`), `src/data/portrait.js` (`ADJ`, `SIGNATURES`, `LIKE`, `VERDICTS`, `PORTRAIT`,
`PAIRS`, `SEEDS`), `src/data/story/hints.js`, `src/data/lessons.js`, three gists in `src/data/cards/minors.js`.
Test: `tests/story.reader.test.mjs`.

## The path, encounter by encounter

One portrait built over all the meetings. In s0 she forms a hypothesis; every later meeting tests it, says
"lo penso ancora" or "ho cambiato idea" with the reason, and records it (`{ do: 'verdict' }`). Each meeting
recalls one earlier answer and sets it against something that happened since, and has one small ritual of its own.
Visits are not addressed by number: THREAD and RITUALS are queues (each entry is said once, flag `rd.<id>`,
inside its chapter), so the order holds whether a chapter has one visit or two.

| # | Meeting | What it is for | What it recalls | Its ritual | What it leaves for later |
|---|---|---|---|---|---|
| 0 | s0 prologue | the hypothesis: sign -> birth card -> "ti vedo più vicina a..." | nothing yet | the candle, the Fool turned for her (her first significator) | `s0.knock/window`, `s0.wait/leave/enter/back`, `s0.believes/doubts`; the first verdict |
| 1 | visit, village | "faccio caso a come entri nei posti" | the door answer against how she moves (`esplora`) | the element of her sign | the verdict, confirmed or corrected |
| 2 | visit, village | the first proofs | the second door answer against exams, readings | two cards read as a pair | |
| 3 | s1 values | what matters: a free evening, with whom, doing what | the door against fork 1 (the square), 4 cases | the quality of the sign (cardinale, fisso, mobile); a number drawn thinking of the square | `leaf.value.*`, word `value` |
| 4 | visit, forest | does she live by her word? | the value word against the constable's lie, Ginepra, Ortica's lesson | the planet that rules her sign and its card | |
| 5 | visit, forest | was the square an exception? | fork 1 against `rischio` since then | the weekday she was born and its planet (needs the year), else a pair | |
| 6 | s2 fears | small everyday fears: a noise, a silence | this session's leaf against fork 2 (the deposit); the s1 answer inside the "empty house" leaf | the moon of her birth night; a number drawn thinking of that night | `leaf.fear.*`, word `fear` |
| 7 | visit, depths | a fear that slows and does not stop | the fear word against the descent, Ginepra's absence | pairs of dark and light (Torre/Stella, Amanti/Diavolo) | |
| 8 | visit, depths | the notebook read back | value and fear words together: "ne manca ancora una" | a pair, or an image that returns in three cards | the dream |
| 9 | s3 dreams | what she wants after all this | the door against fork 3 (cellars or open court), 4 cases | she chooses the number herself: by now she knows the cards | `leaf.dream.*`, word `dream`; "il tavolo sarà cambiato" |
| 10 | s4 finale | she gives everything back | the door, the three words, believes/doubts ("non ti ho mai detto come sarebbe finita") | the significator at the centre, the deck handed over, the Celtic cross, the portrait, Il Mondo | the empty chair |

Local colour (the lighter remark on the last stretch) is the OPENERS list: a trait that turned over, news (first
night in the cell, a stunned constable, the broom), a trait pulled both ways, two traits together, a trait that
holds, then stats and trust, then the chapter.

Rules I kept: a trait is named only when marked (>= 3); a change only with `turned` (openers) or `trend >= 2`
(the reason of a changed verdict, worded as an impression: "ti ho vista più..."); every fact line has the
condition that makes it true; nothing explains the game; fears are small and gentle (a noise, a silence, an
empty house, being caught unprepared).

## Signatures (one line per card)

- m00 Matto: esplora +2, rischio +2, guida +1: leaves gladly, looks at everything, trusts.
- m01 Mago: parola +2, esplora +2, guida -1: Mercury: the ready word, curiosity, a quick head (Ortica).
- m02 Sacerdotessa: parola -2, guida +2, rischio -1: feels much, says little, waits.
- m03 Imperatrice: tono +2, guida +2: kind and warm-hearted (given by DESIGN).
- m04 Imperatore: esplora -2, guida -2, parola +1: reasons, goes straight, says it once.
- m05 Papa: rischio -2, esplora -2, tono +1: the beaten road, no detours, a kind teacher.
- m06 Amanti: guida +2, parola +2: chooses with the heart and says so openly.
- m07 Carro: rischio +2, esplora -2: bold and straight to the goal (given by DESIGN).
- m08 Forza: tono +2, rischio +2: gentle courage.
- m09 Eremita: esplora +2, parola -2, guida -1: looks much, speaks little, thinks it through (DESIGN: accorta e curiosa).
- m10 Ruota: rischio +2, parola -2: plays her hand when the chance passes, cards covered.
- m11 Giustizia: parola +2, guida -2, tono -1: lucid, says the uncomfortable truth.
- m12 Appeso: rischio -2, esplora +2: in no hurry to jump, looks from every side.
- m13 Morte: parola +2, esplora -2, tono -1: plain, essential, closes what is over.
- m14 Temperanza: tono +2, rischio -2, parola -1: measure in everything.
- m15 Diavolo: tono -2, guida +2, rischio +1: strong desires, a sharp tongue.
- m16 Torre: tono -2, parola +2, rischio +1: truths that make noise, pulls down what does not hold.
- m17 Stella: tono +2, esplora +2, rischio -1: kind, open-eyed, calm.
- m18 Luna: guida +2, rischio -2: follows what she feels, goes carefully in the dark.
- m19 Sole: parola +2, tono +2, rischio +1: says things plainly and with a smile.
- m20 Giudizio: rischio +2, guida +2, esplora -1: answers the call with the heart, at once.
- m21 Mondo: esplora +2, guida -2: wanted to see everything, then put it in order.

Checked by simulation (200,000 random trait vectors, the same dot-product rule as `cardScores`): every card wins
between 3.1% and 6.8% of the time; no two signatures are closer than 45 degrees. `LIKE[id]` says the same
character in words and is spoken after every verdict, so the reason is true whatever the card is.
`ADJ.guida` is "tutta cuore" / "tutta testa" (they read well after "Sei" and under the card in the grimoire).

## Data shapes beyond the contract (the systems agent has already built these)

- `visits.js`: `THREAD`, `RITUALS` next to `OPENERS`, `CLOSERS`; every entry `{ when, t, then? }`.
- `sessions.js`: `{ pick: 'number', read: PICKED, then }`: `PICKED[cardId]` is her short reading of the card.
- `portrait.js`: `PORTRAIT[axis].torn`, `PAIRS = [{ when, t }]`, `SEEDS = { w, c, s, p }`, `LIKE`, `VERDICTS`.
- Flags I set: `s0.knock` `s0.window` `s0.wait` `s0.leave` `s0.enter` `s0.back` `s0.believes` `s0.doubts`,
  `leaf.value.{m19,m11,m01,m00}` (allegria, sincerità, imparare, libertà), `leaf.fear.{m18,m16,m06,m09}` (il dubbio,
  l'imprevisto, il silenzio di qualcuno, la casa vuota), `leaf.dream.{m07,m14,m02,m03}` (partire, un viaggio in due,
  una casa piena di libri, un giardino), and `rd.*` (a remark already made). The twelve leaf cards are all different.
- Flags and stats I read from others: `b1.spoke/hid`, `b2.went/stayed`, `b3.stealth/open`, `lied.constable`,
  `trial.won/lost`; stats `exams`, `examsPassed`, `examsFailed`, `jailed`, `stuns`, `fires`, `readings`, `locks`;
  `trust`; `power: 'broom'`; `spread: 'ppf'`. My lines assume what the scenes say today: in the square she hides
  "nell'ombra del portico"; fork 2 is "il deposito del tribunale" and they run away afterwards; fork 3 is the
  cellars or the open court; Ginepra is always brought out. If a scene changes one of these, the matching line
  in s1/s2/s3 or THREAD must follow.

## For the systems agent / the lead

- `HINTS` has extra ids nobody emits yet: `tap` (first line of s0), `detail` and `words` (the found-card
  ceremony), `number` (the pad), `guide` (the step slip, from chapter 2), `patrol`. `HINTS_KEYS` holds the keyboard wording.
- A card's `words` line is said only if she wrote at least one word (the visit player does this). In the
  sessions the `{words:id}` lines are guarded only by `{ has: id }`: with no words she would read "...".
  A condition `{ wrote: id }` would close that gap.
- `PAIRS`: the player says the first two that hold; they are written to follow each other.
- No stat exists for places seen or time taken, so no line claims them; "hai girato mezza Salem" is said only
  when `esplora` is steady and rose since the last meeting.
- "The card at the bottom of the deck", a real cut of the deck and "the suit that returns" among the Minors
  would need a real random card or a count from the systems; I left them out instead of faking them. "The
  image that returns" is done with `has` conditions (three figures between pillars, three angels).
- `visits.js` is 460 lines and `sessions.js` 425 (TALK alone is 22 cards); I may not create files, so they
  are over the 400 guideline.

## For the scene writer

- The Reader mentions Malva, Ortica, Edera, Ginepra and Tartufo only by character (Malva never thanks, Ortica
  talks, Edera forgets names, Ginepra laughs at the wrong moment). Nothing in my files quotes a scene line.
- s1 ends "oltre il cancello comincia il bosco"; s2 ends "sotto il villaggio c'è una persona che ti aspetta";
  s3 ends "troverai il tavolo un po' cambiato"; s4 gives m21 itself and ends on `{ tableau: 'last' }`.

## Verified, and not

- `node --test tests/story.reader.test.mjs`: 16 pass (shapes, conditions, tokens, flags read are set, signatures,
  lengths, the mechanical prose rules on every text of mine including `details`, `PICKED`, `LIKE`, hints and
  lesson pages, and the five sessions played in a row with the real runner on three answer patterns: with
  birth date, without the year, without any date).
- `node scripts/prose.mjs`: 0 faults in sessions, visits, portrait, hints, lessons.
- Read through as she will read them: s0-s4 printed in order for sample states, and six composed visits.
- Not verified: the screens (no screenshot taken by me), a real phone, how long a session takes with real
  taps (counted: 18-22 lines per session), the tarot lore against the owner's book (written from the
  Rider-Waite-Smith tradition and the sheets in `src/data/cards/`).
- `npm test` at the time of writing: 210 tests, all pass (an earlier run failed in `tests/story.path.test.mjs`,
  "stuck at c3.trapdoor": the trapdoor asked for level 7 and the simulated walk had level 6; not from my data,
  and it passes now).
