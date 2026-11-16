// ALTROVE · Dentro un libro: a story read in the library (the open book on the library table). Two pages,
// src/data/world/book1.js and book2.js; the rule (written lines) src/world/elsewhere.rules.js. Format: clouds.js.
// Fork steps carry `at` (the fork's anchor: the end of the sentence painted on the floor), `sentence` (with
// ___ for the blank), `next` (where the right word's line goes: the next fork, the page's corner, the capital)
// and `blot` (where a wrong word's line ends; the wrong room stands there, then the line goes on to `next`).
// ALL LINES ARE PLACEHOLDERS, each marked TODO-writer with an id:
//   book.trigger book.intro book.at1 book.sentence1 book.blot1 book.at2 book.sentence2 book.blot2 book.at3
//   book.sentence3 book.blot3 book.end book.perfect book.pass book.fail book.note book.item, and the words
//   of the three forks (book.fork1.options ...: keep each word's tags, they decide which word is right)
import { T } from '../story/h.js';

export default {
  id: 'book',
  title: 'Dentro un libro', // TODO-writer book.title
  map: 'book1',
  start: 'book1.start',
  device: 'pages', // the passage: pages turning
  mood: 'reading',
  maxFalls: 0,
  note: 'Sul tavolo della biblioteca è rimasto aperto un libro di storie.', // TODO-writer book.note
  when: { any: [{ chapterMin: 2 }, { flag: 'lesson.fly' }] },
  after: ['library.first'],
  trigger: {
    at: 'library.book', art: 'book', dx: -1, dy: 0, label: 'Un libro aperto', verb: 'Leggi',
    script: [
      T('Sul tavolo c\'è un libro aperto a metà, con le pagine che odorano di cera.'), // TODO-writer book.trigger
      T('Comincio a leggere una riga, e la riga mi tira dentro.'), // TODO-writer book.trigger
    ],
  },
  item: { id: 'book.ribbon', name: 'un segnalibro di seta rossa' }, // TODO-writer book.item
  hint: 'Puoi camminare solo sulle righe scritte. Raggiungi il punto che brilla.',
  steps: [
    { lines: [ // TODO-writer book.intro
      ['narra', 'Le lettere diventano grandi come case, e la carta sotto i piedi è calda come pane.'],
      ['tu', 'Sono dentro la storia. Le righe sono strade, e il resto della pagina non mi regge.'],
    ] },
    { room: 'at1' },
    { fork: { kind: 'idea', options: [ // TODO-writer book.fork1.options
      { text: 'comincia', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'finisce', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'ritorna', tags: { moto: 'torna' } },
    ] }, at: 'book1.fork1', sentence: 'La strega aprì il libro, e la storia ___', next: 'book1.fork2', blot: 'book1.blot1', // TODO-writer book.sentence1
    who: 'tu', t: 'Nella frase manca una parola. Chiedo alle carte quale scrivere.', wrong: 'blot1' },
    { room: 'at2' },
    { fork: { kind: 'segno', options: [ // TODO-writer book.fork2.options
      { text: 'corse', sign: 'go' },
      { text: 'si fermò', sign: 'stop' },
    ] }, at: 'book1.fork2', sentence: 'Davanti al bosco, la ragazza ___', next: 'book1.turn', blot: 'book1.blot2', // TODO-writer book.sentence2
    who: 'tu', t: 'Un\'altra parola che manca.', wrong: 'blot2' },
    { room: 'at3' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di un inizio o di qualcosa che cresce, scrivi «si accese»; altrimenti «si spense».', options: [ // TODO-writer book.fork3.options
      { text: 'si accese', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'si spense', tags: { moto: ['ferma', 'chiude', 'torna'] } },
    ] }, at: 'book2.fork3', sentence: 'Sulla torre, la lanterna ___', next: 'book2.capital', blot: 'book2.blot3', // TODO-writer book.sentence3
    who: 'tu', t: 'In fondo alla pagina c\'è una regola, scritta in rosso.', wrong: 'blot3' },
    { room: 'end' },
  ],
  rooms: {
    at1: { good: true, at: 'book1.fork1', lines: [['narra', 'La riga finisce in un vuoto, dove dovrebbe esserci una parola.']] }, // TODO-writer book.at1
    blot1: { good: false, at: 'book1.blot1', lines: [['narra', 'La riga ti porta dritta in una macchia d\'inchiostro, e una moneta ci resta dentro.']], loss: { coins: 1 } }, // TODO-writer book.blot1
    at2: { good: true, at: 'book1.fork2', lines: [['narra', 'Un\'altra frase a metà.']] }, // TODO-writer book.at2
    blot2: { good: false, at: 'book1.blot2', lines: [['narra', 'Ancora una macchia: l\'inchiostro è freddo e appiccica.']], loss: { coins: 1 } }, // TODO-writer book.blot2
    at3: { good: true, at: 'book2.fork3', lines: [['narra', 'La pagina nuova è più vecchia dell\'altra, e ingiallita.']] }, // TODO-writer book.at3
    blot3: { good: false, at: 'book2.blot3', lines: [['narra', 'La macchia ti tira giù fino alle ginocchia.']], loss: { coins: 1 } }, // TODO-writer book.blot3
    end: { good: true, at: 'book2.capital', lines: [['narra', 'La grande lettera ha una porticina d\'oro, e la porticina dà sulla biblioteca.']] }, // TODO-writer book.end
  },
  outcomes: {
    perfect: { lines: [['tu', 'Tra le pagine è rimasto un segnalibro rosso, e adesso è mio.']], reward: { xp: 30, coins: 5, item: 'book.ribbon' } }, // TODO-writer book.perfect
    pass: { lines: [['tu', 'Sono di nuovo in biblioteca, con le dita sporche d\'inchiostro.']], reward: { xp: 15, coins: 2 } }, // TODO-writer book.pass
    fail: { lines: [['narra', 'Il libro si chiude di colpo, e ti ritrovi seduta al tavolo con la testa sulle pagine.']], loss: { coins: 3 } }, // TODO-writer book.fail
  },
};
