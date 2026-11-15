// Plays the whole main path with the real runner (src/story/runner.js) and fake UI/services:
// at each step the world would show the CAST entry that matches; we run it, find a few cards
// between steps like a player would, and check that the path reaches the end. Both sides of each fork.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { findCard, setPlayer, levelOf } from '../src/core/progress.js';
import { test as cond } from '../src/core/cond.js';
import { MAJORS } from '../src/data/cards.base.js';
import { SCRIPTS, SESSIONS, STEPS, CAST } from '../src/data/story/index.js';
import { createRunner, cardOfNumber } from '../src/story/runner.js';

function play(pick) {
  setState({});
  const warnings = [];
  let runner;
  const ext = async (n, api) => {
    if (n.ask === 'name') { setPlayer({ name: 'Viola' }); return true; }
    if (n.ask === 'birth') { setPlayer({ birth: { d: 3, m: 10, y: 1996 } }); return true; }
    if (n.turn) { findCard(n.turn, { silent: true }); return true; }
    if (n.pick === 'number') { api.vars.picked = cardOfNumber(7); return (await api.exec(n.then)) || true; }
    if (n.observe) { assert.ok(n.observe.some((o) => cond(o.when)), 'no observe line holds'); return true; }
    if (n.empty) return true; // the last image (session.js)
    return false;
  };
  const call = async (name, arg) => {
    if (name === 'card.found') { findCard(arg); return; }
    if (name === 'draw.pick') return arg.pool.find((id) => !state.cards[id]?.found) || arg.pool[0];
    if (name === 'exam.start') return { passed: pick.pass };
    if (name === 'story.session') return runner.exec(SESSIONS[arg]);
    return null;
  };
  let choiceN = 0;
  const ui = { say() {}, choose: (opts) => (pick.choose(choiceN++, opts)), cinema() {}, moment() {}, sleep() {}, end() {} };
  runner = createRunner({ ui, call, getScript: (id) => SCRIPTS[id], ext, warn: (...a) => warnings.push(a.join(' ')) });
  return { runner, warnings };
}

async function walkPath(pick) {
  const { runner, warnings } = play(pick);
  await runner.run(SESSIONS.s0);
  const seen = [];
  for (let guard = 0; guard < 80 && state.step !== 'post.minors'; guard++) {
    const before = state.step;
    seen.push(before);
    const at = STEPS.find((s) => s.id === before).at;
    const entry = CAST.find((c) => c.at === at && cond(c.when));
    assert.ok(entry, `no cast entry for step ${before}`);
    await runner.run(entry.script);
    if (state.step === before) {
      // a gate refused: find the next missing Major with a spot, like a player would
      const next = MAJORS.find((c) => c.spot && !state.cards[c.id]?.found && c.row <= state.chapter && c.id !== 'm07');
      assert.ok(next, `stuck at ${before}`);
      findCard(next.id);
    }
  }
  return { seen, warnings };
}

for (const [label, pick] of [
  ['first options, exams passed', { pass: true, choose: () => 0 }],
  ['last options, exams failed', { pass: false, choose: (_, o) => o.length - 1 }],
]) {
  test(`main path: ${label}`, async () => {
    const { seen, warnings } = await walkPath(pick);
    assert.deepEqual(warnings, []);
    assert.equal(state.step, 'post.minors');
    assert.equal(state.chapter, 4);
    assert.ok(state.flags['ending.seen']);
    for (const id of ['m07', 'm19', 'm20', 'm21']) assert.ok(state.cards[id]?.found, id);
    for (const k of ['value', 'fear', 'dream']) assert.ok(state.words[k], k);
    const forks = pick.pass ? ['b1.spoke', 'b2.went', 'b3.stealth'] : ['b1.hid', 'b2.stayed', 'b3.open'];
    for (const f of forks) assert.ok(state.flags[f], f);
    // every step was a stop of the path, except those crossed inside one run (s0, the trial, the dawn)
    // and the other face of fork 3
    const passing = ['p.session', 'c3.trial', 'f.dawn', 'post.minors'];
    const skipped = STEPS.map((s) => s.id).filter((id) => !seen.includes(id) && !passing.includes(id));
    assert.deepEqual(skipped, [pick.pass ? 'c3.court' : 'c3.jail']);
    // no stars earned here: cards and story alone; stars (+10 each) bring the rest
    assert.ok(state.xp >= 500 && state.xp <= 730, `xp ${state.xp}`);
    assert.ok(levelOf() >= 7);
    if (process.env.SHOW_XP) console.log(label, "xp", state.xp, "level", levelOf(), "majors", Object.keys(state.cards).length);
  });
}
