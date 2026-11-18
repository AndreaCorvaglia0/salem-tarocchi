// The names of the links, in one place. A link comes from a frontmatter field (serve, insegna, ...) or from
// the text of the note ('testo'); the card of a node groups its neighbours by these names.
//   LINKS[field] = [what the note that holds the field does to the other, the same seen from the other side]
// «{lo}» is replaced by lo / la / lo according to the type of the selected note (see phrase()).
export const LINKS = {
  serve: ['serve', '{lo} mette in pratica'],
  insegna: ['insegna', '{lo} insegna'],
  tecniche: ['usa la tecnica', '{lo} usa'],
  dove_la_usiamo: ['la usiamo in', 'usa la tecnica'],
  in_salem: ['in Salem', '{lo} applica'],
  legge: ['viene dalla legge', 'ne discende'],
  leggi: ['viene dalla legge', 'ne discende'],
  meccaniche: ['si verifica con', 'si verifica qui'],
  chi_ci_vive: ['ci vive', 'vive in'],
  luoghi: ['frequenta', 'ci va'],
  conseguenze: ['ha per conseguenza', 'ne è conseguenza'],
  chi_c_e: ['ci sono', "c'è in"],
  chi_lo_sa: ['lo sanno', 'sa'],
  sa: ['sa', 'lo sanno'],
  arco: ['il suo arco', "fa parte dell'arco di"],
  legami: ['è legata a', 'è legata a'],
  persona: ['è il retroscena di', 'il suo retroscena'],
  persone: ['riguarda', 'ne parla'],
  intenzioni: ['ha per intenzione', 'è intenzione di'],
  elemento: ['ha per elemento', "è l'elemento di"],
  pianeta: ['ha per pianeta', 'governa'],
  segno: ['ha per segno', 'è segno di'],
  segni: ['ha per segni', 'è segno di'],
  seme: ['ha per seme', 'è il seme di'],
  arcano: ['ha per arcano', "è l'arcano di"],
  carta: ['ha per carta', 'è la carta di'],
  erba: ['ha per erba', "è l'erba di"],
  nel_gioco: ['nel gioco', 'nel gioco ci sono'],
  sta_in: ['sta in', 'qui si trova'],
  arriva_da: ['arriva da', 'da qui arriva'],
  la_da: ['la dà', 'dà'],
  si_impara_da: ['si impara da', 'insegna'],
  famiglia: ['della famiglia', 'ne fanno parte'],
  riguarda: ['riguarda', '{lo} riguarda'],
  tocca: ['tocca', 'la tocca'], // a meccanica -> a family of concepts (the field `concetti` of a meccanica)
  testo: ['cita', '{lo} cita'],
};
const FEMININE = new Set(['legge', 'tecnica', 'ricetta', 'meccanica', 'decisione', 'famiglia']);
const pron = (tipo) => (FEMININE.has(tipo) ? 'la' : 'lo');
const human = (f) => String(f).replace(/_/g, ' ');

// the heading of a group of neighbours: `dir` 'out' (the selected note holds the field) or 'in'
export function phrase(field, dir, tipo = '') {
  const e = LINKS[field];
  const t = e ? e[dir === 'out' ? 0 : 1] : dir === 'out' ? human(field) : `${human(field)} (da)`;
  return t.replace('{lo}', pron(tipo));
}

// What the card of node `i` lists: its neighbours grouped under the name of the link, each once (under the first
// link that names it), the ones it holds first, then the ones that point to it. A link that the vault no longer
// writes on this side (dove_la_usiamo, meccaniche) is still there as the other side's: a tecnica lists the
// meccaniche that use it through `tecniche` («la usa»), an obiettivo those that teach it through `insegna`.
// A legge lists the meccaniche first («nel gioco»), then what it becomes in the method.
//   groupLinks(i, { adj, fields, nodeAt, accept }) -> [{ h, items: [index] }]
const BELOW_LAW = { meccanica: 0, principio: 1, tecnica: 2, ricetta: 3 };
export function groupLinks(i, { adj, fields, nodeAt, accept = () => true }) {
  const tipo = nodeAt(i).tipo, groups = new Map(), shown = new Set([i]);
  for (const dir of ['out', 'in']) {
    for (const e of adj[i]) {
      if (e.out !== (dir === 'out') || shown.has(e.o) || !accept(e.o)) continue;
      shown.add(e.o);
      const f = fields[e.f];
      let h = phrase(f, dir, tipo);
      if (tipo === 'legge' && dir === 'in' && (f === 'legge' || f === 'leggi')) h = nodeAt(e.o).tipo === 'meccanica' ? 'nel gioco' : 'si traduce in';
      const key = `${dir}:${h}`;
      if (!groups.has(key)) groups.set(key, { key, h, items: [] });
      groups.get(key).items.push(e.o);
    }
  }
  const out = [...groups.values()];
  if (tipo === 'legge') out.sort((a, b) => Number(b.h === 'nel gioco') - Number(a.h === 'nel gioco'));
  for (const g of out) if (tipo === 'legge') g.items.sort((a, b) => (BELOW_LAW[nodeAt(a).tipo] ?? 9) - (BELOW_LAW[nodeAt(b).tipo] ?? 9));
  return out;
}
