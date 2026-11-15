import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { MAJORS, MINORS, signOf, CARD } from '../src/data/cards.base.js';
import { senseRadius, yourSuit, levelOf, titleOf, addXp, findCard, answer, setPlayer, yourCard, addPoint, hasCard, confiscate } from '../src/core/progress.js';
import { test as cond, fill } from '../src/core/cond.js';

test('the deck has 22 majors and 56 minors', () => { assert.equal(MAJORS.length, 22); assert.equal(MINORS.length, 56); assert.equal(CARD.m11.name, 'La Giustizia'); });
test('three rows of seven', () => { for (const r of [1, 2, 3]) assert.equal(MAJORS.filter((c) => c.row === r).length, 7); });
test('signs', () => { assert.equal(signOf(5, 1).id, 'capricorno'); assert.equal(signOf(25, 12).id, 'capricorno'); assert.equal(signOf(1, 10).id, 'bilancia'); assert.equal(signOf(23, 9).id, 'bilancia'); assert.equal(signOf(22, 9).id, 'vergine'); assert.equal(signOf(20, 1).id, 'acquario'); });
test('levels and titles', () => { setState({}); assert.equal(levelOf(0), 1); assert.equal(levelOf(30), 2); assert.equal(levelOf(729), 8); assert.equal(levelOf(9999), 9); assert.equal(titleOf(1), 'Novizia'); assert.equal(titleOf(4), 'Fattucchiera'); assert.equal(titleOf(9), 'Strega'); });
test('level gifts', () => { setState({}); addXp(29); assert.equal(state.powers.cat, false); addXp(1); assert.equal(state.powers.cat, true); // level 2: Tartufo
  addXp(200); assert.equal(state.powers.fire, true); assert.equal(state.powers.sense, false); addXp(1000);
  for (const p of ['sense', 'move', 'stun', 'broom']) assert.equal(state.powers[p], true, p);
  assert.equal(levelOf(), 9, 'the story stops at 9'); assert.ok(!('seals' in state.powers)); assert.ok(!('sense2' in state.powers));
  state.flags['ending.seen'] = true; assert.equal(levelOf(), 10, 'Gran Maestra goes on'); addXp(500); assert.equal(levelOf(), 12); });
test('the sixth sense grows from level 5 to the whole map', () => { assert.equal(senseRadius(4), 0); assert.equal(senseRadius(5), 10); assert.ok(senseRadius(9) > senseRadius(8)); assert.equal(senseRadius(12), Infinity); });
test('your suit comes from the traits; the sign breaks ties', () => {
  setState({}); setPlayer({ name: 'A', birth: { d: 1, m: 10, y: 1995 } }); assert.equal(yourSuit(), 's');
  state.traits.guida = 3; state.traits.tono = 2; assert.equal(yourSuit(), 'c');
  setState({ traits: { rischio: -3, parola: -3 } }); assert.equal(yourSuit(), 'p');
  setState({ tools: { sieve: 2, bottle: 1 } }); assert.ok(!('sieve' in state.tools)); assert.equal(state.tools.bottle, 1); });
test('old saves lose seals and the far sight', () => { setState({ powers: { seals: true }, flags: { 'sight.far': true } }); assert.ok(!('seals' in state.powers)); assert.ok(!state.flags['sight.far']); });
test('cards, stars, confiscation', () => { setState({}); assert.equal(findCard('m02'), true); assert.equal(findCard('m02'), false); answer('m02', true, 'image'); assert.equal(state.cards.m02.stars, 1); answer('m02', true, 'astro'); assert.equal(state.cards.m02.stars, 2); answer('m02', false); assert.equal(state.stats.wrongByCard.m02, 1); confiscate(['m02']); assert.equal(hasCard('m02'), false); });
test('your card starts as the birth card and moves', () => { setState({}); setPlayer({ name: 'Ada', birth: { d: 1, m: 10, y: 1995 } }); assert.equal(state.player.birthCard, 'm11'); assert.equal(yourCard(), 'm11'); addPoint({ card: 'm09' }); addPoint({ card: 'm09' }); assert.equal(yourCard(), 'm11', 'with no traits the birth card holds'); });
test('conditions and fill', () => { setState({ flags: { a: true }, chapter: 2, player: { name: 'Ada' } }); assert.equal(cond({ flag: 'a', chapterMin: 2 }), true); assert.equal(cond({ not: { flag: 'a' } }), false); assert.equal(cond({ any: [{ flag: 'x' }, { chapter: 2 }] }), true); assert.equal(fill('Ciao {name}, {stat:exams}'), 'Ciao Ada, 0'); });
