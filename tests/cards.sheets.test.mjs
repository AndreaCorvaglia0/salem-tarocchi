// Sheets, spreads and lessons: every field is there, in sane sizes, and consistent with the base file.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, MAJORS, MINORS, CARD } from '../src/data/cards.base.js';
import { SHEETS, sheet } from '../src/data/cards.js';
import { SPREADS } from '../src/data/spreads.js';
import { LESSONS } from '../src/data/lessons.js';

const AS = ['present', 'cross', 'root', 'past', 'possible', 'future', 'self', 'environment', 'hopefear', 'outcome'];
const words = (s) => s.trim().split(/\s+/).length;
const len = (s, a, b, what) => assert.ok(typeof s === 'string' && s.length >= a && s.length <= b, `${what}: length ${s?.length}`);
const SPOT_WORDS = { 'village.stall': /ambulante|banco|mercato/i, 'village.curtain': /tenda/i, 'village.garden': /orto|erbe/i, 'court.chair': /seggio|Giudice/i, 'meeting.bible': /preghiere|Bibbia/i, 'village.venusglass': /bicchiere|albume/i, 'village.cart': /carro|conestabile/i, 'forest.den': /tana/i, 'forest.lantern': /lanterna/i, 'forest.mill': /mulino/i, 'forest.boundary': /confine/i, 'forest.pond': /stagno/i, 'forest.graveyard': /camposanto/i, 'forest.spring': /ruscelli/i, 'depths.chains': /cantine|catene/i, 'depths.tower': /torre/i, 'depths.well': /pozzo/i, 'depths.swamp': /palude/i };

test('every card has a sheet and sheet() merges the base entry', () => {
  for (const c of CARDS) { assert.ok(SHEETS[c.id], c.id); assert.equal(sheet(c.id).name, c.name); }
  assert.equal(Object.keys(SHEETS).length, 78);
});

test('Major sheets are complete', () => {
  for (const c of MAJORS) {
    const s = SHEETS[c.id], k = c.id;
    len(s.see, 80, 420, `${k} see`); len(s.says, 50, 260, `${k} says`); len(s.core, 15, 80, `${k} core`);
    len(s.reversed, 40, 220, `${k} reversed`); len(s.embody, 30, 200, `${k} embody`); len(s.ask, 15, 120, `${k} ask`); len(s.rumour, 15, 200, `${k} rumour`);
    assert.ok(s.keywords.length >= 6 && s.keywords.length <= 8, `${k} keywords ${s.keywords.length}`);
    for (const w of c.words) assert.ok(s.keywords.includes(w), `${k} keywords lack "${w}"`);
    assert.equal(new Set(s.keywords).size, s.keywords.length, `${k} duplicate keywords`);
    assert.ok(s.details.length >= 3 && s.details.length <= 4, `${k} details`);
    for (const d of s.details) {
      assert.ok(d.id && d.label && d.note, `${k} detail fields`);
      for (const f of ['x', 'y', 'r']) assert.ok(Number.isFinite(d[f]), `${k}.${d.id}.${f}`);
      assert.ok(d.x >= 0 && d.x <= 100 && d.y >= 0 && d.y <= 100 && d.r >= 3 && d.r <= 30, `${k}.${d.id} out of range`);
      assert.ok(d.x - d.r >= -2 && d.x + d.r <= 102, `${k}.${d.id} crop leaves the image sideways`);
    }
    assert.equal(new Set(s.details.map((d) => d.id)).size, s.details.length, `${k} detail ids`);
    assert.deepEqual(Object.keys(s.as).sort(), [...AS].sort(), `${k} as keys`);
    for (const p of AS) { const n = words(s.as[p]); assert.ok(n >= 10 && n <= 18, `${k}.as.${p} has ${n} words: ${s.as[p]}`); }
    assert.ok(s.confusables.length >= 2 && s.confusables.length <= 3, `${k} confusables`);
    for (const x of s.confusables) assert.ok(CARD[x] && x !== k && CARD[x].arcana === 'major', `${k} confusable ${x}`);
  }
});

test('rumours match the hiding place of the card', () => {
  for (const c of MAJORS) {
    const r = SHEETS[c.id].rumour;
    if (c.spot) assert.match(r, SPOT_WORDS[c.spot], `${c.id} rumour should mention its spot ${c.spot}`);
    else assert.match(r, /Arriva|Sorge/, `${c.id} rumour`);
  }
});

test('texts are unique where they are used as answer options', () => {
  const cores = MAJORS.concat(MINORS).map((c) => SHEETS[c.id].core);
  assert.equal(new Set(cores).size, cores.length, 'cores must be unique');
  for (const p of AS) { const all = MAJORS.map((c) => SHEETS[c.id].as[p]); assert.equal(new Set(all).size, all.length, `as.${p} duplicates`); }
});

test('Minor sheets are compact but complete, with all ten as keys', () => {
  for (const c of MINORS) {
    const s = SHEETS[c.id], k = c.id;
    len(s.see, 40, 300, `${k} see`); len(s.core, 15, 100, `${k} core`); len(s.reversed, 20, 160, `${k} reversed`);
    assert.equal(s.keywords.length, 4, `${k} keywords`);
    assert.deepEqual(Object.keys(s.as).sort(), [...AS].sort());
    for (const p of AS) { const n = words(s.as[p]); assert.ok(n >= 10 && n <= 20, `${k}.as.${p} has ${n} words: ${s.as[p]}`); }
  }
});

test('spreads: positions as in the design', () => {
  assert.deepEqual(SPREADS.single.positions.map((p) => p.id), ['present']);
  assert.deepEqual(SPREADS.ppf.positions.map((p) => p.id), ['past', 'present', 'future']);
  assert.deepEqual(SPREADS.celtic.positions.map((p) => p.id), ['present', 'cross', 'root', 'past', 'possible', 'future', 'self', 'environment', 'hopefear', 'outcome']);
  for (const sp of Object.values(SPREADS)) {
    assert.deepEqual(sp.modes, ['domanda', 'quadro']);
    assert.ok(sp.how.length > 40 && sp.name && sp.taughtBy);
    sp.positions.forEach((p, i) => {
      assert.equal(p.n, i + 1); assert.ok(AS.includes(p.id) && p.label && p.hint.length > 8 && p.hint.length < 70);
      assert.ok(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100);
    });
    assert.equal(new Set(sp.positions.map((p) => p.hint)).size, sp.positions.length);
  }
  const c = Object.fromEntries(SPREADS.celtic.positions.map((p) => [p.id, p]));
  assert.equal(c.cross.rot, 90); assert.equal(c.cross.x, c.present.x); assert.equal(c.cross.y, c.present.y);
  assert.ok(c.root.y > c.present.y && c.possible.y < c.present.y && c.past.x < c.present.x && c.future.x > c.present.x);
  assert.ok(c.self.y > c.environment.y && c.environment.y > c.hopefear.y && c.hopefear.y > c.outcome.y);
  assert.ok(c.self.x === c.outcome.x && c.self.x > c.future.x);
});

test('lessons: six, 2-4 pages, right teachers, valid references', () => {
  assert.deepEqual(LESSONS.map((l) => l.id), ['deck', 'single', 'ppf', 'celtic', 'suits', 'astro']);
  const by = { deck: 'malva', single: 'malva', suits: 'malva', ppf: 'ortica', celtic: 'edera', astro: 'edera' };
  for (const l of LESSONS) {
    assert.equal(l.by, by[l.id]); assert.ok(l.pages.length >= 2 && l.pages.length <= 4, l.id);
    for (const p of l.pages) {
      assert.ok(p.h && p.body.length > 60, `${l.id} page`);
      if (p.spread) assert.ok(SPREADS[p.spread]);
      for (const id of p.cards || []) assert.ok(CARD[id], id);
    }
  }
});

test('astrology in the lesson agrees with the base file', () => {
  const body = LESSONS.find((l) => l.id === 'astro').pages.map((p) => p.body).join(' ');
  const exp = { m01: 'Mago è Mercurio', m02: 'Sacerdotessa è la Luna', m03: "Imperatrice è Venere", m10: 'Ruota è Giove', m16: 'Torre è Marte', m21: 'Mondo è Saturno', m04: 'Imperatore è l\'Ariete', m05: 'Papa il Toro', m08: 'Forza il Leone', m09: "Eremita la Vergine", m11: 'Giustizia è la Bilancia', m13: 'Morte lo Scorpione', m14: 'Temperanza il Sagittario', m15: 'Diavolo il Capricorno', m17: "Stella l'Acquario", m18: 'Luna i Pesci', m00: 'Matto è l\'Aria', m12: 'Appeso è l\'Acqua', m20: 'Giudizio è il Fuoco' };
  for (const [id, frag] of Object.entries(exp)) { assert.ok(body.includes(frag), frag); const a = CARD[id].astro.name; assert.ok(new RegExp(a.slice(0, 5)).test(frag), `${id} ${a} vs ${frag}`); }
});
