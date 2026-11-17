// Frame rate of the rite's smoke under a slowed CPU (CDP throttling; RATE=4 is a rough "mid phone"), with the
// thumb over an ember. node scripts/shot.mjs '<harness/rite.html?n=9&owned=...>' /tmp/x.png --phone --until domcontentloaded --steps harness/rite.fps.steps.mjs
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export default async (page) => {
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.RATE || 4) });
  const T = page.touchscreen;
  await sleep(600); await T.touchStart(195, 675); await sleep(1300); await T.touchEnd();
  const t = Date.now(); while (Date.now() - t < 30000 && !(await page.evaluate(() => document.querySelector('.rt')?.dataset.mode === 'search'))) await sleep(200);
  const out = [];
  await T.touchStart(195, 720);
  for (const x of [39, 351, 117, 273, 195]) { for (let i = 0; i < 6; i++) { await T.touchMove(x, 720); await sleep(30); } await sleep(2500); out.push(await page.evaluate(() => globalThis.__salemRiteStats?.())); }
  console.log(JSON.stringify({ rate: Number(process.env.RATE || 4), samples: out }));
  await T.touchEnd();
};
