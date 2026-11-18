// Conditions and text filling, shared by the story scripts, the world triggers and the sessions.
//
// A condition is a plain object (all keys must hold), or an array (all must hold):
//   { flag: 'b1.spoke' }            { notFlag: 'met.ginepra' }
//   { chapter: 2 }                  { chapterMin: 2 }  { chapterMax: 1 }
//   { step: 'c1.find3' }            { stepIn: ['c1.a', 'c1.b'] }
//   { has: 'm02' }                  { lacks: 'm02' }      (a card found and not confiscated)
//   { majorsMin: 8 }                { level: 4 } (at least)
//   { power: 'fire' }               { spread: 'ppf' }
//   { trust: ['malva', '>=', 2] }   { stat: ['examsFailed', '>=', 3] }
//   { yourCard: 'm11' }             { birthCard: 'm11' }  { sign: 'bilancia' }
//   { word: ['fear', 'essere lasciata'] }
//   { tool: 'bottle' }              { coinsMin: 10 }
//   { not: <cond> }                 { any: [<cond>, <cond>] }
//   { wrote: 'm02' }                (she wrote at least one of her three words on that card)
//   the portrait:  { trait: ['tono', '<=', -3] }  { trend: ['esplora', '>=', 2] } (since the last snapshot)
//   { steady: 'parola' } (|v| >= 3, same sign as at the last snapshot)  { turned: 'rischio' }  { torn: 'guida' }
//   { verdict: 'first' | 'same' | 'changed' }  { yourCardIsBirth: true }
//   added 16 Nov: { pop: 2 } (popularity level >= 2)  { tartufo: 1 } (Tartufo level >= 1)
//   { explored: 12 } (distinct places seen, state.stats.seen, >= 12)
//   { title: 'fattucchiera' | 'strega' | 'gran maestra' } (her rank at least that; same as { level: 4 } / { level: 7 })
//   the witches (core/witches.js): { affinity: { malva: 2 } } (at least)  { bond: { ortica: 3 } } (level at least)
//   { attitude: { edera: 'brontola' } } ('pari' | 'prova' | 'brontola' | 'fredda')
//   the trials (src/trials): { trial: 'demo' } (done: passed, or a main one played)  { trial: ['demo', 'fail'] }
//   (that outcome)  { trialPending: true } (a real trial is open now)  { studied: 'm13' } (studied in the library)
//   the interests (added 18 Nov, notes/interessi/PROGETTO.md): { interest: ['ortica', 1] } (the step of that witch's
//   interest at least: 1 after two missions, 2 after four, 3 after six)  { interestRested: 'ortica' } (no mission of her
//   interest done today: one step a day)
//   birth:  { hasBirth: true } { hasYear: true } { element: 'Fuoco' } { modality: 'fisso' }
//           { moon: 'piena' } { bornOn: 'giovedì' }   (moon and weekday need the year: false without it)
//
// fill('Ciao {name}', state) replaces: {name} {sign} {birthCard} {yourCard} {title} {level}
//   {stat:exams} {word:fear} {words:m02} {card:m02} {trust:malva} {season} {coins} {majors}
//   {traits} {trait:esplora} {lastVerdict} {element} {modality} {ruler} {rulerCard} {birthDay} {dayPlanet}
//   {dayPlanetCard} {moon}   (all safe when the birth data is missing: a neutral phrase)
import { state as live } from './state.js';
import { CARD, SIGNS, SIGN_LORE, PLANET_CARD, weekdayOf, moonOf } from '../data/cards.base.js';
import { popLevel, tartufoLevel } from './bonds.js';
import { affinityOf, bondOf, attitudeOf } from './witches.js';
import { TRIALS } from '../data/trials/index.js';
import { trialDone } from '../trials/run.js';
import { todayKey } from './progress.js';
import { levelOf, titleOf, yourCard, hasCard, majorsFound, seasonOfBirth, traitWord, traitWords, lastSnapshot, lastVerdict } from './progress.js';

const signOfState = (s) => SIGNS.find((x) => x.id === s.player?.sign) || null;
const loreOf = (s) => SIGN_LORE[s.player?.sign] || null;
const fullBirth = (s) => { const b = s.player?.birth; return b && b.y && b.m && b.d ? b : null; };
const tv = (s, k) => s.traits?.[k] || 0;
const prevTv = (s, k) => lastSnapshot(s)?.traits?.[k] || 0;
const sameBool = (v, x) => (v === false ? !x : !!x);
// "curiosa, schietta e gentile"
export const joinIt = (ws) => (ws.length < 2 ? ws[0] || '' : `${ws.slice(0, -1).join(', ')} e ${ws[ws.length - 1]}`);

const cmp = (a, op, b) => (op === '>=' ? a >= b : op === '>' ? a > b : op === '<=' ? a <= b : op === '<' ? a < b : op === '!=' ? a !== b : a === b);

// the interests: a mission done is the flag `int.<witch>.<n>` (n 1..6); its steps come at the 2nd, 4th and 6th
const interestSteps = (w, s) => Math.floor([1, 2, 3, 4, 5, 6].filter((n) => s.flags?.[`int.${w}.${n}`]).length / 2);

const TITLE_LEVEL = { novizia: 1, fattucchiera: 4, strega: 7 };

const TESTS = {
  flag: (v, s) => !!s.flags[v],
  notFlag: (v, s) => !s.flags[v],
  chapter: (v, s) => s.chapter === v,
  chapterMin: (v, s) => s.chapter >= v,
  chapterMax: (v, s) => s.chapter <= v,
  step: (v, s) => s.step === v,
  stepIn: (v, s) => v.includes(s.step),
  has: (v) => hasCard(v),
  lacks: (v) => !hasCard(v),
  majorsMin: (v) => majorsFound() >= v,
  level: (v) => levelOf() >= v,
  power: (v, s) => !!s.powers[v],
  spread: (v, s) => !!s.spreads[v],
  trust: ([who, op, n], s) => cmp(s.trust[who] || 0, op, n),
  stat: ([k, op, n], s) => cmp(s.stats[k] || 0, op, n),
  yourCard: (v) => yourCard() === v,
  birthCard: (v, s) => s.player.birthCard === v,
  sign: (v, s) => s.player.sign === v,
  word: ([k, v], s) => s.words[k] === v,
  tool: (v, s) => (s.tools[v] || 0) > 0,
  coinsMin: (v, s) => s.coins >= v,
  trait: ([k, op, n], s) => cmp(tv(s, k), op, n),
  trend: ([k, op, n], s) => cmp(tv(s, k) - prevTv(s, k), op, n),
  steady: (k, s) => { const v = tv(s, k), p = lastSnapshot(s); return !!p && Math.abs(v) >= 3 && Math.abs(prevTv(s, k)) >= 3 && Math.sign(v) === Math.sign(prevTv(s, k)); },
  turned: (k, s) => { const v = tv(s, k), p = prevTv(s, k); return !!lastSnapshot(s) && v * p < 0 && Math.abs(v - p) >= 4; },
  torn: (k, s) => { const h = s.hits?.[k] || {}; return (h.plus || 0) >= 3 && (h.minus || 0) >= 3 && Math.abs(tv(s, k)) <= 1; },
  verdict: (v, s) => { const last = lastVerdict(s); return v === 'first' ? !last : !!last && (v === 'same' ? last === yourCard(s) : v === 'changed' ? last !== yourCard(s) : false); },
  yourCardIsBirth: (v, s) => sameBool(v, !!s.player?.birthCard && yourCard(s) === s.player.birthCard),
  hasBirth: (v, s) => sameBool(v, !!s.player?.birth),
  hasYear: (v, s) => sameBool(v, !!fullBirth(s)),
  element: (v, s) => signOfState(s)?.element === v,
  modality: (v, s) => loreOf(s)?.modality === v,
  moon: (v, s) => moonOf(fullBirth(s)) === v,
  bornOn: (v, s) => weekdayOf(fullBirth(s) || {})?.name === v,
  wrote: (v, s) => (s.cards?.[v]?.words || []).some((w) => String(w || '').trim()),
  pop: (v, s) => popLevel(s) >= v,
  tartufo: (v, s) => tartufoLevel(s) >= v,
  explored: (v, s) => Object.keys(s.stats?.seen || {}).length >= v,
  title: (v, s) => { const k = String(v).toLowerCase(); return k === 'gran maestra' ? !!s.flags?.['ending.seen'] : levelOf() >= (TITLE_LEVEL[k] ?? Infinity); },
  affinity: (v, s) => Object.entries(v || {}).every(([w, n]) => affinityOf(w, s) >= n),
  bond: (v, s) => Object.entries(v || {}).every(([w, n]) => bondOf(w, s) >= n),
  attitude: (v, s) => Object.entries(v || {}).every(([w, a]) => attitudeOf(w, s) === a),
  trial: (v, s) => { const [id, res] = Array.isArray(v) ? v : [v]; const d = TRIALS[id]; if (!d) return false; return res ? s.trials?.[id]?.result === res : trialDone(d, s); },
  trialPending: (v, s) => sameBool(v, Object.values(TRIALS).some((d) => !d.debug && !trialDone(d, s) && test(d.when, s))),
  studied: (v, s) => !!s.studied?.[v],
  interest: ([w, n], s) => interestSteps(w, s) >= n,
  interestRested: (w, s) => s.interests?.day?.[w] !== todayKey(),
  not: (v, s) => !test(v, s),
  any: (v, s) => v.some((c) => test(c, s)),
};

// Every condition key there is, derived from the handlers above so it cannot drift: the tests that check the
// shape of the story data (tests/story.data.test.mjs, tests/story.reader.test.mjs) read this list.
// (A key added to TESTS must also be described in the comment at the top; tests/core.test.mjs checks that.)
export const COND_KEYS = Object.keys(TESTS);

export function test(cond, s = live) {
  if (cond == null || cond === true) return true;
  if (cond === false) return false;
  if (Array.isArray(cond)) return cond.every((c) => test(c, s));
  return Object.entries(cond).every(([k, v]) => {
    const fn = TESTS[k];
    if (!fn) { console.warn(`[cond] unknown test "${k}"`); return false; }
    return fn(v, s);
  });
}

export function fill(text, s = live) {
  if (typeof text !== 'string' || !text.includes('{')) return text;
  return text.replace(/\{([a-zA-Z]+)(?::([^}]+))?\}/g, (all, k, arg) => {
    switch (k) {
      case 'name': return s.player.name || 'ragazza';
      case 'sign': return SIGNS.find((x) => x.id === s.player.sign)?.name || 'un segno che non dici';
      case 'birthCard': return CARD[s.player.birthCard]?.name || 'una carta che non dici';
      case 'yourCard': return CARD[yourCard()]?.name || 'Il Matto';
      case 'title': return titleOf();
      case 'level': return String(levelOf());
      case 'season': return seasonOfBirth() || 'una stagione che non dici';
      case 'coins': return String(s.coins);
      case 'majors': return String(majorsFound());
      case 'stat': return String(s.stats[arg] || 0);
      case 'word': return s.words[arg] || '...';
      case 'words': return (s.cards[arg]?.words || []).filter(Boolean).join(', ') || '...';
      case 'card': return CARD[arg]?.name || arg;
      case 'trust': return String(s.trust[arg] || 0);
      case 'traits': return joinIt(traitWords(s)) || 'ancora tutta da scoprire';
      case 'trait': return traitWord(arg, s) || 'nel mezzo';
      case 'lastVerdict': return CARD[lastVerdict(s)]?.name || CARD[s.player?.birthCard]?.name || 'Il Matto';
      case 'element': return signOfState(s)?.element || 'un elemento che non conosco';
      case 'modality': return loreOf(s)?.modality || 'una qualità che non conosco';
      case 'ruler': return loreOf(s)?.ruler || 'un pianeta che non conosco';
      case 'rulerCard': return CARD[PLANET_CARD[loreOf(s)?.ruler]]?.name || 'una carta che non conosco';
      case 'birthDay': return weekdayOf(fullBirth(s) || {})?.name || 'un giorno che non conosco';
      case 'dayPlanet': return weekdayOf(fullBirth(s) || {})?.planet || 'un pianeta che non conosco';
      case 'dayPlanetCard': return CARD[PLANET_CARD[weekdayOf(fullBirth(s) || {})?.planet]]?.name || 'una carta che non conosco';
      case 'moon': { const m = moonOf(fullBirth(s)); return m ? `luna ${m}` : 'una luna che non conosco'; }
      default: return all;
    }
  });
}
