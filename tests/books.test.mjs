// The bookshelf (notes/libri/CONCETTO.md): every book is complete and short enough for a phone, its pictures
// exist and are light, every book reaches a save that is already far ahead, the shelf shows only what she
// has, a read book leaves something real, and old saves load.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOOK_LIST, BOOK, EARN, AFTER, LIMITS, words } from '../src/data/books/index.js';
import * as R from '../src/glue/books.rules.js';
import { COND_KEYS, test as cond } from '../src/core/cond.js';
import { fresh, parseSave } from '../src/core/state.js';
import { CAST, SCRIPTS } from '../src/data/story/index.js';
import { GIFTS } from '../src/data/gifts.js';
import { PLACE_NOTES } from '../src/data/world/notes.js';
import { TITLES } from '../src/ui/missions/titles.js';
import { TRIALS } from '../src/data/trials/index.js';
import { movesStory } from '../src/glue/bonds.rules.js';
import * as C from '../src/glue/collect.rules.js';

const KINDS = ['start', 'talk', 'home', 'place', 'tartufo'];

test('every book is complete: real cover, 6-10 pages, a picture and an alt on each, a truth page with links', () => {
  assert.ok(BOOK_LIST.length >= 3);
  assert.equal(new Set(BOOK_LIST.map((b) => b.id)).size, BOOK_LIST.length);
  for (const b of BOOK_LIST) {
    for (const k of ['id', 'spine', 'title', 'author', 'leather', 'from']) assert.ok(typeof b[k] === 'string' && b[k].length, `${b.id}.${k}`);
    assert.ok(b.pages.length >= LIMITS.minPages && b.pages.length <= LIMITS.maxPages, `${b.id}: ${b.pages.length} pages`);
    assert.ok(b.spine.length <= 18, `${b.id}: the spine fits (${b.spine})`);
    assert.ok(b.year == null || b.year <= 1691 || /Lettrice|Reader/.test(b.from), `${b.id}: a book of Salem is from before 1692`);
    for (const [i, p] of b.pages.entries()) {
      assert.ok(p.img && p.alt && p.text, `${b.id} p${i + 1}: picture, alt and text`);
      const f = join('public', p.img);
      assert.ok(existsSync(f), `${f} missing`);
      assert.ok(statSync(f).size < 130000, `${f} too heavy (${statSync(f).size})`);
    }
    assert.ok(existsSync(join('public', 'books', b.id, 't.webp')), `${b.id}: the little cover for the flight`);
    assert.ok(b.truth?.text && b.truth.links?.length, `${b.id}: «Che cosa è vero» with its library`);
    for (const l of b.truth.links) assert.match(l.url, /^https:\/\//, `${b.id}: a real link`);
    assert.match(b.truth.text, /vero/, `${b.id}: the last page says what is true`);
    assert.match(b.truth.text, /nostr|tue/, `${b.id}: and what is ours`);
    assert.match(b.truth.text, /pubblico dominio|Yale/, `${b.id}: and the licence of the pictures`);
  }
});

test('word limits: at most 60 words a page, the title page 35, a margin note 20, the truth page 80', () => {
  for (const b of BOOK_LIST) {
    b.pages.forEach((p, i) => {
      const max = i === 0 && !b.shuffle ? LIMITS.front : LIMITS.page;
      assert.ok(words(p.text) <= max, `${b.id} p${i + 1}: ${words(p.text)} words (max ${max})`);
      assert.ok(words(p.text) >= 15, `${b.id} p${i + 1}: too short to be a page`);
      if (p.note) {
        assert.ok(words(p.note.t) <= LIMITS.note, `${b.id} p${i + 1}: a note of ${words(p.note.t)} words`);
        assert.ok(['edera', 'ortica', 'ignota', 'antica'].includes(p.note.by), `${b.id} p${i + 1}: whose hand`);
      }
    });
    const notes = b.pages.filter((p) => p.note).length;
    assert.ok(notes <= Math.ceil(b.pages.length * 0.75), `${b.id}: many pages have no note (${notes})`);
    assert.ok(words(b.truth.text) <= LIMITS.truth, `${b.id}: the truth page has ${words(b.truth.text)} words`);
  }
});

// ---- conditions and reachability ------------------------------------------------------------------------
function checkCond(c, where) {
  if (c == null || c === true) return;
  if (Array.isArray(c)) { c.forEach((x) => checkCond(x, where)); return; }
  for (const [k, v] of Object.entries(c)) {
    assert.ok(COND_KEYS.includes(k), `${where}: unknown condition key ${k}`);
    if (k === 'not') checkCond(v, where);
    if (k === 'any') v.forEach((x) => checkCond(x, where));
    if (k === 'trial') assert.ok(TRIALS[v], `${where}: no trial ${v}`);
    assert.ok(k !== 'step' && k !== 'stepIn', `${where}: depends on what she has, never on the step`);
  }
}
const freeTalk = (who, s) => CAST.filter((c) => c.kind === 'npc' && c.who === who && !movesStory(c.script, SCRIPTS) && cond(c.when ?? true, s));
const farAhead = () => {
  const s = fresh();
  Object.assign(s, { started: true, chapter: 4, step: 'f.done' });
  Object.assign(s.flags, { 'met.ginepra': true, 'ending.seen': true, 'exam1.done': true, 'shop.open': true, 'library.first': true });
  for (const k of Object.keys(s.powers)) s.powers[k] = true;
  for (const k of Object.keys(s.spreads)) s.spreads[k] = true;
  return s;
};

test('every book has one way to arrive, with a reason, a valid condition and one line from the giver', () => {
  for (const b of BOOK_LIST) {
    const e = EARN[b.id];
    assert.ok(e && KINDS.includes(e.how), `${b.id}: how it arrives`);
    checkCond(e.when, `${b.id}`);
    if (e.how === 'talk') { assert.ok(e.line && words(e.line) <= 45, `${b.id}: one line from ${e.who}`); assert.ok(!e.afterGift || GIFTS.some((g) => g.id === e.afterGift && g.who === e.who), `${b.id}: after a gift of the same person`); }
    if (e.how === 'tartufo') assert.ok(e.line && words(e.line) <= 45, `${b.id}: one line from Tartufo`);
    if (e.how === 'home' || e.how === 'place') assert.ok(e.lines?.length >= 1 && e.lines.length <= 2 && e.lines.every(([, t]) => words(t) <= 45), `${b.id}: one or two short lines`);
    if (e.how === 'place') assert.ok(SCRIPTS[e.script], `${b.id}: the place's script ${e.script} exists`);
  }
  assert.equal(BOOK_LIST.filter((b) => EARN[b.id].how === 'start').length, 1, 'one book on the shelf from the start');
});

test('a save far ahead gets every book, one a day at most (places excepted), reading them in turn', () => {
  const s = farAhead();
  for (const g of GIFTS) C.giveGift(s, g, 1); // every album gift already given
  s.trials.grave = { result: 'pass' };
  const giftGiven = (st, id) => C.giftGiven(st, id);
  const got = [];
  for (let day = 1; day <= 12 && got.length < BOOK_LIST.length - 1; day++) {
    const d = `2026-12-${String(day).padStart(2, '0')}`;
    for (const how of ['place', 'talk', 'home', 'tartufo']) {
      for (const who of how === 'talk' ? ['ortica', 'edera', 'malva', 'ginepra'] : [null]) {
        const b = R.dueBook({ s, how, who, map: 'cottage', day: d, list: BOOK_LIST, earn: EARN, test: cond, giftGiven });
        if (b) { assert.ok(R.giveBook(s, b.id, how, how === 'place' ? null : d, day), `${b.id} given`); got.push(b.id); }
      }
    }
    for (const b of BOOK_LIST) if (R.hasBook(s, b.id, EARN)) R.markRead(s, b.id, day);
  }
  for (const b of BOOK_LIST) assert.ok(R.hasBook(s, b.id, EARN), `${b.id}: never reached a save far ahead`);
  for (const who of [...new Set(BOOK_LIST.filter((b) => EARN[b.id].how === 'talk').map((b) => EARN[b.id].who))]) assert.ok(freeTalk(who, s).length, `${who}: no free talk for a save far ahead`);
});

test('the pace: one new book a day; a place keeps its book whatever the day', () => {
  const s = farAhead(); const d = '2026-12-01';
  for (const g of GIFTS) C.giveGift(s, g, 1);
  s.flags['client.c1.widow.done'] = true;
  const a = R.dueBook({ s, how: 'talk', who: 'ortica', day: d, list: BOOK_LIST, earn: EARN, test: cond, giftGiven: C.giftGiven });
  assert.equal(a?.id, 'durante');
  R.giveBook(s, a.id, 'ortica', d);
  assert.equal(R.dueBook({ s, how: 'home', map: 'cottage', day: d, list: BOOK_LIST, earn: EARN, test: cond }), null, 'not two in one day');
  assert.equal(R.dueBook({ s, how: 'home', map: 'cottage', day: '2026-12-02', list: BOOK_LIST, earn: EARN, test: cond })?.id, 'artemidoro');
  assert.equal(R.dueBook({ s, how: 'place', day: d, list: BOOK_LIST, earn: EARN, test: cond })?.id, 'scot');
});

test('what a read book leaves: a place note with its flag, or one exchange with someone she can talk to', () => {
  for (const b of BOOK_LIST) {
    const a = AFTER[b.id];
    assert.ok(a && ['note', 'ask'].includes(a.kind), `${b.id}: a read book does something`);
    if (a.kind === 'note') {
      assert.equal(a.flag, `book.${b.id}.read`);
      assert.ok(PLACE_NOTES[a.place]?.notes.some((n) => n.if?.flag === a.flag), `${b.id}: a note at ${a.place}`);
    } else {
      for (const q of a.asks) {
        assert.ok(q.lines.length >= 2 && q.lines.length <= 4 && q.lines[0][0] === 'tu', `${b.id}/${q.who}: she asks, they answer`);
        assert.ok(q.lines.every(([, t]) => words(t) <= 45), `${b.id}/${q.who}: short lines`);
        assert.ok(freeTalk(q.who, farAhead()).length, `${b.id}: ${q.who} can be talked to`);
      }
    }
    if (a.thought) checkCond(a.thought.when, `${b.id} thought`);
  }
  const s = farAhead();
  assert.equal(R.dueAsk({ s, who: 'ortica', list: BOOK_LIST, after: AFTER }), null, 'nothing to ask before reading');
  R.giveBook(s, 'durante', 'ortica'); R.markRead(s, 'durante');
  assert.equal(s.flags['book.durante.read'], true);
  const q = R.dueAsk({ s, who: 'ortica', list: BOOK_LIST, after: AFTER });
  assert.equal(q?.id, 'durante');
  R.markAsk(s, q.id, 'ortica');
  assert.equal(R.dueAsk({ s, who: 'ortica', list: BOOK_LIST, after: AFTER }), null, 'asked once');
});

// ---- she sees only what she knows ------------------------------------------------------------------------
test('the shelf shows only what she has: a missing book is a mark in the dust, never a title', () => {
  const s = fresh();
  const slots = R.shelfSlots(s, BOOK_LIST, EARN);
  assert.equal(slots.length, BOOK_LIST.length);
  for (const sl of slots) if (!sl.have) assert.deepEqual(Object.keys(sl), ['have']);
  assert.equal(slots.filter((x) => x.have).length, 1, 'only the start book');
  R.giveBook(s, 'durante', 'ortica', '2026-12-01');
  assert.equal(R.isNewBook(s, 'durante'), true);
  assert.equal(R.anyNewBook(s), true);
  R.openedBook(s, 'durante');
  assert.equal(R.anyNewBook(s), false);
});

test('the mission cards never announce a book; no name from the backstory in the books', () => {
  const names = BOOK_LIST.flatMap((b) => [b.title, b.author, b.spine].filter((x) => x.length > 3));
  for (const [id, t] of Object.entries(TITLES)) for (const x of [t.title, t.told, t.later?.[1], t.hunch].filter(Boolean)) {
    for (const n of names) assert.ok(!x.includes(n), `${id}: a mission card names the book «${n}»`);
  }
  const files = (dir, ext) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p, ext) : p.endsWith(ext) ? [p] : []; });
  const capWords = (text) => [...String(text).matchAll(/(?<![.!?«]\s|^)(?<=[\s'’(]|^)([A-ZÀ-Ý][a-zà-ÿ]{2,})/gm)].map((m) => m[1]);
  const retro = files(join('lore', 'storia', 'retroscena'), '.md').map((f) => readFileSync(f, 'utf8')).join('\n');
  const said = files(join('src', 'data'), '.js').filter((f) => !f.includes(join('data', 'books'))).map((f) => readFileSync(f, 'utf8')).join('\n');
  const only = [...new Set([...capWords(retro).filter((w) => !said.includes(w)), 'Ruta'])];
  const shown = BOOK_LIST.flatMap((b) => [...b.pages.flatMap((p) => [p.text, p.note?.t]), b.truth.text]).filter(Boolean).join('\n');
  for (const w of only) assert.doesNotMatch(shown, new RegExp(`\\b${w}\\b`), `«${w}» exists only in lore/storia/retroscena`);
});

test('old saves: the new keys get their defaults, and nothing they had is lost', () => {
  const f = fresh();
  assert.deepEqual([f.books, f.booksRead, f.bookDay], [{}, {}, null]);
  const old = { started: true, chapter: 2, step: 'c2.plan', flags: { 'library.first': true }, stones: { agata: { at: 1 } } };
  const s = parseSave(JSON.stringify(old));
  assert.deepEqual([s.books, s.booksRead, s.bookDay], [{}, {}, null]);
  assert.equal(s.stones.agata.at, 1);
  const bad = parseSave(JSON.stringify({ ...old, books: [], booksRead: 'x', bookDay: 4 }));
  assert.deepEqual([bad.books, bad.booksRead, bad.bookDay], [{}, {}, null]);
  assert.ok(R.hasBook(s, 'agrippa', EARN), 'the start book is there for an old save too');
});
