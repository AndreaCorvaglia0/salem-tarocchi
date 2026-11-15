// What is still hidden in the world for a given state: Major Arcana spots not found yet (and allowed
// in this chapter, or her birth card) and chests not opened. The sixth sense and world.sensed() read
// it. Pure: runs in node.
import { MAJORS } from '../data/cards.base.js';
import { MAPS, nearAnchor } from './maps.js';

// Il Carro comes from the story (c1.venus); the last three Majors have no spot
export const cardActive = (c, s) => !!c.spot && c.id !== 'm07' && !s.cards?.[c.id]?.found && (s.player?.birthCard === c.id || (s.chapter || 0) >= c.row);

// -> [{ kind: 'card' | 'chest', id, anchor, map, x, y }]
export function hiddenSpots(s, mapId = null) {
  const maps = MAPS(), out = [];
  for (const c of MAJORS) {
    if (!cardActive(c, s)) continue;
    const [m] = c.spot.split('.'), a = maps[m]?.anchors[c.spot];
    if (a && (!mapId || m === mapId)) out.push({ kind: 'card', id: c.id, anchor: c.spot, map: m, x: a.x, y: a.y });
  }
  for (const m of Object.values(maps)) {
    if (mapId && m.id !== mapId) continue;
    for (const ch of m.chests) if (!s.world?.opened?.[ch.id]) out.push({ kind: 'chest', id: ch.id, anchor: nearAnchor(m.id, ch.x, ch.y, 6), map: m.id, x: ch.x, y: ch.y });
  }
  return out;
}

// What the sixth sense feels from pos { map, x, y } with a radius in tiles (Infinity: every map).
export function sensedFrom(s, pos, radius) {
  if (!radius || !pos) return [];
  const all = hiddenSpots(s, radius === Infinity ? null : pos.map);
  return all.map((h) => ({ ...h, dist: h.map === pos.map ? Math.hypot(h.x - pos.x, h.y - pos.y) : Infinity }))
    .filter((h) => radius === Infinity || h.dist <= radius)
    .sort((a, b) => a.dist - b.dist);
}
