// Harness for the play area. ?view=exam&kind=constable|afflicted|judge | draw&mode=fan|number|top |
// reading&spread=single|ppf|celtic[&client=c1.widow|self] | free[&all=1] | review | lock | recover
// Prepared state: own=<majors owned> ch=<chapter> exams=<stats.exams> cat=1 pendulum=<n> incense=<n>
// trust=malva,ortica,edera conf=<n confiscated> seed=<n>. The result is written to #info and window.__result.
import '../src/core/fonts.js';
import '../src/systems/index.js';
import { call } from '../src/core/services.js';
import { setState } from '../src/core/state.js';
import { CLIENTS } from '../src/data/story/index.js';

const q = new URLSearchParams(location.search);
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d);
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rng = q.has('seed') ? mulberry(num('seed', 1)) : Math.random;

const own = num('own', 12), conf = num('conf', 0), ch = num('ch', 1);
const pad = (n) => `m${String(n).padStart(2, '0')}`;
const cards = {};
for (let n = 0; n < Math.min(22, own + conf); n++) {
  cards[pad(n)] = { found: true, stars: n % 4, right: 2, wrong: 0, detail: null, words: ['', '', ''], due: Date.now() - 1000, interval: 0, confiscated: n >= own, at: Date.now() };
}
const trust = { malva: 0, ortica: 0, edera: 0, ginepra: 0 };
for (const w of (q.get('trust') || '').split(',').filter(Boolean)) trust[w] = 3;
setState({
  started: true, chapter: ch, xp: 60, coins: 10, cards, trust,
  player: { name: 'Ada', birth: { d: 1, m: 10, y: 1995 }, sign: 'bilancia', birthCard: 'm11' },
  stats: { exams: num('exams', 5) },
  tools: { bottle: 0, sieve: 0, incense: num('incense', 0), pendulum: num('pendulum', 0) },
  powers: { cat: q.get('cat') === '1' },
  spreads: { single: true, ppf: ch >= 2, celtic: ch >= 3 },
});

const view = q.get('view') || 'exam';
const ids = Object.keys(cards).filter((id) => !cards[id].confiscated);
const run = {
  exam: () => call('exam.start', { kind: q.get('kind') || 'constable', place: 'village', rng }),
  draw: () => call('draw.pick', { mode: q.get('mode') || 'fan', pool: ids, title: 'Pesca una carta', rng }),
  reading: () => {
    const client = q.get('client') || CLIENTS[0]?.id;
    const spread = q.get('spread') || 'single';
    const n = { single: 1, ppf: 3, celtic: 10 }[spread];
    return call('reading.open', { spread, client, rng, cards: client === 'self' ? ids.slice(0, n) : undefined });
  },
  free: () => call('reading.free', { all: q.get('all') === '1' }),
  review: () => call('review.open', {}),
  lock: () => call('lock.ask', { label: 'Il baule è sigillato.', rng }),
  recover: () => call('exam.recover'),
}[view];
run().then((out) => { window.__result = out; document.getElementById('info').textContent = `${view}: ${JSON.stringify(out)}`; });
