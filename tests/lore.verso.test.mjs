// Vault step V4 (spec notes/vault/V4-spec.md): every link is written once (the fields that were the reverse of
// another are gone, the reverse is computed), every card of the method has its `ambito`, every meccanica says
// which families of the course it touches (`concetti`) and the six voices are computed from there.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadStory, ROOT } from '../scripts/lore/story.mjs';
import { loadVault, vaultOf, docOf, linkTarget, readTable } from '../scripts/lore/vault.mjs';
import { check } from '../scripts/lore/check.mjs';
import { corsoModel } from '../scripts/lore/corso.mjs';
import { AMBITI, salemIn } from '../scripts/lore/ambito.mjs';

const V = loadVault();
const README = readFileSync(join(ROOT, 'lore', 'README.md'), 'utf8');
const asList = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);
const names = (v) => asList(v).map(linkTarget).filter(Boolean);
let S = null;
const story = async () => (S ||= await loadStory());

test('the two reverse fields are gone: from every card and from the README table', () => {
  assert.ok(V.ofTipo('tecnica').length >= 20);
  for (const d of V.ofTipo('tecnica')) assert.ok(!('dove_la_usiamo' in d.data), `${d.rel} still has dove_la_usiamo`);
  for (const d of V.ofTipo('obiettivo')) assert.ok(!('meccaniche' in d.data), `${d.rel} still has meccaniche`);
  const T = readTable(README);
  assert.ok(!T.tecnica.fields.includes('dove_la_usiamo') && T.tecnica.fields.includes('dove_manca'));
  assert.ok(!T.obiettivo.fields.includes('meccaniche') && T.obiettivo.fields.includes('aperto'));
});

test('the computed reverse covers everything the removed fields said', () => {
  // the lists of two cards as they were before the removal, and the sizes of both fields (115 and 59 pairs)
  const tecniche = new Map(), obiettivi = new Map();
  for (const m of V.ofTipo('meccanica')) {
    for (const t of names(m.data.tecniche)) tecniche.set(t, [...(tecniche.get(t) || []), m.name]);
    for (const o of names(m.data.insegna)) obiettivi.set(o, [...(obiettivi.get(o) || []), m.name]);
  }
  const before = {
    t: ['seguire-le-lezioni', 'superare-l-esame', 'riprendere-le-carte-sequestrate', 'leggere-ai-clienti', 'leggere-per-strada', 'leggere-col-mazzo-vero', 'rispondere-a-memoria', 'ripassare', 'studiare-in-biblioteca', 'chiedere-alle-carte', 'aprire-i-sigilli', 'imparare-da-ortica', 'girare-la-carta-di-oggi', 'leggere-per-se', 'farsi-leggere-dalla-lettrice'],
    o: ['trovare-una-carta', 'superare-l-esame', 'riprendere-le-carte-sequestrate', 'girare-la-carta-di-oggi', 'rispondere-a-memoria', 'ripassare', 'aprire-i-sigilli', 'farsi-leggere-dalla-lettrice'],
  };
  for (const m of before.t) assert.ok(tecniche.get('pratica-di-recupero').includes(m), `pratica-di-recupero / ${m}`);
  for (const m of before.o) assert.ok(obiettivi.get('riconoscere-una-carta').includes(m), `riconoscere-una-carta / ${m}`);
  const nT = [...tecniche.values()].flat().length, nO = [...obiettivi.values()].flat().length;
  assert.ok(nT >= 115, `${nT} technique pairs (115 before)`);
  assert.ok(nO >= 59, `${nO} goal pairs (59 before)`);
  // the pairs that only the removed fields... were not lost: they were all in `tecniche` / `insegna` already
  for (const o of V.ofTipo('obiettivo')) assert.ok(obiettivi.has(o.name) || String(o.data.aperto ?? '').trim(), `${o.name} is taught by a meccanica or says why not`);
});

test('every card of the method has its ambito; Salem is the mechanics and five principles', () => {
  const metodo = V.docs.filter((d) => d.zone === 'metodo' && !d.index);
  assert.ok(metodo.length > 120);
  for (const d of metodo) assert.ok(AMBITI.includes(d.data.ambito), `${d.rel}: ambito ${d.data.ambito}`);
  const SALEM_PRINCIPI = ['alla-fine-il-suo-mazzo', 'erbe-come-storia', 'la-lettrice-legge-lei', 'le-carte-servono-a-muoversi', 'leggere-e-l-attivita-vera'];
  for (const d of V.ofTipo('legge')) assert.equal(d.data.ambito, 'generale', d.rel);
  for (const d of V.ofTipo('tecnica')) assert.equal(d.data.ambito, 'generale', d.rel);
  for (const d of V.ofTipo('meccanica')) assert.equal(d.data.ambito, 'salem', d.rel);
  for (const d of V.ofTipo('principio')) assert.equal(d.data.ambito, SALEM_PRINCIPI.includes(d.name) ? 'salem' : 'generale', d.rel);
});

test('every meccanica has `concetti`, only with families that exist', () => {
  const families = new Set(V.ofTipo('concetto').map((d) => d.data.famiglia));
  const meccs = V.ofTipo('meccanica');
  assert.ok(meccs.length >= 39);
  for (const d of meccs) {
    assert.ok(Array.isArray(d.data.concetti), `${d.rel}: concetti must be a list (empty is fine)`);
    for (const c of d.data.concetti) assert.ok(families.has(c), `${d.rel}: "${c}" is not a family`);
  }
  assert.ok(readTable(README).meccanica.fields.includes('concetti'));
});

test('the six voices come from `concetti`: no more herbs as the body of the spreads', () => {
  const M = corsoModel(V);
  const by = Object.fromEntries(M.fams.map((f) => [f.famiglia, f]));
  for (const v of ['corpo', 'motivo', 'uso', 'ritorno']) {
    assert.ok(!by.stesa[v].includes('coltivare-le-erbe-con-ortica'), `stesa ${v}`);
    for (const f of M.fams) for (const m of f[v]) assert.ok(V.get(m).data.concetti.includes(f.famiglia), `${f.famiglia} ${v}: ${m} does not declare it`);
  }
  assert.ok(by.erba.corpo.includes('coltivare-le-erbe-con-ortica'), 'the herbs keep their own');
  assert.ok(M.meccSenzaConcetti.includes('annotare-i-luoghi') && M.meccSenzaConcetti.includes('salire-di-rango'));
  assert.ok(!M.meccSenzaConcetti.includes('ripassare'));
});

// ---- the rules on small made-up vaults ---------------------------------------------------------------
const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${Array.isArray(v) ? `\n${v.map((x) => `  - ${x}`).join('\n')}` : v}`).join('\n').replace(/: \n/g, ':\n')}\n---\n`;
const mini = (files) => vaultOf(Object.entries(files).map(([rel, text]) => docOf(rel, text)), README);
const legge = fm({ tipo: '"legge"', nome: '"x"', ambito: '"generale"', numero: 1, gruppo: '"come"', in_breve: '"x"', perche: '"x"', si_rompe_se: '"x"', lezioni: '"1"', fonte: '"deciso"' });
const tecnica = (o = {}, body = 'Testo.') => fm({ tipo: '"tecnica"', nome: '"t"', ambito: '"generale"', legge: '"[[legge-x]]"', in_breve: '"x"', come_funziona: '"x"', fonte: '"x"', dove_manca: '"x"', ...o }) + body + '\n';
const persona = fm({ tipo: '"persona"', nome: '"p"', id: '"malva"' });
const base = { 'metodo/leggi/legge-x.md': legge, 'metodo/leggi/legge-strati-indipendenti.md': legge, 'metodo/leggi/legge-chiaro-vero-curato.md': legge };
const run = async (files) => check(mini({ ...base, ...files }), await story());

test('ambito: a general card that links to Salem or names it is a warning, never an error', async () => {
  const r = await run({
    'storia/persone/malva.md': persona,
    'metodo/tecniche/t-pulita.md': tecnica({}, 'Una cosa vera in ogni gioco.'),
    'metodo/tecniche/t-link.md': tecnica({}, 'Come fa [[malva]].'),
    'metodo/tecniche/t-parole.md': tecnica({ in_breve: '"A Salem lo fa Ortica"' }),
    'metodo/tecniche/t-in-salem.md': tecnica({ dove_manca: '"Salem e Tartufo non lo usano"', aperto: '"Malva"' }),
  });
  assert.deepEqual(r.errors.filter((e) => e.rule === 'ambito'), []);
  const w = r.warnings.filter((x) => x.rule === 'ambito').map((x) => x.file).sort();
  assert.deepEqual(w, ['metodo/tecniche/t-link.md', 'metodo/tecniche/t-parole.md']);
  assert.match(r.warnings.find((x) => x.file.endsWith('t-parole.md') && x.rule === 'ambito').msg, /Salem x1.*Ortica x1|Ortica x1.*Salem x1/);
  assert.equal(r.stats.ambito.conSalem, 2);
  assert.equal(r.stats.ambito.generali, 7, 'the four techniques and the three laws');
});
test('ambito: a salem card may say anything; a wrong value is an error; a link to a salem card counts', async () => {
  const mecc = fm({ tipo: '"meccanica"', nome: '"m"', ambito: '"salem"' });
  const r = await run({ 'metodo/meccaniche/m-uno.md': mecc, 'metodo/tecniche/t-link.md': tecnica({}, 'Si vede in [[m-uno]].'), 'metodo/tecniche/t-storta.md': tecnica({ ambito: '"mondiale"' }) });
  assert.deepEqual(r.errors.filter((e) => e.rule === 'ambito').map((e) => e.file), ['metodo/tecniche/t-storta.md']);
  assert.deepEqual(r.warnings.filter((x) => x.rule === 'ambito').map((x) => x.file), ['metodo/tecniche/t-link.md']);
});
test('meccanica.concetti: a family that does not exist is an error', async () => {
  const concetto = fm({ tipo: '"concetto"', nome: '"x"', famiglia: 'storia', peso: '"contorno"', in_breve: '"x"', fonte: '"ricerca"' });
  const mecc = (c) => fm({ tipo: '"meccanica"', nome: '"m"', ambito: '"salem"', concetti: c });
  const r = await run({ 'corso/concetti/storia-x.md': concetto, 'metodo/meccaniche/m-ok.md': mecc(['"storia"']), 'metodo/meccaniche/m-vuota.md': mecc('[]'), 'metodo/meccaniche/m-storta.md': mecc(['"magia"']) });
  assert.deepEqual(r.errors.filter((e) => e.rule === 'meccanica.concetti').map((e) => e.file), ['metodo/meccaniche/m-storta.md']);
});

test('on the real vault: the avvisi of the ambito are the count that `lore check` says', async () => {
  const r = check(V, await story());
  assert.deepEqual(r.errors, []);
  const w = r.warnings.filter((x) => x.rule === 'ambito');
  assert.equal(w.length, r.stats.ambito.conSalem);
  assert.ok(r.stats.ambito.generali > r.stats.ambito.conSalem && r.stats.ambito.salem >= 39 + 5);
  assert.equal(r.stats.ambito.peggiori.length, 5);
  // the helper agrees with the warning: a card with nothing to say has no entry
  const clean = V.docs.find((d) => d.data?.ambito === 'generale' && !w.some((x) => x.file === d.rel));
  assert.ok(clean);
  const s = salemIn(V, clean);
  assert.deepEqual([s.links, s.words], [[], {}]);
});
