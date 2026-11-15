// The people who knock at the cottage at night (4 per chapter) and 'self' for the finale.
// The reading system shows `hello` before and `thanks` after; `question: null` = a general picture.
// CLIENT_SCRIPTS: the cottage table, one script per chapter, serves the next client in order.
import { N, cat, IF, xp, flag, reading } from './h.js';

export const CLIENTS = [
  // chapter 1: one card
  { id: 'c1.widow', name: 'La vedova Bray', look: 'scialle nero, rosario, mani screpolate', chapter: 1,
    question: 'Devo vendere il campo di mio marito?', theme: 'scelta',
    hello: 'Non dovrei essere qui. Il pastore non deve saperlo.', thanks: 'Non ci siamo mai viste. Tenga.', pay: 5 },
  { id: 'c1.baker', name: 'Tobia il fornaio', look: 'farina sulle sopracciglia', chapter: 1,
    question: 'Mia moglie mi nasconde qualcosa?', theme: 'fiducia',
    hello: 'Il pane lievita storto da tre giorni. E lei sorride troppo.', thanks: 'Se è una torta, te ne porto una fetta.', pay: 4 },
  { id: 'c1.mercy', name: 'Mercy, quindici anni', look: 'occhi rossi, treccia disfatta', chapter: 1,
    question: 'Perché sogno sempre la stessa porta?', theme: 'paura',
    hello: 'Le altre urlano in piazza. Io sogno una porta. È peggio?', thanks: 'Stanotte provo ad aprirla. Forse.', pay: 3 },
  { id: 'c1.sailor', name: 'Eli il marinaio', look: 'barba di sale, un orecchino', chapter: 1,
    question: null, theme: 'partenza',
    hello: 'Domani salpo. Non ho domande. Dimmi cosa vedi.', thanks: 'Se torno, ti porto un pappagallo. Uno che sta zitto.', pay: 7 },
  // chapter 2: past, present, future
  { id: 'c2.miller', name: 'Prudenza la mugnaia', look: 'grembiule, mani bianche, fretta', chapter: 2,
    question: 'Il mulino va male: è colpa mia?', theme: 'lavoro',
    hello: 'La ruota gira al contrario. Te lo giuro. Al contrario.', thanks: 'Allora non è colpa mia. Solo un po\'.', pay: 8 },
  { id: 'c2.twins', name: 'I gemelli Pike', look: 'uguali, litigano in coro', chapter: 2,
    question: 'Chi di noi due erediterà la vacca?', theme: 'eredità',
    hello: 'Io sono il primo! No, io! Siamo nati insieme, ma io prima!', thanks: 'La vacca la teniamo a metà. Davanti a me.', pay: 6 },
  { id: 'c2.hunter', name: 'Silas il cacciatore', look: 'pelliccia, un occhio solo', chapter: 2,
    question: null, theme: 'solitudine',
    hello: 'Nel bosco non parlo con nessuno da un anno. Parla tu.', thanks: 'Era bello sentire una voce. Anche se dice cose vere.', pay: 9 },
  { id: 'c2.mother', name: 'Comare Goodwin', look: 'un neonato in braccio, occhiaie', chapter: 2,
    question: 'Mio figlio crescerà sano?', theme: 'cura',
    hello: 'L\'ha fatto nascere Malva. Mi ha detto di venire da te. Non ha detto grazie.', thanks: 'Gli canterò la tua carta, stanotte.', pay: 8 },
  // chapter 3: the Celtic cross
  { id: 'c3.clerk', name: 'Lo scrivano del tribunale', look: 'inchiostro sulle dita, occhiaie', chapter: 3,
    question: 'Devo dire quello che ho visto?', theme: 'coscienza',
    hello: 'Scrivo tutto quello che il Giudice dice. Anche quello che non dice.', thanks: 'Strapperò una pagina. Una sola. Per cominciare.', pay: 12 },
  { id: 'c3.cook', name: 'La cuoca del Giudice', look: 'cuffia, mattarello, ansia', chapter: 3,
    question: 'Il Giudice mi darà l\'aumento?', theme: 'lavoro',
    hello: 'Lui sa tutto. Questo no. Questo non deve saperlo.', thanks: 'Gli faccio la torta di mele. E glielo chiedo col piatto in mano.', pay: 10 },
  { id: 'c3.corey', name: 'Il vecchio Corey', look: 'schiena dritta, mani enormi', chapter: 3,
    question: null, theme: 'fine',
    hello: 'Mi chiedono di confessare. Io non confesso. Cosa dicono le tue carte?', thanks: 'Allora resto dritto. Fino in fondo.', pay: 11 },
  { id: 'c3.shadowless', name: 'La donna senza ombra', look: 'velo grigio, piedi scalzi, nessuna ombra', chapter: 3,
    question: 'Sono ancora viva?', theme: 'confine',
    hello: 'Ho bussato tre volte. Hai aperto alla quarta. Come sempre.', thanks: 'Grazie. Adesso so da che parte andare.', pay: 13 },
  // the finale: she reads for herself
  { id: 'self', name: '{name}', look: 'una candela, le tue mani', chapter: 4,
    question: null, theme: 'te',
    hello: 'Stavolta la cliente sei tu.', thanks: 'Lo hai detto tu, stavolta.', pay: 0 },
];

// what Tartufo mutters as each client sits down (one line, colour)
const MUTTER = {
  'c1.widow': '(Vedova. Paga poco ma paga sempre. Gentile, mi raccomando.)',
  'c1.baker': '(Odora di pane. Leggigli bene, magari torna con la crosta.)',
  'c1.mercy': '(Questa è una delle ragazze della piazza. Attenta a cosa dici.)',
  'c1.sailor': '(Nessuna domanda: quadro generale. Guarda tutta la carta.)',
  'c2.miller': '(Tre carte: da dove viene il guaio, dov\'è, dove va.)',
  'c2.twins': '(Due clienti, una vacca. Io tifo per la vacca.)',
  'c2.hunter': '(Un occhio solo e vede più di te. Non ti offendere.)',
  'c2.mother': '(Il bambino mi guarda. Io guardo lui. Siamo d\'accordo.)',
  'c3.clerk': '(Uno del tribunale. Se ti tradisce, lo graffio.)',
  'c3.cook': '(La cuoca del Giudice. Fatti dare la ricetta.)',
  'c3.corey': '(Questo vecchio non si piega. Dieci carte, e nessuna lo piega.)',
  'c3.shadowless': '(Non ha ombra. Io ho tutto il pelo dritto. Leggi in fretta.)',
};

const SPREAD = { 1: 'single', 2: 'ppf', 3: 'celtic' };
// after the first reading of a chapter the path moves on
const FIRST = { 1: ['c1.client', 'c1.explore'], 2: ['c2.client', 'c2.fire'], 3: ['c3.client', 'c3.coven'] };
const AFTER = {
  1: [cat('(Bene. Adesso esci: le carte non vengono a cercarti. Verso la piazza.)')],
  2: [cat('(Ortica ha detto di un bivacco nel bosco. C\'è qualcuno che ride, laggiù.)')],
  3: [cat('(Le maestre si riuniscono nelle cantine. Ma prima, tutte le carte.)')],
};

function serve(ch, id, rest) {
  const done = `client.${id}.done`;
  return {
    if: { notFlag: done },
    then: [
      cat(MUTTER[id]),
      reading(SPREAD[ch], id),
      flag(done),
      xp(5),
      IF({ step: FIRST[ch][0] }, [...AFTER[ch], { do: 'step', id: FIRST[ch][1] }]),
    ],
    else: rest,
  };
}

function chain(ch) {
  const ids = CLIENTS.filter((c) => c.chapter === ch).map((c) => c.id);
  const empty = [
    N('Nessuno bussa, stanotte. Solo il vento, e Tartufo che russa.'),
    IF({ power: 'cat' }, [cat('(Le carte che hai si ripassano. Apri il grimorio, se ti annoi.)')]),
  ];
  return [ids.reduceRight((rest, id) => [serve(ch, id, rest)], empty)[0]];
}

export const CLIENT_SCRIPTS = {
  'client.c1': chain(1),
  'client.c2': chain(2),
  'client.c3': chain(3),
  'client.free': [
    N('Il tavolo è tuo. Le carte anche.'),
    IF({ power: 'cat' }, [cat('(Nessuno bussa più per paura. Bussano per curiosità. Meglio.)')]),
  ],
};
