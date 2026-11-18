// The scope of a card of the method (lore/README.md, `ambito`; spec notes/vault/V4-spec.md): `generale` (true of any
// game made with the method) or `salem` (true of this game). The check below is the list of the generalising work
// still to do, so it only warns: a general card that links to a card of Salem (a `salem` card, or a card of corso/ or
// storia/) or that names Salem or its main people, outside the fields declared «of Salem».
import { linkTarget, linksIn } from './vault.mjs';

export const AMBITI = ['generale', 'salem'];
// the fields that are about Salem by definition: what a general card says of Salem goes here
export const SALEM_FIELDS = ['in_salem', 'dove_manca', 'si_controlla_con', 'lezioni', 'aperto'];
// the words of Salem: the place and the main people
export const SALEM_WORDS = ['Salem', 'Malva', 'Ortica', 'Edera', 'Ginepra', 'Tartufo', 'Lettrice'];
const WORD_RE = new RegExp(`\\b(${SALEM_WORDS.join('|')})\\b`, 'g');

const strings = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
};

// one card -> { links: [names of Salem cards it links to], words: { word: count } } outside the Salem fields
export function salemIn(V, d) {
  const text = [...Object.entries(d.data).filter(([k]) => !SALEM_FIELDS.includes(k)).flatMap(([, v]) => strings(v)), d.body || ''].join('\n');
  const links = [...new Set(linksIn(text))].filter((n) => {
    const t = V.get(n);
    return t && t !== d && (t.data?.ambito === 'salem' || t.zone === 'corso' || t.zone === 'storia');
  }).sort();
  const words = {};
  for (const m of text.replace(/\[\[[^\]]*\]\]/g, ' ').matchAll(WORD_RE)) words[m[1]] = (words[m[1]] || 0) + 1;
  return { links, words };
}

export function checkAmbito(V, E, W) {
  const stats = { generali: 0, salem: 0, conSalem: 0, peggiori: [] };
  const rows = [];
  for (const d of V.docs) {
    if (d.index || !d.data || d.zone !== 'metodo' || !('ambito' in d.data)) continue;
    if (!AMBITI.includes(d.data.ambito)) { E('ambito', d.rel, `\`ambito\` must be generale or salem, not "${d.data.ambito}"`); continue; }
    if (d.data.ambito === 'salem') { stats.salem += 1; continue; }
    stats.generali += 1;
    const s = salemIn(V, d);
    const nWords = Object.values(s.words).reduce((a, b) => a + b, 0);
    if (!s.links.length && !nWords) continue;
    const parts = [];
    if (s.links.length) parts.push(`links to Salem cards: ${s.links.map((n) => `[[${n}]]`).join(', ')}`);
    if (nWords) parts.push(`words: ${Object.entries(s.words).map(([w, n]) => `${w} x${n}`).join(', ')}`);
    W('ambito', d.rel, `a general card that still talks about Salem (${parts.join('; ')})`);
    rows.push({ file: d.rel, score: s.links.length + nWords });
  }
  stats.conSalem = rows.length;
  stats.peggiori = rows.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file)).slice(0, 5);
  return stats;
}
