// Screenshot helper: node scripts/shot.mjs <url> <out.png> [--phone] [--wait 1500] [--steps file.mjs]
// --steps: a module exporting default async (page) => {...} that runs before the shot
// (clicks, typing; it may take more shots itself with page.screenshot({ path })).
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const args = process.argv.slice(2);
const flag = (k) => args.includes(k);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [url, out = '/tmp/shot.png'] = args.filter((a, i) => !a.startsWith('--') && !['--wait', '--steps'].includes(args[i - 1]));
const chrome = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!url || !chrome) { console.log('usage: shot.mjs <url> <out.png> [--phone] [--wait ms] [--steps file.mjs]  (needs Chrome)'); process.exit(1); }
const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const page = await browser.newPage();
const phone = flag('--phone');
await page.setViewport(phone ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1280, height: 800, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url, { waitUntil: opt('--until', 'networkidle2'), timeout: 30000 });
await new Promise((r) => setTimeout(r, Number(opt('--wait', 1200))));
const steps = opt('--steps');
if (steps) { const mod = await import(pathToFileURL(resolve(steps)).href); await mod.default(page); }
await page.screenshot({ path: out });
console.log(`shot ${out}${errors.length ? `\nPAGE ERRORS:\n${errors.join('\n')}` : ''}`);
await browser.close();
