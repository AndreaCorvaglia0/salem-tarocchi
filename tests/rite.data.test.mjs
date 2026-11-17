import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { AIRS, ARC, START_AIRS, OPENING, SIGNS, MALVA, AMBITO_PHRASE, TEXT, GIFTS, MALVA_SCENE } from '../src/data/rite.js';
import { SAPERE } from '../src/data/sapere.js';
import { AMBITI } from '../src/reading/ask.js';
import { AIRS as LISTEN, CLIPS, encode, decode } from '../harness/ascolto.js';

const pub = (p) => new URL(`../public/${p}`, import.meta.url);

test('every air has colour, room light, motion, smoke, a real note, a track, an element sign and a knowledge-base smoke', () => {
  assert.deepEqual([...ARC].sort(), Object.keys(AIRS).sort());
  for (const a of [...Object.values(AIRS), OPENING]) {
    assert.match(a.color, /^#[0-9a-f]{6}$/, a.id); assert.match(a.room, /^#[0-9a-f]{6}$/, a.id);
    assert.ok(SIGNS[a.element], `${a.id}: sign of ${a.element}`);
    const k = SAPERE[a.sapere];
    assert.ok(k && k.famiglia === 'fumo', `${a.id}: ${a.sapere} is a smoke of src/data/sapere.js`);
    assert.equal(k.elemento, `elemento-${a.element}`, `${a.id}: element agrees with the knowledge base`);
    assert.ok(existsSync(pub(a.note)), `${a.id}: ${a.note}`);
    for (const k2 of ['rise', 'sway', 'swayHz', 'spread', 'fan', 'life', 'alpha', 'sink']) assert.ok(Number.isFinite(a.smoke[k2]), `${a.id}.${k2}`);
    assert.equal(a.smoke.size.length, 2);
  }
  for (const a of Object.values(AIRS)) {
    assert.ok(existsSync(pub(`${a.track}.mp3`)), `${a.id}: ${a.track}.mp3`);
    assert.ok(['wave', 'up', 'low', 'wide', 'still'].includes(a.motion));
    assert.equal(typeof a.provisional, 'boolean');
    if (a.planet) assert.equal(SAPERE[a.sapere].pianeta, `pianeta-${a.planet.toLowerCase()}`, `${a.id}: planet`);
  }
  // five different motions and five different colours: each air must be told apart with the sound off
  assert.equal(new Set(Object.values(AIRS).map((a) => a.motion)).size, 5);
  assert.equal(new Set(Object.values(AIRS).map((a) => a.color)).size, 5);
  assert.ok(START_AIRS.every((a) => AIRS[a] && !AIRS[a].gift));
});
test('the airs are far apart by smoke: rise speed, spread and life differ', () => {
  const v = (a) => [Math.log(a.smoke.rise), Math.log(a.smoke.spread + a.smoke.fan + 1), Math.log(a.smoke.life), Math.log(a.smoke.size[1])];
  const ids = Object.keys(AIRS);
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const d = Math.hypot(...v(AIRS[ids[i]]).map((x, k) => x - v(AIRS[ids[j]])[k]));
    assert.ok(d > 0.6, `${ids[i]}–${ids[j]}: ${d.toFixed(2)}`);
  }
});
test('Malva lights one of the five airs for each kind of question, and every kind has its phrase', () => {
  assert.deepEqual(Object.keys(MALVA).sort(), [...AMBITI].sort());
  assert.deepEqual(Object.keys(AMBITO_PHRASE).sort(), [...AMBITI].sort());
  for (const [k, m] of Object.entries(MALVA)) { assert.ok(AIRS[m.air], k); assert.ok(m.line.length < 200, k); assert.ok(m.line.includes(AIRS[m.air].name.replace(/^(la|il|l')\s?/, '')), `${k}: the line names the air`); }
  assert.equal(new Set(Object.values(MALVA).map((m) => m.air)).size, 5);
  assert.equal(TEXT.mine('casa', AIRS.cipresso, AIRS.salvia), 'Per le domande di casa io accendo il cipresso. Malva accende la salvia.');
  assert.equal(TEXT.fact(AIRS.rosa), 'Per questa domanda hai acceso la rosa.');
  assert.equal(TEXT.named(AIRS.alloro), "Quest'aria è l'alloro.");
});
test('the gifts and the scene: real people of the game, short lines', () => {
  assert.deepEqual(GIFTS.map((g) => g.air), ['salvia', 'mirra']);
  for (const g of GIFTS) { assert.equal(AIRS[g.air].gift, g.from); assert.ok(g.line.length < 260 && g.intro.length < 140); }
  assert.ok(MALVA_SCENE.some((l) => l.t.includes('si bussa, come a una porta')));
  assert.ok(!MALVA_SCENE.some((l) => /Ruta/.test(l.t)), 'Malva never says the name');
});
test('the listening page: its swatches use the rite colours, every clip exists, the code round-trips', () => {
  assert.deepEqual(LISTEN.map((a) => a.id).sort(), Object.keys(AIRS).sort());
  for (const a of LISTEN) { assert.equal(a.color, AIRS[a.id].color, a.id); assert.equal(a.room, AIRS[a.id].room); assert.equal(a.motion, AIRS[a.id].motion); assert.equal(a.word, AIRS[a.id].word); }
  for (const c of CLIPS) assert.ok(existsSync(pub(`rite/cand/${c}.mp3`)), c);
  const key = JSON.parse(readFileSync(new URL('../scripts/audio/ascolto-key.json', import.meta.url), 'utf8'));
  for (const c of CLIPS) assert.ok(AIRS[key[c].air], c);
  // each air has at least two candidates; the provisional winner of each is one of them
  for (const id of Object.keys(AIRS)) assert.ok(CLIPS.filter((c) => key[c].air === id).length >= 2, id);
  const answers = { [CLIPS[0]]: { air: 2, like: 'si' }, [CLIPS[5]]: { air: 0, like: 'no' } };
  const d = decode(encode({ who: 'Lei, con | e :', answers }));
  assert.equal(d.answers[CLIPS[0]].air, 2); assert.equal(d.answers[CLIPS[0]].like, 'si'); assert.equal(d.answers[CLIPS[5]].like, 'no');
  assert.equal(d.answers[CLIPS[1]].air, null);
  assert.ok(!d.who.includes('|'));
  // the page says nothing about which air a clip was chosen for
  const page = readFileSync(new URL('../harness/ascolto.js', import.meta.url), 'utf8');
  for (const t of Object.values(key)) if (t.title) assert.ok(!page.includes(t.title), t.title);
});
test('the build emits the listening page at ascolto/, noindex', () => {
  const cfg = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.match(cfg, /ascolto\/index\.html/);
  assert.match(readFileSync(new URL('../harness/ascolto.html', import.meta.url), 'utf8'), /name="robots" content="noindex/);
});
