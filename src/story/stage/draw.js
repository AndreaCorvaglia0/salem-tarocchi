// Canvas helpers for the stage: Path2D cache, drawing a silhouette (soft edge, a faint second sheet
// behind it for depth), soft lights, offscreen canvases. Only touched in the browser.
const cache = new Map();
export const path2d = (d) => { let p = cache.get(d); if (!p) { p = new Path2D(d); cache.set(d, p); } return p; };
export const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return [c, c.getContext('2d')]; };

// draw a SIL entry (or a list of path data) at x, y (base), scale k (px per unit), mirrored if flip.
// o: { color, alpha, soft (px blur of the edge), ghost: { dx, dy, color, alpha } }
export function drawSil(g, sil, x, y, k, flip = false, o = {}) {
  const norm = (p) => (typeof p === 'string' ? { d: p } : p);
  const parts = (Array.isArray(sil) ? sil : sil.parts).map(norm);
  const holes = Array.isArray(sil) ? null : sil.holes;
  const paint = (color, alpha, blur, dx = 0, dy = 0) => {
    g.save();
    g.translate(x + dx, y + dy); g.scale(flip ? -k : k, k);
    g.fillStyle = color; g.globalAlpha = alpha;
    if (blur) { g.shadowColor = color; g.shadowBlur = blur; }
    for (const p of parts) {
      if (p.a != null) g.globalAlpha = alpha * p.a; else g.globalAlpha = alpha;
      g.fill(path2d(p.d), p.eo ? 'evenodd' : 'nonzero');
    }
    g.restore();
  };
  if (o.ghost) paint(o.ghost.color, o.ghost.alpha, o.soft || 0, o.ghost.dx, o.ghost.dy);
  if (holes) {
    // figures with cut-outs (a lantern's panes, the Judge's bands): draw apart, punch the holes, lay down
    const [c, cg] = canvas(g.canvas.width, g.canvas.height);
    const save = g; g = cg; paint(o.color || '#0c0604', 1, o.soft || 0); g = save;
    cg.save(); cg.globalCompositeOperation = 'destination-out'; cg.translate(x, y); cg.scale(flip ? -k : k, k);
    for (const d of holes) cg.fill(path2d(d));
    cg.restore();
    g.save(); g.globalAlpha = o.alpha ?? 1; g.drawImage(c, 0, 0); g.restore();
    return;
  }
  paint(o.color || '#0c0604', o.alpha ?? 1, o.soft || 0);
}

// a soft additive light
export function glow(g, x, y, r, rgb, a = 1, comp = 'lighter') {
  if (a <= 0.003 || r <= 0) return;
  g.save(); g.globalCompositeOperation = comp;
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(${rgb},${Math.min(1, a)})`); gr.addColorStop(0.4, `rgba(${rgb},${Math.min(1, a) * 0.32})`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
