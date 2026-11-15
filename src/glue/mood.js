// Music mood of the current map. `sound.back` puts the music back where the player stands after a
// session, an Exam or a reading took it over: village and the interiors -> village, forest -> forest,
// depths and the court -> depths. While a session holds a mood (`sound.hold('ending')`), `sound.back`
// returns to that one instead (the final reading happens inside the last session).
// Other areas call these through call(...) (they never import glue).
import { provide, call } from '../core/services.js';

export const moodOfMap = (map) => (map === 'forest' ? 'forest' : map === 'depths' || map === 'court' ? 'depths' : 'village');
let held = null;

provide('sound.hold', (name) => { held = name || null; return Promise.resolve(); });
provide('sound.back', async () => {
  if (held) return call('sound.mood', held);
  const w = await call('world.where').catch(() => null);
  return call('sound.mood', moodOfMap(w?.map));
});
