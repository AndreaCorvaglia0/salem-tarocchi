// Drawing as pure functions: weighted choice, a weighted sample for the fan, the number said aloud
// mapped onto the pool. Deterministic where it can be (the number), random only through rng.
export const weightOf = (weights, id) => { const w = weights?.[id]; return w == null ? 1 : Math.max(0, Number(w) || 0); };

// One id, with weights ({ id: n }, missing = 1). Falls back to uniform if every weight is 0.
export function weightedPick(pool, weights, rng = Math.random) {
  if (!pool.length) return null;
  const ws = pool.map((id) => weightOf(weights, id));
  const total = ws.reduce((a, b) => a + b, 0);
  if (total <= 0) return pool[Math.floor(rng() * pool.length)];
  let t = rng() * total;
  for (let i = 0; i < pool.length; i++) { t -= ws[i]; if (t < 0) return pool[i]; }
  return pool[pool.length - 1];
}
// n distinct ids, each pick weighted.
export function weightedSample(pool, n, weights, rng = Math.random) {
  const left = [...pool], out = [];
  while (out.length < n && left.length) { const id = weightedPick(left, weights, rng); out.push(id); left.splice(left.indexOf(id), 1); }
  return out;
}
// "Dimmi un numero da uno a N": N is at least 22 so that the number feels like cutting a real deck.
export const numberRange = (poolSize) => Math.max(22, poolSize);
// The deck is cut at the number: the pool is laid on a line (each card as wide as its weight) and the
// number points at a place on it. Same number, same pool, same card.
export function numberToCard(n, pool, weights, max = numberRange(pool.length)) {
  if (!pool.length) return null;
  const k = Math.min(max, Math.max(1, Math.round(n)));
  const ws = pool.map((id) => weightOf(weights, id));
  const total = ws.reduce((a, b) => a + b, 0) || pool.length;
  const at = ((k - 0.5) / max) * total;
  let acc = 0;
  for (let i = 0; i < pool.length; i++) { acc += total === pool.length && !ws.some(Boolean) ? 1 : ws[i]; if (at < acc) return pool[i]; }
  return pool[pool.length - 1];
}
