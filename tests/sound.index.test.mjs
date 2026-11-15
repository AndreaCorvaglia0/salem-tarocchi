import test from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../src/core/state.js';
import { on, emit } from '../src/core/bus.js';
import { call, has } from '../src/core/services.js';

// In Node there is no window and no Web Audio: importing must register everything and do nothing.
const sound = await import('../src/sound/index.js');

test('services are registered and harmless without Web Audio', async () => {
  for (const s of ['sound.play', 'sound.mood', 'sound.stop', 'sound.music', 'sound.sfx']) assert.ok(has(s), s);
  await call('sound.mood', 'village'); await call('sound.mood', 'exam', { tension: 0.4 }); await call('sound.mood', 'nonsense'); await call('sound.play', 'tap'); await call('sound.stop');
  emit('card:found', { id: 'm01' }); emit('card:star', { id: 'm01', stars: 1 }); emit('level:up', { level: 2 }); emit('coins', { n: 5 }); emit('coins', { n: -5 }); emit('cinema', true); emit('cinema', false); emit('chapter', 2);
  assert.deepEqual(sound.status().counts, {}); assert.equal(sound.status().context, null);
});
test('sound.music / sound.sfx write the settings and announce them', async () => {
  const seen = []; on('settings', (s) => seen.push({ ...s }));
  await call('sound.music', false); assert.equal(state.settings.music, false); assert.equal(sound.status().music, false);
  await call('sound.sfx', false); assert.equal(state.settings.sfx, false); assert.equal(sound.status().sfx, false);
  await call('sound.music', true); await call('sound.sfx', true); assert.ok(state.settings.music && state.settings.sfx);
  assert.equal(seen.length, 4);
  state.settings.music = false; emit('settings', state.settings); assert.equal(sound.status().music, false); // live: a bus event is enough
  state.settings.music = true;
});
