// The data of the lore viewer (lore-site/, served at <site>/lore/): every note of the vault with its
// type, title, frontmatter, body, links and backlinks, plus the colours of lore/.obsidian/graph.json and
// the positions of the whole graph (computed here once, so the phone only draws).
//   buildSite(vault?) -> { data, bodies|null }   data.json (and bodies.json when data would be too large)
//   siteFiles(build)  -> [{ fileName, source }]  everything the Vite plugin emits under lore/
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadVault, linksIn, LORE } from './vault.mjs';
import { ROOT } from './story.mjs';
import { buildViews, VIEWS, ZONES } from './siteviews.mjs';

export const SITE_DIR = join(ROOT, 'lore-site');
export const SPLIT_AT = 1.5e6; // bytes: above this the bodies go to their own file
export const GRAPH_OFF = ['scelta', 'finale', 'tratto', 'indice']; // generated types and indices: in no graph, only in lists

// Italian names of the types, in the order of the home page
export const TYPES = [
  ['persona', 'Persone'], ['retroscena', 'Retroscena'], ['luogo', 'Luoghi'], ['fatto', 'Fatti'],
  ['meccanica', 'Meccaniche'], ['obiettivo', 'Obiettivi'], ['tecnica', 'Tecniche'], ['principio', 'Principi'],
  ['legge', 'Leggi'], ['ricetta', 'Ricette'], ['tratto', 'Tratti'], ['scelta', 'Scelte'], ['finale', 'Finali'],
  ['decisione', 'Decisioni'], ['concetto', 'Concetti'], ['indice', 'Indici'],
];
const INDEX_COLOR = '#8a8173';
const FAMIGLIA_COLOR = '#14532d';
const FAMIGLIE = { arcano: 'Arcani maggiori', seme: 'Semi', erba: 'Erbe', fumo: 'Fumi', pietra: 'Pietre', pianeta: 'Pianeti', elemento: 'Elementi', segno: 'Segni', intenzione: 'Intenzioni', numero: 'Numeri', figura: 'Figure', stesa: 'Stese', regola: 'Regole', storia: 'Storia' };

// path:<folder>/ -> #rrggbb, from the Obsidian graph settings
export function graphColors(text) {
  const out = {};
  try {
    for (const g of JSON.parse(text).colorGroups || []) {
      const m = /path:([a-z-]+(?:\/[a-z-]+)*)\//.exec(g.query || '');
      if (m) out[m[1]] = `#${(g.color?.rgb ?? 0).toString(16).padStart(6, '0')}`;
    }
  } catch { /* no colours: every type gets the index grey */ }
  return out;
}

const deepStrings = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => deepStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => deepStrings(x, out));
  return out;
};
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

export { VIEWS, ZONES };
const VIEWS_CACHE = new Map();
export const resetLayoutCache = () => VIEWS_CACHE.clear();

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

  // ---- links with a name: every link of a note comes from a frontmatter field, or from the text ('testo')
  const fields = ['testo'];
  const fieldIx = (f) => { let i = fields.indexOf(f); if (i < 0) { i = fields.length; fields.push(f); } return i; };
  const idx = new Map(notes.map((n, i) => [n.id, i]));
  const docOfId = new Map(docs.map((d) => [d.name, d]));
  const edges = [], seenE = new Set();
  const addEdge = (a, b, f) => { const k = `${a},${b},${f}`; if (!seenE.has(k)) { seenE.add(k); edges.push([a, b, fieldIx(f)]); } };
  for (const n of notes) {
    const d = docOfId.get(n.id), inField = new Set();
    for (const [k, v] of Object.entries(d.data || {})) {
      if (k === 'tipo') continue;
      for (const l of new Set(linksIn(deepStrings(v).join('\n')))) if (l !== n.id && idx.has(l)) { inField.add(l); addEdge(idx.get(n.id), idx.get(l), k); }
    }
    for (const l of n.links) if (!inField.has(l)) addEdge(idx.get(n.id), idx.get(l), 'testo');
  }

  // ---- virtual hubs: one per concept family (not a file, never in lists or search), linked to its members
  const famOf = (n) => (typeof n.fm?.famiglia === 'string' ? n.fm.famiglia.trim().toLowerCase() : '');
  const famNames = [...new Set(notes.filter((n) => n.tipo === 'concetto' && famOf(n)).map(famOf))].sort();
  const hubs = famNames.map((fam, k) => {
    const members = notes.map((n, i) => (n.tipo === 'concetto' && famOf(n) === fam ? i : -1)).filter((i) => i >= 0);
    return { id: `famiglia:${fam}`, fam, tipo: 'famiglia', title: `${FAMIGLIE[fam] || fam.replace(/^./, (c) => c.toUpperCase())} · ${members.length}`, sub: `Famiglia dei concetti: ${(FAMIGLIE[fam] || fam).toLowerCase()}.`, members, index: notes.length + k };
  });
  const hubOf = new Map(hubs.map((h) => [h.fam, h]));
  for (const h of hubs) for (const m of h.members) addEdge(m, h.index, 'famiglia');
  for (const n of notes) if (n.tipo === 'obiettivo' && Array.isArray(n.fm?.concetti)) {
    for (const f of n.fm.concetti) { const h = hubOf.get(String(f).trim().toLowerCase()); if (h) addEdge(idx.get(n.id), h.index, 'riguarda'); }
  }

  // a meccanica names the families of concepts it touches (plain strings, field `concetti`): linked to the hub as «tocca»,
  // never drawn at rest (the views leave the link out of their rest set)
  for (const n of notes) if (n.tipo === 'meccanica' && Array.isArray(n.fm?.concetti)) {
    for (const f of n.fm.concetti) { const h = hubOf.get(String(f).trim().toLowerCase()); if (h) addEdge(idx.get(n.id), h.index, 'tocca'); }
  }

  // ---- the views: a layout each, with that view's nodes and the links among them only
  const nodeAt = (i) => (i < notes.length ? notes[i] : hubs[i - notes.length]);
  const vkey = JSON.stringify([edges, fields, notes.map((n) => [n.id, n.tipo, n.title, n.fm?.numero, n.fm?.dinamica, n.fm?.peso, n.fm?.famiglia, n.fm?.nome]), hubs.map((h) => [h.id, h.members])]);
  let views = VIEWS_CACHE.get(vkey);
  if (!views) { views = buildViews({ notes, hubs, edges, fields, nodeAt }); VIEWS_CACHE.clear(); VIEWS_CACHE.set(vkey, views); } // the dev server rebuilds on every request

  const counts = {};
  for (const n of notes) counts[n.tipo] = (counts[n.tipo] || 0) + 1;
  const known = new Set(TYPES.map((t) => t[0]));
  const types = [...TYPES, ...Object.keys(counts).filter((t) => !known.has(t)).map((t) => [t, humanize(t)])]
    .filter(([t]) => counts[t])
    .map(([tipo, label]) => ({ tipo, label, count: counts[tipo], color: tipo === 'indice' ? INDEX_COLOR : colors[folderOf[tipo]] || INDEX_COLOR, graph: !GRAPH_OFF.includes(tipo) }));

  const data = { v: 2, home: byId.has('inizio') ? 'inizio' : null, types, notes, fields, edges, hubs: hubs.map(({ fam, ...h }) => ({ ...h, color: FAMIGLIA_COLOR })), views, zones: ZONES, bodies: false };
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
