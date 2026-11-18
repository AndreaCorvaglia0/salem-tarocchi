// The rules of the albums (notes/collezioni.md), pure: no DOM, no Phaser. Tested by tests/collect.test.mjs.
// An item is { kind: 'stone' | 'sibyl', id }. A source (a spot on the ground or a gift) has `stone` or `sibyl`.
// What she has: state.stones[id], state.oracle[n] = { at, from }; state.oracleFrom[from] = { who, phrase, cards };
// state.albumSeen['<kind>:<id>'] === false while its album page has never been opened («nuova»).
// Taken spots and given gifts live in state.world.once ('find.<id>', 'gift.<id>'); the first-of-a-kind words
// in 'first.<kind>'.
export const itemsOf = (src) => (src?.stone ? [{ kind: 'stone', id: src.stone }] : (src?.sibyl || []).map((n) => ({ kind: 'sibyl', id: n })));
export const keyOf = (it) => `${it.kind}:${it.id}`;
const box = (s, k) => (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) ? s[k] : (s[k] = {}));
const once = (s) => box(box(s, 'world'), 'once');
export const hasItem = (s, it) => !!(it.kind === 'stone' ? s.stones?.[it.id] : it.kind === 'sibyl' ? s.oracle?.[it.id] : s.herbs?.[it.id]);
export const countOf = (s, kind) => Object.keys((kind === 'stone' ? s.stones : kind === 'sibyl' ? s.oracle : s.herbs) || {}).length;

// Put a source's items in her albums -> the items that are new to her. `from`: the spot or gift id.
export function addItems(s, src, from, now = Date.now(), extra = {}) {
  const fresh = itemsOf(src).filter((it) => !hasItem(s, it));
  for (const it of fresh) {
    box(s, it.kind === 'stone' ? 'stones' : 'oracle')[it.id] = { at: now, from };
    box(s, 'albumSeen')[keyOf(it)] = false;
  }
  if (src?.sibyl?.length) box(s, 'oracleFrom')[from] = { who: extra.who || null, phrase: extra.phrase || null, cards: [...src.sibyl] };
  return fresh;
}

// ---- the ground ----
export const spotTaken = (s, id) => !!s.world?.once?.[`find.${id}`];
export const spotActive = (spot, s, test) => !spotTaken(s, spot.id) && test(spot.when ?? true, s);
export function takeSpot(s, spot, now = Date.now()) {
  if (spotTaken(s, spot.id)) return [];
  once(s)[`find.${spot.id}`] = true;
  return addItems(s, spot, spot.id, now);
}

// ---- the gifts ----
export const giftGiven = (s, id) => !!s.world?.once?.[`gift.${id}`];
// The gift `who` gives now, if any: the first of the list not given yet whose `after` is given and whose
// condition holds. One per talk.
export const giftFor = ({ who, s, test, gifts }) => gifts.find((g) => g.who === who && !giftGiven(s, g.id) && (!g.after || giftGiven(s, g.after)) && test(g.when ?? true, s)) || null;
export function giveGift(s, g, now = Date.now()) {
  if (giftGiven(s, g.id)) return [];
  once(s)[`gift.${g.id}`] = true;
  return addItems(s, g, g.id, now, { who: g.who, phrase: g.phrase || null });
}

// ---- the first of each kind: who says a few words, once, as soon as she has one and talks to them ----
export const firstDue = ({ who, s, first }) => Object.keys(first).filter((k) => first[k].who === who && countOf(s, k) > 0 && !s.world?.once?.[`first.${k}`]);
export const markFirst = (s, kind) => { once(s)[`first.${kind}`] = true; };
export const firstTold = (s, kind) => !!s.world?.once?.[`first.${kind}`];

// The herbarium: only the very first plant she ever notices opens its page by itself (old saves are past it).
export const herbOpensPage = (s) => countOf(s, 'herb') === 0;

// ---- the albums ----
export const isNew = (s, kind, id) => s.albumSeen?.[`${kind}:${id}`] === false;
export const albumHasNew = (s, kind) => Object.entries(s.albumSeen || {}).some(([k, v]) => v === false && k.startsWith(`${kind}:`));
export const markSeen = (s, kind, id) => { const k = `${kind}:${id}`; if (s.albumSeen?.[k] === false) { s.albumSeen[k] = true; return true; } return false; };
// The slots of an album: what she has shows its name; a missing one is only a number, never a name.
export const albumSlots = (s, kind, list) => list.map((x, i) => {
  const id = kind === 'sibyl' ? x.n : x.id;
  const have = hasItem(s, { kind, id });
  return have ? { n: i + 1, id, have: true, name: x.name, nuova: isNew(s, kind, id) } : { n: i + 1, have: false };
});
// The cards that came together with this one, and the phrase they came with (for its album page).
export function cameWith(s, n) {
  const from = s.oracle?.[n]?.from;
  const g = from ? s.oracleFrom?.[from] : null;
  if (!g) return null;
  return { from, who: g.who, phrase: g.phrase, others: (g.cards || []).filter((c) => c !== n) };
}
