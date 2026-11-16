// Asking the cards (docs/DESIGN.md, "Un solo gesto: chiedere alle carte"). Pure: no DOM, no state writes.
// She draws one card by instinct from the cards she knows and the card is the clue for a decision.
// Three kinds, all data:
//   segno    options carry `sign: 'go' | 'slow' | 'stop'`; right = the sign of the face's `favore`
//            (> 0 go, < 0 stop, 0 the cautious option: 'slow' if offered, else 'stop').
//   idea     options carry `tags` describing what that way stands for; right = the one option whose tags
//            match the drawn face. The engine only deals faces that match exactly one option.
//   quesito  the same matching, plus a `rule` said in words above the options (a property of the card:
//            suit, number group, favourable or contrary, beginning or end, Major or Minor).
// Tags (all given keys must hold; a list means any of):
//   suit: 'w'|'c'|'s'|'p'|'major'   moto: 'inizia'|'cresce'|'ferma'|'chiude'|'torna'
//   favore: '+'|'-'|'0'             group: '1-3'|'4-6'|'7-10'|'court'   arcana: 'major'|'minor'
//   rev: true|false                 cards: [ids]   words: [...] (any of them inside the essenza)
import { CARD } from '../data/cards.base.js';
import { voice } from '../reading/voices.js';
import { minorTaught } from '../glue/lessons.rules.js';

const list = (v) => (Array.isArray(v) ? v : [v]);
export const groupOf = (n) => (n <= 3 ? '1-3' : n <= 6 ? '4-6' : n <= 10 ? '7-10' : 'court');
const signOfFavore = (f) => (f > 0 ? '+' : f < 0 ? '-' : '0');

// Everything the engine knows of one face of a card: { id, rev, arcana, suit, n, group, favore, moto, essenza }.
export function faceOf(id, rev = false) {
  const c = CARD[id], v = voice(id)?.[rev ? 'rev' : 'up'];
  if (!c || !v) return null;
  const major = c.arcana === 'major';
  return { id, rev: !!rev, arcana: c.arcana, suit: major ? 'major' : c.suit, n: c.n, group: major ? null : groupOf(c.n), favore: v.favore, moto: v.moto, essenza: v.essenza || '' };
}

const TAG = {
  suit: (v, f) => list(v).includes(f.suit),
  moto: (v, f) => list(v).includes(f.moto),
  favore: (v, f) => list(v).map(String).includes(signOfFavore(f.favore)),
  group: (v, f) => list(v).includes(f.group),
  arcana: (v, f) => list(v).includes(f.arcana),
  rev: (v, f) => !!v === f.rev,
  cards: (v, f) => list(v).includes(f.id),
  words: (v, f) => list(v).some((w) => f.essenza.toLowerCase().includes(String(w).toLowerCase())),
};
export function matches(tags, face) {
  if (!tags || !face) return false;
  const keys = Object.keys(tags).filter((k) => TAG[k]);
  return keys.length > 0 && keys.every((k) => TAG[k](tags[k], face));
}

// segno: which sign the face gives, against the options offered
export function signFor(face, options) {
  if (face.favore > 0) return 'go';
  if (face.favore < 0) return 'stop';
  return options.some((o) => o.sign === 'slow') ? 'slow' : 'stop';
}

// The indices of the options that are right for this face.
export function rightOptions(kind, options, face) {
  if (!face || !Array.isArray(options)) return [];
  if (kind === 'segno') { const s = signFor(face, options); return options.map((o, i) => (o.sign === s ? i : -1)).filter((i) => i >= 0); }
  return options.map((o, i) => (matches(o.tags, face) ? i : -1)).filter((i) => i >= 0);
}
// a face is a fair deal when exactly one option is right
export const fair = (kind, options, face) => rightOptions(kind, options, face).length === 1;

// The cards she knows: the Majors she holds; the Minors whose suit and number she has been taught.
// Reversed faces only after the lesson on reversed cards (flag `lesson.reversed`).
export function knownPool(s) {
  const ids = Object.keys(CARD).filter((id) => {
    const c = CARD[id];
    if (c.arcana === 'major') return !!s.cards?.[id]?.found && !s.cards[id].confiscated;
    return minorTaught(id, s.flags || {}) && !s.cards?.[id]?.confiscated;
  });
  return { ids, reversed: !!s.flags?.['lesson.reversed'] };
}

// Every fair face among ids (both orientations when reversed is allowed). [{ id, rev }]
export function fairFaces(kind, options, ids, reversed = false) {
  const out = [];
  for (const id of ids) for (const rev of reversed ? [false, true] : [false]) {
    const f = faceOf(id, rev);
    if (f && fair(kind, options, f)) out.push({ id, rev });
  }
  return out;
}

// dealFor(options, pool, rng, { kind, reversed }) -> { id, rev } a face that makes exactly one option right,
// or null when the pool has none. Every option gets an even chance of being the right one, so the right
// door is not always the one most cards point to.
export function dealFor(options, pool, rng = Math.random, { kind = 'idea', reversed = false } = {}) {
  const faces = fairFaces(kind, options, pool, reversed);
  if (!faces.length) return null;
  const byRight = new Map();
  for (const f of faces) { const k = rightOptions(kind, options, faceOf(f.id, f.rev))[0]; if (!byRight.has(k)) byRight.set(k, []); byRight.get(k).push(f); }
  const keys = [...byRight.keys()];
  const bucket = byRight.get(keys[Math.floor(rng() * keys.length)]);
  return bucket[Math.floor(rng() * bucket.length)];
}

// The fan she picks from: up to n distinct cards, each with the orientation the engine fixes for it (all
// fair). With few fair faces the fan is smaller. -> [{ id, rev }]
export function dealFan(options, pool, rng = Math.random, { kind = 'idea', reversed = false, n = 5 } = {}) {
  const out = [], used = new Set();
  for (let tries = 0; out.length < n && tries < n * 12; tries++) {
    const f = dealFor(options, pool.filter((id) => !used.has(id)), rng, { kind, reversed });
    if (!f) break;
    used.add(f.id); out.push(f);
  }
  return out;
}

// askCards({ pool, rng, kind, options, reversed }) -> the decision, ready for the screen:
//   { kind, options, rule, by, fan: [{ id, rev }], widened } or null if no card can be dealt.
// pool: ids she may draw (knownPool); when none of them is fair the whole deck is used (widened: true).
export function askCards({ pool, rng = Math.random, kind = 'segno', options = [], rule = null, by = null, reversed = false, n = 5 } = {}) {
  let fan = dealFan(options, pool || [], rng, { kind, reversed, n });
  let widened = false;
  if (!fan.length) { fan = dealFan(options, Object.keys(CARD), rng, { kind, reversed, n }); widened = true; }
  if (!fan.length) return null;
  return { kind, options, rule, by, fan, widened };
}

// The judgement after she chose option k for the face she drew.
// -> { ok, right: index, face, said } said: one plain Italian line, what the card was saying.
export function judge(decision, face, k) {
  const right = rightOptions(decision.kind, decision.options, face)[0];
  const ok = k === right;
  return { ok, right, face, said: saidLine(decision, face, right) };
}

const SUIT_IT = { w: 'di Bastoni', c: 'di Coppe', s: 'di Spade', p: 'di Denari', major: 'degli Arcani Maggiori' };
const MOTO_IT = { inizia: 'di un inizio', cresce: 'di qualcosa che cresce', ferma: 'di qualcosa che si ferma', chiude: 'di una fine', torna: 'di qualcosa che ritorna' };
// the property a quesito turns on, in words ("una carta di Coppe", "una carta che parla di una fine")
export function propertyLine(face, by) {
  if (by === 'suit') return `una carta ${SUIT_IT[face.suit]}`;
  if (by === 'group') return face.group === 'court' ? 'una figura di corte' : `un numero dal ${face.group.replace('-', ' al ')}`;
  if (by === 'favore') return face.favore > 0 ? 'una carta favorevole' : face.favore < 0 ? 'una carta contraria' : 'una carta né favorevole né contraria';
  if (by === 'moto') return `una carta che parla ${MOTO_IT[face.moto] || 'di un passaggio'}`;
  if (by === 'arcana') return face.arcana === 'major' ? 'un Arcano Maggiore' : 'un Arcano Minore';
  return 'quella carta';
}
// What the card said, from templates by kind (plain Italian, second person kept out: the card speaks).
export function saidLine(decision, face, right) {
  const opt = decision.options[right];
  const turned = face.rev ? ', rovesciata' : '';
  if (decision.kind === 'segno') {
    if (face.favore > 0) return `Era una carta favorevole${turned}: diceva di andare.`;
    if (face.favore < 0) return `Era una carta contraria${turned}: diceva di fermarsi.`;
    return `Era una carta né favorevole né contraria${turned}: diceva di andare piano.`;
  }
  const way = String(opt?.text || '').replace(/\.$/, '');
  if (decision.kind === 'quesito') return `Era ${propertyLine(face, decision.by)}${turned}, e la regola portava a «${way}».`;
  return `Diceva «${String(face.essenza).replace(/\.$/, '')}», e per questo indicava «${way}».`;
}
