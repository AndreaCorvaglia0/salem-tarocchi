# Missioni sulla mappa (stato: A provata al giro 1, corretta, messa nel gioco come pagina Mappa)

## In breve

- Ho costruito tre pagine Mappa vere, con il motore della mappa e i dati veri: **A** (solo mappa), **B** (mappa
  e un taccuino breve sotto ogni regione), **C** (la pagina di oggi). Ognuna nei sei stati richiesti.
- **Non ho potuto fare i test con i lettori ingenui**: questo agente non ha lo strumento per lanciare altri
  agenti (era già al limite di profondità) e non l'ho aggirato. Il kit è pronto con le chiavi di risposta
  scritte prima: `notes/missions-test/kit.md`. Quindi **nessun vincitore** ancora e nessuna tabella di
  punteggi: sotto c'è la tabella vuota da riempire.
- Candidato da battere: **A**, perché è la più semplice. B serve se i lettori sbagliano «quante e dove» in A.

## Come funziona A (e B)

- Ogni cosa in più di cui qualcuno le ha parlato è un **foglietto di carta appuntato** accanto al suo posto,
  con un simbolo a matita del tipo. La storia è un **foglietto con la stella**, a inchiostro.
- Il **cerchio rosso** resta com'è: è la cosa che segue (una sola). Il foglietto seguito ha il bordo rosso.
- In cima: «Sto seguendo …» con titolo e posto; se segue una cosa in più, sotto c'è il riquadro tratteggiato
  «La storia: tocca per tornare a seguirla» con il testo della storia.
- Una riga di legenda: stella = la storia, foglietto = cose in più (toccale), cerchio = quella che seguo.
- Toccando un foglietto si apre la **scheda**: titolo, il tipo solo se lei lo sa, chi me l'ha detto, dove,
  quello che le hanno detto (a volte un presentimento), mai che cosa ci guadagna (18 novembre), «Seguila» / «Chiudi» (se la segue già: «La sto seguendo» e «Torna alla storia»).
- Più cose nello stesso posto: foglietti uno accanto all'altro. Una appena finita: foglietto sbiadito con la
  spunta, solo a questa apertura. Le vecchie: «Cose in più già fatte: 7 ›», chiuso.
- Ogni regione dice quante cose in più ha («4 cose in più»). Il tetto delle novità resta quello di oggi.
- B aggiunge sotto ogni disegno una riga per foglietto: simbolo, titolo, «chi · dove».

## I simboli (a matita, su un foglietto con la puntina)

una carta: carta con stellina · una lezione: libro aperto · una prova: candela · l'orto: germoglio ·
Altrove: spirale · una storia: fumetto · la storia principale: stella a inchiostro · fatta: spunta.
Il foglietto (carta chiara, puntina, leggermente storto) li separa dai disegni dei posti (inchiostro, senza
carta) e dai segni rossi. Da verificare con la domanda «indica i foglietti» del kit.

## Punteggi (giro 1: ok su 3 lettori per stato, domande ★; dettagli in `missions-test/round-1.md`)

| variante | stato 2 | stato 3 | stato 5 | stato 6 |
|---|---|---|---|---|
| A | 15/18 (Q6 in due parti: che cosa sono 3/3, che cosa fa il tocco 0/3) | 11/15 (posto con più cose 0/3; «7» 2/3) | 12/15 («Seguila» 0/3) | 9/9 |
| B | non provata (costo) | – | – | – |
| C (oggi) | non provata (costo) | – | – | – |

Deciso dal capo (con il mandato di Andrea): **vince A**. B e C non sono state provate, quindi non c'è un
confronto misurato. Giro 2: le correzioni in `missions-test/round-1.md` (ultima tabella), immagini in
`/home/claude/shots/missions-design/round2/`; da ri-provare solo le domande cadute.

Cambi tra i giri e perché: nessuno ancora. Prima dei test ho corretto solo cose viste da me nelle
schermate (non contano come test): i foglietti finivano lontani dal loro posto con una linea di richiamo, ora
stanno sempre attaccati a un angolo del disegno del posto; tre foglietti nello stesso posto si coprivano;
la scheda usava il carattere sbagliato.

## Dubbi miei, da far confermare ai lettori

- Il foglietto della casa delle riunioni nel villaggio cade vicino alla «parte alta»: il villaggio è fitto
  di nomi, e «dove» può essere letto male.
- «Seguila» si capisce solo se si è capito il cerchio rosso.
- In stato 6 il testo della storia comincia con «Trovare ancora 11 carte, poi: …» (è il testo vero): può
  confondere «cosa devo fare».
- Nessun lettore può giudicare: il tocco (foglietti da 30 px con area allargata: sul telefono vero?), lo
  scorrimento della pagina lunga, il piacere dei foglietti. Quelle le provi tu.

## Titoli (34, uno per ogni cosa del registro; file `src/ui/missions/titles.js`)

Lezioni: Imparare a volare (Malva) · I quattro semi (Ortica) · Uno, due, tre (Ginepra) · Quattro, cinque, sei
(Malva) · Dal sette al dieci (Ortica) · Le figure (Nonna Edera) · Le carte capovolte (Nonna Edera) · La
biblioteca (Malva).
Carte: Sotto il banco (il bottegaio) · La Bibbia grande (la lavandaia) · Dietro la tenda (un bambino) · Tra i
cavoli (Malva) · Il salice dello stagno (il mugnaio) · La lanterna nel folto (Ortica) · La pietra di confine
(il becchino) · Le due torri (una guardia). Si guadagna: una carta grande per il mazzo.
Orto: Un orto tutto mio · L'acqua · La luce · La terra · Il vaso · Semina e talea (tutte Ortica).
Prove: Il cesto di Malva · La barba di bosco · La strada delle cantine · Chiamata di notte · Qualcosa nel
pozzo (Tartufo) · Il paiolo di rame · La tomba nel bosco (la vedova Bray) · La stanza murata · La scommessa di
Ginepra. Si guadagna: esperienza e monete, e se va tutto bene un oggetto da tenere (nessun nome dell'oggetto: niente spoiler).
Storia: Un sacco dal mulino (il mugnaio). Altrove: Un libro che non c'era · La boccetta verde («L'ho notato io»).
Dubbi: «La biblioteca» come lezione detta da Malva va confermato; «Chiamata di notte» non svela la febbre.

## Il mondo (proposta, non costruita)

Mentre cammina: sopra chi ha qualcosa per lei, o sopra il punto dove si fa, lo **stesso foglietto** in
piccolo, in pixel, che dondola piano (niente punto esclamativo, niente suono). Solo per cose di cui qualcuno
le ha già parlato, mai per scoprire cose nuove. Quella che segue: foglietto con il bordo rosso e la scia di
luci di oggi. La storia: la stellina. Dopo averla fatta il foglietto sparisce. Nessuna immagine di prova:
l'arte del mondo è di un altro agente.

## Nel gioco (17 novembre, giro 2)

A è la pagina «Mappa» del grimorio: `src/ui/mappa.js` (schizzi, posti, «Vola qui», studio) chiama
`src/ui/missions/page.js` (riquadro in cima, legenda, «già fatte», foglietti, scheda); `model.js` è la parte
pura (test: `tests/missions.page.test.mjs`), `pins.js` mette i foglietti accanto al posto e smista i tocchi
dove le aree si toccano. L'elenco di prima, i tag «✎ n» e le note di `sketch.js` sono stati tolti.
Correzioni del giro 2 (una per problema): legenda «cose in più: toccane una per leggerla»; sotto «Seguila» la
riga «il cerchio rosso si sposta qui» (se la segue già: «La sto seguendo», non un bottone, e «Torna alla
storia»); i numeri piccoli in lettere («già fatte: sette», «quattro cose in più da fare», e nel testo della
storia «undici carte»); il foglietto appena fatto ha «fatta» a matita; via le stagioni accanto alle regioni;
due cose nello stesso posto: due foglietti distanziati e «due qui»; tre o più: un mazzetto con «tre qui» che
apre una scheda con una riga per ognuna; «un ricordo» è diventato «un oggetto da tenere».
Da verificare ancora: nel villaggio fitto un foglietto può finire a metà fra due posti (c'è una linea a
matita tratteggiata verso il suo); sul desktop la pagina sinistra scorre un poco.

## File

Prototipo: `src/ui/missions/{page,symbols,titles}.js`, `harness/missions.html`, `harness/missions.js`
(oggi: la pagina vera, `?s=1..6[&tap=id][&tall=1][&done=1]`). Schermate: `/home/claude/shots/missions-design/round1/`
(intere), `phone/` (altezza telefono), `board.png` (oggi, A, B negli stati 2 e 3). `npm test`: 523 verdi.

## 18 novembre: la mappa mostra quello che lei sa

Correzione di Andrea: niente più «Cosa ci guadagno». La scheda ha titolo, chi, dove, quello che le hanno detto
(`told`, e `later` dopo la scena alla porta di una prova) e, raramente, un presentimento (`hunch`). Il tipo resta
solo dove qualcuno le ha detto che cos'è; le prove, la lanterna, il dono di Ortica, la biblioteca, il sacco del
mugnaio e i due Altrove hanno il foglietto neutro (`nota`). Toccando un posto escono i suoi appunti
(`src/data/world/notes.js`): «?» e una riga finché non ne sa niente, poi fino a tre note, con un puntino a
matita sulle nuove. Guardia: `tests/knows-only.test.mjs`. Schermate: `/home/claude/shots/missions-know/`
(harness `?s=7`, `harness/missions-know.steps.mjs`).
