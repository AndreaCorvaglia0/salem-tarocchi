// The deck: ids, names, numbers, astrology (Golden Dawn), chapter and hiding place.
// This file is the single source for what a card IS. The full sheets (what you see, what it says,
// keywords, reversed, positions...) are in data/cards.js, which extends these entries.
// Images: public/cards/<id>.webp (350x600).

const R = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

// [name, astro kind, astro name, three words, spot (anchor in the world), how it is found]
const M = [
  ['Il Matto', 'element', 'Aria', ['inizio', 'salto', 'fiducia'], null, 'prologue'],
  ['Il Mago', 'planet', 'Mercurio', ['volontà', 'mezzi', 'agire'], 'village.stall', 'spot'],
  ['La Sacerdotessa', 'planet', 'Luna', ['intuito', 'conoscenza', 'segreti'], 'village.curtain', 'spot'],
  ["L'Imperatrice", 'planet', 'Venere', ['abbondanza', 'cura', 'natura'], 'village.garden', 'spot'],
  ["L'Imperatore", 'sign', 'Ariete', ['ordine', 'autorità', 'struttura'], 'court.chair', 'spot'],
  ['Il Papa', 'sign', 'Toro', ['tradizione', 'insegnamento', 'regole'], 'meeting.bible', 'spot'],
  ['Gli Amanti', 'sign', 'Gemelli', ['scelta', 'unione', 'valori'], 'village.venusglass', 'spot'],
  ['Il Carro', 'sign', 'Cancro', ['determinazione', 'controllo', 'vittoria'], 'village.cart', 'spot'],
  ['La Forza', 'sign', 'Leone', ['coraggio gentile', 'pazienza', 'domare'], 'forest.den', 'spot'],
  ["L'Eremita", 'sign', 'Vergine', ['solitudine', 'ricerca', 'guida'], 'forest.lantern', 'spot'],
  ['La Ruota della Fortuna', 'planet', 'Giove', ['cicli', 'sorte', 'svolta'], 'forest.mill', 'spot'],
  ['La Giustizia', 'sign', 'Bilancia', ['verità', 'conseguenze', 'equilibrio'], 'forest.boundary', 'spot'],
  ["L'Appeso", 'element', 'Acqua', ['sospensione', 'resa', 'altro sguardo'], 'forest.pond', 'spot'],
  ['La Morte', 'sign', 'Scorpione', ['fine', 'trasformazione', 'lasciar andare'], 'forest.graveyard', 'spot'],
  ['La Temperanza', 'sign', 'Sagittario', ['misura', 'mescolare', 'guarire'], 'forest.spring', 'spot'],
  ['Il Diavolo', 'sign', 'Capricorno', ['catene', 'dipendenza', 'ombra'], 'depths.chains', 'spot'],
  ['La Torre', 'planet', 'Marte', ['crollo', 'rivelazione', 'improvviso'], 'depths.tower', 'spot'],
  ['La Stella', 'sign', 'Acquario', ['speranza', 'quiete', 'rinnovarsi'], 'depths.well', 'spot'],
  ['La Luna', 'sign', 'Pesci', ['illusione', 'paura', 'sogno'], 'depths.swamp', 'spot'],
  ['Il Sole', 'planet', 'Sole', ['gioia', 'chiarezza', 'vita'], null, 'story'], // dawn after the rescue
  ['Il Giudizio', 'element', 'Fuoco', ['risveglio', 'chiamata', 'resa dei conti'], null, 'story'], // the trial
  ['Il Mondo', 'planet', 'Saturno', ['compimento', 'integrazione', 'arrivo'], null, 'story'], // from the Reader, last session
];

const pad = (n) => String(n).padStart(2, '0');
export const MAJORS = M.map(([name, kind, astroName, words, spot, via], n) => ({
  id: `m${pad(n)}`, n, roman: R[n], name, arcana: 'major',
  astro: { kind, name: astroName },
  row: n === 0 ? 0 : Math.ceil(n / 7), // 0 the Fool, 1..3 the three rows of seven = chapters
  words, spot, via,
}));

export const SUITS = {
  w: { id: 'w', name: 'Bastoni', element: 'Fuoco', trait: 'volontà', signs: ['Ariete', 'Leone', 'Sagittario'], zone: 'woods' },
  c: { id: 'c', name: 'Coppe', element: 'Acqua', trait: 'cuore', signs: ['Cancro', 'Scorpione', 'Pesci'], zone: 'river' },
  s: { id: 's', name: 'Spade', element: 'Aria', trait: 'testa', signs: ['Gemelli', 'Bilancia', 'Acquario'], zone: 'heights' },
  p: { id: 'p', name: 'Denari', element: 'Terra', trait: 'concretezza', signs: ['Toro', 'Vergine', 'Capricorno'], zone: 'market' },
};
const RANKS = ['Asso', 'Due', 'Tre', 'Quattro', 'Cinque', 'Sei', 'Sette', 'Otto', 'Nove', 'Dieci', 'Fante', 'Cavaliere', 'Regina', 'Re'];
export const MINORS = Object.values(SUITS).flatMap((s) => RANKS.map((rank, i) => ({
  id: `${s.id}${pad(i + 1)}`, n: i + 1, rank, suit: s.id, name: `${rank} di ${s.name}`, arcana: 'minor',
  astro: { kind: 'element', name: s.element },
  rarity: i === 0 ? 'uncommon' : i >= 10 ? 'rare' : 'common',
})));

export const CARDS = [...MAJORS, ...MINORS];
export const CARD = Object.fromEntries(CARDS.map((c) => [c.id, c]));
export const majorsOfRow = (row) => MAJORS.filter((c) => c.row === row);

// Zodiac sign -> its Major Arcana (the birth card), element and suit.
export const SIGNS = [
  { id: 'ariete', name: 'Ariete', card: 'm04', element: 'Fuoco', suit: 'w', from: [3, 21] },
  { id: 'toro', name: 'Toro', card: 'm05', element: 'Terra', suit: 'p', from: [4, 20] },
  { id: 'gemelli', name: 'Gemelli', card: 'm06', element: 'Aria', suit: 's', from: [5, 21] },
  { id: 'cancro', name: 'Cancro', card: 'm07', element: 'Acqua', suit: 'c', from: [6, 21] },
  { id: 'leone', name: 'Leone', card: 'm08', element: 'Fuoco', suit: 'w', from: [7, 23] },
  { id: 'vergine', name: 'Vergine', card: 'm09', element: 'Terra', suit: 'p', from: [8, 23] },
  { id: 'bilancia', name: 'Bilancia', card: 'm11', element: 'Aria', suit: 's', from: [9, 23] },
  { id: 'scorpione', name: 'Scorpione', card: 'm13', element: 'Acqua', suit: 'c', from: [10, 23] },
  { id: 'sagittario', name: 'Sagittario', card: 'm14', element: 'Fuoco', suit: 'w', from: [11, 22] },
  { id: 'capricorno', name: 'Capricorno', card: 'm15', element: 'Terra', suit: 'p', from: [12, 22] },
  { id: 'acquario', name: 'Acquario', card: 'm17', element: 'Aria', suit: 's', from: [1, 20] },
  { id: 'pesci', name: 'Pesci', card: 'm18', element: 'Acqua', suit: 'c', from: [2, 19] },
];
// Quality and traditional ruler of each sign; the planet of each weekday; the Major of each planet.
export const SIGN_LORE = {
  ariete: { modality: 'cardinale', ruler: 'Marte' }, toro: { modality: 'fisso', ruler: 'Venere' },
  gemelli: { modality: 'mobile', ruler: 'Mercurio' }, cancro: { modality: 'cardinale', ruler: 'Luna' },
  leone: { modality: 'fisso', ruler: 'Sole' }, vergine: { modality: 'mobile', ruler: 'Mercurio' },
  bilancia: { modality: 'cardinale', ruler: 'Venere' }, scorpione: { modality: 'fisso', ruler: 'Marte' },
  sagittario: { modality: 'mobile', ruler: 'Giove' }, capricorno: { modality: 'cardinale', ruler: 'Saturno' },
  acquario: { modality: 'fisso', ruler: 'Saturno' }, pesci: { modality: 'mobile', ruler: 'Giove' },
};
// index = Date.getDay() (0 Sunday)
export const WEEKDAYS = [
  { name: 'domenica', planet: 'Sole' }, { name: 'lunedì', planet: 'Luna' }, { name: 'martedì', planet: 'Marte' },
  { name: 'mercoledì', planet: 'Mercurio' }, { name: 'giovedì', planet: 'Giove' }, { name: 'venerdì', planet: 'Venere' },
  { name: 'sabato', planet: 'Saturno' },
];
export const PLANET_CARD = { Luna: 'm02', Marte: 'm16', Mercurio: 'm01', Giove: 'm10', Venere: 'm03', Saturno: 'm21', Sole: 'm19' };
// The weekday of a full date (null without the year).
export const weekdayOf = ({ d, m, y } = {}) => (y && m && d ? WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] : null);
// The moon on that day (noon UTC): a mean synodic month from the new moon of 6 January 2000, 18:14 UTC.
export const SYNODIC = 29.530588853;
const NEW_MOON_2000 = Date.UTC(2000, 0, 6, 18, 14);
export const moonAge = ({ d, m, y } = {}) => {
  if (!(y && m && d)) return null;
  const days = (Date.UTC(y, m - 1, d, 12) - NEW_MOON_2000) / 86400000;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
};
export const moonOf = (birth) => {
  const a = moonAge(birth || {});
  if (a == null) return null;
  const k = a / SYNODIC;
  return k < 1 / 8 || k >= 7 / 8 ? 'nuova' : k < 3 / 8 ? 'crescente' : k < 5 / 8 ? 'piena' : 'calante';
};
export const signOf = (d, m) => {
  // the sign whose start is the latest one not after (m, d); January before the 20th is Capricorn
  const key = m * 100 + d;
  const sorted = [...SIGNS].sort((a, b) => a.from[0] * 100 + a.from[1] - (b.from[0] * 100 + b.from[1]));
  let found = sorted[sorted.length - 1]; // Capricorn wraps the year
  for (const s of sorted) if (s.from[0] * 100 + s.from[1] <= key) found = s;
  return found;
};

// People of the story, and the card each one embodies (it helps to remember the card).
export const PEOPLE = {
  malva: { id: 'malva', name: 'Comare Malva', short: 'Malva', card: 'm03', role: 'Maestra della carta singola. Levatrice: brusca, non ringrazia mai.' },
  ortica: { id: 'ortica', name: 'Ortica', short: 'Ortica', card: 'm01', role: 'Maestra del passato-presente-futuro. Vive nel bosco, parla senza sosta.' },
  edera: { id: 'edera', name: 'Nonna Edera', short: 'Edera', card: 'm02', role: 'Maestra della croce celtica. Vecchissima: scorda il tuo nome, ricorda ogni carta.' },
  ginepra: { id: 'ginepra', name: 'Ginepra', short: 'Ginepra', card: 'm07', role: 'Novizia come te. Impulsiva. Rivale, poi amica.' },
  tartufo: { id: 'tartufo', name: 'Tartufo', short: 'Tartufo', card: 'm18', role: 'Gatto nero. Commenta.' },
  giudice: { id: 'giudice', name: 'Il Giudice', short: 'Giudice', card: 'm04', role: 'Educato, paziente, convinto di fare il bene.' },
  lettrice: { id: 'lettrice', name: 'La Lettrice', short: 'Lettrice', card: null, role: 'La voce delle sedute.' },
  conestabile: { id: 'conestabile', name: 'Conestabile', short: 'Conestabile', card: null, role: 'Ti ferma per strada: l\'Esame.' },
  afflitta: { id: 'afflitta', name: 'Un\'Afflitta', short: 'Afflitta', card: null, role: 'Ti indica col dito.' },
  bottegaio: { id: 'bottegaio', name: 'Il bottegaio', short: 'Bottegaio', card: null, role: 'Vende cose che non dovrebbero esserci.' },
  tu: { id: 'tu', name: 'Tu', short: 'Tu', card: 'm00', role: 'La novizia.' },
};
