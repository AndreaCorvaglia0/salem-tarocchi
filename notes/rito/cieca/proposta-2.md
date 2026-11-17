# Proposta A: «Un respiro, un gesto»

## 1. L'idea in tre righe

Il rito è un solo tocco: preme il braciere, tiene il dito mentre la stanza respira e il fumo spazza via la foschia, poi, senza staccarlo, va verso il fumo che sente giusto e lascia. La direzione del dito è il segno dell'elemento, e lasciare andare è l'accensione. Non aggiunge tasti: il braciere **prende il posto** del tasto che oggi apre la lettura. Che cosa la distingue: nessun passo separato, nessun menu. Pulizia, respiro, scelta e accensione stanno in un solo gesto della mano, che dura 11,5 secondi la prima volta e 5,6 secondi la ventesima.

## 2. La sequenza, secondo per secondo (la prima volta, lettura per un cliente)

Prima del tocco. Nel saluto del cliente (`reading.js`), dove oggi c'è il tasto «Mescolo», c'è il braciere. Da qui `mood('rite')`: la musica tace e resta solo il crepitio della brace (strato `fire`, 0,45). Sotto il braciere, per i primi tre riti: *Tieni il dito sul braciere.*

| t (s) | Schermo | Dito | Suono | Testo |
|---|---|---|---|---|
| 0,0 | la brace si ravviva; il velo copre la stanza (§5); il saluto scende a opacità 0,25 in 0,4 s; la domanda resta in alto | preme | parte il **motivo d'apertura** (3,5 s, sempre uguale) | |
| 0,0–1,8 | inspiro: un alone attorno al braciere si allarga da 60 a 150 px, la luce sale | tiene | brace | 0,3: *Respira con il fumo e pensa alla domanda.* |
| 1,8–4,2 | espiro: l'alone si stringe, una colonna di fumo d'artemisia (grigio argento) sale fino in cima e porta via metà del velo | tiene | un soffio registrato (2,4 s) | |
| 4,2–8,4 | secondo respiro uguale; alla fine il velo è sparito | tiene | motivo finito a 3,5; secondo soffio | |
| 8,4 | in 0,4 s compaiono i quattro fumi attorno al braciere e quello della mirra sopra la brace (§10, storyboard) | tiene | | *Senza staccare il dito, vai verso il fumo che ti sembra giusto, e lì lascia andare.* e sotto, più piccolo: *Se resti ferma, accendi la mirra.* |
| 8,8–9,8 | il fumo sotto il dito si accende, gli altri si spengono a metà; la stanza prende il suo colore in 0,5 s; in alto il nome e la parola (dopo 300 ms di sosta) | si muove, anche avanti e indietro | entrando in un fumo, la sua nota (una sola, 1 s) | per esempio **Rosa** · *tenerezza* |
| 9,8 | **accensione**: la scia del dito si ridisegna nel segno dell'elemento (▽ per la rosa) e brilla 0,9 s nel colore del fumo | lascia | parte il brano di quel fumo (dissolvenza 2,6 s) | il nome resta |
| 10,7–11,5 | il rito sfuma in 0,8 s; si apre la pesca delle carte, già nell'aria scelta | | | |

Totale dichiarato: **11,5 s** con una scelta di 1,4 s. Se esita, il tempo è suo: la stanza continua a respirare finché il dito resta giù.

## 3. La ventesima volta

Resta: il braciere al posto del tasto, il motivo, **un** respiro, il velo che si pulisce, la scelta, il segno, il brano. Sparisce: tutte le righe di istruzione (dal quarto rito), il secondo respiro (dal decimo), l'attesa dei fumi (dal decimo si vedono, tenui, già a 1,0 s, così il dito può avviarsi durante l'espiro).

| t (s) | che cosa succede |
|---|---|
| 0,0 | preme; motivo; velo a 0,35 |
| 0,0–1,8 | inspiro; a 1,0 i fumi compaiono a opacità 0,3 |
| 1,8–4,2 | espiro con una spazzata sola, più ampia: il velo sparisce; il dito va verso il fumo |
| 4,2 | da qui il rilascio vale; tipico a 4,5 |
| 4,5–5,1 | segno e brace, 0,6 s |
| 5,1–5,6 | il rito sfuma (0,5 s) |

Totale: **5,6 s**. Dal decimo rito il nome del fumo compare dopo 1,2 s di sosta invece che dopo 0,3: chi lo sa lo dice tra sé prima di leggerlo (§7). Le tappe: riti 1–3 con le righe e due respiri (11,5 s); 4–9 due respiri senza righe (10,4 s); dal 10 un respiro (5,6 s). Nessuna scorciatoia «il solito»: tenere premuto un respiro è già la versione corta, e il respiro non si toglie mai.

## 4. I gesti

Un gesto solo: **premere, tenere, andare, lasciare.** Le direzioni sono i segni alchemici ridotti a un tratto (come in `docs/ARRIVO.md`); la mirra è «si tiene, poi si lascia», alla lettera.

| Fumo | Elemento | Dove va il dito (dal punto in cui ha premuto) | Settore riconosciuto | Segno mostrato al rilascio |
|---|---|---|---|---|
| Alloro | fuoco | dritto in su | 67,5°–112,5° | ▲ |
| Olibano | aria | in su e di lato | 22,5°–67,5° **e** 112,5°–157,5° | ▲ con la sbarra |
| Rosa | acqua | dritto in giù | 247,5°–292,5° | ▽ |
| Salvia | terra | in giù e di lato | 202,5°–247,5° **e** 292,5°–337,5° | ▽ con la sbarra |
| Mirra | lasciar andare | resta ferma sul braciere | spostamento < 24 px per 1,2 s | una linea che scende e svanisce |

Disegno: olibano in alto a destra, salvia in basso a sinistra; il riconoscimento accetta anche il lato specchiato (mancine, pollice sinistro) senza dirlo. Restano neutri i due settori orizzontali (±22,5° da 0° e da 180°).

Riconoscimento, senza errori:
- Conta il **vettore dal punto di pressione**, non la posizione assoluta: il disegno è centrato lì.
- Un fumo si «prende» oltre i 44 px dal punto di pressione; tra 24 e 44 px nessun fumo (zona morta).
- Isteresi: il fumo cambia solo se il dito resta 120 ms nel settore nuovo.
- Rilascio prima della fine del respiro minimo, o in zona neutra: niente si accende, la brace resta viva, il velo resta com'è; riga: *Il fumo ti aspetta: rimetti il dito sul braciere.* Ripremendo, il respiro già fatto non si ripete: i fumi sono subito lì.
- La velocità del tratto non conta (si legge solo la direzione).

Convivenza con la guardia e lo scorrimento (`src/core/dom.js`):
- Il braciere **non** è un `button`: la guardia di 650 ms non lo vede, quindi ha la sua: la brace si accende in 650 ms quando compare e prima non risponde (stessa regola, stessa animazione `tap-arm`).
- Se `holdTaps` è attivo, il `pointerdown` viene fermato in cattura: il braciere semplicemente non parte.
- Sul braciere e sul livello del rito: `touch-action:none`, `user-select:none`, `-webkit-touch-callout:none`, `contextmenu` annullato; `setPointerCapture` al `pointerdown`. La pagina sopra continua a scorrere.
- Al rilascio, `holdTaps(500)`: il dito che si alza non tocca la prima carta della pesca.
- Vincolo per chi ospita il braciere: centro tra x 110 e 280, y tra 300 e 700, così tutti i fumi stanno nello schermo (raggio di disegno 95 px).

L'alternativa semplice: **un tocco breve** (meno di 250 ms) sul braciere. Il respiro va da solo (uno, 4,2 s, con le stesse immagini), poi i cinque fumi diventano tasti tondi di 64 px nei loro posti (con la guardia normale) e un tocco accende quello. Stessa cosa con Invio e le frecce. Con `reducedMotion()` l'alone non si allarga: cambia solo la luce.

## 5. La pulizia delle energie

È **il tenere premuto**. All'inizio la stanza ha un velo: una grana grigia sopra tutto (opacità 0,35), «l'aria della giornata». Ogni espiro manda in su la colonna d'artemisia, che spazza il velo dal basso verso l'alto; con due respiri 0,35 → 0,17 → 0, con uno 0,35 → 0. Il soffio si sente a ogni espiro. Non è un passo in più perché è la stessa cosa del respiro: tenere il dito giù **è** stare ferma mentre il fumo pulisce. Si vede che è servito: la domanda in alto, prima velata, alla fine è nitida.

## 6. L'intuizione

Sceglie **passando**: sotto il dito ogni fumo colora subito la stanza e fa sentire la sua nota, quindi può provarli tutti e fermarsi dove la stanza le torna. Nessuna risposta sbagliata, nessun fumo preselezionato (neppure l'ultimo usato).

Come il gioco onora la scelta: tutta la lettura avviene nella sua aria. Lo sfondo dello schermo della lettura (`sxread`, `sr`, `sxfree`) prende `--smoke` nel gradiente; un filo di fumo del suo colore sale piano dietro l'intestazione per tutta la lettura; suona il brano di quel fumo; la voce nel diario delle letture porta un piccolo tratto di quel colore.

Lo specchio dopo: una sola riga, alla fine, in prima persona come il grimorio, sopra «Chiudo il libro» (in `consult.js`), sopra la nota (in `selfread.js`), sotto l'ultima carta (in `free.js`):

- Rosa: «Ho acceso la rosa, perché questa domanda chiedeva tenerezza.»
- Salvia: «Ho acceso la salvia, perché questa domanda chiedeva un riparo.»
- Alloro: «Ho acceso l'alloro, perché questa domanda chiedeva slancio.»
- Olibano: «Ho acceso l'olibano, perché questa domanda chiedeva chiarezza.»
- Mirra: «Ho acceso la mirra, perché questa domanda chiedeva di lasciar andare qualcosa.»

Quando la domanda ha un ambito, segue la tradizione, come confronto e mai come correzione:
- se coincide: «Malva fa lo stesso, per {le domande d'amore}.»
- se è diversa: «Malva, per {le domande d'amore}, accende la rosa.»

Ambiti → frase: amore «le domande d'amore», lavoro «il lavoro e il denaro», casa «la casa e la famiglia», altri «gli altri e gli addii», se «le decisioni su di sé». Quando: sempre nei primi otto riti con una domanda; poi una lettura su tre, e sempre la prima volta che accende un certo fumo per un certo ambito. Mai due righe.

## 7. Imparare quale incenso quando

Succede in tre modi, nessuno è un quiz:
1. **Con la mano:** ogni fumo ha un posto e un segno fissi; la scia diventa il segno dell'elemento a ogni accensione. Dopo una decina di riti la mano sa che la rosa sta in giù.
2. **Con la parola:** il nome e la parola compaiono a ogni passaggio. Dal decimo rito arrivano dopo 1,2 s di sosta: chi lo sa lo dice prima di vederlo (`lore/metodo/tirar-fuori-prima-di-vedere.md`).
3. **Con la tradizione dopo:** la riga dello specchio accosta il suo fumo a quello di Malva per quell'ambito. Così anche i fumi che lei non sceglie mai passano sotto gli occhi.

Stima, non misurata: dopo **6–8 letture** sa dire «la mirra è per lasciar andare» per i fumi che usa; per quelli che non usa conta la riga di Malva, e ci vorrà di più. Se non succede ce ne accorgiamo (§12). Ambito → fumo di tradizione (provvisorio, `docs/BACKLOG.md` 3.5): amore rosa, casa salvia, lavoro alloro, se olibano, altri mirra.

## 8. Suono, colore, luce

Musica: brani veri, scelti con le ricette e poi alla cieca; quelli tra parentesi sono **provvisori**, presi dalla libreria che c'è, finché la prova d'ascolto non decide. Le note al passaggio sono una sola nota registrata per fumo (campioni liberi da cercare e verificare la licenza; 1 s, stesso volume).

| Fumo | Colore | Come si muove il fumo | Nota al passaggio | Ricetta del brano (provvisorio) | Luce della stanza |
|---|---|---|---|---|---|
| Artemisia (apertura) | `#c9cfc4` grigio argento | colonna dritta e sottile | motivo: ciotola o campana registrata, 3,5 s | sempre uguale | scende del 30%, centro sul braciere |
| Rosa | `#e8a3b4` | lento, volute larghe e morbide | violoncello, nota media (re3) | lento, maggiore, legato, caldo (`consolation`) | calda, rosata |
| Salvia | `#9fb08a` | basso e denso, si stende di lato | viola o organo grave (do2) | lento, maggiore, grave, quasi fermo (`gymnopedie`) | bassa, ambrata |
| Alloro | `#d9893f` | sale dritto e svelto, con scintille | arpa pizzicata (sol4) | moderato, maggiore, staccato leggero (nessuno adatto in libreria: `goldberg` per ora) | viva, arancio |
| Olibano | `#f1ead2` | leggero, sale e si apre in alto | piano acuto (mi5) | piano solo, registro alto, poche note (`clairdelune`) | chiara, fredda |
| Mirra | `#7a5f86` | pesante, ricade e si scioglie | violoncello grave (la1) | lento, minore, legato, grave (`wounded`); a fine lettura sfuma su `consolation` in 4 s | bassa, viola |

Che cosa cambia nella stanza: durante il rito solo brace e soffio (`bedFor('rite')` → `fire` 0,45; nuovo `mood('rite')` con musica in silenzio); dopo, il brano del fumo (`cueFor('reading', { smoke })`), il colore nel gradiente, il filo di fumo in testa. Le cinque arie restano la stessa stanza: stessa brace, stessa luce di fondo, cambia solo la tinta.

## 9. Che cosa dà in gioco

Non dà punti, monete o esperienza: il premio è l'aria della lettura e la riga nel diario. Alla soglia conta come una cosa fatta oggi per la luna, come le altre. Le scelte entrano nel ritratto (quali fumi accende), che la Lettrice potrà rimandarle più avanti. Non toglie mai niente: non si sbaglia, non scade, non consuma l'incenso della bottega (`tools.incense` resta per gli Esami), e con la musica spenta funziona uguale.

## 10. Dati e stato

In `fresh()`:
```
rite: { n: 0, picks: { rosa: 0, salvia: 0, alloro: 0, olibano: 0, mirra: 0 }, log: [], day: null }
```
- `n` riti compiuti (decide le tappe del §3); `picks` per il ritratto; `log` gli ultimi 40 `{ at, smoke, ambito, where: 'client'|'self'|'real'|'soglia', how: 'gesture'|'tap', ms, early }`; `day` `{ date, smoke }` per la soglia.
- Le voci del diario delle letture prendono `smoke` facoltativo; quelle vecchie restano senza tratto.
- Partite vecchie: `merge(fresh(), saved)` aggiunge `rite` con i default; chi ha già molte letture fa comunque i suoi primi tre riti con le righe, perché il gesto è nuovo per tutti.

Dove si costruisce: `src/data/smokes.js` (i cinque fumi e l'apertura: id, nome, articolo, elemento, parola, colore, settori, nota, brano); `src/glue/rite.rules.js` (puro: tappe e tempi per `n`, `sector(dx, dy)`, `lineFor(smoke, ambito, n, log)`); `src/ui/rite.js` (livello DOM con un canvas per fumo e velo, gesto, suono); `tests/rite.rules.test.mjs`. Uso: `const r = await rite({ anchor, question, ambito, where })` → `{ smoke, how, ms }`.

Storyboard (390×844, margini sicuri 47 in alto e 34 in basso):
1. **Saluto.** In alto il cliente e la sua battuta come oggi; la domanda a y≈330. Il piede è alto 210 px: braciere (ciotola 88×44 con brace) centrato a (195, 700); sotto, a y≈770, *Tieni il dito sul braciere.*
2. **Pressione.** Il saluto si vela (0,25); la domanda sale e resta a y 90–130, corsivo 18 px, due righe al massimo; il velo grigio copre tutto; la brace si ravviva.
3. **Respiro.** Riga d'istruzione a y≈190 (17 px, tenue); l'alone pulsa attorno a (195, 700); la colonna di fumo sale da 700 alla cima, larga 40–120 px; il velo si schiarisce a fasce dal basso.
4. **I fumi.** Quattro fiocchi colorati (24 px, opacità 0,55) a raggio 95: alloro (195, 605), olibano (262, 633), rosa (195, 795), salvia (128, 767); la mirra è un fiocco viola appena sopra la brace (195, 670). La riga a y≈190 cambia nell'invito a scegliere.
5. **Passaggio.** Il fiocco sotto il dito si accende, la stanza vira al suo colore; il nome a y≈300 (scritto a mano, 32 px) e la parola sotto (18 px corsivo): sempre in quel punto, mai sotto il pollice.
6. **Accensione.** Il segno dell'elemento (60 px) brilla sul braciere 0,9 s; il nome resta.
7. **Uscita.** Tutto sfuma in 0,8 s nella pesca delle carte, con lo sfondo già tinto.
8. **Fine lettura.** Sopra «Chiudo il libro», la riga dello specchio in corsivo 17 px con un trattino del colore del fumo a sinistra.

Gli altri posti: in `selfread.js` il braciere prende il posto di «Avanti» nella schermata della domanda («Indietro» diventa un tasto piccolo in alto a sinistra del piede; se la tastiera è aperta, il braciere compare quando si chiude); in `free.js` c'è una schermata prima delle stese: *Prima di mescolare il tuo mazzo, accendi il fumo.* e il braciere, poi la riga di oggi diventa *Adesso mescola e stendi le carte, poi dimmi quali sono uscite.*; alla soglia il braciere sta sul tavolo con la domanda *Com'è la giornata che hai davanti?*, sempre un respiro solo, e il fumo scelto tinge la soglia per il resto del giorno.

## 11. La versione più piccola che vale la pena costruire

In «Leggi le tue carte» (`selfread.js` e `free.js`), dove l'ascolto serve di più: il braciere al posto del tasto, il velo, i respiri, **tre fumi** (alloro in su, rosa in giù, mirra ferma: le tre direzioni che non si confondono), il segno al rilascio, colore e luce, il motivo e i brani provvisori, la riga dello specchio, `state.rite`, il tocco breve come alternativa. Si prova dal telefono in un giorno. Dopo, in quest'ordine: le letture per i clienti (`reading.js`); olibano e salvia con i settori in diagonale; la prova d'ascolto alla cieca e i brani veri; le note al passaggio; la soglia; il ritratto e la Lettrice.

## 12. Dove può fallire

- **Il punto più debole: il respiro non è il suo.** Lo schermo non sente il fiato; tenere premuto può sembrare una barra di caricamento («tieni premuto per…») invece che un respiro. Ce ne accorgiamo da `log.early` (se più di un rilascio su tre arriva prima della fine del respiro, lo sta subendo) e chiedendo a lei se si accorge di respirare con lo schermo. Rimedio: respiro più lungo e meno visibile come conto, oppure lasciare a lei il ritmo (il respiro finisce quando alza e riabbassa il dito: ma è un secondo gesto).
- **La mirra per sbaglio.** Chi si blocca indecisa accende la mirra. Si vede da mirra con tempo di scelta sotto i 1,5 s dopo la comparsa dei fumi, o da una quota di mirra alta nei primi riti.
- **La musica arriva dopo.** Nel passaggio si sentono solo il colore e una nota; il brano parte al rilascio. Far partire cinque brani al passaggio intaserebbe i due «deck» di `tracks.js`. Se la scelta sembra fatta «a colori» e non «a orecchio», è questo.
- **Le diagonali.** Olibano e salvia in diagonale sono meno sicure di su, giù e fermo, soprattutto col pollice sinistro. Si conta quante volte il fumo cambia sotto il dito prima del rilascio.
- **Il telefono vero.** Pressione lunga su iPhone (lente, menu), pollice che copre il braciere, piede alto 210 px con la tastiera. Nessuno strumento lo prova: lo prova Andrea, dal telefono, prima di tutto il resto.
- **Imparare.** I fumi che non sceglie potrebbe non impararli. Dopo dieci letture le si chiede, a voce e fuori dal gioco, «a che cosa serve la salvia?».
- **Pesa comunque.** 5,6 s a ogni lettura possono stancare chi legge tre volte di fila. Se `ms` mediano resta sopra i 7 s dopo il decimo rito, o se lei lo dice, si accorcia il respiro a 3,4 s, ma non si toglie.
