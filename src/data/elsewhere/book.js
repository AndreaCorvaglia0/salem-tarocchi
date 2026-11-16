// ALTROVE · Dentro un libro: a story read in the library (the open book on the library table). Two pages,
// src/data/world/book1.js and book2.js; the rule (written lines) src/world/elsewhere.rules.js. Format: clouds.js.
// Fork steps carry `at` (the fork's anchor: the end of the sentence painted on the floor), `sentence` (with
// ___ for the blank), `next` (where the right word's line goes: the next fork, the page's corner, the capital)
// and `blot` (where a wrong word's line ends; the wrong room stands there, then the line goes on to `next`).
// The tale is about a girl very like her (she comes to a village in the snow, stands at a closed door, has a
// light at her window). Each word's tags decide which word is right. A wrong word writes the tale into a
// blot, and in each blot is what the tale would have been with that word. Tartufo is with her.
import { T } from '../story/h.js';

export default {
  id: 'book',
  title: 'Dentro un libro',
  map: 'book1',
  start: 'book1.start',
  device: 'pages', // the passage: pages turning
  mood: 'reading',
  maxFalls: 0,
  note: 'Sul tavolo della biblioteca è rimasto aperto un libro di storie che ieri non c\'era, e Tartufo ci gira intorno senza sedercisi sopra.',
  when: { any: [{ chapterMin: 2 }, { flag: 'lesson.fly' }] },
  after: ['library.first'],
  trigger: {
    at: 'library.book', art: 'book', dx: -1, dy: 0, label: 'Un libro aperto', verb: 'Leggi',
    script: [
      T('Sul tavolo c\'è un libro aperto a metà, più piccolo degli altri, senza titolo sul dorso. La prima riga dice: «C\'era una ragazza che arrivò in un villaggio una notte che nevicava, con una carta sola in tasca».'),
      T('Mi chino per leggere la seconda riga, e la seconda riga si china verso di me. Faccio appena in tempo a sentire Tartufo che mi salta sulla spalla.'),
    ],
  },
  item: { id: 'book.ribbon', name: 'un segnalibro di seta rossa' },
  hint: 'Puoi camminare solo sulle righe scritte. Raggiungi il punto che brilla.',
  steps: [
    { lines: [
      ['narra', 'Le lettere diventano alte come case, e la carta sotto i piedi è tiepida e un poco ruvida, come il pane del giorno prima. Intorno a te la pagina bianca si stende fino all\'orizzonte.'],
      ['tu', 'Sono dentro la storia, e le righe sono strade. Dove non c\'è scritto niente non c\'è niente davvero, nemmeno un pavimento.'],
      ['tartufo', '(Io qui lascio le impronte nere, guarda. Cammina sulle parole, e non chiedermi chi è la ragazza di cui parlano, perché ha il tuo modo di tenere la borsa.)'],
    ] },
    { room: 'at1' },
    { fork: { kind: 'idea', options: [
      { text: 'cominciò', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'si fermò', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'tornò indietro', tags: { moto: 'torna' } },
    ] }, at: 'book1.fork1', sentence: 'Arrivò al villaggio nella neve, e la sua strada ___', next: 'book1.fork2', blot: 'book1.blot1',
    who: 'tu', t: 'Chi ha scritto questa storia ha lasciato un buco proprio dove si decide che cosa succede. Chiedo alle carte quale parola ci va.', wrong: 'blot1' },
    { room: 'at2' },
    { fork: { kind: 'segno', options: [
      { text: 'bussò', sign: 'go' },
      { text: 'aspettò', sign: 'stop' },
    ] }, at: 'book1.fork2', sentence: 'Davanti alla porta chiusa, la ragazza ___', next: 'book1.turn', blot: 'book1.blot2',
    who: 'tu', t: 'Questa porta la conosco, e so che cosa ho fatto io quella sera. Ma la storia non è la mia, quindi lascio decidere alla carta.', wrong: 'blot2' },
    { room: 'at3' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di qualcosa che comincia o che cresce, scrivi «si accese». Se parla di qualcosa che si ferma, che finisce o che ritorna, scrivi «si spense».', options: [
      { text: 'si accese', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'si spense', tags: { moto: ['ferma', 'chiude', 'torna'] } },
    ] }, at: 'book2.fork3', sentence: 'Quella notte, alla sua finestra, il lume ___', next: 'book2.capital', blot: 'book2.blot3',
    who: 'tu', t: 'In fondo alla pagina qualcuno ha aggiunto una nota in rosso, con una mano diversa, per chi doveva finire la storia. La leggo, e poi pesco.', wrong: 'blot3' },
    { room: 'end' },
  ],
  rooms: {
    at1: { good: true, at: 'book1.fork1', lines: [['narra', 'La riga corre dritta e poi si interrompe davanti a un vuoto largo quanto una parola. Oltre il vuoto la pagina aspetta, e dal bianco viene un odore di neve.']] },
    blot1: { good: false, at: 'book1.blot1', lines: [
      ['narra', 'Non era la parola che indicava la carta, e la riga piega di lato fino a una macchia d\'inchiostro grande come uno stagno. Dentro la macchia c\'è la storia come sarebbe andata con quella parola: una strada vuota, e una ragazza di schiena che non si vede in faccia.'],
      ['tartufo', '(Non guardarla troppo, quella lì. Tira fuori il piede, che l\'inchiostro si è già preso una tua moneta e ne vorrebbe un\'altra.)'],
    ], loss: { coins: 1 } },
    at2: { good: true, at: 'book1.fork2', lines: [['narra', 'La riga adesso passa davanti a una porta disegnata a penna, con una finestra illuminata accanto. Dietro il vetro si muove l\'ombra di una donna con una treccia a corona, che non può sentirvi.']] },
    blot2: { good: false, at: 'book1.blot2', lines: [['narra', 'La carta diceva l\'altra parola. La riga cola verso il basso in una macchia fredda che appiccica, e dentro la macchia c\'è la porta, rimasta chiusa per sempre, con la neve che si accumula sulla soglia. Quando ne esci hai le calze nere fino al ginocchio, e una moneta di meno.']], loss: { coins: 1 } },
    at3: { good: true, at: 'book2.fork3', lines: [
      ['narra', 'La pagina nuova è più vecchia dell\'altra, ingiallita ai bordi, e qualcuno l\'ha letta tante volte da consumare gli angoli. Qui la storia è quasi finita, e manca soltanto l\'ultima parola.'],
      ['tartufo', '(In questa pagina c\'è un gatto, tre righe più su. È nero, è descritto bene, e non dice una parola. Chiunque abbia scritto questa storia, mi conosceva.)'],
    ] },
    blot3: { good: false, at: 'book2.blot3', lines: [['narra', 'Hai letto la nota al contrario. La macchia ti tira giù fino alle ginocchia, e nel nero vedi una finestra buia in una casa dove nessuno aspetta nessuno. Tartufo ti prende la manica fra i denti e tira finché non sei fuori, con una moneta rimasta sul fondo.']], loss: { coins: 1 } },
    end: { good: true, at: 'book2.capital', lines: [
      ['narra', 'L\'ultima parola è seguita da una grande lettera dorata, alta come un campanile, e ai suoi piedi c\'è una porticina. Sopra, in piccolo, si legge: «Fine, per adesso».'],
      ['tu', 'Dalla porticina si vede il tavolo della biblioteca, con la mia sedia scostata e la candela a metà. La storia è chiusa, e la ragazza che ci abita sta bene.'],
    ] },
  },
  outcomes: {
    perfect: { lines: [
      ['narra', 'Sei seduta al tavolo con il libro chiuso davanti, e Tartufo ha le zampe pulite. Il libro adesso ha un titolo sul dorso, in lettere d\'oro appena asciutte, ed è il tuo nome.'],
      ['tu', 'Fra le pagine spunta un segnalibro di seta rossa che prima non c\'era, e quando lo tiro viene via senza resistenza. Lo metto nel grimorio: segna sempre la pagina che mi serve, anche quando non so ancora quale sia.'],
    ], reward: { xp: 30, coins: 5, item: 'book.ribbon' } },
    pass: { lines: [['tu', 'Sono di nuovo in biblioteca, con le dita sporche d\'inchiostro e Tartufo che si lecca una zampa nera con aria offesa. La storia è finita bene lo stesso, anche se in un paio di punti si vede la mia calligrafia.']], reward: { xp: 15, coins: 2 } },
    fail: { lines: [
      ['narra', 'A forza di macchie la pagina non regge più, e il libro si chiude di colpo. Ti ritrovi con la testa sulla copertina, le mani nere, e la sensazione di aver lasciato qualcuno a metà di una frase.'],
      ['tartufo', '(Dalle tasche ti sono cadute delle monete là dentro, e non credo che un libro dia il resto. Lasciamolo asciugare, e un altro giorno la finiamo meglio.)'],
    ], loss: { coins: 3 } },
  },
};
