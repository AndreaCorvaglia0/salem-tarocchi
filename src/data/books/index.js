// The books of Edera's library (notes/libri/CONCETTO.md; decisions of 18 Nov in lore/decisioni/): real books
// on the cover (real title, author, year, the title page of a real scan), our own words inside, and a last
// page «Che cosa è vero». One file per book; the shelf shows them in BOOK_LIST order, with a mark in the dust
// where one is still missing (never its title: lore/principi/vede-solo-quello-che-sa.md).
//
// A book: { id, spine, title, author, place, year, leather, from, voice?, shuffle?, pages, truth }
//   pages   [{ img, alt, text, tall?, note?: { by: 'edera'|'ortica'|'ignota'|'antica', t } }]  (6-10 pages)
//   truth   { text, links: [{ t, url }] }   the last page: what is from the real book and what is ours
//
// EARN: how each book reaches her (src/glue/books.js; the rules in src/glue/books.rules.js). Conditions use the
// keys of src/core/cond.js and depend on what she HAS, never on the step, so a save far ahead gets them too.
//   start   on the shelf from the beginning (does not count for the pace)
//   talk    given by `who` at the start of a free talk (like the gifts of src/data/gifts.js), after `afterGift`
//   home    left inside her cottage door: she finds it when she walks into the cottage
//   place   found in a place, inside the script of the prop that is there (`script`)
//   tartufo Tartufo brings it when they walk into a map together
// The pace: at most one new book a day (`start` and `place` excepted: a place keeps what it has).
//
// AFTER: what a book read to the end does (CONCETTO §7), one thing each, never announced:
//   note    a place note (src/data/world/notes.js, condition { flag: 'book.<id>.read' }, written out in `flag`)
//   ask     one exchange with `who`, the first free talk after reading it (once per person)
// `thought`: her own line when she closes the book the first time (optional, with a condition).
import agrippa from './agrippa.js';
import durante from './durante.js';
import artemidoro from './artemidoro.js';
import scot from './scot.js';
import voynich from './voynich.js';

export const BOOK_LIST = [agrippa, durante, artemidoro, scot, voynich];
export const BOOK = Object.fromEntries(BOOK_LIST.map((b) => [b.id, b]));

export const EARN = {
  agrippa: { how: 'start' },
  durante: { how: 'talk', who: 'ortica', say: 'ortica', afterGift: 'g.ortica.blood', when: { chapterMin: 2 },
    line: 'Prendi questo libro, che io non lo apro più: ogni volta mi viene voglia di litigare con un morto, e lui vince sempre perché è stampato.' },
  artemidoro: { how: 'home', map: 'cottage', when: { any: [{ trial: 'grave' }, [{ chapterMin: 2 }, { flag: 'client.c1.widow.done' }]] },
    lines: [['narra', 'Dietro la porta della capanna c\'è un libro legato con lo spago, e sotto lo spago un biglietto scritto storto.'],
      ['narra', '«Portatelo via voi. Il pastore passa il giovedì, e io non so più di chi fosse. La vedova Bray.»']] },
  scot: { how: 'place', script: 'prop.deposit', when: { chapterMin: 2 },
    lines: [['narra', 'In fondo a uno scaffale, dietro i mazzi, c\'è anche un libro grosso con il suo cartellino: «Sequestrato. Da bruciare». Nessuno l\'ha bruciato, e adesso è nella tua borsa.']] },
  voynich: { how: 'tartufo', say: 'tartufo', when: [{ power: 'cat' }, { flag: 'book.durante.read' }],
    line: '(L\'ho trovato. Non chiedermi dove. Ha le piante come il libro di Ortica, ma questo non lo sa leggere nessuno, nemmeno io.)' },
};

export const AFTER = {
  agrippa: { kind: 'note', place: 'village.library_door', flag: 'book.agrippa.read' },
  durante: { kind: 'ask', asks: [{ who: 'ortica', lines: [
    ['tu', 'Ortica, ho letto il tuo Durante. Dice che chi porta l\'artemisia addosso non si stanca per strada.'],
    ['ortica', 'Te l\'ho dato per leggerlo, mica per sentirmelo ripetere! Però sì, quella è vera: io ce l\'ho nella scarpa da trent\'anni, e cammino più del merlo.'],
    ['ortica', 'Il giusquiamo invece lascialo dov\'è, che non ha mai fatto bene a nessuno, nemmeno ai maiali.']] }],
    thought: { t: 'Questa la voglio raccontare a Ortica.' } },
  artemidoro: { kind: 'note', place: 'village.cottage_door', flag: 'book.artemidoro.read' },
  scot: { kind: 'ask', asks: [{ who: 'edera', lines: [
    ['tu', 'Edera, nel deposito del tribunale ho trovato un libro che dice che le streghe non esistono.'],
    ['edera', 'Lo conosco, cara, è quello del gentiluomo del Kent. Ha ragione su quasi tutto: le povere vecchie, i giochi di mano, i giudici che non vedono niente.'],
    ['edera', 'Quasi, però. E adesso che l\'hai letto, tienilo nascosto meglio di come l\'avevano nascosto loro.']] }],
    thought: { when: { chapterMin: 3 }, t: 'Voglio sapere che cosa ne pensa Nonna Edera.' } },
  voynich: { kind: 'ask', asks: [
    { who: 'ortica', lines: [
      ['tu', 'Ortica, Tartufo mi ha portato un libro di piante che nessuno sa leggere.'],
      ['ortica', 'Fammi vedere. Questa è... no. Questa allora è... nemmeno. Sai che ti dico? È l\'erbario di un posto che non esiste più, o che non esiste ancora, e io in quei posti non ci vado senza scarpe buone.']] },
    { who: 'edera', lines: [
      ['tu', 'Edera, tu lo sai leggere questo libro? Me l\'ha portato Tartufo.'],
      ['edera', 'No, cara, e alla mia età ho smesso di far finta. Ma i libri che nessuno sa leggere sono i più tranquilli: tengono i loro segreti meglio di noi.']] }],
    thought: { t: 'Lo farò vedere a qualcuno che ne sa più di me.' } },
};

// The words of a page, for the limits (tests/books.test.mjs)
export const words = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;
export const LIMITS = { page: 60, front: 35, note: 20, truth: 80, minPages: 6, maxPages: 10 };
