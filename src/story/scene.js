// The table scene of the sessions: one canvas, drawn with requestAnimationFrame (capped resolution,
// paused when the page is hidden). It owns the candle, the hands, the deck and the cards laid on the
// table; the session UI (captions, choices, fields) is DOM on top and drives it through this API.
//   const sc = createScene(parent, { level: 0..4, found: [ids] })
//   await sc.shuffle(); await sc.layCard('m00'); sc.speak(); sc.clearCards(); sc.dispose()
import { cardUrl, reducedMotion } from '../core/dom.js';
import { canvas, rnd, lerp, clamp, ease, grain } from './paint.js';
import { Hand } from './hands.js';
import { geometry, paintBase, drawCandle, darkness, flamePos, cardBack } from './table.js';

const imgs = new Map();
const loadImg = (id, onload) => {
  let im = imgs.get(id);
  if (!im) { im = new Image(); im.src = cardUrl(id); imgs.set(id, im); }
  if (!im.complete) im.addEventListener('load', onload, { once: true });
  return im.complete && im.naturalWidth ? im : null;
};

export function createScene(parent, { level = 0, found = [] } = {}) {
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;background:#050409';
  parent.append(cv);
  const g = cv.getContext('2d'), calm = reducedMotion();
  let W = 0, H = 0, geo = null, base = null, baseKey = '', raf = 0, alive = true, last = 0, clock = 0, lean = 0, skipFlip = false, cost = 0, found_ = found.slice(), lvl = level, empty = false;
  const tweens = [], cards = [], hands = { L: new Hand(-1), R: new Hand(1) };
  const deck = { x: 0, y: 0, s: 0.55, to: null, shown: true, riffle: 0 };
  const flying = [];
  const dust = Array.from({ length: 38 }, (_, i) => { const r = rnd(i * 13 + 3); return { x: r(), y: r(), vx: (r() - 0.5) * 6, vy: -2 - r() * 5, ph: r() * 6, s: 0.8 + r() * 1.6 }; });
  const invalidate = () => { baseKey = ''; };

  const size = () => {
    const cssW = cv.clientWidth || 390, cssH = cv.clientHeight || 844;
    let d = Math.min(window.devicePixelRatio || 1, 1.5);
    if (cssW * cssH * d * d > 1.1e6) d = Math.sqrt(1.1e6 / (cssW * cssH));
    const w = Math.round(cssW * d), h = Math.round(cssH * d);
    if (w !== W || h !== H) { W = cv.width = w; H = cv.height = h; geo = geometry(W, H); baseKey = ''; settle(); }
  };
  // after a resize everything jumps to where it belongs
  const settle = () => {
    hands.L.pose(geo.rest(-1)); hands.R.pose(geo.rest(1));
    Object.assign(hands.L.p, geo.rest(-1)); Object.assign(hands.R.p, geo.rest(1));
    deck.x = geo.deckRest.x; deck.y = geo.deckRest.y;
    layout(true);
  };
  const imgOf = (id) => loadImg(id, invalidate);

  // ---- tweens run on the scene's own clock
  const tween = (ms, fn) => new Promise((res) => { tweens.push({ t0: clock, dur: Math.max(0.001, (calm ? ms * 0.5 : ms) / 1000), fn, res }); });
  const wait = (ms) => tween(ms, () => {});
  const runTweens = () => { for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i], k = clamp((clock - tw.t0) / tw.dur); tw.fn(k); if (k >= 1) { tweens.splice(i, 1); tw.res(); } } };

  // ---- cards on the table: at most three, side by side, the oldest slides away
  const slotW = (n) => Math.min(geo.cardW, (W * 0.9) / (n * 1.1));
  function layout(jump) {
    const live = cards.filter((c) => !c.leaving), n = live.length, w = slotW(Math.max(1, n));
    live.forEach((c, i) => { c.tw = w; c.tx = geo.cx + (i - (n - 1) / 2) * w * 1.1; c.ty = geo.slotY; if (jump) { c.x = c.tx; c.y = c.ty; c.w = c.tw; } });
  }
  async function layCard(id) {
    if (!geo) size();
    const live = cards.filter((c) => !c.leaving);
    if (live.length >= 3) { live[0].leaving = true; live[0].ty = geo.horizon - 0.05 * geo.U; }
    const c = { id, x: geo.cx, y: geo.horizon + 0.02 * geo.H, w: geo.cardW * 0.8, tx: 0, ty: 0, tw: 0, rot: (rnd(id.charCodeAt(2) * 31)() - 0.5) * 0.1, flip: 0, alpha: 0, lift: 0 };
    cards.push(c); layout(false); c.x = c.tx; c.w = c.tw * 0.85;
    hands.L.pose({ x: c.tx - c.tw * 0.5, y: geo.horizon + 0.05 * geo.U, rot: -0.05, curl: 0.15, point: 0.3 }, 5);
    await tween(650, (k) => { c.alpha = ease(Math.min(1, k * 2)); });
    const ch = c.tw / 0.583;
    hands.L.pose({ x: c.tx + c.tw * 0.46, y: c.ty - ch * 0.56, rot: 0.1, curl: 0.2, point: 1 }, 6);
    await wait(500);
    await tween(950, (k) => {
      c.flip = ease(k); c.lift = Math.sin(Math.PI * k) * 0.045 * geo.U;
      hands.L.pose({ x: c.tx + c.tw * (0.46 - 0.62 * ease(k)), y: c.ty - ch * (0.56 - 0.14 * Math.sin(Math.PI * k)), rot: 0.1 - 0.2 * k }, 9);
    });
    c.flip = 1; c.lift = 0;
    hands.L.pose(geo.rest(-1), 3);
    await wait(450);
  }
  async function clearCards() {
    for (const c of cards) c.leaving = true;
    const was = cards.slice();
    await tween(700, (k) => { for (const c of was) { c.alpha = 1 - ease(k); c.ty = geo.horizon; } });
    cards.splice(0, cards.length);
  }

  // ---- the shuffle: the deck comes to the middle, the hands work it, cards fly across, it goes back
  async function shuffle(ms = 2400) {
    if (!geo) size();
    const cx = geo.cx, cy = geo.slotY, hw = geo.cardW * 0.78;
    deck.to = { x: cx, y: cy, s: 1 };
    await wait(500);
    hands.L.pose({ x: cx - hw, y: cy - 0.01 * geo.U, rot: -1.25, curl: 0.5, spread: 0.3, point: 0 }, 6);
    hands.R.pose({ x: cx + hw, y: cy - 0.01 * geo.U, rot: 1.25, curl: 0.5, spread: 0.3, point: 0 }, 6);
    await wait(350);
    await tween(ms, (k) => {
      deck.riffle = Math.sin(Math.PI * Math.min(1, k * 1.05)) ;
      const s = Math.sin(clock * 15) * 0.012 * geo.U * deck.riffle;
      hands.L.pose({ x: cx - hw + s, rot: -1.25 + Math.sin(clock * 11) * 0.07, curl: 0.5 + Math.sin(clock * 9) * 0.1 });
      hands.R.pose({ x: cx + hw - s, rot: 1.25 - Math.sin(clock * 11 + 1) * 0.07, curl: 0.5 + Math.sin(clock * 9 + 2) * 0.1 });
      if (!calm && Math.random() < 0.18 && flying.length < 7) flying.push({ t0: clock, dir: Math.random() < 0.5 ? 1 : -1, dur: 0.28 + Math.random() * 0.12 });
    });
    deck.riffle = 0;
    hands.L.pose(geo.rest(-1), 3); hands.R.pose(geo.rest(1), 3);
    deck.to = { x: geo.deckRest.x, y: geo.deckRest.y, s: 0.55 };
    await wait(650);
  }

  // ---- drawing
  function drawCard(c) {
    const w = c.w, h = w / 0.583, im = c.flip > 0.5 ? imgOf(c.id) : null, sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * c.flip)));
    g.save(); g.globalAlpha = c.alpha;
    g.fillStyle = 'rgba(0,0,0,0.42)'; g.beginPath(); g.ellipse(c.x + 0.01 * geo.U + c.lift * 0.5, c.y + 0.012 * geo.U + c.lift * 0.9, w * 0.55 * sx, h * 0.52, 0, 0, 7); g.fill();
    g.translate(c.x, c.y - c.lift); g.rotate(c.rot); g.scale(sx, 1 + 0.04 * Math.sin(Math.PI * c.flip));
    g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, w * 0.04); g.save(); g.clip();
    g.drawImage(im || cardBack(), -w / 2, -h / 2, w, h);
    g.restore(); g.strokeStyle = 'rgba(255,230,190,0.25)'; g.lineWidth = 1; g.stroke();
    g.restore();
  }
  function drawDeck() {
    const w = geo.cardW * deck.s, h = w / 0.583;
    for (let i = 0; i < 7; i++) {
      const wob = deck.riffle ? Math.sin(clock * 20 + i * 1.7) * deck.riffle * 0.012 * geo.U : 0;
      drawCard({ id: '', x: deck.x + wob, y: deck.y - i * 1.6, w, rot: i * 0.004, flip: 0, alpha: 1, lift: 0 });
    }
    void h;
  }
  function drawFlying() {
    for (let i = flying.length - 1; i >= 0; i--) {
      const f = flying[i], k = (clock - f.t0) / f.dur;
      if (k >= 1) { flying.splice(i, 1); continue; }
      const hw = geo.cardW * 0.78, x = geo.cx + f.dir * (hw * 0.5 - hw * k), y = geo.slotY - Math.sin(Math.PI * k) * 0.09 * geo.U;
      drawCard({ id: '', x, y, w: geo.cardW * 0.8, rot: f.dir * (k - 0.5) * 0.7, flip: 0, alpha: 1, lift: 0 });
    }
  }
  function drawDust(fp, R) {
    g.save(); g.fillStyle = '#ffd9a0';
    for (const p of dust) {
      const x = ((p.x * W + (p.vx * clock * (calm ? 0 : 1)) * geo.U / 400) % W + W) % W, y = ((p.y * H + p.vy * clock * (calm ? 0 : 1) * geo.U / 400) % H + H) % H;
      const a = clamp(1 - Math.hypot(x - fp.x, y - fp.y) / (R * 0.75)) * (0.35 + 0.35 * Math.sin(clock * 1.6 + p.ph)) * 0.9;
      if (a < 0.02) continue;
      g.globalAlpha = a; const s = p.s * Math.max(1, W / 450); g.fillRect(x, y, s, s);
    }
    g.restore();
  }

  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = 0; return; }
    if (cost > 14 && (skipFlip = !skipFlip)) return; // slow device: every other frame
    const t0 = performance.now();
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; clock += dt;
    size();
    const key = `${W}x${H}|${lvl}|${found_.join()}`;
    if (key !== baseKey) { baseKey = key; const [b, bg] = canvas(W, H); paintBase(bg, geo, found_, imgOf, { empty }); base = b; }
    runTweens();
    lean *= Math.exp(-dt * 2.2);
    hands.L.update(dt); hands.R.update(dt);
    if (deck.to) for (const k of ['x', 'y', 's']) deck[k] += (deck.to[k] - deck[k]) * (1 - Math.exp(-dt * 5));
    const a = 1 - Math.exp(-dt * 6);
    for (const c of cards) { c.x += (c.tx - c.x) * a; c.y += (c.ty - c.y) * a; c.w += (c.tw - c.w) * a; }

    g.drawImage(base, 0, 0);
    drawDeck(); drawFlying();
    for (const c of cards) drawCard(c);
    if (!empty) { hands.L.draw(g, geo.U, geo.shoulder(-1), clock, calm); hands.R.draw(g, geo.U, geo.shoulder(1), clock, calm); }
    const { R, fp } = darkness(g, geo, lvl, clock, calm);
    drawDust(fp, R);
    drawCandle(g, geo, lvl, clock, lean, calm);
    grain(g, W, H, 0.05, calm ? 0 : Math.floor(clock * 14) / 14);
    cost = cost * 0.9 + (performance.now() - t0) * 0.1;
  }
  size();
  raf = requestAnimationFrame(frame);

  return {
    el: cv, layCard, clearCards, shuffle, wait,
    speak() { lean = 0.35; }, // the flame leans toward you when she speaks
    setLevel(n) { lvl = clamp(n, 0, 4); invalidate(); },
    setFound(ids) { found_ = ids.slice(); invalidate(); },
    setEmpty(v = true) { empty = !!v; invalidate(); }, // the last image: the Reader's seat is empty
    get cards() { return cards.map((c) => c.id); },
    dispose() { alive = false; cancelAnimationFrame(raf); cv.remove(); },
  };
}
export { flamePos };
