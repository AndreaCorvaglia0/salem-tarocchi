// Questions and Exams. Pure functions of (pool, level, rng): same rng sequence, same questions.
// A question: { cardId, kind, star, prompt, show?, options: [{ t? | card?, ok }], explain }.
// Kinds: name, meaning, which, detail, odd, astro, order, position (see docs/CONTRACT.md).
import { CARD, MAJORS, MINORS, SIGNS } from './cards.base.js';
import { SHEETS } from './cards.js';
import { SPREADS } from './spreads.js';

export const KINDS = ['name', 'meaning', 'which', 'detail', 'odd', 'astro', 'order', 'position'];
const STAR = { name: 'image', detail: 'image', which: 'image', meaning: 'meaning', odd: 'meaning', position: 'meaning', order: 'meaning', astro: 'astro' };
const DEFAULT_KINDS = [['name', 'meaning', 'which', 'detail'], ['name', 'meaning', 'which', 'detail', 'odd', 'order', 'astro'], KINDS];

const PLANETS = { Mercurio: 'la mente e le parole', Luna: "l'intuito e i cicli", Venere: 'amore, piacere, bellezza', Giove: 'espansione e fortuna', Marte: 'azione e scontro', Sole: 'vita e luce', Saturno: 'limiti e compimento' };
const ELEMENTS = { Aria: 'la mente', Acqua: 'le emozioni', Fuoco: 'volontà e passione', Terra: 'il corpo e le cose concrete' };
const SPREAD_IN = { single: 'nella carta singola', ppf: 'nella stesa passato, presente, futuro', celtic: 'nella croce celtica' };
const KIND_WORD = { planet: 'pianeta', sign: 'segno', element: 'elemento' };
const ASTRO_POOL = { planet: Object.keys(PLANETS), sign: SIGNS.map((s) => s.name), element: Object.keys(ELEMENTS) };

// ---- small helpers (all randomness goes through rng) ----------------------------------------
const shuffle = (arr, rng) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];
const nOpts = (level) => (level <= 1 ? 3 : 4);
// "Il Mago" -> "il Mago"; "Asso di Coppe" -> "l'Asso di Coppe" (for use after a preposition-less verb).
const art = (c) => {
  if (c.arcana === 'major') return c.name[0].toLowerCase() + c.name.slice(1);
  if (c.rank === 'Asso' || c.rank === 'Otto') return `l'${c.name}`;
  return c.rank === 'Regina' ? `la ${c.name}` : `il ${c.name}`;
};
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const norm = (s) => String(s).trim().toLowerCase();
const rowOf = (c) => (c.arcana === 'major' ? c.row : c.suit);

// Other cards of the same arcana, most confusable first: confusables, same row/suit, the rest.
const similar = (id, rng) => {
  const c = CARD[id];
  const same = (c.arcana === 'major' ? MAJORS : MINORS).filter((x) => x.id !== id);
  const conf = (SHEETS[id]?.confusables || []).filter((x) => CARD[x] && x !== id && CARD[x].arcana === c.arcana);
  const near = shuffle(same.filter((x) => rowOf(x) === rowOf(c) && !conf.includes(x.id)).map((x) => x.id), rng);
  const rest = shuffle(same.filter((x) => rowOf(x) !== rowOf(c) && !conf.includes(x.id)).map((x) => x.id), rng);
  return [...shuffle(conf, rng), ...near, ...rest];
};

// Assemble options: the right one plus the first distinct wrong ones, shuffled.
const assemble = (right, wrongs, level, rng, keyOf) => {
  const seen = new Set([keyOf(right)]);
  const out = [];
  for (const w of wrongs) { const k = keyOf(w); if (!seen.has(k)) { seen.add(k); out.push(w); } if (out.length === nOpts(level) - 1) break; }
  return shuffle([{ ...right, ok: true }, ...out.map((w) => ({ ...w, ok: false }))], rng);
};
const byText = (arr) => arr.map((t) => ({ t }));
const textKey = (o) => norm(o.t);
const cardKey = (o) => o.card;

// ---- the eight kinds -----------------------------------------------------------------------
const PROMPTS = {
  name: ['Che carta è?', 'Come si chiama questa carta?', 'Sai dire il nome di questa carta?', 'Chi è, questa?'],
  meaning: ['Cosa dice questa carta?', 'Qual è il suo messaggio?', 'Cosa ti racconta, in una lettura?', 'Che consiglio ti dà?'],
  which: ['Quale carta dice: «{core}»?', 'Trova la carta che dice: «{core}»', 'Quale di queste carte dice «{core}»?'],
  detail: ['Da quale carta viene questo dettaglio?', 'Riconosci questo pezzetto? Di che carta fa parte?', 'Questo dettaglio sta in una carta: quale?'],
  odd: ['Quale parola non c\'entra con {art}?', 'Una di queste non appartiene a {art}: quale?', 'Trova l\'intrusa per {art}.'],
};
const quizzable = (id) => (SHEETS[id]?.details || []).filter((d) => d.quiz !== false);

const qName = (id, level, rng) => {
  const c = CARD[id];
  const wrongs = similar(id, rng).map((x) => ({ t: CARD[x].name }));
  return { prompt: pick(PROMPTS.name, rng), show: { card: id }, options: assemble({ t: c.name }, wrongs, level, rng, textKey), explain: `${c.name}. ${SHEETS[id].core}` };
};
const qMeaning = (id, level, rng) => {
  const wrongs = similar(id, rng).map((x) => ({ t: SHEETS[x].core }));
  return { prompt: pick(PROMPTS.meaning, rng), show: { card: id }, options: assemble({ t: SHEETS[id].core }, wrongs, level, rng, textKey), explain: `${CARD[id].name}. ${SHEETS[id].core}` };
};
const qWhich = (id, level, rng) => {
  const core = SHEETS[id].core.replace(/[.!]$/, '');
  const wrongs = similar(id, rng).map((x) => ({ card: x }));
  return { prompt: pick(PROMPTS.which, rng).replace('{core}', core), options: assemble({ card: id }, wrongs, level, rng, cardKey), explain: `${CARD[id].name}. ${SHEETS[id].core}` };
};
const qDetail = (id, level, rng) => {
  const d = pick(quizzable(id), rng);
  const wrongs = similar(id, rng).map((x) => ({ t: CARD[x].name }));
  return { prompt: pick(PROMPTS.detail, rng), show: { card: id, crop: { x: d.x, y: d.y, r: d.r } }, options: assemble({ t: CARD[id].name }, wrongs, level, rng, textKey), explain: `Viene da ${CARD[id].name}: ${d.label}.` };
};
const qOdd = (id, level, rng) => {
  const c = CARD[id];
  const mine = SHEETS[id].keywords;
  const taken = new Set(mine.map(norm));
  const avoid = new Set([id, ...(SHEETS[id].confusables || [])]);
  const others = shuffle((c.arcana === 'major' ? MAJORS : MINORS).filter((x) => !avoid.has(x.id)), rng);
  let intruder = null;
  for (const o of others) { const w = shuffle(SHEETS[o.id].keywords, rng).find((k) => !taken.has(norm(k))); if (w) { intruder = w; break; } }
  const right = { t: intruder };
  const wrongs = shuffle(mine, rng).map((t) => ({ t }));
  const prompt = pick(PROMPTS.odd, rng).replace('{art}', art(c));
  return { prompt, show: { card: id }, options: assemble(right, wrongs, level, rng, textKey), explain: `Per ${art(c)} valgono: ${mine.slice(0, 4).join(', ')}. «${intruder}» è di un'altra carta.` };
};
const qAstro = (id, level, rng) => {
  const c = CARD[id];
  const { kind, name } = c.astro;
  const gloss = kind === 'planet' ? PLANETS[name] : kind === 'element' ? ELEMENTS[name] : `un segno di ${SIGNS.find((s) => s.name === name).element}`;
  const explain = `${c.name}: ${KIND_WORD[kind]} ${name}, ${gloss}.`;
  if (kind !== 'element' && rng() < 0.4) { // reverse: which card belongs to this planet or sign
    const wrongs = shuffle(MAJORS.filter((m) => m.astro.kind === kind && m.id !== id), rng).map((m) => ({ t: m.name }));
    const prompt = kind === 'planet' ? `Quale carta appartiene al pianeta ${name}?` : `Quale carta appartiene al segno ${name}?`;
    return { prompt, options: assemble({ t: c.name }, wrongs, level, rng, textKey), explain };
  }
  const prompts = { planet: ['Quale pianeta ha {n}?', 'A quale pianeta appartiene {n}?'], sign: ['Quale segno ha {n}?', 'Di che segno è la carta {n}?'], element: ['Quale elemento ha {n}?', 'A quale elemento appartiene {n}?'] };
  const wrongs = shuffle(ASTRO_POOL[kind].filter((x) => x !== name), rng).map((t) => ({ t }));
  return { prompt: pick(prompts[kind], rng).replace('{n}', c.name), show: { card: id }, options: assemble({ t: name }, wrongs, level, rng, textKey), explain };
};
const seriesOf = (c) => (c.arcana === 'major' ? MAJORS : MINORS.filter((m) => m.suit === c.suit));
const qOrder = (id, level, rng) => {
  const c = CARD[id];
  const list = seriesOf(c);
  const i = list.findIndex((x) => x.id === id);
  let dir = rng() < 0.5 ? 1 : -1;
  if (!list[i + dir]) dir = -dir;
  const target = list[i + dir];
  const dist = (x) => Math.abs(list.indexOf(x) - i);
  const rest = list.filter((x) => x !== c && x !== target);
  const near = shuffle(rest.filter((x) => dist(x) <= 3), rng), far = shuffle(rest.filter((x) => dist(x) > 3), rng);
  const wrongs = [...near, ...far].map((x) => ({ t: x.name }));
  const num = (x) => (x.arcana === 'major' ? ` (${x.roman})` : '');
  const prompt = dir > 0 ? `Quale carta viene subito dopo ${art(c)}?` : `Quale carta viene subito prima di ${art(c)}?`;
  const explain = dir > 0 ? `Dopo ${c.name}${num(c)} viene ${target.name}${num(target)}.` : `Prima di ${c.name}${num(c)} viene ${target.name}${num(target)}.`;
  return { prompt, options: assemble({ t: target.name }, wrongs, level, rng, textKey), explain };
};
const qPosition = (level, rng, spreadId) => {
  const sp = SPREADS[spreadId] || SPREADS[pick(Object.keys(SPREADS), rng)];
  const pos = pick(sp.positions, rng);
  const mine = sp.positions.filter((p) => p.id !== pos.id);
  const others = Object.values(SPREADS).filter((s) => s !== sp).flatMap((s) => s.positions).filter((p) => p.id !== pos.id && !mine.some((m) => m.id === p.id));
  const wrongs = [...shuffle(mine, rng), ...shuffle(others, rng)].map((p) => ({ t: p.hint }));
  const prompt = rng() < 0.5 ? `${cap(SPREAD_IN[sp.id])}, cosa mostra la posizione «${pos.label}»?` : `${cap(SPREAD_IN[sp.id])}, cosa dice la carta messa al numero ${pos.n}?`;
  return { prompt, options: assemble({ t: pos.hint }, wrongs, level, rng, textKey), explain: `«${pos.label}» (posizione ${pos.n}): ${pos.hint}`, spread: sp.id, position: pos.id };
};

const ELIGIBLE = {
  name: (id) => !!SHEETS[id], meaning: (id) => !!SHEETS[id], which: (id) => !!SHEETS[id], odd: (id) => !!SHEETS[id],
  detail: (id) => quizzable(id).length > 0,
  astro: (id) => CARD[id].arcana === 'major',
  order: () => true,
};
const BUILD = { name: qName, meaning: qMeaning, which: qWhich, detail: qDetail, odd: qOdd, astro: qAstro, order: qOrder };

// ---- public ---------------------------------------------------------------------------------
export function makeQuestion({ pool, kinds, level = 1, rng = Math.random, spread, exclude = [] } = {}) {
  let ids = (pool || []).filter((id) => CARD[id] && SHEETS[id]);
  if (!ids.length) ids = MAJORS.map((c) => c.id);
  const fresh = ids.filter((id) => !exclude.includes(id));
  const avail = fresh.length ? fresh : ids;
  const allowed = (kinds?.length ? kinds : DEFAULT_KINDS[Math.min(2, Math.max(0, level - 1))]).filter((k) => KINDS.includes(k));
  for (const kind of shuffle(allowed.length ? allowed : ['name'], rng)) {
    let q, cardId = null;
    if (kind === 'position') q = qPosition(level, rng, spread);
    else {
      const cands = avail.filter(ELIGIBLE[kind]);
      if (!cands.length) continue;
      cardId = pick(cands, rng);
      q = BUILD[kind](cardId, level, rng);
    }
    return { cardId, kind, star: STAR[kind], ...q };
  }
  const cardId = pick(avail, rng);
  return { cardId, kind: 'name', star: 'image', ...qName(cardId, level, rng) };
}

const EXAM_WEIGHTS = {
  constable: { name: 3, meaning: 3, which: 3, detail: 1, odd: 1 },
  afflicted: { name: 2, detail: 3, which: 2, meaning: 2, odd: 2 },
  judge: Object.fromEntries(KINDS.map((k) => [k, 1])),
};
export function makeExam({ kind = 'constable', pool, level = 1, n = 3, rng = Math.random, spread } = {}) {
  const w = EXAM_WEIGHTS[kind] || EXAM_WEIGHTS.constable;
  const bag = Object.entries(w).flatMap(([k, c]) => Array(c).fill(k));
  const out = [], used = [], seen = new Set();
  for (let i = 0; i < n; i++) {
    let q;
    for (let tries = 0; tries < 6; tries++) {
      q = makeQuestion({ pool, kinds: [pick(bag, rng)], level, rng, spread, exclude: used });
      if (q.cardId || !seen.has(q.position)) break; // do not repeat the same spread position
    }
    if (q.cardId) used.push(q.cardId); else seen.add(q.position);
    out.push(q);
  }
  return out;
}
