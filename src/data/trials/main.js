// THE THREE MAIN TRIALS, one per chapter (format: src/trials/run.js). Each stages a danger the story already
// has: the lanterns of the village at night (chapter 1), the thick fog of the deep wood (chapter 2), the
// cellars between Edera's nook and the cells (chapter 3). They are keys of the registry, chained with
// `after`, and available by what she HAS, so an old save meets them one at a time.
// Writing rules: a wrong room never says which wrong way she took (two of the three are wrong), and a good
// room never says which way was right (the card decides it): both tell what happened next.
// Pools assumed (tests/trials.content.test.mjs): night = Il Matto + five or more of m01-m07, upright;
// fog = nine or more Majors of m00-m14, with or without the Minors 1-6; cellars = eleven or more Majors,
// both faces (it asks for the lesson on reversed cards), with or without the court.

// the chain is also written in each `when` (the door in the world reads only `when`): a main trial is final
const played = (id) => ({ any: ['perfect', 'pass', 'fail'].map((k) => ({ flag: `trial.${id}.${k}` })) });

export const night = {
  id: 'night',
  title: 'Il cesto di Malva',
  with: 'malva',
  main: true,
  when: [{ flag: 'exam1.done' }, { majorsMin: 6 }],
  note: 'Malva deve far uscire un cesto dal villaggio prima che faccia giorno, e vuole che l\'accompagni. Mi aspetta nel vicolo di sotto.',
  start: { at: 'village.lane', label: 'Il vicolo di sotto', verb: 'Vai' },
  // used: the sign (two forks) and Il Matto (who sets out); Il Carro is the third she senses
  study: ['sign', 'm00', 'm07'],
  steps: [
    { lines: [
      ['narra', 'Nel vicolo dietro casa sua Malva ti aspetta con uno scialle sulla testa e un cesto coperto da un panno, e dal cesto viene un odore di canfora che si sente a tre passi.'],
      ['malva', 'Qui dentro ci sono gli unguenti di tutto l\'inverno, e gira voce che domattina i conestabili entrino nelle case di questa strada. Prima dell\'alba il cesto deve stare oltre il cancello del bosco, dove viene a prenderlo una che conosco.'],
      ['malva', 'Da sola ci metterei il doppio, perché ho un ginocchio che scricchiola più della neve. Prima di muovermi, però, guardo che cosa ne pensano le carte, come ho sempre fatto.'],
    ] },
    { witchDraw: { who: 'malva', card: 'm09', rev: false, t: 'Mi è uscito L\'Eremita, dritto, e vuol dire che si va con un lume solo, tenuto basso, e senza fare conversazione per strada. Il lume lo porto io sotto lo scialle, e tu porti il cesto.' } },
    { say: 'narra', t: 'In fondo al vicolo si apre la piazza, e dall\'altra parte una lanterna va avanti e indietro davanti al pozzo.' },
    { fork: { kind: 'segno', options: [
      { text: 'Attraversiamo adesso, finché la lanterna ci dà le spalle.', sign: 'go' },
      { text: 'Aspettiamo che la lanterna giri dietro il pozzo, e poi andiamo.', sign: 'slow' },
      { text: 'Torniamo indietro, e proviamo un\'altra notte.', sign: 'stop' },
    ] }, who: 'malva', t: 'Io da qui non capisco se quello guarda o dorme in piedi. Chiedilo a una delle tue carte, e poi dimmi che cosa facciamo.', right: 'good.square', wrong: 'bad.square' },
    { fork: { kind: 'idea', options: [
      { text: 'La strada grande, dritta e scoperta, da fare di slancio senza voltarsi.', tags: { cards: ['m00', 'm01', 'm07'], rev: false } },
      { text: 'Il muro della casa delle riunioni, da seguire in silenzio, un passo alla volta.', tags: { cards: ['m02', 'm04', 'm05'], rev: false } },
      { text: 'Gli orti dietro le case, dove c\'è un lume acceso e gente che a Malva vuole bene.', tags: { cards: ['m03', 'm06'], rev: false } },
    ] }, who: 'malva', t: 'Da qui al cancello ci sono tre strade, e io stanotte non mi fido della mia testa. Guarda che cosa ti dice la carta, e scegli tu.', right: 'good.way', wrong: 'bad.way' },
    { lines: [
      ['narra', 'Siete quasi al cancello quando dietro di voi una voce grida di fermarsi, e una lanterna comincia a correre.'],
      ['malva', 'Quello cerca me, che mi conosce da vent\'anni. Tu prendi il cesto e corri verso la luce, e non ti voltare per nessuna ragione.'],
    ] },
    { escape: { to: 'auto', seconds: 30 },
      safe: [['malva', 'Brava, hai fatto come ti avevo detto. Ha visto soltanto una vecchia che tornava a casa con il suo lume, e a me ha augurato perfino la buonanotte.']],
      caught: { error: 1, loss: { coins: 3 }, lines: [['narra', 'Il conestabile ti prende per un braccio e ti fa aprire la borsa. Del cesto, che avevi fatto in tempo a spingere sotto la siepe, non si accorge, ma tre monete se le tiene lui per il disturbo.']] } },
    { say: 'narra', t: 'Il cancello del bosco è chiuso con un catenaccio coperto di ghiaccio, e la ronda passa di qui ogni quarto d\'ora.' },
    { fork: { kind: 'idea', options: [
      { text: 'Scavalco io per prima, e apro la strada dall\'altra parte.', tags: { moto: 'inizia' } },
      { text: 'Lavoriamo il catenaccio con il grasso, piano, finché a poco a poco cede.', tags: { moto: 'cresce' } },
      { text: 'Ci mettiamo ferme nell\'ombra del pilastro, e lasciamo passare la ronda.', tags: { moto: 'ferma' } },
    ] }, who: 'malva', t: 'Abbiamo tre modi di passare, e il tempo per provarne uno solo. Senti la carta, e fai presto.', right: 'good.gate', wrong: 'bad.gate' },
    { say: 'narra', t: 'Oltre il cancello, fra i primi alberi, qualcuno fischia due volte, piano.' },
    { fork: { kind: 'segno', options: [
      { text: 'Lasciamo il cesto ai piedi del primo albero, e andiamo via.', sign: 'go' },
      { text: 'Lasciamo il cesto, ma restiamo nascoste a guardare chi viene a prenderlo.', sign: 'slow' },
      { text: 'Il cesto ce lo riportiamo a casa.', sign: 'stop' },
    ] }, who: 'malva', t: 'Dovrebbe essere lei, ma un fischio lo sa fare chiunque. Decidi tu che cosa ne facciamo del cesto, con la carta in mano.', right: 'good.whistle', wrong: 'bad.whistle' },
  ],
  rooms: {
    'good.square': { good: true, lines: [['narra', 'La carta aveva visto giusto, e Malva te lo dice con un cenno del mento. Poco dopo siete oltre la piazza senza che nessuno abbia alzato la lanterna verso di voi, e sotto il portico raccogli due monete che qualcuno ha perso nella neve.']], gain: { coins: 2 } },
    'bad.square': { good: false, lines: [['narra', 'Avete scelto il momento sbagliato. Una seconda lanterna sbuca dal lato della casa delle riunioni, e vi tocca restare schiacciate contro un muro, con il cesto fra le ginocchia, finché non si allontana.']] },
    'good.way': { good: true, lines: [['narra', 'Era la strada buona, e non incontrate nessuno. A metà Malva si ferma a prendere da un davanzale un mazzetto di salvia secca, che qualcuno aveva lasciato lì per lei.']], gain: { xp: 5 } },
    'bad.way': { good: false, lines: [['narra', 'Non era la strada che indicava la carta. Un cane si mette ad abbaiare dietro una porta, una finestra si illumina, e nella fretta di allontanarvi una boccetta scivola dal cesto e si rompe sulla neve.'], ['malva', 'Quella era l\'olio di iperico, e costa. La ripaghiamo a metà, tu e io, così ce ne ricordiamo tutte e due.']], loss: { coins: 2 } },
    'good.gate': { good: true, lines: [['narra', 'Era il modo giusto, e vi ritrovate dall\'altra parte senza che il ferro abbia fatto un cigolio. La ronda passa poco dopo, e tira dritto.']] },
    'bad.gate': { good: false, lines: [['narra', 'Non era quello che diceva la carta, e ve ne accorgete dal rumore: il catenaccio sbatte contro il ferro, e l\'eco sale fino alle prime case. Passate lo stesso, ma con il cuore in gola e un lembo del tuo mantello rimasto fra le sbarre.']] },
    'good.whistle': { good: true, lines: [['narra', 'La carta aveva visto giusto anche stavolta. Mentre tornate verso casa una civetta vi segue per un tratto, di ramo in ramo, e Malva dice che è il modo in cui il bosco ringrazia.']] },
    'bad.whistle': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa, e Malva se ne accorge prima di te. Vi tocca rifare un pezzo di strada con il cesto in mano e la ronda alle spalle, e quando finalmente è al sicuro il cielo sta già schiarendo.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['malva', 'Non hai sbagliato un passo, e io stanotte ho camminato come quando avevo vent\'anni. Questo lume cieco era di mia madre: ha uno sportello che nasconde la fiamma, e a te servirà più che a me.'],
      ['malva', 'Prendi anche due coni del mio incenso, quello che non vendo a nessuno. Non lo dico spesso, quindi sentilo bene: con te lavoro volentieri.'],
    ], reward: { xp: 30, tool: 'incense', n: 2, item: 'il lume cieco di Malva', bond: 1 } },
    pass: { lines: [['malva', 'Il cesto è arrivato, ed è quello che conta. Qualche spavento ce lo potevamo risparmiare, ma alla mia prima notte io feci di peggio, e non lo sa nessuno.']], reward: { xp: 12, coins: 3 } },
    fail: { lines: [
      ['narra', 'Quando rientrate nel vicolo il cielo è già grigio. Metà delle boccette si è rotta per strada, e per far tacere il conestabile del cancello Malva ha dovuto mettergli in mano delle monete, comprese le tue.'],
      ['malva', 'Stanotte le carte parlavano e noi non le abbiamo ascoltate. Sono stanca e sono arrabbiata, più con me che con te, ma per qualche giorno lasciami brontolare in pace.'],
    ], loss: { coins: 6, tool: 'incense', bond: 1 } },
  },
};

export const fog = {
  id: 'fog',
  title: 'La nebbia del bosco fitto',
  with: 'ortica',
  main: true,
  after: ['trial.night'],
  when: [{ chapterMin: 2 }, { spread: 'ppf' }, { majorsMin: 9 }, played('night')],
  note: 'Ortica va a tagliare la barba di bosco al limite del bosco fitto, all\'imbrunire, e vuole compagnia. Mi aspetta allo stagno.',
  start: { at: 'forest.pond', label: 'Lo stagno', verb: 'Vai' },
  // used: the sign, and what begins, stops or returns (La Ruota is the one that returns); La Forza is the third
  study: ['sign', 'm10', 'm08'],
  steps: [
    { lines: [
      ['narra', 'Allo stagno Ortica ha già la falce al fianco e un sacco sulla spalla, e comincia a parlare prima ancora che tu sia arrivata.'],
      ['ortica', 'La barba di bosco cresce soltanto sui faggi vecchi, al limite del bosco fitto, e va tagliata all\'imbrunire, quando è umida! Io ci vado da trent\'anni, e da trent\'anni quella nebbia prova a tenermi là dentro.'],
      ['ortica', 'Non che abbia paura, figurati, ma in due si sbaglia strada con più allegria. Aspetta che chiedo alle carte, che a loro non piace essere lasciate fuori dalle decisioni.'],
    ] },
    { witchDraw: { who: 'ortica', card: 'm18', rev: false, t: 'È uscita La Luna, dritta, e dice che stasera niente sarà come sembra, e che farei meglio a restarmene a casa. Però fra tre giorni la barba di bosco è secca, e io la Luna la conosco da prima che tu nascessi: andiamo lo stesso, e teniamo gli occhi aperti.' } },
    { lines: [
      ['narra', 'Tagliate il lichene finché c\'è luce, e quando Ortica chiude il sacco il sentiero alle vostre spalle non c\'è più. La nebbia è scesa dal bosco fitto senza fare rumore, e a tre passi non distingui il tronco di un faggio dalla schiena di Ortica.'],
      ['ortica', 'Ecco, lo sapevo io e lo sapeva anche la Luna. Adesso non ti muovere a caso, perché questa nebbia riporta sempre al punto di partenza chi cammina senza chiedere.'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Una lanterna ferma tra i rami, che qualcuno tiene alta senza muoversi.', tags: { cards: ['m02', 'm05', 'm09', 'm12'], rev: false } },
      { text: 'Un varco dove la nebbia si strappa, da prendere di corsa prima che si richiuda.', tags: { cards: ['m00', 'm01', 'm07'], rev: false } },
      { text: 'Un filo d\'acqua tra i sassi, da seguire con pazienza, un passo dopo l\'altro.', tags: { cards: ['m03', 'm04', 'm08', 'm14'], rev: false } },
    ] }, who: 'ortica', t: 'Io vedo tre cose, e so per esperienza che una sola è vera. Tira una carta, e dimmi a quale delle tre dobbiamo credere.', right: 'good.moss', wrong: 'bad.circle' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di qualcosa che comincia o che cresce, si prende il tronco di destra. Se parla di qualcosa che si ferma o che finisce, quello di sinistra. Se parla di qualcosa che ritorna, si resta al faggio e si aspetta che la nebbia giri.', options: [
      { text: 'Prendo a destra.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Prendo a sinistra.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Resto al faggio, e aspetto.', tags: { moto: 'torna' } },
    ] }, who: 'ortica', t: 'Qui il sentiero si divide, al faggio con i due tronchi, e mia nonna ci aveva fatto sopra una regola. Te la dico io, e poi peschi tu.', right: 'good.beech', wrong: 'bad.brook' },
    { choice: [
      { t: 'Le dico che ho paura anch\'io.', bond: 1, trait: { tono: 1 }, then: [['ortica', 'Ah, meno male, perché io ne ho da quando è sceso il buio e non sapevo come dirlo! Adesso che l\'abbiamo detto in due pesa la metà.']] },
      { t: 'Le dico di stare zitta un momento, e di ascoltare il bosco.', trait: { parola: 1 }, then: [['ortica', 'Zitta io, dici? Va bene, ci provo. Però se fra dieci passi non ho sentito niente ricomincio a parlare, ti avverto.']] },
    ], who: 'narra', t: 'Ortica cammina davanti e non ha smesso un momento di parlare, ma a un certo punto la voce le si incrina, e si volta a guardarti.' },
    { say: 'narra', t: 'Davanti a voi c\'è il ruscello grosso, e per passarlo soltanto un tronco messo di traverso, lucido d\'acqua.' },
    { fork: { kind: 'segno', options: [
      { text: 'Passiamo sul tronco, una dietro l\'altra.', sign: 'go' },
      { text: 'Passiamo a cavalcioni, piano, tenendoci con le mani.', sign: 'slow' },
      { text: 'Non passiamo, e cerchiamo il guado più a valle.', sign: 'stop' },
    ] }, who: 'ortica', t: 'Di giorno lo passo a occhi chiusi, ma di giorno lo vedo. Chiedi alla carta se stasera ci possiamo fidare.', right: 'good.log', wrong: 'bad.log' },
    { fork: { kind: 'quesito', by: 'suit', rule: 'Se esce un Arcano Maggiore, si sale per il crinale. Se esce una carta di Coppe o di Denari, si scende lungo l\'acqua. Se esce una carta di Bastoni o di Spade, si taglia per la radura bruciata.', options: [
      { text: 'Salgo per il crinale.', tags: { suit: 'major' } },
      { text: 'Scendo lungo l\'acqua.', tags: { suit: ['c', 'p'] } },
      { text: 'Taglio per la radura bruciata.', tags: { suit: ['w', 's'] } },
    ] }, who: 'ortica', t: 'Sento odore di fumo, e vuol dire che la capanna non è lontana. Per l\'ultimo pezzo c\'è un detto dei carbonai, che in trent\'anni non mi ha mai tradita.', right: 'good.smoke', wrong: 'bad.smoke' },
  ],
  rooms: {
    'good.moss': { good: true, lines: [['narra', 'Era la cosa vera, e dopo cento passi riconosci il faggio spaccato dal fulmine. Ai suoi piedi cresce un cuscino di barba di bosco che Ortica non aveva mai visto, e ne riempite un altro mezzo sacco.']], gain: { xp: 5 } },
    'bad.circle': { good: false, lines: [['narra', 'Era una delle due cose false. Camminate convinte per un pezzo, e quando la nebbia si apre un momento avete davanti il ceppo su cui Ortica aveva posato la falce: avete fatto un giro intero, e intanto è venuto buio.']] },
    'good.beech': { good: true, lines: [['narra', 'La regola della nonna tiene ancora, e il terreno comincia a scendere dalla parte giusta. In un incavo del faggio Ortica ritrova un sacchetto di monete che aveva nascosto anni fa e poi dimenticato, e te ne dà metà, perché dice che stasera la memoria buona è la tua.']], gain: { coins: 4 } },
    'bad.brook': { good: false, lines: [['narra', 'Hai letto la carta in un modo, e la regola diceva l\'altro. Il terreno cede sotto il piede e finisci in un fosso pieno d\'acqua fino al ginocchio, con la borsa sotto: quando la tiri su, quello che dentro era asciutto non lo è più.']], loss: { tool: 'incense' } },
    'good.log': { good: true, lines: [['narra', 'La carta aveva ragione. Vi ritrovate dall\'altra parte asciutte, e Ortica dice che un ruscello attraversato bene porta fortuna per un mese intero.']] },
    'bad.log': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Ortica perde l\'equilibrio, tu la afferri per il sacco, e ve la cavate con uno spavento e con una manciata di monete che dal tuo borsello aperto vanno a fondo.']], loss: { coins: 3 } },
    'good.smoke': { good: true, lines: [['narra', 'Era la strada del detto. Il fumo si fa più forte a ogni passo, e fra i tronchi compare il lume che Ortica lascia sempre acceso alla finestra.']] },
    'bad.smoke': { good: false, lines: [['narra', 'Il detto indicava un\'altra strada. Girate ancora mezz\'ora fra i rovi, che vi strappano le maniche e a te anche il laccio del borsello, prima di ritrovare l\'odore del fumo.']], loss: { coins: 2 } },
  },
  outcomes: {
    perfect: { lines: [
      ['ortica', 'Trent\'anni che vado là dentro, e non ne ero mai uscita così in fretta e con due sacchi pieni! Tieni: questo incenso lo faccio io con la barba di bosco, e non lo do a nessuno, nemmeno a Malva che me lo chiede ogni inverno.'],
      ['ortica', 'Prendi anche il mio fischietto d\'osso. Se un giorno la nebbia ti prende quando sei da sola, tu fischia, che io lo sento fin da casa.'],
    ], reward: { xp: 35, tool: 'incense', n: 2, item: 'il fischietto d\'osso di Ortica', bond: 1 } },
    pass: { lines: [['ortica', 'Siamo fuori, siamo intere, e la barba di bosco è nel sacco. Qualche giro di troppo l\'abbiamo fatto, ma domani lo racconterò come se fosse stato tutto calcolato.']], reward: { xp: 15, coins: 3 } },
    fail: { lines: [
      ['narra', 'Uscite dalla nebbia che è notte fonda, bagnate fino alla vita. Il sacco è rimasto da qualche parte nel bosco fitto, insieme a quello che ti è caduto dalla borsa ogni volta che siete inciampate.'],
      ['ortica', 'La Luna l\'aveva detto, e io ho voluto fare di testa mia. Adesso però lasciami stare, che quando sbaglio strada divento antipatica, e stasera di strade ne abbiamo sbagliate parecchie.'],
    ], loss: { coins: 5, tool: 'any', bond: 1 } },
  },
};

export const cellars = {
  id: 'cellars',
  title: 'Le porte di sotto',
  with: 'edera',
  main: true,
  after: ['trial.fog'],
  when: [{ chapterMin: 3 }, { flag: 'lesson.reversed' }, played('fog')],
  note: 'Edera vuole che impari la strada delle cantine fino alla porta delle celle, e che torni a dirle com\'è. Si comincia dalla cantina sotto la botola.',
  start: { at: 'depths.cellar', label: 'La cantina', verb: 'Vai' },
  // used: the reversed cards and the sign; the court and Il Diavolo are the others she senses
  study: ['reversed', 'sign', 'court', 'm15'],
  steps: [
    { lines: [
      ['narra', 'Edera si è fatta accompagnare fino alla prima cantina, e ti aspetta seduta su una botte, con il bastone fra le ginocchia e una candela accanto.'],
      ['edera', 'Vieni qui vicino, cara. Da qui alla porta delle celle ci sono quattro passaggi, e io li ho fatti tante volte che li rifaccio ancora la notte, nel sonno. Le gambe non mi ci portano più, e allora ci vai tu, e poi torni a dirmi se è tutto come lo ricordo.'],
      ['edera', 'Una strega deve conoscere le porte di sotto prima del giorno in cui ne ha bisogno. Lasciami soltanto girare una carta per te, che è un\'abitudine a cui tengo.'],
    ] },
    { witchDraw: { who: 'edera', card: 'm17', rev: false, t: 'È La Stella, dritta, quindi vai tranquilla, cara: dice che chi scende poi torna su. Ricordati soltanto che quaggiù le carte escono anche capovolte, e che una porta capovolta è un\'altra porta.' } },
    { lines: [
      ['narra', 'Il primo passaggio finisce davanti a due porte. Una è di quercia, con il suo chiavistello, e l\'altra sembra murata da cent\'anni.'],
      ['tu', 'Edera me l\'ha detto prima che partissi: con una carta dritta la porta buona è quella che sembra una porta, e con una carta capovolta è l\'altra.'],
    ] },
    { fork: { kind: 'quesito', by: 'arcana', rule: 'Carta dritta: la porta di quercia. Carta capovolta: la porta che sembra murata.', options: [
      { text: 'Apro la porta di quercia.', tags: { rev: false } },
      { text: 'Spingo la porta che sembra murata.', tags: { rev: true } },
    ] }, right: 'good.first', wrong: 'bad.first' },
    { lines: [
      ['narra', 'Più avanti il corridoio si apre in tre.'],
      ['tu', 'Per questo punto Edera non ricordava nessuna regola. Sapeva soltanto che una delle tre strade è quella giusta, e che la carta lo sa.'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Un corridoio da cui torna indietro un filo d\'aria fresca, che sa di fuori.', tags: { moto: 'torna' } },
      { text: 'Una nicchia nel muro, dove fermarsi e lasciar passare i passi che si sentono di sopra.', tags: { moto: 'ferma' } },
      { text: 'Una scala corta che finisce contro una porticina, l\'ultima in fondo al corridoio.', tags: { moto: 'chiude' } },
    ] }, right: 'good.second', wrong: 'bad.second' },
    { lines: [
      ['narra', 'Il terzo passaggio è una fila di porte tutte uguali, e da sotto una di esse filtra una riga di luce.'],
      ['tu', 'Per queste porte Edera aveva una regola, e me l\'ha fatta ripetere due volte prima di lasciarmi andare.'],
    ] },
    { fork: { kind: 'quesito', by: 'arcana', rule: 'Se esce una figura di corte, dietro la porta c\'è qualcuno: si aspetta. Se esce un Arcano Maggiore dritto, la porta è libera: si entra. Se esce un Arcano Maggiore capovolto, si passa dalla porta accanto.', options: [
      { text: 'Aspetto ferma, trattenendo il fiato.', tags: { group: 'court' } },
      { text: 'Entro dalla porta con la luce.', tags: { arcana: 'major', rev: false } },
      { text: 'Passo dalla porta accanto.', tags: { arcana: 'major', rev: true } },
    ] }, right: 'good.third', wrong: 'bad.third' },
    { lines: [
      ['narra', 'La porta delle celle è proprio come la ricordava Edera, di ferro, con uno sportello all\'altezza degli occhi. La stai ancora guardando quando alle tue spalle cade una sedia, e una voce impastata di sonno chiede chi c\'è.'],
      ['tartufo', '(Quello si è svegliato, e ha le gambe più lunghe delle tue. Corri verso la luce, che alla porta ormai abbiamo dato un\'occhiata.)'],
    ] },
    { escape: { to: 'auto', seconds: 30 },
      safe: [['narra', 'Lo senti inciampare nei secchi e imprecare piano, e poi più niente. Nel buio delle cantine chi conosce le porte ha sempre un vantaggio su chi le sorveglia.']],
      caught: { error: 1, loss: { coins: 4 }, lines: [['narra', 'Il conestabile ti afferra per il cappuccio e ti porta sotto la sua lanterna. Per fortuna ha più sonno che zelo: ti fa vuotare le tasche sul tavolo, si tiene le monete, e ti rimanda da dove sei venuta con uno spintone.']] } },
    { lines: [
      ['narra', 'Per tornare da Edera c\'è una scorciatoia, una galleria bassa che passa proprio sotto il tribunale.'],
      ['tu', 'Di questa galleria Edera non mi ha detto niente, quindi chiedo alla carta se posso fidarmi.'],
    ] },
    { fork: { kind: 'segno', options: [
      { text: 'Prendo la galleria.', sign: 'go' },
      { text: 'Prendo la galleria, ma a carponi e con la candela spenta.', sign: 'slow' },
      { text: 'Torno dalla strada lunga, quella che ormai conosco.', sign: 'stop' },
    ] }, right: 'good.back', wrong: 'bad.back' },
  ],
  rooms: {
    'good.first': { good: true, lines: [['narra', 'Era la porta giusta, e dietro c\'è una stanzetta asciutta con una mensola. Sulla mensola qualcuno ha lasciato un mozzicone di candela buona, di quelle di cera vera, e te lo metti in tasca.']], gain: { xp: 5 } },
    'bad.first': { good: false, lines: [['narra', 'Era la porta sbagliata. Dietro c\'è un pozzo d\'aria nera, e il sasso che smuovi con il piede ci mette un tempo lunghissimo a toccare l\'acqua. Torni indietro con le ginocchia molli, e prendi l\'altra.']] },
    'good.second': { good: true, lines: [['narra', 'Era la strada giusta. Arrivi più avanti senza aver incontrato nessuno, e in una crepa del muro trovi tre monete annerite, dimenticate lì da chissà quale carceriere.']], gain: { coins: 3 } },
    'bad.second': { good: false, lines: [['narra', 'Non era quello che diceva la carta. Urti una pila di secchi, che rotola giù con un fracasso da svegliare i morti, e per un minuto intero resti al buio ad ascoltare dei passi che si avvicinano e poi, per fortuna, cambiano idea.']] },
    'good.third': { good: true, lines: [['narra', 'La regola di Edera funziona ancora. Passi oltre, e da uno spiraglio vedi un conestabile che dorme su una sedia, con il cappello sugli occhi e le chiavi alla cintura.']] },
    'bad.third': { good: false, lines: [['narra', 'Hai applicato la regola al contrario. Una porta cigola, il conestabile dall\'altra parte smette di russare, e tu resti immobile a contare fino a cento prima di osare un passo. Nel buio qualcosa ti è scivolato dalla borsa, e non puoi tornare a cercarlo.']], loss: { tool: 'any' } },
    'good.back': { good: true, lines: [['narra', 'La carta aveva visto giusto, e ritrovi la prima cantina prima di quanto pensassi. Edera è ancora sulla sua botte, e a sentirti arrivare sorride senza voltarsi.']] },
    'bad.back': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Ti perdi per un buon quarto d\'ora fra corridoi tutti uguali, e la candela finisce prima della strada: l\'ultimo pezzo lo fai a tentoni, con una mano sul muro bagnato.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['edera', 'Quattro passaggi, e me li hai raccontati come li vedo io quando chiudo gli occhi. Allora non me li sono inventati, cara, ed è un sollievo più grande di quanto immagini.'],
      ['edera', 'Questa è la mia chiave della cantina grande, e a una che conosce le porte una chiave in più non guasta. Prendi anche la mirra che brucio una volta l\'anno: quest\'anno la bruci tu, quando ne avrai bisogno.'],
    ], reward: { xp: 40, tool: 'incense', n: 3, item: 'la chiave della cantina grande', bond: 1 } },
    pass: { lines: [['edera', 'Sei tornata, e le porte sono ancora al loro posto: a me basta. Dove hai sbagliato lo so già, perché alla tua età l\'ho sbagliato anch\'io, e nello stesso punto.']], reward: { xp: 18, coins: 4 } },
    fail: { lines: [
      ['narra', 'Quando ritrovi la cantina di Edera hai le mani sbucciate e la borsa leggera. Sulla via del ritorno un conestabile ti ha fermata e te l\'ha rovesciata sul tavolo, alla luce della lanterna, e si è tenuto quello che gli è parso: le monete di sicuro, e se fra le tue carte ne manca una, sai già dove le portano.'],
      ['edera', 'Sei intera, ed è la sola cosa che volevo. Però mi hai fatto stare in pensiero come non mi succedeva da anni, Rosalba, e ci metterò un poco a perdonartelo.'],
    ], loss: { coins: 8, bond: 1, loseCard: 'random-minor' } },
  },
};
