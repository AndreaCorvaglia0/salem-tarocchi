// The buildings with a personality (notes/buildings.md): one table of symbols agrees in the three places
// she reads them (the hanging sign, the signposts, the grimoire's map); no herb spot, anchor or card spot
// lies under a building's picture; her cottage's stage comes from what she has.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFS } from '../src/data/world/index.js';
import { parseMap } from '../src/world/maps.js';
import { KINDS } from '../src/world/tiles.js';
import { GLYPHS, SIGN_GLYPHS, PLACES, SYMBOL_OF_BLOCK, SYMBOL_OF_SKETCH } from '../src/data/world/symbols.js';
import { DRAWINGS, SIGNED, SYMBOL_INK } from '../src/ui/sketchink.js';
import { HERB_SPOTS } from '../src/data/world/herbs.js';
import { homeStage, homeSlots, homeOpts, PRIZES } from '../src/world/home.js';
import { fresh } from '../src/core/state.js';

const DEF = Object.fromEntries(DEFS.map((d) => [d.id, d]));
const REGIONS = ['village', 'forest', 'depths'];
const T = 16;

test('every symbol of the table exists in pixels (sign and signpost) and in ink (map)', () => {
  for (const [id, p] of Object.entries(PLACES)) {
    assert.ok(GLYPHS[p.symbol], `${id}: no 5x5 glyph for ${p.symbol}`);
    assert.ok(SIGN_GLYPHS[p.symbol], `${id}: no 7x7 sign glyph for ${p.symbol}`);
    assert.ok(SYMBOL_INK[p.symbol], `${id}: no ink for ${p.symbol}`);
    assert.ok(KINDS[p.block], `${id}: block kind ${p.block} unknown`);
    assert.ok(DRAWINGS[p.sketch], `${id}: no map drawing ${p.sketch}`);
    assert.equal(SIGNED[p.sketch], p.symbol, `${id}: the map drawing "${p.sketch}" does not carry the ${p.symbol}`);
  }
  for (const g of [...Object.values(GLYPHS)]) { assert.equal(g.length, 5); g.forEach((r) => assert.equal(r.length, 5)); }
  for (const g of Object.values(SIGN_GLYPHS)) { assert.equal(g.length, 7); g.forEach((r) => assert.equal(r.length, 7)); }
});

// the block whose door is next to an anchor (or, for a place without a door, the building block nearest it)
function blockAt(m, a) {
  const door = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy]) => [a.x + dx, a.y + dy]).find(([x, y]) => m.at(x, y) === '+');
  const inside = (b, x, y) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;
  if (door) { const b = m.blocks.find((q) => inside(q, ...door)); if (b) return b; }
  const near = m.blocks.filter((b) => KINDS[b.kind]?.over != null).map((b) => [b, Math.max(0, b.x - a.x, a.x - (b.x + b.w - 1)) + Math.max(0, b.y - a.y, a.y - (b.y + b.h - 1))]).sort((p, q) => p[1] - q[1]);
  return near[0] && near[0][1] <= 1 ? near[0][0] : null;
}

test('a building on the map, its sign and its drawing on the grimoire map show the same symbol', () => {
  let n = 0;
  for (const r of REGIONS) {
    const m = parseMap(DEF[r]);
    for (const [name, e] of Object.entries(DEF[r].map || {})) {
      if (!e.kind) continue;
      const b = blockAt(m, m.anchors[`${r}.${name}`]);
      const signSym = b && SYMBOL_OF_BLOCK[b.kind], mapSym = SYMBOL_OF_SKETCH[e.kind];
      if (signSym || mapSym) { assert.equal(mapSym, signSym, `${r}.${name}: sign "${signSym}" (block ${b?.kind}) but map drawing "${e.kind}" carries "${mapSym}"`); n++; }
    }
  }
  assert.ok(n >= 8, `only ${n} signed buildings found`);
  // every block kind with a sign is somewhere on a region's map
  for (const p of Object.values(PLACES)) assert.ok(REGIONS.some((r) => parseMap(DEF[r]).blocks.some((b) => b.kind === p.block)), `${p.block} is on no map`);
});

test('a signpost arrow with a building symbol points towards that building', () => {
  for (const r of REGIONS) {
    const m = parseMap(DEF[r]);
    for (const s of m.blocks.filter((b) => b.kind === 'signpost')) {
      for (const [dir, sym] of s.opts.arrows) {
        assert.ok(GLYPHS[sym], `${r} signpost at ${s.x},${s.y}: unknown symbol ${sym}`);
        const kinds = Object.values(PLACES).filter((p) => p.symbol === sym).map((p) => p.block);
        if (!kinds.length) continue;
        const targets = m.blocks.filter((b) => kinds.includes(b.kind));
        assert.ok(targets.length, `${r} signpost at ${s.x},${s.y}: the ${sym} points to nothing on this map`);
        const ok = targets.some((b) => {
          const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = cx - s.x, dy = cy - s.y;
          return dir === 'left' ? dx < 0 : dir === 'right' ? dx > 0 : dir === 'up' ? dy < 0 : dy > 0;
        });
        assert.ok(ok, `${r} signpost at ${s.x},${s.y}: the ${sym} points ${dir}, the building is not that way`);
      }
    }
  }
});

// the tiles a building's picture covers: its footprint, widened by ox (and `right`) and raised by over
const covered = (b) => {
  const K = KINDS[b.kind], ox = K.ox || 0, right = K.right ?? ox, out = [];
  const x0 = Math.floor((b.x * T - ox) / T), x1 = Math.floor(((b.x + b.w) * T + right - 1) / T), y0 = Math.floor((b.y * T - K.over) / T);
  for (let y = y0; y < b.y + b.h; y++) for (let x = x0; x <= x1; x++) {
    const c = (b.x + b.w / 2) * T; // a tower (half): above the footprint only its columns
    if (K.half && y < b.y && ((x + 1) * T <= c - K.half || x * T >= c + K.half)) continue;
    out.push([x, y]);
  }
  return out;
};

test('no herb spot, anchor or chest lies under a building picture', () => {
  for (const r of ['village', 'forest']) {
    const m = parseMap(DEF[r]);
    const under = new Map();
    for (const b of m.blocks.filter((q) => KINDS[q.kind]?.over != null)) for (const [x, y] of covered(b)) if (!(x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h)) under.set(`${x},${y}`, b.kind);
    for (const s of HERB_SPOTS.filter((q) => q.map === r)) assert.ok(!under.has(`${s.x},${s.y}`), `herb ${s.id} at ${s.x},${s.y} is under the ${under.get(`${s.x},${s.y}`)}`);
    for (const a of Object.values(m.anchors)) {
      // the upper street passes behind the library and the court: tiles behind a roof are fine, an anchor is not
      assert.ok(!under.has(`${a.x},${a.y}`), `anchor ${a.name} at ${a.x},${a.y} is under the ${under.get(`${a.x},${a.y}`)}`);
    }
    for (const c of m.chests) assert.ok(!under.has(`${c.x},${c.y}`), `chest ${c.id} under the ${under.get(`${c.x},${c.y}`)}`);
  }
});

test('the two card hiding spots of the lane keep their pictures (the curtain and the glass on the sill)', () => {
  const m = parseMap(DEF.village);
  const curtain = m.anchors['village.curtain'], sill = m.anchors['village.venusglass'];
  const above = (a) => m.blocks.find((b) => b.kind === 'house' && a.x >= b.x && a.x < b.x + b.w && a.y === b.y + b.h);
  const bc = above(curtain), bs = above(sill);
  assert.ok(bc && bc.opts.curtain === curtain.x - bc.x, 'the curtain is over the curtain spot');
  assert.ok(bs && bs.opts.sill === sill.x - bs.x, 'the glass is over the sill spot');
  // a window is drawn in those columns (not the door, not a corner, not boarded up)
  for (const [b, col] of [[bc, bc.opts.curtain], [bs, bs.opts.sill]]) {
    const dc = b.doors[0]?.[0] ?? b.opts.door;
    assert.ok(col !== dc && col > 0 && col < b.w - 1 && b.opts.variant !== 'ruined');
  }
  // one rich house, one ruin, the rest plain
  const houses = m.blocks.filter((b) => b.kind === 'house');
  assert.equal(houses.filter((b) => b.opts.variant === 'rich').length, 1);
  assert.equal(houses.filter((b) => b.opts.variant === 'ruined').length, 1);
});

test('the districts only change the look: their areas are inside the map', () => {
  const m = parseMap(DEF.village);
  assert.ok((DEF.village.districts || []).length === 3);
  for (const { look, area: [x, y, w, h] } of DEF.village.districts) {
    assert.ok(['upper', 'lower', 'market'].includes(look));
    assert.ok(x >= 0 && y >= 0 && x + w <= m.W && y + h <= m.H, look);
  }
});

test('her cottage: the stage comes from what she has, never from the step', () => {
  const s = fresh();
  assert.equal(homeStage(s), 1);
  assert.equal(homeStage({ ...s, step: 'c2.ortica' }), 1);
  assert.equal(homeStage({ ...s, flags: { 'garden.given': true } }), 2);
  assert.equal(homeStage({ ...s, chapter: 3 }), 2);
  assert.equal(homeStage({ ...s, xp: 270 }), 2); // level 4: the second title, Fattucchiera
  assert.equal(homeStage({ ...s, xp: 269 }), 1);
  assert.equal(homeStage({ ...s, chapter: 4, flags: { 'ending.seen': true } }), 3);
  // slots: no suit while the portrait says nothing; plants from the beds; the first prize she holds
  assert.equal(homeSlots(s).suit, null);
  const t = { ...s, traits: { ...s.traits, guida: 3, tono: 3 }, garden: { unlocked: true, beds: [{ herb: 'lavanda' }, null, { herb: 'lavanda' }, { herb: 'timo' }] }, flags: { 'ending.seen': true, [PRIZES[1][0]]: true, [PRIZES[2][0]]: true } };
  assert.deepEqual(homeSlots(t), { suit: 'cups', plants: ['lavanda', 'timo'], prize: 'chiave' });
  assert.equal(homeOpts(t).stage, 3);
  assert.notEqual(homeOpts(t).sig, homeOpts({ ...t, flags: { ...t.flags, [PRIZES[0][0]]: true } }).sig);
  // an old save without garden or traits does not break
  assert.equal(homeOpts({ flags: { 'ending.seen': true }, chapter: 4 }).stage, 3);
});

test('the prizes by her door are real rewards of the trials', async () => {
  const { TRIALS } = await import('../src/data/trials/index.js');
  const items = JSON.stringify(TRIALS);
  for (const [flag] of PRIZES) assert.ok(items.includes(flag.slice(5)), `${flag}: no trial gives it`);
});

test('the cottage line: once per stage, only near the cottage, Tartufo or her own voice', async () => {
  const { homeLine, seesHome } = await import('../src/glue/home.js');
  const s = fresh(), near = { map: 'village', x: 4, y: 9 }, far = { map: 'village', x: 20, y: 40 };
  assert.equal(homeLine(s, near), null); // stage 1: nothing
  const two = { ...s, flags: { 'garden.given': true }, world: { once: {} }, powers: { cat: true } };
  assert.ok(homeLine(two, near).t.startsWith('('), 'Tartufo speaks in his low voice');
  assert.ok(!homeLine({ ...two, powers: {} }, near).t.startsWith('('), 'without him, her own thought');
  assert.equal(homeLine(two, far), null);
  assert.equal(homeLine({ ...two, world: { once: { 'home.2': true } } }, near), null);
  const three = { ...two, flags: { 'ending.seen': true } };
  assert.equal(homeLine(three, near).stage, 3); // a save already at the end hears the last stage only
  assert.ok(seesHome(near) && !seesHome({ map: 'forest', x: 4, y: 9 }));
});
