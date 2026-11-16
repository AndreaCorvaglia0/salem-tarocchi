// Special answers in a choice (docs/DESIGN.md "La terza risposta", "Le risposte speciali si sommano"):
// an option may carry `special: 'pop' | 'rank' | 'magic' | 'broom' | 'tartufo' | 'witch' | 'explore' |
// 'trait'` with its `when` and an optional `tag` text. They go after the ordinary options, in their
// order, and the UI shows them as extra with the tag above the text. Pure (tests/story.special.test.mjs).
import { titleOf } from '../core/progress.js';

export const SPECIALS = ['pop', 'rank', 'magic', 'broom', 'tartufo', 'witch', 'explore', 'trait'];
export const SPECIAL_TAGS = {
  pop: '[Popolare]', magic: '[Magia]', broom: '[Hai la scopa]', tartufo: '[Tartufo]',
  witch: '[Una strega amica]', explore: '[Conosci la strada]', trait: '[È da te]',
};
// rank: her current title (Fattucchiera from level 4, Strega from 7; a Novice never sees it in practice)
export const rankTag = (title = titleOf()) => (['Strega', 'Gran Maestra'].includes(title) ? '[Strega]' : '[Fattucchiera]');

const isSpecial = (o) => !!o && SPECIALS.includes(o.special);
// The tag shown above a special option: its own text (a string `tag`; an object `tag` is a card point), or the default.
export function specialTag(o, title) {
  if (!isSpecial(o)) return null;
  if (typeof o.tag === 'string' && o.tag.trim()) { const t = o.tag.trim(); return t.startsWith('[') ? t : `[${t}]`; }
  if (o.special === 'rank') return rankTag(title);
  return SPECIAL_TAGS[o.special];
}
// Ordinary options first, then the specials, each group in its written order.
export const orderOptions = (opts) => [...opts.filter((o) => !isSpecial(o)), ...opts.filter(isSpecial)];
// What the UI receives next to the texts: null for ordinary options, { special, tag } for the extras.
export const metaOf = (o, title) => (isSpecial(o) ? { special: o.special, tag: specialTag(o, title) } : null);
// UIs accept a list of strings or of { t, special?, tag? }, plus an optional metas list: -> [{ t, meta }]
export const normalizeChoices = (texts, metas = []) => (texts || []).map((x, i) => {
  if (x && typeof x === 'object') return { t: String(x.t ?? ''), meta: x.special ? { special: x.special, tag: x.tag || SPECIAL_TAGS[x.special] || null } : metas[i] || null };
  return { t: String(x ?? ''), meta: metas[i] || null };
});
