# Proposta D: un rito che si impara da qualcuno

## 1. L'idea in tre righe

Il rito non arriva intero: Malva, al suo focolare, le insegna un gesto solo, come la levatrice di allora lo insegnò a lei
(tre colpi sul braciere, un grano d'incenso, tre respiri che mandano fuori l'aria di prima). Ogni fumo dopo arriva come un
fatto della sua vita (un dono, la lavanda seccata da lei, un ramo rubato da Ginepra), con il suo gesto e la persona che glielo ha dato.
**Che cosa la distingue:** il rito è sempre ricco quanto quello che ha ricevuto, quindi la prima volta è piccolo e non va mai
accorciato: si approfondisce. «Quale incenso quando» non si studia: ogni fumo lo impara il giorno in cui entra nella sua vita,
da una persona che ha una ragione per tenerci, e da lì lo usa a sentimento.

## 2. La sequenza, secondo per secondo, la prima volta

**Prima della prima volta: la lezione di Malva** (scena facoltativa `rito.apertura`, al focolare, ~70 s, una volta sola).
> [N] «Malva ha messo sul bordo del focolare una ciotola di coccio piena di cenere, con due braci prese con le molle. Accanto c'è il sacchetto di tela che hai comprato alla bottega.»
> Malva: «Il sacchetto l'hai pagato tu, quindi il primo grano lo metti tu. La levatrice di allora me lo fece fare la prima sera, e io pensavo che fosse per l'odore.»
> Malva: «Prima di guardare dentro una persona si bussa, come a una porta. Tre colpi sul bordo, piano, che la cenere si offende.»
> [il rito di prova: colpi, grano, tre respiri; al posto della domanda: «Pensa a una cosa che ti sta a cuore.»]
> [N] «Il fumo sale dritto fino alla trave e poi si allarga sotto il soffitto. Malva respira con te, e dopo un po' ti accorgi che stai andando al suo passo.»
> Malva: «Chi si siede al tuo tavolo si porta dietro l'aria di casa sua, e tu non ne hai bisogno. Per questo la si manda fuori, prima di cominciare.»
> Scelta: «E l'odore, a che cosa serve?» → Malva: «All'inizio a niente. Poi un giorno lo senti e ti si abbassano le spalle da sole, e da quel giorno serve.» /
> «Lo faceva anche lei, prima di ogni lettura?» → Malva: «Prima di ogni cosa che contava, anche di un parto. Io ho smesso di chiedermi perché e ho continuato a farlo.»
> Malva: «Da stasera lo fai anche tu, tutte le volte, e soprattutto quando hai fretta.»
> Diario: «Malva mi ha insegnato ad aprire una lettura: tre colpi sul braciere, un grano d'incenso, e tre respiri per mandare fuori l'aria di prima.»

**La prima volta davanti a un cliente (stadio 1).** Schermata 390×844, senza scorrere. (1) 0–88 px: la testata delle letture
(`.sxc-head`), nome del cliente e domanda in corsivo su due righe. (2) 100–470 px: un canvas 390×370, in basso il braciere di coccio
(180×70, centro a y 400), sopra lo spazio del fumo; la **zona dei gesti** è un quadrato 300×300 (x 45–345, y 180–480) con `touch-action:none`.
(3) 490–650 px: la mensola dei fumi (nascosta allo stadio 1). (4) 660–730 px: la riga d'interfaccia (17 px, corsivo, `--dim`, al massimo
due righe). (5) 744–844 px: il piede, vuoto; ci compare solo l'alternativa semplice.

| t (s) | Schermo | Dito | Suono | Si legge |
|---|---|---|---|---|
| 0,0 | Sul saluto del cliente il pulsante «Mescolo» diventa **«Preparo il tavolo»**; lei lo tocca | tocco | `tap` | |
| 0,0–0,6 | Dissolvenza nella scena; la stanza è scura (luce al 40%) e coperta da un velo grigio-bruno al 25% (l'aria che porta il cliente) | | la musica della lettura scende a zero in 1,2 s; entra il crepitio (`fire`, 0,35, in 1,5 s) | |
| 0,65 | La zona si arma: prima di 650 ms nessun tocco conta (il tocco su «Preparo il tavolo» non diventa un colpo) | | | «Bussa tre volte sul braciere.» (in 0,4 s) |
| ~0,9 / 1,6 / 2,3 | Ogni colpo: le braci si accendono di un terzo, uno sbuffo di cenere | tre tocchi nella zona, a qualunque ritmo | `knock` (coccio sordo, nuovo effetto a ricetta) | |
| ~2,3 | Il grano prende: un lampo bianco di 0,4 s, poi un filo di fumo grigio chiaro che sale dritto | | il **motivo d'apertura**, 4,5 s | la riga sparisce |
| 3,5 | | fermo | | «Ascolta il respiro.» |
| 4,0–10,0 | **Respiro 1**: inspira 2,5 s (la colonna si allarga da 1 a 1,6, le braci si ravvivano), espira 3,5 s (la colonna si stringe e il velo scivola verso la finestra in alto a sinistra perdendo un terzo) | | sul respiro il crepitio sale di 3 dB; sull'espiro un soffio (`wind`, 0,12) | |
| 10,0–16,0 | Respiro 2 | | | «Pensa alla domanda.» e sotto, in oro, la domanda del cliente |
| 16,0–22,0 | Respiro 3; il velo se ne va del tutto | | | |
| 22,0–23,5 | Quiete: il filo dritto, la luce sale dal 40% al 55% | | | |
| 23,5–24,1 | Dissolvenza nella pesca delle carte (`draw.pick`, come oggi) | | torna la musica della lettura (3 s) | |

**Totale: 24 s** (±2 s, dipende dal ritmo dei colpi). Nessun pulsante da premere dopo «Preparo il tavolo».
Il primo rito di prova nella lezione con Malva ha gli stessi tempi, e conta come prima volta per le scritte d'aiuto.
**Stadio 3 (grano, rosmarino, lavanda), alla sua prima volta, verso il sesto rito.** Colpi e motivo come sopra; dal sesto rito
i respiri sono due (12 s). Poi, al posto della quiete:
- t ≈ 15,0: compare la mensola (dissolvenza 0,4 s) con tre vasetti su una riga da tre (110×74 l'uno): **«Solo il grano · niente di più»**,
  **«Rosmarino · riparo»**, **«Lavanda · tenerezza»**. Ordine fisso: il grano sempre a sinistra, poi i fumi nell'ordine in cui sono arrivati.
  Riga d'interfaccia: **«Quale fumo accenderesti?»**, con la domanda ancora visibile in testata.
- ~17,0: tocca la lavanda: il vasetto si solleva (300 ms) e versa un pizzico sul braciere; sopra le braci compare una traccia
  tratteggiata che scende piano, e la riga dice **«Giù, piano.»** (solo le prime tre volte di ogni fumo).
- ~18,5: il tratto in giù, lento. ~19,5: la lavanda prende (§4); in 3 s la stanza diventa sua (§8). 22,5: pesca delle carte.
**Totale ≈ 23 s.**
**Stadio 5 (grano, rosmarino, lavanda, alloro, artemisia):** uguale, con due righe da tre vasetti (490–650 px; la sesta casella aspetta la mirra). Il tempo non cresce: una scelta, un gesto.

## 3. La ventesima volta

A quel punto, con un ritmo normale di letture, ha tutto (stadio 6). Restano: «Preparo il tavolo», i tre colpi, il motivo
(sempre uguale: è il segnale), due respiri, «Quale fumo accenderesti?», il gesto, la stanza che cambia. Spariscono: «Bussa tre
volte sul braciere.» (torna solo dopo 4 s fermi), «Ascolta il respiro.» (dal sesto rito il respiro non ha più parole: resta solo
«Pensa alla domanda.»), le tracce dei gesti (tornano dopo 3 s fermi), le battute dei maestri.

Tempi: zona armata e colpi rapidi 0,65–1,8 s; grano e motivo 1,8–6,3 (il respiro comincia sotto la coda del motivo);
due respiri 2,3–14,3; scelta 14,3–16,0; gesto 16,0–17,0; la stanza cambia, poi le carte, 17,0–20,0. **Totale: 20 s.** **Stessa seduta** (un altro rito entro 20 minuti dal precedente): la brace è ancora accesa, quindi niente colpi;
il motivo suona lo stesso all'ingresso, un respiro, scelta, gesto: **12 s**. È una ragione del mondo, non una scorciatoia.
L'ultima lettura del finale ha sempre tre respiri (30 s).

## 4. I gesti

Ogni gesto è un segno alchemico ridotto a un tratto (`docs/ARRIVO.md`), e ha una persona e un perché:

| Fumo | Gesto | Chi lo insegna e con che parole |
|---|---|---|
| Grano (apertura) | tre colpi sul braciere | Malva: «Prima di guardare dentro una persona si bussa, come a una porta.» |
| Rosmarino (terra) | giù, poi di lato | Malva: «Giù verso la terra, e poi di lato, come quando si rimbocca una coperta.» |
| Lavanda (acqua) | giù, piano | Malva: «Giù piano, come si versa l'acqua in una tazza già piena.» |
| Alloro (fuoco) | su, di colpo | Ginepra: «Su, di colpo, come una fiamma che scappa. Il gesto lo so fare benissimo, è accenderlo che non mi riesce.» |
| Artemisia (aria) | su, poi di lato | Ortica: «Va su e poi di lato, come il fumo quando trova la finestra: si sale per vedere, e poi ci si guarda intorno.» |
| Mirra (lasciar andare) | giù, tieni, lascia | Edera: «Si mette giù, si tiene un momento, e poi si toglie la mano. La parte difficile è la terza.» |

**Riconoscimento** (si controlla solo il gesto del fumo scelto, quindi i gesti non si confondono tra loro):
- Un tratto va da `pointerdown` a `pointerup` dentro la zona. Tratto principale: dal punto d'inizio a quello di massimo |dy|.
  Vale se |dy| ≥ 70 px e |dy| ≥ 1,2·|dx| nel tratto principale; il segno di dy dà su o giù.
- Di lato (rosmarino, artemisia): dopo il tratto principale, |dx| ≥ 40 px in una qualsiasi direzione.
- Velocità: alloro ben fatto se il tratto principale dura ≤ 450 ms; lavanda ben fatta se dura ≥ 700 ms.
- Mirra: giù ≥ 50 px, poi fermo (< 12 px) per 1 s mentre un anello si riempie intorno al dito, poi su.
- Mai un errore detto: con la direzione giusta il fumo **prende sempre**. Ben fatto prende subito, con un rintocco leggero; fatto
  a metà (manca il lato, troppo veloce, anello non pieno) prende dopo 0,6 s con un primo sbuffo più piccolo. Direzione opposta:
  non succede niente, la traccia tratteggiata pulsa una volta.
- Tocchi fermi (< 15 px) durante il gesto: ignorati.
**L'alternativa semplice:** dopo 4 s senza un tratto valido, o dopo due tratti a vuoto, nel piede compare **«Accendo con un tocco»**
(pulsante fantasma; la guardia dei 650 ms vale come per ogni pulsante). Per i colpi non serve: sono già tocchi.
**Scorrimento e guardia:** durante il rito il corpo della schermata non scorre (`overflow:hidden`, tutto sta in 844 px); la zona usa
eventi pointer e non `click`; il rito non chiama mai `holdTaps`, che bloccherebbe anche i `pointerdown`.

## 5. La pulizia delle energie

È il respiro. La stanza entra nel rito coperta da un velo: quello dell'ultimo fumo acceso (il suo colore al 25% se il rito precedente
è di meno di due ore fa, al 15% se più vecchio) oppure, con un cliente nuovo, l'aria grigio-bruna che si porta da fuori. Ogni espiro
spinge il velo verso la finestra in alto a sinistra e ne toglie un terzo, con un soffio di vento; all'ultimo espiro la stanza è pulita.
Non è un passo in più perché non chiede niente e non aggiunge un secondo: si vede succedere mentre respira. Lo dice Malva una volta
sola, nella prima lezione, e poi lo dice la schermata.

## 6. L'intuizione

Sceglie dopo il respiro, con la domanda davanti, tra i vasetti che ha. Ogni vasetto ha un nome e **una parola sola, quella della
persona che glielo ha dato** (riparo, tenerezza, slancio, chiarezza, lasciar andare), mai l'ambito della domanda. Il grano, «niente di più»,
c'è sempre: a volte non serve altro, e non è una rinuncia.
**Come il gioco onora la scelta:** la stanza diventa quella del fumo (colore, luce, musica, crepitio) e resta così per tutta la lettura:
la tinta sul fondo della schermata delle letture, un filo di fumo sottile dietro la testata, la musica di quel fumo al posto di quella
generica. Una volta su quattro il cliente, salutando, nota l'odore («Si sta bene, qui dentro. È lavanda?»). Quando chiude il libro
il motivo d'apertura suona ancora una volta, più piano: il rito si apre e si chiude con la stessa frase.
**Lo specchio**, sulla schermata finale sotto il conto, in corsivo, senza nome: «Hai acceso il rosmarino: questa domanda l'hai
sentita come una cosa di casa.» · «Hai acceso la lavanda: questa domanda l'hai sentita tenera.» · «Hai acceso l'alloro: questa
domanda l'hai sentita come una cosa da vincere.» · «Hai acceso l'artemisia: questa domanda volevi vederla chiara.» · «Hai acceso la
mirra: questa domanda ti è sembrata un addio.» · «Hai lasciato bruciare solo il grano: a questa domanda non serviva altro.»
Compare al primo uso di ogni fumo dopo la sua lezione, poi al massimo una lettura su tre (una su cinque dopo il ventesimo rito), mai due
volte di fila. Sotto, un pulsante fantasma col nome di chi le ha dato il fumo che la tradizione lega a quell'ambito (per esempio
«E Malva?»). Se lo tocca: «Malva, per una domanda di casa, accende il rosmarino: dice che il fumo basso tiene vicine le persone.»
Se ha scelto proprio quello: «Anche Malva avrebbe acceso il rosmarino.» Arriva dopo, a richiesta, come un parere: mai «giusto».

## 7. Imparare quale incenso quando

Succede per come arrivano, non per esercizio. Ogni fumo entra con **una scena** (una persona, un oggetto, una storia: le mani che il
rosmarino doveva ungere, il ramo rubato dal giardino del pastore, la mirra che in chiesa bruciano per i morti e Edera usa per i vivi), con **un gesto**
che porta l'elemento nella mano, e con **una parola** che lei rivede sul vasetto a ogni rito. Arrivano uno alla volta, a giorni di
distanza, così ciascuno ha qualche lettura tutta per sé prima del successivo. Lo specchio rimette la parola accanto alla sua scelta,
e la tradizione si può chiedere a chi gliel'ha insegnata.
**Quando lo sa:** la stima è che dopo la scena e tre riti con quel fumo sappia dire «la mirra è per chi deve lasciar andare qualcuno»,
e tutti e cinque dopo una quindicina di letture in due settimane. Non c'è una verifica che dia un voto. Si guarda la sua storia dei riti
(§10): se per ogni ambito le sue scelte vanno verso il fumo della tradizione più che a caso (oltre il 50% dopo dieci riti, contro il 20%
del caso), ha imparato; se non ci vanno, ha scelto lei, e va bene lo stesso. La prova vera la fa Andrea: dopo due settimane le chiede «la
mirra, per che cosa la accenderesti?».
**Perché un giocatore avanti fa presto:** la lezione successiva si apre quando quella prima è fatta, la sua condizione nel mondo vale
(§10), e o è passato un giorno con almeno un rito **o** ha fatto tre riti col fumo appena arrivato. Chi legge poco ne riceve uno al
giorno; chi è molto avanti e legge tanto li riceve tutti in poche sedute, ma mai due senza averne usato almeno uno.

## 8. Suono, colore, luce

**Il motivo d'apertura:** 4,5 s, sempre lo stesso: quattro note arpeggiate in registro medio-basso (arpa o pianoforte), maggiore,
legato, con la coda che risuona. Si cerca prima un taglio di una registrazione libera (Musopen) che stia nella ricetta; solo se non
si trova lo genera il motore (re, la, re, fa diesis, con riverbero). Suona all'accensione del grano e quando chiude il libro.
Il letto d'ambiente durante tutto il rito e la lettura: `fire` a 0,35 (0,25 nella lettura), più il soffio `wind` a 0,12 sugli espiri.

| Fumo | Colore e moto del fumo | Luce della stanza | Musica: ricetta (`BACKLOG` 3.5) e candidata provvisoria |
|---|---|---|---|
| Grano | grigio chiaro `#d9d4c7`, un filo sottile e dritto | neutra e calda, 55% | resta la musica delle letture (`clairdelune`) |
| Rosmarino | grigio-verde `#9fb39a`, basso e denso, si allarga di lato e resta vicino al tavolo | ambra bassa, 50%, vignetta forte: la stanza si stringe | lento, maggiore, grave, timbro scuro, quasi fermo: `consolation` (è già la musica di casa di Malva, e qui va bene così) |
| Lavanda | lilla `#b9a3d6`, nastri morbidi che scendono e si arricciano | rosa-lilla, 60%, vignetta lieve | lento, maggiore, legato, violoncello caldo, registro medio: `swan` (Il cigno, violoncello) |
| Alloro | oro caldo `#e7b65a`, colonna che sale svelta, qualche scintilla | più chiara, 70%, calda | moderato, maggiore, staccato leggero, arpa o pizzicati, intervalli ampi: nessuna nel gioco, da cercare |
| Artemisia | argento-azzurro `#c6d3e0`, colonna altissima e dritta, molto spazio intorno | fredda e limpida, 65%, contrasto più alto | piano solo, registro alto, poche note, molto silenzio: `gymnopedie` (da cambiare se si sente troppo il titolo) |
| Mirra | ambra scura `#8a5a3c`, pesante, prima ristagna in basso poi sale tutta insieme | rosso cupo, 40%; sull'ultima schermata sale al 60% | lento, minore, legato, grave, che si schiarisce alla fine: da cercare tra i brani scuri di MacLeod (non `elegie`, che è la musica degli Esami) |

Le candidate sono provvisorie: per ogni fumo se ne raccolgono molte, si misurano col codice (tempo, modo, altezza media, intensità) e
tra le due o tre che restano scelgono Andrea e lei alla cieca, come dice `lore/metodo/ricette/progettare-per-i-sensi-senza-averli.md`. Le cinque
musiche devono avere lo stesso volume integrato (−24 LUFS come le altre) perché la stanza resti la stessa.
Nota sui fumi: rispetto a `BACKLOG` 3.5 il grano d'incenso diventa l'apertura (è quello che la storia le fa già comprare), e per le
domande su di sé entra l'artemisia (tradizione divinatoria, già nell'erbario); `lore/corso/concetti/` deciderà se tenerlo.

## 9. Che cosa dà in gioco, e che cosa non toglie mai

Non dà punti, monete né aiuti nella lettura, e soprattutto nessun premio quando il fumo «combacia» con la domanda: quello trasformerebbe
l'intuizione in un quiz. Dà: le scene con le streghe (ognuna +1 di legame con chi insegna, come le lezioni di Ortica); il conto dei riti
e dei fumi per l'interesse «fumi e sacchetti» (`BACKLOG` 6); una pagina **«I miei fumi»** nel grimoire con i vasetti, chi li ha dati e quante
volte li ha accesi; e, dopo la mirra, una breve scena di chiusura in cui Malva le dà il braciere di ferro a tre piedi della levatrice di
allora («Era di una che bussava più forte di te.»): da quel giorno nel rito si vede quel braciere, e sta sul focolare della sua capanna.
**Non toglie mai:** non consuma l'incenso degli Esami (`state.tools.incense` resta suo), né le erbe della dispensa, né monete; non si
può sbagliare; non blocca la lettura oltre i secondi dichiarati; non conta i giorni saltati.

## 10. Dati e stato

`state.rite`, normalizzato all'avvio con i valori di default (`normRite`, come `normGarden`):
`learned: []` (in ordine: grano, rosmarino, lavanda, alloro, artemisia, mirra), `day: {}` (id → giorno della lezione), `uses: {}`
(id → volte acceso; le tracce d'aiuto spariscono a 3), `count: 0` (riti fatti; respiri 3 fino a 5, poi 2), `since: 0` (riti dall'ultima
lezione), `last: null` (`{ smoke, at }`, per il velo e la stessa seduta), `history: []` (`{ at, ambito, smoke }`, al massimo 60),
`mirror: -3` (count dell'ultimo specchio), `fidget: 0` (tocchi a vuoto nei respiri), `brazier: false`.
Flag e registro (`core/extras.js`, catena con `after`, come `garden.lesson.*`): `rite.<id>.open` (la può prendere), `rite.<id>`
(fatta). Condizioni, tutte su ciò che ha:
(1) **grano**, Malva, `malva.hearth`: capitolo 1 dopo `c1.grimoire` (`{ not: { stepIn: ['c1.malva','c1.read','c1.shop','c1.back','c1.deliver','c1.cottage','c1.grimoire'] } }`) oppure `{ chapterMin: 2 }`.
(2) **rosmarino**, Malva, al focolare: solo la catena. (3) **lavanda**, Malva, al focolare: `{ any: [lavanda in dispensa ≥ 1, { chapterMin: 3 }] }`;
senza la sua, Malva le dà la propria («Questa è mia. L'anno prossimo te la secchi da te.»). (4) **alloro**, Ginepra al focolare di Malva:
`{ flag: 'met.ginepra' }`. (5) **artemisia**, Ortica, `forest.ortica_hut`: `{ spread: 'ppf' }`. (6) **mirra**, Edera, prima cantina: `{ spread: 'celtic' }`.
Riga nel grimoire, per esempio: «Malva ha un mazzo di rosmarino da darmi, al suo focolare.»
**Partite vecchie:** senza `state.rite` le letture vanno come oggi; la prima lezione compare nel registro appena vale la sua condizione,
anche a chi è al capitolo 3, e il resto arriva al ritmo del §7. Nessuna lettura chiede il rito prima della prima lezione.
**Dove si innesta:** `systems/reading.js` (al posto di `wait(scr, 'Mescolo')`, se `learned` non è vuoto: `wait(scr, 'Preparo il tavolo')` e
`call('rite.run', { scr, ambito, question })`); `ui/selfread.js` dopo il tema (la domanda è nota) e prima di «Quante carte?»;
`systems/free.js` prima della stesa (domanda: «Pensa a quello che vuoi chiedere alle carte.»). Nuovi file: `data/rite.js` (fumi,
testi, colori, piste), `glue/rite.rules.js` (puro: prossima lezione, respiri, specchio, riconoscimento del tratto, con test),
`glue/rite.js` (registro, servizi), `ui/rite.js` (la scena), `data/story/scripts/rite.js` (le sei scene). Suono: un `cueFor('rite.<fumo>')`
in `tracks.js`, `fire` e `wind` già in `beds.js`, `knock` e `catch` come ricette in `sfx.js`.

## 11. La versione più piccola che vale la pena costruire

Lezioni 1–3 (grano, rosmarino, lavanda), il rito in `reading.js` e in «Leggi le tue carte», la pulizia col velo, la scelta tra tre
vasetti, i due gesti più facili (giù poi di lato, giù piano) con l'alternativa a tocco, lo specchio senza il parere dei maestri.
Si costruisce con quello che c'è: le musiche `consolation` e `swan` sono già nel gioco, serve solo il motivo d'apertura. Si prova
dal telefono in una settimana di letture vere.
**Dopo, in quest'ordine:** alloro, artemisia e mirra con le loro scene e musiche (dopo la prova d'ascolto alla cieca); il parere
dei maestri sotto lo specchio; la battuta del cliente sull'odore; `free.js` e il finale; la pagina «I miei fumi» e il braciere sulla
capanna; per ultimo, dopo una lezione, un cliente generato con una domanda che chiama il fumo nuovo (6 volte su 10, solo il successivo).

## 12. Dove può fallire

- **Il rito cresce troppo piano.** Chi legge poco resta giorni col solo grano, e la scelta, cioè il cuore, arriva solo dalla seconda
  lezione. Ce ne accorgiamo dalla storia: giorni tra la lezione 1 e la 3. Se sono più di cinque, la lezione 2 si apre subito dopo la 1.
- **Le lezioni stanno in posti diversi.** Ortica nel bosco e Edera nelle cantine possono restare non prese, e la catena si ferma lì.
  Lo vediamo da quanto resta aperta una voce del registro; la cura è lasciare che la catena salti una lezione ferma da tre giorni.
- **Venti secondi a ogni lettura** con cinque clienti di fila. La regola della stessa seduta (12 s) dovrebbe bastare. Contiamo i tocchi
  a vuoto durante il respiro (`fidget`): se dopo dieci riti sono più di due per rito, il respiro scende a uno.
- **I gesti su un telefono vero:** il dito che scorre la pagina, il gesto «indietro» di iOS dal bordo, la mirra tenuta e scambiata
  per altro. La zona sta lontana dai bordi, ma nessuno strumento prova un telefono: lo prova Andrea.
- **La parola sul vasetto letta come regola:** se sceglie leggendo «riparo» e non sentendo, è un quiz con un'altra faccia (lo sapremo
  solo chiedendoglielo). **Le musiche già sentite altrove** portano il loro posto (`gymnopedie` è il titolo): lo dice la prova alla cieca.
- **Il punto più debole:** tutto il valore sta nella sensazione che il rito «sia suo perché qualcuno gliel'ha dato», e questo regge
  solo se le sei scene sono scritte bene e arrivano nel momento giusto. Se le scene sembrano tutorial travestiti, resta un rito
  lento con un menù di fumi, e niente di più. Lo capiremo dalla prima settimana: se dopo il rosmarino lei ne parla come di «quello di Malva», funziona.
