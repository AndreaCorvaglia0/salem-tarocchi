// The rules of the bookshelf (notes/libri/CONCETTO.md), pure: no DOM, no Phaser. Tested by tests/books.test.mjs.
// What she has: state.books[id] = { at, from } (the `start` book needs no entry), state.booksRead[id] = { at, n },
// state.bookDay = the day the last new book arrived (the pace). Mirrored in flags so that any condition of
// src/core/cond.js can ask: 'book.<id>' (she has it), 'book.<id>.read' (read to the end).
// albumSeen['book:<id>'] === false while it has never been opened («nuovo» on the spine).
// Asks done: state.world.once['book.ask.<id>.<who>'].
const box = (s, k) => (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) ? s[k] : (s[k] = {}));
const once = (s) => box(box(s, 'world'), 'once');

export const hasBook = (s, id, earn = {}) => earn[id]?.how === 'start' || !!s.books?.[id];
export const readBook = (s, id) => !!s.booksRead?.[id];
export const isNewBook = (s, id) => s.albumSeen?.[`book:${id}`] === false;
export const anyNewBook = (s) => Object.entries(s.albumSeen || {}).some(([k, v]) => v === false && k.startsWith('book:'));
export const countBooks = (s, list, earn) => list.filter((b) => hasBook(s, b.id, earn)).length;

// Give a book: -> true if it is new to her
export function giveBook(s, id, from, day = null, now = Date.now()) {
  if (s.books?.[id]) return false;
  box(s, 'books')[id] = { at: now, from };
  box(s, 'albumSeen')[`book:${id}`] = false;
  box(s, 'flags')[`book.${id}`] = true;
  if (day) s.bookDay = day;
  return true;
}
export const openedBook = (s, id) => { const k = `book:${id}`; if (s.albumSeen?.[k] === false) { s.albumSeen[k] = true; return true; } return false; };
// She reached the last page: -> true the first time
export function markRead(s, id, now = Date.now()) {
  const r = box(s, 'booksRead'), first = !r[id];
  r[id] = { at: first ? now : r[id].at, n: (r[id]?.n || 0) + 1 };
  box(s, 'flags')[`book.${id}.read`] = true;
  return first;
}

// The pace: one new book a day at most (the start book and the books lying in a place do not count)
export const paceOk = (s, day) => s.bookDay !== day;

// The book a delivery of kind `how` can bring now (the first in shelf order), or null.
//   who: for 'talk', the person she is talking to; map: for 'home', the map she entered
export function dueBook({ s, how, who = null, map = null, day, list, earn, test, giftGiven = () => true }) {
  if (how !== 'place' && !paceOk(s, day)) return null;
  for (const b of list) {
    const e = earn[b.id];
    if (!e || e.how !== how || hasBook(s, b.id, earn)) continue;
    if (how === 'talk' && e.who !== who) continue;
    if (how === 'home' && e.map !== map) continue;
    if (e.afterGift && !giftGiven(s, e.afterGift)) continue;
    if (!test(e.when ?? true, s)) continue;
    return b;
  }
  return null;
}

// The asks that `who` can answer now: books read, the ask not done yet. One per talk (the first).
export const askKey = (id, who) => `book.ask.${id}.${who}`;
export function dueAsk({ s, who, list, after }) {
  for (const b of list) {
    const a = after[b.id];
    if (a?.kind !== 'ask' || !readBook(s, b.id)) continue;
    const q = a.asks.find((x) => x.who === who && !s.world?.once?.[askKey(b.id, who)]);
    if (q) return { id: b.id, ...q };
  }
  return null;
}
export const markAsk = (s, id, who) => { once(s)[askKey(id, who)] = true; };

// The shelf: one place per book of the catalogue. What she has shows its spine; a missing one is only a
// mark in the dust, with no title, author or giver (lore/metodo/principi/vede-solo-quello-che-sa.md).
export const shelfSlots = (s, list, earn) => list.map((b) => (hasBook(s, b.id, earn)
  ? { id: b.id, have: true, spine: b.spine, from: b.from, leather: b.leather, nuovo: isNewBook(s, b.id), read: readBook(s, b.id) }
  : { have: false }));

// The order of the pages for one opening: in order, or shuffled (the unreadable book), the truth page last
export function pageOrder(book, rnd = Math.random) {
  const idx = book.pages.map((_, i) => i);
  if (book.shuffle) for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}
