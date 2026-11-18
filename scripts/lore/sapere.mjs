// The circle of knowledge (lore/corso/concetti/, lore/corso/concetti/_il-cerchio.md): herbs, smoke, stones and tarot hung on a
// few hubs (elements, planets, intentions; the signs bridge the Majors). The vault is the source; this file reads
// it and writes two things that must stay in step with it:
//   src/data/sapere.js                 the same content as plain data, for the game
//   the tables of _il-cerchio.md       between the two markers below
//   readSapere(vault?)  -> { hubs, signs, leaves }       (ids are the vault file names)
//   circle(data)        -> { cells, empty }               which hub has which leaves, per group; empty cells
//   sapereSource(data)  -> text of src/data/sapere.js
//   circleTables(data)  -> the markdown block of the one page
// CLI: node scripts/lore.mjs sapere [--check]
import { loadVault, linkTarget } from './vault.mjs';

export const HUB_FAMILIES = ['elemento', 'pianeta', 'intenzione'];
export const LEAF_FAMILIES = ['seme', 'arcano', 'erba', 'fumo', 'pietra'];
// the four groups of the circle: "the circle closes" when every hub has a leaf in each of them
export const GROUPS = { tarocchi: ['seme', 'arcano'], erbe: ['erba'], fumi: ['fumo'], pietre: ['pietra'] };
// The circle is these nine families (plus the signs, which are hubs for the Majors). The families of the course that
// are not part of the circle are listed here on purpose: they never enter src/data/sapere.js or its tables.
export const CIRCLE_FAMILIES = [...HUB_FAMILIES, 'segno', ...LEAF_FAMILIES];
export const OUTSIDE_FAMILIES = ['numero', 'figura', 'stesa', 'regola', 'storia'];
export const CONSENSO = ['alto', 'medio', 'basso', 'nostro'];
export const START = '<!-- dal vault: inizio (scritto da `node scripts/lore.mjs sapere`, non modificare a mano) -->';
export const END = '<!-- dal vault: fine -->';

// the order of the one page: elements as the suits, planets as the week, intentions as _il-cerchio.md lists them
export const ORDER = [
  'elemento-fuoco', 'elemento-acqua', 'elemento-aria', 'elemento-terra',
  'pianeta-sole', 'pianeta-luna', 'pianeta-marte', 'pianeta-mercurio', 'pianeta-giove', 'pianeta-venere', 'pianeta-saturno',
  'intenzione-protezione', 'intenzione-amore', 'intenzione-sonno-e-sogni', 'intenzione-coraggio', 'intenzione-chiarezza',
  'intenzione-fortuna-e-denaro', 'intenzione-guarigione-e-conforto', 'intenzione-purificare',
  ...['ariete', 'toro', 'gemelli', 'cancro', 'leone', 'vergine', 'bilancia', 'scorpione', 'sagittario', 'capricorno', 'acquario', 'pesci'].map((x) => `segno-${x}`),
  ...['bastoni', 'coppe', 'spade', 'denari'].map((x) => `seme-${x}`),
];
const rank = (e) => {
  const i = ORDER.indexOf(e.id);
  if (i >= 0) return [i, ''];
  return [ORDER.length + LEAF_FAMILIES.indexOf(e.famiglia), e.famiglia === 'arcano' ? e.ref : e.id];
};
const byRank = (a, b) => { const [x, y] = [rank(a), rank(b)]; return x[0] - y[0] || String(x[1]).localeCompare(String(y[1])); };
const groupOf = (famiglia) => Object.keys(GROUPS).find((g) => GROUPS[g].includes(famiglia)) || null;
const one = (v) => (v == null ? null : linkTarget(v));
const many = (v) => (Array.isArray(v) ? v.map(linkTarget).filter(Boolean) : []);

function entry(d) {
  const x = d.data;
  return {
    id: d.name, famiglia: x.famiglia, gruppo: groupOf(x.famiglia), nome: x.nome, ref: x.id ?? null,
    elemento: one(x.elemento), pianeta: one(x.pianeta), segno: one(x.segno), intenzioni: many(x.intenzioni),
    consenso: x.consenso || {}, colore: x.colore ?? null, rischio: x.rischio ?? null,
    erba: one(x.erba), in_breve: x.in_breve,
    ...(x.famiglia === 'pianeta' ? { giorno: x.giorno, metallo: x.metallo, carta: one(x.carta) } : {}),
    ...(x.famiglia === 'segno' ? { arcano: one(x.arcano), seme: one(x.seme) } : {}),
  };
}

export function readSapere(vault = loadVault()) {
  const docs = vault.ofTipo('concetto').filter((d) => d.folder === 'corso/concetti' && CIRCLE_FAMILIES.includes(d.data.famiglia)).sort((a, b) => a.name.localeCompare(b.name));
  const all = docs.map(entry).sort(byRank);
  return {
    hubs: all.filter((e) => HUB_FAMILIES.includes(e.famiglia)),
    signs: all.filter((e) => e.famiglia === 'segno'),
    leaves: all.filter((e) => LEAF_FAMILIES.includes(e.famiglia)),
  };
}

// does leaf L hang on hub H?
export const hangs = (L, H) => (H.famiglia === 'elemento' ? L.elemento === H.id : H.famiglia === 'pianeta' ? L.pianeta === H.id : L.intenzioni.includes(H.id));

export function circle(data) {
  const cells = {}, empty = [];
  for (const H of data.hubs) {
    cells[H.id] = {};
    for (const g of Object.keys(GROUPS)) {
      cells[H.id][g] = data.leaves.filter((L) => L.gruppo === g && hangs(L, H)).map((L) => L.id);
      if (!cells[H.id][g].length) empty.push({ hub: H.id, group: g });
    }
  }
  return { cells, empty };
}

export function sapereSource(data) {
  const row = (e) => `  ${JSON.stringify(e)},`;
  const strip = (e) => Object.fromEntries(Object.entries(e).filter(([, v]) => v !== null && !(Array.isArray(v) && !v.length)));
  return [
    '// Generated by `node scripts/lore.mjs sapere` from lore/corso/concetti/ (the vault is the source): do not edit by hand.',
    '// The circle of herbs, smoke, stones and tarot (lore/corso/concetti/_il-cerchio.md). Ids are the vault file names.',
    '// hubs: elemento | pianeta | intenzione; signs: the bridges of the Majors; leaves: seme | arcano | erba | fumo | pietra.',
    '// consenso per link: alto | medio | basso | nostro (the game chose; no shared tradition). Tested by tests/sapere.test.mjs.',
    `export const SAPERE_GROUPS = ${JSON.stringify(GROUPS)};`,
    'export const SAPERE_HUBS = [', ...data.hubs.map((e) => row(strip(e))), '];',
    'export const SAPERE_SIGNS = [', ...data.signs.map((e) => row(strip(e))), '];',
    'export const SAPERE_LEAVES = [', ...data.leaves.map((e) => row(strip(e))), '];',
    'export const SAPERE = Object.fromEntries([...SAPERE_HUBS, ...SAPERE_SIGNS, ...SAPERE_LEAVES].map((e) => [e.id, e]));',
    "// the leaves of one hub, optionally of one group ('tarocchi', 'erbe', 'fumi', 'pietre')",
    'export const leavesOf = (hubId, group = null) => {',
    '  const H = SAPERE[hubId];',
    "  const on = (L) => (H.famiglia === 'elemento' ? L.elemento === H.id : H.famiglia === 'pianeta' ? L.pianeta === H.id : (L.intenzioni || []).includes(H.id));",
    '  return SAPERE_LEAVES.filter((L) => on(L) && (!group || L.gruppo === group));',
    '};',
    '',
  ].join('\n');
}

// short names for table cells
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const short = (L) => cap(L.nome.replace(/\s*\(.*\)$/, '').replace(/ secc[ao]$/, '').replace(/^Foglie d'/, '').replace(/^Petali di /, ''));
const cell = (data, ids) => ids.map((id) => short(data.leaves.find((l) => l.id === id))).join(', ') || '**vuoto**';

export function circleTables(data) {
  const { cells } = circle(data);
  const G = Object.keys(GROUPS);
  const head = `| | ${G.map((g) => g[0].toUpperCase() + g.slice(1)).join(' | ')} |\n|---|${G.map(() => '---').join('|')}|`;
  const table = (fam, label) => [head, ...data.hubs.filter((h) => h.famiglia === fam).map((h) => `| **${label(h)}** | ${G.map((g) => cell(data, cells[h.id][g])).join(' | ')} |`)].join('\n');
  const signs = ['| Segno | Elemento | Governatore | Carta |', '|---|---|---|---|',
    ...data.signs.map((s) => `| ${s.nome} | ${s.elemento.replace('elemento-', '')} | ${s.pianeta.replace('pianeta-', '')} | ${data.leaves.find((l) => l.id === s.arcano)?.nome} |`)];
  return [START, '',
    '### Elementi', '', table('elemento', (h) => h.nome), '',
    '### Pianeti', '', table('pianeta', (h) => `${h.nome} (${h.giorno})`), '',
    '### Intenzioni', '', table('intenzione', (h) => h.nome), '',
    '### I dodici segni (servono solo per gli Arcani)', '', ...signs, '',
    END].join('\n');
}

// the one page with its block replaced by the tables of `data`
export function withTables(page, data) {
  const a = page.indexOf(START), b = page.indexOf(END);
  if (a < 0 || b < a) throw new Error('_il-cerchio.md: markers not found');
  return page.slice(0, a) + circleTables(data) + page.slice(b + END.length);
}
