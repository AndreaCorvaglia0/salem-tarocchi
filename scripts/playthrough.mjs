// The playthrough bot: plays a NEW game through the real UI on a phone-sized touch screen, twice
// (first dialogue option on one run, last option on the other, so both sides of every fork play),
// from the title to `ending.seen`. It moves in the world with the ?debug door (world.travel to the
// next step's anchor or to a hidden card) and the action key; everything else is taps on the DOM.
// Fails loudly on a page error, a console error, or when nothing changes for STUCK_MS.
//   node scripts/playthrough.mjs [--url http://127.0.0.1:5181/] [--only first|last]
// Screenshots: /tmp/play/<run>-<moment>.png
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { STEPS } from '../src/data/story/steps.js';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('--url', 'http://127.0.0.1:5181/');
const OUT = '/tmp/play';
const STUCK_MS = 45000, STEP_MS = 6 * 60000, MAX_MS = 40 * 60000;
const chrome = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const AT = Object.fromEntries(STEPS.map((s) => [s.id, s.at]));

// What is on top right now, read from the DOM (highest layer first). Runs in the page.
function probe() {
  const vis = (el) => { if (!el || !el.isConnected) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const all = (sel, root = document) => [...root.querySelectorAll(sel)].filter(vis);
  const last = (sel) => all(sel).pop() || null;
  const S = window.__salem?.state;
  const base = { step: S?.step, chapter: S?.chapter, xp: S?.xp, coins: S?.coins, map: S?.pos?.map, cards: S ? Object.keys(S.cards).length : 0, ended: !!S?.flags?.['ending.seen'] };
  const lv = last('.hud-lvup');
  if (lv) return { ...base, kind: 'levelup', at: box(lv), text: lv.textContent };
  const fd = last('.fd');
  if (fd) {
    const done = all('.fd-acts .fd-b.main', fd)[0];
    if (done) return { ...base, kind: 'found-words', inputs: all('.fd-words input', fd).length, at: box(done) };
    if (fd.classList.contains('rings') && !fd.classList.contains('picked')) { const hit = fd.querySelector('.fd-hit'); const ring = all('.fd-ring', fd); return { ...base, kind: 'found-detail', at: ring.length ? box(ring[Math.floor(Math.random() * ring.length)]) : box(hit) }; }
    return { ...base, kind: 'wait', what: 'found' };
  }
  const book = last('.bk');
  if (book) return { ...base, kind: 'book', tab: book.dataset.tab };
  const shop = last('.sp-w');
  if (shop) return { ...base, kind: 'shop', buy: all('.sp-buy:not([disabled])', shop).map(box), exit: box(shop.querySelector('.sp-bar button')) };
  const sx = last('.sx');
  if (sx) {
    const cls = sx.className;
    const opts = all('.sxq-o:not([disabled])', sx).map((b) => ({ ...box(b), ok: b.dataset.ok === '1' }));
    if (opts.length) return { ...base, kind: 'question', cls, opts, judge: !!sx.textContent.match(/Giudice/) };
    const fan = all('.sxd-fc:not([disabled])', sx);
    if (fan.length) return { ...base, kind: 'fan', cls, at: box(fan[Math.floor(Math.random() * fan.length)]) };
    const stack = all('.sxd-stack', sx)[0];
    if (stack && stack.classList.contains('hold')) return { ...base, kind: 'top', cls, at: box(stack) };
    const foot = all('.sx-foot button:not([disabled])', sx);
    if (foot.length) return { ...base, kind: 'foot', cls, label: foot[foot.length - 1].textContent, at: box(foot[foot.length - 1]), text: sx.innerText.slice(0, 300) };
    return { ...base, kind: 'wait', what: cls };
  }
  const tt = last('.tt');
  if (tt) { const b = all('.tt-b', tt); return { ...base, kind: 'title', buttons: b.map((x) => ({ ...box(x), t: x.textContent })) }; }
  const cn = last('.sgm') || last('.cn'); // the shadow-theatre tableau (.sgm); black bars (.cn) only as a fallback
  if (cn) return { ...base, kind: 'cinema', text: cn.querySelector('.sgm-cap p, .cn-cap')?.textContent || '', at: { x: 195, y: 420 } };
  const ss = last('.ss');
  if (ss) {
    const name = all('.ss-paper input[type=text]:not([inputmode])', ss)[0];
    if (name) return { ...base, kind: 'ask-name', at: box(name), ok: box(ss.querySelector('.ss-btn')) };
    if (all('.ss-paper select', ss).length) return { ...base, kind: 'ask-birth', ok: box(ss.querySelector('.ss-btn')), year: box(ss.querySelector('.ss-paper input')) };
    const o = all('.ss-opt', ss);
    if (o.length) return { ...base, kind: 'choice', where: 'session', opts: o.map((b) => ({ ...box(b), t: b.textContent })), text: ss.querySelector('.ss-cap')?.textContent || '' };
    const pad = all('.ss-pad button', ss);
    if (pad.length) return { ...base, kind: 'pad', at: box(pad[Math.floor(Math.random() * pad.length)]) };
    return { ...base, kind: 'tap', where: 'session', text: ss.querySelector('.ss-cap:not(.out)')?.textContent || '', at: { x: 195, y: 300 } };
  }
  const sy = last('.sy-layer.on');
  if (sy) {
    const o = all('.sy-opt', sy);
    const who = sy.querySelector('.sy-name')?.textContent || '';
    const text = sy.querySelector('.sy-text')?.textContent || '';
    if (o.length) return { ...base, kind: 'choice', where: 'dialogue', who, text, opts: o.map((b) => ({ ...box(b), t: b.textContent })) };
    return { ...base, kind: 'tap', where: 'dialogue', who, text, at: { x: 195, y: 760 } };
  }
  if (window.__salem?.blocked()) return { ...base, kind: 'wait', what: 'blocked' };
  if (!document.querySelector('#game canvas')) return { ...base, kind: 'wait', what: 'no world' };
  return { ...base, kind: 'world', act: document.querySelector('.w-act')?.textContent || '' };
}

async function playRun(side, { stopStep = null } = {}) {
  const tag = side === 'first' ? 'A' : 'B';
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()} ${m.location()?.url || ''}`); });
  page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}?debug`, { waitUntil: 'domcontentloaded' });

  const t0 = Date.now();
  const shots = new Set();
  const shot = async (name, force = false) => { if (shots.has(name) && !force) return; shots.add(name); await sleep(250); await page.screenshot({ path: `${OUT}/${tag}-${name}.png` }); };
  const tap = (p) => page.mouse.click(p.x, p.y);
  const S = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__salem.state)));
  const log = [];
  const say = (...a) => { const l = `[${tag} ${((Date.now() - t0) / 1000).toFixed(0)}s] ${a.join(' ')}`; log.push(l); console.log(l); };
  const fail = async (why) => {
    await page.screenshot({ path: `${OUT}/${tag}-STUCK.png` }).catch(() => {});
    writeFileSync(`${OUT}/${tag}-state.json`, JSON.stringify(await S().catch(() => null), null, 1));
    writeFileSync(`${OUT}/${tag}-log.txt`, log.join('\n'));
    await browser.close();
    throw new Error(`run ${tag}: ${why}\n${errors.join('\n')}`);
  };

  let sig = '', sigAt = Date.now(), exams = 0, lastStep = '', stepTries = 0, did = {}, levels = [];
  let stepSeen = '', stepAt = Date.now();
  while (true) {
    if (errors.length) await fail(`page errors:\n${errors.join('\n')}`);
    if (Date.now() - t0 > MAX_MS) await fail('too long');
    let p;
    try { p = await page.evaluate(probe); } catch (e) { await sleep(300); continue; }
    const now = `${p.kind}|${p.step}|${p.xp}|${p.cards}|${p.text || ''}|${p.cls || ''}|${p.map}|${p.label || ''}`;
    if (now !== sig) { sig = now; sigAt = Date.now(); } else if (Date.now() - sigAt > STUCK_MS) await fail(`stuck on ${now}`);
    if (p.ended && p.kind === 'world') break;
    if (stopStep && p.step === stopStep && p.kind === 'world') return { page, browser, errors, shot };
    if (p.step !== stepSeen) { stepSeen = p.step; stepAt = Date.now(); } else if (Date.now() - stepAt > STEP_MS) await fail(`step ${p.step} did not move in ${STEP_MS / 60000} minutes`);

    switch (p.kind) {
      case 'levelup': { const lvl = /Livello (\d)/.exec(p.text)?.[1]; if (lvl && !levels.includes(lvl)) { levels.push(lvl); say('level', lvl, 'xp', p.xp, 'step', p.step); } await shot('levelup'); await tap(p.at); break; }
      case 'found-detail': await shot('found'); await tap(p.at); break;
      case 'found-words': {
        const words = ['neve', 'luce', 'passo'];
        for (let i = 0; i < p.inputs; i++) { await page.focus(`.fd-words input:nth-of-type(${i + 1})`).catch(() => {}); }
        const ins = await page.$$('.fd-words input');
        for (let i = 0; i < ins.length; i++) await ins[i].type(words[i]);
        await tap(p.at);
        break;
      }
      case 'title': {
        await shot('title');
        const b = p.buttons.find((x) => /Nuova/.test(x.t)) || p.buttons[0];
        await tap(b);
        break;
      }
      case 'ask-name': await shot('s0-name'); await tap(p.at); await page.keyboard.type(side === 'first' ? 'Ada' : 'Bea'); await tap(p.ok); break;
      case 'ask-birth':
        await page.select('.ss-paper select[aria-label=Giorno]', side === 'first' ? '14' : '3');
        await page.select('.ss-paper select[aria-label=Mese]', side === 'first' ? '7' : '11');
        await tap(p.year); await page.keyboard.type('1996');
        await shot('s0-birth'); await tap(p.ok); break;
      case 'pad': await tap(p.at); break;
      case 'choice': {
        if (/Farmi avanti/.test(p.opts.map((o) => o.t).join())) await shot('square-fork');
        if (/Accenderlo io|Insegnarle/.test(p.opts.map((o) => o.t).join())) await shot('campfire');
        if (p.where === 'session' && p.chapter >= 1) await shot('session-tree');
        const o = side === 'first' ? p.opts[0] : p.opts[p.opts.length - 1];
        say('choose', JSON.stringify(o.t.slice(0, 50)));
        await tap(o); break;
      }
      case 'tap':
        if (p.where === 'dialogue') {
          if (/Malva/.test(p.who)) await shot('malva');
          if (/Ortica/.test(p.who)) await shot('ortica');
          if (/Edera/.test(p.who)) await shot('edera');
          if (/cella|paglia|grata|Pietra|Di nuovo qui|muro accanto/.test(p.text) && p.who === '') await shot('jail-wakeup');
        }
        if (p.where === 'session' && /sedia vuota/.test(p.text)) await shot('last-image');
        await tap(p.at); break;
      case 'cinema':
        if (p.text && p.text !== did.cin) { did.cin = p.text; say('cinema', JSON.stringify(p.text)); }
        if (/Salem\. Inverno|La neve copre/.test(p.text)) await shot('arrival');
        if (/Lanterne intorno/.test(p.text)) await shot('arrest');
        if (/Tre maestre/.test(p.text)) await shot('coven');
        if (/^Alba/.test(p.text)) await shot('dawn');
        await tap(p.at); break;
      case 'fan': await shot('fan-draw'); await tap(p.at); break;
      case 'top': await tap(p.at); break;
      case 'question': {
        if (/sxe/.test(p.cls)) { await shot(p.step === 'c3.trial' ? 'trial' : 'first-exam'); }
        if (/sxread/.test(p.cls)) await shot(p.step === 'f.last' ? 'final-reading-q' : 'first-reading');
        // the policy: mostly right; the third street Exam of run A all wrong (a night in the cell);
        // run B fails the Judge's Exam on purpose (the other ending)
        let wrong = Math.random() < 0.15;
        if (/sxe/.test(p.cls) && p.step !== 'c3.trial' && exams >= 2 && side === 'first' && !did.failedOnce) wrong = true;
        if (/sxe/.test(p.cls) && p.step === 'c3.trial') wrong = side === 'last' ? Math.random() < 0.7 : Math.random() < 0.1;
        const pool = p.opts.filter((o) => o.ok === !wrong);
        const o = (pool.length ? pool : p.opts)[0];
        await tap(o); break;
      }
      case 'foot':
        if (/sxread/.test(p.cls) && /Ecco le carte/.test(p.text) && p.step === 'f.last') await shot('final-cross');
        if (/sxe/.test(p.cls) && /Rispondo/.test(p.label)) { exams++; say('exam', exams, 'step', p.step); }
        if (/sxe/.test(p.cls) && /Ti portano via/.test(p.text)) { say('exam failed'); did.failedOnce = true; await shot('exam-failed'); did.hold = Date.now() + 4000; }
        await tap(p.at); break;
      case 'shop': {
        await shot('shop');
        if (p.buy.length && !did.bought) { did.bought = true; await tap(p.buy[0]); await sleep(600); break; }
        await tap(p.exit); break;
      }
      case 'book': await page.keyboard.press('Escape'); break;
      case 'wait': await sleep(200); break;
      case 'world': await world(p); break;
      default: await sleep(200);
    }
    await sleep(p.kind === 'world' ? 50 : 90);
  }

  // the world: extra visits first (grimoire, card of the day, shop, deposit), then the path
  async function world(p) {
    if (Date.now() < (did.hold || 0)) { await sleep(300); return; } // let the cell come
    const st = await S();
    if (st.step !== lastStep) { lastStep = st.step; stepTries = 0; say('step', st.step, 'lv xp', st.xp, 'cards', Object.keys(st.cards).length, 'coins', st.coins); }
    await shot(`world-${st.step}`);
    const travel = async (a) => { say('travel', a); await page.evaluate((x) => window.__salem.travel(x), a); await sleep(900); };
    const act = async () => {
      if (await page.evaluate(() => window.__salem.blocked())) return; // a scene already started (a zone)
      const b = await page.evaluate(() => { const e = document.querySelector('.w-act'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: e.textContent }; });
      say('act', b?.t);
      if (b && b.t !== '·') await tap(b); else await page.keyboard.press('Space');
      await sleep(700);
    };
    if (st.step === 'c1.square' && !did.grimoire) {
      did.grimoire = true;
      await page.click('.hud-book'); await sleep(900); await shot('grimoire-io');
      for (const [i, n] of [[1, 'carte'], [2, 'mappa']]) { const r = await page.$$('.bk-rib'); await r[i].click(); await sleep(700); await shot(`grimoire-${n}`); }
      await page.keyboard.press('Escape'); await sleep(500); return;
    }
    if (st.chapter >= 1 && st.step !== 'c1.malva' && st.step !== 'c1.cottage' && !did.day) { did.day = true; await travel('cottage.bed'); await act(); return; }
    if (st.flags['shop.open'] && st.coins >= 10 && !did.shop && st.chapter >= 1 && !['c1.malva', 'c1.cottage'].includes(st.step)) { did.shop = true; await travel('shop.counter'); await act(); return; }
    // loiter where a patrol walks, once per chapter: a street Exam (and, in run A, a night in the cell)
    const LOITER = { 'c1.gate': 'village.square', 'c2.plan': 'forest.pond', 'c3.coven': 'depths.coven' };
    if (LOITER[st.step] && !did[`loiter${st.step}`]) {
      did[`loiter${st.step}`] = true;
      const before = st.stats.exams;
      await travel(LOITER[st.step]);
      say('loiter', LOITER[st.step]);
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      for (let i = 0; i < 40; i++) {
        const q = await page.evaluate(() => ({ b: window.__salem.blocked(), e: window.__salem.state.stats.exams }));
        if (q.b || q.e > before) break;
        const k = keys[Math.floor(Math.random() * 4)];
        await page.keyboard.down(k); await sleep(300 + Math.random() * 500); await page.keyboard.up(k);
      }
      return;
    }
    const conf = Object.entries(st.cards).filter(([, c]) => c.confiscated).length;
    if (conf && !did[`dep${st.stats.jailed}`]) { did[`dep${st.stats.jailed}`] = true; await travel('court.deposit'); await act(); return; }
    // the path: go where the step says; if it does not move after a few tries, find cards or read for clients
    const at = AT[st.step];
    stepTries++;
    if (at && stepTries <= 2) { await travel(at); await act(); await sleep(400); return; }
    const hidden = await page.evaluate(() => window.__salem.hidden());
    const ok = hidden.filter((c) => !(c.spot.startsWith('depths.') && st.chapter < 3));
    if (ok.length) { await travel(ok[0].spot); await act(); stepTries = 1; return; }
    // more xp: a client at the cottage table
    if (stepTries % 3 === 0 && st.chapter >= 1) { await travel('cottage.table'); await act(); return; }
    if (at) { await travel(at); await act(); return; }
    await sleep(500);
  }

  const st = await S();
  const secs = Math.round((Date.now() - t0) / 1000);
  await sleep(800); await shot('the-end');
  const summary = { run: tag, side, seconds: secs, xp: st.xp, levels, coins: st.coins, cards: Object.keys(st.cards).length, exams: st.stats.exams, passed: st.stats.examsPassed, failed: st.stats.examsFailed, jailed: st.stats.jailed, readings: st.stats.readings,
    forks: ['b1.spoke', 'b1.hid', 'b2.went', 'b2.stayed', 'b3.stealth', 'b3.open', 'trial.won', 'trial.lost'].filter((f) => st.flags[f]), trust: st.trust, errors: errors.length, diary: st.diary.slice(-6).map((d) => d.t) };
  writeFileSync(`${OUT}/${tag}-log.txt`, log.join('\n'));
  writeFileSync(`${OUT}/${tag}-summary.json`, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary));
  await browser.close();
  return summary;
}

// The boot paths: "Sfoglia il grimorio" and back, "Continua" at the saved place, the ?debug&skip= doors.
async function bootChecks() {
  const { page, browser, errors, shot } = await playRun('first', { stopStep: 'c1.cottage' });
  const fail = async (why) => { await page.screenshot({ path: `${OUT}/C-FAIL.png` }); await browser.close(); throw new Error(`boot: ${why}\n${errors.join('\n')}`); };
  const before = await page.evaluate(() => ({ ...window.__salem.state.pos, step: window.__salem.state.step }));
  await sleep(600);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.tt-b', { timeout: 15000 });
  const labels = await page.$$eval('.tt-b', (b) => b.map((x) => x.textContent));
  if (labels[0] !== 'Continua' || labels.includes('null')) await fail(`title buttons ${labels}`);
  await page.screenshot({ path: `${OUT}/C-title-continue.png` });
  // study mode, then back to the title
  await (await page.$$('.tt-b'))[2].click();
  await page.waitForSelector('.bk', { timeout: 8000 });
  await sleep(700); await page.screenshot({ path: `${OUT}/C-study.png` });
  if (await page.$('#game canvas')) await fail('the world is running behind study mode');
  await page.keyboard.press('Escape');
  await page.waitForSelector('.tt-b', { timeout: 8000 });
  await (await page.$$('.tt-b'))[0].click(); // Continua
  await page.waitForSelector('#game canvas', { timeout: 15000 });
  await page.waitForSelector('.hud', { timeout: 8000 });
  await sleep(1500);
  const after = await page.evaluate(() => ({ ...window.__salem.state.pos, step: window.__salem.state.step }));
  await page.screenshot({ path: `${OUT}/C-continued.png` });
  if (after.map !== before.map || Math.abs(after.x - before.x) + Math.abs(after.y - before.y) > 2 || after.step !== before.step) await fail(`continue: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`);
  // the skip doors
  for (const [key, step] of [['c2', 'c2.ortica'], ['c3', 'c3.trapdoor'], ['trial', 'c3.court']]) {
    await page.goto(`${BASE}?debug&skip=${key}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#game canvas', { timeout: 15000 });
    await sleep(1800);
    const st = await page.evaluate(() => window.__salem.state.step);
    await page.screenshot({ path: `${OUT}/C-skip-${key}.png` });
    if (st !== step) await fail(`skip ${key}: step ${st}`);
    if (/skip=/.test(page.url())) await fail(`skip ${key}: the URL keeps skip=`);
  }
  if (errors.length) await fail('page errors');
  await browser.close();
  console.log('OK: boot checks (study, continue, skips)');
}

const only = opt('--only');
const out = [];
if (!only || only === 'boot') await bootChecks();
for (const side of ['first', 'last']) if (!only || only === side) out.push(await playRun(side));
console.log(`OK: ${out.length} run(s) reached ending.seen`);
