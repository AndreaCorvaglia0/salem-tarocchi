// The broom's limits (src/glue/fly.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { canFly, canLand } from '../src/glue/fly.rules.js';

test('take-off: outdoors only, never from the cell, in fog, spotted or mid-script', () => {
  assert.equal(canFly({ broom: false, map: 'village' }).ok, false);
  assert.equal(canFly({ broom: true, map: 'village' }).ok, true);
  assert.equal(canFly({ broom: true, map: 'forest' }).ok, true);
  for (const o of [{ map: 'cottage', inside: true }, { map: 'depths' }, { map: 'depths', near: 'depths.jail' }, { map: 'forest', fog: true }, { map: 'village', spotted: true }, { map: 'village', script: true }]) {
    const r = canFly({ broom: true, ...o });
    assert.equal(r.ok, false, JSON.stringify(o)); assert.ok(r.why.length > 10);
  }
  assert.match(canFly({ broom: true, map: 'depths', near: 'depths.jail' }).why, /cella/);
});
test('landing: a seen outdoor place', () => {
  assert.equal(canLand('village.square', { seen: { 'village.square': true } }), true);
  assert.equal(canLand('village.square', { seen: {} }), false);
  assert.equal(canLand('depths.coven', { seen: { 'depths.coven': true } }), false);
  assert.equal(canLand('cottage.table', { seenPlace: true }), false);
});
