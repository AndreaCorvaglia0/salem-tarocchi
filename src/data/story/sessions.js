// The five sessions with the Reader (illustrated table, candle, two hands).
// s0 who you are, s1 values, s2 fears, s3 dreams, s4 she hands the deck over.
// s1-s3: a two-level tree of two-answer questions; each leaf gives a point, a word and a flag
// `leaf.<kind>.<card>` (read by the final reading). Then a true fact (observe), "dimmi un numero",
// and "la tua carta". The Reader observes and notes; she never explains who you are.
import { reader, N, opt, choice, IF, flag, step, travel, give, point, SAME_CARD } from './h.js';

const leaf = (kind, word, card, suit, line) => [
  point(card, suit),
  { do: 'word', k: kind, v: word },
  flag(`leaf.${kind}.${card}`),
  reader(line),
];
// one question with two answers; each answer leads to its own nodes
const ask = (q, [a, thenA], [b, thenB]) => [reader(q), choice(opt(a, null, null, thenA), opt(b, null, null, thenB))];

const pickNumber = (line) => ({
  pick: 'number',
  then: [
    reader('{picked}. Non te la spiego. Esce adesso perché adesso serve.'),
    reader(line),
    choice(
      opt('Mi piace.', null, null, [reader('Annoto: le piace.')]),
      opt('Mi mette inquietudine.', null, null, [reader('Annoto: la inquieta. Spesso è lo stesso.')]),
    ),
  ],
});

const yourCardNow = [
  reader('La tua carta, adesso, è {yourCard}.'),
  IF(SAME_CARD,
    [reader('La stessa con cui sei nata. Resisti. O le carte non ti hanno ancora vista bene.')],
    [reader('Sei nata {birthCard}. Le carte, adesso, ti vedono diversa.')]),
];

// facts that hold for anyone at that point; the first true one is said
const FALLBACK = (t) => ({ when: true, t });

export const SESSIONS = {
  s0: [
    reader('Siediti. La candela è per te. Io vedo anche al buio.'),
    reader('Non ti chiedo perché sei qui. Ti chiedo chi sei.'),
    { ask: 'name' },
    reader('{name}. Lo dico piano, così le carte lo sentono.'),
    reader('E quando sei nata. Il giorno e il mese. Anche se non ti va: le carte contano i giorni.'),
    { ask: 'birth' },
    reader('{sign}. Nata in {season}.'),
    reader('La tua carta di nascita è {birthCard}. Non cambia. Non la scegli. Ti aspetta, da qualche parte.'),
    { turn: 'm00' },
    reader('Il Matto. Zero. Un passo sull\'orlo, un fagotto, un cane che abbaia.'),
    reader('Questa sei tu, adesso. Le altre carte verranno.'),
    reader('Una sola domanda, stanotte. Davanti a una porta chiusa: bussi, o cerchi la finestra?'),
    choice(
      opt('Busso.', 'm04', 'w', [reader('Bussi. Annoto.')], { flag: 's0.knock' }),
      opt('Cerco la finestra.', 'm02', 's', [reader('La finestra. Annoto.')], { flag: 's0.window' }),
    ),
    reader('Vai. Nevica, a Salem. Sulla strada c\'è qualcosa per te.'),
    step('p.road'),
    travel('village.arrival'),
  ],

  s1: [
    reader('Sei tornata. Hai le mani fredde e qualche carta in più.'),
    reader('Stanotte parliamo di ciò che conta per te.'),
    ...ask('Una sera libera. La passi con qualcuno o da sola?',
      ['Con qualcuno.', ask('Qualcuno che ti fa ridere, o qualcuno che ti dice la verità?',
        ['Che mi fa ridere.', leaf('value', 'allegria', 'm03', 'c', 'Ridere. Annoto: allegria.')],
        ['Che mi dice la verità.', leaf('value', 'sincerità', 'm11', 's', 'La verità. Annoto: sincerità.')])],
      ['Da sola.', ask('Da sola a fare cosa? Imparare qualcosa, o niente del tutto?',
        ['Imparare qualcosa.', leaf('value', 'conoscenza', 'm09', 'p', 'Imparare. Annoto: conoscenza.')],
        ['Niente del tutto.', leaf('value', 'libertà', 'm00', 'w', 'Niente. Annoto: libertà. È una parola grande.')])]),
    IF({ flag: 'b1.spoke' },
      [reader('In piazza hai parlato per una donna che non conoscevi. Lo rifaresti?')],
      [reader('In piazza hai taciuto, e una donna è stata portata via. Lo rifaresti?')]),
    choice(
      opt('Sì.', null, null, [reader('Sì. Annoto.')]),
      opt('Non lo so.', null, null, [reader('Non lo sai. È la risposta più onesta che sento da mesi.')]),
    ),
    { observe: [
      { when: { stat: ['jailed', '>=', 1] }, t: 'Hai dormito in cella {stat:jailed} volte. E sei uscita di nuovo a cercare carte.' },
      { when: { stat: ['examsFailed', '>=', 2] }, t: 'Ai conestabili hai sbagliato {stat:examsFailed} volte. Eppure esci ancora, di notte.' },
      { when: { stat: ['examsPassed', '>=', 3] }, t: 'Hai passato {stat:examsPassed} Esami. Ai conestabili sembri una ragazza istruita.' },
      { when: { flag: 'lied.constable' }, t: 'Al primo conestabile hai detto che eri di passaggio. Non lo eri.' },
      { when: { has: 'm03' }, t: 'All\'Imperatrice hai dato tre parole: {words:m03}. Le ho lette.' },
      { when: { has: 'm01' }, t: 'Al Mago hai dato tre parole: {words:m01}. Le ho lette.' },
      FALLBACK('Hai trovato {majors} carte. Ognuna ti ha guardata un po\'.'),
    ] },
    reader('Dimmi un numero. Da uno a ventidue.'),
    pickNumber('Guardala come hai guardato la neve, la prima notte.'),
    ...yourCardNow,
    reader('Vai. Il bosco è già verde.'),
  ],

  s2: [
    reader('Hanno preso la tua amica. Lo so. Siediti lo stesso.'),
    reader('Stanotte parliamo di paura. Piano.'),
    ...ask('Al buio, ti spaventa di più quello che senti, o quello che non senti?',
      ['Quello che sento.', ask('Un passo dietro di te. Ti giri, o corri?',
        ['Mi giro.', leaf('fear', 'non sapere', 'm18', 'c', 'Ti giri. Annoto: non sapere.')],
        ['Corro.', leaf('fear', 'essere presa', 'm15', 'p', 'Corri. Annoto: essere presa.')])],
      ['Quello che non sento.', ask('Il silenzio di una persona cara, o quello di una casa vuota?',
        ['Di una persona cara.', leaf('fear', 'essere lasciata', 'm06', 'c', 'Una persona. Annoto: essere lasciata.')],
        ['Di una casa vuota.', leaf('fear', 'restare sola', 'm09', 'p', 'Una casa. Annoto: restare sola.')])]),
    IF({ flag: 'b2.went' },
      [reader('Sei entrata nel deposito con lei. Avevi paura, quella notte?')],
      [reader('Quella notte l\'hai lasciata andare da sola. Ci pensi ancora?')]),
    choice(
      opt('Sì.', null, null, [reader('Sì. Annoto.')]),
      opt('Preferisco non dirlo.', null, null, [reader('Non lo dici. Annoto anche questo.')]),
    ),
    { observe: [
      { when: { stat: ['jailed', '>=', 2] }, t: 'In cella ci sei finita {stat:jailed} volte. Conosci già la strada per uscirne.' },
      { when: { stat: ['fires', '>=', 6] }, t: 'Hai acceso {stat:fires} fuochi. Chi ha paura del buio accende fuochi.' },
      { when: { stat: ['examsFailed', '>=', 3] }, t: 'Hai sbagliato {stat:examsFailed} Esami. La paura ti rallenta. Non ti ferma.' },
      { when: { stat: ['stuns', '>=', 1] }, t: 'Hai stordito {stat:stuns} conestabili. Con garbo, spero.' },
      { when: { has: 'm13' }, t: 'Alla Morte hai dato tre parole: {words:m13}. Nessuna fa paura.' },
      FALLBACK('Hai trovato {majors} carte. Le prossime dormono sotto i tuoi piedi.'),
    ] },
    reader('Dimmi un numero.'),
    pickNumber('Una carta pescata con la paura addosso dice la verità due volte.'),
    ...yourCardNow,
    reader('Scendi. Sotto il villaggio c\'è chi ti aspetta da molto.'),
  ],

  s3: [
    reader('L\'hai portata fuori. Lo so. Siediti, prima di cadere.'),
    reader('Stanotte parliamo di sogni. Quelli da sveglia.'),
    ...ask('Quando tutto questo finisce, ti vedi in un posto nuovo o in un posto tuo?',
      ['In un posto nuovo.', ask('Lontano da tutti, o con qualcuno accanto?',
        ['Lontano da tutti.', leaf('dream', 'partire', 'm10', 'w', 'Lontano. Annoto: partire.')],
        ['Con qualcuno accanto.', leaf('dream', 'compagnia', 'm14', 'c', 'Con qualcuno. Annoto: compagnia.')])],
      ['In un posto mio.', ask('Un posto pieno di libri, o pieno di piante?',
        ['Di libri.', leaf('dream', 'sapere', 'm02', 's', 'Libri. Annoto: sapere.')],
        ['Di piante.', leaf('dream', 'radici', 'm03', 'p', 'Piante. Annoto: radici.')])]),
    IF({ flag: 'b3.stealth' },
      [reader('Sei andata a prenderla dal buio, dalle cantine. Il buio ti ha obbedito.')],
      [reader('Sei entrata in tribunale e hai detto il tuo nome davanti a tutti.')]),
    choice(
      opt('Lo rifarei.', null, null, [reader('Lo rifaresti. Annoto.')]),
      opt('Tremavo.', null, null, [reader('Tremavi. E l\'hai fatto. Annoto le due cose insieme.')]),
    ),
    { observe: [
      { when: { stat: ['readings', '>=', 12] }, t: 'Hai letto le carte a {stat:readings} persone. Nessuna le ha lette a te.' },
      { when: { stat: ['examsPassed', '>=', 8] }, t: 'Hai passato {stat:examsPassed} Esami. Il Giudice lo sapeva.' },
      { when: { stat: ['locks', '>=', 5] }, t: 'Hai aperto {stat:locks} serrature con una risposta. Le porte ti conoscono.' },
      { when: { has: 'm17' }, t: 'Alla Stella hai dato tre parole: {words:m17}. Sembrano un sogno.' },
      { when: { has: 'm18' }, t: 'Alla Luna hai dato tre parole: {words:m18}. Tartufo ne sarà contento.' },
      FALLBACK('Hai trovato {majors} carte su ventidue. Ne manca una. È mia, per ora.'),
    ] },
    reader('Dimmi un numero. L\'ultimo che ti chiedo così.'),
    pickNumber('Questa la tieni per i giorni in cui dimentichi cosa sognavi.'),
    ...yourCardNow,
    reader('Riposa. La prossima volta il tavolo sarà diverso.'),
  ],

  s4: [
    reader('Stavolta non ti chiedo niente.'),
    reader('Ho annotato tutto: il tuo nome, la neve, la piazza, il fuoco, il buio.'),
    IF(SAME_CARD,
      [reader('Sei nata {birthCard} e sei rimasta {birthCard}. Pochi ci riescono.')],
      [reader('Sei nata {birthCard}. Sei diventata {yourCard}. Le carte lo hanno visto prima di te.')]),
    N('Le due mani spingono il mazzo verso di te, sul tavolo.'),
    reader('Adesso leggi tu. Per te.'),
    { do: 'reading', spread: 'celtic', client: 'self' },
    reader('Hai letto. Non ti dico se bene. Lo sai.'),
    reader('Ne manca una. L\'ho tenuta io fino ad adesso.'),
    give('m21'),
    reader('Il Mondo. Il cerchio che si chiude. Ventidue.'),
    choice(
      opt('Chi sei?', null, null, [reader('Guarda il tavolo.')]),
      opt('Grazie.', null, null, [reader('Guarda il tavolo.')]),
    ),
    N('Il tavolo, la candela. Ma adesso le mani che vedi sono le tue.'),
    N('Il grimorio aperto davanti a te ha la tua scrittura.'),
    N('Dall\'altra parte del tavolo, una sedia vuota. Aspetta qualcuno.'),
  ],
};
