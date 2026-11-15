import test from 'node:test';
import assert from 'node:assert/strict';
import { MODES, hz, scaleNote, snapToScale, motifNotes, motifLength, MOTIF, VARIANTS, pulseInterval, lookahead, prng } from '../src/sound/theory.js';
import { MOODS, MOOD_NAMES } from '../src/sound/moods.js';
import { Planner } from '../src/sound/plan.js';

test('hz: A4 is 440, an octave doubles', () => { assert.equal(hz(69), 440); assert.ok(Math.abs(hz(81) - 880) < 1e-9); });
test('scales: no repeats, ascending, inside an octave', () => {
  for (const [k, s] of Object.entries(MODES)) { assert.equal(s[0], 0, k); for (let i = 1; i < s.length; i++) assert.ok(s[i] > s[i - 1] && s[i] < 12, k); }
});
test('scaleNote wraps octaves both ways', () => {
  assert.equal(scaleNote(57, 'aeolian', 0), 57); assert.equal(scaleNote(57, 'aeolian', 2), 60); assert.equal(scaleNote(57, 'aeolian', 7), 69);
  assert.equal(scaleNote(57, 'aeolian', -1), 55); assert.equal(scaleNote(57, 'majpenta', 5), 69);
});
test('snapToScale lands on a scale note', () => {
  for (let m = 40; m < 90; m++) { const s = snapToScale(57, 'dorian', m); assert.ok(MODES.dorian.includes((((s - 57) % 12) + 12) % 12)); }
});
test('the motif: minor in Salem, major at the end, same contour', () => {
  assert.deepEqual(MOTIF.minor.map((n) => n[0]), [0, 3, 7, 5, 3, 0]);
  assert.deepEqual(MOTIF.major.map((n) => n[0]), [0, 4, 7, 5, 4, 0]);
  const n = motifNotes('minor', 'full', 57, 1);
  assert.equal(n.length, 6); assert.equal(n[0].t, 0); assert.equal(n[0].midi, 57); assert.equal(n.at(-1).midi, 57); assert.ok(n.at(-1).last);
  assert.equal(motifLength(n), 9);
});
test('motif variants stay in range and keep time order', () => {
  for (const v of Object.keys(VARIANTS)) {
    const r = prng(5), n = motifNotes('minor', v, 57, 0.9, r);
    assert.ok(n.length >= 3, v);
    for (let i = 1; i < n.length; i++) assert.ok(n[i].t > n[i - 1].t, v);
    for (const x of n) assert.ok(x.midi >= 40 && x.midi <= 90, v);
  }
  assert.equal(motifNotes('minor', 'low', 57, 1)[0].midi, 45);
});
test('tension speeds the pulse up, within bounds', () => {
  assert.ok(pulseInterval(0) > pulseInterval(0.5) && pulseInterval(0.5) > pulseInterval(1));
  assert.equal(pulseInterval(-3), pulseInterval(0)); assert.equal(pulseInterval(9), pulseInterval(1)); assert.ok(pulseInterval(1) > 0.3);
});
test('lookahead covers two timer ticks', () => { assert.ok(lookahead(0.25) >= 1.2); assert.ok(lookahead(1) >= 2); });

const hours = (name, secs, seed = 1, params = {}) => { const p = new Planner(MOODS[name], prng(seed), 0, params); return p.until(secs); };
test('every mood plans events, in time order, never before the start', () => {
  for (const m of MOOD_NAMES) {
    const ev = hours(m, 120); assert.ok(ev.length > 0, m);
    for (let i = 1; i < ev.length; i++) assert.ok(ev[i].t >= ev[i - 1].t, m);
    assert.ok(ev[0].t >= 0, m);
  }
});
test('same seed, same music; other seed, other music', () => {
  assert.deepEqual(hours('village', 300, 4), hours('village', 300, 4));
  assert.notDeepEqual(hours('village', 300, 4), hours('village', 300, 5));
});
test('a long run stays sparse: village has long silences and the motif comes back', () => {
  const ev = hours('village', 3600, 2).filter((e) => e.type === 'note');
  const motif = ev.filter((e) => e.motif && e.i === 0); assert.ok(motif.length >= 30 && motif.length <= 90, `motif ${motif.length}`);
  const mel = ev.filter((e) => !e.motif); assert.ok(mel.length / 3600 < 0.2, 'fewer than one note per five seconds');
  let gap = 0; for (let i = 1; i < mel.length; i++) gap = Math.max(gap, mel[i].t - mel[i - 1].t);
  assert.ok(gap > 12, `longest silence ${gap}`);
});
test('the melody never repeats one note three times', () => {
  const ev = hours('forest', 1800, 9).filter((e) => e.type === 'note' && !e.motif);
  for (let i = 2; i < ev.length; i++) assert.ok(!(ev[i].midi === ev[i - 1].midi && ev[i].midi === ev[i - 2].midi));
});
test('depths: almost no melody; exam: no melody at all', () => {
  assert.ok(hours('depths', 600).filter((e) => e.type === 'note' && !e.motif).length < 40);
  assert.equal(hours('exam', 600, 1, { tension: 1 }).filter((e) => e.type === 'note').length, 0);
});
test('exam: more beats with more tension, and tension can change live', () => {
  const beats = (k) => hours('exam', 60, 1, { tension: k }).filter((e) => e.type === 'pulse').length;
  assert.ok(beats(1) > beats(0) * 2, `${beats(0)} vs ${beats(1)}`);
  const p = new Planner(MOODS.exam, prng(1), 0, { tension: 0 }); const a = p.until(30).filter((e) => e.type === 'pulse').length;
  p.setParams({ tension: 1 }); const b = p.until(60).filter((e) => e.type === 'pulse').length; assert.ok(b > a * 1.8);
  const sparks = (k) => hours('exam', 120, 1, { tension: k }).filter((e) => e.type === 'spark').length; assert.equal(sparks(0), 0); assert.ok(sparks(1) > 0);
});
test('ending: opens with IV then I in major, and the theme is in major', () => {
  const ev = hours('ending', 30, 1), pads = ev.filter((e) => e.type === 'pad');
  const firstT = pads[0].t; assert.deepEqual(pads.filter((e) => e.t === firstT).map((e) => e.midi - 45), [5, 9, 12, 17]);
  const m = ev.filter((e) => e.motif); assert.ok(m.length > 0); assert.equal(m[1].midi - m[0].midi, 4);
});
test('windows add up: asking in pieces gives the same events as asking once', () => {
  const a = new Planner(MOODS.session, prng(3), 0), b = new Planner(MOODS.session, prng(3), 0);
  const whole = a.until(200); let parts = []; for (let t = 1.5; t < 201; t += 1.5) parts = parts.concat(b.until(t));
  const key = (l) => l.filter((e) => e.t < 200).map((e) => e.t).sort((x, y) => x - y); assert.deepEqual(key(parts), key(whole));
});
test('the motif is in every mood that has one, same notes', () => {
  for (const m of MOOD_NAMES) { const d = MOODS[m]; if (!d.motif) continue; assert.ok(['minor', 'major'].includes(d.motif.kind)); assert.ok(d.motif.variants.length); for (const v of d.motif.variants) assert.ok(VARIANTS[v], `${m}:${v}`); }
});
