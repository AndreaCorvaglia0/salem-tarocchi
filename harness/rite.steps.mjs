// Plays the smoke rite with real touches (hold, slide, release) on harness/rite.html and shoots each moment.
//   OUT=/home/claude/shots/rito MODE=first|tenth|same|fourth|scene|gift|deck node scripts/shot.mjs \
//     'http://localhost:5199/harness/rite.html?n=0' /tmp/x.png --phone --until domcontentloaded --steps harness/rite.steps.mjs
// Prints the overlay's result (phases in seconds, total) and the frame rate seen during the search.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = process.env.OUT || '/tmp', MODE = process.env.MODE || 'first';
const shot = (page, name) => page.screenshot({ path: `${OUT}/${MODE}-${name}.png` });
const until = async (page, fn, arg, ms = 30000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(fn, arg)) return true; await sleep(60); } return false; };
const slotX = [39, 117, 195, 273, 351], arcY = 561, hearth = 675;

export default async (page) => {
  const T = page.touchscreen;
  await sleep(500);
  if (MODE === 'scene' || MODE === 'gift') {
    await shot(page, '0-line1');
    for (let i = 0; i < (MODE === 'scene' ? 3 : 2); i++) { await sleep(700); await T.tap(195, 420); await sleep(450); if (i === 0) await shot(page, '0-line2'); }
    await sleep(300);
  }
  if (process.env.QUICK && MODE !== 'same') { // a practised thumb: on the coal half a second after the layer opens
    await page.evaluate(() => new Promise((r) => { const f = () => (document.querySelector('.rt')?.dataset.mode === 'knock' ? r() : setTimeout(f, 20)); f(); }));
    await sleep(500); await T.touchStart(195, hearth); await sleep(1050); await T.touchEnd();
  } else if (MODE !== 'same') {
    await shot(page, '1-knock');
    await T.touchStart(195, hearth); await sleep(550); await shot(page, '2-holding'); await sleep(550); await T.touchEnd();
    await sleep(700); await shot(page, '3-lit');
  } else { await sleep(300); await shot(page, '1-still'); }
  await sleep(MODE === 'same' ? 600 : 1500); await shot(page, '4-breath');
  await sleep(1300); await shot(page, '5-breath-out');
  // wait for the embers (the arc shows when the search begins)
  await until(page, () => document.querySelector('.rt')?.dataset.mode === 'search');
  await sleep(400); await shot(page, '6-search');
  if (process.env.FAST) { // a decided thumb: down, slide to the ember, lift (to measure the rite's own time)
    const tx = slotX[Number(process.env.PICK ?? 0)];
    await T.touchStart(195, 720); for (let i = 1; i <= 6; i++) { await T.touchMove(195 + ((tx - 195) * i) / 6, 720); await sleep(40); } await sleep(150); await T.touchEnd();
    await sleep(400); await shot(page, '12-named');
    const r = await page.evaluate(async () => { const v = await globalThis.__riteDone; return { air: v.air, phases: v.phases, total: v.total, plan: { stage: v.plan.stage, breaths: v.plan.breaths, fixed: v.plan.fixed, limit: v.plan.limit } }; });
    console.log(JSON.stringify({ mode: MODE, fast: true, ...r }));
    return;
  }
  const t0 = Date.now();
  await T.touchStart(170, 720); await sleep(250);
  for (const [x, name] of [[slotX[2], '7-over-middle'], [78, '8-between'], [slotX[0], '9-over-left'], [slotX[4], '10-over-right'], [slotX[3], '11-over-4th']]) {
    const steps = 8; const from = (await page.evaluate(() => globalThis.__lastX || 170));
    for (let i = 1; i <= steps; i++) { const xx = from + ((x - from) * i) / steps; await T.touchMove(xx, 720); await sleep(25); }
    await page.evaluate((v) => { globalThis.__lastX = v; }, x);
    await sleep(1400); await shot(page, name);
  }
  const fps = await page.evaluate(() => globalThis.__salemRiteStats?.());
  const target = Number(process.env.PICK ?? 0);
  for (let i = 1; i <= 8; i++) { await T.touchMove(slotX[3] + ((slotX[target] - slotX[3]) * i) / 8, 720); await sleep(25); }
  await sleep(300);
  await T.touchEnd();
  await sleep(500); await shot(page, '12-named');
  if (MODE === 'deck') {
    await sleep(600); await shot(page, '13-ask');
    await page.evaluate(() => { const b = [...document.querySelectorAll('.rt-btns button')][0]; b?.click(); });
    await sleep(700);
    await T.touchStart(170, 380); for (let i = 0; i < 20; i++) { await T.touchMove(150 + i * 5, 380 - i * 2); await sleep(40); }
    await sleep(500); await shot(page, '14-deck'); await T.touchEnd();
    await page.evaluate(() => { const b = document.querySelector('.rt-btns button.go'); b?.click(); });
  }
  const r = await page.evaluate(async () => { const v = await globalThis.__riteDone; return { air: v.air, phases: v.phases, total: v.total, deck: v.deck, plan: { stage: v.plan.stage, breaths: v.plan.breaths, fixed: v.plan.fixed, limit: v.plan.limit } }; });
  console.log(JSON.stringify({ mode: MODE, scriptedSearchHeld: (Date.now() - t0) / 1000, fps, ...r }));
};
