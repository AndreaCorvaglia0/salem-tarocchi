// Where the slips go on a sketch: touching their place (a pin far from its place reads as another
// place's), never over a name, a drawing or another pin. A slip's tap area is its 32 px paper padded to
// 44 x 46 (page.js CSS: inset -7px -6px); a place's is a 48 px circle (sketch.js .sk-hit). On a crowded
// sketch the two can overlap at the edges: routeTaps gives a tap there to the one whose drawing or paper
// is nearer, so a tap on the paper opens the slip and a tap on the drawing is the place's.
const R_DRAW = 14, R_NEXT = 25, R_TAP = 24, PAD_X = 6, PAD_Y = 7, STEP = 2, REACH = 34;

const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
// the distance from a point to a rectangle (0 inside)
const dist = (x, y, q) => Math.hypot(Math.max(q.l - x, 0, x - q.r), Math.max(q.t - y, 0, y - q.b));
const area = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));

// Pure: the top-left corner of a pin of size w x hh (its row of slips `row` px tall, at the top) for a
// place at (x, y), within REACH px of it. places: [{ x, y }] (the drawings, its own included); busy: rects
// it should not cover (names, «io», other pins). Returns { l, t, free } (free: covers nothing).
export function choosePin({ x, y, w, hh, row = hh, W, H, places = [], busy = [] }) {
  let best = null;
  for (let dy = -REACH - hh; dy <= REACH; dy += STEP) {
    for (let dx = -REACH - w; dx <= REACH; dx += STEP) {
      const l = Math.round(x + dx), t = Math.round(y + dy);
      const vis = { l, t, r: l + w, b: t + hh }, slips = { l, t, r: l + w, b: t + row };
      if (vis.l < 4 || vis.t < 4 || vis.r > W - 4 || vis.b > H - 4) continue;
      const near = dist(x, y, slips);
      if (near > REACH) continue;
      const tap = { l: l - PAD_X, t: t - PAD_Y, r: l + w + PAD_X, b: t + row + PAD_Y };
      const own = (p) => p.x === x && p.y === y;
      const onDrawing = places.some((p) => dist(p.x, p.y, vis) < (own(p) ? R_DRAW : p.r || R_DRAW));
      const covered = busy.reduce((n, b) => n + area(vis, b), 0);
      const shared = places.filter((p) => dist(p.x, p.y, tap) < R_TAP).length; // tap areas that touch
      // nearer to another place than to its own: it would read as that place's
      const other = places.some((p) => !own(p) && dist(p.x, p.y, slips) < near + 8);
      const cost = near + (onDrawing ? 2000 : 0) + covered * 5 + shared * 6 + (other ? 40 : 0) + (vis.t > y ? 5 : 0) + (vis.r < x ? 2 : 0);
      if (!best || cost < best.cost) best = { l, t, cost, free: !onDrawing && !covered };
    }
  }
  return best ? { l: best.l, t: best.t, free: best.free } : { l: Math.round(x + R_DRAW), t: Math.round(y - hh - 4), free: false };
}

// A tap where a slip's and a place's tap areas overlap goes to the nearer paper or drawing.
export function routeTaps(sk) {
  if (sk.dataset.routed) return;
  sk.dataset.routed = '1';
  sk.addEventListener('click', (e) => {
    if (!e.isTrusted) return;
    const x = e.clientX, y = e.clientY;
    const cands = [];
    for (const b of sk.querySelectorAll('.ms-pin .ms-slip')) {
      const r = b.getBoundingClientRect(), q = { l: r.left, t: r.top, r: r.right, b: r.bottom };
      if (x >= q.l - PAD_X && x <= q.r + PAD_X && y >= q.t - PAD_Y && y <= q.b + PAD_Y) cands.push([b, dist(x, y, q)]);
    }
    for (const b of sk.querySelectorAll('.sk-hit')) {
      const r = b.getBoundingClientRect(), cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2, d = Math.hypot(x - cx, y - cy);
      if (d <= r.width / 2) cands.push([b, Math.max(0, d - R_DRAW)]);
    }
    if (cands.length < 2) return;
    cands.sort((a, b) => a[1] - b[1]);
    const want = cands[0][0], got = e.target.closest?.('.ms-slip, .sk-hit');
    if (!got || got === want) return;
    e.stopPropagation(); e.preventDefault();
    want.click();
  }, true);
}

// next: the label of the red-circled place (its circle is bigger than a drawing)
export function placePins(sk, { next = null } = {}) {
  const box = sk.getBoundingClientRect();
  if (!box.width) return;
  const rel = (r) => ({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top });
  const busy = [...sk.querySelectorAll('.sk-lab, .sk-me')].map((e) => rel(e.getBoundingClientRect()));
  const places = [...sk.querySelectorAll('.sk-hit')].map((e) => ({ x: parseFloat(e.style.left), y: parseFloat(e.style.top), r: e.getAttribute('aria-label') === next ? R_NEXT : R_DRAW }));
  routeTaps(sk);
  const NS = 'http://www.w3.org/2000/svg';
  sk.querySelector('.ms-strings')?.remove();
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'ms-strings'); svg.setAttribute('width', box.width); svg.setAttribute('height', box.height);
  for (const el of sk.querySelectorAll('.ms-pin')) {
    const x = +el.dataset.x, y = +el.dataset.y, w = el.offsetWidth, hh = el.offsetHeight;
    const row = el.querySelector('.ms-row')?.offsetHeight || hh;
    const spot = choosePin({ x, y, w, hh, row, W: box.width, H: box.height, places, busy });
    el.style.left = `${spot.l}px`; el.style.top = `${spot.t}px`;
    el.dataset.free = spot.free ? '1' : '0';
    el.classList.add('ok');
    busy.push({ l: spot.l - 4, t: spot.t - 6, r: spot.l + w + 4, b: spot.t + hh + 4 });
    // the pencil line from the edge of the drawing (about 13 px from its centre) to the pin's row
    const q = { l: spot.l, t: spot.t, r: spot.l + w, b: spot.t + row };
    const px = Math.max(q.l, Math.min(x, q.r)), py = Math.max(q.t, Math.min(y, q.b));
    const d = Math.hypot(px - x, py - y);
    if (d > 20) {
      const ax = x + ((px - x) / d) * 13, ay = y + ((py - y) / d) * 13;
      const ln = document.createElementNS(NS, 'path');
      ln.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)} L${px.toFixed(1)} ${py.toFixed(1)}`);
      ln.setAttribute('stroke', '#6a6256'); ln.setAttribute('stroke-width', '1.5'); ln.setAttribute('stroke-dasharray', '3 3'); ln.setAttribute('fill', 'none'); ln.setAttribute('stroke-linecap', 'round');
      svg.append(ln);
    }
  }
  sk.append(svg);
}
