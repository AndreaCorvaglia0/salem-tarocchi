// Entry point: it only wires the areas together. Each area registers its services on import
// (core/services.js). Boot order: title -> (new game) session s0, with no world behind it ->
// world.start (at the road, where s0 left her) -> hud.mount. The world comes before the HUD and
// before any script can run, so nothing travels into a world that does not exist yet.
import './core/fonts.js';
import { state, save, reset } from './core/state.js';
import { call } from './core/services.js';
import './sound/index.js'; // music and effects: silent until the first tap
import './ui/index.js';
import './story/index.js';
import './systems/index.js';
import './world/index.js';
import { bootSkip } from './glue/index.js';

async function play() {
  if (state.step === 'p.session') {
    // the prologue session: name, birth, Il Matto; it ends with step p.road and state.pos at the road
    await call('story.session', 's0');
  }
  await call('world.start');
  await call('hud.mount');
}

async function start() {
  if (await bootSkip()) return play(); // ?debug&skip=c2|c3|trial
  const pick = await call('title.open');
  if (pick === 'study') { await call('grimoire.open', { tab: 'carte', study: true }); return start(); }
  if (pick === 'new') reset();
  if (!state.started) { state.started = true; save(); }
  return play();
}
start().catch((e) => console.error('[main]', e));
