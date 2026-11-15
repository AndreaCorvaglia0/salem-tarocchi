// Behaviour feeds (src/glue/traits.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createFeeds } from '../src/glue/traits.rules.js';

test('places off the path and optional chats: esplora +1, rate-limited', () => {
  const f = createFeeds({ gap: 1000 });
  assert.equal(f.seen('village.square', ['village.square']), null, 'on the path');
  assert.equal(f.seen('cottage.door', []), null, 'a room door');
  assert.deepEqual(f.seen('village.well', ['village.square'], 0), { esplora: 1 });
  assert.equal(f.seen('village.reeds', [], 500), null, 'too soon');
  assert.deepEqual(f.seen('village.reeds', [], 1600), { esplora: 1 });
  assert.equal(f.talk('village.square', 'village.square', 0), null);
  assert.deepEqual(f.talk('village.stall', 'village.square', 0), { esplora: 1 });
});

test('straight to the step: esplora -1 only without a detour', () => {
  const f = createFeeds({ gap: 0, direct: 50 });
  assert.deepEqual(f.step(20, 0), { esplora: -1 });
  assert.equal(f.step(0, 1), null, 'no walking: a scene moved the step');
  assert.equal(f.step(200, 2), null, 'a long way round');
  f.seen('village.well', [], 3);
  assert.equal(f.step(10, 4), null, 'a detour since the last step');
  assert.deepEqual(f.step(10, 5), { esplora: -1 }, 'the detour is forgotten after a step');
});

test('risk: patrol sightings and stun up, the bottle down', () => {
  const f = createFeeds({ gap: 1000 });
  assert.deepEqual(f.patrol(0), { rischio: 1 }); assert.equal(f.patrol(10), null);
  assert.deepEqual(f.stun(0), { rischio: 1 }); assert.deepEqual(f.bottle(0), { rischio: -1 });
});
