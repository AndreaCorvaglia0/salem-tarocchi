// The lore linter (docs/TOOLS.md, "lore check"): the vault against itself and against the story data.
//   check(vault, story) -> { errors: [{ rule, file, msg }], warnings: [...], stats: {...} }
// Errors are things that are certainly wrong (a missing field, a broken link, a flag that does not exist).
// Warnings are things worth a look that may be fine (a flag without a fatto, a principle nobody serves).
import { linkTarget, linksIn } from './vault.mjs';
import { atoms, readsOf } from './story.mjs';
import { DINAMICA_IDS } from './dinamiche.mjs';
import { checkCorso } from './corso.mjs';

const NAME_RE = /^_?[a-z0-9]+(-[a-z0-9]+)*$/;
const empty = (v) => v == null || v === '' || (Array.isArray(v) && v.filter((x) => x != null && x !== '').length === 0);

// ---- the `flag` field of a fatto: "step c1.malva → c1.read; flag malva.wood / malva.cheeky" ----------
// Returns the clauses it understands; anything else is kept as `unchecked` (said in docs/TOOLS.md).
export function parseFactFlags(text) {
  const out = { steps: [], flags: [], sessions: [], cast: [], stats: [], unchecked: [], loose: [] };
  for (const raw of String(text ?? '').replace(/\([^)]*\)/g, ' ').split(';')) {
    const clause = raw.trim();
    if (!clause) continue;
    const m = /^(step|flag|session|cast|stat)\s+(.*)$/.exec(clause);
    // a clause without a keyword is not checked; its dotted names may still name a flag (`lesson.minors.1`)
    if (!m) { out.unchecked.push(clause); out.loose.push(...clause.split(/[\s,/→]+/).filter((t) => /^[a-z][\w-]*(\.[\w-]+)+$/.test(t))); continue; }
    const toks = m[2].split(/[\s,/→]+/).map((t) => t.trim()).filter(Boolean).filter((t) => !t.includes('<'));
    const key = { step: 'steps', flag: 'flags', session: 'sessions', cast: 'cast', stat: 'stats' }[m[1]];
    out[key].push(...toks);
  }
  return out;
}

// "c1.js#c1.malva, c1.read; systems/exam.js" -> [{ file: 'c1.js', id: 'c1.malva' }, { file: 'c1.js', id: 'c1.read' }]
export function parseSceneRefs(text) {
  const out = [];
  let file = null;
  for (const part of String(text ?? '').split(/[;,]/)) {
    const p = part.trim().replace(/\s*\(.*$/, '');
    const m = /^([\w./-]+\.js)#([\w.*[\]-]+)$/.exec(p);
    if (m) { file = m[1]; out.push({ file, id: m[2] }); continue; }
    if (file && /^[a-z][\w.-]*$/.test(p) && p.includes('.')) out.push({ file, id: p });
    else file = null;
  }
  return out;
}
// every `file.js#id` mentioned anywhere in a free text
export const refsInText = (text) => [...String(text ?? '').matchAll(/([\w/-]+\.js)#([a-z][\w.-]*[\w])/g)].map((m) => ({ file: m[1], id: m[2] }));

export function check(V, S) {
  const errors = [], warnings = [], stats = {};
  const E = (rule, file, msg) => errors.push({ rule, file, msg });
  const W = (rule, file, msg) => warnings.push({ rule, file, msg });

  // ---- 1. shape: tipo, required fields, folder, names ------------------------------------------
  const folderTipo = Object.fromEntries(Object.entries(V.types).map(([t, v]) => [v.folder, t]));
  for (const d of V.docs) {
    for (const e of d.errors) E('frontmatter', d.rel, `line ${e.line}: ${e.msg}`);
    if (!NAME_RE.test(d.name)) E('name', d.rel, 'file name must be lowercase letters, digits and hyphens (no accents, no spaces)');
    if (d.index) continue; // index pages: frontmatter optional
    if (!d.data) { E('tipo', d.rel, 'no frontmatter (--- ... ---)'); continue; }
    const tipo = d.data.tipo;
    if (empty(tipo)) { E('tipo', d.rel, 'missing `tipo`'); continue; }
    const T = V.types[tipo];
    if (!T) { W('tipo', d.rel, `tipo "${tipo}" has no row in lore/README.md, its fields are not checked`); continue; }
    if (folderTipo[d.folder] && folderTipo[d.folder] !== tipo) E('tipo', d.rel, `tipo "${tipo}" in folder ${d.folder}/ (README says ${folderTipo[d.folder]})`);
    const missing = T.fields.filter((f) => !(f in d.data));
    if (missing.length) E('fields', d.rel, `missing field(s) of ${tipo}: ${missing.join(', ')}`);
  }
  for (const [name, list] of V.byName) if (list.length > 1) E('name', list.map((d) => d.rel).join(', '), `file name "${name}" is not unique`);

  // ---- 2. links -----------------------------------------------------------------------------------
  let links = 0;
  for (const d of V.docs) for (const l of d.links) { links += 1; if (!V.byName.has(l)) E('link', d.rel, `[[${l}]] does not resolve`); }
  stats.links = links;

  // ---- 3. fatti against the story -------------------------------------------------------------------
  const stepIds = new Set(S.STEPS.map((s) => s.id));
  const castIds = new Set(S.CAST.map((c) => c.id));
  const known = S.allFlags();
  const flagExists = (f) => known.has(f) || S.flagIsSet(f) || S.flagReadByCode(f);
  const wild = (f) => new RegExp(`^${f.replace(/[.+?^$()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
  const factFlags = new Set(), factWild = [];
  let checkedTokens = 0, uncheckedClauses = 0;
  for (const d of V.ofTipo('fatto')) {
    const p = parseFactFlags(d.data.flag);
    uncheckedClauses += p.unchecked.length;
    for (const s of p.steps) { checkedTokens += 1; if (!stepIds.has(s)) E('fatto.step', d.rel, `step "${s}" is not in STEPS (src/data/story/steps.js)`); }
    for (const f of p.flags) {
      checkedTokens += 1;
      if (f.includes('*')) { factWild.push(wild(f)); if (![...known].some((k) => wild(f).test(k))) E('fatto.flag', d.rel, `no flag matches "${f}"`); continue; }
      factFlags.add(f);
      if (!flagExists(f)) E('fatto.flag', d.rel, `flag "${f}" is never set nor read by the story or the code`);
    }
    for (const f of p.loose) factFlags.add(f);
    for (const s of p.sessions) { checkedTokens += 1; if (!S.SESSIONS[s]) E('fatto.session', d.rel, `session "${s}" does not exist`); }
    for (const c of p.cast) { checkedTokens += 1; if (!castIds.has(c)) E('fatto.cast', d.rel, `cast entry "${c}" does not exist`); }
    for (const r of parseSceneRefs(d.data.scena)) {
      const file = r.file.replace(/^.*\//, '');
      const scenes = file === 'clients.js' ? { ...S.byFile[file], ...Object.fromEntries(S.CLIENTS.map((c) => [c.id, 1])) } : S.byFile[file];
      if (scenes && !r.id.includes('*') && !r.id.includes('[') && !scenes[r.id]) W('fatto.scena', d.rel, `scene "${r.file}#${r.id}" not found in ${file}`);
    }
  }
  stats.factTokensChecked = checkedTokens; stats.factClausesUnchecked = uncheckedClauses;
  // every flag set by a scene of the story and tested by a condition elsewhere should have its fatto
  const inFact = (f) => factFlags.has(f) || factWild.some((re) => re.test(f));
  const storySet = new Map();
  for (const s of S.sets) if (s.kind === 'flag' && !s.data && s.file !== 'visits.js') { if (!storySet.has(s.key)) storySet.set(s.key, s); }
  const noFact = [];
  for (const [f, s] of storySet) {
    const tested = S.readsOf('flag', f).some((r) => r.scene !== s.scene || r.file !== s.file);
    if (tested && !inFact(f)) noFact.push(f);
  }
  for (const f of noFact.sort()) { const s = storySet.get(f); W('fatto.missing', `${s.file}#${s.scene}`, `flag "${f}" is set here and tested elsewhere, but no fatto names it`); }
  stats.flagsWithoutFact = noFact.length;

  // ---- 4. persone: ids that claim to be the code's ---------------------------------------------------
  const codeIds = new Set(['tu', 'narra']);
  for (const l of S.lines) if (typeof l.who === 'string') codeIds.add(l.who);
  for (const c of S.CAST) { codeIds.add(c.id); if (c.who) codeIds.add(c.who); }
  for (const c of S.CLIENTS) codeIds.add(c.id);
  for (const p of S.opinions.PEOPLE_OP || []) codeIds.add(p.id);
  for (const k of Object.keys(S.byFile)) for (const id of Object.keys(S.byFile[k])) codeIds.add(id);
  for (const d of V.ofTipo('persona')) {
    const id = d.data.id;
    if (empty(id)) continue;
    for (const one of String(id).split(/\s*[,/]\s*/)) if (!codeIds.has(one)) E('persona.id', d.rel, `id "${one}" is not a speaker, a CAST entry, a client or a script of the code`);
  }

  // ---- 5. continuity: who knows a fact, and from which scene ------------------------------------------
  const cont = continuity(V, S);
  for (const v of cont.violations) E('continuity', v.file, v.msg);
  stats.continuity = cont.stats;

  // ---- 6. the design graph ----------------------------------------------------------------------------
  const served = new Set();
  for (const d of V.ofTipo('meccanica')) {
    const serve = (d.data.serve || []).map(linkTarget).filter(Boolean);
    if (!serve.length) E('meccanica.serve', d.rel, 'a meccanica must serve at least one principio (`serve`)');
    serve.forEach((s) => served.add(s));
    for (const s of serve) { const t = V.get(s); if (t && t.data?.tipo !== 'principio') E('meccanica.serve', d.rel, `[[${s}]] in serve is a ${t.data?.tipo}, not a principio`); }
  }
  for (const d of V.ofTipo('obiettivo')) {
    if (empty(d.data.meccaniche) && empty(d.data.aperto)) E('obiettivo', d.rel, 'an obiettivo needs at least one meccanica, or says what is missing in `aperto`');
  }
  for (const d of V.ofTipo('principio')) if (!served.has(d.name)) W('principio', d.rel, 'no meccanica serves this principio');

  // ---- 7. the laws and the two faces (lore/metodo/leggi/, docs/MANIFESTO.md) -----------------------------
  // Every principio, tecnica and ricetta hangs from a law (`legge`, and optionally `anche`); every meccanica has a
  // dynamic, its laws, and its two faces: `motivo` (why she does it, in the game) and `effetto` (what it does for
  // learning). A missing field is already an error of rule `fields` (the README table); here a field that is
  // there but empty, or that points nowhere, or is not a law.
  const laws = new Set(V.ofTipo('legge').map((d) => d.name));
  const lawOf = (d, field, v) => {
    const name = linkTarget(v);
    if (!name) { E('legge', d.rel, `\`${field}\` must be a link to a legge, like [[legge-il-concetto-e-una-chiave]]`); return null; }
    if (!laws.has(name)) { E('legge', d.rel, `[[${name}]] in \`${field}\` is not a legge (lore/metodo/leggi/)`); return null; }
    return name;
  };
  const byLaw = new Map([...laws].map((l) => [l, []]));
  for (const tipo of ['principio', 'tecnica', 'ricetta']) {
    for (const d of V.ofTipo(tipo)) {
      if ('legge' in d.data) { const l = lawOf(d, 'legge', d.data.legge); if (l) byLaw.get(l).push(d); }
      if (!empty(d.data.anche)) { const l = lawOf(d, 'anche', d.data.anche); if (l) byLaw.get(l).push(d); }
    }
  }
  const seenFace = { motivo: new Map(), effetto: new Map() };
  for (const d of V.ofTipo('meccanica')) {
    if ('dinamica' in d.data && !DINAMICA_IDS.includes(d.data.dinamica)) E('meccanica.dinamica', d.rel, `dinamica "${d.data.dinamica}" is not one of the seventeen of the manifesto (scripts/lore/dinamiche.mjs)`);
    if ('leggi' in d.data) {
      const ls = (Array.isArray(d.data.leggi) ? d.data.leggi : [d.data.leggi]).filter((x) => !empty(x));
      if (!ls.length) E('meccanica.leggi', d.rel, 'a meccanica must name at least one legge (`leggi`)');
      for (const x of ls) lawOf(d, 'leggi', x);
    }
    for (const f of ['motivo', 'effetto']) {
      if (!(f in d.data)) continue;
      if (empty(d.data[f])) { E(`meccanica.${f}`, d.rel, `a meccanica needs its \`${f}\`: one line, in the words of this mechanic`); continue; }
      const words = String(d.data[f]).trim().split(/\s+/).length;
      if (words > 20) W(`meccanica.${f}`, d.rel, `\`${f}\` has ${words} words (at most 20)`);
      const key = String(d.data[f]).trim().toLowerCase();
      if (seenFace[f].has(key)) W(`meccanica.${f}`, d.rel, `same \`${f}\` as [[${seenFace[f].get(key)}]]: say what this mechanic does`);
      else seenFace[f].set(key, d.name);
    }
  }
  // a law that no technique rests on is worth a look; 10 and 11 are about how the game is built, not about learning
  const NO_TECNICA_OK = new Set(['legge-strati-indipendenti', 'legge-chiaro-vero-curato']);
  for (const [l, ds] of byLaw) if (!NO_TECNICA_OK.has(l) && !ds.some((d) => d.data.tipo === 'tecnica')) W('legge', `metodo/leggi/${l}.md`, 'no tecnica rests on this legge');
  stats.leggi = Object.fromEntries([...byLaw].map(([l, ds]) => [l, ds.length]));

  // ---- the course: peso, concetti, places, families (scripts/lore/corso.mjs)
  checkCorso(V, E, W);

  return { errors, warnings, stats };
}

// ---- continuity ---------------------------------------------------------------------------------------
// A claim: person P knows fact F from scene(s) S. Sources: persone `sa` ({ fatto, da }: da is a fatto, its
// `scena` gives the scenes) and fatti `chi_lo_sa` ({ chi, come }: the `file.js#scene` written in `come`).
// F happens at a main-path step (the step of the CAST entry that plays F's scene). S can play from its
// earliest step (its CAST conditions: step, stepIn, chapter, chapterMin; or the scene that calls or jumps
// to it). A violation: S can play at a step BEFORE F has happened (earliest(S) <= step(F), S is not F's own
// scene) and nothing in S (its conditions or its CAST entry) tests a flag or step of F. Anything that
// cannot be placed on the main path is skipped and counted, never guessed.
export function continuity(V, S) {
  const stats = { claims: 0, checked: 0, skipped: 0, guarded: 0, violations: 0 };
  const violations = [];
  const STEPS = S.STEPS, idx = S.stepIndex;
  const firstOfChapter = (c) => { const i = STEPS.findIndex((s) => s.chapter >= c); return i < 0 ? Infinity : i; };
  const callers = new Map(); // scene id -> [scene ids that goto it or call it as a session]
  for (const g of S.gotos) { if (!callers.has(g.to)) callers.set(g.to, []); callers.get(g.to).push(g.scene); }
  for (const g of S.sessionsCalled) { if (!callers.has(g.id)) callers.set(g.id, []); callers.get(g.id).push(g.scene); }
  // the earliest step a scene can play at, or null when unknown
  const memo = new Map();
  const earliest = (id, seen = new Set()) => {
    if (memo.has(id)) return memo.get(id);
    if (seen.has(id)) return null;
    seen.add(id);
    const bounds = [];
    for (const c of S.CAST.filter((x) => x.script === id)) {
      let lo = null;
      for (const a of atoms(c.when)) {
        if (a.neg) continue;
        let b = null;
        if (a.key === 'step') b = idx[a.value];
        else if (a.key === 'stepIn') b = Math.min(...a.value.map((s) => idx[s] ?? Infinity));
        else if (a.key === 'chapter' || a.key === 'chapterMin') b = firstOfChapter(a.value);
        if (b != null && Number.isFinite(b)) lo = lo == null ? b : Math.max(lo, b);
      }
      bounds.push(lo);
    }
    for (const c of callers.get(id) || []) bounds.push(earliest(c, seen));
    const r = bounds.length && bounds.every((b) => b != null) ? Math.min(...bounds) : null;
    memo.set(id, r);
    return r;
  };
  // the step at which a scene certainly plays (a main-path scene: one CAST entry with { step })
  const stepOfScene = (id) => {
    const cs = S.CAST.filter((x) => x.script === id);
    const steps = cs.map((c) => atoms(c.when).find((a) => a.key === 'step' && !a.neg)?.value).filter(Boolean);
    if (steps.length && steps.length === cs.length) return Math.max(...steps.map((s) => idx[s] ?? -1));
    const call = callers.get(id);
    if (call?.length === 1) return stepOfScene(call[0]);
    return null;
  };
  const factScenes = (fatto) => parseSceneRefs(fatto?.data?.scena).map((r) => r.id);
  const claims = [];
  for (const p of V.ofTipo('persona')) for (const s of p.data.sa || []) {
    if (!s || typeof s !== 'object') continue;
    const F = V.get(linkTarget(s.fatto)), D = V.get(linkTarget(s.da));
    const scenes = D?.data?.tipo === 'fatto' ? factScenes(D) : refsInText(s.come).map((r) => r.id);
    claims.push({ who: p.name, F, scenes, file: p.rel, how: `sa ${linkTarget(s.fatto)} da ${linkTarget(s.da)}` });
  }
  for (const f of V.ofTipo('fatto')) for (const c of f.data.chi_lo_sa || []) {
    if (!c || typeof c !== 'object') continue;
    claims.push({ who: linkTarget(c.chi), F: f, scenes: refsInText(c.come).map((r) => r.id), file: f.rel, how: `chi_lo_sa ${linkTarget(c.chi)}` });
  }
  for (const c of claims) {
    stats.claims += 1;
    if (!c.F || !c.scenes.length) { stats.skipped += 1; continue; }
    const fScenes = factScenes(c.F);
    const fSteps = fScenes.map(stepOfScene).filter((x) => x != null);
    if (!fSteps.length) { stats.skipped += 1; continue; }
    const fStep = Math.min(...fSteps);
    const p = parseFactFlags(c.F.data.flag);
    for (const sid of c.scenes) {
      if (fScenes.includes(sid)) { stats.checked += 1; continue; }
      const e = earliest(sid);
      if (e == null) { stats.skipped += 1; continue; }
      stats.checked += 1;
      if (e > fStep) continue;
      // a guard: the scene (or its CAST entry) tests a flag of F, or a step at or after F's
      const reads = [...S.reads.filter((r) => r.scene === sid), ...S.CAST.filter((x) => x.script === sid).flatMap((x) => atoms(x.when).flatMap(readsOf))];
      const guarded = reads.some((r) => (r.kind === 'flag' && p.flags.includes(r.key)) || (r.kind === 'step' && (idx[r.key] ?? -1) > fStep));
      if (guarded) { stats.guarded += 1; continue; }
      stats.violations += 1;
      violations.push({ file: c.file, msg: `${c.who} knows [[${c.F.name}]] from ${sid}, but ${sid} can play at step ${STEPS[e].id}, before the fact (step ${STEPS[fStep].id}), and does not test its flags (${c.how})` });
    }
  }
  return { violations, stats };
}
