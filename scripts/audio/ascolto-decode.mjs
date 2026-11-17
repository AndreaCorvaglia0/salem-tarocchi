// Decode the codes of the blind listening page (harness/ascolto.*, <site>/ascolto/) into tables:
//   node scripts/audio/ascolto-decode.mjs <code> [<code> ...]
// For each listener: every clip with the air it was measured for, the air she gave it and whether she liked it;
// then, for all listeners together, the confusion table (rows: measured for, columns: given to) and, per air,
// the clips ranked (given to the right air first, then liked).
import { readFileSync } from 'node:fs';
import { decode, AIRS, CLIPS } from '../../harness/ascolto.js';

const KEY = JSON.parse(readFileSync(new URL('./ascolto-key.json', import.meta.url), 'utf8'));
const ids = AIRS.map((a) => a.id);
const codes = process.argv.slice(2);
if (!codes.length) { console.log('usage: node scripts/audio/ascolto-decode.mjs <code> [<code> ...]'); process.exit(1); }

const conf = Object.fromEntries(ids.map((r) => [r, Object.fromEntries([...ids, '-'].map((c) => [c, 0]))]));
const per = {}; // clip -> { right, like: { si, cosi, no } }
for (const code of codes) {
  const { who, answers } = decode(code);
  console.log(`\n## ${who || '(senza nome)'}\n\n| clip | brano | misurato per | dato a | piace |\n|---|---|---|---|---|`);
  for (const c of CLIPS) {
    const k = KEY[c], a = answers[c] || {};
    const given = a.air == null ? '-' : ids[a.air];
    conf[k.air][given] += 1;
    const p = per[c] || (per[c] = { right: 0, n: 0, like: { si: 0, cosi: 0, no: 0 } });
    p.n += 1; if (given === k.air) p.right += 1; if (a.like) p.like[a.like] += 1;
    console.log(`| ${c} | ${k.title} | ${k.air} | ${given}${given === k.air ? ' ✓' : ''} | ${a.like || '-'} |`);
  }
}
console.log(`\n## Confusione (righe: misurato per; colonne: dato a)\n\n| | ${ids.join(' | ')} | vuoto |\n|---|${ids.map(() => '---|').join('')}---|`);
for (const r of ids) console.log(`| ${r} | ${ids.map((c) => conf[r][c]).join(' | ')} | ${conf[r]['-']} |`);
console.log('\n## Per aria (prima chi è stato riconosciuto, poi chi piace)\n');
for (const air of ids) {
  const list = CLIPS.filter((c) => KEY[c].air === air).map((c) => ({ c, ...per[c], score: per[c].right * 2 + per[c].like.si - per[c].like.no }))
    .sort((a, b) => b.score - a.score);
  console.log(`- ${air}: ${list.map((x) => `${KEY[x.c].title} (${x.right}/${x.n} riconosciuto, sì ${x.like.si}, no ${x.like.no})`).join('; ')}`);
}
