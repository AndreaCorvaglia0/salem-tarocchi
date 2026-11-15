// The portrait: what the game says about her character (docs/DESIGN.md, "Il ritratto" and "Un ritratto
// solo"). Read by core/progress.js (ADJ, SIGNATURES), by the sessions (VERDICTS, LIKE) and by the
// session node { portrait: true } (PORTRAIT, PAIRS, SEEDS: src/story/portrait.js). Why each signature: notes/reader.md.
// Axes, positive pole first: esplora curiosa/dritta, parola schietta/accorta, tono gentile/pungente,
// rischio audace/prudente, guida cuore/testa. Every sentence is in the Reader's voice.

// The words written by hand under her card in the grimoire; they also fill {traits} after "Sei".
export const ADJ = {
  esplora: ['curiosa', 'dritta al punto'],
  parola: ['schietta', 'accorta'],
  tono: ['gentile', 'pungente'],
  rischio: ['audace', 'prudente'],
  guida: ['tutta cuore', 'tutta testa'],
};

// The character of each Major on the five axes (-2..2, two or three axes each, no two alike).
export const SIGNATURES = {
  m00: { esplora: 2, rischio: 2, guida: 1 },
  m01: { parola: 2, esplora: 2, guida: -1 },
  m02: { parola: -2, guida: 2, rischio: -1 },
  m03: { tono: 2, guida: 2 },
  m04: { esplora: -2, guida: -2, parola: 1 },
  m05: { rischio: -2, esplora: -2, tono: 1 },
  m06: { guida: 2, parola: 2 },
  m07: { rischio: 2, esplora: -2 },
  m08: { tono: 2, rischio: 2 },
  m09: { esplora: 2, parola: -2, guida: -1 },
  m10: { rischio: 2, parola: -2 },
  m11: { parola: 2, guida: -2, tono: -1 },
  m12: { rischio: -2, esplora: 2 },
  m13: { parola: 2, esplora: -2, tono: -1 },
  m14: { tono: 2, rischio: -2, parola: -1 },
  m15: { tono: -2, guida: 2, rischio: 1 },
  m16: { tono: -2, parola: 2, rischio: 1 },
  m17: { tono: 2, esplora: 2, rischio: -1 },
  m18: { guida: 2, rischio: -2 },
  m19: { parola: 2, tono: 2, rischio: 1 },
  m20: { rischio: 2, guida: 2, esplora: -1 },
  m21: { esplora: 2, guida: -2 },
};

// Why a card resembles her: the card's character in the words of the five traits. Said in every
// verdict right after "per me stanotte sei {yourCard}", so it is true whatever the card is.
export const LIKE = {
  m00: "Il Matto è la carta di chi parte volentieri e guarda tutto, senza chiedersi troppo come andrà a finire.",
  m01: "Il Mago è la carta di chi ha la parola pronta e una curiosità per ogni cosa, e sa far succedere quello che dice.",
  m02: "La Sacerdotessa è la carta di chi sente molto e dice poco, e sa aspettare che le cose si mostrino da sole.",
  m03: "L'Imperatrice è la carta di chi ha modi gentili e un cuore grande, e fa crescere quello che tocca.",
  m04: "L'Imperatore è la carta di chi ragiona e va dritto allo scopo, e quando ha deciso lo dice una volta sola.",
  m05: "Il Papa è la carta di chi preferisce la strada sicura a quella nuova, e ha un modo gentile di insegnare quello che sa.",
  m06: "Gli Amanti sono la carta di chi sceglie col cuore e poi lo dice apertamente, senza nascondersi.",
  m07: "Il Carro è la carta di chi punta dritto alla meta e rischia volentieri pur di arrivarci.",
  m08: "La Forza è la carta di chi ha coraggio e ha anche modi gentili, e ottiene con la dolcezza quello che altri strappano.",
  m09: "L'Eremita è la carta di chi guarda molto e parla poco, e le risposte preferisce cercarsele da sé.",
  m10: "La Ruota della Fortuna è la carta di chi gioca la sua mano quando passa l'occasione, senza dire a nessuno che carte ha.",
  m11: "La Giustizia è la carta di chi ragiona con lucidità e dice quello che pensa, anche quando non fa piacere.",
  m12: "L'Appeso è la carta di chi non ha nessuna fretta di buttarsi, e intanto guarda le cose da tutti i lati.",
  m13: "Non badare al nome: La Morte è la carta di chi parla chiaro, va all'essenziale e sa chiudere quello che è finito.",
  m14: "La Temperanza è la carta di chi ha misura in tutto: modi gentili, nessun azzardo, e mai una parola di troppo.",
  m15: "Non offenderti: Il Diavolo è la carta di chi ha desideri forti e una lingua che punge, e non finge di essere una santa.",
  m16: "Non spaventarti: La Torre è la carta di chi dice le verità che fanno rumore, e non ha paura di buttare giù quello che non regge.",
  m17: "La Stella è la carta di chi è gentile e guarda il mondo con calma, a occhi aperti, e riesce a sperare anche dopo le notti brutte.",
  m18: "La Luna è la carta di chi dà retta a quello che sente e va avanti con cautela, perché sa che al buio le cose ingannano.",
  m19: "Il Sole è la carta di chi dice le cose chiare e le dice col sorriso, senza niente da nascondere.",
  m20: "Il Giudizio è la carta di chi, quando sente una chiamata, risponde col cuore, subito e senza paura.",
  m21: "Il Mondo è la carta di chi ha voluto vedere tutto, e poi ha messo ogni cosa al suo posto ragionandoci sopra.",
};

// Pieces of the provisional verdicts. `lead`: what she has seen most (the leading marked trait),
// keyed by axis and pole; it goes inside a sentence. `shift`: what changed since the last encounter
// (used with { trend }), also inside a sentence.
export const VERDICTS = {
  lead: {
    esplora: { plus: "ti fermi a guardare tutto, anche quello che non ti serve", minus: "vai dove devi andare e non ti lasci distrarre da niente" },
    parola: { plus: "dici le cose come stanno, a me come agli altri", minus: "pesi le parole, e qualcuna la tieni per te" },
    tono: { plus: "hai modi gentili, anche con chi non se li merita", minus: "hai la risposta pronta, e non la risparmi a nessuno" },
    rischio: { plus: "quando c'è da rischiare non ti tiri indietro", minus: "prima di muoverti guardi bene dove metti i piedi" },
    guida: { plus: "quando devi scegliere dai retta a quello che senti", minus: "quando devi scegliere prima ragioni, e soltanto dopo senti" },
  },
  shift: {
    esplora: { plus: "da allora ti ho vista più curiosa, più pronta a guardarti intorno", minus: "da allora ti ho vista andare più dritta a quello che vuoi" },
    parola: { plus: "da allora hai cominciato a dire le cose più chiare", minus: "da allora pesi molto di più quello che dici" },
    tono: { plus: "da allora ti ho trovata più dolce", minus: "da allora la tua lingua si è fatta più svelta" },
    rischio: { plus: "da allora ti ho vista più pronta a rischiare", minus: "da allora ti sei fatta più cauta" },
    guida: { plus: "da allora ascolti di più quello che senti", minus: "da allora ragioni di più prima di decidere" },
  },
  none: "Di te ho visto un po' di tutto e niente che prevalga: sei difficile da mettere in una carta sola. Per me stanotte sei {yourCard}, ma lo dico a bassa voce.",
};

// The final portrait: one reading for each side of her character, said in this order as one speech.
// plus: value >= 3, minus: <= -3, mid: in between, torn: she pulled hard both ways ({ torn: axis }).
// Each has its light and its shadow.
export const PORTRAIT = {
  esplora: {
    plus: "Comincio da come ti muovi. Sei una curiosa, di quelle che guardano dietro ogni porta anche quando non serve: ti costa qualche ritardo, ma è così che hai trovato quello che gli altri non cercavano.",
    mid: "Comincio da come ti muovi. Sai quando è il caso di guardarsi intorno e quando conviene tirare dritto, e mi pare un buon modo di attraversare un posto.",
    minus: "Comincio da come ti muovi. Vai dritta al punto, e quando sai dove andare non ti distrae niente: qualcosa ai lati della strada te lo sei perso, ma hai tutto il tempo per tornare a guardare.",
    torn: "Comincio da come ti muovi. Certi giorni hai girato in lungo e in largo, e certi altri sei andata dritta come una che ha fretta: dentro di te ci sono una viaggiatrice e una che vuole arrivare, e fanno a turno.",
  },
  parola: {
    plus: "Poi ci sono le parole. Tu le dici chiare, e chi parla con te sa sempre a che punto si trova: è un regalo, anche quando non lo prendono come tale. Bada soltanto che una verità detta in fretta non arrivi prima di te.",
    mid: "Poi ci sono le parole. Con quelle sai fare tutte e due le cose, dirle chiare e tenerle da parte, e di solito scegli bene quale delle due serve.",
    minus: "Poi ci sono le parole. Tu le pesi, le scegli, e qualcuna la tieni da parte: è per questo che quando parli ti ascoltano. Bada soltanto che le cose taciute troppo a lungo non restino sul tuo conto.",
    torn: "Poi ci sono le parole. A volte dici tutto e a volte quasi niente, e fai spesso l'una e l'altra cosa: ho finito per pensare che tu decida in base a chi hai davanti, e che sia una forma di rispetto.",
  },
  tono: {
    plus: "Quanto ai modi, i tuoi sono gentili, e lo sono rimasti in un posto che con te non lo è stato. Non è debolezza, e chi ti conosce lo sa; ricordati soltanto di tenere un po' di quella gentilezza anche per te.",
    mid: "Quanto ai modi, sai essere dolce e sai rispondere per le rime, e non confondi quasi mai i due momenti.",
    minus: "Quanto ai modi, hai la lingua pronta e sai dove pungere, e a Salem ti è servito. Sotto le spine però c'è una che ci tiene, e ogni tanto puoi anche lasciarla vedere: non ti toglie niente.",
    torn: "Quanto ai modi, sei stata gentile tante volte quante sei stata pungente, e sempre con convinzione. Non sei una via di mezzo: sei due persone intere, e chi ti sta vicino impara a voler bene a entrambe.",
  },
  rischio: {
    plus: "Davanti a un rischio tu di solito ti butti: più di una volta hai preferito la strada pericolosa a quella sicura. Il coraggio lo hai tutto; ti auguro soltanto qualcuno accanto che ogni tanto ti dica di aspettare.",
    mid: "Davanti a un rischio sai buttarti quando ne vale la pena e tirarti indietro quando non ne vale, che è più difficile di tutte e due le cose prese da sole.",
    minus: "Davanti a un rischio tu prima guardi, e a Salem la prudenza ti ha tenuta intera. Qualche occasione ti passa davanti mentre la studi, è vero, ma quelle che prendi poi le tieni.",
    torn: "Davanti a un rischio ti ho vista buttarti e ti ho vista contare i passi, quasi con la stessa frequenza. Le battaglie te le scegli una per una: non hai paura, e non hai bisogno di dimostrarlo ogni volta.",
  },
  guida: {
    plus: "Resta il modo in cui decidi, ed è col cuore: senti molto, e a quello che senti dai retta. Le carte con te parlano volentieri; la testa tienila vicina lo stesso, come un'amica che fa i conti.",
    mid: "Resta il modo in cui decidi. Tra cuore e testa non hai un preferito: li fai parlare tutti e due e poi scegli tu, e mi sembra il modo più onesto.",
    minus: "Resta il modo in cui decidi, ed è con la testa: prima capisci e poi scegli, e questo ti ha evitato parecchi sbagli. Lascia però una sedia libera a quello che senti, perché ogni tanto ha ragione lui.",
    torn: "Resta il modo in cui decidi. Il cuore e la testa in te non riescono a mettersi d'accordo, e non è detto che debbano: li hai ascoltati entrambi, a turno, e dalle loro discussioni sono uscite le tue scelte migliori.",
  },
};

// Two traits together: the first two that hold are said after the five sides (conditions: core/cond.js).
const hi = (axis) => ({ trait: [axis, '>=', 3] });
const lo = (axis) => ({ trait: [axis, '<=', -3] });
export const PAIRS = [
  { when: [hi('rischio'), lo('parola')], t: "E poi c'è una cosa rara: sei audace e sei accorta insieme. Di solito chi si butta lo racconta a tutti; tu ti butti e stai zitta, e così nessuno sa mai quanto hai rischiato davvero." },
  { when: [hi('tono'), hi('parola')], t: "Sei gentile e sei schietta, e quasi nessuna riesce a essere le due cose insieme. Tu dici la verità intera e la porgi con garbo, tanto che chi la riceve riesce perfino a ringraziare." },
  { when: [hi('tono'), hi('rischio')], t: "Hai coraggio e hai modi gentili, e in te stanno bene insieme. Chi ti incontra vede prima i modi e scopre il coraggio soltanto quando serve, che è la sorpresa migliore che una persona possa fare." },
  { when: [lo('tono'), hi('guida')], t: "Pungi, e intanto senti tutto. Ho idea che le tue spine servano a proteggere il resto, e che chi ha avuto la pazienza di passarci in mezzo non se ne sia mai pentito." },
  { when: [hi('esplora'), lo('rischio')], t: "Guardi dappertutto ma tocchi poco: sei curiosa e prudente come un gatto. Non c'è nessuna contraddizione, perché prima vuoi sapere, e soltanto dopo decidi se ti conviene." },
  { when: [lo('esplora'), hi('guida')], t: "Vai dritta dove devi andare, ma a decidere dove è sempre il cuore. Ci metti un po' a scegliere e poi non ti volti più, e chi ti aspetta in fondo alla strada è fortunato." },
  { when: [hi('parola'), lo('guida')], t: "Prima ragioni, e poi dici quello che hai concluso senza girarci intorno. Con te si sa sempre a che punto si è, e in un posto pieno di mezze frasi come questo vale più dell'oro." },
  { when: [hi('esplora'), hi('rischio')], t: "Curiosa e audace insieme vuol dire che vuoi vedere tutto e non ti fermi davanti a niente. Qui hai fatto molta strada; qualche porta, te lo confesso, io l'avrei lasciata chiusa." },
  { when: [lo('parola'), hi('guida')], t: "Quello che senti è molto, e quello che dici è poco. Che cosa ti passa dentro lo sanno in pochi, e lo sanno da come li guardi più che da quello che racconti: sono fortunati lo stesso." },
  { when: [lo('rischio'), lo('guida')], t: "Prudente come sei, e abituata a ragionare su tutto, prima di muoverti hai già pensato a come tornare. È una forma di cura; concediti soltanto, ogni tanto, una cosa fatta senza calcolarla." },
];

// Her suit, found in the finale (core/progress.js yourSuit()).
export const SEEDS = {
  w: "Tra i quattro semi il tuo sono i Bastoni, che sono il fuoco. È il seme di chi fa: di chi comincia le cose e ci mette tutta la volontà che ha.",
  c: "Tra i quattro semi il tuo sono le Coppe, che sono l'acqua. È il seme di chi sente, e mette le persone prima delle cose.",
  s: "Tra i quattro semi il tuo sono le Spade, che sono l'aria. È il seme di chi vuole capire, e non si accontenta di una mezza verità.",
  p: "Tra i quattro semi il tuo sono i Denari, che sono la terra. È il seme di chi costruisce, e vuole vedere e toccare quello che ha fatto.",
};
