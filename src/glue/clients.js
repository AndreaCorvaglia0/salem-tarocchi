// The cottage table after the first reading of each chapter: the way to earn coins and stars.
// Service clients.next(): who knocks, Tartufo's mutter, the reading, the flag. clients.rules.js decides who.
import { provide, call } from '../core/services.js';
import { state } from '../core/state.js';
import { setFlag, addXp } from '../core/progress.js';
import { CLIENTS } from '../data/story/index.js';
import { MUTTER } from '../data/story/clients.js';
import { nextClient } from './clients.rules.js';
import { markBack } from './bonds.js';

provide('clients.next', async () => {
  const n = nextClient({ clients: CLIENTS, chapter: state.chapter, done: (id) => !!state.flags[`client.${id}.done`], spreads: state.spreads });
  if (!n) { await call('story.say', 'narra', 'Nessuno bussa, stanotte. Solo il vento.'); return null; }
  const c = CLIENTS.find((x) => x.id === n.id);
  if (n.back) await call('story.say', 'narra', `Bussano. È di nuovo ${c.name}. «Avevi ragione, l'altra volta. Ho un'altra domanda.»`);
  else if (state.powers.cat && MUTTER[n.id]) await call('story.say', 'tartufo', MUTTER[n.id]);
  if (n.back) markBack(n.id); // popularity: a returning client, served for the first time, counts once more
  const r = await call('reading.open', { spread: n.spread, client: n.id });
  if (!n.back) { setFlag(`client.${n.id}.done`); addXp(5, 'client'); }
  return r;
});
