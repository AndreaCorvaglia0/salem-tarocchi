// «Le arie, alla cieca»: the blind listening test of the smoke rite's music (notes/rito/musica.md).
// Thirteen 20-second clips with no names, in a random order; for each, «A quale aria la daresti?» (five
// swatches of colour and smoke with one word) and «Ti piace?». At the end a short code to copy and send back;
// scripts/audio/ascolto-decode.mjs turns it into the table. Vanilla module, no game code: the build copies it
// as it is to <site>/ascolto/ (vite.config.js, ascoltoPlugin). The answers stay in localStorage meanwhile.
// The clip codes are random letters: which air each one was measured for is only in scripts/audio/ascolto-key.json.

export const CLIPS = ['vfs', 'gln', 'pbr', 'lbv', 'sgm', 'tdd', 'jpm', 'djr', 'ffj', 'tdj', 'smr', 'jvs', 'pgb'];
// The five airs as she meets them in the rite: colour, the way the smoke moves, one word. The colours are
// those of src/data/rite.js (tests/rite.data.test.mjs checks that they agree).
export const AIRS = [
  { id: 'rosa', word: 'tenerezza', color: '#e58aa0', room: '#4a1f2e', motion: 'wave' },
  { id: 'alloro', word: 'slancio', color: '#e8c15a', room: '#4a3410', motion: 'up' },
  { id: 'cipresso', word: 'gravità', color: '#4f7d5c', room: '#12261a', motion: 'low' },
  { id: 'salvia', word: 'chiarezza', color: '#c9d2cf', room: '#2c3336', motion: 'wide' },
  { id: 'mirra', word: 'veglia', color: '#b0702e', room: '#2e1a0c', motion: 'still' },
];
const LIKES = [['si', 'Sì'], ['cosi', 'Così così'], ['no', 'No']];
const KEY = 'salem-ascolto-v1';

// ---- the code: compact text, then base64url --------------------------------------------------------
// v1|who|clip:air:like,clip:air:like...   air = 0..4 or -, like = s c n or -
export function encode({ who = '', answers = {} }) {
  const parts = CLIPS.map((c) => { const a = answers[c] || {}; return `${c}:${a.air ?? '-'}:${a.like ? a.like[0] : '-'}`; });
  const txt = `v1|${String(who).replace(/[|,:]/g, ' ').trim().slice(0, 30)}|${parts.join(',')}`;
  const b = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(txt))) : Buffer.from(txt, 'utf8').toString('base64');
  return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decode(code) {
  const b = String(code).trim().replace(/-/g, '+').replace(/_/g, '/');
  const txt = typeof atob === 'function' ? decodeURIComponent(escape(atob(b))) : Buffer.from(b, 'base64').toString('utf8');
  const [v, who, list] = txt.split('|');
  if (v !== 'v1') throw new Error('codice di un\'altra versione');
  const answers = {};
  for (const p of (list || '').split(',')) {
    const [c, air, like] = p.split(':');
    answers[c] = { air: air === '-' ? null : Number(air), like: { s: 'si', c: 'cosi', n: 'no' }[like] || null };
  }
  return { who, answers };
}

// ---- the swatch: colour of the room, and a wisp of smoke that moves the air's way --------------------
const MOVES = {
  wave: { d: 'M32 58 C 22 48, 42 40, 30 30 S 40 14, 32 6', kf: '0%{transform:translate(0,0)}50%{transform:translate(5px,-6px)}100%{transform:translate(0,-12px);opacity:0}', dur: 5.5 },
  up: { d: 'M32 60 L 32 6', kf: '0%{transform:translateY(8px);opacity:0}20%{opacity:1}100%{transform:translateY(-14px);opacity:0}', dur: 1.8 },
  low: { d: 'M10 54 C 22 46, 42 46, 54 54', kf: '0%{transform:translate(-6px,0) scaleX(.8)}100%{transform:translate(6px,2px) scaleX(1.2);opacity:.2}', dur: 6.5 },
  wide: { d: 'M32 60 C 30 40, 14 30, 6 12 M32 60 C 34 40, 50 30, 58 12', kf: '0%{transform:scale(.6);opacity:0}30%{opacity:1}100%{transform:scale(1.15);opacity:0}', dur: 4 },
  still: { d: 'M32 56 C 18 52, 18 34, 32 32 C 46 34, 46 52, 32 56', kf: '0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.06);opacity:1}', dur: 7 },
};
let swatchN = 0;
export function swatch(air, size = 64) {
  const m = MOVES[air.motion], n = `sw${swatchN++}`;
  const anim = `@keyframes ${n}{${m.kf}}`;
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><defs><radialGradient id="${n}g" cx="50%" cy="85%" r="85%">`
    + `<stop offset="0" stop-color="${air.color}" stop-opacity=".55"/><stop offset="1" stop-color="${air.room}"/></radialGradient>`
    + `<filter id="${n}b"><feGaussianBlur stdDeviation="2.2"/></filter></defs><style>${anim}.${n}{animation:${n} ${m.dur}s ease-in-out infinite}</style>`
    + `<rect width="64" height="64" fill="url(#${n}g)"/><path class="smoke ${n}" d="${m.d}" fill="none" stroke="${air.color}" stroke-width="5" stroke-linecap="round" filter="url(#${n}b)" opacity=".9"/>`
    + `<circle cx="32" cy="61" r="3" fill="#ffb15a"/></svg>`;
}

// ---- the page ------------------------------------------------------------------------------------------
function shuffle(a) { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } }
function keep(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private tab: the page still works */ } }

function start(root) {
  const saved = load();
  const st = saved && Array.isArray(saved.order) && saved.order.length === CLIPS.length && saved.order.every((c) => CLIPS.includes(c))
    ? saved : { order: shuffle(CLIPS), answers: {}, who: '' };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  let playing = null; // { audio, btn, raf }
  const stop = () => {
    if (!playing) return;
    playing.audio.pause(); cancelAnimationFrame(playing.raf);
    playing.btn.classList.remove('on'); playing.btn.querySelector('span').textContent = '▶';
    playing.btn.querySelector('circle.p').style.strokeDashoffset = '170';
    playing = null;
  };
  const play = (clip, btn) => {
    const was = playing?.btn === btn; stop(); if (was) return;
    const audio = new Audio(`../rite/cand/${clip}.mp3`);
    audio.setAttribute('playsinline', '');
    const ring = btn.querySelector('circle.p');
    playing = { audio, btn, raf: 0 };
    const tick = () => { if (!playing || playing.audio !== audio) return; ring.style.strokeDashoffset = String(170 * (1 - Math.min(1, audio.currentTime / 20))); playing.raf = requestAnimationFrame(tick); };
    audio.addEventListener('ended', () => { if (playing?.audio === audio) stop(); });
    btn.classList.add('on'); btn.querySelector('span').textContent = '■';
    audio.play().then(tick).catch(() => stop());
  };

  root.append(el('h1', null, 'Le arie, alla cieca'));
  root.append(el('p', 'dim', `Qui ci sono ${CLIPS.length} pezzi di musica, di venti secondi l’uno e senza nome. Ascoltali quando vuoi e nell’ordine che vuoi: per ognuno scegli l’aria a cui lo daresti, guardando solo il colore e il fumo, e dimmi se ti piace. Alla fine trovi un codice da copiare e mandare.`));
  root.append(el('p', 'dim', 'Le cinque arie:'));
  const legend = el('div', 'legend');
  for (const a of AIRS) legend.append(el('div', 'sw', `${swatch(a)}<span>${a.word}</span>`));
  root.append(legend);
  const who = el('label', 'who', '<span class="dim">Chi ascolta?</span>');
  const inp = el('input'); inp.type = 'text'; inp.maxLength = 30; inp.value = st.who || ''; inp.placeholder = 'il tuo nome'; inp.autocomplete = 'off';
  inp.oninput = () => { st.who = inp.value; keep(st); refresh(); };
  who.append(inp); root.append(who);

  const cards = [];
  st.order.forEach((clip, i) => {
    const a = st.answers[clip] || (st.answers[clip] = { air: null, like: null });
    const card = el('section', 'card');
    const head = el('div', 'head');
    const btn = el('button', 'play', '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="none" stroke="#e0b95e33" stroke-width="3"/><circle class="p" cx="30" cy="30" r="27" fill="none" stroke="#e0b95e" stroke-width="3" stroke-dasharray="170" stroke-dashoffset="170"/></svg><span>▶</span>');
    btn.type = 'button'; btn.setAttribute('aria-label', `Ascolta il brano ${i + 1}`);
    btn.onclick = () => play(clip, btn);
    head.append(btn, el('b', null, `Brano ${i + 1}`));
    const airs = el('div', 'airs');
    const airBtns = AIRS.map((air, k) => {
      const b = el('button', 'air', `${swatch(air, 52)}<span>${air.word}</span>`); b.type = 'button';
      b.onclick = () => { a.air = a.air === k ? null : k; keep(st); paint(); refresh(); };
      airs.append(b); return b;
    });
    const likes = el('div', 'likes');
    const likeBtns = LIKES.map(([v, label]) => { const b = el('button', null, label); b.type = 'button'; b.onclick = () => { a.like = a.like === v ? null : v; keep(st); paint(); refresh(); }; likes.append(b); return b; });
    const paint = () => {
      airBtns.forEach((b, k) => b.classList.toggle('on', a.air === k));
      likeBtns.forEach((b, k) => b.classList.toggle('on', a.like === LIKES[k][0]));
      card.classList.toggle('done', a.air != null && a.like != null);
    };
    card.append(head, el('p', 'q', 'A quale aria la daresti?'), airs, el('p', 'q', 'Ti piace?'), likes);
    paint(); cards.push(card); root.append(card);
  });

  const end = el('section', 'end');
  const count = el('p', 'count dim');
  const code = el('div', 'code');
  const copy = el('button', 'go', 'Copia il codice'); copy.type = 'button';
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(code.textContent); copy.textContent = 'Copiato'; } catch { const r = document.createRange(); r.selectNodeContents(code); const s = getSelection(); s.removeAllRanges(); s.addRange(r); copy.textContent = 'Selezionato: copialo tu'; }
    setTimeout(() => { copy.textContent = 'Copia il codice'; }, 2200);
  };
  end.append(count, el('p', 'dim', 'Il codice cambia mentre rispondi; puoi mandarlo anche se qualcosa è rimasto vuoto.'), code, copy);
  root.append(end);
  function refresh() {
    const done = CLIPS.filter((c) => st.answers[c]?.air != null && st.answers[c]?.like != null).length;
    count.textContent = done === CLIPS.length ? 'Hai risposto a tutti i brani. Grazie!' : `Hai risposto a ${done} brani su ${CLIPS.length}.`;
    code.textContent = encode({ who: st.who, answers: st.answers });
  }
  refresh();
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
}

if (typeof document !== 'undefined' && document.getElementById('app')) start(document.getElementById('app'));
