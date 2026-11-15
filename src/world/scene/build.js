// Draws a parsed map into the scene: the painted ground, trees and fences, tall grass, buildings
// and props with their lit windows, flames and chimney smoke, the doors that are not part of a
// building. Returns the static lights (for the night layer) and the grass tufts (they sway).
import Phaser from 'phaser';
import { KINDS } from '../tiles.js';
import { paintGround } from '../art/ground.js';
import { paintBlock } from '../art/blocks.js';
import { makeNature } from '../art/nature.js';
import { INSIDE } from '../art/inside.js';
import { addTex, hash } from '../art/px.js';
import { makeWild, archArt } from '../art/wild.js';

const T = 16, ADD = Phaser.BlendModes.ADD;

export function buildMap(scene, map, season = map.season) {
  const lights = [], grass = [];
  const gk = `ground-${map.id}-${season}`;
  if (!scene.textures.exists(gk)) addTex(scene, gk, paintGround(map, season));
  scene.add.image(0, 0, gk).setOrigin(0).setDepth(0);
  makeNature(scene, season); makeWild(scene);
  const bells = [], perches = [];
  const k = (n) => `${n}-${season}`;

  // single-tile decorations
  for (let y = 0; y < map.H; y++) for (let x = 0; x < map.W; x++) {
    const ch = map.at(x, y), t = map.tile(x, y), v = hash(x, y, 2) > 0.5 ? 1 : 0;
    const bx = x * T + 8, by = y * T + T;
    if (t.grass && !/[A-Z]/.test(ch)) {
      const flip = hash(x, y, 9) > 0.5;
      const back = scene.add.image(x * T, y * T, k('grass-back-0')).setOrigin(0).setDepth(y * T + 1).setFlipX(flip);
      const front = scene.add.image(x * T, y * T, k('grass-front-0')).setOrigin(0).setDepth(y * T + T + 2).setFlipX(flip);
      grass.push({ x, y, back, front, sway: 0 });
    }
    switch (t.deco) {
      case 'tree': case 'pine': {
        const ox = Math.round((hash(x, y, 8) - 0.5) * 4);
        scene.add.image(bx + ox + 2, by - 2, 'fx-shadow').setScale(1.6, 1.4).setDepth(2);
        scene.add.image(bx + ox, by + 1, k(`${t.deco}-${v}`)).setOrigin(0.5, 1).setDepth(by);
        // by the water the tree shows upside down in it, dim
        if (map.tile(x, y + 1).ground === 'water') scene.add.image(bx + ox, by - 1, k(`${t.deco}-${v}`)).setOrigin(0.5, 1).setFlipY(true).setOrigin(0.5, 0).setPosition(bx + ox, by + 1).setAlpha(0.42).setTint(0x7a8ab8).setDepth(1);
        if (t.deco === 'tree') perches.push([bx + ox, by - 30]);
        break;
      }
      case 'deadtree': scene.add.image(bx, by + 1, k('deadtree-0')).setOrigin(0.5, 1).setDepth(by); perches.push([bx + 8, by - 28], [bx - 7, by - 24]); break;
      case 'bush': case 'rock': scene.add.image(bx, by, k(t.deco === 'bush' ? 'bush-0' : `rock-${v}`)).setOrigin(0.5, 1).setDepth(by - 2); break;
      case 'grave': scene.add.image(bx, by + 1, k(`grave-${hash(x, y, 4) > 0.7 ? 1 : 0}`)).setOrigin(0.5, 1).setDepth(by - 2); break;
      case 'herbs': scene.add.image(x * T, y * T, k(`herbs-${v}`)).setOrigin(0).setDepth(y * T + 4); break;
      case 'bars': scene.add.image(bx, by, k('bars-0')).setOrigin(0.5, 1).setDepth(by - 1); break;
      case 'stonewall': {
        const L = map.tile(x - 1, y).deco === 'stonewall' ? 1 : 0, R = map.tile(x + 1, y).deco === 'stonewall' ? 1 : 0;
        scene.add.image(x * T, y * T, k(`stonewall-${L}${R}`)).setOrigin(0).setDepth(by - 2);
        break;
      }
      case 'fence': {
        const fh = (dx) => ['fence'].includes(map.tile(x + dx, y).deco) || map.at(x + dx, y) === '+';
        const fv = (dy) => map.tile(x, y + dy).deco === 'fence';
        const dir = fh(-1) || fh(1) ? 'h' : fv(-1) || fv(1) ? 'v' : 'post';
        scene.add.image(x * T, by, k(`fence-${dir}`)).setOrigin(0, 1).setDepth(by - 3);
        break;
      }
      default:
    }
  }

  // blocks: buildings, props, furniture
  for (const b of map.blocks) {
    const art = paintBlock(b, season);
    const key = `blk-${map.id}-${b.letter}-${b.x}-${b.y}-${season}`;
    if (!scene.textures.exists(key)) addTex(scene, key, art.canvas);
    const left = b.x * T - (art.ox || 0), bottom = (b.y + b.h) * T, top = bottom - art.canvas.height;
    if (!map.inside && !['lamp', 'pillory', 'board', 'lantern', 'torch'].includes(b.kind) && b.w > 1) scene.add.image(left + (b.w * T) / 2 + 2, bottom - 2, 'fx-shadow').setScale((b.w * T) / 12, 1.6).setDepth(2);
    scene.add.image(left, bottom, key).setOrigin(0, 1).setDepth(bottom - 1);
    for (const w of art.windows) {
      if (!w.lit) continue;
      const wx = left + w.x, wy = top + w.y;
      const glow = scene.add.image(wx, wy, w.violet ? 'fx-glow-violet' : 'fx-glow').setScale(0.8).setBlendMode(ADD).setDepth(bottom).setAlpha(0.75);
      lights.push({ x: wx, y: wy + 6, r: w.curtain ? 22 : 30, window: true, glow, keep: !!w.keep || b.kind !== 'house' });
    }
    if (art.smoke) smoke(scene, left + art.smoke[0], top + art.smoke[1], bottom);
    if (art.wheel) scene.add.sprite(left + art.wheel[0], top + art.wheel[1], 'mill-wheel').setDepth(bottom).play('mill-wheel');
    if (b.kind === 'meeting') bells.push(scene.add.image(left + (b.w * T) / 2, top + 27, 'fx-bell').setOrigin(0.5, 0).setDepth(bottom + 1));
    if (b.kind === 'house' && !map.inside) perches.push([left + 10 + hash(b.x, b.y, 3) * (b.w * T - 20), top + 14]);
    const L = KINDS[b.kind]?.light;
    if (L) {
      const lx = left + (L.center ? (b.w * T) / 2 : L.x), ly = L.bottom != null ? bottom - L.bottom : b.y * T + L.y;
      const spots = L.many ? L.many.map(([mx, my]) => [left + mx, b.y * T + my]) : [[lx, ly]];
      for (const [fx, fy] of spots) if (L.warm) scene.add.sprite(fx, fy + 1, 'fx-flame').setOrigin(0.5, 1).setScale(L.big ? 1.4 : L.many ? 0.6 : 0.8).setDepth(bottom + 1).play({ key: 'flame', startFrame: Math.floor(hash(fx, fy, 1) * 3) });
      scene.add.image(lx, ly - 2, L.green ? 'fx-glow-cool' : L.lamp ? 'fx-glow' : 'fx-glow').setScale(L.big ? 2 : 1.1).setBlendMode(ADD).setDepth(bottom + 2).setAlpha(L.green ? 0.4 : 0.7).setTint(L.green ? 0x8fe0a0 : 0xffffff);
      lights.push({ x: lx, y: ly - 2, r: L.r, flick: !!L.warm });
    }
  }

  // doors that are not part of a building, iron gates, chests
  for (const d of map.doors) {
    const look = d.look || (map.blocks.some((b) => d.x >= b.x && d.x < b.x + b.w && d.y >= b.y && d.y < b.y + b.h) ? 'building' : 'mat');
    if (look === 'gate') scene.add.image(d.x * T, d.y * T + T, 'door-gate').setOrigin(0, 1).setDepth(d.y * T + T - 3);
    else if (look !== 'building') scene.add.image(d.x * T, d.y * T, `door-${look}`).setOrigin(0).setDepth(1);
  }
  const gates = map.gates.map((g) => ({ ...g, img: scene.add.image(g.x * T + 8, g.y * T + T, 'gate-bars').setOrigin(0.5, 1).setDepth(g.y * T + T - 1) }));
  const chestKey = 'chest-art';
  if (!scene.textures.exists(chestKey)) addTex(scene, chestKey, INSIDE.chest().canvas);
  const chests = map.chests.map((c) => ({ ...c, img: scene.add.image(c.x * T, c.y * T + T, chestKey).setOrigin(0, 1).setDepth(c.y * T + T - 1) }));

  // stone arches over passages (decor: [{ kind: 'arch', at: [x, y], w }]): drawn over the player
  for (const d of map.def.decor || []) {
    if (d.kind !== 'arch') continue;
    const key = `arch-${d.w}`;
    if (!scene.textures.exists(key)) addTex(scene, key, archArt(d.w));
    scene.add.image(d.at[0] * T - 4, d.at[1] * T + T, key).setOrigin(0, 1).setDepth(d.at[1] * T + T + 20);
  }

  // rooms: the dark outside the walls hides glows that spill past them
  if (map.inside || map.id === 'depths') {
    const W = map.W * T, H = map.H * T, m = 2000;
    for (const [x, y, w, h] of [[-m, -m, W + 2 * m, m], [-m, H, W + 2 * m, m], [-m, 0, m, H], [W, 0, m, H]]) scene.add.rectangle(x, y, w, h, 0x07060c).setOrigin(0).setDepth(8980);
  }

  // grass sways a little
  scene.time.addEvent({ delay: 300, loop: true, callback: () => {
    for (let i = 0; i < 8 && grass.length; i++) {
      const g = grass[(Math.random() * grass.length) | 0];
      g.sway = 1 - g.sway;
      g.back.setTexture(k(`grass-back-${g.sway}`)); g.front.setTexture(k(`grass-front-${g.sway}`));
    }
  } });
  return { lights, grass, gates, chests, bells, perches };
}

function smoke(scene, x, y, depth) {
  scene.time.addEvent({ delay: 700, loop: true, callback: () => {
    const p = scene.add.image(x, y, 'fx-smoke').setDepth(depth + 3).setAlpha(0.5);
    scene.tweens.add({ targets: p, y: y - 22, x: x + 6 + Math.random() * 6, alpha: 0, scale: 2.2, duration: 2600, onComplete: () => p.destroy() });
  } });
}
