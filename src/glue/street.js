// In the street (docs/READING.md, "Per strada"): someone she has already read for recognises her outdoors,
// asks under their breath for one card, and she reads it on the spot through the same reading screens.
// - remembers the people she read for (story clients and generated ones) in state.world.gen.read
// - every CHECK_MS of play: if streetDue() (clients.rules.js) and a roll of streetChance(pop), the world puts
//   the person on a road tile near her (world.stranger); they wait LINGER_MS, then leave
// - tapping them: their line, her two answers; yes -> reading.open single with a small pay (popularity
//   follows as for any client reading: glue/bonds.js)
// Service street.now(): put someone there now, ignoring time and chance (debug, screenshots).
import { provide, call, has, wrap } from '../core/services.js';
import { on } from '../core/bus.js';
import { state, save } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { popLevel } from '../core/bonds.js';
import { CLIENTS } from '../data/story/index.js';
import { STREET } from '../data/reading/people.js';
import { streetClient, streetAsk, render } from '../reading/clients.js';
import { pick } from '../reading/rng.js';
import { streetDue, streetChance, streetPerson, readEntry, rememberRead, pushRecent } from './clients.rules.js';
import { genState, currentTier } from './clients.js';

export const CHECK_MS = 20000, LINGER_MS = 60000, FIRST_MS = 90000;

// ---- who she has read for ----------------------------------------------------------------------
wrap('reading.open', async (prev, o = {}) => {
  const r = await prev?.(o);
  if (r) {
    const e = readEntry(o.client, CLIENTS);
    if (e) { const g = genState(); g.read = rememberRead(g.read, e); save(); }
  }
  return r;
});

// ---- play time (page visible), as in glue/bonds.js --------------------------------------------
let playMs = 0, lastTick = Date.now(), lastMet = -Infinity, lastWho = null, here = null, leaveAt = 0;
const since = () => playMs - lastMet;
setInterval(() => {
  const t = Date.now();
  if (!globalThis.document?.hidden) playMs += Math.min(5000, t - lastTick);
  lastTick = t;
  if (here && playMs >= leaveAt && !here.talking) leave();
}, 1000);
setInterval(() => { tick().catch((e) => console.warn('[street]', e)); }, CHECK_MS);
on('map:enter', () => { here = null; }); // a new map: whoever waited is gone with the old scene

const busy = async () => blocked() || (has('story.busy') && !!(await call('story.busy')));
const leave = () => { here = null; if (has('world.stranger')) call('world.stranger', null); };

async function tick() {
  if (!state.started || here || playMs < FIRST_MS) return;
  const w = has('world.where') ? await call('world.where') : null;
  const outdoor = !!w && ['village', 'forest'].includes(w.map) && !w.fog;
  const due = streetDue({ chapter: state.chapter, exams: state.stats?.exams || 0, pop: popLevel(), sinceMs: lastMet === -Infinity ? Infinity : since(), outdoor, busy: await busy(), known: genState().read.length });
  if (!due || Math.random() >= streetChance(popLevel())) return;
  await meet();
}

// put someone she read for near her; true if they are there
async function meet(person = null) {
  const p = person || streetPerson({ known: genState().read, last: lastWho });
  if (!p || !has('world.stranger')) return false;
  const ok = await call('world.stranger', { who: `street:${p.id}`, label: p.name, run: () => exchange(p) });
  if (!ok) return false;
  here = { p, talking: false };
  lastMet = playMs; lastWho = p.id; leaveAt = playMs + LINGER_MS;
  if (has('hud.toast')) call('hud.toast', 'Una persona ti fa cenno dal bordo della strada.');
  return true;
}

// played through the story runner: their line stays on screen above her two answers
async function exchange(p) {
  if (here) here.talking = true;
  try {
    const gs = genState();
    const c = streetClient({ person: p, tier: p.tier ?? currentTier(), avoid: gs.recent });
    gs.recent = pushRecent(gs.recent, c.keys); save();
    const o = p.gender === 'm' ? 'o' : 'a';
    await call('story.run', [
      { say: p.name, t: streetAsk(p) },
      { choice: [
        { t: STREET.yes, then: [{ do: 'reading', spread: 'single', client: c }] },
        { t: STREET.no, then: [{ say: p.name, t: render(pick(STREET.noRe), { o }) }] },
      ] },
    ]);
  } finally { leave(); }
}

provide('street.now', async () => meet());
