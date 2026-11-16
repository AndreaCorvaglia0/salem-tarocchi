// Where the game is kept besides localStorage, which a phone may empty at any time (the Claude app does
// it when the page is closed). Three more places, each optional and each guarded:
//   - IndexedDB, in the same browser (a different store: it may survive where localStorage does not);
//   - the artifact's own store (`db` capability), in the player's private subtree `data/users/<id>/save`:
//     it follows her account, whatever the phone does. Only for a viewer who may write there;
//   - a code she can copy and paste back (exportCode / importCode): works everywhere, by hand.
// restore(): asks every place, and takes the newest started game (state.savedAt) if it is newer than
// the one in memory. Call it once before the title; `freeze()` when the game begins, so nothing is
// swapped under her feet. status(): what is known about where the game is kept, for the interface.
import { state, onSaved, onArchive, adopt, parseSave, savedAtOf, saveNow } from './state.js';
import { emit } from './bus.js';

const NAME = 'salem-tarocchi', STORE = 'kv';
const withTimeout = (p, ms, v = null) => Promise.race([Promise.resolve(p).catch(() => v), new Promise((r) => setTimeout(() => r(v), ms))]);

// ---- IndexedDB -------------------------------------------------------------------------------------
let idbP = null;
const idb = () => (idbP ||= new Promise((res) => {
  try {
    const rq = globalThis.indexedDB?.open(NAME, 1);
    if (!rq) return res(null);
    rq.onupgradeneeded = () => rq.result.createObjectStore(STORE);
    rq.onsuccess = () => res(rq.result);
    rq.onerror = rq.onblocked = () => res(null);
  } catch { res(null); }
}));
const idbGet = async (k) => { const d = await idb(); if (!d) return null; return new Promise((res) => { try { const rq = d.transaction(STORE).objectStore(STORE).get(k); rq.onsuccess = () => res(rq.result ?? null); rq.onerror = () => res(null); } catch { res(null); } }); };
const idbPut = async (k, v) => { const d = await idb(); if (!d) return false; return new Promise((res) => { try { const tx = d.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(v, k); tx.oncomplete = () => res(true); tx.onerror = tx.onabort = () => res(false); } catch { res(false); } }); };

// ---- the artifact's store ---------------------------------------------------------------------------
// cloud: null = not known yet, false = not available to this viewer, true = a write has been confirmed
const st = { cloud: null, idb: null, cloudAt: 0, restored: null };
let docsP = null;
const docs = () => (docsP ||= (async () => {
  const use = globalThis.claude?.use;
  if (typeof use !== 'function') return null;
  const [db, user] = await Promise.all([withTimeout(use.call(globalThis.claude, 'db'), 8000), withTimeout(use.call(globalThis.claude, 'user'), 8000)]);
  const id = db && user ? await withTimeout(user.id(), 5000) : null;
  if (!id) return null;
  try { return { save: db.doc(`data/users/${id}/save`), old: db.doc(`data/users/${id}/old`) }; } catch { return null; }
})());
const cloudGet = async (which = 'save') => {
  const d = await docs();
  if (!d) { st.cloud = false; return null; }
  const snap = await withTimeout(d[which].get(), 8000);
  const body = snap?.exists ? snap.data() : null;
  return typeof body?.s === 'string' ? body.s : null;
};
const LIMIT = 200 * 1024;
let writing = false, queued = null, lastCloud = 0, cloudT = 0;
async function cloudPut(raw, which = 'save') {
  const d = await docs();
  if (!d || st.cloud === false || raw.length > LIMIT) { if (!d) st.cloud = false; return false; }
  try { await d[which].set({ v: 1, at: Date.now(), s: raw }); if (st.cloud !== true) { st.cloud = true; emit('vault', status()); } st.cloudAt = Date.now(); return true; } catch (e) {
    // a viewer who may only read: stop trying for this visit
    if (e?.code && e.code !== 'unavailable' && e.code !== 'resource_exhausted') { st.cloud = false; emit('vault', status()); }
    return false;
  }
}
// one write at a time, the latest state only, not more often than every 20 seconds (at once when she leaves)
async function flushCloud() {
  if (writing || !queued) return;
  writing = true;
  try { while (queued) { const raw = queued; queued = null; lastCloud = Date.now(); await cloudPut(raw); } } finally { writing = false; }
}
function mirror(raw) {
  idbPut('save', raw).then((ok) => { st.idb = ok; });
  if (st.cloud === false) return;
  queued = raw;
  clearTimeout(cloudT);
  cloudT = setTimeout(flushCloud, Math.max(1500, 20000 - (Date.now() - lastCloud)));
}
onSaved(mirror);
onArchive((raw) => { idbPut('old', raw); cloudPut(raw, 'old'); });
const leaving = () => { if (!state.started) return; saveNow(); clearTimeout(cloudT); flushCloud(); };
globalThis.addEventListener?.('pagehide', leaving);
globalThis.document?.addEventListener?.('visibilitychange', () => { if (document.visibilityState === 'hidden') leaving(); });
// ask the browser to keep this page's storage (it may say no; nothing depends on the answer)
try { globalThis.navigator?.storage?.persist?.().catch(() => {}); } catch { /* */ }

// ---- restore ---------------------------------------------------------------------------------------
let frozen = false, restoreP = null;
export const freeze = () => { frozen = true; };
const consider = (raw, from) => {
  if (frozen || !raw) return false;
  const s = parseSave(raw);
  if (savedAtOf(s) <= savedAtOf(state)) return false;
  if (!adopt(raw)) return false;
  st.restored = from; emit('vault', status());
  return true;
};
// -> resolves when every place has answered (or given up); the state may have been replaced meanwhile
export const restore = () => (restoreP ||= Promise.all([
  idbGet('save').then((raw) => { st.idb = raw != null ? true : st.idb; consider(raw, 'idb'); }),
  cloudGet('save').then((raw) => { consider(raw, 'cloud'); }),
]).catch(() => {}).then(() => {
  // a game that is only here: copy it to the other places now
  if (state.started && !frozen) { let raw = null; try { raw = JSON.stringify(state); } catch { /* */ } if (raw) mirror(raw); }
  emit('vault', status());
}));
// the game set aside by "Nuova partita", from the first place that still has it
export const olderGame = async () => {
  for (const get of [() => { try { return globalThis.localStorage?.getItem('salem-tarocchi-v1-old') || null; } catch { return null; } }, () => idbGet('old'), () => cloudGet('old')]) {
    const raw = await get();
    if (raw && parseSave(raw)?.started) return raw;
  }
  return null;
};
export const status = () => ({ cloud: st.cloud, idb: st.idb, restored: st.restored });

// ---- the code --------------------------------------------------------------------------------------
const PRE = 'SALEM1.';
const b64 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64 = (t) => { const s = atob(t.replace(/-/g, '+').replace(/_/g, '/')); const out = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i); return out; };
const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
export async function exportCode(raw = JSON.stringify(state)) {
  const bytes = new TextEncoder().encode(raw);
  try { if (globalThis.CompressionStream) return `${PRE}z.${b64(await pipe(bytes, new CompressionStream('deflate-raw')))}`; } catch { /* plain */ }
  return `${PRE}p.${b64(bytes)}`;
}
// -> the saved game as a JSON string, or null if the text is not a code of this game
export async function decodeCode(text) {
  try {
    const t = String(text || '').replace(/\s+/g, '');
    const i = t.indexOf(PRE);
    if (i < 0) return null;
    const [kind, body] = [t.slice(i + PRE.length, i + PRE.length + 1), t.slice(i + PRE.length + 2)];
    const bytes = kind === 'z' ? await pipe(unb64(body), new DecompressionStream('deflate-raw')) : unb64(body);
    const raw = new TextDecoder().decode(bytes);
    return parseSave(raw)?.started ? raw : null;
  } catch { return null; }
}
export const importCode = async (text) => { const raw = await decodeCode(text); return raw ? adopt(raw) : false; };
export const takeOlder = async () => { const raw = await olderGame(); return raw ? adopt(raw) : false; };
