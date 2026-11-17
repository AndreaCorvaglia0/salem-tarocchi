// The pure part of the Mappa page's missions (no DOM, tests call it): which slips go where, what is done,
// what was done since the grimoire was last opened, and the small numbers written as words.
// Inputs: core/extras.js extrasShown() items ({ id, at, text, status, tracked }), logic.js nextStep() ({ text, at }).
import { placeOf, REGION_OF } from '../sketchmap.js';
import { cardOf } from './titles.js';

// Caveat's digits are easy to misread (a «7» was read as «?»): small numbers are written as words
const UNITS = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci',
  'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const TENS = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];
export function inWords(n, { fem = false } = {}) {
  n = Math.floor(Number(n) || 0);
  if (n < 0 || n > 99) return String(n);
  if (n === 1) return fem ? 'una' : 'uno';
  if (n < 20) return UNITS[n];
  const t = TENS[Math.floor(n / 10)], u = n % 10;
  if (!u) return t;
  return (u === 1 || u === 8 ? t.slice(0, -1) : t) + (u === 3 ? 'tré' : UNITS[u]);
}
// «quattro cose in più da fare» (remaining, optional) / «una cosa in più da fare»
export const regionCount = (n) => (n ? `${inWords(n, { fem: true })} ${n === 1 ? 'cosa' : 'cose'} in più da fare` : '');
export const doneLine = (n) => `Cose in più già fatte: ${inWords(n, { fem: true })}`;
// from this many optional things at one place they are a stack on the map (page.js), not a row
export const STACK = 3;
// under two or more slips at one place
export const hereCount = (n) => (n > 1 ? `${inWords(n, { fem: true })} qui` : '');

// Done things shown once as «fatta» at their place: done since the grimoire was last opened.
// state.extrasAck: ids of done things already shown once; null = a save from before this (everything is
// acknowledged, nothing shows as just done). Mutates s.extrasAck; returns { fresh: [ids], dirty }.
export function ackDone(s, items) {
  const first = s.extrasAck == null;
  const ack = s.extrasAck && typeof s.extrasAck === 'object' ? s.extrasAck : (s.extrasAck = {});
  const fresh = [];
  let dirty = first;
  for (const e of items) if (e.status === 'done' && !ack[e.id]) { if (!first) fresh.push(e.id); ack[e.id] = true; dirty = true; }
  return { fresh, dirty };
}

// The model of the page: what she follows, the done list (folded), and the pins: one per place with open
// things (the story's star first), and one per place for the things just done.
//   pins: [{ key, place, region, done, slips: [{ id, main, on, isNew, done, sym, title, kindWord }], count }]
export function missionsModel({ items = [], main = { text: '', at: null }, fresh = [] } = {}) {
  const open = items.filter((e) => e.status !== 'done');
  const tracked = open.find((e) => e.tracked) || null;
  const freshDone = items.filter((e) => e.status === 'done' && fresh.includes(e.id));
  const done = [...freshDone, ...items.filter((e) => e.status === 'done' && !fresh.includes(e.id))]
    .map((e) => ({ id: e.id, title: cardOf(e).title, place: placeOf(e.at) }));
  const pins = new Map();
  const pin = (place, isDone) => {
    const key = `${place}${isDone ? ':done' : ''}`;
    if (!pins.has(key)) pins.set(key, { key, place, region: REGION_OF(place), done: isDone, slips: [], count: 0 });
    return pins.get(key);
  };
  const mainPlace = placeOf(main.at);
  if (mainPlace) pin(mainPlace, false).slips.push({ id: null, main: true, on: !tracked, isNew: false, done: false, sym: 'storiaMain', title: 'la storia', kindWord: 'la storia' });
  for (const e of open) {
    const p = placeOf(e.at); if (!p) continue;
    const c = cardOf(e), g = pin(p, false);
    g.slips.push({ id: e.id, main: false, on: !!e.tracked, isNew: e.status === 'new', done: false, sym: c.sym, title: c.title, kindWord: c.kindWord, who: c.who });
    g.count += 1;
  }
  for (const e of freshDone) {
    const p = placeOf(e.at); if (!p) continue;
    const c = cardOf(e);
    pin(p, true).slips.push({ id: e.id, main: false, on: false, isNew: false, done: true, sym: c.sym, title: c.title, kindWord: c.kindWord, who: c.who });
  }
  const perRegion = {};
  for (const e of open) { const r = REGION_OF(placeOf(e.at)); if (r) perRegion[r] = (perRegion[r] || 0) + 1; }
  return { open, tracked, freshDone, done, pins: [...pins.values()], perRegion, mainPlace };
}
