// The cottage table after the first reading of each chapter: the way to earn coins and stars.
// Service clients.next(opts?): who knocks, Tartufo's mutter, the reading, the flag. clients.rules.js decides who.
// The story's clients of the chapter come first, as before; when none is left the cottage is never empty:
// an old face comes back, a generated client (src/reading/clients.js) knocks, or someone she must send away.
// With popularity 2 or more a second visitor may wait outside.
// opts (debug and screenshots): { force: 'gen' | 'refuse' | 'back', tier: 0..2, second: true }
import { provide, call } from '../core/services.js';
import { state, save } from '../core/state.js';
import { setFlag, addXp, levelOf } from '../core/progress.js';
import { popLevel } from '../core/bonds.js';
import { CLIENTS } from '../data/story/index.js';
import { MUTTER } from '../data/story/clients.js';
import { MUTTERS, QUEUE } from '../data/reading/people.js';
import { makeClient, makeRefusal } from '../reading/clients.js';
import { pick } from '../reading/rng.js';
import { nextClient, tierFor, pickVisitor, spreadFor, canQueue, pushRecent } from './clients.rules.js';
import { markBack } from './bonds.js';

// state.world.gen: { recent: [keys of the last generated visitors], read: [people she read for] (street.js) }
export const genState = () => {
  const g = state.world.gen && typeof state.world.gen === 'object' ? state.world.gen : (state.world.gen = {});
  if (!Array.isArray(g.recent)) g.recent = [];
  if (!Array.isArray(g.read)) g.read = [];
  return g;
};
const level = () => levelOf(state.xp) || 1;
export const currentTier = (rng = Math.random) => tierFor({ pop: popLevel(), level: level(), rng });

async function serveBack(n) {
  const c = CLIENTS.find((x) => x.id === n.id);
  await call('story.say', 'narra', `Bussano. È di nuovo ${c.name}. «Avevi ragione, l'altra volta. Ho un'altra domanda.»`);
  markBack(n.id); // popularity: a returning client, served for the first time, counts once more
  return call('reading.open', { spread: n.spread, client: n.id });
}

async function serveGen(tier) {
  const g = genState();
  const c = makeClient({ tier, avoid: g.recent });
  g.recent = pushRecent(g.recent, c.keys); save();
  const spread = spreadFor({ tier, chapter: state.chapter, spreads: state.spreads }) || 'single';
  await call('story.say', 'narra', 'Qualcuno bussa alla porta, e quando apri ti trovi davanti una faccia che non conosci.');
  if (state.powers.cat) await call('story.say', 'tartufo', pick(MUTTERS[tier]));
  const r = await call('reading.open', { spread, client: c });
  addXp(3, 'client');
  return r;
}

// Someone she sends away: kindly, curtly, or (when it can be turned) with a reading the cards can do.
// Played through the story runner, so the question stays on screen above her answers.
async function serveRefusal(tier) {
  const g = genState();
  const v = makeRefusal({ tier, avoid: g.recent });
  g.recent = pushRecent(g.recent, v.keys); save();
  const say = (t) => ({ say: v.name, t });
  return call('story.run', [
    { say: 'narra', t: 'Qualcuno bussa forte, come chi ha fretta.' },
    say(v.hello), say(v.ask),
    { choice: v.options.map((o) => ({ t: o.me, trait: o.trait,
      then: o.id === 'turn' && v.turn ? [{ do: 'reading', spread: 'single', client: v.turn }, { do: 'xp', n: 3 }] : [say(o.re)] })) },
  ]);
}

async function serveOne(opts = {}) {
  const n = nextClient({ clients: CLIENTS, chapter: state.chapter, done: (id) => !!state.flags[`client.${id}.done`], spreads: state.spreads });
  if (!n) { await call('story.say', 'narra', 'Nessuno bussa, stanotte. Solo il vento.'); return null; }
  // a story client of this chapter not read yet: always first (unless a debug force asks otherwise)
  if (!n.back && !opts.force) {
    if (state.powers.cat && MUTTER[n.id]) await call('story.say', 'tartufo', MUTTER[n.id]);
    const r = await call('reading.open', { spread: n.spread, client: n.id });
    setFlag(`client.${n.id}.done`); addXp(5, 'client');
    return r;
  }
  const tier = opts.tier ?? currentTier();
  const kind = opts.force || pickVisitor({ tier, hasBack: true });
  if (kind === 'back') return serveBack(n);
  if (kind === 'refuse') return serveRefusal(tier);
  return serveGen(tier);
}

provide('clients.next', async (opts = {}) => {
  const r = await serveOne(opts);
  if (canQueue({ pop: popLevel(), second: !!opts.second })) {
    await call('story.say', 'narra', QUEUE.t);
    const k = await call('story.choose', [{ t: QUEUE.yes }, { t: QUEUE.no }]);
    if (k === 0) await serveOne({ ...opts, second: true, force: opts.force2 || undefined });
  }
  return r;
});
