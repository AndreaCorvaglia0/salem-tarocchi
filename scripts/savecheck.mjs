// Checks the save layer in a real browser: node scripts/savecheck.mjs <url>
// localStorage wiped -> IndexedDB brings the game back; both wiped -> the artifact's store does (mocked);
// a read-only viewer; the code out and in again.
import puppeteer from 'puppeteer-core';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = process.argv[2];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--mute-audio', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const cloud = {}; let readonly = false, withCloud = false;
const errs = [];
async function open() {
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.exposeFunction('__cget', (k) => cloud[k] ?? null);
  await p.exposeFunction('__cset', (k, v) => { if (readonly) return false; cloud[k] = v; return true; });
  await p.exposeFunction('__has', () => withCloud);
  await p.evaluateOnNewDocument(() => {
    const doc = (path) => ({ get: async () => { const v = await window.__cget(path); return { exists: v != null, data: () => v ?? undefined }; }, set: async (d) => { if (!(await window.__cset(path, d))) throw { code: 'invalid_argument' }; } });
    window.claude = { use: async (n) => ((await window.__has()) ? (n === 'db' ? { doc } : n === 'user' ? { id: async () => 'u1' } : null) : null) };
  });
  await p.goto(url, { waitUntil: 'networkidle0' }); await sleep(2500);
  return p;
}
const buttons = (p) => p.evaluate(() => [...document.querySelectorAll('.tt-acts button, .tt-acts p')].map((x) => x.textContent));
const tap = async (p, text) => { const h = await p.evaluateHandle((t) => [...document.querySelectorAll('button')].find((x) => x.textContent.includes(t)), text); await h.click(); };
const wipe = async (p0, idb) => { await p0.close(); const p = await b.newPage(); await p.goto(new URL('silence.wav', url).href); await p.evaluate(async (idb) => { localStorage.clear(); if (idb) await new Promise((r) => { const q = indexedDB.deleteDatabase('salem-tarocchi'); q.onsuccess = q.onerror = q.onblocked = r; }); }, idb); await p.close(); };

let p = await open();
console.log('1 fresh           ', await buttons(p));
await tap(p, 'Nuova partita');
for (let i = 0; i < 30; i++) { await sleep(700); await p.touchscreen.tap(195, 500); }
await sleep(2500);
console.log('  keys', await p.evaluate(() => Object.keys(localStorage)));
await wipe(p, false);
p = await open();
console.log('2 localStorage wiped', await buttons(p));
// now with the store: first visit copies the game there
withCloud = true; await p.close(); p = await open(); await sleep(3000);
console.log('3 with store       ', await buttons(p), 'cloud docs', Object.keys(cloud));
await wipe(p, true);
p = await open();
console.log('4 all wiped        ', await buttons(p));
// the code: out of a running game (debug hook), then into an empty browser
await p.close(); const dbg = url + '?debug'; const keep = url;
p = await b.newPage(); await p.goto(dbg, { waitUntil: 'networkidle0' }); await sleep(2000); await tap(p, 'Continua'); await sleep(3000);
const code = await p.evaluate(() => window.__salem.code());
console.log('  code', code.slice(0, 16), code.length, 'chars');
withCloud = false; await wipe(p, true);
p = await open();
console.log('5 empty, no store  ', await buttons(p));
await tap(p, 'Ho un codice'); await sleep(300);
await p.evaluate((c) => { document.querySelector('.tt-area').value = c; }, code);
await tap(p, 'Riprendi da questo codice'); await sleep(3000);
console.log('  title gone', await p.evaluate(() => !document.querySelector('.tt')), 'keys', await p.evaluate(() => Object.keys(localStorage)));
withCloud = true;
// read-only viewer with nothing local
readonly = true; for (const k of Object.keys(cloud)) delete cloud[k];
await wipe(p, true); p = await open();
console.log('6 read-only, empty ', await buttons(p));
await tap(p, 'Nuova partita'); for (let i = 0; i < 12; i++) { await sleep(700); await p.touchscreen.tap(195, 500); }
await sleep(3000); await p.close(); p = await open();
console.log('7 read-only, after ', await buttons(p));
console.log('errors', errs.slice(0, 5));
await b.close();
