// The sibyl pairs game on a phone, from the album (notes/sibilla-coppie.md).
//   node scripts/shot.mjs 'http://localhost:5173/?debug&skip=c2' /tmp/x.png --phone --until domcontentloaded --steps harness/sibylpairs.steps.mjs
// OUT is the folder for the shots (default /home/claude/shots/sibilla-coppie).
const OUT = process.env.OUT || '/home/claude/shots/sibilla-coppie';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export default async (page) => {
  const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); };
  await page.waitForFunction(() => window.__salem?.state, { timeout: 20000 });
  await wait(2500);
  await page.evaluate(() => {
    window.__salemNoGuard = true;
    const s = window.__salem.state;
    for (const n of [27, 25, 26, 33, 1, 9, 31, 32]) s.oracle[n] = { at: 1, from: 'g.ginepra.promise' };
    s.world.once['first.sibyl'] = true;
  });
  const tap = async (sel, i = 0) => { await page.evaluate((q, k) => { const el = document.querySelectorAll(q)[k]; if (!el) throw new Error(`no ${q} ${k}`); el.click(); }, sel, i); };
  const turnAll = async () => { const n = await page.$$eval('.sp-card', (a) => a.length); for (let i = 0; i < n; i++) { await tap('.sp-card', i); await wait(300); } await wait(900); };
  const btn = async (text) => { await page.evaluate((t) => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim().startsWith(t)); if (!b) throw new Error(`no button ${t}`); b.click(); }, text); };

  await page.evaluate(() => { window.__salem.call('grimoire.open', { tab: 'sibilla' }); });
  await wait(1200);
  await shot('01-album');
  await tap('.cl-play');
  await wait(1100);
  await shot('02-table');
  await tap('.sp-card', 0); await wait(600);
  await shot('03-one-turned');
  await tap('.sp-card', 1); await wait(1100);
  await shot('04-say');
  await tap('.sp-opt', 0); await wait(600);
  await shot('05-after');
  await btn('Un altro'); await wait(900);
  await turnAll();
  await tap('.sp-opt.own'); await wait(400);
  await page.type('.sp-write textarea', 'Una lettera che arriva, ma la apro domani');
  await wait(300);
  await shot('06-write');
  await btn('Ecco'); await wait(600);
  await shot('07-after-own');
  await btn('Un altro'); await wait(900);
  await turnAll();
  await tap('.sp-opt', 2); await wait(600);
  await shot('08-after-third');
  // three figures: as after six counted rounds
  await page.evaluate(() => { const p = window.__salem.state.sibylPlay; p.plays = 6; if (p.rounds % 2 === 0) p.rounds += 1; });
  await btn('Un altro'); await wait(900);
  await shot('09-three-table');
  await turnAll();
  await shot('10-three-say');
  await tap('.sp-opt', 1); await wait(600);
  await shot('11-three-after');
  await btn('Basta'); await wait(900);
  await shot('12-album-marks');
  await page.evaluate(() => { const b = [...document.querySelectorAll('.cl-it')].find((x) => x.textContent.startsWith('27')); b?.click(); });
  await wait(900);
  await page.evaluate(() => { const sc = [...document.querySelectorAll('.sh-top *')].find((e) => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible'); if (sc) sc.scrollTop = sc.scrollHeight; });
  await wait(400);
  await shot('13-page-27');
};
