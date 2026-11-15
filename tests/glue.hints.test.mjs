// The trail of lights (src/glue/hints.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { trailTarget } from '../src/glue/hints.rules.js';

const steps = [{ id: 'a', at: 'village.arrival' }, { id: 'b', at: 'village.malva_door' }, { id: 'c', at: 'forest.ortica_hut' }, { id: 'n', at: null }];

test('chapters 0-1: always towards the step', () => {
  assert.equal(trailTarget({ chapter: 1, step: 'b', steps }), 'village.malva_door');
  assert.equal(trailTarget({ chapter: 0, step: 'n', steps }), null);
  assert.equal(trailTarget({ chapter: 1, step: 'zz', steps }), null, 'unknown step');
});
test('the arrival road: to the first card while only the Fool is found', () => {
  assert.equal(trailTarget({ chapter: 0, step: 'a', steps, found: ['m00'] }), 'village.road_card');
  assert.equal(trailTarget({ chapter: 0, step: 'a', steps, found: ['m00', 'm01'] }), 'village.arrival');
});
test('from chapter 2: only when asked', () => {
  assert.equal(trailTarget({ chapter: 2, step: 'c', steps }), null);
  assert.equal(trailTarget({ chapter: 2, step: 'c', steps, temp: true }), 'forest.ortica_hut');
});
