// The smoke rite (notes/rito/PROGETTO.md, the spec; notes/rito/costruzione.md, what was built): the opening
// grain of incense, the five airs, what Malva lights for each kind of question, and every line she reads.
// Rules: glue/rite.rules.js. Overlay: ui/rite/. Each air comes from the knowledge base (src/data/sapere.js,
// `sapere` is a smoke id there); its music was chosen by measurement and is PROVISIONAL until the blind
// listening test (<site>/ascolto/, notes/rito/musica.md) says otherwise.

// The element's sign, drawn in the smoke when an air is lit: a path in a 100x100 box.
export const SIGNS = {
  fuoco: 'M50 14 L86 80 L14 80 Z',
  acqua: 'M14 20 L86 20 L50 86 Z',
  aria: 'M50 14 L86 80 L14 80 Z M28 56 L72 56',
  terra: 'M14 20 L86 20 L50 86 Z M28 44 L72 44',
};

// How a smoke moves (ui/rite/smoke.js reads these): px/s upward, sideways sway (px) and its frequency (Hz),
// sideways spread at birth (px) and how far it opens with height (`fan`, px/s per 100 px risen), puff size at
// birth and at death (px), life (s), opacity, `sink` (px/s downward added in the second half of its life).
const smoke = (o) => ({ rise: 40, sway: 6, swayHz: 0.3, spread: 8, fan: 0, size: [16, 50], life: 4, alpha: 0.3, sink: 0, ...o });

export const OPENING = {
  id: 'olibano', sapere: 'fumo-olibano', name: "l'incenso", element: 'fuoco',
  color: '#f3ead2', room: '#2a2418',
  smoke: smoke({ rise: 58, sway: 4, swayHz: 0.25, spread: 4, size: [16, 46], life: 3.8, alpha: 0.3 }),
  note: 'rite/notes/knock.mp3', // the opening motif: one stroke of a tuned Thai gong (D4), always the same
};

// The five airs, in their place on the arc (left to right). The three she has at first sit at 0, 2 and 4,
// so the two that come later fill the gaps.
export const AIRS = {
  rosa: {
    id: 'rosa', sapere: 'fumo-rosa', name: 'la rosa', element: 'acqua', planet: 'Venere', word: 'tenerezza',
    color: '#e58aa0', room: '#4a1f2e', motion: 'wave',
    smoke: smoke({ rise: 38, sway: 30, swayHz: 0.32, spread: 10, size: [22, 74], life: 5.2, alpha: 0.3 }),
    note: 'rite/notes/rosa.mp3', instrument: 'violoncello, La3 (arco)',
    track: 'rite/music/rosa', trackTitle: 'Reawakening (Kevin MacLeod)', provisional: true,
  },
  salvia: {
    id: 'salvia', sapere: 'fumo-salvia', name: 'la salvia', element: 'aria', planet: 'Giove', word: 'chiarezza',
    color: '#c9d2cf', room: '#2c3336', motion: 'wide',
    smoke: smoke({ rise: 52, sway: 8, swayHz: 0.5, spread: 6, fan: 34, size: [14, 84], life: 4.2, alpha: 0.24 }),
    note: 'rite/notes/salvia.mp3', instrument: 'crotalo, La6',
    track: 'rite/music/salvia', trackTitle: 'Fairytale Waltz (Kevin MacLeod)', provisional: true,
    gift: 'ortica',
  },
  alloro: {
    id: 'alloro', sapere: 'fumo-alloro', name: "l'alloro", element: 'fuoco', planet: 'Sole', word: 'slancio',
    color: '#e8c15a', room: '#4a3410', motion: 'up',
    smoke: smoke({ rise: 130, sway: 3, swayHz: 1.1, spread: 4, size: [20, 52], life: 2.4, alpha: 0.36 }),
    note: 'rite/notes/alloro.mp3', instrument: 'chitarra, Re4 (pizzicato)',
    track: 'rite/music/alloro', trackTitle: 'Errigal (Kevin MacLeod)', provisional: true,
  },
  mirra: {
    id: 'mirra', sapere: 'fumo-mirra', name: 'la mirra', element: 'acqua', planet: 'Luna', word: 'veglia',
    color: '#b0702e', room: '#2e1a0c', motion: 'still',
    smoke: smoke({ rise: 7, sway: 4, swayHz: 0.12, spread: 9, size: [40, 86], life: 7, alpha: 0.42 }),
    note: 'rite/notes/mirra.mp3', instrument: 'flauto contralto, Mi4',
    track: 'rite/music/mirra', trackTitle: 'Mourning Song (Kevin MacLeod)', provisional: true,
    gift: 'edera',
  },
  cipresso: {
    id: 'cipresso', sapere: 'fumo-cipresso', name: 'il cipresso', element: 'terra', planet: 'Saturno', word: 'gravità',
    color: '#4f7d5c', room: '#12261a', motion: 'low',
    smoke: smoke({ rise: 16, sway: 9, swayHz: 0.18, spread: 48, size: [30, 96], life: 6.2, alpha: 0.32, sink: 10 }),
    note: 'rite/notes/cipresso.mp3', instrument: 'contrabbasso, Re2 (arco)',
    track: 'rite/music/cipresso', trackTitle: 'Heart of Nowhere (Kevin MacLeod)', provisional: true,
  },
};
export const ARC = ['rosa', 'salvia', 'alloro', 'mirra', 'cipresso'];
export const START_AIRS = ['rosa', 'alloro', 'cipresso'];

// What Malva lights for each kind of question (the five ambiti of src/reading/ask.js), and why, in her voice.
// From the knowledge base: rosa = Venere, amore; alloro = Sole, riuscita e coraggio; salvia pulisce la casa;
// cipresso = Saturno, lasciar andare chi se ne va; mirra = Luna, veglia e conforto.
export const MALVA = {
  amore: { air: 'rosa', line: "Per l'amore accendo la rosa e non ci penso due volte, perché chi viene a chiedere d'amore arriva quasi sempre con i denti stretti." },
  lavoro: { air: 'alloro', line: "Per il lavoro e per i soldi accendo l'alloro, che sale dritto e svelto: a chi deve andare a chiedere qualcosa a un padrone un po' di coraggio serve." },
  casa: { air: 'salvia', line: 'Per le cose di casa uso la salvia, come faceva mia madre sulla soglia della stalla quando qualcuno arrivava o se ne andava.' },
  altri: { air: 'cipresso', line: "Quando la domanda è su qualcun altro, quasi sempre è qualcuno che se ne va, e allora accendo il cipresso: fa un fumo basso e pesante, ma aiuta a lasciar andare." },
  se: { air: 'mirra', line: 'Quando una chiede di sé accendo la mirra, che è il fumo della Luna e fa vegliare: le risposte su noi stesse arrivano quasi sempre di notte.' },
};
// «Per le domande di casa io accendo il cipresso.»: how each kind of question is named in her own lines
export const AMBITO_PHRASE = { amore: "le domande d'amore", lavoro: 'le domande di lavoro e di soldi', casa: 'le domande di casa', altri: 'le domande sugli altri', se: 'le domande su di me' };

// Every line she reads in the rite. The guides are interface lines (docs/WRITING.md, rule 7), shown the
// first three times only; from the fourth the rite has no words at all except the air's name.
// «la salvia» -> «la tua salvia», «il cipresso» -> «il tuo cipresso», «l'alloro» -> «il tuo alloro»
const yours = (name) => name.replace(/^la /, 'la tua ').replace(/^il /, 'il tuo ').replace(/^l'alloro/, 'il tuo alloro');
export const TEXT = {
  guide: {
    knock: 'Tieni il dito sulla brace.',
    breath: 'Respira piano, e intanto pensa alla domanda.',
    search: "Fai scorrere il dito di lato e cerca l'aria che ha questa domanda.",
  },
  still: 'La brace è ancora accesa.', // a second rite within twenty minutes
  named: (air, mine = false) => `Quest'aria è ${mine ? yours(air.name) : air.name}.`, // «la tua salvia»: an air she made
  skip: 'Leggo senza fumo',
  // the line after the reading: a fact, never an interpretation of her
  fact: (air) => `Per questa domanda hai acceso ${air.name}.`,
  askMalva: 'E Malva?',
  // her own tradition, in the grimoire (first person, docs/WRITING.md rule 12)
  mine: (ambito, air, malvaAir) => `Per ${AMBITO_PHRASE[ambito]} io accendo ${air.name}. Malva accende ${malvaAir.name}.`,
  mineTitle: 'I miei fumi',
  // the deck, with her real cards (step 4)
  deckAsk: 'Passo il fumo sul mio mazzo',
  deckLine: 'Se hai le carte vicino, fai lo stesso con la mano, piano, sopra il mazzo vero.',
  deckDone: 'Fatto',
};

// The first rite of all, at Malva's hearth: one short scene that hands the rite down
// (lore/storia/retroscena/malva-retroscena.md: Ruta, «la levatrice di allora», sent her to buy incense the first evening).
export const MALVA_SCENE = [
  { who: null, t: "Malva getta un grano d'incenso sulla brace e aspetta che il fumo salga dritto, prima di aprire bocca." },
  { who: 'Malva', t: 'Prima di guardare dentro una persona si bussa, come a una porta. La levatrice di allora me lo insegnò la prima sera, mandandomi a comprare l\'incenso con i soldi suoi.' },
  { who: 'Malva', t: "Dopo l'incenso ci vuole il fumo giusto per la domanda, e quello lo senti tu, non te lo posso dire io. Su, che la brace non aspetta." },
];

// The two airs that arrive later, one at a time, as gifts (step 4 of the spec): who brings them and what they say.
export const GIFTS = [
  {
    air: 'salvia', from: 'ortica', who: 'Ortica',
    intro: "Sul davanzale c'è un mazzetto di salvia secca, legato con lo spago della cucina di Ortica.",
    line: "L'ho seccata sulla stufa, anche se Malva dice che così perde metà del profumo, ma Malva ne dice tante, e intanto la salvia del mio orto è la migliore di Salem, chiedi pure in giro.",
  },
  {
    air: 'mirra', from: 'edera', who: 'Edera',
    intro: 'Edera ti ha mandato un grumo di mirra, avvolto in una pagina strappata da un libro.',
    line: 'Me la portò un marinaio, il capitano Hobbs, o forse era Hibbs, non ricordo più. Fa un fumo lento che sta fermo come chi veglia un malato, e a me di notte ormai serve poco.',
  },
];
