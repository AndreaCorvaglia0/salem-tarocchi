// A graph on a canvas: positions are given (never simulated here), one finger pans, two fingers pinch,
// the wheel zooms, a tap selects a node and shows its title in a bar with «Apri».
//   const g = graphView(host, { nodes, edges, onOpen, onSelect, center, labels })
//   nodes: [{ id, title, color, x, y, r, tipo }], edges: [[i, j, ...]]; g.setVisible(fn), g.select(i), g.fit(), g.destroy()
// Node radii r are in layout units, drawn at r * zoom (at least 2.6px). Labels: the
// selection and its neighbours first, then the biggest nodes, more of them the closer one zooms, and a label
// that would cover another is skipped (labels: 'auto' | 'all'). With onSelect the caller draws the card for
// the selection (and gets -1 when the background is tapped); without it a one-line bar with «Apri» is shown.
import { esc } from './md.js?v=1795009325372';

const INK = '#2a2134';

// Optional: rest (pairs [i, j]: the only links drawn while nothing is selected; default all of `edges`), caps
// ([x, y, text, 'title' | 'group'] drawn on the picture: titles always, groups once zoomed in), and per node
// label (text), ldy (label top, in layout units below the centre), lw (wrap width in px) and always (the label
// is drawn before the others at any zoom).
export function graphView(host, { nodes, edges, onOpen, onSelect = null, center = -1, labels = 'auto', typeLabel = () => '', rest = null, caps = [] }) {
  host.classList.add('gv');
  host.innerHTML = `<canvas></canvas><div class="gv-zoom"><button class="btn sq" data-z="in" aria-label="Avvicina">+</button><button class="btn sq" data-z="out" aria-label="Allontana">−</button><button class="btn sq" data-z="fit" aria-label="Tutto il grafo">⤢</button></div><div class="gv-info" hidden></div>`;
  const cv = host.querySelector('canvas'), g = cv.getContext('2d'), info = host.querySelector('.gv-info');
  const nb = nodes.map(() => []);
  edges.forEach(([a, b]) => { nb[a].push(b); nb[b].push(a); });
  const byR = nodes.map((n, i) => i).sort((a, b) => nodes[b].r - nodes[a].r || (nodes[a].id < nodes[b].id ? -1 : 1));
  const restList = rest || edges, restB = restList.map(([a, b]) => { const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y); return d < 70 ? 0 : d < 180 ? 1 : 2; });
  const widths = new Map(), always = nodes.map((n, i) => i).filter((i) => nodes[i].always);
  let vis = nodes.map(() => true), sel = -1, bottom = onSelect ? 8 : 50, s0 = 0, s = 1, tx = 0, ty = 0, W = 0, H = 0, dpr = 1, dirty = true, raf = 0, alive = true;

  const resize = () => {
    const r = host.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = `${W}px`; cv.style.height = `${H}px`;
    dirty = true;
  };
  const fit = (only) => {
    const list = (only || nodes.map((n, i) => i)).filter((i) => vis[i]);
    if (!list.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const i of list) { const n = nodes[i]; x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y); }
    if (!only) for (const c of caps) { x0 = Math.min(x0, c[0] - 60); x1 = Math.max(x1, c[0] + 60); y0 = Math.min(y0, c[1] - 6); y1 = Math.max(y1, c[1] + 6); }
    const pad = 24;
    const right = onSelect ? 22 : 0; // the zoom buttons sit on the right edge
    s = Math.min(4, Math.min((W - 2 * pad - right) / Math.max(1, x1 - x0), (H - 2 * pad - 14 - bottom) / Math.max(1, y1 - y0)));
    tx = (W - right) / 2 - s * (x0 + x1) / 2; ty = (H - bottom) / 2 - s * (y0 + y1) / 2;
    if (!s0) s0 = s;
    dirty = true;
  };
  const zoomAt = (f, cx, cy) => {
    const ns = Math.max(0.05, Math.min(8, s * f));
    tx = cx - (cx - tx) * (ns / s); ty = cy - (cy - ty) * (ns / s); s = ns; dirty = true;
  };

  const rad = (n) => { const z = s / (s0 || s); return Math.max(2.6, n.r * (s0 || s) * Math.pow(z, 0.65)); }; // true to scale at the first fit, growing slower than the zoom
  const draw = () => {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const near = new Set(sel >= 0 ? [sel, ...nb[sel]] : []);
    // edges: faint, and the selected node's in ink
    g.lineWidth = 1;
    // at rest only the `rest` links, the long ones fainter; with a selection they all step back
    const alphas = rest ? [0.55, 0.34, 0.2] : [edges.length > 500 ? 0.1 : edges.length > 250 ? 0.13 : 0.17];
    g.lineWidth = rest ? 1.1 : 1;
    for (let bk = 0; bk < alphas.length; bk++) {
      g.strokeStyle = sel >= 0 ? `rgba(42,33,52,${rest ? 0.08 : 0.05})` : `rgba(42,33,52,${alphas[bk]})`;
      g.beginPath();
      for (let k = 0; k < restList.length; k++) {
        if (rest && restB[k] !== bk) continue;
        const [a, b] = restList[k];
        if (!vis[a] || !vis[b]) continue;
        if (sel >= 0 && (a === sel || b === sel)) continue;
        g.moveTo(nodes[a].x * s + tx, nodes[a].y * s + ty); g.lineTo(nodes[b].x * s + tx, nodes[b].y * s + ty);
      }
      g.stroke();
    }
    if (sel >= 0) {
      g.strokeStyle = 'rgba(163,55,42,.75)'; g.lineWidth = 1.6; g.beginPath();
      for (const j of nb[sel]) if (vis[j]) { g.moveTo(nodes[sel].x * s + tx, nodes[sel].y * s + ty); g.lineTo(nodes[j].x * s + tx, nodes[j].y * s + ty); }
      g.stroke();
    }
    for (let i = 0; i < nodes.length; i++) {
      if (!vis[i]) continue;
      const n = nodes[i], x = n.x * s + tx, y = n.y * s + ty;
      if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
      const r = rad(n) * (i === sel ? 1.4 : i === center ? 1.4 : 1);
      g.globalAlpha = sel >= 0 && !near.has(i) ? 0.2 : 1;
      g.beginPath(); g.arc(x, y, r, 0, 6.2832);
      g.fillStyle = n.color; g.fill();
      g.lineWidth = i === sel || i === center ? 2.4 : n.tipo === 'legge' ? 2 : 0.8; g.strokeStyle = i === sel ? '#a3372a' : n.tipo === 'legge' ? '#d8b25a' : INK; g.stroke();
    }
    g.globalAlpha = 1;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const [cx, cy, text, kind] of caps) {
      const x = cx * s + tx, y = cy * s + ty;
      if (x < -200 || y < -20 || x > W + 200 || y > H + 20) continue;
      if (kind === 'group') { if (s / (s0 || 1) < 1.5) continue; g.font = 'italic 600 11px system-ui, sans-serif'; g.fillStyle = 'rgba(42,33,52,.7)'; g.fillText(text, x, y); }
      else { g.font = '700 10.5px system-ui, sans-serif'; g.fillStyle = 'rgba(106,98,86,.95)'; if ('letterSpacing' in g) g.letterSpacing = '1.2px'; g.fillText(text, x, y); if ('letterSpacing' in g) g.letterSpacing = '0px'; }
    }
    g.textBaseline = 'top';
    // labels: the selection and its neighbours first, then (zoomed in, or a small graph) the others by size;
    // a label that would cover one already drawn is skipped, so they never pile up
    const z = s / (s0 || 1), quota = labels === 'all' ? nodes.length : Math.round(8 * Math.pow(Math.max(z, 0.3), 2.2));
    g.font = '600 13px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'top'; g.lineJoin = 'round';
    const order = [];
    if (sel >= 0) order.push(sel, ...nb[sel].slice().sort((a, b) => nodes[b].r - nodes[a].r));
    if (center >= 0) order.push(center);
    if (sel < 0) { order.push(...always); let k = 0; for (const i of byR) { if (!vis[i]) continue; if (k++ >= quota) break; order.push(i); } }
    else if (labels === 'all') order.push(...byR);
    const boxes = [], done = new Set();
    for (const i of order) {
      if (done.has(i) || !vis[i]) continue;
      done.add(i);
      const n = nodes[i], x = n.x * s + tx, y = n.y * s + ty + (n.ldy != null ? n.ldy * s : rad(n) * (i === sel ? 1.4 : 1) + 3);
      if (x < -80 || y < -20 || x > W + 80 || y > H + 20) continue;
      const raw = n.label || n.title;
      g.font = n.lw ? '700 11px system-ui, sans-serif' : '600 13px system-ui, sans-serif';
      let lines = [raw.length > 26 && !n.lw ? `${raw.slice(0, 25)}…` : raw];
      if (n.lw) { // wrap to lw pixels, two lines at most
        const words = raw.split(' '), out = [''];
        for (const wd of words) { const t2 = out[out.length - 1] ? `${out[out.length - 1]} ${wd}` : wd; if (out[out.length - 1] && g.measureText(t2).width > n.lw && out.length < 2) out.push(wd); else out[out.length - 1] = t2; }
        lines = out;
      }
      const lh = n.lw ? 13 : 16;
      let w = 0;
      for (const t of lines) { const key = `${g.font}|${t}`; let m = widths.get(key); if (m == null) { m = g.measureText(t).width; widths.set(key, m); } w = Math.max(w, m); }
      const bx = [x - w / 2 - 2, y - 1, x + w / 2 + 2, y + lh * lines.length + 1];
      if (i !== sel && boxes.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) continue;
      boxes.push(bx);
      lines.forEach((t, li) => { g.lineWidth = 3.5; g.strokeStyle = 'rgba(248,240,220,.92)'; g.strokeText(t, x, y + li * lh); g.fillStyle = i === sel ? '#a3372a' : INK; g.fillText(t, x, y + li * lh); });
    }
  };
  const loop = () => { if (!alive) return; if (dirty) { dirty = false; draw(); } raf = requestAnimationFrame(loop); };

  const showInfo = () => {
    if (onSelect || sel < 0) { info.hidden = true; return; }
    const n = nodes[sel];
    info.hidden = false;
    info.innerHTML = `<button class="gv-open" type="button"><span class="dot" style="background:${n.color}"></span><span class="gv-t">${esc(n.title)}<small>${esc(typeLabel(n.tipo))} · ${nb[sel].length} collegamenti</small></span><span class="gv-go">Apri ›</span></button>`;
    info.querySelector('.gv-open').onclick = () => onOpen(n.id);
  };
  const select = (i, quiet) => {
    if (i >= 0 && !vis[i]) i = -1;
    sel = i; showInfo(); dirty = true;
    if (i >= 0) { // bring it into the part of the screen the card leaves free
      const y = nodes[i].y * s + ty, x = nodes[i].x * s + tx, free = H - (onSelect ? Math.max(bottom, H * 0.4) : bottom);
      if (y > free - 30 || y < 30 || x < 20 || x > W - 20) { tx += W / 2 - x; ty += free * 0.4 - y; }
    }
    if (!quiet) onSelect?.(i);
  };
  const hit = (cx, cy) => {
    // the nearest edge of a circle, within 18px (a finger is about 44px wide) or the circle itself
    let best = -1, bd = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      if (!vis[i]) continue;
      const dx = nodes[i].x * s + tx - cx, dy = nodes[i].y * s + ty - cy, d = Math.hypot(dx, dy) - rad(nodes[i]);
      if (d < bd) { bd = d; best = i; }
    }
    return bd <= 18 ? best : -1;
  };

  // gestures
  const pts = new Map();
  let start = null, pinch = null;
  const local = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', (e) => {
    cv.setPointerCapture?.(e.pointerId);
    pts.set(e.pointerId, local(e));
    if (pts.size === 1) start = { p: local(e), t: performance.now(), tx, ty, moved: false };
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s, mx: (a[0] + b[0]) / 2, my: (a[1] + b[1]) / 2, tx, ty }; if (start) start.moved = true; }
  });
  cv.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, local(e));
    if (pts.size >= 2 && pinch) {
      const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const ns = Math.max(0.05, Math.min(8, pinch.s * d / Math.max(1, pinch.d)));
      tx = mx - (pinch.mx - pinch.tx) * (ns / pinch.s); ty = my - (pinch.my - pinch.ty) * (ns / pinch.s); s = ns; dirty = true;
    } else if (start) {
      const [x, y] = local(e), dx = x - start.p[0], dy = y - start.p[1];
      if (Math.abs(dx) + Math.abs(dy) > 8) start.moved = true;
      if (start.moved) { tx = start.tx + dx; ty = start.ty + dy; dirty = true; }
    }
  });
  const up = (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 1) { const p = [...pts.values()][0]; start = { p, t: performance.now(), tx, ty, moved: true }; return; }
    if (pts.size === 0 && start) {
      if (!start.moved && e.type === 'pointerup') { const [x, y] = local(e); select(hit(x, y)); }
      start = null;
    }
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', (e) => { e.preventDefault(); const [x, y] = local(e); zoomAt(Math.exp(-e.deltaY * 0.0015), x, y); }, { passive: false });
  host.querySelector('.gv-zoom').addEventListener('click', (e) => {
    const z = e.target.closest('button')?.dataset.z;
    // with a node selected the buttons zoom on it and bring it to the middle
    const at = () => { if (sel >= 0) { tx += W / 2 - (nodes[sel].x * s + tx); ty += (H - bottom) / 2 - (nodes[sel].y * s + ty); } };
    if (z === 'in') { at(); zoomAt(1.5, W / 2, sel >= 0 ? (H - bottom) / 2 : H / 2); }
    if (z === 'out') { at(); zoomAt(1 / 1.5, W / 2, sel >= 0 ? (H - bottom) / 2 : H / 2); }
    if (z === 'fit') fit();
  });
  const ro = new ResizeObserver(() => { const keep = W > 1; const ow = W, oh = H; resize(); if (keep) { tx += (W - ow) / 2; ty += (H - oh) / 2; } else fit(); });
  ro.observe(host);
  resize(); fit();
  raf = requestAnimationFrame(loop);

  return {
    setVisible(fn) { vis = nodes.map((n, i) => !!fn(n, i)); if (sel >= 0 && !vis[sel]) select(-1); dirty = true; },
    select(i, quiet) { select(i, quiet); },
    setBottom(px) { bottom = px; },
    focus(i) { fit([i, ...nb[i]]); select(i, true); }, // the node and its neighbours fill the screen
    fit() { fit(); },
    destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); },
  };
}
