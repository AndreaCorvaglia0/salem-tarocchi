// The people who knock at the cottage at night (4 per chapter), Malva as the very first reading
// (chapter 0: she is never served at the cottage) and 'self' for the finale.
// The reading system shows `hello` before and `thanks` after; `question: null` = a general picture.
// ambito / forma / ref: the question's two tags for the reading engine (docs/READING.md; ref.di follows «Mi chiedi»).
// CLIENT_SCRIPTS: the cottage table, one script per chapter, serves the next client in order.
import { N, cat, IF, xp, flag, reading, step, visit, open } from './h.js';

export const CLIENTS = [
  // the tutorial: Malva sits at her own table and plays the client
  { id: 'c0.malva', name: 'Comare Malva', look: 'treccia a corona, scialle verde, mani forti', chapter: 0,
    question: 'Le mie erbe, quest\'anno, mi daranno da vivere, o lavoro per niente?', ambito: 'lavoro', forma: 'sino', ref: { di: 'delle tue erbe' }, theme: 'attesa',
    hello: 'Fai conto che io abbia bussato alla tua porta e che tu non mi conosca. Ho una domanda sola, e la risposta la voglio corta.',
    thanks: 'Per essere la prima volta non è andata male. Non ti ringrazio, lo sai, però il lume stanotte te lo lascio acceso.', pay: 0 },
  // chapter 1: one card
  { id: 'c1.widow', name: 'La vedova Bray', look: 'scialle nero, un rosario tra le dita, mani screpolate', chapter: 1,
    question: 'Devo vendere il campo che era di mio marito?', ambito: 'lavoro', forma: 'scelta', ref: { di: 'del campo' }, theme: 'scelta',
    hello: 'Non dovrei nemmeno essere qui, e se il pastore lo viene a sapere mi toglie il saluto. Però mio marito è morto a novembre, e da allora c\'è una cosa che non riesco a decidere da sola.',
    thanks: 'Mi ha fatto bene sentirlo dire da qualcun altro. Noi due non ci siamo mai viste, siamo intese? Questo però tienilo.', pay: 5 },
  { id: 'c1.baker', name: 'Tobia il fornaio', look: 'farina fin sopra le sopracciglia', chapter: 1,
    question: 'Mia moglie mi sta nascondendo qualcosa?', ambito: 'amore', forma: 'sino', ref: { di: 'di tua moglie' }, theme: 'fiducia',
    hello: 'Da tre giorni il pane mi lievita storto, e in vent\'anni non era mai successo. Mia moglie intanto canticchia, sorride da sola, e quando entro in cucina copre qualcosa col grembiule.',
    thanks: 'Se quello che nasconde è una torta per il mio compleanno, te ne porto una fetta. Se invece è un\'altra cosa, torno a farmi girare un\'altra carta.', pay: 4 },
  { id: 'c1.mercy', name: 'Mercy, quindici anni', look: 'occhi rossi, una treccia disfatta', chapter: 1,
    question: 'Perché sogno sempre la stessa porta?', ambito: 'se', forma: 'perche', ref: { di: 'della porta che sogni' }, theme: 'paura',
    hello: 'Le mie amiche sono quelle che gridano in piazza. Io non grido: sogno tutte le notti una porta chiusa, e non so se è peggio o se è la stessa cosa.',
    thanks: 'Stanotte, se la sogno ancora, provo ad aprirla. Non te lo prometto, però adesso almeno so che è soltanto una porta.', pay: 3 },
  { id: 'c1.sailor', name: 'Eli il marinaio', look: 'barba piena di sale, un orecchino', chapter: 1,
    question: null, ambito: 'se', forma: 'quadro', ref: { di: 'della partenza' }, theme: 'partenza',
    hello: 'Domattina salpo per le isole, e starò via fino all\'estate. Non ho una domanda precisa: gira una carta e dimmi cosa vedi, che in mare uno si porta dietro quello che può.',
    thanks: 'Me ne ricorderò quando non si vedrà più la costa. Se torno ti porto un pappagallo, di quelli che non parlano.', pay: 7 },
  // chapter 2: past, present, future
  { id: 'c2.miller', name: 'Prudenza la mugnaia', look: 'grembiule infarinato, mani bianche, sempre di fretta', chapter: 2,
    question: 'Il mulino va male: è colpa mia?', ambito: 'lavoro', forma: 'perche', ref: { di: 'del mulino' }, theme: 'lavoro',
    hello: 'Mio marito sta tutto il giorno a guardare la ruota e dice che gira al contrario. Intanto i sacchi li porto io, i conti li faccio io, e la farina non basta mai.',
    thanks: 'Allora non è tutta colpa mia. Un poco sì, ma un poco riesco a portarlo. Passa dal mulino, che ti metto da parte del pane.', pay: 8 },
  { id: 'c2.twins', name: 'I gemelli Pike', look: 'identici, parlano uno sopra l\'altro', chapter: 2,
    question: 'Chi di noi due erediterà la vacca?', ambito: 'casa', forma: 'andra', ref: { di: "dell'eredità" }, theme: 'eredità',
    hello: 'Nostro padre ha lasciato una vacca sola, e noi siamo in due. Io sono nato per primo! Non è vero, sono nato prima io, e la levatrice era Malva, puoi chiederlo a lei.',
    thanks: 'Abbiamo deciso che la vacca la teniamo a metà. La metà davanti la tengo io. No, la tengo io, e ne riparliamo fuori.', pay: 6 },
  { id: 'c2.hunter', name: 'Silas il cacciatore', look: 'pelliccia di lupo, un occhio solo', chapter: 2,
    question: null, ambito: 'se', forma: 'quadro', ref: { di: 'della tua vita nel bosco' }, theme: 'solitudine',
    hello: 'Vivo nel bosco e non parlo con nessuno da un anno, a parte il cane, che è morto a marzo. Non ho domande da fare: gira le carte e parla tu, che io ascolto.',
    thanks: 'Era da tanto che non sentivo una voce parlare a me. Hai detto cose vere e non me la sono presa, quindi tornerò.', pay: 9 },
  { id: 'c2.mother', name: 'Comare Goodwin', look: 'un neonato in braccio, occhiaie fonde', chapter: 2,
    question: 'Mio figlio crescerà sano?', ambito: 'casa', forma: 'fare', ref: { di: 'di tuo figlio' }, theme: 'cura',
    hello: 'Questo bambino l\'ha fatto nascere Malva, tre settimane fa. È stata lei a dirmi di venire da te, e come al solito se n\'è andata senza aspettare che la ringraziassi.',
    thanks: 'Stanotte, per farlo dormire, gli racconto le carte che hai girato per lui. Dormi almeno tu, che io non ci riesco da un mese.', pay: 8 },
  // chapter 3: the Celtic cross
  { id: 'c3.clerk', name: 'Lo scrivano del tribunale', look: 'dita macchiate d\'inchiostro, occhiaie', chapter: 3,
    question: 'Devo dire quello che ho visto?', ambito: 'se', forma: 'scelta', ref: { di: 'di quello che hai visto' }, theme: 'coscienza',
    hello: 'Il mio mestiere è scrivere tutto quello che dice il Giudice. Da qualche tempo scrivo anche quello che non dice, su un foglio a parte, e quel foglio non mi lascia dormire.',
    thanks: 'Comincerò da una pagina sola, la più piccola. Tu non mi hai mai visto qui, e io non so dove abiti.', pay: 12 },
  { id: 'c3.cook', name: 'La cuoca del Giudice', look: 'cuffia bianca, un mattarello, molta ansia', chapter: 3,
    question: 'Il Giudice mi darà l\'aumento?', ambito: 'lavoro', forma: 'sino', ref: { di: "dell'aumento" }, theme: 'lavoro',
    hello: 'Cucino per il Giudice da undici anni e non gli ho mai chiesto niente. Lui sa sempre tutto di tutti, ma che sono venuta qui non deve saperlo, o altro che aumento.',
    thanks: 'Domani gli faccio la torta di mele, quella che gli piace. E glielo chiedo mentre ha ancora il piatto in mano, così non può alzarsi.', pay: 10 },
  { id: 'c3.corey', name: 'Il vecchio Corey', look: 'schiena dritta, mani enormi', chapter: 3,
    question: null, ambito: 'se', forma: 'quadro', ref: { di: 'di quello che vogliono farti confessare' }, theme: 'fine',
    hello: 'Vogliono che confessi una cosa che non ho fatto, e mi danno tempo fino a domenica. Io non confesso. Non ho domande da fare: voglio soltanto sapere cosa vedi tu.',
    thanks: 'Allora resto dritto come sono sempre stato, fino in fondo. Sei una brava ragazza, e non lasciare che ti dicano il contrario.', pay: 11 },
  { id: 'c3.shadowless', name: 'La donna senza ombra', look: 'velo grigio, piedi scalzi, nessuna ombra', chapter: 3,
    question: 'Sono ancora viva?', ambito: 'se', forma: 'sino', theme: 'confine',
    hello: 'Ho bussato tre volte e non mi hai sentita. Alla quarta hai aperto, come fanno tutti. È da molto tempo che cammino, e vorrei sapere una cosa sola.',
    thanks: 'Ti ringrazio di cuore. Adesso so da che parte devo andare, e alla tua porta non busserò più.', pay: 13 },
  // the finale: she reads for herself
  { id: 'self', name: '{name}', look: 'una candela, le tue mani', chapter: 4,
    question: null, ambito: 'se', forma: 'quadro', theme: 'te',
    hello: 'Stavolta la domanda è tua, e lo è anche la risposta.', thanks: 'Questa lettura l\'hai fatta tu, dall\'inizio alla fine.', pay: 0 },
];

// How a client takes a reading done with the engine (src/systems/consult.js). BLUNT: said first when she chose
// «Senza giri di parole»; DOUBTFUL: the reaction to a reading that did not convince (a good one ends with `thanks`).
export const REACTIONS = {
  blunt: [
    'Me l\'hai detta senza zucchero. Meglio così, credo.',
    'Non ci giri intorno, tu.',
    'Così, tutta in una volta. Va bene, l\'ho chiesto io.',
  ],
  doubtful: [
    'Non so, non mi ci ritrovo del tutto. Ci penserò su.',
    'Mi aspettavo di riconoscermi di più, in quello che dici.',
    'Sarà. Qualcosa mi torna e qualcosa no.',
  ],
};

// what Tartufo whispers as each client sits down (one line, colour)
export const MUTTER = {
  'c1.widow': '(È la vedova Bray. Paga poco ma paga sempre, e ha già pianto abbastanza, quindi sii gentile con lei.)',
  'c1.baker': '(Questo profuma di pane appena sfornato. Trattalo bene, che magari la prossima volta torna con una pagnotta.)',
  'c1.mercy': '(È amica delle ragazze che gridano in piazza, e ha più paura lei di te. Pesa bene quello che le dici.)',
  'c1.sailor': '(Sa di sale e di catrame fino a qui. Uno che dice di non avere domande, di solito, ne ha una sola e grossa.)',
  'c2.miller': '(È la moglie del mugnaio, quella che lavora per due. Lasciala sfogare, prima di girare le carte.)',
  'c2.twins': '(Sono due clienti per una vacca sola. Se devo tifare per qualcuno, io tifo per la vacca.)',
  'c2.hunter': '(Ha un occhio solo e ci vede meglio di noi due messi insieme. Non provare a raccontargli storie.)',
  'c2.mother': '(Il bambino mi sta guardando, e io guardo lui. Noi due ci siamo già capiti; tu pensa alla madre.)',
  'c3.clerk': '(Questo lavora al tribunale, quindi attenta a quello che dici. Se poi ci tradisce, lo graffio io.)',
  'c3.cook': '(È la cuoca del Giudice. Quando avete finito, vedi se ti lascia la ricetta della torta di mele.)',
  'c3.corey': '(Questo vecchio non l\'hanno piegato in settant\'anni. Vedrai che non ci riescono nemmeno dieci carte.)',
  'c3.shadowless': '(Guarda per terra: non ha l\'ombra. Ho il pelo dritto fino alla punta della coda, quindi leggi bene, ma leggi in fretta.)',
};

const SPREAD = { 1: 'single', 2: 'ppf', 3: 'celtic' };
// after the first reading of a chapter the path moves on
const FIRST = { 1: ['c1.client', 'c1.cart'], 2: ['c2.client', 'c2.fire'], 3: ['c3.client', 'c3.coven'] };
const AFTER = {
  1: [
    cat('Per essere la prima che bussa, è uscita più leggera di come era entrata. Adesso dormi, che domani sera c\'è da uscire.'),
    N('Quando la porta si richiude ti stendi sul letto vestita, e appena chiudi gli occhi ti sembra di rivedere la candela della Lettrice.'),
    visit,
    cat('Ben svegliata, finalmente. Mentre dormivi ho fatto un giro: giù al mercato, sotto il carretto del fieno, c\'è qualcosa che luccica. Io ci andrei prima che ci vada qualcun altro.'),
  ],
  2: [cat('Ortica parlava di un bivacco in fondo al sentiero del bosco, dove Ginepra accende il fuoco la sera. Se da lontano senti ridere, sei sulla strada giusta.')],
  3: [cat('Edera ha detto di tornare da lei quando avremo tutte le carte delle cantine. Le tre maestre si riuniscono là sotto, e stavolta aspettano te.')],
};

const serve = (ch, id, rest) => ({
  if: { notFlag: `client.${id}.done` },
  then: [cat(MUTTER[id]), reading(SPREAD[ch], id), flag(`client.${id}.done`), xp(5)],
  else: rest,
});

// The first reading of a chapter is scripted (it moves the path on); after it, the table serves the
// returning clients (src/glue/clients.js: a random one not yet read, then old faces come back).
function chain(ch) {
  const ids = CLIENTS.filter((c) => c.chapter === ch).map((c) => c.id);
  const first = ids.reduceRight((rest, id) => [serve(ch, id, rest)], []);
  return [IF({ step: FIRST[ch][0] }, [...first, ...AFTER[ch], step(FIRST[ch][1])], [open('clients.next')])];
}

export const CLIENT_SCRIPTS = {
  'client.c1': chain(1),
  'client.c2': chain(2),
  'client.c3': chain(3),
  'client.free': [
    N('Il tavolo adesso è tuo, e sono tue anche le carte. Sulla tovaglia c\'è ancora la cera di tutte le candele che hai consumato.'),
    IF({ power: 'cat' }, [cat('Hai notato che nessuno bussa più per paura? Adesso vengono per curiosità, e qualcuno perfino per farti visita. Lo trovo un miglioramento.')]),
    open('clients.next'),
  ],
};
