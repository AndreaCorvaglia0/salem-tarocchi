// The data of the lore viewer (lore-site/, served at <site>/lore/): every note of the vault with its
// type, title, frontmatter, body, links and backlinks, plus the colours of lore/.obsidian/graph.json and
// the positions of the whole graph (computed here once, so the phone only draws).
//   buildSite(vault?) -> { data, bodies|null }   data.json (and bodies.json when data would be too large)
//   siteFiles(build)  -> [{ fileName, source }]  everything the Vite plugin emits under lore/
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadVault, linksIn, LORE } from './vault.mjs';
import { ROOT } from './story.mjs';
import { layout, spread } from '../../lore-site/layout.js';

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
const FAMIGLIE = { arcano: 'Arcani maggiori', seme: 'Semi', erba: 'Erbe', fumo: 'Fumi', pietra: 'Pietre', pianeta: 'Pianeti', elemento: 'Elementi', segno: 'Segni', intenzione: 'Intenzioni', numero: 'Numeri', figura: 'Figure', stesa: 'Stese', regola: 'Regole', storia: 'Storie' };

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

// The views of the graph page (#/grafo/<id>): which types each one shows and where the clusters start
// (anchors in unit coordinates, scaled by the size of the view). Generated types and index pages are in none.
export const VIEWS = [
  { id: 'insegna', label: 'Perché insegna', pad: 8, types: ['legge', 'principio', 'tecnica', 'ricetta', 'meccanica'],
    anchors: { legge: [0, -1.2], principio: [-0.9, -0.3], tecnica: [0.9, -0.3], ricetta: [0, 0.6], meccanica: [0, 1.2] } },
  { id: 'impara', label: 'Che cosa si impara', types: ['obiettivo', 'famiglia', 'concetto', 'luogo', 'meccanica'],
    pad: 5, anchors: { meccanica: [-0.9, -0.8], obiettivo: [0.9, -0.8], famiglia: [0, 0.5], concetto: [0, 0.5], luogo: [0, 2] } },
  { id: 'storia', label: 'La storia', pad: 5, types: ['persona', 'luogo', 'fatto', 'retroscena', 'decisione'],
    anchors: { persona: [0, 0], fatto: [0, -1.3], retroscena: [1.1, 0.9], luogo: [-1.1, 0.9], decisione: [1.2, -1.3] } },
  { id: 'tutto', label: 'Tutto', pad: 3, types: ['legge', 'principio', 'tecnica', 'ricetta', 'meccanica', 'obiettivo', 'famiglia', 'concetto', 'luogo', 'persona', 'fatto', 'retroscena', 'decisione'],
    anchors: { legge: [0, -2.4], principio: [-0.9, -1.9], tecnica: [0.9, -1.9], ricetta: [0, -1.5], meccanica: [0, -0.9], obiettivo: [0, -0.3], famiglia: [0, 0.3], concetto: [0, 0.9], luogo: [-0.5, 1.6], persona: [0.2, 1.9], fatto: [0.7, 2.4], retroscena: [-0.5, 2.4], decisione: [1.2, 1.6] } },
];
// the three doors of the home page: the zone, its question, the types it lists and the view it opens
export const ZONES = [
  { id: 'metodo', label: 'Metodo: come si insegna', view: 'insegna', types: ['legge', 'principio', 'tecnica', 'ricetta', 'meccanica'] },
  { id: 'corso', label: 'Corso: che cosa si impara', view: 'impara', types: ['obiettivo', 'concetto'] },
  { id: 'storia', label: 'Storia: dove e con chi', view: 'storia', types: ['persona', 'luogo', 'fatto', 'retroscena', 'decisione'] },
];
const R_MAX = 10, R_LEGGE = 13;

// one view: its nodes, the links among them, sizes, and a deterministic layout. Notes with no link in the view
// are not drawn: they are listed in `loose` (the page says «N senza legami in questa vista»).
export const resetLayoutCache = () => VIEW_CACHE.clear();
const VIEW_CACHE = new Map(); // layouts by their inputs: the dev server rebuilds the data on every request
function buildView(def, { notes, hubs, edges, nodeAt }) {
  const all = [...notes, ...hubs].map((n, i) => i).filter((i) => def.types.includes(nodeAt(i).tipo) && !String(nodeAt(i).id).startsWith('_'));
  const inV = new Set(all), seen = new Set(), pairs = [];
  for (const [a, b] of edges) {
    if (!inV.has(a) || !inV.has(b) || a === b) continue;
    const k = a < b ? `${a},${b}` : `${b},${a}`;
    if (!seen.has(k)) { seen.add(k); pairs.push([a, b]); }
  }
  const deg = new Map();
  for (const [a, b] of pairs) { deg.set(a, (deg.get(a) || 0) + 1); deg.set(b, (deg.get(b) || 0) + 1); }
  const ids = all.filter((i) => deg.get(i)), loose = all.filter((i) => !deg.get(i));
  const loc = new Map(ids.map((g, k) => [g, k]));
  const local = pairs.map(([a, b]) => [loc.get(a), loc.get(b)]);
  const r = ids.map((g) => {
    const n = nodeAt(g), d = deg.get(g);
    if (n.tipo === 'legge') return R_LEGGE;
    if (n.tipo === 'famiglia') return Math.min(15, 8 + 0.8 * Math.sqrt(n.members.length));
    let v = Math.min(R_MAX, 3 + 1.3 * Math.sqrt(d));
    const peso = n.fm?.peso;
    if (n.tipo === 'concetto' && peso === 'nucleo') v = Math.max(v * 1.5, 9);
    else if (n.tipo === 'concetto' && peso === 'contorno') v = Math.max(3, v * 0.8);
    return Math.round(v * 10) / 10;
  });
  const ckey = JSON.stringify([def, ids, local, r, ids.map((g) => `${nodeAt(g).tipo}${nodeAt(g).fm?.famiglia ?? ''}`)]);
  const hit = VIEW_CACHE.get(ckey);
  const types = [...new Set(def.types)];
  // groups: a type, except that concepts form one group per family, so each family is a hub with its members
  const hasHubs = hubs.length && def.types.includes('famiglia');
  const gkey = ids.map((g) => { const n = nodeAt(g); const f = n.tipo === 'famiglia' ? n.fam : n.fm?.famiglia; return hasHubs && f && (n.tipo === 'concetto' || n.tipo === 'famiglia') ? `concetto:${String(f).trim().toLowerCase()}` : n.tipo; });
  const keys = [...new Set(gkey)];
  const group = gkey.map((k) => keys.indexOf(k));
  // the circles are drawn at their size r (screen px) when the whole picture fits the phone (scale s0); so the
  // layout keeps them apart at r / s0, found in a few passes (a big view needs a scale below 1)
  const arrange = (rw) => {
    // each group is a disc whose area fits its circles; discs go to their anchors, spaced so they just touch;
    // the force layout then arranges the circles inside (hubs to the middle) and the links between discs
    const area = keys.map(() => 0), num = keys.map(() => 0);
    ids.forEach((g, k) => { area[group[k]] += (rw[k] + 2.5) ** 2; num[group[k]]++; });
    const R = area.map((a) => Math.sqrt(a) * 1.3);
    // the family discs form a block (a grid, the biggest first) that stands in for the concept group
    const fam = keys.map((k, i) => i).filter((i) => keys[i].startsWith('concetto:')).sort((a, b) => R[b] - R[a] || (keys[a] < keys[b] ? -1 : 1));
    const cols = 3, cell = fam.length ? 2 * Math.max(...fam.map((i) => R[i])) + 8 : 0, rows = Math.ceil(fam.length / cols);
    const block = fam.length ? Math.hypot(cols * cell, rows * cell) / 2 * 0.62 : 0;
    const unit = keys.map((k) => { const t = k.split(':')[0], a = def.anchors[t] || [0, 0]; return [a[0], a[1] * 1.3]; });
    const radius = keys.map((k, i) => (k.startsWith('concetto:') ? 0 : R[i]));
    const blockAt = fam.length ? def.anchors.concetto : null;
    let A = 40;
    const nodesFit = keys.map((k, i) => (k.startsWith('concetto:') ? null : [unit[i], radius[i]])).filter(Boolean);
    if (blockAt) nodesFit.push([[blockAt[0], blockAt[1] * 1.3], block]);
    for (let i = 0; i < nodesFit.length; i++) for (let j = i + 1; j < nodesFit.length; j++) {
      const [pa, ra] = nodesFit[i], [pb, rb] = nodesFit[j], dd = Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) || 1;
      A = Math.max(A, ((ra + rb) * 0.9) / dd);
    }
    const at = keys.map((k, i) => [unit[i][0] * A, unit[i][1] * A]);
    fam.forEach((i, n) => { const c = n % cols, rw = Math.floor(n / cols); at[i] = [at[i][0] + (c - (Math.min(cols, fam.length) - 1) / 2) * cell, at[i][1] + (rw - (rows - 1) / 2) * cell]; });
    const init = new Float64Array(2 * ids.length), seenG = {};
    ids.forEach((g, k) => {
      const gi = group[k], c = (seenG[gi] = (seenG[gi] || 0) + 1), rr = 9 * Math.sqrt(c), ang = c * 2.39996323;
      init[2 * k] = at[gi][0] + rr * Math.cos(ang); init[2 * k + 1] = at[gi][1] + rr * Math.sin(ang);
    });
    const pull = keys.map((k, i) => (def.free?.includes(k) ? 0 : Math.min(14, Math.max(0.3, (1200 * num[i]) / (R[i] * R[i])))));
    const p = layout(ids.length, local, { iterations: 360, dist: 20, init, gravity: 0.01, hubGravity: 1.2, group, groupPull: pull, groupAt: at, rad: rw, pad: def.pad ?? 4 });
    // a family hub sits in the middle of its members, which then make room around it
    ids.forEach((g, k) => {
      if (nodeAt(g).tipo !== 'famiglia') return;
      let sx = 0, sy = 0, c = 0;
      for (const [a, b] of local) { const o = a === k ? b : b === k ? a : -1; if (o >= 0 && group[o] === group[k]) { sx += p[2 * o]; sy += p[2 * o + 1]; c++; } }
      if (c) { p[2 * k] = sx / c; p[2 * k + 1] = sy / c; }
    });
    spread(p, rw, { iterations: 400, pad: (def.pad ?? 4) - 1 });
    return p;
  };
  let s0 = 1, p = null, rOut, rUsed;
  if (hit) { p = hit.p; rOut = hit.rOut; } else {
  for (let pass = 0; pass < 3; pass++) {
    rUsed = r.map((v) => v / s0);
    p = arrange(rUsed);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let k = 0; k < ids.length; k++) { x0 = Math.min(x0, p[2 * k]); x1 = Math.max(x1, p[2 * k]); y0 = Math.min(y0, p[2 * k + 1]); y1 = Math.max(y1, p[2 * k + 1]); }
    s0 = Math.min(1, 350 / Math.max(1, x1 - x0), 520 / Math.max(1, y1 - y0));
  }
  rOut = rUsed.map((v) => Math.round(v * 10) / 10);
  VIEW_CACHE.set(ckey, { p, rOut });
  }
  const count = {};
  for (const g of ids) count[nodeAt(g).tipo] = (count[nodeAt(g).tipo] || 0) + 1;
  return { id: def.id, label: def.label, ids, pos: Array.from(p, Math.round), r: rOut, loose, legend: types.map((tipo) => ({ tipo, count: count[tipo] || 0, loose: loose.filter((g) => nodeAt(g).tipo === tipo).length })).filter((t) => t.count || t.loose) };
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

  // ---- the views: a layout each, with that view's nodes and the links among them only
  const nodeAt = (i) => (i < notes.length ? notes[i] : hubs[i - notes.length]);
  const views = VIEWS.map((def) => buildView(def, { notes, hubs, edges, nodeAt }));

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
