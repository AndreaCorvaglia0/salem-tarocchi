// The broom's flight (rules: fly.rules.js). Services for the grimoire's map:
//   fly.check() -> { ok, why }      fly.to(anchor) -> boolean (flew)
// Reads the world (world.where: map, near; `fog` when the world reports it), the story (story.busy)
// and the patrols (bus `patrol:seen` until the Exam is over: bus `exam`).
import { on } from '../core/bus.js';
import { call, has, provide } from '../core/services.js';
import { state } from '../core/state.js';
import { canFly, canLand } from './fly.rules.js';

let spotted = false;
on('patrol:seen', () => { spotted = true; });
on('exam', () => { spotted = false; });

async function check() {
  if (!has('world.where')) return { ok: false, why: '' };
  const w = (await call('world.where')) || {};
  const inside = !['village', 'forest', 'depths'].includes(w.map); // every other map is a room
  const script = has('story.busy') ? !!(await call('story.busy')) : false;
  return canFly({ broom: !!state.powers.broom, map: w.map, inside, near: w.near, fog: !!w.fog, script, spotted });
}
provide('fly.check', check);
provide('fly.to', async (anchor) => {
  const c = await check();
  if (!c.ok || !canLand(anchor, { seen: state.stats.seen || {}, seenPlace: true })) return false;
  call('sound.play', 'door');
  if (has('world.fly')) return !!(await call('world.fly', anchor));
  await call('world.travel', anchor);
  return true;
});
