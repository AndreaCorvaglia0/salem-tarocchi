// The tap gate (src/story/pace.js): one tap completes, a second after the pause goes on, never two lines.
import test from 'node:test';
import assert from 'node:assert/strict';
import { gate } from '../src/story/pace.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// a fake reveal: shown after `ms` unless finished
const reveal = (ms) => { let t = 0, cb = null; return { start: (done) => { cb = done; t = setTimeout(done, ms); }, finish: () => { clearTimeout(t); } , get cb() { return cb; } }; };

test('a tap while appearing completes; an immediate second tap is ignored; after the pause it goes on', async () => {
  const r = reveal(1000); let ready = 0;
  const g = gate({ ...r, pause: 60, onReady: () => ready++ });
  assert.equal(g.tap(), 'complete');
  assert.equal(g.tap(), 'wait');
  assert.equal(ready, 0, 'no cue before the pause');
  await wait(80);
  assert.equal(ready, 1, 'the cue shows when a tap will be accepted');
  assert.equal(g.tap(), 'next');
  assert.equal(await g.done, 'tap');
  assert.equal(g.tap(), 'gone');
});

test('nothing goes on by itself', async () => {
  const g = gate({ ...reveal(10), pause: 20 });
  let over = false; g.done.then(() => { over = true; });
  await wait(120);
  assert.equal(over, false); assert.equal(g.phase, 'ready');
});

test('one tap never advances two lines', async () => {
  const lines = [gate({ ...reveal(5), pause: 20 }), null];
  await wait(40);
  assert.equal(lines[0].tap(), 'next');
  lines[1] = gate({ ...reveal(500), pause: 20 }); // the next line starts: the same tap cannot reach it
  assert.equal(lines[1].phase, 'showing');
  assert.equal(lines[1].tap(), 'complete');
});

test('a question resolves by itself once fully shown (the choices follow)', async () => {
  const g = gate({ ...reveal(10), pause: 20, auto: true });
  assert.equal(await g.done, 'auto');
});
