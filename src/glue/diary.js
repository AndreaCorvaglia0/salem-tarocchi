// Diary lines and Tartufo's remarks from what happens (docs/DESIGN.md, "Il diario"): BARKS.diaryFor
// keyed by bus events and a few named moments, at most one line per kind every few minutes. Also the
// wake-up in the cell after a failed Exam, and Tartufo when she stands still.
import { on, emit } from '../core/bus.js';
import { call, wrap } from '../core/services.js';
import { state } from '../core/state.js';
import { blocked } from '../core/dom.js';
import { writeDiary } from '../core/progress.js';
import { BARKS } from '../data/story/index.js';
import { CARD } from '../data/cards.base.js';
import { barkFor, throttle } from './barks.js';

const GAP = 4 * 60000;
const once = throttle(GAP);
export const note = (kind) => { const t = BARKS.diaryFor?.[kind]; if (t && once(kind)) writeDiary(t); };
const cat = (situation) => { if (!state.powers.cat) return; const t = barkFor('tartufo', situation); if (t) call('hud.toast', t); };

// cards the story hands over (Il Matto, Il Sole, Il Giudizio, Il Mondo) have their own lines
on('card:found', ({ id } = {}) => { if (CARD[id]?.via === 'spot') note('card:found'); });
for (const evt of ['card:star', 'cards:confiscated', 'card:recovered', 'yourcard:changed']) on(evt, () => note(evt));
on('level:up', ({ gift } = {}) => { note('level:up'); if (gift?.flag && BARKS.diaryFor?.[gift.flag]) setTimeout(() => note(gift.flag), 50); });
on('flag', ({ k, v } = {}) => { if (v && BARKS.diaryFor?.[k]) note(k); });
on('power', ({ id } = {}) => note(`power.${id}`));

// the Exam: a line, Tartufo's word, and the cell afterwards (whoever moves her there)
let jailNext = false;
wrap('exam.start', async (prev, o = {}) => {
  const r = await prev?.(o);
  if (r && o.kind !== 'judge') {
    emit('exam', { kind: o.kind, passed: r.passed });
    note(r.passed ? 'exam.passed' : 'exam.failed');
    if (r.passed) setTimeout(() => cat('passed'), 600); else jailNext = true;
  }
  return r;
});
wrap('world.travel', async (prev, to) => {
  const r = await prev?.(to);
  if (to === 'depths.jail' && jailNext) {
    jailNext = false;
    note('jailed');
    const line = barkFor('jail');
    await new Promise((ok) => setTimeout(ok, 500));
    if (line) await call('story.say', 'narra', line);
    cat('failed');
  }
  return r;
});
wrap('reading.open', async (prev, o = {}) => { const r = await prev?.(o); if (o.client !== 'self') note('reading'); return r; });
wrap('lock.ask', async (prev, o) => { const ok = await prev?.(o); if (ok) note('lock'); return ok; });

// stuns and fires are counted by the world; Tartufo talks when she stands still for a while
let last = { stuns: 0, fires: 0, pos: '', still: 0, idleAt: 0 };
export function tick(now = Date.now()) {
  const s = state.stats;
  if ((s.stuns || 0) > last.stuns) note('stun');
  if ((s.fires || 0) > last.fires) note('fire');
  last.stuns = s.stuns || 0; last.fires = s.fires || 0;
  const p = state.pos ? `${state.pos.map}:${state.pos.x}:${state.pos.y}` : '';
  if (p !== last.pos || blocked()) { last.pos = p; last.still = now; return; }
  if (now - last.still > 45000 && now - last.idleAt > GAP) { last.idleAt = now; cat('idle'); }
}
if (typeof window !== 'undefined') setInterval(() => { try { tick(); } catch (e) { console.error('[glue] tick', e); } }, 5000);
