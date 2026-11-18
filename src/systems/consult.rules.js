// The rules of a client reading done with the reading engine (src/reading/), as pure functions: when the
// engine is used, the question of a client, the help note of a card, good or doubtful, the pay.
// The flow on screen: consult.js. Tests: tests/play.consult.test.mjs.
import { makeQuestion, hasVoice } from '../reading/index.js';
import { CARD } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { SEMI, NUMERI, FIGURE } from '../data/reading/grid.js';
import { DEFS } from '../data/world/index.js';

// Which cards a client reading can use. owned: ids she owns; given: what the story prepared per position
// ('fan' | 'number' | 'top' | id | null each, or undefined); n: positions of the spread.
// -> { use, pool }: use is true only when every card she can draw has a voice and there are enough of them.
// The pool is never hard-coded: it is whatever owned card has a voice file today.
// self: the final reading for herself (client 'self', glue/finale.js) asks to use the engine too.
// taught(id): a Minor whose number group she has not been taught yet stays out of client readings
// (glue/lessons.rules.js minorTaught); Majors always pass. The final reading for herself takes everything.
export function engineFor({ client, n, owned = [], given, voiced = hasVoice, self = false, taught = () => true }) {
  if (!client || (client === 'self' && !self) || !n) return { use: false, pool: [] };
  const pool = [...new Set(owned)].filter((id) => voiced(id) && (self || taught(id)));
  const fixed = (given || []).slice(0, n).filter((g) => g && g !== 'fan' && g !== 'number' && g !== 'top');
  if (fixed.some((id) => !voiced(id))) return { use: false, pool };
  const free = pool.filter((id) => !fixed.includes(id));
  return { use: free.length >= n - fixed.length, pool };
}

// The question object of a client (tags in data/story/clients.js); null when a tag is missing or wrong.
export function questionOf(client) {
  if (!client) return null;
  if (client === 'self') client = { ambito: 'se', forma: 'quadro' }; // the finale: a general picture of herself
  const forma = client.forma || (client.question == null ? 'quadro' : null);
  try { return makeQuestion({ ambito: client.ambito, forma, ref: client.ref }); } catch { return null; }
}

// The position label in plain words ("Passato", "La carta"); the cross keeps its own labels.
const PLAIN = { ppf: { past: 'Passato', present: 'Presente', future: 'Futuro' } };
export const posLabel = (spread, i) => (spread.positions.length === 1 ? 'La carta' : PLAIN[spread.id]?.[spread.positions[i].id] || spread.positions[i].label);

// The «Ricordamela» note: a cue to remember the card, never its words (lore/principi/la-domanda-non-mostra-la-
// risposta.md; docs/BACKLOG.md 1.4). The note opens before she answers, so it must not hold the answer.
// Major: { kind: 'major', name, words: [where she found it, one line], says: two things to look at in the
//   picture, as questions }. Minor: { kind: 'minor', name, line: where the number sits in the row and the
//   element of the suit } ('Cinque: viene dopo il quattro, la sosta · Coppe: l'acqua').
// The shape is the one consult.js already draws (words joined by ' · ', then says; or the line).
const NUM_NAME = { 1: 'Asso', 2: 'Due', 3: 'Tre', 4: 'Quattro', 5: 'Cinque', 6: 'Sei', 7: 'Sette', 8: 'Otto', 9: 'Nove', 10: 'Dieci' };
const ANCHORS = Object.fromEntries(DEFS.flatMap((d) => Object.entries(d.anchors || {}).map(([k, v]) => [`${d.id}.${k}`, [d.name, v[2]]])));
// the cards she does not find on the map: where she had them, in the story
const STORY_PLACE = { m00: 'Dalla Lettrice, la prima sera', m19: 'Al cancello del bosco, all\'alba', m20: 'Sul banco del Giudice', m21: 'Dalla Lettrice, l\'ultima sera' };
const low = (t) => String(t || '').charAt(0).toLowerCase() + String(t || '').slice(1);
const ELEMENT = { fuoco: 'il fuoco', acqua: 'l\'acqua', aria: 'l\'aria', terra: 'la terra' };
const stems = (ws) => (ws || []).map((w) => String(w).toLowerCase().slice(0, 5)).filter((w) => w.length >= 4);
export function helpNote(id) {
  const c = CARD[id];
  if (!c) return null;
  if (c.arcana === 'major') {
    const s = sheet(id), bad = stems([...(s.words || []), ...(s.keywords || [])]);
    const clean = (d) => !bad.some((w) => `${d.label} ${d.note}`.toLowerCase().includes(w));
    const look = (s.details || []).filter((d) => d?.label && d?.note && clean(d)).slice(0, 2);
    const says = look.map((d, i) => `${i ? 'Poi guarda' : 'Guarda'} ${d.label}. ${d.note}`).join(' ') || 'Guarda la figura con calma, un pezzo alla volta.';
    // where she had it: one line in her hand ('Trovata: il bosco, la lanterna'); a spot named like the card's
    // own keyword (Le catene, for Il Diavolo) keeps only the place
    const [place, spot] = ANCHORS[c.spot] || [];
    const okSpot = spot && !bad.some((b) => spot.toLowerCase().includes(b));
    const where = STORY_PLACE[id] || (place ? `Trovata: ${low(place)}${okSpot ? `, ${low(spot)}` : ''}` : '');
    return { kind: 'major', name: c.name, words: where ? [where] : [], says };
  }
  const suit = SEMI[c.suit];
  const art = (w) => (/^[aeiou]/i.test(w) ? `l'${w}` : w === 'Regina' ? `la ${w}` : `il ${w}`);
  const prev = c.n <= 10 ? [NUM_NAME[c.n - 1], NUMERI[c.n - 1]?.parola] : [FIGURE[c.n - 1]?.nome, FIGURE[c.n - 1]?.parola];
  const own = c.n <= 10 ? NUM_NAME[c.n] : FIGURE[c.n].nome;
  const what = c.n === 1 ? 'Asso: il primo della fila' : c.n === 11 ? 'Fante: la prima delle figure' : `${own}: viene dopo ${art(prev[0])} («${prev[1]}»)`;
  return { kind: 'minor', name: c.name, line: `${what} · ${suit.nome}: ${ELEMENT[suit.elemento] || suit.elemento}` };
}

// Good reading: the final level right (or a single card, where there is no final question) and wrong answers
// at most a third of the questions.
export const isGood = ({ wrong = 0, total = 0, levelOk = true }) => !!levelOk && total > 0 && wrong * 3 <= total;
// Full pay for a good reading; otherwise half, rounded down, at least 1 when the client pays at all.
export const payOf = (pay = 0, good = true) => (pay <= 0 ? 0 : good ? pay : Math.max(1, Math.floor(pay / 2)));
// The tone she chose: the trait it gives (tono: positive pole gentile, negative pungente).
export const TONES = [{ id: 'garbo', t: 'Con garbo', trait: { tono: 1 } }, { id: 'diretta', t: 'Senza giri di parole', trait: { tono: -1 } }];
export const toneOf = (id) => TONES.find((x) => x.id === id) || TONES[0];

// The client's words after the reading: [blunt line?, reaction]. lines: REACTIONS of data/story/clients.js.
export function reactionOf({ good, tone, thanks, lines, rng = Math.random }) {
  const one = (a) => (a?.length ? a[Math.floor(rng() * a.length)] : null);
  return [tone === 'diretta' ? one(lines?.blunt) : null, good ? thanks || 'Grazie.' : one(lines?.doubtful)].filter(Boolean);
}

// "a Tobia", "alla vedova Bray", "ai gemelli Pike": to whom she answers, from the client's name.
export function toWhom(name) {
  const s = String(name || '').split(',')[0].trim();
  if (!s) return 'a chi hai davanti';
  const m = /^(La|Lo|Il|I|Le|Gli) (.+)$/.exec(s);
  if (m) return `${{ La: 'alla', Lo: 'allo', Il: 'al', I: 'ai', Le: 'alle', Gli: 'agli' }[m[1]]} ${m[2]}`;
  if (/^L'/.test(s)) return `all'${s.slice(2)}`;
  return `a ${s.split(/ (?:il|la|lo|l'|i|le|gli) /)[0]}`;
}
