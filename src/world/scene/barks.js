// Short lines the world says on its own: Tartufo near a hidden card or a constable, a constable
// who has seen you. They come from BARKS in the story data when it has them:
//   BARKS.tartufo: [{ on: 'card' | 'patrol', when?: <cond>, t }]   (an entry without `on` is never used here)
//   BARKS.constable / BARKS.afflicted: [{ on?: 'seen', when?, t }]
// and fall back to the lines below.
import { test, fill } from '../../core/cond.js';
import * as STORY from '../../data/story/index.js';

const FALLBACK = {
  tartufo: {
    card: ['Fiuto carta. Di qua.', 'Qui sotto c\'è qualcosa che ti guarda.', 'Miao. Tradotto: abbassati e guarda.'],
    patrol: ['Pelo ritto. Lanterna in arrivo.', 'Conestabile. Io non ti conosco.', 'Nasconditi nell\'erba. Io sono già nero.'],
  },
  constable: { seen: ['Ferma lì. Due domande.', 'Tu. Sì, tu. Vieni qui.', 'A quest\'ora? Rispondi.'] },
  afflicted: { seen: ['Lei! È lei!', 'La vedo. La vedo!'] },
};
const used = {};

export function bark(who, on) {
  const list = (STORY.BARKS?.[who] || []).filter((b) => (b.on ? b.on === on : who !== 'tartufo') && test(b.when ?? null));
  const pool = list.length ? list.map((b) => b.t) : FALLBACK[who]?.[on] || [];
  if (!pool.length) return null;
  const k = `${who}.${on}`;
  used[k] = ((used[k] ?? Math.floor(Math.random() * pool.length)) + 1) % pool.length;
  return fill(pool[used[k]]);
}
