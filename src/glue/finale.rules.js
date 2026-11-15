// The final Celtic cross (docs/DESIGN.md, "Finale"): ten cards made of her game. Pure: it takes a
// snapshot of what it needs, so tests can feed it anything.
//   finalCards({ yourCard, mostMissed, birthCard, flags, mostTrusting, owned, rng }) -> 10 entries
//   (card ids, plus 'fan' at 6 and 'number' at 10: the reading draws those two)
import { PEOPLE } from '../data/cards.base.js';

export const FORK3 = { stealth: 'm18', open: 'm11' }; // La Luna for the dark way, La Giustizia for the open one
const leafCard = (flags, kind) => Object.keys(flags || {}).find((k) => k.startsWith(`leaf.${kind}.`) && flags[k])?.slice(`leaf.${kind}.`.length) || null;

export function finalCards({ yourCard, mostMissed, birthCard, flags = {}, mostTrusting, owned = [], rng = Math.random }) {
  const pickOwned = (taken) => { const free = owned.filter((id) => !taken.has(id)); return free.length ? free[Math.floor(rng() * free.length)] : null; };
  const want = [
    yourCard || null,
    mostMissed || pickOwned(new Set()),
    birthCard || 'm00',
    flags['b3.stealth'] ? FORK3.stealth : flags['b3.open'] ? FORK3.open : null,
    leafCard(flags, 'dream'),
    'fan',
    leafCard(flags, 'value'),
    PEOPLE[mostTrusting]?.card || null,
    leafCard(flags, 'fear'),
    'number',
  ];
  // all different: a repeat (or a hole) becomes another Major she owns; 'fan' and 'number' stay draws
  const taken = new Set();
  return want.map((id) => {
    if (id === 'fan' || id === 'number') return id;
    if (id && !taken.has(id)) { taken.add(id); return id; }
    const other = pickOwned(taken);
    if (other) { taken.add(other); return other; }
    return 'fan';
  });
}
