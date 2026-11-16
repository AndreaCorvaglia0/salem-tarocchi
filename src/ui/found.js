// The ceremony of a found card (docs/DESIGN.md, "Trovare una carta"): the card turns over, large;
// "Guarda. Cosa ti colpisce?": she taps a detail (faint rings appear after a moment; a tap anywhere
// picks the nearest); its note appears; then three words of her own, and the book's three words;
// then the card flies into the grimoire. Under twenty seconds, a small ritual.
// foundCeremony(id) -> Promise resolved when the card is in the grimoire.
import { snd } from './sfx.js';
import { h, css, cardUrl, openOverlay, reducedMotion } from '../core/dom.js';
import { state } from '../core/state.js';
import { CARD } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { findCard, setDetail, setWords, hintOnce } from '../core/progress.js';
import { HAND, SERIF, GOLD, INK, baseCss } from './paper.js';
import { cardBack } from './art.js';
import { nearestDetail } from './logic.js';

const CSS = `
.fd{position:fixed;inset:0;z-index:80;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:calc(16px + env(safe-area-inset-top)) 18px calc(18px + env(safe-area-inset-bottom));box-sizing:border-box;background:radial-gradient(ellipse at 50% 42%,#2a2238f0,#07060cfa 75%);color:#f1e7cf;font:22px/30px ${HAND};text-align:center;animation:gx-fade .3s}
.fd-top{min-height:64px;display:flex;flex-direction:column;justify-content:flex-end}
.fd-name{font:26px/32px ${SERIF};color:#f6ecd2;letter-spacing:.02em;opacity:0;transition:opacity .5s .5s}
.fd.turned .fd-name{opacity:1}
.fd-say{font-size:24px;line-height:30px;color:#e9dcc0;min-height:30px}
.fd-say:empty{display:none}
.fd-birth{color:${GOLD};font-size:22px;line-height:28px}
.fd-stage{perspective:1200px;transition:transform .5s,width .5s,height .5s}
.fd-card{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.3,.7,.2,1)}
.fd.turned .fd-card{transform:rotateY(180deg)}
.fd-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px #00000055,0 16px 50px #000c,0 0 70px #d8b25a22}
.fd-face.front{transform:rotateY(180deg);background:#efe4c8;padding:6px;box-sizing:border-box}
.fd-face.front img{display:block;width:100%;height:100%;object-fit:cover;border-radius:6px}
.fd-face.back svg{width:100%;height:100%}
.fd-hit{position:absolute;inset:6px;cursor:crosshair}
.fd-ring{position:absolute;transform:translate(-50%,-50%);border-radius:50%;border:2px solid #fff6dc;box-shadow:0 0 0 1px #0006,0 0 14px #fff3c088;opacity:0;transition:opacity .6s,border-color .3s,transform .3s;pointer-events:none}
.fd.rings .fd-ring{opacity:.42}
.fd.rings .fd-ring.pick{opacity:1;border-color:${GOLD};border-width:3px;transform:translate(-50%,-50%) scale(1.08)}
.fd.rings.picked .fd-ring:not(.pick){opacity:0}
.fd-note{min-height:62px;max-width:420px}
.fd-note b{color:${GOLD};font-weight:700}
.fd-words{display:none;flex-direction:column;align-items:center;gap:8px;width:100%;max-width:360px}
.fd.writing .fd-words{display:flex;animation:gx-in .4s}
.fd.writing{justify-content:flex-start;gap:8px;overflow:hidden auto}.fd.writing .fd-note,.fd.writing .fd-birth{display:none}.fd.writing .fd-top{min-height:0}
.fd-words .row{display:flex;gap:8px;width:100%}
.fd-words input{flex:1;min-width:0;min-height:46px;padding:2px 6px;border:0;border-bottom:2px solid #e9dcc088;background:transparent;color:#fff7e2;font:700 23px ${HAND};text-align:center;outline:none;border-radius:0}
.fd-words input:focus{border-bottom-color:${GOLD}}
.fd-words input::placeholder{color:#e9dcc066;font-weight:400}
.fd-acts{display:flex;gap:12px;justify-content:center;margin-top:6px}
.fd-b{min-height:48px;padding:0 22px;border-radius:12px;border:1.5px solid #e9dcc0aa;background:#ffffff10;color:#fff7e2;font:700 22px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.fd-b.main{background:#efe4c8;color:${INK};border-color:#efe4c8}
.fd-b:focus-visible{outline:2px solid ${GOLD};outline-offset:2px}
.fd-book{color:#d9cdb2;font-size:21px}
.fd-says{margin:10px 4px 2px;font:italic 20px/27px ${SERIF};color:#f1e7cf;text-align:center;text-wrap:pretty;animation:gx-fade .5s}
.fd-book b{color:${GOLD}}
.fd.flying .fd-stage{transition:transform .75s cubic-bezier(.5,0,.8,.4),opacity .75s;opacity:0}
.fd.flying .fd-top,.fd.flying .fd-note,.fd.flying .fd-words{transition:opacity .3s;opacity:0}
`;

const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion() ? Math.min(ms, 120) : ms));

export function foundCeremony(id) {
  baseCss(); css('ui-found', CSS);
  const c = CARD[id] || { name: id }, S = sheet(id) || {}, details = (S.details || []).filter((d) => d && d.x != null);
  const vw = globalThis.innerWidth || 390, vh = globalThis.innerHeight || 844;
  const H = Math.round(Math.min(vh * 0.52, 470, (vw - 60) * 12 / 7)), W = Math.round(H * 7 / 12);
  const say = h('p.fd-say', {}, '');
  const birth = id === state.player?.birthCard ? h('p.fd-birth', {}, 'È la carta del tuo segno. Ti aspettava.') : null;
  const top = h('div.fd-top', h('p.fd-name', {}, c.roman ? `${c.roman} · ${c.name}` : c.name), say);
  // rings: circles centred on each detail, r in % of the card's width
  const rings = details.map((d) => h('span.fd-ring', { style: { left: `${d.x}%`, top: `${d.y}%`, width: `${(d.r || 12) * 2}%`, aspectRatio: '1' } }));
  const hit = h('div.fd-hit', {}, ...rings);
  const front = h('div.fd-face.front', h('img', { src: cardUrl(id), alt: c.name, decoding: 'async' }), hit);
  const back = h('div.fd-face.back', { html: cardBack(W, H) });
  const stage = h('div.fd-stage', { style: { width: `${W}px`, height: `${H}px` } }, h('div.fd-card', back, front));
  const note = h('p.fd-note', { role: 'status' });
  const inputs = [0, 1, 2].map((i) => h('input', { type: 'text', maxLength: 24, placeholder: ['una', 'due', 'tre'][i], 'aria-label': `Parola ${i + 1}`, autocomplete: 'off', autocapitalize: 'none', spellcheck: false }));
  const words = h('div.fd-words', h('p', {}, 'Tre parole tue.'), h('div.row', inputs));
  const el = h('div.fd', { role: 'dialog', 'aria-label': `Hai trovato ${c.name}` }, top, stage, birth, note, words);
  const close = openOverlay(el);
  let detail = null, fit = null;

  return new Promise((resolve) => {
    (async () => {
      await wait(350);
      el.classList.add('turned');
      await wait(1000);
      say.textContent = 'Guarda. Cosa ti colpisce?';
      // the rings come after a moment of just looking
      const ringT = setTimeout(() => el.classList.add('rings'), 1400);
      if (details.length) hintOnce('detail');
      detail = await new Promise((res) => {
        if (!details.length) { setTimeout(() => res(null), 1200); return; }
        hit.onclick = (e) => {
          const r = hit.getBoundingClientRect();
          res(nearestDetail(details, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100));
        };
      });
      clearTimeout(ringT);
      hit.onclick = null;
      if (detail) {
        el.classList.add('rings', 'picked');
        rings[details.indexOf(detail)]?.classList.add('pick');
        note.replaceChildren(h('b', {}, `${detail.label[0]?.toUpperCase() || ''}${detail.label.slice(1)}. `), detail.note || '');
        await wait(1500);
      }
      // the words: the card steps back to leave room
      // ...and stays in sight while she writes: the screen follows the part the keyboard leaves free
      const k = 0.62, vv = globalThis.visualViewport;
      fit = () => {
        const hh = Math.round(vv ? vv.height : globalThis.innerHeight || vh);
        el.style.top = `${Math.round(vv ? vv.offsetTop : 0)}px`; el.style.bottom = 'auto'; el.style.height = `${hh}px`;
        const ch = Math.round(Math.max(110, Math.min(H * k, hh - 236)));
        stage.style.height = `${ch}px`; stage.style.width = `${Math.round(ch * 7 / 12)}px`;
      };
      fit();
      vv?.addEventListener('resize', fit); vv?.addEventListener('scroll', fit);
      say.textContent = '';
      el.classList.add('writing');
      hintOnce('words');
      const acts = h('div.fd-acts');
      words.append(acts);
      const mine = await new Promise((res) => {
        const done = h('button.fd-b.main', { type: 'button', onclick: () => res(inputs.map((x) => x.value)) }, 'Fatto');
        const skip = h('button.fd-b', { type: 'button', onclick: () => res(['', '', '']) }, 'Salta');
        acts.append(skip, done);
        inputs.forEach((x, i) => x.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (i < 2) inputs[i + 1].focus(); else done.click(); } }));
        if (!globalThis.matchMedia?.('(pointer: coarse)').matches) inputs[0].focus();
      });
      // the book's words, shown only now
      document.activeElement?.blur?.();
      const bw = (c.words || []).filter(Boolean);
      const own = mine.map((w) => w.trim()).filter(Boolean);
      words.replaceChildren(...[own.length ? h('p.fd-book', {}, 'Le tue: ', h('b', {}, own.join(' · '))) : null, h('p.fd-book', {}, 'Quelle del libro: ', h('b', {}, bw.join(' · ')))].filter(Boolean));
      // what the card says, at once: she reads it at her own pace and goes on with a tap
      const tell = S.says || S.core || '';
      if (tell) words.append(h('p.fd-says', {}, tell));
      await wait(500);
      await new Promise((res) => words.append(h('div.fd-acts', {}, h('button.fd-b.main', { type: 'button', onclick: res }, 'Continua'))));
      if (fit) { globalThis.visualViewport?.removeEventListener('resize', fit); globalThis.visualViewport?.removeEventListener('scroll', fit); }
      // into the grimoire: towards the HUD's book if there is one, else the top right corner
      const tgt = document.querySelector('.hud-book')?.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      const tx = (tgt ? tgt.left + tgt.width / 2 : vw - 36) - (sr.left + sr.width / 2), ty = (tgt ? tgt.top + tgt.height / 2 : 36) - (sr.top + sr.height / 2);
      stage.style.transform = `translate(${tx}px,${ty}px) scale(.12) rotate(-12deg)`;
      el.classList.add('flying');
      await wait(780);
      close();
      findCard(id);
      if (detail) setDetail(id, detail.id);
      if (mine.some((w) => w.trim())) setWords(id, mine);
      resolve();
    })().catch((e) => { console.error('[found]', e); close(); findCard(id); resolve(); });
  });
}
