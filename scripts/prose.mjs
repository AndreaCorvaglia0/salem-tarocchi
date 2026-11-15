// Prose check: finds the mechanical faults docs/WRITING.md forbids, in every text the player reads.
// It warns, it never judges whether a line is good: that is done by rereading aloud.
//   node scripts/prose.mjs            prints the offenders and a count
//   node scripts/prose.mjs --max 0    exits 1 when there are more offenders than --max
import { SCRIPTS, SESSIONS, STEPS, BARKS, CLIENTS } from '../src/data/story/index.js';
const texts = [];
const push = (where, t) => { if (typeof t === 'string' && t.trim()) texts.push({ where, t }); };
const walk = (where, n) => {
  if (Array.isArray(n)) return n.forEach((x) => walk(where, x));
  if (!n || typeof n !== 'object') return;
  for (const [k, v] of Object.entries(n)) {
    if (['t', 'q', 're', 'tell', 'words', 'text', 'hello', 'thanks', 'question', 'plus', 'mid', 'minus'].includes(k)) push(where, v);
    else if (k === 'lines' && Array.isArray(v)) v.forEach((x) => push(where, x));
    else if (v && typeof v === 'object') walk(where, v);
  }
};
for (const [id, s] of Object.entries(SCRIPTS)) walk(`script ${id}`, s);
for (const [id, s] of Object.entries(SESSIONS)) walk(`session ${id}`, s);
walk('steps', STEPS); walk('barks', BARKS); walk('clients', CLIENTS);
for (const [file, name] of [['../src/data/story/visits.js', 'visits'], ['../src/data/portrait.js', 'portrait'], ['../src/data/story/hints.js', 'hints'], ['../src/data/lessons.js', 'lessons']]) {
  try { walk(name, await import(file)); } catch { /* not there yet */ }
}
const sentences = (t) => t.replace(/[«»"“”]/g, '').split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
const words = (s) => s.replace(/\{[^}]+\}/g, 'x').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
const OK_SHORT = /^(sì|no|grazie|prego|ecco|già|certo|forse|bene|appunto|davvero|miao|tu|io)[.!?…]*$/i;
const faults = [];
for (const { where, t } of texts) {
  const ss = sentences(t);
  const ws = ss.map(words);
  const why = [];
  for (let i = 0; i + 2 < ss.length; i++) if (ws[i] <= 5 && ws[i + 1] <= 5 && ws[i + 2] <= 5) { why.push('tre frasi corte di fila'); break; }
  if (ss.length > 1 && ss.some((s, i) => ws[i] <= 2 && !OK_SHORT.test(s))) why.push('frase di una o due parole');
  if (/\bNon [^.?!]{1,40}[.] (Ti|Mi|Ci|Lo|La|È|Sono|Si)\b/.test(t) && ss.length >= 2 && ws[0] <= 6 && ws[1] <= 6) why.push('antitesi a effetto');
  if (why.length) faults.push({ where, why: why.join(', '), t });
}
for (const f of faults) console.log(`${f.where}: ${f.why}\n   ${f.t}`);
console.log(`\n${texts.length} testi, ${faults.length} da rivedere.`);
const max = process.argv.includes('--max') ? Number(process.argv[process.argv.indexOf('--max') + 1]) : Infinity;
process.exit(faults.length > max ? 1 : 0);
