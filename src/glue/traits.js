// Behaviour feeds the portrait (rules: traits.rules.js). Listens to the world's small bus events
// (`seen` a new place, `talk` a chat, `patrol:seen`, `stun`) and to `step`; wraps `tool.use` for the
// bottle. Never in the world itself: the world only says what happened.
import { on } from '../core/bus.js';
import { wrap } from '../core/services.js';
import { state } from '../core/state.js';
import { addTrait } from '../core/progress.js';
import { STEPS } from '../data/story/index.js';
import { createFeeds } from './traits.rules.js';

const feeds = createFeeds();
const give = (d) => { if (d) addTrait(d); };
const pathAnchors = () => (Array.isArray(STEPS) ? STEPS.map((s) => s.at).filter(Boolean) : []);
const stepAt = () => (Array.isArray(STEPS) ? STEPS.find((s) => s.id === state.step)?.at : null) || null;

let walkedAt = state.stats?.steps || 0;
on('seen', ({ anchor } = {}) => give(feeds.seen(anchor, pathAnchors())));
on('talk', ({ at } = {}) => give(feeds.talk(at, stepAt())));
on('step', () => { const now = state.stats?.steps || 0; give(feeds.step(now - walkedAt)); walkedAt = now; });
on('patrol:seen', () => give(feeds.patrol()));
on('stun', () => give(feeds.stun()));
wrap('tool.use', async (prev, id) => { const used = await prev?.(id); if (used && id === 'bottle') give(feeds.bottle()); return used; });
