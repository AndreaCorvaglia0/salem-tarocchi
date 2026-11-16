# Reading engine: how to call it

Pure functions in `src/reading/` (import from `src/reading/index.js`). Voices live in `src/data/reading/voices/`;
after adding a voice file run `node scripts/readings.mjs --registry`. Tests may call `useStubs(true)`.

```js
const q = makeQuestion({ ambito: 'lavoro', forma: 'scelta', ref: { di: 'del campo' } }); // from walk(TREE, answers)
const cards = drawCards('ppf', { rng, pool: ownedIdsWithVoice });  // [{ pos, card, rev }], or build it from real cards
const p = plan(q, 'ppf', cards);       // steps (role, favore, moto, link), scan findings, verdict { score, code }
const r = say(p, { rng });             // { opening, scan[], parts[{pos,text,...}], closing, full, missing[] }
const one = sayStep(p, i, { rng, used }); // one position at a time; share `used` (a Set) so lead-ins do not repeat
const opts = alternatives(p, i, { rng }); // [{ text, ok, why }] shuffled, why: verso|ruolo|ambito|carta
const fin = verdictChoices(p, { rng });   // [{ text, ok, code }] closing options for the final answer
```
- A part with `text: null` has no voice line: it is also listed in `r.missing`. Nothing is invented.
- `seeded(n)` gives a reproducible rng. Every function accepts `rng` (default Math.random).
- `scan` needs the question (for the suit foreign to the field); `plan` already calls it.
- Tools: `node scripts/readings.mjs --sample 6 --spread ppf --seed 7`, `--lint`, `--stats 1000`, `--registry`.

Decisions beyond the design:
- The tree is two halves (field, then form), up to 3 taps each: 30 leaves cannot fit in 3 taps.
- Links: apre, contrasto (sign flips), svolta (before the last arrivo), seguito (plain). No causal link: the cards do not assert one.
- `courts` needs at least 2 court cards; `dominant` needs a single leading suit; stubs are ids `_a _b _c`.
- Lead-ins for `ostacolo` end with a comma or colon (its sentences start with many different verbs).
- `say(plan, { opening: 'auto'|'always'|'never', usedClosings })`: the opening exists only with `ref.di`; the glance comes after the card
  sentences; for `fare` and `scelta` an `advice` (consiglio of the last card) follows the closing. Pass one shared Set as
  `usedClosings` across calls so two consecutive closings differ. A lead-in is dropped if it shares a 5+ letter word with its sentence.
