// Shots of the buildings proof board (notes/buildings.md). Start `npx vite` first, then:
//   OUT=/home/claude/shots/buildings node scripts/shot.mjs 'http://127.0.0.1:5173/harness/buildings.html?part=signs' /tmp/x.png --phone --until domcontentloaded --steps harness/buildings.steps.mjs
// Phone size (390 wide, 2x) full pages for the board, silhouettes, street day/night; close-ups at 4x.
const OUT = process.env.OUT || '/home/claude/shots/buildings';
const BASE = 'http://127.0.0.1:5173/harness/buildings.html';
const go = async (page, q, file, { width = 390, full = true } = {}) => {
  await page.setViewport({ width, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}?${q}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction('window.__ready === true', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: `${OUT}/${file}`, fullPage: full });
};
export default async (page) => {
  const only = process.env.ONLY; // e.g. ONLY=board to redo one
  const want = (k) => !only || only.split(',').includes(k);
  if (want('board')) await go(page, 'part=board', 'board.png');
  if (want('boardnight')) await go(page, 'part=board&night', 'board-night.png');
  if (want('silhouettes')) await go(page, 'part=silhouettes', 'silhouettes.png');
  if (want('signs')) await go(page, 'part=signs', 'signs.png');
  if (want('street')) { await go(page, 'part=street&day', 'street-day.png'); await go(page, 'part=street&night', 'street-night.png'); }
  if (want('street1')) await go(page, 'part=street&night&stage=1', 'street-stage1.png');
  if (want('spring')) await go(page, 'part=street&season=spring&stage=2', 'street-spring.png');
  if (want('close')) {
    const list = [['malva', 0], ['cottage', 0], ['cottage', 1], ['cottage', 2], ['ortica', 0], ['court', 0], ['library', 0], ['house', 0], ['house', 1], ['house', 2]];
    for (const [id, i] of list) await go(page, `part=close&only=${id}&i=${i}&z=4`, `close-${id}${['cottage', 'house'].includes(id) ? `-${i + 1}` : ''}.png`, { width: id === 'court' || id === 'ortica' ? 480 : 390 });
  }
};
