# Edifici con una personalità

**Stato (17 novembre, sera): nel gioco.** Il villaggio e il bosco usano l'arte nuova (`src/world/art/facades.js`,
`src/world/art/witchhomes.js`, registrata in `art/blocks.js`). La tavola di prova resta per guardare un edificio
da vicino: `harness/buildings.html` (dev: `npx vite`, poi `/harness/buildings.html`). Le schermate del gioco vero,
prima e dopo, sono in `/home/claude/shots/village-new/{before,after}/` (`harness/village.steps.mjs`).

## Che cosa c'è adesso, mappa per mappa

**Villaggio** (`src/data/world/village.js`)
- Casa di Malva `M` (`kind: 'malva'`), 5x4, porta (21,37) come prima: saltbox basso a tavole ocra, camino storto
  al centro, insegna col mortaio. Più bassa della tavola di prova (sale 16 px, non 32) perché non sembri uno chalet.
- La capanna `C` (`cottage`), 4x3, porta (4,7): tre stadi (sotto). Tolta la catasta `W` in (6,7): la disegna la
  capanna dallo stadio 2. La casella (6,7) è diventata terreno.
- Biblioteca `R` (`library`): da 5x4 a **3x4** (x 29-31, righe 4-7), porta (30,7) ferma; le colonne 28 e 32 delle
  righe 4-7 sono diventate terreno calpestabile.
- Tribunale `J` (`court`), 7x6, porta (32,18): frontone alto con la bilancia e tre urne di pietra (agli angoli e in
  cima): anche nera, la sagoma dice «tribunale».
- Casa delle riunioni `E` (`meeting`), 7x5, porta (18,14): torre col campanile e la guglia, alta 80 px sopra la
  sala (la campana che oscilla è appesa nella cella). È il punto di riferimento principale.
- Bottega `X` (`shop`): casa nera, porta nera, vetrina di vasi viola, **insegna con la bottiglia** (il compito
  chiedeva l'insegna; la nota sulla «staffa vuota» non è stata seguita).
- Case comuni (`house`, ora `townHouse`): V la sarta (tenda in col 1, finestra accesa), G **i Proctor** (`variant:
  'rich'`, il davanzale col bicchiere in col 2 resta), A a sinistra **i panni stesi di Tabita** (`blockOpts '3,27'`),
  A a destra **in rovina** (`blockOpts '29,27'`: la casa della nonna di Edera, vuota da quando hanno murato la sua
  stanza, settant'anni fa: `lore/retroscena/salem-retroscena.md`), B tutta buia con la legna, F una finestra accesa e
  un barile. I nascondigli (12,32) tenda e (24,32) davanzale sono intatti (test in `world.buildings.test.mjs`).
- **Il vecchio olmo** `W` (`bigtree`) in piazza, (23,22): una casella solida, la chioma 3x4 sopra. Spoglio e
  innevato d'inverno, fiorito in primavera, rosso d'autunno.
- Tre quartieri (`districts`, solo il disegno del terreno): parte alta (righe 3-12) a lastre di pietra in file;
  mercato (x 0-10, righe 13-25) paglia nella neve e sulla strada; parte bassa (righe 26-45) terra battuta, solchi,
  assi storte sul fango.
- Cartelli: `P` (12,13) ora gatto (su) e bilancia (destra); `D` invariato (bottiglia, campana).

**Bosco** (`src/data/world/forest.js`)
- Capanna di Ortica `O` (`kind: 'ortica'`), 4x3, ancora (7,22): fra i due tronchi del faggio. Tolti gli alberi
  (8,16) (9,16) (5,17) (8,17) e la roccia (7,17) (diventati terreno o erba alta), la catasta `X` spostata da (9,19)
  a (14,19).
- Mulino `M` (`mill`): più alto, cappa del montacarichi, ruota grande 40x44 che gira (visibile dal bivio),
  insegna con la ruota.
- Cartello `G` del bivio: merlo (Ortica), goccia, ruota.

**Cantine**: niente (non c'era niente di confuso legato agli edifici).

**Erbe spostate di una casella**: timo (3,4) -> (8,4) (sotto il tetto della capanna), artemisia (18,5) -> (16,5)
(sotto il campanile), menta del bosco (9,21) -> (10,21) (sotto il faggio di Ortica).

## La capanna cresce: come è fatto

`src/world/home.js`, puro, letto ogni volta che la mappa si disegna (`scene/World.js` -> `buildMap`): nessuna chiave
nuova nel salvataggio. Stadio 2: `{ flag: 'garden.given' }` oppure `{ chapterMin: 3 }` oppure il secondo titolo
(livello >= 4, come `{ title: 'fattucchiera' }` in `core/cond.js`). Stadio 3: `{ flag: 'ending.seen' }`. Caselle
dello stadio 3: seme da `yourSuit()` (neutro finché i punteggi sono tutti zero), piante = erbe diverse nelle
aiuole (`state.garden.beds`, fino a 4), premio = il primo che ha fra il nastro del cappello, la chiave della
cantina grande, il lume cieco (flag `item.<nome>`). Se lo stadio cambia mentre è nel villaggio la scena si ridisegna
come al cambio di stagione. La prima volta che la vede a uno stadio nuovo, una riga (`src/glue/home.js`, battute
`home.2`/`home.3` in `data/story/barks.js`): Tartufo a voce bassa se c'è, altrimenti un suo pensiero; una volta
sola (`state.world.once['home.<n>']`), e chi è già oltre sente solo l'ultima.

Lo stadio 2 si distingue anche in sagoma: camino più alto e dritto col comignolo di coccio, colmo raddrizzato,
lanterna su un braccio di ferro.

---

# La tavola di prova (com'era proposta)

## L'idea di ogni edificio

- **Casa di Malva**: una casa «a cassetta» (saltbox), col timpano verso la strada, la falda corta sopra la porta
  e quella lunga che scende sulla tettoia. È l'unico muro caldo, intonaco ocra fra travi scure. Ha erbe a
  seccare sotto la gronda lunga, il camino storto che fuma sempre e una sola finestra grande, sempre accesa,
  con la tovaglia rossa (il tavolo delle letture). Sulla porta verde c'è il biglietto «non bussare»; al cancello
  dell'orto la scopa col nastro verde, che non vola da vent'anni (`malva-retroscena`).
- **La mia capanna**: piccola e «storta e piena di spifferi» (`luoghi/capanna`), col tetto che si affloscia verso
  destra, mele a seccare, la gattaiola di Tartufo con due occhi gialli e l'insegna col gatto. Cresce in **tre
  stadi** (sotto).
- **Capanna di Ortica**: incastrata fra i due tronchi di un faggio, «il faggio dai due tronchi» della nonna
  (`ortica-retroscena`). È mezza casa e mezza cespuglio, col tetto di zolle e la chioma sopra tutto. Fuori ci sono
  la finestra tonda sempre accesa, i vasi su un'asse, le erbe che pendono dal tetto, il paiolo di rame della madre
  e un posatoio col merlo («è stato il merlo»). Il cappello non c'è: è caduto nella gora, e il chiodo è dentro.
- **Tribunale**: largo, simmetrico, nell'unica pietra chiara e squadrata del paese, con tre gradini larghi, un
  frontone con la bilancia scolpita, due lanterne e l'insegna appesa in asse sopra la porta. Una sola finestra
  accesa, in alto a destra: lo studio sopra le celle, dove il Giudice tiene una candela sola (`giudice-retroscena`).
- **Biblioteca**: alta e stretta, coi muri rivestiti d'ardesia a squame, una finestra ogivale accesa in alto con i
  dorsi dei libri sul davanzale, una banderuola a forma di penna d'oca e l'insegna col libro e i tre nastri di
  Edera («i nastri alle pagine per chi sale a ripassare»).
- **Casa qualsiasi**, in tre varianti che costano poco (una funzione, `townHouse`):
  - *semplice*: quella di oggi;
  - *ricca*, dei Proctor (casa di chiesa della parte alta): rosso-bruno, rifiniture crema, scuri verdi,
    lunetta e battente d'ottone, due camini. Nient'altro: è un villaggio puritano;
  - *in rovina*: assi sbiancate e sconnesse, tetto ceduto con buchi fino alle travi, finestra sbarrata, edera.

Regola visiva proposta: **solo dove si entra c'è un'insegna appesa**. Le case semplici hanno il tetto verso la
strada (com'è oggi); quelle dove si entra hanno una sagoma loro.

## La capanna che cresce con lei

1. **sbilenca**: tetto rattoppato coi pezzi di altri tetti (ardesia, viola, un'asse inchiodata, un buco), camino
   storto e spento, vetro incrinato, uno scuro che pende, vernice che si stacca.
2. **rimessa a posto**: tetto riparato (le tegole nuove si vedono più chiare), camino dritto che fuma, finestra
   accesa con la tendina, lanterna alla porta, legna accatastata. Ancora modesta.
3. **la casa di una strega**: sua, non una copia di Malva. Il tetto a toppe di colore è tenuto apposta; c'è un
   abbaino con la finestra tonda (lì sotto legge le carte), un gatto nero per banderuola, una mezzaluna di latta sul
   camino, un portichetto con la panca dove un cliente aspetta, erbe a seccare, la scopa alla porta.

Tre caselle che il gioco riempie dal suo salvataggio (stadio 3), con valori d'esempio sulla tavola:
(a) il **seme** che sa meglio dà il colore della porta e dell'insegna e il segno sopra la porta (coppe, spade,
bastoni, denari); (b) le **piante** nella cassetta della finestra sono quelle che coltiva davvero nell'orto
(id di `data/herbs`); (c) un **oggetto alla porta** viene da un premio vinto: il nastro rosso alla scopa (la storia
del cappello), il lume cieco di Malva, la chiave della cantina grande.

**Da che cosa dipende lo stadio.** Dipende da quello che lei HA, mai dal passo in cui è: chi è già avanti vede
subito lo stadio giusto. Proposta: stadio 2 quando ha l'orto (`flags['garden.given']`) **oppure** ha passato il
capitolo 2 (`chapter >= 3`) **oppure** ha il secondo titolo; stadio 3 quando ha visto il finale
(`flags['ending.seen']`, titolo Gran Maestra). Le caselle leggono il seme con più carte trovate o più stelle,
le erbe piantate nell'orto e gli `item` dei premi (`trials`, `hat`); se una casella è vuota non si disegna
niente. Va calcolato al caricamento della mappa, senza nuove chiavi nel salvataggio.

## Simboli: insegna = cartello = mappa

| luogo | simbolo | oggi sul cartello / sulla mappa |
|---|---|---|
| casa di Malva | mortaio (`mortar`, nuovo) | – / casetta |
| la mia capanna | gatto (`cat`, nuovo) | casetta / capanna |
| capanna di Ortica | merlo (`bird`, nuovo) | capanna / capanna |
| tribunale | bilancia (`scales`) | uguale; sulla mappa si aggiunge la bilancia |
| biblioteca | libro (`book`, nuovo sul cartello) | – / libro |
| casa delle riunioni | campana (`bell`) | uguale |
| bottega | bottiglia (`bottle`) | uguale; l'insegna non c'è (l'ha staccata lui): resta la staffa vuota |
| mulino | ruota (`wheel`) | uguale |

I disegnini a inchiostro proposti per la mappa sono in `harness/buildings.ink.js`.

## Per portarlo a tutto il villaggio, al bosco e alle cantine

- **Ingombri**: Malva 5x4, capanna 4x3, Ortica 4x3, tribunale 7x6 e casa qualsiasi 5x4 sono uguali a oggi, con
  la porta nella stessa casella. La **biblioteca** passa da 5x4 a 3x4 (x 29-31): la porta (30,7) non si muove e le
  colonne 28 e 32 diventano terreno.
- **Cosa non entra così com'è**: la chioma di Ortica sporge 12 px per lato e 58 px in alto, sopra la legnaia X
  (9,19) e gli alberi di (8,16), (9,16), (5,17), (8,17), che andrebbero tolti o spostati. La capanna stadio 2-3
  disegna la sua legna: va tolta la `W` in (6,7). Biblioteca, Malva e capanna salgono più in alto di oggi
  (52, 32 e 32 px): coprono un po' di staccionata e di alberi dietro, e non toccano niente di calpestabile.
- **Quanti edifici in più**: le sei case comuni del villaggio (V, G, A, A, B, F) passano a `townHouse` con
  varianti. Servono altre due o tre varianti: i panni stesi (Tabita al lavatoio), la sarta con la tenda (V), il
  davanzale col bicchiere (G). Poi l'insegna vuota della bottega e il banco chiuso della Hale. Nel bosco c'è il
  mulino, nelle cantine solo luci e porte, niente case.
- **Tre quartieri, tre terreni**: parte alta (righe 4-12) a lastre e ciottoli ordinati; parte bassa (righe 26-44) a
  terra battuta con passerelle di legno; mercato (x 0-10, righe 13-25) a terra con paglia. Vuol dire una o due
  caselle nuove in `tiles.js` e `ground.js`.
- **Riferimenti visibili da lontano** (proposta): (1) il **campanile** della casa delle riunioni, più alto di una
  casella; (2) un **grande albero in piazza** accanto al pozzo, una chioma 3x3 che si vede da tutto il paese; (3) la
  **ruota del mulino**, più grande e visibile dal bivio del bosco. Già adesso il tribunale chiaro e la punta della
  biblioteca fanno da riferimento nella parte alta (si vede nella strada di prova).

## Rischi

- **Telefono**: ogni edificio si dipinge una volta per mappa e stagione, come oggi. Ci sono più luci
  (lanterne del tribunale, abbaino, lume), ognuna è un taglio in più nella notte a ogni fotogramma: poche, non
  dovrebbe pesare. Non l'ho provato su un telefono vero.
- **Buio**: la notte della tavola è un'imitazione statica di `scene/night.js` (tinta e tagli alle finestre), senza
  la luce di lei né la nebbia. Va guardata nel gioco vero.
- **Collisioni e porte**: le sagome nuove sono più alte, non più larghe (a parte Ortica): le caselle solide restano
  quelle di oggi. I posatoi degli uccelli (`build.js`, solo per `house`) vanno messi sui nuovi colmi.
- **Carte nascoste ed erbe**: la tenda (12,32) e il davanzale (24,32) sono opzioni di `house()` (`curtain`, `sill`):
  `townHouse` deve ereditarle, sennò spariscono la Sacerdotessa e Venere. Va controllato anche l'orto di Malva
  (26,38) accanto alla tettoia nuova. Prima del cambio bisogna ricontrollare `data/world/herbs.js` e le carte.
- **Luci che si spengono**: oggi le finestre `house` possono spegnersi, le altre no (`keep`); i tipi nuovi le
  tengono accese apposta (la finestra di Malva e quella di Ortica sono «sempre accese»).

## 18 novembre: correzione dopo i lettori ingenui

Casa di Malva (`witchhomes.js` `malvaHouse`): tetto storto e cadente color prugna con muschio, falce di latta in
cima, camino a gradini con fumo verde tenue, muri ocra tra travi storte, finestra tonda viola, bottiglie colorate
in vetrina, porta viola ad arco con una falce dipinta, treccia d'aglio, mazzi d'erbe sotto la gronda, calderone
con brodo verde, insegna del mortaio su tavola viola. Casa Proctor (`facades.js` `richHouse`): due piani
simmetrici, assi bianche su zoccolo di pietra, tetto a padiglione d'ardesia, due camini, persiane nere, porta nera
con lunetta, frontone e batacchio, staccionata bianca. Biblioteca (`libraryHouse`): finestra a punta con tre
scaffali di dorsi colorati e una lampada, grande tavola dipinta col libro aperto e i tre nastri di Edera, finestre
basse piene di libri. Fumo colorato e bagliore verde: `scene/build.js` (`art.smokeTint`, glow `green`).
