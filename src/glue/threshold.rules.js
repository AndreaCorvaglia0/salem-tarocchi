// The threshold (docs/DESIGN.md "La soglia"), pure rules. Tests: tests/threshold.test.mjs.
//   state.moon  = { n: 0..7, last: 'YYYY-MM-DD' | null, cycles }   one slice a day she does something
//   state.day   = { date, card, turned, v }                        the card of the day (v: which sentence)
//   state.daily = { secrets: { id: true }, notes: n }              secrets read; notes shown so far
export const MOON = 7;
const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

// One more slice for today (once a day). A full moon stays full for its day and starts again at the next.
// -> { moon, grew, full } (moon is a new object; `full` only on the day it fills)
export function growMoon(moon, today) {
  const m = { n: Math.max(0, Math.min(MOON, Number(moon?.n) || 0)), last: moon?.last || null, cycles: Number(moon?.cycles) || 0 };
  if (m.last === today) return { moon: m, grew: false, full: false };
  if (m.n >= MOON) m.n = 0;
  m.n += 1; m.last = today;
  const full = m.n === MOON;
  if (full) m.cycles += 1;
  return { moon: m, grew: true, full };
}
// what the title shows before anything is done today: a moon that was full on an earlier day is new again
export const moonShown = (moon, today) => ((Number(moon?.n) || 0) >= MOON && moon?.last !== today ? 0 : Math.max(0, Math.min(MOON, Number(moon?.n) || 0)));
export const moonName = (n) => (n <= 0 ? 'Luna nuova' : n >= MOON ? 'Luna piena' : n === 1 ? 'Primo spicchio' : n < 4 ? 'Luna crescente' : n === 4 ? 'Mezza luna' : 'Luna gibbosa');
// the lit part of a disc of radius r centred on (cx, cy), growing from the right: an SVG path
export function moonPath(n, r = 36, cx = 37, cy = 37) {
  const f = Math.max(0, Math.min(1, n / MOON));
  if (f <= 0) return '';
  if (f >= 1) return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0z`;
  const rx = Math.abs(1 - 2 * f) * r;
  return `M${cx},${cy - r}A${r},${r} 0 0,1 ${cx},${cy + r}A${rx.toFixed(2)},${r} 0 0,${f < 0.5 ? 0 : 1} ${cx},${cy - r}z`;
}

// The card of the day: the one already drawn today (the cottage bed draws it too), else one of all the
// cards, the same all day for the same player. -> { date, card, turned, v }
export function dayOf(day, today, ids, seed = '') {
  if (day?.date === today && day.card && ids.includes(day.card)) return { date: today, card: day.card, turned: !!day.turned, v: day.v === 1 ? 1 : 0 };
  const x = hash(`${today}|${seed}`);
  return { date: today, card: ids[x % ids.length], turned: false, v: (x >>> 8) % 2 };
}

// The note of the day: now and then one written for this weekday or this month, else the next of a fixed
// shuffle, so nothing repeats until all have been read. `shown` = notes shown so far (one more each new day).
export function noteOf(notes, date, shown = 0) {
  if (!notes?.length) return null;
  const d = new Date(`${date}T12:00:00`), wd = d.getDay(), mo = d.getMonth() + 1;
  const x = hash(date);
  const tagged = notes.filter((n) => n.day === wd || n.month === mo);
  if (tagged.length && x % 4 === 0) return tagged[(x >>> 4) % tagged.length];
  const free = notes.filter((n) => n.day == null && n.month == null);
  const order = free.map((n, i) => [hash(`n${i}`), n]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return order.length ? order[shown % order.length] : notes[x % notes.length];
}

// The two cards for the short review: the ones due longest, then the ones she knows least.
export function reviewPair(cards = {}, now = Date.now()) {
  const own = Object.keys(cards).filter((id) => cards[id]?.found && !cards[id]?.confiscated);
  const key = (id) => { const c = cards[id]; const due = c.due || 0; return [due <= now ? 0 : 1, due <= now ? due : (c.stars || 0), due]; };
  return own.sort((a, b) => { const A = key(a), B = key(b); return A[0] - B[0] || A[1] - B[1] || A[2] - B[2] || (a < b ? -1 : 1); }).slice(0, 2);
}

// The gift of a full moon: small things that exist already, never anything the story needs.
export const GIFTS = [
  { treats: 1, coins: 4 }, { coins: 7 }, { treats: 2 }, { treats: 1, coins: 6 },
  // a seed of a herb from her herbarium (glue/threshold.js picks it: garden.rules.js moonSeed), and a few coins
  { seed: 1, coins: 2 },
];
export const giftOf = (cycles) => GIFTS[(Math.max(1, cycles) - 1) % GIFTS.length];
export const READER_LINES = [
  'Sette notti hai aperto la porta. Le carte non contano i giorni, ma si accorgono di chi torna.',
  'La luna è piena e tu sei ancora qui. Chi impara piano impara per sempre.',
  'Un mazzo si scalda nelle mani che lo toccano spesso. Il tuo comincia a riconoscerti.',
  'Hai guardato una carta per sette notti. È così che una figura diventa una faccia amica.',
  'Non serve leggere tanto. Serve tornare. Stanotte la luna te lo dice meglio di me.',
  'Sette spicchi, una luna. Anche le cose grandi si fanno una notte alla volta.',
];
export const readerLine = (cycles) => READER_LINES[(Math.max(1, cycles) - 1) % READER_LINES.length];
export const giftText = (g) => [g.seed ? (g.seedName ? `un seme di ${g.seedName}` : 'un seme per l\'orto') : null, g.treats ? (g.treats === 1 ? 'un manicaretto per Tartufo' : `${g.treats} manicaretti per Tartufo`) : null, g.coins ? `${g.coins} monete` : null].filter(Boolean).join(' e ');
