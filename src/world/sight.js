// What a constable (or an Afflicted) sees: a cone in front of the lantern, cut by walls; in tall
// grass only up close. Pure: the scene (scene/patrol.js) and the patrol simulation test use it.
// Positions in pixels; tiles are 16 px.
export const T = 16;
// after a stop (an Exam) nobody stops her again for a while: never twice within a minute
export const CALM_MS = 60000;
// range and range in tall grass (tiles), half angle (rad), notice: ms she must stay in the light
// before he notices her (it fades twice as fast when she leaves it)
export const SEE = { range: 3.6, grass: 1.5, half: 0.52, notice: 700 };
export const ANG = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
const STEP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// the eye: lantern height, a little in front. (sx, sy): the sprite's feet.
export const eyeAt = (sx, sy, dir) => [sx + STEP[dir][0] * 4, sy - 8 + STEP[dir][1] * 3];

// Is the point (px, py) in sight from an eye looking `dir`? blocked(tx, ty): a tile stops sight.
export function inSight(ex, ey, dir, px, py, inGrass, blocked) {
  const dx = px - ex, dy = py - ey, dist = Math.hypot(dx, dy) / T;
  if (dist > (inGrass ? SEE.grass : SEE.range)) return false;
  if (dist > 0.9) {
    let da = Math.atan2(dy, dx) - ANG[dir];
    da = Math.atan2(Math.sin(da), Math.cos(da));
    if (Math.abs(da) > SEE.half) return false;
  }
  const n = Math.ceil(dist * 4);
  for (let k = 1; k < n; k++) { const x = ex + (dx * k) / n, y = ey + (dy * k) / n; if (blocked(Math.floor(x / T), Math.floor(y / T))) return false; }
  return true;
}
