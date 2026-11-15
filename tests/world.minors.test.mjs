// Minor Arcana in the tall grass: a simulated game, straight along the main path or wandering
// through the meadows, counts the Minors she meets. Targets: a straight game about 8 to 12, a
// wandering one clearly more, never two within twenty seconds. Numbers: node --test tests/world.minors.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { measure, reseed } from '../src/world/minorsim.js';
import { pickMinor, MINOR, Glinter } from '../src/world/minors.js';

test('minors: straight and wandering games', (t) => {
  reseed(4242);
  const straight = measure({ wander: false }), wander = measure({ wander: true });
  const f = (r) => `mean ${r.mean.toFixed(1)} (min ${r.lo}, max ${r.hi}), ${r.grassSteps} grass steps of ${r.steps}, ${r.minutes.toFixed(0)} min walking, closest two ${(r.minGap / 1000).toFixed(0)} s`;
  t.diagnostic(`chance ${MINOR.chance} per grass step, cooldown ${MINOR.cooldown / 1000} s`);
  t.diagnostic(`straight: ${f(straight)}`);
  t.diagnostic(`wandering: ${f(wander)}`);
  assert.ok(straight.mean >= 8 && straight.mean <= 12, `straight ${straight.mean}`);
  assert.ok(wander.mean >= 1.5 * straight.mean, `wandering ${wander.mean}`);
  assert.ok(straight.minGap >= 20000 && wander.minGap >= 20000, 'never two within twenty seconds');
});

test('minors: rarity odds (commons often, Aces less, court cards rare per card)', () => {
  let s = 7; const rng = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = {}; for (let i = 0; i < 40000; i++) { const c = pickMinor('c', rng); n[c.rarity] = (n[c.rarity] || 0) + 1; }
  const per = { common: n.common / 9, uncommon: n.uncommon, rare: n.rare / 4 };
  assert.ok(per.common > per.uncommon && per.uncommon > per.rare, JSON.stringify(per));
});

test('minors: one glint at a time and a cooldown', () => {
  const map = { suitAt: () => 'p' }, g = new Glinter(() => 0);
  assert.ok(g.step(map, 5, 5, 'up', 0, () => true));
  assert.equal(g.step(map, 5, 4, 'up', 1000, () => true), null);
  g.take(2000);
  assert.equal(g.step(map, 5, 3, 'up', 15000, () => true), null);
  assert.ok(g.step(map, 5, 3, 'up', 22001, () => true));
});
