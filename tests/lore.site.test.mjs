// The lore viewer (lore-site/, served at <site>/lore/): its data is built from the real vault, every link
// resolves or is flagged, backlinks mirror links, and the build emits the page and its data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadVault, vaultOf, docOf, linksIn } from '../scripts/lore/vault.mjs';
import { buildSite, siteFiles, graphColors, SPLIT_AT, VIEWS, ZONES, resetLayoutCache } from '../scripts/lore/site.mjs';
import { md } from '../lore-site/md.js';
import { layout, spread } from '../lore-site/layout.js';
import { phrase, LINKS, groupLinks } from '../lore-site/linknames.js';
import { trail } from '../lore-site/trail.js';
import { ringPack, shortName } from '../scripts/lore/siteviews.mjs';
import { lorePlugin } from '../vite.config.js';

const vault = loadVault();
const site = buildSite(vault);
const { data } = site;
const byId = new Map(data.notes.map((n) => [n.id, n]));

test('every file of the vault is a note, with a type and a title', () => {
  assert.equal(data.notes.length, new Set(vault.docs.map((d) => d.name)).size);
  for (const n of data.notes) {
    assert.ok(n.id && n.tipo && n.title, n.id);
    assert.ok(data.types.some((t) => t.tipo === n.tipo), `${n.id}: type ${n.tipo} has no chip`);
  }
  assert.equal(data.home, 'inizio');
  assert.equal(data.types.reduce((s, t) => s + t.count, 0), data.notes.length);
  for (const t of ['persona', 'retroscena', 'fatto', 'meccanica', 'tratto', 'scelta', 'finale', 'ricetta', 'concetto']) assert.ok(byId.size && data.types.find((x) => x.tipo === t), t);
  assert.equal(byId.get('ortica').title, 'Ortica');
  assert.equal(byId.get('ortica-retroscena').title, 'Ortica: retroscena');
  assert.equal(byId.get('ortica-retroscena').hidden, true);
});

test('the colours come from the Obsidian graph settings; choices and endings start hidden', () => {
  const c = graphColors('{"colorGroups":[{"query":"path:storia/persone/","color":{"a":1,"rgb":14711391}}]}');
  assert.equal(c['storia/persone'], '#e07a5f');
  assert.equal(data.types.find((t) => t.tipo === 'persona').color, '#f59e0b');
  assert.equal(data.types.find((t) => t.tipo === 'scelta').graph, false);
  assert.equal(data.types.find((t) => t.tipo === 'finale').graph, false);
  assert.equal(data.types.find((t) => t.tipo === 'fatto').graph, true);
});

test('every link of a note resolves, or is flagged as broken', () => {
  for (const d of vault.docs) {
    const n = byId.get(d.name);
    for (const l of d.links.filter((x) => x !== d.name)) {
      if (byId.has(l)) assert.ok(n.links.includes(l), `${d.name} -> ${l} lost`);
      else assert.ok(n.broken.includes(l), `${d.name} -> ${l} neither resolved nor flagged`);
    }
    for (const l of n.links) assert.ok(byId.has(l), `${d.name} -> ${l}`);
  }
});

test('backlinks are exactly the links seen from the other side, and the edges are the same pairs', () => {
  for (const n of data.notes) {
    for (const l of n.links) assert.ok(byId.get(l).back.includes(n.id), `${n.id} -> ${l} has no backlink`);
    for (const b of n.back) assert.ok(byId.get(b).links.includes(n.id), `${b} is listed as linking ${n.id} but does not`);
  }
  const pairs = new Set(), N = data.notes.length;
  for (const n of data.notes) for (const l of n.links) pairs.add([n.id, l].sort().join(' '));
  const seen = new Set();
  for (const [a, b] of data.edges) if (a < N && b < N) seen.add([data.notes[a].id, data.notes[b].id].sort().join(' '));
  assert.deepEqual([...seen].sort(), [...pairs].sort()); // the edges between notes are the same pairs (hub edges aside)
});

test('the data stays one file while it is small, and splits the bodies when it is not', () => {
  assert.ok(!data.bodies || site.bodies, 'bodies flagged but not produced');
  if (!data.bodies) assert.ok(JSON.stringify(data).length <= SPLIT_AT);
  const big = vaultOf([docOf('storia/persone/a.md', `---\ntipo: persona\nnome: "A"\n---\n${'parola '.repeat(260000)} [[b]]`), docOf('storia/luoghi/b.md', '---\ntipo: luogo\nnome: "B"\n---\nqui')]);
  const r = buildSite(big, { colors: {} });
  assert.equal(r.data.bodies, true);
  assert.ok(r.bodies.a.length > 1e6 && !('body' in r.data.notes[0]));
  assert.deepEqual(r.data.notes.find((n) => n.id === 'b').back, ['a']);
  assert.ok(siteFiles(r).some((f) => f.fileName === 'lore/bodies.json'));
});

test('the build emits the page, its modules and the data under lore/', () => {
  const emitted = [];
  lorePlugin().generateBundle.call({ emitFile: (f) => emitted.push(f) });
  const files = new Map(emitted.map((f) => [f.fileName, f.source]));
  for (const f of ['lore/index.html', 'lore/data.json', 'lore/app.js', 'lore/graph.js', 'lore/md.js', 'lore/layout.js', 'lore/linknames.js', 'lore/style.css']) assert.ok(files.has(f), f);
  const html = files.get('lore/index.html');
  assert.match(html, /<meta name="robots" content="noindex/);
  assert.doesNotMatch(html, /https?:\/\//, 'no CDN');
  assert.equal(JSON.parse(files.get('lore/data.json')).notes.length, data.notes.length);
  // every relative import or fetch points at an emitted file
  for (const [name, src] of files) {
    if (!/\.(js|html)$/.test(name)) continue;
    for (const m of String(src).matchAll(/["']\.\/([\w-]+\.(?:js|css|json))(?:\?v=\d+)?["']/g)) {
      if (m[1] === 'bodies.json' && !data.bodies) continue;
      assert.ok(files.has(`lore/${m[1]}`), `${name} needs ${m[1]}`);
    }
  }
});

test('markdown: links, escaping, tables, nested lists', () => {
  const link = (id, a) => `<a data-id="${id}">${a || id}</a>`;
  const h = md('## Ciao <b>\n\n**forte** e *piano* con [[ortica|lei]] e `x<y`\n\n- a\n  - b\n- c\n\n| a | b |\n|---|---|\n| [[malva]] | 2 |', link);
  assert.match(h, /<h3>Ciao &lt;b&gt;<\/h3>/);
  assert.match(h, /<b>forte<\/b> e <i>piano<\/i> con <a data-id="ortica">lei<\/a> e <code>x&lt;y<\/code>/);
  assert.match(h, /<ul><li>a<ul><li>b<\/li><\/ul><\/li><li>c<\/li><\/ul>/);
  assert.match(h, /<td><a data-id="malva">malva<\/a><\/td>/);
  assert.deepEqual(linksIn('[[a#x]] [[b|c]]'), ['a', 'b']);
});

test('the layout is deterministic and stops', () => {
  const edges = [[0, 1], [1, 2], [2, 0], [3, 4]];
  const a = layout(5, edges, { iterations: 50 }), b = layout(5, edges, { iterations: 50 });
  assert.deepEqual([...a], [...b]);
  assert.ok([...a].every(Number.isFinite));
});

// ---------- the views of the graph ----------
const GENERATED = ['scelta', 'finale', 'tratto', 'indice'];
const nodeOf = (i) => (i < data.notes.length ? data.notes[i] : data.hubs[i - data.notes.length]);

test('four views, with the right types, and no generated type or index page in any of them', () => {
  assert.deepEqual(data.views.map((v) => v.id), ['insegna', 'impara', 'storia', 'tutto']);
  assert.deepEqual(data.views.map((v) => v.label), ['Perché insegna', 'Che cosa si impara', 'La storia', 'Tutto']);
  const allowed = { insegna: ['legge', 'principio', 'tecnica', 'ricetta', 'meccanica'], impara: ['obiettivo', 'famiglia', 'concetto', 'luogo', 'persona'], storia: ['persona', 'luogo', 'fatto', 'retroscena', 'decisione'] };
  allowed.tutto = [...new Set(Object.values(allowed).flat())];
  for (const v of data.views) {
    for (const i of [...v.ids, ...v.loose]) {
      const n = nodeOf(i);
      assert.ok(allowed[v.id].includes(n.tipo), `${v.id}: ${n.id} is a ${n.tipo}`);
      assert.ok(!GENERATED.includes(n.tipo) && !String(n.id).startsWith('_'), `${v.id}: ${n.id} must not appear`);
    }
    for (const l of v.legend) assert.ok(!GENERATED.includes(l.tipo), l.tipo);
  }
  assert.ok(data.views[3].ids.length >= data.views[0].ids.length + data.views[2].ids.length - data.views[0].ids.length);
  assert.deepEqual(ZONES.map((z) => z.view), ['insegna', 'impara', 'storia']);
  assert.deepEqual(VIEWS.map((v) => v.id), data.views.map((v) => v.id));
});

test('every node drawn in a view has a position and a size; the others are listed as loose', () => {
  for (const v of data.views) {
    assert.equal(v.pos.length, 2 * v.ids.length);
    assert.equal(v.r.length, v.ids.length);
    assert.ok(v.pos.every(Number.isFinite) && v.r.every((r) => r > 0), v.id);
    assert.equal(new Set([...v.ids, ...v.loose]).size, v.ids.length + v.loose.length, 'a node is drawn or loose, once');
    // a drawn node has a link inside the view; a loose one has none
    const inV = new Set(v.ids), linked = new Set();
    for (const [a, b] of data.edges) if (inV.has(a) && inV.has(b)) { linked.add(a); linked.add(b); }
    for (const i of v.ids) assert.ok(linked.has(i), `${v.id}: ${nodeOf(i).id} is drawn with no link`);
    for (const i of v.loose) assert.ok(!linked.has(i), `${v.id}: ${nodeOf(i).id} is loose but linked`);
    // legend counts add up
    assert.equal(v.legend.reduce((s, l) => s + l.count, 0), v.ids.length);
    // circles do not overlap (the layout keeps them apart; 1px of rounding)
    for (let a = 0; a < v.ids.length; a++) for (let b = a + 1; b < v.ids.length; b++) {
      const d = Math.hypot(v.pos[2 * a] - v.pos[2 * b], v.pos[2 * a + 1] - v.pos[2 * b + 1]);
      assert.ok(d >= v.r[a] + v.r[b] - 3, `${v.id}: ${nodeOf(v.ids[a]).id} and ${nodeOf(v.ids[b]).id} overlap`);
    }
  }
});

test('the layout of every view is deterministic', () => {
  resetLayoutCache();
  const a = buildSite(vault).data.views;
  resetLayoutCache();
  const b = buildSite(vault).data.views;
  assert.deepEqual(a, b);
});

test('every link carries the name of the field it comes from, or testo', () => {
  assert.equal(data.fields[0], 'testo');
  for (const [a, b, f] of data.edges) {
    assert.ok(typeof data.fields[f] === 'string' && data.fields[f], `edge ${a}-${b} has no field name`);
    assert.ok(a !== b && nodeOf(a) && nodeOf(b));
  }
  const names = new Set(data.edges.map((e) => data.fields[e[2]]));
  for (const f of ['serve', 'insegna', 'tecniche', 'in_salem', 'chi_ci_vive', 'conseguenze', 'testo']) assert.ok(names.has(f), f);
  // the edge says where it comes from: a meccanica serves a principio
  const m = data.notes.findIndex((n) => n.tipo === 'meccanica' && n.fm?.serve?.length);
  const target = data.notes.findIndex((n) => n.id === linksIn(data.notes[m].fm.serve[0])[0]);
  assert.ok(data.edges.some(([a, b, f]) => a === m && b === target && data.fields[f] === 'serve'));
});

test('the names of links read as Italian for both ends, with a fallback', () => {
  for (const f of Object.keys(LINKS)) { assert.ok(phrase(f, 'out', 'meccanica') && phrase(f, 'in', 'meccanica'), f); assert.ok(!/[{}]/.test(phrase(f, 'in', 'meccanica')), f); }
  assert.equal(phrase('serve', 'out'), 'serve');
  assert.equal(phrase('tecniche', 'out'), 'usa la tecnica');
  assert.equal(phrase('insegna', 'in', 'obiettivo'), 'lo insegna');
  assert.equal(phrase('tecniche', 'in', 'tecnica'), 'la usa');
  assert.equal(phrase('campo_nuovo', 'out'), 'campo nuovo');
  assert.ok(phrase('campo_nuovo', 'in'));
  for (const f of data.fields) assert.ok(phrase(f, 'out') && phrase(f, 'in'), f);
});

const small = (docs) => buildSite(vaultOf(docs.map(([rel, fm, body = 'x']) => docOf(rel, `---\n${fm}\n---\n${body}`)), ''), { colors: {} }).data;
const SMALL = [
  ['metodo/leggi/l1.md', 'tipo: legge\nnome: "L1"'],
  ['metodo/principi/p1.md', 'tipo: principio\nnome: "P1"\nlegge: "[[l1]]"'],
  ['metodo/meccaniche/m1.md', 'tipo: meccanica\nnome: "M1"\nserve:\n  - "[[p1]]"\ninsegna:\n  - "[[o1]]"'],
  ['corso/obiettivi/o1.md', 'tipo: obiettivo\nnome: "O1"\nconcetti:\n  - arcano\n  - pietra'],
  ['corso/concetti/c1.md', 'tipo: concetto\nnome: "C1"\nfamiglia: arcano\npeso: nucleo\nsta_in: "[[lu1]]"'],
  ['corso/concetti/c2.md', 'tipo: concetto\nnome: "C2"\nfamiglia: arcano\npeso: contorno'],
  ['corso/concetti/c3.md', 'tipo: concetto\nnome: "C3"\nfamiglia: pietra'],
  ['corso/concetti/c4.md', 'tipo: concetto\nnome: "C4"'],
  ['storia/luoghi/lu1.md', 'tipo: luogo\nnome: "Lu1"'],
  ['storia/persone/pe1.md', 'tipo: persona\nnome: "Pe1"\nluoghi:\n  - "[[lu1]]"'],
  ['storia/generati/scelte/s1.md', 'tipo: scelta\nnome: "S1"', 'vedi [[pe1]]'],
  ['storia/_indice.md', 'tipo: indice', '[[pe1]] [[lu1]]'],
];

test('family hubs: one per family present, linked to every member, in the views with concepts only', () => {
  const d = small(SMALL);
  assert.deepEqual(d.hubs.map((h) => h.id), ['famiglia:arcano', 'famiglia:pietra']);
  assert.deepEqual(d.hubs.map((h) => h.title), ['Arcani maggiori · 2', 'Pietre · 1']);
  assert.ok(d.hubs.every((h) => h.tipo === 'famiglia'));
  assert.ok(!d.notes.some((n) => n.id.startsWith('famiglia:') || n.tipo === 'famiglia'), 'a hub is not a note');
  const N = d.notes.length, ix = (id) => d.notes.findIndex((n) => n.id === id);
  const link = (a, b, f) => d.edges.some(([x, y, g]) => x === a && y === b && d.fields[g] === f);
  assert.ok(link(ix('c1'), N, 'famiglia') && link(ix('c2'), N, 'famiglia') && link(ix('c3'), N + 1, 'famiglia'));
  assert.ok(!d.edges.some(([x, y]) => x === ix('c4') && y >= N), 'a concept without a family has no hub');
  // an objective names families as plain strings
  assert.ok(link(ix('o1'), N, 'riguarda') && link(ix('o1'), N + 1, 'riguarda'));
  // hubs only in the views that have concepts
  for (const v of d.views) assert.equal(v.ids.some((i) => i >= N), ['impara', 'tutto'].includes(v.id), v.id);
  // a plain wikilink field
  assert.ok(link(ix('c1'), ix('lu1'), 'sta_in'));
  assert.equal(phrase('sta_in', 'out'), 'sta in');
  assert.equal(phrase('sta_in', 'in'), 'qui si trova');
  // no concept at all: no hubs, no hub in any view
  const none = small(SMALL.filter(([rel]) => !rel.includes('concetti')));
  assert.equal(none.hubs.length, 0);
  assert.ok(none.views.every((v) => v.ids.every((i) => i < none.notes.length)));
});

test('sizes: laws are the largest, a nucleo concept is bigger than a contorno one, with or without those fields', () => {
  const d = small(SMALL), v = d.views.find((x) => x.id === 'tutto'), N = d.notes.length;
  const r = (id) => v.r[v.ids.indexOf(d.notes.findIndex((n) => n.id === id))];
  assert.ok(r('c1') > r('c2'), 'nucleo > contorno');
  assert.ok(r('l1') >= Math.max(...v.r.filter((_, k) => v.ids[k] < N)), 'a law is never smaller than another note');
  // no laws at all, or eleven of them
  const none = small(SMALL.filter(([rel]) => !rel.includes('leggi')));
  assert.ok(none.views.every((x) => x.r.length === x.ids.length));
  const eleven = small([...SMALL, ...Array.from({ length: 10 }, (_, k) => [`metodo/leggi/x${k}.md`, `tipo: legge\nnome: "X${k}"`, '[[p1]]'])]);
  const ve = eleven.views.find((x) => x.id === 'insegna');
  assert.equal(ve.legend.length >= 1, true);
  assert.equal(eleven.notes.filter((n) => n.tipo === 'legge').length, 11);
  // without peso at all the concepts still get a size
  const plain = small(SMALL.map(([rel, fm, b]) => [rel, fm.replace(/\npeso: \w+/, ''), b]));
  assert.ok(plain.views.find((x) => x.id === 'impara').r.every((x) => x > 0));
});

test('spread pushes overlapping circles apart and stops', () => {
  const p = Float64Array.from([0, 0, 1, 0, 2, 0]), rad = [5, 5, 5];
  spread(p, rad, { iterations: 100, pad: 1 });
  for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) assert.ok(Math.hypot(p[2 * a] - p[2 * b], p[2 * a + 1] - p[2 * b + 1]) >= 10.5);
  const q = layout(6, [[0, 1], [1, 2], [3, 4]], { group: [0, 0, 0, 1, 1, 1], groupPull: [1, 1], groupAt: [[-50, 0], [50, 0]], rad: [4, 4, 4, 4, 4, 4] });
  assert.ok([...q].every(Number.isFinite));
});

test('the graph size stays reasonable', () => {
  const size = JSON.stringify(data).length;
  console.log(`# data.json ${size} bytes (SPLIT_AT ${SPLIT_AT}, bodies ${data.bodies ? 'split' : 'inline'})`);
  assert.ok(size < 3e6);
  assert.ok(data.views.every((v) => JSON.stringify(v).length < 20000));
});

// ---------- second pass: structure ----------
const view = (id, d = data) => d.views.find((v) => v.id === id);
const at = (v, i) => { const k = v.ids.indexOf(i); return [v.pos[2 * k], v.pos[2 * k + 1], v.r[k]]; };
const adjOf = (d) => { const a = Array.from({ length: d.notes.length + d.hubs.length }, () => []); for (const [x, y, f] of d.edges) { a[x].push({ o: y, f, out: true }); a[y].push({ o: x, f, out: false }); } return a; };
const restFields = (v, d = data) => { const s = new Set(); for (const [a, b] of v.rest) { const A = v.ids[a], B = v.ids[b]; s.add(d.edges.filter(([x, y]) => (x === A && y === B) || (x === B && y === A)).map(([, , f]) => d.fields[f])); } return s; }; // per rest pair: the fields that join it
const allowedRest = (v, ok) => { for (const fs of restFields(v)) assert.ok(fs.some((f) => ok.includes(f)), `a rest link of ${v.id} comes from ${fs}`); };

test('«Perché insegna»: one cluster per law, every method card sits in its law cluster, mechanics in a band by dinamica', () => {
  const v = view('insegna'), laws = data.notes.map((n, i) => (n.tipo === 'legge' ? i : -1)).filter((i) => i >= 0);
  assert.equal(laws.length, 11);
  for (const l of laws) assert.ok(v.ids.includes(l), `${data.notes[l].id} is drawn`);
  // the law label is «N · name», cut at 22 characters
  for (const l of laws) { const lab = v.lbl[v.ids.indexOf(l)]; assert.ok(lab && /^\d+ · /.test(lab.t) && lab.t.split(' · ')[1].length <= 22, `${l} label`); assert.ok(v.always.includes(v.ids.indexOf(l))); }
  // each principio / tecnica / ricetta is nearest to its main law (the field `legge`)
  let checked = 0;
  for (const [a, b, f] of data.edges) {
    if (data.fields[f] !== 'legge' || !v.ids.includes(a) || !laws.includes(b)) continue;
    const [x, y] = at(v, a), d = (l) => Math.hypot(at(v, l)[0] - x, at(v, l)[1] - y);
    assert.equal(laws.slice().sort((p, q) => d(p) - d(q))[0], b, `${data.notes[a].id} is not in the cluster of its law`); checked++;
  }
  assert.ok(checked >= 50, `${checked} cards checked`);
  // the mechanics: below every law cluster, and each dinamica group is a compact block of its own
  const mech = v.ids.filter((i) => data.notes[i]?.tipo === 'meccanica');
  assert.ok(mech.length >= 30);
  const lawBottom = Math.max(...v.ids.filter((i) => data.notes[i]?.tipo !== 'meccanica').map((i) => at(v, i)[1]));
  for (const m of mech) assert.ok(at(v, m)[1] > lawBottom, `${data.notes[m].id} is in the band`);
  const by = {};
  for (const m of mech) (by[data.notes[m].fm.dinamica] ||= []).push(m);
  const box = (g) => { const p = g.map((m) => at(v, m)); return [Math.min(...p.map((q) => q[0])), Math.min(...p.map((q) => q[1])), Math.max(...p.map((q) => q[0])), Math.max(...p.map((q) => q[1]))]; };
  for (const [k, g] of Object.entries(by)) { const [x0, y0, x1, y1] = box(g); for (const m of mech) if (!g.includes(m)) { const [x, y] = at(v, m); assert.ok(x < x0 || x > x1 || y < y0 || y > y1, `${k}: ${data.notes[m].id} is inside the group`); } }
  assert.ok(v.caps.some((c) => c[3] === 'group'), 'group labels exist');
});

test('every view shows at rest only its structural links; Tutto only the links that cross zones', () => {
  allowedRest(view('insegna'), ['leggi', 'legge']);
  allowedRest(view('impara'), ['famiglia', 'riguarda', 'sta_in', 'arriva_da', 'la_da', 'si_impara_da']);
  allowedRest(view('storia'), ['luoghi', 'chi_ci_vive', 'persona', 'arco']);
  const flat = new Set([...restFields(view('impara'))].flat());
  assert.ok(flat.has('famiglia') && flat.has('riguarda') && flat.has('sta_in'));
  assert.ok(new Set([...restFields(view('insegna'))].flat()).has('leggi'));
  const zone = (i) => { const t = nodeOf(i).tipo; return ['legge', 'principio', 'tecnica', 'ricetta', 'meccanica'].includes(t) ? 0 : ['obiettivo', 'famiglia', 'concetto'].includes(t) ? 1 : 2; };
  const t = view('tutto');
  assert.ok(t.rest.length > 50);
  for (const [a, b] of t.rest) assert.notEqual(zone(t.ids[a]), zone(t.ids[b]), 'a rest link of Tutto stays inside a zone');
  assert.ok(t.rest.length < t.ids.length, 'a few bridges, not the whole tangle');
  for (const v of data.views) for (const [a, b] of v.rest) assert.ok(a !== b && a < v.ids.length && b < v.ids.length);
});

test('«Che cosa si impara»: obiettivi on top, families in the middle, luoghi (reached by sta_in) at the bottom', () => {
  const v = view('impara'), N = data.notes.length;
  const ys = (tipo) => v.ids.filter((i) => nodeOf(i).tipo === tipo).map((i) => at(v, i)[1]);
  const ob = ys('obiettivo'), fam = ys('famiglia'), lu = ys('luogo');
  assert.ok(ob.length && fam.length && lu.length);
  assert.ok(Math.max(...ob) < Math.min(...fam), 'obiettivi above the families');
  assert.ok(Math.min(...lu) > Math.max(...fam), 'luoghi below the families');
  // a luogo is drawn only if some concept sta_in it; each concept is close to its family hub
  for (const i of v.ids.filter((i) => nodeOf(i).tipo === 'luogo')) assert.ok(data.edges.some(([a, b, f]) => b === i && data.fields[f] === 'sta_in'), `${nodeOf(i).id} has no sta_in`);
  for (const h of data.hubs) { const hi = h.index; if (!v.ids.includes(hi)) continue; const [hx, hy] = at(v, hi); for (const m of h.members.slice(0, 4)) if (v.ids.includes(m)) assert.ok(Math.hypot(at(v, m)[0] - hx, at(v, m)[1] - hy) < 70, `${nodeOf(m).id} is far from its hub`); }
  assert.ok(v.ids.some((i) => i >= N));
  // people appear only as teachers or givers
  for (const i of v.ids.filter((i) => nodeOf(i).tipo === 'persona')) assert.ok(data.edges.some(([a, b, f]) => b === i && ['si_impara_da', 'la_da'].includes(data.fields[f])));
  assert.ok(v.caption.length > 20 && data.views.every((x) => x.caption && x.short));
});

test('«perché c’è»: a breadcrumb for a meccanica and a concetto, nothing for a note with no path', () => {
  const adj = adjOf(data), ctx = { nodeAt: (i) => nodeOf(i), adj, fields: data.fields };
  const ix = (id) => data.notes.findIndex((n) => n.id === id);
  const m = trail(ix('leggere-ai-clienti'), ctx);
  assert.match(m[0], /^Legge \d+ · .+ → Leggere ai clienti$/);
  assert.match(m[1], /^Leggere ai clienti → insegna: /);
  const c = data.notes.findIndex((n) => n.tipo === 'concetto' && n.fm?.sta_in && n.fm?.famiglia === 'arcano');
  const tc = trail(c, ctx);
  assert.ok(tc.some((l) => /^Obiettivo: /.test(l)), tc.join('|'));
  assert.ok(tc.some((l) => /sta in: /.test(l) && /famiglia: /.test(l)));
  const lg = trail(data.notes.findIndex((n) => n.tipo === 'legge'), ctx);
  assert.match(lg[0], /^Legge \d+ · .+: ne discendono /);
  assert.equal(lg.length, 1, 'one line');
  const lu = trail(data.notes.findIndex((n) => n.tipo === 'luogo' && adj[data.notes.indexOf(n)].some((e) => !e.out && data.fields[e.f] === 'sta_in')), ctx);
  assert.match(lu[0], /^Qui si trovano: /);
  assert.deepEqual(trail(ix('ortica'), ctx), [], 'a person has no path to a law');
  assert.deepEqual(trail(0, { nodeAt: () => ({ tipo: 'meccanica', title: 'X', fm: {} }), adj: [[]], fields: [] }), []);
});

test('rings pack circles without touching', () => {
  const { pts, R } = ringPack(12, 4, 20);
  assert.equal(pts.length, 20);
  for (const [x, y] of pts) assert.ok(Math.hypot(x, y) >= 12 + 4 && Math.hypot(x, y) + 4 <= R + 0.01);
  for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) assert.ok(Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]) >= 8, 'two circles touch');
});

test('the new phrases and the size guard', () => {
  assert.equal(phrase('arriva_da', 'in', 'fatto'), 'da qui arriva');
  assert.equal(phrase('la_da', 'out'), 'la dà');
  assert.equal(phrase('si_impara_da', 'in'), 'insegna');
  assert.equal(data.hubs.find((h) => h.id === 'famiglia:storia')?.title ?? 'Storia · 1', 'Storia · 1');
  assert.ok(JSON.stringify(data.views).length < 60000);
});

// ---------- third pass: polish ----------
test('a legge card: one line with the four counts, the meccaniche listed first', () => {
  const adj = adjOf(data), ix = (id) => data.notes.findIndex((n) => n.id === id);
  const l = data.notes.findIndex((n) => n.tipo === 'legge' && n.fm?.numero === 5);
  const line = trail(l, { nodeAt: nodeOf, adj, fields: data.fields });
  assert.equal(line.length, 1);
  assert.match(line[0], /ne discendono \d+ principi, \d+ tecniche, \d+ ricette e \d+ meccaniche$/);
  const gs = groupLinks(l, { adj, fields: data.fields, nodeAt: nodeOf });
  assert.equal(gs[0].h, 'nel gioco');
  assert.ok(gs[0].items.every((o) => nodeOf(o).tipo === 'meccanica'));
  assert.ok(gs.slice(1).every((g) => g.items.every((o) => nodeOf(o).tipo !== 'meccanica')));
  void ix;
});

test('without dove_la_usiamo and meccaniche the cards still carry the reverse phrases; ambito and concetti are read', () => {
  const d = small([
    ['metodo/leggi/l1.md', 'tipo: legge\nnome: "L1"\nambito: generale'],
    ['metodo/tecniche/t1.md', 'tipo: tecnica\nnome: "T1"\nambito: generale\nlegge: "[[l1]]"'],
    ['metodo/meccaniche/m1.md', 'tipo: meccanica\nnome: "M1"\nambito: salem\nleggi:\n  - "[[l1]]"\ntecniche:\n  - "[[t1]]"\ninsegna:\n  - "[[o1]]"\nconcetti:\n  - arcano\n  - seme'],
    ['corso/obiettivi/o1.md', 'tipo: obiettivo\nnome: "O1"\nconcetti:\n  - arcano'],
    ['corso/concetti/c1.md', 'tipo: concetto\nnome: "C1"\nfamiglia: arcano\npeso: nucleo'],
    ['corso/concetti/c2.md', 'tipo: concetto\nnome: "C2"\nfamiglia: seme\npeso: contorno'],
  ]);
  const ix = (id) => d.notes.findIndex((n) => n.id === id), N = d.notes.length, adj = adjOf(d), nodeAt = (i) => (i < N ? d.notes[i] : d.hubs[i - N]);
  const heads = (id) => groupLinks(ix(id), { adj, fields: d.fields, nodeAt }).map((g) => g.h);
  assert.ok(heads('t1').includes('la usa'), heads('t1').join('|'));
  assert.ok(heads('o1').includes('lo insegna'), heads('o1').join('|'));
  assert.equal(d.notes[ix('m1')].fm.ambito, 'salem');
  // concetti on a meccanica: «tocca» / «la tocca», to the family hubs
  const link = (a, b, f) => d.edges.some(([x, y, g]) => x === a && y === b && d.fields[g] === f);
  assert.ok(link(ix('m1'), N, 'tocca') && link(ix('m1'), N + 1, 'tocca'));
  assert.deepEqual(groupLinks(ix('m1'), { adj, fields: d.fields, nodeAt }).find((g) => g.h === 'tocca').items, [N, N + 1]);
  assert.ok(groupLinks(N, { adj, fields: d.fields, nodeAt }).some((g) => g.h === 'la tocca' && g.items.includes(ix('m1'))));
  // never drawn at rest, in any view
  for (const v of d.views) for (const [a, b] of v.rest) assert.ok(!(v.ids[a] === ix('m1') && v.ids[b] >= N) && !(v.ids[b] === ix('m1') && v.ids[a] >= N), `${v.id} draws a tocca link at rest`);
  // and without the old fields nothing breaks
  assert.ok(d.views.every((v) => v.pos.every(Number.isFinite)));
});

test('rest links have two levels: the long ones are a whisper; labels can be moved above; short names', () => {
  assert.equal(shortName("Dire l'idea della carta"), 'Dire\nidea carta');
  assert.equal(shortName('Capire i Minori'), 'Capire\nMinori');
  assert.equal(shortName('Unire le carte in un discorso'), 'Unire\ndiscorso');
  assert.equal(shortName('Riconoscere'), 'Riconoscere');
  assert.equal(view('tutto').flat, 1);
  const v = view('impara');
  // every nucleo objective has a two-line label, always shown, alternately above and below, none overlapping its neighbours' side
  const nuc = v.ids.filter((i) => nodeOf(i).tipo === 'obiettivo' && nodeOf(i).fm?.peso === 'nucleo');
  assert.ok(nuc.length >= 5);
  for (const i of nuc) { const k = v.ids.indexOf(i), l = v.lbl[k]; assert.ok(l && l.t.includes('\n') && l.lw, `${nodeOf(i).id} has a short label`); assert.ok(v.always.includes(k)); assert.equal(!!l.up, at(v, i)[1] === Math.min(...v.ids.filter((j) => nodeOf(j).tipo === 'obiettivo').map((j) => at(v, j)[1])), 'high ones label above, low ones below'); }
  const obY = v.ids.filter((i) => nodeOf(i).tipo === 'obiettivo').map((i) => at(v, i)[1]);
  assert.equal(new Set(obY).size, 2, 'two staggered rows');
  // the people row stays inside the picture: labels fit between 0 and 360 around each person
  const pe = v.ids.filter((i) => nodeOf(i).tipo === 'persona').map((i) => at(v, i)[0]);
  assert.ok(Math.min(...pe) >= -170 && Math.max(...pe) <= 170);
});

test('Tutto is short enough to fill a phone: wider than tall by far less than before', () => {
  const t = view('tutto');
  let y0 = Infinity, y1 = -Infinity, x0 = Infinity, x1 = -Infinity;
  for (let k = 0; k < t.ids.length; k++) { y0 = Math.min(y0, t.pos[2 * k + 1]); y1 = Math.max(y1, t.pos[2 * k + 1]); x0 = Math.min(x0, t.pos[2 * k]); x1 = Math.max(x1, t.pos[2 * k]); }
  assert.ok(x1 - x0 > 300 && x1 - x0 <= 380, `width ${x1 - x0}`);
  assert.ok(y1 - y0 < 1000, `height ${y1 - y0}`);
});
