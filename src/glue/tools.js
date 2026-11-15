// Using the tools she carries (from the "Io" page of the grimoire): the witch bottle (for three
// minutes nobody stops her: the world reads state.world.bottleUntil). Pendulum and incense live in the
// Exam. The sieve is gone (the sixth sense and Tartufo do its job).
//   tool.use(id) -> boolean (used)
import { provide, call } from '../core/services.js';
import { state, save } from '../core/state.js';
import { BOTTLE_MS } from './tools.rules.js';

const spend = (id) => { if ((state.tools[id] || 0) < 1) return false; state.tools[id] -= 1; save(); return true; };

provide('tool.use', async (id) => {
  if (id === 'bottle') {
    if ((state.world.bottleUntil || 0) > Date.now()) { call('hud.toast', 'La bottiglia fa ancora effetto. Non sprecarla.'); return false; }
    if (!spend('bottle')) return false;
    state.world.bottleUntil = Date.now() + BOTTLE_MS; save();
    call('hud.toast', 'Stappi la bottiglia. Per tre minuti nessuno ti ferma.');
    return true;
  }
  return false;
});
