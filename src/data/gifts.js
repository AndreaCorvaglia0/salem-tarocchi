// Stones and figures given «a corredo» (notes/collezioni.md): people give one when it makes sense for who
// they are, with one line in their own voice and no scene. Applied by src/glue/collect.js on the bus:
//   who    the CAST `who` she is talking to (src/data/story/cast.js): the line is said before that person's
//          own free talk (never before a scene that moves the main path); 'tartufo' gives on entering a map
//   say    who speaks the line in the dialogue box ('narra' for villagers, who speak in «» like in post.js)
//   when   a condition on what she has (src/core/cond.js), never on the current step
//   after  another gift of the same person, given first (one gift per talk)
//   stone / sibyl   what she gets; sibyl gifts come two or three together and make one phrase
//   phrase what the cards say together, remembered on their album page
// The mission cards never announce a gift (tests/knows-only.test.mjs).
export const GIFTS = [
  // the shopkeeper: he never gives credit, but a stone for the till is good business
  { id: 'g.shop.citrine', who: 'bottegaio', say: 'narra', when: { chapterMin: 1 }, stone: 'citrino',
    line: 'Il bottegaio fa scivolare sul banco un sasso giallo. «Quarzo giallo: nella cassa chiama i soldi, e a me ne è avanzato uno. Così ti ricordi dove si compra.»' },
  { id: 'g.shop.key', who: 'bottegaio', say: 'narra', when: { chapterMin: 2 }, after: 'g.shop.citrine', sibyl: [26, 33], phrase: 'Un segreto che si apre.',
    line: 'Il bottegaio tira fuori da un cassetto due figurine. «Me le ha lasciate l\'ambulante per un gomitolo. Il libro e la chiave: un segreto che si apre, dice lui. Io dico che erano un gomitolo.»' },
  // the gravedigger: the black stone, and the two figures of his trade
  { id: 'g.grave.obsidian', who: 'gravedigger', say: 'narra', when: { chapterMin: 2 }, stone: 'ossidiana',
    line: 'Il becchino ti porge una scheggia nera e lucida. «L\'ho trovata scavando. Fa da scudo contro chi ti vuole male, e a me i morti non ne vogliono: tienila tu.»' },
  { id: 'g.grave.coffin', who: 'gravedigger', say: 'narra', when: { chapterMin: 2 }, after: 'g.grave.obsidian', sibyl: [8, 36], phrase: 'Un peso che finisce.',
    line: 'Il becchino ti dà due figurine sporche di terra. «La bara e la croce: un peso che finisce. Me le tenevo in tasca per scherzo, ma tu sai che farne.»' },
  // Ortica: chatter, quarrels and fog, and a stone that stops the blood
  { id: 'g.ortica.village', who: 'ortica', say: 'ortica', when: { chapterMin: 2 }, sibyl: [12, 11, 6], phrase: 'Chiacchiere, litigi e confusione.',
    line: 'Queste me le hanno date per un decotto, la moglie del mugnaio, o forse la sorella. Uccelli, frusta e nuvole: chiacchiere, litigi e confusione, cioè il villaggio di lunedì mattina!' },
  { id: 'g.ortica.blood', who: 'ortica', say: 'ortica', when: { chapterMin: 2 }, after: 'g.ortica.village', stone: 'eliotropio',
    line: 'Tieni questa pietra verde, che a me è venuta doppia. Posata su un taglio ferma il sangue, l\'ho visto fare cento volte, e il merlo duecento.' },
  // Edera: stones, and a quiet old age
  { id: 'g.edera.moon', who: 'edera', say: 'edera', when: { chapterMin: 3 }, stone: 'pietra-di-luna',
    line: 'Questa tienila tu, cara: è una pietra di lana. Di luna, volevo dire. Sotto il cuscino, quando la luna cresce, porta i sogni buoni.' },
  { id: 'g.edera.rose', who: 'edera', say: 'edera', when: { chapterMin: 3 }, after: 'g.edera.moon', stone: 'quarzo-rosa',
    line: 'Prendi anche questa, cara, rosa come una guancia. Consola chi ha il cuore ammaccato, e alla tua età serve più che alla mia.' },
  { id: 'g.edera.lilies', who: 'edera', say: 'edera', when: { chapterMin: 3 }, after: 'g.edera.rose', sibyl: [19, 30], phrase: 'Una vecchiaia lunga e tranquilla.',
    line: 'La torre e i gigli, guarda: una vecchiaia lunga e tranquilla. Le teniamo noi vecchie, ma a te faranno compagnia.' },
  // Ginepra: she likes the peddler's game, Malva calls it fairground stuff
  { id: 'g.ginepra.promise', who: 'ginepra', say: 'ginepra', when: { flag: 'met.ginepra' }, sibyl: [27, 25], phrase: 'Una promessa scritta.',
    line: 'La lettera e l\'anello: una promessa scritta. Tienile insieme, che separate dicono la metà!' },
  { id: 'g.ginepra.sun', who: 'ginepra', say: 'ginepra', when: { flag: 'met.ginepra' }, after: 'g.ginepra.promise', sibyl: [31, 32], phrase: 'Onore e successo.',
    line: 'Il sole e la luna insieme vogliono dire successo, e anche un po\' di fama. Le tenevo per me, cioè, le tenevo per quando avrei avuto un posto dove metterle.' },
  // Tartufo brings what he finds, out of pure kindness (he says)
  { id: 'g.tartufo.mice', who: 'tartufo', say: 'tartufo', when: { power: 'cat' }, sibyl: [18, 23], phrase: 'Un amico contro chi rosicchia.',
    line: '(Le ho trovate sotto una botte e te le porto per comodo mio. Il cane e i topi: non farti venire idee.)' },
  { id: 'g.tartufo.bear', who: 'tartufo', say: 'tartufo', when: [{ power: 'cat' }, { chapterMin: 2 }], after: 'g.tartufo.mice', sibyl: [14, 15], phrase: 'La furbizia e la forza.',
    line: '(La volpe e l\'orso: la furbizia e la forza. Tu sei l\'orso, io la volpe, e lo sappiamo tutti e due chi vince.)' },
];
export const GIFT = Object.fromEntries(GIFTS.map((g) => [g.id, g]));

// The first of each kind: one person says a few words, once, the first time she can (src/glue/collect.js).
// Edera for the stones, Ginepra for the figures; before she has met them it waits for their next free talk.
// `given`: the words when her first one of that kind is the gift that person has just made.
export const FIRST = {
  stone: { who: 'edera', lines: [
    'Hai una pietra in tasca, cara, si capisce da come tieni la mano. Fammela vedere un momento.',
    'Le pietre non parlano come le carte: ognuna sa fare una cosa sola, e la fa per anni senza stancarsi. C\'è quella che protegge e quella che fa dormire, e c\'è perfino quella che chiama i soldi.',
    'Tienile vicine e ricordati quale fa che cosa. Al resto ci pensano loro.',
  ],
  // when her very first stone is the one Edera has just given her
  given: [
    'Le pietre non parlano come le carte, cara: ognuna sa fare una cosa sola, e la fa per anni senza stancarsi.',
    'Tienile vicine e ricordati quale fa che cosa. Al resto ci pensano loro.',
  ] },
  sibyl: { who: 'ginepra', lines: [
    'Ma quella è una figurina della sibilla! Dove l\'hai pescata?',
    'È il mazzo dell\'ambulante che passa al mercato, trentasei figure semplici: una casa, una nave, un cane. Malva dice che è roba da fiera, e infatti a me piace un sacco.',
    'I tarocchi ti dicono come stai tu, la sibilla ti dice che cosa succede. E da sola una figurina dice poco: tienile insieme.',
  ],
  // when her very first figures are the ones Ginepra has just given her
  given: [
    'Sono figurine della sibilla, il mazzo dell\'ambulante che passa al mercato: trentasei figure semplici, una casa, una nave, un cane. Malva dice che è roba da fiera, e infatti a me piace un sacco.',
    'I tarocchi ti dicono come stai tu, la sibilla ti dice che cosa succede.',
  ] },
};
