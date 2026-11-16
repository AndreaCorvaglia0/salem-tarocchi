// ALTROVE · Sulle nuvole: a potion drunk by mistake (the green bottle on the shelf of her cottage). The map is
// src/data/world/clouds.js; the rule (thin cloud) src/world/elsewhere.rules.js; the visit glue/elsewhere.js.
// The format is a trial's (src/trials/run.js) with a few fields of Altrove:
//   map/start/device/maxFalls/mood   where she appears, the passage, how many falls end it (3)
//   trigger { at, art, dx, dy, label, verb, script }   the thing in Salem that starts it (script: story nodes)
//   item { id, name }                the special object of a perfect visit (reward.item = id; flag item.<id>)
//   fork steps carry `bridge`: the fork's index in the map (its bridges are digits 1-3, 4-6, 7-8)
//   rooms may carry `at`: an anchor she must walk to before the room's lines
// The forks are real (their tags are dealt unambiguously: tests/elsewhere.test.mjs). ALL LINES ARE
// PLACEHOLDERS for the writer, each marked TODO-writer with an id:
//   clouds.trigger clouds.intro clouds.at1 clouds.fork1 clouds.wrong1 clouds.at2 clouds.fork2 clouds.wrong2
//   clouds.at3 clouds.fork3 clouds.wrong3 clouds.end clouds.perfect clouds.pass clouds.fail clouds.note
//   clouds.item, and the option texts of the three forks (clouds.fork1.options ...)
import { T } from '../story/h.js';

export default {
  id: 'clouds',
  title: 'Sulle nuvole', // TODO-writer clouds.title
  map: 'clouds',
  start: 'clouds.start',
  device: 'potion', // the passage: a green swirl
  mood: 'title', // the airiest of the existing moods (glue/elsewhere.js asks for it on arrival)
  maxFalls: 3,
  note: 'Sulla mensola del cottage c\'è una boccetta verde che non ricordo di avere comprato.', // TODO-writer clouds.note
  when: { any: [{ chapterMin: 2 }, { flag: 'lesson.fly' }] },
  after: ['elsewhere.book'], // one at a time: the book first, then the clouds
  trigger: {
    at: 'cottage.shelf', art: 'bottle', dx: 0, dy: -1, label: 'Una boccetta verde', verb: 'Guarda',
    script: [
      T('Sulla mensola c\'è una boccetta verde, e non ricordo proprio di averla messa lì.'), // TODO-writer clouds.trigger
      T('Profuma di menta e di pioggia. Ne bevo un sorso soltanto, per capire che cos\'è.'), // TODO-writer clouds.trigger
    ],
  },
  item: { id: 'clouds.feather', name: 'una piuma di nuvola' }, // TODO-writer clouds.item
  hint: 'Raggiungi il punto che brilla. Le nuvole sottili non reggono: guarda bene dove metti i piedi.',
  steps: [
    { lines: [ // TODO-writer clouds.intro
      ['narra', 'Il pavimento del cottage si fa morbido, poi bianco, e sotto i piedi adesso hai una nuvola.'],
      ['tu', 'Sono in cielo. Laggiù, in fondo, c\'è una porta che sta in piedi da sola.'],
    ] },
    { room: 'at1' },
    { fork: { kind: 'segno', options: [ // TODO-writer clouds.fork1.options
      { text: 'Il ponte in alto: vado spedita.', sign: 'go' },
      { text: 'Il ponte in mezzo: vado piano.', sign: 'slow' },
      { text: 'Il ponte in basso: aspetto e guardo.', sign: 'stop' },
    ] }, bridge: 0, who: 'tu', t: 'Tre ponti di nuvola, e uno solo mi regge. Chiedo alle carte.', wrong: 'wrong1' }, // TODO-writer clouds.fork1
    { room: 'at2' },
    { fork: { kind: 'idea', options: [ // TODO-writer clouds.fork2.options
      { text: 'Il ponte a sinistra, che sale verso il sole.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Il ponte in mezzo, che finisce in un muro di nebbia.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Il ponte a destra, che gira e torna su se stesso.', tags: { moto: 'torna' } },
    ] }, bridge: 1, who: 'tu', t: 'Ancora tre ponti, che salgono.', wrong: 'wrong2' }, // TODO-writer clouds.fork2
    { room: 'at3' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di un inizio o di qualcosa che cresce, il ponte in alto; altrimenti quello in basso.', options: [ // TODO-writer clouds.fork3.options
      { text: 'Il ponte in alto.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Il ponte in basso.', tags: { moto: ['ferma', 'chiude', 'torna'] } },
    ] }, bridge: 2, who: 'tu', t: 'Sul tavolino qualcuno ha lasciato un biglietto con una regola.', wrong: 'wrong3' }, // TODO-writer clouds.fork3
    { room: 'end' },
  ],
  rooms: {
    at1: { good: true, at: 'clouds.fork1', lines: [['narra', 'Il bordo della nuvola si sfilaccia in tre ponti.']] }, // TODO-writer clouds.at1
    wrong1: { good: false, lines: [['narra', 'Il ponte trema appena sotto il primo passo.']] }, // TODO-writer clouds.wrong1
    at2: { good: true, at: 'clouds.fork2', lines: [['narra', 'Una scala sale nel vuoto e non porta da nessuna parte.']] }, // TODO-writer clouds.at2
    wrong2: { good: false, lines: [['narra', 'Il ponte è più sottile di quanto sembrava.']] }, // TODO-writer clouds.wrong2
    at3: { good: true, at: 'clouds.fork3', lines: [['narra', 'Un tavolino da tè, apparecchiato per qualcuno che non c\'è.']] }, // TODO-writer clouds.at3
    wrong3: { good: false, lines: [['narra', 'Qua e là la nuvola lascia vedere il cielo.']] }, // TODO-writer clouds.wrong3
    end: { good: true, at: 'clouds.exit', lines: [['narra', 'La porta si apre da sola, e dietro c\'è il tuo cottage.']] }, // TODO-writer clouds.end
  },
  outcomes: {
    perfect: { lines: [['tu', 'Nella mano mi è rimasta una piuma bianca, leggera come il fiato.']], reward: { xp: 30, coins: 5, item: 'clouds.feather' } }, // TODO-writer clouds.perfect
    pass: { lines: [['tu', 'Sono a casa, con le ginocchia che tremano ancora un poco.']], reward: { xp: 15, coins: 2 } }, // TODO-writer clouds.pass
    fail: { lines: [['narra', 'Cadi, e cadendo ti svegli sul pavimento del cottage, con la boccetta vuota accanto.']], loss: { coins: 3, tool: 'bottle' } }, // TODO-writer clouds.fail
  },
};
