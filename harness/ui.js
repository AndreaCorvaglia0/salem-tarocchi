// Harness for the grimoire area: ?view=title|hud|io|carte|card|mappa|found|shop|levelup|lessons|minors
// &state=fresh|mid|late|study [&card=m05] [&tab=..]. Prepares a state with setState and mounts the view.
import '../src/core/fonts.js';
import { setState, state } from '../src/core/state.js';
import { emit } from '../src/core/bus.js';
import { provide, call } from '../src/core/services.js';
import '../src/ui/index.js';
import { SHEETS } from '../src/data/cards.js';
import { openLessons } from '../src/ui/lessons.js';
import { openMinors } from '../src/ui/minors.js';

const q = new URLSearchParams(location.search);
const view = q.get('view') || 'io', kind = q.get('state') || 'mid';
const DAY = 86400000, now = Date.now();
const card = (stars, extra = {}) => ({ found: true, stars, right: stars, wrong: 0, detail: 'a', words: ['coraggio', 'luce', ''], due: now + DAY, interval: 1, confiscated: false, at: now, ...extra });
const seenAll = (ids) => Object.fromEntries(ids.map((a) => [a, true]));
const V = ['village.arrival', 'village.square', 'village.malva_door', 'village.cottage_door', 'village.stall', 'village.curtain', 'village.garden', 'village.cart', 'village.forest_gate', 'malva.hearth', 'cottage.table'];
const STATES = {
  fresh: {},
  mid: {
    started: true, player: { name: 'Viola', birth: { d: 1, m: 10, y: 1996 }, sign: 'bilancia', birthCard: 'm11' }, chapter: 1, step: 'c1.malva',
    xp: 52, coins: 23, points: { m11: 2, m07: 3 }, lastPoint: 'm07',
    cards: { m00: card(1), m01: card(2), m02: card(0), m03: card(1, { due: now - 1000 }), m07: card(0, { confiscated: true }) },
    diary: [{ t: 'Malva non ringrazia mai. Dice che porta male.' }, { t: 'Ginepra mi ha soffiato una carta sotto il naso.' }, { t: 'Ho mentito al conestabile. Lo rifarei.' }],
    tools: { bottle: 1, incense: 2 }, lessons: { deck: true },
    stats: { seen: seenAll(V) },
  },
  late: {
    started: true, player: { name: 'Viola', birth: { d: 1, m: 10, y: 1996 }, sign: 'bilancia', birthCard: 'm11' }, chapter: 3, step: 'c1.malva',
    xp: 600, coins: 140, points: { m11: 4, m17: 6 }, lastPoint: 'm17',
    cards: Object.fromEntries(['m00', 'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'm16', 'm17', 'w01', 'c03', 'p10', 's12'].map((id, i) => [id, card(i % 4, { due: i % 5 ? now + DAY : now - 1, confiscated: id === 'm13' })])),
    diary: [{ t: 'Ginepra ha detto «Sono io». Non l\'ho fermata.' }, { t: 'Edera mi ha chiamata Rosa. Poi Viola. Poi niente.' }, { t: 'In piazza ho parlato. Lo rifarei.' }],
    tools: { bottle: 2, sieve: 1, incense: 1, pendulum: 3 }, powers: { cat: true, fire: true, seals: true, stun: true, broom: true },
    lessons: { deck: true, single: true, ppf: true, celtic: true }, flags: { 'ending.seen': false },
    stats: { seen: seenAll([...V, 'village.court_door', 'village.meeting_door', 'village.shop_door', 'village.venusglass', 'village.trapdoor', 'forest.entry', 'forest.ortica_hut', 'forest.campfire', 'forest.den', 'forest.lantern', 'forest.mill', 'forest.pond', 'forest.boundary', 'depths.entry', 'depths.edera_nook', 'depths.coven', 'depths.chains']) },
  },
};
STATES.study = { ...STATES.late, flags: { 'ending.seen': true } };
setState(STATES[kind] || {});
for (const [id, c] of Object.entries(state.cards)) c.detail = SHEETS[id]?.details?.[1]?.id || null;
// stand-ins for services of other areas
provide('world.where', () => Promise.resolve({ map: 'village', x: 0, y: 0, near: kind === 'late' ? 'forest.campfire' : 'village.square' }));
provide('world.travel', (a) => { console.log('travel', a); return Promise.resolve(); });
provide('review.open', () => new Promise((r) => setTimeout(r, 300)));
provide('reading.free', () => new Promise((r) => setTimeout(r, 300)));
window.__state = state; window.__emit = emit; window.__call = call;

const study = kind === 'study';
const go = {
  title: () => call('title.open').then((v) => console.log('title ->', v)),
  hud: () => call('hud.mount'),
  io: () => call('grimoire.open', { tab: 'io', study }),
  carte: () => call('grimoire.open', { tab: 'carte', study }),
  mappa: () => call('grimoire.open', { tab: 'mappa', study }),
  card: () => call('card.show', q.get('card') || 'm01'),
  found: () => call('card.found', q.get('card') || 'm11'),
  shop: () => call('shop.open'),
  lessons: () => openLessons({ study }),
  minors: () => openMinors(),
  levelup: () => { call('hud.mount'); setTimeout(() => emit('level:up', { level: 4, title: 'Fattucchiera', gift: { text: 'Sai accendere il fuoco: vedi nel buio.' } }), 300); },
};
(go[view] || go.io)();
