// Ripasso: a short calm quiz, no stakes. Five questions of mixed kinds from the question generator
// (told cards may be asked what they say, untold ones only name or detail: exam.rules.js buildQuestions),
// due cards first; each answer lifts stars like any answer and a right one gives a little xp; at the end
// the cards she missed are shown again, with their name and what they say.
import { h, css } from '../core/dom.js';
import { state } from '../core/state.js';
import { answer, dueIds, ownedIds, dayCard, addXp } from '../core/progress.js';
import { makeExam, makeQuestion } from '../data/questions.js';
import { buildQuestions } from './exam.rules.js';
import { sheet } from '../data/cards.js';
import { screen, btn, say, shuffle, pickOne, mood, moodBack } from './theme.js';
import { cardFace, questionView } from './qview.js';

const CSS = `
.sxv-card{display:flex;justify-content:center}
.sxv-card .sx-card{width:min(56vw,210px);aspect-ratio:350/600;background-size:cover}
.sxv-name{margin:0;text-align:center;font-size:28px;font-weight:400}
.sxv-name small{display:block;color:var(--gold);font-size:19px;margin-top:2px}
.sxv-core{margin:0;text-align:center;font-size:21px;font-style:italic;color:#fff7e3}
.sxv-kw{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.sxv-kw span{padding:3px 11px;border-radius:14px;background:#ffffff12;font-size:16px}
.sxv-astro{text-align:center;color:var(--sky);font-size:18px}
.sxv-prog{font-family:Georgia,'Times New Roman',serif;text-align:center;color:var(--dim);font-size:16px}
.sxv-think{text-align:center;font-size:21px;font-style:italic;color:var(--dim);margin:4px 0}
.sxv-miss{display:flex;gap:14px;align-items:center;margin:6px 0}
.sxv-miss .sx-card{flex:none;width:76px;aspect-ratio:350/600;background-size:cover}
.sxv-miss b{display:block;font-size:21px;font-weight:400}.sxv-miss span{display:block;font-size:18px;font-style:italic;color:#fff7e3}
`;
const END = {
  all: ['Tartufo si stira. «Tutte. Quasi mi annoio.»', 'Tartufo chiude un occhio, soddisfatto. «Va bene, va bene. Le sai.»'],
  some: ['Tartufo ti guarda dal davanzale. «Quelle che non sapevi tornano. Come me.»', 'Tartufo sbadiglia. «Ripassare è come fare le fusa: più lo fai, meglio ti viene.»'],
  none: ['Tartufo ti sale in grembo. «Giornata storta. Domani sarà un\'altra carta.»'],
};

export async function review({ ids, n } = {}) {
  css('sxv', CSS);
  const owned = new Set(ownedIds());
  let list;
  if (ids?.length) list = ids.filter((id) => owned.has(id) || sheet(id));
  else { const due = dueIds(); list = [...shuffle(due), ...shuffle([...owned].filter((id) => !due.includes(id)))]; }
  const today = dayCard(); // the card of the day comes first
  if (!ids?.length && today && owned.has(today)) list = [today, ...list.filter((id) => id !== today)];
  list = list.slice(0, 10);
  const N = n || 5, XP_RIGHT = 3;
  mood('reading');
  const scr = screen({ title: 'Ripasso', cls: 'sxreview', onClose: () => { stop = true; kick?.(); } });
  let stop = false, kick = null;
  const tap = (label, cls = 'go') => new Promise((res) => { kick = () => res(null); scr.setFoot(btn(label, () => res(true), cls)); });
  if (!list.length) {
    scr.setBody(say('Tartufo', 'Non hai ancora carte da ripassare. Trovane qualcuna, poi torno a farti le domande.'));
    await tap('Va bene'); scr.close(); moodBack(); return;
  }
  // the pool: due cards first (and the card of the day), then the rest; the Fool joins a tiny deck
  let pool = list.slice(0, 8);
  if (pool.length < 3 && !pool.includes('m00')) pool = [...pool, 'm00'];
  const qs = buildQuestions({ kind: 'judge', pool, told: state.told || {}, n: N, level: Math.max(1, state.chapter || 1), makeExam, makeQuestion });
  let knew = 0, seen = 0;
  const missed = [];
  for (let i = 0; i < qs.length && !stop; i++) {
    const q = qs[i];
    let pickRes;
    const picked = new Promise((r) => { pickRes = r; kick = () => r(null); });
    const view = questionView(q, { onPick: (k) => pickRes(k) });
    scr.setBody(h('div.sxv-prog', `${i + 1} di ${qs.length}`), view.el);
    scr.setFoot();
    const k = await picked;
    if (k === null) break;
    const ok = !!q.options[k]?.ok;
    view.reveal(k);
    seen++;
    if (q.cardId) answer(q.cardId, ok, q.star);
    if (ok) { knew++; addXp(XP_RIGHT, 'review'); } else if (q.cardId && !missed.includes(q.cardId)) missed.push(q.cardId);
    if (!(await tap(i + 1 < qs.length ? 'Avanti' : 'Fine'))) break;
  }
  // the cards she missed, shown again
  if (missed.length && !stop) {
    scr.setBody(h('p.sxv-think', 'Queste tornano, guardale ancora un momento.'), ...missed.map((id) => { const c = sheet(id); return h('div.sxv-miss.sx-in', cardFace(id), h('div', h('b', c.name), c.core ? h('span', c.core) : null)); }));
    await tap('Le ho guardate');
  }
  const bucket = !seen ? 'some' : knew === seen ? 'all' : knew ? 'some' : 'none';
  scr.setBody(h('h2.sxv-name.sx-in', seen ? `${knew} su ${seen}` : 'A presto'), say('Tartufo', pickOne(END[bucket])));
  await tap('Chiudo il libro');
  scr.close();
  moodBack();
}
