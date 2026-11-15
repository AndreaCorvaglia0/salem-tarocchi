// For scripts/shot.mjs: --steps harness/sound.steps.mjs. Clicks every mood and effect button, the bus buttons and the
// switches, runs the offline measure, prints the SOUND lines and throws if anything is wrong.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export default async (page) => {
  const lines = [];
  page.on('console', (m) => { if (m.text().startsWith('SOUND')) lines.push(m.text()); });
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  // a real tap: the browser starts audio only inside a trusted gesture
  await page.mouse.click(5, 5); await sleep(300);
  const n = await page.evaluate(() => document.querySelectorAll('button').length);
  for (const id of ['moods', 'sfxs', 'bus']) {
    const count = await page.evaluate((i) => document.getElementById(i).children.length, id);
    for (let k = 0; k < count; k++) { await page.evaluate((i, j) => document.getElementById(i).children[j].click(), id, k); await sleep(id === 'moods' ? 700 : 120); }
  }
  await page.evaluate(() => { const m = document.getElementById('music'); m.click(); m.click(); const s = document.getElementById('sfx'); s.click(); s.click(); document.getElementById('stop').click(); });
  await page.evaluate(() => document.querySelector('#moods').children[1].click()); await sleep(4500);
  const live = await page.evaluate(() => document.getElementById('status').textContent);
  console.log('live after a real tap:', live);
  if (!live.includes('"context":"running"') || !/"pad":[1-9]/.test(live)) throw new Error('live audio did not start: ' + live);
  console.log('buttons:', n, 'status:', await page.evaluate(() => document.getElementById('status').textContent));
  await page.evaluate(() => window.__measure());
  const checks = await page.evaluate(() => window.__checks);
  for (const l of lines) console.log(l);
  console.log('problems:', JSON.stringify(checks.problems), 'page errors:', JSON.stringify(errors));
  if (checks.problems.length || errors.length) throw new Error('sound harness failed');
};
