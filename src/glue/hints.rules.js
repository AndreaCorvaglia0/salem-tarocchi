// Where the trail of lights points (pure: tests/glue.hints.test.mjs).
//   trailTarget({ chapter, step, steps, found, temp }) -> anchor | null
// Chapters 0-1: always the current step's `at`; later only while `temp` (she asked from the HUD).
// On the arrival road (notes/world.md) the first card lies at `village.road_card`, a few steps ahead
// of `village.arrival` where she stands: while only the Fool is found, the trail goes to the card.
export const TRAIL_MS = 8000;

export function trailTarget({ chapter = 0, step = null, steps = [], found = [], temp = false } = {}) {
  if (chapter > 1 && !temp) return null;
  const at = (Array.isArray(steps) ? steps.find((s) => s && s.id === step) : null)?.at || null;
  if (!at) return null;
  if (at === 'village.arrival' && found.filter((id) => id !== 'm00').length === 0) return 'village.road_card';
  return at;
}
