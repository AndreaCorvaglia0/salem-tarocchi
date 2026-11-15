// A sealed lock (chest, sealed door): one question; the right answer opens it, a wrong one costs nothing.
import { h, css } from '../core/dom.js';
import { state } from '../core/state.js';
import { answer, ownedIds, stat } from '../core/progress.js';
import { makeQuestion } from '../data/questions.js';
import { toldPool, RECOGNIZE } from './exam.rules.js';
import { screen, btn, sleep, fb, snd } from './theme.js';
import { questionView } from './qview.js';

const CSS = `
.sxl-lock{position:relative;width:96px;height:112px;margin:0 auto}
.sxl-shackle{position:absolute;left:18px;top:0;width:60px;height:60px;border:10px solid #b9a06a;border-bottom:0;border-radius:32px 32px 0 0;transform-origin:100% 100%;transition:transform .7s cubic-bezier(.3,1.4,.5,1),top .7s}
.sxl-body{position:absolute;left:0;right:0;bottom:0;height:62px;border-radius:12px;background:linear-gradient(#d6b85f,#8f7436);box-shadow:0 6px 16px #000a}
.sxl-body::after{content:'';position:absolute;left:50%;top:16px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#2a1d05;box-shadow:0 12px 0 -3px #2a1d05}
.sxl-seal{position:absolute;left:50%;top:48px;width:54px;height:54px;margin-left:-27px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#d86a58,#8a2a22);box-shadow:0 0 0 2px #0006;opacity:.0}
.sxl-lock.sealed .sxl-seal{opacity:1}
.sxl-lock.open .sxl-shackle{transform:rotate(-38deg) translate(-8px,-10px)}
.sxl-lock.open .sxl-body{box-shadow:0 0 36px #ffd97a99}
.sxl-lock.bad{animation:sxshake .42s}
.sxl-label{text-align:center;color:var(--dim);font-size:18px;font-style:italic}
`;

export async function ask({ cardId, kind, label, rng = Math.random } = {}) {
  css('sxl', CSS);
  let pool = cardId ? [cardId] : ownedIds();
  if (!cardId && pool.length < 3 && !pool.includes('m00')) pool = [...pool, 'm00'];
  // a card the Reader has not told yet can only be recognised (exam.rules.js)
  const told = toldPool(pool, state.told || {});
  const kinds = kind ? [kind] : told.length ? undefined : RECOGNIZE;
  const q = makeQuestion({ pool: kind || !told.length ? pool : told, kinds, level: Math.max(1, state.chapter || 1), rng });
  const lock = h('div.sxl-lock.sealed', h('div.sxl-shackle'), h('div.sxl-body'), h('div.sxl-seal'));
  const scr = screen({ cls: 'sxlock' });
  let resolve;
  const done = new Promise((r) => { resolve = r; });
  const view = questionView(q, { onPick: (i) => resolve(i) });
  scr.setBody(lock, h('p.sxl-label', label || 'Un sigillo chiuso. Risponde solo a chi conosce le carte.'), view.el);
  const picked = await done;
  const ok = !!q.options[picked]?.ok;
  view.reveal(picked);
  snd(ok ? 'right' : 'wrong');
  if (state.cards[q.cardId]) answer(q.cardId, ok, q.star);
  if (ok) { stat('locks'); lock.classList.remove('sealed'); lock.classList.add('open'); }
  else { lock.classList.add('bad'); }
  scr.col.append(fb(ok ? 'ok' : 'no', ok ? 'Il sigillo cede.' : 'Il sigillo resta chiuso.', q.explain, ok ? null : 'Non perdi niente: puoi riprovare quando vuoi.'));
  scr.show(scr.col.lastChild);
  if (ok) snd('door');
  await sleep(ok ? 500 : 0);
  await new Promise((res) => scr.setFoot(btn(ok ? 'Apri' : 'Per ora lascio', res, 'go')));
  scr.close();
  return ok;
}
