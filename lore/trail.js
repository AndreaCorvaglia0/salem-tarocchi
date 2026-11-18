// «Perché c'è»: one or two short lines for a selected note, computed from the links the vault really has:
// upward to the law, downward toward the world. A note with no path says nothing.
//   trail(i, { nodeAt, adj, fields }) -> ['Legge 5 · Il concetto è una chiave → Leggere ai clienti', 'Leggere ai clienti → insegna: …']
// adj[i] = [{ o: other, f: field index, out: true when i holds the field }]; nodeAt(i) = { tipo, title, fm }.
const MAX = 2;

export function trail(i, { nodeAt, adj, fields }) {
  const n = nodeAt(i);
  const via = (j, names, out, tipo) => adj[j].filter((e) => e.out === out && names.includes(fields[e.f]) && (!tipo || nodeAt(e.o).tipo === tipo)).map((e) => e.o).filter((x, k, a) => a.indexOf(x) === k);
  const name = (j) => nodeAt(j).title.replace(/ · \d+$/, '');
  const list = (js) => js.slice(0, MAX).map(name).join(', ') + (js.length > MAX ? ` (+${js.length - MAX})` : '');
  const law = (j) => `Legge ${nodeAt(j).fm?.numero ?? ''}${nodeAt(j).fm?.numero != null ? ' · ' : ''}${name(j)}`;
  const lawsOf = (j) => via(j, ['legge', 'leggi'], true, 'legge').sort((a, b) => (nodeAt(a).fm?.numero ?? 99) - (nodeAt(b).fm?.numero ?? 99));
  const lines = [];
  const t = n.tipo;
  if (t === 'meccanica') {
    const laws = lawsOf(i), obj = via(i, ['insegna'], true, 'obiettivo');
    if (laws.length) lines.push(`${law(laws[0])}${laws.length > 1 ? ` (+${laws.length - 1})` : ''} → ${name(i)}`);
    if (obj.length) lines.push(`${name(i)} → insegna: ${list(obj)}`);
    else if (!laws.length) return [];
  } else if (t === 'principio' || t === 'tecnica' || t === 'ricetta') {
    const laws = lawsOf(i);
    const mech = adj[i].filter((e) => ['serve', 'tecniche', 'dove_la_usiamo', 'in_salem'].includes(fields[e.f]) && nodeAt(e.o).tipo === 'meccanica').map((e) => e.o).filter((x, k, a) => a.indexOf(x) === k);
    if (!laws.length) return [];
    lines.push(`${law(laws[0])} → ${name(i)}`);
    if (mech.length) lines.push(`${name(i)} → in Salem: ${list(mech)}`);
  } else if (t === 'legge') {
    const cnt = {};
    for (const e of adj[i]) if (!e.out && ['legge', 'leggi'].includes(fields[e.f])) { const k = nodeAt(e.o).tipo; (cnt[k] ||= new Set()).add(e.o); }
    const pl = { principio: ['principio', 'principi'], tecnica: ['tecnica', 'tecniche'], ricetta: ['ricetta', 'ricette'], meccanica: ['meccanica', 'meccaniche'] };
    const part = (ks) => ks.filter((k) => cnt[k]).map((k) => `${cnt[k].size} ${pl[k][cnt[k].size === 1 ? 0 : 1]}`).join(', ');
    const a = part(['principio', 'tecnica', 'ricetta']), b = part(['meccanica']);
    if (a) lines.push(`${law(i)} → si traduce in ${a}`);
    if (b) lines.push(`${a ? '→ ' : `${law(i)} → `}nel gioco: ${b}`);
  } else if (t === 'obiettivo') {
    const mech = via(i, ['insegna'], false, 'meccanica'), fam = via(i, ['riguarda'], true, 'famiglia');
    const laws = mech.length ? lawsOf(mech[0]) : [];
    if (laws.length) lines.push(`${law(laws[0])} → ${name(mech[0])}${mech.length > 1 ? ` (+${mech.length - 1})` : ''} → insegna: ${name(i)}`);
    if (fam.length) lines.push(`${name(i)} → riguarda: ${list(fam)}`);
  } else if (t === 'concetto') {
    const hub = via(i, ['famiglia'], true, 'famiglia')[0];
    const obj = hub != null ? via(hub, ['riguarda'], false, 'obiettivo') : [];
    const mech = obj.length ? via(obj[0], ['insegna'], false, 'meccanica') : [];
    const laws = mech.length ? lawsOf(mech[0]) : [];
    const lu = via(i, ['sta_in'], true, 'luogo'), te = via(i, ['si_impara_da', 'la_da'], true, 'persona');
    if (obj.length) lines.push(`Obiettivo: ${list(obj)}${mech.length ? ` ← ${name(mech[0])}${laws.length ? ` (legge ${nodeAt(laws[0]).fm?.numero ?? ''})` : ''}` : ''}`);
    const down = [lu.length ? `sta in: ${list(lu)}` : '', te.length ? `${adj[i].some((e) => fields[e.f] === 'la_da') ? 'la dà' : 'si impara da'}: ${list(te)}` : '', hub != null ? `famiglia: ${name(hub)}` : ''].filter(Boolean).join(' · ');
    if (down) lines.push(down);
  } else if (t === 'famiglia') {
    const obj = via(i, ['riguarda'], false, 'obiettivo');
    if (obj.length) lines.push(`Obiettivi che la riguardano: ${list(obj)}`);
  } else if (t === 'luogo') {
    const con = via(i, ['sta_in'], false, 'concetto'), pe = via(i, ['chi_ci_vive'], true, 'persona');
    if (con.length) lines.push(`Qui si trovano: ${list(con)}`);
    if (pe.length) lines.push(`Ci vivono: ${list(pe)}`);
  }
  return lines;
}
