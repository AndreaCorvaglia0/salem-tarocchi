import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GARDEN, FIRST_SEEDLINGS, BED_LIGHT, SOILS, LESSON_NOTES } from '../src/data/garden.js';
import { HERB, HERB_LIST } from '../src/data/herbs/base.js';
import { HERB_TEXTS } from '../src/data/herbs/texts.js';
import { GIFTS, giftOf, giftText } from '../src/glue/threshold.rules.js';
import {
  daysBetween, plant, water, settle, harvest, thirsty, readyCount, isReady, isThirsty, feel, touch, looksWet, normGarden, normCounts,
  seedlings, seedPrice, seedsForSale, moonSeed, lineFor, lightWhy, soilWhy, lightOk, interval, resoil, move, summary, summaryText, lessonNote,
  NEGLECT, REGROW,
} from '../src/glue/garden.rules.js';

const ORDER = HERB_LIST.map((p) => p.id);
const risk = (id) => HERB[id]?.risk || null;
const add = (d, n) => { const t = new Date(`${d}T12:00:00`); t.setDate(t.getDate() + n); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
const D = '2026-11-17';
const SUN = 'sole';

// ---- the data agrees with the herbarium ------------------------------------------------------------
test('every herb of the herbarium has garden data in range', () => {
  for (const p of HERB_LIST) {
    const g = GARDEN[p.id];
    assert.ok(g, p.id);
    assert.ok(g.every >= 1 && g.every <= 4, p.id);
    assert.ok(g.steps >= 4 && g.steps <= 7, p.id);
    assert.equal(typeof g.dry, 'boolean');
    assert.ok(['sole', 'mezzombra', 'ombra'].includes(g.luce), p.id);
    assert.ok(!g.anche || ['sole', 'mezzombra', 'ombra'].includes(g.anche), p.id);
    assert.ok(SOILS.some((s) => s.id === g.terra), p.id);
    assert.ok(g.the && g.beve, p.id);
  }
  assert.equal(Object.keys(GARDEN).length, HERB_LIST.length);
  assert.deepEqual(BED_LIGHT, ['sole', 'sole', 'mezzombra', 'ombra']);
});
test('the thirst agrees with the herbarium advice', () => {
  for (const p of HERB_LIST) {
    const acqua = HERB_TEXTS[p.id].coltiva.acqua, g = GARDEN[p.id];
    if (/^Poc/.test(acqua)) { assert.equal(g.dry, true, `${p.id}: «${acqua}» but not dry`); assert.ok(g.every >= 3, `${p.id} drinks little`); }
    if (/^(Tanta|Abbondante|Costante)/.test(acqua)) { assert.equal(g.dry, false, p.id); assert.equal(g.every, 1, `${p.id}: «${acqua}»`); }
    if (g.dry) assert.ok(g.every >= 3, `${p.id} dry but watered often`);
  }
  for (const id of ['lavanda', 'rosmarino', 'salvia', 'timo', 'assenzio', 'ruta']) { assert.equal(GARDEN[id].dry, true); assert.ok(GARDEN[id].every >= 3); }
  for (const id of ['menta', 'melissa', 'valeriana', 'ortica']) { assert.equal(GARDEN[id].dry, false); assert.ok(GARDEN[id].every <= 2); }
});
test('the light agrees with the herbarium advice', () => {
  for (const p of HERB_LIST) {
    const luce = HERB_TEXTS[p.id].coltiva.luce, g = GARDEN[p.id];
    if (/^Pieno sole/.test(luce)) assert.equal(g.luce, 'sole', `${p.id}: «${luce}»`);
    if (/^Mezz'ombra/.test(luce)) assert.equal(g.luce, 'mezzombra', `${p.id}: «${luce}»`);
    if (/^Sole o mezz'ombra/.test(luce)) assert.ok(lightOk(p.id, 'sole') && lightOk(p.id, 'mezzombra'), p.id);
  }
});
test('the soil agrees with the plant: Mediterranean herbs light, the thirsty ones fresh', () => {
  for (const id of ['lavanda', 'rosmarino', 'salvia', 'timo']) assert.equal(GARDEN[id].terra, 'leggera');
  for (const id of ['menta', 'melissa', 'valeriana', 'ortica']) assert.equal(GARDEN[id].terra, 'fresca');
  for (const p of HERB_LIST) { const g = GARDEN[p.id]; if (g.dry) assert.equal(g.terra, 'leggera', p.id); if (g.every === 1) assert.equal(g.terra, 'fresca', p.id); }
});

test('days are calendar days, across months and years', () => {
  assert.equal(daysBetween('2026-11-30', '2026-12-01'), 1);
  assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1);
  assert.equal(daysBetween('2026-03-28', '2026-03-30'), 2); // over a daylight saving change
  assert.equal(daysBetween(null, D), null);
});

// ---- touching the soil, watering --------------------------------------------------------------------
test('the finger: a dry-lover is watered when dry a finger deep, a thirsty plant when dry on top', () => {
  const lav = plant('lavanda', D); // every 4, light soil
  assert.deepEqual([0, 1, 2, 3, 4, 9].map((n) => feel(lav, add(D, n))), ['wet', 'wet', 'top', 'top', 'deep', 'deep']);
  assert.equal(isThirsty(lav, add(D, 3)), false); assert.equal(isThirsty(lav, add(D, 4)), true);
  const mint = plant('menta', D); // every 1, fresh soil
  assert.deepEqual([0, 1, 2].map((n) => feel(mint, add(D, n))), ['wet', 'top', 'deep']);
  assert.equal(isThirsty(mint, add(D, 1)), true);
  assert.equal(looksWet(lav, D), true); assert.equal(looksWet(lav, add(D, 2)), false);
  const t = touch(lav, add(D, 2)); assert.equal(t.feel, 'top'); assert.equal(t.bed.felt, add(D, 2));
});

test('planting, then watering at the right time grows one step; late is never punished', () => {
  let b = plant('lavanda', D);
  assert.equal(b.step, 0); assert.equal(b.terra, 'leggera');
  const r = water(b, add(D, 4), SUN);
  assert.equal(r.ok, 'good'); assert.equal(r.grew, true); assert.equal(r.bed.step, 1); assert.equal(r.key, 'good');
  b = r.bed;
  assert.equal(water(b, add(D, 11), SUN).ok, 'good');
  assert.equal(plant('nope', D), null);
});

test('watering twice the same day: the second is too early', () => {
  let b = plant('menta', D);
  let r = water(b, add(D, 1), 'mezzombra'); assert.equal(r.ok, 'good'); b = r.bed;
  r = water(b, add(D, 1), 'mezzombra'); assert.equal(r.ok, 'early'); assert.equal(r.bed.step, 1);
  r = water(r.bed, add(D, 1), 'mezzombra'); assert.equal(r.ok, 'early'); assert.equal(r.bed.step, 1); // mint loves water: no penalty
  r = water(r.bed, add(D, 2), 'mezzombra'); assert.equal(r.ok, 'good'); assert.equal(r.bed.step, 2);
});

test('too early twice in a row hurts only the plants that like it dry, once a day, never below 0', () => {
  let b = plant('rosmarino', D);
  b = water(b, add(D, 4), SUN).bed; b = water(b, add(D, 8), SUN).bed; // step 2, watered D+8
  let r = water(b, add(D, 9), SUN); assert.equal(r.ok, 'early'); assert.equal(r.bed.step, 2);
  r = water(r.bed, add(D, 10), SUN); assert.equal(r.ok, 'drowned'); assert.equal(r.bed.step, 1);
  r = water(r.bed, add(D, 10), SUN); assert.equal(r.ok, 'early'); assert.equal(r.bed.step, 1); // at most one step a day
  r = water(r.bed, add(D, 11), SUN); assert.equal(r.ok, 'drowned'); assert.equal(r.bed.step, 0);
  assert.equal(water({ ...r.bed, hurt: null }, add(D, 11), SUN).bed.step, 0); // never below 0
  // an early watering wets the soil again: the next good one is an interval after it
  assert.equal(water(r.bed, add(D, 14), SUN).ok, 'early');
  assert.equal(water(r.bed, add(D, 15), SUN).ok, 'good');
  // a plant that does not like it dry: early as often as she wants, never a loss
  let m = water(plant('melissa', D), add(D, 2), 'mezzombra').bed;
  for (let i = 0; i < 4; i++) { const x = water(m, add(D, 3), 'mezzombra'); assert.equal(x.ok, 'early'); m = x.bed; }
  assert.equal(m.step, 1);
});

// ---- light and soil ----------------------------------------------------------------------------------
test('in the wrong light a good watering counts every other time', () => {
  let b = plant('lavanda', D), day = D;
  const go = () => { day = add(day, 4); const r = water(b, day, 'ombra'); b = r.bed; return r; };
  let r = go(); assert.equal(r.ok, 'good'); assert.equal(r.key, 'slow'); assert.equal(b.step, 0);
  r = go(); assert.equal(r.key, 'good'); assert.equal(b.step, 1);
  r = go(); assert.equal(r.key, 'slow'); assert.equal(b.step, 1);
  assert.equal(lightWhy('lavanda', 'ombra'), 'Vuole pieno sole: qui all\'ombra fila e non fiorisce.');
  assert.equal(lightWhy('lavanda', 'sole'), null);
  assert.equal(lightWhy('menta', 'sole'), null); // mint also takes sun
  assert.match(lightWhy('aconito', 'sole'), /^Vuole mezz'ombra/);
  assert.match(lineFor('slow', 'lavanda', { light: 'ombra' }), /cresce piano\. Vuole pieno sole/);
});
test('the soil: a dry-lover in fresh soil stays wet twice as long, a thirsty plant in light soil dries twice as fast', () => {
  assert.equal(interval(plant('lavanda', D, 'fresca')), 8);
  assert.equal(interval(plant('lavanda', D, 'ricca')), 4);
  assert.equal(interval(plant('melissa', D, 'leggera')), 1);
  assert.equal(interval(plant('melissa', D, 'fresca')), 2);
  // lavender in fresh soil, watered at its usual pace: too early, and soon drowned
  let b = water(water(plant('lavanda', D, 'fresca'), add(D, 8), SUN).bed, add(D, 12), SUN).bed;
  assert.equal(b.step, 1);
  assert.equal(water(b, add(D, 16), SUN).ok, 'drowned');
  // mint in light soil wilts after half the absence
  assert.equal(settle(plant('menta', D, 'leggera'), add(D, 2)).bed.wilted, D);
  assert.equal(settle(plant('menta', D, 'fresca'), add(D, 2)).bed.wilted, null);
  assert.match(soilWhy('lavanda', 'fresca'), /resta bagnata il doppio/);
  assert.match(soilWhy('menta', 'leggera'), /il doppio più in fretta/);
  assert.match(soilWhy('lavanda', 'ricca'), /^Starebbe meglio in una terra leggera/);
  assert.equal(soilWhy('lavanda', 'leggera'), null);
});
test('changing soil costs a step, moving costs nothing', () => {
  const b = { ...plant('salvia', D, 'fresca'), step: 3 };
  const r = resoil(b, 'leggera', add(D, 2));
  assert.equal(r.terra, 'leggera'); assert.equal(r.step, 2); assert.equal(r.any, add(D, 2));
  assert.equal(resoil({ ...b, step: 0 }, 'leggera', D).step, 0);
  assert.equal(resoil(b, 'fresca', D), b); // same soil: nothing
  const beds = [b, null, null, null];
  const m = move(beds, 0, 2);
  assert.equal(m[0], null); assert.equal(m[2].step, 3); assert.equal(m[2].terra, 'fresca');
  assert.equal(move(beds, 0, 0), null); assert.equal(move(m, 2, 2), null); assert.equal(move(beds, 1, 2), null);
  assert.equal(move([b, b, null, null], 0, 1), null); // not onto a plant
});

test('a long absence wilts one step, once, and the plant never dies', () => {
  let b = plant('salvia', D);
  b = water(b, add(D, 3), SUN).bed; b = water(b, add(D, 6), SUN).bed; // step 2, watered D+6
  assert.equal(settle(b, add(D, 6 + NEGLECT * 3)).wilted, false); // exactly 3x: not yet
  let s = settle(b, add(D, 6 + NEGLECT * 3 + 1));
  assert.equal(s.wilted, true); assert.equal(s.bed.step, 1);
  s = settle(s.bed, add(D, 200)); assert.equal(s.wilted, false); assert.equal(s.bed.step, 1); // once per absence
  const r = water(s.bed, add(D, 200), SUN); assert.equal(r.ok, 'good'); assert.equal(r.bed.step, 2);
  const z = settle(plant('menta', D), add(D, 90)); assert.equal(z.bed.step, 0); assert.equal(z.wilted, false);
  assert.equal(settle(null, D).bed, null);
});

test('harvest when ripe, then it regrows and gives again', () => {
  let b = plant('timo', D), day = D;
  for (let i = 0; i < GARDEN.timo.steps; i++) { day = add(day, 4); const r = water(b, day, SUN); assert.equal(r.ok, 'good'); b = r.bed; }
  assert.equal(isReady(b), true);
  assert.equal(isThirsty(b, add(day, 10)), false); // a ripe plant asks for the harvest, not for water
  assert.equal(water(b, add(day, 10), SUN).key, 'ripe');
  assert.equal(harvest(plant('timo', D)), null);
  const h = harvest(b);
  assert.equal(h.herb, 'timo'); assert.ok(h.xp > 0);
  assert.equal(h.bed.step, GARDEN.timo.steps - REGROW); assert.equal(isReady(h.bed), false);
  b = h.bed;
  for (let i = 0; i < REGROW; i++) { day = add(day, 4); b = water(b, day, SUN).bed; }
  assert.equal(isReady(b), true);
});

// ---- the whole garden ------------------------------------------------------------------------------
test('thirsty and ripe beds; the threshold asks to check instead of telling', () => {
  const g = { unlocked: true, beds: [plant('menta', D), plant('lavanda', D), null, { ...plant('timo', D), step: GARDEN.timo.steps }] };
  assert.equal(thirsty(g, D), 0); assert.equal(thirsty(g, add(D, 1)), 1); assert.equal(thirsty(g, add(D, 4)), 2);
  assert.equal(readyCount(g), 1);
  assert.equal(thirsty({ ...g, unlocked: false }, add(D, 4)), 0);
  const T = add(D, 1);
  assert.equal(summaryText(summary(g, T)), '2 da controllare');
  g.beds[0] = touch(g.beds[0], T).bed;
  assert.equal(summaryText(summary(g, T)), 'una da controllare');
  g.beds[1] = touch(g.beds[1], T).bed;
  assert.equal(summaryText(summary(g, T)), 'una ha sete'); // the mint, which she touched
  g.beds[0] = water(g.beds[0], T, 'sole').bed;
  assert.equal(summaryText(summary(g, T)), 'una da raccogliere');
  assert.equal(summaryText(summary({ unlocked: true, beds: [null, null, null, null] }, T)), 'da piantare');
  assert.equal(summaryText(summary({ unlocked: true, beds: [touch(plant('salvia', D), D).bed, null, null, null] }, D)), 'tutto a posto');
});

test('old saves without a garden, and broken or older ones', () => {
  for (const x of [undefined, null, 5, 'x', {}, { beds: 'no' }]) { const g = normGarden(x); assert.equal(g.unlocked, false); assert.deepEqual(g.beds, [null, null, null, null]); assert.deepEqual(g.lessons, {}); }
  const g = normGarden({ unlocked: true, beds: [{ herb: 'menta', step: 99, last: D }, { herb: 'nope' }, null], lessons: { acqua: 1, nope: true } });
  assert.equal(g.unlocked, true); assert.equal(g.beds.length, 4); assert.equal(g.beds[0].step, GARDEN.menta.steps); assert.equal(g.beds[1], null);
  assert.equal(g.beds[0].terra, 'fresca'); assert.equal(g.beds[0].any, D); // an older bed gets its own soil
  assert.deepEqual(g.lessons, { acqua: true });
  assert.equal(thirsty(undefined, D), 0); assert.equal(readyCount(undefined), 0);
  assert.deepEqual(normCounts({ menta: 2, nope: 3, salvia: -1, timo: '2' }), { menta: 2, timo: 2 });
});

test('Ortica gives three seedlings from the herbarium, harmless ones first, else the kitchen three', () => {
  assert.deepEqual(seedlings({}, risk, ORDER), FIRST_SEEDLINGS);
  assert.deepEqual(seedlings({ belladonna: {}, ruta: {}, timo: {}, menta: {}, achillea: {} }, risk, ORDER), ['menta', 'timo', 'achillea']);
  assert.deepEqual(seedlings({ belladonna: {}, ruta: {}, valeriana: {} }, risk, ORDER), ['valeriana', 'ruta', 'lavanda']);
  for (const id of seedlings({ belladonna: {}, aconito: {}, cicuta: {}, stramonio: {} }, risk, ORDER)) assert.notEqual(risk(id), 'velenosa');
});

test('seeds: the shop sells her herbs, poisonous ones cost more; the moon picks one of hers', () => {
  assert.deepEqual(seedsForSale({ salvia: {}, belladonna: {} }, ORDER), ['salvia', 'belladonna']);
  assert.equal(seedPrice('salvia', risk), 5); assert.equal(seedPrice('belladonna', risk), 9); assert.equal(seedPrice('ruta', risk), 5);
  assert.equal(moonSeed({}, ORDER, D), null);
  const s = moonSeed({ salvia: {}, menta: {} }, ORDER, D);
  assert.ok(['salvia', 'menta'].includes(s)); assert.equal(moonSeed({ salvia: {}, menta: {} }, ORDER, D), s);
});

test('a full moon can bring a seed', () => {
  const i = GIFTS.findIndex((g) => g.seed);
  assert.ok(i >= 0);
  const g = giftOf(i + 1);
  assert.ok(g.seed);
  assert.match(giftText(g), /seme/);
  assert.match(giftText({ ...g, seedName: 'salvia' }), /un seme di salvia/);
});

test('the lines under a bed are full sentences built from the plant, with no countdown', () => {
  assert.equal(lineFor('good', 'lavanda'), 'La lavanda beve poco: bagnata al momento giusto.');
  assert.equal(lineFor('good', 'rosmarino'), 'Il rosmarino beve poco: bagnato al momento giusto.');
  assert.match(lineFor('early', 'lavanda'), /^Ha ancora i piedi nell'acqua: la lavanda si bagna quando la terra è asciutta anche a un dito/);
  assert.match(lineFor('early', 'menta'), /si asciuga in superficie\.$/);
  assert.equal(lineFor('drowned', 'timo'), 'Troppa acqua per chi ama l\'asciutto: ha perso un passo.');
  assert.equal(lineFor('harvest', 'lavanda'), 'Un mazzetto di lavanda in dispensa.');
  assert.equal(lineFor('harvest', 'alloro'), 'Un mazzetto di alloro in dispensa.');
  assert.match(lineFor('ready', 'alloro'), /^Bagnato al momento giusto, l'alloro adesso è pronto/);
  for (const id of ORDER) for (const k of ['good', 'slow', 'ready', 'early', 'drowned', 'wilted', 'harvest', 'planted', 'resoil', 'moved', 'ripe']) {
    const t = lineFor(k, id, { light: 'ombra', terra: 'ricca' });
    assert.ok(t.endsWith('.'), `${k} ${id}`);
    assert.doesNotMatch(t, /\b(tra|fra) \w+ giorn|domani/, `${k} ${id}: no countdown`);
  }
});
test('Ortica\'s lessons: a fuller note under a bed once the lesson is taken', () => {
  assert.equal(lessonNote('early', {}), null);
  assert.equal(lessonNote('early', { acqua: true }), LESSON_NOTES.acqua);
  assert.equal(lessonNote('slow', { luce: true }), LESSON_NOTES.luce);
  assert.equal(lessonNote('soil', { terra: true }), LESSON_NOTES.terra);
});
