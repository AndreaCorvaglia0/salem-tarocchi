import test from 'node:test';
import modelVoice from '../src/data/reading/voices/c05.js';
import assert from 'node:assert/strict';
import { SPREADS } from '../src/data/spreads.js';
import { LEADS, CLOSINGS } from '../src/data/reading/frames.js';
import c05 from '../src/data/reading/voices/c05.js';
import {
  AMBITI, FORME, TREE, walk, allPaths, makeQuestion, ROLE, SINGLE_ROLE, roleOf, drawCards, scan, plan, linkOf, verdictOf,
  seeded, say, sayStep, joinLead, alternatives, recall, LEVEL, verdictChoices, validateVoice, useStubs, line, ROLES,
} from '../src/reading/index.js';
import { clashes, closingFor } from '../src/reading/say.js';
import { CLOSINGS as CL, SCAN } from '../src/data/reading/frames.js';
import stubA from '../src/data/reading/voices/_stub_a.js';

useStubs(true);
const Q = (ambito = 'amore', forma = 'quadro', ref) => makeQuestion({ ambito, forma, ref });
const hand = (...ids) => ids.map((id, i) => ({ pos: `p${i}`, card: id.replace('*', ''), rev: id.endsWith('*') }));

test('the tree reaches all 30 pairs, each in at most 6 taps', () => {
  const seen = new Set();
  for (const p of allPaths(TREE)) {
    const r = walk(TREE, p.path);
    assert.ok(r.done); assert.equal(r.ambito, p.ambito); assert.equal(r.forma, p.forma);
    assert.ok(p.path.length <= 6);
    seen.add(`${p.ambito}/${p.forma}`);
  }
  assert.equal(seen.size, AMBITI.length * FORME.length);
});
test('walk: partial answers give the next question; extra answers throw', () => {
  const r = walk(TREE, [0]);
  assert.equal(r.done, false); assert.ok(r.node.q);
  assert.throws(() => walk(TREE, [0, 0, 0, 0, 0, 0, 0]));
});
test('makeQuestion validates', () => {
  assert.deepEqual(Q('casa', 'sino', { di: 'del campo' }), { ambito: 'casa', forma: 'sino', ref: { di: 'del campo' } });
  assert.throws(() => makeQuestion({ ambito: 'x', forma: 'sino' }));
  assert.throws(() => makeQuestion({ ambito: 'casa', forma: 'y' }));
});

test('ROLE covers every position of every spread', () => {
  for (const s of Object.values(SPREADS)) for (const p of s.positions) assert.ok(ROLES.includes(ROLE[s.id][p.id]), `${s.id}.${p.id}`);
  for (const f of FORME) assert.ok(ROLES.includes(roleOf('single', 'present', f)));
  assert.equal(SINGLE_ROLE.sino, 'arrivo'); assert.equal(roleOf('single', 'present', 'perche'), 'origine');
});

test('drawCards: no duplicates, only from pool, respects reversals:false', () => {
  const pool = ['m00', 'm01', 'm02', 'm03', 'm04', 'c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07'];
  const rng = seeded(5);
  for (let i = 0; i < 50; i++) {
    const cs = drawCards('celtic', { rng, pool, reversals: false });
    assert.equal(cs.length, 10);
    assert.equal(new Set(cs.map((c) => c.card)).size, 10);
    assert.ok(cs.every((c) => pool.includes(c.card) && c.rev === false));
  }
  assert.ok(drawCards('ppf', { rng, pool, revChance: 1 }).every((c) => c.rev));
  assert.throws(() => drawCards('celtic', { pool: ['m00'] }));
});

test('scan: single card gives nothing', () => assert.deepEqual(scan(hand('m01'), Q()), []));
test('scan: majors majority', () => {
  assert.deepEqual(scan(hand('m01', 'm02', 'w03'), Q('altri')).map((f) => f.kind), ['majors']);
});
test('scan: dominant suit', () => {
  const f = scan(hand('c02', 'c04', 's03', 'w08'), Q('amore'));
  assert.deepEqual(f, [{ kind: 'dominant', suit: 'c', count: 2 }]);
});
test('scan: suit foreign to the question', () => {
  const f = scan(hand('s02', 's04', 'w03'), Q('amore'));
  assert.deepEqual(f[0], { kind: 'foreign', suit: 'c', other: 's', count: 2 });
  assert.ok(!f.some((x) => x.kind === 'dominant'));
  assert.deepEqual(scan(hand('s02', 's04', 'c03'), Q('amore')).map((x) => x.kind), ['dominant']);
});
test('scan: missing suit only from seven cards', () => {
  const seven = hand('c02', 'c04', 'w03', 's05', 'p06', 'm01', 'p08'); // all four suits
  assert.ok(!scan(seven, Q('altri')).some((f) => f.kind === 'missing'));
  const no = hand('c02', 'c04', 'w03', 'c05', 'p06', 'w01', 'p08'); // no swords
  assert.deepEqual(scan(no, Q('altri')).find((f) => f.kind === 'missing'), { kind: 'missing', suit: 's' });
  assert.ok(!scan(hand('c02', 'w04', 'p03'), Q('altri')).some((f) => f.kind === 'missing'));
});
test('scan: repeated number, majors count with their own number up to ten', () => {
  assert.deepEqual(scan(hand('c05', 'w05', 's02'), Q('altri')), [{ kind: 'number', n: 5, count: 2 }]);
  assert.deepEqual(scan(hand('m03', 'p03', 's09'), Q('altri')).find((f) => f.kind === 'number'), { kind: 'number', n: 3, count: 2 });
  assert.equal(scan(hand('m12', 'p03', 's09'), Q('altri')).find((f) => f.kind === 'number'), undefined); // XII is not a three she can see
});
test('scan: ten cards need three of a number', () => {
  const ten = hand('c02', 'w02', 'p05', 's06', 'c07', 'w08', 'p09', 's10', 'c04', 'w03');
  assert.ok(!scan(ten, Q('altri')).some((f) => f.kind === 'number'));
  assert.ok(scan(hand('c02', 'w02', 's02', 'p05', 's06', 'c07', 'w08', 'p09', 's10', 'c04'), Q('altri')).some((f) => f.kind === 'number'));
});
test('scan: courts and reversed', () => {
  assert.ok(scan(hand('c11', 'w12', 's03'), Q('altri')).some((f) => f.kind === 'courts'));
  assert.ok(!scan(hand('c11', 'w02', 's03'), Q('altri')).some((f) => f.kind === 'courts'));
  assert.ok(scan(hand('c11*', 'w02*', 's03'), Q('altri')).some((f) => f.kind === 'reversed'));
  assert.ok(!scan(hand('c11*', 'w02', 's03'), Q('altri')).some((f) => f.kind === 'reversed'));
});
test('scan: one finding for a small hand, two for a large one', () => {
  const f = scan(hand('m01', 'm02', 'm03', 'c11*', 'c12*'), Q('lavoro'));
  assert.equal(f.length, 1);
  assert.equal(scan(hand('m01', 'm02', 'm03', 'm04', 'm05', 'c11*', 'c12*', 'c13*'), Q('lavoro')).length, 2);
});

test('verdict codes', () => {
  const st = (...fav) => fav.map((favore, i) => ({ role: 'situazione', pos: `p${i}`, favore }));
  assert.equal(verdictOf(st(2, 2, 2)).code, 'si');
  assert.equal(verdictOf(st(1, 1, 1)).code, 'si_piano');
  assert.equal(verdictOf(st(1, -1, 0)).code, 'dipende');
  assert.equal(verdictOf(st(-1, -1, -1)).code, 'no_cosi');
  assert.equal(verdictOf(st(-2, -2, -2)).code, 'no');
  assert.equal(verdictOf(st(-2, -2, 2)).score, 0, 'last step weighs double');
  const obst = [{ role: 'ostacolo', pos: 'x', favore: -2 }, { role: 'situazione', pos: 'y', favore: 2 }, { role: 'situazione', pos: 'z', favore: 2 }];
  assert.ok(verdictOf(obst).score > 1.2, 'obstacles weigh half');
});
test('link choice', () => {
  const s = (role, favore) => ({ role, favore });
  assert.equal(linkOf(null, s('origine', 1), false), 'apre');
  assert.equal(linkOf(s('origine', 1), s('situazione', -1), false), 'contrasto');
  assert.equal(linkOf(s('origine', -1), s('situazione', -1), false), 'seguito', 'no causal link');
  assert.equal(linkOf(s('origine', -1), s('ostacolo', 1), false), 'contrasto');
  assert.equal(linkOf(s('situazione', 1), s('arrivo', 2), true), 'svolta');
  assert.equal(linkOf(s('situazione', 1), s('arrivo', 2), false), 'seguito');
  assert.equal(linkOf(s('situazione', 0), s('arrivo', 2), false), 'seguito');
});
test('plan builds steps with roles, links and verdict', () => {
  const p = plan(Q('amore', 'andra'), 'ppf', hand('_a', '_b*', '_c').map((c, i) => ({ ...c, pos: ['past', 'present', 'future'][i] })));
  assert.deepEqual(p.steps.map((s) => s.role), ['origine', 'situazione', 'arrivo']);
  assert.deepEqual(p.steps.map((s) => s.favore), [2, -2, 1]);
  assert.deepEqual(p.steps.map((s) => s.link), ['apre', 'contrasto', 'contrasto']);
  assert.ok(p.steps.every((x) => x.link !== 'causa'));
  assert.ok(['si', 'si_piano', 'dipende', 'no_cosi', 'no'].includes(p.verdict.code));
});

const stubPlan = (q = Q('amore', 'andra')) => plan(q, 'ppf', [
  { pos: 'past', card: '_a', rev: false }, { pos: 'present', card: '_c', rev: false }, { pos: 'future', card: '_b', rev: true },
]);

test('joinLead: lowercases after a lead, keeps punctuation, capitalised when alone', () => {
  assert.equal(joinLead('Adesso', 'Hai perso qualcosa.'), 'Adesso hai perso qualcosa.');
  assert.equal(joinLead('Se vuoi un consiglio,', 'Ascolta il tuo cuore.'), 'Se vuoi un consiglio, ascolta il tuo cuore.');
  assert.equal(joinLead('Il passo da fare è questo:', "C'è tempo."), "Il passo da fare è questo: c'è tempo.");
  assert.equal(joinLead('', 'Hai perso.'), 'Hai perso.');
});
test('say with stubs: seeded, lead-in + lowercased sentence, no repeated lead-in', () => {
  const p = stubPlan();
  const a = say(p, { rng: seeded(3) });
  assert.deepEqual(a, say(p, { rng: seeded(3) }), 'same seed, same reading');
  p.steps.forEach((s, i) => {
    const sentence = line(s.card, s.rev, 'amore', s.role);
    assert.equal(a.parts[i].text, joinLead(a.parts[i].lead, sentence));
    if (a.parts[i].lead) assert.ok(a.parts[i].text.startsWith(a.parts[i].lead + ' ' + sentence[0].toLowerCase()));
  });
  assert.equal(a.opening, null, 'no ref, no opening'); assert.ok(a.full.endsWith(a.closing));
  for (let seed = 0; seed < 200; seed++) {
    const leads = say(p, { rng: seeded(seed) }).parts.map((x) => x.lead).filter(Boolean);
    assert.equal(new Set(leads).size, leads.length);
  }
});
test('say: with rng 0 the first variants are used (exact strings)', () => {
  const p = stubPlan(Q('amore', 'andra', { di: 'del campo' }));
  const r = say(p, { rng: () => 0 });
  assert.equal(r.opening, 'Mi chiedi del campo, e come andrà a finire.');
  assert.equal(r.parts[0].text, 'Alle tue spalle hai portato avanti una questione di cuore con calma per parecchio tempo, e da allora le cose sono cambiate poco.');
  assert.equal(r.parts[1].lead, 'Adesso'); // same sign as the step before: plain continuation
});
test('say reports missing lines and never invents text', () => {
  const p = stubPlan();
  p.steps[1].card = 'zzz';
  const r = say(p, { rng: seeded(1) });
  assert.equal(r.parts[1].text, null);
  assert.deepEqual(r.missing, [{ card: 'zzz', rev: false, ambito: 'amore', role: 'situazione' }]);
  assert.equal(r.parts.filter((x) => x.text).length, 2);
});
test('sayStep shares a used set across calls', () => {
  const p = stubPlan(); const used = new Set();
  const a = sayStep(p, 0, { rng: seeded(2), used });
  assert.equal(a.pos, 'past'); assert.ok(a.text);
});
test('closing takes {di} only when the request has a detail', () => {
  for (let seed = 0; seed < 50; seed++) assert.ok(!say(stubPlan(), { rng: seeded(seed) }).closing.includes('{'));
  assert.ok(CLOSINGS.sino.si.some((t) => t.includes('{di}')));
});

test('every lead-in composes cleanly with every sentence of the model voice (c05)', () => {
  const sides = [c05.up, c05.rev];
  for (const group of Object.values(LEADS)) {
    for (const [role, leads] of Object.entries(group)) {
      for (const lead of leads) {
        if (!lead) continue;
        const bare = !/[,:]$/.test(lead);
        if (role === 'ostacolo') assert.ok(!bare, `ostacolo lead must end with a comma or colon: ${lead}`);
        for (const side of sides) for (const a of AMBITI) {
          const sentence = side[a][role];
          const out = joinLead(lead, sentence);
          assert.ok(!/\s{2,}/.test(out), out);
          assert.ok(out.startsWith(lead + ' '), out);
          const rest = out.slice(lead.length + 1);
          assert.equal(rest[0], rest[0].toLowerCase(), `capital after a lead: ${out}`);
          assert.ok(!/[.!?] [a-zà-ù]/.test(out), `lowercase after a full stop: ${out}`);
          assert.ok(out.endsWith('.'));
        }
      }
    }
  }
});

// The choices use the real voices: wrong options come from OTHER cards (never the same card in another role or ambito).
const realPlan = (forma = 'andra', cards = [{ pos: 'past', card: 'c05', rev: false }, { pos: 'present', card: 'w01', rev: false }, { pos: 'future', card: 'p04', rev: true }]) => {
  useStubs(false); // real voices only for building the plan; the stubs come back right after
  try { return plan(makeQuestion({ ambito: 'amore', forma }), 'ppf', cards); } finally { useStubs(true); }
};
test('alternatives: one ok, three distinct texts, the wrong ones are other cards in the same place', () => {
  const p = realPlan();
  for (let seed = 0; seed < 30; seed++) {
    const alts = alternatives(p, 0, { rng: seeded(seed) });
    assert.equal(alts.length, 3);
    assert.equal(alts.filter((a) => a.ok).length, 1);
    assert.equal(new Set(alts.map((a) => a.text)).size, 3);
    assert.equal(alts.find((a) => a.ok).text, line('c05', false, 'amore', 'origine'));
    for (const a of alts.filter((x) => !x.ok)) { assert.notEqual(a.card, 'c05'); assert.equal(a.text, line(a.card, a.rev, 'amore', 'origine')); }
  }
});
test('alternatives with verso: the same card turned the other way is one of the wrong ones', () => {
  const alts = alternatives(realPlan(), 0, { rng: seeded(2), verso: true });
  assert.ok(alts.some((a) => !a.ok && a.card === 'c05' && a.rev === true));
});
test('recall: the idea of the card among the ideas of other cards', () => {
  const p = realPlan();
  for (let seed = 0; seed < 20; seed++) {
    const r = recall(p, 2, { rng: seeded(seed) });
    assert.equal(r.length, 3); assert.equal(r.filter((a) => a.ok).length, 1);
    assert.equal(r.find((a) => a.ok).text, 'La presa si allenta: si dà, o si perde.');
    assert.ok(r.filter((a) => !a.ok).every((a) => a.card !== 'p04'));
  }
});
test('verdictChoices: three plain levels, one ok', () => {
  const p = realPlan('sino');
  const ch = verdictChoices(p, { rng: seeded(4) });
  assert.deepEqual(ch.map((c) => c.level), ['bene', 'dipende', 'male']);
  assert.equal(ch.filter((c) => c.ok).length, 1);
  assert.equal(ch.find((c) => c.ok).level, LEVEL[p.verdict.code]);
  assert.equal(new Set(ch.map((c) => c.text)).size, 3);
});

// validateVoice: one test per rule
const clone = () => JSON.parse(JSON.stringify(modelVoice)); // the model card: stubs are longer than a real voice may be
const withLine = (text) => { const v = clone(); v.up.amore.situazione = text; return v; };
const fine = 'Stai attraversando una questione di cuore con calma e non hai nessuna fretta.';
test('validateVoice accepts a good voice', () => { assert.deepEqual(validateVoice(clone()), []); assert.deepEqual(validateVoice(withLine(fine)), []); });
test('validateVoice: a missing sentence', () => { const v = clone(); delete v.rev.casa.ostacolo; assert.match(validateVoice(v)[0], /rev\.casa\.ostacolo: missing/); });
test('validateVoice: a missing ambito, and a missing orientation', () => {
  const v = clone(); delete v.up.se; assert.match(validateVoice(v)[0], /up\.se: missing/);
  const w = clone(); delete w.rev; assert.match(validateVoice(w)[0], /rev: missing/);
});
test('validateVoice: too short and too long', () => {
  assert.ok(validateVoice(withLine('Stai bene così.')).some((p) => /words/.test(p)));
  assert.ok(validateVoice(withLine(`${'Stai pensando a una cosa '.repeat(6)}ancora.`)).some((p) => /words/.test(p)));
});
test('validateVoice: full stop', () => assert.ok(validateVoice(withLine(fine.slice(0, -1))).some((p) => /full stop/.test(p))));
test('validateVoice: forbidden first words', () => {
  for (const w of ['Ma', 'E', 'Però', 'Invece']) assert.ok(validateVoice(withLine(`${w} stai attraversando una questione di cuore con calma e senza fretta.`)).some((p) => /starts with/.test(p)), w);
});
test('validateVoice: adverbial starts', () => {
  for (const w of ['Nel passato', 'Adesso', 'Ora', 'Presto', 'Domani', 'Ieri', 'Più avanti', 'In passato', 'Oggi', "Nell'ultimo anno"]) {
    assert.ok(validateVoice(withLine(`${w} stai attraversando una questione di cuore con calma e senza fretta.`)).some((p) => /adverbial/.test(p)), w);
  }
  assert.deepEqual(validateVoice(withLine('Ora che ci penso resta il fatto che stai bene, e non hai nessuna fretta davvero.')).length, 1);
  assert.deepEqual(validateVoice(withLine('Orazio ti aspetta alla porta di casa da un po\' e non ha nessuna fretta davvero.')), []);
});
test('validateVoice: banned phrases', () => {
  for (const t of ['la carta', 'le carte', 'questa carta', 'posizione']) {
    assert.ok(validateVoice(withLine(`Stai attraversando ${t} con calma, e non hai nessuna fretta di cambiare.`)).some((p) => p.includes(`"${t}"`)), t);
  }
  assert.deepEqual(validateVoice(withLine('Stai ritrovando la tua disposizione di una volta, e non hai nessuna fretta di cambiare.')), []);
});
test('validateVoice: the card own name', () => {
  const v = clone(); v.id = 'c05'; v.up.amore.situazione = 'Stai vivendo il Cinque di Coppe con calma, e non hai nessuna fretta di cambiare.';
  assert.ok(validateVoice(v).some((p) => /card name/.test(p)));
});
test('validateVoice: favore and moto', () => {
  for (const f of [3, -3, 0.5, '1']) { const v = clone(); v.up.favore = f; assert.ok(validateVoice(v).some((p) => /favore/.test(p)), String(f)); }
  const v = clone(); v.rev.moto = 'vola'; assert.ok(validateVoice(v).some((p) => /moto/.test(p)));
  const w = clone(); w.up.favore = -2; w.rev.favore = 2; assert.deepEqual(validateVoice(w), []);
});
test('the model voice c05 passes the rules', () => assert.deepEqual(validateVoice(c05), []));

test('a lead-in never shares a content word of 5+ letters with its sentence', () => {
  assert.ok(clashes('Alle tue spalle', 'Qualcuno ti ha voltato le spalle, e da allora diffidi.'));
  assert.ok(clashes('Prima di tutto questo', "Hai perso QUESTO e basta, perché c'è dell'altro."));
  assert.ok(!clashes('Adesso', 'Stai attraversando una cosa nuova.'));
  assert.ok(clashes('Per ora, mercoledì', 'Mercoledi non va bene per niente.'), 'accent and case insensitive');
  // end to end: the chosen lead is never one that clashes
  const p = plan(Q('amore', 'andra'), 'ppf', [
    { pos: 'past', card: 'c05', rev: false }, { pos: 'present', card: 'c05', rev: true }, { pos: 'future', card: 'c05', rev: false },
  ]);
  for (let seed = 0; seed < 100; seed++) for (const part of say(p, { rng: seeded(seed) }).parts) {
    if (part.lead) assert.ok(!clashes(part.lead, line(part.card, part.rev, 'amore', part.role)), part.text);
  }
});
test('at most one lead-in with "invece" or "però" per reading', () => {
  const flipped = plan(Q('amore', 'quadro'), 'celtic', Array.from({ length: 10 }, (_, i) => ({ pos: Object.keys(ROLE.celtic)[i], card: i % 2 ? '_b' : '_a', rev: false })));
  assert.ok(flipped.steps.filter((x) => x.link === 'contrasto').length >= 4);
  for (let seed = 0; seed < 100; seed++) {
    const leads = say(flipped, { rng: seeded(seed) }).parts.map((x) => x.lead);
    assert.ok(leads.filter((l) => /invece|però/.test(l)).length <= 1, leads.join(' | '));
  }
});
test('opening: auto only with a request detail; always and never', () => {
  const withRef = stubPlan(Q('amore', 'andra', { di: 'del campo' }));

  assert.match(say(withRef, { rng: seeded(1) }).opening, /del campo/);
  assert.equal(say(stubPlan(), { rng: seeded(1) }).opening, null);
  assert.equal(say(withRef, { rng: seeded(1), opening: 'never' }).opening, null);
  assert.ok(say(stubPlan(), { rng: seeded(1), opening: 'always' }).opening);
  assert.ok(say(withRef, { rng: seeded(1), opening: 'always' }).full.startsWith(say(withRef, { rng: seeded(1), opening: 'always' }).opening));
});
test('closings: four variants per cell, two plain; never the same twice in a row with a shared set', () => {
  for (const forma of FORME) for (const code of Object.keys(CL[forma])) {
    assert.equal(CL[forma][code].length, 4, `${forma}/${code}`);
    assert.ok(CL[forma][code].filter((t) => !t.includes('{di}')).length >= 2, `${forma}/${code}`);
  }
  for (const ref of [undefined, { di: 'del campo' }]) {
    const used = new Set(); const rng = seeded(8); let prev = null;
    for (let i = 0; i < 200; i++) {
      const t = closingFor('sino', 'si', ref, rng, used);
      assert.notEqual(t, prev); prev = t;
    }
  }
});
test('say: fare and scelta add the consiglio of the decisive card; other forms do not', () => {
  const p = stubPlan(Q('lavoro', 'fare'));
  const r = say(p, { rng: seeded(2) });
  const sentence = line('_b', true, 'lavoro', 'consiglio');
  assert.ok(r.advice.toLowerCase().endsWith(sentence.slice(1)) || r.advice === sentence);
  assert.match(r.advice, /^(Se vuoi un consiglio,|Il passo da fare è questo:|Ti dico solo questo:|Per ora,) /);
  assert.ok(r.full.endsWith(r.advice)); assert.ok(r.full.includes(r.closing + ' ' + r.advice));
  assert.equal(say(stubPlan(Q('lavoro', 'andra')), { rng: seeded(2) }).advice, null);
  // single card whose role is already consiglio: no advice
  const one = plan(Q('lavoro', 'scelta'), 'single', [{ pos: 'present', card: '_a', rev: false }]);
  assert.equal(one.steps[0].role, 'consiglio'); assert.equal(say(one, { rng: seeded(2) }).advice, null);
  // missing consiglio line is reported
  const q = stubPlan(Q('lavoro', 'scelta')); q.steps[2].card = 'zzz';
  assert.deepEqual(say(q, { rng: seeded(2) }).missing.filter((m) => m.role === 'consiglio').length, 1);
});
test('scan sentences name what is seen and come after the card sentences', () => {
  const p = plan(Q('lavoro', 'andra'), 'ppf', hand('c02', 'c04', 's03').map((c, i) => ({ ...c, pos: ['past', 'present', 'future'][i] })));
  assert.deepEqual(p.scan.map((f) => f.kind), ['foreign']);
  for (let seed = 0; seed < 20; seed++) {
    const r = say(p, { rng: seeded(seed) });
    assert.ok(r.scan[0].includes('Denar') || r.scan[0].includes('Denaro'), r.scan[0]);
    assert.ok(r.full.indexOf(r.parts[2].text) < r.full.indexOf(r.scan[0]));
    assert.ok(r.full.indexOf(r.scan[0]) < r.full.indexOf(r.closing));
  }
  const dom = plan(Q('altri', 'andra'), 'ppf', hand('c02', 'c04', 'c06').map((c, i) => ({ ...c, pos: ['past', 'present', 'future'][i] })));
  assert.match(say(dom, { rng: () => 0 }).scan[0], /^Tante Coppe insieme: qui comanda il cuore\.$/);
  assert.ok(Object.values(SCAN).every((v) => v.length >= 2 && v.length <= 3));
  for (const f of [{ kind: 'number', n: 5, count: 2 }, { kind: 'missing', suit: 's' }, { kind: 'courts', count: 2 }, { kind: 'majors', count: 2 }, { kind: 'reversed', count: 2 }]) {
    const t = say({ ...p, scan: [f] }, { rng: seeded(1) }).scan[0];
    assert.ok(!t.includes('{') && !t.includes('undefined'), t);
  }
});
