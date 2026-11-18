// The bookshelf in play (notes/libri/CONCETTO.md; data in src/data/books/, rules in glue/books.rules.js).
//   books.shelf()        the shelf as a sheet (from the library's shelf; the grimoire has it as the «Libri» ribbon)
//   books.read(id)       one book, a page at a time (ui/books.js)
//   books.fly(id)        the little flight of a new book into the grimoire (a story node calls it)
//   books.find(id)       a book found in a place: given now (the deposit's script calls it)
// How they arrive (EARN in data/books/index.js), all depending on what she has, never on the step:
//   talk     at the start of a free talk with the giver, like the gifts of glue/collect.js (never in the same
//            talk as one of those gifts, never before a scene that moves the main path)
//   home     inside her cottage door, when she walks into the cottage
//   place    inside the prop's script (the court's deposit)
//   tartufo  when they walk into a map together
// After a book is read to the end: a place note (data/world/notes.js) or one exchange with someone at the
// next free talk (AFTER). The map's cards never announce a book.
import { provide, call, has } from '../core/services.js';
import { on, emit } from '../core/bus.js';
import { state, save } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { test } from '../core/cond.js';
import { todayKey } from '../core/progress.js';
import { CAST, SCRIPTS } from '../data/story/index.js';
import { GIFTS } from '../data/gifts.js';
import { BOOK, BOOK_LIST, EARN, AFTER } from '../data/books/index.js';
import { movesStory } from './bonds.rules.js';
import { giftFor, giftGiven } from './collect.rules.js';
import { giveBook, dueBook, dueAsk, markAsk } from './books.rules.js';
import { showShelf, openBook, flyBook } from '../ui/books.js';

const sfx = () => { if (has('sound.play')) Promise.resolve(call('sound.play', 'pick')).catch(() => {}); };
const fly = (id) => { try { flyBook(id); } catch { /* no DOM (tests) */ } sfx(); };
const node = ([who, t]) => ({ say: who, t });

function give(id, from) {
  if (!giveBook(state, id, from, EARN[id]?.how === 'place' ? null : todayKey())) return false;
  save();
  emit('books', { id, from });
  return true;
}

provide('books.shelf', () => showShelf());
provide('books.read', (id) => openBook(id));
provide('books.fly', (id) => { fly(id); return Promise.resolve(); });
provide('books.find', (id) => { if (BOOK[id] && give(id, 'place')) fly(id); return Promise.resolve(); });

// ---- the library: the shelf left of the window -------------------------------------------------------
SCRIPTS['library.shelf'] = [{ do: 'call', name: 'books.shelf' }];
if (!CAST.some((c) => c.id === 'library.shelf')) CAST.push({ id: 'library.shelf', kind: 'prop', at: 'library.shelf', script: 'library.shelf', label: 'Lo scaffale', verb: 'Sfoglia' });

// ---- a place: the deposit of the court keeps a seized book ------------------------------------------
for (const b of BOOK_LIST) {
  const e = EARN[b.id];
  if (e?.how !== 'place' || !SCRIPTS[e.script] || SCRIPTS[e.script].some((n) => n?.bookPlace === b.id)) continue;
  // after the place's first line (what she sees there), before what the place does (the deposit's screen)
  const S = SCRIPTS[e.script], at = Math.min(1, S.length);
  SCRIPTS[e.script] = [...S.slice(0, at), { bookPlace: b.id, if: [{ notFlag: `book.${b.id}` }, ...[].concat(e.when ?? [])],
    then: [...e.lines.map(node), { do: 'call', name: 'books.find', args: [b.id] }] }, ...S.slice(at)];
}

// ---- free talks: a book given, or a question about a book read ------------------------------------
const castOf = (id, at) => (CAST || []).find((c) => c.id === id && c.kind === 'npc' && (!at || c.at === at) && test(c.when ?? true)) || null;
let lastCollect = 0;
on('collect', () => { lastCollect = Date.now(); }); // glue/collect.js gave something in this very talk
export function talkBookNodes(who) {
  if (Date.now() - lastCollect < 1500) return [];
  const b = dueBook({ s: state, how: 'talk', who, day: todayKey(), list: BOOK_LIST, earn: EARN, test, giftGiven });
  if (b) {
    give(b.id, who);
    const e = EARN[b.id];
    return [{ do: 'call', name: 'books.fly', args: [b.id] }, { say: e.say || who, t: e.line }];
  }
  const q = dueAsk({ s: state, who, list: BOOK_LIST, after: AFTER });
  if (q) { markAsk(state, q.id, who); save(); return q.lines.map(node); }
  return [];
}
on('talk', ({ id, at } = {}) => {
  const e = castOf(id, at);
  if (!e || !e.who || movesStory(e.script, SCRIPTS)) return;
  const nodes = talkBookNodes(e.who);
  if (nodes.length && has('story.run')) call('story.run', nodes);
});

// ---- walking into a map: the cottage door, Tartufo ------------------------------------------------
const busy = async () => blocked() || (has('story.busy') && !!(await call('story.busy')));
let entered = 0;
on('map:enter', ({ map } = {}) => {
  const visit = ++entered;
  const attempt = async (tries) => {
    if (visit !== entered) return; // she has left that map
    if (await busy()) { if (tries > 0) setTimeout(() => attempt(tries - 1), 4000); return; } // after what is playing
    const day = todayKey();
    const home = dueBook({ s: state, how: 'home', map, day, list: BOOK_LIST, earn: EARN, test });
    if (home) {
      give(home.id, 'home');
      if (has('story.run')) call('story.run', [{ do: 'call', name: 'books.fly', args: [home.id] }, ...EARN[home.id].lines.map(node)]);
      return;
    }
    if (!state.powers?.cat || Date.now() - lastCollect < 4000 || giftFor({ who: 'tartufo', s: state, test, gifts: GIFTS })) return; // his figures first, never two things at once
    const cat = dueBook({ s: state, how: 'tartufo', day, list: BOOK_LIST, earn: EARN, test });
    if (!cat) return;
    give(cat.id, 'tartufo');
    if (has('story.run')) call('story.run', [{ do: 'call', name: 'books.fly', args: [cat.id] }, { say: 'tartufo', t: EARN[cat.id].line }]);
  };
  setTimeout(() => attempt(3), 2200);
});
