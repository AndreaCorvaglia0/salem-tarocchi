// The pairs game of the sibyl (notes/sibilla-coppie.md, docs/BACKLOG.md 3.0): two (later three) of her figures,
// an everyday question, and she says what they say together. There is no wrong answer: afterwards the game shows
// how the pair is usually read (the first figure is what it is about, the second gives it its colour) and what
// Ginepra would say. The deck's historical name is never shown.
//
//   PIECES[n]  three short pieces per figure, written from its keywords (src/data/sibyl.js `keys`):
//              noun   what it is about, with its article («una notizia»): the figure as the subject
//              tint   a colour that fits after any noun, never an adjective that must agree («che arriva in fretta»)
//              event  a piece of story, present tense, for «Prima …, poi …» («arriva qualcuno di corsa»)
//   QUESTIONS  everyday questions, put on the table before the cards turn (they frame, they never answer)
//   PAIRS      the finest pairs, by hand, ordered `first>second`: three phrasings, the usual reading, Ginepra's line
//   GINEPRA    her light comments, by what she chose ({a} {b} {c}: the names, «il cavaliere»; {A}: capitalised)
const P = (noun, tint, event) => ({ noun, tint, event });
export const PIECES = {
  1: P('una notizia', 'che arriva in fretta', 'arriva qualcuno di corsa'),
  2: P('un colpo di fortuna', 'che dura poco', 'capita una piccola fortuna'),
  3: P('un viaggio', 'che viene da lontano', 'qualcuno parte'),
  4: P('una faccenda di casa', 'che resta in famiglia', 'si torna a casa'),
  5: P('una crescita lenta', 'che mette radici', 'qualcosa comincia a crescere'),
  6: P('un dubbio', 'che non si vede ancora chiaro', 'il cielo si copre'),
  7: P('un inganno', 'con un tranello sotto', 'qualcuno si mette in mezzo'),
  8: P('una fine', 'che si chiude per sempre', 'qualcosa finisce'),
  9: P('un regalo', 'che fa piacere', 'arriva un invito'),
  10: P('una decisione netta', 'che taglia corto', 'qualcosa si taglia di colpo'),
  11: P('un litigio', 'che si ripete', 'si alzano le voci'),
  12: P('una chiacchiera', 'di cui si parla in giro', 'la gente comincia a parlare'),
  13: P('un inizio', 'appena cominciato', 'comincia una cosa nuova'),
  14: P('un\'astuzia', 'con un po\' di furbizia', 'qualcuno fa il furbo'),
  15: P('una forza', 'che protegge', 'si fa avanti qualcuno di forte'),
  16: P('una speranza', 'che fa da guida', 'si vede la strada'),
  17: P('un cambiamento', 'che cambia le cose', 'qualcosa cambia posto'),
  18: P('un amico fedele', 'di cui ci si può fidare', 'un amico dà una mano'),
  19: P('un\'autorità', 'che dura a lungo', 'decide chi comanda'),
  20: P('una festa', 'davanti a tutti', 'ci si trova in mezzo alla gente'),
  21: P('un ostacolo', 'che costa fatica', 'tutto si ferma per un po\''),
  22: P('una scelta', 'con due strade davanti', 'bisogna scegliere'),
  23: P('una perdita', 'che si consuma piano', 'qualcosa sparisce'),
  24: P('un affetto', 'che viene dal cuore', 'qualcuno si innamora'),
  25: P('una promessa', 'che lega', 'si fa un patto'),
  26: P('un segreto', 'che resta nascosto', 'qualcuno tiene un segreto'),
  27: P('un messaggio', 'per iscritto', 'arriva una lettera'),
  28: P('un uomo', 'che riguarda un uomo', 'un uomo si fa avanti'),
  29: P('una donna', 'che riguarda una donna', 'una donna si fa avanti'),
  30: P('una pace', 'che porta calma', 'torna la calma'),
  31: P('un successo', 'che va a finire bene', 'tutto va per il meglio'),
  32: P('un riconoscimento', 'che porta onore', 'arrivano i complimenti'),
  33: P('una soluzione', 'che apre le porte', 'si trova la chiave'),
  34: P('un affare', 'che porta soldi', 'arrivano dei soldi'),
  35: P('un punto fermo', 'che tiene saldo', 'le cose si sistemano'),
  36: P('un peso', 'che chiede pazienza', 'arriva un peso da portare'),
};

// everyday questions: small things of a village, nobody named she might not know
export const QUESTIONS = [
  { id: 'lettera', t: 'Arriva una lettera?' },
  { id: 'vicino', t: 'Il vicino è sincero?' },
  { id: 'viaggio', t: 'Il viaggio andrà bene?' },
  { id: 'inverno', t: 'Questo inverno sarà lungo?' },
  { id: 'pace', t: 'Faremo pace, dopo la lite?' },
  { id: 'mercato', t: 'Che cosa porterà il mercato di domani?' },
  { id: 'pane', t: 'Il pane basterà fino a sabato?' },
  { id: 'nave', t: 'La nave arriverà prima della neve?' },
  { id: 'segreto', t: 'Qualcuno mi nasconde qualcosa?' },
  { id: 'lavoro', t: 'Il nuovo lavoro fa per me?' },
  { id: 'domani', t: 'Domani sarà una buona giornata?' },
  { id: 'amore', t: 'Mi pensa ancora?' },
  { id: 'soldi', t: 'Riavrò i soldi che ho prestato?' },
  { id: 'casa', t: 'Troverò una casa più grande?' },
  { id: 'gatto', t: 'Dov\'è finito il gatto della vicina?' },
  { id: 'festa', t: 'Vale la pena andare alla festa?' },
];
export const QUESTION = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

// The finest pairs, by hand. `say`: her three phrasings; `trad`: the usual reading (first the subject, second its
// colour); `gin`: what Ginepra sees in it. The pairs of the gifts (src/data/gifts.js) are here, in gift order.
const H = (say, trad, gin) => ({ say, trad, gin });
export const PAIRS = {
  // the gifts
  '27>25': H(['Una promessa messa per iscritto.', 'Qualcuno scrive per chiedere un sì.', 'Un contratto, o una lettera d\'amore.'],
    'Una promessa scritta: un accordo firmato, un contratto.',
    'Separate dicono la metà, te l\'avevo detto! Insieme sono un fidanzamento, oppure l\'affitto della casa.'),
  '26>33': H(['Un segreto che si apre.', 'Si scopre finalmente quello che era nascosto.', 'Studiando si trova la soluzione.'],
    'Un segreto che si svela: quello che era nascosto viene fuori.',
    'Il bottegaio dice che erano un gomitolo, ma a me sembrano proprio un segreto che qualcuno ha voglia di raccontare.'),
  '8>36': H(['Un peso che finisce.', 'Una pena lunga che si chiude.', 'Una fine che costa fatica.'],
    'La fine di un periodo pesante.',
    'Il becchino le teneva in tasca per scherzo, e infatti io ci vedo un sospiro di sollievo, non un funerale.'),
  '31>32': H(['Un successo che porta onore.', 'Tutto va bene, e la gente se ne accorge.', 'Una vittoria con un po\' di fama.'],
    'Successo e riconoscimento: le cose vanno bene e si vede.',
    'Queste sono le mie preferite, cioè, erano le mie: le tenevo per quando sarei diventata famosa.'),
  '18>23': H(['Un amico che perde qualcosa.', 'Qualcuno di fidato che si allontana un po\'.', 'Un amico che difende da chi rosicchia.'],
    'Un\'amicizia che si consuma piano, o un amico in pensiero.',
    'Tartufo dice che il cane e i topi parlano di lui. Io ci vedo un amico con un buco in tasca, ah ah.'),
  '14>15': H(['La furbizia che serve a chi è forte.', 'Qualcuno di potente che fa il furbo.', 'Un lavoro sotto un capo severo.'],
    'Un lavoro con un capo forte, o un\'astuzia che arriva in alto.',
    'La volpe e l\'orso: Tartufo e te. Lui dice che vince la volpe, ma non dirgli che l\'ho detto.'),
  '19>30': H(['Una vecchiaia lunga e tranquilla.', 'Un posto importante, ma in pace.', 'Qualcuno che comanda ed è anche buono.'],
    'Un\'autorità onesta, o anni lunghi e sereni.',
    'Nonna Edera dice che sono carte da vecchie. Io dico che sono carte da gente che si è goduta la vita.'),
  // the others
  '1>27': H(['Una notizia per posta, e in fretta.', 'Qualcuno corre a portare uno scritto.', 'Un messaggio che non si fa aspettare.'],
    'Una notizia che arriva per iscritto, e presto.',
    'Questa è facile: arriva il postino di corsa. Cioè, a Salem il postino non corre mai, quindi è una lettera importante.'),
  '3>34': H(['Un viaggio che fa guadagnare.', 'Soldi che arrivano da lontano.', 'Un affare che passa dal porto.'],
    'Commerci lontani: un guadagno che viene dal viaggio.',
    'Una nave piena di pesci, cioè di soldi. Se parte, io salgo, e tu mi tieni il posto al bivacco.'),
  '4>17': H(['Un trasloco.', 'In casa cambia qualcosa.', 'Arriva qualcuno di nuovo in famiglia.'],
    'Un cambiamento in casa: un trasloco, o una casa rinnovata.',
    'La cicogna sul tetto! Da noi si diceva che porta un fratellino, e io ne ho avuti abbastanza.'),
  '24>25': H(['Un amore che diventa promessa.', 'Un fidanzamento.', 'Un affetto che lega due persone.'],
    'Un impegno d\'amore.',
    'Il cuore e l\'anello, che noia! Cioè, che bello, ma io preferisco quando le figurine litigano un po\'.'),
  '24>36': H(['Un amore che pesa.', 'Un affetto messo alla prova.', 'Una pena di cuore.'],
    'Un amore che fa soffrire, o che chiede pazienza.',
    'Questa la giro in fretta, che mi mette malinconia. Però un amore che pesa vuol dire che c\'è.'),
  '7>18': H(['Un falso amico.', 'Qualcuno di fidato che fa il furbo.', 'Una rivale che sembra un\'amica.'],
    'Un inganno che passa da un amico: un falso amico.',
    'Il serpente prima del cane: qualcuno ti sorride e intanto conta le tue castagne.'),
  '18>7': H(['Un amico da tenere d\'occhio.', 'Un amico che ha un\'altra faccia.', 'Un amico fedele, ma con una rivale vicino.'],
    'Un amico che nasconde qualcosa.',
    'Il cane prima del serpente è un amico che ti vuole bene ma ha un segreto. Come tutti, no?'),
  '33>4': H(['La soluzione è in casa.', 'Una porta di casa che si riapre.', 'Una casa tutta per sé, finalmente.'],
    'Una soluzione che riguarda la casa.',
    'La chiave di casa! Io la mia l\'ho persa due volte, e la seconda era nel guanto.'),
  '21>16': H(['Un ostacolo, ma si vede già la strada.', 'Una fatica che vale la pena.', 'In alto, dove si vedono le stelle.'],
    'Un ostacolo che si supera con una guida.',
    'Una montagna con le stelle sopra: si sale, si fatica, e poi si guarda giù e si ride.'),
  '22>1': H(['Una scelta da fare in fretta.', 'Una notizia che obbliga a decidere.', 'Arriva qualcuno, e bisogna scegliere.'],
    'Una scelta che va fatta presto.',
    'Il bivio e il cavaliere: decidi subito, che tanto poi cambi idea lo stesso. Io faccio sempre così.'),
  '9>20': H(['Un invito a una festa.', 'Una bella sorpresa davanti a tutti.', 'Fiori per tutti quanti.'],
    'Un invito: una festa con tanta gente.',
    'Una festa! Se c\'è da ballare ci vado io, se c\'è da cucinare ci mandiamo Malva.'),
  '6>31': H(['La confusione passa.', 'Dopo il dubbio, una bella giornata.', 'Il sole dietro le nuvole.'],
    'Un dubbio che si risolve bene.',
    'Prima le nuvole e poi il sole, come a Salem una volta l\'anno. Cioè, due, se siamo fortunate.'),
  '2>34': H(['Un piccolo guadagno.', 'Una fortuna che porta qualche moneta.', 'Un affare fortunato, ma breve.'],
    'Un piccolo guadagno che non ci si aspettava.',
    'Il trifoglio con i pesci: qualche moneta trovata per terra. Il trifoglio vero, io, non l\'ho mai trovato.'),
  '13>5': H(['Un inizio che metterà radici.', 'Qualcosa di piccolo che crescerà piano.', 'Un bambino sano e forte.'],
    'Un inizio che cresce piano e bene.',
    'Un bambino e un albero: Ortica direbbe di piantarli tutti e due e di annaffiarli il giovedì.'),
  '23>34': H(['Soldi che se ne vanno.', 'Un affare che si consuma piano piano.', 'Qualcuno che ruba dalla cassa.'],
    'Una perdita di soldi.',
    'I topi nella cassa del bottegaio! Non è carino ridere, ma un pochino rido.'),
  '29>24': H(['Una donna innamorata.', 'Una donna dal cuore buono.', 'Una donna che pensa a qualcuno.'],
    'Una donna che ama.',
    'Una donna col cuore in mano. Non guardare me, io il cuore lo tengo nel guanto.'),
  '28>14': H(['Un uomo furbo.', 'Un uomo che lavora sodo.', 'Un uomo da cui stare in guardia.'],
    'Un uomo astuto, o un uomo al lavoro.',
    'Un uomo con la volpe: il bottegaio quando fa i prezzi, ah ah.'),
  '35>3': H(['Un viaggio che finisce in porto.', 'Fermarsi, dopo tanto viaggiare.', 'Restare, anche se si vorrebbe partire.'],
    'Un arrivo in porto, o un lavoro stabile lontano da casa.',
    'L\'ancora prima della nave vuol dire che resti. Io però la nave la guarderei lo stesso, da lontano.'),
  '30>35': H(['Una pace che dura.', 'Una vita tranquilla e salda.', 'Finalmente un po\' di calma.'],
    'Una pace stabile, che resta.',
    'Una pace che dura: a me verrebbe da sbadigliare, ma lo so che a qualcuno piace.'),
  '12>27': H(['Chiacchiere messe per iscritto.', 'Una lettera di cui parlano tutti.', 'Due che si scrivono spesso.'],
    'Una corrispondenza: due che si scrivono.',
    'Gli uccelli e la lettera: qualcuno scrive, e tutto il mercato sa già che cosa c\'è scritto.'),
};

// Ginepra's comments, by what she chose. Light, never a verdict: she reacts, laughs, invents a rule, talks of
// herself. `mix`: the first coloured by the second; `flip`: the other way round; `story`: before and after;
// `own`: her own words; `centre` and `three3`: the three-card phrasings; `any`: always fits.
export const GINEPRA = {
  mix: [
    'Hai fatto parlare prima {a} e poi {b}, come fa l\'ambulante quando ha voglia di chiacchierare.',
    '{A} con {b} vicino sembra un\'altra figurina. Da sola, giuro, non diceva niente.',
  ],
  flip: [
    'L\'hai letta al contrario, {b} prima di {a}, e secondo me funziona lo stesso. Io le leggo come mi gira.',
    'Tu hai guardato prima {b}. Anch\'io guardo sempre prima quella che ha più colori.',
  ],
  story: [
    'Una storia con il prima e il poi! Se la racconti al mercato, qualcuno ti offre una castagna.',
    'Prima e poi: così sembra una favola. Io la finirei con un drago, ma va bene anche così.',
  ],
  own: [
    'Questa non me l\'aspettavo, e mi piace. Me la ricordo, cioè, ci provo.',
    'L\'hai detta con parole tue, e adesso la vedo anch\'io. Prima ci vedevo solo le castagne.',
    'Ecco, questa la scriverei sul retro della figurina, se non fosse che la carta costa.',
  ],
  centre: [
    'Hai guardato quella di mezzo. Io invece guardo sempre l\'ultima, perché è quella che resta in mano.',
  ],
  three3: [
    'Tre figurine e una storia intera! Io con tre mi perdo sempre alla seconda.',
  ],
  any: [
    '{A} e {b}? Io ci avrei visto le castagne, ma io ci vedo sempre le castagne. Ah ah!',
    'Facciamo una regola nuova: chi vede la cosa più strana sceglie la prossima coppia. Ho vinto io, ovviamente.',
    'Malva direbbe che è roba da fiera. Io dico che alla fiera ci si diverte, e infatti ci vado.',
    'Una figurina da sola dice poco, ma {a} con {b} accanto sembra che si parlino.',
  ],
};
