# Collezioni: pietre e sibilla, come l'erbario (pagina di progetto)

Richiesta di Andrea, 18 novembre: pietre e oracoli da raccogliere come le erbe, effetto album di figurine che
fa girare la mappa; pochi fronzoli quando si trovano; luccicano meno dei tarocchi; arrivano anche nelle
missioni, a corredo, con due parole e senza spiegone; chi vuole legge l'album o fa le missioni dell'interesse.

## Che cosa si vede

- **Tre album nel grimorio**: erbario (23, c'è), pietre (12, da `lore/sapere/pietra-*`), sibilla (**tutte e 36** le
  figurine, deciso da Andrea: «non limitare gli oracoli»; ognuna con pagina, due o tre parole chiave e un donatore
  o un posto; vedi BACKLOG 3.0). Caselle numerate vuote per quelle mancanti.
- **Trovare non ferma il gioco.** Si tocca, la figurina vola verso l'icona del grimorio, un suono piccolo, una
  riga breve in basso («Un'ametista.»). Niente pagina che si apre. Nel grimorio un puntino sul nastro; nell'album
  la casella ha «nuova» finché non la si apre.
- **Eccezione: la prima volta di ogni genere**, qualcuno racconta qualcosa (Edera per le pietre, l'ambulante o
  Ginepra per la sibilla): una scena breve, una volta sola. Vale anche per l'erbario: dalla seconda erba in poi
  niente pagina automatica (oggi si apre sempre: si cambia).
- **Si vedono solo da vicino.** Nessun luccichio da lontano come le carte dei tarocchi: un riflesso piccolo
  entro due o tre caselle. I tarocchi restano la cosa che brilla.
- **In regalo, a corredo.** Una missione può dare anche una pietra o una figurina quando ha senso per chi la dà
  (Edera una pietra, il becchino l'ossidiana, il marinaio l'ancora). Chi la dà dice una riga, due parole in
  croce prese dal «si dice» del sapere, a modo suo. Il biglietto della missione non lo annuncia mai
  (`lore/principi/vede-solo-quello-che-sa.md`).
- **Chi vuole approfondisce**: la pagina dell'album (che cos'è, che cosa si dice, a che cosa si lega nel
  cerchio), e più avanti le missioni degli interessi (BACKLOG 6).

## Dove stanno

- Pietre: dove ha senso per l'elemento e il pianeta (acqua: al ruscello; terra/Saturno: cimitero, radici;
  fuoco: vicino alla fucina o al forno), poche e una sola per tipo nel mondo; le altre solo in regalo.
- Figurine della sibilla: anche per terra (Andrea: «si possono anche trovare a terra, certo»), come una carta
  persa: tra le radici, sotto una panca, in un libro, in un cassetto; e le danno le persone e l'ambulante.
- **A gruppi, non solo singole** (Andrea, 18 novembre): con 36 figurine una alla volta sarebbe lento. Chi le dà
  ne dà spesso **due o tre che insieme fanno una frase** («lettera, anello»: «Una promessa scritta. Tienile
  insieme.»): una riga sola, ed è già il primo assaggio della lettura a coppie, senza spiegarla. Per terra si
  trovano anche mazzetti di due o tre (legati con uno spago). Nell'album le carte arrivate insieme ricordano la
  frase con cui sono arrivate. Conto indicativo: 36 carte in circa 14-16 ritrovamenti, non 36.
- Ogni posto è nei dati del mondo con una condizione, e la mappa a matita non le segna (si scoprono).

## Immagini (cercate il 18 novembre)

- **Sibilla: trovato il mazzo.** Yale, Beinecke Library, Cary Collection of Playing Cards, «Wahrsagekarten der
  berühmten Kartenlegerin Lenormand», Ch. Didot, [1890?], 36 carte, cromolitografia, tutto digitalizzato.
  Scheda: https://collections.library.yale.edu/catalog/10994633 (manifest IIIF `/manifests/10994633`).
  Quattro fogli da nove carte, 4334×5121 px (ogni carta circa 1100×1700): scaricati in
  `/home/claude/ext/sibilla/s2..s5.jpg`, guardato il primo: nitide, colorate, numerate, e ogni carta porta
  **segni di pianeti e zodiaco**: si legano al cerchio del sapere. Testi in tedesco gotico (titolo e due versi):
  restano come sapore, la pagina dell'album li traduce. Diritti: stampa anonima del 1890 circa, quindi pubblico
  dominio; la scheda ha solo la formula generica di Yale («may be subject to copyright law…»), non una licenza
  esplicita. Si usa con il credito alla Beinecke in CREDITS.md. Da fare: ritagliare le 36 carte.
- **Pietre:** James Sowerby, *British Mineralogy* (1802–17) ed *Exotic Mineralogy* (1811–20): tavole incise e
  colorate a mano, pubblico dominio; scansioni alla Biodiversity Heritage Library
  (https://biodiversitylibrary.org/bibliography/63277), molte già ritagliate su pdimagearchive.org e
  c82.net/mineralogy (lì ametista tav. 430, agata tav. 83). Da verificare pietra per pietra quali delle nostre 12
  ci sono (lapislazzuli, ossidiana, pietra di luna, tormalina, occhio di tigre sono le incerte); per le
  mancanti: H. Sowerby 1851 alla Wellcome (Public Domain Mark) o disegno dal codice.

## Che cosa NON fa questa fase

Nessun uso nella storia (sacchetti, tavolo, letture a coppie): quelli sono gli interessi. Qui si raccoglie e si
legge. Stato: `stones: {}`, `oracle: {}`, `albumSeen: {}` con valori di partenza; salvataggi vecchi a posto.

## Prove

Ogni pietra e figurina ha pagina, posto o donatore raggiungibile da chi è già avanti; nessun testo oltre una
riga quando si trova; il test «vede solo quello che sa» copre anche gli album; schermate a 390 px.

## Fatto (18 novembre, sera)

- Dati: `src/data/stones.js`, `src/data/sibyl.js`, `src/data/world/finds.js` (7 pietre e 8 mazzetti per terra),
  `src/data/gifts.js` (13 regali e le prime parole di Edera e Ginepra). Regole: `src/glue/collect.rules.js`;
  gioco: `src/glue/collect.js`; album: `src/ui/collect.js`; mondo: `src/world/scene/finds.js`, `art/finds.js`.
- Le prime parole aspettano la prima chiacchierata libera con Edera (pietre) o Ginepra (figurine): prima di
  conoscerle lei non può sentirle. Se il primo pezzo è proprio il loro regalo, dicono la forma `given`.
- Prima delle parole di Ginepra il nastro si chiama «Figurine», dopo «Sibilla».
- Non verificato: telefono vero, suono `pick`, traduzioni dei versi (da far rileggere a chi sa il tedesco).
