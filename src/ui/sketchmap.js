// The truth under the grimoire's hand-drawn map (sketch.js draws it). Pure: no DOM, runs in node.
// Everything comes from the world's own maps (src/data/world): the places are the anchors that carry a
// `map: { label, kind }` entry, where they are is the anchor's tile scaled into the drawing, the lanes
// are the cheapest walkable ways between neighbouring places on the tile grid, and her mark is her
// tile through the same scaling. Only the look (the region's ratio and season word) is decided here.
//   REGIONS                 { village: { name, season, ratio, map, places: { 'village.square': { label, kind, when } } } }
//   placeOf(anchor)         the place of the sketch an anchor belongs to (an interior: its door)
//   layout(region, W, H)    { pos, labels, lanes, toPx, box }: px positions for a drawing W x H
//   whereOnSketch(where, L) her mark from world.where ({ map, x, y }) -> { region, x, y, place, inside }
import { DEFS } from '../data/world/index.js';

// the look of each region's sheet: its season word and its height / width
const LOOK = {
  village: { season: 'inverno', ratio: 1.1 },
  forest: { season: 'primavera', ratio: 0.9 },
  depths: { season: 'autunno', ratio: 0.82 },
};
const DEF = Object.fromEntries(DEFS.map((d) => [d.id, d]));

export const REGIONS = Object.fromEntries(Object.entries(LOOK).map(([id, look]) => {
  const def = DEF[id];
  const places = {};
  for (const [name, e] of Object.entries(def.map || {})) if (e && e.label) places[`${id}.${name}`] = { label: e.label, kind: e.kind, when: e.when || null };
  return [id, { id, name: def.name, ...look, places }];
}));
// the height of a region's drawing for a width: on a narrow phone it keeps the height of a 330 px one, so
// the names still find room (on a desktop the page's height decides: min 0)
export const heightOf = (id, W, min = 330) => Math.round(Math.max(W, min) * REGIONS[id].ratio);
export const REGION_OF = (place) => (place || '').split('.')[0];
export const ALL_PLACES = Object.values(REGIONS).flatMap((r) => Object.keys(r.places));
// anchors that are deliberately not on the map, with the reason (the test lists them)
export const OFF_MAP = Object.fromEntries(Object.keys(REGIONS).flatMap((id) => Object.entries(DEF[id].map || {})
  .filter(([, e]) => e && e.off).map(([name, e]) => [`${id}.${name}`, e.off])));

// a place inside thick fog (the deep wood): the broom cannot land there (src/world/fly.js says the same)
export const inFog = (place) => {
  const [mapId, name] = String(place).split('.'), def = DEF[mapId], a = def?.anchors?.[name];
  return !!a && (def.fog || []).some(({ area: [x, y, w, h] }) => a[0] >= x && a[0] < x + w && a[1] >= y && a[1] < y + h);
};

// ---- which place an anchor belongs to
export const placeOf = (anchor) => {
  if (!anchor || typeof anchor !== 'string') return null;
  const [mapId, name] = anchor.split('.');
  const def = DEF[mapId];
  if (!def) return anchor;
  if (def.mapDoor) return placeOf(def.mapDoor); // inside a building or a world of Altrove: its door
  const e = def.map?.[name];
  if (e?.in) return placeOf(`${mapId}.${e.in}`);
  return anchor;
};

// ---- the tiles: what she can walk on (the same rule as src/world/maps.js, tested against it)
const SOLID_TILES = new Set('~w tpybfrsgix');
const OPEN_BLOCKS = new Set(['bones', 'mushrooms', 'candles', 'stairs', 'rugdeco']);
const COST = { '=': 2, '#': 2, ':': 2, _: 2, ';': 2, '.': 3, h: 3, ',': 4 };
const isLetter = (ch) => ch >= 'A' && ch <= 'Z';
const cache = new Map();
export function grid(id) {
  if (cache.has(id)) return cache.get(id);
  const def = DEF[id], rows = def.rows, H = rows.length, W = rows[0].length;
  const walk = new Uint8Array(W * H), cost = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = rows[y][x] ?? ' ';
    let ok;
    if (isLetter(ch)) { const k = def.key?.[ch]; ok = !!k && (OPEN_BLOCKS.has(k.kind) || k.solid === false); } else ok = !SOLID_TILES.has(ch);
    walk[y * W + x] = ok ? 1 : 0;
    // a door's '+' travels when stepped on: it is not a way through
    cost[y * W + x] = ok && ch !== '+' ? COST[ch] || 3 : 0;
  }
  const anchors = Object.fromEntries(Object.entries(def.anchors || {}).map(([n, [x, y]]) => [`${id}.${n}`, [x, y]]));
  // the drawing covers every walkable tile and every anchor
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  const take = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (walk[y * W + x]) take(x, y);
  for (const [x, y] of Object.values(anchors)) take(x, y);
  const g = { id, W, H, walk, cost, anchors, box: { x0, y0, x1, y1 } };
  cache.set(id, g);
  return g;
}

// cheapest ways from one tile to all (Dijkstra; small integer costs, x10; a diagonal step costs 14 and
// is taken only between two open tiles, as a person cuts a corner)
const STEPS8 = [[1, 0, 10], [-1, 0, 10], [0, 1, 10], [0, -1, 10], [1, 1, 14], [1, -1, 14], [-1, 1, 14], [-1, -1, 14]];
function ways(g, [sx, sy]) {
  const N = g.W * g.H, dist = new Float64Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1);
  const buckets = [[sy * g.W + sx]]; dist[sy * g.W + sx] = 0;
  for (let d = 0; d < buckets.length; d++) {
    const b = buckets[d];
    if (!b) continue;
    for (const i of b) {
      if (dist[i] !== d) continue;
      const x = i % g.W, y = (i / g.W) | 0;
      for (const [dx, dy, step] of STEPS8) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= g.W || ny >= g.H) continue;
        const j = ny * g.W + nx, c = g.cost[j];
        if (!c) continue;
        if (dx && dy && (!g.cost[y * g.W + nx] || !g.cost[ny * g.W + x])) continue;
        const nd = d + c * step;
        if (nd < dist[j]) { dist[j] = nd; prev[j] = i; (buckets[nd] ||= []).push(j); }
      }
    }
  }
  return { dist, prev };
}

// ---- the lanes: between two places when the cheapest way does not cross a third one's ground, and no
// third one lies almost on the way. Each lane keeps its real tiles. The ways are then traced again, short
// ones first, with the roads already traced made cheaper: lanes that go the same way share the same
// tiles, and the drawing (network) traces each stretch of road once.
const laneCache = new Map();
const SLACK = 1, VIA = 1.3;
const trace = (w, g, [bx, by]) => { const t = []; for (let i = by * g.W + bx; i >= 0; i = w.prev[i]) t.push([i % g.W, (i / g.W) | 0]); return t.reverse(); };
export function lanes(id) {
  if (laneCache.has(id)) return laneCache.get(id);
  const g = grid(id), all = Object.keys(REGIONS[id].places);
  // a place that shows only later (her garden) is not a crossing: the others must join without it,
  // and it hangs by one lane from the place nearest to it
  const ids = all.filter((p) => !REGIONS[id].places[p].when);
  const at = (p) => g.anchors[p];
  const W = Object.fromEntries(ids.map((p) => [p, ways(g, at(p))]));
  // whose ground each tile is: the place it is cheapest to reach from
  const owner = new Int16Array(g.W * g.H).fill(-1);
  for (let i = 0; i < owner.length; i++) { let bd = Infinity; ids.forEach((p, n) => { const d = W[p].dist[i]; if (d < bd) { bd = d; owner[i] = n; } }); }
  const pairs = [];
  for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
    const A = ids[a], B = ids[b], [bx, by] = at(B), dAB = W[A].dist[by * g.W + bx];
    if (!Number.isFinite(dAB)) continue;
    // neighbours: the way from A to B crosses no third place's ground (a tile or two of slack)
    const foreign = trace(W[A], g, at(B)).filter(([x, y]) => { const o = owner[y * g.W + x]; return o !== a && o !== b; }).length;
    if (foreign > SLACK) continue;
    // and no third place lies almost on the way (A-C-B hardly longer than A-B)
    const via = ids.some((C) => C !== A && C !== B && (() => { const [cx, cy] = at(C); return W[A].dist[cy * g.W + cx] + W[C].dist[by * g.W + bx] <= dAB * VIA; })());
    if (!via) pairs.push({ a: A, b: B, d: dAB });
  }
  for (const L of all.filter((p) => !ids.includes(p))) {
    const w = ways(g, at(L)), dist = (p) => { const [x, y] = at(p); return w.dist[y * g.W + x]; };
    const B = ids.filter((p) => Number.isFinite(dist(p))).sort((p, q) => dist(p) - dist(q))[0];
    if (B) pairs.push({ a: L, b: B, d: dist(B) });
  }
  const used = { ...g, cost: Uint8Array.from(g.cost) };
  const out = [...pairs].sort((p, q) => p.d - q.d).map((p) => {
    const tiles = trace(ways(used, at(p.a)), used, at(p.b));
    for (const [x, y] of tiles) if (used.cost[y * g.W + x]) used.cost[y * g.W + x] = 1;
    return { a: p.a, b: p.b, tiles };
  });
  laneCache.set(id, out);
  return out;
}
// The roads to draw for the lanes shown, each stretch once: chains of tiles between crossings and ends,
// in px (moved with the places, as her mark is: L.at). -> [[[x, y], ...], ...]
export function network(L, shown) {
  const key = (x, y) => `${x},${y}`, adj = new Map(), ends = new Set();
  const link = (p, q) => { const a = key(...p), b = key(...q); if (!adj.has(a)) adj.set(a, new Set()); if (!adj.has(b)) adj.set(b, new Set()); adj.get(a).add(b); adj.get(b).add(a); };
  for (const ln of shown) { ln.tiles.forEach((t, i) => i && link(ln.tiles[i - 1], t)); ends.add(key(...ln.tiles[0])); ends.add(key(...ln.tiles[ln.tiles.length - 1])); }
  const node = (k) => ends.has(k) || adj.get(k).size !== 2;
  const done = new Set(), out = [];
  const mark = (a, b) => { done.add(`${a}|${b}`); done.add(`${b}|${a}`); };
  const walk = (from, next) => {
    const chain = [from]; let prev = from, cur = next;
    mark(from, next);
    for (;;) {
      chain.push(cur);
      if (node(cur)) break;
      const nx = [...adj.get(cur)].find((n) => n !== prev);
      if (!nx || done.has(`${cur}|${nx}`)) break;
      mark(cur, nx); prev = cur; cur = nx;
    }
    return chain;
  };
  for (const k of adj.keys()) if (node(k)) for (const n of adj.get(k)) if (!done.has(`${k}|${n}`)) out.push(walk(k, n));
  for (const k of adj.keys()) for (const n of adj.get(k)) if (!done.has(`${k}|${n}`)) out.push(walk(k, n)); // closed loops
  return out.map((c) => simplify(c.map((t) => L.at(...t.split(',').map(Number))), 3.2));
}
// Ramer-Douglas-Peucker on tile points
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1], L = Math.hypot(bx - ax, by - ay) || 1;
  let best = -1, bd = 0;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs((by - ay) * pts[i][0] - (bx - ax) * pts[i][1] + bx * ay - by * ax) / L; if (d > bd) { bd = d; best = i; } }
  if (bd <= eps) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, best + 1), eps).slice(0, -1), ...simplify(pts.slice(best), eps)];
}

// ---- the layout of a region drawn W x H px: where each place's drawing and its pencil name go
export const LABEL_H = 19;
// a long name goes on two lines, broken at the space nearest its middle
export const labelLines = (text) => {
  const t = String(text);
  if (t.length <= 14) return [t];
  let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2))) best = i;
  return best < 0 ? [t] : [t.slice(0, best), t.slice(best + 1)];
};
const textW = (lines) => Math.ceil(Math.max(...lines.map((l) => l.length)) * 6.7 + 10); // Caveat 18px (measured: about 6.4 px a letter) with the label's padding
const forms = (text) => [labelLines(text)];
export const INSET = { l: 28, r: 28, t: 30, b: 46 };
export const scaleK = (W) => Math.max(0.85, Math.min(1.25, W / 360));
const MARK = 13; // half the size of a little drawing (before k)
export const overlap = (a, b, m = 0) => a.l < b.r + m && a.r > b.l - m && a.t < b.b + m && a.b > b.t - m;

const layouts = new Map();
export function layout(id, W, H) {
  const key = `${id}:${Math.round(W)}x${Math.round(H)}`;
  if (layouts.has(key)) return layouts.get(key);
  const g = grid(id), R = REGIONS[id], k = scaleK(W);
  const { x0, y0, x1, y1 } = g.box;
  const ids = Object.keys(R.places);
  // the scale gives a little more room where places crowd and a little less where there are few (a monotone
  // warp of each axis: what is north, south, east or west of what never changes)
  const wx = warp(ids.map((p) => g.anchors[p][0] + 0.5), x0, x1 + 1), wy = warp(ids.map((p) => g.anchors[p][1] + 0.5), y0, y1 + 1);
  const toPx = (tx, ty) => [INSET.l + (wx(tx + 0.5) - x0) / (x1 - x0 + 1) * (W - INSET.l - INSET.r), INSET.t + (wy(ty + 0.5) - y0) / (y1 - y0 + 1) * (H - INSET.t - INSET.b)];
  const raw = Object.fromEntries(ids.map((p) => [p, toPx(...g.anchors[p])]));
  const pos = Object.fromEntries(ids.map((p) => [p, [...raw[p]]]));
  const clampX = (x) => Math.max(INSET.l, Math.min(W - INSET.r, x)), clampY = (y) => Math.max(INSET.t - 4, Math.min(H - INSET.b + 6, y));
  // 1. drawings too close to each other move apart along the line between them (the relative layout stays)
  const D = 2 * MARK * k + 14;
  const relax = () => { for (let it = 0; it < 80; it++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const p = pos[ids[i]], q = pos[ids[j]], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy);
      if (d >= D) continue;
      const ux = d ? dx / d : 1, uy = d ? dy / d : 0, push = (D - d) / 2 + 0.5;
      p[0] = clampX(p[0] - ux * push); p[1] = clampY(p[1] - uy * push); q[0] = clampX(q[0] + ux * push); q[1] = clampY(q[1] + uy * push);
      moved = true;
    }
    if (!moved) break;
  } };
  relax();
  // 2. each name: under its drawing if it fits, else above, beside, or a little off; never over a drawing
  // or another name, never out of the sheet, and nearer its own drawing than any other. A greedy first
  // pass (the places nearest the bottom first: least room), then a few passes where each name moves to
  // its best spot given all the others.
  let marks = [];
  const setMarks = () => { marks = ids.map((p) => ({ id: p, l: pos[p][0] - MARK * k, r: pos[p][0] + MARK * k, t: pos[p][1] - MARK * k, b: pos[p][1] + MARK * k })); };
  const spots = (x, y, w, h) => {
    const below = y + MARK * k + 2, above = y - MARK * k - 2 - h, side = y - h / 2, gap = MARK * k + 3, out = [];
    for (const f of [0.5, 0.3, 0.7, 0.15, 0.85]) out.push([x - w * f, below], [x - w * f, above]);
    for (const dy of [0, -9, 9, -16, 16]) out.push([x + gap, side + dy], [x - gap - w, side + dy]);
    for (const f of [0.5, 0.25, 0.75]) out.push([x - w * f, below + 8], [x - w * f, above - 8]);
    return out;
  };
  const inside = (q) => q.l >= 4 && q.r <= W - 4 && q.t >= 4 && q.b <= H - 2;
  const centre = (q) => [(q.l + q.r) / 2, (q.t + q.b) / 2];
  const labels = {};
  const cost = (q, self, i) => {
    let c = (inside(q) ? 0 : 1000) + i * 0.6;
    for (const m of marks) if (m.id !== self && overlap(q, m, 3)) c += 400;
    for (const [o, r] of Object.entries(labels)) if (o !== self && r && overlap(q, r, 3)) c += 400;
    // whose name is it: it must sit nearer its own drawing than any other
    const [cx, cy] = centre(q), dist = (p) => Math.hypot(Math.max(Math.abs(cx - pos[p][0]) - (q.r - q.l) / 2, 0), Math.max(Math.abs(cy - pos[p][1]) - (q.b - q.t) / 2, 0));
    const own = dist(self);
    for (const p of ids) if (p !== self && dist(p) < own + 8) c += 150;
    c += own * 0.4;
    return c;
  };
  const best = (p) => {
    const [x, y] = pos[p];
    let b = null, bc = Infinity;
    for (const [n, lines] of forms(R.places[p].label).entries()) {
      const w = textW(lines), hh = lines.length * LABEL_H;
      spots(x, y, w, hh).forEach(([l, t], i) => { const q = { l, t, r: l + w, b: t + hh, lines }; const c = cost(q, p, i) + n * 4; if (c < bc) { bc = c; b = q; } });
    }
    return b;
  };
  const place = () => {
    setMarks();
    for (const p of ids) labels[p] = null;
    const order = [...ids].sort((a, b) => pos[b][1] - pos[a][1]);
    for (const p of order) labels[p] = best(p);
    for (let pass = 0; pass < 6; pass++) for (const p of order) { labels[p] = null; labels[p] = best(p); }
  };
  // 3. where a name still finds no room, its place and the one in the way move a little apart, and again
  const clashes = () => {
    const out = [];
    for (const a of ids) for (const b of ids) {
      if (a === b) continue;
      if (a < b && overlap(labels[a], labels[b])) out.push([a, b]);
      if (overlap(labels[a], marks.find((m) => m.id === b))) out.push([a, b]);
    }
    return out;
  };
  place();
  for (let round = 0; round < 24; round++) {
    const c = clashes();
    if (!c.length) break;
    for (const [a, b] of c) {
      const p = pos[a], q = pos[b], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1;
      p[0] = clampX(p[0] - dx / d * 3); p[1] = clampY(p[1] - dy / d * 3); q[0] = clampX(q[0] + dx / d * 3); q[1] = clampY(q[1] + dy / d * 3);
    }
    relax(); place();
  }
  // any tile in px, moved as the places around it were moved (a place's own tile: exactly its drawing)
  const at = (tx, ty) => {
    const own = ids.find((p) => g.anchors[p][0] === tx && g.anchors[p][1] === ty);
    if (own) return [...pos[own]];
    const [x, y] = toPx(tx, ty);
    let sx = 0, sy = 0, sw = 0;
    for (const p of ids) {
      const [ax, ay] = g.anchors[p], w = Math.exp(-((Math.hypot(ax - tx, ay - ty) / 3) ** 2));
      sx += w * (pos[p][0] - raw[p][0]); sy += w * (pos[p][1] - raw[p][1]); sw += w;
    }
    const n = Math.max(1, sw);
    return [x + sx / n, y + sy / n];
  };
  const out = { pos, raw, labels, toPx, at, k, W, H, box: g.box, lanes: lanes(id) };
  layouts.set(key, out);
  return out;
}
// half way between the plain scale and one that spaces the places evenly along the axis
const EVEN = 0.5;
function warp(vals, lo, hi) {
  const v = [...new Set(vals)].sort((a, b) => a - b), n = v.length;
  const knots = [[lo, lo], ...v.map((x, i) => [x, lo + (hi - lo) * (i + 0.5) / n]), [hi, hi]];
  return (x) => {
    let i = 1;
    while (i < knots.length - 1 && x > knots[i][0]) i++;
    const [a, fa] = knots[i - 1], [b, fb] = knots[i], t = b > a ? Math.max(0, Math.min(1, (x - a) / (b - a))) : 0;
    return x * (1 - EVEN) + (fa + (fb - fa) * t) * EVEN;
  };
}

// ---- her mark. where: { map, x, y } (service world.where). L: layout(region, W, H).
// Outdoors: her tile through the same scaling, moved as the nearby places were moved, so that standing
// between the square and the court shows her between them. Inside a building or a world of Altrove:
// beside the door she went in by.
export function regionOf(where) {
  if (!where?.map || !DEF[where.map]) return null;
  if (REGIONS[where.map]) return where.map;
  const door = DEF[where.map].mapDoor;
  return door ? REGION_OF(placeOf(door)) : null;
}
// the place she is at: the door of the building she is in, or a place within 3 tiles (null: in between)
export function hereOf(where) {
  const region = regionOf(where);
  if (!region) return null;
  if (!REGIONS[where.map]) return placeOf(`${where.map}.door`);
  const g = grid(region);
  let place = null, pd = Infinity;
  for (const p of Object.keys(REGIONS[region].places)) { const [ax, ay] = g.anchors[p], d = Math.hypot(ax - where.x, ay - where.y); if (d <= 3 && d < pd) { pd = d; place = p; } }
  return place;
}
export function whereOnSketch(where, L) {
  const region = regionOf(where);
  if (!region || !L) return null;
  if (!REGIONS[where.map]) {
    const place = hereOf(where);
    const [x, y] = L.pos[place];
    return { region, place, inside: true, x: x + 14 * L.k, y: y - 12 * L.k };
  }
  const [x, y] = L.at(where.x, where.y);
  return { region, place: hereOf(where), inside: false, x, y };
}
// Where the mark goes so that it covers no name and stays in the sheet: the nearest free spot around
// (x, y). busy: the rects of the names shown. The mark is about 34 x 22 px (the cross and «io»).
export const ME = { w: 36, h: 24 };
export function placeMe(x, y, busy, W, H) {
  const rect = (cx, cy) => ({ l: cx - 9, r: cx - 9 + ME.w, t: cy - ME.h / 2, b: cy + ME.h / 2 });
  const fits = (q) => q.l >= 6 && q.r <= W - 6 && q.t >= 6 && q.b <= H - 6 && !busy.some((b) => overlap(q, b, 1));
  const clamp = (cx, cy) => [Math.max(15, Math.min(W - 6 - ME.w + 9, cx)), Math.max(6 + ME.h / 2, Math.min(H - 6 - ME.h / 2, cy))];
  [x, y] = clamp(x, y);
  if (fits(rect(x, y))) return [x, y];
  for (let r = 4; r <= 60; r += 4) for (let a = 0; a < 16; a++) {
    const [cx, cy] = clamp(x + Math.cos(a / 16 * Math.PI * 2) * r, y + Math.sin(a / 16 * Math.PI * 2) * r);
    if (fits(rect(cx, cy))) return [cx, cy];
  }
  return [x, y];
}
