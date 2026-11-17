// Steps for scripts/shot.mjs: plays «Un sacco dal mulino» on a post-ending state and shoots each moment.
// env: OUT (folder), AFF ('hi' | 'lo': traits that make Ortica's affinity high or low), PICK (option index
// in the trial forks: 'right' answers right using the data-ok the debug door leaves, else a number).
const OUT = process.env.OUT || '/tmp/shots-hat';
const AFF = process.env.AFF || 'hi';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0;
export default async function (page) {
  const shot = async (name) => { n += 1; await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${name}.png` }); };
  await wait(3000);
  await page.evaluate((aff) => {
    window.__salemNoGuard = true;
    const s = window.__salem.state;
    s.chapter = 4; s.step = 'post.minors'; s.world.once['enc.miller'] = true;
    for (const k of ['side.m12', 'lesson.fly', 'ending.seen', 'trial.dare.pass', 'library.first']) s.flags[k] = true;
    s.powers.broom = true;
    for (let i = 0; i <= 21; i++) { const id = `m${String(i).padStart(2, '0')}`; s.cards[id] = s.cards[id] || { found: true, stars: 1 }; s.cards[id].found = true; }
    s.trials.dare = { result: 'pass', errors: 1, day: 'x', at: 1 };
    s.traits = aff === 'hi' ? { esplora: 3, parola: 4, tono: 0, rischio: 4, guida: -4 } : { esplora: 0, parola: -4, tono: 2, rischio: -4, guida: 4 };
    s.coins = 20;
  }, AFF);
  await page.evaluate(() => { window.__salem.travel('forest.mill'); });
  await wait(2500);
  await shot('mill-world');
  // the grimoire's list of things to do
  await page.evaluate(() => { window.__salem.call('grimoire.open'); });
  await wait(1500);
  await shot('grimoire');
  await page.evaluate(() => { for (const e of document.querySelectorAll('*')) if (e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible') { const t = [...e.querySelectorAll('*')].find((x) => /mulino/.test(x.textContent) && x.children.length === 0); if (t) t.scrollIntoView({ block: 'center' }); } });
  await wait(600);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button, [role=tab], div, span')].find((x) => x.children.length === 0 && x.textContent.trim() === 'Mappa'); b?.click(); });
  await wait(1200);
  await shot('grimoire-mission');
  await page.keyboard.press('Escape'); await wait(300);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Chiudi|×|Torna/.test(x.textContent || x.getAttribute('aria-label') || '')); b?.click(); });
  await wait(800);
  await page.evaluate(() => { window.__salem.travel('forest.mill'); });
  await wait(1800);
  // knock
  await page.evaluate(() => document.querySelector('.w-act')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await wait(1200);
  await driveDialogue(page, shot, 'mill', [AFF === 'hi' ? 2 : 1]);
  await wait(1000);
  await shot('after-mill');
  // to the hut, where the door is now
  await page.evaluate(() => { window.__salem.travel('forest.ortica_hut'); });
  await wait(2500);
  await shot('hut-world');
  await page.evaluate(() => document.querySelector('.w-act')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await wait(1500);
  await driveTrial(page, shot);
  await wait(800);
  await shot('end-world');
  // later, at the mill
  await page.evaluate(() => { window.__salem.travel('forest.mill'); });
  await wait(2500);
  await shot('mill-later-world');
  await page.evaluate(() => document.querySelector('.w-act')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await wait(1200);
  await driveDialogue(page, shot, 'later', [0]);
  const diary = await page.evaluate(() => JSON.stringify({ diary: window.__salem.state.diary.slice(-4).map((d) => d.t), flags: Object.keys(window.__salem.state.flags).filter((k) => /hat/.test(k)), trials: window.__salem.state.trials.hat }));
  console.log(diary);
}

// taps through story dialogue; at a choice clicks the next index from picks; shoots each line
async function driveDialogue(page, shot, tag, picks) {
  for (let i = 0; i < 30; i++) {
    const st = await page.evaluate(() => ({ opts: document.querySelectorAll('.sy-opt').length, box: !!document.querySelector('.sy-layer .sy-box'), tr: !!document.querySelector('.tr-fc, .tr-btn, .trw') }));
    if (st.tr) return;
    if (st.opts) {
      await shot(`${tag}-choice`);
      const k = picks.shift() ?? 0;
      await page.evaluate((k) => { const o = document.querySelectorAll('.sy-opt'); (o[k] || o[0]).click(); }, k);
      await wait(900);
      continue;
    }
    if (!st.box) return;
    await wait(900);
    await shot(`${tag}-line`);
    await page.evaluate(() => { const l = document.querySelector('.sy-layer'); l?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); });
    await wait(300);
    await page.evaluate(() => { const l = document.querySelector('.sy-layer'); l?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); });
    await wait(600);
  }
}

// the trial: title, lines, witch draws, forks (answers right, except the second fork), choice, end
async function driveTrial(page, shot) {
  let forks = 0;
  for (let i = 0; i < 80; i++) {
    const st = await page.evaluate(() => ({
      btn: document.querySelector('.tr-btn')?.textContent || null,
      fan: document.querySelectorAll('.tr-fc:not([disabled])').length,
      opts: document.querySelectorAll('.tr-opt:not([disabled])').length,
      draw: !!document.querySelector('.trw'),
      syopt: document.querySelectorAll('.sy-opt').length,
      box: !!document.querySelector('.sy-layer .sy-box'),
    }));
    if (st.draw) { await wait(1600); await shot('draw'); await page.evaluate(() => document.querySelector('.trw-veil')?.parentElement?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))); await wait(700); continue; }
    if (st.fan) { await shot('fan'); await page.evaluate(() => document.querySelectorAll('.tr-fc')[1]?.click() || document.querySelector('.tr-fc')?.click()); await wait(1800); continue; }
    if (st.opts) {
      await shot('fork-options');
      forks += 1;
      // right, except the second fork (to see a bad room): the right one is the option whose tags match; read it from the feedback after
      await page.evaluate((wrong) => { const o = [...document.querySelectorAll('.tr-opt')]; o[wrong ? 0 : 0].click(); }, forks === 2);
      await wait(1200); await shot('fork-feedback');
      continue;
    }
    if (st.btn) { await wait(500); await shot(`screen-${st.btn.replace(/\W+/g, '')}`); await page.evaluate(() => document.querySelector('.tr-btn')?.click()); await wait(1200); continue; }
    if (st.syopt) { await shot('trial-choice'); await page.evaluate(() => document.querySelectorAll('.sy-opt')[0].click()); await wait(900); continue; }
    if (st.box) { await wait(900); await shot('trial-line'); await page.evaluate(() => { const l = document.querySelector('.sy-layer'); l?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); }); await wait(300); await page.evaluate(() => { const l = document.querySelector('.sy-layer'); l?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); }); await wait(600); continue; }
    await wait(700);
    const idle = await page.evaluate(() => !document.querySelector('.sy-layer .sy-box, .tr-fc, .tr-opt, .tr-btn, .trw'));
    if (idle && i > 5) { await wait(1500); const still = await page.evaluate(() => !document.querySelector('.sy-layer .sy-box, .tr-fc, .tr-opt, .tr-btn, .trw')); if (still) return; }
  }
}
