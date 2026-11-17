// Harness for the missions on the map (src/ui/missions/, notes/missions-design.md): the REAL grimoire's
// Mappa page in six hand-made states. Variant A shipped; B and C (prototype, today's old list) are gone,
// their round-1 images stay in /home/claude/shots/missions-design/round1/.
// &s=1..6 (the states below)  [&tap=<id>] open that card  [&tall=1] the page is not cut at the phone's
// height (for the testers: the whole page in one image)  [&done=1] the «già fatte» list unfolded
// The registry is the real one (core/extras.js EXTRAS with the lessons, the garden, the trials and Altrove
// registered by their glue); each state forces which entries are available and their stored status.
import '../src/core/fonts.js';
import { setState, state } from '../src/core/state.js';
import { provide, call } from '../src/core/services.js';
import '../src/ui/index.js';
import '../src/glue/lessons.js';
import '../src/glue/garden.js';
import '../src/glue/trials.js';
import '../src/glue/elsewhere.rules.js';
import { EXTRAS } from '../src/core/extras.js';
import { REGIONS, grid } from '../src/ui/sketchmap.js';

const q = new URLSearchParams(location.search);
const S = q.get('s') || '2';
if (q.get('tall')) document.documentElement.classList.add('tall');

// ---- the six states -------------------------------------------------------------------------------
// open: [id, 'new'|'seen'|'active'];  done: ids done before;  fresh: done since the last opening
const MID = [['lesson.fly', 'seen'], ['side.m05', 'seen'], ['garden.ortica', 'new'], ['trial.dare', 'new']];
const STATES = {
  1: { chapter: 1, step: 'c1.cart', open: [['side.m05', 'new']], done: [], fresh: [], me: ['village', 'village.square'], regions: ['village'] },
  2: { chapter: 2, step: 'c2.mill', open: MID.map(([id, s]) => [id, id === 'side.m05' ? 'active' : s]), done: [], fresh: [], me: ['village', 'village.square'] },
  3: { chapter: 2, step: 'c2.fire', open: [['side.m01', 'seen'], ['side.m05', 'seen'], ['trial.night', 'seen'], ['elsewhere.clouds', 'seen'], ['lesson.minors.1', 'seen'], ['garden.lesson.acqua', 'seen'], ['lesson.minors.4', 'seen'], ['trial.dare', 'seen']],
    done: ['side.m02', 'side.m03', 'garden.ortica', 'lesson.fly', 'trial.vigil', 'side.m11'], fresh: ['side.m12'], me: ['forest', 'forest.entry'] },
  4: { chapter: 2, step: 'c2.mill', open: [], done: [], fresh: [], me: ['forest', 'forest.ortica_hut'] },
  5: { chapter: 2, step: 'c2.mill', open: MID.map(([id, s]) => [id, id === 'side.m05' ? 'active' : s]), done: [], fresh: [], me: ['village', 'village.square'], tap: 'trial.dare' },
  6: { chapter: 2, step: 'c2.plan', open: MID.map(([id, s]) => [id, id === 'trial.dare' ? 'active' : s]), done: [], fresh: [], me: ['forest', 'forest.campfire'] },
};
const st = STATES[S] || STATES[2];
const tapId = q.get('tap') || st.tap || null;

// force the registry: the chosen entries available (no chain, no condition), every other one hidden
const chosen = new Set([...st.open.map(([id]) => id), ...st.done, ...st.fresh]);
for (const e of EXTRAS) { if (chosen.has(e.id)) { e.when = true; e.after = null; e.done = null; } else { e.when = false; } }
const extras = {};
for (const [id, s] of st.open) if (s !== 'new') extras[id] = s;
for (const id of [...st.done, ...st.fresh]) extras[id] = 'done';
const ack = Object.fromEntries(st.done.map((id) => [id, true]));
const regions = st.regions || ['village', 'forest'];
const seenAll = Object.fromEntries(regions.flatMap((r) => Object.keys(REGIONS[r].places)).filter((p) => p !== 'village.orto').map((p) => [p, true]));
setState({
  started: true, player: { name: 'Viola', birth: { d: 1, m: 10, y: 1996 }, sign: 'bilancia', birthCard: 'm11' },
  chapter: st.chapter, step: st.step, xp: 120, coins: 30, extras, extrasAck: ack,
  flags: Object.fromEntries(st.open.filter(([id]) => id.startsWith('side.')).map(([id]) => [id, true])), // today's tags read SIDE's own `when`
  track: (st.open.find(([, s]) => s === 'active') || [null])[0], stats: { seen: seenAll },
});
const [meMap, meAt] = st.me, [mx, my] = grid(meMap).anchors[meAt];
const where = { map: meMap, x: mx + 1, y: my + 2, near: meAt };
provide('world.where', () => Promise.resolve(where));
provide('world.travel', () => Promise.resolve());
window.__state = state;

call('grimoire.open', { tab: 'mappa' });
if (q.get('done')) setTimeout(() => document.querySelector('.ms-done')?.click(), 600);

// the card of `tap` (A/B): opened by tapping its slip, as a player would
window.__tap = async (id) => {
  const { cardOf } = await import('../src/ui/missions/titles.js');
  const c = cardOf({ id });
  const el = [...document.querySelectorAll('.ms-pin .ms-slip')].find((x) => x.getAttribute('aria-label') === `${c.kindWord}: ${c.title}`);
  el?.click();
  return !!el;
};
window.__tapId = tapId;
