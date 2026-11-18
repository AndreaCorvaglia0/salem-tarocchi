// The smoke rite's one canvas: the light of the room, the veil left by the last smoke, the hearth and the five
// embers on their arc, the breath circle, the smoke itself and (with her real deck) the deck under the smoke.
// The smoke is a few dozen soft puffs (one pre-drawn sprite per colour), each moving by its air's parameters
// (src/data/rite.js `smoke`): rise, sway, spread, fan, size, life, sink. Cheap on purpose: at most MAX puffs,
// one canvas pixel per CSS pixel, and if frames get slow the canvas gets coarser, then the puffs fewer.
const MAX = 72;
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

function sprite(color) {
  const s = 64, cv = document.createElement('canvas'); cv.width = cv.height = s;
  const g = cv.getContext('2d'), c = hex(color);
  const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  gr.addColorStop(0, rgba(c, 0.7)); gr.addColorStop(0.35, rgba(c, 0.42)); gr.addColorStop(0.7, rgba(c, 0.12)); gr.addColorStop(1, rgba(c, 0));
  g.fillStyle = gr; g.fillRect(0, 0, s, s);
  return cv;
}

export function createSmoke(canvas, { reduced = false } = {}) {
  const g = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, cap = reduced ? MAX / 2 : MAX, coarse = false;
  const sprites = new Map();
  const spr = (c) => { if (!sprites.has(c)) sprites.set(c, sprite(c)); return sprites.get(c); };
  const puffs = [];
  const emitters = new Map(); // id -> { x, y, p, color, on, acc, follow }
  const room = { cur: hex('#1a1220'), want: hex('#1a1220') };
  const veil = { color: hex('#000000'), a: 0, want: 0 };
  let breath = null; // { r } or null
  let deck = null; // { x, y, w, h } or null
  let scene = null; // the hearth and embers to draw: { hearthY, coal: 0..1, slots, owned, arcY, hover, lit, show }
  let raf = 0, last = 0, running = false;
  const frames = []; let slowSince = 0;
  let seed = 1; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    // soft smoke needs no sharp pixels: one canvas pixel per CSS pixel (then 0.75 if frames are slow)
    dpr = Math.min(globalThis.devicePixelRatio || 1, 1) * (coarse ? 0.75 : 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  }

  function emit(e) {
    const p = e.p, dir = rnd() < 0.5 ? -1 : 1;
    puffs.push({ x: e.x + (rnd() - 0.5) * p.spread, y: e.y, y0: e.y, age: 0, life: p.life * (0.8 + rnd() * 0.4), p, color: e.color, dir, ph: rnd() * Math.PI * 2, k: 0.85 + rnd() * 0.3 });
    if (puffs.length > cap) puffs.splice(0, puffs.length - cap);
  }

  function step(dt) {
    for (const e of emitters.values()) {
      if (!e.on) continue;
      const rate = (cap * 0.6) / e.p.life; // each emitter keeps about 60% of the puffs alive
      e.acc += dt * rate;
      while (e.acc >= 1) { e.acc -= 1; emit(e); }
    }
    for (let i = puffs.length - 1; i >= 0; i--) {
      const q = puffs[i], p = q.p;
      q.age += dt;
      if (q.age >= q.life) { puffs.splice(i, 1); continue; }
      const t = q.age / q.life, risen = Math.max(0, q.y0 - q.y);
      q.y -= p.rise * q.k * dt;
      if (p.sink && t > 0.45) q.y += p.sink * dt * (t - 0.45) * 4;
      q.x += Math.cos(q.age * 2 * Math.PI * p.swayHz + q.ph) * p.sway * 2 * Math.PI * p.swayHz * dt * 0.5;
      q.x += q.dir * p.fan * (risen / 100) * dt;
      q.x += Math.sin(q.age * 1.7 + q.ph * 3) * 6 * dt; // a little turbulence for every smoke
      if (p.spread > 30) q.x += q.dir * p.spread * 0.25 * dt; // a heavy smoke spreads along the ground
    }
    room.cur = mix(room.cur, room.want, Math.min(1, dt * 2.2));
    veil.a += (veil.want - veil.a) * Math.min(1, dt * 1.6);
  }

  function drawScene() {
    if (!scene) return;
    const { hearthY, coal, slots, owned, arcY, hover, lit, show } = scene;
    const made = scene.made || [];
    // the hearth: a long bed of coals, the coal to knock on in the middle
    const bed = g.createLinearGradient(0, hearthY - 30, 0, hearthY + 40);
    bed.addColorStop(0, 'rgba(0,0,0,0)'); bed.addColorStop(0.5, `rgba(120,40,10,${0.25 + coal * 0.25})`); bed.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bed; g.fillRect(0, hearthY - 30, W, 70);
    for (let i = 0; i < 13; i++) {
      const x = W * (0.08 + 0.84 * (i / 12)), y = hearthY + Math.sin(i * 2.3) * 5, r = 7 + (i % 3) * 2;
      g.fillStyle = `rgba(${150 + coal * 80},${50 + coal * 40},20,${0.35 + coal * 0.3})`; g.beginPath(); g.ellipse(x, y, r * 1.3, r * 0.7, 0, 0, 7); g.fill();
    }
    const cx = W / 2, cr = 30;
    const glow = g.createRadialGradient(cx, hearthY, 2, cx, hearthY, cr * (1.4 + coal * 1.6));
    glow.addColorStop(0, `rgba(255,${170 + coal * 60},${90 + coal * 60},${0.55 + coal * 0.45})`); glow.addColorStop(0.5, `rgba(220,80,20,${0.25 + coal * 0.3})`); glow.addColorStop(1, 'rgba(120,30,10,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(cx, hearthY, cr * (1.4 + coal * 1.6), 0, 7); g.fill();
    g.fillStyle = `rgb(${90 + coal * 140},${30 + coal * 80},${20 + coal * 30})`; g.beginPath(); g.ellipse(cx, hearthY, cr, cr * 0.62, 0, 0, 7); g.fill();
    // the embers on their arc: all alike until the thumb is over one; the slots not hers yet are cold stones
    if (!show) return;
    for (const s of slots) {
      const x = s.x, y = arcY + s.dy, mine = owned.includes(s.id), on = hover === s.id || lit === s.id;
      if (!mine) { g.fillStyle = `rgba(70,62,66,${0.7 * show})`; g.beginPath(); g.ellipse(x, y, 13, 8, 0, 0, 7); g.fill(); continue; }
      const R = on ? 30 : 20;
      const eg = g.createRadialGradient(x, y, 1, x, y, R * 1.8);
      eg.addColorStop(0, `rgba(255,${on ? 230 : 190},${on ? 170 : 110},${(on ? 1 : 0.8) * show})`); eg.addColorStop(0.4, `rgba(230,90,30,${(on ? 0.6 : 0.4) * show})`); eg.addColorStop(1, 'rgba(120,30,10,0)');
      g.fillStyle = eg; g.beginPath(); g.arc(x, y, R * 1.8, 0, 7); g.fill();
      g.fillStyle = `rgba(${on ? 255 : 200},${on ? 150 : 90},40,${show})`; g.beginPath(); g.ellipse(x, y, on ? 15 : 11, on ? 9 : 7, 0, 0, 7); g.fill();
      // an air she made herself: a small pale dot above its ember («tua»)
      if (made.includes(s.id)) { g.fillStyle = `rgba(250,238,200,${0.85 * show})`; g.beginPath(); g.arc(x, y - (on ? 20 : 15), 3, 0, 7); g.fill(); }
    }
  }

  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#0c080e'; g.fillRect(0, 0, W, H);
    // the light of the room: it takes the colour of the air under the thumb
    const hy = scene ? scene.hearthY : H * 0.8;
    const rg = g.createRadialGradient(W / 2, hy, 10, W / 2, hy * 0.75, H * 0.95);
    rg.addColorStop(0, rgba(mix(room.cur, [255, 255, 255], 0.12), 0.95)); rg.addColorStop(0.55, rgba(room.cur, 0.55)); rg.addColorStop(1, rgba(room.cur, 0.08));
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
    if (veil.a > 0.004) { g.fillStyle = rgba(veil.color, veil.a); g.fillRect(0, 0, W, H); }
    if (deck) {
      const { x, y, w, h } = deck;
      for (let i = 4; i >= 0; i--) { g.fillStyle = i ? '#3a2a1e' : '#5a3a2a'; g.strokeStyle = '#c9a25e'; g.lineWidth = 1.5; g.beginPath(); if (g.roundRect) g.roundRect(x - w / 2 + i * 2, y - h / 2 - i * 3, w, h, 8); else g.rect(x - w / 2 + i * 2, y - h / 2 - i * 3, w, h); g.fill(); g.stroke(); }
      g.strokeStyle = '#c9a25e88'; g.lineWidth = 1; g.strokeRect(x - w / 2 + 10, y - h / 2 + 10, w - 20, h - 20);
    }
    drawScene();
    for (const q of puffs) {
      const t = q.age / q.life, p = q.p;
      const a = Math.min(0.85, p.alpha * 1.35) * Math.min(1, t / 0.15) * Math.min(1, (1 - t) / 0.4);
      const s = p.size[0] + (p.size[1] - p.size[0]) * t;
      g.globalAlpha = a; g.drawImage(spr(q.color), q.x - s / 2, q.y - s / 2, s, s);
    }
    g.globalAlpha = 1;
    if (breath) {
      const { x, y, r } = breath;
      g.strokeStyle = 'rgba(240,230,207,0.42)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
      g.fillStyle = 'rgba(240,230,207,0.05)'; g.fill();
    }
  }

  function loop(t) {
    if (!running) return;
    const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016); last = t;
    frames.push(dt); if (frames.length > 90) frames.shift();
        const mean = frames.reduce((a, b) => a + b, 0) / frames.length;
    // under 50 fps for two seconds: first a coarser canvas, then fewer puffs (never under a third)
    if (frames.length >= 60 && mean > 1 / 50) {
      slowSince += dt;
      if (slowSince > 2) { if (!coarse) { coarse = true; resize(); } else if (cap > MAX / 3) cap = Math.round(cap * 0.7); slowSince = 0; frames.length = 0; }
    } else slowSince = 0;
    step(dt); draw();
    raf = requestAnimationFrame(loop);
  }

  return {
    start() { if (running) return; running = true; resize(); last = 0; raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize,
    get size() { return { W, H }; },
    // an emitter: where smoke comes out, of which air (params from data/rite.js) and colour; on/off
    // warm: seconds of smoke already in the air when it starts (an air is read at once, not after it has risen);
    // the puffs of other colours then leave quickly instead of lingering over the new one
    source(id, { x, y, p, color, on = true, warm = 0 }) {
      const e = emitters.get(id) || { acc: 0 }; const changed = e.color !== color;
      Object.assign(e, { x, y, p, color, on }); emitters.set(id, e);
      if (changed && warm > 0) {
        for (const q of puffs) if (q.color !== color) q.life = Math.min(q.life, q.age + 0.7);
        const keep = new Set(puffs.filter((q) => q.color !== color));
        for (let t = 0; t < warm; t += 0.05) step(0.05);
        for (const q of keep) if (puffs.includes(q)) q.life = Math.min(q.life, q.age + 0.6);
      }
    },
    off(id) { const e = emitters.get(id); if (e) e.on = false; },
    room(color) { room.want = hex(color); },
    roomNow(color) { room.want = room.cur = hex(color); },
    veil(color, a, now = false) { if (color) veil.color = hex(color); veil.want = a; if (now) veil.a = a; },
    breath(b) { breath = b; },
    deck(d) { deck = d; },
    scene(s) { scene = s ? { ...(scene || {}), ...s } : null; },
    // frames per second over the last frames, the puffs alive, the cap now (for the harness and the notes)
    stats() { const m = frames.length ? frames.reduce((a, b) => a + b, 0) / frames.length : 0; return { fps: m ? Math.round(1 / m) : 0, puffs: puffs.length, cap, dpr }; },
  };
}
