// The experience balance (scripts/balance.mjs, notes/balance.md): three simulated players through the real
// story. A straight player reaches each rank gate a few readings short, a normal one level with it, an
// explorer at most one level ahead; the broom comes in chapter 2; level 9 near the ending.
import test from 'node:test';
import assert from 'node:assert/strict';
import { measure } from '../scripts/balance.mjs';
import { setState, state } from '../src/core/state.js';
import { keepLevel, levelOf, LEVEL_XP, LEVEL_XP_V1, addXp } from '../src/core/progress.js';
import { STEPS } from '../src/data/story/index.js';

const SEEDS = 10;
const chapterOf = (where) => where.split(', ').map((w) => w.split(' ')[0]).map((id) => STEPS.find((s) => s.id === id)?.chapter ?? 9);

test('balance: the three players at the two rank gates', async (t) => {
  const [s, n, e] = [await measure('straight', { seeds: SEEDS }), await measure('normal', { seeds: SEEDS }), await measure('explorer', { seeds: SEEDS })];
  for (const m of [s, n, e]) t.diagnostic(`${m.profile}: ${Object.entries(m.gates).map(([g, v]) => `${g} level ${v.level.toFixed(2)} studies ${v.study.toFixed(1)}`).join(', ')}; broom at ${m.powers[6]}; level 9 at ${m.powers[9]}`);
  const g1 = 'c1.gate', g2 = 'c3.trapdoor';
  // straight: a little short, two to four readings or reviews to pass
  assert.ok(s.gates[g1].level < 4 && s.gates[g1].study >= 2 && s.gates[g1].study <= 4.5, `straight gate 1 ${JSON.stringify(s.gates[g1])}`);
  assert.ok(s.gates[g2].level < 7 && s.gates[g2].study >= 2 && s.gates[g2].study <= 4.5, `straight gate 2 ${JSON.stringify(s.gates[g2])}`);
  // normal: about level with the gate
  assert.ok(n.gates[g1].level >= 3.8 && n.gates[g1].level < 5, `normal gate 1 ${n.gates[g1].level}`);
  assert.ok(n.gates[g2].level >= 6.8 && n.gates[g2].level < 8, `normal gate 2 ${n.gates[g2].level}`);
  // explorer: at most one level ahead
  assert.ok(e.gates[g1].level <= 5.1, `explorer gate 1 ${e.gates[g1].level}`);
  assert.ok(e.gates[g2].level <= 8.1, `explorer gate 2 ${e.gates[g2].level}`);
  // the broom in chapter 2 (the explorer may touch it at the very gate of chapter 1 in a rare run)
  for (const m of [s, n]) assert.ok(chapterOf(m.powers[6]).every((c) => c === 2), `${m.profile} broom at ${m.powers[6]}`);
  assert.ok(!/c1\.(?!gate)/.test(e.powers[6]), `explorer broom at ${e.powers[6]}`);
  // level 9 in chapter 3, for the straight player at the very end
  for (const m of [s, n]) assert.ok(chapterOf(m.powers[9]).every((c) => c === 3), `${m.profile} level 9 at ${m.powers[9]}`);
  assert.ok(/f\.|c3\.trial|c3\.court|c3\.jail/.test(s.powers[9].split(' ')[0]), `straight level 9 at ${s.powers[9]}`);
  assert.ok(s.end.level >= 9, 'the straight player ends the story a Strega');
});

test('balance: a save made with the old table keeps its level, powers and xp', () => {
  setState({ xp: 380, started: true, powers: { cat: true, fire: true, sense: true, broom: true } }); // old level 6
  assert.equal(keepLevel(), true);
  assert.equal(levelOf(), 6);
  assert.equal(state.xp, LEVEL_XP[5]);
  assert.ok(state.powers.broom);
  assert.equal(keepLevel(), false, 'once');
  setState({ xp: 300 }); assert.equal(keepLevel(), true); assert.equal(levelOf(), 5, 'old level 5 stays 5');
  setState({ xp: 1000 }); assert.equal(keepLevel(), false, 'never lowered'); assert.equal(state.xp, 1000);
  // a game started with the new table is marked at its first xp, so a reload changes nothing
  setState({}); addXp(250); assert.equal(keepLevel(), false); assert.equal(state.xp, 250);
  assert.ok(LEVEL_XP_V1.length === LEVEL_XP.length);
});
