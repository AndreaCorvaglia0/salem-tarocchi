// The laws and the two faces (lore/metodo/leggi/, docs/MANIFESTO.md; spec: notes/vault/V2-spec.md): the eleven
// law cards exist, every principio, tecnica and ricetta hangs from one, every meccanica has its dynamic, its
// laws and its two faces, the generated page lists every dynamic, and the new rules of `lore check` catch
// what they should on small made-up vaults.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadStory, ROOT } from '../scripts/lore/story.mjs';
import { loadVault, vaultOf, docOf, linkTarget } from '../scripts/lore/vault.mjs';
import { check } from '../scripts/lore/check.mjs';
import { generate } from '../scripts/lore/gen.mjs';
import { DINAMICHE, DINAMICA_IDS } from '../scripts/lore/dinamiche.mjs';

const LAWS = ['legge-poche-cose-verificate', 'legge-sempre-un-motivo', 'legge-si-vede-e-si-tocca', 'legge-da-molti-lati', 'legge-il-concetto-e-una-chiave',
  'legge-il-mondo-e-la-memoria', 'legge-e-lei-a-decidere', 'legge-poco-ogni-giorno', 'legge-si-entra-piano', 'legge-strati-indipendenti', 'legge-chiaro-vero-curato'];
const README = readFileSync(join(ROOT, 'lore', 'README.md'), 'utf8');
let S = null;
const story = async () => (S ||= await loadStory());
const words = (s) => String(s).trim().split(/\s+/).length;
const asList = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);

test('the eleven law cards exist, numbered 1 to 11, with their fields', () => {
  const V = loadVault();
  for (const [i, name] of LAWS.entries()) {
    assert.ok(existsSync(join(ROOT, 'lore', 'metodo', 'leggi', `${name}.md`)), name);
    const d = V.get(name);
    assert.equal(d.data.tipo, 'legge', name);
    assert.equal(d.data.numero, i + 1, name);
    assert.ok(['che-cosa', 'come', 'com-e-costruito'].includes(d.data.gruppo), name);
    for (const f of ['nome', 'in_breve', 'perche', 'si_rompe_se', 'lezioni', 'fonte']) assert.ok(String(d.data[f] || '').length > 3, `${name}: ${f}`);
    assert.ok(!/\n/.test(d.data.in_breve), `${name}: in_breve is one line`);
  }
  assert.equal(V.ofTipo('legge').length, 11);
});

test('every law has at least one card pointing to it; every principio, tecnica and ricetta has a legge', () => {
  const V = loadVault();
  const hit = new Map(LAWS.map((l) => [l, 0]));
  for (const tipo of ['principio', 'tecnica', 'ricetta']) for (const d of V.ofTipo(tipo)) {
    assert.ok(LAWS.includes(linkTarget(d.data.legge)), `${d.rel}: legge`);
    hit.set(linkTarget(d.data.legge), hit.get(linkTarget(d.data.legge)) + 1);
    if (d.data.anche) { assert.ok(LAWS.includes(linkTarget(d.data.anche)), `${d.rel}: anche`); hit.set(linkTarget(d.data.anche), hit.get(linkTarget(d.data.anche)) + 1); }
  }
  for (const d of V.ofTipo('meccanica')) for (const x of asList(d.data.leggi)) hit.set(linkTarget(x), (hit.get(linkTarget(x)) || 0) + 1);
  for (const [l, n] of hit) assert.ok(n >= 1, `${l} has no card`);
  // the laws about learning rest on at least one technique
  const tec = new Set(V.ofTipo('tecnica').flatMap((d) => [linkTarget(d.data.legge), linkTarget(d.data.anche)]));
  for (const l of LAWS.slice(0, 9)) assert.ok(tec.has(l), `${l} has no tecnica`);
});

test('every meccanica has its dynamic, its laws and its two faces, each in its own words', () => {
  const V = loadVault();
  const mecc = V.ofTipo('meccanica');
  assert.ok(mecc.length >= 39, `${mecc.length} meccaniche`);
  const seen = { motivo: new Set(), effetto: new Set() };
  for (const d of mecc) {
    assert.ok(DINAMICA_IDS.includes(d.data.dinamica), `${d.rel}: dinamica ${d.data.dinamica}`);
    const ls = asList(d.data.leggi);
    assert.ok(ls.length >= 1 && ls.every((x) => LAWS.includes(linkTarget(x))), `${d.rel}: leggi`);
    for (const f of ['motivo', 'effetto']) {
      const v = String(d.data[f] || '').trim();
      assert.ok(v.length > 10, `${d.rel}: ${f} is empty`);
      assert.ok(words(v) <= 20, `${d.rel}: ${f} has ${words(v)} words`);
      assert.ok(!seen[f].has(v.toLowerCase()), `${d.rel}: ${f} repeated`);
      seen[f].add(v.toLowerCase());
    }
  }
});

test('the dynamics page: all seventeen dynamics and every meccanica, generated and up to date', async () => {
  assert.equal(DINAMICHE.length, 17);
  const pages = generate(await story(), loadVault());
  const text = pages.get('metodo/meccaniche/_dinamiche.md');
  assert.ok(text, 'the page is generated');
  assert.equal(readFileSync(join(ROOT, 'lore', 'metodo', 'meccaniche', '_dinamiche.md'), 'utf8'), text, 'the file on disk is up to date: run `node scripts/lore.mjs gen`');
  for (const D of DINAMICHE) assert.ok(text.includes(`## ${D.nome}`), D.id);
  const V = loadVault();
  for (const d of V.ofTipo('meccanica')) assert.ok(text.includes(`[[${d.name}]]`), `${d.name} is on the page`);
  assert.ok(!text.includes('Nessuna meccanica'), 'every dynamic has at least one meccanica');
  for (const D of DINAMICHE) assert.ok(V.ofTipo('meccanica').some((d) => d.data.dinamica === D.id), `${D.id} has a meccanica`);
});

test('the README table lists the new fields', () => {
  for (const f of ['`dinamica`', '`leggi`', '`motivo`', '`effetto`', '`numero`', '`lezioni`']) assert.ok(README.includes(f), f);
  assert.ok(README.includes('`legge` (la legge da cui pende'));
});

// ---- the new rules on small made-up vaults -------------------------------------------------------------
const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${Array.isArray(v) ? `\n${v.map((x) => `  - ${x}`).join('\n')}` : v}`).join('\n').replace(/: \n/g, ':\n')}\n---\nTesto.\n`;
const mini = (files) => vaultOf(Object.entries(files).map(([rel, text]) => docOf(rel, text)), README);
const legge = (n, extra = {}) => fm({ tipo: '"legge"', nome: '"x"', ambito: '"generale"', numero: n, gruppo: '"come"', in_breve: '"x"', perche: '"x"', si_rompe_se: '"x"', lezioni: '"1"', fonte: '"deciso"', ...extra });
const principio = (extra = {}) => fm({ tipo: '"principio"', nome: '"p"', ambito: '"generale"', legge: '"[[legge-uno]]"', in_breve: '"x"', perche: '"x"', fonte: '"x"', si_rompe_se: '"x"', ...extra });
const tecnica = (extra = {}) => fm({ tipo: '"tecnica"', nome: '"t"', ambito: '"generale"', legge: '"[[legge-uno]]"', in_breve: '"x"', come_funziona: '"x"', fonte: '"x"', dove_manca: '"x"', ...extra });
const mecc = (extra = {}) => fm({ tipo: '"meccanica"', nome: '"m"', ambito: '"salem"', dinamica: '"trovare"', leggi: ['"[[legge-uno]]"'], motivo: '"un motivo"', effetto: '"un effetto"', fonte: '""', dove: '""', cosa_fa_la_giocatrice: '""', serve: ['"[[p-uno]]"'], concetti: '[]', insegna: '[]', tecniche: '[]', ragione_nel_gioco: '""', premio: '""', rischio: '""', tratti: '[]', aperto: '', ...extra });
const base = { 'metodo/leggi/legge-uno.md': legge(1), 'metodo/leggi/legge-strati-indipendenti.md': legge(10), 'metodo/leggi/legge-chiaro-vero-curato.md': legge(11), 'metodo/principi/p-uno.md': principio(), 'metodo/tecniche/t-uno.md': tecnica() };
const run = async (files) => check(mini({ ...base, ...files }), await story());
const by = (r, rule) => r.errors.filter((e) => e.rule === rule).map((e) => e.file);

test('check: a well-formed little vault has no errors and no warnings about laws', async () => {
  const r = await run({ 'metodo/meccaniche/m-ok.md': mecc() });
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings.filter((w) => w.rule === 'legge'), []);
});
test('check: a meccanica without motivo, effetto, dinamica or leggi is an error', async () => {
  const gone = (k) => mecc().split('\n').filter((l) => !l.startsWith(`${k}:`) && !(k === 'leggi' && l.startsWith('  - "[[legge-uno]]"'))).join('\n');
  const r = await run({ 'metodo/meccaniche/m-a.md': gone('motivo'), 'metodo/meccaniche/m-b.md': gone('effetto'), 'metodo/meccaniche/m-c.md': gone('dinamica'), 'metodo/meccaniche/m-d.md': gone('leggi'),
    'metodo/meccaniche/m-e.md': mecc({ motivo: '""' }), 'metodo/meccaniche/m-f.md': mecc({ effetto: '""' }), 'metodo/meccaniche/m-g.md': mecc({ dinamica: '"inventata"' }), 'metodo/meccaniche/m-h.md': mecc({ leggi: '[]' }) });
  const bad = (f) => r.errors.filter((e) => e.file.includes(f)).length;
  for (const f of ['m-a', 'm-b', 'm-c', 'm-d', 'm-e', 'm-f', 'm-g', 'm-h']) assert.ok(bad(f) >= 1, `${f} is an error`);
  assert.deepEqual(by(r, 'meccanica.dinamica'), ['metodo/meccaniche/m-g.md']);
  assert.deepEqual(by(r, 'meccanica.motivo'), ['metodo/meccaniche/m-e.md']);
  assert.deepEqual(by(r, 'meccanica.effetto'), ['metodo/meccaniche/m-f.md']);
  assert.deepEqual(by(r, 'meccanica.leggi'), ['metodo/meccaniche/m-h.md']);
});
test('check: a legge that does not exist, or is not a legge, is an error (principio, tecnica, ricetta, meccanica)', async () => {
  const r = await run({ 'metodo/principi/p-due.md': principio({ legge: '"[[legge-che-non-c-e]]"' }), 'metodo/principi/p-tre.md': principio({ legge: '"[[p-uno]]"' }), 'metodo/tecniche/t-due.md': tecnica({ anche: '"[[legge-che-non-c-e]]"' }),
    'metodo/meccaniche/m-x.md': mecc({ leggi: ['"[[legge-che-non-c-e]]"'] }) });
  assert.deepEqual(by(r, 'legge').sort(), ['metodo/meccaniche/m-x.md', 'metodo/principi/p-due.md', 'metodo/principi/p-tre.md', 'metodo/tecniche/t-due.md']);
});
test('check: a principio, tecnica or ricetta without a legge is an error', async () => {
  const no = (t) => t.split('\n').filter((l) => !l.startsWith('legge:')).join('\n');
  const ric = fm({ tipo: '"ricetta"', nome: '"r"', famiglia: '"imparare"', ambito: '"generale"', problema: '"x"', soluzione: '"x"', in_salem: '[]', si_controlla_con: '"x"', rischi: '"x"', fonte: '"x"' });
  const r = await run({ 'metodo/principi/p-senza.md': no(principio()), 'metodo/tecniche/t-senza.md': no(tecnica()), 'metodo/ricette/r-senza.md': ric });
  assert.deepEqual(r.errors.filter((e) => e.rule === 'fields').map((e) => e.file).sort(), ['metodo/principi/p-senza.md', 'metodo/ricette/r-senza.md', 'metodo/tecniche/t-senza.md']);
});
test('check: a legge with no tecnica is a warning, except 10 and 11', async () => {
  const r = check(mini({ 'metodo/leggi/legge-uno.md': legge(1), 'metodo/leggi/legge-due.md': legge(2), 'metodo/leggi/legge-strati-indipendenti.md': legge(10), 'metodo/leggi/legge-chiaro-vero-curato.md': legge(11), 'metodo/tecniche/t-uno.md': tecnica() }), await story());
  assert.deepEqual(r.warnings.filter((w) => w.rule === 'legge').map((w) => w.file), ['metodo/leggi/legge-due.md']);
});
test('check: two meccaniche with the same motivo are a warning, a motivo over 20 words too', async () => {
  const long = Array.from({ length: 21 }, (_, i) => `p${i}`).join(' ');
  const r = await run({ 'metodo/meccaniche/m-uno.md': mecc(), 'metodo/meccaniche/m-due.md': mecc(), 'metodo/meccaniche/m-lunga.md': mecc({ motivo: `"${long}"`, effetto: '"altro effetto"' }) });
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => w.rule === 'meccanica.motivo' && w.file.includes('m-due')), 'repeated motivo');
  assert.ok(r.warnings.some((w) => w.rule === 'meccanica.motivo' && w.file.includes('m-lunga')), 'long motivo');
});
