// Steps for scripts/shot.mjs on ?view=session: taps through the demo and shoots each moment.
// OUT env var: prefix for the PNGs (default /tmp/stage-session).
const OUT = process.env.OUT_PREFIX || '/tmp/stage-session';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export default async function (page) {
  const shot = (n) => page.screenshot({ path: `${OUT}-${n}.png` });
  const tap = async () => { await page.mouse.click(200, 300); await wait(300); await page.mouse.click(200, 300); await wait(700); };
  await wait(2600); await shot('1-caption');
  await tap(); await wait(1200); // second line, then the choice
  await tap(); await wait(900); await shot('2-choice');
  await page.evaluate(() => document.querySelector('.ss-opt')?.click()); await wait(1400);
  await tap(); await wait(3200); await shot('3-turned');
  await tap(); await wait(3200); await shot('4-symbol');
  await wait(4000); await tap(); await wait(800);
  await tap(); await wait(900); await shot('5-pad');
  await page.evaluate(() => document.querySelectorAll('.ss-pad button')[6]?.click()); await wait(3800); await shot('6-picked');
}
