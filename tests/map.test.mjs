// The services are called by name: a typo or a removed provider only shows at run time. This catches it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { orphanServices } from '../scripts/map.mjs';

test('every service that is called is provided somewhere', () => {
  assert.deepEqual(orphanServices(), []);
});
