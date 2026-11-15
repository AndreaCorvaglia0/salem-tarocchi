// The Minor Arcana in the tall grass (docs/DESIGN.md "Le carte"): while she walks in grass tagged
// with a suit, now and then something glints two or three tiles ahead; using it gives a Minor of
// that suit, by rarity, or a duplicate. The rules here are pure (the scene, scene/minors.js, and the
// simulation, minorsim.js, share them); the numbers are tuned in tests/world.minors.test.mjs.
import { MINORS } from '../data/cards.base.js';

export const MINOR = {
  chance: 0.3,     // per step on tagged grass, once the cooldown is over
  cooldown: 20000,  // ms after a glint appears and after a pick-up: never two Minors within 20 s
  ttl: 14000,       // a glint not taken fades after this, or when she walks 7 tiles away
  away: 7,
  odds: { common: 0.8, uncommon: 0.06, rare: 0.14 }, // per rarity: 9 commons, 1 Ace, 4 court cards a suit
  coins: { common: 2, uncommon: 3, rare: 5 },         // a duplicate is worth a few coins
};
// none in the prologue, on the arrival road or before she has reached Malva
export const MINORS_WHEN = [{ chapterMin: 1 }, { not: { stepIn: ['p.session', 'p.road', 'c1.malva'] } }];

export function rollRarity(rng = Math.random) {
  const r = rng(), o = MINOR.odds;
  return r < o.common ? 'common' : r < o.common + o.uncommon ? 'uncommon' : 'rare';
}
export function pickMinor(suit, rng = Math.random) {
  const rarity = rollRarity(rng), pool = MINORS.filter((c) => c.suit === suit && c.rarity === rarity);
  return pool[Math.floor(rng() * pool.length)];
}

const STEP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
// a grass tile of the same suit two or three tiles ahead (straight first, then a little aside)
export function spotAhead(map, x, y, dir, suit, ok, rng = Math.random) {
  const [dx, dy] = STEP[dir] || [0, 1], px = -dy, py = dx;
  const tries = [];
  for (const n of rng() < 0.5 ? [2, 3] : [3, 2]) for (const side of [0, 1, -1]) tries.push([x + dx * n + px * side, y + dy * n + py * side]);
  return tries.find(([tx, ty]) => map.suitAt(tx, ty) === suit && ok(tx, ty)) || null;
}

// One glint at a time, with a cooldown. step() is called on every tile she arrives on.
export class Glinter {
  constructor(rng = Math.random) { Object.assign(this, { rng, glint: null, readyAt: 0 }); }
  step(map, x, y, dir, now, ok) {
    const g = this.glint;
    if (g && (now - g.at > MINOR.ttl || Math.hypot(g.x - x, g.y - y) > MINOR.away)) this.glint = null;
    if (this.glint || now < this.readyAt) return null;
    const suit = map.suitAt(x, y);
    if (!suit || this.rng() >= MINOR.chance) return null;
    const at = spotAhead(map, x, y, dir, suit, ok, this.rng);
    if (!at) return null;
    this.glint = { x: at[0], y: at[1], suit, at: now };
    this.readyAt = now + MINOR.cooldown;
    return this.glint;
  }
  take(now) { const g = this.glint; this.glint = null; this.readyAt = Math.max(this.readyAt, now + MINOR.cooldown); return g; }
}

// What a pick-up gives: { id, dupe, coins }. owned(id) -> true if she already has it.
export function gift(suit, owned, rng = Math.random) {
  const c = pickMinor(suit, rng);
  return owned(c.id) ? { id: c.id, dupe: true, coins: MINOR.coins[c.rarity] } : { id: c.id, dupe: false, coins: 0 };
}
