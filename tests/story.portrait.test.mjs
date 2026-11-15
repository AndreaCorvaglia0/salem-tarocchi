// The final portrait lines (src/story/portrait.js) against the live data, whatever it holds now.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState } from '../src/core/state.js';
import { portraitLines } from '../src/story/portrait.js';
import { PORTRAIT } from '../src/data/portrait.js';

test('one line per axis present, by the value; never undefined', () => {
  setState({ traits: { esplora: 4, parola: -3, tono: 0 } });
  const lines = portraitLines();
  assert.ok(lines.every((l) => typeof l === 'string' && l));
  if (PORTRAIT.esplora?.plus) assert.ok(lines.includes(PORTRAIT.esplora.plus));
  if (PORTRAIT.parola?.minus) assert.ok(lines.includes(PORTRAIT.parola.minus));
  if (PORTRAIT.tono?.mid) assert.ok(lines.includes(PORTRAIT.tono.mid));
  setState({ traits: { esplora: 2 } });
  if (PORTRAIT.esplora?.mid) assert.ok(portraitLines().includes(PORTRAIT.esplora.mid), '2 is still the middle');
});

test('a torn axis says its own sentence', () => {
  setState({ traits: { guida: 0 }, hits: { guida: { plus: 4, minus: 4 } } });
  if (PORTRAIT.guida?.torn) assert.ok(portraitLines().includes(PORTRAIT.guida.torn));
});
