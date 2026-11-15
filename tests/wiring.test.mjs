// The wiring of the narrative with the stage and the sound: every cinema node has a scene, the session
// symbols exist, each mistress can reach trust 2 on the main path, the map -> music mood table.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCRIPTS, SESSIONS } from '../src/data/story/index.js';
import { sceneFor } from '../src/story/stage/tableaux.js';
import { SYMBOL_NAMES } from '../src/story/stage/symbols.js';
import { moodOfMap } from '../src/glue/mood.js';

function* walk(nodes) { for (const n of nodes || []) { yield n; if (n.choice) for (const o of n.choice) yield* walk(o.then); yield* walk(n.then); yield* walk(n.else); if (n.observe) for (const o of n.observe) yield o; } }

test('every cinema node of the scripts names or implies a tableau', () => {
  for (const [id, nodes] of Object.entries(SCRIPTS)) for (const n of walk(nodes)) if (n.do === 'cinema') assert.ok(sceneFor(n), `${id}: cinema without a scene`);
});

test('session symbols and tableaux exist', () => {
  for (const [id, nodes] of Object.entries(SESSIONS)) for (const n of walk(nodes)) {
    if (n.symbol) assert.ok(SYMBOL_NAMES.includes(n.symbol), `${id}: symbol ${n.symbol}`);
    if (n.tableau) assert.ok(sceneFor({ scene: n.tableau }), `${id}: tableau ${n.tableau}`);
  }
});

test('each mistress has at least two trust-raising options in mandatory scenes', () => {
  const MAIN = ['c1.malva', 'c1.gate', 'c2.ortica', 'c3.trapdoor', 'c3.edera', 'c3.coven', 'c3.trial'];
  const count = { malva: 0, ortica: 0, edera: 0 };
  for (const id of MAIN) for (const n of walk(SCRIPTS[id])) if (n.choice) for (const o of n.choice) for (const [w, v] of Object.entries(o.trust || {})) if (w in count && v > 0) count[w] += 1;
  for (const [w, c] of Object.entries(count)) assert.ok(c >= 2, `${w}: only ${c} trust options on the main path`);
});

test('the music follows the map', () => {
  assert.equal(moodOfMap('village'), 'village');
  for (const m of ['malva', 'cottage', 'meeting', 'shop']) assert.equal(moodOfMap(m), 'village');
  assert.equal(moodOfMap('forest'), 'forest');
  assert.equal(moodOfMap('depths'), 'depths');
  assert.equal(moodOfMap('court'), 'depths');
});
