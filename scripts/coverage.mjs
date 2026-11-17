// Coverage of the story by random play (docs/TOOLS.md, "coverage"): the whole story played N times with
// random answers through the real runner (scripts/lore/play.mjs), half of the runs as a newcomer and half
// with everything around her unlocked (popularity, Tartufo, trust, the broom), and for every conditional
// piece of the scripts (a branch of an IF, an option, an observation of the Reader, a remark of a visit)
// the number of runs in which it was shown. Seeded: the same N gives the same page.
//   node scripts/coverage.mjs [--runs 1000] [--seed 1] [--check]   writes docs/COVERAGE.md (--check: only prints)
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadStory, ROOT, AXES, condText, short } from './lore/story.mjs';
import { createPlayer } from './lore/play.mjs';

const OUT = join(ROOT, 'docs', 'COVERAGE.md');
// main-path scenes: the script of the CAST entry that plays at each step of STEPS
export const mainScenes = (M) => {
  const out = new Set();
  for (const s of M.STEPS) {
    const e = M.CAST.find((c) => c.at === s.at && JSON.stringify(c.when) === JSON.stringify({ step: s.id }));
    if (e && !e.script.startsWith('client.')) out.add(M.scenes.find((x) => x.id === e.script && x.kind === 'script') ? `${M.scenes.find((x) => x.id === e.script).file}#${e.script}` : e.script);
  }
  return out;
};

export async function measure({ runs = 1000, seed = 1, model = null } = {}) {
  const M = model || await loadStory();
  const P = createPlayer(M);
  const count = new Map(), scenes = new Map(), warnings = [];
  const traits = Object.fromEntries(AXES.map((k) => [k, new Map()]));
  const trust = {}, cards = new Map(), suits = new Map();
  let ended = 0;
  const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (let i = 0; i < runs; i++) {
    const r = await P.play(seed * 100003 + i, { rich: i % 2 === 1 });
    if (r.ended) ended += 1;
    warnings.push(...r.warnings.map((w) => `run ${i}: ${w}`));
    for (const id of r.shown) inc(count, id);
    for (const id of r.scenes) inc(scenes, id);
    for (const k of AXES) inc(traits[k], r.end.traits[k] || 0);
    for (const [w, n] of Object.entries(r.end.trust)) { trust[w] ||= new Map(); inc(trust[w], n); }
    inc(cards, r.end.card); inc(suits, r.end.suit);
  }
  // the units: every branch (options counted when offered) of every scene
  const units = M.branches.map((b) => ({ ...b, n: count.get(b.kind === 'option' ? `${b.id}:shown` : b.id) || 0, taken: b.kind === 'option' ? count.get(b.id) || 0 : null }));
  const sceneUnits = M.scenes.map((s) => ({ key: `${s.file}#${s.id}`, s, n: scenes.get(`${s.file}#${s.id}`) || 0 }));
  return { M, runs, seed, ended, warnings, units, sceneUnits, traits, trust, cards, suits, main: mainScenes(M) };
}

// what random play cannot reach by construction: the scene's file, and why
const BY_CONSTRUCTION = [
  [/^lessons\.js#/, 'the lessons are offered by glue/lessons.js (flags `*.offered`), which the player does not run'],
  [/^garden(-lessons)?\.js#/, 'the garden is opened by glue/garden.js on days of play'],
  [/^opinions\.js#/, 'the opinions are asked from the grimoire (glue/opinions.js), not from the story'],
  [/^props\.js#/, 'the props (shop, deposit, bed) are systems with their own screens'],
  [/^trials\.js#/, 'the trials themselves (src/trials) are not played, so the doors that wait on an earlier trial\'s outcome (`trial.<id>.*`), a lesson or the days never open'],
  [/^c2\.js#fog\.lost$/, 'set off by the world (getting lost in the fog), not by the CAST'],
  [/^clients\.js#/, 'the clients\' readings are not played (reading.open does nothing here)'],
  [/^post\.js#(minor|fog|trade)/, 'set off by the world (the tall grass, the fog, swapping duplicates), not by the CAST'],
];
const why = (key) => BY_CONSTRUCTION.find(([re]) => re.test(key))?.[1] || null;

export function render(R) {
  const { runs, units, sceneUnits } = R;
  const pct = (n) => `${((100 * n) / runs).toFixed(n && n < runs / 100 ? 2 : 1)}%`;
  const L = ['# Coverage of the story by random play', '',
    `_Written by \`node scripts/coverage.mjs --runs ${runs} --seed ${R.seed}\`: do not edit by hand. What it means: docs/TOOLS.md._`, '',
    `${runs} runs (half as a newcomer, half with popularity, Tartufo, trust 2 with each witch and the broom), ${R.ended} reached the end. ` +
    `Warnings from the runner: ${R.warnings.length}.`, '',
    'A **unit** is a piece of a scene that shows only sometimes: a branch of an `IF` (then or else), an option of a choice (counted when it is offered), ' +
    'an observation of the Reader, a remark of a visit. The count is the number of runs in which it was shown.', '',
    '## What random play cannot reach by construction', '',
    '- Content opened by systems the player does not run: the lessons (glue/lessons.js), the garden, the opinions, the props, the trials and the clients\' readings (their scenes are listed below as never played).',
    '- Lines gated on the systems are only approximated: exams on the road (25% per step, 60% passed), one reading per `reading.open`, words on 30% of the cards found. Stats like `fires`, `stuns`, `locks`, `draws` stay 0.',
    '- Popularity and Tartufo are 0 or 40 for a whole run (they move only in the code); the time of day, the days of play, the moon of today are not simulated.',
    '- Choices are uniform at random: a line that needs a trait at 4 or more on one pole needs many answers the same way, so it can be rare without being broken.', ''];
  // scenes
  const never = sceneUnits.filter((s) => s.n === 0);
  L.push('## Scenes', '', `${sceneUnits.length} scenes, ${sceneUnits.length - never.length} played at least once, ${never.length} never.`, '');
  const neverBy = new Map();
  for (const s of never) { const w = why(s.key) || 'not reached by the player: worth a look'; if (!neverBy.has(w)) neverBy.set(w, []); neverBy.get(w).push(s.key); }
  for (const [w, list] of [...neverBy].sort((a, b) => (a[0].startsWith('not reached') ? -1 : 1) - (b[0].startsWith('not reached') ? -1 : 1))) L.push(`- ${w}: ${list.map((k) => `\`${k}\``).join(', ')}`);
  L.push('');
  // units in played scenes
  const played = new Set(sceneUnits.filter((s) => s.n > 0).map((s) => s.key));
  const inPlayed = units.filter((u) => played.has(`${u.file}#${u.scene}`));
  const zero = inPlayed.filter((u) => u.n === 0), rare = inPlayed.filter((u) => u.n > 0 && u.n < runs / 100);
  L.push('## Units in the scenes that were played', '', `${inPlayed.length} units: ${inPlayed.length - zero.length - rare.length} common, ${rare.length} rare (under 1% of the runs), ${zero.length} never shown.`, '');
  const desc = (u) => (u.kind === 'option' ? `option «${short(u.t, 50)}»${u.cond != null ? ` (if ${short(condText(u.cond), 60)})` : ''}` : u.kind === 'observe' ? `«${short(u.t, 50)}» (if ${short(condText(u.cond), 60)})` : `${u.kind === 'if-else' ? 'else of' : 'if'} ${short(condText(u.kind === 'if-else' ? u.cond.not : u.cond), 70)}`);
  const byScene = (list, fmt) => {
    const m = new Map();
    for (const u of list) { const k = `${u.file}#${u.scene}`; if (!m.has(k)) m.set(k, []); m.get(k).push(u); }
    for (const [k, us] of m) { L.push(`- \`${k}\` (${us.length})`); for (const u of us) L.push(`  - ${fmt(u)}`); }
  };
  L.push('### Never shown', '');
  if (zero.length) byScene(zero, desc); else L.push('None.');
  L.push('', '### Rare (under 1%)', '');
  if (rare.length) byScene(rare, (u) => `${desc(u)}: ${u.n} runs (${pct(u.n)})`); else L.push('None.');
  // the end
  L.push('', '## At the end', '', '### Traits (value at the end: runs)', '', '| Trait | ' + Array.from({ length: 13 }, (_, i) => i - 6).join(' | ') + ' |', '|---|' + '---:|'.repeat(13));
  for (const k of AXES) L.push(`| ${k} | ${Array.from({ length: 13 }, (_, i) => R.traits[k].get(i - 6) || 0).join(' | ')} |`);
  L.push('', '### Trust with the witches (value: runs)', '');
  for (const [w, m] of Object.entries(R.trust)) L.push(`- ${w}: ${[...m].sort((a, b) => a[0] - b[0]).map(([v, n]) => `${v}: ${n}`).join(', ')}`);
  L.push('', '### Her card and her suit', '', `- card: ${[...R.cards].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${pct(n)}`).join(', ')}`,
    `- suit: ${[...R.suits].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${pct(n)}`).join(', ')}`);
  L.push('', '### Ending variants', '', 'The conditional pieces of the trial, the dawn, the campfire and the last session (lore/finali/ has where each is earned).', '',
    '| Where | Variant | Runs |', '|---|---|---:|');
  const ENDING = (u) => (u.file === 'end.js' && ['c3.trial', 'f.dawn', 'f.last'].includes(u.scene)) || (u.file === 'sessions.js' && u.scene === 's4');
  for (const u of units.filter(ENDING).filter((x) => x.kind !== 'option' || x.cond != null)) L.push(`| ${u.file}#${u.scene} | ${desc(u).replace(/\|/g, '/')} | ${pct(u.n)} |`);
  return `${L.join('\n')}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
  const R = await measure({ runs: opt('--runs', 1000), seed: opt('--seed', 1) });
  const text = render(R);
  const zero = R.units.filter((u) => u.n === 0).length;
  if (!args.includes('--check')) writeFileSync(OUT, text);
  console.log(`${R.runs} runs, ${R.ended} ended; ${R.sceneUnits.filter((s) => !s.n).length} scenes never played; ${zero} units never shown${args.includes('--check') ? '' : '; wrote docs/COVERAGE.md'}`);
}
