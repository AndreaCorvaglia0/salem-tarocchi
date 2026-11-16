// The lessons as missions (data/story/missions.js): the flying lesson, the Minors, the reversed cards.
// - registers them in the extras registry (core/extras.js EXTRAS), so the grimoire lists and tracks them;
// - announces each with its short scene as soon as it is available and she is free: when the broom
//   comes, when a lesson ends (the next opens), at a new chapter or step, and when a saved game is
//   loaded (a player who was already past that point gets it too). It never starts over a scene;
// - after the flying lesson shows the neutral hint `fly`, once (and keeps it from showing before);
// - registers the chapter card (story/chapter.js: service story.chapterCard).
import { on, emit } from '../core/bus.js';
import { call, has, wrap } from '../core/services.js';
import { state, save } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { test } from '../core/cond.js';
import { hintOnce } from '../core/progress.js';
import { EXTRAS } from '../core/extras.js';
import { LESSON_MISSIONS, dueOffer } from '../data/story/missions.js';
import '../story/chapter.js';

// the lessons go first in the list, in their order
for (const m of [...LESSON_MISSIONS].reverse()) if (!EXTRAS.some((e) => e.id === m.id)) EXTRAS.unshift({ ...m });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const busy = async () => blocked() || (has('story.busy') && !!(await call('story.busy')));
// wait until nothing covers the world and no script plays, and it has stayed so for a moment
async function free(quiet = 1500, patience = 15 * 60 * 1000) {
  const until = Date.now() + patience;
  while (Date.now() < until) {
    if (!(await busy())) { await sleep(quiet); if (!(await busy())) return true; } else await sleep(500);
  }
  return false;
}

const once = (k) => { const o = state.world.once || (state.world.once = {}); if (o[k]) return false; o[k] = true; save(); return true; };

let pending = false;
async function announce(delay = 0) {
  if (pending || !has('story.run') || !state.started || state.chapter < 1) return;
  pending = true;
  try {
    if (delay) await sleep(delay);
    while (dueOffer(state, test)) {
      if (!(await free())) return;
      const m = dueOffer(state, test); // it may have changed while waiting
      if (!m) return;
      await call('story.run', m.offer);
      if (!state.flags[m.offered]) return; // the scene did not play to its end: try again at the next event
      if (await free(600, 20000)) hintOnce('lesson'); // interface: where the new mission is
    }
  } finally { pending = false; }
}

// the hint `fly` belongs after the lesson: until then it is held back (glue/wire.js asks for it when
// the power comes), and it shows once when Malva has finished
const lessonDone = () => !!state.flags['lesson.fly'];
// the broom comes with a level (bus `level:up`, the gift is already in state.powers) or from a script (`power`)
const broomCame = () => {
  if (!state.powers.broom) return;
  if (!lessonDone()) { (state.world.once || (state.world.once = {}))['hint.fly'] = true; save(); }
  announce(6000); // after the level banner
};
on('power', ({ id } = {}) => { if (id === 'broom') broomCame(); });
on('level:up', () => setTimeout(broomCame, 0));
on('flag', ({ k, v } = {}) => {
  if (!v || !String(k).startsWith('lesson.')) return;
  if (k === 'lesson.fly') free(900, 60000).then((ok) => { if (ok && once('hint.fly.lesson')) emit('hint', { id: 'fly' }); });
  announce(7000);
});
for (const e of ['chapter', 'step']) on(e, () => announce(1500));
wrap('world.start', async (prev) => { const r = await prev?.(); announce(2500); return r; });
