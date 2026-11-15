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
//
// fill('Ciao {name}', state) replaces: {name} {sign} {birthCard} {yourCard} {title} {level}
//   {stat:exams} {word:fear} {words:m02} {card:m02} {trust:malva} {season} {coins} {majors}
import { state as live } from './state.js';
import { CARD, SIGNS } from '../data/cards.base.js';
import { levelOf, titleOf, yourCard, hasCard, majorsFound, seasonOfBirth } from './progress.js';

const cmp = (a, op, b) => (op === '>=' ? a >= b : op === '>' ? a > b : op === '<=' ? a <= b : op === '<' ? a < b : op === '!=' ? a !== b : a === b);

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
  not: (v, s) => !test(v, s),
  any: (v, s) => v.some((c) => test(c, s)),
};

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
      default: return all;
    }
  });
}
