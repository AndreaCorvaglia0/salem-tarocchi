// Guidance, outside the fiction (docs/DESIGN.md rule 4; docs/CONTRACT.md "Guidance"):
// - the hints the world does not emit: `grimoire` after the first found-card ceremony, `exam` at the
//   first Exam, `reading` at the first reading (once each, state.world.once['hint.<id>']);
// - the trail of lights (world.guide): always on in chapters 0-1 towards the current step's `at`;
//   from chapter 2 only for TRAIL_MS after she taps the next-step line in the HUD (service guide.ask).
import { on } from '../core/bus.js';
import { call, has, wrap, provide } from '../core/services.js';
import { state } from '../core/state.js';
import { foundIds, hintOnce } from '../core/progress.js';
import { STEPS } from '../data/story/index.js';
import { trailTarget, TRAIL_MS } from './hints.rules.js';

const hint = (id, delay = 0) => setTimeout(() => hintOnce(id), delay);

wrap('card.found', async (prev, id) => {
  const r = await prev?.(id);
  if (state.cards[id]?.found) hint('grimoire', 700); // after the ceremony, when the world is back
  return r;
});
wrap('exam.start', async (prev, o) => { hint('exam', 900); return prev?.(o); });
wrap('reading.open', async (prev, o) => { hint('reading', 900); return prev?.(o); });

// ---- the trail
let tempUntil = 0, tempT = 0, current;
const target = () => trailTarget({ chapter: state.chapter, step: state.step, steps: STEPS, found: foundIds(), temp: Date.now() < tempUntil });
export function refreshTrail() {
  if (!has('world.guide')) return;
  const t = target();
  if (t === current) return;
  current = t;
  call('world.guide', t);
}
for (const e of ['step', 'chapter', 'card:found']) on(e, () => setTimeout(refreshTrail, 50));
// from chapter 2 the trail is no longer always on: once, say how to ask for it (the HUD slip)
const guideHint = () => { if (state.chapter >= 2 && has('world.guide')) hint('guide', 1500); };
on('chapter', guideHint);
wrap('world.start', async (prev) => { const r = await prev?.(); current = undefined; refreshTrail(); guideHint(); return r; });
// from chapter 2: a tap on the next-step line shows the way for a few seconds -> true; in chapters
// 0-1 the trail is always on -> false (the HUD then opens the map)
provide('guide.ask', () => {
  if (state.chapter <= 1) return Promise.resolve(false);
  tempUntil = Date.now() + TRAIL_MS;
  refreshTrail();
  clearTimeout(tempT); tempT = setTimeout(refreshTrail, TRAIL_MS + 50);
  return Promise.resolve(!!current);
});
