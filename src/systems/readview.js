// Shared by the guided and the free reading: the styles (sxr-*) and the position header
// (a small map of the table with the active card lit, the position's name and hint).
import { h, css } from '../core/dom.js';
import { table } from './table.js';

const CSS = `
.sxr-who{display:flex;gap:12px;align-items:center}
.sxr-badge{flex:none;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 50% 36%,#d9c7a6 0 22%,transparent 23%),radial-gradient(ellipse at 50% 112%,#6a5a86 0 48%,transparent 49%),#2a2038;box-shadow:0 0 0 1.5px #e0b95e66}
.sxr-who b{font-weight:400;font-size:22px;display:block}.sxr-who small{color:var(--dim);font-size:16px;font-style:italic}
.sxr-pos{display:flex;gap:12px;align-items:stretch}
.sxr-mini{flex:none;width:128px}.sxr-mini .sxt-n{display:none}.sxr-mini .sxt-c.on .sxt-n{display:block}
.sxr-ptxt{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px}
.sxr-ptxt .n{color:var(--dim);font-size:16px}.sxr-ptxt h3{margin:0;font-size:24px;font-weight:400;line-height:1.15}.sxr-ptxt p{margin:2px 0 0;font-size:17px;color:var(--dim);font-style:italic}
.sxr-look{display:flex;gap:14px;align-items:center}
.sxr-look .sx-card{flex:none;width:min(36vw,150px);aspect-ratio:350/600;background-size:cover}
.sxr-look .t{flex:1;font-size:19px}.sxr-look .t b{display:block;font-weight:400;font-size:22px;color:var(--gold);margin-bottom:4px}
.sxr-q{margin:0;font-size:20px;color:#fff7e3}
.sxr-story{display:flex;flex-direction:column;gap:8px}
.sxr-story div{padding:8px 12px;border-left:3px solid var(--gold);background:#ffffff0a;border-radius:0 8px 8px 0;font-size:18px}
.sxr-story small{display:block;color:var(--dim);font-size:15px;letter-spacing:.04em;text-transform:uppercase}
.sxr-score{font-family:Georgia,'Times New Roman',serif;text-align:center;font-size:26px;margin:2px 0}.sxr-score small{display:block;color:var(--dim);font-size:17px}
.sxr-coins{font-family:Georgia,'Times New Roman',serif;font-size:30px;color:var(--gold);text-align:center}
`;
export const readStyle = () => css('sxr', CSS);

// ids: the cards by position (null where not chosen yet); turned: how many are face up (0..n); i: the active position.
export function posHeader(sp, ids, i, turned = i + 1) {
  readStyle();
  const pos = sp.positions[i], N = sp.positions.length;
  let mini = null;
  if (N > 1) {
    const t = table(sp, { instant: true });
    ids.forEach((c, j) => { if (c) { t.place(j, c); if (j < turned) t.turn(j); } });
    t.active(i);
    mini = h('div.sxr-mini', t.el);
  }
  return h('div.sxr-pos.sx-in', mini, h('div.sxr-ptxt', N > 1 ? h('span.n.sx-num', `${i + 1} di ${N}`) : null, h('h3', pos.label), pos.hint ? h('p', pos.hint) : null));
}
