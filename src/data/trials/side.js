// THE SIX SIDE TRIALS: one with each witch, one with Tartufo alone, one with a villager she read for. Each
// is a small story of its own, with its place, a fear, a turn and an end (format: src/trials/run.js).
// A chain in the registry (`after`), so they arrive one at a time, each available by what she HAS:
//   vigil (Malva) -> well (Tartufo) -> kettle (Ortica) -> grave (the widow Bray) -> room (Edera) -> dare (Ginepra)
// The scene that opens each one, her own choice by character, and what is remembered afterwards are in
// data/story/scripts/trials.js. A failed side trial can be tried again on another day: the fail texts
// leave the thing where it was.
// Idea forks that list cards ask for the upright face (`rev: false`): a reversed card has another idea.
// Writing rules: a wrong room never says which wrong way she took, a good room never says which was right.
// Pools assumed (tests/trials.content.test.mjs): vigil = Il Matto + four or more of m01-m07; well = Il Matto +
// five or more of m01-m07; kettle = six or more Majors of m00-m14; grave = eight or more of m00-m14;
// room = eleven or more of m00-m18; dare = twenty or more Majors. Minors and reversed faces only add.

// the chain is also written in each `when` (the door in the world reads only `when`)
const won = (id) => ({ any: [{ flag: `trial.${id}.pass` }, { flag: `trial.${id}.perfect` }] });

export const vigil = {
  id: 'vigil',
  title: 'La notte dai Proctor',
  with: 'malva',
  when: [{ flag: 'exam1.done' }, { majorsMin: 5 }],
  note: 'Malva è stata chiamata di notte in una casa della parte alta, dove c\'è un bambino con la febbre, e ha chiesto di me.',
  start: { at: 'village.upper', label: 'La finestra accesa', verb: 'Vai' },
  study: ['sign', 'm00', 'm07'],
  steps: [
    { lines: [
      ['narra', 'Nella parte alta c\'è una sola finestra accesa, e Malva è ferma lì sotto con la borsa degli unguenti a tracolla.'],
      ['malva', 'Il piccolo dei Proctor ha la febbre da tre giorni, e la madre mi ha mandata a chiamare di nascosto dal marito, che è uno di quelli che in chiesa siedono davanti. Mi servono due mani in più, e una testa che non si spaventi.'],
      ['malva', 'Se va bene, domani in questa strada nessuno saprà che siamo passate. Se va male lo sapranno tutti, e daranno la colpa a noi anche della neve.'],
    ] },
    { witchDraw: { who: 'malva', card: 'm02', rev: false, t: 'È uscita La Sacerdotessa, dritta, e dice di fare piano e di fidarmi del naso più che dei discorsi, e che in quella casa c\'è una cosa che non mi hanno detto. Entriamo, e tu guarda tutto.' } },
    { say: 'narra', t: 'Sulla porta c\'è il padre, in camicia, con un lume in mano e la faccia di chi non ha chiamato nessuno.' },
    { fork: { kind: 'segno', options: [
      { text: 'Entriamo adesso, a testa alta.', sign: 'go' },
      { text: 'Aspettiamo che sia la madre a venire ad aprirci.', sign: 'slow' },
      { text: 'Stanotte no: torniamo domani, con la luce.', sign: 'stop' },
    ] }, who: 'malva', t: 'Con lui ci parlo io, ma il momento lo decidi tu. Chiedi alla tua carta se è questo.', right: 'good.door', wrong: 'bad.door' },
    { lines: [
      ['narra', 'La stanza del bambino è in cima a una scala ripida, e sa di aceto e di candela. Lui è rosso e asciutto come un mattone lasciato al sole, respira corto, e non si volta quando la madre lo chiama per nome.'],
      ['malva', 'Tre giorni così sono troppi per uno di cinque anni. Ho in mente tre cose e non so da quale cominciare, che è il guaio di chi ne sa tante.'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Apro la finestra e cambio l\'aria, subito, senza chiedere il permesso a nessuno.', tags: { cards: ['m00', 'm01', 'm07'], rev: false } },
      { text: 'Mi siedo accanto al letto con la pezza bagnata, e la cambio ogni volta che si scalda, per tutta la notte.', tags: { cards: ['m02', 'm04', 'm05', 'm08', 'm09', 'm12', 'm14'], rev: false } },
      { text: 'Metto una pentola sul fuoco e la madre a sedere, perché in questa casa prima del bambino bisogna curare lei.', tags: { cards: ['m03', 'm06'], rev: false } },
    ] }, who: 'malva', t: 'Guarda la tua carta, e dimmi tu da dove si comincia.', right: 'good.child', wrong: 'bad.child' },
    { lines: [
      ['narra', 'Verso le due, mentre il marito è sceso a prendere la legna, la madre afferra Malva per la manica e parla in fretta, a voce bassissima.'],
      ['narra', '«Ieri è venuto il barbiere, perché l\'ha voluto lui. Gli ha cavato il sangue due volte, da un braccio così piccolo, e mi ha fatto giurare di non dirlo a voi.»'],
      ['malva', 'Ecco la cosa che non mi avevano detto. Non è la febbre che lo sta finendo, è il salasso, e adesso so che cosa fare. Resta da vedere che cosa dire a quell\'uomo quando risale.'],
    ] },
    { choice: [
      { t: 'Glielo dico io in faccia, che il salasso stava ammazzando suo figlio.', bond: 1, trait: { parola: 1 }, then: [['narra', 'Il padre diventa bianco, poi rosso, e per un momento pensi che vi butti giù dalle scale. Invece si siede sul bordo del letto, e non dice più una parola per un\'ora.'], ['malva', 'Io ci avrei girato intorno per mezza notte. Tu ci hai messo una frase, e forse è meglio così.']] },
      { t: 'Sto zitta, e lascio che se ne accorga da solo guardando il figlio che migliora.', trait: { parola: -1 }, then: [['narra', 'Il padre risale con la legna e trova il bambino che beve, a piccoli sorsi, dal cucchiaio di Malva. Guarda il braccio fasciato, guarda la moglie, e posa la legna senza fare domande.'], ['malva', 'Certe cose un uomo così le capisce soltanto se nessuno gliele dice. Hai fatto bene a tenere la lingua a posto.']] },
    ], who: 'narra', t: 'Sulla scala si sentono i passi del padre che torna, e Malva ti guarda come per chiederti chi delle due parla.' },
    { lines: [
      ['narra', 'Alle tre il bambino dorme di un sonno diverso, e il padre fa una cosa che nessuna delle due si aspettava: viene a sedersi davanti a te, con le mani sulle ginocchia.'],
      ['narra', '«Mia moglie dice che voi le carte le sapete leggere. Io non ci credo, e domenica dirò che non ci credo. Ma stanotte voglio sapere se mio figlio vive.»'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Gli dico che da stanotte comincia a guarire, e che domani chiederà da mangiare.', tags: { moto: 'inizia' } },
      { text: 'Gli dico che migliorerà un poco ogni giorno, e che ci vorrà pazienza.', tags: { moto: 'cresce' } },
      { text: 'Gli dico che stanotte non cambia ancora niente, e che bisogna vegliare e aspettare.', tags: { moto: 'ferma' } },
    ] }, who: 'malva', t: 'Tira una carta per lui, e digli quello che vedi, né di più né di meno. Io intanto guardo dall\'altra parte.', right: 'good.father', wrong: 'bad.father' },
    { say: 'narra', t: 'Quando la febbre è scesa del tutto fuori comincia a schiarire, e nella strada si sente aprire la prima imposta.' },
    { fork: { kind: 'segno', options: [
      { text: 'Usciamo adesso dalla porta davanti, come due che non hanno niente da nascondere.', sign: 'go' },
      { text: 'Usciamo una alla volta dalla porta dell\'orto, a qualche minuto di distanza.', sign: 'slow' },
      { text: 'Restiamo in cucina finché non apre il mercato, e ci confondiamo con le altre.', sign: 'stop' },
    ] }, who: 'malva', t: 'Adesso bisogna andarsene bene, che è più difficile che arrivare. Senti che cosa dice la carta.', right: 'good.leave', wrong: 'bad.leave' },
  ],
  rooms: {
    'good.door': { good: true, lines: [['narra', 'La carta aveva visto giusto. Vi ritrovate in cucina senza che nessuno abbia alzato la voce, e la madre vi mette in mano una tazza di brodo caldo prima ancora di dire buonasera.']] },
    'bad.door': { good: false, lines: [['narra', 'Non era il momento che diceva la carta. Il padre si mette di traverso e parla di ministri e di conestabili, e ci vuole tutta la pazienza di Malva, più una tua moneta per la cassetta della chiesa, perché si faccia da parte.']], loss: { coins: 1 } },
    'good.child': { good: true, lines: [['narra', 'Era la cosa da fare. Dopo un\'ora il bambino si lascia bagnare le labbra e stringe un dito della madre, che si mette a piangere piano dentro il grembiule.']], gain: { xp: 5 } },
    'bad.child': { good: false, lines: [['narra', 'Non era quello che indicava la carta, e si perde un\'ora buona. Il bambino si agita e si lamenta, e Malva deve aprire l\'unguento forte, quello che teneva per i casi gravi e che costa quanto una settimana di letture.']] },
    'good.father': { good: true, lines: [['narra', 'Gli hai detto quello che diceva la carta, e lui lo ascolta fino in fondo senza interromperti. Poi si alza, va alla credenza, e posa sul tavolo tre monete senza guardarti, come si lascia un\'offerta.']], gain: { coins: 3 } },
    'bad.father': { good: false, lines: [['narra', 'Gli hai detto una cosa che la carta non diceva, e lui se ne accorge dalla tua voce più che dalle parole. Si alza, dice che lo sapeva che erano tutte storie, e per il resto della notte vi sorveglia dalla porta con le braccia incrociate.']] },
    'good.leave': { good: true, lines: [['narra', 'Era il modo giusto. Nessuno in strada si volta a guardarvi, e dalla finestra di sopra la madre alza appena una mano, che per stanotte vale più di un discorso.']] },
    'bad.leave': { good: false, lines: [['narra', 'Non era quello che diceva la carta. La vicina dei Proctor vi vede benissimo, con la borsa degli unguenti e tutto il resto, e richiude l\'imposta in un modo che entro mezzogiorno lo saprà mezza strada.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['malva', 'La madre voleva pagare me, e io le ho detto di pagare te, che stanotte hai deciso bene ogni volta. Sono quindici monete, e te le sei guadagnate.'],
      ['malva', 'Questo invece te lo do io. È il cucchiaio d\'argento con cui ho dato da bere a tutti i bambini di Salem, compreso quel Proctor che siede in prima fila. Tienilo in borsa, e quando ti chiameranno di notte ti ricorderai come si fa.'],
    ], reward: { coins: 15, tool: 'incense', item: 'il cucchiaio d\'argento di Malva', xp: 20, bond: 1 } },
    pass: { lines: [['malva', 'Il bambino dorme, e noi due siamo ancora in piedi. Qualcosa l\'abbiamo sbagliato, ma niente che una notte di sonno non aggiusti, per lui e per noi.']], reward: { xp: 10, coins: 5 } },
    fail: { lines: [
      ['narra', 'Uscite che il gallo ha già cantato. Il bambino si riprenderà, ma più per la sua tempra che per merito vostro, e sulla porta il padre ha detto forte, perché sentissero i vicini, che certa gente in casa sua non la vuole.'],
      ['malva', 'Stanotte ho finito l\'unguento buono, e ci ho rimesso una casa dove mi chiamavano. Vai a dormire, e domani non venirmi a chiedere com\'è andata, perché lo sappiamo tutte e due.'],
    ], loss: { coins: 4, tool: 'incense', bond: 1 } },
  },
};

export const well = {
  id: 'well',
  title: 'Qualcosa nel pozzo',
  after: ['trial.vigil'],
  when: [{ flag: 'exam1.done' }, { power: 'cat' }, { majorsMin: 6 }, won('vigil')],
  note: 'Tartufo non mi lascia dormire: va e viene dal pozzo della piazza, e vuole che lo segua. Laggiù c\'è qualcosa che si lamenta.',
  start: { at: 'village.well', label: 'Il pozzo', verb: 'Guarda' },
  study: ['sign', 'm00', 'm03'],
  steps: [
    { lines: [
      ['narra', 'È notte fonda, e la piazza è vuota. Tartufo è in piedi sul bordo del pozzo, con la coda gonfia, e dal buio sotto di lui sale un lamento sottile che ogni tanto si interrompe.'],
      ['tartufo', '(Lo senti anche tu, quindi non me lo sono sognato. È laggiù da ieri sera, sul gradino dove finisce la scala di ferro, e io con queste zampe una scala di ferro non la scendo.)'],
      ['tu', 'Il pozzo è profondo e la scala è vecchia, e fra un quarto d\'ora ripassa la ronda. Tartufo però non mi ha mai chiesto niente, prima di stanotte.'],
    ] },
    { witchDraw: { who: 'tartufo', card: 'm08', rev: false, t: '(Ti ho tirato fuori una carta dalla borsa con la zampa, perché in questa casa si usa così. È La Forza, dritta: dice che ci vuole coraggio, ma di quello gentile, e che le cose spaventate si prendono piano.)' } },
    { say: 'narra', t: 'La scala di ferro scende lungo la parete del pozzo, e il primo piolo è coperto di ghiaccio.' },
    { fork: { kind: 'segno', options: [
      { text: 'Scendo adesso, prima che torni la ronda.', sign: 'go' },
      { text: 'Scendo piano, provando ogni piolo con il piede prima di metterci il peso.', sign: 'slow' },
      { text: 'Non scendo: calo il secchio con dentro un panno, e aspetto.', sign: 'stop' },
    ] }, who: 'tartufo', t: '(Io ti guardo da quassù e ti dico se arriva qualcuno. Come scendere chiedilo alla carta, che di scale ne capisce più di me.)', right: 'good.rungs', wrong: 'bad.rungs' },
    { lines: [
      ['narra', 'In fondo l\'aria è ferma e fredda, e l\'acqua è un cerchio nero poco sotto i tuoi piedi. Il lamento adesso è vicino, ma rimbalza sulle pietre e sembra venire da tre punti diversi.'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Una nicchia asciutta nel muro, dove qualcosa si è raccolto su sé stesso e non si muove.', tags: { cards: ['m02', 'm05'], rev: false } },
      { text: 'Una trave di traverso sull\'acqua, su cui bisogna avventurarsi con un passo lungo.', tags: { cards: ['m00', 'm01', 'm07'], rev: false } },
      { text: 'Un mucchio di paglia e di foglie cadute dall\'alto, tiepido, che qualcuno ha scavato a forma di nido.', tags: { cards: ['m03', 'm04', 'm06'], rev: false } },
    ] }, who: 'tartufo', t: '(Da quassù non vedo niente. Tira una carta, e vai dove ti dice lei.)', right: 'good.found', wrong: 'bad.found' },
    { lines: [
      ['narra', 'Lo trovi, e non è un gattino. È un gatto grigio, grosso il doppio di Tartufo, con una zampa storta e un collare di cuoio con un sonaglio d\'argento. Tutta Salem conosce quel sonaglio, perché è del gatto del Giudice.'],
      ['tartufo', '(Sì, è lui. Mi ha cacciato da ogni tetto di questo villaggio, e il mese scorso mi ha lasciato un segno su un orecchio. Però ieri sera l\'ho sentito cadere, e stanotte non sono riuscito a dormire.)'],
      ['narra', 'Il gatto grigio ti soffia contro, poi smette, perché non ha più la forza nemmeno per quello.'],
    ] },
    { choice: [
      { t: 'Me lo metto nel mantello così com\'è, e che graffi pure.', trait: { rischio: 1 }, then: [['narra', 'Graffia, infatti, e ti lascia tre righe sul polso. Poi sente il caldo, e si lascia andare contro di te con tutto il suo peso.']] },
      { t: 'Gli parlo piano finché non smette di tremare, e solo allora lo prendo.', trait: { tono: 1 }, then: [['narra', 'Ci vuole un tempo che non hai, ma a un certo punto il gatto grigio allunga il muso e ti annusa le dita. Quando lo sollevi non tira fuori un\'unghia.']] },
    ], who: 'narra', t: 'Bisogna portarlo su, e ha una zampa che non regge.' },
    { say: 'narra', t: 'Sei a metà della scala, con un braccio solo libero, quando sopra di te Tartufo smette di colpo di muoversi, e sul selciato della piazza si sentono dei passi.' },
    { fork: { kind: 'idea', options: [
      { text: 'Comincio a salire più in fretta, e mi butto fuori dal pozzo dal lato in ombra.', tags: { moto: 'inizia' } },
      { text: 'Continuo come prima, un piolo dopo l\'altro, senza cambiare passo.', tags: { moto: 'cresce' } },
      { text: 'Mi fermo dove sono, attaccata alla scala, e non respiro finché i passi non si allontanano.', tags: { moto: 'ferma' } },
    ] }, who: 'tartufo', t: '(È la ronda, ed è in anticipo. Decidi adesso, e decidi con la carta.)', right: 'good.climb', wrong: 'bad.climb' },
    { lines: [
      ['narra', 'Sul bordo del pozzo i due gatti si guardano a lungo. Poi Tartufo si avvicina, annusa la zampa storta, e si siede accanto al grigio come se fosse la cosa più naturale del mondo.'],
      ['tartufo', '(Lo portiamo sotto il portico del tribunale, che è casa sua, e ce ne andiamo prima che apra qualcuno. Del resto non voglio sentir parlare, né stanotte né mai.)'],
    ] },
  ],
  rooms: {
    'good.rungs': { good: true, lines: [['narra', 'La carta aveva visto giusto. Poco dopo sei in fondo con tutte e due le mani sane, e incastrata fra due pietre trovi una moneta che qualcuno ha buttato giù esprimendo un desiderio.']], gain: { coins: 1 } },
    'bad.rungs': { good: false, lines: [['narra', 'Non era quello che diceva la carta. Un piolo ti resta in mano, sbatti il ginocchio contro la pietra, e dalla borsa aperta qualcosa cade nell\'acqua nera con un tonfo piccolo.']], loss: { coins: 2 } },
    'good.found': { good: true, lines: [['narra', 'Era il punto giusto, e il lamento adesso è proprio davanti a te. Due occhi gialli si aprono nel buio, più in alto e più distanti fra loro di quanto ti aspettavi.']], gain: { xp: 5 } },
    'bad.found': { good: false, lines: [['narra', 'Non era lì. Ci metti un pezzo a capirlo, con i piedi nell\'acqua gelata fino alla caviglia, e intanto il lamento si fa più debole e Tartufo, da sopra, più impaziente.']] },
    'good.climb': { good: true, lines: [['narra', 'Era la cosa da fare. La lanterna della ronda attraversa la piazza senza fermarsi, e quando metti la testa fuori dal pozzo c\'è soltanto Tartufo, che finge di non essere stato in pensiero.']] },
    'bad.climb': { good: false, lines: [['narra', 'Non era quello che diceva la carta. La lanterna si ferma, si avvicina al pozzo, e resta lì sopra per un minuto intero mentre tu stringi il gatto grigio perché non si lamenti. Quando finalmente se ne va hai le braccia che tremano, e un piolo più in basso hai lasciato la tua sciarpa.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['narra', 'Davanti al portico del tribunale il gatto grigio si lascia posare sulla stuoia. Prima che ve ne andiate fa una cosa strana: si strofina il collo contro lo stipite finché il collare non si slaccia, e lo spinge verso Tartufo con il muso.'],
      ['tartufo', '(Il sonaglio lo porti tu, che io non sono un gatto da sonagli. Però tienilo da conto, perché da stanotte su quei tetti ci passo quando voglio, e sappiamo tutti e due perché.)'],
    ], reward: { item: 'il sonaglio d\'argento', coins: 6, xp: 25 } },
    pass: { lines: [['tartufo', '(Lo abbiamo lasciato sulla sua stuoia, vivo, e nessuno ci ha viste. Il resto, i piedi bagnati e gli spaventi, si asciuga davanti al fuoco. Stanotte dormo sul tuo cuscino, e non è un premio, è una decisione.)']], reward: { xp: 12, coins: 2 } },
    fail: { lines: [
      ['narra', 'Il gatto grigio arriva alla sua stuoia, ma tu arrivi a casa zoppicando, con la borsa mezza vuota e il mantello strappato. Dalla finestra del tribunale qualcuno ha visto una ragazza posare qualcosa sulla soglia in piena notte, e domani se ne parlerà.'],
      ['tartufo', '(L\'idea era mia, e il conto l\'hai pagato tu. Non sono bravo a chiedere scusa, quindi per qualche giorno ti porterò dei topi, e tu farai finta di gradire.)'],
    ], loss: { coins: 5, tool: 'any' } },
  },
};

export const kettle = {
  id: 'kettle',
  title: 'Il paiolo di Ortica',
  with: 'ortica',
  after: ['trial.well'],
  when: [{ chapterMin: 2 }, { spread: 'ppf' }, won('well')],
  note: 'Ortica dice che un calderaio accampato al confine del bosco sta per andarsene con il suo paiolo di rame, e stanotte va a riprenderselo.',
  start: { at: 'forest.boundary', label: 'Il carro del calderaio', verb: 'Vai' },
  study: ['sign', 'm00', 'm08'],
  steps: [
    { lines: [
      ['narra', 'Al confine del bosco, dove comincia la strada del mare, c\'è un carro fermo con un fuoco quasi spento accanto. Ortica è accucciata dietro un cespuglio, e ti fa segno di abbassarti.'],
      ['ortica', 'Quel calderaio si è preso il mio paiolo per stagnarlo, tre settimane fa, e da tre settimane mi dice domani! Stamattina ha caricato il carro, e io il paiolo di mia madre in giro per la costa non ce lo mando.'],
      ['ortica', 'Guarda che non è rubare, è riprendere, e c\'è una bella differenza. Comunque prima sento le carte, che su queste cose hanno più giudizio di me.'],
    ] },
    { witchDraw: { who: 'ortica', card: 'm01', rev: false, t: 'Il Mago, dritto, che poi sarebbe la mia carta! Dice che ho la volontà e ho i mezzi, e che è il momento di agire. I mezzi saresti tu, se non l\'avevi capito: andiamo.' } },
    { say: 'narra', t: 'Il carro ha tre lati da cui ci si può avvicinare. Sotto il telone il rame luccica, e vicino alla ruota dorme un cane grosso come un vitello.' },
    { fork: { kind: 'idea', options: [
      { text: 'Dal lato del fuoco, allo scoperto e in fretta, prima che si alzi la luna.', tags: { cards: ['m00', 'm01', 'm07'], rev: false } },
      { text: 'Dal lato del cane, piano, con un pezzo di pane in mano e una parola buona.', tags: { cards: ['m03', 'm06', 'm08', 'm14'], rev: false } },
      { text: 'Dal lato del bosco, strisciando sotto il carro senza un rumore.', tags: { cards: ['m02', 'm09', 'm12'], rev: false } },
    ] }, who: 'ortica', t: 'Da che parte andiamo? Io andrei dritta, ma io vado sempre dritta, ed è proprio per questo che lo chiedo a te.', right: 'good.wagon', wrong: 'bad.wagon' },
    { say: 'narra', t: 'Sotto il telone i paioli sono impilati uno dentro l\'altro, e a toccare quello sbagliato viene giù tutto.' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di qualcosa che comincia, il paiolo è in cima alla pila. Se parla di qualcosa che cresce, è nel mezzo. Se parla di qualcosa che si ferma, che finisce o che ritorna, è in fondo.', options: [
      { text: 'Prendo quello in cima.', tags: { moto: 'inizia' } },
      { text: 'Sfilo quello nel mezzo.', tags: { moto: 'cresce' } },
      { text: 'Tiro fuori quello in fondo.', tags: { moto: ['ferma', 'chiude', 'torna'] } },
    ] }, who: 'ortica', t: 'Il mio ha un\'ammaccatura sul bordo, ma al buio le ammaccature le hanno tutti. I calderai però impilano sempre allo stesso modo, e quel modo io lo conosco.', right: 'good.pile', wrong: 'bad.pile' },
    { lines: [
      ['narra', 'Il paiolo con l\'ammaccatura lo trovate, ma dentro è vuoto e leggero, e Ortica lo gira fra le mani senza capire. Poi guarda sotto il carro, e resta ferma.'],
      ['narra', 'Sotto il carro, su un sacco, dorme una bambina di sei o sette anni. Tiene abbracciato il coperchio di rame del paiolo come si tiene una bambola, e sul coperchio qualcuno ha disegnato con il carbone due occhi e una bocca.'],
      ['ortica', 'Il coperchio di mia madre. Senza quello il paiolo non vale la metà, e lei ci ha fatto una faccia. Io adesso non so più che cosa sono venuta a fare, te lo dico sinceramente.'],
    ] },
    { choice: [
      { t: 'La sveglio piano, e le offro il mio nastro in cambio del coperchio.', bond: 1, trait: { tono: 1 }, then: [['narra', 'La bambina apre gli occhi senza spaventarsi, guarda il nastro, guarda il coperchio, e ci pensa con grande serietà. Poi fa di sì, e si lega il nastro al polso da sola.'], ['ortica', 'Guarda che affari che fai. Io avrei tirato e basta, e mi sarei sentita una ladra per un anno.']] },
      { t: 'Le sfilo il coperchio senza svegliarla, e al suo posto le lascio il mio scialle arrotolato.', trait: { rischio: 1 }, then: [['narra', 'La bambina si lamenta nel sonno, cerca con la mano, trova lo scialle e se lo stringe contro. Tu hai freddo alle spalle, e il coperchio sotto il braccio.'], ['ortica', 'Hai le mani di una borseggiatrice e il cuore di una balia. Non so quale delle due cose mi preoccupi di più.']] },
    ], who: 'narra', t: 'Ortica non si muove, e per una volta non parla. Tocca a te.' },
    { say: 'narra', t: 'In quel momento il calderaio si mette a sedere, si gratta la testa e guarda dalla vostra parte, senza che si capisca se vede qualcosa.' },
    { fork: { kind: 'segno', options: [
      { text: 'Ci alziamo e ce ne andiamo adesso, con il paiolo sotto il mantello.', sign: 'go' },
      { text: 'Ci allontaniamo piano, un passo ogni volta che lui sbadiglia.', sign: 'slow' },
      { text: 'Restiamo immobili finché non si rimette a dormire.', sign: 'stop' },
    ] }, who: 'ortica', t: 'Adesso o si corre o si sta ferme, e io da sola in questi casi sbaglio sempre. Che cosa dice la carta?', right: 'good.away', wrong: 'bad.away' },
    { say: 'narra', t: 'Fra voi e il bosco resta soltanto il cane, che si è alzato senza abbaiare e vi aspetta in mezzo al sentiero, con la testa bassa.' },
    { fork: { kind: 'quesito', by: 'favore', rule: 'Con una carta favorevole, al cane si passa davanti parlandogli. Con una carta contraria, si fa il giro largo fra i rovi. Con una carta che non è né l\'una né l\'altra, ci si ferma e gli si lascia annusare la mano.', options: [
      { text: 'Gli passo davanti, parlandogli.', tags: { favore: '+' } },
      { text: 'Faccio il giro largo, fra i rovi.', tags: { favore: '-' } },
      { text: 'Mi fermo, e gli lascio annusare la mano.', tags: { favore: '0' } },
    ] }, who: 'ortica', t: 'Con i cani dei carri c\'è una regola, e me l\'ha insegnata un calderaio onesto, che ne esistono. Ascoltala bene, perché quello ha i denti.', right: 'good.dog', wrong: 'bad.dog' },
  ],
  rooms: {
    'good.wagon': { good: true, lines: [['narra', 'Era il lato giusto. Arrivate al telone senza che nessuno alzi la testa, e nell\'erba Ortica trova anche il suo mestolo, che non sapeva nemmeno di aver perso.']], gain: { xp: 5 } },
    'bad.wagon': { good: false, lines: [['narra', 'Non era il lato che diceva la carta. Il cane ringhia nel sonno, il calderaio si rigira nella coperta, e voi restate con la faccia nell\'erba bagnata per dieci minuti lunghi come una predica.']] },
    'good.pile': { good: true, lines: [['narra', 'Era proprio lì, e la pila non fa un rumore. Sul fondo, avvolte in uno straccio, ci sono le monete che il calderaio si era fatto dare in anticipo, e Ortica dice che sono sue di diritto e che un po\' toccano a te per il disturbo.']], gain: { coins: 4 } },
    'bad.pile': { good: false, lines: [['narra', 'Hai applicato la regola al contrario, e la pila si inclina. La reggete in due con le ginocchia e con il mento, in un silenzio che fa male alle orecchie, e quando finalmente sta ferma avete le dita pestate e il fiato corto.']] },
    'good.away': { good: true, lines: [['narra', 'La carta aveva visto giusto. Il calderaio sbadiglia, si rimette giù, e in un momento russa di nuovo come una sega nel legno verde.']] },
    'bad.away': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Il calderaio vede due ombre, e vi tira dietro uno zoccolo e una fila di parole che non conoscevi. Nella fretta ti si apre il borsello, e non è il caso di fermarsi a raccogliere quello che ne esce.']], loss: { coins: 3 } },
    'good.dog': { good: true, lines: [['narra', 'La regola del calderaio onesto funziona. Il cane vi lascia passare, e vi segue per un tratto scodinzolando piano, come se vi accompagnasse alla porta.']] },
    'bad.dog': { good: false, lines: [['narra', 'Hai fatto il contrario di quello che diceva la regola. Il cane non morde, ma ti prende l\'orlo del mantello fra i denti e non lo molla, e per liberarti devi lasciargli in bocca una manica e anche il sacchetto che ci tenevi cucito dentro.']], loss: { tool: 'any' } },
  },
  outcomes: {
    perfect: { lines: [
      ['ortica', 'Il paiolo di mia madre con il suo coperchio, e nessuno che ci corra dietro! Te lo dico io che cosa sei: sei una che di notte vale doppio, e di gente così ne ho conosciuta poca.'],
      ['ortica', 'Tieni, queste sono le dodici monete che gli avevo dato per stagnarlo. Il coperchio invece lo tieni tu, con la sua faccia di carbone: io ne faccio fare un altro, e quello ogni volta che lo guardi ti ricorderà che anche riprendere ha il suo modo.'],
    ], reward: { coins: 12, item: 'il coperchio con la faccia', xp: 25, bond: 1 } },
    pass: { lines: [['ortica', 'Il paiolo ce l\'ho, e stasera ci faccio la zuppa per tutte e due. Non è andata liscia come la racconterò domani al mulino, ma questo resta fra noi.']], reward: { xp: 12, coins: 4 } },
    fail: { lines: [
      ['narra', 'Tornate alla capanna a mani vuote. Il paiolo e il coperchio sono rimasti al carro, la bambina si è svegliata piangendo, e il calderaio adesso sa che qualcuno gli gira intorno: per stanotte dormirà con un occhio solo.'],
      ['ortica', 'Era di mia madre, quel paiolo. Lo so che ci hai provato, e lo so che la colpa è anche mia, che parlo quando dovrei stare zitta, però stasera non ho voglia di vedere nessuno.'],
    ], loss: { coins: 5, bond: 1 } },
  },
};

export const grave = {
  id: 'grave',
  title: 'Il lume sulla tomba',
  after: ['trial.kettle'],
  when: [{ chapterMin: 2 }, { flag: 'client.c1.widow.done' }, { majorsMin: 8 }, won('kettle')],
  note: 'La vedova Bray vuole andare di notte sulla tomba del marito, nel bosco, e non ha il coraggio di andarci da sola. Mi aspetta al limite del bosco.',
  start: { at: 'forest.entry', label: 'La vedova Bray', verb: 'Parla' },
  study: ['sign', 'm09', 'm13'],
  steps: [
    { lines: [
      ['narra', 'La vedova Bray ti aspetta al limite del bosco con lo scialle nero tirato sulla testa, una lanterna spenta in una mano e il libro delle preghiere nell\'altra.'],
      ['narra', '«Stanotte fa un anno che l\'ho messo sotto terra. Ogni mese vado da lui di giorno, e ogni mese trovo sulla pietra una candela consumata che non ho acceso io. Voglio sapere chi viene di notte da mio marito, e da sola non ne ho il coraggio.»'],
      ['narra', '«Voi quella sera mi avete letto giusto, e da allora penso che vediate più di me. Prima di andare, però, lasciatemi fare una cosa che il mio Josiah faceva sempre, e che il ministro non deve sapere.»'],
    ] },
    { witchDraw: { who: 'La vedova Bray', card: 'm09', rev: false, t: '«Teneva questa carta nel libro delle preghiere, e la guardava prima di ogni viaggio. È il vecchio con la lanterna, dritto. Lui diceva che vuol dire andare da soli a cercare, con un lume piccolo. Io stanotte da sola non vado, ma il lume piccolo ce l\'ho.»' } },
    { say: 'narra', t: 'Il sentiero per il cimitero passa accanto al fuoco dei carbonai, dove due uomini sono ancora svegli e parlano forte.' },
    { fork: { kind: 'segno', options: [
      { text: 'Passiamo adesso, salutando, come due che vanno per i fatti loro.', sign: 'go' },
      { text: 'Passiamo dietro la catasta, piano, tenendo la lanterna spenta.', sign: 'slow' },
      { text: 'Ci sediamo qui al buio, e aspettiamo che vadano a dormire.', sign: 'stop' },
    ] }, right: 'good.fire', wrong: 'bad.fire' },
    { lines: [
      ['narra', 'Il cimitero del bosco non ha muro, soltanto una fila di sassi bianchi, e di notte le pietre sembrano tutte uguali. La vedova si ferma, e ti accorgi che le trema la mano con cui tiene il libro.'],
      ['narra', '«Di giorno ci arrivo a occhi chiusi. Adesso non so più se è la terza fila o la quarta, e mi vergogno, perché una moglie certe cose le dovrebbe sapere.»'],
    ] },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Il becchino mette i morti dell\'anno secondo una sua regola. Se la carta parla di qualcosa che comincia o che cresce, la tomba è nella fila verso il sorgere del sole. Se parla di qualcosa che si ferma o che finisce, è nella fila verso il tramonto. Se parla di qualcosa che ritorna, è nella fila di mezzo.', options: [
      { text: 'Cerco nella fila verso il sorgere del sole.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Cerco nella fila verso il tramonto.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Cerco nella fila di mezzo.', tags: { moto: 'torna' } },
    ] }, right: 'good.row', wrong: 'bad.row' },
    { lines: [
      ['narra', 'Siete a dieci passi dalla pietra di Josiah Bray quando fra le tombe si accende un lume. Qualcuno è inginocchiato proprio lì, di schiena, e sta piantando una candela nella terra.'],
      ['narra', 'La vedova ti stringe il braccio fino a farti male. «È un uomo. Ditemi che è un uomo, e non un\'altra cosa.»'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Qualcuno che viene a pagare un debito, e non ha mai trovato il modo di dirlo.', tags: { cards: ['m04', 'm05', 'm10', 'm11', 'm14'], rev: false } },
      { text: 'Qualcuno che vuole stare solo con un segreto, e che bisogna lasciar finire.', tags: { cards: ['m02', 'm09', 'm12', 'm13'], rev: false } },
      { text: 'Qualcuno che gli voleva bene, e che andrebbe abbracciato senza tante domande.', tags: { cards: ['m03', 'm06', 'm08'], rev: false } },
    ] }, right: 'good.who', wrong: 'bad.who' },
    { lines: [
      ['narra', 'L\'uomo si volta, ed è il becchino, con il berretto in mano. Non scappa e non si scusa: guarda la vedova come uno che aspettava questo momento da un anno.'],
      ['narra', '«Vostro marito mi prestò i soldi per la bara di mia figlia, e non li volle mai indietro. Io non so pregare, comare. So scavare, e so accendere una candela, e allora ogni mese faccio quello che so.»'],
      ['narra', 'La vedova Bray non dice niente per un pezzo. Poi posa la sua lanterna accanto alla candela di lui, e si inginocchia dall\'altra parte della pietra.'],
    ] },
    { choice: [
      { t: 'Mi allontano di qualche passo, e li lascio soli con il loro morto.', trait: { tono: 1 }, then: [['narra', 'Ti siedi su un sasso bianco, al limite del lume. Li senti parlare a lungo, a voce bassa, e a un certo punto senti perfino la vedova ridere, piano, di una cosa che Josiah diceva sempre.']] },
      { t: 'Resto accanto a lei, e le tengo il libro mentre prega.', trait: { guida: 1 }, then: [['narra', 'La vedova ti passa il libro senza guardarti, come si passa una cosa a una figlia. Dentro, fra due pagine, c\'è il segno chiaro di una carta che ci è rimasta per vent\'anni.']] },
    ], who: 'narra', t: 'Sei di troppo, oppure sei l\'unica ragione per cui lei è arrivata fin qui: non è facile capire quale delle due.' },
    { say: 'narra', t: 'Quando vi rialzate la luna è tramontata, e la strada del ritorno passa di nuovo vicino al villaggio, dove a quest\'ora gira la ronda.' },
    { fork: { kind: 'segno', options: [
      { text: 'Riaccompagno la vedova fino alla sua porta, per la strada grande.', sign: 'go' },
      { text: 'La riaccompagno per gli orti, e la guardo entrare da lontano.', sign: 'slow' },
      { text: 'Ci fermiamo dal becchino fino all\'alba, e rientriamo con la gente del mercato.', sign: 'stop' },
    ] }, right: 'good.home', wrong: 'bad.home' },
  ],
  rooms: {
    'good.fire': { good: true, lines: [['narra', 'La carta aveva visto giusto. Vi ritrovate oltre il fuoco senza che nessuno vi abbia chiesto niente, e la vedova si fa il segno della croce con il libro, che non è proprio il modo ma per stanotte va bene.']] },
    'bad.fire': { good: false, lines: [['narra', 'Non era quello che diceva la carta. Uno dei carbonai si alza e vi viene dietro per un tratto, chiedendo forte che cosa cercano due donne nel bosco a quest\'ora, e per farlo tornare al suo fuoco ci vogliono due tue monete e molte spiegazioni.']], loss: { coins: 2 } },
    'good.row': { good: true, lines: [['narra', 'La regola del becchino vi porta dritte alla fila giusta. La vedova riconosce da lontano il sasso storto che segna la tomba accanto, e per la prima volta stanotte respira fino in fondo.']], gain: { xp: 5 } },
    'bad.row': { good: false, lines: [['narra', 'Hai letto la regola al contrario. Girate a lungo fra pietre che non conoscete, la vedova legge nomi di bambini a mezza voce, e quando finalmente trovate la fila giusta piange senza fare rumore, di stanchezza più che di dolore.']] },
    'good.who': { good: true, lines: [['narra', 'La carta ti aveva detto chi era, e glielo dici all\'orecchio. La vedova allenta la mano sul tuo braccio, si raddrizza lo scialle, e va avanti lei per prima.']] },
    'bad.who': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa, e quello che le hai sussurrato la spaventa invece di calmarla. Lascia cadere il libro, l\'uomo si volta di scatto, e per un momento tutti e tre restate a guardarvi come ladri colti sul fatto.']] },
    'good.home': { good: true, lines: [['narra', 'Era la strada giusta. La vedova arriva alla sua porta senza che un\'anima l\'abbia vista, e prima di entrare ti posa una mano sulla guancia, fredda e leggera.']] },
    'bad.home': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Una lanterna vi ferma al primo angolo, e la vedova deve inventarsi un malore e una vicina premurosa. Il conestabile finge di crederci, ma vuole vedere che cosa hai in borsa, e non tutto quello che ci guarda dentro ci ritorna.']], loss: { coins: 3 } },
  },
  outcomes: {
    perfect: { lines: [
      ['narra', '«Adesso so chi viene da lui, e so che è in buona compagnia. Questo non me l\'ha letto nessuna carta: me ci avete portata voi, senza sbagliare una svolta.»'],
      ['narra', 'Ti mette in mano una bussola d\'ottone, tiepida della sua tasca. «Era di Josiah, che andava per mare prima di sposarmi. A me non serve più, perché ormai so dove andare. Tenetela voi, che di strade ne avete davanti parecchie.»'],
    ], reward: { item: 'la bussola di Josiah Bray', coins: 8, xp: 25 } },
    pass: { lines: [['narra', '«Ci siamo arrivate, e ho visto quello che volevo vedere. Mi avete fatto prendere qualche spavento, ma alla mia età uno spavento è quasi una compagnia. Queste sono per voi, e non dite di no.»']], reward: { xp: 12, coins: 5 } },
    fail: { lines: [
      ['narra', 'La riporti a casa che albeggia, stanca morta e con le scarpe piene di fango. Ha visto il lume e ha visto l\'uomo, ma fra una paura e l\'altra non è riuscita a dire le parole per cui era venuta.'],
      ['narra', '«Non è colpa vostra, figliola. Però un\'altra notte così il mio cuore non la regge tanto presto: lasciatemi qualche giorno, e poi magari ci riproviamo.»'],
    ], loss: { coins: 4, tool: 'any' } },
  },
};

export const room = {
  id: 'room',
  title: 'La stanza che non c\'è più',
  with: 'edera',
  after: ['trial.grave'],
  when: [{ chapterMin: 3 }, { spread: 'celtic' }, won('grave')],
  note: 'Edera mi ha chiesto di cercare, sotto la botola, la stanza dove sua nonna leggeva le carte. Dice che l\'hanno murata, e che dentro è rimasta una cosa sua.',
  start: { at: 'depths.entry', label: 'L\'arco murato', verb: 'Entra' },
  study: ['sign', 'm02', 'm13'],
  steps: [
    { lines: [
      ['narra', 'Sotto la botola, a sinistra della scala, c\'è un arco chiuso con mattoni più chiari degli altri, e dietro i mattoni Edera dice che c\'era la stanza dove sua nonna leggeva le carte.'],
      ['narra', 'Te l\'ha descritta ieri sera, e poi di nuovo stamattina, in un altro modo. Prima di lasciarti andare ha girato una carta sul bracciolo della sedia, come fa sempre.'],
    ] },
    { witchDraw: { who: 'edera', card: 'm20', rev: false, t: 'È Il Giudizio, dritto, e vuol dire che qualcosa che dormiva chiede di essere svegliato: io credo, cara, che sia quella stanza. Di come ci si arriva ricordo tre cose diverse, e non possono essere vere tutte: ogni volta chiedi alle carte quale.' } },
    { say: 'narra', t: 'Fra i mattoni dell\'arco ce n\'è uno che si muove, e dietro si sente il vuoto. Il muro però è vecchio, e sopra la tua testa c\'è tutto il peso della casa.' },
    { fork: { kind: 'segno', options: [
      { text: 'Tolgo i mattoni che servono, e passo subito.', sign: 'go' },
      { text: 'Ne tolgo uno alla volta, ascoltando il muro dopo ognuno.', sign: 'slow' },
      { text: 'Non tocco l\'arco, e cerco se c\'è un altro passaggio.', sign: 'stop' },
    ] }, right: 'good.arch', wrong: 'bad.arch' },
    { lines: [
      ['narra', 'Oltre l\'arco c\'è un cunicolo, e dopo pochi passi ti mette davanti tre cose, che sono proprio le tre che ricordava Edera.'],
      ['tu', 'Edera ha detto che la strada per la stanza era segnata, ma una volta ha detto da una cosa, una volta da un\'altra, e una volta da una terza.'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Una fila di chiodi nel muro, messi in ordine, a un braccio di distanza l\'uno dall\'altro.', tags: { cards: ['m04', 'm05', 'm11', 'm14'], rev: false } },
      { text: 'Un odore di cera e di lavanda, che viene e va senza che si capisca da dove.', tags: { cards: ['m02', 'm09', 'm12', 'm17'], rev: false } },
      { text: 'Un rumore di passi leggeri, come di qualcuno che fa strada qualche metro più avanti.', tags: { cards: ['m00', 'm01', 'm07', 'm20'], rev: false } },
    ] }, right: 'good.trace', wrong: 'bad.trace' },
    { say: 'tu', t: 'Una cosa sola Edera la ricordava bene, e l\'ha detta due volte con le stesse parole: il detto di sua nonna per la porta della stanza.' },
    { fork: { kind: 'quesito', by: 'favore', rule: 'Con una carta favorevole la porta si apre spingendo. Con una carta contraria si apre tirando. Con una carta che non è né l\'una né l\'altra, si bussa tre volte e si aspetta.', options: [
      { text: 'Spingo la porta.', tags: { favore: '+' } },
      { text: 'Tiro la porta verso di me.', tags: { favore: '-' } },
      { text: 'Busso tre volte, e aspetto.', tags: { favore: '0' } },
    ] }, right: 'good.knock', wrong: 'bad.knock' },
    { lines: [
      ['narra', 'La stanza c\'è ancora. È piccola, con un tavolo rotondo, due sedie e una credenza, e ogni cosa è coperta da un dito di polvere chiara.'],
      ['narra', 'Sul tavolo ci sono tre carte coperte, messe in fila, e davanti alla sedia più bassa una tazza con dentro il segno scuro di un latte bevuto settant\'anni fa. Qualcuno stava per leggere le carte a una bambina, e non ha fatto in tempo.'],
      ['tu', 'La sedia bassa era di Edera. Queste tre carte sono per lei, e stanno qui ad aspettarla da quando aveva sei anni.'],
    ] },
    { choice: [
      { t: 'Le lascio coperte, e le porto a Edera così come sono, nello stesso ordine.', bond: 1, trait: { guida: 1 }, then: [['narra', 'Le fai scivolare una sull\'altra senza guardarle e le avvolgi nel fazzoletto. Sotto la polvere il tavolo conserva tre rettangoli scuri, puliti, della misura esatta.']] },
      { t: 'Le giro, perché voglio sapere che cosa la nonna stava per dirle.', trait: { esplora: 1 }, then: [['narra', 'Le giri una alla volta, e ti accorgi che sono tre carte liete. Qualunque cosa la nonna volesse dire a quella bambina, era una buona notizia, e te la tieni a mente parola per parola.']] },
    ], who: 'narra', t: 'Hai la mano sopra la prima carta, e nella stanza non c\'è nessuno che possa dirti che cosa è giusto.' },
    { say: 'tu', t: 'Edera ha detto che sua nonna teneva la cosa più cara in un posto diverso ogni giorno, secondo le carte, e che la mia carta me l\'avrebbe indicato.' },
    { fork: { kind: 'idea', options: [
      { text: 'Sul tavolo, accanto alle tre carte, pronta per una lettura da cominciare.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Nella credenza chiusa a chiave, in fondo all\'ultimo ripiano.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Sulla sedia della nonna, come se dovesse tornare a prenderla da un momento all\'altro.', tags: { moto: 'torna' } },
    ] }, right: 'good.find', wrong: 'bad.find' },
  ],
  rooms: {
    'good.arch': { good: true, lines: [['narra', 'La carta aveva visto giusto. Poco dopo sei dall\'altra parte, e il muro alle tue spalle non ha lasciato cadere nemmeno un granello di calce.']] },
    'bad.arch': { good: false, lines: [['narra', 'Non era quello che diceva la carta. Dall\'arco viene giù una pioggia di calcinacci che ti riempie i capelli e la borsa, e per un momento lungo il muro intero scricchiola come una porta. Passi lo stesso, ma senza più voglia di voltarti a guardarlo.']] },
    'good.trace': { good: true, lines: [['narra', 'Era il ricordo giusto. Il cunicolo gira due volte e si allarga, e per terra trovi un ditale d\'argento annerito, che metti in tasca per Edera.']], gain: { xp: 5 } },
    'bad.trace': { good: false, lines: [['narra', 'Era uno dei due ricordi sbagliati. Il cunicolo si stringe fino a toccarti le spalle e finisce contro la roccia, e per tornare indietro devi camminare a ritroso, al buio, con la candela che ti cola sulle dita.']] },
    'good.knock': { good: true, lines: [['narra', 'Il detto della nonna vale ancora. La porta gira sui cardini senza un lamento, come se qualcuno li avesse unti la settimana scorsa.']] },
    'bad.knock': { good: false, lines: [['narra', 'Hai fatto il contrario di quello che diceva il detto. La porta si incastra, e nello sforzo ti cade di mano la borsa: senti qualcosa rotolare via nel buio, giù per una fessura del pavimento, e non lo senti fermarsi.']], loss: { coins: 3 } },
    'good.find': { good: true, lines: [['narra', 'Era il posto giusto. Sotto la polvere c\'è un sacchetto di velluto con dentro un pendolo d\'ottone, e la catenella è ancora lucida nel punto in cui la tenevano le dita.']] },
    'bad.find': { good: false, lines: [['narra', 'Non era il posto che indicava la carta. Frughi a lungo dove non c\'è niente, sollevi tanta polvere che la candela si mette a friggere, e una mensola marcia ti cade su un piede prima che tu capisca dove guardare davvero.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['edera', 'Il pendolo di mia nonna, e le tre carte che aveva messo giù per me. Ho passato settant\'anni a credere di aver sognato quel pomeriggio, cara, e tu me lo riporti in un fazzoletto.'],
      ['edera', 'Il pendolo tienilo tu, che hai la mano ferma, e che adesso sei la sola a sapere la strada per quella stanza. A me lascia il ditale e le carte, e la certezza che la memoria non mi ha ancora tradita del tutto.'],
    ], reward: { tool: 'pendulum', item: 'il pendolo della nonna di Edera', xp: 30, bond: 1 } },
    pass: { lines: [['edera', 'La stanza c\'è, dunque, e tu l\'hai vista con i tuoi occhi. Il pendolo lo teniamo qui da me, per adesso, e le monete che hai trovato nella credenza sono tue, perché la nonna pagava sempre chi le faceva una commissione.']], reward: { xp: 15, coins: 5 } },
    fail: { lines: [
      ['narra', 'Esci dall\'arco tossendo polvere, con un piede che fa male e le mani vuote. Alle tue spalle qualcosa frana piano, e il cunicolo si chiude di un altro palmo sopra la stanza, il tavolo e le tre carte.'],
      ['edera', 'Non importa, cara, davvero. È solo che per un giorno intero ho creduto di poterla rivedere con i tuoi occhi, e adesso devo rimetterla dov\'era, fra le cose che forse ho soltanto sognato.'],
    ], loss: { coins: 4, tool: 'any', bond: 1 } },
  },
};

export const dare = {
  id: 'dare',
  title: 'La scommessa di Ginepra',
  with: 'ginepra',
  after: ['trial.room'],
  when: [{ flag: 'ending.seen' }, won('room')],
  note: 'Ginepra scommette il suo cappello che non arrivo in fondo alla tana, a nord della capanna di Ortica, per incidere il mio nome accanto al suo.',
  start: { at: 'forest.den', label: 'La tana', verb: 'Vai' },
  study: ['sign', 'm07', 'm18'],
  steps: [
    { lines: [
      ['narra', 'Davanti alla tana Ginepra ha acceso un fuoco piccolo, e ci sta arrostendo una mela infilzata su un bastone, come se foste venute a fare merenda.'],
      ['ginepra', 'Eccoti, era ora che arrivassi! Allora, la scommessa è questa: in fondo alla tana c\'è una pietra dove a dodici anni ho inciso il mio nome, e stanotte ci incidi il tuo. Se arrivi in fondo ti prendi il mio cappello, e se torni indietro prima mi paghi da bere per un mese.'],
      ['ginepra', 'Io vengo con te, si capisce, che là dentro da sola non ci manderei nemmeno un conestabile. Aspetta che giro una carta, così se va male do la colpa a lei.'],
    ] },
    { witchDraw: { who: 'ginepra', card: 'm07', rev: true, t: 'Il Carro, capovolto, e sarebbe pure la mia carta. Dice che stanotte corro a vuoto e che farei meglio a stare ferma, ma io ferma non ci sono mai stata, e non comincio adesso. Andiamo, e se inciampo tu fai finta di niente.' } },
    { say: 'narra', t: 'L\'imboccatura è bassa, e dal buio viene un odore di terra bagnata e di pelo.' },
    { fork: { kind: 'segno', options: [
      { text: 'Entriamo subito, prima di cambiare idea.', sign: 'go' },
      { text: 'Entriamo piano, e vado avanti io con la fiamma sul palmo.', sign: 'slow' },
      { text: 'Aspettiamo qui fuori, e vediamo se esce qualcosa.', sign: 'stop' },
    ] }, who: 'ginepra', t: 'Lo senti che odore? O è una volpe o è mia zia. Chiedi alla tua carta se entriamo, che la mia stasera ho deciso di non ascoltarla.', right: 'good.mouth', wrong: 'bad.mouth' },
    { lines: [
      ['narra', 'A metà discesa Ginepra mette un piede in fallo, proprio come diceva la sua carta. La torcia le vola di mano e si spegne in una pozza, e per un momento restate al buio a sentirvi respirare.'],
      ['ginepra', 'Va bene, uno a zero per il Carro. La caviglia ce l\'ho ancora, e la torcia invece no. Da qui in avanti si va a naso, e fra noi due il naso buono ce l\'hai tu.'],
    ] },
    { fork: { kind: 'idea', options: [
      { text: 'Una galleria da cui viene un gocciolio regolare, sempre uguale, come un orologio.', tags: { cards: ['m04', 'm05', 'm11', 'm14'], rev: false } },
      { text: 'Una galleria in salita, in fondo alla quale c\'è un chiarore, come di luna.', tags: { cards: ['m17', 'm19', 'm20'], rev: false } },
      { text: 'Una galleria stretta che scende, buia e muta, dove si va da sole e a tentoni.', tags: { cards: ['m02', 'm09', 'm12'], rev: false } },
    ] }, who: 'ginepra', t: 'Qui a dodici anni tirai a sorte, e mi andò bene per sbaglio. Tu invece chiedilo alla carta, che è più seria di me.', right: 'good.gallery', wrong: 'bad.gallery' },
    { say: 'narra', t: 'Davanti alla pietra c\'è un crepaccio largo un passo lungo, e sotto non si vede il fondo.' },
    { fork: { kind: 'quesito', by: 'favore', rule: 'Con una carta favorevole si salta il crepaccio. Con una carta contraria si torna a cercare un\'altra strada. Con una carta che non dice né sì né no, si passa sul bordo, con la schiena contro il muro.', options: [
      { text: 'Salto il crepaccio.', tags: { favore: '+' } },
      { text: 'Torno a cercare un\'altra strada.', tags: { favore: '-' } },
      { text: 'Passo sul bordo, con la schiena contro il muro.', tags: { favore: '0' } },
    ] }, who: 'ginepra', t: 'Per questo salto a dodici anni avevo una regola, e siccome l\'ho inventata io è sicuramente giusta.', right: 'good.gap', wrong: 'bad.gap' },
    { lines: [
      ['narra', 'Il nome di Ginepra è ancora lì, inciso storto, con una stella accanto. Sotto, più piccola, c\'è una riga che lei copre in fretta con la mano, ma non abbastanza in fretta.'],
      ['narra', 'La riga dice: «Ho pianto per tutta la strada, e non lo saprà mai nessuno.»'],
      ['ginepra', 'Ecco, adesso lo sai. A dodici anni sono venuta qui da sola perché mi avevano detto che non ne ero capace, e ho avuto tanta paura che non ho mai più smesso di fare la spavalda. Se lo racconti in giro nego tutto.'],
    ] },
    { choice: [
      { t: 'Incido il mio nome accanto al suo, e sotto scrivo che stavolta eravamo in due.', bond: 1, trait: { guida: 1 }, then: [['ginepra', 'In due, sì. Guarda che se me lo fai rileggere mi metto a piangere di nuovo, e allora la riga di sotto diventa una bugia.']] },
      { t: 'Incido soltanto una stella, e le dico che il suo segreto con me è al sicuro.', trait: { parola: -1 }, then: [['ginepra', 'Una stella e basta, senza il nome? Sei più misteriosa di Edera. Però ti credo, e non lo dico a tante.']] },
    ], who: 'narra', t: 'Sulla pietra c\'è posto per un altro nome, e Ginepra ti porge il suo coltellino dalla parte del manico.' },
    { say: 'narra', t: 'Sulla via del ritorno si sente un rumore nuovo, e nella galleria bassa c\'è un dito d\'acqua che prima non c\'era: fuori deve essersi messo a piovere forte.' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di qualcosa che comincia o che cresce, l\'acqua sale: si corre per la galleria bassa finché si può. Se parla di qualcosa che si ferma o che finisce, l\'acqua ha finito di salire: si aspetta sul gradino asciutto. Se parla di qualcosa che ritorna, si torna alla pietra e si esce dalla galleria alta.', options: [
      { text: 'Corro per la galleria bassa.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Aspetto sul gradino asciutto.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Torno alla pietra, ed esco dalla galleria alta.', tags: { moto: 'torna' } },
    ] }, who: 'ginepra', t: 'Ortica dice sempre che l\'acqua nelle tane va letta come le carte, e una volta me l\'ha perfino spiegato. Senti qua, e poi pesca in fretta.', right: 'good.water', wrong: 'bad.water' },
  ],
  rooms: {
    'good.mouth': { good: true, lines: [['narra', 'La carta aveva visto giusto. Dalla tana non esce niente di più grosso di un tasso, che vi guarda offeso e se ne va per i fatti suoi.']] },
    'bad.mouth': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Qualcosa di basso e di veloce vi passa fra le gambe soffiando, Ginepra fa un salto che non le avevi mai visto fare, e nel trambusto la tua borsa si rovescia per terra.']], loss: { coins: 2 } },
    'good.gallery': { good: true, lines: [['narra', 'Era la galleria giusta. Scende larga e asciutta, e su una sporgenza trovate un mucchietto di monete vecchie, di quelle con il re sbagliato, che secondo Ginepra al mercato valgono ancora.']], gain: { coins: 4 } },
    'bad.gallery': { good: false, lines: [['narra', 'Non era quella che indicava la carta. La galleria finisce in un cunicolo pieno di pipistrelli, che vi si alzano in faccia tutti insieme, e quando smettete di agitare le braccia avete i capelli pieni di ragnatele e il cuore da un\'altra parte.']] },
    'good.gap': { good: true, lines: [['narra', 'La regola di Ginepra, contro ogni previsione, funziona. Vi ritrovate tutte e due davanti alla pietra, con il fiato grosso e una gran voglia di ridere.']] },
    'bad.gap': { good: false, lines: [['narra', 'Hai fatto il contrario di quello che diceva la regola. Un pezzo di bordo si stacca, Ginepra ti agguanta per il mantello, e restate sedute per terra a ridere di paura mentre qualcosa della tua borsa continua a cadere nel buio.']], loss: { tool: 'any' } },
    'good.water': { good: true, lines: [['narra', 'Avete letto l\'acqua nel modo giusto. Uscite dalla tana con le calze appena umide, sotto una pioggia fitta che in questo momento vi sembra la cosa più bella del mondo.']] },
    'bad.water': { good: false, lines: [['narra', 'Avete letto l\'acqua al contrario. Per un tratto vi arriva alla vita, gelata, e Ginepra con la sua caviglia va tenuta su di peso. Quando finalmente vedete il cielo battete i denti tutte e due, e il tuo borsello galleggia da qualche parte alle vostre spalle.']], loss: { coins: 4 } },
  },
  outcomes: {
    perfect: { lines: [
      ['ginepra', 'Non ci credo. Sei arrivata in fondo e sei tornata senza un graffio, e hai pure trovato la strada al buio mentre io facevo la spiritosa!'],
      ['ginepra', 'Una scommessa è una scommessa: il cappello è tuo, e ti sta meglio che a me, anche se questo non lo ripeterò. Nella fodera ci sono cucite quindici monete, che tenevo per le emergenze, e stanotte direi che lo è stata.'],
    ], reward: { item: 'il cappello di Ginepra', coins: 15, xp: 30, bond: 1 } },
    pass: { lines: [['ginepra', 'In fondo ci siamo arrivate, e siamo anche tornate, che non era scontato. Il cappello me lo tengo ancora un po\', perché qualche spavento l\'abbiamo preso; però da bere stasera pago io.']], reward: { xp: 15, coins: 5 } },
    fail: { lines: [
      ['narra', 'Uscite dalla tana all\'alba, graffiate e fradicie, con Ginepra che si appoggia a te per via della caviglia. Sulla pietra un segno l\'hai lasciato, ma lungo la strada hai seminato mezza borsa.'],
      ['ginepra', 'Te lo dico da amica: in fondo ci sei arrivata, ma per metà della strada ti ci ho portata io, e così la scommessa è mia. Mi devi da bere, e per qualche giorno te lo rinfaccerò, perché là sotto ho avuto paura sul serio.'],
    ], loss: { coins: 8, bond: 1 } },
  },
};
