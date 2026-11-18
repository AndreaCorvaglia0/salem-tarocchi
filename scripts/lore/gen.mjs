// The generated part of the vault (docs/TOOLS.md, "lore gen"): lore/storia/generati/tratti/, lore/storia/generati/scelte/, lore/storia/generati/finali/,
// written from the story data, never invented. gen(story, vault) -> Map(relative path -> text).
import { AXES, WITCHES, atoms, readsOf, condText, slug, short } from './story.mjs';
import { parseSceneRefs } from './check.mjs';
import { dinamichePage } from './dinamiche.mjs';
import { seiVociPage } from './corso.mjs';

export const HEADER = '# generato da scripts/lore.mjs, non modificare a mano';
export const GEN_DIRS = ['storia/generati/tratti', 'storia/generati/scelte', 'storia/generati/finali'];
const AFFINITY = {
  malva: [['tono', 1], ['rischio', -1], ['guida', 1]],
  ortica: [['rischio', 1], ['parola', 1], ['guida', -1]],
  edera: [['parola', -1], ['esplora', 1], ['guida', -1]],
  ginepra: [['rischio', 1], ['tono', 1], ['guida', 1]],
};
const POLES = { esplora: ['curiosa', 'dritta'], parola: ['schietta', 'accorta'], tono: ['gentile', 'pungente'], rischio: ['audace', 'prudente'], guida: ['cuore', 'testa'] };
// the kinds of state a choice can leave that the story may read back (xp and coins are the economy)
const STATEFUL = new Set(['flag', 'trait', 'trust', 'bond', 'word', 'point', 'suit', 'power', 'card', 'tool', 'step', 'spread', 'lesson']);

// ---- writing ------------------------------------------------------------------------------------------
const q = (v) => (typeof v === 'number' ? String(v) : `"${String(v ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
const obj = (o) => `{ ${Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${q(v)}`).join(', ')} }`;
function page(data, body) {
  const L = ['---', HEADER];
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      if (!v.length) { L.push(`${k}: []`); continue; }
      L.push(`${k}:`);
      for (const x of v) L.push(`  - ${x && typeof x === 'object' ? obj(x) : q(x)}`);
    } else L.push(`${k}: ${v == null ? '' : q(v)}`.trimEnd());
  }
  L.push('---', '', body.trimEnd(), '');
  return L.join('\n');
}

// ---- naming -------------------------------------------------------------------------------------------
export const choiceName = (c) => `${slug(c.file.replace(/\.js$/, ''))}-${slug(c.scene)}-${c.n}`;
const sign = (n) => (n > 0 ? `+${n}` : String(n));
const setText = (s) => {
  switch (s.kind) {
    case 'flag': return s.n === 0 ? `toglie ${s.key}` : `flag ${s.key}`;
    case 'trait': return `${s.key} ${sign(s.n)}`;
    case 'trust': return `fiducia ${s.key} ${sign(s.n)}`;
    case 'bond': return `legame ${s.key} ${sign(s.n)}`;
    case 'point': return `punto ${s.key}`;
    case 'suit': return `seme ${s.key}`;
    case 'coins': return `monete ${sign(s.n)}`;
    case 'xp': return `xp ${sign(s.n)}`;
    default: return `${s.kind} ${s.key}`;
  }
};

export function generate(S, V) {
  const out = new Map();
  // file#scene -> fatto name (the scena field of lore/storia/fatti)
  const factOf = new Map();
  for (const f of V.ofTipo('fatto')) for (const r of parseSceneRefs(f.data.scena)) {
    const k = `${r.file.replace(/^.*\//, '')}#${r.id}`;
    if (!factOf.has(k)) factOf.set(k, f.name);
  }
  const fact = (file, scene) => factOf.get(`${file}#${scene}`) || null;

  // ---- what is read: one predicate per kind of set -----------------------------------------------------
  const readTrait = (ax) => S.readsOf('trait', ax).length > 0;
  const readWitch = (w) => S.readsOf('trust', w).length + S.readsOf('bond', w).length > 0;
  const isRead = (s) => {
    switch (s.kind) {
      case 'flag': return s.n !== 0 && S.flagIsRead(s.key);
      case 'trait': return readTrait(s.key);
      case 'trust': case 'bond': return readWitch(s.key);
      case 'point': case 'suit': return true; // her card and her suit (core/progress.js) are read by the sessions and the finale
      case 'power': return S.readsOf('power', s.key).length > 0;
      case 'card': return S.readsOf('card', s.key).length > 0;
      case 'step': return true;
      case 'word': case 'tool': case 'spread': case 'lesson': return true;
      default: return false;
    }
  };

  // ---- scelte -------------------------------------------------------------------------------------------
  const choiceRows = [];
  const testsInside = (nodes) => {
    for (const n of nodes || []) {
      if (!n || typeof n !== 'object') continue;
      if ('if' in n || Array.isArray(n.observe)) return true;
      if ('choice' in n) continue; // a nested choice is its own page
      if (n.then && testsInside(n.then)) return true;
    }
    return false;
  };
  for (const c of S.choices) {
    const name = choiceName(c);
    const opts = c.options.map((o) => {
      const sets = S.sets.filter((s) => s.file === c.file && s.scene === c.scene && s.choice === c.n && s.opt === o.i);
      return { o, sets, tests: o.when != null || testsInside(o.then) };
    });
    const sets = opts.some((x) => x.sets.some((s) => STATEFUL.has(s.kind) && isRead(s)));
    const tests = opts.some((x) => x.tests);
    const classe = sets && tests ? 'entrambe' : sets ? 'stabilisce' : tests ? 'mette_alla_prova' : 'colore';
    const f = fact(c.file, c.scene);
    choiceRows.push({ c, name, classe, opts, f });
    const opzioni = opts.map(({ o, sets: ss }) => ({ t: short(o.t, 60), quando: o.when != null ? condText(o.when) : undefined, imposta: ss.map(setText).join(', ') || '-' }));
    const lines = opts.map(({ o, sets: ss, tests: tt }, i) => `${i + 1}. «${short(o.t, 60)}»${o.when != null ? ` (solo se ${condText(o.when)})` : ''}: ${ss.map(setText).join(', ') || 'niente'}${tt && o.when == null ? '; quello che segue dipende dallo stato' : ''}.`);
    out.set(`storia/generati/scelte/${name}.md`, page({
      tipo: 'scelta', nome: `Scelta ${c.n} di ${c.scene}`, dove: `${c.file}#${c.scene}`, fatto: f ? `[[${f}]]` : '', classe, opzioni,
    }, `Scelta ${c.n} della scena \`${c.scene}\` (${c.file})${c.conds.length ? `, dentro un ramo: ${c.conds.map(condText).join(' e ')}` : ''}.\n\n${lines.join('\n')}`));
  }

  // ---- tratti -------------------------------------------------------------------------------------------
  const choiceLink = (s) => {
    if (s.choice == null) return undefined;
    const c = S.choices.find((x) => x.file === s.file && x.scene === s.scene && x.n === s.choice);
    return c ? `[[${choiceName(c)}]]` : undefined;
  };
  const setItem = (s) => ({ dove: `${s.file}#${s.scene}`, n: s.n ?? 1, scelta: choiceLink(s) });
  const readItem = (r) => ({ dove: `${r.file}#${r.scene}`, condizione: r.cond != null ? condText(r.cond) : r.op || 'letto' });
  const uniq = (list, key) => { const seen = new Set(); return list.filter((x) => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const traitInfo = [];
  const writeTrait = (id, nome, cosa, setters, readers, note) => {
    const st = setters.map(setItem), mp = uniq(readers.map(readItem), (x) => `${x.dove}|${x.condizione}`);
    traitInfo.push({ id, nome, set: setters.length, read: mp.length, setPlaces: new Set(setters.map((s) => `${s.file}#${s.scene}`)).size });
    out.set(`storia/generati/tratti/tratto-${id}.md`, page({ tipo: 'tratto', nome, cosa, stabilisce: st, mette_alla_prova: mp },
      `${cosa}\n\nLo muovono ${setters.length} punti dei copioni e lo leggono ${mp.length} condizioni.${note ? `\n\n${note}` : ''}`));
  };
  const traitSets = (ax) => S.sets.filter((s) => s.kind === 'trait' && s.key === ax);
  for (const ax of AXES) {
    const plus = traitSets(ax).filter((s) => s.n > 0).length, minus = traitSets(ax).filter((s) => s.n < 0).length;
    writeTrait(ax, `Il tratto ${ax}`, `Un asse del ritratto (core/progress.js AXES): ${POLES[ax][0]} (+) o ${POLES[ax][1]} (-), da -6 a 6.`,
      traitSets(ax), S.readsOf('trait', ax),
      `Verso ${POLES[ax][0]}: ${plus} punti; verso ${POLES[ax][1]}: ${minus} punti. Lo muove anche il codice mentre gioca (glue/traits.js, glue/opinions.js, glue/trials.js), e lo leggono sempre, senza condizioni scritte, la carta che la rappresenta (yourCard), il seme e il ritratto finale (story/portrait.js).`);
  }
  const affUi = [...new Set([...S.code.uses('affinityOf'), ...S.code.uses('attitudeOf')])];
  for (const w of WITCHES) {
    const poles = AFFINITY[w];
    const setters = poles.flatMap(([ax, sg]) => traitSets(ax).map((s) => ({ ...s, n: s.n * sg })));
    writeTrait(`affinita-${w}`, `Affinità con ${w}`, `Quanto ${w} si riconosce in lei (core/witches.js AFFINITY): ${poles.map(([ax, sg]) => POLES[ax][sg > 0 ? 0 : 1]).join(', ')}, più la sua carta. Calcolata dai tratti, mai salvata.`,
      setters, S.readsOf('affinity', w), `Qui \`n\` è il verso rispetto all'affinità: +1 avvicina, -1 allontana.${affUi.length ? ` La mostra il codice: ${affUi.join(', ')}.` : ''}`);
  }
  for (const w of WITCHES) {
    const setters = S.sets.filter((s) => (s.kind === 'trust' || s.kind === 'bond') && s.key === w);
    writeTrait(`legame-${w}`, `Fiducia e legame con ${w}`, `Quello che lei e ${w} hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js).`,
      setters, [...S.readsOf('trust', w), ...S.readsOf('bond', w)], 'Il legame cresce anche dal codice: le prove (glue/trials.js) e le opinioni (glue/opinions.js).');
  }
  writeTrait('popolarita', 'La popolarità', 'Quanto il suo nome gira per Salem (core/bonds.js): cresce con le letture fatte bene (glue/bonds.js addPop).', [], S.readsOf('pop', 'pop'), 'Nessun copione la muove: la muove soltanto il codice delle letture.');
  writeTrait('tartufo', 'Il legame con Tartufo', 'Quanto Tartufo le si è affezionato (core/bonds.js): carezze, bocconcini, posti visti insieme (glue/bonds.js addTartufo).', [], S.readsOf('tartufo', 'tartufo'), 'Nessun copione lo muove: lo muove soltanto il codice (glue/bonds.js, glue/opinions.js).');

  // ---- finali -------------------------------------------------------------------------------------------
  const flagSetters = (f) => S.setsOf('flag', f).filter((s) => !s.data);
  const earn = (cond) => {
    const items = [];
    for (const a of atoms(cond)) for (const r of readsOf(a)) {
      const need = `${a.neg ? 'non ' : ''}${condText({ [a.key]: a.value })}`;
      if (r.kind === 'flag') {
        const ss = flagSetters(r.key);
        if (!ss.length) items.push({ serve: need, dove: S.flagSetByCode(r.key) ? 'dal codice' : 'nessun copione lo imposta' });
        for (const s of ss) items.push({ serve: need, dove: `${s.file}#${s.scene}${choiceLink(s) ? ` ${choiceLink(s)}` : ''}` });
      } else if (r.kind === 'trait') items.push({ serve: need, dove: `[[tratto-${r.key}]]` });
      else if (r.kind === 'trust' || r.kind === 'bond') items.push({ serve: need, dove: `[[tratto-legame-${r.key}]]` });
      else if (r.kind === 'affinity') items.push({ serve: need, dove: `[[tratto-affinita-${r.key}]]` });
      else if (r.kind === 'pop') items.push({ serve: need, dove: '[[tratto-popolarita]]' });
      else if (r.kind === 'tartufo') items.push({ serve: need, dove: '[[tratto-tartufo]]' });
      else if (r.kind === 'power') {
        const ss = S.setsOf('power', r.key);
        items.push({ serve: need, dove: [...ss.map((s) => `${s.file}#${s.scene}`), 'i livelli (core/progress.js LEVEL_GIFTS)'].join(', ') });
      } else if (r.kind === 'stat') items.push({ serve: need, dove: 'il codice dei sistemi (esami, celle, letture: src/systems, src/glue)' });
      else if (r.kind === 'card-of-her') items.push({ serve: need, dove: 'la sua carta, dai tratti e dai punti di tutte le scelte (core/progress.js yourCard)' });
      else items.push({ serve: need, dove: 'stato del gioco' });
    }
    return uniq(items, (x) => `${x.serve}|${x.dove}`);
  };
  const finalRows = [];
  const ENDING = (b) => (b.file === 'end.js' && ['c3.trial', 'f.dawn', 'f.last'].includes(b.scene)) || (b.file === 'sessions.js' && b.scene === 's4');
  const firstLine = (nodes) => { for (const n of nodes || []) { if (n?.t && 'say' in n) return short(n.t, 90); if (n && 'if' in n) { const x = firstLine(n.then); if (x) return x; } } return ''; };
  const byScene = new Map();
  for (const b of S.branches.filter(ENDING)) {
    if (b.kind === 'if-else') continue;
    if (b.kind === 'option' && b.cond == null) continue;
    const k = `${b.file}#${b.scene}`;
    const n = (byScene.get(k) || 0) + 1;
    byScene.set(k, n);
    const name = `finale-${slug(b.scene)}-${n}`;
    let rami, nome;
    if (b.kind === 'if-then') {
      rami = [`se ${condText(b.cond)}: ${firstLine(b.node.then)}`];
      if (Array.isArray(b.node.else)) rami.push(`altrimenti: ${firstLine(b.node.else) || '(un\'altra variante, vedi sotto)'}`);
      nome = `${b.scene}: ${short(firstLine(b.node.then), 50)}`;
    } else if (b.kind === 'option') { rami = [`risposta speciale «${short(b.t, 60)}»`]; nome = `${b.scene}: risposta «${short(b.t, 40)}»`; }
    else { rami = [`osservazione: ${short(b.t, 90)}`]; nome = `${b.scene}: ${short(b.t, 50)}`; }
    const si = earn(b.cond);
    finalRows.push({ name, b, si, cond: condText(b.cond) });
    out.set(`storia/generati/finali/${name}.md`, page({ tipo: 'finale', nome, dove: `${b.file}#${b.scene}`, condizione: condText(b.cond), si_guadagna: si },
      `Una variante del finale in \`${b.scene}\` (${b.file}).\n\n${rami.map((r) => `- ${r}`).join('\n')}\n\nSi legge all'indietro: ogni voce di \`si_guadagna\` dice dove la condizione si conquista.`));
  }
  // the final portrait and the suit (story/portrait.js): one page each, from data/portrait.js
  const P = S.portrait;
  for (const ax of AXES) {
    const p = P.PORTRAIT?.[ax];
    if (!p) continue;
    const name = `finale-ritratto-${ax}`;
    const cond = { trait: [ax, '>=', 3] };
    finalRows.push({ name, b: { file: 'story/portrait.js', scene: 'portraitLines' }, si: [{ serve: `${ax} >= 3, <= -3, in mezzo, o diviso (torn)`, dove: `[[tratto-${ax}]]` }], cond: `${ax}: >= 3 / <= -3 / in mezzo / torn` });
    out.set(`storia/generati/finali/${name}.md`, page({ tipo: 'finale', nome: `Il ritratto finale: ${ax}`, dove: 'story/portrait.js#portraitLines', condizione: condText(cond).replace('>= 3', '>= 3 / <= -3 / in mezzo / torn'), si_guadagna: [{ serve: ax, dove: `[[tratto-${ax}]]` }] },
      `La riga del ritratto finale per l'asse ${ax} (data/portrait.js PORTRAIT.${ax}).\n\n${['plus', 'minus', 'mid', 'torn'].filter((k) => p[k]).map((k) => `- ${k}: ${short(p[k], 90)}`).join('\n')}`));
  }
  if (P.SEEDS) {
    const W = { c: 'coppe: cuore (guida +) e gentile (tono +)', s: 'spade: testa (guida -) e schietta (parola +)', w: 'bastoni: audace (rischio +) e dritta (esplora -)', p: 'denari: prudente (rischio -) e accorta (parola -)' };
    finalRows.push({ name: 'finale-seme', b: { file: 'story/portrait.js', scene: 'portraitLines' }, si: [{ serve: 'il seme più forte', dove: 'i tratti; poi i punti di seme delle scelte' }], cond: 'yourSuit()' });
    out.set('storia/generati/finali/finale-seme.md', page({ tipo: 'finale', nome: 'Il suo seme, nel ritratto finale', dove: 'story/portrait.js#portraitLines', condizione: 'yourSuit() (core/progress.js SUIT_OF_TRAITS)',
      si_guadagna: Object.entries(W).map(([k, t]) => ({ serve: `seme ${k}`, dove: t })) },
    `L'ultima riga del ritratto è il seme (data/portrait.js SEEDS): vince il seme i cui due poli sono più marcati; i punti di seme delle scelte (\`tag\`) contano un decimo, l'elemento del segno rompe la parità.\n\n${Object.keys(P.SEEDS).map((k) => `- ${k}: ${short(typeof P.SEEDS[k] === 'string' ? P.SEEDS[k] : P.SEEDS[k].t, 90)}`).join('\n')}`));
  }
  if (Array.isArray(P.PAIRS)) {
    const si = uniq(P.PAIRS.flatMap((e) => earn(e.when)), (x) => `${x.serve}|${x.dove}`);
    finalRows.push({ name: 'finale-coppie', b: { file: 'story/portrait.js', scene: 'portraitLines' }, si, cond: 'le prime due PAIRS che valgono' });
    out.set('storia/generati/finali/finale-coppie.md', page({ tipo: 'finale', nome: 'Le coppie di tratti nel ritratto finale', dove: 'story/portrait.js#portraitLines', condizione: 'le prime due PAIRS che valgono', si_guadagna: si },
      `Dopo gli assi, il ritratto dice le prime due coppie di tratti che valgono (data/portrait.js PAIRS).\n\n${P.PAIRS.map((e) => `- ${condText(e.when)}: ${short(e.t, 80)}`).join('\n')}`));
  }
  // the table, readable backwards
  const T = ['# Tabella dei finali', '', HEADER.replace(/^# /, '_') + '_', '', 'Ogni riga è una variante del finale: dove si vede, che cosa chiede, dove si guadagna (prime tre voci; il resto nella pagina).', '',
    '| Variante | Dove | Condizione | Si guadagna |', '|---|---|---|---|'];
  for (const r of finalRows) {
    const si = r.si.slice(0, 3).map((x) => `${x.serve}: ${x.dove}`).join('; ') + (r.si.length > 3 ? `; … (+${r.si.length - 3})` : '');
    T.push(`| [[${r.name}]] | ${r.b.file}#${r.b.scene} | ${r.cond.replace(/\|/g, '/')} | ${si.replace(/\|/g, '/')} |`);
  }
  out.set('storia/generati/finali/_tabella-finali.md', `${T.join('\n')}\n`);

  // ---- the index of the choices -----------------------------------------------------------------------
  const counts = {};
  for (const r of choiceRows) counts[r.classe] = (counts[r.classe] || 0) + 1;
  const flagsSet = new Set(S.sets.filter((s) => s.kind === 'flag' && s.n !== 0).map((s) => s.key));
  const flagsRead = new Set(S.reads.filter((r) => r.kind === 'flag').map((r) => r.key));
  const neverRead = [...flagsSet].filter((f) => !S.flagIsRead(f)).sort();
  const neverSet = [...flagsRead].filter((f) => !S.flagIsSet(f)).sort();
  const setNotTested = traitInfo.filter((t) => t.set > 0 && t.read === 0);
  const testedThin = traitInfo.filter((t) => t.read > 0 && t.setPlaces < 3);
  const I = ['# Indice delle scelte', '', HEADER.replace(/^# /, '_') + '_', '',
    `${choiceRows.length} scelte nei copioni, nelle sedute e nelle visite. Classe: \`stabilisce\` (lascia qualcosa che la storia rilegge), \`mette_alla_prova\` (le risposte o il seguito dipendono dallo stato), \`entrambe\`, \`colore\` (niente delle due).`, '',
    '| Classe | Scelte |', '|---|---:|', ...['stabilisce', 'mette_alla_prova', 'entrambe', 'colore'].map((k) => `| ${k} | ${counts[k] || 0} |`), '',
    '## Tratti mossi e mai messi alla prova', '', ...(setNotTested.length ? setNotTested.map((t) => `- [[tratto-${t.id}]] (${t.set} punti)${t.id.startsWith('affinita-') && affUi.length ? `: nessuna condizione la legge; la mostra ${affUi.join(', ')}` : ''}`) : ['Nessuno.']), '',
    '## Tratti messi alla prova ma mossi in meno di tre posti', '', ...(testedThin.length ? testedThin.map((t) => `- [[tratto-${t.id}]]: letto da ${t.read} condizioni, mosso in ${t.setPlaces} scene${t.setPlaces === 0 ? ' (solo dal codice)' : ''}`) : ['Nessuno.']), '',
    '## Flag impostati e mai letti', '', 'Né da una condizione, né per nome dal codice (src fuori da src/data).', '', ...(neverRead.length ? neverRead.map((f) => `- \`${f}\`: ${[...new Set(flagSetters(f).map((s) => `${s.file}#${s.scene}`))].slice(0, 3).join(', ')}`) : ['Nessuno.']), '',
    '## Flag letti e mai impostati', '', ...(neverSet.length ? neverSet.map((f) => `- \`${f}\``) : ['Nessuno.']), '',
    '## Tutte le scelte', '', '| Scelta | Classe | Fatto |', '|---|---|---|',
    ...choiceRows.map((r) => `| [[${r.name}]] | ${r.classe} | ${r.f ? `[[${r.f}]]` : ''} |`)];
  out.set('storia/generati/scelte/_indice-scelte.md', `${I.join('\n')}\n`);
  // the dynamics page: the mechanics grouped by the rows of the manifesto's table, with their two faces
  out.set('metodo/meccaniche/_dinamiche.md', dinamichePage(V, `${HEADER.replace(/^# /, '_')}_`));
  out.set('corso/_sei-voci.md', seiVociPage(V, `${HEADER.replace(/^# /, '_')}_`));
  out.summary = { choices: choiceRows.length, counts, neverRead, neverSet, setNotTested: setNotTested.map((t) => t.id), testedThin: testedThin.map((t) => `${t.id} (${t.setPlaces})`), finals: finalRows.length, traits: traitInfo.length };
  return out;
}
