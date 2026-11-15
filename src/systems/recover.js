// The deposit of the court: one question per confiscated card, about that card. Right: the card comes
// back. Wrong: it stays on the shelf and she can try again later.
import { h } from '../core/dom.js';
import { state } from '../core/state.js';
import { answer, confiscatedIds, recover } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { makeQuestion } from '../data/questions.js';
import { screen, btn, say, snd } from './theme.js';
import { questionView } from './qview.js';

export async function recoverCards({ rng = Math.random } = {}) {
  const ids = confiscatedIds();
  const scr = screen({ title: 'Il deposito', sub: 'del tribunale', cls: 'sxrec' });
  const got = [], kept = [];
  if (!ids.length) {
    scr.setBody(say('Il custode', 'Qui non c\'è niente a tuo nome. Torna se ti fermano ancora.'));
    await new Promise((res) => scr.setFoot(btn('Esco', res, 'go')));
    scr.close();
    return { recovered: [], kept: [] };
  }
  scr.setBody(say('Il custode', ids.length === 1 ? 'C\'è una carta tua, sullo scaffale. Si ridà a chi dimostra di conoscerla.' : `Ci sono ${ids.length} carte tue, sullo scaffale. Si ridanno a chi dimostra di conoscerle, una per una.`), h('p.sx-lab', 'Una domanda per ogni carta.'));
  await new Promise((res) => scr.setFoot(btn('Va bene', res, 'go')));
  for (const id of ids) {
    const q = makeQuestion({ pool: [id], level: Math.max(1, state.chapter || 1), rng });
    let resolve;
    const done = new Promise((r) => { resolve = r; });
    const view = questionView(q, { onPick: (i) => resolve(i) });
    scr.setFoot();
    scr.setBody(h('p.sx-lab', { style: { textAlign: 'center' } }, `Sullo scaffale: ${CARD[id].name}`), view.el);
    const picked = await done;
    const ok = !!q.options[picked]?.ok;
    view.reveal(picked);
    snd(ok ? 'right' : 'wrong');
    answer(id, ok, q.star);
    if (ok) { recover(id); got.push(id); } else kept.push(id);
    scr.col.append(h('div.sx-say.sx-in', h('b', 'Il custode'), ok ? `Giusto. Prendila: è tua. ${q.explain}` : `No. La carta resta dov'è, ma non scappa. ${q.explain}`));
    scr.show(scr.col.lastChild);
    await new Promise((res) => scr.setFoot(btn('Avanti', res, 'go')));
  }
  scr.setBody(h('div.sx-in', { style: { textAlign: 'center', fontSize: '24px' } }, got.length ? (got.length === ids.length ? 'Ti ridanno tutto.' : `Riprendi ${got.length} su ${ids.length}.`) : 'Per oggi, niente.'),
    got.length ? h('div', { style: { display: 'flex', gap: '10px', justifyContent: 'center' } }, got.map((id) => h('div.sx-card', { style: { width: '90px', aspectRatio: '350/600', backgroundImage: `url(cards/${id}.webp)` } }))) : null,
    kept.length ? h('p.sx-lab', { style: { textAlign: 'center' } }, `Restano sullo scaffale: ${kept.map((id) => CARD[id].name).join(', ')}. Puoi riprovare quando vuoi.`) : null);
  await new Promise((res) => scr.setFoot(btn('Esco', res, 'go')));
  scr.close();
  return { recovered: got, kept };
}
