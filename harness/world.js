// Harness for the world: a prepared state, stub services, the world started.
// Query: ?map=forest | ?at=village.square, ?chapter=2, ?cat ?fire ?far ?stun ?seals, ?fail (Exams fail),
// ?clean (no cards found). window.__world: { go(anchor), anchors(), where(), scene() }.
import '../src/core/fonts.js';
import { setState, state } from '../src/core/state.js';
import { provide } from '../src/core/services.js';
import { findCard } from '../src/core/progress.js';
import { h, root } from '../src/core/dom.js';
import { CARD } from '../src/data/cards.base.js';
import { anchorOf } from '../src/world/maps.js';
import { start, debug } from '../src/world/index.js';

const q = new URLSearchParams(location.search);
const chapter = Number(q.get('chapter') || 1);
const at = q.get('at') || (q.get('map') ? `${q.get('map')}.${q.get('map') === 'village' ? 'arrival' : ['forest', 'depths'].includes(q.get('map')) ? 'entry' : 'door'}` : 'village.arrival');
const a = anchorOf(at);
setState({
  started: true, chapter, step: 'c1.malva',
  player: { name: 'Ada', birth: { d: 1, m: 10, y: 1995 }, sign: 'bilancia', birthCard: 'm11' },
  cards: q.has('clean') ? {} : { m00: { found: true, stars: 1, words: ['', '', ''] }, m01: { found: true, stars: 0, words: ['', '', ''] } },
  powers: { cat: q.has('cat'), fire: q.has('fire'), stun: q.has('stun'), seals: q.has('seals'), broom: false },
  flags: { 'sight.far': q.has('far'), 'shop.open': q.has('shop') },
  pos: a ? { map: a.map, x: a.x, y: a.y } : null,
});

let tt = null;
const toast = (t) => {
  document.querySelector('.h-toast')?.remove();
  const el = h('div.h-toast', t); root().append(el);
  clearTimeout(tt); tt = setTimeout(() => { el.style.opacity = 0; setTimeout(() => el.remove(), 400); }, 2200);
};
provide('hud.toast', (t) => { toast(t); return Promise.resolve(); });
provide('story.run', (id) => { console.log('[stub] story.run', id); toast(`(scena: ${id})`); return Promise.resolve(); });
provide('card.found', (id) => { findCard(id); toast(`Hai trovato ${CARD[id].name}.`); return Promise.resolve(); });
provide('exam.start', (o) => { console.log('[stub] exam.start', o); toast(`Esame (${o.kind}, ${o.place})`); return new Promise((r) => setTimeout(() => r({ passed: !q.has('fail'), right: 3, wrong: 0, suspicion: 10 }), 900)); });
provide('lock.ask', (o) => { console.log('[stub] lock.ask', o); return Promise.resolve(true); });

start().then(() => console.log('[harness] world ready at', debug.where()));
window.__world = {
  go: (ref) => debug.travel(ref),
  anchors: () => Object.keys(debug.anchors()),
  where: () => debug.where(),
  scene: () => debug.scene(),
  state,
};
