// Who knocks at the cottage after the first, scripted reading of a chapter: a client of this chapter
// not read yet (random), then, when all are done, old faces come back. Pure (tests).
//   nextClient({ clients, chapter, done(id), spreads, rng }) -> { id, spread, back } | null
const BY_CHAPTER = { 1: 'single', 2: 'ppf', 3: 'celtic' };

export function nextClient({ clients, chapter, done, spreads = {}, rng = Math.random }) {
  const ch = Math.min(3, Math.max(1, chapter || 1));
  const known = ['single', 'ppf', 'celtic'].filter((s) => spreads[s]);
  if (!known.length) return null;
  const mine = clients.filter((c) => c.chapter === ch);
  const fresh = mine.filter((c) => !done(c.id));
  const pool = fresh.length ? fresh : clients.filter((c) => c.chapter >= 1 && c.chapter <= ch);
  if (!pool.length) return null;
  const c = pool[Math.floor(rng() * pool.length)];
  // a new client asks for the chapter's spread; one who comes back takes any spread she knows
  const want = BY_CHAPTER[c.chapter];
  const spread = !fresh.length ? known[Math.floor(rng() * known.length)] : spreads[want] ? want : known[known.length - 1];
  return { id: c.id, spread, back: !fresh.length };
}
