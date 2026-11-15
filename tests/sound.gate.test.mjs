import test from 'node:test';
import assert from 'node:assert/strict';
import { musicOn, sfxOn, makeThrottle, wantsMood } from '../src/sound/gate.js';
import { MOOD_NAMES } from '../src/sound/moods.js';
import { SFX_NAMES } from '../src/sound/sfx.js';
import { createEngine } from '../src/sound/engine.js';

test('settings gating is read live and defaults to on', () => {
  const st = { settings: { music: true, sfx: true } };
  assert.ok(musicOn(st) && sfxOn(st)); st.settings.music = false; assert.ok(!musicOn(st) && sfxOn(st)); st.settings.sfx = false; assert.ok(!sfxOn(st));
  assert.ok(musicOn({}) && sfxOn(undefined));
});
test('throttle: same effect too soon is refused, another is not', () => {
  const ok = makeThrottle(); assert.ok(ok('tap', 0)); assert.ok(!ok('tap', 10)); assert.ok(ok('page', 10)); assert.ok(ok('tap', 100)); assert.ok(!ok('step', 0) === false); assert.ok(!ok('step', 100));
});
test('wantsMood validates names and clamps tension', () => {
  assert.equal(wantsMood('nope', {}, MOOD_NAMES), null);
  assert.deepEqual(wantsMood('exam', { tension: 3 }, MOOD_NAMES), { name: 'exam', opts: { tension: 1 } });
  assert.deepEqual(wantsMood('village', undefined, MOOD_NAMES), { name: 'village', opts: { tension: 0 } });
  assert.deepEqual(wantsMood(null, {}, MOOD_NAMES), { name: null, opts: {} });
});
test('all eight moods and the required effects exist', () => {
  for (const m of ['title', 'village', 'forest', 'depths', 'session', 'exam', 'reading', 'ending']) assert.ok(MOOD_NAMES.includes(m), m);
  for (const s of ['step', 'tap', 'page', 'card', 'found', 'star', 'level', 'right', 'wrong', 'suspicion', 'caught', 'door', 'coin', 'cat', 'fire', 'stun', 'write', 'bell']) assert.ok(SFX_NAMES.includes(s), s);
});

// a fake AudioContext: every node is a recording proxy, nothing is heard
const fakeCtx = () => {
  const made = [];
  const param = () => new Proxy({ value: 0 }, { get: (t, k) => (k in t ? t[k] : () => {}), set: (t, k, v) => { t[k] = v; return true; } });
  const node = (type) => { const n = new Proxy({ type, connections: 0 }, { get: (t, k) => { if (k in t) return t[k]; if (k === 'connect') return (d) => { t.connections++; return d; }; if (['gain', 'frequency', 'detune', 'Q', 'threshold', 'knee', 'ratio', 'attack', 'release', 'playbackRate', 'pan'].includes(k)) return (t[k] = param()); return () => {}; }, set: (t, k, v) => { t[k] = v; return true; } }); made.push(n); return n; };
  const ctx = { sampleRate: 8000, currentTime: 0, destination: node('dest'), made };
  for (const [m, t] of [['createGain', 'gain'], ['createOscillator', 'osc'], ['createBiquadFilter', 'filter'], ['createBufferSource', 'src'], ['createConvolver', 'conv'], ['createDynamicsCompressor', 'comp'], ['createWaveShaper', 'shaper']]) ctx[m] = () => node(t);
  ctx.createBuffer = (c, n) => ({ getChannelData: () => new Float32Array(n), length: n });
  return ctx;
};
test('the engine runs on a fake context: every mood and effect, no throw, nodes created', () => {
  const ctx = fakeCtx(), e = createEngine(ctx, { seed: 2 });
  for (const m of MOOD_NAMES) { e.setMood(m, { tension: 0.7 }); assert.equal(e.mood, m); ctx.currentTime += 3; e.pump(ctx.currentTime + 20); }
  for (const s of SFX_NAMES) assert.ok(e.sfx(s)); assert.equal(e.sfx('nope'), false);
  e.setMood(null); assert.equal(e.mood, null); e.setMusicOn(false); e.setDuck(true); e.resync(); e.pump(99);
  assert.ok(ctx.made.length > 500);
});
test('the same mood twice does not rebuild the graph', () => {
  const ctx = fakeCtx(), e = createEngine(ctx); assert.equal(e.setMood('exam'), true); const n = ctx.made.length; assert.equal(e.setMood('exam', { tension: 1 }), false); assert.equal(ctx.made.length, n);
});
