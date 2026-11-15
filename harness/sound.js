// Harness for the sound area: a button per mood and per effect, the two switches, and an offline
// measure (OfflineAudioContext) that renders every mood and effect and logs peak and RMS.
// Results: console.log lines "SOUND mood x ...", window.__checks, and the #report block.
import { state } from '../src/core/state.js';
import { emit } from '../src/core/bus.js';
import { call } from '../src/core/services.js';
import { status } from '../src/sound/index.js';
import { createEngine } from '../src/sound/engine.js';
import { MOOD_NAMES } from '../src/sound/moods.js';
import { SFX_NAMES } from '../src/sound/sfx.js';

const $ = (id) => document.getElementById(id);
const el = (tag, text, fn) => { const b = document.createElement(tag); b.textContent = text; b.onclick = fn; return b; };
const tension = () => Number($('tension').value);

for (const m of MOOD_NAMES) $('moods').append(el('button', m, (e) => { call('sound.mood', m, { tension: tension() }); for (const b of $('moods').children) b.classList.toggle('on', b === e.target); }));
for (const s of SFX_NAMES) $('sfxs').append(el('button', s, () => call('sound.play', s)));
for (const [t, ev, d] of [['card:found', 'card:found', { id: 'm01' }], ['card:star', 'card:star', { id: 'm01', stars: 1 }], ['level:up', 'level:up', { level: 2 }], ['coins +5', 'coins', { n: 5 }], ['coins -5 (silent)', 'coins', { n: -5 }], ['cinema on', 'cinema', true], ['cinema off', 'cinema', false]]) $('bus').append(el('button', t, () => emit(ev, d)));
$('music').onchange = (e) => call('sound.music', e.target.checked);
$('sfx').onchange = (e) => call('sound.sfx', e.target.checked);
$('stop').onclick = () => call('sound.stop');
$('tension').oninput = () => { $('tv').textContent = tension(); call('sound.mood', 'exam', { tension: tension() }); };
$('music').checked = state.settings.music; $('sfx').checked = state.settings.sfx;
setInterval(() => { $('status').textContent = JSON.stringify(status()); }, 500);

// ---- offline measure
const SR = 44100;
function stats(buf) {
  let peak = 0, q = 0, d = 0, n = 0, prev = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const x = buf.getChannelData(c); prev = 0;
    for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > peak) peak = a; q += x[i] * x[i]; d += (x[i] - prev) ** 2; prev = x[i]; n++; }
  }
  const rms = Math.sqrt(q / n);
  return { peak: +peak.toFixed(4), rms: +rms.toFixed(5), bright: +(Math.sqrt(d / n) / (rms || 1)).toFixed(4) };
}
async function render(secs, setup) {
  const oc = new OfflineAudioContext(2, Math.floor(SR * secs), SR);
  const eng = createEngine(oc, { seed: 3 });
  setup(eng);
  const buf = await oc.startRendering();
  return { ...stats(buf), counts: { ...eng.counts } };
}
async function measure() {
  const out = { moods: {}, sfx: {}, problems: [] };
  const log = (kind, name, r) => console.log(`SOUND ${kind} ${name} rms=${r.rms} peak=${r.peak} bright=${r.bright}${r.counts ? ` events=${JSON.stringify(r.counts)}` : ''}`);
  for (const m of MOOD_NAMES) {
    const r = await render(30, (e) => { e.setMood(m, { tension: m === 'exam' ? 0.5 : 0 }); e.pump(30); });
    out.moods[m] = r; log('mood', m, r);
    if (r.rms < 0.0005) out.problems.push(`mood ${m} is silent`);
    if (r.peak >= 1) out.problems.push(`mood ${m} clips`);
  }
  for (const t of [0, 1]) { const r = await render(20, (e) => { e.setMood('exam', { tension: t }); e.pump(20); }); out.moods[`exam@${t}`] = r; log('mood', `exam@${t}`, r); }
  if (!(out.moods['exam@1'].counts.pulse > out.moods['exam@0'].counts.pulse * 2)) out.problems.push('exam does not speed up with tension');
  const names = Object.keys(out.moods).filter((k) => !k.startsWith('exam@'));
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const a = out.moods[names[i]], b = out.moods[names[j]], rel = (x, y) => Math.abs(x - y) / Math.max(x, y, 1e-9);
    if (rel(a.rms, b.rms) < 0.03 && rel(a.bright, b.bright) < 0.03) out.problems.push(`moods ${names[i]} and ${names[j]} look the same`);
  }
  for (const s of SFX_NAMES) {
    const r = await render(s === 'bell' || s === 'purr' ? 9 : 3, (e) => { e.sfx(s, 0.05); });
    out.sfx[s] = r; log('sfx', s, r);
    if (r.peak < 0.003) out.problems.push(`sfx ${s} is silent`);
    if (r.peak >= 1) out.problems.push(`sfx ${s} clips`);
  }
  out.problems.length || console.log('SOUND all checks passed');
  for (const p of out.problems) console.log(`SOUND PROBLEM ${p}`);
  window.__checks = out;
  $('report').textContent = JSON.stringify(out, null, 1);
  return out;
}
$('measure').onclick = measure;
window.__measure = measure;
