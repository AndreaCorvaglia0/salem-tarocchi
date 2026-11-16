import test from 'node:test';
import assert from 'node:assert/strict';
import { VOICES, STUBS } from '../src/data/reading/registry.js';
import { voice, hasVoice, useStubs, voiceIds } from '../src/reading/index.js';

test('registry ignores stubs unless asked', () => {
  assert.ok(Object.keys(VOICES).every((id) => !id.startsWith('_')));
  assert.ok(Object.keys(STUBS).every((id) => id.startsWith('_')));
  useStubs(false);
  assert.equal(hasVoice('_a'), false); assert.equal(voice('_a'), null);
  assert.ok(voiceIds().every((id) => !id.startsWith('_')));
  useStubs(true);
  assert.equal(hasVoice('_a'), true);
  useStubs(false);
});
