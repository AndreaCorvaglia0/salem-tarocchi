// The bookshelf and the reader on a phone (notes/libri/CONCETTO.md).
//   node scripts/shot.mjs 'http://localhost:5173/?debug&skip=c2' /tmp/x.png --phone --until domcontentloaded --steps harness/books.steps.mjs
// OUT is the folder for the shots (default /home/claude/shots/libri).
const OUT = process.env.OUT || '/home/claude/shots/libri';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export default async (page) => {
  const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); };
  const btn = async (text) => { await page.evaluate((t) => { const b = [...document.querySelectorAll('button')].reverse().find((x) => x.textContent.trim().startsWith(t)); if (!b) throw new Error(`no button ${t}`); b.click(); }, text); };
  const esc = async () => { await page.keyboard.press('Escape'); await wait(500); };
  await page.waitForFunction(() => window.__salem?.state, { timeout: 20000 });
  await wait(2500);
  await page.evaluate(() => {
    window.__salemNoGuard = true;
    const s = window.__salem.state;
    s.flags['library.first'] = true;
    for (const k of Object.keys(s.world.once)) if (k.startsWith('gift.')) delete s.world.once[k];
    for (const id of ['g.tartufo.mice', 'g.tartufo.bear']) s.world.once[`gift.${id}`] = true; // Tartufo has nothing else to bring
    document.querySelectorAll('.uh').forEach((e) => e.remove()); // an old interface hint, not part of the shelf
  });
  for (let i = 0; i < 8; i++) { await page.evaluate(() => document.querySelector('.sy-layer')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await wait(350); }
  await wait(1200);
  await page.evaluate(() => document.querySelectorAll('.uh').forEach((e) => e.remove()));
  // 1. receiving a book: Ortica's line, the little flight
  await page.evaluate(() => {
    const s = window.__salem.state;
    s.books.durante = { at: Date.now(), from: 'ortica' }; s.albumSeen['book:durante'] = false; s.flags['book.durante'] = true;
    window.__salem.call('story.run', [{ do: 'call', name: 'books.fly', args: ['durante'] }, { say: 'ortica', t: 'Prendi questo libro, che io non lo apro più: ogni volta mi viene voglia di litigare con un morto, e lui vince sempre perché è stampato.' }]);
  });
  await wait(350); await shot('01-receive-flight');
  await wait(1600); await shot('02-receive-line');
  for (let i = 0; i < 4; i++) { await page.evaluate(() => document.querySelector('.sy-layer')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await wait(400); }
  await page.evaluate(() => { const s = window.__salem.state; s.books.scot = { at: Date.now(), from: 'place' }; s.albumSeen['book:scot'] = true; s.booksRead.agrippa = { at: 1, n: 1 }; });
  // 2. the shelf in the grimoire
  await page.evaluate(() => { window.__salem.call('grimoire.open', { tab: 'libri' }); });
  await wait(1300); await shot('03-shelf');
  await page.evaluate(() => document.querySelector('.bs-dust')?.click()); await wait(300); await shot('04-shelf-dust');
  // 3. the reader: title page, a page with a picture and a margin note, the truth page
  await page.evaluate(() => document.querySelectorAll('.bs-sp')[1]?.click()); await wait(900);
  await shot('05-front');
  await btn('Avanti'); await wait(500); await shot('06-page2-note');
  await btn('Avanti'); await wait(500); await shot('07-rosemary');
  await btn('Avanti'); await btn('Avanti'); await wait(500); await shot('08-sage');
  await page.evaluate(() => document.querySelector('.bkr-fig button')?.click()); await wait(600); await shot('09-zoom');
  await esc();
  for (let i = 0; i < 5; i++) { await btn('Avanti'); await wait(200); }
  await wait(400); await shot('10-truth');
  await btn('Chiudi'); await wait(800); await shot('11-shelf-after');
  // 4. the unreadable book and Agrippa
  await page.evaluate(() => document.querySelectorAll('.bs-sp')[0]?.click()); await wait(800);
  await btn('Avanti'); await btn('Avanti'); await btn('Avanti'); await wait(500); await shot('12-agrippa-moon');
  await esc(); await esc();
  await page.evaluate(() => { const s = window.__salem.state; s.books.voynich = { at: 1, from: 'tartufo' }; s.books.artemidoro = { at: 1, from: 'home' }; window.__salem.call('books.read', 'voynich'); });
  await wait(900); await shot('13-voynich');
  await esc();
  await page.evaluate(() => { window.__salem.call('books.read', 'artemidoro'); }); await wait(700);
  for (let i = 0; i < 6; i++) { await btn('Avanti'); await wait(150); }
  await wait(500); await shot('14-artemidoro-wolf');
  await esc();
  await page.evaluate(() => { window.__salem.call('books.read', 'scot'); }); await wait(700);
  await btn('Avanti'); await wait(500); await shot('15-scot-note');
  await btn('Avanti'); await btn('Avanti'); await btn('Avanti'); await wait(500); await shot('16-scot-plate');
  await esc();
  // 5. the library's shelf in the world
  await page.evaluate(() => { window.__salem.travel('library.shelf'); }); await wait(2500);
  await shot('17-library');
  await page.evaluate(() => { window.__salem.call('books.shelf'); }); await wait(900); await shot('18-library-sheet');
};
