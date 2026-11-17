const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
export default async (page) => {
  page.on('console', m => { if (m.type()==='error') console.log('ERR', m.text()); });
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.evaluate(() => { window.__salemNoGuard = true; });
  await sleep(1800);
  if (process.env.TAP) {
    const ok = await page.evaluate(async () => window.__tapId ? await window.__tap(window.__tapId) : 'no tap');
    console.log('tap', ok);
    await sleep(900);
  }
  if (process.env.TALL) {
    await page.evaluate(() => document.querySelector('.bk-pg.l').scrollTop = 0);
    const H = await page.evaluate(() => { const p = document.querySelector('.bk-pg.l'); return p.scrollHeight + (window.innerHeight - p.clientHeight) + 10; });
    await page.setViewport({ width: 390, height: Math.min(4000, H), deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
    await sleep(1200);
  }
  const info = await page.evaluate(() => [...document.querySelectorAll('.ms-pin')].map(p => p.dataset.place + (p.dataset.free==='1'?'':' NOTFREE')).join(' | '));
  console.log(info);
  await page.screenshot({ path: process.env.OUT });
};
