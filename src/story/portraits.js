// Small pixel busts for the dialogue box: 24x24, drawn in code, one per person of PEOPLE.
// portrait(id) -> a canvas (display it scaled with image-rendering: pixelated), or null (narra, lettrice).
const S = 24;
const mk = () => { const c = document.createElement('canvas'); c.width = S; c.height = S; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
const R = (g, x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
const E = (g, cx, cy, rx, ry, col) => { g.fillStyle = col; for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) g.fillRect(x, y, 1, 1); } };
const P = (g, pts, col) => { g.fillStyle = col; for (const [x, y] of pts) g.fillRect(x, y, 1, 1); };
const bg = (g, a, b) => { R(g, 0, 0, S, S, a); R(g, 0, 14, S, 10, b); for (let x = 0; x < S; x += 2) P(g, [[x, 14], [x + 1, 15]], a); };
// shoulders: a trapezoid of the bust, from y0 down, half-width growing from w0 to w1
const shoulders = (g, y0, w0, w1, col, shade) => {
  for (let y = y0; y < S; y++) { const w = Math.round(w0 + ((w1 - w0) * (y - y0)) / Math.max(1, S - 1 - y0)); R(g, 12 - w, y, w * 2, 1, col); }
  R(g, 12 - w1, S - 2, w1 * 2, 2, shade); // lower edge in shade
};
const eyes = (g, y, col = '#1a1420', gap = 2, white = false) => {
  if (white) { R(g, 12 - gap - 1, y, 2, 2, '#f4efe6'); R(g, 12 + gap - 1, y, 2, 2, '#f4efe6'); }
  R(g, 12 - gap - (white ? 0 : 1), y + (white ? 1 : 0), 1, white ? 1 : 2, col); R(g, 12 + gap - (white ? 1 : 0), y + (white ? 1 : 0), 1, white ? 1 : 2, col);
};
const brows = (g, y, col, angry = 0) => { R(g, 8, y + (angry ? 0 : 0), 3, 1, col); R(g, 13, y, 3, 1, col); if (angry) { P(g, [[10, y + 1], [13, y + 1]], col); } };
const neck = (g, y, skin) => R(g, 10, y, 4, 3, skin);

const ART = {
  malva(g) {
    bg(g, '#1c2a24', '#142019');
    shoulders(g, 16, 6, 11, '#3f7a4a', '#2d5a36');
    R(g, 3, 18, 3, 1, '#2d5a36'); R(g, 18, 20, 3, 1, '#2d5a36'); R(g, 11, 17, 2, 7, '#2d5a36'); // shawl folds
    R(g, 8, 16, 8, 2, '#6a4a34'); // dress collar
    neck(g, 14, '#d6a07e');
    E(g, 12, 6, 7, 4, '#5a4032'); E(g, 12, 2.5, 3, 2, '#5a4032'); P(g, [[8, 5], [16, 5], [10, 3], [14, 2]], '#a8a4a0'); // hair, bun, grey streaks
    E(g, 12, 10, 5.2, 5.4, '#e0b090'); E(g, 8.5, 11.5, 1.5, 1.2, '#d88a78'); E(g, 15.5, 11.5, 1.5, 1.2, '#d88a78'); // round face, ruddy cheeks
    R(g, 7, 7, 10, 2, '#5a4032'); // fringe
    eyes(g, 9); brows(g, 8, '#3a2a22', 1); R(g, 10, 13, 4, 1, '#8a4a40'); P(g, [[9, 13], [14, 13]], '#8a4a40');
  },
  ortica(g) {
    bg(g, '#1a2a1c', '#122016');
    shoulders(g, 17, 5, 10, '#5c8a3a', '#46702a');
    R(g, 9, 17, 6, 2, '#8ab04a'); R(g, 11, 19, 2, 5, '#46702a');
    neck(g, 14, '#d8a888');
    // wild grey hair: a big mass with spikes
    E(g, 12, 8, 8.5, 8, '#9a9aa6'); E(g, 12, 8, 6, 6, '#b8b8c4');
    P(g, [[3, 3], [2, 6], [4, 1], [7, 0], [11, 0], [15, 0], [19, 1], [21, 3], [22, 6], [2, 11], [21, 11], [3, 13], [20, 13], [5, 15], [19, 15]], '#9a9aa6');
    P(g, [[5, 2], [18, 2], [3, 9], [20, 9]], '#c8c8d2');
    E(g, 12, 10, 4.4, 5, '#e2b494');
    eyes(g, 9, '#1a1420', 2, true); brows(g, 7, '#7a7a86');
    R(g, 10, 13, 4, 1, '#7a3a34'); P(g, [[9, 12], [14, 12]], '#7a3a34'); // grin
  },
  edera(g) {
    bg(g, '#1c2230', '#121826');
    shoulders(g, 19, 3, 6, '#2d5a36', '#1f4226'); // tiny shoulders
    P(g, [[8, 20], [11, 21], [15, 20], [9, 22], [14, 22], [12, 19]], '#6aa04a'); // ivy leaves
    R(g, 11, 17, 2, 2, '#d8b498');
    E(g, 12, 13, 5, 5.5, '#f0eef2'); // white hair, big
    P(g, [[7, 17], [17, 17], [6, 14], [18, 14]], '#f0eef2');
    E(g, 12, 14.5, 3.2, 3.6, '#e8c4a8');
    R(g, 10, 13, 2, 1, '#3a2a30'); R(g, 13, 13, 2, 1, '#3a2a30'); // eyes nearly closed
    R(g, 11, 16, 2, 1, '#a86a62'); P(g, [[9, 12], [15, 12], [9, 15], [15, 15]], '#c4a088'); // wrinkles
    R(g, 9, 11, 2, 1, '#d8d6dc'); R(g, 13, 11, 2, 1, '#d8d6dc');
  },
  ginepra(g) {
    bg(g, '#1a2238', '#111a2c');
    shoulders(g, 16, 6, 11, '#3b5a9a', '#2a4276');
    R(g, 4, 17, 3, 1, '#5a7ac0'); R(g, 17, 19, 3, 1, '#5a7ac0'); R(g, 11, 18, 2, 6, '#2a4276'); P(g, [[8, 20], [16, 21]], '#c8d4f0');
    neck(g, 14, '#e8bc9c');
    R(g, 4, 8, 4, 11, '#b8442a'); R(g, 16, 8, 4, 11, '#b8442a'); E(g, 12, 7, 7.5, 6, '#b8442a'); P(g, [[5, 12], [18, 13], [6, 16]], '#d8643a');
    E(g, 12, 10.5, 4.6, 5.2, '#f0c8a8');
    R(g, 8, 6, 9, 2, '#b8442a'); P(g, [[8, 8], [9, 8], [15, 8], [16, 8], [16, 9]], '#b8442a'); // swept fringe
    eyes(g, 10, '#1a3a2a', 2, true); R(g, 11, 12, 2, 1, '#e0a080');
    P(g, [[9, 12], [14, 12], [10, 13], [13, 13], [15, 12]], '#c47a58'); // freckles
    R(g, 10, 14, 4, 1, '#c2584c'); P(g, [[9, 13], [14, 13]], '#c2584c');
  },
  tartufo(g) {
    bg(g, '#2c2842', '#1e1a30');
    E(g, 12, 15.5, 8.5, 7, '#14141c'); E(g, 12, 13.5, 7, 6, '#1c1c28');
    for (let i = 0; i < 6; i++) { R(g, 4 + i, 3 + i * 0.5 | 0, 1, 7 - i, '#14141c'); R(g, 19 - i, 3 + i * 0.5 | 0, 1, 7 - i, '#14141c'); }
    P(g, [[6, 5], [7, 6], [17, 6], [18, 5]], '#d88a98'); // inner ears
    R(g, 7, 10, 3, 3, '#ffd23a'); R(g, 14, 10, 3, 3, '#ffd23a'); R(g, 8, 10, 1, 3, '#14141c'); R(g, 15, 10, 1, 3, '#14141c'); P(g, [[7, 10], [14, 10]], '#fff2a0');
    R(g, 11, 14, 2, 1, '#d88a98'); P(g, [[10, 15], [13, 15]], '#14141c'); R(g, 11, 15, 2, 1, '#14141c');
    R(g, 1, 14, 6, 1, '#aaa8c0'); R(g, 0, 16, 6, 1, '#aaa8c0'); R(g, 17, 14, 6, 1, '#aaa8c0'); R(g, 18, 16, 6, 1, '#aaa8c0'); // whiskers
  },
  giudice(g) {
    bg(g, '#22222c', '#16161e');
    shoulders(g, 16, 6, 11, '#16161c', '#0c0c10');
    R(g, 9, 16, 6, 3, '#f2f0ea'); R(g, 10, 19, 2, 2, '#f2f0ea'); R(g, 12, 19, 2, 2, '#d8d6d0'); R(g, 11, 16, 2, 5, '#16161c'); R(g, 11, 17, 2, 4, '#16161c'); // white collar bands
    neck(g, 14, '#dcc0aa');
    E(g, 12, 7, 6, 4, '#8a8a92'); R(g, 6, 7, 2, 4, '#8a8a92'); R(g, 16, 7, 2, 4, '#8a8a92');
    E(g, 12, 10.5, 4.6, 5.2, '#ecd2c0');
    R(g, 7, 7, 10, 2, '#8a8a92');
    eyes(g, 10, '#1a1a24'); brows(g, 8, '#6a6a72'); R(g, 10, 13, 4, 1, '#a07a70'); R(g, 11, 12, 2, 1, '#d4b4a0');
  },
  conestabile(g) {
    bg(g, '#2a2018', '#1c150f');
    shoulders(g, 16, 6, 11, '#6a4528', '#4a2f1a');
    R(g, 11, 17, 2, 7, '#4a2f1a'); P(g, [[10, 19], [10, 22], [14, 19], [14, 22]], '#d8b050');
    neck(g, 14, '#d4a080');
    E(g, 12, 10.5, 4.6, 5, '#dcaa88');
    R(g, 4, 6, 16, 2, '#2a1c12'); R(g, 7, 1, 10, 6, '#3a2a1a'); R(g, 7, 5, 10, 1, '#d8b050'); R(g, 8, 8, 8, 1, '#2a1c12'); // hat with brim
    eyes(g, 10, '#1a1410'); brows(g, 9, '#2a1c12', 1);
    R(g, 8, 13, 8, 1, '#3a2a1c'); P(g, [[7, 14], [16, 14]], '#3a2a1c'); // moustache
    E(g, 21, 16, 3, 3, '#7a5a1a'); R(g, 20, 14, 3, 4, '#ffd060'); R(g, 20, 13, 3, 1, '#2a1c12'); R(g, 20, 18, 3, 1, '#2a1c12'); P(g, [[21, 15]], '#fff4c0'); // lantern
  },
  afflitta(g) {
    bg(g, '#26262e', '#1a1a22');
    shoulders(g, 17, 6, 10, '#4a4048', '#352e36');
    R(g, 8, 17, 8, 2, '#b8b0a8');
    neck(g, 14, '#e0cdbd');
    E(g, 12, 8.5, 7, 7, '#ece8e0'); R(g, 5, 9, 3, 9, '#ece8e0'); R(g, 16, 9, 3, 9, '#ece8e0'); // bonnet with ties
    E(g, 12, 11, 4.2, 4.8, '#efe0d0');
    eyes(g, 10, '#1a1a24', 2, true); R(g, 8, 12, 2, 1, '#cdb4b0'); R(g, 14, 12, 2, 1, '#cdb4b0'); R(g, 11, 14, 2, 1, '#b4857c'); brows(g, 8, '#a89888');
    P(g, [[5, 18], [18, 18]], '#d0ccc4');
  },
  bottegaio(g) {
    bg(g, '#2c2418', '#1e180f');
    shoulders(g, 16, 6, 11, '#8a6a42', '#6a4e2e');
    R(g, 7, 18, 10, 6, '#d8c8a0'); R(g, 7, 18, 10, 1, '#a89870'); R(g, 11, 16, 2, 2, '#d8c8a0'); // apron
    neck(g, 14, '#d8a888');
    E(g, 12, 9.5, 5.4, 5.6, '#e0b090'); P(g, [[7, 7], [17, 7]], '#6a4a34');
    E(g, 12, 13.5, 3.5, 2, '#d49a7a');
    R(g, 7, 9, 4, 3, '#bba878'); R(g, 13, 9, 4, 3, '#bba878'); R(g, 8, 10, 2, 1, '#14110a'); R(g, 14, 10, 2, 1, '#14110a'); R(g, 11, 10, 2, 1, '#bba878'); // spectacles
    R(g, 10, 14, 4, 1, '#8a4a40'); R(g, 11, 12, 2, 1, '#c88868');
  },
  tu(g) {
    bg(g, '#1a1a2c', '#101020');
    shoulders(g, 15, 6, 11, '#3a3a60', '#26264a');
    R(g, 11, 16, 1, 8, '#26264a'); R(g, 5, 20, 3, 1, '#26264a'); R(g, 17, 18, 3, 1, '#26264a'); R(g, 6, 16, 2, 1, '#5a5a90'); R(g, 16, 16, 2, 1, '#5a5a90');
    E(g, 12, 9, 6.5, 7, '#4a4a78'); E(g, 12, 9.5, 5, 5.5, '#34345a'); R(g, 11, 4, 1, 10, '#26264a'); // a hood seen from behind
    P(g, [[9, 15], [15, 15], [12, 16]], '#4a3a30'); // hair under the hood
    R(g, 8, 3, 3, 1, '#3c3c64');
  },
};
ART.narra = null; ART.lettrice = null;

export const hasPortrait = (id) => !!ART[id];
export function portrait(id) {
  const fn = ART[id];
  if (!fn) return null;
  const [c, g] = mk();
  fn(g);
  return c;
}
