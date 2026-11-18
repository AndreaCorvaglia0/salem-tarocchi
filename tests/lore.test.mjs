// The lore tools (docs/TOOLS.md): the frontmatter reader, the linter on the real vault (no errors), the
// linter on small made-up vaults (each rule catches what it should), and the generated pages up to date.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from '../scripts/lore/frontmatter.mjs';
import { loadStory, ROOT } from '../scripts/lore/story.mjs';
import { loadVault, vaultOf, docOf, readTable } from '../scripts/lore/vault.mjs';
import { check, continuity, parseFactFlags, parseSceneRefs } from '../scripts/lore/check.mjs';
import { generate } from '../scripts/lore/gen.mjs';
import { diffGenerated } from '../scripts/lore.mjs';

const README = readFileSync(join(ROOT, 'lore', 'README.md'), 'utf8');
let S = null;
const story = async () => (S ||= await loadStory());

// ---- the frontmatter reader ---------------------------------------------------------------------------
test('frontmatter: scalars, quotes, numbers, empty values', () => {
  const r = parse('---\ntipo: "fatto"\nnome: \'L\'\'arrivo\'\nquando: 270\nfonte: copione\naperto:\nvuoto: []\nsi: true\n---\nTesto.\n');
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.data, { tipo: 'fatto', nome: "L'arrivo", quando: 270, fonte: 'copione', aperto: null, vuoto: [], si: true });
  assert.equal(r.body.trim(), 'Testo.');
});
test('frontmatter: lists of strings and of one-line objects, commas and braces inside quotes', () => {
  const r = parse([
    '---', 'arco:', '  - "[[a]]"', '  - "[[b]]"', 'legami:',
    '  - { con: "[[x]]", prova: "Dice «no, mai}» e ride", fonte: copione }',
    '  - { t: "virgolette \\"dentro\\"", n: 3, l: ["a", b] }', '---', '',
  ].join('\n'));
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.data.arco, ['[[a]]', '[[b]]']);
  assert.deepEqual(r.data.legami[0], { con: '[[x]]', prova: 'Dice «no, mai}» e ride', fonte: 'copione' });
  assert.deepEqual(r.data.legami[1], { t: 'virgolette "dentro"', n: 3, l: ['a', 'b'] });
});
test('frontmatter: what it cannot read is an error with its line, never a guess', () => {
  const r = parse('---\ntipo: "x"\n  - orfano\nnome: "aperto\nk: { a: "x" b: 1 }\ntipo: "y"\n---\n');
  const lines = r.errors.map((e) => e.line);
  assert.ok(lines.includes(4), 'unterminated string');
  assert.ok(lines.includes(5), 'missing comma in object');
  assert.ok(lines.includes(6), 'duplicate key');
  assert.equal(parse('niente testa').data, null);
});
test('the README table gives the fields of each tipo', () => {
  const T = readTable(README);
  for (const t of ['persona', 'luogo', 'fatto', 'principio', 'meccanica', 'tecnica', 'obiettivo', 'tratto', 'scelta', 'finale']) assert.ok(T[t], t);
  assert.ok(T.fatto.fields.includes('chi_lo_sa') && T.fatto.fields.includes('quando'));
  assert.ok(!T.persona.fields.includes('con'), 'names inside { } are examples, not fields');
  assert.ok(T.meccanica.fields.includes('fonte'));
});
test('the flag field of a fatto and scene references are read clause by clause', () => {
  const p = parseFactFlags('step c1.malva → c1.read; flag malva.wood / malva.cheeky (una delle due); visit (story/visit.js; flag rd.<id>)');
  assert.deepEqual(p.steps, ['c1.malva', 'c1.read']);
  assert.deepEqual(p.flags, ['malva.wood', 'malva.cheeky']);
  assert.equal(p.unchecked.length, 1);
  assert.deepEqual(parseSceneRefs('c1.js#c1.malva, c1.read; systems/exam.js'), [{ file: 'c1.js', id: 'c1.malva' }, { file: 'c1.js', id: 'c1.read' }]);
});

// ---- the linter on the real vault ---------------------------------------------------------------------
test('lore check: the vault has no errors (warnings are in notes/tools.md)', async () => {
  const r = check(loadVault(), await story());
  assert.deepEqual(r.errors.map((e) => `${e.rule} ${e.file}: ${e.msg}`), []);
  assert.ok(r.stats.links > 500, 'links were checked');
  assert.ok(r.stats.continuity.checked > 20, 'continuity checked some claims');
});

// ---- each rule on a small made-up vault ----------------------------------------------------------------
const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${Array.isArray(v) ? `\n${v.map((x) => `  - ${x}`).join('\n')}` : v}`).join('\n').replace(/: \n/g, ':\n')}\n---\nTesto.\n`;
const fatto = (extra = {}) => fm({ tipo: '"fatto"', nome: '"x"', flag: '""', capitolo: 1, quando: 1, scena: '""', chi_c_e: '[]', chi_lo_sa: '[]', conseguenze: '[]', rami: '[]', aperto: '', ...extra });
const persona = (extra = {}) => fm({ tipo: '"persona"', nome: '"x"', id: '""', ruolo: '[]', vuole: '[]', teme: '[]', nasconde: '[]', voce: '[]', tic: '[]', incontro: '""', arco: '[]', legami: '[]', sa: '[]', luoghi: '[]', carte: '[]', aperto: '', ...extra });
const mini = (files) => vaultOf(Object.entries(files).map(([rel, text]) => docOf(rel, text)), README);
const rules = (r) => r.errors.map((e) => e.rule);

test('rules: missing tipo, missing fields, wrong folder, bad and duplicate names, broken links', async () => {
  const V = mini({
    'storia/fatti/senza-tipo.md': '---\nnome: "x"\n---\n',
    'storia/fatti/a-meta.md': '---\ntipo: "fatto"\nnome: "x"\n---\n',
    'storia/luoghi/fuori-posto.md': fatto(),
    'storia/fatti/Città.md': fatto(),
    'storia/fatti/doppio.md': fatto(), 'storia/luoghi/doppio.md': '---\ntipo: "luogo"\nnome: "x"\nid: ""\ncosa_e: ""\nchi_ci_vive: []\natmosfera: ""\nsi_apre_con: ""\naperto:\n---\n',
    'storia/fatti/link.md': fatto({ conseguenze: ['"[[non-esiste]]"'] }),
    'storia/fatti/_indice-fatti.md': 'Un indice senza testa: [[link]].\n',
  });
  const r = check(V, await story());
  const by = (f) => r.errors.filter((e) => e.file.includes(f)).map((e) => e.rule);
  assert.deepEqual(by('senza-tipo'), ['tipo']);
  assert.deepEqual(by('a-meta'), ['fields']);
  assert.deepEqual(by('fuori-posto'), ['tipo']);
  assert.ok(by('Città').includes('name'));
  assert.ok(r.errors.some((e) => e.rule === 'name' && /not unique/.test(e.msg)));
  assert.deepEqual(by('link.md'), ['link']);
  assert.deepEqual(by('_indice'), []);
});
test('rules: flags, steps and sessions named by a fatto must exist; persona ids must be the code\'s', async () => {
  const V = mini({
    'storia/fatti/buono.md': fatto({ flag: '"step c1.malva → c1.read; flag malva.wood / malva.cheeky; session s1"' }),
    'storia/fatti/cattivo.md': fatto({ flag: '"step c9.nowhere; flag no.such.flag; session s9; cast nobody"' }),
    'storia/persone/vera.md': persona({ id: '"malva"' }),
    'storia/persone/inventata.md': persona({ id: '"zia.rosa"' }),
  });
  const r = check(V, await story());
  assert.deepEqual(r.errors.filter((e) => e.file.includes('buono') || e.file.includes('vera')), []);
  assert.deepEqual(r.errors.filter((e) => e.file.includes('cattivo')).map((e) => e.rule).sort(), ['fatto.cast', 'fatto.flag', 'fatto.session', 'fatto.step']);
  assert.deepEqual(r.errors.filter((e) => e.file.includes('inventata')).map((e) => e.rule), ['persona.id']);
});
test('rules: meccaniche serve principi, obiettivi have meccaniche or say what is open', async () => {
  const mecc = (serve) => fm({ tipo: '"meccanica"', nome: '"m"', fonte: '""', dove: '""', cosa_fa_la_giocatrice: '""', serve, insegna: '[]', tecniche: '[]', ragione_nel_gioco: '""', premio: '""', rischio: '""', tratti: '[]', aperto: '' });
  const ob = (m, a) => fm({ tipo: '"obiettivo"', nome: '"o"', sa_fare: '""', si_vede_da: '""', meccaniche: m, aperto: a });
  const pr = fm({ tipo: '"principio"', nome: '"p"', in_breve: '""', perche: '""', fonte: '""', si_rompe_se: '""' });
  const V = mini({ 'metodo/principi/p-uno.md': pr, 'metodo/principi/p-due.md': pr, 'metodo/meccaniche/m-ok.md': mecc(['"[[p-uno]]"']), 'metodo/meccaniche/m-vuota.md': mecc('[]'),
    'corso/obiettivi/o-ok.md': ob('[]', ['"manca tutto"']), 'corso/obiettivi/o-vuoto.md': ob('[]', '') });
  const r = check(V, await story());
  assert.deepEqual(rules(r).sort(), ['meccanica.serve', 'obiettivo']);
  assert.ok(r.warnings.some((w) => w.rule === 'principio' && w.file.includes('p-due')));
});
test('continuity: knowing a fact from a scene that plays before it is an error; after it, or guarded, is fine', async () => {
  const arrest = fatto({ nome: '"arresto"', flag: '"step c2.home; flag arrest.front / arrest.hid, ginepra.taken"', scena: '"c2.js#c2.arrest"' });
  const make = (da, come) => mini({
    'storia/fatti/arresto.md': arrest,
    'storia/fatti/prima.md': fatto({ scena: '"c1.js#c1.malva"' }),
    'storia/fatti/dopo.md': fatto({ scena: '"c3.js#c3.edera"' }),
    'storia/persone/chi.md': persona({ sa: [`{ fatto: "[[arresto]]", da: "[[${da}]]", come: "${come}" }`] }),
  });
  const S1 = await story();
  assert.equal(continuity(make('prima', ''), S1).violations.length, 1, 'Malva\'s welcome plays long before the arrest');
  assert.equal(continuity(make('dopo', ''), S1).violations.length, 0, 'Edera\'s nook comes after the arrest');
  assert.equal(continuity(make('arresto', ''), S1).violations.length, 0, 'the fact\'s own scene');
  // chi_lo_sa with a scene written in `come`
  const V = mini({ 'storia/fatti/arresto.md': fatto({ nome: '"arresto"', flag: '"step c2.home; flag ginepra.taken"', scena: '"c2.js#c2.arrest"', chi_lo_sa: ['{ chi: "[[chi]]", come: "lo dice (c1.js#c1.read)." }'] }), 'storia/persone/chi.md': persona() });
  assert.equal(continuity(V, S1).violations.length, 1);
});

// ---- the generated pages ------------------------------------------------------------------------------
test('lore gen: lore/storia/generati/tratti, lore/storia/generati/scelte, lore/storia/generati/finali are up to date (run `node scripts/lore.mjs gen`)', async () => {
  const pages = generate(await story(), loadVault());
  assert.ok(pages.size > 100);
  const diff = diffGenerated(pages);
  assert.deepEqual(diff.map((d) => `${d.path}: ${d.why}`), []);
});
test('lore gen: every choice of the scripts, sessions and visits has a page with a class', async () => {
  const S1 = await story();
  const pages = generate(S1, loadVault());
  const scelte = [...pages.keys()].filter((k) => k.startsWith('storia/generati/scelte/') && !k.includes('_indice'));
  assert.equal(scelte.length, S1.choices.length);
  for (const k of scelte) {
    const r = parse(pages.get(k));
    assert.deepEqual(r.errors, [], k);
    assert.ok(['stabilisce', 'mette_alla_prova', 'entrambe', 'colore'].includes(r.data.classe), k);
    assert.ok(r.data.opzioni.length >= 1, k);
  }
});
