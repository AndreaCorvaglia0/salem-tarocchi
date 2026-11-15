# Agents

Read `docs/DESIGN.md` (what the game is, in Italian) and `docs/CONTRACT.md` (how the parts fit) before
anything else. Then only work inside the folders of your area.

- The lead session owns `src/core/`, `src/main.js`, the docs, git. Agents never run git.
- Player-facing text is Italian, warm, short, never mocking. Code and comments are English.
- Phone first (390x844, touch). Always clear what to do next.
- The reference for craft is Mnemopolis, cloned read-only at `/home/claude/mnemopolis` (engine in `engine/src`).
  Read what helps (notebook: `mechanics/story/notebook.js`, `paint.js`; cinema: `mechanics/story/cinema.js`;
  duel screen: `mechanics/duel/`; locks: `mechanics/riddles/`; walking and taps: `systems/walker.js`,
  `systems/tapnav.js`; pixel helpers: `art/px.js`, `art/palette.js`; sound: `systems/sound/`). Copy and adapt
  freely into your own folder; do not import from it.
- Say what you verified and what you did not. Nobody can test a real phone or listen to audio here.
