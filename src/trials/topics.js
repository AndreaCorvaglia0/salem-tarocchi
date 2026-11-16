// The library's topics (docs/DESIGN.md, "La biblioteca"): each topic is one short page built from data that
// already exists (the card's sheet and essenza, the grid of the Minors, the lesson on reversed cards) and two
// quick questions. Not the answer to the trial: what the answer is worked out from. Pure.
//   topics: a Major id ('m13'), a suit ('w'|'c'|'s'|'p'), a number group ('1-3'|'4-6'|'7-10'), 'court',
//           'reversed', 'sign' (favourable or contrary)
import { CARD, MAJORS } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { SEMI, NUMERI, FIGURE } from '../data/reading/grid.js';
import { LESSONS } from '../data/lessons.js';
import { voice } from '../reading/voices.js';
import { taughtGroups } from '../glue/lessons.rules.js';

const shuffle = (a, rng) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const pick = (a, rng) => a[Math.floor(rng() * a.length)];
const ess = (id, rev = false) => voice(id)?.[rev ? 'rev' : 'up']?.essenza || '';
const fav = (id, rev = false) => voice(id)?.[rev ? 'rev' : 'up']?.favore ?? 0;
const pad = (n) => String(n).padStart(2, '0');
const GROUP = { '1-3': [1, 2, 3], '4-6': [4, 5, 6], '7-10': [7, 8, 9, 10], court: [11, 12, 13, 14] };
const GROUP_TITLE = { '1-3': 'Uno, due, tre', '4-6': 'Quattro, cinque, sei', '7-10': 'Dal sette al dieci', court: 'Le figure' };
export const TOPIC_KINDS = ['major', 'suit', 'group', 'court', 'reversed', 'sign'];
export const kindOf = (t) => (/^m\d\d$/.test(t) ? 'major' : SEMI[t] ? 'suit' : t === 'court' ? 'court' : GROUP[t] ? 'group' : t === 'reversed' || t === 'sign' ? t : null);
export const isTopic = (t) => !!kindOf(t) && (kindOf(t) !== 'major' || !!CARD[t]);

export function topicTitle(t) {
  const k = kindOf(t);
  if (k === 'major') return CARD[t].name;
  if (k === 'suit') return `Il seme di ${SEMI[t].nome}`;
  if (k === 'group' || k === 'court') return GROUP_TITLE[t];
  if (k === 'reversed') return 'Le carte capovolte';
  if (k === 'sign') return 'Favorevoli e contrarie';
  return t;
}

// The topics she can go over now (taught or found), in a stable order.
export function taughtTopics(s) {
  const out = MAJORS.filter((c) => s.cards?.[c.id]?.found).map((c) => c.id);
  const g = taughtGroups(s.flags || {});
  if (out.length) out.push('sign');
  if (g.suits) out.push('w', 'c', 's', 'p');
  for (const k of ['1-3', '4-6', '7-10']) if (g.numbers.includes(GROUP[k][0])) out.push(k);
  if (g.court) out.push('court');
  if (s.flags?.['lesson.reversed']) out.push('reversed');
  return out;
}

// -> { title, paras: [string], cards: [{ id, rev }], rows: [{ k, v }] }
export function topicPage(t) {
  const k = kindOf(t);
  if (k === 'major') {
    const S = sheet(t) || {};
    const paras = [S.see, S.says].filter(Boolean);
    return { title: topicTitle(t), paras, cards: [{ id: t, rev: false }], rows: [{ k: 'Dritta', v: ess(t) }, { k: 'Capovolta', v: ess(t, true) }] };
  }
  if (k === 'suit') {
    const x = SEMI[t];
    return { title: topicTitle(t), paras: [`${x.nome}: l'elemento è ${x.elemento}, e il seme parla di ${x.dove}, cioè di ${x.idea}.`, 'Il numero dice che cosa succede, il seme dice dove: il Cinque di questo seme è una scossa in questa parte della vita.'],
      cards: [1, 5, 10].map((n) => ({ id: `${t}${pad(n)}`, rev: false })), rows: [1, 5, 10].map((n) => ({ k: `${NUMERI[n].parola} (${n})`, v: ess(`${t}${pad(n)}`) })) };
  }
  if (k === 'group') {
    const ns = GROUP[t];
    return { title: topicTitle(t), paras: ['Il numero dice che cosa succede: lo si legge allo stesso modo in tutti e quattro i semi.'],
      cards: ns.slice(0, 3).map((n, i) => ({ id: `${'cwsp'[i]}${pad(n)}`, rev: false })), rows: ns.map((n) => ({ k: `${n}, ${NUMERI[n].parola}`, v: NUMERI[n].idea })) };
  }
  if (k === 'court') {
    return { title: topicTitle(t), paras: ['Le figure dicono chi, più che che cosa: una persona, o un modo di essere.'],
      cards: [11, 12, 13, 14].slice(0, 3).map((n, i) => ({ id: `${'cws'[i]}${pad(n)}`, rev: false })), rows: [11, 12, 13, 14].map((n) => ({ k: FIGURE[n].nome, v: `${FIGURE[n].parola}: ${FIGURE[n].idea}` })) };
  }
  if (k === 'reversed') {
    const L = LESSONS.find((l) => l.id === 'reversed');
    const gist = (b) => String(b || '').split(/(?<=\.)\s+/).filter((x) => !/cara|cugino|non ricordo/.test(x)).slice(0, 2).join(' ');
    return { title: topicTitle(t), paras: [gist(L?.pages?.[0]?.body), gist(L?.pages?.[3]?.body)].filter(Boolean),
      cards: [{ id: 'm15', rev: true }, { id: 'm19', rev: true }], rows: [{ k: 'Il Diavolo capovolto', v: ess('m15', true) }, { k: 'Il Sole capovolto', v: ess('m19', true) }] };
  }
  if (k === 'sign') {
    return { title: topicTitle(t), paras: ['Ogni carta, dritta, pende da una parte: verso il sì, verso il no, oppure resta nel mezzo e chiede di andare piano.', 'Capovolta può cambiare parte: una carta dura capovolta spesso alleggerisce, una carta lieta capovolta tarda a dare la sua gioia.'],
      cards: [{ id: 'm19', rev: false }, { id: 'm16', rev: false }, { id: 'm12', rev: false }], rows: [{ k: 'Il Sole', v: 'favorevole' }, { k: 'La Torre', v: 'contraria' }, { k: "L'Appeso", v: 'né l\'una né l\'altra' }] };
  }
  return { title: t, paras: [], cards: [], rows: [] };
}

// distractor essenze: other cards, never the same idea twice
const otherEss = (id, rev, pool, rng, n = 2) => {
  const seen = new Set([ess(id, rev)]);
  const out = [];
  for (const o of shuffle(pool.filter((x) => x !== id), rng)) {
    const e = ess(o, rev);
    if (!e || seen.has(e)) continue;
    seen.add(e); out.push(e);
    if (out.length >= n) break;
  }
  return out;
};
const q = (prompt, right, wrong, rng, show = null) => ({ prompt, show, options: shuffle([{ t: right, ok: true }, ...wrong.map((t) => ({ t, ok: false }))], rng) });
const FAV = ['Favorevole', 'Né l\'una né l\'altra', 'Contraria'];
const favWord = (f) => (f > 0 ? FAV[0] : f < 0 ? FAV[2] : FAV[1]);
const favQ = (id, rev, rng) => q(`${CARD[id].name}${rev ? ' capovolta' : ''}: favorevole o contraria?`, favWord(fav(id, rev)), FAV.filter((x) => x !== favWord(fav(id, rev))), rng, { id, rev });
// the number × suit question: a Minor, its idea among the same number in other suits and the same suit at other numbers
const gridQ = (id, rng) => {
  const n = CARD[id].n, s = CARD[id].suit;
  const others = [...'wcsp'.split('').filter((x) => x !== s).map((x) => `${x}${pad(n)}`), ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((m) => m !== n).map((m) => `${s}${pad(m)}`)];
  return q(`${CARD[id].name}: numero per seme, che idea porta?`, ess(id), otherEss(id, false, others, rng), rng, { id, rev: false });
};
const MAJ = MAJORS.map((c) => c.id);

// Two quick questions on a topic: [{ prompt, show?: { id, rev }, options: [{ t, ok }] }]
export function topicQuestions(t, rng = Math.random) {
  const k = kindOf(t);
  if (k === 'major') return [q('Che idea porta questa carta?', ess(t), otherEss(t, false, MAJ, rng), rng, { id: t, rev: false }), favQ(t, false, rng)];
  if (k === 'suit') {
    const others = Object.keys(SEMI).filter((x) => x !== t).map((x) => SEMI[x].dove);
    return [q(`Di che cosa parla il seme di ${SEMI[t].nome}?`, SEMI[t].dove, shuffle(others, rng).slice(0, 2), rng), gridQ(`${t}${pad(1 + Math.floor(rng() * 10))}`, rng)];
  }
  if (k === 'group' || k === 'court') {
    const ns = GROUP[t];
    const n = pick(ns, rng);
    const words = k === 'court' ? FIGURE : NUMERI;
    const all = Object.keys(words).map(Number).filter((m) => m !== n);
    const first = q(k === 'court' ? `Il ${FIGURE[n].nome}: chi è?` : `Il ${n}: che cosa succede?`, words[n].parola, shuffle(all, rng).slice(0, 2).map((m) => words[m].parola), rng);
    const id = `${pick(['w', 'c', 's', 'p'], rng)}${pad(pick(ns, rng))}`;
    return [first, k === 'court' ? q(`${CARD[id].name}: che idea porta?`, ess(id), otherEss(id, false, Object.keys(CARD).filter((x) => CARD[x].arcana === 'minor' && CARD[x].n >= 11), rng), rng, { id, rev: false }) : gridQ(id, rng)];
  }
  if (k === 'reversed') {
    const id = pick(['m15', 'm19', 'm16', 'm17', 'm13'], rng);
    return [q('Una carta capovolta, di solito:', 'Dice la stessa cosa, che però fatica a uscire', ['Dice il contrario esatto di quella dritta', 'Non conta, e si gira dritta'], rng),
      q(`${CARD[id].name} capovolta: che idea porta?`, ess(id, true), otherEss(id, true, MAJ, rng), rng, { id, rev: true })];
  }
  if (k === 'sign') {
    const ids = shuffle(MAJ, rng);
    return [favQ(ids[0], false, rng), favQ(ids[1], false, rng)];
  }
  return [];
}

// Studying a topic gives a little xp, once per topic per calendar day.
export const STUDY_XP = 3;
export const studyXp = (topic, s, today) => (s.studiedXp?.[topic] === today ? 0 : STUDY_XP);
// fresh: studied within the last FRESH_MS (the library marks it)
export const FRESH_MS = 6 * 3600 * 1000;
export const isFresh = (topic, s, now = Date.now()) => now - (s.studied?.[topic] || -Infinity) < FRESH_MS;
