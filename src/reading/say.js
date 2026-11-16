// Turns a plan into Italian text: card sentences with lead-ins, the glance, the closing and, for some forms, advice.
import { LEADS, ADVICE_LEADS, OPENINGS, SCAN, CLOSINGS, SUIT_TXT, AMBITO_DI, AMBITO_SU, NUMERO_NOME, VOLTE, NUMERI } from '../data/reading/frames.js';
import { line } from './voices.js';
import { pick } from './rng.js';

const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

// Put a lead-in in front of a sentence. '' leaves the sentence alone (capitalised as written).
export const joinLead = (lead, sentence) => (lead ? `${lead} ${lower(sentence)}` : sentence);

// Content words (5+ letters, no accents, lowercase) of a text.
const flat = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const contentWords = (s) => new Set(flat(s).match(/[a-z]{5,}/g) ?? []);
export const clashes = (lead, sentence) => {
  const words = contentWords(sentence);
  return [...contentWords(lead)].some((w) => words.has(w));
};
const CONTRAST_WORDS = ['invece', 'pero'];
const contrastWord = (lead) => CONTRAST_WORDS.find((w) => flat(lead).split(/[^a-z]+/).includes(w));

const leadPool = (step) => {
  const group = { contrasto: LEADS.contrasto, svolta: LEADS.svolta }[step.link] ?? LEADS.base;
  return group[step.role] ?? LEADS.base[step.role] ?? [''];
};

// Pick a lead-in that is unused in this reading, shares no content word with the sentence, and does not add a
// second "invece"/"però". '' always qualifies. `used` is a Set updated in place.
const chooseLead = (pool, sentence, rng, used) => {
  const ok = pool.filter((l) => l === '' || (!used.has(l) && !clashes(l, sentence) && !(contrastWord(l) && used.has('#contrast'))));
  const lead = ok.length ? pick(ok, rng) : '';
  if (lead) { used.add(lead); if (contrastWord(lead)) used.add('#contrast'); }
  return lead;
};

// One position: { pos, role, card, rev, lead, text } with text null when the voice has no sentence.
export const sayStep = (plan, i, { rng = Math.random, used = new Set() } = {}) => {
  const step = plan.steps[i];
  const sentence = line(step.card, step.rev, plan.question.ambito, step.role);
  const base = { pos: step.pos, role: step.role, card: step.card, rev: step.rev };
  if (sentence === null) return { ...base, lead: '', text: null };
  const lead = chooseLead(leadPool(step), sentence, rng, used);
  return { ...base, lead, text: joinLead(lead, sentence) };
};

// The opening line, only when the request has a detail ("del campo"); null otherwise.
export const openingOf = (question, rng = Math.random) =>
  (question.ref?.di ? fill(pick(OPENINGS[question.forma], rng), { di: question.ref.di }) : null);

export const scanSentence = (finding, question, rng = Math.random) => {
  const seen = SUIT_TXT[finding.other ?? finding.suit] ?? {};
  const native = SUIT_TXT[finding.suit] ?? {};
  const vars = {
    tanti: seen.tanti, molti: seen.molti, pl: seen.pl, trait: native.trait ?? seen.trait,
    nativo_one: native.one, nativo_none: native.none,
    di: AMBITO_DI[question.ambito], su: AMBITO_SU[question.ambito],
    numero_nome: NUMERO_NOME[finding.n], volte: VOLTE[finding.count], significato: NUMERI[finding.n],
  };
  return fill(pick(SCAN[finding.kind], rng), vars);
};

// Closing for a form and verdict code; variants with {di} need a request detail. `used` (optional Set) holds the
// last closing given, so two consecutive calls never return the same text.
export const closingFor = (forma, code, ref, rng = Math.random, used = null) => {
  const all = CLOSINGS[forma][code].filter((t) => ref?.di || !t.includes('{di}'));
  const fresh = all.filter((t) => !used?.has(t));
  const template = pick(fresh.length ? fresh : all, rng);
  if (used) { used.clear(); used.add(template); }
  return fill(template, { di: ref?.di });
};

// Advice after the closing for the forms fare and scelta: the consiglio sentence of the decisive card (the last
// step), unless that step already plays the consiglio role. Returns { text, missing } or null.
const adviceOf = (plan, rng, used) => {
  if (!['fare', 'scelta'].includes(plan.question.forma)) return null;
  const step = plan.steps[plan.steps.length - 1];
  if (step.role === 'consiglio') return null;
  const sentence = line(step.card, step.rev, plan.question.ambito, 'consiglio');
  if (sentence === null) return { text: null, missing: { card: step.card, rev: step.rev, ambito: plan.question.ambito, role: 'consiglio' } };
  return { text: joinLead(chooseLead(ADVICE_LEADS, sentence, rng, used), sentence), missing: null };
};

// The whole reading: card sentences, then the glance, the closing and the advice. opening: 'auto' | 'always' | 'never'.
// 'auto' gives an opening only when the request has a detail; 'always' needs one too (or gives the quadro line).
// Parts without a voice line have text null and are listed in `missing`.
export const say = (plan, { rng = Math.random, opening = 'auto', usedClosings = null } = {}) => {
  const { question } = plan;
  const used = new Set();
  const open = opening === 'never' ? null : openingOf(question, rng) ?? (opening === 'always' ? openingOf({ ...question, ref: { di: 'di questo' } }, rng) : null);
  const parts = plan.steps.map((_, i) => sayStep(plan, i, { rng, used }));
  const scanLines = plan.scan.map((f) => scanSentence(f, question, rng));
  // when the last thing said is already the advice she asked for, nothing is added after it
  const last = plan.steps[plan.steps.length - 1];
  const adviceLast = last?.role === 'consiglio' && (question.forma === 'fare' || question.forma === 'scelta');
  const closing = adviceLast ? null : closingFor(question.forma, plan.verdict.code, question.ref, rng, usedClosings);
  const adv = adviceOf(plan, rng, used);
  const missing = parts.filter((p) => p.text === null).map((p) => ({ card: p.card, rev: p.rev, ambito: question.ambito, role: p.role }));
  if (adv?.missing) missing.push(adv.missing);
  const advice = adv?.text ?? null;
  const full = [open, ...parts.map((p) => p.text), ...scanLines, closing, advice].filter(Boolean).join(' ');
  return { opening: open, parts, scan: scanLines, closing, advice, full, missing };
};
