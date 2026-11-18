// Ortica's interest, herbs and garden (notes/interessi/PROGETTO.md §2 and §11): the first slice, three missions.
// Words and choices only; the rules are in src/glue/interests.rules.js, the wiring in src/glue/interests.js, the
// scenes in src/data/story/scripts/interests.ortica.js. Every mission is a flag (`int.ortica.<n>`), so what is
// done and the steps of the interest are derived from the save (tests/interests.test.mjs).
// Real-world facts used here are in docs/RESEARCH.md, «Gli interessi: erbe e orto».

// the three missions, in order: id, where Ortica asks, the scene, the registry text (the grimoire's next step)
export const ORTICA_MISSIONS = [
  { n: 1, id: 'int.ortica.1', at: 'forest.ortica_hut', script: 'int.ortica.1',
    text: 'Ortica vuole che le porti i miei mazzetti, per appenderli al trave della sua capanna, nel bosco.' },
  { n: 2, id: 'int.ortica.2', at: 'forest.ortica_hut', script: 'int.ortica.2',
    text: 'Ortica ha bisogno delle mie braccia per l\'unguento del mugnaio. Mi aspetta alla sua capanna, nel bosco.' },
  { n: 3, id: 'int.ortica.3', at: 'forest.ortica_hut', script: 'int.ortica.3',
    text: 'Ortica vuole parlarmi dell\'incenso di Malva e della salvia. Mi aspetta alla sua capanna, nel bosco.' },
];

// ---- 1. the beam: where to hang the bunches -------------------------------------------------------------
// One right place (shade and moving air); the others are answered by what would happen, and she chooses again.
export const HANG = [
  { id: 'ombra', t: 'Sotto il trave, all\'ombra, dove passa l\'aria della porta', ok: true,
    re: 'All\'ombra e all\'aria, proprio così, e a testa in giù, così il profumo scende nelle foglie e non scappa dai gambi.' },
  { id: 'sole', t: 'Fuori sul davanzale, al sole, così seccano prima',
    re: 'Al sole seccano prima, è vero, ma diventano gialle come la paglia, perché il sole si beve il colore e anche metà del profumo.' },
  { id: 'fuoco', t: 'Sopra il focolare, dove fa più caldo',
    re: 'Sopra il fuoco prendono fumo e fuliggine, e poi sanno di camino per tutto l\'inverno. Una volta ci ho seccato la salvia, e Malva me lo rinfaccia ancora.' },
];
export const BEAM = {
  title: 'Il trave di Ortica',
  pick: 'Scegli tre mazzetti freschi dalla tua dispensa.',
  lent: (n) => (n === 1 ? 'Il terzo lo mette Ortica, dei suoi.' : n === 2 ? 'Gli altri due li mette Ortica, dei suoi.' : 'Li mette tutti Ortica, dei suoi.'),
  tie: 'Lego i mazzetti',
  where: 'Dove li appendiamo?',
  done: 'Fatto',
  close: 'Lascio stare, per oggi',
  mine: 'miei',
  hers: 'di Ortica',
};

// ---- 2. the mortar: an ointment for the miller ----------------------------------------------------------
// The intention of the ointment, from the circle (src/data/sapere.js): the right herbs are the jars that have it.
// The two distractions are herbs of other intentions; each answer says what that herb is for.
export const MORTAR = {
  intention: 'intenzione-guarigione-e-conforto',
  jars: ['calendula', 'ruta', 'melissa', 'verbena'],
  wrong: {
    ruta: 'La ruta la appendo alla porta, perché protegge la casa, ma due ginocchia gonfie non hanno bisogno di guardie.',
    verbena: 'La verbena è per pulire e per gli innamorati, e il mugnaio, con tutto il rispetto, non è né l\'una né l\'altra cosa.',
  },
  right: 'Calendula e melissa, tutte e due erbe che guariscono e consolano. La calendula poi è del Sole, e il Sole alle ginocchia vecchie piace sempre.',
  title: 'Il mortaio di Ortica',
  pick: 'Scegli due vasetti per l\'unguento del mugnaio.',
  put: 'Le metto nel mortaio',
  pound: 'Fai girare il pestello col dito, tre giri.',
  tap: 'Pesta',
  again: 'Riprovo',
  done: 'Fatto',
  close: 'Lascio stare, per oggi',
};

// ---- 3. the bundle: Malva's sage ------------------------------------------------------------------------
export const BUNDLE = {
  title: 'La salvia di Malva',
  mine: 'La salvia secca della mia dispensa',
  hers: 'La salvia secca di Ortica',
  wrap: 'Avvolgi lo spago, stretto: quattro giri.',
  tap: 'Un giro',
  done: 'Fatto',
  close: 'Lascio stare, per oggi',
  turns: 4,
};

// ---- level 1, «Le mani»: a herb for a visitor who asks about an illness (src/data/reading/people.js REFUSALS)
// {herb} is filled with «della melissa secca», «del timo secco»...; {o} with the visitor's ending. `back` is the
// visitor coming back on a later night: the narrator, then the visitor.
export const HEAL_TAG = '[Le mie erbe]';
export const HEAL = {
  'ill.figlio': {
    me: 'Le carte su questo non le guardo, ma ho {herb}: stasera fagliene un infuso tiepido, e resta accanto a lui.',
    re: 'Un infuso, come faceva mia nonna. Grazie, corro a casa a mettere l\'acqua sul fuoco.',
    back: ['Qualcuno bussa piano: è {name}, che era venut{o} per il figlio con la febbre, e stavolta sorride già sulla soglia.',
      'Ha dormito tutta la notte, e stamattina ha chiesto il pane. In paese lo sto raccontando a tutti, che hai le mani buone.'],
  },
  'ill.mucca': {
    me: 'Le carte su questo non le guardo, ma ho {herb}: mescolala al fieno, e stanotte tienila al caldo.',
    re: 'Nel fieno, va bene. Di solito non si fida di niente, ma di te forse sì.',
    back: ['Qualcuno bussa piano: è {name}, quell{o} della mucca che non mangiava, con un pezzo di formaggio avvolto in un tovagliolo.',
      'Stamattina ha mangiato tutto il fieno, e anche un pezzo del mio cappello. Il formaggio è per te, ed è fatto col suo latte.'],
  },
};
