# Registro da verificare (sessione del 17–18 novembre 2026)

Per chi ricontrolla il lavoro (Andrea ha chiesto una revisione con Fable). Ogni voce: che cosa è stato fatto,
dove, che cosa il capofila ha verificato davvero, che cosa no, e i dubbi. «Verificato» vuol dire visto o
eseguito, non letto in un resoconto. Nessuno ha provato un telefono vero né ascoltato l'audio.
Lo stato della coda è in `notes/STATO.md`.

Come guardare: `git show <commit> --stat`; gioco ospitato https://andreacorvaglia0.github.io/salem-tarocchi/;
`npm test`; `node scripts/lore.mjs check`; schermate in `/home/claude/shots/…` (solo sulla macchina della
sessione, non nella repo).

---

## 1. Regola «lei vede solo quello che sa»

- **Commit:** regola scritta; biglietti e note dei luoghi in `602c0df`.
- **Cosa:** principio `lore/principi/vede-solo-quello-che-sa.md`; righe in `AGENTS.md`, `docs/KIT.md`; lezione 34 in
  `docs/LEZIONI.md`. Biglietti delle missioni senza premi (`src/ui/missions/titles.js`), tipo solo se lei lo sa,
  7 presentimenti; note dei luoghi `src/data/world/notes.js` + `src/ui/placenotes.js`, «?» sulla mappa
  (`src/ui/sketch.js`, opzione `unnamed`); test `tests/knows-only.test.mjs`.
- **Verificato:** test verdi; quattro schermate (carta di una prova, posto sconosciuto, posto con tre note, «?»
  sulla mappa) guardate dal capofila; costruito da copia pulita e pubblicato (gh-pages 2896b60).
- **Non verificato:** tutti i 34 biglietti uno per uno a schermo (l'agente ne ha fotografati uno per tipo); le
  ~110 note dei luoghi lette dal capofila solo nel resoconto, non tutte a schermo.
- **Dubbi:**
  - Le note dei luoghi sono scritte dall'agente: controllare che nessuna dica una cosa che lei non ha vissuto in
    *tutti* i rami (alcune condizioni usano `past(step)` o flag di un ramo).
  - Il test sui nomi dei retroscena si basa su un elenco ricavato più «Ruta» a mano: può lasciar passare un
    fatto nascosto detto senza nomi.
  - La riga di Ortica «mi ricorda una che conoscevo da giovane» (voce 3) e la scena di Malva del rito («la
    levatrice di allora», voce 2) sfiorano i retroscena: accettate dal capofila come cose che il personaggio dice
    di sé, da confermare.

## 2. Il rito dell'incenso

- **Commit:** `3b8bc48` (gh-pages 2704fe8). Progetto: `notes/rito/PROGETTO.md`; costruzione: `notes/rito/costruzione.md`;
  musica: `notes/rito/musica.md`.
- **Cosa:** rito prima di «Una lettura per me» e delle letture ai clienti (`src/ui/rite/`, `src/glue/rite*.js`,
  `src/data/rite.js`); 5 arie con musiche vere (Kevin MacLeod, CC BY 4.0) e note vere (University of Iowa);
  pagina di ascolto alla cieca `ascolto/`.
- **Verificato:** test verdi (26 nuovi); sei schermate del percorso guardate dal capofila; la pagina `ascolto/`
  risponde 200 online.
- **Non verificato:** audio (gong, livelli, musiche); sensazione del respiro; fluidità su telefono (60 fps solo in
  Chrome senza GPU); pressione lunga e tasto silenzioso su iPhone.
- **Dubbi:**
  - Il respiro dalla decima volta dura 3,2 s per stare negli 8 s: forse troppo corto.
  - Il gong può suonare «tempio» più che Salem.
  - Le musiche sono **provvisorie**: scelte per misure (tempo, modo, brillantezza), non per ascolto. La coppia
    più vicina (cipresso–mirra) è la prima da controllare.
  - Nessuna voce nel registro `core/extras.js`: scelta dell'agente (i doni arrivano dentro il rito). Da valutare.
  - Il rito non c'è nella lettura libera (`systems/free.js`) né in quella del finale.

## 3. Mantenere le promesse (BACKLOG 1)

- **Commit:** `7213183` (gh-pages bdf2829). Decisioni: `lore/decisioni/proposte-2026-11-18-promesse.md`.
- **Cosa:** 11 risposte riscritte e circa 40 cambi di peso dei tratti (semi a caso 33/28/22/18, prima Coppe
  67%); 14 battute nuove che dipendono dall'affinità con le streghe; le nove domande della Lettrice ora escono
  (visita in sogno dopo il finale); fiducia = copia del legame; «Ricordamela» senza la risposta.
- **Verificato:** test verdi; schermate di «Ricordamela» dopo la modifica e delle battute di Ortica ed Edera.
- **Non verificato:** battute di Malva e di Ginepra, visita in sogno, `f.last`/`f.dawn` a schermo; le risposte
  riscritte non sono state lette tutte dal capofila nel gioco.
- **Dubbi:**
  - Coppe al 33,8% col seme 1, vicino al limite del test (35%): una scrittura futura gentile lo farà scattare.
  - Le porte delle prove (`trials.js`) pendono ancora verso il gentile: escluse dal conteggio a caso.
  - Debito tecnico: `progress.addTrust` dovrebbe chiamare `addBond` e `cond.js` leggere `bonds`; oggi `trust` è
    una copia tenuta allineata.
  - Le battute di Malva legate all'affinità arrivano a chi è oltre il capitolo 1 solo in scene ancora davanti.

## 4. Case riconoscibili (test dei lettori ingenui)

- **Commit:** `41ba213` (gh-pages 1429248). Note: `notes/village-test.md`, `notes/buildings.md`.
- **Cosa:** casa di Malva da strega; casa dei Proctor ricca e per bene; biblioteca con libri visibili; fumo
  colorato e bagliore verde (`scene/build.js`).
- **Verificato:** due giri di lettori ingenui (haiku, una schermata ciascuno): Malva e biblioteca fallite al
  primo, passate al secondo; bottega passata.
- **Non verificato:** le altre stagioni (tutte le schermate sono notte d'inverno); le domande 2, 4, 7–11.
- **Dubbi:** quartiere ricco/povero ancora ambiguo (l'inquadratura mescola i quartieri); le finestre calde di
  Malva e Proctor di notte si somigliano ancora un poco.

## 5. Collezioni: pietre e sibilla

- **Commit:** `7a28077` (gh-pages c3bf1a1). Progetto: `notes/collezioni.md` (sezione «Fatto»).
- **Cosa:** album «Pietre» (12) e «Sibilla» (36) nel grimorio; oggetti per terra con un riflesso tenue entro 3
  caselle; il ritrovamento non apre pagine (vola nel grimorio, una riga); prime parole di Edera e Ginepra alla
  prossima chiacchierata libera; regali in gruppetti che fanno una frase (bottegaio, becchino, Ortica, Edera,
  Ginepra, Tartufo); erbario: pagina automatica solo per la prima erba. Dati `src/data/{stones,sibyl,gifts}.js`,
  `src/data/world/finds.js`; logica `src/glue/collect*.js`; UI `src/ui/collect.js`; mondo `src/world/*/finds.js`.
- **Verificato dal capofila:** test verdi (597); sei schermate (album, pagina di pietra, pagina della sibilla);
  conteggi: 7 pietre per terra + 5 in regalo = 12; 19 figurine per terra + 17 in regalo = 36.
- **Non verificato:** telefono vero, il suono `pick`; le altre 18 schermate le ha guardate solo l'agente.
- **Dubbi:**
  - Le traduzioni dei versi tedeschi sulle carte sono dell'agente: da far controllare a chi legge il tedesco
    gotico. Carta 33: l'ultima parola del titolo è illeggibile (la pagina lo dice).
  - Sette pietre sono disegnate dal codice e stanno male accanto alle tavole antiche (l'ossidiana è un blocco
    di pixel): da rifare o da trovare in altre tavole. James Sowerby non raggiungibile (BHL 403, c82 scaduto).
  - Diritti del mazzo di Yale: stampa anonima c. 1890, quindi pubblico dominio; la scheda non dà una licenza
    esplicita.
  - Le prime parole di Edera arrivano solo quando lei la incontra (capitolo 3): chi trova una pietra prima non
    ha spiegazioni per un po'. Scelta dell'agente, ragionevole.
  - Nessuna voce in `core/extras.js`: un test dice che un salvataggio finito raggiunge tutti i 48 oggetti.
  - La pagina della pietra dice «Nessuna tavola antica: l'ho disegnata io.»: è lei che parla; da vedere se suona.

## 6. Libri in biblioteca (scritto, da approvare; niente codice)

- **Cosa:** `notes/libri/CONCETTO.md` (cos'è un libro, 13 libri in catalogo, come si guadagnano, che cosa
  sbloccano, 6 domande per Andrea); `notes/libri/tre-libri.md` (erbario di Salvi 1641 su Durante 1585; storia dei
  tarocchi «Il gioco e lo specchio»; libro dei sogni «Il dormiente» su Artemidoro), pagina per pagina.
- **Verificato dal capofila:** letta la prima metà dell'erbario (buona voce, fonti con numero di pagina).
- **Verificato dall'agente (resoconto, non ricontrollato):** scansioni Wellcome con marchio di pubblico dominio
  (Durante 1585, Ortus sanitatis 1491, Cortese 1561, Della Porta 1588, Scot, Hypnerotomachia); Internet Archive
  (Dolce 1565, Artemidoro 1547); Met 385140 (foglio di tarocchi c. 1500, pubblico dominio); testo di Josselyn.
- **Non verificato:** BHL rifiutato (403), Gutenberg giù (503); Fludd, Agrippa, Leonardi, il mazzo De Lakenhal;
  le figure da scegliere sulle scansioni (pietre nell'Ortus, minchiate, tavole dell'Hypnerotomachia).
- **Dubbi:**
  - Scritto a memoria dall'agente, da controllare: i quattro gradi di Galeno; che il tarocchino si giochi ancora
    a Bologna.
  - L'erbario ha una pagina sulla ruta con la nota a margine «Messa sulla soglia. Non è più entrato.»: la ruta è
    un'erba del gioco, ma «Ruta» è anche un nome dei retroscena; va bene finché la pagina parla della pianta.
  - Due libri «di fuori» datati dopo il 1692 (Waite, la storia dei tarocchi del 1913) arrivano dalla Lettrice: da
    decidere con Andrea.

## 6b. Imparare meglio (BACKLOG 2)

- **Commit:** `95eec8b` (gh-pages 500d95e). Piano: `notes/imparare.md`.
- **Cosa:** (2.1) nel ripasso una domanda con le sue tre parole e «Che carta è?»; (2.2) «Senza guardare» della
  carta di oggi conta come ripasso, e un giorno su tre la carta di oggi è una da ripassare; (2.3) «Prima di
  leggere: che idea porta questa carta?» nella lettura per sé, con «Leggo e basta»; (2.4) la Lettrice chiede di
  una carta già raccontata prima di girare le nuove.
- **Verificato dal capofila:** test verdi (610), una schermata (2.3) guardata; costruito da copia pulita.
- **Non verificato:** visita raggiunta nella storia (forzata dall'agente); la via «Pesco qui» del 2.3; il piè di
  pagina «Sì, è questa.»; partita intera.
- **Dubbi (dall'agente, condivisi):**
  - Sono tutte scelte fra tre: nessuna verifica «l'idea con parole sue».
  - Le risposte di 2.3 e 2.4 contano come «significato» e possono alzare la seconda stella di una carta che la
    Lettrice non ha ancora raccontato.
  - 2.4 propone la riga breve della scheda, non le parole esatte dette dalla Lettrice quella notte.
  - «Leggo e basta» non viene ricordato: la prova torna ogni lettura. Può dare fastidio: da sentire da lei.
  - Possibile difetto già esistente: nelle letture ai clienti le opzioni sbagliate possono essere idee di altre
    carte della stessa stesa (il 2.3 lo ha corretto solo per la lettura per sé).

## 6c. Le coppie della sibilla

- **Commit:** `610b172` (gh-pages 334528b). Piano: `notes/sibilla-coppie.md`.
- **Cosa:** dal album «Sibilla», «Gioca a coppie» (dopo 4 figurine e le prime parole di Ginepra): due figurine,
  una domanda, tre frasi o le sue parole; poi «Come si legge di solito» e Ginepra; tre giri al giorno contano
  (tacche sulle figurine). Più: `story/dialogue.js` non prende più lo spazio scritto in una casella (correzione
  del capofila, difetto trovato dall'agente).
- **Verificato dal capofila:** test verdi (619); tre schermate (tavolo, scelta, dopo).
- **Non verificato:** tastiera del telefono sopra la casella; tempo di un giro su una persona; lettori ingenui
  sulle frasi.
- **Dubbi:**
  - Per le coppie non scritte a mano una delle tre frasi coincide con «come si legge di solito»: si capisce qual è
    la «tradizionale». Non è un voto, ma si può ammorbidire.
  - Le letture tradizionali composte dal motore a volte stonano («Un inganno di cui ci si può fidare»); scritte a
    mano solo ~27 coppie.
  - Il gioco compare solo dopo le prime parole di Ginepra (scelta dell'agente, coerente con «vede solo quello che
    sa»): chi ha figurine ma non ha ancora parlato con Ginepra non lo vede.
  - Battute di Ginepra da leggere ad alta voce (fonte: proposto).

## 7. Interessi da strega (scritto, da approvare; niente codice)

- **Cosa:** `notes/interessi/PROGETTO.md`: quattro catene da sei missioni (Ortica erbe, Malva fumi e sacchetti,
  Edera pietre, Ginepra sibilla e giochi), tre gradi di abilità con un uso nella storia, incroci che non
  bloccano mai, prima fetta (erbe, tre missioni) con i file che servono. Canone nuovo segnato [p].
- **Verificato dal capofila:** letto il resoconto, non tutta la pagina.
- **Dubbi:** tre fatti reali della prima fetta non controllati (elencati nella pagina); le abilità delle pietre
  («una pietra in tasca trasforma il primo esame fallito in un secondo tentativo») toccano l'equilibrio delle
  prove: da misurare quando si costruisce.

## 8. Interessi, prima fetta: le erbe di Ortica

- **Commit:** `6c4861e`. Decisioni: `lore/decisioni/decisioni-2026-11-18.md`.
- **Cosa:** scena d'inizio da Ortica (quando l'orto è suo e ha un mazzetto fresco); missioni «A testa in giù»
  (trave), «Le scale del mulino» (mortaio: calendula e melissa), «Il fumo di Malva» (mazzo di salvia), una al
  giorno; il mugnaio in piazza col bastone nuovo; dispensa fresche/secche nell'orto; grado 1: opzione «[Le mie
  erbe]» nei rifiuti sulle malattie, con il cliente che torna a ringraziare; la salvia del rito diventa «la tua
  salvia». File: `src/data/interests/`, `src/glue/interests*.js`, `src/ui/interests/`,
  `src/data/story/scripts/interests.ortica.js`; chiavi `pantryDry`, `interests`; cond `interest`, `interestRested`.
- **Verificato dal capofila:** test verdi (632); quattro schermate (trave, mortaio, salvia, cliente malato);
  costruito da copia pulita.
- **Non verificato:** passeggiata intera nel mondo fino alla capanna; il cliente che torna (solo test); gesto a
  cerchio col dito (solo tocchi); telefono vero.
- **Dubbi:**
  - Il riquadro d'aiuto «Quando hai finito di leggere, tocca lo schermo…» (z-index 95) copre la cima delle
    schermate del trave e del mortaio (z-index 60), visto in una schermata: da controllare se capita anche giocando.
  - I mazzetti seccano in un giorno (nella realtà 2–4 settimane): nessuna riga dice la durata.
  - Il mazzo di salvia legato stretto da bruciare è un uso moderno contestato: qui è solo per portarlo, Malva
    sbriciola le foglie sulla brace.
  - La salvia regalo dopo quattro riti arriva ancora anche a chi sta facendo il ramo: prima il regalo, poi «tua».
  - Canone proposto: la schiena di Ortica, il mugnaio tre giorni in cima alle scale, la storia «della volpe e
    del parroco», la segatura dell'incenso.
  - L'opzione col rimedio compare solo se ha un'erba che guarisce già secca; senza, niente prestito (diverso dalla
    regola «la strega presta sempre», che vale per le missioni).

## 9. Lo scaffale dei libri

- **Commit:** `0ee9952` (gh-pages 0ef7d33). Costruzione: `notes/libri/costruzione.md`.
- **Cosa:** linguetta «Libri» nel grimorio e «Sfoglia» in biblioteca; lettore a pagine con figura, note a margine
  e ultima pagina «Che cosa è vero». Libri veri raccontati con parole nostre: Agrippa 1651 (sullo scaffale),
  Durante 1585 (da Ortica), Artemidoro trad. Lauro 1547 (alla porta della capanna, dalla vedova Bray), Scot 1665
  (deposito del tribunale), manoscritto Voynich (da Tartufo). Ogni libro letto lascia una nota o uno scambio.
- **Verificato dal capofila:** test verdi (641); tre schermate (scaffale, pagina con nota, pagina della verità).
- **Non verificato:** i regali di Ortica ed Edera nel browser (solo test); il volo del libro; telefono vero.
- **Dubbi:**
  - Wellcome ha risposto 403 a una richiesta di ritaglio: l'agente si è fermato (bene). Tutte le figure Wellcome
    vengono da richieste fatte prima.
  - Artemidoro e Scot: l'opera è di pubblico dominio, ma le scansioni (Google su Internet Archive, Boston College)
    non dichiarano una licenza; la pagina della verità dice «pubblico dominio».
  - Tre pagine di Scot sono parafrasi della tesi non controllate parola per parola sul testo.
  - Nota a margine nello Scot: «Comare Hale non è vecchia, e non è povera» (nomina un personaggio): da approvare.
  - Agrippa: la copia non ha il frontespizio; la prima pagina è «Al lettore».
  - L'anno 1888 del facsimile dell'Hypnerotomachia nei crediti è scritto a memoria.
  - Il Voynich arrivato a Salem nel 1692 è invenzione dichiarata nella pagina della verità.

## 10. Immagini delle pietre

- **Commit:** `809e9a6` (gh-pages 5b8154a).
- **Cosa:** eliotropio da J. G. Kurr, *The Mineral Kingdom*, 1859, tav. III (Internet Archive, copia Smithsonian,
  pubblico dominio secondo BHL); sei pietre (quarzo giallo, pietra di luna, occhio di tigre, ossidiana, quarzo
  rosa, pietra forata) dipinte al computer su carta (`scripts/stones-paint.py`, `stones-holed.py`), didascalia
  «Disegnata da me, sul modello delle tavole antiche.»; campo `drawn: true` in `src/data/stones.js`.
- **Verificato dal capofila:** foglio delle 12 immagini guardato; coerenti come album, ma le dipinte sono
  chiaramente un'altra mano (più lisce e lucide delle tavole).
- **Errore di processo del capofila:** pubblicato con **un test fallito** nella copia pulita: `collect.js`
  chiama il servizio `stones.pocket` che arriva con l'interesse di Edera (non ancora unito). Il richiamo è
  protetto da `has()`, quindi nel gioco non si rompe niente; il test statico fallisce finché Edera non viene
  unito. Regola aggiunta in `notes/STATO.md`.
- **Dubbi:** cercate e scartate: Popular Mineralogy (tavole III–V), Sowerby (occhio di gatto ≠ occhio di tigre;
  pitchstone ≠ ossidiana), Mawe 1815/1823, Blum 1834. Wikimedia ha risposto 429.

## 11. Interessi: le pietre di Edera (missioni 1–3)

- **Commit:** `8ac1bb4` (gh-pages 235f646).
- **Cosa:** scena d'inizio nella nicchia (dopo le prime parole di Edera sulle pietre e almeno 3 pietre);
  «La pietra della nonna» (cerca nelle cantine, lava al pozzo: il lapislazzuli); «Occhi chiusi» (sceglie una
  pietra di coraggio per il conestabile; Edera presta l'occhio di tigre se lei non ne ha); il conestabile il
  giorno dopo; «I cartellini» (scrive i nomi sotto le pietre in biblioteca). Grado 1 «In tasca»: una pietra di
  coraggio o protezione in tasca, una volta al giorno, ritira la risposta sbagliata che farebbe perdere un esame
  (non col Giudice).
- **Verificato dal capofila:** test verdi (654) in copia pulita, pubblicato solo dopo `# fail 0`; resoconto
  letto. Le schermate (35) le ha guardate solo l'agente.
- **Dubbi:**
  - Il grado 1 è più leggero del progetto per scelta dell'agente, con misure: con un secondo esame intero le
    sconfitte col conestabile scendevano dal 13,8% all'1,5%; con la versione costruita al 5,9% (Afflitta 36,9% →
    22,3%). Da confermare con Andrea.
  - La scena del conestabile il giorno dopo riusa l'id `enc.guard`.
  - Toccati file fuori dalle sue cartelle: `systems/exam.js` (gancio), `ui/collect.js`, due test condivisi.
  - Canone proposto: il lapislazzuli al collo di Edera, il conestabile che parla nel sonno, lo scaffale delle
    pietre in biblioteca, il raggio di luna nel pozzo vecchio.
  - Fatto da aggiungere a RESEARCH: il manto blu della Sacerdotessa nel mazzo del 1909.

## Altro fatto in questa sessione (senza codice di gioco)

- Backlog: sezioni 6 (interessi da strega) e 7 (libri); `docs/ARRIVO.md`; `docs/LEZIONI.md`; il sapere
  (`lore/sapere/`, 106 schede); documento di progetto riscritto (quindicesima versione).
- **Dubbio sul sapere:** le 106 schede non sono state rilette una per una dal capofila; il test controlla che il
  cerchio si chiuda, non che ogni «si dice» sia esatto.
