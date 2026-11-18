// The lore vault on disk: every .md file under lore/, its frontmatter, its links, and the README table
// that says which fields each `tipo` must have. Pure reads.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { parse } from './frontmatter.mjs';
import { ROOT } from './story.mjs';

export const LORE = join(ROOT, 'lore');

const walkMd = (dir) => (existsSync(dir) ? readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walkMd(p) : p.endsWith('.md') ? [p] : [];
}) : []);

// [[target]], [[target|alias]], [[target#part]] -> 'target'
export const linksIn = (text) => [...String(text ?? '').matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)].map((m) => m[1].trim());
const deepStrings = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => deepStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => deepStrings(x, out));
  return out;
};

// The table of lore/README.md: | `folder/` | `tipo` | fields | -> { tipo: { folder, fields: [..] } }.
// Fields are the backticked names of the third column outside parentheses (inside them are examples).
export function readTable(text) {
  const types = {};
  for (const line of String(text).split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 4) continue;
    const folder = /^`([a-z-]+(?:\/[a-z-]+)*)\/`$/.exec(cells[1]);
    const tipo = /^`([a-z-]+)`$/.exec(cells[2]);
    if (!folder || !tipo) continue;
    let s = cells[3], prev;
    do { prev = s; s = s.replace(/\([^()]*\)/g, ''); } while (s !== prev);
    s = s.replace(/\{[^{}]*\}/g, '');
    const fields = [...s.matchAll(/`([a-z_]+)`/g)].map((m) => m[1]);
    types[tipo[1]] = { folder: folder[1], fields: ['tipo', ...fields.filter((f) => f !== 'tipo')] };
  }
  return types;
}

// one document from its relative path and text (also used by the tests to build small vaults)
export function docOf(rel, text) {
  const r = parse(text);
  const name = basename(rel, '.md');
  return {
    path: join(LORE, rel), rel, name, folder: rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '', zone: rel.includes('/') ? rel.split('/')[0] : '', index: name.startsWith('_'),
    data: r.data, body: r.body, errors: r.errors, text,
    links: [...new Set([...linksIn(deepStrings(r.data || {}).join('\n')), ...linksIn(r.body)])],
    generated: /generato da scripts\/lore\.mjs/.test(String(text).split('\n').slice(0, 3).join('\n')),
  };
}

export function vaultOf(docs, readme = '') {
  const byName = new Map();
  for (const d of docs) { if (!byName.has(d.name)) byName.set(d.name, []); byName.get(d.name).push(d); }
  return { docs, byName, types: readTable(readme), readme, get: (n) => byName.get(n)?.[0] || null, ofTipo: (t) => docs.filter((d) => d.data?.tipo === t) };
}

export function loadVault() {
  const files = walkMd(LORE).filter((p) => relative(LORE, p) !== 'README.md');
  const readme = existsSync(join(LORE, 'README.md')) ? readFileSync(join(LORE, 'README.md'), 'utf8') : '';
  return vaultOf(files.map((p) => docOf(relative(LORE, p), readFileSync(p, 'utf8'))), readme);
}

export const linkTarget = (s) => linksIn(s)[0] || null;
