// The witches' two axes (core/witches.js): affinity from who she is, bond from what they did together.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { on } from '../src/core/bus.js';
import { test as cond } from '../src/core/cond.js';
import { affinity, AFFINITY, attitude, bondLevel, bondOf, addBond, carryTrust, metWitch, WITCHES, BOND_MAX } from '../src/core/witches.js';
import { WITCH_LINES } from '../src/data/trials/witches.js';

test('the affinity table', () => {
  assert.deepEqual(AFFINITY.malva, [['tono', 1], ['rischio', -1], ['guida', 1]]);
  assert.deepEqual(AFFINITY.ortica, [['rischio', 1], ['parola', 1], ['guida', -1]]);
  assert.deepEqual(AFFINITY.ginepra, [['rischio', 1], ['tono', 1], ['guida', 1]]);
  assert.deepEqual(AFFINITY.edera.slice(0, 2), [['parola', -1], ['esplora', 1]]);
  const gentle = { tono: 4, rischio: -4, guida: 4 };
  assert.equal(affinity('malva', gentle, null), 3);
  assert.equal(affinity('malva', gentle, 'm03'), 4);
  assert.equal(affinity('malva', {}, null), 0);
  assert.equal(affinity('malva', {}, 'm03'), 1);
  assert.equal(affinity('ortica', gentle, 'm01'), 0, 'the opposite poles count against');
  assert.equal(affinity('ginepra', { rischio: 2, tono: 2, guida: 2 }, null), 2);
  assert.equal(affinity('edera', { parola: -6, esplora: 6, guida: -6 }, 'm02'), 4);
  for (const w of WITCHES) for (let i = 0; i < 50; i++) {
    const t = { esplora: (i * 7) % 13 - 6, parola: (i * 5) % 13 - 6, tono: (i * 3) % 13 - 6, rischio: (i * 11) % 13 - 6, guida: (i * 2) % 13 - 6 };
    const a = affinity(w, t, i % 2 ? 'm03' : 'm07');
    assert.ok(a >= 0 && a <= 4 && Number.isInteger(a));
  }
});

test('four attitudes from the two axes, and a line for each', () => {
  assert.equal(attitude(2, 2), 'pari'); assert.equal(attitude(4, 1), 'prova');
  assert.equal(attitude(1, 3), 'brontola'); assert.equal(attitude(0, 0), 'fredda');
  for (const w of WITCHES) for (const a of ['pari', 'prova', 'brontola', 'fredda']) assert.ok(WITCH_LINES[w][a], `${w}.${a}`);
});

test('an old save carries trust into the bond', () => {
  setState({ trust: { malva: 3, ortica: -1, edera: 0, ginepra: 2 } });
  assert.deepEqual(state.bonds, { malva: 3, ortica: 0, edera: 0, ginepra: 2 });
  assert.equal(bondOf('malva'), 2); assert.equal(bondOf('ginepra'), 2);
  setState({ trust: { malva: 3 }, bonds: { malva: 1 } });
  assert.equal(state.bonds.malva, 3, 'the larger of the two is kept: nothing she built is lost');
  assert.deepEqual(carryTrust({ trust: { edera: 2 } }).bonds, { malva: 0, ortica: 0, edera: 2, ginepra: 0 });
});

// BACKLOG 1.4: one number. The bond is the truth; state.trust is its copy for the readers that say `trust`.
test('trust and bond: one number, old saves keep the larger', () => {
  setState({ trust: { malva: 2, ortica: 5, edera: 0, ginepra: 1 }, bonds: { malva: 4, ortica: 3, ginepra: 1 } });
  assert.deepEqual(state.bonds, { malva: 4, ortica: 5, edera: 0, ginepra: 1 });
  assert.deepEqual(state.trust, state.bonds, 'trust is a copy of the bond after loading');
  assert.equal(cond({ trust: ['malva', '>=', 4] }), true, 'the story reads the bond through trust');
  // a save from before the bonds: trust becomes the bond
  setState({ trust: { malva: 3, ortica: 7, edera: 1, ginepra: 0 } });
  assert.deepEqual(state.bonds, { malva: 3, ortica: 7, edera: 1, ginepra: 0 });
  // a save above the top of the bond (old trust could grow without limit) keeps it, also after a change
  setState({ trust: { ginepra: BOND_MAX + 1 } });
  addBond('ginepra', -1); assert.equal(state.bonds.ginepra, BOND_MAX);
  setState({ trust: { ginepra: BOND_MAX + 2 } });
  addBond('ginepra', 1); assert.equal(state.bonds.ginepra, BOND_MAX + 2, 'never pushed down by a gain');
  // every change of the bond moves the copy; the story's trust (progress.addTrust, then glue/witches.js)
  // moves the copy first, and addBond counts it once
  setState({});
  addBond('edera', 2, 'trial'); assert.equal(state.trust.edera, 2);
  state.trust.malva += 1; addBond('malva', 1, 'trust'); // what addTrust + the glue do
  assert.equal(state.bonds.malva, 1); assert.equal(state.trust.malva, 1);
  addBond('malva', -5); assert.equal(state.trust.malva, 0, 'never below 0, and the copy follows');
});

test('addBond: levels, clamps, events', () => {
  setState({});
  const seen = [];
  const off1 = on('bond:up', (e) => seen.push(['up', e.level])), off2 = on('bond:down', (e) => seen.push(['down', e.level]));
  addBond('ortica', 2); addBond('ortica', 3); addBond('ortica', -10); addBond('ortica', 99); addBond('nobody', 3);
  assert.equal(state.bonds.ortica, BOND_MAX);
  assert.deepEqual(seen, [['up', 2], ['up', 3], ['down', 0], ['up', 4]]);
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 30].map(bondLevel), [0, 1, 2, 2, 3, 3, 4, 4]);
  off1?.(); off2?.();
});

test('conditions on affinity, bond and attitude', () => {
  setState({ traits: { tono: 4, rischio: -4, guida: 4 }, bonds: { malva: 4, ortica: 0 } });
  assert.ok(cond({ affinity: { malva: 3 } }));
  assert.ok(!cond({ affinity: { ortica: 1 } }));
  assert.ok(cond({ bond: { malva: 3 } }) && !cond({ bond: { ortica: 1 } }));
  assert.ok(cond({ attitude: { malva: 'pari' } }));
  assert.ok(cond({ attitude: { ortica: 'fredda' } }));
  setState({ traits: {}, bonds: { edera: 6 } });
  assert.ok(cond({ attitude: { edera: 'brontola' } }));
});

test('who she has met', () => {
  assert.equal(metWitch('ortica', { flags: {}, trust: {}, bonds: {}, spreads: {} }), false);
  assert.equal(metWitch('ortica', { flags: {}, trust: {}, bonds: {}, spreads: { ppf: true } }), true);
  assert.equal(metWitch('ginepra', { flags: { 'met.ginepra': true }, trust: {}, bonds: {}, spreads: {} }), true);
  assert.equal(metWitch('malva', { chapter: 1, flags: {}, trust: {}, bonds: {}, spreads: {} }), true);
});
