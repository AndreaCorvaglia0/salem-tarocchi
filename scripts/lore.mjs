// The lore tools (docs/TOOLS.md): the vault in lore/ kept consistent with itself and with the story data.
//   node scripts/lore.mjs check         the linter: errors exit 1; errors and warnings go to notes/tools.md
//   node scripts/lore.mjs gen           write lore/storia/generati/tratti/, lore/storia/generati/scelte/, lore/storia/generati/finali/ from the story data
//   node scripts/lore.mjs gen --check   exit 1 when those folders are out of date (used by the tests)
//   node scripts/lore.mjs sapere        write src/data/sapere.js and the tables of lore/corso/concetti/_il-cerchio.md
//   node scripts/lore.mjs sapere --check  exit 1 when either is out of step with lore/corso/concetti/
// The pieces live in scripts/lore/: frontmatter.mjs (the reader), story.mjs (the story walked once),
// vault.mjs (the vault on disk), check.mjs (the rules), gen.mjs (the generated pages).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadStory, ROOT } from './lore/story.mjs';
import { loadVault, LORE } from './lore/vault.mjs';
import { check } from './lore/check.mjs';
import { generate, GEN_DIRS } from './lore/gen.mjs';
import { readSapere, sapereSource, withTables, circle } from './lore/sapere.mjs';

const NOTES = join(ROOT, 'notes', 'tools.md');
export const SAPERE_JS = join(ROOT, 'src', 'data', 'sapere.js');
export const CIRCLE_MD = join(LORE, 'corso', 'concetti', '_il-cerchio.md');

// what `sapere` would write: [[path, text]]
export function sapereOutputs(vault = loadVault()) {
  const data = readSapere(vault);
  return { data, files: [[SAPERE_JS, sapereSource(data)], [CIRCLE_MD, withTables(readFileSync(CIRCLE_MD, 'utf8'), data)]] };
}

export async function runCheck() {
  const S = await loadStory();
  return check(loadVault(), S);
}

export async function runGen() {
  const S = await loadStory();
  return generate(S, loadVault());
}

// what differs between the generated pages and the files on disk: [{ path, why }]
export function diffGenerated(pages) {
  const out = [];
  for (const [rel, text] of pages) {
    const p = join(LORE, rel);
    if (!existsSync(p)) out.push({ path: rel, why: 'missing' });
    else if (readFileSync(p, 'utf8') !== text) out.push({ path: rel, why: 'changed' });
  }
  for (const d of GEN_DIRS) {
    const dir = join(LORE, d);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) if (f.endsWith('.md') && !pages.has(`${d}/${f}`)) out.push({ path: `${d}/${f}`, why: 'stale (no longer generated)' });
  }
  return out;
}

export function notesText(r) {
  const group = (list) => {
    const m = new Map();
    for (const x of list) { if (!m.has(x.rule)) m.set(x.rule, []); m.get(x.rule).push(x); }
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  };
  const L = ['# Tools: what the lore linter says', '', '_Written by `node scripts/lore.mjs check`: do not edit by hand. What the rules mean: docs/TOOLS.md._', '',
    `Errors: ${r.errors.length}. Warnings: ${r.warnings.length}.`, '',
    `Links checked: ${r.stats.links}. Fact clauses checked: ${r.stats.factTokensChecked} names; ${r.stats.factClausesUnchecked} clauses not understood (not checked).`,
    `${r.stats.ambito.conSalem} schede generali parlano ancora di Salem (su ${r.stats.ambito.generali} generali; ${r.stats.ambito.salem} sono di Salem).`, '',
    `Continuity: ${r.stats.continuity.claims} claims (who knows what), ${r.stats.continuity.checked} placed on the main path and checked, ${r.stats.continuity.guarded} guarded by a test of the fact's flags, ${r.stats.continuity.skipped} not placeable (skipped), ${r.stats.continuity.violations} violations.`, ''];
  for (const [title, list] of [['Errors', r.errors], ['Warnings', r.warnings]]) {
    L.push(`## ${title}`, '');
    if (!list.length) { L.push('None.', ''); continue; }
    for (const [rule, xs] of group(list)) {
      L.push(`### ${rule} (${xs.length})`, '');
      for (const x of xs) L.push(`- \`${x.file}\`: ${x.msg}`);
      L.push('');
    }
  }
  return `${L.join('\n').trimEnd()}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'check') {
    const r = await runCheck();
    for (const e of r.errors) console.error(`error   ${e.rule}  ${e.file}: ${e.msg}`);
    for (const w of r.warnings) console.log(`warning ${w.rule}  ${w.file}: ${w.msg}`);
    mkdirSync(dirname(NOTES), { recursive: true });
    writeFileSync(NOTES, notesText(r));
    console.log(`\n${r.errors.length} errors, ${r.warnings.length} warnings (notes/tools.md). Continuity: ${JSON.stringify(r.stats.continuity)}`);
    console.log(`${r.stats.ambito.conSalem} schede generali parlano ancora di Salem (su ${r.stats.ambito.generali}); le cinque peggiori: ${r.stats.ambito.peggiori.map((x) => `${x.file} (${x.score})`).join(', ')}`);
    process.exit(r.errors.length ? 1 : 0);
  } else if (cmd === 'gen') {
    const pages = await runGen();
    const diff = diffGenerated(pages);
    if (rest.includes('--check')) {
      if (diff.length) { console.error(`lore is out of date (${diff.length} files): run \`node scripts/lore.mjs gen\`\n${diff.slice(0, 20).map((d) => `  ${d.path}: ${d.why}`).join('\n')}`); process.exit(1); }
      console.log(`lore generated pages are up to date (${pages.size} files)`);
    } else {
      for (const d of GEN_DIRS) mkdirSync(join(LORE, d), { recursive: true });
      for (const x of diff) if (x.why.startsWith('stale')) unlinkSync(join(LORE, x.path));
      for (const [rel, text] of pages) writeFileSync(join(LORE, rel), text);
      console.log(`wrote ${pages.size} files in lore/${GEN_DIRS.join(', lore/')} (${diff.length} changed)`);
      console.log(JSON.stringify(pages.summary, null, 1));
    }
  } else if (cmd === 'sapere') {
    const { data, files } = sapereOutputs();
    const stale = files.filter(([p, t]) => !existsSync(p) || readFileSync(p, 'utf8') !== t);
    const { empty } = circle(data);
    if (rest.includes('--check')) {
      if (stale.length) { console.error(`out of step with lore/corso/concetti/: ${stale.map(([p]) => p).join(', ')}: run \`node scripts/lore.mjs sapere\``); process.exit(1); }
      console.log('sapere is in step with the vault');
    } else {
      for (const [p, t] of files) writeFileSync(p, t);
      console.log(`sapere: ${data.hubs.length} hubs, ${data.signs.length} signs, ${data.leaves.length} leaves; ${stale.length} files changed`);
    }
    console.log(empty.length ? `empty cells: ${empty.map((e) => `${e.hub}/${e.group}`).join(', ')}` : 'the circle closes: no empty cell');
  } else {
    console.log('usage: node scripts/lore.mjs check | gen [--check] | sapere [--check]');
    process.exit(2);
  }
}
