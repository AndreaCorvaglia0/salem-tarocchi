// The ?debug skip points as pure state preparation (tests run it in Node): a sane state at the start
// of chapter 2, chapter 3, or just before the trial. src/glue/debug.js uses it from the URL.
import { state, setState, saveNow } from '../core/state.js';
import { findCard, setPlayer, addXp, addTrust } from '../core/progress.js';
import { MAJORS } from '../data/cards.base.js';

const ids = (a, b) => MAJORS.filter((c) => c.n >= a && c.n <= b).map((c) => c.id);
// what each skip point has behind it
export const SKIPS = {
  c2: { chapter: 2, step: 'c2.ortica', cards: ids(0, 7), xp: 290, at: 'forest.entry',
    spreads: ['single'], lessons: ['deck', 'single'], trust: { malva: 1, ginepra: 2 },
    flags: ['met.ginepra', 'ginepra.snatched', 'ginepra.returned', 'b1.spoke', 'malva.wood', 'client.c1.widow.done', 'seen.road'] },
  c3: { chapter: 3, step: 'c3.trapdoor', cards: ids(0, 14), xp: 580, at: 'village.trapdoor', near: [-2, 1],
    spreads: ['single', 'ppf'], lessons: ['deck', 'single', 'ppf', 'suits'], trust: { malva: 1, ortica: 2, ginepra: 3 },
    flags: ['met.ginepra', 'ginepra.snatched', 'ginepra.returned', 'b1.spoke', 'malva.wood', 'client.c1.widow.done', 'seen.road',
      'client.c2.miller.done', 'fire.promised', 'b2.went', 'ginepra.taken', 'leaf.value.m11'] },
  trial: { chapter: 3, step: 'c3.court', cards: ids(0, 18), xp: 720, at: 'village.court_door', near: [0, 2],
    spreads: ['single', 'ppf', 'celtic'], lessons: ['deck', 'single', 'ppf', 'suits', 'celtic', 'astro'], trust: { malva: 2, ortica: 2, edera: 2, ginepra: 3 },
    flags: ['met.ginepra', 'ginepra.snatched', 'ginepra.returned', 'b1.spoke', 'malva.wood', 'client.c1.widow.done', 'seen.road',
      'client.c2.miller.done', 'fire.promised', 'b2.went', 'ginepra.taken', 'leaf.value.m11', 'leaf.fear.m13', 'client.c3.clerk.done', 'b3.open'] },
};

// Prepare the state of a skip point (pure on the state module; anchors come from the caller).
export function prepare(key, anchors = {}) {
  const k = SKIPS[key];
  if (!k) return false;
  setState({ started: true });
  setPlayer({ name: 'Prova', birth: { d: 1, m: 10, y: 1995 } });
  for (const id of k.cards) findCard(id, { silent: true });
  for (const id of k.cards) Object.assign(state.cards[id], { stars: 1, due: Date.now() + 86400000 });
  state.xp = 0; addXp(k.xp, 'debug');
  state.powers.cat = true;
  for (const s of k.spreads) state.spreads[s] = true;
  for (const l of k.lessons) state.lessons[l] = true;
  for (const f of k.flags) state.flags[f] = true;
  for (const [who, n] of Object.entries(k.trust)) addTrust(who, n);
  state.chapter = k.chapter; state.step = k.step; state.coins = 25; state.tools.bottle = 1;
  state.world.once.road = true;
  const a = anchors[k.at];
  if (a) state.pos = { map: a.map, x: a.x + (k.near?.[0] || 0), y: a.y + (k.near?.[1] || 0) };
  state.diary.push({ t: `(Prova: salto a ${key}.)`, at: Date.now() });
  saveNow();
  return true;
}

