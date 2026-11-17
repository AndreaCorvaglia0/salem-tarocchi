// Draws the map of the repo into docs/MAP.md: who provides, wraps and calls each service, who emits and
// hears each bus event, how big each folder is. Modules here talk by NAME (core/services.js, core/bus.js),
// so an import graph would miss almost every real link: this reads the names instead.
//   node scripts/map.mjs          write docs/MAP.md
//   node scripts/map.mjs --check  exit 1 when docs/MAP.md is out of date (used by the tests)
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'docs', 'MAP.md');
const HEAD = join(ROOT, 'docs', 'MAP.head.md');

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : [];
});
const files = walk(SRC).sort();
const rel = (p) => relative(SRC, p);
const short = (p) => rel(p).replace(/\.js$/, '');

// name -> { provide:Set, wrap:Set, call:Set } ; `has('x')` counts as a call (someone depends on it)
const services = new Map();
const events = new Map(); // name -> { emit:Set, on:Set }
const imported = new Map(); // file -> number of files importing it
const folders = new Map(); // folder -> { files, lines }
const slot = (map, k, keys) => { if (!map.has(k)) map.set(k, Object.fromEntries(keys.map((x) => [x, new Set()]))); return map.get(k); };

export function scan() {
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const dir = dirname(rel(f)) || '.';
    const fo = folders.get(dir) || { files: 0, lines: 0 };
    fo.files += 1; fo.lines += text.split('\n').length; folders.set(dir, fo);
    for (const m of text.matchAll(/(?<![.\w])(provide|wrap|call|has)\(\s*['"`]([\w.]+)['"`]/g)) {
      const kind = m[1] === 'has' ? 'call' : m[1];
      slot(services, m[2], ['provide', 'wrap', 'call'])[kind].add(short(f));
    }
    if (/from\s+['"][^'"]*\/bus\.js['"]/.test(text)) for (const m of text.matchAll(/(?<![.\w])(emit|on|once)\(\s*['"`]([\w:.]+)['"`]/g)) {
      slot(events, m[2], ['emit', 'on'])[m[1] === 'emit' ? 'emit' : 'on'].add(short(f));
    }
    for (const m of text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      const target = join(dirname(f), m[1]);
      if (existsSync(target)) imported.set(target, (imported.get(target) || 0) + 1);
    }
  }
  return { services, events, imported, folders };
}

const list = (set, max = 6) => {
  const a = [...set].sort();
  return a.length > max ? `${a.slice(0, max).join(', ')} … (+${a.length - max})` : a.join(', ');
};

export function render() {
  scan();
  const L = [];
  L.push(existsSync(HEAD) ? readFileSync(HEAD, 'utf8').trimEnd() : '# Map');
  L.push('', '<!-- Everything below is written by scripts/map.mjs: do not edit by hand. -->', '');

  L.push('## Folders', '', '| Folder | Files | Lines |', '|---|---:|---:|');
  for (const [d, v] of [...folders].sort()) L.push(`| \`src/${d}\` | ${v.files} | ${v.lines} |`);

  L.push('', '## Services', '', 'Provided by one file, sometimes wrapped by glue, called by name from anywhere.', '',
    '| Service | Provided by | Wrapped by | Called from |', '|---|---|---|---|');
  const orphans = [];
  for (const [name, s] of [...services].sort()) {
    if (!s.provide.size && !s.wrap.size) { orphans.push(name); }
    L.push(`| \`${name}\` | ${list(s.provide) || '—'} | ${list(s.wrap) || ''} | ${list(s.call) || '—'} |`);
  }
  L.push('', orphans.length ? `Called but never provided: ${orphans.map((n) => `\`${n}\``).join(', ')}.` : 'Every service that is called is provided.');

  L.push('', '## Bus events', '', '| Event | Emitted by | Heard by |', '|---|---|---|');
  for (const [name, e] of [...events].sort()) L.push(`| \`${name}\` | ${list(e.emit) || '—'} | ${list(e.on) || '—'} |`);

  L.push('', '## Most imported files', '', 'Touch these with care: many files depend on them.', '');
  for (const [f, n] of [...imported].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 15)) L.push(`- \`src/${rel(f)}\` (${n})`);
  return `${L.join('\n')}\n`;
}

export const orphanServices = () => { scan(); return [...services].filter(([, s]) => !s.provide.size && !s.wrap.size).map(([n]) => n); };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const text = render();
  if (process.argv.includes('--check')) {
    const now = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (now !== text) { console.error('docs/MAP.md is out of date: run `node scripts/map.mjs`'); process.exit(1); }
  } else { writeFileSync(OUT, text); console.log(`wrote docs/MAP.md (${text.split('\n').length} lines)`); }
}
