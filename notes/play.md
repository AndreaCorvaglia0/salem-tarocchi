# Play area (src/systems): notes

Services registered in `src/systems/index.js`: `exam.start`, `exam.recover`, `lock.ask`, `draw.pick`, `reading.open`,
`reading.free`, `review.open`. All DOM, phone first, serif voice. Pure rules: `exam.rules.js`, `draw.rules.js`,
`reading.rules.js` (tests: `tests/play.*.test.mjs`). Harness: `harness/play.html?view=...` (see `harness/play.js`).

## Choices to know about (contract gaps, worked around)
- Tools (`pendulum`, `incense`) have no mutator in `core/progress.js`: the Exam does `state.tools[id] -= 1; save()` itself.
- Exam: the right-answer relief (-10) applies to all three kinds; the judge uses +25 per mistake. A failed judge Exam has no
  consequences at all (no `examsFailed`, no `jailed`, no confiscation): the story decides.
- Mercy and Malva's help both turn a mistake into "costs nothing"; Malva is used automatically on the first real mistake.
- Ortica's skip shortens the Exam (the question is not asked, not counted right or wrong).
- `reading.open({ script })`: accepted and ignored. I did not know what it should do. Tell me if the story needs a hook.
- `reading.open` when she owns fewer Majors than positions: the pool is completed with Majors she does not own (so a reading never blocks).
- The finale (`client: 'self'`): no coins; entries 'fan' / 'number' in `cards` are drawn, other ids are given. Hello line is the Reader's.
- `exam.recover` returns `{ recovered, kept }` (the contract says void). `reading.free({ all: true })` shows the three spreads
  even if not taught (study mode); with none taught it shows all.
- `review.open` calls `answer(id, ok, 'image')` only: self-reported "La sapevo" lifts at most the first star; the other two
  stars are earned by real questions.
- Options of questions with `card` render as image tiles ("which"); in the guided reading the alternatives are text only.
- Number drawing: the range is max(22, pool size); the number picks a place on the weighted pool laid on a line (deterministic).
- Fonts: IM Fell English draws "1" like "I": counters and numbers use Georgia (`.sx-num`).
- The card back is an inline SVG (`cardback.js`), the flip respects `reducedMotion()`.
