// The people who knock at the cottage when the story has no one to send: the parts the generator
// (src/reading/clients.js) puts together. Plain, warm Italian (docs/WRITING.md); an imaginary old New
// England village told in Italian, so no modern trades. Funny by situation, never by mocking the person.
//
// Slots in the strings (filled by the generator):
//   {x}              a filler from the template's own `x` list (a noun phrase with its article)
//   {chi}            someone of the family (CHI_CASA), {vicino} someone of the village (CHI_ALTRI)
//   {amato}          the person the client is fond of (AMATO, by the client's gender), {sposo} the spouse
//   {gli} {lo} {lui} pronouns for {amato} / {sposo}; {o} the client's ending (o / a: stanco, stanca)
//   {quando}         a time (QUANDO by tier)
//   {di:x} {a:x} {da:x} {su:x} {in:x} {con:x}  the slot after a preposition, with the article joined
// Fillers are written as the client says them (mio, mia); `di` (the detail the Reader picks up after
// «Mi chiedi ...») is written as she says it back (tuo, tua): the generator turns the fillers round.

export const NAMES = {
  f: ['Abigail', 'Hannah', 'Rebecca', 'Sarah', 'Ruth', 'Marta', 'Bethia', 'Liberata', 'Pazienza', 'Grazia', 'Carità', 'Speranza',
    'Temperanza', 'Ester', 'Giuditta', 'Susanna', 'Dorcas', 'Tabita', 'Lidia', 'Priscilla', 'Rachele', 'Agnese', 'Dorotea', 'Mehitabel'],
  m: ['Ezechiele', 'Giosia', 'Abramo', 'Gedeone', 'Caleb', 'Gionata', 'Nataniele', 'Samuele', 'Giacobbe', 'Isacco', 'Amos', 'Zaccaria',
    'Ebenezer', 'Abdia', 'Ezra', 'Giosuè', 'Tommaso', 'Benoni', 'Seth', 'Enoc', 'Mosè', 'Barnaba', 'Asa'],
};

// Trades and ties to the village. f / m: the form for a woman / a man (one may be missing). tiers: where
// they appear (0 poor people, 1 ordinary folk, 2 people who come from far or count for something).
export const TIES = [
  { id: 'oche', f: 'la guardiana delle oche', m: 'il guardiano delle oche', tiers: [0], look: 'un bastone lungo, una piuma bianca sul cappello' },
  { id: 'lavandaia', f: 'la lavandaia', tiers: [0], look: "mani rosse di acqua fredda, le maniche rimboccate" },
  { id: 'spazzacamino', m: 'lo spazzacamino', tiers: [0], look: 'la faccia nera di fuliggine, tranne la punta del naso' },
  { id: 'carbonaio', f: 'la carbonaia', m: 'il carbonaio', tiers: [0], look: 'odore di fumo e di legna bruciata' },
  { id: 'porcaro', f: 'la porcara', m: 'il porcaro', tiers: [0], look: 'stivali infangati fino al ginocchio' },
  { id: 'filatrice', f: 'la filatrice', tiers: [0, 1], look: 'un fuso infilato nella cintura' },
  { id: 'fascine', f: 'la raccoglitrice di fascine', m: 'il raccoglitore di fascine', tiers: [0], look: 'una fascina di rami sotto il braccio' },
  { id: 'acquaiolo', f: "l'acquaiola", m: "l'acquaiolo", tiers: [0], look: 'due secchi vuoti appesi a un bastone' },
  { id: 'lattaia', f: 'la lattaia', m: 'il lattaio', tiers: [0], look: 'un secchio di latta che sa ancora di latte' },
  { id: 'garzone', f: 'la sguattera della locanda', m: 'il garzone della locanda', tiers: [0], look: 'un grembiule pieno di macchie' },
  { id: 'ciabattino', m: 'il ciabattino', tiers: [0, 1], look: 'le dita nere di pece, un chiodino tra i denti' },
  { id: 'uova', f: 'la venditrice di uova', m: 'il venditore di uova', tiers: [0], look: 'un cesto con un po\' di paglia sul fondo' },
  { id: 'talpe', f: "l'acchiappatalpe", m: "l'acchiappatalpe", tiers: [0], look: 'un sacchetto che ogni tanto si muove' },
  { id: 'fornaio', f: 'la fornaia', m: 'il fornaio', tiers: [1], look: 'farina sulle ciglia e sulle scarpe' },
  { id: 'fabbro', f: 'la moglie del fabbro', m: 'il fabbro', tiers: [1], look: 'braccia forti, un segno di bruciatura sul polso' },
  { id: 'tessitore', f: 'la tessitrice', m: 'il tessitore', tiers: [1], look: 'fili di lana colorata attaccati al mantello' },
  { id: 'falegname', m: 'il falegname', tiers: [1], look: 'trucioli tra i capelli, una matita dietro l\'orecchio' },
  { id: 'bottaio', f: 'la moglie del bottaio', m: 'il bottaio', tiers: [1], look: 'un cerchio di ferro appeso alla spalla' },
  { id: 'locanda', f: 'la locandiera', m: 'il locandiere', tiers: [1], look: 'un mazzo di chiavi alla cintura, odore di stufato' },
  { id: 'pescatore', f: 'la moglie del pescatore', m: 'il pescatore', tiers: [1], look: 'mani screpolate dal sale, un berretto di lana' },
  { id: 'maniscalco', m: 'il maniscalco', tiers: [1], look: 'un grembiule di cuoio, un ferro di cavallo in tasca' },
  { id: 'merletti', f: 'la merlettaia', tiers: [1], look: 'occhi stanchi, dita sottili e svelte' },
  { id: 'candele', f: 'la candelaia', m: 'il candelaio', tiers: [1], look: 'gocce di cera sulle maniche' },
  { id: 'sarto', f: 'la sarta', m: 'il sarto', tiers: [1], look: 'un puntaspilli legato al polso' },
  { id: 'sagrestano', f: 'la sorella del sagrestano', m: 'il sagrestano', tiers: [1], look: 'un vestito scuro e molto pulito, lo sguardo basso' },
  { id: 'maestra', f: 'la maestra dei piccoli', m: 'il maestro di scuola', tiers: [1], look: 'un libro sotto il braccio, gli occhiali sul naso' },
  { id: 'carrettiere', m: 'il carrettiere', tiers: [1], look: 'una frusta arrotolata, la voce rauca' },
  { id: 'ascia', m: "il maestro d'ascia del cantiere", tiers: [1, 2], look: 'odore di pece e di legno fresco' },
  { id: 'mercante', f: 'la moglie del mercante di Boston', m: 'il mercante di Boston', tiers: [2], look: 'un mantello di panno buono, guanti puliti' },
  { id: 'capitano', f: 'la vedova di un capitano', m: 'il capitano di un mercantile', tiers: [2], look: 'un cappotto blu con i bottoni d\'ottone' },
  { id: 'notaio', m: 'il notaio di Ipswich', tiers: [2], look: 'una borsa di cuoio piena di carte' },
  { id: 'tenuta', f: 'la padrona della tenuta sul fiume', m: 'il padrone della tenuta sul fiume', tiers: [2], look: 'stivali da cavallo, un anello con lo stemma' },
  { id: 'armatore', f: "la figlia dell'armatore", m: "l'armatore del porto", tiers: [2], look: 'una spilla d\'argento a forma di nave' },
  { id: 'predicatore', m: 'il predicatore di passaggio', tiers: [2], look: 'abito nero impolverato dal viaggio, una Bibbia consumata' },
  { id: 'magistrato', f: 'la moglie del magistrato', m: 'il segretario del governatore', tiers: [2], look: 'un colletto di pizzo, il cappuccio tirato sugli occhi' },
  { id: 'pellicce', f: 'la vedova del mercante di pellicce', m: 'il mercante di pellicce', tiers: [2], look: 'un collo di volpe, mani inanellate' },
];

// The people a question may name (first person, as the client says them).
export const CHI_CASA = ['mia sorella', 'mio fratello', 'mia madre', 'mio padre', 'mia suocera', 'mio cognato', 'mia cognata', 'mia figlia', 'mio zio', 'mia nonna'];
export const CHI_ALTRI = ['la vicina di casa', 'il vicino di casa', 'il mugnaio', 'la locandiera', 'il fabbro', 'la moglie del sagrestano', 'il bottaio', 'la tessitrice', 'il carrettiere'];
// the person the client is fond of: f = the client is a woman
export const AMATO = {
  f: ['il figlio del fabbro', 'il garzone del fornaio', 'il nipote della locandiera', 'il pecoraio della collina', 'il figlio del bottaio', 'un marinaio che ho conosciuto al porto'],
  m: ['la figlia del fabbro', 'la nipote della locandiera', 'la ragazza che vende le uova', 'la tessitrice nuova', 'la cugina del mugnaio', 'la figlia del pescatore'],
};
export const SPOSO = { f: 'mio marito', m: 'mia moglie' };
export const QUANDO = {
  0: ['per la fiera', 'prima di domenica', 'entro la luna nuova', 'prima che arrivi la neve'],
  1: ['prima del raccolto', 'entro la primavera', 'prima della semina', "entro la fine dell'inverno"],
  2: ['prima che riparta la nave', "entro l'estate", 'prima della sessione del tribunale', "entro la fine dell'anno"],
};

// t: tiers, s: the situation (said after the greeting), q: the question, di: the detail she picks up;
// ties / notTies (optional): the trades a situation fits (then the tier does not limit the trade) or does not fit.
const T = (t, s, q, di, more = {}) => ({ t, s, q, di, ...more });

export const TEMPLATES = {
  'amore.sino': [
    T([0], 'Alla fiera ho ballato due volte con {amato}, e la seconda volta mi ha pestato un piede senza nemmeno chiedere scusa.', 'Secondo te {gli} piaccio?', '{di:amato}'),
    T([0], 'Ho lasciato una mela sul davanzale {di:amato}, e la mattina dopo la mela non c\'era più.', 'Vuol dire che anche {lui} pensa a me?', '{di:amato}'),
    T([1], '{sposo} da qualche settimana torna a casa tardi e dice che è colpa del lavoro.', 'Posso fidarmi di quello che mi dice?', '{di:sposo}'),
    T([1, 2], 'In casa vogliono che sposi {amato}, e dicono tutti che è un buon partito.', 'È la persona giusta per me?', '{di:amato}'),
    T([2], 'Le nostre famiglie hanno combinato un matrimonio con una casa importante di Boston, e io non ho mai visto in faccia la persona che dovrei sposare.', 'Potrò essere felice in quel matrimonio?', 'del matrimonio combinato a Boston'),
  ],
  'amore.scelta': [
    T([0], 'Al ballo del granaio mi hanno invitat{o} in due, e tutte e due le volte ho detto di sì senza pensarci.', 'Con chi dei due ci vado, al ballo?', 'del ballo del granaio'),
    T([0], 'Ho fatto scrivere un biglietto per {amato} da mio cugino, perché io scrivo male, solo che mio cugino ride sempre.', 'Glielo do lo stesso, o lo butto nel fuoco?', 'del biglietto per {amato}'),
    T([1], 'Da due anni aspetto che {amato} si decida, e intanto c\'è chi mi ha chiesto di passeggiare insieme la domenica.', 'Continuo ad aspettare, o comincio a guardarmi intorno?', '{di:amato}'),
    T([1, 2], '{sposo} vuole che lasciamo il villaggio per andare a vivere vicino al porto, dove ha trovato lavoro.', 'Devo andare con {lui}, o restare qui dove ho la mia gente?', 'della partenza per il porto'),
    T([2], 'Due famiglie importanti mi hanno fatto sapere che vorrebbero imparentarsi con la mia, e tutte e due hanno terre e navi.', 'Quale delle due proposte devo accettare?', 'delle due proposte di matrimonio'),
  ],
  'amore.andra': [
    T([0], 'Domenica voglio regalare {a:amato} un fazzoletto ricamato da me, anche se i fiori sembrano cavoli.', 'Come andrà, quando glielo do?', 'del fazzoletto ricamato'),
    T([0, 1], 'Ho litigato con {amato} per una sciocchezza, una storia di castagne, e da allora non ci salutiamo più.', 'Come andrà a finire tra noi due?', '{di:amato}'),
    T([1], '{sposo} e io siamo sposati da dieci anni, e ultimamente parliamo soltanto di soldi e di legna da tagliare.', 'Come andrà il nostro matrimonio, da qui in avanti?', 'del tuo matrimonio'),
    T([1, 2], 'La persona che amo si è imbarcata per le isole, e mi ha promesso che tornerà {quando}.', 'Come andrà, mentre siamo lontani?', 'della persona che ami'),
    T([2], 'La mia famiglia ha chiesto un matrimonio con una casa di rango più alto della nostra, e da quella casa hanno risposto che ci penseranno.', 'Come andrà questa richiesta?', 'della richiesta di matrimonio'),
  ],
  'amore.perche': [
    T([0], 'Ogni volta che passo davanti {a:amato} mi cade qualcosa: il secchio, il cesto, una volta perfino una gallina.', 'Perché divento così goff{o} proprio davanti a {lui}?', '{di:amato}'),
    T([0, 1], '{amato} mi sorrideva sempre al pozzo, e da una settimana guarda da un\'altra parte.', 'Perché è cambiato tutto così, senza una parola?', '{di:amato}'),
    T([1], 'Con {sposo} litighiamo sempre per le stesse cose, e dopo ci vergogniamo tutti e due.', 'Perché non riusciamo a smettere?', '{di:sposo}'),
    T([1, 2], 'Mi hanno lasciat{o} prima del matrimonio, quando il vestito era già cucito.', 'Perché è finita in quel modo?', 'del matrimonio saltato'),
    T([2], 'Ho avuto molte proposte da gente di Boston e di Salem, e le ho rifiutate tutte senza sapere bene il motivo.', 'Perché non riesco a dire di sì a nessuno?', 'delle proposte che hai rifiutato'),
  ],
  'amore.fare': [
    T([0], '{amato} non sa nemmeno come mi chiamo, anche se passo davanti alla sua porta tutti i giorni.', 'Che cosa posso fare perché si accorga di me?', '{di:amato}'),
    T([0], 'Ho promesso {a:amato} una torta di mirtilli, ma i mirtilli se li è mangiati la capra.', 'Che cosa faccio adesso, che la torta non c\'è?', 'della torta di mirtilli'),
    T([1], 'In casa con {sposo} c\'è un silenzio che pesa, e nessuno dei due sa più come cominciare a parlare.', 'Che cosa posso fare per ritrovare un po\' di calore tra noi?', '{di:sposo}'),
    T([1, 2], 'Voglio bene a una persona che la mia famiglia non approva, perché viene da un villaggio con cui siamo in lite da sempre.', 'Che cosa devo fare?', 'della persona che la tua famiglia non approva'),
    T([2], 'Il mio matrimonio l\'hanno combinato le nostre famiglie, e dopo cinque anni siamo ancora due estranei sotto lo stesso tetto.', 'Che cosa posso fare per cambiare le cose?', 'del tuo matrimonio'),
  ],
  'amore.quadro': [
    T([0], 'Ho quasi vent\'anni e non mi ha mai guardat{o} nessuno, a parte il caprone del vicino, che però guarda tutti.', 'Che cosa vedi nel mio futuro, in amore?', "dell'amore"),
    T([0, 1], 'Non ho una domanda precisa, perché in amore mi sembra di girare sempre in tondo come l\'asino del mulino.', 'Mi dici tu che cosa vedi?', "dell'amore"),
    T([1], 'Sono vedov{o} da tre anni, e qualcuno in paese comincia a dire che sarebbe ora di risposarsi.', 'Che cosa vedi per me, in amore?', 'di un nuovo amore'),
    T([1, 2], 'Con {sposo} va tutto bene, credo, ma vorrei sentirlo dire da qualcuno che vede più lontano di me.', 'Come vedi il nostro matrimonio?', '{di:sposo}'),
    T([2], 'Sono venut{o} da Boston apposta, perché lì nessuno deve sapere che parlo di queste cose con chi legge le carte.', 'Che cosa vedi nel mio cuore, adesso?', 'del tuo cuore'),
  ],
  'lavoro.sino': [
    T([0], 'Domani porto le uova al mercato, e l\'ultima volta me ne sono rimaste in mano più di metà.', 'Riuscirò a venderle tutte, questa volta?', 'delle uova da vendere', { ties: ['uova', 'lattaia', 'oche', 'fascine', 'porcaro'] }),
    T([0], 'Il padrone della locanda mi deve ancora la paga di tre settimane, e ogni volta mi dice di ripassare domani.', 'Me la darà, prima o poi?', 'della paga della locanda', { ties: ['garzone', 'acquaiolo', 'lavandaia', 'spazzacamino'] }),
    T([1], 'Ho chiesto dei soldi in prestito {a:x} per allargare la bottega, e devo restituirli {quando}.', 'Ce la farò a ridarli in tempo?', 'del debito {con:x}', { x: ['il mugnaio', 'il cognato del pastore', 'il mercante del porto', 'la locandiera'] }),
    T([1], 'Mi hanno offerto di lavorare per {x}, con una paga migliore di quella che ho adesso.', 'Mi conviene accettare?', 'del lavoro per {x}', { x: ['il mercante di pellicce', "l'armatore del porto", 'la padrona della tenuta sul fiume'] }),
    T([2], 'Ho messo quasi tutto quello che ho in un carico di melassa che arriva dalle isole {quando}.', 'La nave arriverà in porto sana e salva?', 'del carico dalle isole', { ties: ['mercante', 'capitano', 'armatore', 'pellicce', 'tenuta'] }),
  ],
  'lavoro.scelta': [
    T([0], 'Il fornaio mi offre di lavorare da lui all\'alba e la lavandaia di pomeriggio, e io di mattina dormo volentieri.', 'Quale dei due lavori devo prendere?', 'dei due lavori', { ties: ['oche', 'spazzacamino', 'carbonaio', 'porcaro', 'fascine', 'acquaiolo', 'uova', 'talpe', 'garzone'] }),
    T([0], 'Ho {x} da vendere e due compratori: uno paga subito ma poco, l\'altro paga di più ma soltanto a primavera.', 'Con chi faccio l\'affare?', '{di:x}', { x: ['una capra che morde', 'un maiale molto affezionato a me', 'tre galline che fanno le uova quando vogliono loro'] }),
    T([1], 'Mio padre vuole che continui il suo mestiere, ma io vorrei imparare quello {di:x}.', 'Devo restare nella bottega di famiglia, o cambiare strada?', 'del mestiere di famiglia', { x: ['il falegname', "il maestro d'ascia del cantiere", 'la merlettaia', 'il cordaio'] }),
    T([1, 2], 'Posso aprire una bottega mia qui al villaggio, oppure andare a lavorare al porto per qualcuno più grande di me.', 'Quale strada è la migliore, per il mio lavoro?', 'della bottega'),
    T([2], 'Mi propongono di entrare come socio in {x}, ma dovrei metterci la metà di quello che possiedo.', 'Accetto, o tengo i miei soldi dove sono?', 'della società che ti propongono', { ties: ['mercante', 'capitano', 'armatore', 'pellicce', 'tenuta'], x: ['una nave che commercia con le isole', 'una segheria sul fiume', 'un magazzino al porto di Boston'] }),
  ],
  'lavoro.andra': [
    T([0], 'Per la fiera ho preparato cento mazzetti di lavanda, solo che li ho lasciati vicino al camino e adesso profumano di fumo.', 'Come andrà la vendita, alla fiera?', 'della lavanda per la fiera'),
    T([0, 1], 'Domani comincio a lavorare {da:x}, e mi hanno già detto che non sorride mai.', 'Come mi andrà, nel lavoro nuovo?', 'del lavoro nuovo {da:x}', { x: ['il fabbro', 'il bottaio', 'la locandiera', 'il mugnaio'] }),
    T([1], 'Quest\'anno ho seminato {x} per la prima volta, e tutti al villaggio mi dicono che è una follia.', 'Come andrà il raccolto?', '{di:x}', { x: ['il granturco nel campo basso', 'la segale vicino al fiume', "le zucche dove c'era il fieno"] }),
    T([1, 2], 'Ho preso in affitto una bottega sulla strada del porto, e il primo mese è passato senza un cliente.', 'Come andranno gli affari nei prossimi mesi?', 'della bottega sulla strada del porto'),
    T([2], 'Il governatore mi ha affidato la riscossione delle tasse in tre villaggi, e la gente già mi guarda storto.', 'Come andrà questo incarico?', "dell'incarico del governatore", { ties: ['notaio', 'magistrato', 'tenuta', 'mercante'] }),
  ],
  'lavoro.perche': [
    T([0], 'Da quando porto l\'acqua per la locanda il secchio mi cade nel pozzo almeno una volta al giorno, e tutti ridono.', 'Perché succede proprio a me?', 'del pozzo', { ties: ['acquaiolo', 'garzone', 'lavandaia'] }),
    T([0, 1], 'Il mio pane non lievita più come prima, e io faccio tutto come mi ha insegnato mia nonna.', 'Perché va così male?', 'del pane', { ties: ['fornaio'] }),
    T([1], 'Lavoro più di tutti {in:x}, eppure i soldi a fine mese non bastano mai.', 'Perché non riesco a mettere da parte niente?', 'dei soldi che non bastano', { x: ['la bottega', 'il cantiere', 'la locanda', 'il mulino'] }),
    T([1, 2], '{x} mi ha tolto il lavoro da un giorno all\'altro, senza darmi una ragione.', 'Perché l\'ha fatto?', 'del lavoro che hai perso', { x: ['il padrone del cantiere', 'la padrona della tenuta', 'il mercante per cui lavoravo'] }),
    T([2], 'Quest\'anno tre navi su quattro sono tornate a mani vuote, e i miei soci cominciano a guardarmi come se fosse colpa mia.', 'Perché gli affari mi vanno così storti?', 'delle navi tornate vuote', { ties: ['mercante', 'capitano', 'armatore', 'pellicce', 'tenuta'] }),
  ],
  'lavoro.fare': [
    T([0], 'Ho rotto la brocca buona della padrona, e l\'ho nascosta sotto la paglia della stalla.', 'Che cosa faccio, adesso, prima che se ne accorga?', 'della brocca rotta', { ties: ['garzone', 'lavandaia', 'acquaiolo', 'lattaia', 'oche'] }),
    T([0], 'Mi pagano in uova invece che in monete, e ormai in casa ho più uova che piatti.', 'Che cosa posso fare per farmi pagare come si deve?', 'della paga in uova'),
    T([1], 'Devo una somma {a:x}, e devo ridargliela {quando}, ma non so ancora dove trovarla.', 'Che cosa posso fare per pagare il debito?', 'del debito {con:x}', { x: ['il mugnaio', 'il fabbro', 'la locandiera', 'il mercante del porto'] }),
    T([1, 2], 'In bottega c\'è un garzone che lavora poco e ruba un po\', ma è il nipote {di:sposo}.', 'Che cosa devo fare con lui?', 'del garzone'),
    T([2], 'Un concorrente di Boston sta abbassando i prezzi per rovinarmi, e i clienti cominciano ad andare da lui.', 'Che cosa devo fare per non perdere quello che ho costruito?', 'del concorrente di Boston', { ties: ['mercante', 'pellicce', 'armatore', 'tenuta'] }),
  ],
  'lavoro.quadro': [
    T([0], 'Faccio un po\' di tutto: porto l\'acqua, spenno le galline, e una volta ho perfino tosato una pecora, anche se lei non era d\'accordo.', 'Che cosa vedi per il mio lavoro?', 'del tuo lavoro'),
    T([0, 1], 'Non ho una domanda precisa sul lavoro, ho soltanto la sensazione di essere sempre allo stesso punto e vorrei cambiare {quando}.', 'Che cosa vedi, se guardi i miei affari?', 'dei tuoi affari'),
    T([1], 'Sono vent\'anni che faccio questo mestiere per tutto il villaggio, e mi piacerebbe sapere che cosa mi aspetta nei prossimi.', 'Come vedi il mio lavoro, da qui in avanti?', 'del tuo mestiere'),
    T([1, 2], 'Mi sono appena mess{o} in proprio, e in casa nessuno ci crede tranne me.', 'Che cosa vedi per questo inizio?', 'del lavoro in proprio'),
    T([2], 'Ho terre, due navi e un magazzino a Boston, e ultimamente non riesco a capire dove vada a finire tutto.', 'Come vedi le mie cose, nel loro insieme?', 'dei tuoi affari', { ties: ['mercante', 'capitano', 'armatore', 'pellicce', 'tenuta'] }),
  ],
  'casa.sino': [
    T([0], 'Per la festa del raccolto devo portare il pane, e il mio forno ultimamente fa quello che vuole.', 'Il pane lieviterà, per la festa?', 'del pane per la festa'),
    T([0], 'Il gatto di casa è sparito da tre giorni, e mia madre dice che è scappato con una gatta del porto.', 'Tornerà a casa?', 'del gatto di casa'),
    T([1], '{chi} non mi parla più da quando abbiamo diviso la casa del nonno.', 'Faremo pace, prima o poi?', '{di:chi}'),
    T([1, 2], 'Vorremmo allargare la casa prima che arrivi il secondo bambino, ma il tetto è vecchio e i soldi sono pochi.', 'È il momento giusto per farlo?', 'della casa da allargare'),
    T([2], 'Mio padre deve fare testamento {quando}, e tra noi figli c\'è già aria di tempesta.', 'La casa di famiglia resterà a me?', "dell'eredità di famiglia"),
  ],
  'casa.scelta': [
    T([0], 'In casa siamo in sette e il letto è uno solo, e mio fratello di notte scalcia come un mulo.', 'Vado a dormire nella stalla con la mucca, o resisto ancora?', 'del letto in comune'),
    T([0], 'La vicina mi ha regalato un maialino, e mia madre dice che o se ne va lui o se ne va lei.', 'Lo tengo, o lo restituisco?', 'del maialino'),
    T([1], '{chi} vorrebbe venire a vivere da noi, e la casa è già piccola così.', 'Devo dire di sì?', '{di:chi}'),
    T([1, 2], 'Possiamo restare nella casa dei miei genitori, che è vecchia ma è nostra, oppure prenderne una nuova vicino al porto.', 'Che cosa conviene alla mia famiglia?', 'della casa'),
    T([2], 'Devo decidere se mandare mio figlio a studiare a Cambridge o tenerlo qui a mandare avanti la tenuta.', 'Quale strada è giusta per lui?', 'di tuo figlio', { ties: ['tenuta', 'mercante', 'armatore', 'pellicce', 'notaio', 'magistrato'] }),
  ],
  'casa.andra': [
    T([0], 'Domani viene a pranzo la suocera per la prima volta, e io so cucinare soltanto la zuppa di rape.', 'Come andrà la visita?', 'della visita della suocera'),
    T([0, 1], 'Abbiamo preso una capra per avere il latte, ma per adesso ci ha dato soltanto pensieri.', 'Come andrà con questa capra?', 'della capra'),
    T([1], '{chi} si sposa {quando}, e in famiglia non siamo d\'accordo su niente, nemmeno sul colore della tovaglia.', 'Come andranno i preparativi?', 'del matrimonio {di:chi}'),
    T([1, 2], 'Stiamo per traslocare in una casa più grande, dall\'altra parte del fiume.', 'Come andrà, nella casa nuova?', 'della casa nuova'),
    T([2], 'Le famiglie dei miei due figli sposati non si sopportano, e il mese prossimo devono sedersi tutte alla mia tavola.', 'Come andrà quella cena?', 'della cena di famiglia'),
  ],
  'casa.perche': [
    T([0], 'In casa nostra {x} va a male in una notte, e mia nonna dà la colpa al gatto nero dei vicini.', 'Perché succede?', '{di:x}', { x: ['il latte', 'il burro', 'la panna'] }),
    T([0, 1], 'Mio fratello piccolo da un mese non vuole più dormire al buio, e prima non aveva paura di niente.', 'Perché ha cominciato ad avere paura?', 'di tuo fratello'),
    T([1], '{chi} si arrabbia per ogni cosa che dico, anche quando dico buongiorno.', 'Perché ce l\'ha tanto con me?', '{di:chi}'),
    T([1, 2], 'In famiglia ci siamo allontanati poco alla volta, e adesso ci vediamo soltanto la domenica alla casa delle adunanze.', 'Perché è successo?', 'della tua famiglia'),
    T([2], 'Mio figlio maggiore ha lasciato la casa e la tenuta senza dire una parola, e adesso vive a Boston.', 'Perché se n\'è andato così?', 'di tuo figlio', { ties: ['tenuta', 'mercante', 'armatore', 'pellicce', 'notaio', 'magistrato'] }),
  ],
  'casa.fare': [
    T([0], 'Il tetto della stalla perde, e ogni volta che piove la mucca mi guarda come se fosse colpa mia.', 'Che cosa faccio, prima della prossima pioggia?', 'del tetto della stalla'),
    T([0], 'Mia sorella piccola mi segue dappertutto, al pozzo e al mercato, e domenica si è nascosta perfino sotto la mia panca.', 'Che cosa posso fare per avere un po\' di pace?', 'di tua sorella'),
    T([1], '{chi} non riesce più a lavorare come prima, e tocca a me mandare avanti la casa da sol{o}.', 'Che cosa posso fare per non crollare?', 'della casa da mandare avanti'),
    T([1, 2], 'Mio figlio vuole partire per mare, e io farei di tutto per tenerlo a casa.', 'Che cosa devo fare?', 'di tuo figlio'),
    T([2], 'Devo dividere la tenuta tra i miei tre figli, e qualunque cosa farò uno dei tre si offenderà.', 'Che cosa posso fare per essere giust{o} con tutti?', 'della tenuta da dividere', { ties: ['tenuta', 'mercante', 'armatore', 'pellicce', 'notaio', 'magistrato'] }),
  ],
  'casa.quadro': [
    T([0], 'In casa siamo in tanti, abbiamo poco e litighiamo per la coperta, ma ci vogliamo bene.', 'Che cosa vedi per la mia famiglia?', 'della tua famiglia'),
    T([0, 1], 'Mi sono appena trasferit{o} nella casa vecchia {x}, quella dove nessuno voleva andare.', 'Che cosa vedi in quella casa?', 'della casa {x}', { x: ['vicino al ponte', 'in fondo al vicolo', 'dietro il mulino', 'sulla collina'] }),
    T([1], 'Non ho una domanda precisa, ma in casa negli ultimi tempi c\'è un\'aria strana, come prima di un temporale.', 'Che cosa vedi sotto il mio tetto?', 'della tua casa'),
    T([1, 2], 'La mia famiglia sta cambiando, perché i figli crescono e i vecchi rallentano, e io sto in mezzo.', 'Come vedi la mia casa, in questo momento?', 'della tua casa'),
    T([2], 'Sono venut{o} da lontano per parlare della mia famiglia, perché a casa mia non posso farlo con nessuno.', 'Che cosa vedi nella mia casa?', 'della tua famiglia'),
  ],
  'altri.sino': [
    T([0], 'Il recinto {di:vicino} è finito sul mio orto, e dice che è stato il vento.', 'Me lo rimetterà a posto?', 'del recinto {di:vicino}'),
    T([0], 'Ho prestato la mia pentola grande {a:vicino} a settembre, e da allora non l\'ho più vista.', 'Me la restituirà?', 'della pentola prestata'),
    T([1], '{vicino} racconta in giro che ho un debito con la sua famiglia, e non è vero.', 'Smetterà di parlare male di me?', '{di:vicino}'),
    T([1, 2], 'La persona che consideravo la più cara delle mie amicizie è partita per i villaggi del nord senza salutarmi.', 'Mi scriverà?', 'della tua amicizia'),
    T([2], 'Il consiglio del villaggio deve votare {quando}, e io ho bisogno che stiano dalla mia parte.', 'Avrò i voti che mi servono?', 'del voto del consiglio'),
  ],
  'altri.scelta': [
    T([0], 'Due mie amiche litigano per chi porterà il cesto più bello alla fiera, e tutte e due vogliono che io dia ragione a loro.', 'Con chi mi schiero?', 'delle tue due amiche'),
    T([0], 'La gallina {di:vicino} fa le uova nel mio fienile, e io finora le uova me le sono mangiate.', 'Glielo dico, o continuo a fare colazione?', 'delle uova nel fienile'),
    T([1], '{vicino} mi ha chiesto di fare da garante per un prestito, e io non so quanto posso fidarmi.', 'Devo accettare?', 'del prestito {di:vicino}'),
    T([1, 2], 'Mi hanno confidato un segreto che riguarda un\'altra persona del villaggio, e quella persona ci sta male senza saperlo.', 'Devo parlare, o tenere il segreto?', 'del segreto che ti hanno confidato'),
    T([2], 'Due famiglie importanti del porto mi chiedono di stare con loro in una lite per un pezzo di terra, e con tutte e due faccio affari.', 'Con chi mi conviene stare?', 'della lite tra le due famiglie'),
  ],
  'altri.andra': [
    T([0], 'Domenica devo chiedere scusa {a:vicino}, perché il mio cane si è mangiato mezza siepe.', 'Come andrà, quando busserò alla porta?', 'delle scuse {a:vicino}'),
    T([0, 1], 'Sono arrivat{o} al villaggio da un mese, e ancora non conosco nessuno a parte il gatto del fornaio.', 'Come andrà, qui, con la gente?', 'della gente del villaggio'),
    T([1], '{vicino} e io abbiamo litigato per una pecora, perché tutti e due giuriamo che è nostra.', 'Come andrà a finire questa storia?', 'della pecora contesa'),
    T([1, 2], 'Devo lavorare per tutta la primavera insieme a una persona che non sopporto.', 'Come andrà tra noi?', 'della persona che non sopporti'),
    T([2], 'Mi hanno propost{o} per un posto nel consiglio del villaggio, e so già che qualcuno farà di tutto per impedirlo.', 'Come andrà, con la gente che conta?', 'del posto nel consiglio'),
  ],
  'altri.perche': [
    T([0], 'Al mercato tutti comprano le mele della bancarella accanto alla mia, e le mie sono uguali, anzi più rosse.', 'Perché vanno tutti dall\'altra parte?', 'delle tue mele', { ties: ['uova', 'lattaia', 'fascine', 'oche', 'porcaro', 'carbonaio'] }),
    T([0, 1], '{vicino} non mi saluta più da quando ho dipinto la porta di giallo.', 'Perché se l\'è presa così?', '{di:vicino}'),
    T([1], 'Le persone che chiamavo amiche si vedono la sera senza di me, e quando le incontro cambiano discorso.', 'Perché mi hanno lasciat{o} fuori?', 'delle tue amicizie'),
    T([1, 2], 'In paese qualcuno ha cominciato a dire cose brutte sul mio conto, e non so chi sia stato.', 'Perché ce l\'hanno con me?', 'delle voci sul tuo conto'),
    T([2], 'Ho aiutato molte famiglie del villaggio con i miei soldi, e adesso sembra che nessuno si ricordi di me.', 'Perché la gente è così ingrata con me?', 'delle famiglie che hai aiutato'),
  ],
  'altri.fare': [
    T([0], 'Il gallo {di:vicino} canta alle tre di notte, tutte le notti, proprio sotto la mia finestra.', 'Che cosa posso fare, senza finire a litigare?', 'del gallo {di:vicino}'),
    T([0], 'Ho promesso di aiutare tre persone diverse nello stesso giorno, e me ne sono accort{o} soltanto stamattina.', 'Che cosa faccio adesso?', 'delle tue tre promesse'),
    T([1], '{vicino} sposta la pietra di confine di un passo ogni inverno, e ormai il mio orto è diventato un corridoio.', 'Che cosa devo fare?', 'della pietra di confine'),
    T([1, 2], 'Una persona a cui voglio bene si è messa nei guai con il conestabile, e mi chiede di aiutarla.', 'Che cosa posso fare per lei, senza rovinarmi anch\'io?', 'della persona nei guai'),
    T([2], 'Mi chiedono di parlare a favore di una donna accusata davanti al Giudice, e se lo faccio potrebbero guardare anche me.', 'Che cosa devo fare?', 'della donna accusata'),
  ],
  'altri.quadro': [
    T([0], 'Nel mio vicolo siamo in sei case e ci prestiamo tutto, anche le cose che poi non tornano.', 'Che cosa vedi tra me e i miei vicini?', 'dei tuoi vicini'),
    T([0, 1], 'Non ho una domanda precisa, vorrei soltanto capire come mi vede la gente del villaggio.', 'Che cosa vedi intorno a me?', 'della gente intorno a te'),
    T([1], 'Ho tanti conoscenti e pochi amici, e qualche volta mi chiedo di chi posso fidarmi davvero.', 'Che cosa vedi tra le persone che frequento?', 'delle persone che frequenti'),
    T([1, 2], 'In bottega passa tanta gente, e da qualche tempo ho l\'impressione che qualcuno mi guardi in modo diverso.', 'Che cosa vedi intorno a me, in questo periodo?', 'della gente intorno a te'),
    T([2], 'Vengo da Boston per affari, e qui al villaggio non so ancora di chi fidarmi.', 'Che cosa vedi nelle persone con cui tratto?', 'delle persone con cui tratti', { ties: ['mercante', 'pellicce', 'notaio', 'capitano', 'armatore'] }),
  ],
  'se.sino': [
    T([0], 'Alla fiera c\'è {x}, e io sono anni che arrivo second{o}.', 'Quest\'anno vincerò?', '{di:x}', { x: ['la gara delle torte', 'la gara di filatura', 'la corsa con i sacchi'] }),
    T([0], 'Voglio imparare a leggere, e il maestro dice che ho la testa dura come una noce.', 'Ci riuscirò?', 'delle lezioni del maestro'),
    T([1], 'Da un po\' di tempo non ho più voglia di niente, anche quando le cose vanno bene.', 'Tornerò ad avere voglia di fare le cose?', 'del tuo umore'),
    T([1, 2], 'Mi hanno offerto di partire per l\'Inghilterra, e io non sono mai andat{o} più lontano di Boston.', 'È la strada giusta per me?', "del viaggio in Inghilterra"),
    T([2], 'Ho passato la vita a fare quello che si aspettavano gli altri, e adesso che i figli sono grandi non so più che cosa voglio.', 'Sono ancora in tempo per cambiare?', 'della tua vita'),
  ],
  'se.scelta': [
    T([0], 'Per la fiera mi sono cucit{o} un cappello nuovo, ma è venuto così grande che ci starebbe dentro anche la capra.', 'Lo metto lo stesso, o tengo quello vecchio?', 'del cappello nuovo'),
    T([0], 'Ho messo da parte tre monete, e non so se spenderle per {x} alla fiera o tenerle per l\'inverno.', 'Che cosa ne faccio?', 'delle tre monete', { x: ['un nastro rosso', "un pettine d'osso", 'un fischietto di latta'] }),
    T([1], 'Mi hanno chiesto di insegnare a leggere ai bambini del villaggio, e io non ho mai parlato davanti a più di due persone.', 'Accetto, o dico di no?', 'della scuola dei bambini', { notTies: ['maestra'] }),
    T([1, 2], 'Posso restare nel villaggio dove sono nat{o}, oppure andare a Boston dove nessuno sa chi sono.', 'Che cosa devo scegliere?', 'della partenza per Boston'),
    T([2], 'Ho visto una cosa che riguarda una persona potente, e se la racconto mi crederanno, ma la mia vita cambierà.', 'Parlo, o taccio?', 'di quello che hai visto'),
  ],
  'se.andra': [
    T([0], 'Domani parto a piedi per {x}, con una mela in tasca e un paio di scarpe che non sono mie.', 'Come andrà il viaggio?', 'del viaggio a {x}', { x: ['Boston', 'Ipswich', 'Marblehead'] }),
    T([0, 1], 'Ho deciso di smettere di dire bugie, anche quelle piccole, e sono già al terzo giorno.', 'Come andrà, secondo te?', 'della tua promessa'),
    T([1], 'Quest\'anno compio trent\'anni, e mi sembra che sia arrivato il momento di cambiare qualcosa.', 'Come andrà il mio prossimo anno?', 'del tuo prossimo anno'),
    T([1, 2], 'Alla mia età ho cominciato a imparare un mestiere nuovo, e tutti mi guardano come se fossi matt{o}.', 'Come andrà questa strada nuova?', 'del mestiere nuovo'),
    T([2], 'Mi aspetta un viaggio per mare fino in Inghilterra {quando}, e là dovrò presentarmi a gente che non conosco.', 'Come andrà, laggiù?', "del viaggio in Inghilterra"),
  ],
  'se.perche': [
    T([0], 'Ogni volta che devo parlare davanti agli altri mi viene il singhiozzo, anche se devo dire soltanto il mio nome.', 'Perché mi succede?', 'del singhiozzo'),
    T([0, 1], 'Faccio sempre lo stesso sogno, in cui {x}.', 'Perché lo sogno così spesso?', 'del sogno che fai', { x: ['cammino nella neve e non lascio impronte', 'busso a una porta e mi apre una volpe', 'cerco una scala che non finisce mai'] }),
    T([1], 'Comincio tante cose con entusiasmo e poi le lascio a metà, e in casa ormai ci ridono sopra.', 'Perché non riesco mai a finire quello che comincio?', 'delle cose lasciate a metà'),
    T([1, 2], 'Da quando sono tornat{o} dal mare non riesco più a stare in casa, e nemmeno a capire che cosa mi manca.', 'Perché sono così inquiet{o}?', 'della tua inquietudine'),
    T([2], 'Ho avuto tutto quello che volevo, una casa e un nome rispettato, eppure mi sento vuot{o}.', 'Perché non mi basta?', 'di quello che hai costruito'),
  ],
  'se.fare': [
    T([0], 'Tutti mi dicono che sono troppo timid{o}, e quando provo a non esserlo mi esce una vocina che non sembra nemmeno la mia.', 'Che cosa posso fare per farmi sentire?', 'della tua timidezza'),
    T([0], 'Ho promesso a me stess{o} di alzarmi presto, ma il letto è caldo e la stanza è gelata.', 'Che cosa faccio per riuscirci?', 'della tua promessa'),
    T([1], 'Mi arrabbio facilmente e poi mi pento, e chi mi sta vicino comincia a stancarsi.', 'Che cosa posso fare per cambiare?', 'della tua rabbia'),
    T([1, 2], 'Ho sempre fatto quello che volevano i miei genitori, e adesso vorrei capire che cosa voglio io.', 'Da dove comincio?', 'di quello che vuoi tu'),
    T([2], 'Ho commesso un torto molti anni fa, e la persona a cui l\'ho fatto vive ancora qui al villaggio.', 'Che cosa devo fare per mettermi in pace?', 'del torto di tanti anni fa'),
  ],
  'se.quadro': [
    T([0], 'Non ho domande, ho soltanto una moneta e tanta curiosità, e la moneta te la do volentieri.', 'Che cosa vedi per me?', 'della tua strada'),
    T([0, 1], 'Mia nonna diceva che sono nat{o} sotto una stella storta, e a volte penso che avesse ragione.', 'Che cosa vedi, se guardi la mia strada?', 'della tua stella'),
    T([1], 'Non ho una domanda precisa, perché mi sento a un incrocio e non vedo bene nessuna delle strade.', 'Che cosa vedi per me, in questo momento?', 'della strada che hai davanti'),
    T([1, 2], 'Ho cambiato molte cose nell\'ultimo anno, e vorrei capire se sto andando nella direzione giusta.', 'Come vedi il mio cammino?', 'del tuo cammino'),
    T([2], 'Sono venut{o} da lontano perché di te parlano anche al porto {di:x}, e voglio vedere se hanno ragione.', 'Che cosa vedi in me?', 'di te', { x: ['Boston', 'Marblehead', 'Ipswich'] }),
  ],
};

// The first words at the door and the last ones, by tier (said by the client).
export const GREET = {
  0: [
    "Scusa se busso a quest'ora, ma di giorno devo lavorare e di sera mi vergogno di meno.",
    'Buonasera, e perdona le scarpe sporche: ho fatto la strada dei campi per non farmi vedere.',
    'Mi hanno detto che leggi le carte anche a chi paga poco, e io pago poco davvero.',
    "Non ti rubo molto tempo, promesso, perché a casa ho detto che andavo a prendere l'acqua.",
    'Buonasera. Ho portato qualche moneta e anche due uova, se le uova ti servono.',
    'Lo so già che è una cosa piccola, però a me toglie il sonno da giorni.',
  ],
  1: [
    'Buonasera. Mi ha mandato da te una persona di cui mi fido, e spero che abbia fatto bene.',
    "Scusa l'ora, ma questa è una cosa che non posso chiedere al pastore.",
    'Ti ringrazio di avermi aperto. La mia storia è un po\' lunga, ma la domanda è corta.',
    'Sono venut{o} da sol{o} e in casa non sanno niente, quindi ti chiedo di fare in fretta.',
    'Buonasera. Al villaggio si comincia a parlare di te, e ho voluto venire a vedere con i miei occhi.',
    'Non sono abituat{o} a queste cose, perciò abbi pazienza se non so bene come si fa.',
  ],
  2: [
    'Buonasera. Ho fatto molta strada per arrivare fin qui, e ti chiedo di non dire a nessuno che sono venut{o}.',
    'Il mio nome lo conoscono in molti, al porto, e per questo stanotte preferisco che resti tra noi.',
    'Mi hanno parlato di te a Boston, in una casa dove di solito non si parla di queste cose.',
    'Ti pagherò bene, ma in cambio ti chiedo di essere sincera, anche se quello che vedi non mi piacerà.',
    'Ho lasciato il cavallo legato in fondo alla strada, così nessuno lo vede davanti alla tua porta.',
    'Non sono abituat{o} a bussare alle porte degli altri, quindi perdonami se sembro impacciat{o}.',
  ],
};
export const THANKS = {
  0: [
    'Grazie davvero. Non è molto, ma è tutto quello che avevo in tasca stasera.',
    'Adesso torno a casa con un peso in meno, e prometto di non dire a nessuno dove sono stat{o}.',
    'Me lo ricorderò, e se le cose vanno come hai detto la prossima volta ti porto una pagnotta.',
    'Grazie. Stanotte almeno dormo, che è già tanto.',
    'Sei stata gentile con me, e non capita spesso. Ti lascio queste monete e me ne vado in punta di piedi.',
    'Allora faccio come hai detto. Se va male, però, torno a dirtelo.',
  ],
  1: [
    'Mi hai dato da pensare, e ne avevo bisogno. Ecco quello che ti devo.',
    'Grazie. Non pensavo che delle carte potessero dire cose così vicine alla mia vita.',
    'Ci penserò con calma, stanotte. Intanto prendi queste, che te le sei guadagnate.',
    'Grazie per avermi ascoltat{o} senza ridere di me. Tornerò, se me lo permetti.',
    'Hai detto quello che temevo e anche quello che speravo, e adesso so da dove cominciare.',
    'Ti lascio le monete sul tavolo. Se qualcuno chiede, io stasera ero a casa.',
  ],
  2: [
    'Mi avevano detto che eri brava, e non esageravano. Questo è per il tuo disturbo, e per il tuo silenzio.',
    'Riferirò a chi mi ha mandato che il viaggio è valso la pena. Accetta queste monete, ti prego.',
    'Non è facile dirmi certe cose, e tu l\'hai fatto con garbo. Te ne sono grat{o}.',
    'Tornerò a Boston con le idee più chiare di quando sono partit{o}, e te ne ringrazio.',
    'Ecco il tuo compenso. Se un giorno avrai bisogno di qualcuno al porto, chiedi di me.',
    'Hai parlato con sincerità, e non sono in molti a farlo con me. Me ne ricorderò.',
  ],
};
// what Tartufo thinks as a generated client sits down (only with the cat)
export const MUTTERS = {
  0: ['(Ha fatto tanta strada per spendere poco. Leggi bene lo stesso, che chi ha poco poi racconta tanto in giro.)',
    '(Ha le tasche quasi vuote e un problema piccolo piccolo. Sono i miei clienti preferiti, perché poi tornano.)',
    '(Sento odore di stalla e di pane raffermo. Niente di pericoloso, quindi puoi stare tranquilla.)'],
  1: ['(Gente del villaggio, di quella che lavora tutto il giorno. Ascolta bene, prima di girare le carte.)',
    '(Questa faccia l\'ho vista al mercato, e di solito non sorride. Stanotte vediamo se ci riesci tu.)',
    '(Ha una domanda vera, si capisce da come tiene le mani. Leggi con calma.)'],
  2: ['(Questi guanti costano più della nostra capanna. Leggi bene, che da qui il tuo nome può arrivare lontano.)',
    '(Viene da fuori, e lo si sente dalle scarpe. Non farti mettere soggezione, che alla fine è una persona come le altre.)',
    '(Ha lasciato il cavallo in fondo alla strada per non farsi vedere. Chi si nasconde così di solito ha una domanda pesante.)'],
};

// ---- the ones she sends away ----------------------------------------------------------------------
// hello, ask: said by the visitor; kind / curt / turn: { me (her answer), re (their reply) }.
// turn (when the question can be turned): the reading the cards CAN do, forma 'fare'.
const R = (id, kind, hello, ask, k, c, turn = null) => ({ id, kind, hello, ask, kind_: { me: k[0], re: k[1] }, curt: { me: c[0], re: c[1] }, turn });
export const REFUSALS = [
  R('door.forno', 'door', 'Buonasera! Ho qui la pasta da cuocere, che stanotte ha lievitato il doppio del solito.', 'È questo il forno?',
    ['No, il forno è più giù, verso la piazza: segui l\'odore del pane e lo trovi.', 'Ah, ecco perché qui non si sentiva profumo di niente. Scusa il disturbo, e buonanotte.'],
    ['No, questo non è il forno. Buonanotte.', 'Va bene, va bene, me ne vado. Che modi, però.']),
  R('door.levatrice', 'door', 'Scusa tanto, mia sorella sta per partorire e mi hanno detto di correre dalla levatrice.', 'È qui che abita la levatrice?',
    ['No, ma la casa di Malva è quella con la finestra accesa, sulla strada di sotto. Corri, che lei di notte apre.', 'Grazie, grazie! Se nasce una bambina, le diamo il tuo nome.'],
    ['Hai sbagliato porta: la levatrice abita più giù.', 'Più giù dove? Lascia stare, la trovo da me.']),
  R('door.bottega', 'door', 'Mi servono una manciata di chiodi e un po\' di spago, e mi hanno detto di bussare alla porta in fondo alla strada.', 'È questa la bottega?',
    ['La bottega è nella parte alta del villaggio, vicino alla casa delle adunanze. A quest\'ora però il bottegaio dorme già.', 'Allora torno domattina. Grazie, e scusa se ti ho fatto alzare.'],
    ['No, qui non si vendono chiodi.', 'In effetti mi pareva strano che una bottega avesse le tende alle finestre.']),
  R('curse.capra', 'curse', 'La capra della mia vicina è entrata nel mio orto per la terza volta e si è mangiata tutti i cavoli, anche quelli appena spuntati.', 'Puoi farle il malocchio? Basta poco, che la capra le faccia latte acido per un mese.',
    ['Non faccio il malocchio a nessuno, nemmeno per dei cavoli, ma capisco che tu sia arrabbiat{o}.', 'Lo immaginavo, ma tentar non nuoce. Allora domani comincio a costruire un recinto.'],
    ['Qui non si fanno malocchi. Se hai un problema con la vicina, vai a parlarci.', 'Parlarci! Si vede che non la conosci.'],
    { me: 'Il malocchio non lo faccio, ma posso guardare nelle carte che cosa puoi fare tu con la tua vicina.', re: 'Va bene, guardiamo. Ma se le carte dicono di perdonarla, io faccio finta di non aver sentito.',
      q: 'Che cosa posso fare con la mia vicina e con la sua capra?', ambito: 'altri', di: 'della tua vicina e della sua capra', thanks: 'D\'accordo, ci provo a modo tuo. Il recinto però lo costruisco lo stesso.' }),
  R('curse.mercato', 'curse', 'Al mercato c\'è una persona che vende le stesse cose che vendo io a metà prezzo, e mi sta rovinando.', 'Puoi mandarle una disgrazia, una piccola, che le faccia chiudere la bancarella?',
    ['Non mando disgrazie a nessuno, mi dispiace, anche se capisco quanto ti pesi.', 'Sei più buona di me, allora. Pazienza, almeno ci ho provato.'],
    ['Non è un lavoro che faccio. Cerca un\'altra porta.', 'Ce ne sono, di porte, non credere. Buonanotte.'],
    { me: 'Non posso farle del male, ma posso guardare che cosa puoi fare tu per i tuoi affari.', re: 'Se non si può fare altro, guardiamo i miei affari.',
      q: 'Che cosa posso fare per non perdere i miei clienti?', ambito: 'lavoro', di: 'della tua bancarella al mercato', thanks: 'Non è quello che volevo, ma forse è quello che mi serviva.' }),
  R('curse.cugino', 'curse', 'Mio cugino si è preso l\'eredità della zia, e a me ha lasciato soltanto il suo pappagallo, che dice le parolacce.', 'Mi fai una fattura contro di lui, di quelle che non si tolgono?',
    ['Fatture non ne faccio, e non ne farei nemmeno per un pappagallo che dice le parolacce.', 'È che le dice con la voce di mia zia, ed è questo che non sopporto. Va bene, me ne vado.'],
    ['No, e non chiedermelo più.', 'Come vuoi. Il pappagallo però ti saluta.'],
    { me: 'Non faccio fatture, ma posso guardare che cosa puoi fare tu con tuo cugino.', re: 'Con mio cugino? Va bene, ma solo perché sono venut{o} fin qui.',
      q: 'Che cosa posso fare con mio cugino, dopo questa storia dell\'eredità?', ambito: 'casa', di: "di tuo cugino e dell'eredità", thanks: 'Allora gli parlo. E se non mi ascolta, gli lascio il pappagallo.' }),
  R('death.nonno', 'death', 'Mio nonno è vecchio, molto vecchio, e in casa tutti parlano già di chi si prenderà il suo letto.', 'Mi dici quando morirà?',
    ['Le carte non dicono quando se ne va una persona, e io non lo chiederei mai.', 'Hai ragione, è una cosa brutta da chiedere. Mi è uscita perché in casa non si parla d\'altro.'],
    ['Queste domande qui non si fanno. Buonanotte.', 'Scusa, scusa, me ne vado subito.'],
    { me: 'Non posso dirti quando, ma posso guardare che cosa puoi fare per lui, finché c\'è.', re: 'Per lui? A dire la verità non ci avevo pensato. Va bene, guardiamo.',
      q: 'Che cosa posso fare per mio nonno, adesso?', ambito: 'casa', di: 'di tuo nonno', thanks: 'Domani mi siedo vicino a lui e gli faccio raccontare di quando era giovane. Grazie.' }),
  R('death.zia', 'death', 'Ho una zia ricca che non mi ha mai voluto bene, e io sono l\'unic{o} parente che le è rimasto.', 'Tu lo vedi, quanto le resta da vivere?',
    ['No, questo non lo guardo per nessuno, perché è una cosa che le carte non devono dire.', 'Lo sapevo che non era una bella domanda, però dovevo provarci.'],
    ['Non leggo la morte di nessuno, e ti consiglio di non chiederlo in giro.', 'Già, di questi tempi è meglio di no. Me ne vado.'],
    { me: 'Non ti dirò quando, ma posso guardare che cosa puoi fare tu con tua zia, adesso.', re: 'Con lei? Non ci parliamo da anni. Va bene, vediamo.',
      q: 'Che cosa posso fare con mia zia, dopo tanti anni?', ambito: 'casa', di: 'di tua zia', thanks: 'Magari le porto una torta, e non per l\'eredità. Un pochino anche per l\'eredità, a dire il vero.' }),
  R('ill.figlio', 'illness', 'Mio figlio ha la febbre da tre giorni, e il medico dice soltanto di aspettare.', 'Guarirà?',
    ['Sulla salute le carte non dicono niente di sicuro, e non voglio darti una speranza o una paura sbagliata. Ascolta il medico, e chiama anche Malva, che ne sa più di me.', 'Hai ragione. Vado da Malva subito, anche se è notte.'],
    ['Non leggo sulle malattie. Vai dal medico.', 'Dal medico ci sono già stat{o}. Andrò da qualcun altro.'],
    { me: 'Non posso dirti se guarirà, ma posso guardare che cosa puoi fare tu per reggere in questi giorni.', re: 'Qualunque cosa. Dimmi qualunque cosa.',
      q: 'Che cosa posso fare io, per reggere in questi giorni?', ambito: 'se', di: 'di questi giorni difficili', thanks: 'Allora resto con lui, e domattina vado lo stesso a chiamare Malva. Grazie.' }),
  R('ill.mucca', 'illness', 'La mia mucca non mangia da due giorni e mi guarda con gli occhi tristi.', 'Guarirà, la mia mucca?',
    ['Per le bestie che stanno male serve chi se ne intende, non le carte. Domani chiedi al maniscalco, che di mucche ne ha viste tante.', 'Il maniscalco, certo. Ci vado all\'alba.'],
    ['Le carte non curano le mucche.', 'Nemmeno tu, a quanto pare.'],
    { me: 'Non so dirti se guarirà, ma posso guardare che cosa puoi fare tu per lei.', re: 'Per lei farei qualsiasi cosa, perché è l\'unica in casa che non si lamenta mai.',
      q: 'Che cosa posso fare per la mia mucca?', ambito: 'casa', di: 'della tua mucca', thanks: 'Allora la tengo al caldo, e domattina chiamo il maniscalco. Grazie.' }),
  R('lotto.fagioli', 'lottery', 'Alla fiera di primavera c\'è il gioco dei numeri, quello con i fagioli colorati nel sacco.', 'Mi dici quali numeri usciranno?',
    ['Le carte non sanno i numeri, e se li sapessero sarei io la prima a giocarli.', 'Questo è vero, altrimenti non abiteresti qui. Va bene, scusa.'],
    ['Non do numeri. Buonanotte.', 'Peccato. Allora giocherò il giorno del mio compleanno, come sempre.'],
    { me: 'Non ti do numeri, ma posso guardare che cosa puoi fare con i soldi che hai.', re: 'Va bene, i soldi sono sempre soldi.',
      q: 'Che cosa posso fare per far fruttare i miei pochi soldi?', ambito: 'lavoro', di: 'dei tuoi soldi', thanks: 'Allora quest\'anno alla fiera ci vado, ma soltanto per guardare.' }),
  R('lotto.cavalli', 'lottery', 'Alla fiera fanno correre i cavalli lungo il fiume, e si scommette su chi arriva primo.', 'Su quale cavallo devo puntare?',
    ['Questo le carte non lo dicono, e mi dispiacerebbe farti perdere dei soldi per colpa mia.', 'Sei onesta, almeno. Il mio vicino invece mi aveva consigliato un mulo.'],
    ['Non sono qui per le scommesse.', 'Va bene, va bene. Chiedevo soltanto.']),
  R('accusa.strega', 'accuse', 'Da quando la vedova accanto si è trasferita, le mie galline non fanno più uova e il latte va a male.', 'Dimmi tu se è una strega, così vado a dirlo al conestabile.',
    ['Non dico di nessuno che è una strega, e ti prego di non dirlo nemmeno tu: di questi tempi una parola così rovina una persona.', 'Hai ragione, forse ho parlato troppo in fretta. Ci penserò bene, prima di andare dal conestabile.'],
    ['Non accuso nessuno. E tu stai attent{o} a quello che dici in giro.', 'Lo dici come se dovessi preoccuparmi io. Buonanotte.'],
    { me: 'Non ti dirò chi è una strega, ma posso guardare che cosa puoi fare per stare in pace con la tua vicina.', re: 'Va bene, guardiamo. Però le galline prima facevano le uova.',
      q: 'Che cosa posso fare per stare in pace con la mia nuova vicina?', ambito: 'altri', di: 'della tua nuova vicina', thanks: 'Forse le porto un po\' di pane e le chiedo come si chiama. Sarebbe già un inizio.' }),
  R('filtro.amore', 'potion', '{amato} non mi guarda nemmeno, e io ormai non so più che cosa inventarmi.', 'Me lo prepari un filtro d\'amore? Pago anche in anticipo.',
    ['I filtri non li preparo, perché un amore fatto così non è amore. Mi dispiace davvero.', 'Lo dice anche mia madre, però lei non conosce {amato}.'],
    ['Niente filtri. Qui si leggono le carte e basta.', 'Allora mi tengo i soldi e il mal di cuore.'],
    { me: 'Il filtro non lo faccio, ma posso guardare nelle carte che cosa puoi fare tu per farti notare.', re: 'Va bene, anche questo è qualcosa.',
      q: 'Che cosa posso fare perché {amato} si accorga di me?', ambito: 'amore', di: '{di:amato}', thanks: 'Allora domenica mi faccio coraggio e saluto per prim{o}.' }),
];
// Her answers when a visitor's own lines do not say otherwise (never needed today: every visitor has both).
export const REFUSE_TRAIT = { kind: { tono: 1 }, curt: { tono: -1 }, turn: { tono: 1 } };

// ---- in the street ----------------------------------------------------------------------------------
// someone she has read for recognises her outdoors (said by them), her two answers, their replies
export const STREET = {
  ask: [
    'Sei tu, vero? Non guardarmi così, che ci vedono… ma una carta sola, ti prego, e poi faccio finta di non conoscerti.',
    'Aspetta, non fermarti in mezzo alla strada e mettiti qui all\'ombra. Mi basta una carta, una sola, e poi ognuno per la sua strada.',
    'Mi riconosci? Sono venut{o} da te qualche sera fa. Non qui, che ci vedono… ma una carta sola, ti prego.',
    'Ti ho vista arrivare da lontano e ho fatto finta di guardare le galline. Hai un momento per una carta sola, qui, alla svelta?',
    'Abbassa la voce, che il conestabile passa spesso da queste parti. Avrei bisogno di una carta, soltanto una.',
    "L'altra volta mi hai detto cose giuste, e da allora ci penso. Me ne giri un'altra, qui, prima che passi qualcuno?",
  ],
  yes: 'Va bene, una carta sola, e facciamo in fretta.',
  no: 'Non qui, mi dispiace. Vieni alla capanna, una di queste sere.',
  noRe: [
    'Hai ragione, è meglio così. Busserò alla tua porta, allora.',
    'Va bene, scusa se ti ho fermata. Faccio finta di niente.',
    'Capisco. Allora ci vediamo alla capanna, ma non dirlo a nessuno.',
  ],
  hello: 'Una carta sola, qui, prima che passi qualcuno.',
  thanks: [
    'Grazie. Adesso vai, prima che qualcuno si chieda perché stiamo parlando.',
    'Me la porterò dietro tutto il giorno, questa carta. Grazie, e scusa la fretta.',
    'Ecco, prendi, e non contarle qui in mezzo alla strada.',
    'Grazie. Se qualcuno chiede, mi hai soltanto indicato la strada.',
  ],
};
// A second visitor waiting outside (popularity 2 and more): the line and her two answers.
export const QUEUE = {
  t: 'Mentre accompagni alla porta chi è appena uscito, vedi che fuori aspetta ancora qualcuno, con una lanterna in mano.',
  yes: 'Faccio entrare anche questa persona.',
  no: 'Per stanotte basta così, sono stanca.',
};
