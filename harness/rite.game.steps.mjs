// The smoke rite inside the real game: «Una lettura per me» from a saved game (?debug&skip=c2), with real
// touches for the rite, then the cards, the line after and «E Malva?»; optionally the grimoire's Io page with
// her tradition. OUT=<folder> GAME=self|self-again|tenth|grimoire|client node scripts/shot.mjs \
//   'http://localhost:5199/?debug&skip=c2' /tmp/x.png --phone --until domcontentloaded --wait 4000 --steps harness/rite.game.steps.mjs
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = process.env.OUT || '/tmp', GAME = process.env.GAME || 'self';
const shot = (page, name) => page.screenshot({ path: `${OUT}/game-${GAME}-${name}.png` });
const clickText = async (page, text) => { const ok = await page.evaluate((t) => { const b = [...document.querySelectorAll('button')].find((x) => !x.disabled && x.offsetParent && x.textContent.trim().startsWith(t)); if (b) { b.click(); return true; } return false; }, text); await sleep(450); return ok; };
const until = async (page, fn, ms = 40000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(fn)) return true; await sleep(80); } return false; };

async function rite(page, pick = 0) {
  const T = page.touchscreen;
  await until(page, () => !!document.querySelector('.rt'));
  await sleep(700);
  const t0 = Date.now();
  // the scene at Malva's hearth (the first time): tap through
  let k = 0;
  while (await page.evaluate(() => document.querySelector('.rt')?.dataset.mode === 'tap')) { await shot(page, `r0-scene${++k}`); await sleep(500); await T.tap(195, 420); await sleep(700); }
  if (await page.evaluate(() => document.querySelector('.rt')?.dataset.mode === 'knock')) {
    await shot(page, 'r1-knock');
    await T.touchStart(195, 675); await sleep(1150); await T.touchEnd();
  } else await shot(page, 'r1-still');
  await sleep(1600); await shot(page, 'r2-breath');
  await until(page, () => document.querySelector('.rt')?.dataset.mode === 'search');
  await sleep(500); await shot(page, 'r3-search');
  const x = [39, 117, 195, 273, 351][pick];
  await T.touchStart(195, 720); for (let i = 1; i <= 8; i++) { await T.touchMove(195 + ((x - 195) * i) / 8, 720); await sleep(40); }
  await sleep(700); await shot(page, 'r4-over'); await T.touchEnd();
  await sleep(600); await shot(page, 'r5-named');
  await until(page, () => !document.querySelector('.rt'));
  return (Date.now() - t0) / 1000;
}

export default async (page) => {
  await page.evaluate((g) => {
    globalThis.__salemNoGuard = true;
    const s = window.__salem.state;
    s.stats.readings = Math.max(1, s.stats.readings || 0);
    s.bonds = { ...(s.bonds || {}), malva: 2, ortica: 1, edera: 1 };
    if (g === 'tenth' || g === 'grimoire') { s.rite.n = 9; s.rite.malva = true; s.rite.last = { air: 'alloro', at: Date.now() - 86400e3 }; }
    if (g === 'grimoire') { s.rite.mine = { casa: 'cipresso', amore: 'mirra' }; }
    if (g === 'self-again') { s.rite.n = 4; s.rite.malva = true; s.rite.gifts = { salvia: true }; s.rite.owned = ['rosa', 'salvia', 'alloro', 'cipresso']; s.rite.last = { air: 'rosa', at: Date.now() - 4 * 60e3 }; }
  }, GAME);
  if (GAME === 'grimoire') {
    await page.evaluate(() => { window.__salem.call('grimoire.open', { tab: 'io' }); });
    await sleep(1500); await shot(page, 'io');
    await page.evaluate(() => { const p = [...document.querySelectorAll('p')].find((x) => x.textContent === 'I miei fumi'); p?.scrollIntoView({ block: 'center' }); });
    await sleep(600); await shot(page, 'io-fumi');
    return;
  }
  if (GAME === 'client') {
    await page.evaluate(() => { window.__salem.call('reading.open', { spread: 'single', client: { id: 'x', name: 'La moglie del fabbro', look: 'Ha le mani nere di fuliggine.', question: 'Mio marito tornerà a lavorare?', ambito: 'lavoro', forma: 'sino', hello: 'Buonasera.', thanks: 'Grazie.', pay: 5 } }); });
    await sleep(1200); await clickText(page, 'Mescolo');
    const secs = await rite(page, 2);
    console.log(JSON.stringify({ game: GAME, riteSeconds: secs, rite: await page.evaluate(() => window.__salem.state.rite) }));
    return;
  }
  await page.evaluate(() => { import('/src/ui/selfread.js').then((m) => m.openSelfRead()); });
  await sleep(1200);
  // the Reader's words the first time
  for (let i = 0; i < 5; i++) { await sleep(800); if (!(await clickText(page, 'Avanti'))) break; }
  await sleep(800); await clickText(page, 'Comincio');
  // the theme: the first option each time, down to the text field (the first path ends on «casa»? whatever it is)
  for (let i = 0; i < 6; i++) { const ok = await page.evaluate(() => { const b = document.querySelector('.sr-pair .sr-b'); if (b) { b.click(); return true; } return false; }); await sleep(350); if (!ok) break; }
  await shot(page, 'theme');
  await clickText(page, 'Avanti');
  await clickText(page, 'Carta singola'); await clickText(page, 'Pesco qui');
  const secs = await rite(page, Number(process.env.PICK ?? 4));
  await sleep(600); await shot(page, 'after-rite');
  await clickText(page, 'Mescolo'); await sleep(900);
  await page.evaluate(() => document.querySelectorAll('.sxd-fc')[2]?.click()); await sleep(2200);
  await clickText(page, 'Continua'); await sleep(1500);
  await shot(page, 'reading');
  await page.evaluate(() => document.querySelector('.rta')?.scrollIntoView({ block: 'center' })); await sleep(400);
  await shot(page, 'line-after');
  if (await clickText(page, 'E Malva?')) { await sleep(1500); await page.evaluate(() => document.querySelector('.rta')?.scrollIntoView({ block: 'center' })); await sleep(300); await shot(page, 'malva'); }
  console.log(JSON.stringify({ game: GAME, riteSeconds: secs, rite: await page.evaluate(() => window.__salem.state.rite), mood: await page.evaluate(() => window.__salem.call('sound.want')) }));
};
