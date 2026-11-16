// Access to the per-card voices and the form rules a voice file must respect.
import { VOICES, STUBS } from '../data/reading/registry.js';
import { CARD } from '../data/cards.base.js';
import { AMBITI } from './ask.js';

export const ROLES = ['situazione', 'origine', 'ostacolo', 'arrivo', 'consiglio'];
export const MOTI = ['inizia', 'cresce', 'ferma', 'chiude', 'torna'];

// Stub voices (ids starting with "_") exist only for tests and samples; they are off unless asked.
let stubsOn = false;
export const useStubs = (on = true) => { stubsOn = on; };

export const voice = (id) => VOICES[id] ?? (stubsOn ? STUBS[id] : undefined) ?? null;
export const hasVoice = (id) => voice(id) !== null;
export const voiceIds = () => [...Object.keys(VOICES), ...(stubsOn ? Object.keys(STUBS) : [])];

const side = (id, rev) => voice(id)?.[rev ? 'rev' : 'up'] ?? null;
export const sideOf = side;

// The sentence for a card, orientation, field and role; null when missing.
export const line = (id, rev, ambito, role) => side(id, rev)?.[ambito]?.[role] ?? null;

// ---- form rules ----
const BAD_START = ['ma', 'e', 'però', 'invece'];
const TIME_PLACE_START = [
  'nel', 'nella', 'nello', 'nei', 'nelle', 'nell', 'adesso', 'ora', 'presto', 'domani', 'ieri', 'oggi',
  'stasera', 'stanotte', 'poi', 'dopo', 'intanto', 'qui', 'là', 'lì', 'più avanti', 'in passato', 'in futuro',
  'fra poco', 'tra poco',
];
const BANNED = ['la carta', 'le carte', 'questa carta', 'posizione'];

const words = (s) => s.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w));
const has = (text, phrase) => new RegExp(`(?<![\\p{L}])${phrase}(?![\\p{L}])`, 'iu').test(text);
const startsWith = (text, phrase) => new RegExp(`^${phrase}(?![\\p{L}])`, 'iu').test(text.trim());

const checkLine = (text, where, cardName) => {
  if (typeof text !== 'string' || !text.trim()) return [`${where}: missing`];
  const out = [];
  const n = words(text).length;
  if (n < 7 || n > 18) out.push(`${where}: ${n} words (need 7-18)`);
  if (!text.trim().endsWith('.')) out.push(`${where}: does not end with a full stop`);
  const bad = BAD_START.find((w) => startsWith(text, w));
  if (bad) out.push(`${where}: starts with "${bad}"`);
  const adv = TIME_PLACE_START.find((w) => startsWith(text, w));
  if (adv) out.push(`${where}: starts with an adverbial ("${adv}")`);
  for (const b of BANNED) if (has(text, b)) out.push(`${where}: contains "${b}"`);
  if (cardName && has(text, cardName)) out.push(`${where}: contains the card name "${cardName}"`);
  return out;
};

// Returns a list of problems (empty when the voice is fine).
export const validateVoice = (v) => {
  if (!v || typeof v !== 'object') return ['voice: not an object'];
  const cardName = CARD[v.id]?.name ?? null;
  const out = [];
  if (typeof v.id !== 'string') out.push('voice: id missing');
  for (const o of ['up', 'rev']) {
    const s = v[o];
    if (!s) { out.push(`${o}: missing`); continue; }
    if (!Number.isInteger(s.favore) || s.favore < -2 || s.favore > 2) out.push(`${o}.favore: must be an integer in -2..2`);
    // the idea of the card in a few words: what she must remember (optional for the test stubs)
    if (s.essenza != null && (typeof s.essenza !== 'string' || !s.essenza.endsWith('.') || s.essenza.split(/\s+/).length > 10)) out.push(`${o}.essenza: a short phrase of at most 10 words ending with a full stop`);
    if (s.essenza == null && !String(v.id).startsWith('_')) out.push(`${o}.essenza: missing`);
    if (!MOTI.includes(s.moto)) out.push(`${o}.moto: must be one of ${MOTI.join(', ')}`);
    for (const a of AMBITI) {
      if (!s[a]) { out.push(`${o}.${a}: missing`); continue; }
      for (const r of ROLES) out.push(...checkLine(s[a][r], `${o}.${a}.${r}`, cardName));
    }
  }
  return out;
};
