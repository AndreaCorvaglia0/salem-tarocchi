# Missions on the map: the naive-tester kit (round 1, ready to run)

Status: NOT RUN. The prototype agent had no Agent tool (it was a child session at the maximum spawn
depth), and did not work around that with the `claude` CLI. Whoever has the Agent tool runs this kit.
The answer keys below were written before any tester saw any image.

## Images

`/home/claude/shots/missions-design/round1/` (tall shots: the whole Mappa page in one image, 390 px wide):
`<V>-s<N>.png` for V in A, B, C and N in 1, 2, 3, 4, 6; state 5 is a pair, `<V>-s5a-before.png` (the page)
then `<V>-s5b-after-tap.png` (phone height, after tapping the candle slip of «La scommessa di Ginepra»; for C,
after tapping the pencil tag «✎ 1», which is what today's page does). `A-s3-nolegend.png`: A without the
legend line, for a later one-change test. Phone-height copies (what the first screen shows) in `../phone/`.

Before giving an image to a tester, copy it to a neutral name (`cp A-s3.png /tmp/mt/q7.png`): file names
say the variant. Regenerate any image with the harness: `npx vite --port 5191`, then
`OUT=<png> TALL=1 [TAP=1] node scripts/shot.mjs 'http://localhost:5191/harness/missions.html?v=A&s=3' /tmp/x.png --phone --until domcontentloaded --steps <steps>`
(the steps file used is copied in `notes/missions-test/shot.steps.mjs`).

## Protocol

- One fresh agent per tester, model haiku, one or two at a time, never more.
- It gets ONLY the image path(s) and the prompt below. No game name, no variant name, no other image.
- 5 testers per variant per state for states 2, 3, 5, 6; 3 per variant for states 1 and 4.
- Record every answer verbatim in `notes/missions-test/round-<n>.md` (one file per round) with the
  score per question: `ok` / `no` / `?` (unsure, «non so», or two answers of which one is right).
- Pass mark: at least 9 answers in 10 `ok` on the key questions (marked ★) in states 2, 3, 5, 6.
- After a round: for each `no`, write why (wording, symbol, position, too much on screen), change ONE thing,
  re-test only the affected questions with fresh testers.

## The prompt (Italian; the same for every tester, only the questions change)

> Sei una persona che non ha mai visto questo gioco per telefono. Guarda l'immagine `<path>` (usa lo
> strumento per leggere i file) [e poi l'immagine `<path2>`, che è la schermata dopo aver toccato una cosa
> nella prima]. È la pagina «Mappa» di un quaderno nel gioco. Rispondi alle domande numerate, una o due righe
> ciascuna, in italiano. Rispondi solo da quello che vedi; se non lo sai scrivi «non so». Non descrivere lo
> stile e non dare consigli, tranne all'ultima domanda.
> <questions>

## Questions and answer keys

Places and texts are those the harness draws (harness/missions.js STATES). «Foglietto» is the word used in
the questions for the paper slips of A/B; for C say «il segno a matita ✎ con il numero».

### State 1 (early: one main mission, one optional) — 3 testers per variant
1. Che cosa devi fare adesso per andare avanti nella storia? — KEY: vedere cosa luccica sotto il carretto, al mercato.
2. Ci sono altre cose che puoi fare? Quante e dove? — KEY: 1, alla casa delle riunioni (villaggio).
3. Dove sei tu? — KEY: in piazza, nel villaggio (la croce «io»).
4. Che cosa non ti è chiaro in questa schermata? — open.

### State 2 (mid: main + 4 optional in two regions, one followed) — 5 per variant
1. ★ Che cosa devi fare adesso per andare avanti nella storia? — KEY: portare l'unguento di Ortica al mugnaio, al mulino (bosco). ok if mulino or mugnaio.
2. ★ Quante altre cose puoi fare, oltre alla storia, e dove? — KEY: 4: casa di Malva e casa delle riunioni (villaggio), capanna di Ortica e la tana (bosco). ok if 4 and at least the two regions right.
3. ★ Quale stai seguendo ora? — KEY: «La Bibbia grande», alla casa delle riunioni (C: la lavandaia e la Bibbia).
4. Dove sei tu? — KEY: in piazza, nel villaggio.
5. ★ Che cosa significa il cerchio rosso? — KEY: il posto della cosa che sto seguendo / dove devo andare per quella.
6. ★ (A/B) Che cosa sono i foglietti appuntati sulla mappa, e che cosa succede se ne tocchi uno? — KEY: cose in più (facoltative) in quel posto; toccandolo si legge di che cosa si tratta. (C) Che cosa significa il segno a matita ✎ con il numero? — KEY: una missione in più in quel posto, la stessa dell'elenco con quel numero.
7. Che cosa non ti è chiaro? — open.

### State 3 (crowded: main + 8 optional, three in one place, one just done, six done before) — 5 per variant
1. ★ Che cosa devi fare adesso per andare avanti nella storia? — KEY: raggiungere il bivacco di Ginepra, nel bosco.
2. ★ Quante altre cose puoi fare, oltre alla storia? — KEY: 8 (4 nel villaggio, 4 nel bosco). ok if 8.
3. ★ In quale posto ce ne sono di più, e quante? — KEY: la capanna di Ortica, 3.
4. ★ C'è qualcosa che hai già finito? Quante? — KEY: sì, 7 (6 di prima + «Il salice dello stagno» appena fatta). ok if 7; «6» or «1» = no.
5. ★ Quale stai seguendo ora? — KEY: la storia (il bivacco).
6. Dove sei tu? — KEY: al cancello del bosco, nel bosco.
7. Che cosa non ti è chiaro? — open.

### State 4 (nothing optional) — 3 per variant
1. Che cosa devi fare per andare avanti nella storia? — KEY: portare l'unguento al mugnaio, al mulino.
2. Ci sono altre cose da fare, oltre alla storia? — KEY: no.
3. Che cosa non ti è chiaro? — open.

### State 5 (two images: the page, then the screen after a tap) — 5 per variant
A/B: the tap was on the candle slip by «la tana» (bosco). C: the tap was on «✎ 1».
1. ★ Che cosa hai toccato nella prima immagine, e che cosa ti mostra la seconda? — KEY A/B: una cosa in più, una prova, «La scommessa di Ginepra». KEY C: il segno ✎ 1 ti porta alla riga della missione nell'elenco (la lavandaia, la Bibbia).
2. ★ Chi te ne ha parlato? — KEY A/B: Ginepra. C: la lavandaia.
3. ★ Dove si fa? — KEY A/B: la tana, nel bosco. C: la Bibbia grande, nella casa delle riunioni.
4. ★ Che cosa ci guadagni? — KEY A/B: esperienza e monete, forse un ricordo. C: una carta.
5. ★ (A/B) Che cosa succede se tocchi «Seguila»? — KEY: diventa quella che seguo: il cerchio rosso va alla tana (smetto di seguire la Bibbia grande). (C) Che cosa succede se tocchi la riga? — KEY: la seguo, il cerchio rosso va lì.
6. La stai già seguendo? — KEY: no (sto seguendo «La Bibbia grande»; in C: «la sto seguendo» è sulla riga 1).
7. Che cosa non ti è chiaro? — open.

### State 6 (she follows an optional one; the story must be findable) — 5 per variant
1. ★ Che cosa stai seguendo ora? — KEY: «La scommessa di Ginepra», alla tana (bosco).
2. ★ Che cosa devi fare per andare avanti nella storia, e dove? — KEY: (trovare ancora 11 carte, poi) raggiungere Ginepra davanti al tribunale, nel villaggio. ok if tribunale.
3. ★ Come fai a tornare a seguire la storia? — KEY A/B: tocco il riquadro «La storia: tocca per tornare a seguirla» (o la stella). C: tocco la riga «la storia: tocca per tornare a seguirla».
4. Dove sei tu? — KEY: nel bosco, vicino al bivacco.
5. (A/B) Che cosa significa la stella? — KEY: la storia (dove si va avanti nella storia).
6. Che cosa non ti è chiaro? — open.

### Distinguishable marks (winner only, state 3 image) — 5 testers
1. Elenca tutti i foglietti appuntati sulla mappa del bosco e, per ognuno, il posto accanto a cui si trova. — KEY (A-s3): capanna di Ortica ×3 (libro, libro, germoglio), la tana (candela), il bivacco (stella, bordo rosso), lo stagno (spunta, sbiadito).
2. Quali disegni sono posti del bosco e quali sono foglietti? Fai due esempi per tipo. — KEY: posti = disegni a inchiostro con il nome (il mulino, lo stagno...); foglietti = quadratini di carta con la puntina.
3. Dov'è la croce rossa con «io», e dove il cerchio rosso? — KEY: croce al cancello del bosco; cerchio al bivacco.

## Score sheet (fill per round)

| variant | state | Q | ok | no | ? |
|---|---|---|---|---|---|
