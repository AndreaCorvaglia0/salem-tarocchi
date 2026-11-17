# Proposta C: «A orecchio, prima del nome»

## 1. L'idea in tre righe

Lei non sceglie «un incenso»: sceglie un'**aria**. Dopo il respiro, sopra il braciere ci sono cinque arie senza nome (un colore di luce, un modo di muoversi del fumo, dodici secondi di musica vera) e lei ci passa in mezzo col dito, fermandosi dove la domanda le sembra a casa. Solo quando ha scelto il gioco dice che cosa brucia («Quest'aria è la mirra.») e il segno che traccia nel braciere lo accende.
Che cosa la distingue: la percezione viene prima del sapere, sempre. Il nome si impara perché arriva *dopo* una cosa sentita e scelta da lei, molte volte; e il gioco vede che l'ha imparato senza mai chiederlo, quando lei traccia il segno giusto prima che le venga mostrato.

## 2. La sequenza, secondo per secondo (la prima volta)

Dove: un overlay a tutto schermo (`openOverlay`, `position:fixed`, `touch-action:none` sullo stage: lì dentro non scorre niente, quindi nessun gesto litiga con la pagina). Si apre dopo che la domanda è stata detta: in `reading.js` dopo «Mescolo» e prima della pesca; in `selfread.js` dopo `theme()` e prima di «Quante carte?»; in `free.js` prima della scelta della stesa. I cinque spezzoni si caricano già dall'apertura della schermata di lettura (vedi 8).

| t (s) | Schermo | Dito | Suono | Testo |
|---|---|---|---|---|
| 0,0 | l'overlay sale in 0,6 s; stanza scura, braciere al centro basso con un carbone che pulsa piano (1 Hz) | — | la musica della lettura scende a 0 in 2 s; resta la brace (`fire`) a 0,35 | in alto, la domanda (vedi storyboard 1) |
| 0,6 | | | | sotto il braciere: «Tieni il dito sul carbone finché si accende.» |
| ~2,5 | un anello d'oro si riempie intorno al dito in 1,0 s; se il dito si sposta di più di 20 px l'anello si svuota | preme e tiene | `ctx.resume()` qui: è un gesto vero | |
| ~3,5 | il carbone prende; sale una colonna dritta di fumo grigio-argento (artemisia), la luce della stanza diventa neutra, un grigio caldo | lascia | **il motivo d'apertura**, 4,5 s (sempre lo stesso) | l'indicazione sparisce |
| 5,0 | la colonna si apre in un anello di fumo al centro (y 380) | — | | «Ascolta il respiro, e intanto pensa alla domanda.» |
| 6,0–27,0 | **tre respiri**, 7 s l'uno: l'anello si allarga in 3 s (raggio 70→150 px) e si stringe in 4 s; tre puntini sotto l'anello si accendono uno per respiro. Se c'era la tinta della lettura precedente, ogni espirazione ne porta via un terzo | niente da fare: lo stage ignora i tocchi | la brace sale di 3 dB nell'inspirazione e torna giù | resta la riga del respiro |
| 27,0 | l'anello si scioglie; sopra il braciere, su un arco, si accendono **cinque braci piccole** una dopo l'altra (0,15 s l'una) | | | «Cerca col dito, sopra il fuoco, l'aria che ha questa domanda.» |
| 28,0 → ~48 | il dito scorre: la luce della stanza e il fumo cambiano **con continuità** sotto il dito; la brace più vicina si illumina | trascina dove vuole nella fascia y 140–470; anche un tocco su una brace porta lì (scivolata di 0,6 s) | sopra una brace, la sua musica; **tra due braci, silenzio di musica e solo il fuoco** (vedi 8) | |
| ~48,0 | il dito si alza: l'aria scivola in 0,5 s sulla brace più vicina e ci resta, viva | alza | la musica di quella brace continua | |
| 48,8 | compare, in basso, un pulsante (con l'animazione d'arrivo della guardia: è toccabile da 49,45) | se vuole, riprende a cercare: il pulsante sparisce e torna 0,8 s dopo il prossimo sollevamento | | pulsante: «Resto in quest'aria» |
| ~50,5 | le altre quattro braci si spengono (0,4 s); in alto, in corsivo a mano, il nome | tocca | gli altri quattro spezzoni si fermano | «Quest'aria è la mirra.» |
| 51,5 | dentro il braciere un segno di fumo si disegna da solo e ricomincia ogni 1,6 s | | | sotto: «Traccia il suo segno nel braciere: in giù, tieni fermo, poi lascia.» |
| ~54–55 | il dito traccia: una scia di brace segue il dito | traccia | | |
| ~55,0 | **accesa**: il fumo del colore scelto sale pieno (2,5 s), la luce si apre all'atmosfera intera | | lo spezzone passa in 3 s al brano intero, dallo stesso punto | il nome resta |
| 57,5 | | | | pulsante: «Comincio a leggere» (toccabile da 58,15) |
| ~59,5 | l'overlay scende in 0,6 s; la lettura comincia nell'aria scelta | tocca | il brano continua per tutta la lettura | |

**Totale dichiarato, prima volta: 60 s** (da 45 s se va dritta, a 90 s se esplora molto). Le prime tre volte non c'è modo di saltarlo.

Se dopo le braci non tocca nulla per 12 s, le cinque braci pulsano una volta, da sinistra a destra: niente testo, nessuna brace suggerita più delle altre.

## 3. La ventesima volta

Si accorcia in tre gradini, contati su `rite.n` (riti completati):

- **1–3:** tutto come sopra, tre respiri, nessuna uscita.
- **4–9:** due respiri (14 s); la riga «Cerca col dito…» sparisce dalla quarta volta (le braci bastano); la riga del segno compare solo per un fumo acceso meno di due volte. Compare in alto a destra un piccolo link: «Leggo senza fumo».
- **10 e oltre:** un respiro solo; niente pulsante «Resto in quest'aria»: quando il dito si alza su una brace il braciere è già pronto, e **il segno tracciato è la scelta**. Il segno disegnato da solo compare solo se lei esita 2 s; il nome compare *dopo* l'accensione, più piccolo.

Ventesima volta, al secondo: tiene il carbone 0–1,0; motivo 1,0–5,5 dentro l'unico respiro 1,0–8,0; le braci compaiono a 6,5 durante l'espirazione; cerca e si ferma 8,0–11,0; traccia 11,0–12,5; fumo pieno 12,5–14,0 con il nome; «Comincio a leggere» a 14,0, toccabile a 14,65. **Totale dichiarato: 16 s** (da 13 a 22).

Che cosa resta sempre: il gesto e il motivo d'apertura, un respiro, le arie senza nome, il segno. Che cosa sparisce: le istruzioni, il pulsante di conferma, il segno mostrato. Il passaggio tra le arie non si accorcia mai: è il cuore.

## 4. I gesti

| Gesto | Dove | Che cosa significa | Come si riconosce | Alternativa |
|---|---|---|---|---|
| **Tenere** il carbone | cerchio di 64 px sul carbone (195, 600) | aprire: lo stesso gesto ogni volta, il corpo impara «adesso comincio» | `pointerdown` dentro, 1000 ms con spostamento < 20 px | nessuna serve: è un tocco lungo, sempre possibile |
| **Cercare** l'aria | fascia y 140–470, tutta la larghezza | sentire prima di sapere | conta solo la x: `p = clamp((x − 55) / 70, 0, 4)`; la y è libera | toccare una brace (bersaglio 64×64) |
| **Tracciare** il segno | cerchio di raggio 120 px intorno al braciere (195, 600); il tratto può uscirne | l'elemento del fumo, con la mano | vedi sotto | dopo due tratti troppo corti, o 6 s senza tratto, compare il pulsante «Accendo» |

I cinque segni sono quelli di `docs/ARRIVO.md` (i triangoli alchemici ridotti a un tratto):

| Fumo | Elemento | Segno | Riga sotto il nome |
|---|---|---|---|
| cannella | fuoco | un tratto in su | «Traccia il suo segno nel braciere: un tratto veloce verso l'alto.» |
| incenso | aria | in su, poi di lato | «Traccia il suo segno nel braciere: in su, poi di lato.» |
| rosa | acqua | un tratto in giù | «Traccia il suo segno nel braciere: un tratto lento verso il basso.» |
| salvia | terra | in giù, poi di lato | «Traccia il suo segno nel braciere: in giù, poi di lato.» |
| mirra | lasciar andare | in giù, tieni, solleva | «Traccia il suo segno nel braciere: in giù, tieni fermo, poi lascia.» |

Riconoscimento (largo, conta la direzione): si registrano i punti dal `pointerdown` al `pointerup`. Tratto totale < 40 px = tocco, non accende. Primo tratto: dall'inizio al punto con la y più lontana; «su» se dy < −40, «giù» se dy > 40, con un margine di ±35° dalla verticale. Secondo tratto: da quel punto alla fine; «di lato» se |dx| ≥ 40 e |dx| > |dy|. «Tieni» se negli ultimi 600 ms prima del sollevamento il dito si è mosso meno di 12 px. Classi: su = fuoco, su+lato = aria, giù = acqua, giù+lato = terra, giù+tieni = mirra (se c'è il lato, vince il lato). La velocità non si controlla: «veloce» e «lento» sono un significato, non una prova.

**Il segno accende sempre l'aria in cui lei si trova**, qualunque cosa abbia tracciato: non si sbaglia un rito. La classe serve solo a due cose: se coincide e il segno non era mostrato, conta come «riconosciuta a orecchio» (vedi 7); se non coincide, dopo l'accensione il segno giusto si disegna da solo nel fumo, una volta, in 1,5 s, senza nessuna parola.

Guardia sui tocchi: nessun gesto passa per un `button`, quindi i 650 ms non li toccano; i due pulsanti («Resto in quest'aria», «Comincio a leggere») hanno l'animazione d'arrivo. Nel rito **non si usa mai `holdTaps`**, perché blocca anche i `pointerdown` e ucciderebbe il tocco lungo e la ricerca.

## 5. La pulizia delle energie

È dentro il respiro, non dopo. Alla fine di ogni rito la stanza del gioco tiene una **traccia della tinta** dell'ultimo fumo (`rite.last`): quando l'overlay si apre la volta dopo, la luce non è neutra, è ancora un po' mirra, o un po' rosa. L'artemisia accesa all'apertura sale, e **ogni espirazione porta via un terzo di quella tinta**: si vede il fumo vecchio uscire dall'alto dello schermo con l'anello che si stringe. Al terzo respiro la stanza è grigio caldo, neutra.

Perché non è un passo in più: non chiede niente al dito, avviene nei secondi in cui lei sta già respirando. E ha una ragione che si sente anche senza crederci: per sentire un'aria nuova bisogna prima togliere quella vecchia (chi prova i profumi annusa qualcosa di neutro tra un profumo e l'altro). Tra le braci c'è lo stesso principio in piccolo: il silenzio tra due musiche è un piccolo pulirsi l'orecchio. La prima volta di tutte non c'è tinta vecchia: la stanza parte dal colore della notte del villaggio e il respiro porta via quella.

## 6. L'intuizione

**Come sceglie:** non vede nessun nome, nessuna parola, nessuna icona: solo cinque braci uguali su un arco. Ciò che distingue un'aria dall'altra è quello che succede quando il dito ci va sopra. Si ferma dove vuole, quante volte vuole; la scelta è alzare il dito e dire «Resto in quest'aria» (dalla decima volta, tracciare il segno).

**Come il gioco la onora:** l'aria che ha scelto resta per tutta la lettura (il brano intero, il colore in cima alle schermate `sxread`, `sr`, `sxfree` con una sfumatura radiale al 35%, un filo di fumo nel suo colore accanto alla domanda in testa); nella lettura per sé la voce del diario porta il fumo («con la mirra», un pallino del suo colore in `ui/readings.js`). Le carte e le risposte non cambiano: il fumo non trucca la lettura.

**Lo specchio dopo** (una riga sulla schermata finale, prima di «Chiudo il libro» o di «Tieni nel diario»; al massimo una al giorno, e sempre la prima volta che accende un fumo). L'ambito della domanda c'è già (`ambito` del cliente, `q.ambito` del tema); il fumo della tradizione per ambito è amore→rosa, casa→salvia, lavoro→cannella, se→incenso, altri→mirra (`docs/BACKLOG.md` 3.5, provvisorio).
- Se coincidono: «Per una domanda d'amore hai acceso la rosa, la stessa che avrebbe acceso Malva.»
- Se no: «Per una domanda d'amore hai acceso la mirra, quindi questa domanda ti è sembrata più un addio che una promessa.» Sotto, un pulsante leggero: «Che cosa avrebbe acceso Malva?» → Malva: «Per l'amore io accendo la rosa e non ci penso due volte. Però se la storia sta finendo, la mirra ci sta, e lo sai meglio tu di me.»
- Quadro generale senza ambito: solo «Hai letto con la mirra accesa.» la prima volta, poi niente.

**Quando l'orecchio e la tradizione non sono d'accordo, e lo restano:** se per lo stesso ambito sceglie lo stesso fumo «diverso» tre volte, quel legame diventa suo: si scrive nel grimoire, alla pagina del fumo, in prima persona («Per me la mirra va bene anche per l'amore, quando qualcosa sta finendo.») e da lì lo specchio non glielo fa più notare. La tradizione è un confronto che arriva dopo, mai una correzione; e dopo tre volte cede il posto alla sua.

## 7. Imparare quale incenso quando

Succede per associazione, in tre legami che si formano in momenti diversi, senza nessuna domanda:
1. **aria → nome**: ogni accensione mette il nome subito dopo una cosa sentita e scelta. È il legame più forte perché la scelta è sua.
2. **nome → elemento**: il segno nella mano, ogni volta (e le cinque righe sotto il nome finché servono).
3. **nome → quando**: lo specchio, la risposta di Malva, la pagina del grimoire. Arriva per ultimo, apposta.

**Come il gioco vede che l'ha imparato:** dalla decima volta il segno non è mostrato. Se lei, ferma su un'aria, traccia subito il segno di quel fumo, l'ha riconosciuto **a orecchio** (`rite.smokes[id].ear += 1`). Con `ear ≥ 2` la pagina del grimoire scrive «La riconosco a orecchio.» È una verifica vera e non è un quiz: non c'è niente da sbagliare, il fumo si accende comunque.

**Quando sa dire «la mirra è per…»:** per i due o tre fumi che sceglie più spesso, stimo che riconosca l'aria dopo 3–4 accensioni di quel fumo e dica a che cosa serve dopo 2–3 specchi su quel fumo: in tutto **10–12 letture**. Per un fumo che non sceglie mai, questo rito **non** glielo insegna: lo sente ogni volta che passa col dito, ma senza nome. È il prezzo onesto della mia posizione; il nome dei fumi mai scelti lo dà il ramo «Fumi e sacchetti» con Malva, non il rito.

## 8. Suono, colore, luce

**Ordine sull'arco** (da sinistra): cannella, incenso, rosa, salvia, mirra. Vicini si somigliano per una leva (tempo o modo), così passare dall'uno all'altro sembra un andare, non un saltare.

| Fumo | Ricetta del brano (si cerca e si misura, non si compone) | Luce della stanza | Fumo |
|---|---|---|---|
| apertura (artemisia) | una ciotola o campana registrata, colpita una volta, 4,5 s, CC0; **mai** usata altrove nel gioco | grigio caldo neutro, `#3a3530` | colonna dritta e sottile, argento-verde `#c8d2c0`, sale a 40 px/s |
| cannella | moderato (96–112 bpm), maggiore, staccato leggero, arpa o pizzicati, intervalli ampi | oro-arancio `#b8642a` | sale svelto (70 px/s), a scatti, con scintille; volute strette |
| incenso | piano solo nel registro alto, poche note, molto spazio, né allegro né triste | bianco-azzurro `#9fb4c8` | dritto, sottile, sale altissimo (55 px/s), quasi senza curve |
| rosa | lento (60–72), maggiore, legato, violoncello o piano morbido, registro medio | rosa ambrato `#a8606a` | lento (30 px/s), volute grandi e tonde |
| salvia | lento, maggiore, grave, timbro scuro, quasi fermo | verde-grigio `#5f7058` | basso, si stende di lato (18 px/s in salita, 25 px/s di lato) |
| mirra | lento (50–60), minore, legato, grave; il brano scelto si schiarisce verso la fine | viola-bruno `#4a2f45` | pesante: sale 120 px e ricade piano verso il braciere |

I brani: per ogni fumo uno, scelto con il metodo di `lore/metodo/progettare-per-i-sensi-senza-averli.md` (candidati da Musopen e Kevin MacLeod, misura di tempo, modo, altezza, intensità, poi Andrea e lei alla cieca). Regola mia, importante: **nessuno dei cinque brani suona altrove nel gioco** (quindi non `gymnopedie`, non `clairdelune`, non i brani scuri delle cantine), altrimenti l'associazione si sporca.

**Gli spezzoni:** da ogni brano si taglia, nel punto più tipico, uno spezzone di **12,0 s, mono, AAC 64 kbit/s** (circa 96 KB) con l'anello già cucito (l'ultimo secondo sfuma nel primo) e il volume portato a −24 LUFS come la musica; più il motivo d'apertura (circa 40 KB). In tutto ~520 KB. Si scaricano e si decodificano (`fetch` + `decodeAudioData` in `AudioBuffer`) appena si apre la schermata di lettura: prima della ricerca ci sono almeno 27 s la prima volta e 8 s la ventesima. Decodificati pesano ~2,3 MB l'uno a 48 kHz, ~12 MB in tutto, liberati alla fine del rito.

**Come suonano sotto il dito (niente caos):** all'inizio della ricerca partono insieme cinque `AudioBufferSourceNode` in anello, ognuno nel suo `GainNode` a 0, tutti in un bus del rito. Il dito muove solo i guadagni, quindi non si carica niente e non si salta mai. Con `k` = brace più vicina e `d = |p − k|` (0…0,5):
- `d < 0,18`: la brace `k` a pieno (il suo livello, 0,55 di base);
- `0,18 ≤ d < 0,40`: la brace `k` scende a coseno fino a 0;
- `d ≥ 0,40`: **nessuna musica**, solo la brace del fuoco, che sale da 0,35 a 0,6.
Tutte le altre sono a 0: **non suonano mai due musiche insieme**. Ogni cambio di guadagno passa per `setTargetAtTime(…, 0.06)`, niente scatti. La luce e il fumo invece si mescolano in continuo (interpolazione lineare dei colori e dei parametri del fumo su `p`): l'occhio scivola, l'orecchio fa un passo e un respiro di silenzio. Su Android, entrando nella zona piena di una brace, `navigator.vibrate(8)`.

**All'accensione:** lo spezzone scelto continua 3 s mentre `tracks.js` fa entrare il brano intero dallo stesso punto (inizio dello spezzone nel brano + posizione nell'anello); serve una funzione piccola nuova, `tracks.seek(id, secs)`, che scrive `pos[id]` prima di `setCue`. Poi il cue della lettura è quello del fumo. Con la musica spenta nelle impostazioni, il rito resta intero ma muto: luce e fumo bastano a distinguere le arie.

**Che cosa cambia nella stanza durante la lettura:** il colore in cima alle schermate, il filo di fumo accanto alla domanda, il brano; la brace sotto a 0,25. Alla fine della lettura la tinta resta salvata (`rite.last`) per la pulizia della volta dopo. Con «riduci movimento», il fumo diventa una sfumatura ferma e il respiro cambia d'intensità invece che di misura.

## 9. Che cosa dà in gioco, e che cosa non toglie mai

Dà: l'aria della lettura; la **pagina di ogni fumo nel grimoire**, che nasce alla prima accensione (colore, segno, le volte in cui l'ha acceso e per che cosa, la riga di Malva quando l'ha sentita, la sua «tradizione» se c'è, «La riconosco a orecchio.» quando vale); `stats.rites`. Quando ha acceso tutti e cinque i fumi, alla capanna compare un braciere (la casa che cresce). Niente monete né esperienza legate alla scelta.
Non toglie mai: non consuma `tools.incense` (quello degli Esami resta un'altra cosa), né la dispensa; non cambia le carte, le risposte o il punteggio; dalla quarta volta non blocca la lettura («Leggo senza fumo»); non commenta mai una lettura fatta senza fumo; lo specchio non giudica e non torna più di una volta al giorno.

**Alla soglia:** sulla schermata del titolo, sotto la carta di oggi, un tocco facoltativo «Accendo l'artemisia»: tenere il carbone, il motivo, un respiro, poi si torna. **12 s.** Niente scelta d'aria: serve solo a legare il motivo all'attenzione anche nei giorni senza lettura.

## 10. Dati e stato

```
state.rite = {
  v: 1,
  n: 0,            // riti completati (decide i gradini della sezione 3)
  last: null,      // id dell'ultimo fumo acceso: la tinta da pulire alla volta dopo
  smokes: {},      // id -> { lit: 0, ear: 0, told: 0 }  (accensioni, riconosciuti a orecchio, righe di Malva sentite)
  mine: {},        // ambito -> id: la sua tradizione, dopo tre scelte uguali e diverse dalla tradizione
  mirrorDay: null, // 'YYYY-MM-DD' dell'ultimo specchio
  log: [],         // ultime 60: { at, where: 'consult'|'self'|'free'|'soglia', ambito|null, smoke|null }  (null = senza fumo)
}
```
Default in `fresh()`; una partita vecchia, senza `rite`, riceve l'oggetto vuoto dalla fusione con i default e parte da `n = 0`: anche chi è al capitolo 4 fa la prima volta intera. `log` serve anche alle verifiche della sezione 12. Le letture per sé salvate prendono un campo `smoke` (assente nelle vecchie: nessun pallino). I dati dei fumi stanno in un file solo, `src/data/rite.js`: `{ id, nome: 'la mirra', elemento, segno, brano, attacco (s), spezzone, colore, fumo: { sale, lato, ricade, volute, scintille }, ambito, rigaMalva }`.

## 11. La versione più piccola che vale la pena costruire

Prima di tutto, la **prova d'ascolto alla cieca** (una paginetta: tre spezzoni senza etichetta, «a quale aria lo daresti?»), perché senza spezzoni giusti questa proposta non regge.
Poi, solo in «Una lettura per me»: apertura (tenere + motivo), tre respiri con la pulizia, **tre arie** (cannella, rosa, mirra: tre leve diverse) sull'arco con il silenzio in mezzo, «Resto in quest'aria», il nome, **un segno unico** (qualunque tratto accende), l'aria per tutta la lettura, la prima riga di specchio, `rite.n`, `rite.last`, `rite.smokes[id].lit`. Circa 40 s la prima volta.
Dopo, in quest'ordine: le cinque arie e i cinque segni; le letture per i clienti e il mazzo vero; i gradini dell'abitudine e «Leggo senza fumo»; il riconoscimento a orecchio e le pagine del grimoire; la sua tradizione; la soglia; il braciere alla capanna.

## 12. Dove può fallire, e come ce ne accorgeremmo

- **Gli spezzoni sembrano una radio che cerca la stazione**, non arie. È il punto più debole, e nessuno di noi lo sente. Ce ne accorgiamo con la prova alla cieca (se lei non distingue tre spezzoni su tre, si cambiano prima di costruire il resto) e dal telefono di Andrea.
- **Il silenzio tra due braci sembra un difetto audio.** Se Andrea lo sente come un buco, la zona muta si stringe da 0,40–0,50 a 0,45–0,50 e la brace del fuoco sale di più: è un numero, si cambia in un attimo.
- **L'arco diventa una manopola «chiaro–scuro»:** lei sceglie quanto buio, non quale aria. Si vede nel `log` se usa quasi solo gli estremi; si chiede a lei una volta: «Come hai scelto?».
- **Sempre lo stesso fumo:** è legittimo, ma allora impara un fumo solo. Se dopo 15 riti un fumo supera il 70% del `log`, lo sappiamo; il rito non la spinge, ci pensa il ramo di Malva.
- **Il cercare è troppo fine col pollice:** se nel `log` (aggiungere il numero di passaggi tra braci) va sempre col tocco sulle braci, il trascinare non serve e si può togliere senza perdere l'idea.
- **iPhone:** il contesto audio si sveglia solo con un gesto (lo è il tocco lungo sul carbone); col tasto muto l'audio web tace e il rito resta solo luce e fumo. Va provato su un telefono vero: noi non possiamo.
- **Telefono vecchio:** se gli spezzoni non sono decodificati quando le braci compaiono, quelle braci sono più fioche e mute finché non sono pronte; si misura il tempo di decodifica e lo si scrive in console.
- **Il nome non resta:** se dopo 20 riti `ear` è ancora 0 per i fumi che sceglie spesso, il nome arriva troppo in fretta dopo la scelta o il segno lo copre; si allunga la pausa tra nome e segno.
- **60 s la prima volta pesano davanti a un cliente:** se Andrea lo sente lungo, i respiri della prima volta passano da tre a due (−7 s) prima di toccare tutto il resto.
