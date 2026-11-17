// The lore viewer (lore-site/, served at <site>/lore/): its data is built from the real vault, every link
// resolves or is flagged, backlinks mirror links, and the build emits the page and its data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadVault, vaultOf, docOf, linksIn } from '../scripts/lore/vault.mjs';
import { buildSite, siteFiles, graphColors, SPLIT_AT } from '../scripts/lore/site.mjs';
import { md } from '../lore-site/md.js';
import { layout } from '../lore-site/layout.js';
import { lorePlugin } from '../vite.config.js';

const vault = loadVault();
const site = buildSite(vault);
const { data } = site;
const byId = new Map(data.notes.map((n) => [n.id, n]));

test('every file of the vault is a note, with a type, a title and a place in the graph', () => {
  assert.equal(data.notes.length, new Set(vault.docs.map((d) => d.name)).size);
  for (const n of data.notes) {
    assert.ok(n.id && n.tipo && n.title, n.id);
    assert.ok(data.types.some((t) => t.tipo === n.tipo), `${n.id}: type ${n.tipo} has no chip`);
    assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y), `${n.id} has no position`);
  }
  assert.equal(data.home, 'inizio');
  assert.equal(data.types.reduce((s, t) => s + t.count, 0), data.notes.length);
  for (const t of ['persona', 'retroscena', 'fatto', 'meccanica', 'tratto', 'scelta', 'finale']) assert.ok(byId.size && data.types.find((x) => x.tipo === t), t);
  assert.equal(byId.get('ortica').title, 'Ortica');
  assert.equal(byId.get('ortica-retroscena').title, 'Ortica: retroscena');
  assert.equal(byId.get('ortica-retroscena').hidden, true);
});

test('the colours come from the Obsidian graph settings; choices and endings start hidden', () => {
  const c = graphColors('{"colorGroups":[{"query":"path:persone/","color":{"a":1,"rgb":14711391}}]}');
  assert.equal(c.persone, '#e07a5f');
  assert.equal(data.types.find((t) => t.tipo === 'persona').color, '#e07a5f');
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
  const pairs = new Set();
  for (const n of data.notes) for (const l of n.links) pairs.add([n.id, l].sort().join(' '));
  assert.equal(data.edges.length, pairs.size);
  for (const [a, b] of data.edges) assert.ok(pairs.has([data.notes[a].id, data.notes[b].id].sort().join(' ')));
});

test('the data stays one file while it is small, and splits the bodies when it is not', () => {
  assert.ok(!data.bodies || site.bodies, 'bodies flagged but not produced');
  if (!data.bodies) assert.ok(JSON.stringify(data).length <= SPLIT_AT);
  const big = vaultOf([docOf('persone/a.md', `---\ntipo: persona\nnome: "A"\n---\n${'parola '.repeat(260000)} [[b]]`), docOf('luoghi/b.md', '---\ntipo: luogo\nnome: "B"\n---\nqui')]);
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
  for (const f of ['lore/index.html', 'lore/data.json', 'lore/app.js', 'lore/graph.js', 'lore/md.js', 'lore/layout.js', 'lore/style.css']) assert.ok(files.has(f), f);
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
