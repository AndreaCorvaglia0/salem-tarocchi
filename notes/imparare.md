# Imparare meglio, con poco (BACKLOG sezione 2)

Quattro ritocchi piccoli, nell'ordine del BACKLOG. Ognuno serve un obiettivo che oggi nessuna meccanica
verifica (il campo `aperto` degli obiettivi e `lore/meccaniche/_matrice.md`). Regole per tutti: mai la
risposta prima del tentativo (`la-domanda-non-mostra-la-risposta`), mai un passo in più che pesi
(`mai-assillare`), schermate corte su 390 px, salvataggi vecchi che funzionano.

## 2.1 Le sue tre parole tornano nel ripasso

**Che cosa vede.** In un ripasso, una delle domande non mostra nessuna carta: «Le tue parole erano:» e sotto,
con la sua calligrafia, le tre parole che lei ha scritto quando l'ha trovata («cane · rupe · coraggio»), poi
«Che carta è?» e tre nomi. Dopo la risposta compare la carta piccola con il nome e l'idea. Una domanda così
per ripasso al massimo, e solo per una carta di cui ha scritto almeno una parola che non contiene già il
nome (se ha scritto «matto» per Il Matto, quella carta non si chiede così).
**Perché aiuta.** Le parole le ha generate lei (`lore/tecniche/effetto-generazione.md`: oggi si generano
una volta e non tornano) e qui diventano l'indizio per un richiamo (`pratica-di-recupero.md`). Serve
[[dire-l-idea-della-carta]]: se le sue parole la riportano alla carta, l'idea l'aveva detta con parole sue.
**Codice.** `src/systems/review.rules.js` (nuovo, puro): `wordsCard` sceglie la carta (prima le scadute) e
`wordsQuestion` costruisce la domanda (nomi della stessa serie come alternative, prima quelli che possiede).
`review.js` la mette al posto di una domanda sulla stessa carta; `qview.js` sa mostrare le parole.
Stella e ripasso come la domanda «Quale carta dice…?» (`answer(id, ok, 'image')`).
**Come lo vede un test.** `tests/review.words.test.mjs`: la domanda ha le parole e una sola risposta
giusta; nessuna opzione né parola contiene il nome; una carta senza parole o con il nome tra le parole non
viene scelta; le scadute vengono prima.

## 2.2 La carta di oggi entra nel ripasso

**Che cosa vede.** Quasi niente di nuovo, ed è voluto: un giorno su tre la carta di oggi è una delle sue
carte da ripassare, e la domanda «Senza guardare» conta come una risposta del ripasso (una volta al giorno;
se riapre la carta, può rispondere di nuovo ma non conta due volte).
**Perché aiuta.** La carta di oggi è il gesto che lei fa ogni giorno: se ogni tanto è una carta che sta
dimenticando, il ripasso distanziato lo fa senza che sembri un compito (`ripetizione-distanziata.md`);
la domanda sul disegno è un richiamo vero (`pratica-di-recupero.md`). Serve [[ricordare-i-dettagli]], il
cui `aperto` dice proprio che la risposta della carta di oggi non entra nel ripasso.
**Codice.** `dayOf` in `src/glue/threshold.rules.js` riceve le carte scadute e, un giorno su tre (dal
seme della data), sceglie tra quelle. `src/glue/threshold.js` le passa e offre `answerToday(ok)`, che chiama
`answer(id, ok, 'image')` se la carta è sua e non l'ha già fatto oggi (`state.dayAsked`, chiave
nuova). `src/ui/daycard.js` la chiama al tocco della risposta.
**Come lo vede un test.** `tests/threshold.test.mjs`: su molte date, circa un giorno su tre la carta viene
dalle scadute, e senza scadute la carta è la stessa di prima; `answerToday` sposta la scadenza una volta
sola al giorno e non tocca una carta che non ha.

## 2.3 «Prova tu prima» nella lettura per sé

**Che cosa vede.** Dopo aver pescato (qui o col mazzo di casa), per ogni carta: la carta, il posto («Il
passato»), il nome, e «Prima di leggere: che idea porta questa carta?» con tre idee. Tocca, vede quale
era, va avanti. In basso c'è sempre «Leggo e basta», che salta i tentativi di quella lettura. Poi la
lettura intera come oggi, con una riga in testa: «Prima di leggere ne avevi indovinate 2 su 3.»
**Perché aiuta.** È il gesto che farà col mazzo vero: guardare e dire che cosa le dice, prima del libro
(`difficolta-desiderabile.md`: provare prima di sapere aiuta se la risposta arriva subito dopo;
`pratica-di-recupero.md`; `trasferimento-con-la-pratica.md`). Serve [[leggere-il-proprio-mazzo]], che oggi
«non si verifica»: d'ora in poi il diario tiene quante ne ha lette da sola.
**Codice.** `src/glue/selfread.rules.js`: `tryOptions` (le tre idee, dal motore: `recall`; mai l'idea di un'altra carta della stessa lettura, che
sarebbe la risposta un attimo dopo) e `tryScore`;
`makeEntry` accetta `tried` ([true, false, null…], tenuto solo se c'è almeno un tentativo).
`src/ui/selfread.js`: il passo nuovo tra le carte e la lettura. La risposta conta per il ripasso delle
carte che possiede (`answer(id, ok, 'meaning')`, come nelle letture ai clienti).
**Come lo vede un test.** `tests/selfread.test.mjs`: tre opzioni, una giusta che è l'essenza di quella
carta in quel verso; `tried` salvato e contato; una lettura senza tentativi ha la forma di prima.

## 2.4 La Lettrice chiede prima di raccontare

**Che cosa vede.** In una visita, dopo l'apertura e prima di girare le carte nuove: «Prima di girarle,
dimmi una cosa: ti ricordi che cosa ti avevo detto del Carro?» e tre frasi tra virgolette. Poi lei
risponde: «Sì, è proprio quello che ti avevo detto. Mi fa piacere che ti sia rimasto.» oppure, in due righe,
«No, questa è l'idea di un'altra carta, ma all'inizio succede di confonderle.» / «Del Carro ti avevo detto, in
poche parole: «Vinci tenendo insieme ciò che tira in direzioni opposte.»» (l'idea è la riga breve della
scheda, non le parole esatte di quella sera: per questo «in poche parole»). Una sola domanda per visita, e solo su una carta che la Lettrice le ha già raccontato.
**Perché aiuta.** Richiamo dentro la scena più amata (`pratica-di-recupero.md`, `storia-ed-emozione.md`),
con il riscontro della voce che gliel'aveva detto (`riscontro-immediato.md`). Serve
[[dire-l-idea-della-carta]] dal lato di [[farsi-leggere-dalla-lettrice]], il cui `aperto` dice che la
Lettrice racconta e basta.
**Codice.** `src/story/visit.plan.js`: `pickRecall` sceglie la carta (raccontata, sua, non in questa
visita; prima le scadute, poi quella chiesta meno volte: `state.recalled`, chiave nuova) e compone domanda,
tre frasi (l'idea della carta e due di altre carte, mai le confondibili) e le due risposte.
`src/story/visit.js` la fa dire e chiama `answer(id, ok, 'meaning')`.
**Come lo vede un test.** `tests/story.visit.test.mjs`: nessuna domanda senza carte raccontate; mai una
carta della visita; una sola frase giusta, senza il nome; a parità la carta chiesta meno; le scadute prima.

## Dopo la costruzione (18 novembre)

Fatto tutto come sopra, con tre correzioni nate dalle schermate: le idee delle altre carte della stessa
lettura non fanno da alternative in «Prova tu prima»; la risposta sbagliata della Lettrice è in due righe
(una sola non stava nella didascalia); la chiave della carta di oggi è `state.dayAsked` (in cima al salvataggio,
così in `state.js` si aggiungono solo righe). Schermate: `/home/claude/shots/imparare/`.
