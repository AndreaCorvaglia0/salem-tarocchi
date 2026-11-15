// Patrol danger for a player who walks. For each chapter, she walks the main path (the anchors the
// story sends her to, in a loop) at walking speed while the patrols walk their routes, many times
// with a random phase. A careless walk takes the shortest path; a careful one prefers tiles no
// lantern can reach (side paths, tall grass). We count how often she is seen.
// Targets: careless in the village about once every two or three minutes, careful rarely, never
// twice within a minute. Run alone for the numbers: node --test tests/world.patrol.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, measure, reseed } from '../src/world/patrolsim.js';

const results = {};
for (const plan of PLANS) {
  const name = `${plan.map} ch${plan.chapter}`;
  test(`patrols: ${name}`, (t) => {
    reseed(12345);
    const careless = measure(plan, false), careful = measure(plan, true);
    results[name] = { careless, careful };
    const f = (r) => `${r.perStop === Infinity ? 'never' : `one stop every ${r.perStop.toFixed(1)} min`} (${r.stops} in ${r.minutes} min; loop ${r.loop.toFixed(0)} s)`;
    t.diagnostic(`${name}: careless ${f(careless)}; careful ${f(careful)}`);
    assert.ok(careless.minGap >= 60000 && careful.minGap >= 60000, 'never twice within a minute');
    assert.ok(careful.perStop >= 2 * careless.perStop || careful.perStop >= 8, 'a careful walk is much safer');
    if (plan.map === 'village') assert.ok(careless.perStop >= 1.5 && careless.perStop <= 4, `village careless: ${careless.perStop.toFixed(2)} min per stop`);
  });
}
