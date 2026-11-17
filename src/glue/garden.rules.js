// The garden at the cottage (docs/DESIGN.md "L'orto", "L'orto insegna davvero"), pure rules.
// Tests: tests/garden.test.mjs.
//   state.garden = { unlocked, beds: [bed | null x4], lessons: { acqua, luce, terra, vaso, semina } }
//   state.seeds = { herb: n }   state.pantry = { herb: n }
//   bed = { herb, terra, step, any, soak, half, hurt, wilted, felt, planted }
//     terra:   the soil she chose when planting ('leggera' | 'ricca' | 'fresca')
//     step:    good waterings so far (0..steps; at `steps` it is ripe)
//     any:     the day it was last watered (or planted): the soil dries from there
//     soak:    waterings too early in a row (two in a row hurt a plant that likes it dry)
//     half:    in the wrong light a good watering counts every other time: 1 = the next one counts
//     hurt:    the day it last lost a step to too much water (at most one a day)
//     wilted:  the `any` it wilted at (once per long absence, not once a day)
//     felt:    the day she last touched its soil
// The light belongs to the bed (data/garden.js BED_LIGHT). There is no calendar on the screen: she touches
// the soil. A plant that likes it dry wants water when the soil is dry a finger deep; the others when the
// top is dry. The soil changes the pace: a dry-lover in fresh soil stays wet twice as long, a thirsty plant
// in light soil dries twice as fast. Days are local calendar days 'YYYY-MM-DD' (todayKey). Nothing dies.
import { GARDEN, FIRST_SEEDLINGS, BEDS, BED_LIGHT, SOIL, LIGHT, LESSON_NOTES } from '../data/garden.js';

export const NEGLECT = 3; // more than NEGLECT x the (soil-adjusted) interval without water: it wilts one step
export const REGROW = 2; // after a harvest the plant goes back this many steps, and keeps giving
export const HARVEST_XP = 4;
export const SEED_PRICE = { herb: 5, poison: 9 };
export const LESSONS = ['acqua', 'luce', 'terra', 'vaso', 'semina'];

const dayNum = (key) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || '')); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000 : null; };
// whole days from a to b (local calendar days); null if either is missing
export const daysBetween = (a, b) => { const x = dayNum(a), y = dayNum(b); return x == null || y == null ? null : Math.round(y - x); };
export const plantOf = (id) => GARDEN[id] || null;

// ---- light and soil --------------------------------------------------------------------------------
export const bedLight = (i) => BED_LIGHT[i] || 'sole';
export const lightOk = (herb, light) => { const P = GARDEN[herb]; return !!P && (P.luce === light || P.anche === light); };
// how much faster (<1) or slower (>1) the soil dries for this plant in this soil
export const soilPace = (herb, terra) => { const P = GARDEN[herb]; if (!P) return 1; if (P.dry && terra === 'fresca') return 2; if (!P.dry && terra === 'leggera') return 0.5; return 1; };
// days from a watering to the moment it wants the next one
export const interval = (bed) => Math.max(1, Math.round(GARDEN[bed.herb].every * soilPace(bed.herb, bed.terra)));

// ---- the shape, old saves --------------------------------------------------------------------------
export const emptyGarden = () => ({ unlocked: false, beds: Array(BEDS).fill(null), lessons: {} });
const cleanBed = (b) => {
  if (!b || typeof b !== 'object' || !GARDEN[b.herb]) return null;
  const P = GARDEN[b.herb], day = b.any || b.last || b.planted || null;
  return { herb: b.herb, terra: SOIL[b.terra] ? b.terra : P.terra, step: Math.max(0, Math.min(P.steps, Math.round(Number(b.step) || 0))), any: day,
    soak: Math.max(0, Number(b.soak) || 0), half: b.half ? 1 : 0, hurt: b.hurt || null, wilted: b.wilted || null, felt: b.felt || null, planted: b.planted || day };
};
// any stored value (missing, broken, an older shape) -> a sane garden
export function normGarden(g) {
  const out = emptyGarden();
  if (!g || typeof g !== 'object') return out;
  out.unlocked = !!g.unlocked;
  const beds = Array.isArray(g.beds) ? g.beds : [];
  for (let i = 0; i < BEDS; i++) out.beds[i] = cleanBed(beds[i]);
  if (g.lessons && typeof g.lessons === 'object') for (const k of LESSONS) if (g.lessons[k]) out.lessons[k] = true;
  return out;
}
export const normCounts = (o) => { const out = {}; if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { const n = Math.max(0, Math.round(Number(v) || 0)); if (n && GARDEN[k]) out[k] = n; } return out; };

// ---- one bed ---------------------------------------------------------------------------------------
export const plant = (herb, today, terra = GARDEN[herb]?.terra) => (GARDEN[herb] ? { herb, terra: SOIL[terra] ? terra : GARDEN[herb].terra, step: 0, any: today, soak: 0, half: 0, hurt: null, wilted: null, felt: today, planted: today } : null);
export const isReady = (bed) => !!bed && bed.step >= (GARDEN[bed.herb]?.steps ?? Infinity);
const since = (bed, today) => { const d = daysBetween(bed.any, today); return d == null ? 99 : Math.max(0, d); };
// What her finger finds: 'wet' (still wet), 'top' (dry on top, moist below), 'deep' (dry a finger deep)
export function feel(bed, today) {
  if (!bed || !GARDEN[bed.herb]) return 'deep';
  const d = since(bed, today), E = interval(bed);
  if (GARDEN[bed.herb].dry) return d >= E ? 'deep' : d >= Math.ceil(E / 2) ? 'top' : 'wet';
  return d >= 2 * E ? 'deep' : d >= E ? 'top' : 'wet';
}
export const FEEL = { wet: 'Ancora bagnata.', top: 'Asciutta sopra, umida sotto.', deep: 'Asciutta anche a un dito di profondità.' };
// the moment to water: dry a finger deep for a dry-lover, dry on top for the others
export const isThirsty = (bed, today) => !!bed && !!GARDEN[bed.herb] && !isReady(bed) && since(bed, today) >= interval(bed);
// the top of the soil looks dark and wet (what one sees without touching)
export const looksWet = (bed, today) => !!bed && since(bed, today) < Math.ceil(interval(bed) / 2);
export const touch = (bed, today) => ({ bed: { ...bed, felt: today }, feel: feel(bed, today) });

// Water a bed today -> { bed, ok: 'good' | 'early' | 'drowned', grew, key }
//   good:    the soil was dry enough: one step more (in the wrong light, one step every other good watering:
//            key 'slow' when it did not count)
//   early:   the soil was still wet: no growth, and the soil is wet again from today
//   drowned: a plant that likes it dry, watered too early twice in a row: one step less (never below 0,
//            at most once a day)
export function water(bed, today, light = 'sole') {
  const P = GARDEN[bed?.herb];
  if (!P) return { bed, ok: 'early', grew: false, key: 'none' };
  const b = { ...bed }, due = isThirsty(b, today);
  b.any = today; b.felt = today;
  if (due) {
    b.soak = 0; b.wilted = null;
    if (!lightOk(b.herb, light) && !b.half) { b.half = 1; return { bed: b, ok: 'good', grew: false, key: 'slow' }; }
    b.half = 0; b.step = Math.min(P.steps, b.step + 1);
    return { bed: b, ok: 'good', grew: true, key: isReady(b) ? 'ready' : 'good' };
  }
  if (isReady(b)) return { bed: b, ok: 'early', grew: false, key: 'ripe' };
  b.soak += 1;
  if (P.dry && b.soak >= 2 && b.hurt !== today && b.step > 0) {
    b.step -= 1; b.hurt = today;
    return { bed: b, ok: 'drowned', grew: false, key: 'drowned' };
  }
  return { bed: b, ok: 'early', grew: false, key: 'early' };
}

// Applied when the garden is opened: a plant left more than NEGLECT x its interval without water wilts one
// step, once for that absence (the pace of its soil counts: in light soil a thirsty plant wilts sooner).
// -> { bed, wilted }
export function settle(bed, today) {
  if (!bed || !GARDEN[bed.herb]) return { bed, wilted: false };
  const d = daysBetween(bed.any, today);
  const limit = NEGLECT * GARDEN[bed.herb].every * soilPace(bed.herb, bed.terra);
  if (d == null || d <= limit || bed.wilted === bed.any) return { bed, wilted: false };
  const b = { ...bed, wilted: bed.any };
  const lost = b.step > 0;
  if (lost) b.step -= 1;
  return { bed: b, wilted: lost };
}

// A ripe plant gives a bunch for the pantry and keeps growing. -> { bed, herb, xp } or null if not ripe
export function harvest(bed) {
  if (!isReady(bed)) return null;
  return { bed: { ...bed, step: Math.max(0, GARDEN[bed.herb].steps - REGROW), soak: 0, half: 0 }, herb: bed.herb, xp: HARVEST_XP };
}
// Into another soil: a transplant sets the plant back one step (never below 0); the new soil is watered.
export const resoil = (bed, terra, today) => (SOIL[terra] && bed && terra !== bed.terra ? { ...bed, terra, step: Math.max(0, bed.step - 1), any: today, felt: today, soak: 0, half: 0, wilted: null } : bed);
// Move a plant to a free bed: free, nothing lost. -> a new beds array, or null if it cannot
export function move(beds, from, to) {
  if (!beds[from] || beds[to] || from === to || to < 0 || to >= BEDS) return null;
  const out = [...beds]; out[to] = { ...beds[from], half: 0 }; out[from] = null;
  return out;
}

// ---- the whole garden ------------------------------------------------------------------------------
const live = (garden) => (garden?.unlocked ? (garden.beds || []).filter((b) => b && GARDEN[b.herb]) : []);
export const thirsty = (garden, today) => live(garden).filter((b) => isThirsty(b, today)).length;
export const readyCount = (garden) => live(garden).filter((b) => isReady(b)).length;
// What the threshold says, without telling what only her finger can:
//   { check: growing beds not touched or watered today, thirsty: of the ones she checked, ready, planted }
export function summary(garden, today) {
  const L = live(garden).filter((b) => !isReady(b)), checked = L.filter((b) => b.felt === today);
  return { check: L.length - checked.length, thirsty: checked.filter((b) => isThirsty(b, today)).length, ready: readyCount(garden), planted: live(garden).length };
}
export function summaryText(s) {
  if (!s.planted) return 'da piantare';
  if (s.check) return `${s.check === 1 ? 'una' : s.check} da controllare`;
  if (s.thirsty) return s.thirsty === 1 ? 'una ha sete' : `${s.thirsty} hanno sete`;
  if (s.ready) return s.ready === 1 ? 'una da raccogliere' : `${s.ready} da raccogliere`;
  return 'tutto a posto';
}

// The three seedlings Ortica gives: herbs already in the herbarium, the harmless ones first, then the
// careful ones (never the poisonous); filled with FIRST_SEEDLINGS when fewer than three qualify.
export function seedlings(herbs, risk, order) {
  const own = order.filter((id) => herbs?.[id] && GARDEN[id]);
  const rank = (id) => (risk(id) === 'velenosa' ? 2 : risk(id) === 'attenzione' ? 1 : 0);
  const out = own.filter((id) => rank(id) < 2).sort((a, b) => rank(a) - rank(b)).slice(0, 3);
  for (const id of FIRST_SEEDLINGS) if (out.length < 3 && !out.includes(id)) out.push(id);
  return out;
}
// what the shop sells: a seed of each herb she has noticed
export const seedPrice = (id, risk) => (risk(id) === 'velenosa' ? SEED_PRICE.poison : SEED_PRICE.herb);
export const seedsForSale = (herbs, order) => order.filter((id) => herbs?.[id] && GARDEN[id]);
// a seed from the full moon: one of her herbs, the same all day
export function moonSeed(herbs, order, date) {
  const own = seedsForSale(herbs, order);
  if (!own.length) return null;
  let x = 7; for (const ch of String(date)) x = (x * 31 + ch.charCodeAt(0)) >>> 0;
  return own[x % own.length];
}

// ---- the words under a bed ----------------------------------------------------------------------
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const male = (id) => /^(il|lo) /.test(GARDEN[id]?.the || '') || ['alloro', 'assenzio', 'aconito'].includes(id);
const ao = (id, f, m) => (male(id) ? m : f);
// why the light of this bed does not suit it (null when it does)
export function lightWhy(id, light) {
  const P = GARDEN[id];
  if (!P || lightOk(id, light)) return null;
  if (P.luce === 'sole') return light === 'ombra' ? 'Vuole pieno sole: qui all\'ombra fila e non fiorisce.' : 'Vuole pieno sole: a mezz\'ombra cresce lenta e fa meno profumo.';
  return light === 'sole' ? 'Vuole mezz\'ombra: in pieno sole le foglie si scottano e la terra secca troppo.' : 'Vuole almeno un po\' di sole: in ombra piena cresce stenta.';
}
// what the soil does to it (null when it is its soil; a preference when the soil only suits it less)
export function soilWhy(id, terra) {
  const P = GARDEN[id];
  if (!P || P.terra === terra) return null;
  if (P.dry && terra === 'fresca') return 'In terra fresca resta bagnata il doppio, e a chi ama l\'asciutto marciscono le radici.';
  if (!P.dry && terra === 'leggera') return 'In terra leggera l\'acqua scorre via, e qui si asciuga il doppio più in fretta.';
  return `Starebbe meglio in ${({ leggera: 'una terra leggera e sassosa', ricca: 'una terra da orto, ricca', fresca: 'una terra fresca, che resta umida' })[P.terra]}.`;
}
// key: 'good' | 'slow' | 'ready' | 'early' | 'drowned' | 'wilted' | 'harvest' | 'planted' | 'resoil' | 'moved' | 'ripe'
export function lineFor(key, id, ctx = {}) {
  const P = GARDEN[id];
  if (!P) return '';
  const The = cap(P.the);
  switch (key) {
    case 'good': return `${The} ${P.beve}: ${ao(id, 'bagnata', 'bagnato')} al momento giusto.`;
    case 'slow': return `${cap(ao(id, 'bagnata', 'bagnato'))} al momento giusto, ma cresce piano. ${lightWhy(id, ctx.light) || ''}`.trim();
    case 'ready': return `${cap(ao(id, 'bagnata', 'bagnato'))} al momento giusto, ${P.the} adesso è ${ao(id, 'pronta', 'pronto')} da raccogliere.`;
    case 'early': return P.dry
      ? `Ha ancora i piedi nell'acqua: ${P.the} si bagna quando la terra è asciutta anche a un dito di profondità.`
      : `La terra era ancora bagnata: ${P.the} si bagna quando si asciuga in superficie.`;
    case 'drowned': return 'Troppa acqua per chi ama l\'asciutto: ha perso un passo.';
    case 'wilted': return `Senz'acqua per tanti giorni, ${P.the} si è un po' ${ao(id, 'afflosciata', 'afflosciato')} e ha perso un passo.`;
    case 'harvest': return `Un mazzetto di ${P.the.replace(/^(la|il|lo) /, '').replace(/^l'/, '')} in dispensa.`;
    case 'planted': return `${The} è a dimora, e la terra è ancora bagnata.`;
    case 'resoil': return `${cap(ao(id, 'trapiantata', 'trapiantato'))} in ${(SOIL[ctx.terra]?.name || 'terra nuova').toLowerCase()}: ha perso un passo, come succede a ogni trapianto.`;
    case 'moved': return `Adesso sta in ${LIGHT[ctx.light] || 'un\'altra aiuola'}, con la sua terra.`;
    case 'ripe': return `È ${ao(id, 'pronta', 'pronto')}: adesso va ${ao(id, 'raccolta', 'raccolto')}, non ${ao(id, 'bagnata', 'bagnato')}.`;
    default: return '';
  }
}
// the topic of Ortica's lessons a line belongs to, and its fuller note once she has taken that lesson
// (state.garden.lessons[topic] = true; the chain "Le lezioni di Ortica" is not written yet)
const TOPIC = { good: 'acqua', early: 'acqua', drowned: 'acqua', wilted: 'acqua', slow: 'luce', light: 'luce', resoil: 'terra', soil: 'terra' };
export const lessonNote = (key, lessons = {}) => { const t = TOPIC[key] || key; return lessons?.[t] ? LESSON_NOTES[t] || null : null; };
