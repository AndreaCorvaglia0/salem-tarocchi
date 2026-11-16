// The rules of a client reading done with the reading engine (src/reading/), as pure functions: when the
// engine is used, the question of a client, the help note of a card, good or doubtful, the pay.
// The flow on screen: consult.js. Tests: tests/play.consult.test.mjs.
import { makeQuestion, hasVoice } from '../reading/index.js';
import { CARD } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { SEMI, NUMERI, FIGURE } from '../data/reading/grid.js';

// Which cards a client reading can use. owned: ids she owns; given: what the story prepared per position
// ('fan' | 'number' | 'top' | id | null each, or undefined); n: positions of the spread.
// -> { use, pool }: use is true only when every card she can draw has a voice and there are enough of them.
// The pool is never hard-coded: it is whatever owned card has a voice file today.
// self: the final reading for herself (client 'self', glue/finale.js) asks to use the engine too.
export function engineFor({ client, n, owned = [], given, voiced = hasVoice, self = false }) {
  if (!client || (client === 'self' && !self) || !n) return { use: false, pool: [] };
  const pool = [...new Set(owned)].filter((id) => voiced(id));
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

// What she knows of a card, for the «Ricordamela» note.
// Major: { kind: 'major', name, words: [3], says }. Minor: { kind: 'minor', name, line: 'Cinque: qualcosa si rompe · Coppe: il cuore' }.
const NUM_NAME = { 1: 'Asso', 2: 'Due', 3: 'Tre', 4: 'Quattro', 5: 'Cinque', 6: 'Sei', 7: 'Sette', 8: 'Otto', 9: 'Nove', 10: 'Dieci' };
export function helpNote(id) {
  const c = CARD[id];
  if (!c) return null;
  if (c.arcana === 'major') { const s = sheet(id); return { kind: 'major', name: c.name, words: (s.words || []).slice(0, 3), says: s.says || s.core || '' }; }
  const suit = SEMI[c.suit];
  const what = c.n <= 10 ? `${NUM_NAME[c.n]}: ${NUMERI[c.n].idea.split(':')[0]}` : `${FIGURE[c.n].nome}: ${FIGURE[c.n].parola}`;
  return { kind: 'minor', name: c.name, line: `${what} · ${suit.nome}: ${suit.dove}` };
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
