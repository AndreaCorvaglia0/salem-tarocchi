# Il rito del fumo: che cosa è costruito

18 novembre 2026. Specifica: `PROGETTO.md`. Musica e misure: `musica.md`. Passi 1, 2, 3 e 4 fatti; nessuno
ascoltato, nessuno provato su un telefono vero.

## Che cosa c'è

**Passo 1, la musica.** 25 candidati veri e nuovi per il gioco (Kevin MacLeod, CC BY 4.0), misurati con il codice;
13 tenuti, 5 scelti **provvisoriamente** (rosa Reawakening, alloro Errigal, cipresso Heart of Nowhere, salvia
Fairytale Waltz, mirra Mourning Song). Note vere per le braci e un colpo di gong accordato per l'apertura
(University of Iowa, uso libero). La pagina d'ascolto alla cieca va nel build a `ascolto/` (`noindex`); il codice si
decodifica con `node scripts/audio/ascolto-decode.mjs`. Dettagli e tabella: `musica.md`.

**Passo 2, il rito in «Una lettura per me»** (anche dal titolo, «Leggi le tue carte»: è la stessa schermata). Dopo
«Pesco qui» o «Le ho pescate io» si apre lo strato a tutto schermo: bussare (tenere la brace un secondo), il gong,
il fumo chiaro dell'incenso; il respiro a mano libera (un cerchio che si allarga e si stringe; tre respiri le prime
tre volte, due fino alla nona, poi uno) che a ogni espiro porta via il velo del fumo dell'ultima volta; la ricerca
(il pollice scorre in orizzontale sotto cinque braci su un arco, tutte uguali finché non ci si passa sopra; sopra una
brace sua: la luce della stanza, il colore e il modo del fumo, una nota vera; in mezzo solo il fuoco); il rilascio
sopra una brace accende: il segno dell'elemento si disegna, «Quest'aria è la rosa.», entra la musica dell'aria, che
resta per tutta la lettura. Se lascia fuori da una brace non succede niente. Le righe guida le prime tre volte;
dalla quarta nessuna parola, e in alto «Leggo senza fumo», quieto, contato. Stessa seduta (entro 20 minuti): «La brace
è ancora accesa.», niente colpo né gong, un respiro corto, si cerca subito. Chiudere con × torna a «Le carte».

**Passo 3.** Lo stesso rito nelle letture per i clienti, dopo «Mescolo» (`systems/reading.js`). La prima volta in
assoluto, prima del rito, la scena al focolare di Malva (tre righe: «Prima di guardare dentro una persona si bussa,
come a una porta.»), se ha già conosciuto Malva. Dopo la lettura, al massimo una volta al giorno, la riga di fatto
«Per questa domanda hai acceso la rosa.» e «E Malva?», che dice in una riga che cosa accende Malva per quel tipo di
domanda e perché, con quattro secondi di quell'aria (luce, fumo, nota). Nel grimorio, pagina «Io» sotto il Diario,
«I miei fumi»: «Per le domande di casa io accendo il cipresso. Malva accende la salvia.», dopo tre volte la stessa
aria per lo stesso ambito, diversa da quella di Malva.

Che cosa accende Malva (dalla base di conoscenza, `src/data/rite.js` `MALVA`): amore → rosa, lavoro → alloro,
casa → salvia, altri → cipresso, sé → mirra. Così all'inizio, per casa e per sé, «E Malva?» le fa vedere un'aria che
non ha ancora.

**Passo 4.** Con le carte vere («Le ho pescate io»), dopo il nome compare per due secondi e mezzo «Passo il fumo sul
mio mazzo»: se lo tocca, il fumo segue il dito sopra il disegno del mazzo, con la riga «Se hai le carte vicino, fai
lo stesso con la mano, piano, sopra il mazzo vero.» e «Fatto». Se non lo tocca, la lettura va avanti. La salvia arriva
da Ortica dopo quattro riti (se Ortica l'ha conosciuta), poi la mirra da Edera dopo otto (se conosce Edera), mai la
seconda prima della prima, ognuna con due righe all'inizio del rito.

## Dove sta il codice

Nuovo: `src/data/rite.js` (arie, testi, Malva, doni), `src/glue/rite.rules.js` (regole pure), `src/glue/rite.js`
(servizi `rite.run`, `rite.after`, `rite.state`, `rite.malva`), `src/ui/rite/index.js` (lo strato: `rite.overlay`,
`rite.preview`), `src/ui/rite/smoke.js` (il canvas), `src/sound/samples.js` (note e gong nel contesto audio del
gioco), `public/rite/`, `harness/ascolto.*`, `harness/rite.*` (+ `rite.steps.mjs`, `rite.game.steps.mjs`,
`rite.fps.steps.mjs`), `scripts/audio/*`, `tests/rite.rules.test.mjs`, `tests/rite.data.test.mjs`.

**Ganci in file esistenti, tutti:**
- `src/core/state.js` `fresh()`: la chiave `rite` con i suoi valori (le partite vecchie la ricevono dalla fusione;
  `normRite` ripara i valori rovinati, testato).
- `src/glue/index.js`: `import './rite.js'`.
- `src/ui/selfread.js`: il rito una volta per lettura prima delle carte; la riga dopo nella schermata finale.
- `src/systems/reading.js`: il rito dopo «Mescolo» per i clienti; la riga dopo nella schermata finale (vecchio percorso).
- `src/systems/consult.js`: la riga dopo nella schermata finale del cliente (percorso del motore).
- `src/ui/io.js`: «I miei fumi» sotto il Diario.
- `src/sound/index.js`: i nomi dei mood del rito accettati, `samples` attaccato al contesto, servizi `sound.want`,
  `sound.sample`, `sound.preload`.
- `src/sound/tracks.js`: `cueFor('rite')` = silenzio, `cueFor('air.<aria>')` = il brano dell'aria dall'inizio
  (`top: true`, niente seek); `url()` accetta percorsi (`rite/music/rosa`); `RITE_MOODS`.
- `src/sound/beds.js`: `bedFor('rite')` = il fuoco forte, `bedFor('air.*')` = il fuoco basso sotto il brano.
- `vite.config.js`: `ascoltoPlugin` (la pagina a `ascolto/` nel build e in sviluppo).
- `docs/CREDITS.md`: la sezione del rito.

Il brano dell'aria resta fino alla fine della lettura; lo riporta via il `sound.back` che le letture già chiamano.
Se non accende niente (× o «senza fumo») torna subito il mood di prima (`sound.want`).

## Le misure

**Tempi** (harness, tocchi veri da puppeteer, pollice «deciso»: mezzo secondo per arrivare sulla brace, scivola
dritto sulla brace scelta e lascia; la lettura delle righe guida non c'è):

| | colpo | luce + respiri | ricerca | nome | totale | limite |
|---|---|---|---|---|---|---|
| prima volta | 2,0 | 12,6 | 1,1 | 1,8 | **17,9 s** | 22 |
| quarta | 2,0 | 8,2 | 1,0 | 1,4 | **12,9 s** | 14 |
| decima | 2,0 | 3,7 | 1,0 | 0,9 | **7,9 s** | 8 |
| stessa seduta | 0 | 2,8 | 0,3 | 1,0 | **4,5 s** | 5 |

Nella partita vera (prima volta, con la scena di Malva esclusa, e la ricerca scriptata con una pausa sopra la
brace) il salvataggio ha registrato 20,0 s. La decima volta sta sul filo: per starci ho accorciato da quella in poi
la luce (0,5 s), il respiro (3,2 s) e il nome (0,9 s); un respiro di tre secondi è svelto, e la decima volta resta
sotto gli 8 s solo se lei sa già dove andare. Il bilancio fisso per stadio è in `rite.rules.js` (`DUR`) e un test
controlla che lasci il tempo per cercare. Il salvataggio tiene la media di ogni fase e il totale per stadio
(`state.rite.times`).

**Fumo:** 60 fps in Chrome headless, 60 fps con la CPU rallentata 4 volte, 53 con 6 volte (CDP), 30–45 sbuffi
vivi. Il canvas è a un pixel per pixel CSS (il fumo è morbido) e si fa più grossolano da solo, poi con meno sbuffi,
se scende sotto i 50 fps per due secondi. Headless non ha GPU: su un telefono vero può solo andare meglio, ma non
l'ho visto.

## Che cosa ho guardato (`/home/claude/shots/rito/`)

- Ogni fase la prima volta (`first-*`), la quarta senza testo (`fourth-*`), la stessa seduta (`same-*`), la scena di
  Malva e la prima volta nella partita vera (`game-self-*`), il cliente (`game-client-*`), il dono di Ortica
  (`gift-*`), il mazzo (`deck-*`), la riga dopo e «E Malva?» (`game-self-line-after`, `game-self-malva`), il grimorio
  (`game-grimoire-io-fumi`), la pagina d'ascolto (`ascolto-*`).
- Le arie affiancate, stesso momento, senza etichette (`compare-three-nolabels.png`, `compare-five.png`): si
  distinguono per colore della stanza e forma del fumo (alloro colonna dritta e svelta, rosa nuvola ondeggiante,
  cipresso basso che si allarga, salvia a V che si apre, mirra una massa ferma). La coppia più simile è cipresso e
  mirra, tutte e due basse: le separa il colore.
- Corretto guardando: il fumo usciva dalla brace sopra il pollice e ai bordi finiva fuori schermo (ora sale dal fuoco
  in mezzo, sempre intero); i fumi lenti si vedevano solo dopo due secondi (ora partono già alzati); le colonne erano
  a perline (sbuffi più morbidi e più grandi); «Leggo senza fumo» restava dopo l'accensione; un suggerimento
  dell'interfaccia (`ui/hint.js`, z 95) stava proprio sulla brace e prendeva il tocco (lo strato ora è a z 96).
- Le braci sono a y 515–561, il pollice parte sotto, a y 675–720, e scorre di lato: non copre l'arco.

## Che cosa ho cambiato o non ho fatto

- **Il registro delle cose in più (`core/extras.js`):** non ho aggiunto voci. La scena di Malva e i doni non sono
  posti dove andare (ogni voce del registro è un foglietto sulla mappa, con un posto e una scheda): arrivano nel rito
  stesso e dipendono solo da quello che ha (riti fatti, Malva/Ortica/Edera conosciute), quindi chi è molto avanti li
  ha alla prima occasione. Se il capofila li vuole anche sulla mappa, va deciso dove.
- **Il fumo esce dal fuoco in mezzo**, non dalla brace scelta: la brace si illumina, il fumo è sempre intero e nello
  stesso posto, così si confrontano le arie.
- **Le braci sono tutte uguali** finché il pollice non ci passa sopra (l'idea della proposta C).
- **Un tocco diretto su una brace** la accende (è un rilascio sopra una brace); non c'è attesa che sceglie da sola.
- La «Lettura con il tuo mazzo» di `systems/free.js` (la verifica posizione per posizione) non ha il rito: il mazzo
  vero passa da «Una lettura per me» → «Le ho pescate io».
- La lettura finale per sé (`finale.js`) non ha il rito.
- Gli script che guidano le letture nel gioco vero devono mettere `window.__salemNoRite = true`; quelli esistenti
  (`harness/play.*`) non caricano la colla e non lo incontrano.
- Durante il lavoro un test non mio è diventato rosso, `story.data.test.mjs` («prop.bed: a visit outside the
  chapters»): viene dai dati della storia che un altro agente sta cambiando; prima delle sue modifiche la suite era
  verde con i miei test (569).

## Che cosa può verificare solo una persona

- **Il suono:** se i brani provvisori stanno bene alle arie (la prova alla cieca), se le note delle braci sono belle
  e si sentono sopra il fuoco, se il gong d'apertura non è troppo «tempio» per Salem (è un gong accordato; una
  campanella o una corda pizzicata sono l'alternativa), i livelli (gong e note −20 LUFS, brani −24).
- **Il respiro:** se 3,8 / 3,6 / 3,2 secondi a respiro si seguono senza affanno, e se il cerchio basta.
- **Il telefono vero:** la pressione lunga su iOS (niente menu, niente selezione: c'è `-webkit-touch-callout:none` e
  `user-select:none`, ma solo un iPhone lo dice), il suono con l'interruttore del silenzio (le note passano dal
  contesto Web Audio già sbloccato dal gioco), il fumo a 50+ fps su un telefono medio, il gesto del pollice in
  autobus.
- **La sola misura che conta** (dalla specifica): se dopo qualche sera il gong le fa abbassare le spalle. E quante
  volte sceglie «senza fumo» (`state.rite.skipped`) e se accende sempre la stessa aria (`state.rite.picks`).
