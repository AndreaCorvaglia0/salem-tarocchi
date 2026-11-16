# Reading engine on screen (client readings)

Files: `src/systems/consult.js` (the screens), `src/systems/consult.rules.js` (pure rules), the hand-over in
`src/systems/reading.js`, tags and reaction lines in `src/data/story/clients.js`, tests in
`tests/play.consult.test.mjs`.

## Flow
1. `reading.open` as before: hello, draw (fan for the first card, top of the deck for the others), the table.
2. If `engineFor()` says yes, `consult()` takes over the same screen; otherwise the old flow runs, unchanged.
   - Yes when: a client (not `self`), tagged question (`questionOf`), and the owned cards with a voice
     (`hasVoice`) are at least as many as the positions; every card the story gives must have a voice too.
   - The draw pool is then only the owned voiced cards. Nothing is hard-coded: new voice files count at once.
3. Header for the whole reading: client name (small) and the question (2 lines max, clamped).
4. Per card: «Che idea porta questa carta?» (`recall`), then «E qui, per questa domanda, che cosa vuol dire?»
   (`alternatives`) with the essenza in hand font as the anchor. Right: gold + «Sì, è questa.» in the foot;
   wrong: her choice in dark red, the right one gold. «Avanti» to go on, no retry.
   Options come from the owned voiced cards; when that gives fewer than three, from every voiced card.
   «Ricordamela»: a paper note (Major: three book words + `says`; Minor: number × suit from grid.js); counts `helped`.
5. Summary (scrolls): mini card (rotated + «rovesciata» if reversed), essenza, the `sayStep` sentence; from 3 cards
   «Colpo d'occhio» with `say(plan).scan` if any; from 2 cards «Quindi, che cosa rispondi?» (`verdictChoices`).
   A single card has no final question: «Avanti».
6. «Come glielo dici?» Con garbo (`tono +1`, gentile) / Senza giri di parole (`tono -1`, pungente), via `addTrait`.
   Above it, the answer she is about to give (the right closing, or the single card's sentence).
7. Reaction: blunt line first if «Senza giri di parole», then `thanks` (good) or a doubtful line; «N su M»; coins.

## Result
`{ ok, wrong, total, helped, level, levelOk, tone, cards, score, coins }`
- `ok`: good reading = final level right (or single card) and `wrong * 3 <= total`.
- `total` = 2 per card + 1 for the final level (spreads of 2+ cards). `level` = the plan's right level
  (bene|dipende|male); `levelOk` = whether she chose it. `tone`: 'garbo' | 'diretta'.
  `cards`: `[{ card, rev, pos, idea, meaning }]`. `score`, `coins` kept for old consumers.
- Pay: full `pay` when good, else `floor(pay/2)` (min 1 when pay > 0). The old bonuses (owned Majors,
  "la tua carta", day card) do not apply in the engine flow.
- XP: `xpFor(score)` as before; `stat('readings')`; each card gets `answer(id, idea && meaning, 'meaning')` (stars, review).

## Reversed
Only when `state.flags['lesson.reversed']` (or `state.lessons.reversed`) is set: each card's `rev` comes from
`drawCards('single', { pool: [id], reversals: true })` (the engine's 30%), options use `verso: true`.
The fan in draw.js still reveals the card upright; the table, the question screens and the summary show it rotated.

## Decisions not in the brief
- `self` (the finale) keeps the old flow: no question, ten given cards, pay 0.
- The question header is not shown over the draw screens (they are separate overlays).
- The question line may take two lines on a phone (clamped), not strictly one.
- Popularity still uses `result.wrong`, but a reading now has 3 (single card: 2) to 7+ questions, so the
  thresholds in `core/bonds.js popForReading` (0 wrong: +2, up to 2: +1) are harder than before. Lead to decide.
- Malva's tutorial (pay 0) uses the new flow as soon as she owns one voiced card; the first-reading hint
  («Per ogni carta, scegli la frase…») is still shown by glue/hints.js and still fits.
- The bot (`scripts/playthrough.mjs`): scrolls an off-screen option into view before tapping. Tone options
  carry `data-ok="1"` both, so it picks either.

## Tags given to the clients
| client | ambito | forma | ref.di |
|---|---|---|---|
| c0.malva | lavoro | sino | del bambino dei Proctor |
| c1.widow | lavoro | scelta | del campo |
| c1.baker | amore | sino | di tua moglie |
| c1.mercy | se | perche | della porta che sogni |
| c1.sailor | se | quadro | della partenza |
| c2.miller | lavoro | perche | del mulino |
| c2.twins | casa | andra | dell'eredità |
| c2.hunter | se | quadro | della tua vita nel bosco |
| c2.mother | casa | sino | di tuo figlio |
| c3.clerk | se | scelta | di quello che hai visto |
| c3.cook | lavoro | sino | dell'aumento |
| c3.corey | se | quadro | di quello che vogliono farti confessare |
| c3.shadowless | se | sino | (none) |
| self | se | quadro | (none) |
