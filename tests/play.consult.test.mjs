import test from 'node:test';
import assert from 'node:assert/strict';
import { engineFor, questionOf, helpNote, isGood, payOf, toneOf, TONES, reactionOf, posLabel } from '../src/systems/consult.rules.js';
import { CLIENTS, REACTIONS } from '../src/data/story/clients.js';
import { AMBITI, FORME, makeQuestion, hasVoice, voiceIds, plan, recall, alternatives, verdictChoices, seeded } from '../src/reading/index.js';
import { SPREADS } from '../src/data/spreads.js';
import { OPENINGS } from '../src/data/reading/frames.js';
import { CARD, MAJORS } from '../src/data/cards.base.js';
import { sheet } from '../src/data/cards.js';
import { SEMI, NUMERI, FIGURE } from '../src/data/reading/grid.js';

test('every client has valid tags, and makeQuestion takes them', () => {
  for (const c of CLIENTS) {
    assert.ok(AMBITI.includes(c.ambito), `${c.id}: ambito ${c.ambito}`);
    assert.ok(FORME.includes(c.forma), `${c.id}: forma ${c.forma}`);
    if (c.question == null) assert.equal(c.forma, 'quadro', `${c.id}: no question means quadro`);
    else assert.notEqual(c.forma, 'quadro', `${c.id}: a question is not a quadro`);
    if (c.ref) assert.match(c.ref.di, /^(di|del|della|dello|dei|degli|delle|dell')\b|^dell'/, `${c.id}: ref.di "${c.ref.di}"`);
    const q = questionOf(c);
    assert.ok(q, `${c.id}: questionOf`);
    assert.deepEqual(q, makeQuestion({ ambito: c.ambito, forma: c.forma, ref: c.ref }));
    // the opening reads as Italian after «Mi chiedi»
    if (c.ref) for (const t of OPENINGS[c.forma]) assert.ok(!t.replace('{di}', c.ref.di).includes('{'), c.id);
  }
});

test('reaction lines: three blunt, three doubtful, exactly as given', () => {
  assert.equal(REACTIONS.blunt.length, 3);
  assert.equal(REACTIONS.doubtful.length, 3);
  assert.ok(REACTIONS.blunt.includes('Non ci giri intorno, tu.'));
  assert.ok(REACTIONS.doubtful.includes('Sarà. Qualcosa mi torna e qualcosa no.'));
});

test('engineFor: only voiced cards, only when enough, never for self', () => {
  const voiced = (id) => ['a', 'b', 'c', 'd'].includes(id);
  assert.deepEqual(engineFor({ client: 'x', n: 3, owned: ['a', 'b', 'c', 'z'], voiced }), { use: true, pool: ['a', 'b', 'c'] });
  assert.equal(engineFor({ client: 'x', n: 3, owned: ['a', 'b', 'z'], voiced }).use, false);
  assert.equal(engineFor({ client: 'x', n: 1, owned: ['a'], voiced }).use, true);
  assert.equal(engineFor({ client: 'x', n: 1, owned: ['z'], voiced }).use, false);
  assert.equal(engineFor({ client: 'self', n: 1, owned: ['a', 'b'], voiced }).use, false);
  // a card the story gives must have a voice too
  assert.equal(engineFor({ client: 'x', n: 2, owned: ['a', 'b'], given: ['z', 'fan'], voiced }).use, false);
  assert.equal(engineFor({ client: 'x', n: 2, owned: ['a', 'b'], given: ['a', 'fan'], voiced }).use, true);
  // the real registry: whatever has a voice today
  const ids = voiceIds();
  assert.equal(engineFor({ client: 'x', n: ids.length, owned: ids }).use, ids.length > 0);
  for (const id of engineFor({ client: 'x', n: 1, owned: [...ids, 'm21x'] }).pool) assert.ok(hasVoice(id));
});

test('good or doubtful: final level right and at most a third wrong', () => {
  assert.equal(isGood({ wrong: 0, total: 2, levelOk: true }), true);
  assert.equal(isGood({ wrong: 1, total: 2 }), false); // single card, one of two wrong
  assert.equal(isGood({ wrong: 2, total: 7, levelOk: true }), true);
  assert.equal(isGood({ wrong: 3, total: 7, levelOk: true }), false);
  assert.equal(isGood({ wrong: 1, total: 7, levelOk: false }), false);
  assert.equal(isGood({ wrong: 0, total: 0 }), false);
});

test('pay: full, half rounded down, at least 1', () => {
  assert.equal(payOf(8, true), 8);
  assert.equal(payOf(8, false), 4);
  assert.equal(payOf(7, false), 3);
  assert.equal(payOf(1, false), 1);
  assert.equal(payOf(0, false), 0);
  assert.equal(payOf(0, true), 0);
});

test('tone gives tono +1 or -1; the blunt line comes first', () => {
  assert.deepEqual(toneOf('garbo').trait, { tono: 1 });
  assert.deepEqual(toneOf('diretta').trait, { tono: -1 });
  assert.deepEqual(TONES.map((t) => t.t), ['Con garbo', 'Senza giri di parole']);
  const rng = seeded(1);
  assert.deepEqual(reactionOf({ good: true, tone: 'garbo', thanks: 'Grazie davvero.', lines: REACTIONS, rng }), ['Grazie davvero.']);
  const r = reactionOf({ good: false, tone: 'diretta', thanks: 'x', lines: REACTIONS, rng });
  assert.equal(r.length, 2);
  assert.ok(REACTIONS.blunt.includes(r[0]) && REACTIONS.doubtful.includes(r[1]));
});

test('help note «Ricordamela»: a cue to remember, never the words of the card (BACKLOG 1.4)', () => {
  const m = helpNote('m05');
  assert.equal(m.kind, 'major');
  assert.deepEqual(m.words, ['Trovata: la casa delle riunioni, la Bibbia']); // where she found it
  assert.match(m.says, /^Guarda la triplice corona\./);
  assert.deepEqual(helpNote('m19').words, ['Al cancello del bosco, all\'alba']); // a card from the story
  assert.deepEqual(helpNote('m15').words, ['Trovata: le cantine'], 'Le catene would say the card');
  // no Major's note holds its words, its keywords or what it says
  for (const { id } of MAJORS) {
    const n = helpNote(id), s = sheet(id), text = `${n.words.join(' ')} ${n.says}`.toLowerCase();
    assert.ok(n.says.length > 10, id);
    for (const w of [...(s.words || []), ...(s.keywords || [])]) assert.ok(!text.includes(String(w).toLowerCase()), `${id}: «${w}» in the note`);
    assert.ok(!text.includes(String(s.says || '').toLowerCase().slice(0, 30)), id);
  }
  // Minors: the place in the row and the element, not the idea of the number or of the suit
  assert.equal(helpNote('c05').line, 'Cinque: viene dopo il Quattro («sosta») · Coppe: l\'acqua');
  assert.equal(helpNote('w01').line, 'Asso: il primo della fila · Bastoni: il fuoco');
  assert.equal(helpNote('p13').line, 'Regina: viene dopo il Cavaliere («chi va») · Denari: la terra');
  for (const id of ['c05', 'w09', 's03', 'p13', 'c14']) {
    const c = CARD[id], line = helpNote(id).line;
    assert.ok(!line.includes(SEMI[c.suit].dove), `${id}: the suit's meaning`);
    assert.ok(!line.includes((c.n <= 10 ? NUMERI[c.n] : FIGURE[c.n]).parola), `${id}: the number's word`);
  }
});

test('plain position labels', () => {
  assert.equal(posLabel(SPREADS.single, 0), 'La carta');
  assert.deepEqual([0, 1, 2].map((i) => posLabel(SPREADS.ppf, i)), ['Passato', 'Presente', 'Futuro']);
});

test('with the voiced cards, every client question gets three options per step', () => {
  const ids = voiceIds();
  if (ids.length < 3) return;
  for (const c of CLIENTS.filter((x) => x.id !== 'self')) {
    const q = questionOf(c);
    const cards = ids.slice(0, 3).map((card, i) => ({ pos: SPREADS.ppf.positions[i].id, card, rev: false }));
    const p = plan(q, 'ppf', cards);
    for (let i = 0; i < 3; i++) {
      assert.equal(recall(p, i, { rng: seeded(i), pool: ids }).length, 3, `${c.id} recall ${i}`);
      assert.equal(alternatives(p, i, { rng: seeded(i), pool: ids }).filter((o) => o.ok).length, 1, `${c.id} alt ${i}`);
    }
    const v = verdictChoices(p, { rng: seeded(2) });
    assert.equal(v.length, 3); assert.equal(v.filter((o) => o.ok).length, 1);
  }
});
