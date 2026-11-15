// The Minors simulation (tests/world.minors.test.mjs runs it): she plays the main path (the anchors
// of STEPS, in order, across maps, with the powers of each chapter) at walking speed while the
// Glinter rolls on every step. A straight game picks a glint only when it lies on her way or one
// step off it; a wandering one also strolls through every tagged meadow she can reach in each
// chapter and picks every glint. Counts Minors met and the smallest gap between two. Pure: node.
import { MAPS } from './maps.js';
import { route, stateWith, explore } from './reach.js';
import { Glinter, MINOR, MINORS_WHEN } from './minors.js';
import { test as cond } from '../core/cond.js';
import { STEPS } from '../data/story/steps.js';
import { MAJORS } from '../data/cards.base.js';

// walking time per step; the time spent in scenes is not walking but counts for the cooldown
export const WALK = 165, PICK_MS = 2500, SCENE_MS = 30000, CARD_MS = 30000;
const POWERS = { 0: {}, 1: { cat: true }, 2: { cat: true, fire: true }, 3: { cat: true, fire: true, sense: true, broom: true, stun: true } };
const chState = (ch, step) => stateWith({ chapter: ch, step, powers: POWERS[Math.min(3, ch)], flags: { 'shop.open': true } });
const DIR = (a, b) => (b[1] > a[1] ? 'right' : b[1] < a[1] ? 'left' : b[2] > a[2] ? 'down' : 'up');

let seed = 1;
export const reseed = (s) => { seed = s; };
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// the meadows of a map: one tile in the middle of each suit area, if walkable
function meadows(s) {
  const out = [], prev = explore('village.arrival', s);
  for (const m of Object.values(MAPS())) for (const z of m.def.suits || []) {
    const [x, y, w, h] = z.area;
    let best = null;
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (m.suitAt(xx, yy) && prev.has(`${m.id},${xx},${yy}`)) { const d = Math.hypot(xx - x - w / 2, yy - y - h / 2); if (!best || d < best.d) best = { d, xx, yy }; }
    if (best) out.push({ map: m.id, x: best.xx, y: best.yy, key: `${m.id}.${z.suit}.${x}.${y}` });
  }
  return out;
}

export function play({ wander = false, heat = null } = {}) {
  const maps = MAPS(), g = new Glinter(rand);
  let now = 0, met = 0, last = -Infinity, minGap = Infinity, grassSteps = 0, steps = 0;
  const walk = (tiles, s, pickAll) => {
    for (let i = 1; i < tiles.length; i++) {
      const a = tiles[i - 1], b = tiles[i];
      now += WALK; steps++;
      if (a[0] !== b[0]) continue; // a door
      const m = maps[b[0]];
      if (heat) heat[`${b[0]},${b[1]},${b[2]}`] = (heat[`${b[0]},${b[1]},${b[2]}`] || 0) + 1;
      if (m.suitAt(b[1], b[2])) grassSteps++;
      if (!cond(MINORS_WHEN, s)) continue;
      const ok = (x, y) => !m.isSolid(x, y) && m.at(x, y) !== '+';
      const gl = g.step(m, b[1], b[2], DIR(a, b), now, ok);
      if (!gl) continue;
      const ahead = tiles.slice(i, i + 6).filter((t) => t[0] === b[0]);
      const onWay = ahead.some((t) => Math.abs(t[1] - gl.x) + Math.abs(t[2] - gl.y) <= 1);
      if (pickAll || onWay) {
        now += PICK_MS + (onWay ? 0 : 4 * WALK);
        g.take(now); met++;
        minGap = Math.min(minGap, now - last); last = now;
      }
    }
  };
  // she finds the Major spots of a chapter, nearest first (those she cannot reach yet stay)
  const tour = (c, from, s) => {
    let left = MAJORS.filter((k) => k.spot && k.row === c && k.id !== 'm07').map((k) => k.spot), here = from;
    while (left.length) {
      const opts = left.map((sp) => ({ sp, r: route(here, sp, s) })).filter((o) => o.r.length).sort((a, b) => a.r.length - b.r.length);
      if (!opts.length) break;
      walk(opts[0].r, s, wander); here = opts[0].sp; now += CARD_MS;
      left = left.filter((sp) => sp !== here);
    }
    return here;
  };
  let at = 'village.arrival', ch = 0;
  const strolled = new Set();
  for (const st of STEPS) {
    if (!st.at || st.chapter > 3) continue;
    const s = chState(st.chapter, st.id);
    if (wander && st.chapter !== ch && st.chapter >= 2) { // before moving on, a stroll through the meadows
      const prevS = chState(ch, st.id);
      for (const mref of meadows(prevS)) { if (strolled.has(`${ch}:${mref.key}`)) continue; strolled.add(`${ch}:${mref.key}`); const r = route(at, mref, prevS); if (r.length) { walk(r, prevS, true); at = mref; } }
    }
    if (st.chapter !== ch && st.chapter >= 1) at = tour(st.chapter, at, s); // the chapter's cards, nearest first
    ch = st.chapter;
    const r = route(at, st.at, s);
    if (r.length) { walk(r, s, wander); at = st.at; }
    now += SCENE_MS;
  }
  if (wander) { const s = chState(3, 'f.last'); for (const mref of meadows(s)) { const r = route(at, mref, s); if (r.length) { walk(r, s, true); at = mref; } } }
  return { met, minGap, grassSteps, steps, minutes: now / 60000 };
}

export function measure({ wander = false, runs = 40 } = {}) {
  let met = 0, minGap = Infinity, lo = Infinity, hi = 0, r = null;
  for (let i = 0; i < runs; i++) { r = play({ wander }); met += r.met; lo = Math.min(lo, r.met); hi = Math.max(hi, r.met); minGap = Math.min(minGap, r.minGap); }
  return { mean: met / runs, lo, hi, minGap, grassSteps: r.grassSteps, steps: r.steps, minutes: r.minutes, chance: MINOR.chance };
}
