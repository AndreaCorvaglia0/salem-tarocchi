// The data of the lore viewer (lore-site/, served at <site>/lore/): every note of the vault with its
// type, title, frontmatter, body, links and backlinks, plus the colours of lore/.obsidian/graph.json and
// the positions of the whole graph (computed here once, so the phone only draws).
//   buildSite(vault?) -> { data, bodies|null }   data.json (and bodies.json when data would be too large)
//   siteFiles(build)  -> [{ fileName, source }]  everything the Vite plugin emits under lore/
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadVault, linksIn, LORE } from './vault.mjs';
import { ROOT } from './story.mjs';
import { layout } from '../../lore-site/layout.js';

export const SITE_DIR = join(ROOT, 'lore-site');
export const SPLIT_AT = 1.5e6; // bytes: above this the bodies go to their own file
export const GRAPH_OFF = ['scelta', 'finale', 'indice']; // types hidden in the graph at first

// Italian names of the types, in the order of the home page
export const TYPES = [
  ['persona', 'Persone'], ['retroscena', 'Retroscena'], ['luogo', 'Luoghi'], ['fatto', 'Fatti'],
  ['meccanica', 'Meccaniche'], ['obiettivo', 'Obiettivi'], ['tecnica', 'Tecniche'], ['principio', 'Principi'],
  ['metodo', 'Metodo'], ['tratto', 'Tratti'], ['scelta', 'Scelte'], ['finale', 'Finali'],
  ['decisione', 'Decisioni'], ['indice', 'Indici'],
];
const INDEX_COLOR = '#8a8173';

// path:<folder>/ -> #rrggbb, from the Obsidian graph settings
export function graphColors(text) {
  const out = {};
  try {
    for (const g of JSON.parse(text).colorGroups || []) {
      const m = /path:([a-z-]+)\//.exec(g.query || '');
      if (m) out[m[1]] = `#${(g.color?.rgb ?? 0).toString(16).padStart(6, '0')}`;
    }
  } catch { /* no colours: every type gets the index grey */ }
  return out;
}

const humanize = (id) => id.replace(/^_/, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
const strip = (s) => String(s ?? '').replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (_, t, a) => a || t).replace(/[*_`]/g, '').trim();

// the short line under a title in lists and search results
function subOf(fm) {
  if (!fm) return '';
  for (const k of ['in_breve', 'cosa_e', 'cosa', 'sa_fare', 'problema', 'cosa_fa_la_giocatrice', 'condizione', 'dove']) {
    const v = fm[k];
    if (typeof v === 'string' && v.trim()) return v;
    if (Array.isArray(v) && v.length) { const x = v[0]; return typeof x === 'string' ? x : x && typeof x.t === 'string' ? x.t : ''; }
  }
  if (Array.isArray(fm.ruolo) && fm.ruolo[0]) return typeof fm.ruolo[0] === 'string' ? fm.ruolo[0] : fm.ruolo[0].t || '';
  return '';
}

export function buildSite(vault = loadVault(), { colors = null } = {}) {
  colors ??= graphColors(existsSync(join(LORE, '.obsidian/graph.json')) ? readFileSync(join(LORE, '.obsidian/graph.json'), 'utf8') : '{}');
  const docs = vault.docs.filter((d) => vault.byName.get(d.name)[0] === d); // a duplicate name keeps its first file (lore check reports it)
  const folderOf = Object.fromEntries(Object.entries(vault.types).map(([t, v]) => [t, v.folder]));
  const tipoOf = (d) => (d.index || !d.data || d.data.tipo === 'indice' || !d.data.tipo ? 'indice' : d.data.tipo);
  const ids = new Set(docs.map((d) => d.name));

  const notes = docs.map((d) => {
    const fm = d.data ? { ...d.data } : null;
    const tipo = tipoOf(d);
    let title = typeof fm?.nome === 'string' && fm.nome ? fm.nome : null;
    const h1 = /^#\s+(.+)$/m.exec(d.body || '');
    if (!title && h1) title = strip(h1[1]);
    const links = d.links.filter((l) => l !== d.name);
    return {
      id: d.name, tipo, folder: d.folder, title, fm, body: (d.body || '').replace(/^\n+/, ''),
      links: links.filter((l) => ids.has(l)), broken: links.filter((l) => !ids.has(l)),
      fonte: ['copione', 'deciso', 'proposto'].includes(fm?.fonte) ? fm.fonte : null,
      hidden: tipo === 'retroscena', generated: d.generated, errors: d.errors.map((e) => `riga ${e.line}: ${e.msg}`),
    };
  });
  const byId = new Map(notes.map((n) => [n.id, n]));
  // titles that depend on another note: a backstory is named after its person
  for (const n of notes) {
    if (n.title) continue;
    const who = n.tipo === 'retroscena' && linksIn(n.fm?.persona)[0];
    n.title = who && byId.get(who)?.fm?.nome ? `${byId.get(who).fm.nome}: retroscena` : humanize(n.id);
  }
  // the line under the title: a summary field, or else the first sentence of the text
  const firstLine = (b) => (String(b).split('\n').find((l) => l.trim() && !/^(#|\||>|-{3})/.test(l.trim())) || '').replace(/^[-*]\s+/, '');
  for (const n of notes) { const s = strip(subOf(n.fm) || firstLine(n.body)); n.sub = s.length > 160 ? `${s.slice(0, 157)}…` : s; n.back = []; }
  for (const n of notes) for (const l of n.links) byId.get(l).back.push(n.id);

  // the graph: undirected edges, positions for the default view first, then the rest around it
  const idx = new Map(notes.map((n, i) => [n.id, i]));
  const seen = new Set(), edges = [];
  for (const n of notes) for (const l of n.links) {
    const a = idx.get(n.id), b = idx.get(l), k = a < b ? `${a},${b}` : `${b},${a}`;
    if (!seen.has(k)) { seen.add(k); edges.push([a, b]); }
  }
  const nb = notes.map(() => []);
  for (const [a, b] of edges) { nb[a].push(b); nb[b].push(a); }
  // 1. the default view, connected notes only; 2. its notes with no link in that view, on a ring around it
  const inMain = (i) => !GRAPH_OFF.includes(notes[i].tipo);
  const main = notes.map((n, i) => i).filter((i) => inMain(i) && nb[i].some(inMain));
  const ring = notes.map((n, i) => i).filter((i) => inMain(i) && !nb[i].some(inMain));
  const mi = new Map(main.map((g, k) => [g, k]));
  const p1 = layout(main.length, edges.filter(([a, b]) => mi.has(a) && mi.has(b)).map(([a, b]) => [mi.get(a), mi.get(b)]), { iterations: 320, dist: 46 });
  const init = new Float64Array(2 * notes.length);
  main.forEach((g, k) => { init[2 * g] = p1[2 * k]; init[2 * g + 1] = p1[2 * k + 1]; });
  const radii = main.map((g) => Math.hypot(init[2 * g], init[2 * g + 1])).sort((a, b) => a - b);
  const R = (radii[Math.floor(radii.length * 0.97)] || 100) + 90;
  ring.sort((a, b) => notes[a].tipo.localeCompare(notes[b].tipo) || notes[a].id.localeCompare(notes[b].id))
    .forEach((g, k) => { const a = (k / ring.length) * 2 * Math.PI - Math.PI / 2; init[2 * g] = R * Math.cos(a); init[2 * g + 1] = R * Math.sin(a); });
  // 3. choices, endings and indices start next to what they link to and settle with everything else fixed
  const placed = new Set([...main, ...ring]);
  notes.forEach((n, i) => {
    if (placed.has(i)) return;
    const near = nb[i].filter((j) => placed.has(j));
    if (near.length) {
      init[2 * i] = near.reduce((s, j) => s + init[2 * j], 0) / near.length + ((i * 37) % 23) - 11;
      init[2 * i + 1] = near.reduce((s, j) => s + init[2 * j + 1], 0) / near.length + ((i * 53) % 19) - 9;
    } else { init[2 * i] = R * 1.2 * Math.cos(i); init[2 * i + 1] = R * 1.2 * Math.sin(i); }
  });
  const pos = layout(notes.length, edges, { iterations: 120, dist: 46, init, fixed: placed, gravity: 0.08 });
  notes.forEach((n, i) => { n.x = Math.round(pos[2 * i]); n.y = Math.round(pos[2 * i + 1]); });

  const counts = {};
  for (const n of notes) counts[n.tipo] = (counts[n.tipo] || 0) + 1;
  const known = new Set(TYPES.map((t) => t[0]));
  const types = [...TYPES, ...Object.keys(counts).filter((t) => !known.has(t)).map((t) => [t, humanize(t)])]
    .filter(([t]) => counts[t])
    .map(([tipo, label]) => ({ tipo, label, count: counts[tipo], color: tipo === 'indice' ? INDEX_COLOR : colors[folderOf[tipo]] || INDEX_COLOR, graph: !GRAPH_OFF.includes(tipo) }));

  const data = { v: 1, home: byId.has('inizio') ? 'inizio' : null, types, notes, edges, bodies: false };
  if (JSON.stringify(data).length <= SPLIT_AT) return { data, bodies: null };
  const bodies = Object.fromEntries(notes.map((n) => [n.id, n.body]));
  return { data: { ...data, bodies: true, notes: notes.map(({ body, ...rest }) => rest) }, bodies };
}

// every file of lore/ in the build; `v` stamps the module URLs so a new build is never mixed with an old one
export function siteFiles({ data, bodies }, v = '') {
  const q = v ? `?v=${v}` : '';
  const out = [];
  for (const f of readdirSync(SITE_DIR)) {
    let text = readFileSync(join(SITE_DIR, f), 'utf8');
    if (/\.(js|html)$/.test(f)) text = text.replace(/(["'])\.\/([\w-]+\.(?:js|css|json))\1/g, `$1./$2${q}$1`);
    out.push({ fileName: `lore/${f}`, source: text });
  }
  const font = join(ROOT, 'node_modules/@fontsource/im-fell-english/files/im-fell-english-latin-400-normal.woff2');
  if (existsSync(font)) out.push({ fileName: 'lore/fell.woff2', source: readFileSync(font) });
  out.push({ fileName: 'lore/data.json', source: JSON.stringify(data) });
  if (bodies) out.push({ fileName: 'lore/bodies.json', source: JSON.stringify(bodies) });
  return out;
}
