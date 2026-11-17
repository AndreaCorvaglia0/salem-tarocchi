// Shots of the REAL game's village and forest (buildings, districts, landmarks, the cottage's stages, the
// grimoire's map). Start a server first (`npx vite --port 5197`), then:
//   OUT=/home/claude/shots/village-new/after node scripts/shot.mjs 'http://127.0.0.1:5197/?debug&skip=c3' /tmp/x.png \
//     --phone --until domcontentloaded --wait 3000 --steps harness/village.steps.mjs
// ONLY=a,b to redo some (the names below). Each shot puts her on a tile with a prepared state.
const OUT = process.env.OUT || '/home/claude/shots/village-new';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [name, map, x, y, chapter, extra]  extra: 'stage1' | 'stage2' | 'stage3:<suit>' | 'ended'
export const SPOTS = [
  ['district-upper', 'village', 23, 10, 1], ['district-lower', 'village', 19, 33, 1], ['district-market', 'village', 4, 20, 1],
  ['door-malva', 'village', 22, 40, 1], ['door-cottage', 'village', 4, 8, 1], ['door-court', 'village', 32, 19, 1],
  ['door-meeting', 'village', 18, 17, 1], ['door-library', 'village', 30, 8, 1], ['door-shop', 'village', 5, 40, 1],
  ['door-gate', 'village', 19, 7, 1], ['door-trapdoor', 'village', 37, 19, 1], ['lane-hiding', 'village', 18, 33, 1],
  ['square-night', 'village', 18, 23, 1], ['square-day', 'village', 18, 23, 4, 'ended'],
  ['square-spring', 'village', 18, 23, 2], ['square-autumn', 'village', 18, 23, 3],
  ['street-winter', 'village', 21, 41, 1], ['street-spring', 'village', 21, 41, 2], ['upper-autumn', 'village', 26, 11, 3],
  ['forest-ortica', 'forest', 7, 24, 2], ['forest-mill', 'forest', 26, 23, 2], ['forest-crossing', 'forest', 19, 25, 2], ['forest-ortica-autumn', 'forest', 7, 24, 3],
  ['cottage-1', 'village', 4, 8, 1, 'stage1'], ['cottage-2', 'village', 4, 8, 2, 'stage2'],
  ['cottage-3-cups', 'village', 4, 8, 4, 'stage3:c'], ['cottage-3-swords', 'village', 4, 8, 4, 'stage3:s'], ['cottage-3-pentacles', 'village', 4, 8, 4, 'stage3:p'],
  ['cottage-3-night', 'village', 4, 8, 3, 'stage3:w'],
];

async function prep(page, chapter, extra) {
  await page.evaluate((chapter, extra) => {
    const s = window.__salem.state;
    window.__salemNoGuard = true;
    s.chapter = chapter;
    for (const k of ['garden.given', 'ending.seen']) delete s.flags[k];
    for (const k of Object.keys(s.flags)) if (k.startsWith('item.')) delete s.flags[k];
    s.world.once = s.world.once || {};
    s.world.once['home.2'] = true; s.world.once['home.3'] = true; // no remark toast over the shot (glue/home.js)
    if (extra === 'stage2') s.flags['garden.given'] = true;
    if (extra === 'ended' || extra?.startsWith('stage3')) { s.flags['ending.seen'] = true; s.flags['garden.given'] = true; }
    if (extra?.startsWith('stage3')) {
      const suit = extra.split(':')[1];
      s.traits = { esplora: 0, parola: 0, tono: 0, rischio: 0, guida: 0 };
      if (suit === 'c') { s.traits.guida = 3; s.traits.tono = 3; } if (suit === 's') { s.traits.guida = -3; s.traits.parola = 3; }
      if (suit === 'w') { s.traits.rischio = 3; s.traits.esplora = -3; } if (suit === 'p') { s.traits.rischio = -3; s.traits.parola = -3; }
      const plants = { c: ['lavanda', 'calendula', 'camomilla'], s: ['rosmarino', 'salvia'], w: ['calendula', 'timo', 'menta', 'verbena'], p: [] }[suit];
      s.garden.unlocked = true; s.garden.beds = [0, 1, 2, 3].map((i) => (plants[i] ? { herb: plants[i], terra: 'media', step: 2, any: null, soak: 0, half: 0, hurt: null, wilted: null, felt: null, planted: null } : null));
      if (suit === 'c') s.flags['item.il nastro del cappello di Ortica'] = true;
      if (suit === 's') s.flags['item.il lume cieco di Malva'] = true;
      if (suit === 'w') s.flags['item.la chiave della cantina grande'] = true;
    }
  }, chapter, extra || '');
}

export async function go(page, map, x, y) {
  // a restart, not world.travel: on the same map travel only moves her, and the season would not change
  await page.evaluate((map, x, y) => {
    const o = window.__salem.state.world.once;
    for (const h of ['action', 'detail', 'escape', 'lesson', 'library', 'move', 'number', 'patrol', 'tap', 'trade', 'trial', 'words', 'exam', 'grimoire', 'guide', 'reading', 'fly']) o[`hint.${h}`] = true;
    window.__salem.scene().scene.restart({ map, x, y, dir: 'up' });
  }, map, x, y);
  await sleep(2200);
  for (let i = 0; i < 12; i++) { // a line someone says on arrival: tap it away
    const on = await page.evaluate(() => { const l = document.querySelector('.sy-layer'); if (!l) return false; l.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); return true; });
    if (!on) break; await sleep(350);
  }
  // the interface hints, the name over a door and the toasts: not what we look at (and the naive testers must not read the answer)
  await page.addStyleTag({ content: '.uh,.uh-tap,.w-prompt,.hud-toasts{display:none!important}' });
}

export default async (page) => {
  const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
  await page.evaluate(() => { window.__salemNoGuard = true; });
  for (const [name, map, x, y, chapter, extra] of SPOTS) {
    if (only && !only.includes(name)) continue;
    await prep(page, chapter, extra);
    await go(page, map, x, y);
    await page.screenshot({ path: `${OUT}/${name}.png` });
  }
  if (!only || only.includes('map-village') || only.includes('map-forest')) {
    await page.evaluate(async () => {
      const s = window.__salem.state, all = await window.__salem.call('world.anchors');
      for (const a of Object.keys(all)) s.stats.seen[a] = true;
      s.flags['garden.given'] = true;
    });
    for (const [region, at] of [['village', { map: 'village', x: 18, y: 23 }], ['forest', { map: 'forest', x: 19, y: 25 }]]) {
      if (only && !only.includes(`map-${region}`)) continue;
      await go(page, at.map, at.x, at.y);
      await page.evaluate(() => { window.__salem.call('grimoire.open', { tab: 'mappa' }); });
      await sleep(1500);
      await page.screenshot({ path: `${OUT}/map-${region}.png`, fullPage: true });
      await page.keyboard.press('Escape'); await sleep(400);
      await page.evaluate(() => { document.querySelector('.gr-close, [data-close], .pp-close')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); document.querySelector('.gr-close, [data-close], .pp-close')?.click(); });
      await sleep(600);
    }
  }
};
