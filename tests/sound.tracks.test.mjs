import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { cueFor, DARK, weave, SILENCE } from '../src/sound/tracks.js';
import { bedFor, LOOPS, FOREST_SPOTS, NONE, createBeds } from '../src/sound/beds.js';

const MOODS = ['title', 'session', 'reading', 'exam', 'ending', 'village', 'forest', 'depths', 'nonsense'];
const MAPS = [null, 'village', 'forest', 'depths', 'court', 'malva', 'cottage', 'shop', 'meeting'];
const ctxs = [];
for (const mood of MOODS) for (const map of MAPS) for (const chapter of [0, 1, 2, 3, 4]) for (const ended of [false, true]) ctxs.push([mood, { map, chapter, ended }]);
const list = (c) => (Array.isArray(c.t) ? c.t : c.t ? [c.t] : []);
const calmLists = new Map(), heavyLists = new Map();
for (const [mood, o] of ctxs) { const c = cueFor(mood, o); if (Array.isArray(c.t)) (c.heavy ? heavyLists : calmLists).set(c.t.join('+'), c.t); }

test('every piece named in tracks.js exists in public/music', () => {
  const ids = new Set();
  for (const [mood, o] of ctxs) for (const id of list(cueFor(mood, o))) ids.add(id);
  for (const id of DARK) ids.add(id);
  for (const id of ids) assert.ok(existsSync(new URL(`../public/music/${id}.mp3`, import.meta.url)), id);
});

test('calm playlists: the dark pieces are 15-25% and never two in a row', () => {
  assert.ok(calmLists.size >= 4, `calm playlists found: ${calmLists.size}`);
  for (const [k, l] of calmLists) {
    const dark = l.map((id) => DARK.includes(id));
    const share = dark.filter(Boolean).length / l.length;
    assert.ok(share >= 0.15 && share <= 0.25, `${k}: ${share}`);
    for (let i = 0; i < l.length; i += 1) assert.ok(!(dark[i] && dark[(i + 1) % l.length]), `${k}: two dark in a row at ${i}`);
    for (let i = 0; i < l.length; i += 1) assert.notEqual(l[i], l[(i + 1) % l.length], `${k}: the same piece twice in a row at ${i}`);
  }
});
test('heavy playlists (cellars, wood in autumn, village before the trial) are mostly dark, interleaved with the old pieces', () => {
  assert.ok(heavyLists.size >= 3);
  for (const [k, l] of heavyLists) {
    const dark = l.filter((id) => DARK.includes(id)).length / l.length;
    assert.ok(dark >= 0.3, `${k}: ${dark}`);
    for (let i = 0; i < l.length; i += 1) assert.notEqual(l[i], l[(i + 1) % l.length], `${k}: repeated at ${i}`);
  }
});
test('weave puts one dark piece after every four', () => {
  assert.deepEqual(weave(['a', 'b'], ['x', 'y']), ['a', 'b', 'a', 'b', 'x', 'a', 'b', 'a', 'b', 'y']);
});
test('the court and unknown moods stay silent; the wood plays low (the bed leads)', () => {
  assert.equal(cueFor('village', { map: 'court' }).t, null);
  assert.equal(cueFor('nonsense').t, null);
  assert.ok(cueFor('forest', { map: 'forest', chapter: 1 }).v <= 0.3);
  assert.ok(cueFor('forest', { map: 'forest', chapter: 3 }).v <= 0.3);
  assert.equal(SILENCE.t, null);
});

test('ambience: every loop named exists in public/ambience, and the places choose as asked', () => {
  const used = new Set(LOOPS);
  for (const [mood, o] of ctxs) { const b = bedFor(mood, o); if (b.t) used.add(b.t); }
  for (const [, , , id] of FOREST_SPOTS) used.add(id);
  for (const id of used) assert.ok(LOOPS.includes(id), `unknown loop ${id}`);
  for (const id of LOOPS) assert.ok(existsSync(new URL(`../public/ambience/${id}.mp3`, import.meta.url)), id);
  assert.equal(bedFor('forest', { map: 'forest', chapter: 1, x: 5, y: 5 }).t, 'wind');
  assert.equal(bedFor('forest', { map: 'forest', chapter: 3, x: 5, y: 20 }).t, 'wind');
  assert.equal(bedFor('forest', { map: 'forest', chapter: 1, x: 15, y: 32 }).t, 'fire'); // the campfire
  assert.equal(bedFor('forest', { map: 'forest', chapter: 1, x: 27, y: 21 }).t, 'stream'); // the mill
  assert.equal(bedFor('village', { map: 'cottage', chapter: 1 }).t, 'fire');
  assert.equal(bedFor('village', { map: 'malva', chapter: 1 }).t, 'fire');
  assert.equal(bedFor('village', { map: 'village', chapter: 1 }).t, 'wind');
  assert.equal(bedFor('village', { map: 'village', chapter: 3 }).t, 'rain');
  for (const m of ['court', 'depths']) assert.equal(bedFor('village', { map: m }).t, null);
  assert.equal(bedFor('depths', { map: 'depths' }).t, null);
  for (const m of ['title', 'session', 'reading', 'exam', 'ending']) assert.equal(bedFor(m, { map: 'forest' }).t, null);
  assert.equal(NONE.t, null);
});
test('ambience is clearly under the music, except in the wood where it leads', () => {
  const music = (m, o) => cueFor(m, o).v;
  assert.ok(bedFor('village', { map: 'village', chapter: 1 }).v < music('village', { map: 'village', chapter: 1 }));
  const f = { map: 'forest', chapter: 1 };
  assert.ok(bedFor('forest', f).v > 3 * music('forest', f));
});

// a fake media element: the beds follow the same rules as the music decks
function fakeEl() { return { paused: true, loop: false, volume: 1, src: '', play() { this.paused = false; return Promise.resolve(); }, pause() { this.paused = true; }, setAttribute() {}, addEventListener() {} }; }
test('beds: nothing plays before the gesture is allowed, the music switch silences them, a change swaps the loop', async () => {
  const made = [];
  const timers = { setTimeout: (f) => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {} };
  const b = createBeds({ make: () => { const e = fakeEl(); made.push(e); return e; }, doc: { hidden: false }, timers });
  b.setCue({ t: 'wind', v: 0.4, fade: 3 });
  assert.equal(b.track, 'wind');
  b.setOn(false);
  b.setCue({ t: 'rain', v: 0.4, fade: 3 });
  b.setOn(true);
  assert.equal(b.track, 'rain');
  b.setCue({ t: null, v: 0, fade: 1 });
  assert.equal(b.track, null);
  b.gesture(); // inside a tap: every deck is played once, the idle one on silence
  assert.ok(made.length === 2 && made.every((e) => e.loop === true));
  assert.ok(made.some((e) => e.src === 'silence.wav'));
});
