// The smoke rite's overlay alone, from a hand-made state (docs/TOOLS.md «Looking at it»; harness/rite.steps.mjs).
//   /harness/rite.html?n=0                 the first rite (n = rites done before; guides the first three times)
//   &same=1                                a second rite within twenty minutes («la brace è ancora accesa»)
//   &veil=rosa                             the last smoke lit, whose veil the breaths clean
//   &scene=1  &gift=salvia|mirra  &real=1  the scene at Malva's hearth, a gift, the deck with the real cards
//   &owned=rosa,alloro,cipresso,salvia     the airs she has
//   /harness/rite.html?compare=rosa,alloro,cipresso[&secs=5][&labels=0]  the airs side by side, same moment,
//                                          room light and smoke only (to see them apart with the sound off)
//   /harness/rite.html?after=rosa&ambito=casa   the line after a reading and «E Malva?»
// window.__riteDone resolves with the overlay's result; window.__riteStats() gives fps and puffs.
import '../src/core/fonts.js';
import '../src/sound/index.js';
import { css, h } from '../src/core/dom.js';
import { call } from '../src/core/services.js';
import { planRite, freshRite } from '../src/glue/rite.rules.js';
import { AIRS, MALVA_SCENE, GIFTS, START_AIRS } from '../src/data/rite.js';
import { riteOverlay, previewAir } from '../src/ui/rite/index.js';
import { createSmoke } from '../src/ui/rite/smoke.js';
import { MALVA, TEXT } from '../src/data/rite.js';

const q = new URLSearchParams(location.search);
const res = document.getElementById('res');
globalThis.__salemNoGuard = q.get('guard') !== '1';

if (q.get('compare')) {
  const ids = q.get('compare').split(',').filter((a) => AIRS[a]);
  const grid = h('div.cmp', { style: { gridTemplateColumns: `repeat(${ids.length}, 1fr)` } });
  document.body.append(grid);
  for (const id of ids) {
    const a = AIRS[id], cv = h('canvas'), cell = h('div', q.get('labels') === '0' ? null : h('b', a.word), cv);
    grid.append(cell);
    requestAnimationFrame(() => {
      const s = createSmoke(cv); s.start();
      const { W, H } = s.size;
      s.roomNow(a.room);
      s.scene({ hearthY: H * 0.8, arcY: H * 0.665, slots: [{ id, x: W / 2, dy: 0, half: 30 }], owned: [id], coal: 1, show: 1, hover: id, lit: null });
      s.source('air', { x: W / 2, y: H * 0.8 - 14, p: a.smoke, color: a.color });
    });
  }
} else if (q.get('after')) {
  css('h-after', '.box{position:fixed;inset:0;padding:20px 14px;background:radial-gradient(ellipse at 50% -10%,#2f2142 0%,#120d17 65%);color:#f0e6cf;font:19px Georgia,serif}');
  const air = q.get('after'), amb = q.get('ambito') || 'casa', m = MALVA[amb];
  const box = h('div.box', h('p', { style: { color: '#bdae96', fontSize: '16px' } }, '(fine della lettura, sotto le carte)'));
  const after = h('div.rta', h('p', TEXT.fact(AIRS[air])));
  const b = h('button', { type: 'button' }, TEXT.askMalva);
  b.onclick = () => { b.replaceWith(h('div.say', h('b', 'Malva'), `«${m.line}»`)); previewAir(after, m.air, Number(q.get('secs') || 4)); };
  after.append(b); box.append(after); document.body.append(box);
  // the same CSS as glue/rite.js
  css('glue-rite-after', `.rta{display:flex;flex-direction:column;gap:8px;margin-top:6px;padding:10px 14px;border-left:3px solid #6b5a3a;border-radius:0 10px 10px 0;background:#ffffff07}
.rta p{margin:0;font-size:17px;font-style:italic;color:#e9dfc8}
.rta button{align-self:flex-start;min-height:44px;padding:4px 14px;border-radius:22px;border:1.5px solid #e0b95e66;background:none;color:#e0b95e;font:17px Georgia,serif;cursor:pointer}
.rta .say{padding:10px 13px;border-radius:4px 12px 12px 12px;background:#f0e6cf;color:#2a2030;font-size:17px;line-height:1.35;font-style:italic}
.rta .say b{display:block;font-style:normal;font-weight:400;font-size:14px;color:#6b5a48;letter-spacing:.04em;text-transform:uppercase}`);
} else {
  const n = Number(q.get('n') || 0), t = Date.now();
  const r = { ...freshRite(), n, owned: (q.get('owned') || START_AIRS.join(',')).split(',') };
  if (q.get('veil')) r.last = { air: q.get('veil'), at: q.get('same') ? t - 5 * 60e3 : t - 86400e3 };
  else if (q.get('same')) r.last = { air: 'rosa', at: t - 5 * 60e3 };
  const plan = planRite(r, t);
  const gift = q.get('gift') ? GIFTS.find((g) => g.air === q.get('gift')) : null;
  const t0 = performance.now();
  globalThis.__riteDone = riteOverlay({ plan, scene: q.get('scene') ? MALVA_SCENE : null, gift, real: q.get('real') === '1' }).then((v) => {
    const total = (performance.now() - t0) / 1000;
    res.textContent = JSON.stringify({ ...v, total: Math.round(total * 10) / 10 });
    return { ...v, total, plan };
  });
  globalThis.__ritePlan = plan;
}
globalThis.__riteStats = () => globalThis.__salemRiteStats?.();
