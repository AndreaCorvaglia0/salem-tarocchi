// The short card of every optional thing in the extras registry (core/extras.js EXTRAS), for the Mappa
// page of the grimoire (src/ui/missions/page.js).
// THE RULE: the map shows what SHE knows, never what the game knows (docs/LEZIONI.md, D). So a card has:
//   title  2-4 words, evocative, never the content or the outcome (a trial's title does not say what
//          happens in it; a lesson's title says no more than the teacher announced)
//   kind   only when she knows what it is from what she was told (someone told her there is a card; a
//          witch offered a lesson); null when she does not (a favour asked at a door, a thing she only
//          noticed): the slip then has the neutral pencil note (symbols.js `nota`) and the card no kind word
//   who    who told her (null: she noticed it herself)
//   told   what she was told, as she would write it in her notebook, first person, nothing more
//   later  optional [condition, told]: what she writes once she knows more (a trial's door scene played);
//          the condition uses the keys of core/cond.js and is tested by page.js
//   hunch  optional, one line of presentiment: vague, short, hers, never a fact. Most entries have none.
// Never what she gets: no reward, no prize, nothing about what is inside (the test has a forbidden list).
// The place is the map's own label (sketchmap.js placeOf + REGIONS), never written here.
// Every id of EXTRAS must have an entry: tests/missions.page.test.mjs fails when a new one has none.

// kind -> the word on the card and the pencil symbol (symbols.js); no kind -> the neutral note
export const KIND = {
  carta: { word: 'una carta', sym: 'carta' },
  lezione: { word: 'una lezione', sym: 'lezione' },
  prova: { word: 'una prova', sym: 'prova' },
  orto: { word: "l'orto", sym: 'orto' },
  pietra: { word: 'le pietre', sym: 'pietra' },
  altrove: { word: 'Altrove', sym: 'altrove' },
  storia: { word: 'una storia', sym: 'storia' },
};
export const NEUTRAL = 'nota';

const T = (title, kind, who, told, more = {}) => ({ title, kind, who, told, ...more });
const offered = (id) => ({ flag: `trial.${id}.offered` });

export const TITLES = {
  // lessons: each was offered by its teacher, who said what it would be about
  'lesson.fly': T('Imparare a volare', 'lezione', 'Malva', 'Malva vuole insegnarmi a volare prima che ci provi da sola. Mi aspetta davanti a casa sua, sulla strada da cui sono arrivata.'),
  'lesson.minors.1': T('I quattro semi', 'lezione', 'Ortica', 'Ortica vuole cominciare a spiegarmi le carte piccole, partendo dai quattro semi. Mi aspetta alla sua capanna, nel bosco.'),
  'lesson.minors.2': T("Nell'erba alta", 'lezione', 'Ginepra', "Nell'erba alta vicino al bivacco, nel bosco, c'è qualcosa di Ginepra per me, e riguarda le carte piccole."),
  'lesson.minors.3': T('Quattro, cinque, sei', 'lezione', 'Malva', 'Malva vuole parlarmi dei numeri di mezzo delle carte piccole: il quattro, il cinque e il sei. Mi aspetta a casa sua, accanto al focolare.'),
  'lesson.minors.4': T('Dal sette al dieci', 'lezione', 'Ortica', 'Ortica vuole spiegarmi i numeri dal sette al dieci facendo due passi fino al mulino. Mi aspetta alla sua capanna, nel bosco.'),
  'lesson.minors.5': T('Le figure', 'lezione', 'Nonna Edera', 'Nonna Edera vuole parlarmi delle figure delle carte piccole, quelle con la corona e quelle a cavallo. Mi aspetta nella sua nicchia, in fondo alle cantine.'),
  'lesson.reversed': T('Le carte capovolte', 'lezione', 'Nonna Edera', 'Nonna Edera vuole insegnarmi le carte capovolte, che Malva mi ha fatto saltare. Mi aspetta nella sua nicchia, in fondo alle cantine.'),
  // the cards somebody spoke of (side.m09: Ortica spoke of a lantern, not of a card)
  'side.m01': T('Sotto il banco', 'carta', 'il bottegaio', 'Il bottegaio dice che il merciaio del mercato tiene sotto il banco una carta: un uomo in piedi davanti a un tavolo, con tutto quello che gli serve.'),
  'side.m05': T('La Bibbia grande', 'carta', 'la lavandaia', 'La lavandaia dice che nella Bibbia grande della casa delle riunioni è infilata una carta: un vecchio che insegna, e due in ginocchio che lo ascoltano.'),
  'side.m02': T('Dietro la tenda', 'carta', 'un bambino', 'Un bambino dice che dietro la tenda della sarta c\'è una carta: una signora seduta tra due colonne, che sa le cose e non le dice.'),
  'side.m03': T('Tra i cavoli', 'carta', 'Malva', 'Malva ha visto luccicare una carta nel suo orto, tra i cavoli: una donna seduta in mezzo al grano. Il cancelletto non ha il chiavistello.'),
  'side.m12': T('Il salice dello stagno', 'carta', 'il mugnaio', 'Il mugnaio dice che allo stagno, su un ramo del salice, è rimasta una carta: un uomo appeso per i piedi, con la faccia tranquilla.'),
  'side.m09': T('La lanterna nel folto', null, 'Ortica', 'Ortica dice che nel folto, dove non va nessuno, c\'è una lanterna accesa che nessuno tiene in mano, lasciata da un vecchio che cercava qualcosa da solo.',
    { hunch: 'Di tutte le chiacchiere di Ortica, questa è quella che mi è rimasta in testa.' }),
  'side.m11': T('La pietra di confine', 'carta', 'il becchino', 'Il becchino dice che sulla pietra di confine tra due campi qualcuno ha lasciato una carta: una donna con una bilancia e una spada.'),
  'side.m18': T('Le due torri', 'carta', 'una guardia', 'Una guardia dice che alla palude c\'è un sentiero tra due torri, con due cani che abbaiano alla luna, e che in fondo qualcuno ha visto una carta.'),
  // the garden: before the gift she only knows that Ortica has something for her; afterwards Ortica's
  // messages say what each lesson is about
  'garden.ortica': T('Qualcosa da Ortica', null, 'Ortica', 'Ortica ha qualcosa per me, e vuole che passi da lei alla sua capanna, nel bosco.'),
  'garden.lesson.acqua': T("L'acqua", 'orto', 'Ortica', 'Ortica vuole farmi vedere come bagna le sue erbe. Mi aspetta dietro la sua capanna, nel bosco.'),
  'garden.lesson.luce': T('La luce', 'orto', 'Ortica', 'Ortica ha due rosmarini da farmi vedere, uno fitto e uno tutto allungato. Mi aspetta dietro la sua capanna, nel bosco.'),
  'garden.lesson.terra': T('La terra', 'orto', 'Ortica', 'Ortica ha preparato un sacco di terriccio e un secchio di ghiaino. Mi aspetta dietro la sua capanna, nel bosco.'),
  'garden.lesson.vaso': T('Il vaso', 'orto', 'Ortica', 'Ortica deve cambiare vaso alla menta, e vuole che ci sia anch\'io. Mi aspetta dietro la sua capanna, nel bosco.'),
  'garden.lesson.semina': T('Semina e talea', 'orto', 'Ortica', 'Ortica semina la calendula, e vuole insegnarmi a fare una pianta da un rametto. Mi aspetta dietro la sua capanna, nel bosco.'),
  // Ortica's interest, herbs and garden (notes/interessi/PROGETTO.md §10): the first is the garden, she knows;
  // the others are favours Ortica told her about at the end of the mission before, so no kind
  'int.ortica.1': T('A testa in giù', 'orto', 'Ortica', 'Ortica ha la schiena a pezzi e il trave della capanna vuoto. Vuole che le porti i miei mazzetti, e li appendiamo insieme.'),
  'int.ortica.2': T('Le scale del mulino', null, 'Ortica', 'Il merlo dice che il mugnaio non scende più le scale. Ortica gli portava l\'unguento, ma con questa schiena non ce la fa.'),
  'int.ortica.3': T('Il fumo di Malva', null, 'Ortica', 'Ortica giura che il bottegaio mette la segatura nell\'incenso di Malva, e che con la salvia secca si farebbe di meglio.',
    { hunch: 'Malva non me l\'ha mai detto, ma lei non dice molte cose.' }),
  // Edera's stones: the first is a favour (a thing lost), so no kind; from the second she knows it is about stones
  'int.edera.1': T('La pietra della nonna', null, 'Nonna Edera', 'Edera ha perso nelle cantine una pietra di sua nonna, blu con dei puntini d\'oro. Non ricorda dove l\'ha posata, un anno fa o ieri.'),
  'int.edera.2': T('Occhi chiusi', 'pietra', 'Nonna Edera', 'Il conestabile del pozzo vecchio, di notte, ha paura dei cani che abbaiano alla luna. Edera vuole che gli scelga una pietra tra le mie.'),
  'int.edera.3': T('I cartellini', 'pietra', 'Nonna Edera', 'Delle sue pietre Edera ricorda il colore e non il nome. Stanno sullo scaffale a destra della finestra, in biblioteca, e vuole che scriva i cartellini.'),
  // the trials: each starts as a favour asked at a door, so no kind; `later` is her diary after the door
  'trial.night': T('Il cesto di Malva', null, 'Malva', 'Malva deve far uscire un cesto dal villaggio prima che faccia giorno, e vuole che l\'accompagni. Mi aspetta nel vicolo di sotto.',
    { later: [offered('night'), 'Malva ha un cesto da far uscire dal villaggio stanotte, e vuole me. Prima ripasso in biblioteca, e poi torno da lei nel vicolo di sotto.'] }),
  'trial.fog': T('La barba di bosco', null, 'Ortica', 'Ortica va a tagliare la barba di bosco al limite del bosco fitto, all\'imbrunire, e vuole compagnia. Mi aspetta allo stagno.',
    { later: [offered('fog'), 'Ortica mi vuole con sé al limite del bosco fitto, a tagliare la barba di bosco. Prima ripasso in biblioteca, e poi la raggiungo allo stagno.'] }),
  'trial.cellars': T('La strada delle cantine', null, 'Nonna Edera', 'Edera vuole che impari la strada delle cantine fino alla porta delle celle, e che torni a dirle com\'è. Si comincia dalla cantina sotto la botola.',
    { later: [offered('cellars'), 'Edera vuole che impari la strada delle cantine fino alla porta delle celle. Prima ripasso in biblioteca, e poi torno alla cantina sotto la botola.'] }),
  'trial.vigil': T('Chiamata di notte', null, 'Malva', 'Malva è stata chiamata di notte in una casa della parte alta, e ha chiesto di me.',
    { hunch: 'Non so perché, ma quella finestra accesa mi mette fretta.',
      later: [offered('vigil'), 'Stanotte Malva va dai Proctor, nella parte alta, per un bambino con la febbre, e vuole che l\'accompagni. Prima ripasso in biblioteca, e poi torno sotto la finestra accesa.'] }),
  'trial.well': T('Qualcosa nel pozzo', null, 'Tartufo', 'Tartufo non mi lascia dormire: va e viene dal pozzo della piazza, e vuole che lo segua.',
    { hunch: 'Tartufo non fa mai così per niente, e questo mi preoccupa più del pozzo.',
      later: [offered('well'), 'Nel pozzo della piazza è caduto qualcosa di vivo, e Tartufo vuole che stanotte scenda a prenderlo. Prima ripasso in biblioteca, e poi torno al pozzo.'] }),
  'trial.kettle': T('Il paiolo di rame', null, 'Ortica', 'Ortica dice che un calderaio accampato al confine del bosco sta per andarsene con il suo paiolo di rame, e stanotte va a riprenderselo.',
    { later: [offered('kettle'), 'Stanotte Ortica va a riprendersi il paiolo di sua madre dal carro del calderaio, al confine del bosco, e mi vuole con sé. Prima ripasso in biblioteca.'] }),
  'trial.grave': T('La tomba nel bosco', null, 'la vedova Bray', 'La vedova Bray vuole andare di notte sulla tomba del marito, nel bosco, e non ha il coraggio di andarci da sola. Mi aspetta al limite del bosco.',
    { hunch: 'Non ho capito se la vedova ha paura del bosco o di qualcos\'altro.',
      later: [offered('grave'), 'La vedova Bray vuole sapere chi accende una candela sulla tomba di suo marito, e mi ha chiesto di accompagnarla di notte al cimitero del bosco. Prima ripasso in biblioteca.'] }),
  'trial.room': T('La stanza murata', null, 'Nonna Edera', 'Edera mi ha chiesto di cercare, sotto la botola, la stanza dove sua nonna leggeva le carte. Dice che l\'hanno murata, e che dentro è rimasta una cosa sua.',
    { hunch: 'Mi chiedo da quanti anni Edera ci pensa, prima di averlo chiesto a me.',
      later: [offered('room'), 'Edera mi ha chiesto di cercare la stanza murata di sua nonna, dietro l\'arco sotto la botola. Prima ripasso in biblioteca, e poi torno all\'arco.'] }),
  'trial.dare': T('La scommessa di Ginepra', null, 'Ginepra', 'Ginepra scommette il suo cappello che non arrivo in fondo alla tana, a nord della capanna di Ortica.',
    { later: [offered('dare'), 'Ginepra scommette il suo cappello che non arrivo in fondo alla tana, dove lei ha inciso il suo nome. Prima ripasso in biblioteca, e poi torno da lei davanti alla tana.'] }),
  'trial.hat': T('Da portare a Ortica', null, 'il mugnaio', 'Il mugnaio mi ha fatto sapere che ha una cosa da far portare a Ortica, e che la vuole dare a me. Devo passare dal mulino.',
    { hunch: 'Mi incuriosisce che il mugnaio, per una cosa di Ortica, abbia pensato proprio a me.' }),
  'library.first': T('La biblioteca', null, 'le streghe', 'Chi mi chiede aiuto per una notte difficile mi dice sempre di passare prima dai libri. La biblioteca è nella casa di ardesia, nella parte alta del villaggio.'),
  // what she noticed herself: she does not know where it leads
  'elsewhere.book': T('Il libro aperto', null, null, 'Sul tavolo della biblioteca è rimasto aperto un libro di storie che ieri non c\'era, e Tartufo ci gira intorno senza sedercisi sopra.'),
  'elsewhere.clouds': T('La boccetta verde', null, null, 'Sulla mensola della capanna c\'è una boccetta verde che non ricordo di avere comprato, e ogni tanto il tappo si muove da solo.',
    { hunch: 'Ogni volta che passo davanti alla mensola mi viene voglia di aprirla, e ogni volta lascio perdere.' }),
};

// the card of an entry: its title data, or a plain fallback from its text (a new entry without a title
// still shows, with its first words and no kind: the map never guesses what it is)
export function cardOf(e) {
  const t = TITLES[e.id];
  const k = t ? KIND[t.kind] : (e.kind === 'lesson' ? KIND.lezione : null);
  if (t) return { ...t, kindWord: k ? k.word : '', sym: k ? k.sym : NEUTRAL };
  const words = String(e.text || '').split(/[:,.]/)[0].split(' ').slice(0, 4).join(' ');
  return { title: words, kind: k ? 'lezione' : null, who: null, told: e.text || '', kindWord: k ? k.word : '', sym: k ? k.sym : NEUTRAL };
}
// what she knows now: `later` once its condition holds (test: core/cond.js test, passed by the caller)
export const toldNow = (c, test = () => false) => (c.later && test(c.later[0]) ? c.later[1] : c.told);
