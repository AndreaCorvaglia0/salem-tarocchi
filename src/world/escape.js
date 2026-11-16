// The escape (docs/DESIGN.md, "Le prove": «La fuga»): someone comes after her from behind, a place ahead
// glows, and she must reach it in time. Easy if she walks straight there, but it hurries her: the pursuer is
// slowed so that walking straight always makes it, and standing still for about HESITATE ms gets her caught.
//   world.escape({ from?, to, seconds? }) -> 'safe' | 'caught'   (service, src/world/index.js)
//   from: an anchor to start at (optional); to: an anchor on the same map, or 'auto' (a reachable tile
//   about AUTO_DIST steps away); seconds: the time limit (default: generous, from the distance).
// The pursuer is a constable (the patrols' sprite) that walks the shortest way to her. While the escape runs
// the patrols do not stop her, the music asks for the `exam` mood. A door taken on the way counts as safe.
// Pure planning (distances, speed, time): escape.plan.js.
import Phaser from 'phaser';
import { findPath } from './path.js';
import { plan, T } from './escape.plan.js';
import { makePerson, LOOKS } from './art/people.js';
import { Walker } from './scene/walker.js';
import { anchorOf } from './maps.js';
import { h, css } from '../core/dom.js';
import { call, has } from '../core/services.js';
import { CALM_MS } from './sight.js';

const BAND = `
.wx-band{position:fixed;left:50%;top:calc(132px + env(safe-area-inset-top));transform:translateX(-50%);z-index:30;display:flex;flex-direction:column;align-items:center;gap:6px;
  padding:8px 16px 10px;border-radius:12px;background:#1d1a24e6;border:1px solid #c44a3c;color:#f2ece0;font:600 17px system-ui,sans-serif;pointer-events:none;box-shadow:0 6px 18px #000a}
.wx-bar{width:180px;height:7px;border-radius:4px;background:#ffffff22;overflow:hidden}
.wx-bar i{display:block;height:100%;width:100%;background:#e0b95e;transform-origin:left;transition:transform .25s linear}
`;
const mood = (m) => { if (has('sound.mood')) Promise.resolve(call('sound.mood', m)).catch(() => {}); };
const sfx = (m) => { if (has('sound.play')) Promise.resolve(call('sound.play', m)).catch(() => {}); };

// The run, on the live World scene. Resolves 'safe' | 'caught'.
export function runEscape(scene, { to = 'auto', seconds = null } = {}) {
  const p = scene.player;
  const ok = (x, y) => scene.canStand(x, y) || (x === p.tx && y === p.ty);
  const a = to && to !== 'auto' ? anchorOf(to) : null;
  const pl = plan({ px: p.tx, py: p.ty, ok, target: a && a.map === scene.map.id ? scene.freeNear(a.x, a.y, true) : null, seconds });
  if (!pl) return Promise.resolve('safe');
  scene.escapeTarget = pl.target; // for the debug pages
  css('world-escape', BAND);
  makePerson(scene, 'ch-conestabile', LOOKS.conestabile);
  const chaser = new Walker(scene, 'ch-conestabile', pl.start[0], pl.start[1], 'down');
  chaser.faceToward(p.tx, p.ty);
  const [gx, gy] = pl.target;
  const glow = scene.add.image(gx * T + 8, gy * T + 10, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9006).setScale(1.2);
  const ring = scene.add.image(gx * T + 8, gy * T + 10, 'fx-glint').setDepth(9007);
  scene.tweens.add({ targets: glow, scale: 1.8, alpha: 0.6, duration: 600, yoyo: true, repeat: -1 });
  const bar = h('i'), band = h('div.wx-band', h('span', 'Scappa verso la luce!'), h('div.wx-bar', bar));
  document.body.append(band);
  const busy = scene.busy, calm = scene.calmUntil, guide = scene.registry.get('guide');
  scene.busy = 0; scene.calmUntil = Infinity;
  if (a) scene.guide.set(to);
  mood('exam'); sfx('suspicion');
  scene.cameras.main.shake(120, 0.003);
  const t0 = scene.time.now, limit = pl.seconds * 1000;
  return new Promise((resolve) => {
    let done = false;
    const finish = (r) => {
      if (done) return;
      done = true;
      scene.events.off('update', tick); scene.events.off('shutdown', away);
      band.remove();
      if (scene.sys.isActive()) {
        chaser.destroy(); glow.destroy(); ring.destroy();
        scene.busy = busy; scene.calmUntil = Math.max(calm === Infinity ? 0 : calm, scene.time.now + CALM_MS);
        scene.guide.set(guide || null);
        if (r === 'caught') { scene.cameras.main.shake(200, 0.006); sfx('caught'); }
      }
      if (has('sound.back')) Promise.resolve(call('sound.back')).catch(() => {});
      resolve(r);
    };
    const away = () => finish('safe'); // she went through a door: the scene is gone, and so is he
    const tick = (time) => {
      if (done) return;
      bar.style.transform = `scaleX(${Math.max(0, 1 - (time - t0) / limit)})`;
      if (Math.abs(p.tx - gx) + Math.abs(p.ty - gy) <= 1 && !p.moving) return finish('safe');
      if (Math.abs(chaser.tx - p.tx) + Math.abs(chaser.ty - p.ty) <= 1) return finish('caught');
      if (time - t0 > limit) return finish('caught');
      chaser.unstick();
      if (chaser.moving) return;
      const path = findPath(chaser.tx, chaser.ty, new Set([`${p.tx},${p.ty}`]), (x, y) => scene.canStand(x, y), { limit: 6000 });
      if (path && path.length > 1) chaser.step(path[0], (x, y) => scene.canStand(x, y), pl.stepMs);
      else if (path && path.length === 1) finish('caught');
    };
    scene.events.on('update', tick);
    scene.events.once('shutdown', away);
  });
}
