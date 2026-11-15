// Click-through helpers for scripts/shot.mjs: --steps harness/play.steps.mjs ; the script is picked by
// the STEPS env var (exam | reading | draw-fan | draw-number | draw-top | free | review | lock | recover).
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clickText = async (page, text) => {
  const ok = await page.evaluate((t) => { const b = [...document.querySelectorAll('button')].find((x) => !x.disabled && x.textContent.trim().startsWith(t)); if (b) { b.click(); return true; } return false; }, text);
  await sleep(450);
  return ok;
};
const clickSel = async (page, sel, n = 0) => { await page.evaluate((s, k) => { const e = document.querySelectorAll(s)[k]; e?.click(); }, sel, n); await sleep(450); };
const shot = (page, name) => page.screenshot({ path: `/tmp/play-${process.env.TAG || 'x'}-${name}.png` });
export default async (page) => {
  const s = process.env.STEPS || 'exam';
  if (s === 'exam') {
    await clickText(page, 'Rispondo');
    await shot(page, '1q');
    await clickSel(page, '.sxq-o', 0); await shot(page, '2fb');
    await clickText(page, 'Avanti'); await clickSel(page, '.sxq-o', 1); await shot(page, '3fb');
    await clickText(page, 'Avanti'); await clickSel(page, '.sxq-o', 2);
    await clickText(page, 'Vediamo'); await sleep(300); await shot(page, '4end');
  } else if (s === 'reading') {
    await clickText(page, 'Mescolo'); await clickText(page, 'Comincio');
    for (let i = 0; i < 3; i++) {
      await sleep(300);
      if (i === 0) await shot(page, '1draw');
      // fan first, then top
      if (await page.$('.sxd-fc')) await clickSel(page, '.sxd-fc', 2); else await clickSel(page, '.sxd-stack');
      await sleep(1600);
      if (i === 0) await shot(page, '2drawn');
      await clickText(page, 'Tengo');
      await sleep(300);
    }
    await sleep(2500); await shot(page, '3table');
    await clickText(page, 'Leggiamo'); await sleep(500); await shot(page, '4pos');
    await clickSel(page, '.sxq-o', 0); await shot(page, '5fb');
    await clickText(page, 'Avanti'); await clickSel(page, '.sxq-o', 1);
    await clickText(page, 'Avanti'); await clickSel(page, '.sxq-o', 2);
    await clickText(page, 'Finito'); await sleep(300);
  } else if (s === 'draw-fan') {
    await shot(page, '1'); await clickSel(page, '.sxd-fc', 1); await sleep(1800);
  } else if (s === 'draw-number') {
    await shot(page, '1'); await clickText(page, 'Taglia'); await sleep(2200);
  } else if (s === 'draw-top') {
    await shot(page, '1'); await clickSel(page, '.sxd-stack'); await sleep(1800);
  } else if (s === 'free') {
    await clickText(page, 'Passato'); await sleep(300); await shot(page, '1pick');
    for (let i = 0; i < 3; i++) { await clickSel(page, '.sxg-c:not(:disabled)', i); if (i === 0) await shot(page, '2sel'); await clickText(page, i === 0 ? 'Il Matto' : i === 1 ? 'Il Mago' : 'La Sacerdotessa'); await sleep(300); }
    await shot(page, '3walk');
  } else if (s === 'review') {
    await shot(page, '1front'); await clickText(page, 'Mostrami'); await sleep(300); await shot(page, '2back');
  } else if (s === 'lock') {
    await shot(page, '1'); await clickSel(page, '.sxq-o', 0); await sleep(900);
  } else if (s === 'recover') {
    await clickText(page, 'Va bene'); await sleep(300); await shot(page, '1');
    await clickSel(page, '.sxq-o', 0); await sleep(300);
  }
};
