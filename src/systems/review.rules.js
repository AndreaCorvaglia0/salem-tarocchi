// Pure rules of the review (review.js): the question built from her own three words (docs/BACKLOG.md 2.1,
// notes/imparare.md). When she found a card she wrote up to three words of her own (state.cards[id].words);
// here they come back as the clue: «Le tue parole erano: … Che carta è?», three names to choose from.
// Tests: tests/review.words.test.mjs.
import { CARD, MAJORS, MINORS } from '../data/cards.base.js';
import { SHEETS } from '../data/cards.js';
import { leaks } from '../data/questions.js';

const clean = (words) => (Array.isArray(words) ? words.map((w) => String(w || '').trim()).filter(Boolean) : []);
// the words she wrote for a card, if they can be asked: at least one, and none that already says the name
// (for a Minor also its number as a word: «tre» for a Three gives half of it away)
const says = (w, id) => leaks(w.join(' '), id) || (!!CARD[id]?.rank && w.join(' ').toLowerCase().split(/[^a-zàèéìòù]+/).includes(CARD[id].rank.toLowerCase()));
export const wordsOf = (c, id) => { const w = clean(c?.words); return w.length && !says(w, id) ? w : null; };

// The card to ask with her words: one of `ids` (the review list, in its order) she holds, with usable words;
// a due one first (in the order of `ids`). -> id | null
export function wordsCard(cards = {}, ids = [], now = Date.now()) {
  const ok = ids.filter((id) => CARD[id] && cards[id]?.found && !cards[id]?.confiscated && wordsOf(cards[id], id));
  return ok.find((id) => (cards[id].due || 0) <= now) || ok[0] || null;
}

const shuffle = (a, rng) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
// The question: { cardId, kind: 'words', star: 'image', prompt, words, after, options: [{ t, ok }], explain }.
// Other names of the same arcana, the ones she holds first; never a card the sheet marks as easily confused
// (her words are loose, and two close cards would both be right). `n` options, 3 by default.
export function wordsQuestion(id, cards = {}, { rng = Math.random, n = 3 } = {}) {
  const words = wordsOf(cards[id], id);
  if (!words || !SHEETS[id]) return null;
  const c = CARD[id];
  const avoid = new Set([id, ...(SHEETS[id].confusables || [])]);
  const same = (c.arcana === 'major' ? MAJORS : MINORS).map((x) => x.id).filter((x) => !avoid.has(x));
  const held = (x) => !!cards[x]?.found;
  const others = [...shuffle(same.filter(held), rng), ...shuffle(same.filter((x) => !held(x)), rng)].slice(0, n - 1);
  const options = shuffle([{ t: c.name, ok: true }, ...others.map((x) => ({ t: CARD[x].name, ok: false }))], rng);
  return {
    cardId: id, kind: 'words', star: 'image', prompt: words.length > 1 ? 'Le tue parole erano:' : 'La tua parola era:', words,
    after: 'Che carta è?', options, explain: `${c.name}. ${SHEETS[id].core}`,
  };
}
