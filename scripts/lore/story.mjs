// The story as the tools see it: every scene of the scripts, sessions and visits walked once, with what each
// node says, sets and reads, and where (file#scene). Pure: reads the data modules, never runs the game.
// Used by scripts/lore.mjs (check, gen) and scripts/coverage.mjs.
//   const S = await loadStory();
//   S.scenes   [{ file, id, kind, nodes }]
//   S.lines    [{ file, scene, who, t, conds }]                 conds: the conditions on the path to the line
//   S.choices  [{ file, scene, n, conds, node, options: [{ i, t, when, special, sets, reads, then }] }]
//   S.sets     [{ kind, key, n, file, scene, choice?, opt? }]   kind: flag trait trust bond step stat power card ...
//   S.reads    [{ kind, key, op, n, file, scene, cond }]
//   S.branches [{ id, file, scene, kind, cond, node }]         every conditional piece (if-then, if-else, option, observe, entry)
//   S.code     { flagSet: Set, flagSetPatterns: [RegExp], literals: Map(literal -> Set(files)) }  from src/ outside src/data
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(ROOT, 'src');
const STORY = join(SRC, 'data', 'story');

export const AXES = ['esplora', 'parola', 'tono', 'rischio', 'guida'];
export const WITCHES = ['malva', 'ortica', 'edera', 'ginepra'];
// the keys under which the data keeps a condition (core/cond.js shapes)
export const COND_KEYS = new Set(['when', 'if', 'done', 'met', 'ready', 'unless']);

const walkFiles = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walkFiles(p) : p.endsWith('.js') ? [p] : [];
});

// ---- conditions -------------------------------------------------------------------------------------
// atoms(cond) -> [{ key, value, neg }]: the leaves of a condition (not/any flattened; neg marks a `not`)
export function atoms(cond, neg = false, out = []) {
  if (cond == null || cond === true || cond === false) return out;
  if (Array.isArray(cond)) { for (const c of cond) atoms(c, neg, out); return out; }
  if (typeof cond !== 'object') return out;
  for (const [k, v] of Object.entries(cond)) {
    if (k === 'not') atoms(v, !neg, out);
    else if (k === 'any') atoms(v, neg, out);
    else out.push({ key: k, value: v, neg });
  }
  return out;
}

// what an atom reads, as { kind, key, op?, n? } (several for affinity/bond/attitude objects)
export function readsOf(atom) {
  const { key: k, value: v } = atom;
  const neg = atom.neg;
  switch (k) {
    case 'flag': return [{ kind: 'flag', key: v, op: neg ? 'unset' : 'set' }];
    case 'notFlag': return [{ kind: 'flag', key: v, op: neg ? 'set' : 'unset' }];
    case 'trait': case 'trend': return [{ kind: 'trait', key: v[0], op: v[1], n: v[2], how: k }];
    case 'steady': case 'turned': case 'torn': return [{ kind: 'trait', key: v, op: k, how: k }];
    case 'trust': return [{ kind: 'trust', key: v[0], op: v[1], n: v[2] }];
    case 'affinity': return Object.entries(v || {}).map(([w, n]) => ({ kind: 'affinity', key: w, op: '>=', n }));
    case 'bond': return Object.entries(v || {}).map(([w, n]) => ({ kind: 'bond', key: w, op: '>=', n }));
    case 'attitude': return Object.entries(v || {}).flatMap(([w, a]) => [{ kind: 'affinity', key: w, op: a }, { kind: 'bond', key: w, op: a }]);
    case 'pop': return [{ kind: 'pop', key: 'pop', op: '>=', n: v }];
    case 'tartufo': return [{ kind: 'tartufo', key: 'tartufo', op: '>=', n: v }];
    case 'stat': return [{ kind: 'stat', key: v[0], op: v[1], n: v[2] }];
    case 'step': return [{ kind: 'step', key: v }];
    case 'stepIn': return v.map((s) => ({ kind: 'step', key: s }));
    case 'power': return [{ kind: 'power', key: v }];
    case 'has': case 'lacks': case 'studied': case 'wrote': return [{ kind: 'card', key: v }];
    case 'trial': return [{ kind: 'trial', key: Array.isArray(v) ? v[0] : v }];
    case 'yourCard': case 'verdict': case 'yourCardIsBirth': return [{ kind: 'card-of-her', key: String(v) }];
    default: return [{ kind: k, key: typeof v === 'object' ? JSON.stringify(v) : String(v) }];
  }
}

// short Italian-free description of a condition, for the generated pages: flag b1.spoke, trait rischio >= 3 ...
export function condText(cond) {
  if (cond == null || cond === true) return 'sempre';
  const one = (c) => {
    if (Array.isArray(c)) return c.map(one).join(' e ');
    if (typeof c !== 'object') return String(c);
    return Object.entries(c).map(([k, v]) => {
      if (k === 'not') return `non (${one(v)})`;
      if (k === 'any') return `(${v.map(one).join(' o ')})`;
      if (Array.isArray(v)) return `${k} ${v.join(' ')}`;
      if (v && typeof v === 'object') return `${k} ${Object.entries(v).map(([a, b]) => `${a} ${b}`).join(', ')}`;
      return `${k} ${v}`;
    }).join(' e ');
  };
  return one(cond);
}

// ---- the walk -------------------------------------------------------------------------------------
export function createModel() {
  return { scenes: [], lines: [], choices: [], sets: [], reads: [], branches: [], gotos: [], sessionsCalled: [] };
}

function addReads(M, cond, where) {
  for (const a of atoms(cond)) for (const r of readsOf(a)) M.reads.push({ ...r, ...where, cond });
}

// what an option sets by itself (o.flag, o.trait, o.trust, o.tag)
function optionSets(o) {
  const out = [];
  if (o.flag) out.push({ kind: 'flag', key: o.flag, n: 1 });
  for (const [k, n] of Object.entries(o.trait || {})) out.push({ kind: 'trait', key: k, n });
  for (const [k, n] of Object.entries(o.trust || {})) out.push({ kind: 'trust', key: k, n });
  if (o.tag && typeof o.tag === 'object') {
    if (o.tag.card) out.push({ kind: 'point', key: o.tag.card, n: 1 });
    if (o.tag.suit) out.push({ kind: 'suit', key: o.tag.suit, n: 1 });
  }
  return out;
}

// what a `do` node sets
function actionSets(n) {
  switch (n.do) {
    case 'flag': return [{ kind: 'flag', key: n.k, n: n.v === false ? 0 : 1 }];
    case 'trait': {
      const d = n.trait && typeof n.trait === 'object' ? n.trait : Object.fromEntries(AXES.filter((k) => k in n).map((k) => [k, n[k]]));
      return Object.entries(d).map(([k, v]) => ({ kind: 'trait', key: k, n: v }));
    }
    case 'trust': return [{ kind: 'trust', key: n.who, n: n.n }];
    case 'bond': return [{ kind: 'bond', key: n.who, n: n.n }];
    case 'step': return [{ kind: 'step', key: n.id }];
    case 'chapter': return [{ kind: 'chapter', key: String(n.n) }];
    case 'power': return [{ kind: 'power', key: n.id }];
    case 'giveCard': return [{ kind: 'card', key: n.id }];
    case 'tool': return [{ kind: 'tool', key: n.id, n: n.n ?? 1 }];
    case 'coins': return [{ kind: 'coins', key: 'coins', n: n.n }];
    case 'xp': return [{ kind: 'xp', key: 'xp', n: n.n }];
    case 'word': return [{ kind: 'word', key: n.k }];
    case 'point': return [{ kind: 'point', key: n.card, n: 1 }, ...(n.suit ? [{ kind: 'suit', key: n.suit, n: 1 }] : [])];
    case 'exam': return [{ kind: 'flag', key: 'exam.passed', n: 1 }];
    case 'teach': return [{ kind: 'spread', key: n.spread }];
    case 'lesson': return [{ kind: 'lesson', key: n.id }];
    default: return [];
  }
}

// Walks a list of story nodes. ctx: { file, scene, conds, choice, opt }. Returns nothing; fills M.
export function walkNodes(M, nodes, ctx) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;
    const where = { file: ctx.file, scene: ctx.scene };
    if ('say' in node) { M.lines.push({ ...where, who: node.say, t: node.t, conds: ctx.conds, node }); continue; }
    if ('choice' in node && Array.isArray(node.choice)) {
      const n = (ctx.counter.n += 1);
      const options = node.choice.filter(Boolean).map((o, i) => {
        const sets = optionSets(o);
        return { i, t: o.t, when: o.when, special: o.special || null, sets, then: o.then || [], node: o };
      });
      const ch = { ...where, n, conds: ctx.conds, node, options };
      M.choices.push(ch);
      options.forEach((o) => {
        if (o.when != null) addReads(M, o.when, { ...where, choice: n, opt: o.i });
        for (const s of o.sets) M.sets.push({ ...s, ...where, choice: n, opt: o.i });
        M.branches.push({ id: `${where.file}#${where.scene}#c${n}.${o.i}`, ...where, kind: 'option', cond: o.when ?? null, conds: ctx.conds, node: o.node, choice: n, opt: o.i, t: o.t });
        walkNodes(M, o.then, { ...ctx, conds: [...ctx.conds, ...(o.when != null ? [o.when] : [])], choice: n, opt: o.i, inChoice: ch });
      });
      continue;
    }
    if ('if' in node) {
      const k = (ctx.counter.if += 1);
      addReads(M, node.if, { ...where, choice: ctx.choice, opt: ctx.opt });
      M.branches.push({ id: `${where.file}#${where.scene}#if${k}`, ...where, kind: 'if-then', cond: node.if, conds: ctx.conds, node });
      walkNodes(M, node.then, { ...ctx, conds: [...ctx.conds, node.if] });
      if (Array.isArray(node.else)) {
        M.branches.push({ id: `${where.file}#${where.scene}#if${k}.else`, ...where, kind: 'if-else', cond: { not: node.if }, conds: ctx.conds, node });
        walkNodes(M, node.else, { ...ctx, conds: [...ctx.conds, { not: node.if }] });
      }
      continue;
    }
    if ('do' in node) {
      for (const s of actionSets(node)) M.sets.push({ ...s, ...where, choice: ctx.choice, opt: ctx.opt, conds: ctx.conds });
      if (node.do === 'goto') M.gotos.push({ ...where, to: node.script });
      if (node.do === 'session') M.sessionsCalled.push({ ...where, id: node.id });
      continue;
    }
    if (Array.isArray(node.observe)) {
      node.observe.forEach((e, i) => {
        if (!e) return;
        addReads(M, e.when, where);
        const id = `${where.file}#${where.scene}#obs${(ctx.counter.obs += 1)}`;
        M.branches.push({ id, ...where, kind: 'observe', cond: e.when, conds: ctx.conds, node: e, t: e.t });
        if (e.t) M.lines.push({ ...where, who: ctx.speaker || 'lettrice', t: e.t, conds: [...ctx.conds, e.when], node: e });
        walkNodes(M, e.then, { ...ctx, conds: [...ctx.conds, e.when] });
      });
      continue;
    }
    if (node.pick) { walkNodes(M, node.then, ctx); continue; }
    if (node.portrait) { for (const k of AXES) M.reads.push({ kind: 'trait', key: k, op: 'portrait', ...where, cond: null }); continue; }
    // ask / turn / symbol / tableau / shuffle: the session's own nodes, nothing to read or set here
  }
}

const sceneOf = (M, file, id, kind, nodes, extra = {}) => {
  M.scenes.push({ file, id, kind, nodes, ...extra });
  walkNodes(M, nodes, { file, scene: id, conds: [], counter: { n: 0, if: 0, obs: 0 }, ...extra });
};

// the generic walk of a data module that is not a script: conditions under COND_KEYS are reads,
// `flag: 'x'` beside other keys is a setter (trials, elsewhere), `trait: {}` a trait setter
function walkData(M, value, where, path = '', seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) { value.forEach((v, i) => walkData(M, v, where, `${path}[${i}]`, seen)); return; }
  for (const [k, v] of Object.entries(value)) {
    if (COND_KEYS.has(k)) { addReads(M, v, { ...where, scene: where.scene || path }); continue; }
    if (k === 'flag' && typeof v === 'string') M.sets.push({ kind: 'flag', key: v, n: 1, ...where, scene: where.scene || path, data: true });
    else if (k === 'trait' && v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [ax, n] of Object.entries(v)) if (AXES.includes(ax)) M.sets.push({ kind: 'trait', key: ax, n, ...where, scene: where.scene || path, data: true });
    } else if (k === 'bond' && v && typeof v === 'object' && v.who) M.sets.push({ kind: 'bond', key: v.who, n: v.n, ...where, scene: where.scene || path, data: true });
    else walkData(M, v, where, path ? `${path}.${k}` : k, seen);
  }
}

// ---- the code outside the data: who sets and reads flags by name ------------------------------------
export function scanCode() {
  const files = walkFiles(SRC).filter((f) => !f.startsWith(join(SRC, 'data') + '/'));
  const flagSet = new Set(), flagSetPatterns = [], literals = new Map(), readPatterns = [], dataKeys = new Set(), texts = new Map();
  const toPattern = (tpl) => new RegExp(`^${tpl.split(/\$\{[^}]*\}/).map((p) => p.replace(/[.*+?^$()|[\]\\]/g, '\\$&')).join('.+')}$`);
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const rel = relative(SRC, f);
    texts.set(rel, text);
    for (const m of text.matchAll(/(?:setFlag\(|flags\[)\s*(['"`])((?:(?!\1).)*)\1/g)) {
      // a write: setFlag('x') or flags['x'] = ...
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 12);
      const isWrite = m[0].startsWith('setFlag') || /^\s*\]\s*=[^=]/.test(after);
      if (!isWrite) continue;
      if (m[1] === '`' && m[2].includes('${')) flagSetPatterns.push({ re: toPattern(m[2]), file: rel, src: m[2] });
      else flagSet.add(m[2]);
    }
    for (const m of text.matchAll(/(['"`])([a-z][\w-]*(?:\.[\w-]+)+)\1/g)) {
      if (!literals.has(m[2])) literals.set(m[2], new Set());
      literals.get(m[2]).add(rel);
    }
    // a template with a hole reads (or writes) a family of names: `leaf.${kind}.`, `client.${id}.done`
    for (const m of text.matchAll(/`([a-z][\w-]*\.[\w.-]*\$\{[^`]*)`/g)) readPatterns.push({ re: toPattern(m[1].endsWith('.') ? `${m[1]}\${x}` : m[1]), file: rel, src: m[1] });
  }
  // the data keeps some lines by flag name ({ 'enc.hale': '...' }): the code looks them up by that name
  for (const f of walkFiles(join(SRC, 'data'))) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/(['"])([a-z][\w-]*(?:\.[\w-]+)+)\1\s*:/g)) dataKeys.add(m[2]);
  }
  // uses(name): the code files (outside src/data and src/core) that call a function by that name
  const uses = (name) => [...texts].filter(([f, t]) => !f.startsWith('core/') && new RegExp(`\\b${name}\\(`).test(t)).map(([f]) => f).sort();
  return { flagSet, flagSetPatterns, literals, readPatterns, dataKeys, uses };
}

// ---- load everything --------------------------------------------------------------------------------
const imp = (p) => import(pathToFileURL(p).href);

export async function loadStory() {
  const M = createModel();
  const scripts = {
    'c0.js': ['C0'], 'c1.js': ['C1'], 'c1b.js': ['C1B'], 'c2.js': ['C2'], 'c3.js': ['C3'], 'end.js': ['END'], 'post.js': ['POST'],
    'props.js': ['PROPS'], 'lessons.js': ['LESSON_SCRIPTS'], 'trials.js': ['TRIAL_SCRIPTS'], 'garden.js': ['GARDEN_SCRIPTS'],
    'garden-lessons.js': ['GARDEN_LESSON_SCRIPTS'],
  };
  const byFile = {};
  for (const [file, names] of Object.entries(scripts)) {
    const mod = await imp(join(STORY, 'scripts', file));
    byFile[file] = {};
    for (const name of names) for (const [id, nodes] of Object.entries(mod[name] || {})) { byFile[file][id] = nodes; sceneOf(M, file, id, 'script', nodes); }
  }
  const clients = await imp(join(STORY, 'clients.js'));
  byFile['clients.js'] = {};
  for (const [id, nodes] of Object.entries(clients.CLIENT_SCRIPTS)) { byFile['clients.js'][id] = nodes; sceneOf(M, 'clients.js', id, 'script', nodes); }
  const opinions = await imp(join(STORY, 'opinions.js'));
  byFile['opinions.js'] = {};
  for (const [id, nodes] of Object.entries(opinions.OPINION_SCRIPTS || {})) { byFile['opinions.js'][id] = nodes; sceneOf(M, 'opinions.js', id, 'script', nodes); }
  const sessions = await imp(join(STORY, 'sessions.js'));
  byFile['sessions.js'] = {};
  for (const [id, nodes] of Object.entries(sessions.SESSIONS)) { byFile['sessions.js'][id] = nodes; sceneOf(M, 'sessions.js', id, 'session', nodes, { speaker: 'lettrice' }); }
  // the visits: four lists of remarks (each a conditional line), and one question per card
  const V = await imp(join(STORY, 'visits.js'));
  for (const list of ['OPENERS', 'THREAD', 'RITUALS', 'CLOSERS']) {
    const id = list.toLowerCase();
    const nodes = [{ observe: V[list] }];
    sceneOf(M, 'visits.js', id, 'visit', nodes, { speaker: 'lettrice' });
  }
  for (const [card, T] of Object.entries(V.TALK)) {
    if (!T.ask) continue;
    const nodes = [{ say: 'lettrice', t: T.ask.q }, { choice: T.ask.a.map((a) => ({ t: a.t, trait: a.trait, then: a.re ? [{ say: 'lettrice', t: a.re }] : [] })) }];
    sceneOf(M, 'visits.js', `talk.${card}`, 'visit', nodes);
  }
  // the rest of the data: conditions and setters by shape
  const story = await imp(join(STORY, 'index.js'));
  const dataFiles = walkFiles(join(SRC, 'data')).filter((f) => !f.startsWith(join(STORY, 'scripts')) && !/\/(sessions|visits|clients|opinions|index|h)\.js$/.test(f));
  for (const f of dataFiles) {
    let mod;
    try { mod = await imp(f); } catch { continue; }
    const file = relative(join(SRC, 'data'), f).replace(/^story\//, '');
    for (const [name, value] of Object.entries(mod)) if (value && typeof value === 'object') walkData(M, value, { file, scene: '' }, name);
  }
  // clients.js and opinions.js data parts (not the scripts)
  walkData(M, clients.CLIENTS, { file: 'clients.js', scene: '' }, 'CLIENTS');
  for (const [name, value] of Object.entries(opinions)) if (name !== 'OPINION_SCRIPTS' && value && typeof value === 'object') walkData(M, value, { file: 'opinions.js', scene: '' }, name);
  const portrait = await imp(join(SRC, 'data', 'portrait.js'));
  M.code = scanCode();
  M.byFile = byFile;
  M.STEPS = story.STEPS; M.CAST = story.CAST; M.SIDE = story.SIDE; M.SESSIONS = story.SESSIONS; M.SCRIPTS = story.SCRIPTS;
  M.CLIENTS = clients.CLIENTS; M.portrait = portrait; M.visits = V; M.opinions = opinions;
  M.stepIndex = Object.fromEntries(story.STEPS.map((s, i) => [s.id, i]));
  return finish(M);
}

// indexes the model once it is filled
export function finish(M) {
  const idx = (list) => {
    const m = new Map();
    for (const x of list) { const k = `${x.kind}:${x.key}`; if (!m.has(k)) m.set(k, []); m.get(k).push(x); }
    return m;
  };
  M.setIndex = idx(M.sets);
  M.readIndex = idx(M.reads);
  M.setsOf = (kind, key) => M.setIndex.get(`${kind}:${key}`) || [];
  M.readsOf = (kind, key) => M.readIndex.get(`${kind}:${key}`) || [];
  M.sceneById = new Map(M.scenes.map((s) => [`${s.file}#${s.id}`, s]));
  M.scenesNamed = (id) => M.scenes.filter((s) => s.id === id);
  // a flag is SET when the data sets it, or the code writes it (literally or by a template)
  M.flagSetByCode = (f) => M.code.flagSet.has(f) || M.code.flagSetPatterns.some((p) => p.re.test(f));
  M.flagIsSet = (f) => M.setsOf('flag', f).length > 0 || M.flagSetByCode(f);
  // a flag is READ when a condition reads it, or its name appears in the code as a string (conservative)
  M.flagReadByCode = (f) => M.code.literals.has(f) || M.code.dataKeys.has(f) || M.code.readPatterns.some((p) => p.re.test(f));
  M.flagIsRead = (f) => M.readsOf('flag', f).length > 0 || M.flagReadByCode(f);
  M.allFlags = () => new Set([...M.sets, ...M.reads].filter((x) => x.kind === 'flag').map((x) => x.key));
  return M;
}

export const where = (x) => `${x.file}#${x.scene}`;
export const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const short = (t, n = 60) => { const s = String(t ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? `${s.slice(0, n - 1)}…` : s; };
export { basename };
