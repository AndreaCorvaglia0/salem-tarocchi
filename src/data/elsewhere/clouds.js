// ALTROVE · Sulle nuvole: a potion drunk by mistake (the green bottle on the shelf of her cottage). The map is
// src/data/world/clouds.js; the rule (thin cloud) src/world/elsewhere.rules.js; the visit glue/elsewhere.js.
// The format is a trial's (src/trials/run.js) with a few fields of Altrove:
//   map/start/device/maxFalls/mood   where she appears, the passage, how many falls end it (3)
//   trigger { at, art, dx, dy, label, verb, script }   the thing in Salem that starts it (script: story nodes)
//   item { id, name }                the special object of a perfect visit (reward.item = id; flag item.<id>)
//   fork steps carry `bridge`: the fork's index in the map (its bridges are digits 1-3, 4-6, 7-8)
//   rooms may carry `at`: an anchor she must walk to before the room's lines
// The forks are real (their tags are dealt unambiguously: tests/elsewhere.test.mjs).
// The place has a voice: the one who lives up there is the Wind, who never arrives on time and leaves notes
// (the door, the ladder, the tea). She never meets him: the true moment is the cup he kept warm for her.
import { T } from '../story/h.js';

export default {
  id: 'clouds',
  title: 'Sulle nuvole',
  map: 'clouds',
  start: 'clouds.start',
  device: 'potion', // the passage: a green swirl
  mood: 'title', // the airiest of the existing moods (glue/elsewhere.js asks for it on arrival)
  maxFalls: 3,
  note: 'Sulla mensola della capanna c\'è una boccetta verde che non ricordo di avere comprato, e ogni tanto il tappo si muove da solo.',
  when: { any: [{ chapterMin: 2 }, { flag: 'lesson.fly' }] },
  after: ['elsewhere.book'], // one at a time: the book first, then the clouds
  trigger: {
    at: 'cottage.shelf', art: 'bottle', dx: 0, dy: -1, label: 'Una boccetta verde', verb: 'Guarda',
    script: [
      T('Fra il barattolo del sale e quello della salvia c\'è una boccetta verde che non ho mai comprato. Sull\'etichetta qualcuno ha scritto, con una calligrafia tutta inclinata: «Per il mal di terra».'),
      T('Io pensavo fosse lo sciroppo per la tosse, e ne ho già mandato giù un sorso. Sa di menta e di pioggia, e il pavimento ha appena smesso di essere dove l\'avevo lasciato.'),
    ],
  },
  item: { id: 'clouds.feather', name: 'una piuma di nuvola' },
  hint: 'Raggiungi il punto che brilla. Le nuvole sottili non reggono: guarda bene dove metti i piedi.',
  steps: [
    { lines: [
      ['narra', 'Il pavimento della capanna si fa morbido, poi bianco, e quando guardi in basso hai sotto i piedi una nuvola larga come la piazza di Salem. Il villaggio è laggiù, piccolo come un presepe.'],
      ['tu', 'Sono in cielo, e mi tiene su una cosa fatta di acqua e di aria. In fondo c\'è una porta che sta in piedi da sola, e ho idea che sia l\'unico modo di tornare a casa.'],
      ['narra', 'Su un paletto piantato nella nuvola c\'è un biglietto, scritto con la stessa calligrafia inclinata della boccetta: «Benvenuta, e scusa il ritardo, che è il mio solito. Dove la nuvola è sottile non reggo nemmeno io. Firmato, il Vento».'],
    ] },
    { room: 'at1' },
    { fork: { kind: 'segno', options: [
      { text: 'Prendo il ponte in alto, e lo passo di buon passo.', sign: 'go' },
      { text: 'Prendo il ponte in mezzo, piano, provando ogni passo.', sign: 'slow' },
      { text: 'Prendo il ponte in basso, dopo aver aspettato che smetta di muoversi.', sign: 'stop' },
    ] }, bridge: 0, who: 'tu', t: 'Tre ponti, e da qui sembrano fatti tutti e tre della stessa panna. Chiedo a una carta quale mi regge.', wrong: 'wrong1' },
    { room: 'at2' },
    { fork: { kind: 'idea', options: [
      { text: 'Il ponte a sinistra, che sale verso il sole appena spuntato.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Il ponte in mezzo, che finisce contro un muro di nebbia ferma.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Il ponte a destra, che fa un giro largo e torna verso di me.', tags: { moto: 'torna' } },
    ] }, bridge: 1, who: 'tu', t: 'Qui il biglietto del Vento dice soltanto: «Uno dei tre è quello buono, e oggi non ricordo quale». Lo chiedo alla carta.', wrong: 'wrong2' },
    { room: 'at3' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di qualcosa che comincia o che cresce, il ponte in alto. Se parla di qualcosa che si ferma, che finisce o che ritorna, il ponte in basso.', options: [
      { text: 'Prendo il ponte in alto.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Prendo il ponte in basso.', tags: { moto: ['ferma', 'chiude', 'torna'] } },
    ] }, bridge: 2, who: 'tu', t: 'Sotto la zuccheriera c\'è un altro biglietto, e stavolta il Vento si è ricordato la regola. La leggo, e poi pesco.', wrong: 'wrong3' },
    { room: 'end' },
  ],
  rooms: {
    at1: { good: true, at: 'clouds.fork1', lines: [['narra', 'Il bordo della nuvola si sfilaccia in tre ponti, che dondolano appena, come panni stesi. Sotto, fra l\'uno e l\'altro, passa uno stormo di oche che non ti degna di uno sguardo.']] },
    wrong1: { good: false, lines: [['narra', 'Non era il ponte che diceva la carta. Sotto il primo passo senti la nuvola cedere come neve vecchia, e in più punti adesso si vede attraverso: laggiù c\'è il tetto della tua capanna, grande quanto un\'unghia.']] },
    at2: { good: true, at: 'clouds.fork2', lines: [['narra', 'Qui c\'è una scala a pioli che sale dritta nel cielo e finisce nel niente. Sull\'ultimo piolo è posato un paio di scarpe, e un biglietto dice: «Torno subito, e non salite, che ci sono già io».']] },
    wrong2: { good: false, lines: [['narra', 'La carta indicava un altro ponte. Questo è più sottile di quanto sembrava, e dai buchi sale un freddo che sa di camino spento: da quassù senti perfino la campana di Salem, piccola come un cucchiaino in una tazza.']] },
    at3: { good: true, at: 'clouds.fork3', lines: [
      ['narra', 'In mezzo alla nuvola c\'è un tavolino da tè apparecchiato per due, con la tovaglia fermata da quattro sassi. Una tazza è vuota e ha il segno di un labbro, e l\'altra è piena e fuma ancora.'],
      ['tu', 'Sul piattino della tazza piena c\'è scritto il mio nome. Qualcuno che non conosco mi ha tenuto il tè in caldo, senza sapere a che ora sarei arrivata.'],
    ] },
    wrong3: { good: false, lines: [['narra', 'Hai letto la regola al contrario. Il ponte si apre qua e là come una calza smagliata, e dai buchi vedi passare, molto più in basso, l\'ombra della nuvola che cammina sopra i campi.']] },
    end: { good: true, at: 'clouds.exit', lines: [['narra', 'La porta non ha muro né casa, soltanto uno stipite e un battente verde. Quando la tocchi si apre da sola, e dall\'altra parte c\'è la tua capanna, con il fuoco acceso e la mensola al suo posto.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['narra', 'Sei di nuovo in piedi sul tuo pavimento, e non hai messo un piede in fallo nemmeno una volta. Dalla porta, prima che sparisca, entra un soffio che ti scompiglia i capelli, come farebbe uno che saluta di corsa.'],
      ['tu', 'In mano mi è rimasta una piuma bianca che non pesa niente e non si lascia posare: se la metto sul tavolo, sale. La tengo nel grimorio, e quando la guardo mi ricordo che lassù qualcuno mi aspetta per il tè.'],
    ], reward: { xp: 30, coins: 5, item: 'clouds.feather' } },
    pass: { lines: [['tu', 'Sono a casa, con le ginocchia che tremano ancora un poco e l\'orlo della gonna bagnato di nuvola. La boccetta verde è tornata sulla mensola, e giurerei che è di nuovo piena.']], reward: { xp: 15, coins: 2 } },
    fail: { lines: [
      ['narra', 'La nuvola si apre sotto di te un\'ultima volta, e stavolta non c\'è niente a cui tenersi. Cadi a lungo, attraverso un freddo bianco, e ti svegli sul pavimento della capanna con il cuore che batte forte e un ginocchio sbucciato.'],
      ['tu', 'La boccetta è rotolata sotto il letto, vuota, e nella caduta dalla borsa mi è volato via qualcosa che adesso sarà sparso sui tetti di Salem. Un altro giorno, magari, ci riprovo.'],
    ], loss: { coins: 3, tool: 'bottle' } },
  },
};
