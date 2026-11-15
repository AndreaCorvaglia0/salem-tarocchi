// Harness: the sprite sheet (?view=sprites). Every character, every frame, at 4x on a plain dark
// background, and at game zoom (2x) standing on the village ground of the chosen season.
import { LOOKS, personCanvas, FW, FH } from '../src/world/art/people.js';
import { getMap } from '../src/world/maps.js';
import { paintGround } from '../src/world/art/ground.js';
import { seasonFor } from '../src/world/season.js';

export function showSprites(q) {
  const chapter = Number(q.get('chapter') || 1);
  const season = seasonFor('village', chapter);
  const who = ['tu', 'ginepra', 'malva', 'ortica', 'edera', 'conestabile', 'giudice', 'afflitta', 'washer', 'child', 'bottegaio'];
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  document.getElementById('game').remove();
  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:8px;color:#e9d8a6;font:12px "Pixelify Sans",sans-serif;';
  // the village square as a backdrop, cropped
  var ground = paintGround(getMap('village'), season);
  const big = q.has('big');
  const only = q.get('who');
  const z = Number(q.get('z') || 4); // 4x, the close look
  const row = (title, canvas) => {
    const box = document.createElement('div');
    box.style.cssText = 'margin:4px 0;';
    const label = document.createElement('div'); label.textContent = title; box.append(label);
    const c = document.createElement('canvas');
    c.width = canvas.width * z; c.height = canvas.height * z;
    c.style.cssText = `image-rendering:pixelated;width:${c.width}px;height:${c.height}px;background:#120f1c;`;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    g.drawImage(ground, 10 * 16, 21 * 16, canvas.width, canvas.height, 0, 0, c.width, c.height); // the square, under the night
    g.fillStyle = 'rgba(7,10,36,0.5)'; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(canvas, 0, 0, c.width, c.height);
    box.append(c); return box;
  };
  // 4x: every frame of the witches (and the others underneath)
  const head = document.createElement('div'); head.textContent = `Sprites, ${season}. Frames: giu x3, su x3, lato x3, posa, blink, respiro`; wrap.append(head);
  for (const w of who.filter((x) => !only || only.split(',').includes(x))) wrap.append(row(w, personCanvas(LOOKS[w])));
  // game zoom: the standing frames side by side on the ground
  const line = document.createElement('canvas');
  const n = who.length, gw = n * 20 + 8, gh = 44;
  line.width = gw; line.height = gh;
  const g = line.getContext('2d'); g.imageSmoothingEnabled = false;
  g.drawImage(ground, 17 * 16, 20 * 16, gw, gh, 0, 0, gw, gh);
  g.fillStyle = 'rgba(7,10,36,0.45)'; g.fillRect(0, 0, gw, gh);
  who.forEach((w, i) => g.drawImage(personCanvas(LOOKS[w]), 0, 0, FW, FH, 4 + i * 20, 8, FW, FH));
  const lbl = document.createElement('div'); lbl.textContent = 'A zoom di gioco, sul selciato (con la notte):'; lbl.style.marginTop = '10px'; wrap.append(lbl);
  const c = document.createElement('canvas');
  const gz = big ? 4 : 2; // the game's zoom on a phone is 2
  c.width = gw * gz; c.height = gh * gz; c.style.cssText = `image-rendering:pixelated;width:${gw * gz}px;height:${gh * gz}px;`;
  const cg = c.getContext('2d'); cg.imageSmoothingEnabled = false; cg.drawImage(line, 0, 0, c.width, c.height);
  wrap.append(c);
  document.body.append(wrap);
}
