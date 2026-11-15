// Pure rules that decide whether a sound may play: the player's two settings (read live, every time)
// and a small throttle so that a tap storm does not stack effects. Tested in Node.

export const musicOn = (state) => state?.settings?.music !== false;
export const sfxOn = (state) => state?.settings?.sfx !== false;

// Minimum milliseconds between two plays of the same effect.
export const MIN_GAP = { step: 200, write: 220, tap: 45, page: 120, card: 90, default: 60 };
export function makeThrottle(gaps = MIN_GAP) {
  const last = new Map();
  return (name, nowMs) => {
    const gap = gaps[name] ?? gaps.default ?? 60, prev = last.get(name);
    if (prev !== undefined && nowMs - prev < gap) return false;
    last.set(name, nowMs);
    return true;
  };
}
// What the game wants to hear, apart from what the player allows: the mood and its options.
export function wantsMood(name, opts, known) {
  if (name === null || name === undefined) return { name: null, opts: {} };
  if (!known.includes(name)) return null;
  const t = Number(opts?.tension);
  return { name, opts: { tension: Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0 } };
}
