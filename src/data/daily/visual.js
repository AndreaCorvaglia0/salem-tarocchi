// What the card-of-the-day screen needs to see (docs/DESIGN.md "La soglia"): where each look points, and
// questions about what is in the picture. Coordinates are percentages of the image (0,0 top left).
// looks: one entry per sguardo of that card, same order as in cards.js. 'immagine' -> { x, y, z } (centre of
// the detail, z = zoom 1.5..3.2); 'storia' / 'rovescio' -> null; 'contesto' -> { con: [ids named] } or null.
// domande: two questions per card about what is visible in public/cards/<id>.webp; `at` = where the answer is.
// Left / right always mean the viewer's left / right of the picture.
export const VISUAL = {
  m00: {
    looks: [null, { x: 60, y: 15, z: 2.8 }, { con: ['m15'] }],
    domande: [
      { q: 'Che cosa tiene nella mano tesa in avanti?', a: ['Una rosa bianca', 'Una lanterna', 'Una coppa'], ok: 0, at: { x: 89, y: 28, z: 2.6 } },
      { q: 'Quale animale salta accanto alla figura?', a: ['Un gatto nero', 'Un cane bianco', 'Un leone'], ok: 1, at: { x: 82, y: 74, z: 2.2 } },
    ],
  },
  m01: {
    looks: [null, { x: 47, y: 52, z: 3.2 }, null],
    domande: [
      { q: 'Che simbolo ha sopra la testa?', a: ['Una corona', 'Una stella', 'Un otto sdraiato'], ok: 2, at: { x: 44, y: 20, z: 2.6 } },
      { q: 'Che cosa tiene nella mano alzata?', a: ['Una bacchetta bianca', 'Una spada', 'Una lanterna'], ok: 0, at: { x: 18, y: 16, z: 2.4 } },
    ],
  },
  m02: {
    looks: [{ x: 47, y: 57, z: 2.8 }, null, { con: ['m01'] }],
    domande: [
      { q: 'Quali lettere si leggono sulle due colonne?', a: ['A e Z', 'B e J', 'T e O'], ok: 1, at: { x: 50, y: 45, z: 1.5 } },
      { q: 'Che cosa c\'è in basso, ai suoi piedi?', a: ['Un gatto', 'Un libro aperto', 'Una falce di luna'], ok: 2, at: { x: 60, y: 82, z: 2.2 } },
    ],
  },
  m03: {
    looks: [null, { x: 48, y: 24, z: 2.4 }, null],
    domande: [
      { q: 'Che cosa cresce in basso, davanti a lei?', a: ['Grano maturo', 'Rose rosse', 'Ninfee'], ok: 0, at: { x: 50, y: 85, z: 1.6 } },
      { q: 'Che simbolo c\'è sullo scudo a forma di cuore?', a: ['Una stella a cinque punte', 'Una mezzaluna', 'Un cerchio con una croce sotto'], ok: 2, at: { x: 25, y: 68, z: 2.4 } },
    ],
  },
  m04: {
    looks: [{ x: 52, y: 36, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa porta alle gambe, sotto la veste rossa?', a: ['Stivali di cuoio', 'Un\'armatura', 'Niente: è scalzo'], ok: 1, at: { x: 55, y: 75, z: 2 } },
      { q: 'Che cosa si vede dietro il trono?', a: ['Un giardino', 'Il mare', 'Montagne spoglie'], ok: 2, at: { x: 85, y: 45, z: 1.8 } },
    ],
  },
  m05: {
    looks: [null, { x: 50, y: 65, z: 1.5 }, null],
    domande: [
      { q: 'Quante persone stanno davanti a lui, di spalle?', a: ['Due', 'Una', 'Tre'], ok: 0, at: { x: 50, y: 78, z: 1.5 } },
      { q: 'Che cosa c\'è per terra, incrociato, ai suoi piedi?', a: ['Due spade', 'Due chiavi', 'Due bastoni'], ok: 1, at: { x: 50, y: 88, z: 2.6 } },
    ],
  },
  m06: {
    looks: [{ x: 50, y: 38, z: 1.5 }, null, { con: ['m15'] }],
    domande: [
      { q: 'Che cosa c\'è sull\'albero a sinistra nel disegno?', a: ['Un nido', 'Una civetta', 'Un serpente attorcigliato'], ok: 2, at: { x: 10, y: 60, z: 2.2 } },
      { q: 'Che cosa si vede in fondo, tra le due figure?', a: ['Una montagna', 'Un castello', 'Un fiume'], ok: 0, at: { x: 48, y: 78, z: 1.8 } },
    ],
  },
  m07: {
    looks: [null, { x: 50, y: 50, z: 1.5 }, null],
    domande: [
      { q: 'Di che colore sono le due sfingi?', a: ['Tutte e due nere', 'Una nera e una bianca', 'Tutte e due dorate'], ok: 1, at: { x: 50, y: 80, z: 1.5 } },
      { q: 'Che cosa c\'è sul telo sopra la sua testa?', a: ['Rose rosse', 'Soli dorati', 'Stelle bianche'], ok: 2, at: { x: 48, y: 13, z: 2 } },
    ],
  },
  m08: {
    looks: [null, { x: 48, y: 60, z: 1.5 }, null],
    domande: [
      { q: 'Che cosa fa la donna al leone?', a: ['Gli tiene il muso con le mani', 'Lo cavalca', 'Gli dà da mangiare'], ok: 0, at: { x: 35, y: 55, z: 2 } },
      { q: 'Che cosa ha tra i capelli?', a: ['Una corona d\'oro', 'Fiori e foglie', 'Un velo nero'], ok: 1, at: { x: 28, y: 28, z: 2.4 } },
    ],
  },
  m09: {
    looks: [null, { x: 28, y: 22, z: 2.2 }, null],
    domande: [
      { q: 'Oltre alla lanterna, che cosa tiene in mano?', a: ['Una spada', 'Un libro', 'Un lungo bastone'], ok: 2, at: { x: 38, y: 45, z: 1.6 } },
      { q: 'Su che cosa sta in piedi?', a: ['Su una cima innevata', 'Su un prato fiorito', 'Su una barca'], ok: 0, at: { x: 50, y: 88, z: 1.8 } },
    ],
  },
  m10: {
    looks: [{ x: 48, y: 52, z: 1.5 }, null, { con: ['w10'] }],
    domande: [
      { q: 'Quale creatura siede in cima alla ruota?', a: ['Un gatto', 'Una sfinge', 'Un re'], ok: 1, at: { x: 48, y: 22, z: 2.2 } },
      { q: 'Che cosa scende lungo la ruota, a sinistra nel disegno?', a: ['Una catena', 'Un fiume', 'Un serpente'], ok: 2, at: { x: 15, y: 55, z: 2 } },
    ],
  },
  m11: {
    looks: [{ x: 48, y: 31, z: 2.6 }, null, null],
    domande: [
      { q: 'Che cosa tiene nelle due mani?', a: ['Una spada e una bilancia', 'Uno scettro e un globo', 'Un libro e una chiave'], ok: 0, at: { x: 50, y: 48, z: 1.5 } },
      { q: 'Che cosa ha in testa?', a: ['Un velo', 'Una corona', 'Un elmo'], ok: 1, at: { x: 48, y: 25, z: 2.4 } },
    ],
  },
  m12: {
    looks: [null, { x: 45, y: 55, z: 1.5 }, { con: ['m13'] }],
    domande: [
      { q: 'Che cosa circonda la testa della figura?', a: ['Una corona di spine', 'Un cappuccio', 'Un alone di luce'], ok: 2, at: { x: 48, y: 77, z: 2.4 } },
      { q: 'Per che cosa è appesa la figura?', a: ['Per un piede', 'Per le mani', 'Per la vita'], ok: 0, at: { x: 55, y: 17, z: 2.4 } },
    ],
  },
  m13: {
    looks: [null, { x: 35, y: 57, z: 1.6 }, null],
    domande: [
      { q: 'Di che colore è il cavallo?', a: ['Nero', 'Bianco', 'Rosso'], ok: 1, at: { x: 55, y: 55, z: 1.5 } },
      { q: 'Che cosa c\'è sulla bandiera nera?', a: ['Un teschio', 'Una stella', 'Un fiore bianco'], ok: 2, at: { x: 62, y: 18, z: 2 } },
    ],
  },
  m14: {
    looks: [{ x: 48, y: 22, z: 2.4 }, null, { con: ['m13'] }],
    domande: [
      { q: 'Che cosa fa l\'angelo con le due coppe?', a: ['Versa l\'acqua dall\'una all\'altra', 'Le alza verso il cielo', 'Le offre a due persone'], ok: 0, at: { x: 45, y: 42, z: 2 } },
      { q: 'Dove tiene i piedi?', a: ['Tutti e due su una nuvola', 'Uno nell\'acqua e uno sulla riva', 'Tutti e due su una roccia'], ok: 1, at: { x: 58, y: 82, z: 2 } },
    ],
  },
  m15: {
    looks: [{ x: 50, y: 76, z: 1.5 }, null, null],
    domande: [
      { q: 'Con che cosa sono legate le due figure in basso?', a: ['Con corde ai polsi', 'Non sono legate', 'Con catene al collo'], ok: 2, at: { x: 50, y: 72, z: 1.6 } },
      { q: 'Che ali ha la grande figura in alto?', a: ['Ali di pipistrello', 'Ali piumate d\'angelo', 'Non ha ali'], ok: 0, at: { x: 50, y: 25, z: 1.5 } },
    ],
  },
  m16: {
    looks: [null, { x: 48, y: 34, z: 1.5 }, { con: ['m17'] }],
    domande: [
      { q: 'Che cosa colpisce la cima della torre?', a: ['Un\'onda', 'Un fulmine', 'Una freccia'], ok: 1, at: { x: 65, y: 15, z: 1.8 } },
      { q: 'Quante figure cadono dalla torre?', a: ['Una', 'Tre', 'Due'], ok: 2, at: { x: 48, y: 58, z: 1.5 } },
    ],
  },
  m17: {
    looks: [{ x: 62, y: 70, z: 2.2 }, null, null],
    domande: [
      { q: 'Quante stelle ci sono in tutto nel cielo?', a: ['Otto', 'Cinque', 'Dodici'], ok: 0, at: { x: 50, y: 26, z: 1.5 } },
      { q: 'Che cosa tiene nelle mani?', a: ['Due coppe d\'oro', 'Due brocche', 'Una lanterna'], ok: 1, at: { x: 55, y: 62, z: 1.5 } },
    ],
  },
  m18: {
    looks: [{ x: 50, y: 44, z: 1.5 }, null, { con: ['m19'] }],
    domande: [
      { q: 'Che cosa esce dall\'acqua in basso?', a: ['Un pesce', 'Una mano', 'Un gambero'], ok: 2, at: { x: 45, y: 84, z: 2.2 } },
      { q: 'Quanti animali ululano alla luna?', a: ['Due', 'Uno', 'Tre'], ok: 0, at: { x: 48, y: 62, z: 1.5 } },
    ],
  },
  m19: {
    looks: [null, { x: 40, y: 35, z: 1.5 }, null],
    domande: [
      { q: 'Su quale animale sta il bambino?', a: ['Un leone', 'Un cavallo bianco', 'Un asino grigio'], ok: 1, at: { x: 55, y: 78, z: 1.6 } },
      { q: 'Che fiori crescono dietro il muro?', a: ['Rose', 'Gigli', 'Girasoli'], ok: 2, at: { x: 22, y: 48, z: 2 } },
    ],
  },
  m20: {
    looks: [{ x: 50, y: 72, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa suona l\'angelo?', a: ['Una tromba', 'Un\'arpa', 'Un tamburo'], ok: 0, at: { x: 55, y: 42, z: 1.8 } },
      { q: 'Da dove si alzano le figure in basso?', a: ['Da un letto', 'Da tombe aperte', 'Da un campo di grano'], ok: 1, at: { x: 48, y: 85, z: 1.5 } },
    ],
  },
  m21: {
    looks: [{ x: 60, y: 66, z: 2.2 }, null, null],
    domande: [
      { q: 'Che cosa circonda la figura che balla?', a: ['Un serpente', 'Una ruota di legno', 'Una ghirlanda di foglie'], ok: 2, at: { x: 50, y: 50, z: 1.5 } },
      { q: 'Quale animale c\'è nell\'angolo in basso a destra nel disegno?', a: ['Un leone', 'Un cane', 'Un cavallo'], ok: 0, at: { x: 87, y: 79, z: 2.2 } },
    ],
  },
  w01: {
    looks: [null, { x: 32, y: 55, z: 1.5 }, { con: ['p07'] }],
    domande: [
      { q: 'Che cosa spunta dal bastone?', a: ['Fiori rossi', 'Foglie verdi', 'Fiamme'], ok: 1, at: { x: 33, y: 33, z: 1.6 } },
      { q: 'Che cosa si vede sulla collina in fondo?', a: ['Un albero solo', 'Una croce', 'Un castello'], ok: 2, at: { x: 17, y: 78, z: 2.6 } },
    ],
  },
  w02: {
    looks: [{ x: 48, y: 84, z: 1.5 }, null, null],
    domande: [
      { q: 'Oltre al bastone, che cosa tiene in mano?', a: ['Un piccolo globo', 'Una coppa', 'Una lanterna'], ok: 0, at: { x: 33, y: 40, z: 2.4 } },
      { q: 'Che cosa si vede in fondo, a sinistra nel disegno?', a: ['Un deserto', 'Il mare e le montagne', 'Una città in fiamme'], ok: 1, at: { x: 12, y: 60, z: 2 } },
    ],
  },
  w03: {
    looks: [{ x: 60, y: 65, z: 1.5 }, { con: ['w02'] }, null],
    domande: [
      { q: 'Come vediamo la figura?', a: ['Di fronte', 'Seduta, di profilo', 'Di spalle'], ok: 2, at: { x: 45, y: 60, z: 1.5 } },
      { q: 'Di che colore è il cielo?', a: ['Giallo', 'Azzurro', 'Grigio'], ok: 0, at: { x: 40, y: 15, z: 1.5 } },
    ],
  },
  w04: {
    looks: [{ x: 50, y: 75, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa è appeso in alto, tra i bastoni?', a: ['Uno stendardo', 'Una ghirlanda di fiori e frutti', 'Delle lanterne'], ok: 1, at: { x: 50, y: 30, z: 1.6 } },
      { q: 'Che cosa c\'è dietro le due figure?', a: ['Una foresta', 'Il mare', 'Un castello'], ok: 2, at: { x: 55, y: 58, z: 1.6 } },
    ],
  },
  w05: {
    looks: [{ x: 48, y: 52, z: 1.5 }, { con: ['s05'] }, null],
    domande: [
      { q: 'Quante figure agitano un bastone?', a: ['Cinque', 'Tre', 'Sette'], ok: 0, at: { x: 48, y: 55, z: 1.5 } },
      { q: 'Di che colore è il cielo?', a: ['Giallo', 'Azzurro', 'Nero'], ok: 1, at: { x: 40, y: 20, z: 1.5 } },
    ],
  },
  w06: {
    looks: [{ x: 55, y: 62, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa porta in testa il cavaliere?', a: ['Un elmo', 'Un cappello rosso', 'Una corona di foglie'], ok: 2, at: { x: 33, y: 35, z: 2.4 } },
      { q: 'Di che colore è il cavallo?', a: ['Bianco', 'Nero', 'Marrone'], ok: 0, at: { x: 85, y: 62, z: 2 } },
    ],
  },
  w07: {
    looks: [{ x: 40, y: 86, z: 1.5 }, null, null],
    domande: [
      { q: 'Di che colore è la tunica della figura?', a: ['Rossa', 'Verde', 'Azzurra'], ok: 1, at: { x: 42, y: 58, z: 1.6 } },
      { q: 'Quanti bastoni spuntano dal basso contro la figura?', a: ['Tre', 'Nove', 'Sei'], ok: 2, at: { x: 48, y: 82, z: 1.5 } },
    ],
  },
  w08: {
    looks: [{ x: 60, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Verso quale angolo del disegno puntano i bastoni?', a: ['In basso a destra', 'In alto a sinistra', 'In alto a destra'], ok: 0, at: { x: 78, y: 60, z: 1.5 } },
      { q: 'Che cosa si vede in basso, sotto i bastoni?', a: ['Un mare in tempesta', 'Una campagna con un fiume', 'Una città'], ok: 1, at: { x: 40, y: 91, z: 2 } },
    ],
  },
  w09: {
    looks: [{ x: 48, y: 30, z: 1.6 }, { con: ['w10'] }, null],
    domande: [
      { q: 'Che cosa ha intorno alla testa?', a: ['Una corona d\'oro', 'Un elmo con le piume', 'Una benda bianca'], ok: 2, at: { x: 65, y: 32, z: 2.6 } },
      { q: 'Come tiene il suo bastone?', a: ['Stretto con due mani', 'Sulla spalla', 'Alzato sopra la testa'], ok: 0, at: { x: 68, y: 45, z: 2 } },
    ],
  },
  w10: {
    looks: [null, { x: 72, y: 62, z: 1.6 }, { con: ['p06'] }],
    domande: [
      { q: 'Verso quale parte del disegno cammina?', a: ['Verso sinistra', 'Verso destra', 'Verso chi guarda'], ok: 1, at: { x: 45, y: 65, z: 1.5 } },
      { q: 'Che cosa si vede in fondo, a destra nel disegno?', a: ['Il mare', 'Una montagna innevata', 'Una casa tra gli alberi'], ok: 2, at: { x: 87, y: 80, z: 2.6 } },
    ],
  },
  w11: {
    looks: [{ x: 65, y: 45, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa c\'è sul cappello?', a: ['Una piuma rossa', 'Una stella', 'Un fiore bianco'], ok: 0, at: { x: 42, y: 17, z: 2.6 } },
      { q: 'In che paesaggio si trova la figura?', a: ['In un bosco', 'In un deserto', 'In riva al mare'], ok: 1, at: { x: 60, y: 80, z: 1.5 } },
    ],
  },
  w12: {
    looks: [{ x: 62, y: 42, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa fa il cavallo?', a: ['Beve da un fiume', 'Cammina a testa bassa', 'S\'impenna'], ok: 2, at: { x: 40, y: 60, z: 1.5 } },
      { q: 'Di che colore sono le piume sull\'elmo?', a: ['Rosse', 'Bianche', 'Azzurre'], ok: 0, at: { x: 80, y: 23, z: 2.2 } },
    ],
  },
  w13: {
    looks: [{ x: 50, y: 38, z: 1.5 }, null, null],
    domande: [
      { q: 'Quale animale è seduto ai piedi della regina?', a: ['Un cane bianco', 'Un gatto nero', 'Un corvo'], ok: 1, at: { x: 42, y: 83, z: 2.6 } },
      { q: 'Oltre al bastone, che cosa tiene in mano?', a: ['Un girasole', 'Una coppa', 'Una spada'], ok: 0, at: { x: 75, y: 38, z: 2.2 } },
    ],
  },
  w14: {
    looks: [{ x: 66, y: 89, z: 3 }, null, null],
    domande: [
      { q: 'Da che parte guarda il re?', a: ['Verso destra', 'Dritto verso chi guarda', 'Verso sinistra'], ok: 2, at: { x: 42, y: 26, z: 2.2 } },
      { q: 'Quale animale c\'è per terra accanto al trono?', a: ['Una salamandra', 'Un gatto nero', 'Un cane'], ok: 0, at: { x: 66, y: 89, z: 2.8 } },
    ],
  },
  c01: {
    looks: [{ x: 48, y: 30, z: 2.8 }, null, null],
    domande: [
      { q: 'Quale uccello scende verso la coppa?', a: ['Un corvo', 'Una colomba bianca', 'Un falco'], ok: 1, at: { x: 48, y: 12, z: 2.4 } },
      { q: 'Che cosa c\'è in basso, sotto la coppa?', a: ['Un deserto', 'Una città', 'Uno stagno con le ninfee'], ok: 2, at: { x: 50, y: 86, z: 1.8 } },
    ],
  },
  c02: {
    looks: [{ x: 52, y: 48, z: 1.5 }, { con: ['m06'] }, null],
    domande: [
      { q: 'Quale testa di animale, con le ali, sta sopra le coppe?', a: ['Un leone', 'Un\'aquila', 'Un toro'], ok: 0, at: { x: 50, y: 16, z: 2 } },
      { q: 'Che cosa porta in testa la figura a sinistra nel disegno?', a: ['Un elmo', 'Un cappello rosso', 'Una ghirlanda di foglie'], ok: 2, at: { x: 22, y: 30, z: 2.6 } },
    ],
  },
  c03: {
    looks: [{ x: 62, y: 68, z: 1.6 }, null, null],
    domande: [
      { q: 'Quante figure alzano la coppa?', a: ['Due', 'Tre', 'Quattro'], ok: 1, at: { x: 50, y: 25, z: 1.6 } },
      { q: 'Di che colore è la veste della figura al centro?', a: ['Rossa', 'Azzurra', 'Verde'], ok: 0, at: { x: 45, y: 60, z: 1.6 } },
    ],
  },
  c04: {
    looks: [{ x: 48, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Da dove esce la mano che offre la coppa?', a: ['Dall\'acqua', 'Da dietro l\'albero', 'Da una nuvola'], ok: 2, at: { x: 25, y: 50, z: 2.2 } },
      { q: 'Quante coppe stanno sull\'erba davanti alla figura?', a: ['Due', 'Tre', 'Quattro'], ok: 1, at: { x: 25, y: 88, z: 1.8 } },
    ],
  },
  c05: {
    looks: [{ x: 50, y: 78, z: 1.5 }, { con: ['c06', 's03'] }, null],
    domande: [
      { q: 'Di che colore è il mantello della figura?', a: ['Nero', 'Rosso', 'Bianco'], ok: 0, at: { x: 50, y: 60, z: 1.6 } },
      { q: 'Quante coppe sono ancora in piedi?', a: ['Nessuna', 'Tre', 'Due'], ok: 2, at: { x: 82, y: 88, z: 2.2 } },
    ],
  },
  c06: {
    looks: [{ x: 28, y: 48, z: 1.8 }, null, null],
    domande: [
      { q: 'Di che cosa sono piene le coppe?', a: ['Di monete', 'Di fiori bianchi', 'Di frutta'], ok: 1, at: { x: 50, y: 84, z: 1.6 } },
      { q: 'Di che colore è il cappuccio della figura più grande?', a: ['Rosso', 'Verde', 'Nero'], ok: 0, at: { x: 48, y: 48, z: 2.2 } },
    ],
  },
  c07: {
    looks: [{ x: 52, y: 36, z: 1.6 }, null, null],
    domande: [
      { q: 'Dove stanno le coppe?', a: ['Su un tavolo', 'Sull\'erba', 'Su una nuvola'], ok: 2, at: { x: 58, y: 45, z: 1.5 } },
      { q: 'Che cosa esce dalla coppa in alto a destra nel disegno?', a: ['Una colomba', 'Un serpente', 'Una fiamma'], ok: 1, at: { x: 73, y: 13, z: 2.4 } },
    ],
  },
  c08: {
    looks: [{ x: 50, y: 82, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa c\'è nel cielo?', a: ['Una luna con un volto', 'Un arcobaleno', 'Uno stormo di uccelli'], ok: 0, at: { x: 25, y: 25, z: 2.4 } },
      { q: 'Di che colore è il mantello di chi si allontana?', a: ['Nero', 'Azzurro', 'Rosso'], ok: 2, at: { x: 68, y: 58, z: 2 } },
    ],
  },
  c09: {
    looks: [{ x: 50, y: 55, z: 1.5 }, { con: ['c10'] }, null],
    domande: [
      { q: 'Come tiene le braccia?', a: ['Alzate verso il cielo', 'Incrociate sul petto', 'Lungo i fianchi'], ok: 1, at: { x: 50, y: 58, z: 2 } },
      { q: 'Che cosa ha in testa?', a: ['Un cappello rosso', 'Una corona', 'Un elmo'], ok: 0, at: { x: 53, y: 43, z: 2.4 } },
    ],
  },
  c10: {
    looks: [{ x: 55, y: 72, z: 1.5 }, { con: ['c09'] }, null],
    domande: [
      { q: 'Che cosa attraversa il cielo sopra le figure?', a: ['Una cometa', 'Uno stormo di uccelli', 'Un arcobaleno'], ok: 2, at: { x: 50, y: 24, z: 1.5 } },
      { q: 'Che cosa fanno i due bambini?', a: ['Ballano tenendosi per mano', 'Dormono sull\'erba', 'Raccolgono fiori'], ok: 0, at: { x: 73, y: 78, z: 2.4 } },
    ],
  },
  c11: {
    looks: [{ x: 45, y: 40, z: 1.7 }, null, null],
    domande: [
      { q: 'Che cosa spunta dalla coppa?', a: ['Un serpente', 'Un pesce', 'Un fiore'], ok: 1, at: { x: 27, y: 29, z: 2.6 } },
      { q: 'Che cosa si vede dietro la figura, in basso?', a: ['Un campo arato', 'Un muro di pietra', 'Il mare con le onde'], ok: 2, at: { x: 50, y: 77, z: 1.6 } },
    ],
  },
  c12: {
    looks: [{ x: 50, y: 42, z: 1.5 }, { con: ['p12'] }, null],
    domande: [
      { q: 'Di che colore è il cavallo?', a: ['Nero', 'Bianco', 'Rosso fuoco'], ok: 1, at: { x: 65, y: 60, z: 1.5 } },
      { q: 'Che cosa c\'è sull\'elmo del cavaliere?', a: ['Un paio d\'ali', 'Un pennacchio rosso', 'Una corona'], ok: 0, at: { x: 22, y: 14, z: 2.4 } },
    ],
  },
  c13: {
    looks: [{ x: 32, y: 35, z: 2.2 }, null, null],
    domande: [
      { q: 'Da che parte guarda la regina?', a: ['Verso destra', 'Verso chi guarda', 'Verso sinistra'], ok: 2, at: { x: 50, y: 28, z: 2.2 } },
      { q: 'Dove si trova il trono?', a: ['In riva all\'acqua', 'In un giardino di rose', 'Dentro una sala'], ok: 0, at: { x: 40, y: 85, z: 1.5 } },
    ],
  },
  c14: {
    looks: [{ x: 50, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa si vede sul mare, a destra nel disegno?', a: ['Un faro', 'Una nave', 'Un\'isola con un castello'], ok: 1, at: { x: 88, y: 63, z: 2.6 } },
      { q: 'Che cosa tiene il re nelle mani?', a: ['Una coppa e una spada', 'Soltanto una coppa', 'Una coppa e uno scettro'], ok: 2, at: { x: 55, y: 45, z: 1.6 } },
    ],
  },
  s01: {
    looks: [{ x: 50, y: 32, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa c\'è sulla punta della spada?', a: ['Una corona', 'Una stella', 'Una colomba'], ok: 0, at: { x: 50, y: 11, z: 2.4 } },
      { q: 'Che cosa si vede in basso, sotto la mano?', a: ['Un giardino', 'Delle montagne', 'Una città'], ok: 1, at: { x: 50, y: 86, z: 1.8 } },
    ],
  },
  s02: {
    looks: [null, { x: 50, y: 52, z: 1.5 }, null],
    domande: [
      { q: 'Che cosa c\'è nel cielo?', a: ['Il sole', 'Nuvole scure', 'Una falce di luna'], ok: 2, at: { x: 70, y: 16, z: 2.6 } },
      { q: 'Che cosa le copre gli occhi?', a: ['Una benda bianca', 'Un cappuccio', 'Le sue mani'], ok: 0, at: { x: 50, y: 41, z: 2.6 } },
    ],
  },
  s03: {
    looks: [null, { x: 50, y: 52, z: 1.5 }, null],
    domande: [
      { q: 'Che cosa cade dal cielo?', a: ['Neve', 'Pioggia', 'Foglie'], ok: 1, at: { x: 22, y: 70, z: 1.6 } },
      { q: 'Che cosa c\'è in alto, dietro il cuore?', a: ['Il sole', 'Una montagna', 'Delle nuvole'], ok: 2, at: { x: 50, y: 24, z: 1.5 } },
    ],
  },
  s04: {
    looks: [{ x: 50, y: 50, z: 1.5 }, { con: ['s03'] }, null],
    domande: [
      { q: 'In che posizione è il cavaliere?', a: ['Sdraiato, con le mani giunte', 'In ginocchio', 'Seduto su un trono'], ok: 0, at: { x: 55, y: 66, z: 1.6 } },
      { q: 'Che cosa c\'è in alto a sinistra nel disegno?', a: ['Uno stemma', 'Una vetrata colorata', 'Una finestra sul mare'], ok: 1, at: { x: 17, y: 22, z: 2.2 } },
    ],
  },
  s05: {
    looks: [{ x: 50, y: 55, z: 1.5 }, null, null],
    domande: [
      { q: 'Quante figure si allontanano sullo sfondo?', a: ['Una', 'Tre', 'Due'], ok: 2, at: { x: 25, y: 76, z: 2 } },
      { q: 'Da che parte guarda la figura in primo piano?', a: ['Verso sinistra', 'Verso destra', 'Verso chi guarda'], ok: 0, at: { x: 57, y: 37, z: 2.2 } },
    ],
  },
  s06: {
    looks: [{ x: 60, y: 65, z: 1.5 }, null, null],
    domande: [
      { q: 'Con che cosa viene spinta la barca?', a: ['Con due remi', 'Con una lunga pertica', 'Con una vela'], ok: 1, at: { x: 35, y: 50, z: 1.5 } },
      { q: 'Che cosa si vede in fondo, oltre l\'acqua?', a: ['Un castello', 'Montagne innevate', 'Una riva con degli alberi'], ok: 2, at: { x: 40, y: 38, z: 2 } },
    ],
  },
  s07: {
    looks: [{ x: 32, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa si vede sullo sfondo, a destra nel disegno?', a: ['Delle tende', 'Un castello', 'Una nave'], ok: 0, at: { x: 85, y: 70, z: 2 } },
      { q: 'Quante spade restano piantate a terra?', a: ['Nessuna', 'Due', 'Tre'], ok: 1, at: { x: 78, y: 60, z: 1.8 } },
    ],
  },
  s08: {
    looks: [{ x: 50, y: 55, z: 1.5 }, { con: ['m15'] }, null],
    domande: [
      { q: 'Che cosa c\'è in alto sulla roccia, alle sue spalle?', a: ['Un albero', 'Una croce', 'Un castello'], ok: 2, at: { x: 82, y: 52, z: 2.4 } },
      { q: 'Di che colore è la veste della figura legata?', a: ['Rossa', 'Bianca', 'Azzurra'], ok: 0, at: { x: 38, y: 62, z: 1.6 } },
    ],
  },
  s09: {
    looks: [{ x: 40, y: 62, z: 1.5 }, { con: ['m19', 'm17'] }, null],
    domande: [
      { q: 'Che cosa fa la figura nel letto?', a: ['Dorme tranquilla', 'Si copre il viso con le mani', 'Legge un libro'], ok: 1, at: { x: 60, y: 52, z: 2 } },
      { q: 'Che fiori ci sono sulla coperta?', a: ['Gigli bianchi', 'Girasoli', 'Rose rosse'], ok: 2, at: { x: 72, y: 82, z: 1.8 } },
    ],
  },
  s10: {
    looks: [{ x: 50, y: 60, z: 1.5 }, { con: ['s01'] }, null],
    domande: [
      { q: 'Di che colore è il cielo in alto?', a: ['Nero', 'Azzurro', 'Rosso'], ok: 0, at: { x: 50, y: 15, z: 1.5 } },
      { q: 'In che posizione è la figura?', a: ['In ginocchio', 'Stesa a terra, a faccia in giù', 'Seduta'], ok: 1, at: { x: 60, y: 87, z: 1.6 } },
    ],
  },
  s11: {
    looks: [{ x: 42, y: 15, z: 2 }, null, null],
    domande: [
      { q: 'Come tiene la spada?', a: ['Con la punta a terra', 'Nel fodero, alla cintura', 'Alzata, con due mani'], ok: 2, at: { x: 72, y: 25, z: 1.8 } },
      { q: 'Che cosa riempie il cielo dietro la figura?', a: ['Grandi nuvole bianche', 'Un arcobaleno', 'Tante stelle'], ok: 0, at: { x: 75, y: 55, z: 1.5 } },
    ],
  },
  s12: {
    looks: [{ x: 75, y: 42, z: 1.6 }, null, null],
    domande: [
      { q: 'Da che parte corre il cavallo?', a: ['Verso destra', 'Verso sinistra', 'Verso chi guarda'], ok: 1, at: { x: 30, y: 50, z: 1.5 } },
      { q: 'Di che colore è il mantello del cavaliere?', a: ['Verde', 'Nero', 'Rosso'], ok: 2, at: { x: 88, y: 30, z: 2 } },
    ],
  },
  s13: {
    looks: [null, { x: 48, y: 42, z: 1.5 }, null],
    domande: [
      { q: 'Da che parte guarda la regina?', a: ['Verso destra', 'Verso sinistra', 'Verso chi guarda'], ok: 0, at: { x: 38, y: 37, z: 2.2 } },
      { q: 'Che cosa fa con la mano che non tiene la spada?', a: ['La posa sul cuore', 'La tiene alzata e aperta', 'Regge una coppa'], ok: 1, at: { x: 70, y: 38, z: 2.2 } },
    ],
  },
  s14: {
    looks: [{ x: 55, y: 30, z: 1.5 }, null, null],
    domande: [
      { q: 'Da che parte guarda il re?', a: ['Verso sinistra', 'Verso destra', 'Dritto verso chi guarda'], ok: 2, at: { x: 47, y: 27, z: 2.2 } },
      { q: 'Di che colore è la veste del re?', a: ['Azzurra', 'Rossa', 'Gialla'], ok: 0, at: { x: 45, y: 65, z: 1.5 } },
    ],
  },
  p01: {
    looks: [{ x: 50, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa c\'è nel giardino, in basso?', a: ['Una fontana', 'Un arco di siepe', 'Un cancello di ferro'], ok: 1, at: { x: 70, y: 80, z: 2 } },
      { q: 'Da dove esce la mano che regge la moneta?', a: ['Dalla terra', 'Da una manica rossa', 'Da una nuvola'], ok: 2, at: { x: 22, y: 48, z: 1.8 } },
    ],
  },
  p02: {
    looks: [{ x: 50, y: 50, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa lega insieme le due monete?', a: ['Un nastro verde', 'Una catena d\'oro', 'Una corda rossa'], ok: 0, at: { x: 48, y: 50, z: 1.5 } },
      { q: 'Che cosa si vede sul mare alle sue spalle?', a: ['Un faro', 'Delle navi sulle onde', 'Un\'isola'], ok: 1, at: { x: 50, y: 78, z: 1.8 } },
    ],
  },
  p03: {
    looks: [{ x: 50, y: 50, z: 1.5 }, null, null],
    domande: [
      { q: 'Su che cosa sta in piedi l\'artigiano?', a: ['Su una scala', 'Su una botte', 'Su una panca'], ok: 2, at: { x: 22, y: 85, z: 2 } },
      { q: 'Dove si svolge la scena?', a: ['Sotto archi di pietra', 'In un campo', 'Su una nave'], ok: 0, at: { x: 50, y: 25, z: 1.5 } },
    ],
  },
  p04: {
    looks: [{ x: 46, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa c\'è alle spalle della figura?', a: ['Il mare', 'Una città', 'Un bosco'], ok: 1, at: { x: 80, y: 76, z: 2 } },
      { q: 'Come tiene la moneta che ha davanti al petto?', a: ['Sul palmo aperto', 'Appesa a una catena', 'Stretta tra le braccia'], ok: 2, at: { x: 48, y: 56, z: 2 } },
    ],
  },
  p05: {
    looks: [{ x: 38, y: 48, z: 1.5 }, null, null],
    domande: [
      { q: 'Che tempo fa nella scena?', a: ['Nevica', 'Piove', 'C\'è il sole'], ok: 0, at: { x: 15, y: 50, z: 1.5 } },
      { q: 'Con che cosa si aiuta a camminare una delle figure?', a: ['Con una spada', 'Con le stampelle', 'Con un bastone fiorito'], ok: 1, at: { x: 28, y: 85, z: 2 } },
    ],
  },
  p06: {
    looks: [{ x: 50, y: 78, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa tiene nella mano alzata la figura in piedi?', a: ['Una spada', 'Una lanterna', 'Una bilancia'], ok: 2, at: { x: 82, y: 50, z: 2.2 } },
      { q: 'Quante figure sono in ginocchio?', a: ['Due', 'Una', 'Tre'], ok: 0, at: { x: 50, y: 80, z: 1.5 } },
    ],
  },
  p07: {
    looks: [{ x: 48, y: 62, z: 1.5 }, null, null],
    domande: [
      { q: 'Su che cosa si appoggia la figura?', a: ['Su una spada', 'Sul manico del suo attrezzo', 'Su un muretto'], ok: 1, at: { x: 60, y: 40, z: 2 } },
      { q: 'Dove stanno quasi tutte le monete?', a: ['Dentro un forziere', 'Su un tavolo', 'Su una pianta piena di foglie'], ok: 2, at: { x: 25, y: 70, z: 1.6 } },
    ],
  },
  p08: {
    looks: [{ x: 50, y: 58, z: 1.5 }, { con: ['p03'] }, null],
    domande: [
      { q: 'Che cosa tiene nella mano alzata?', a: ['Un martello', 'Un pennello', 'Una falce'], ok: 0, at: { x: 60, y: 62, z: 2.6 } },
      { q: 'Dove è seduta la figura?', a: ['Per terra', 'Su una panca di legno', 'Su un trono'], ok: 1, at: { x: 30, y: 85, z: 1.8 } },
    ],
  },
  p09: {
    looks: [{ x: 45, y: 60, z: 1.5 }, null, null],
    domande: [
      { q: 'Quale animale tiene sulla mano?', a: ['Una colomba', 'Un gatto', 'Un falco'], ok: 2, at: { x: 72, y: 26, z: 2.4 } },
      { q: 'Che frutti crescono intorno a lei?', a: ['Grappoli d\'uva', 'Mele rosse', 'Melagrane'], ok: 0, at: { x: 85, y: 52, z: 1.8 } },
    ],
  },
  p10: {
    looks: [{ x: 55, y: 55, z: 1.5 }, null, null],
    domande: [
      { q: 'Quanti cani ci sono?', a: ['Uno', 'Due', 'Tre'], ok: 1, at: { x: 68, y: 82, z: 2 } },
      { q: 'Chi è seduto a sinistra nel disegno?', a: ['Un bambino', 'Un cavaliere in armatura', 'Un vecchio dai capelli bianchi'], ok: 2, at: { x: 25, y: 65, z: 1.8 } },
    ],
  },
  p11: {
    looks: [{ x: 70, y: 50, z: 1.5 }, null, null],
    domande: [
      { q: 'Di che colore è la tunica?', a: ['Verde', 'Azzurra', 'Nera'], ok: 0, at: { x: 42, y: 48, z: 1.6 } },
      { q: 'Che cosa si vede in lontananza, dietro la figura?', a: ['Il mare', 'Una montagna azzurra', 'Un castello'], ok: 1, at: { x: 75, y: 78, z: 2 } },
    ],
  },
  p12: {
    looks: [{ x: 55, y: 50, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa fa il cavallo?', a: ['Galoppa', 'S\'impenna', 'Sta fermo'], ok: 2, at: { x: 55, y: 75, z: 1.5 } },
      { q: 'Che cosa spunta in cima all\'elmo?', a: ['Un ciuffo di foglie verdi', 'Un paio d\'ali', 'Piume rosse'], ok: 0, at: { x: 22, y: 18, z: 2.6 } },
    ],
  },
  p13: {
    looks: [{ x: 58, y: 35, z: 1.5 }, null, null],
    domande: [
      { q: 'Dove guarda la regina?', a: ['Verso il cielo', 'In basso, verso la moneta', 'Verso chi guarda'], ok: 1, at: { x: 40, y: 36, z: 2 } },
      { q: 'Di che colore è la veste della regina?', a: ['Azzurra', 'Nera', 'Rossa'], ok: 2, at: { x: 38, y: 65, z: 1.6 } },
    ],
  },
  p14: {
    looks: [{ x: 50, y: 50, z: 1.5 }, null, null],
    domande: [
      { q: 'Che cosa si vede alle sue spalle, a destra nel disegno?', a: ['Un castello', 'Il mare', 'Un bosco'], ok: 0, at: { x: 87, y: 40, z: 2.2 } },
      { q: 'Oltre alla moneta, che cosa tiene in mano il re?', a: ['Una spada', 'Uno scettro', 'Una coppa'], ok: 1, at: { x: 27, y: 48, z: 2.4 } },
    ],
  },
};
