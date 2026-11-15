import test from 'node:test';
import assert from 'node:assert/strict';
import { setState } from '../src/core/state.js';
import { majorSlots, minorSlots, slotOf, lessonsShown, nextStep, shopCards, placeOf, isSeen, nearestDetail, foundMajors } from '../src/ui/logic.js';

test('slots: the Fool apart and three rows of seven in order', () => {
  const s = majorSlots();
  assert.equal(s.fool, 'm00');
  assert.deepEqual(s.rows.map((r) => r.length), [7, 7, 7]);
  assert.equal(s.rows[0][0], 'm01'); assert.equal(s.rows[1][0], 'm08'); assert.equal(s.rows[2][6], 'm21');
  const m = minorSlots();
  assert.equal(m.length, 4); assert.ok(m.every((x) => x.ids.length === 14));
});

test('slot kinds: missing, veiled, awake, taken, due', () => {
  const now = 1000;
  setState({ cards: { m01: { found: true, stars: 0, due: 2000 }, m02: { found: true, stars: 2, due: 500 }, m03: { found: true, stars: 1, confiscated: true } } });
  assert.equal(slotOf('m04', undefined, now).kind, 'missing');
  assert.equal(slotOf('m01', undefined, now).kind, 'veiled');
  assert.equal(slotOf('m01', undefined, now).due, false);
  assert.equal(slotOf('m02', undefined, now).kind, 'awake');
  assert.equal(slotOf('m02', undefined, now).due, true);
  assert.equal(slotOf('m03', undefined, now).kind, 'taken');
  assert.equal(foundMajors(), 3);
});

test('lessons shown are the taught ones, in the book order', () => {
  const L = [{ id: 'deck' }, { id: 'single' }, { id: 'ppf' }];
  setState({ lessons: { ppf: true, deck: true } });
  assert.deepEqual(lessonsShown(undefined, L).map((l) => l.id), ['deck', 'ppf']);
  setState({});
  assert.deepEqual(lessonsShown(undefined, L), []);
});

test('next step text is filled, with a fallback', () => {
  const steps = [{ id: 'a', text: 'Trovare {name}.', at: 'village.square' }];
  setState({ step: 'a', player: { name: 'Ada' } });
  assert.deepEqual(nextStep(undefined, steps).text, 'Trovare Ada.');
  assert.equal(nextStep(undefined, steps).at, 'village.square');
  setState({ step: 'zzz' });
  assert.ok(nextStep(undefined, steps).text.length > 0);
});

test('shop sells two missing majors of the current row', () => {
  setState({ chapter: 2, cards: { m08: { found: true } } });
  assert.deepEqual(shopCards(), ['m09', 'm10']);
  setState({ chapter: 0 });
  assert.deepEqual(shopCards(), ['m01', 'm02']);
});

test('places: interiors belong to their door; seen through any anchor', () => {
  assert.equal(placeOf('malva.hearth'), 'village.malva_door');
  assert.equal(placeOf('forest.pond'), 'forest.pond');
  assert.equal(placeOf(null), null);
  setState({ stats: { seen: { 'malva.table': true } } });
  assert.equal(isSeen('village.malva_door', undefined, ['malva.table']), true);
  assert.equal(isSeen('village.square', undefined, ['malva.table']), false);
});

test('nearest detail weighs the image ratio', () => {
  const d = [{ id: 'top', x: 50, y: 10 }, { id: 'side', x: 90, y: 50 }];
  assert.equal(nearestDetail(d, 50, 20).id, 'top');
  assert.equal(nearestDetail(d, 80, 45).id, 'side');
  assert.equal(nearestDetail([], 1, 1), null);
});
