// The Advent calendar, opened from the threshold in December (ui/title.js): 25 paper bags on a string. A bag
// whose day has come asks for the word written on the note inside the real bag; the word opens its page, with
// the picture of what is in the bag and the longer story of the note. openAdvent() -> Promise (closed).
// Rules: glue/avvento.rules.js; pages: data/avvento.js.
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { snd } from './sfx.js';
import { SERIF, HAND, GOLD, rnd } from './paper.js';
import { PAGE, PAGES, YEAR } from '../data/avvento.js';
import { slot, toAsk, openWithWord, adventDate } from '../glue/avvento.js';
import { LAST_DAY } from '../glue/avvento.rules.js';

const CSS = `
.av{position:fixed;inset:0;z-index:60;overflow:hidden auto;display:flex;flex-direction:column;align-items:center;background:radial-gradient(ellipse 100% 60% at 50% 0%,#1d2a3a 0%,#121524 50%,#07070d 100%) #07070d;color:#efe4c8;font:18px/1.4 ${SERIF};opacity:0;transition:opacity .4s;-webkit-overflow-scrolling:touch}
.av.on{opacity:1}
.av-snow{position:fixed;inset:0;pointer-events:none;overflow:hidden}
.av-snow i{position:absolute;top:-12px;width:5px;height:5px;border-radius:50%;background:#fff;opacity:.7;animation:av-fall linear infinite}
@keyframes av-fall{to{transform:translate3d(var(--dx),110vh,0)}}
.av-bar{position:sticky;top:0;z-index:2;flex:none;width:100%;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;padding:calc(10px + env(safe-area-inset-top)) 14px 6px 18px;background:linear-gradient(#0c0f1ae8 70%,#0c0f1a00)}
.av-bar span{font:italic 16px ${SERIF};color:#b9a98a}
.av-x{width:46px;height:46px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff1c;color:#fff7e2;font:26px/1 ${SERIF};cursor:pointer}
.av-head{position:relative;flex:none;text-align:center;margin:2px 18px 0}
.av-head h1{margin:0;font:400 28px/1.1 ${SERIF};color:#f3e7c9;text-shadow:0 0 22px #d8b25a33}
.av-head p{margin:6px auto 0;max-width:340px;font:20px/24px ${HAND};color:#cdbf9f}
.av-holly{display:block;margin:4px auto 0}
.av-grid{position:relative;flex:none;display:grid;grid-template-columns:repeat(5,1fr);gap:16px 9px;width:min(360px,calc(100% - 28px));margin:18px 0 10px;padding-top:12px}
.av-string{position:absolute;left:-6px;right:-6px;height:1px;background:#a8946c88}
.av-bag{position:relative;aspect-ratio:3/4;border:0;padding:0;border-radius:4px 4px 6px 6px;background:linear-gradient(#cdb48a,#b39769);color:#3a2c1c;font:700 24px ${HAND};cursor:pointer;box-shadow:0 6px 12px #000a;transform:rotate(var(--r));-webkit-tap-highlight-color:transparent;transition:transform .2s}
.av-bag::before{content:'';position:absolute;left:50%;top:-12px;width:1px;height:12px;background:#a8946c}
.av-bag::after{content:'';position:absolute;left:0;right:0;top:0;height:9px;border-radius:4px 4px 0 0;background:repeating-linear-gradient(90deg,#a68a5c 0 4px,#bba077 4px 8px)}
.av-bag span{position:relative;display:block;padding-top:10px}
.av-bag.wait{background:linear-gradient(#5c5348,#463f37);color:#a2978488;box-shadow:0 4px 8px #0008}
.av-bag.wait span::after{content:'?';display:block;font:16px ${SERIF};color:#a2978466;margin-top:-2px}
.av-bag.ask{box-shadow:0 0 0 2px ${GOLD},0 0 16px 3px #ffd77a77,0 6px 12px #000a;animation:av-call 2.4s ease-in-out infinite}
@keyframes av-call{50%{box-shadow:0 0 0 2px ${GOLD},0 0 24px 6px #ffd77aaa,0 6px 12px #000a}}
.av-bag.open{background:linear-gradient(#efe4c8,#ddcca4);color:#7a3b22}
.av-bag.open span::after{content:'✦';display:block;font:13px ${SERIF};color:#a3372a;margin-top:-1px}
.av-bag.d25{grid-column:3;background:linear-gradient(#8c2f39,#6a1f2a);color:#f6ecd2}
.av-bag.d25.wait{background:linear-gradient(#4a2a2e,#382024)}
.av-bag:active{transform:rotate(var(--r)) scale(.95)}
.av-say{flex:none;min-height:46px;width:min(340px,calc(100% - 44px));margin:0 0 calc(18px + env(safe-area-inset-bottom));text-align:center;font:19px/23px ${HAND};color:#cdbf9f}
.av-sheet{position:fixed;inset:0;z-index:61;display:flex;align-items:flex-end;justify-content:center;background:#05060acc;opacity:0;transition:opacity .3s}
.av-sheet.on{opacity:1}
.av-card{width:min(420px,100%);max-height:calc(100% - 30px - env(safe-area-inset-top));overflow:auto;box-sizing:border-box;padding:22px 22px calc(20px + env(safe-area-inset-bottom));border-radius:14px 14px 0 0;background:linear-gradient(#f1e6c8,#e6d8b4);color:#2a2134;box-shadow:0 -10px 40px #000c;transform:translateY(30px);transition:transform .35s cubic-bezier(.3,.7,.2,1)}
.av-sheet.on .av-card{transform:none}
.av-card .lb{display:block;font:italic 15px ${SERIF};color:#7a6a50}
.av-card h2{margin:2px 0 10px;font:400 27px/1.15 ${SERIF};color:#2a2134}
.av-card p{margin:0 0 10px;font:18px/26px ${SERIF};text-wrap:pretty}
.av-card .hand{font:22px/27px ${HAND};color:#3a2c1c}
.av-in{display:block;width:100%;box-sizing:border-box;min-height:52px;margin:6px 0 10px;padding:0 14px;border-radius:8px;border:1px solid #a8946c;background:#fbf5e6;color:#2a2134;font:22px ${HAND};user-select:text;-webkit-user-select:text}
.av-in:focus{outline:2px solid ${GOLD};outline-offset:1px}
.av-go{display:block;width:100%;min-height:52px;border-radius:8px;border:1px solid #2a2016;background:#2a2016;color:#f6ecd2;font:20px ${SERIF};cursor:pointer}
.av-go.soft{margin-top:8px;background:none;color:#5a4a34;border-color:#a8946c}
.av-err{min-height:24px;margin:6px 0 0;font:19px/23px ${HAND};color:#a3372a}
.av-page .pic{display:block;width:calc(100% + 44px);margin:-22px -22px 14px;aspect-ratio:1/1;max-height:46vh;object-fit:contain;background:#fbf5e6;border-radius:14px 14px 0 0}
.av-page .pic.drawn{background:#1b1a2a}
.av-page .inside{margin:-4px 0 14px;font:italic 16px/21px ${SERIF};color:#5a4a34}
.av-page h3{margin:16px 0 4px;font:italic 400 19px ${SERIF};color:#7a3b22}
.av-nav{display:flex;gap:8px;margin-top:16px}
.av-nav button{flex:1;min-height:48px;border-radius:8px;border:1px solid #a8946c;background:none;color:#3a2c1c;font:18px ${SERIF};cursor:pointer}
.av-nav button.main{flex:1.4;background:#2a2016;border-color:#2a2016;color:#f6ecd2}
.av-nav button:disabled{opacity:.3}
@media (prefers-reduced-motion:reduce){.av,.av-sheet,.av-card,.av-bag{transition:none;animation:none}.av-snow{display:none}}
`;

const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const dateIt = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]}${y !== YEAR ? ` ${y}` : ''}`; };

export const HOLLY = (w = 70) => `<svg class="av-holly" width="${w}" height="${Math.round(w * 0.45)}" viewBox="0 0 70 32" aria-hidden="true"><path d="M35 18 C24 6 12 8 4 4 C8 10 6 16 12 18 C10 22 14 26 20 24 C24 28 30 24 35 18Z" fill="#2f5a3a" stroke="#1d3a26"/><path d="M35 18 C46 6 58 8 66 4 C62 10 64 16 58 18 C60 22 56 26 50 24 C46 28 40 24 35 18Z" fill="#3a6a45" stroke="#1d3a26"/><circle cx="31" cy="20" r="4" fill="#b8323a"/><circle cx="38" cy="21" r="4" fill="#a3272f"/><circle cx="35" cy="14" r="4" fill="#c63a42"/><circle cx="34" cy="13" r="1.2" fill="#ffd9d0"/></svg>`;

// the three printed things have no photo: a small drawing in their place
function drawn(kind) {
  if (kind === 'famiglio') return `<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="58" y="14" width="84" height="150" rx="6" fill="#efe4c8" stroke="#d8b25a" stroke-width="3"/><rect x="65" y="21" width="70" height="114" fill="#2b2140"/><circle cx="100" cy="46" r="11" fill="#e9d595"/><path d="M80 132 C78 104 84 88 92 82 L88 66 L97 76 L103 76 L112 66 L108 82 C116 88 122 104 120 132Z" fill="#0b0a10"/><path d="M120 128 C134 124 136 110 128 104" stroke="#0b0a10" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="95" cy="86" r="2.4" fill="#e6c26a"/><circle cx="105" cy="86" r="2.4" fill="#e6c26a"/><text x="100" y="153" text-anchor="middle" font-family="serif" font-size="11" letter-spacing="1" fill="#2a2134">IL FAMIGLIO</text><text x="100" y="188" text-anchor="middle" font-family="serif" font-style="italic" font-size="12" fill="#cdbf9f">Tartufo</text></svg>`;
  if (kind === 'tema') {
    const G = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((g) => `${g}\uFE0E`); // text glyphs, not emoji
    const lines = G.map((_, i) => { const a = (i * 30) * Math.PI / 180; return `<line x1="${100 + 52 * Math.cos(a)}" y1="${100 + 52 * Math.sin(a)}" x2="${100 + 84 * Math.cos(a)}" y2="${100 + 84 * Math.sin(a)}" stroke="#d8b25a88"/>`; }).join('');
    const glyphs = G.map((g, i) => { const a = (i * 30 + 15) * Math.PI / 180; return `<text x="${100 + 72 * Math.cos(a)}" y="${105 + 72 * Math.sin(a)}" text-anchor="middle" font-family="serif" font-size="13" fill="${i === 5 ? '#ffe9a8' : '#cdbf9f'}">${g}</text>`; }).join('');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="84" fill="none" stroke="#d8b25a"/><circle cx="100" cy="100" r="60" fill="none" stroke="#d8b25a88"/><circle cx="100" cy="100" r="52" fill="#15131f" stroke="#d8b25a"/>${lines}${glyphs}<circle cx="100" cy="100" r="6" fill="#e9d595"/><path d="M70 80 L130 122 M84 132 L124 72" stroke="#8fb3d9" stroke-width="1"/></svg>`;
  }
  // 'lune': twelve months, a row of phases each
  const r = rnd(2027);
  let s = '';
  for (let m = 0; m < 12; m++) {
    const y = 18 + m * 14.5;
    s += `<text x="16" y="${y + 4}" font-family="serif" font-size="8" fill="#cdbf9f">${MONTHS[m].slice(0, 3)}</text>`;
    for (let k = 0; k < 8; k++) {
      // a lit disc with a dark disc slid over it: new, crescent, half, gibbous, full and back
      const ph = Math.floor(k + m * 0.9 + r() * 0.5) % 8, x = 44 + k * 19, off = [0, 3.2, 5.6, 8.4, 99, -8.4, -5.6, -3.2][ph];
      s += `<circle cx="${x}" cy="${y}" r="5.5" fill="#e9d595" stroke="#d8b25a66"/>${off === 99 ? '' : `<circle cx="${x + off}" cy="${y}" r="5.6" fill="#1b1a2a"/>`}<circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="#d8b25a66"/>`;
    }
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true"><text x="100" y="9" text-anchor="middle" font-family="serif" font-size="9" fill="#ffe9a8">2027</text>${s}</svg>`;
}

function snow(n = 34) {
  const box = h('div.av-snow'), r = rnd(1225);
  for (let i = 0; i < n; i++) {
    const sz = 2 + r() * 4;
    box.append(h('i', { style: { left: `${r() * 100}%`, width: `${sz}px`, height: `${sz}px`, opacity: String(0.35 + r() * 0.5), animationDuration: `${(9 + r() * 10).toFixed(1)}s`, animationDelay: `${(-r() * 18).toFixed(1)}s`, '--dx': `${Math.round((r() - 0.5) * 80)}px` } }));
  }
  return box;
}

export function openAdvent() {
  css('ui-avvento', CSS);
  return new Promise((resolve) => {
    const grid = h('div.av-grid', { role: 'list', 'aria-label': 'I venticinque sacchetti' });
    const say = h('p.av-say', { 'aria-live': 'polite' });
    const el = h('div.av', { role: 'dialog', 'aria-label': 'Il calendario dell\'Avvento' }, snow(),
      h('div.av-bar', h('span', {}, `Oggi è il ${dateIt(adventDate())}`), h('button.av-x', { type: 'button', 'aria-label': 'Torna al tavolo', onclick: () => end() }, '×')),
      h('div.av-head', h('span', { html: HOLLY() }), h('h1', {}, 'Il calendario'), h('p', {}, 'Ogni sacchetto ha un bigliettino, e ogni bigliettino una parola. Scrivila qui, e qui si apre la sua pagina.')),
      grid, say);
    const close = openOverlay(el);
    let ended = false, sheetOff = null;
    const end = () => { if (ended) return; ended = true; sheetOff?.(); el.classList.remove('on'); setTimeout(() => { close(); resolve(); }, reducedMotion() ? 0 : 380); };

    const r = rnd(24);
    const draw = () => {
      grid.replaceChildren(...Array.from({ length: 4 }, (_, i) => h('i.av-string', { style: { top: `${i * 25}%` } })));
      for (let d = 1; d <= LAST_DAY; d++) {
        const st = slot(d);
        const b = h(`button.av-bag.${st}${d === LAST_DAY ? '.d25' : ''}`, { type: 'button', role: 'listitem', style: { '--r': `${((r() - 0.5) * 7).toFixed(1)}deg` },
          'aria-label': st === 'open' ? `${d}: ${PAGE[d].title}` : st === 'ask' ? `${d}: da aprire con la parola` : `${d}: non ancora` ,
          onclick: () => tap(d) }, h('span', {}, String(d)));
        grid.append(b);
      }
      const n = toAsk();
      say.textContent = n ? `Il sacchetto del ${n} aspetta la sua parola.` : '';
    };
    const tap = (d) => {
      const st = slot(d);
      if (st === 'wait') { snd('tap'); say.textContent = d === LAST_DAY ? 'L\'ultimo si apre a Natale.' : `Questo si apre il ${d} dicembre.`; return; }
      snd('page');
      if (st === 'ask') ask(d); else page(d);
    };

    // ---- the sheet that rises from the bottom
    const sheet = (card) => {
      sheetOff?.();
      const s = h('div.av-sheet', { onclick: (e) => { if (e.target === s) off(); } }, card);
      el.append(s);
      requestAnimationFrame(() => s.classList.add('on'));
      const off = () => { if (sheetOff !== off) return; sheetOff = null; s.classList.remove('on'); setTimeout(() => s.remove(), reducedMotion() ? 0 : 300); };
      sheetOff = off;
      return off;
    };
    const ask = (d) => {
      const input = h('input.av-in', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: false, enterkeyhint: 'go', 'aria-label': 'La parola del bigliettino', placeholder: 'la parola' });
      const err = h('p.av-err', { 'aria-live': 'polite' });
      const go = () => {
        const res = openWithWord(d, input.value);
        if (res.ok) { snd('card'); draw(); page(d, true); return; }
        snd('tap');
        err.textContent = res.why === 'empty' ? 'Scrivi la parola che trovi sul bigliettino.' : 'Non è questa. Rileggi il bigliettino con calma.';
        input.select?.();
      };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
      const off = sheet(h('div.av-card', { role: 'dialog', 'aria-label': `Il sacchetto del ${d}` },
        h('span.lb', {}, d === LAST_DAY ? 'Natale' : `${d} dicembre`), h('h2', {}, d === LAST_DAY ? 'L\'ultimo sacchetto' : `Il sacchetto del ${d}`),
        h('p.hand', {}, 'Dentro c\'è un bigliettino, e da qualche parte c\'è una parola. Scrivila qui.'),
        input, h('button.av-go', { type: 'button', onclick: go }, 'Apri'), err,
        h('button.av-go.soft', { type: 'button', onclick: () => off() }, 'Non l\'ho ancora aperto')));
      setTimeout(() => input.focus(), 350);
    };
    const page = (d, fresh = false) => {
      const p = PAGE[d];
      const opened = PAGES.filter((x) => slot(x.d) === 'open').map((x) => x.d);
      const i = opened.indexOf(d), prev = opened[i - 1], next = opened[i + 1];
      const pic = p.img ? h('img.pic', { src: `avvento/${p.img}.webp`, alt: p.inside, draggable: false }) : h('div.pic.drawn', { html: drawn(p.draw), role: 'img', 'aria-label': p.inside });
      const off = sheet(h('div.av-card.av-page', { role: 'dialog', 'aria-label': p.title },
        pic, h('span.lb', {}, `${d === LAST_DAY ? 'Natale' : `${d} dicembre`}${fresh ? ' · aperto adesso' : ''}`), h('h2', {}, p.title), h('p.inside', {}, `Nel sacchetto: ${p.inside.charAt(0).toLowerCase()}${p.inside.slice(1)}.`),
        ...p.parts.flatMap((x) => [h('h3', {}, x.h), h('p', {}, x.p)]),
        h('div.av-nav',
          h('button', { type: 'button', disabled: !prev, 'aria-label': 'Il precedente', onclick: () => { snd('page'); page(prev); } }, '‹'),
          h('button.main', { type: 'button', onclick: () => { snd('tap'); off(); } }, 'Al calendario'),
          h('button', { type: 'button', disabled: !next, 'aria-label': 'Il successivo', onclick: () => { snd('page'); page(next); } }, '›'))));
      return off;
    };

    draw();
    requestAnimationFrame(() => el.classList.add('on'));
  });
}
