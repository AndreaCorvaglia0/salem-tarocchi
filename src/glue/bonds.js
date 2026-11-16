// Popularity and Tartufo in play (rules: core/bonds.js; levels and words: docs/DESIGN.md, 16 Nov).
// - a client's reading gives popularity by how many answers were wrong; a returning client, the first time, +1
// - after a popularity level, the next free talk with Malva or Ginepra in the world opens with their line
//   (data/story/barks.js `pop`), once per level
// - Tartufo: a tap on him gives a treat (+3) or a pat (+1, once every 3 minutes of play); the first walk
//   into each map together +1; each new place seen together +1; in a new cell off the mission's way he
//   may find a treat (core/bonds.js treatChance, one find every 40 s at most)
// - the tracked side mission: the trail, the world's mission target, and keeping the registry in step
import { on } from '../core/bus.js';
import { call, has, wrap } from '../core/services.js';
import { state, save } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { fill } from '../core/cond.js';
import { addPop, popLevel, popForReading, wrongOf, addTartufo, addTreats, tapOutcome, treatChance } from '../core/bonds.js';
import { syncExtras, trackedExtra } from '../core/extras.js';
import { SPREADS } from '../data/spreads.js';
import { BARKS, CAST, SCRIPTS, STEPS } from '../data/story/index.js';
import { pick } from './barks.js';
import { popLine, movesStory } from './bonds.rules.js';

const once = () => state.world.once || (state.world.once = {});
const toast = (t) => { if (t && has('hud.toast')) call('hud.toast', fill(t)); };
const purr = () => { if (has('sound.play')) Promise.resolve(call('sound.play', 'cat')).catch(() => {}); };
const busy = async () => blocked() || (has('story.busy') && !!(await call('story.busy')));

// ---- popularity from readings -----------------------------------------------------------------
let backNow = null; // glue/clients.js: the client who has just come back, for the next reading
export const markBack = (id) => { backNow = id; };
wrap('reading.open', async (prev, o = {}) => {
  const r = await prev?.(o);
  const client = o.client, back = backNow;
  backNow = null;
  if (!client || client === 'self' || !r) return r;
  const n = Array.isArray(o.cards) && o.cards.length ? o.cards.length : SPREADS[o.spread]?.positions?.length || 1;
  const wrong = wrongOf(r, n);
  const firstBack = !!back && back === client && !once()[`pop.back.${client}`];
  if (firstBack) { once()[`pop.back.${client}`] = true; save(); }
  addPop(popForReading({ wrong: wrong ?? 99, total: Number(r.total) || 0, firstBack }));
  return r;
});

// ---- the words of popularity, said by Malva or Ginepra in a free talk (not a scene of the main path)
on('talk', ({ id } = {}) => {
  const e = (CAST || []).find((c) => c.id === id && c.kind === 'npc' && (c.who === 'malva' || c.who === 'ginepra'));
  if (!e || movesStory(e.script, SCRIPTS)) return;
  const l = popLine({ who: e.who, level: popLevel(), said: (lv) => !!once()[`pop.said.${lv}`], lines: BARKS.pop });
  if (!l) return;
  for (const x of BARKS.pop || []) if (x.who === e.who && x.level <= l.level) once()[`pop.said.${x.level}`] = true;
  save();
  // queued before the person's own script (the world calls story.run right after this event)
  if (has('story.run')) call('story.run', [{ say: e.who, t: l.t.replace(/^«|»$/g, '') }]);
});

// ---- Tartufo -----------------------------------------------------------------------------------
let playMs = 0, lastPat = -Infinity, lastFind = -Infinity, lastTick = Date.now();
// play time: only while the page is visible (a pat is not refilled by leaving the phone on the table)
setInterval(() => { const t = Date.now(); if (!globalThis.document?.hidden) playMs += Math.min(5000, t - lastTick); lastTick = t; }, 1000);
const line = (group) => { const b = pick((BARKS[group] || []).filter(Boolean)); return b ? b.t : null; };

on('tartufo:tap', async () => {
  if (!state.powers.cat || (await busy())) return;
  const out = tapOutcome({ treats: state.treats || 0, now: playMs, lastPat });
  if (out.kind === 'treat') { addTreats(-1); addTartufo(out.points); toast(line('tartufo.treat')); }
  else { if (out.points) { lastPat = playMs; addTartufo(out.points); } toast(line('tartufo.pat')); }
  purr();
});
on('map:enter', ({ map } = {}) => {
  if (!state.powers.cat || !map || once()[`tartufo.map.${map}`]) return;
  once()[`tartufo.map.${map}`] = true; save();
  addTartufo(1);
});
on('seen', () => { if (state.powers.cat) addTartufo(1); });
on('cell', async ({ fresh, nearRoute } = {}) => {
  if (!state.powers.cat) return;
  const script = await busy();
  const p = treatChance({ fresh, nearRoute, script, now: playMs, lastFind });
  if (!(Math.random() < p)) return;
  lastFind = playMs;
  addTreats(1);
  toast(line('tartufo.found'));
  purr();
});

// ---- the tracked side mission: where the trail and the world's mission point --------------------
const stepAt = () => (STEPS || []).find((s) => s.id === state.step)?.at || null;
export const missionAt = () => trackedExtra()?.at || stepAt();
let lastMission;
function refreshMission() {
  syncExtras();
  const m = missionAt();
  if (m !== lastMission && has('world.mission')) { lastMission = m; call('world.mission', m); }
}
for (const e of ['step', 'flag', 'card:found', 'chapter', 'track']) on(e, () => setTimeout(refreshMission, 60));
wrap('world.start', async (prev) => { const r = await prev?.(); lastMission = undefined; refreshMission(); return r; });
