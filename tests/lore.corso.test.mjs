// The course in the vault (lore/corso/, spec notes/vault/V3-spec.md): every concept and goal has its peso, the
// nucleus the vault lacked is there (numbers, court figures, spreads, the reversed rule, the history) written
// from the game's data, every goal says which families it is about, the places written in the cards
// (sta_in, arriva_da, la_da, si_impara_da) agree with the game's data, the page of the six voices is generated,
// the circle (src/data/sapere.js) does not see the new families, and the new rules of `lore check` catch what
// they should on small made-up vaults.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadStory, ROOT } from '../scripts/lore/story.mjs';
import { loadVault, vaultOf, docOf, linkTarget } from '../scripts/lore/vault.mjs';
import { check } from '../scripts/lore/check.mjs';
import { generate } from '../scripts/lore/gen.mjs';
import { readSapere, CIRCLE_FAMILIES, OUTSIDE_FAMILIES } from '../scripts/lore/sapere.mjs';
import { corsoModel } from '../scripts/lore/corso.mjs';
import { expectedPlaces } from '../scripts/lore/posti.mjs';
import { NUMERI, FIGURE } from '../src/data/reading/grid.js';
import { SPREADS } from '../src/data/spreads.js';
import { MAJORS } from '../src/data/cards.base.js';
import { SAPERE_LEAVES, SAPERE_HUBS, SAPERE_SIGNS } from '../src/data/sapere.js';

const V = loadVault();
const README = readFileSync(join(ROOT, 'lore', 'README.md'), 'utf8');
const concetti = V.ofTipo('concetto').filter((d) => d.folder === 'corso/concetti');
const fam = (f) => concetti.filter((d) => d.data.famiglia === f);
const asList = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);
const words = (s) => String(s).trim().split(/\s+/).length;
let S = null;
const story = async () => (S ||= await loadStory());

const PESO = { arcano: 'nucleo', seme: 'nucleo', numero: 'nucleo', figura: 'nucleo', stesa: 'nucleo', regola: 'nucleo', elemento: 'contorno', pianeta: 'contorno', segno: 'contorno', intenzione: 'contorno', erba: 'contorno', fumo: 'contorno', pietra: 'contorno', storia: 'contorno' };
const NUCLEO = ['riconoscere-una-carta', 'dire-l-idea-della-carta', 'capire-i-minori', 'leggere-in-posizione', 'leggere-le-capovolte', 'conoscere-le-stese', 'unire-le-carte', 'rispondere-a-chi-chiede', 'leggere-il-proprio-mazzo'];
const CONTORNO = ['ricordare-i-dettagli', 'decidere-con-una-carta', 'conoscere-pianeti-e-segni', 'conoscere-la-storia-dei-tarocchi', 'riconoscere-e-curare-le-piante'];
const CONCETTI = {
  'riconoscere-una-carta': 'arcano seme', 'ricordare-i-dettagli': 'arcano', 'dire-l-idea-della-carta': 'arcano seme numero figura', 'capire-i-minori': 'seme numero figura',
  'leggere-in-posizione': 'stesa arcano', 'leggere-le-capovolte': 'regola arcano', 'conoscere-le-stese': 'stesa', 'unire-le-carte': 'arcano seme numero stesa',
  'rispondere-a-chi-chiede': 'arcano stesa', 'leggere-il-proprio-mazzo': 'arcano seme numero figura stesa regola', 'decidere-con-una-carta': 'arcano',
  'conoscere-pianeti-e-segni': 'pianeta segno elemento', 'conoscere-la-storia-dei-tarocchi': 'storia', 'riconoscere-e-curare-le-piante': 'erba',
};

test('every concetto has its peso, by family, as the lead decided', () => {
  assert.ok(concetti.length >= 123);
  for (const d of concetti) {
    assert.equal(d.data.peso, PESO[d.data.famiglia], `${d.rel}: peso`);
    assert.ok(Object.hasOwn(PESO, d.data.famiglia), `${d.rel}: family ${d.data.famiglia}`);
  }
  // every family is either of the circle or listed as outside it
  assert.deepEqual([...new Set(concetti.map((d) => d.data.famiglia))].sort(), [...CIRCLE_FAMILIES, ...OUTSIDE_FAMILIES].sort());
});

test('every obiettivo has its peso and the families of concetti it is about', () => {
  const objs = V.ofTipo('obiettivo');
  assert.equal(objs.length, 14);
  const families = new Set(concetti.map((d) => d.data.famiglia));
  for (const d of objs) {
    assert.equal(d.data.peso, NUCLEO.includes(d.name) ? 'nucleo' : 'contorno', `${d.name}: peso`);
    assert.ok(NUCLEO.includes(d.name) || CONTORNO.includes(d.name), `${d.name} is in neither list`);
    assert.deepEqual(asList(d.data.concetti), CONCETTI[d.name].split(' '), `${d.name}: concetti`);
    for (const c of asList(d.data.concetti)) { assert.ok(families.has(c), `${d.name}: ${c}`); assert.ok(!String(c).includes('[['), `${d.name}: a family name, not a link`); }
  }
  assert.equal(NUCLEO.length, 9); assert.equal(CONTORNO.length, 5);
});

test('the nucleus the vault lacked: ten numbers, four figures, three spreads, the reversed rule, the history', () => {
  assert.equal(fam('numero').length, 10); assert.equal(fam('figura').length, 4); assert.equal(fam('stesa').length, 3);
  assert.equal(fam('regola').length, 1); assert.equal(fam('storia').length, 1);
  for (const f of ['numero', 'figura', 'stesa', 'regola', 'storia']) for (const d of fam(f)) {
    assert.ok(d.name.startsWith(f) || f === 'storia', d.name);
    const ib = String(d.data.in_breve || '');
    assert.ok(ib.length > 10 && !/\n/.test(ib), `${d.name}: in_breve`);
    assert.ok(words(ib) <= 22, `${d.name}: in_breve has ${words(ib)} words`);
    assert.ok(d.data.fonte === (f === 'storia' ? 'ricerca' : 'copione'), `${d.name}: fonte`);
    const dati = asList(d.data.dati);
    assert.ok(dati.length >= 1, `${d.name}: dati`);
    for (const p of dati) assert.ok(existsSync(join(ROOT, p)), `${d.name}: ${p} does not exist`);
  }
  // every concept of the nucleus has its in_breve
  for (const d of concetti.filter((x) => x.data.peso === 'nucleo')) assert.ok(String(d.data.in_breve || '').trim(), `${d.name}: in_breve`);
});

test('the numbers and the figures say what the game says (src/data/reading/grid.js)', () => {
  const N = ['asso', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'];
  N.forEach((n, i) => {
    const d = V.get(`numero-${n}`);
    assert.ok(d.data.in_breve.includes(NUMERI[i + 1].parola), `${n}: the game's word`);
    assert.ok(d.data.si_dice.toLowerCase().includes(NUMERI[i + 1].idea.toLowerCase()), `${n}: the game's idea`);
  });
  [[11, 'fante'], [12, 'cavaliere'], [13, 'regina'], [14, 're']].forEach(([n, f]) => {
    const d = V.get(`figura-${f}`);
    assert.equal(d.data.nome, FIGURE[n].nome);
    assert.ok(d.data.in_breve.includes(FIGURE[n].parola) && d.data.in_breve.toLowerCase().includes(FIGURE[n].idea.toLowerCase()), `${f}: the game's words`);
  });
});

test('the spreads say what src/data/spreads.js says: their positions, in order', () => {
  for (const [file, id] of [['stesa-carta-singola', 'single'], ['stesa-passato-presente-futuro', 'ppf'], ['stesa-croce-celtica', 'celtic']]) {
    const d = V.get(file), sp = SPREADS[id];
    assert.equal(d.data.id, id); assert.equal(d.data.nome, sp.name);
    const pos = asList(d.data.posizioni);
    assert.equal(pos.length, sp.positions.length, `${file}: positions`);
    sp.positions.forEach((p, i) => { assert.equal(pos[i].n, p.n); assert.equal(pos[i].nome, p.label); assert.equal(pos[i].cosa, p.hint); });
    assert.equal(d.data.si_dice, sp.how);
  }
});

test('the places written in the cards are the places of the game data (sta_in, arriva_da, la_da, si_impara_da)', () => {
  const { places, none } = expectedPlaces(V);
  const FIELDS = ['sta_in', 'arriva_da', 'la_da', 'si_impara_da'];
  for (const d of concetti) {
    const want = places[d.name] || {};
    for (const f of FIELDS) {
      const have = d.data[f] ? linkTarget(d.data[f]) : undefined;
      assert.equal(have, want[f], `${d.name}: ${f} is ${have}, the game data say ${want[f]}`);
    }
  }
  // no card of the game's data left without its place, except what the vault has no card for (listed)
  assert.deepEqual(none.map((n) => n.name).sort(), ['erba-rosa', 'erba-salice']);
});

test('the Majors: sta_in is the place of their spot in cards.base.js; the four without a spot come from a fatto', () => {
  assert.equal(MAJORS.length, 22);
  for (const m of MAJORS) {
    const d = concetti.find((x) => x.data.famiglia === 'arcano' && x.data.id === m.id);
    if (m.spot) { assert.ok(d.data.sta_in, `${m.id} has a spot (${m.spot}) and no sta_in`); assert.ok(!d.data.arriva_da, m.id); }
    else { assert.ok(d.data.arriva_da && !d.data.sta_in, `${m.id} has no spot: arriva_da`); }
  }
  assert.deepEqual(MAJORS.filter((m) => !m.spot).map((m) => m.name), ['Il Matto', 'Il Sole', 'Il Giudizio', 'Il Mondo']);
  // the spot of a card whose anchor is itself a luogo of the vault points to that very luogo
  for (const m of MAJORS.filter((x) => x.spot)) {
    const direct = V.ofTipo('luogo').find((l) => l.data.id === m.spot);
    if (direct) assert.equal(linkTarget(concetti.find((x) => x.data.id === m.id).data.sta_in), direct.name, `${m.id}`);
  }
});

test('the circle does not see the new families: sapere.js, its hubs, signs and leaves', () => {
  const D = readSapere(V);
  for (const e of [...D.hubs, ...D.signs, ...D.leaves]) assert.ok(CIRCLE_FAMILIES.includes(e.famiglia), e.id);
  assert.deepEqual([...new Set(SAPERE_LEAVES.map((e) => e.famiglia))].sort(), ['arcano', 'erba', 'fumo', 'pietra', 'seme']);
  assert.ok([...SAPERE_HUBS, ...SAPERE_SIGNS, ...SAPERE_LEAVES].every((e) => !OUTSIDE_FAMILIES.includes(e.famiglia)));
  assert.equal(SAPERE_LEAVES.length, 73); assert.equal(SAPERE_HUBS.length, 19); assert.equal(SAPERE_SIGNS.length, 12);
});

test('lore/corso/_sei-voci.md is generated, has every family, and shows the holes', async () => {
  const pages = generate(await story(), V);
  const text = pages.get('corso/_sei-voci.md');
  assert.ok(text, 'the page is generated');
  assert.equal(readFileSync(join(ROOT, 'lore', 'corso', '_sei-voci.md'), 'utf8'), text, 'out of date: run node scripts/lore.mjs gen');
  const M = corsoModel(V);
  assert.equal(M.fams.length, 14);
  for (const f of M.fams) assert.ok(text.includes(`**${f.famiglia}**`), f.famiglia);
  assert.deepEqual(M.senzaConcetti, []);
  assert.deepEqual(M.senzaObiettivi.sort(), ['fumo', 'intenzione', 'pietra']);
  const by = Object.fromEntries(M.fams.map((f) => [f.famiglia, f]));
  assert.equal(by.arcano.nucleo.length, 22); assert.equal(by.arcano.immagini.length, 22);
  assert.equal(by.stesa.corpo.length, 0, 'a hole the page must show: no mechanic of law 3 touches the spreads');
  assert.equal(by.segno.motivo.length, 0, 'a hole the page must show');
  assert.ok(text.includes('### Meccaniche che non toccano nessun concetto'));
  assert.ok(text.includes('## I buchi') && text.includes('Famiglie senza obiettivi: intenzione, fumo, pietra'));
  // the circle says in `aperto` why fumo, pietra and intenzione have no goal
  assert.ok(/fumi.*pietre.*intenzioni/.test(String(V.get('_il-cerchio').data.aperto)));
});

// ---- the rules of `lore check` on small made-up vaults ------------------------------------------------
const mini = (docs) => vaultOf(docs.map(([rel, text]) => docOf(rel, text)), README);
const run = async (docs) => check(mini(docs), await story());
const concetto = (name, extra = '', fam = 'numero') => [`corso/concetti/${name}.md`, `---\ntipo: concetto\nnome: "X"\nfamiglia: ${fam}\n${extra}in_breve: "Una riga."\nfonte: copione\n---\n\ntesto\n`];
const obiettivo = (name, extra) => [`corso/obiettivi/${name}.md`, `---\ntipo: obiettivo\nnome: "X"\n${extra}sa_fare: "x"\nsi_vede_da: "x"\nmeccaniche: []\naperto: "x"\n---\n\ntesto\n`];
const rules = (r, rule) => r.errors.filter((e) => e.rule === rule || e.rule.startsWith(`${rule}.`));

test('lore check: a concetto without peso, or with a wrong one, is an error', async () => {
  const bad = await run([['corso/concetti/numero-x.md', '---\ntipo: concetto\nnome: "X"\nfamiglia: numero\nin_breve: "Una riga."\nfonte: copione\n---\n\nt\n']]);
  assert.ok(bad.errors.some((e) => e.rule === 'fields' && /peso/.test(e.msg)));
  const wrong = await run([concetto('numero-x', 'peso: grande\n')]);
  assert.equal(rules(wrong, 'peso').length, 1);
  const ok = await run([concetto('numero-x', 'peso: nucleo\n')]);
  assert.equal(rules(ok, 'peso').length, 0);
});

test('lore check: an obiettivo needs peso and concetti, and the families must exist', async () => {
  const c = concetto('numero-x', 'peso: nucleo\n');
  assert.ok((await run([c, obiettivo('o', 'concetti:\n  - "numero"\n')])).errors.some((e) => e.rule === 'fields' && /peso/.test(e.msg)));
  assert.ok((await run([c, obiettivo('o', 'peso: nucleo\n')])).errors.some((e) => e.rule === 'fields' && /concetti/.test(e.msg)));
  assert.equal(rules(await run([c, obiettivo('o', 'peso: nucleo\nconcetti: []\n')]), 'obiettivo').length, 1);
  assert.equal(rules(await run([c, obiettivo('o', 'peso: nucleo\nconcetti:\n  - "pianeta"\n')]), 'obiettivo').length, 1, 'a family that does not exist');
  assert.equal(rules(await run([c, obiettivo('o', 'peso: nucleo\nconcetti:\n  - "numero"\n')]), 'obiettivo').length, 0);
});

test('lore check: sta_in must point to a luogo, arriva_da to a fatto, la_da and si_impara_da to a persona', async () => {
  const luogo = ['storia/luoghi/l.md', '---\ntipo: luogo\nnome: "L"\nid: "x"\ncosa_e: []\nchi_ci_vive: []\natmosfera: []\nsi_apre_con: []\naperto: ""\n---\n\nt\n'];
  const ok = await run([concetto('numero-x', 'peso: nucleo\nsta_in: "[[l]]"\n'), luogo]);
  assert.equal(rules(ok, 'concetto').length, 0);
  const notLuogo = await run([concetto('numero-x', 'peso: nucleo\nsta_in: "[[numero-y]]"\n'), concetto('numero-y', 'peso: nucleo\n')]);
  assert.equal(rules(notLuogo, 'concetto').length, 1);
  assert.match(rules(notLuogo, 'concetto')[0].msg, /not a luogo/);
  const broken = await run([concetto('numero-x', 'peso: nucleo\nsi_impara_da: "[[nessuna]]"\n')]);
  assert.ok(rules(broken, 'concetto').length >= 1);
});

test('lore check: a family that is neither of the circle nor listed outside it is an error; a circle concept needs its circle fields', async () => {
  assert.equal(rules(await run([concetto('boh-x', 'peso: nucleo\n', 'boh')]), 'concetto').length, 1);
  const thin = await run([concetto('erba-x', 'peso: contorno\n', 'erba')]);
  assert.ok(thin.errors.some((e) => e.rule === 'fields' && /circle/.test(e.msg)));
  assert.equal(rules(await run([['corso/concetti/numero-x.md', '---\ntipo: concetto\nnome: "X"\nfamiglia: numero\npeso: nucleo\nin_breve: ""\nfonte: copione\n---\n\nt\n']]), 'concetto').length, 1, 'nucleus without in_breve');
});
