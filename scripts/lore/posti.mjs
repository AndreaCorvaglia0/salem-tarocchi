// Where a concept of the course stands in the game, read from the game's data (never invented): the
// vault cards say it in `sta_in`, `arriva_da`, `la_da` and `si_impara_da`, and tests/lore.corso.test.mjs
// compares the cards with what this file computes, so the two cannot drift apart.
//   expectedPlaces(vault) -> { concept file name: { sta_in?, arriva_da?, la_da?, si_impara_da? } , none: [{ name, why }] }
// Values are vault file names (the link target without [[ ]]). `none` lists what has data but no card in the
// vault to point to (never invented: the report says it).
//
// The rules, one per family:
//   arcano   the `spot` anchor of src/data/cards.base.js: the luogo with that `id`, else the luogo of the
//            place the anchor belongs to (placeOf in src/ui/sketchmap.js); the four without a spot (the Fool,
//            the Sun, the Judgement, the World) say `arriva_da`: the fatto that gives the card
//   erba     src/data/world/herbs.js: the spot nearest to a place of the pencil map (or to an anchor that has a
//            luogo card), then that place; farther than FAR tiles: the region
//   pietra   src/data/world/finds.js: the same rule; stones given by someone (src/data/gifts.js): `la_da`
//   seme, numero, figura, stesa, regola   `si_impara_da`: the mistress of the lesson (src/data/lessons.js,
//            or `taughtBy` in src/data/spreads.js)
import { MAJORS } from '../../src/data/cards.base.js';
import { SPREADS } from '../../src/data/spreads.js';
import { LESSONS } from '../../src/data/lessons.js';
import { HERB_SPOTS } from '../../src/data/world/herbs.js';
import { FIND_SPOTS } from '../../src/data/world/finds.js';
import { GIFTS } from '../../src/data/gifts.js';
import { STONE_LIST } from '../../src/data/stones.js';
import { DEFS } from '../../src/data/world/index.js';
import { SESSIONS } from '../../src/data/story/sessions.js';
import { REGIONS, grid, placeOf } from '../../src/ui/sketchmap.js';

export const FAR = 6;
// the lesson that teaches each concept (the first that does)
export const LESSON_OF = {
  'seme-bastoni': 'suits', 'seme-coppe': 'suits', 'seme-spade': 'suits', 'seme-denari': 'suits',
  'numero-asso': 'minors2', 'numero-due': 'minors2', 'numero-tre': 'minors2',
  'numero-quattro': 'minors3', 'numero-cinque': 'minors3', 'numero-sei': 'minors3',
  'numero-sette': 'minors4', 'numero-otto': 'minors4', 'numero-nove': 'minors4', 'numero-dieci': 'minors4',
  'figura-fante': 'minors5', 'figura-cavaliere': 'minors5', 'figura-regina': 'minors5', 'figura-re': 'minors5',
  'regola-le-capovolte': 'reversed',
};
export const SPREAD_OF = { 'stesa-carta-singola': 'single', 'stesa-passato-presente-futuro': 'ppf', 'stesa-croce-celtica': 'celtic' };
const lessonBy = (id) => LESSONS.find((l) => l.id === id)?.by;

export function expectedPlaces(V) {
  const out = {}, none = [];
  const luoghi = V.ofTipo('luogo');
  const byId = new Map(luoghi.filter((d) => d.data.id).map((d) => [d.data.id, d.name]));
  const doorOf = Object.fromEntries(DEFS.filter((d) => d.mapDoor).map((d) => [d.id, d.mapDoor]));
  // an anchor -> a luogo: the luogo with that id, or the one of the interior whose door it is
  const luogoOf = (anchor) => byId.get(anchor) || Object.entries(doorOf).map(([m, d]) => (d === anchor && byId.get(m)) || null).find(Boolean) || null;
  const luogoOfAnchor = (anchor) => luogoOf(anchor) || luogoOf(placeOf(anchor));
  const persona = (id) => V.ofTipo('persona').find((d) => d.data.id === id)?.name || null;
  const set = (name, field, value, why) => { if (value) (out[name] ||= {})[field] = value; else none.push({ name, why }); };

  // the nearest place (pencil map, or an anchor with a luogo card) to a tile
  const nearest = (map, x, y) => {
    const g = grid(map);
    const cand = new Set([...Object.keys(REGIONS[map].places), ...Object.keys(g.anchors).filter((a) => luogoOf(a))]);
    let best = null, bd = Infinity;
    for (const p of cand) { const [ax, ay] = g.anchors[p]; const d = Math.hypot(ax - x, ay - y); if (d < bd) { bd = d; best = p; } }
    return { place: best, d: bd };
  };
  const luogoAt = (map, x, y) => { const n = nearest(map, x, y); return { n, luogo: n.d <= FAR ? luogoOf(n.place) : byId.get(map) || null }; };

  // ---- arcani
  for (const m of MAJORS) {
    const card = V.ofTipo('concetto').find((d) => d.data.famiglia === 'arcano' && d.data.id === m.id);
    if (!card) continue;
    if (m.spot) set(card.name, 'sta_in', luogoOfAnchor(m.spot), `${m.id} ${m.name}: anchor ${m.spot} has no luogo in the vault`);
    else {
      const fatto = V.ofTipo('fatto').find((f) => new RegExp(`giveCard ${m.id}\\b`).test(f.data.flag || ''))?.name
        || (m.id === 'm00' && JSON.stringify(SESSIONS.s0).includes(`"turn":"${m.id}"`) ? V.ofTipo('fatto').find((f) => f.data.scena === 'sessions.js#s0')?.name : null);
      set(card.name, 'arriva_da', fatto, `${m.id} ${m.name}: no fatto in the vault gives the card`);
    }
  }
  // ---- erbe: the spot nearest to a place
  for (const d of V.ofTipo('concetto').filter((x) => x.data.famiglia === 'erba')) {
    const id = d.data.id;
    const spots = HERB_SPOTS.filter((h) => h.id === id);
    if (!spots.length) { none.push({ name: d.name, why: `${id || d.name}: not in src/data/world/herbs.js (no spot in the world)` }); continue; }
    let best = null;
    for (const s of spots) { const r = luogoAt(s.map, s.x, s.y); if (!best || r.n.d < best.n.d) best = r; }
    set(d.name, 'sta_in', best.luogo, `${id}: no luogo near its spot`);
  }
  // ---- pietre: on the ground, or given
  for (const st of STONE_LIST) {
    const name = st.sapere;
    if (!V.get(name)) continue;
    const spot = FIND_SPOTS.find((f) => f.stone === st.id);
    const gift = GIFTS.find((g) => g.stone === st.id);
    if (spot) set(name, 'sta_in', luogoAt(spot.map, spot.x, spot.y).luogo, `${st.id}: no luogo near its spot`);
    else if (gift) set(name, 'la_da', persona(gift.who), `${st.id}: ${gift.who} has no persona card`);
    else none.push({ name, why: `${st.id}: neither on the ground nor given` });
  }
  // ---- semi, numeri, figure, regola: the lesson; stese: the spread's mistress
  for (const [name, lesson] of Object.entries(LESSON_OF)) if (V.get(name)) set(name, 'si_impara_da', persona(lessonBy(lesson)), `${name}: lesson ${lesson}`);
  for (const [name, sp] of Object.entries(SPREAD_OF)) if (V.get(name)) set(name, 'si_impara_da', persona(SPREADS[sp].taughtBy), `${name}: ${sp}`);
  return { places: out, none };
}
