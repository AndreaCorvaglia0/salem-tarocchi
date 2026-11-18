// The albums in play (notes/collezioni.md): stones and the figures of the peddler's sibyl.
//   find.take(spotId, { from })  something picked up from the ground (world/scene/finds.js): it goes into
//                                the grimoire with a small flight, a small sound and one short line. No page.
//   gifts «a corredo» (data/gifts.js): when she talks freely to someone (bus `talk`, never before a scene
//                                that moves the main path), that person may give a stone or two or three
//                                figures with one line; Tartufo brings his when she walks into a map
//   the first of each kind: Edera (stones) and Ginepra (figures) say a few words once, at the first free
//                                talk after she has one (before meeting them she cannot hear them)
//   collect.show(giftId)         the flight of a gift, played from inside its line (a story node do:'call')
// Rules: glue/collect.rules.js. Everything depends on what she has, so a save far ahead gets it all.
import { provide, call, has } from '../core/services.js';
import { on, emit } from '../core/bus.js';
import { state, save } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { test } from '../core/cond.js';
import { addXp } from '../core/progress.js';
import { CAST, SCRIPTS } from '../data/story/index.js';
import { FIND_SPOTS } from '../data/world/finds.js';
import { GIFTS, GIFT, FIRST } from '../data/gifts.js';
import { STONE } from '../data/stones.js';
import { sibylThumb, sibylFindLine } from '../data/sibyl.js';
import { movesStory } from './bonds.rules.js';
import { takeSpot, giftFor, giveGift, firstDue, markFirst, countOf } from './collect.rules.js';
import { flyToBook, stoneSrc } from '../ui/collect.js';

export const FIND_XP = 2;
const picOf = (src) => (src.stone ? stoneSrc(src.stone) : { src: sibylThumb(src.sibyl[0]), px: false });
export const lineOf = (src) => (src.stone ? STONE[src.stone].find : sibylFindLine(src.sibyl));
const sfx = () => { if (has('sound.play')) Promise.resolve(call('sound.play', 'pick')).catch(() => {}); };
function fly(src, from = null) {
  try { flyToBook({ ...picOf(src), from }); } catch { /* no DOM (tests): it is in the album all the same */ }
  sfx();
}

provide('find.take', async (id, { from = null } = {}) => {
  const sp = FIND_SPOTS.find((s) => s.id === id);
  if (!sp || !test(sp.when ?? true)) return false;
  const got = takeSpot(state, sp);
  save();
  if (!got.length) return false;
  addXp(FIND_XP, 'find');
  emit('collect', { from: sp.id, items: got });
  fly(sp, from);
  if (has('hud.toast')) call('hud.toast', lineOf(sp));
  return true;
});
provide('collect.show', (giftId) => { const g = GIFT[giftId]; if (g) fly(g); return Promise.resolve(); });

// What `who` says now in a free talk: the first-of-a-kind words and a gift (its flight, then its line). If she
// already had one of that kind, the words come first (they are about what she found) and the gift after; if
// her first one is this very gift, the gift comes first and the words follow in their `given` form.
export function talkNodes(who) {
  const before = [], after = [];
  for (const k of firstDue({ who, s: state, first: FIRST })) { markFirst(state, k); before.push(...FIRST[k].lines.map((t) => ({ say: FIRST[k].who, t }))); }
  const gift = [];
  const g = giftFor({ who, s: state, test, gifts: GIFTS });
  if (g) {
    const got = giveGift(state, g);
    if (got.length) {
      addXp(FIND_XP, 'gift');
      emit('collect', { from: g.id, items: got });
      gift.push({ do: 'call', name: 'collect.show', args: [g.id] }, { say: g.say, t: g.line });
    }
  }
  for (const k of firstDue({ who, s: state, first: FIRST })) { // her first one of this kind is the gift just made
    markFirst(state, k);
    after.push(...(FIRST[k].given || FIRST[k].lines).map((t) => ({ say: FIRST[k].who, t })));
  }
  const nodes = [...before, ...gift, ...after];
  if (nodes.length) save();
  return nodes;
}

// the entry the world shows for that id there (the first one whose condition holds: core order of CAST)
const castOf = (id, at) => (CAST || []).find((c) => c.id === id && c.kind === 'npc' && (!at || c.at === at) && test(c.when ?? true)) || null;
on('talk', ({ id, at } = {}) => {
  const e = castOf(id, at);
  if (!e || !e.who || movesStory(e.script, SCRIPTS)) return;
  const nodes = talkNodes(e.who);
  // queued before the person's own script, which the world runs right after this event (glue/bonds.js does the same)
  if (nodes.length && has('story.run')) call('story.run', nodes);
});

// Tartufo brings what he finds when they walk into a map together, once he is with her
const busy = async () => blocked() || (has('story.busy') && !!(await call('story.busy')));
on('map:enter', () => {
  if (!state.powers?.cat || !giftFor({ who: 'tartufo', s: state, test, gifts: GIFTS })) return;
  setTimeout(async () => {
    if (await busy()) return; // another time
    const nodes = talkNodes('tartufo');
    if (nodes.length && has('story.run')) call('story.run', nodes);
  }, 1600);
});
