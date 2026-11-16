// Reads the hand-written map files (src/data/world/*.js, format in its README.md) into grids and
// lists the engine and the tests use. Pure: no Phaser, no DOM, runs in node.
import { TILES, KINDS } from './tiles.js';
import { DEFS } from '../data/world/index.js';

const isLetter = (ch) => ch >= 'A' && ch <= 'Z';
const parseRef = (ref, mapId) => { const [m, a] = ref.includes('.') ? ref.split('.') : [mapId, ref]; return `${m}.${a}`; };

export function parseMap(def) {
  const rows = def.rows;
  const H = rows.length, W = rows[0].length;
  const errors = [];
  // a map with its own look (the worlds of Altrove) may bring its own tile legend: def.tiles
  const LEG = def.tiles ? { ...TILES, ...def.tiles } : TILES;
  const info = (ch) => LEG[ch] || TILES['.'];
  rows.forEach((r, y) => { if (r.length !== W) errors.push(`${def.id}: row ${y} has ${r.length} tiles, expected ${W}`); });
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? ' ' : rows[y][x] ?? ' ');
  const solid = new Uint8Array(W * H), grass = new Uint8Array(W * H), dark = new Uint8Array(W * H);
  const under = def.ground || '.';
  // under a block the ground continues from around it (cobbles under a lamp on the square)
  const underOf = new Map();
  const groundAt = (x, y) => { const ch = at(x, y); return isLetter(ch) ? underOf.get(y * W + x) || under : ch; };

  // blocks: connected groups of one uppercase letter
  const seen = new Uint8Array(W * H), blocks = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = at(x, y);
    if (!isLetter(ch) || seen[y * W + x]) continue;
    const opts = def.key?.[ch];
    if (!opts) { errors.push(`${def.id}: letter ${ch} at ${x},${y} is not in key`); seen[y * W + x] = 1; continue; }
    if (!KINDS[opts.kind]) errors.push(`${def.id}: unknown kind "${opts.kind}" for ${ch}`);
    let x0 = x, y0 = y, x1 = x, y1 = y;
    const st = [[x, y]]; seen[y * W + x] = 1;
    while (st.length) {
      const [cx, cy] = st.pop();
      x0 = Math.min(x0, cx); x1 = Math.max(x1, cx); y0 = Math.min(y0, cy); y1 = Math.max(y1, cy);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (at(nx, ny) === ch && !seen[ny * W + nx]) { seen[ny * W + nx] = 1; st.push([nx, ny]); }
      }
    }
    const b = { letter: ch, kind: opts.kind, opts, x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, doors: [] };
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) if (at(xx, yy) === '+') b.doors.push([xx - x0, yy - y0]);
    let best = def.ground || null;
    if (!def.ground) {
      const count = {};
      for (let xx = x0 - 1; xx <= x1 + 1; xx++) for (const yy of [y0 - 1, y1 + 1]) { const c = at(xx, yy); if ('.,=#_:'.includes(c)) count[c] = (count[c] || 0) + 1; }
      for (let yy = y0; yy <= y1; yy++) for (const xx of [x0 - 1, x1 + 1]) { const c = at(xx, yy); if ('.,=#_:'.includes(c)) count[c] = (count[c] || 0) + 1; }
      best = Object.entries(count).sort((p, q) => q[1] - p[1])[0]?.[0] || null;
      if (best === ',') best = '.';
    }
    for (let yy = y0; yy <= y1; yy++) {
      // a row set into a wall (a window, a shelf, the top of a hearth): the wall goes on behind it
      let l = x0 - 1, r = x1 + 1;
      while (isLetter(at(l, yy))) l--;
      while (isLetter(at(r, yy))) r++;
      const g = at(l, yy) === 'w' && at(r, yy) === 'w' ? 'w' : best;
      if (g) for (let xx = x0; xx <= x1; xx++) if (at(xx, yy) === ch) underOf.set(yy * W + xx, g);
    }
    blocks.push(b);
  }

  // walkability
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = at(x, y);
    const t = isLetter(ch) ? null : (LEG[ch] || (errors.push(`${def.id}: unknown tile "${ch}" at ${x},${y}`), TILES['.']));
    if (t?.solid) solid[y * W + x] = 1;
    if (t?.grass) grass[y * W + x] = 1;
  }
  for (const b of blocks) {
    if (KINDS[b.kind]?.solid === false || b.opts.solid === false) continue;
    for (let yy = b.y; yy < b.y + b.h; yy++) for (let xx = b.x; xx < b.x + b.w; xx++) if (at(xx, yy) !== '+') solid[yy * W + xx] = 1;
  }
  if (def.dark === true) dark.fill(1);
  else for (const [x, y, w, h] of def.dark || []) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (xx >= 0 && yy >= 0 && xx < W && yy < H) dark[yy * W + xx] = 1;

  const anchors = {};
  for (const [name, [x, y, label]] of Object.entries(def.anchors || {})) anchors[`${def.id}.${name}`] = { map: def.id, name, x, y, label: label || name };

  // doors: the '+' tile next to the anchor
  const doors = (def.doors || []).map((d, i) => {
    const a = anchors[parseRef(d.at, def.id)];
    if (!a) { errors.push(`${def.id}: door ${i} at unknown anchor ${d.at}`); return null; }
    const near = [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]].map(([dx, dy]) => [a.x + dx, a.y + dy]).find(([x, y]) => at(x, y) === '+');
    if (!near) { errors.push(`${def.id}: door at ${d.at} has no '+' tile next to it`); return null; }
    return { id: d.id || `${def.id}.door.${a.name}`, ...d, anchor: `${def.id}.${a.name}`, x: near[0], y: near[1], to: d.to ? parseRef(d.to, def.id) : null };
  }).filter(Boolean);

  const place = (p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : anchors[parseRef(p, def.id)] || null);
  const chests = (def.chests || []).map((c) => { const p = place(c.at); if (!p) errors.push(`${def.id}: chest ${c.id} at unknown place`); return p && { ...c, x: p.x, y: p.y }; }).filter(Boolean);
  for (const c of chests) solid[c.y * W + c.x] = 1;
  // gates: tiles in the map that stay shut (solid) until their condition holds
  const gates = (def.gates || []).map((g, i) => { const p = place(g.at); if (!p) errors.push(`${def.id}: gate ${i} at unknown place`); return p && { id: g.id || `${def.id}.gate.${i}`, ...g, x: p.x, y: p.y }; }).filter(Boolean);
  const patrols = (def.patrols || []).map((p, i) => ({ id: p.id || `${def.id}.patrol.${i}`, kind: 'constable', ...p }));

  // thick fog: zones [{ id, area: [x, y, w, h] }]; a tile holds its zone's index + 1
  const fog = new Uint8Array(W * H);
  const fogZones = (def.fog || []).map((z, i) => ({ id: `${def.id}.${z.id || `fog${i}`}`, area: z.area }));
  fogZones.forEach((z, i) => { const [x, y, w, h] = z.area; for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (xx >= 0 && yy >= 0 && xx < W && yy < H) fog[yy * W + xx] = i + 1; });
  // tall grass tagged with a suit (Minor Arcana): [{ suit: 'p' | 's' | 'w' | 'c', area: [x, y, w, h] }]
  const suitGrid = new Array(W * H).fill(null);
  for (const { suit, area: [x, y, w, h] } of def.suits || []) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (xx >= 0 && yy >= 0 && xx < W && yy < H && grass[yy * W + xx]) suitGrid[yy * W + xx] = suit;
  // obstacles: brambles (fire), roots and warded stones (move); `on: chestId` sits on a chest
  const obstacles = (def.obstacles || []).map((o, i) => {
    const p = o.on ? chests.find((c) => c.id === o.on) : place(o.at);
    if (!p) { errors.push(`${def.id}: obstacle ${o.id || i} at unknown place`); return null; }
    return { id: o.id || `${def.id}.${o.kind}.${p.x}.${p.y}`, ...o, x: p.x, y: p.y };
  }).filter(Boolean);

  return {
    id: def.id, name: def.name || def.id, season: def.season || 'winter', inside: !!def.inside, def,
    W, H, rows, at, groundAt, solid, grass, dark, blocks, anchors, doors, chests, gates, patrols, fogZones, obstacles,
    // outdoors: the sky above (the broom takes off and lands only here)
    open: !def.inside && !def.under,
    fogAt: (x, y) => (x >= 0 && y >= 0 && x < W && y < H && fog[y * W + x] ? fogZones[fog[y * W + x] - 1] : null),
    suitAt: (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? suitGrid[y * W + x] : null),
    start: def.start ? parseRef(def.start, def.id) : Object.keys(anchors)[0],
    errors,
    isSolid: (x, y) => x < 0 || y < 0 || x >= W || y >= H || !!solid[y * W + x],
    isGrass: (x, y) => !!grass[y * W + x],
    isDark: (x, y) => x >= 0 && y >= 0 && x < W && y < H && !!dark[y * W + x],
    tile: (x, y) => info(groundAt(x, y)),
    elsewhere: def.elsewhere || null, // a world of Altrove: { world, rule } (src/world/elsewhere.rules.js)
  };
}

let cache = null;
export const MAPS = () => (cache ||= Object.fromEntries(DEFS.map((d) => [d.id, parseMap(d)])));
export const getMap = (id) => MAPS()[id] || null;
export const allAnchors = () => Object.assign({}, ...Object.values(MAPS()).map((m) => m.anchors));
export const anchorOf = (ref) => allAnchors()[ref] || null;
export const nearAnchor = (mapId, x, y, r = 2) => {
  let best = null, bd = Infinity;
  for (const [k, a] of Object.entries(getMap(mapId)?.anchors || {})) { const d = Math.abs(a.x - x) + Math.abs(a.y - y); if (d <= r && d < bd) { bd = d; best = k; } }
  return best;
};
// Where each chapter starts when there is no saved position.
export const CHAPTER_START = { 0: 'village.arrival', 1: 'village.arrival', 2: 'forest.entry', 3: 'depths.entry', 4: 'village.square' };
