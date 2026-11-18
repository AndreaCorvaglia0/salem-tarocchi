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

## 5. Collezioni: pietre e sibilla (in corso)

- **Progetto:** `notes/collezioni.md`. Immagini sibilla: Yale, Beinecke, «Wahrsagekarten… Lenormand», Didot,
  c. 1890 (https://collections.library.yale.edu/catalog/10994633); 36 carte ritagliate dal capofila e
  controllate in ordine (`/home/claude/ext/sibilla/cards/`).
- **Stato:** agente interrotto dal riavvio del server dopo ~43 minuti, ripartito alle 7:28. Niente ancora
  committato.
- **Dubbi già noti:** diritti del mazzo di Yale (stampa anonima del 1890 circa, quindi pubblico dominio; la scheda
  ha solo la formula generica di Yale, non una licenza esplicita); quali pietre ha davvero Sowerby.

## 6. Libri in biblioteca (in corso, solo scrittura)

- **Cosa:** `notes/libri/CONCETTO.md` (a metà), `notes/libri/tre-libri.md` (da scrivere). Fonti antiche trovate dal
  capofila: Durante *Herbario nuovo* 1585 (BHL), Leonardi *Speculum lapidum* 1502 (Dresda, Public Domain Mark),
  Waite *Pictorial Key* 1911 (Wikisource).
- **Dubbi:** nessuna scansione aperta e guardata dal capofila; da verificare libro per libro.

## Altro fatto in questa sessione (senza codice di gioco)

- Backlog: sezioni 6 (interessi da strega) e 7 (libri); `docs/ARRIVO.md`; `docs/LEZIONI.md`; il sapere
  (`lore/sapere/`, 106 schede); documento di progetto riscritto (quindicesima versione).
- **Dubbio sul sapere:** le 106 schede non sono state rilette una per una dal capofila; il test controlla che il
  cerchio si chiuda, non che ogni «si dice» sia esatto.
