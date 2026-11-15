// The witches, drawn in code: slim, upright, graceful figures (a girl-power story: they are all
// beautiful, each in her way, never hunched). One painter; the looks in people.js decide hair,
// hat, cloak or shawl, dress and build. Frames are 16x32; the figure stands on the bottom row.
// view: 'down' | 'up' | 'side' (facing left). step: 0 stand, 1 and 2 the two steps.
// extra: 'blink' (eyes closed), 'breath' (the hem and the hair move a little; Ortica hops).
import { INK } from './palette.js';
import { mix } from './px.js';

// Row tables from the shoulders (r = 0) to the hem: [left, right] columns.
const CLOAK = [[5, 10], [4, 11], [4, 11], [4, 11], [4, 11], [4, 11], [4, 11], [3, 12], [3, 12], [3, 12], [3, 12], [3, 12], [2, 13], [2, 13], [2, 13], [2, 13]];
const DRESS = [[7, 8], [6, 9], [6, 9], [6, 9], [6, 9], [7, 8], [7, 8], [6, 9], [6, 9], [6, 9], [6, 9], [6, 9], [5, 10], [5, 10], [5, 10], [5, 10]];
const SKIRT = [[5, 10], [4, 11], [4, 11], [5, 10], [5, 10], [5, 10], [4, 11], [4, 11], [4, 11], [3, 12], [3, 12], [3, 12], [3, 12], [2, 13], [2, 13], [2, 13]]; // a dress with no cloak (Malva)
// side view, facing left: front edge and back edge
const SIDE = [[6, 9], [5, 10], [5, 10], [5, 10], [6, 9], [5, 10], [5, 10], [5, 11], [4, 11], [4, 11], [4, 12], [4, 12], [4, 12], [3, 13], [3, 13], [3, 13]];
const WAIST = 4;

export function paintWitch(ctx, ox, L, view, step, pose, extra) {
  const P = (x, y, c) => { if (x < 0 || x > 15 || y < 0 || y > 31 || !c) return; ctx.fillStyle = c; ctx.fillRect(ox + x, y, 1, 1); };
  const H = (y, x0, x1, c) => { for (let x = x0; x <= x1; x++) P(x, y, c); };
  const [skin, skinS] = L.skin;
  const [h0, h1, h2] = L.hair; // shadow, base, light
  const [k0, k1, k2] = L.cloak; // cloak, or shawl for Malva
  const [d0, d1, d2] = L.dress;
  const lining = L.lining || d2;
  const hop = extra === 'breath' && L.lively ? -1 : 0;
  const bob = (step ? 1 : 0) + hop;
  const hy = (L.tall ? 7 : 8) + bob; // top of the head
  const flutter = extra === 'breath' && !L.lively ? 1 : 0;
  const lip = mix(skin, '#b04a62', 0.55), blush = mix(skin, '#e07a8a', 0.4);
  const eye = extra === 'blink' ? skinS : '#24141e';
  const shoe = L.barefoot ? skinS : '#120e16';
  const top = 16 + bob, hem = L.gown ? 31 : 30, rows = hem - top + 1;
  const row = (tab, r) => tab[Math.min(tab.length - 1, Math.round((r * (tab.length - 1)) / Math.max(1, rows - 1)))];
  const sw = (y) => (step && y >= hem - 2 ? (step === 1 ? -1 : 1) : flutter && y >= hem - 1 ? 1 : 0); // the hem swings

  // ---------- feet (under the hem)
  if (view === 'side') {
    const f = step === 1 ? [2, 10] : step === 2 ? [6, 7] : [5, 8];
    if (!L.gown || step) { H(31, f[0], f[0] + 2, shoe); H(31, f[1], f[1] + 1, mix(shoe, '#000000', 0.3)); }
  } else if (!L.gown || step) {
    if (step !== 2) H(31, 5, 6, shoe);
    if (step !== 1) H(31, 9, 10, shoe);
  }

  // ---------- long hair behind (side view)
  const hairLen = { long: 12, curls: 9, wild: 11 }[L.hairStyle] || 0;
  if (view === 'side' && hairLen) {
    for (let y = hy + 2; y < hy + 2 + hairLen; y++) {
      const t = (y - hy - 2) / hairLen, x1 = 10 + (t > 0.55 ? (step ? 1 : flutter) : 0) + (L.hairStyle === 'wild' ? 1 : 0);
      H(y, 8, x1, h1); P(9, y, y % 3 ? h1 : h2); P(x1, y, h0); P(x1 + 1, y, INK);
      if (L.hairStyle === 'curls' && y % 2) P(x1 + 1, y, h1), P(x1 + 2, y, INK);
    }
    H(hy + 2 + hairLen, 9, 10, INK);
  }

  // ---------- body
  const shawl = !!L.shawl;
  if (view !== 'side') {
    for (let r = 0; r < rows; r++) {
      const y = top + r, s = sw(y), last = y === hem;
      const outer = shawl ? row(SKIRT, r) : row(CLOAK, r);
      let [a, b] = outer; a += s; b += s;
      if (L.strong && r <= 6) { a -= 1; b += 1; }
      // the outer shape: cloak (or the skirt under a shawl), lit from the left
      const c0 = shawl ? d0 : k0, c1 = shawl ? d1 : k1, c2 = shawl ? d2 : k2;
      for (let x = a; x <= b; x++) P(x, y, last || x === a || x === b ? INK : x === a + 1 ? c2 : x === b - 1 ? c0 : c1);
      if (r === 0) { P(a, y, null); P(b, y, null); }
      if (last) continue;
      if (view === 'down' && !shawl && L.cloak) { // the cloak is open in front: the dress, edged with the lining
        const [da, db] = row(DRESS, r).map((v) => v + s);
        for (let x = da; x <= db; x++) P(x, y, x === da ? d2 : x === db ? d0 : d1);
        if (r > WAIST + 1) { P(da - 1, y, lining); P(db + 1, y, mix(lining, '#000000', 0.35)); }
      }
      if (shawl && r <= WAIST + 2) { // a shawl over the shoulders, crossed over the bodice
        const [sa, sb] = [a, b];
        for (let x = sa; x <= sb; x++) {
          const inV = view === 'down' && Math.abs(x - 7.5) < 3 - r * 0.6 + 0.4 && r < 3;
          if (inV) { if (r === 0 || r === 1) P(x, y, x === 7 || x === 8 ? skin : d1); continue; }
          if (r > WAIST && Math.abs(x - 7.5) < 2) continue;
          P(x, y, x === sa || x === sb ? INK : x === sa + 1 ? k2 : x === sb - 1 ? k0 : k1);
        }
        if (r === WAIST + 2) for (let x = sa + 1; x < sb; x += 2) P(x, y + 1, k0); // fringe
      }
      if (view === 'up' && r > WAIST + 2 && (r + 1) % 4 === 0) P(8 + s, y, c0); // a fold down the back
      if (L.trim && r > 1 && r % 3 === 0) { P(a + 1, y, L.trim); P(b - 1, y, L.trim); }
    }
    if (view === 'down') {
      const waist = top + WAIST;
      if (!shawl) { P(7, top, skin); P(8, top, skin); P(7, top + 1, skinS); P(8, top + 1, d2); }
      const [wa, wb] = shawl ? [6, 9] : row(DRESS, WAIST);
      H(waist, wa, wb, L.sash || d0);
      if (L.jewel && !shawl) P(8, top + 1, L.jewel);
      if (L.jewel && shawl) P(7, top + 2, L.jewel);
      // hands, folded in front at the waist
      const hs = step === 1 ? -1 : step === 2 ? 1 : 0;
      if (!shawl) { P(5, waist + 1 + hs, skin); P(10, waist + 1 - hs, skin); }
      else { P(6, waist + 1, skin); P(9, waist + 1, skin); P(7, waist + 1, skinS); }
    }
  } else { // side, facing left
    const trail = step ? 1 : flutter;
    for (let r = 0; r < rows; r++) {
      const y = top + r, last = y === hem;
      let [a, b] = row(SIDE, r);
      if (r > WAIST) b += trail;
      if (step === 1 && y >= hem - 2) a -= 1;
      if (L.strong && r < WAIST) b += 1;
      const split = shawl ? (r <= WAIST + 2 ? a + 1 : 99) : 8; // where the cloak starts (behind)
      for (let x = a; x <= b; x++) {
        let c = x === a || x === b || last ? INK : x === a + 1 ? d2 : d1;
        if (!shawl && x >= split && x < b) c = x === split ? k2 : x === b - 1 ? k0 : k1;
        if (shawl && x >= split && x < b && !last) c = x === b - 1 ? k0 : x === split ? k2 : k1;
        P(x, y, c);
      }
      if (L.trim && !shawl && r > 1 && r % 3 === 0) P(split, y, L.trim);
    }
    H(top + WAIST, 6, 7, L.sash || d0);
    P(6, top, skinS); P(7, top, skin);
    if (pose) { // an arm raised, pointing ahead
      H(top + 1, 1, 6, shawl ? k1 : d1); H(top, 2, 5, INK); H(top + 2, 1, 5, INK); P(0, top + 1, skin);
    } else {
      const ax = 7 + (step === 1 ? -2 : step === 2 ? 1 : 0);
      P(ax, top + WAIST + 1, shawl ? k1 : d1); P(ax, top + WAIST + 2, skin);
    }
  }
  if (view === 'up') { P(7, top - 1, skinS); P(8, top - 1, skinS); } // the nape

  // ---------- head
  if (view !== 'side') {
    H(hy - 1, 6, 9, INK); H(hy + 7, 6, 9, INK);
    for (let y = hy; y <= hy + 6; y++) { const e = y === hy || y === hy + 6 ? 5 : 4; P(e, y, INK); P(15 - e, y, INK); }
    for (let y = hy; y <= hy + 6; y++) H(y, y === hy || y === hy + 6 ? 6 : 5, y === hy || y === hy + 6 ? 9 : 10, skin);
    H(hy + 6, 6, 9, skinS);
    P(7, hy + 7, skinS); P(8, hy + 7, skinS); // the neck
    if (view === 'down') {
      P(6, hy + 3, eye); P(9, hy + 3, eye);
      if (extra !== 'blink') { P(6, hy + 2, mix(h0, INK, 0.4)); P(9, hy + 2, mix(h0, INK, 0.4)); }
      P(5, hy + 4, blush); P(10, hy + 4, blush);
      P(7, hy + 5, lip); P(8, hy + 5, mix(lip, skin, 0.45));
    }
  } else {
    H(hy - 1, 5, 9, INK); H(hy + 7, 5, 8, INK);
    for (let y = hy; y <= hy + 6; y++) { P(y === hy + 3 || y === hy + 4 ? 3 : 4, y, INK); P(11, y, INK); }
    for (let y = hy; y <= hy + 6; y++) H(y, 5, 10, skin);
    P(4, hy + 3, skin); P(4, hy + 4, skin); // the nose
    H(hy + 6, 5, 8, skinS);
    P(6, hy + 3, eye); if (extra !== 'blink') P(6, hy + 2, mix(h0, INK, 0.4));
    P(5, hy + 5, lip); P(6, hy + 4, blush);
  }

  hair(P, H, L, view, hy, step, flutter);
  if (L.earring && view === 'side') P(8, hy + 5, L.earring);
  if (L.hat === 'witch') witchHat(P, H, L, view, hy);
}

function hair(P, H, L, view, hy, step, flutter) {
  const [h0, h1, h2] = L.hair, hs = L.hairStyle, sway = step ? 1 : flutter;
  // the hair over the crown and the back of the head
  const cap = (y0) => {
    if (view === 'side') {
      H(y0, 6, 9, INK); P(5, y0 + 1, INK); P(10, y0 + 1, INK);
      for (let y = y0 + 1; y <= hy + 1; y++) H(y, 5, 10, y === y0 + 1 ? h2 : h1);
      for (let y = hy + 2; y <= hy + 5; y++) H(y, 8, 10, y === hy + 2 ? h0 : h1);
      P(7, hy + 2, h1); P(9, hy + 3, h2);
      return;
    }
    H(y0, 6, 9, INK); P(5, y0 + 1, INK); P(10, y0 + 1, INK);
    for (let y = y0 + 1; y <= hy + 1; y++) H(y, 5, 10, h1);
    H(y0 + 1, 6, 8, h2);
    if (view === 'up') { for (let y = hy + 2; y <= hy + 5; y++) { H(y, 5, 10, h1); P(6, y, y < hy + 4 ? h2 : h1); P(5, y, h0); P(10, y, h0); } H(hy + 6, 6, 9, h0); }
  };
  // a sheet of hair down the back, in strands
  const backSheet = (y0, y1, a, b) => {
    for (let y = y0; y <= y1; y++) {
      const tip = y === y1, nar = tip || y < y0 + 2 ? 1 : 0, aa = a + nar, bb = b - nar;
      P(aa - 1, y, INK); P(bb + 1, y, INK);
      for (let x = aa; x <= bb; x++) P(x, y, x === aa + 1 && y % 5 !== 4 ? h2 : x === bb || y >= y1 - 1 ? h0 : h1);
      if ((y - y0) % 4 === 2) P(Math.round((aa + bb) / 2) + 1, y, h0);
    }
    H(y1 + 1, a + 1, b - 1, INK);
  };
  if (hs === 'long') {
    cap(hy - 1);
    if (view === 'down') {
      H(hy + 2, 5, 7, h1); P(8, hy + 2, h0); // a side-swept fringe
      for (let y = hy + 1; y <= hy + 12; y++) { // two long locks over the shoulders
        const s = y > hy + 9 ? sway : 0;
        P(4, y, y % 4 === 1 ? h2 : h1); P(11, y, h1); P(3, y, INK); P(12, y, INK);
        if (y > hy + 6) { P(5 + s, y, h0); P(10 + s, y, h0); P(4 + s, y, h1); P(11 + s, y, h1); }
      }
      H(hy + 13, 4, 5, INK); H(hy + 13, 10, 11, INK);
    }
    if (view === 'up') backSheet(hy + 1, hy + 12, 4, 11);
  } else if (hs === 'curls') {
    cap(hy - 2);
    const curl = (x, y) => { P(x, y, h2); P(x + 1, y, h1); P(x, y + 1, h1); P(x + 1, y + 1, h1); P(x + 2, y + 1, h0); P(x + 1, y + 2, h0); };
    if (view === 'down') {
      H(hy + 1, 5, 10, h1); H(hy + 2, 5, 6, h1); P(9, hy + 2, h1); P(10, hy + 2, h1); P(7, hy + 1, h2);
      for (let y = hy - 1; y <= hy + 9; y++) { H(y, 3, 4, h1); H(y, 11, 12, h1); }
      for (let y = hy - 1; y <= hy + 8; y += 3) { curl(2 + (y % 2), y); curl(10 + (y % 2), y + 1); }
      for (let y = hy; y <= hy + 9; y += 2) { P(2, y, INK); P(13, y + 1, INK); }
      for (const x of [4, 6, 8, 10]) P(x, hy - 2, h1);
      H(hy - 3, 5, 10, INK); P(3, hy + 10, INK); P(4, hy + 10, h0); P(12, hy + 10, INK); P(11, hy + 10, h0);
    }
    if (view === 'up') {
      for (let y = hy - 2; y <= hy + 9; y++) { const n = y < hy || y > hy + 7 ? 1 : 0; H(y, 3 + n, 12 - n, h1); P(2 + n, y, INK); P(13 - n, y, INK); }
      for (let y = hy - 1; y <= hy + 7; y += 3) for (let x = 4 + ((y - hy) % 2 ? 1 : 0); x <= 10; x += 3) curl(x, y);
      H(hy + 10, 4, 11, INK); H(hy - 3, 5, 10, INK);
    }
    if (view === 'side') { for (const [x, y] of [[5, hy - 2], [8, hy - 3], [4, hy], [11, hy]]) { P(x, y, h1); P(x, y - 1, INK); } }
  } else if (hs === 'crown') {
    // pinned up, a braid laid round the head like a crown
    cap(hy - 1);
    if (view === 'down') { P(5, hy + 2, h1); P(10, hy + 2, h1); P(5, hy + 3, h0); P(10, hy + 3, h0); P(6, hy + 1, h2); }
    const by = hy - 1;
    H(by - 1, 5, 10, INK); P(4, by, INK); P(11, by, INK);
    for (let x = 5; x <= 10; x++) P(x, by, x % 2 ? h2 : mix(h1, h2, 0.4));
    if (view === 'side') { for (let x = 5; x <= 10; x++) P(x, by, x % 2 ? h2 : h0); P(10, hy + 2, h2); P(10, hy + 3, h0); }
    if (view === 'up') { for (let x = 5; x <= 10; x++) P(x, hy + 3, x % 2 ? h2 : h0); for (let x = 6; x <= 9; x++) P(x, hy + 4, x % 2 ? h0 : h2); }
    if (L.streak) P(view === 'side' ? 6 : 6, hy, L.streak), P(view === 'side' ? 7 : 7, hy + 1, L.streak);
  } else if (hs === 'wild') {
    // a wild mane, wider than her shoulders, with a leaf in it
    cap(hy - 2);
    const spikes = view === 'side' ? [[4, hy - 2], [6, hy - 3], [9, hy - 3], [11, hy - 1], [12, hy + 2], [13, hy + 5], [12, hy + 9]] : [[3, hy - 2], [6, hy - 3], [9, hy - 3], [12, hy - 2], [2, hy + 1], [13, hy + 1], [2, hy + 5], [13, hy + 5], [2, hy + 9], [13, hy + 9]];
    for (const [x, y] of spikes) { P(x, y, h1); P(x, y + 1, h0); P(x + (x < 8 ? -1 : 1), y, INK); P(x, y - 1, INK); }
    if (view === 'down') {
      H(hy + 1, 5, 10, h1); H(hy + 2, 5, 6, h1); P(10, hy + 2, h1); P(7, hy + 2, h0); P(8, hy + 1, h2);
      for (let y = hy - 1; y <= hy + 10; y++) { H(y, 3, 4, y % 3 ? h1 : h2); H(y, 11, 12, y % 3 === 1 ? h2 : h1); if (y > hy + 7) { P(5, y, h0); P(10, y, h0); } }
      for (let y = hy + 1; y <= hy + 11; y += 2) { P(2, y, INK); P(13, y, INK); }
      H(hy + 11, 3, 4, INK); H(hy + 11, 11, 12, INK);
    }
    if (view === 'up') { backSheet(hy - 1, hy + 11, 3, 12); for (let y = hy; y <= hy + 10; y += 3) { P(2, y, h1); P(13, y + 1, h1); } }
    if (L.leaf) { const lx = view === 'side' ? 9 : 11; P(lx, hy - 1, L.leaf); P(lx + 1, hy - 2, L.leaf); P(lx + 1, hy - 1, mix(L.leaf, '#000000', 0.3)); }
  } else if (hs === 'bun') {
    // sleek silver hair swept up from the face into a high bun, a gold pin through it
    cap(hy - 1);
    if (view === 'down') {
      for (let y = hy + 1; y <= hy + 4; y++) { P(5, y, y === hy + 1 ? h2 : h1); P(10, y, h0); }
      P(4, hy + 2, h1); P(11, hy + 2, h1); P(4, hy + 3, INK); P(11, hy + 3, INK); P(6, hy + 1, h2); P(8, hy + 1, h0);
    }
    const bx = view === 'side' ? 8 : 7, cy = hy - 3;
    H(cy - 2, bx, bx + 1, INK);
    for (let y = cy - 1; y <= cy + 1; y++) { const w = y === cy ? 2 : 1; H(y, bx - w + 1, bx + w, y === cy - 1 ? h2 : h1); P(bx - w, y, INK); P(bx + w + 1, y, INK); }
    P(bx, cy, h2); P(bx + 1, cy + 1, h0);
    if (L.pin) { P(bx + 3, cy - 1, L.pin); P(bx - 2, cy + 1, L.pin); }
    if (view === 'side') { P(10, hy + 4, h1); P(10, hy + 5, h0); }
  }
}

function witchHat(P, H, L, view, hy) {
  const [w0, w1, w2] = L.hatCol;
  const by = hy - 1; // the brim
  if (view === 'side') { H(by + 1, 2, 12, INK); H(by, 1, 13, INK); H(by, 2, 12, w0); H(by - 1, 4, 10, INK); P(2, by, w1); P(3, by, w1); }
  else { H(by + 1, 3, 12, INK); H(by, 1, 14, INK); H(by, 2, 13, w0); H(by - 1, 3, 12, INK); H(by, 3, 6, w1); }
  // the crown: a cone that bends back a little at the tip
  const rows = [[5, 10], [5, 10], [6, 10], [6, 9], [7, 9], [7, 9], [8, 10], [9, 10], [10, 11]];
  rows.forEach(([a, b], i) => {
    const y = by - 1 - i;
    if (y < 0) return;
    P(a - 1, y, INK); P(b + 1, y, INK);
    for (let x = a; x <= b; x++) P(x, y, i < 2 ? (i === 0 ? L.band : mix(L.band, w0, 0.35)) : x === a ? w2 : x === b ? w0 : w1);
  });
  if (L.buckle && view !== 'up') P(view === 'side' ? 6 : 7, by - 1, L.buckle);
}
