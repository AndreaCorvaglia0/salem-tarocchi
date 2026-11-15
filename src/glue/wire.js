// The last connections between the world, the story and the interface hints:
// the thick fog that turns her back, the small cards in the grass, an obstacle she cannot pass yet,
// swapping duplicates with Ginepra, and the hints nobody else emits.
import { on } from '../core/bus.js';
import { call, has, wrap, provide } from '../core/services.js';
import { state } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { hintOnce } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { barkFor, throttle } from './barks.js';
import { openTrade } from '../ui/trade.js';

// her own thought when an obstacle does not give way (the magic for it comes with her rank)
export const BLOCKED = {
  brambles: 'Questi rovi sono troppo fitti per passarci in mezzo: ci vorrebbe un fuoco per bruciarli.',
  roots: 'Le radici tengono stretto, e a mani nude non si smuovono di un dito.',
  stone: 'La pietra ha un segno inciso e non si sposta: con le mani sole non ce la farò mai.',
};
export const LOST_AGAIN = 'La nebbia mi ha fatta girare in tondo un’altra volta, e sono di nuovo al punto di partenza.';

const once = throttle(6000);
const toast = (t) => { if (t) call('hud.toast', t); };
const cat = (situation) => { if (state.powers.cat) toast(barkFor('tartufo', situation)); };
// run when nothing covers the world and no script is playing (a ceremony may still be closing)
async function whenFree(fn, tries = 40) {
  for (let i = 0; i < tries; i++) {
    const busy = blocked() || (has('story.busy') && (await call('story.busy')));
    if (!busy) return fn();
    await new Promise((r) => setTimeout(r, 300));
  }
}
const run = (id) => whenFree(() => (has('story.run') ? call('story.run', id) : null));

on('blocked', ({ kind } = {}) => { if (BLOCKED[kind] && once(`blocked.${kind}`)) toast(BLOCKED[kind]); });
on('lost', () => { if (!state.flags['fog.lost']) run('fog.lost'); else if (once('lost', 20000)) toast(LOST_AGAIN); });
on('card:found', ({ id } = {}) => {
  if (CARD[id]?.arcana !== 'minor') return;
  if (!state.flags['minor.first']) run('minor.first'); else if (once('minor', 1000)) whenFree(() => cat('minor'));
});
on('dupe', () => { if (!state.flags['minor.dup']) run('minor.dup'); else cat('minor.dup'); });

provide('trade.open', () => openTrade());

// ---- hints that belong to nobody else
const later = (id, ms = 800) => setTimeout(() => whenFree(() => hintOnce(id)), ms);
wrap('shop.open', async (prev, o) => { later('shop', 600); return prev?.(o); });
wrap('draw.pick', async (prev, o) => { later('draw', 600); return prev?.(o); });
wrap('grimoire.open', async (prev, o) => { const r = await prev?.(o); later('book', 500); return r; });
on('step', ({ id } = {}) => { if (id === 'c1.deliver') later('map', 1200); });
on('flag', ({ k, v } = {}) => {
  if (!v) return;
  if (k === 'gate1.refused' || k === 'gate2.refused') later('rank', 1200);
  if (String(k).startsWith('side.')) later('side', 1500);
});
on('power', ({ id } = {}) => { if (id === 'broom') later('fly', 2500); });
