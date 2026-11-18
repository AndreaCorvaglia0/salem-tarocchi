// The course in the vault (lore/corso/, docs/MANIFESTO.md: law 1 «Poche cose da sapere» and «L'unità di
// crescita: sei cose per ogni concetto»; spec notes/vault/V3-spec.md):
//   checkCorso(V, E, W)      the rules of `lore check` about peso, concetti, the places (sta_in...) and the families
//   corsoModel(V, hasFile)   the six voices of every family, computed from the vault (corpo, motivo, uso and ritorno:
//                            the meccaniche that declare the family in `concetti` and have law 3 / 2 / 5 / 8; spec notes/vault/V4-spec.md)
//   seiVociPage(V, header)   the generated page lore/corso/_sei-voci.md
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { linkTarget } from './vault.mjs';
import { CIRCLE_FAMILIES, OUTSIDE_FAMILIES } from './sapere.mjs';
import { ROOT } from './story.mjs';

export const PESI = ['nucleo', 'contorno'];
export const FAMILY_ORDER = ['arcano', 'seme', 'numero', 'figura', 'stesa', 'regola', 'elemento', 'pianeta', 'segno', 'intenzione', 'erba', 'fumo', 'pietra', 'storia'];
export const VOICES = ['nucleo', 'corpo', 'posto', 'motivo', 'uso', 'ritorno'];
// the laws behind each voice (the number of the law card): motivo = law 2, corpo = law 3, uso = law 5, ritorno = law 8
export const VOICE_LAW = { corpo: 3, motivo: 2, uso: 5, ritorno: 8 };
// the fields of a concept of the circle, required of the nine families of the circle only
export const CIRCLE_FIELDS = ['elemento', 'pianeta', 'intenzioni', 'si_dice', 'da_dove_viene', 'consenso', 'varianti', 'nel_gioco'];
// the place fields and the kind of card each must point to
export const PLACE_FIELDS = { sta_in: 'luogo', arriva_da: 'fatto', la_da: 'persona', si_impara_da: 'persona' };

const asList = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);
const concetti = (V) => V.ofTipo('concetto').filter((d) => d.folder === 'corso/concetti');

export function checkCorso(V, E, W) {
  const docs = concetti(V);
  const families = new Set(docs.map((d) => d.data.famiglia).filter(Boolean));
  for (const d of docs) {
    const x = d.data, f = x.famiglia;
    if (f && ![...CIRCLE_FAMILIES, ...OUTSIDE_FAMILIES].includes(f)) E('concetto.famiglia', d.rel, `famiglia "${f}" is neither of the circle nor listed as outside it (scripts/lore/sapere.mjs)`);
    if ('peso' in x && !PESI.includes(x.peso)) E('peso', d.rel, `\`peso\` must be nucleo or contorno, not "${x.peso}"`);
    if (CIRCLE_FAMILIES.includes(f)) {
      const missing = CIRCLE_FIELDS.filter((k) => !(k in x));
      if (missing.length) E('fields', d.rel, `missing field(s) of a concetto of the circle: ${missing.join(', ')}`);
    } else if (OUTSIDE_FAMILIES.includes(f) && x.peso === 'nucleo' && !String(x.in_breve ?? '').trim()) E('concetto.in_breve', d.rel, 'a concetto of the nucleus needs its `in_breve`, one line');
    for (const [field, tipo] of Object.entries(PLACE_FIELDS)) {
      if (!(field in x) || x[field] == null || x[field] === '') continue;
      const name = linkTarget(x[field]);
      const target = name && V.get(name);
      if (!target) E(`concetto.${field}`, d.rel, `\`${field}\` must be a link to a ${tipo}, like [[...]]; "${x[field]}" does not resolve`);
      else if (target.data?.tipo !== tipo) E(`concetto.${field}`, d.rel, `\`${field}\` points to [[${name}]], which is a ${target.data?.tipo}, not a ${tipo}`);
    }
  }
  // a family has one peso
  for (const f of families) {
    const pesi = new Set(docs.filter((d) => d.data.famiglia === f).map((d) => d.data.peso));
    if (pesi.size > 1) W('peso', `corso/concetti (${f})`, `the family ${f} mixes peso: ${[...pesi].join(', ')}`);
  }
  // a meccanica says which families of the course it touches (`concetti`: obligatory, may be empty)
  for (const d of V.ofTipo('meccanica')) {
    if (!('concetti' in d.data)) continue;
    for (const c of asList(d.data.concetti).filter((x) => x != null && x !== '')) if (!families.has(c)) E('meccanica.concetti', d.rel, `\`concetti\` names "${c}", which is not a family of lore/corso/concetti/ (${[...families].sort().join(', ')})`);
  }
  for (const d of V.ofTipo('obiettivo')) {
    const x = d.data;
    if ('peso' in x && !PESI.includes(x.peso)) E('peso', d.rel, `\`peso\` must be nucleo or contorno, not "${x.peso}"`);
    if ('concetti' in x) {
      const list = asList(x.concetti).filter((c) => c != null && c !== '');
      if (!list.length) E('obiettivo.concetti', d.rel, 'an obiettivo must name the families of concetti it is about (`concetti`)');
      for (const c of list) if (!families.has(c)) E('obiettivo.concetti', d.rel, `\`concetti\` names "${c}", which is not a family of lore/corso/concetti/ (${[...families].sort().join(', ')})`);
    }
  }
}

// ---- the six voices ------------------------------------------------------------------------------
const defaultHasFile = (rel) => existsSync(join(ROOT, rel));
// the image of a concept (a card, a plate), or null
export function imageOf(d, hasFile = defaultHasFile) {
  const x = d.data;
  const tries = x.famiglia === 'arcano' && x.id ? [`public/cards/${x.id}.webp`]
    : x.famiglia === 'erba' ? [`public/herbs/${d.name.replace(/^erba-/, '')}.webp`]
    : x.famiglia === 'pietra' ? [`public/stones/${d.name.replace(/^pietra-/, '')}.webp`, `public/stones/${d.name}.webp`] : [];
  return tries.find((t) => hasFile(t)) || null;
}
export const placeOfConcept = (d) => Object.keys(PLACE_FIELDS).find((k) => d.data[k] != null && d.data[k] !== '') || null;

export function corsoModel(V, hasFile = defaultHasFile) {
  const docs = concetti(V);
  const laws = new Map(V.ofTipo('legge').map((l) => [l.name, l.data.numero]));
  const objs = V.ofTipo('obiettivo');
  const mecc = V.ofTipo('meccanica');
  const names = [...new Set(docs.map((d) => d.data.famiglia))].sort((a, b) => (FAMILY_ORDER.indexOf(a) + 1 || 99) - (FAMILY_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b));
  const fams = names.map((f) => {
    const cs = docs.filter((d) => d.data.famiglia === f).sort((a, b) => a.name.localeCompare(b.name));
    const peso = cs.map((d) => d.data.peso).sort((a, b) => cs.filter((d) => d.data.peso === b).length - cs.filter((d) => d.data.peso === a).length)[0] || null;
    const obj = objs.filter((o) => asList(o.data.concetti).includes(f)).map((o) => o.name);
    const teaching = mecc.filter((m) => asList(m.data.concetti).includes(f));
    const byLaw = (n) => teaching.filter((m) => asList(m.data.leggi).some((l) => laws.get(linkTarget(l)) === n)).map((m) => m.name).sort();
    return {
      famiglia: f, peso, concetti: cs.map((d) => d.name), obiettivi: obj,
      nucleo: cs.filter((d) => String(d.data.in_breve ?? '').trim()).map((d) => d.name),
      immagini: cs.filter((d) => imageOf(d, hasFile)).map((d) => d.name),
      posto: cs.filter((d) => placeOfConcept(d)).map((d) => `${d.name}`),
      corpo: byLaw(VOICE_LAW.corpo), motivo: byLaw(VOICE_LAW.motivo), uso: byLaw(VOICE_LAW.uso), ritorno: byLaw(VOICE_LAW.ritorno),
    };
  });
  const senzaConcetti = objs.filter((o) => !asList(o.data.concetti).filter(Boolean).length).map((o) => o.name);
  const meccSenzaConcetti = mecc.filter((m) => !asList(m.data.concetti).filter(Boolean).length).map((m) => m.name).sort();
  return { fams, senzaConcetti, meccSenzaConcetti, senzaObiettivi: fams.filter((f) => !f.obiettivi.length).map((f) => f.famiglia) };
}

const L = (n) => `[[${n}]]`;
const cell = (f, v) => {
  if (v === 'nucleo') return f.nucleo.length === f.concetti.length ? `sì (${f.nucleo.length}/${f.concetti.length})` : `no (${f.nucleo.length}/${f.concetti.length})`;
  if (v === 'posto') return f.posto.length === f.concetti.length ? `sì (${f.posto.length}/${f.concetti.length})` : f.posto.length ? `in parte (${f.posto.length}/${f.concetti.length})` : 'no';
  if (v === 'corpo') {
    const img = f.immagini.length ? `immagini ${f.immagini.length}/${f.concetti.length}` : '';
    const m = f.corpo.map(L).join(', ');
    return img || m ? `sì: ${[img, m].filter(Boolean).join('; ')}` : 'no';
  }
  return f[v].length ? `sì: ${f[v].map(L).join(', ')}` : 'no';
};
const IMAGE_FAMILIES = ['arcano', 'erba', 'pietra'];

export function seiVociPage(V, header, hasFile) {
  const M = corsoModel(V, hasFile);
  const out = ['# Le sei voci di ogni concetto', '', header, '',
    "L'unità di crescita di `docs/MANIFESTO.md`: un concetto è «dentro» quando ha un **nucleo** (una riga: `in_breve`), un **corpo** (un'immagine vera, o una meccanica della legge 3 che dichiara la famiglia), un **posto** (`sta_in`, `arriva_da`, `la_da` o `si_impara_da`), un **motivo** (una meccanica della legge 2 che dichiara la famiglia), un **uso** (legge 5) e un **ritorno** (legge 8). Una meccanica dichiara una famiglia col suo campo `concetti`: è quella che tocca davvero, secondo la scheda e il codice (non quella degli obiettivi che insegna). Una riga per famiglia; le famiglie sono quelle di `corso/concetti/`, gli obiettivi di una famiglia sono quelli che la nominano in `concetti`. Dove c'è un numero, la voce si conta concetto per concetto (n/N).", ''];
  for (const peso of PESI) {
    const fs = M.fams.filter((f) => f.peso === peso);
    out.push(`## ${peso === 'nucleo' ? 'Il nucleo' : 'Il contorno'}`, '', '| Famiglia | Obiettivi | Nucleo | Corpo | Posto | Motivo | Uso | Ritorno |', '|---|---|---|---|---|---|---|---|');
    for (const f of fs) out.push(`| **${f.famiglia}** (${f.concetti.length}) | ${f.obiettivi.map(L).join(', ') || '**nessuno**'} | ${VOICES.map((v) => cell(f, v)).join(' | ')} |`);
    out.push('');
  }
  out.push('## I buchi', '', '### Concetti senza una voce propria: il posto', '', 'Nessun `sta_in`, `arriva_da`, `la_da` né `si_impara_da` (le famiglie che nel gioco non hanno un posto sono qui in fila intera).', '');
  for (const f of M.fams) {
    const miss = f.concetti.filter((c) => !f.posto.includes(c));
    if (miss.length) out.push(`- **${f.famiglia}** (${miss.length}/${f.concetti.length}): ${miss.length === f.concetti.length ? 'tutti' : miss.map(L).join(', ')}`);
  }
  out.push('', '### Concetti senza una voce propria: il corpo', '', "Per le famiglie che hanno un'immagine o una tavola (arcani, erbe, pietre): quelli che non l'hanno. Le altre famiglie hanno il corpo solo dalle meccaniche (colonna Corpo qui sopra).", '');
  for (const f of M.fams.filter((x) => IMAGE_FAMILIES.includes(x.famiglia))) {
    const miss = f.concetti.filter((c) => !f.immagini.includes(c));
    out.push(`- **${f.famiglia}**: ${miss.length ? miss.map(L).join(', ') : 'nessuno'}`);
  }
  out.push('', '### Voci della famiglia che mancano', '');
  let any = false;
  for (const f of M.fams) {
    const no = VOICES.filter((v) => cell(f, v).startsWith('no'));
    if (no.length) { any = true; out.push(`- **${f.famiglia}**: ${no.join(', ')}`); }
  }
  if (!any) out.push('Nessuna.');
  out.push('', '### Meccaniche che non toccano nessun concetto', '', 'Tengono dentro, non insegnano il corso: è onesto vederle (il campo `concetti` è vuoto).', '');
  out.push(...(M.meccSenzaConcetti.length ? M.meccSenzaConcetti.map((n) => `- ${L(n)}`) : ['Nessuna.']));
  out.push('', '### In fondo', '', `- Obiettivi senza concetti: ${M.senzaConcetti.map(L).join(', ') || 'nessuno'}.`, `- Famiglie senza obiettivi: ${M.senzaObiettivi.join(', ') || 'nessuna'}.`);
  return `${out.join('\n').trimEnd()}\n`;
}
