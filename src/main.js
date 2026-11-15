// Entry point: it only wires the areas together. Each area registers its services on import
// (core/services.js); the boot order is title -> first session (new game) -> world + HUD.
import './core/fonts.js';
import { state, save, reset } from './core/state.js';
import { call } from './core/services.js';
import './ui/index.js';
import './story/index.js';
import './systems/index.js';
import './world/index.js';
import './glue/index.js';

async function start() {
  const pick = await call('title.open');
  if (pick === 'study') { await call('grimoire.open', { tab: 'carte', study: true }); return start(); }
  if (pick === 'new') reset();
  const first = !state.started;
  if (first) { state.started = true; save(); }
  await call('world.start');
  await call('hud.mount');
  if (first || state.step === 'p.session') await call('story.session', 's0');
}
start();
