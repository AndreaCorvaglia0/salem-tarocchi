// A door for testing only, open with ?debug in the URL (never in normal play):
//   window.__salem = { state, call, setStep(id), give(ids), jump('c2'|'c3'|'trial'), travel(anchor), where(),
//                      hidden(), blocked() }
//   ?debug&skip=c2 | c3 | trial  prepares a sane state at the start of chapter 2, 3 or before the trial
//   (cards, level, flags, spreads) and boots straight into the world. The owner uses it from his phone.
import { state } from '../core/state.js';
import { call } from '../core/services.js';
import { blocked } from '../core/dom.js';
import { findCard, setStep } from '../core/progress.js';
import { prepare } from './debug.rules.js';
import { MAJORS } from '../data/cards.base.js';
import { debug as worldDebug } from '../world/index.js'; // the live scene, for tests only

const params = () => new URLSearchParams(globalThis.location?.search || '');
export const debugOn = () => params().has('debug');

// main.js calls this before the title: true when a ?debug&skip= state was prepared (boot as "continue")
export async function bootSkip() {
  if (!debugOn()) return false;
  const key = params().get('skip');
  if (!key) return false;
  const ok = prepare(key, await call('world.anchors'));
  // a reload goes on from the saved game, it does not prepare the skip again
  const u = new URL(location.href); u.searchParams.delete('skip'); history.replaceState(null, '', u.href);
  return ok;
}

if (debugOn() && typeof window !== 'undefined') {
  window.__salem = {
    state, call, blocked, scene: () => worldDebug.scene(),
    setStep: (id) => setStep(id),
    give: (list) => [].concat(list).forEach((id) => findCard(id)),
    jump: (key) => { const u = new URL(location.href); u.searchParams.set('skip', key); location.href = u.href; },
    travel: (a) => call('world.travel', a),
    where: () => call('world.where'),
    // hidden cards she could find now: { id, spot }
    hidden: () => MAJORS.filter((c) => c.spot && c.id !== 'm07' && !state.cards[c.id]?.found && (state.player.birthCard === c.id || state.chapter >= c.row)).map((c) => ({ id: c.id, spot: c.spot })),
  };
}
