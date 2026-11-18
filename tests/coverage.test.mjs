// The coverage tool (scripts/coverage.mjs, docs/TOOLS.md): a small number of random runs, only to see that
// the machinery works and that nothing on the main path is out of reach. Rare lines are not failures:
// they are listed in docs/COVERAGE.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadStory } from '../scripts/lore/story.mjs';
import { measure, render } from '../scripts/coverage.mjs';

let R = null;
const run = async () => (R ||= await measure({ runs: 40, seed: 7, model: await loadStory() }));

test('coverage: every run reaches the end, with no warning from the runner', async () => {
  const r = await run();
  assert.equal(r.ended, r.runs);
  assert.deepEqual(r.warnings, []);
});

test('coverage: the same seed gives the same counts', async () => {
  const M = await loadStory();
  const a = await measure({ runs: 6, seed: 3, model: M }), b = await measure({ runs: 6, seed: 3, model: M });
  assert.deepEqual(a.units.map((u) => u.n), b.units.map((u) => u.n));
});

test('coverage: the marks count something, and every scene of the main path is played', async () => {
  const r = await run();
  assert.ok(r.units.filter((u) => u.n > 0).length > 300, 'branches are marked');
  const played = new Set(r.sceneUnits.filter((s) => s.n > 0).map((s) => s.key));
  assert.ok(r.main.size > 20);
  assert.deepEqual([...r.main].filter((k) => !played.has(k)), []);
  for (const k of ['sessions.js#s0', 'sessions.js#s1', 'sessions.js#s2', 'sessions.js#s3', 'sessions.js#s4', 'end.js#c3.trial', 'end.js#f.dawn']) assert.ok(played.has(k), k);
});

test('coverage: every choice at the top of a main-path scene is offered, every ordinary option shown', async () => {
  const r = await run();
  const missing = r.units.filter((u) => u.kind === 'option' && u.cond == null && !u.conds.length && r.main.has(`${u.file}#${u.scene}`) && u.n === 0);
  assert.deepEqual(missing.map((u) => `${u.id} ${u.t}`), []);
});

test('coverage: the page renders', async () => {
  const text = render(await run());
  assert.match(text, /## What random play cannot reach by construction/);
  assert.match(text, /### Ending variants/);
});

// BACKLOG 1.1: «il seme che ti somiglia» must not lean. Random answers give each suit between 15% and 35%
// (it was Coppe two times out of three, because the gentle answers were twice the sharp ones).
test('coverage: random play gives each of the four suits between 15% and 35%', async () => {
  const r = await measure({ runs: 600, seed: 1, model: await loadStory() });
  for (const s of ['c', 's', 'w', 'p']) {
    const pct = (100 * (r.suits.get(s) || 0)) / r.runs;
    assert.ok(pct >= 15 && pct <= 35, `suit ${s}: ${pct.toFixed(1)}%`);
  }
});
