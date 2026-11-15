// The portrait (core/progress.js, core/cond.js): traits, la tua carta, snapshots, verdicts, birth lore.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { on } from '../src/core/bus.js';
import { addTrait, traitWord, traitWords, yourCard, addPoint, setPlayer, snapshot, recordVerdict, tellCard, untoldMajors, findCard, answer, AXES, cardScores, KEEP } from '../src/core/progress.js';
import { test as cond, fill } from '../src/core/cond.js';
import { moonOf, weekdayOf, moonAge, SYNODIC } from '../src/data/cards.base.js';
import { SIGNATURES, ADJ } from '../src/data/portrait.js';

const nearest = (vec) => { // an independent check: the signature with the best normalised dot product
  let best = null;
  for (const [id, sig] of Object.entries(SIGNATURES)) {
    let d = 0, n = 0; for (const k of AXES) { d += (sig[k] || 0) * (vec[k] || 0); n += (sig[k] || 0) ** 2; }
    const sc = n ? d / Math.sqrt(n) : 0; if (!best || sc > best.sc) best = { id, sc };
  }
  return best.id;
};

test('old saves get the portrait keys', () => {
  setState({ xp: 40, cards: {} });
  assert.deepEqual(state.traits, { esplora: 0, parola: 0, tono: 0, rischio: 0, guida: 0 });
  assert.deepEqual(state.told, {}); assert.equal(state.visits, 0); assert.deepEqual(state.traitLog, []); assert.deepEqual(state.verdicts, []);
  setState({ traits: { esplora: 40, tono: 'x' } });
  assert.equal(state.traits.esplora, 6); assert.equal(state.traits.tono, 0);
});

test('addTrait clamps, counts hits, emits one trait event', () => {
  setState({});
  let n = 0; const off = on('trait', () => n++);
  addTrait({ parola: 1, tono: -1 });
  assert.equal(n, 1); off();
  for (let i = 0; i < 10; i++) addTrait({ parola: 1 });
  assert.equal(state.traits.parola, 6); assert.equal(state.hits.parola.plus, 11); assert.equal(state.hits.tono.minus, 1);
  addTrait({ nonsense: 3 }); assert.equal(state.traits.parola, 6);
});

test('trait words: only marked traits, strongest first, Italian', () => {
  setState({});
  assert.equal(traitWord('esplora'), null); assert.deepEqual(traitWords(), []);
  assert.equal(fill('{traits}'), 'ancora tutta da scoprire');
  setState({ traits: { esplora: 4, parola: 3, tono: 5, rischio: -2, guida: -3 } });
  assert.equal(traitWord('tono'), ADJ.tono[0]); assert.equal(traitWord('guida'), ADJ.guida[1]); assert.equal(traitWord('rischio'), null);
  assert.deepEqual(traitWords(), [ADJ.tono[0], ADJ.esplora[0], ADJ.parola[0]]);
  assert.equal(fill('{traits}'), `${ADJ.tono[0]}, ${ADJ.esplora[0]} e ${ADJ.parola[0]}`);
  assert.equal(fill('{trait:rischio}'), 'nel mezzo');
});

test('your card: birth card at zero, then the nearest signature; stable; deterministic', () => {
  setState({}); assert.equal(yourCard(), 'm00');
  setPlayer({ name: 'Ada', birth: { d: 1, m: 10, y: 1995 } });
  assert.equal(yourCard(), 'm11');
  addTrait({ esplora: 1 }); assert.equal(yourCard(), 'm11', 'one point does not beat the head start');
  setState({ player: { birthCard: 'm11' }, traits: { rischio: 6, esplora: -6 } });
  assert.equal(yourCard(), nearest(state.traits));
  const a = yourCard(); assert.equal(yourCard(), a);
  // no flapping: the announced card keeps a small edge when another is barely ahead
  setState({ player: { birthCard: 'm11' }, traits: { esplora: 3, rischio: 3 } });
  state.cardNow = null;
  const sc = cardScores().sort((a, b) => b.score - a.score);
  const [top, second] = sc;
  if (top.score - second.score < KEEP) { state.cardNow = second.id; assert.equal(yourCard(), second.id, 'the announced card keeps its place'); }
  state.cardNow = top.id; assert.equal(yourCard(), top.id);
});

test('your card changes are announced once', () => {
  setState({ player: { birthCard: 'm11' } });
  const seen = []; const off = on('yourcard:changed', (e) => seen.push(e));
  for (let i = 0; i < 6; i++) addTrait({ rischio: 1, esplora: -1 });
  off();
  assert.ok(seen.length >= 1); assert.equal(seen.at(-1).to, yourCard());
  addPoint({ card: 'm09' }); // points still work
  assert.equal(state.points.m09, 1);
});

test('trait conditions over time', () => {
  setState({ traits: { tono: -3 } });
  assert.ok(cond({ trait: ['tono', '<=', -3] })); assert.ok(!cond({ steady: 'tono' }), 'no snapshot yet');
  snapshot(); addTrait({ tono: -1 });
  assert.ok(cond({ steady: 'tono' })); assert.ok(cond({ trend: ['tono', '<=', -1] })); assert.ok(!cond({ turned: 'tono' }));
  addTrait({ tono: 6 }); // -4 -> 2
  assert.ok(cond({ turned: 'tono' }));
  setState({ traits: { guida: 1 }, hits: { guida: { plus: 3, minus: 3 } } });
  assert.ok(cond({ torn: 'guida' })); assert.ok(!cond({ torn: 'tono' }));
});

test('verdicts: first, same, changed, and {lastVerdict}', () => {
  setState({ player: { birthCard: 'm11' } });
  assert.ok(cond({ verdict: 'first' })); assert.equal(fill('{lastVerdict}'), 'La Giustizia');
  recordVerdict(); assert.ok(cond({ verdict: 'same' })); assert.ok(!cond({ verdict: 'first' }));
  state.verdicts = ['m07']; assert.ok(cond({ verdict: 'changed' })); assert.equal(fill('{lastVerdict}'), 'Il Carro');
  assert.ok(cond({ yourCardIsBirth: true })); assert.ok(!cond({ yourCardIsBirth: false }));
});

test('the moon at birth: known dates', () => {
  assert.equal(moonOf({ d: 6, m: 1, y: 2000 }), 'nuova');
  assert.equal(moonOf({ d: 21, m: 1, y: 2000 }), 'piena');
  assert.equal(moonOf({ d: 14, m: 1, y: 2000 }), 'crescente'); // first quarter 14 Jan 2000
  assert.equal(moonOf({ d: 28, m: 1, y: 2000 }), 'calante'); // last quarter 28 Jan 2000
  assert.equal(moonOf({ d: 11, m: 8, y: 1999 }), 'nuova'); // the eclipse
  assert.equal(moonOf({ d: 25, m: 12, y: 2015 }), 'piena'); // Christmas full moon
  assert.equal(moonOf({ d: 1, m: 1 }), null);
  const a = moonAge({ d: 1, m: 1, y: 1960 }); assert.ok(a >= 0 && a < SYNODIC);
});

test('birth lore: weekday, element, ruler, safe without data', () => {
  assert.equal(weekdayOf({ d: 15, m: 11, y: 2026 }).name, 'domenica');
  setState({});
  for (const k of ['element', 'modality', 'ruler', 'rulerCard', 'birthDay', 'dayPlanet', 'dayPlanetCard', 'moon', 'lastVerdict', 'traits']) {
    const v = fill(`{${k}}`); assert.ok(v && !v.includes('{') && !v.includes('undefined'), `${k}: ${v}`);
  }
  assert.ok(!cond({ hasBirth: true })); assert.ok(cond({ hasBirth: false })); assert.ok(!cond({ moon: 'piena' })); assert.ok(!cond({ bornOn: 'lunedì' }));
  setPlayer({ name: 'Ada', birth: { d: 1, m: 10, y: 1995 } }); // Sunday, Libra
  assert.equal(fill('{element} {modality} {ruler} {rulerCard}'), 'Aria cardinale Venere L\'Imperatrice');
  assert.equal(fill('{birthDay} {dayPlanet} {dayPlanetCard}'), 'domenica Sole Il Sole');
  assert.ok(cond({ hasYear: true })); assert.ok(cond({ element: 'Aria' })); assert.ok(cond({ modality: 'cardinale' })); assert.ok(cond({ bornOn: 'domenica' }));
  assert.ok(/^luna (nuova|crescente|piena|calante)$/.test(fill('{moon}')));
  setState({ player: { name: 'B', birth: { d: 1, m: 10, y: 0 }, sign: 'bilancia', birthCard: 'm11' } });
  assert.ok(!cond({ hasYear: true })); assert.equal(fill('{birthDay}'), 'un giorno che non conosco'); assert.equal(fill('{ruler}'), 'Venere');
});

test('told cards: the second star and the untold list', () => {
  setState({});
  findCard('m03'); findCard('m01'); state.cards.m01.at = 1; state.cards.m03.at = 2;
  assert.deepEqual(untoldMajors(), ['m01', 'm03']);
  answer('m03', true, 'image'); assert.equal(state.cards.m03.stars, 1);
  tellCard('m03'); assert.equal(state.cards.m03.stars, 2); assert.ok(state.told.m03);
  assert.deepEqual(untoldMajors(), ['m01']);
});
