// Her cottage grows with her (world/home.js: the stage is derived from what she has, nothing is saved for it).
// The first time she is near it at a new stage, ONE short line: Tartufo's low voice if she has him, else her
// own thought (data/story/barks.js 'home.2', 'home.3'). Played once (state.world.once['home.<stage>']); a save
// that is already further on hears only the line of the stage she finds, never the ones she skipped.
import { on } from '../core/bus.js';
import { call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { anchorOf } from '../world/maps.js';
import { homeStage } from '../world/home.js';
import { BARKS } from '../data/story/index.js';

const DOOR = 'village.cottage_door';
const once = () => state.world.once || (state.world.once = {});
// near enough to see it on a phone (12 x 26 tiles on screen, she is in the middle)
export const seesHome = (p, door = anchorOf(DOOR)) => !!p && !!door && p.map === door.map && Math.abs(p.x - door.x) <= 6 && Math.abs(p.y - door.y) <= 9;
// the line to say now, or null (pure: tested in tests/world.buildings.test.mjs)
export function homeLine(s, p, lines = BARKS) {
  const st = homeStage(s), o = s.world?.once || {};
  if (st < 2 || o[`home.${st}`] || !seesHome(p)) return null;
  const list = lines[`home.${st}`] || [], who = s.powers?.cat ? 'tartufo' : 'tu';
  return { stage: st, t: (list.find((l) => l.who === who) || list[0])?.t || null };
}

let pending = false;
async function check() {
  if (pending || !has('world.where') || !has('hud.toast')) return;
  pending = true;
  try {
    if (blocked() || (has('story.busy') && (await call('story.busy')))) return;
    const l = homeLine(state, await call('world.where'));
    if (!l || !l.t) return;
    for (let k = 2; k <= l.stage; k++) once()[`home.${k}`] = true;
    save();
    call('hud.toast', l.t);
  } finally { pending = false; }
}
on('cell', ({ map } = {}) => { if (map === 'village') check(); });
on('seen', () => check());
on('map:enter', ({ map } = {}) => { if (map === 'village') setTimeout(check, 1200); });
