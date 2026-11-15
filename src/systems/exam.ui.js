// Pieces of the Exam screen: who stops you, the always-visible suspicion bar with the flickering spell,
// the fixed lines of fiction. No rules here (exam.rules.js) and no flow (exam.js).
import { h, css, cardUrl } from '../core/dom.js';
import { FAIL_END } from './exam.rules.js';

const CSS = `
.sxe-head{flex:none;padding:8px 14px 10px;border-bottom:1px solid var(--line);background:#160f1dee}
.sxe-head>*{max-width:560px;margin-left:auto;margin-right:auto}
.sxe-who{display:flex;align-items:center;gap:10px}
.sxe-badge{flex:none;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 50% 36%,#d9c7a6 0 22%,transparent 23%),radial-gradient(ellipse at 50% 112%,#8a7a9a 0 48%,transparent 49%),#2a2038;box-shadow:0 0 0 1.5px #e0b95e66}
.sxe-badge.constable{background:radial-gradient(circle at 50% 36%,#d9c7a6 0 22%,transparent 23%),radial-gradient(ellipse at 50% 112%,#5f7aa6 0 48%,transparent 49%),radial-gradient(ellipse at 50% 12%,#1b2433 0 30%,transparent 31%),#2a2038}
.sxe-badge.afflicted{background:radial-gradient(circle at 50% 36%,#cdbfae 0 22%,transparent 23%),radial-gradient(ellipse at 50% 112%,#8a5a5a 0 48%,transparent 49%),#2a2038}
.sxe-badge.judge{background:center/cover no-repeat url(${cardUrl('m04')});}
.sxe-name{flex:1;min-width:0;font-size:20px;line-height:1.1}
.sxe-name small{display:block;color:var(--dim);font-size:16px}
.sxe-count{font-family:Georgia,'Times New Roman',serif;font-size:17px;color:var(--dim);white-space:nowrap}
.sxe-spell{display:flex;align-items:center;gap:10px;margin-top:8px}
.sxe-flame{flex:none;width:16px;height:22px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 70%,#fff3b0 0 25%,#ffb347 55%,#e0642f);filter:drop-shadow(0 0 6px #ffb34788);transform-origin:50% 100%;animation:sxflame 2.2s ease-in-out infinite}
.sxe-flame.low{animation-duration:.9s;opacity:.8}
.sxe-flame.out{animation:none;opacity:.25;filter:none}
@keyframes sxflame{0%,100%{transform:scale(1,1)}50%{transform:scale(.92,1.08) rotate(-2deg)}}
.sxe-flame.flick{animation:sxflick .8s linear 1}
@keyframes sxflick{0%,100%{opacity:1}12%{opacity:.15}24%{opacity:1}36%{opacity:.2}52%{opacity:.9}68%{opacity:.3}84%{opacity:1}}
.sxe-bar{position:relative;flex:1;height:20px;border-radius:10px;background:#2c2236;box-shadow:inset 0 0 0 1px #0008;overflow:hidden}
.sxe-fill{position:absolute;inset:0 auto 0 0;width:0;border-radius:10px;background:linear-gradient(90deg,#c9a14a,#c44a3c);transition:width .6s cubic-bezier(.2,.8,.2,1)}
.sxe-tick{position:absolute;top:0;bottom:0;width:2px;margin-left:-1px;background:#f0e6cfaa}
.sxe-line{margin:4px 0 0;font-size:16px;color:var(--dim);font-style:italic;min-height:22px}
.sxe-help{display:flex;flex-wrap:wrap;gap:8px}
.sxe-help .sx-btn{flex:1 1 150px;min-height:48px;font-size:17px;padding:4px 10px}
.sxe-help .note{flex:1 1 100%;font-size:16px;color:var(--dim);font-style:italic}
.sxe-end h1{margin:8px 0 4px;font-size:30px;font-weight:400;text-align:center}
.sxe-lost{display:flex;gap:10px;justify-content:center}
.sxe-lost .sx-card{width:72px;aspect-ratio:350/600;filter:grayscale(.8) brightness(.8)}
`;

export const WHO = {
  constable: { name: 'Il conestabile', role: 'ti ha fermata per strada' },
  afflicted: { name: "Un'Afflitta", role: 'ti punta il dito' },
  judge: { name: 'Il Giudice', role: 'in tribunale' },
};
export const DEFAULT_OPEN = {
  constable: ['Ferma lì. Due domande, e vai per la tua strada.', 'Documenti no, ragazza. Solo risposte.'],
  afflicted: ['Tu. Sì, tu. Fammi vedere che non nascondi niente.', 'Dicono che conosci le carte. Dimostralo.'],
  judge: ['Siediti, figliola. Faremo con calma: la verità non ha fretta.'],
};
// The spell that hides her: what the flame says about the suspicion.
export const spellLine = (s) => (s >= 100 ? 'L\'incantesimo si spezza.' : s >= FAIL_END ? 'L\'incantesimo sta cedendo.' : s >= 34 ? 'L\'incantesimo vacilla.' : 'L\'incantesimo regge.');
export const CLOSING = {
  constable: { pass: 'Il conestabile ti studia ancora un momento. «Va bene. Vai. Ti tengo d\'occhio.»', fail: 'Le manette sono fredde. Il conestabile non dice più nulla: ti porta via.' },
  afflicted: { pass: 'L\'Afflitta abbassa il dito. Non ti guarda negli occhi, ma se ne va.', fail: 'L\'Afflitta grida, e grida bene. Arrivano in tre, e non fanno domande.' },
  judge: { pass: 'Il Giudice posa la penna. «Non ho altre domande. Per ora.»', fail: 'Il Giudice sospira, quasi dispiaciuto. «Peccato. Ma non finisce qui.»' },
};

export function header(kind) {
  css('sxe', CSS);
  const who = WHO[kind] || WHO.constable;
  const fill = h('div.sxe-fill'), flame = h('div.sxe-flame'), line = h('p.sxe-line'), count = h('div.sxe-count');
  const el = h('div.sxe-head',
    h('div.sxe-who', h(`div.sxe-badge.${kind}`), h('div.sxe-name', who.name, h('small', who.role)), count),
    h('div.sxe-spell', flame, h('div.sxe-bar', { role: 'progressbar', 'aria-label': 'Sospetto' }, fill, h('div.sxe-tick', { style: { left: `${FAIL_END}%` } }))),
    line);
  return {
    el,
    setCount(a, b) { count.textContent = `${a} / ${b}`; },
    setSuspicion(s, { flick = false } = {}) {
      fill.style.width = `${Math.min(100, Math.max(0, s))}%`;
      line.textContent = spellLine(s);
      flame.classList.toggle('low', s >= 34 && s < 100);
      flame.classList.toggle('out', s >= 100);
      if (flick) { flame.classList.remove('flick'); void flame.offsetWidth; flame.classList.add('flick'); }
    },
  };
}
