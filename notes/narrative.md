# Narrative notes

Services: `story.run`, `story.session`, `story.say`, `story.choose` (registered in `src/story/index.js`; main.js must import it).

Decisions and gaps to know:
- `exam` sets flag `exam.passed` (true/false) and does NOT move the player to the jail on failure: the script (or
  the world) does `{ if: { flag: 'exam.passed' }, else: [{ do: 'travel', to: 'depths.jail' }] }`. Tell me if the runner should do it.
- `cinema` ignores `pan` (no world camera service exists). Lines wait for a tap, no auto advance.
- `draw` with `pool: 'row'` uses `majorsMissingOfRow(state.chapter)`; weights: 1, +3 your card, +3 birth card.
  `giveCard` / `give` skip the ceremony if the card is already found.
- `teach` / `lesson` set the flag and show a "Hai imparato: ..." banner (names from spreads.js / lessons.js).
- Extra session node (not in the contract): `{ shuffle: true }` (the Reader shuffles the deck). Session text tokens
  also: `{picked}` (card name), `{pickedId}`, `{pickedNumber}`.
- `ask: 'name'` needs at least one character. `ask: 'birth'` skip -> "Va bene. Alcune cose si dicono più tardi.", no setPlayer.
- Candle level comes from the id `s0..s4`; the cards pinned on the wall come from `foundIds()` at session start.
- The session bypasses the run queue (a script may call `{ do: 'session' }` from inside a run).
- Harness: `/harness/story.html?view=dialogue|cinema|session&id=s0..s4|portraits` (needs `<base href="/">`, so open it through Vite).
