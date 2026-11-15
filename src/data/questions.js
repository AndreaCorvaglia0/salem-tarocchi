// STUB by the lead; the cards agent replaces it (docs/CONTRACT.md, "questions").
import { CARD, MAJORS } from './cards.base.js';
const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];
export function makeQuestion({ pool, rng = Math.random } = {}) {
  const ids = pool?.length ? pool : MAJORS.map((c) => c.id);
  const cardId = pick(ids, rng);
  const others = MAJORS.map((c) => c.id).filter((id) => id !== cardId).sort(() => rng() - 0.5).slice(0, 2);
  const options = [cardId, ...others].sort(() => rng() - 0.5).map((id) => ({ t: CARD[id].name, ok: id === cardId }));
  return { cardId, kind: 'name', star: 'image', prompt: 'Che carta è?', show: { card: cardId }, options, explain: `È ${CARD[cardId].name}.` };
}
export const makeExam = ({ pool, n = 3, rng } = {}) => Array.from({ length: n }, () => makeQuestion({ pool, rng }));
