// The grimoire's hand-drawn map must stay true to the world (src/ui/sketchmap.js reads src/data/world).
// A new anchor, a new door, a new place a story sends her to: this test asks where it goes on the map
// (docs/KIT.md, "La mappa").
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFS } from '../src/data/world/index.js';
import { parseMap } from '../src/world/maps.js';
import { REGIONS, ALL_PLACES, OFF_MAP, placeOf, grid, lanes, layout, network, heightOf, whereOnSketch, hereOf, placeMe, overlap, labelLines, INSET, inFog } from '../src/ui/sketchmap.js';
import { DRAWINGS } from '../src/ui/sketchink.js';
import { provenSeen, isSeen } from '../src/ui/logic.js';
import { STEPS, SIDE, CAST, LESSON_MISSIONS } from '../src/data/story/index.js';
import { TRIALS } from '../src/data/trials/index.js';
import { WORLD_LIST } from '../src/data/elsewhere/index.js';
import { MAJORS } from '../src/data/cards.base.js';
import { lessonEntries } from '../src/glue/garden.rules.js';

const DEF = Object.fromEntries(DEFS.map((d) => [d.id, d]));
const REG = Object.keys(REGIONS);
const anchorsOf = (id) => Object.keys(DEF[id].anchors || {}).map((n) => `${id}.${n}`);

test('every place on the sketch is an anchor of its region, with a name and a drawing', () => {
  for (const r of REG) {
    for (const [id, p] of Object.entries(REGIONS[r].places)) {
      assert.ok(DEF[r].anchors[id.split('.')[1]], `${id} is not an anchor`);
      assert.ok(typeof p.label === 'string' && p.label.length <= 24 && p.label[0] === p.label[0].toLowerCase(), `${id}: a short lowercase name`);
      assert.ok(DRAWINGS[p.kind], `${id}: no drawing for kind "${p.kind}" (src/ui/sketchink.js)`);
    }
  }
});

test('every drawing draws something', () => {
  for (const [kind, fn] of Object.entries(DRAWINGS)) {
    let n = 0;
    const g = new Proxy({}, { get: () => () => { n += 1; } });
    fn(g);
    assert.ok(n > 2, `${kind} draws nothing`);
  }
});

test('every anchor of a region is a place, part of one, or off the map with a reason', () => {
  for (const r of REG) {
    for (const a of anchorsOf(r)) {
      const e = DEF[r].map?.[a.split('.')[1]];
      assert.ok(e, `${a}: no entry in ${r}.js \`map\` (a place { label, kind }, { in: place } or { off: why })`);
      if (e.in) assert.ok(REGIONS[r].places[`${r}.${e.in}`], `${a}: in "${e.in}", which is not a place`);
      if (e.off) assert.ok(typeof e.off === 'string' && e.off.length > 5, `${a}: off needs a reason`);
    }
    for (const n of Object.keys(DEF[r].map || {})) assert.ok(DEF[r].anchors[n], `${r}.js map: "${n}" is not an anchor`);
  }
  assert.ok(Object.keys(OFF_MAP).every((a) => !ALL_PLACES.includes(placeOf(a))));
});

test('every door of a region is on the sketch; every other map belongs to a door of a region', () => {
  for (const r of REG) for (const d of DEF[r].doors || []) assert.ok(ALL_PLACES.includes(placeOf(`${r}.${d.at}`)), `${r}: the door at ${d.at} is not on the map`);
  for (const d of DEFS.filter((x) => !REGIONS[x.id])) {
    assert.ok(d.mapDoor, `${d.id}.js: no mapDoor (the door on the map she is at when inside)`);
    assert.ok(ALL_PLACES.includes(placeOf(d.mapDoor)), `${d.id}: mapDoor ${d.mapDoor} is not a place`);
    for (const a of anchorsOf(d.id)) assert.equal(placeOf(a), placeOf(d.mapDoor));
  }
  // a building is drawn at the door that leads into it (the court also has stairs down to the cells)
  for (const d of DEFS.filter((x) => !REGIONS[x.id] && !x.elsewhere)) {
    const ins = REG.flatMap((r) => (DEF[r].doors || []).filter((x) => x.to.split('.')[0] === d.id).map((x) => `${r}.${x.at}`));
    assert.ok(ins.includes(d.mapDoor), `${d.id}: drawn at ${d.mapDoor}, but its doors are ${ins}`);
  }
});

test('every place the story, the trials, the side stories, the lessons and the cards send her to is on the map', () => {
  const targets = [
    ...STEPS.map((s) => [`step ${s.id}`, s.at]), ...SIDE.map((s) => [`side ${s.id}`, s.at]),
    ...LESSON_MISSIONS.map((m) => [`lesson ${m.id}`, m.at]), ...Object.values(TRIALS).map((t) => [`trial ${t.id}`, t.start?.at]),
    ...WORLD_LIST.flatMap((w) => [[`altrove ${w.id}`, w.trigger?.at], ...Object.values(w.rooms || {}).map((x) => [`altrove ${w.id} room`, x.at])]),
    ...lessonEntries().map((e) => [`garden ${e.extra.id}`, e.extra.at]), ['garden.ortica', 'forest.ortica_hut'], ['garden beds', 'village.orto'], ['library.first', 'library.desk'],
    ...MAJORS.map((c) => [`card ${c.id}`, c.spot]), ...CAST.map((c) => [`cast ${c.id}`, c.at]),
  ].filter(([, a]) => typeof a === 'string');
  assert.ok(targets.length > 80);
  for (const [who, a] of targets) assert.ok(ALL_PLACES.includes(placeOf(a)) || OFF_MAP[a], `${who}: ${a} is not on the map (placeOf -> ${placeOf(a)}) nor off it with a reason`);
  // what the story itself sends her to is always on it
  for (const [who, a] of targets.filter(([w]) => !w.startsWith('cast'))) assert.ok(ALL_PLACES.includes(placeOf(a)), `${who}: ${a}`);
});

test('names: unique per region, never over each other or a drawing, inside the sheet, from 300 to 520 px', () => {
  for (const r of REG) {
    const labels = Object.values(REGIONS[r].places).map((p) => p.label);
    assert.equal(new Set(labels).size, labels.length, `${r}: two places with one name`);
    for (const W of [300, 316, 323, 346, 400, 460, 520]) {
      const H = heightOf(r, W), L = layout(r, W, H), ids = Object.keys(L.labels);
      for (const a of ids) {
        const q = L.labels[a];
        assert.ok(q.l >= 0 && q.r <= W && q.t >= 0 && q.b <= H, `${r} @${W}: ${a}'s name is cut`);
        for (const b of ids) {
          if (a === b) continue;
          if (a < b) assert.ok(!overlap(q, L.labels[b]), `${r} @${W}: ${a} and ${b} names overlap`);
          const [x, y] = L.pos[b], m = { l: x - 13 * L.k, r: x + 13 * L.k, t: y - 13 * L.k, b: y + 13 * L.k };
          assert.ok(!overlap(q, m), `${r} @${W}: ${a}'s name covers ${b}`);
        }
      }
    }
  }
  assert.deepEqual(labelLines('la casa delle riunioni'), ['la casa delle', 'riunioni']);
});

test('the drawing keeps the world: every anchor and walkable tile inside the frame, north stays north', () => {
  for (const r of REG) {
    const W = 323, H = heightOf(r, W), L = layout(r, W, H), g = grid(r), inFrame = ([x, y]) => x >= INSET.l - 2 && x <= W - INSET.r + 2 && y >= INSET.t - 6 && y <= H - INSET.b + 8;
    for (const [x, y] of Object.values(g.anchors)) assert.ok(inFrame(L.at(x, y)), `${r}: anchor at ${x},${y} outside`);
    for (let y = 0; y < g.H; y++) for (let x = 0; x < g.W; x++) if (g.walk[y * g.W + x]) assert.ok(inFrame(L.at(x, y)), `${r}: tile ${x},${y} outside`);
    for (const a of Object.keys(L.pos)) for (const b of Object.keys(L.pos)) {
      const [ax, ay] = g.anchors[a], [bx, by] = g.anchors[b];
      if (by - ay >= 4) assert.ok(L.pos[a][1] < L.pos[b][1], `${r}: ${a} is north of ${b} in the world, not on the map`);
      if (bx - ax >= 4) assert.ok(L.pos[a][0] < L.pos[b][0], `${r}: ${a} is west of ${b} in the world, not on the map`);
    }
  }
});

test('walking: the sketch reads the tiles as the world does', () => {
  for (const r of REG) {
    const m = parseMap(DEF[r]), g = grid(r), chests = new Set(m.chests.map((c) => c.y * m.W + c.x));
    for (let i = 0; i < m.W * m.H; i++) if (!chests.has(i)) assert.equal(!!g.walk[i], !m.solid[i], `${r}: tile ${i % m.W},${(i / m.W) | 0}`);
    for (const p of Object.keys(REGIONS[r].places)) { const a = m.anchors[p]; assert.equal(inFog(p), !!m.fogAt(a.x, a.y), p); }
  }
});

test('lanes follow walkable tiles, step by step, and every place has one', () => {
  for (const r of REG) {
    const g = grid(r), ls = lanes(r);
    for (const ln of ls) {
      assert.deepEqual(ln.tiles[0], g.anchors[ln.a]); assert.deepEqual(ln.tiles.at(-1), g.anchors[ln.b]);
      ln.tiles.forEach(([x, y], i) => {
        assert.ok(g.walk[y * g.W + x], `${r}: ${ln.a}-${ln.b} through a solid tile ${x},${y}`);
        if (i) { const [px, py] = ln.tiles[i - 1]; assert.ok(Math.max(Math.abs(x - px), Math.abs(y - py)) === 1, `${r}: ${ln.a}-${ln.b} jumps`); }
      });
    }
    for (const p of Object.keys(REGIONS[r].places)) assert.ok(ls.some((ln) => ln.a === p || ln.b === p), `${r}: ${p} has no lane`);
    const L = layout(r, 323, heightOf(r, 323));
    assert.ok(network(L, ls).length >= ls.length / 2);
  }
});

test('where she is: her tile through the same scale; inside a building or Altrove, at its door', () => {
  const L = layout('village', 323, heightOf('village', 323)), g = grid('village');
  // on a place's tile: on its drawing
  const [sx, sy] = g.anchors['village.square'], sq = whereOnSketch({ map: 'village', x: sx, y: sy }, L);
  assert.deepEqual([sq.x, sq.y], L.pos['village.square']); assert.equal(sq.place, 'village.square');
  // half way between the square (18,22) and the court (32,19): between their drawings, and at no place
  const mid = whereOnSketch({ map: 'village', x: 25, y: 20 }, L), [qx] = L.pos['village.court_door'];
  assert.ok(mid.x > L.pos['village.square'][0] && mid.x < qx); assert.equal(mid.place, null); assert.equal(hereOf({ map: 'village', x: 25, y: 20 }), null);
  for (const d of DEFS.filter((x) => !REGIONS[x.id])) {
    const m = parseMap(d), t = Object.values(m.anchors)[0];
    const w = whereOnSketch({ map: d.id, x: t.x, y: t.y }, layout('village', 323, heightOf('village', 323)));
    assert.equal(w.region, 'village'); assert.equal(w.place, placeOf(d.mapDoor)); assert.ok(w.inside);
  }
  for (const r of ['forest', 'depths']) { const g2 = grid(r), [x, y] = g2.anchors[`${r}.entry`]; assert.equal(whereOnSketch({ map: r, x, y }, layout(r, 323, heightOf(r, 323))).region, r); }
  // the mark moves off a name, and stays in the sheet
  const busy = [{ l: 100, r: 180, t: 90, b: 110 }];
  const [mx, my] = placeMe(120, 100, busy, 323, 300), me = { l: mx - 9, r: mx + 27, t: my - 12, b: my + 12 };
  assert.ok(!overlap(me, busy[0], 1));
  const [ex, ey] = placeMe(-20, 999, [], 323, 300); assert.ok(ex - 9 >= 6 && ey + 12 <= 300 - 6);
});

test('an old save: places new on the map are seen when the save proves she has been there', () => {
  const s = { step: 'c2.ortica', flags: {}, stats: { seen: { 'village.stall': true, 'village.venusglass': true, 'library.door': true } } };
  const p = provenSeen(s);
  for (const id of ['village.market', 'village.lane', 'village.library_door', 'village.malva_door', 'village.forest_gate', 'village.cottage_door', 'village.square']) assert.ok(p.includes(id), id);
  assert.ok(!p.includes('forest.ortica_hut') && !p.includes('village.orto'));
  assert.ok(provenSeen({ ...s, flags: { 'garden.given': true } }).includes('village.orto'));
  const done = provenSeen({ step: 'p.road', flags: {}, stats: { seen: {} } }, { extras: [{ id: 'x', kind: 'trial', at: 'village.well' }, { id: 'y', kind: 'side', at: 'village.curtain' }], done: () => true });
  assert.deepEqual(done, ['village.square']);
  // a card's spot she has seen shows its place
  assert.ok(isSeen('village.lane', { stats: { seen: { 'village.curtain': true } } }, ['village.curtain']));
});
