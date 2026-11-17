// The pure part of her notes on the places of the map (data: src/data/world/notes.js; drawn by mappa.js).
// No DOM: tests call it with their own condition tester.
//   placeNotes(place, t)  -> { known, unknown, named, lines: [{ key, t }] } the last three notes that hold
//   state.notesAck        { '<place>|<hash>': true } the notes she has already read; null/missing = a save from
//                         before the notes: everything true now is acknowledged at the first opening, so an
//                         old save does not show every note as new
import { PLACE_NOTES } from '../data/world/notes.js';

export const SHOWN = 3;
// a short stable key for a note: its place and a hash of its text (a reworded note shows as new, once)
const hash = (str) => { let x = 5381; for (const c of String(str)) x = ((x * 33) ^ c.charCodeAt(0)) >>> 0; return x.toString(36); };
export const noteKey = (place, text) => `${place}|${hash(text)}`;

export function placeNotes(place, t) {
  const P = PLACE_NOTES[place];
  if (!P) return { known: false, unknown: '', named: true, lines: [] };
  const all = P.notes.filter((n) => t(n.if)).map((n) => ({ key: noteKey(place, n.t), t: n.t }));
  return { known: all.length > 0, unknown: P.unknown, named: !!P.named, lines: all.slice(-SHOWN) };
}

const ackOf = (s) => (s.notesAck && typeof s.notesAck === 'object' && !Array.isArray(s.notesAck) ? s.notesAck : null);
// first opening on a save without notesAck: everything true now is acknowledged. Returns true if it changed s.
export function adoptNotes(s, t) {
  if (ackOf(s)) return false;
  s.notesAck = {};
  for (const place of Object.keys(PLACE_NOTES)) for (const n of PLACE_NOTES[place].notes) if (t(n.if)) s.notesAck[noteKey(place, n.t)] = true;
  return true;
}
// the keys of the notes of a place that hold and that she has not read yet
export function freshNotes(s, place, t) {
  const ack = ackOf(s) || {};
  return placeNotes(place, t).lines.filter((l) => !ack[l.key]).map((l) => l.key);
}
// she opened the place: what she sees now is read
export function readNotes(s, place, t) {
  const ack = ackOf(s) || (s.notesAck = {});
  let dirty = false;
  for (const l of placeNotes(place, t).lines) if (!ack[l.key]) { ack[l.key] = true; dirty = true; }
  return dirty;
}
