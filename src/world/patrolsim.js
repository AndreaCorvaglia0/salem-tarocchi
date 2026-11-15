// The patrol simulation (tests/world.patrol.test.mjs runs it): a player walks the main path of a
// chapter at walking speed while the patrols walk their routes; how often is she seen?
// careless: the shortest path, never waits. careful: prefers dark tiles (side paths, tall grass)
// and waits, up to a few seconds, while a lantern sweeps the next tile. Pure: runs in node.
import { getMap } from './maps.js';
import { findPath, pathTiles } from './path.js';
import { test as cond } from '../core/cond.js';
import { fresh } from '../core/state.js';
import { SEE, T, eyeAt, inSight, CALM_MS } from './sight.js';

export const WALK = 165;
const DT = 50;
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// a state in the middle of each chapter (no scripted scene that switches patrols off)
const stateFor = (chapter) => ({ ...fresh(), chapter, step: { 1: 'c1.find', 2: 'c2.forest', 3: 'c3.depths' }[chapter], majorsMin: 0 });

export const PLANS = [
  { map: 'village', chapter: 1, path: 'arrival malva_door cottage_door square stall court_door venusglass curtain meeting_door square arrival' },
  { map: 'village', chapter: 2, path: 'cottage_door square forest_gate square venusglass cottage_door' },
  { map: 'village', chapter: 3, path: 'cottage_door square court_door trapdoor square cottage_door' },
  { map: 'forest', chapter: 2, path: 'entry campfire ortica_hut pond graveyard spring mill boundary entry' },
  { map: 'depths', chapter: 3, path: 'entry edera_nook coven tower well swamp tower chains entry' },
];

let seed = 1;
export const reseed = (s) => { seed = s; };
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function setup(m, chapter) {
  const s = stateFor(chapter);
  const walk = (x, y) => !m.isSolid(x, y) && m.at(x, y) !== '+';
  const blocked = (x, y) => m.isSolid(x, y) && m.tile(x, y).ground !== 'water';
  const patrols = m.patrols.filter((p) => cond(p.when, s));
  // every tile a lantern can reach from a route (for the careful walker)
  const exposed = new Map();
  for (const p of patrols) {
    const tiles = [];
    for (let i = 0; i < p.route.length; i++) {
      const [ax, ay] = p.route[i], [bx, by] = p.route[(i + 1) % p.route.length];
      tiles.push([ax, ay], ...pathTiles(ax, ay, findPath(ax, ay, new Set([`${bx},${by}`]), walk) || []));
    }
    for (const [rx, ry] of tiles) for (let y = ry - 5; y <= ry + 5; y++) for (let x = rx - 5; x <= rx + 5; x++) {
      const d = Math.hypot(x - rx, y - ry), r = m.isGrass(x, y) ? SEE.grass : SEE.range;
      if (d > r + 0.5 || !walk(x, y)) continue;
      const ex = rx * T + 8, ey = ry * T + 8;
      if (inSight(ex, ey, 'down', x * T + 8, y * T + 8, false, blocked) || d < 1.5) exposed.set(`${x},${y}`, (exposed.get(`${x},${y}`) || 0) + 1);
      else if (!blocked(x, y)) { // sight along every direction: any cone
        const ok = ['up', 'left', 'right'].some((dir) => inSight(ex, ey, dir, x * T + 8, y * T + 8, false, blocked));
        if (ok) exposed.set(`${x},${y}`, (exposed.get(`${x},${y}`) || 0) + 1);
      }
    }
  }
  return { walk, blocked, patrols, exposed };
}

// Dijkstra on the grid; careful: a lit tile costs much more than a dark one
function route(m, env, names, careful) {
  const tiles = [];
  for (let i = 0; i + 1 < names.length; i++) {
    const a = m.anchors[`${m.id}.${names[i]}`], b = m.anchors[`${m.id}.${names[i + 1]}`];
    const cost = (x, y) => 1 + (careful ? 12 * Math.min(1, env.exposed.get(`${x},${y}`) || 0) : 0);
    const dist = new Map([[`${a.x},${a.y}`, 0]]), prev = new Map(), q = [[0, a.x, a.y]];
    while (q.length) {
      q.sort((p, r) => p[0] - r[0]);
      const [d, x, y] = q.shift();
      if (x === b.x && y === b.y) break;
      if (d > dist.get(`${x},${y}`)) continue;
      for (const [dx, dy] of Object.values(DIR)) {
        const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
        if (!env.walk(nx, ny)) continue;
        const nd = d + cost(nx, ny);
        if (nd < (dist.get(k) ?? Infinity)) { dist.set(k, nd); prev.set(k, [x, y]); q.push([nd, nx, ny]); }
      }
    }
    const leg = [];
    for (let k = `${b.x},${b.y}`; prev.has(k); k = prev.get(k).join(',')) leg.unshift(k.split(',').map(Number));
    if (!leg.length && (a.x !== b.x || a.y !== b.y)) throw new Error(`${m.id}: no path ${names[i]} -> ${names[i + 1]}`);
    if (!tiles.length) tiles.push([a.x, a.y]);
    tiles.push(...leg);
  }
  return tiles;
}

const tally = { by: {}, where: {} };
export const why = () => tally;
function simulate(m, env, tiles, careful, RUN_MS) {
  const paths = new Map(); // patrol legs, cached
  // patrols with a random phase: a random waypoint, a random wait
  const ps = env.patrols.map((p) => {
    const i = Math.floor(rand() * p.route.length), [x, y] = p.route[i];
    return { p, i, x, y, nx: x, ny: y, t0: 0, moving: false, wait: rand() * (p.pause || 1500) * 2, dir: p.face || 'down', speed: p.speed || 380, kind: p.kind || 'constable' };
  });
  let k = Math.floor(rand() * tiles.length), t0 = 0, calm = 2500, waited = 0;
  const pos = (q) => { const g = q.moving ? Math.min(1, (nowRef.t - q.t0) / q.speed) : 0; return [(q.x + (q.nx - q.x) * g) * T + 8, (q.y + (q.ny - q.y) * g) * T + T]; };
  const nowRef = { t: 0 };
  const lit = (x, y) => ps.some((q) => { const [sx, sy] = pos(q); const [ex, ey] = eyeAt(sx, sy, q.dir); return inSight(ex, ey, q.dir, x * T + 8, y * T + T - 6, m.isGrass(x, y), env.blocked) || Math.hypot(sx - x * T - 8, sy - y * T - T) < T * 1.6; });
  const stops = [];
  for (let now = 0; now < RUN_MS; now += DT) {
    nowRef.t = now;
    // the player
    if (now - t0 >= WALK) {
      // careful: before stepping on, she waits (up to 5 s) while a lantern is on the next tile
      const [cx, cy] = tiles[(k + 2) % tiles.length];
      if (careful && waited < 5000 && lit(cx, cy)) waited += DT;
      else { waited = 0; k = (k + 1) % tiles.length; t0 = now; }
    }
    const [ax, ay] = tiles[k], [bx, by] = tiles[(k + 1) % tiles.length], f = Math.min(1, (now - t0) / WALK);
    const px = (ax + (bx - ax) * f) * T + 8, py = (ay + (by - ay) * f) * T + T - 6;
    // the patrols
    for (const q of ps) {
      if (q.moving) {
        if (now - q.t0 >= q.speed) { q.moving = false; q.x = q.nx; q.y = q.ny; } else continue;
      }
      if (now < q.wait) { if (q.look && now >= q.look) { q.dir = ['up', 'down', 'left', 'right'][Math.floor(rand() * 4)]; q.look = 0; } continue; }
      if (q.kind === 'afflicted') { const o = q.p.look || [q.p.face || 'down', 'left', 'right']; q.dir = o[Math.floor(rand() * o.length)]; q.wait = now + 3200 + rand() * 2000; continue; }
      const [gx, gy] = q.p.route[q.i];
      if (q.x === gx && q.y === gy) {
        if (q.p.route.length < 2) continue;
        q.i = (q.i + 1) % q.p.route.length; q.wait = now + (q.p.pause || 1500); q.look = now + (q.p.pause || 1500) / 2;
        continue;
      }
      const pk = `${q.x},${q.y}>${gx},${gy}`;
      if (!paths.has(pk)) paths.set(pk, findPath(q.x, q.y, new Set([`${gx},${gy}`]), env.walk));
      const path = paths.get(pk);
      if (!path?.length) { q.wait = now + 800; continue; }
      q.dir = path[0]; q.nx = q.x + DIR[q.dir][0]; q.ny = q.y + DIR[q.dir][1]; q.moving = true; q.t0 = now;
    }
    if (now < calm) { for (const q of ps) q.noticed = 0; continue; }
    const grass = m.isGrass(ax, ay);
    for (const q of ps) {
      const g = q.moving ? Math.min(1, (now - q.t0) / q.speed) : 0;
      const sx = (q.x + (q.nx - q.x) * g) * T + 8, sy = (q.y + (q.ny - q.y) * g) * T + T;
      const [ex, ey] = eyeAt(sx, sy, q.dir);
      q.noticed = inSight(ex, ey, q.dir, px, py, grass, env.blocked) ? (q.noticed || 0) + DT : Math.max(0, (q.noticed || 0) - 2 * DT);
      if (q.noticed >= SEE.notice) {
        stops.push(now); tally.by[q.p.id] = (tally.by[q.p.id] || 0) + 1; tally.where[`${ax},${ay}`] = (tally.where[`${ax},${ay}`] || 0) + 1;
        calm = now + CALM_MS; break;
      }
    }
  }
  return stops;
}

export function measure(plan, careful, { runs = 16, minutes = 10 } = {}) {
  const RUNS = runs, RUN_MS = minutes * 60000;
  const m = getMap(plan.map), env = setup(m, plan.chapter);
  const tiles = route(m, env, plan.path.split(' '), careful);
  let stops = 0, minGap = Infinity;
  for (let r = 0; r < RUNS; r++) {
    const s = simulate(m, env, tiles, careful, RUN_MS);
    stops += s.length;
    for (let i = 1; i < s.length; i++) minGap = Math.min(minGap, s[i] - s[i - 1]);
  }
  const total = (RUNS * RUN_MS) / 60000;
  return { perStop: stops ? total / stops : Infinity, stops, minutes: total, minGap, loop: (tiles.length * WALK) / 1000 };
}

