// Shots of «she sees only what she knows» on the Mappa page (notes/missions-design.md): the card of one entry
// of each sort, and her notes on the places (unknown, known, three notes, a slip with notes).
// node scripts/shot.mjs 'http://localhost:5181/harness/missions.html?s=7' /tmp/x.png --phone --until domcontentloaded --steps harness/missions-know.steps.mjs
// OUT: the folder (default /home/claude/shots/missions-know).
const OUT = process.env.OUT || '/home/claude/shots/missions-know';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export default async (page) => {
  await wait(1200);
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });
  const card = async (id, n) => {
    const ok = await page.evaluate((x) => window.__tap(x), id);
    await wait(500); await shot(n);
    await page.evaluate(() => document.querySelector('.ms-veil')?.click());
    await wait(300);
    if (!ok) console.log('no slip for', id);
  };
  await card('side.m05', 'card-1-carta');
  await card('lesson.minors.3', 'card-2-lezione');
  await card('trial.vigil', 'card-3-prova');
  await card('garden.lesson.luce', 'card-4-orto');
  await card('elsewhere.book', 'card-5-altrove');
  await card('trial.hat', 'card-6-storia');
  await card('side.m09', 'card-7-lanterna');
  // the vigil after the door scene: what she knows now
  await page.evaluate(() => { window.__state.flags['trial.vigil.offered'] = true; });
  await card('trial.vigil', 'card-3b-prova-dopo-la-porta');
  // her notes on a place
  const place = async (label, n) => {
    await page.evaluate((l) => { const b = [...document.querySelectorAll('.sk-hit')].find((x) => x.getAttribute('aria-label') === l); b?.click(); document.querySelector('.mp-cap')?.scrollIntoView({ block: 'end' }); }, label);
    await wait(400); await shot(n);
    const m = await page.evaluate(() => { const c = document.querySelector('.mp-cap'); const r = c.getBoundingClientRect(); return { w: r.width, sw: c.scrollWidth, cw: c.clientWidth, txt: c.innerText }; });
    console.log(n, JSON.stringify(m));
  };
  const reopen = async () => { await page.evaluate(() => window.__reopen()); await wait(1200); };
  // a slip and notes together: Malva's house (her lesson slip) after the flying lesson and the first reading
  await page.evaluate(() => { window.__state.flags['lesson.fly'] = true; });
  await reopen();
  await place('casa di Malva', 'place-4-slip-e-note');
  await page.evaluate(() => { document.querySelector('.sk-hit[aria-label="casa di Malva"]')?.scrollIntoView({ block: 'center' }); });
  await wait(300); await shot('place-4b-slip-sulla-mappa');
  // three notes: the mill (past c2.mill, the wheel read, the miller's errand done)
  await page.evaluate(() => { const s = window.__state; s.flags['mill.read'] = true; s.trials = { ...(s.trials || {}), hat: { result: 'pass' } }; s.flags['trial.hat.pass'] = true; });
  await reopen();
  await page.evaluate(() => { document.querySelector('.sk-hit[aria-label="il mulino"]')?.scrollIntoView({ block: 'center' }); });
  await wait(300); await shot('place-3a-mulino-col-punto');
  await place('il mulino', 'place-3-tre-note');
  // unknown, then known: the shop, early in chapter 1
  await page.evaluate(() => { const s = window.__state; s.chapter = 1; s.step = 'c1.shop'; s.notesAck = null; s.flags = {}; });
  await reopen();
  await place('la bottega', 'place-1-sconosciuta');
  await page.evaluate(() => { const s = window.__state; s.step = 'c1.back'; });
  await reopen();
  await page.evaluate(() => { document.querySelector('.sk-hit[aria-label="la bottega"]')?.scrollIntoView({ block: 'center' }); });
  await wait(300); await shot('place-2a-bottega-col-punto');
  await place('la bottega', 'place-2-dopo-esserci-entrata');
};
