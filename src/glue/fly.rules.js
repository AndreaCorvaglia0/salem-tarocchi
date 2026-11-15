// The broom (power `broom`, level 6): a flight from the grimoire's map to a place she has seen.
// Pure rules (tests/glue.fly.test.mjs): where she may take off and where she may land.
//   canFly({ broom, map, inside, near, fog, script, spotted }) -> { ok, why }
//   canLand(anchor, { seen, insideMaps }) -> boolean
// No take-off or landing indoors or underground (interiors, the depths), in thick fog, from the cell,
// while a script is running, or while a patrol has spotted her. `why` is one line for the grimoire.
export const OUTDOOR = ['village', 'forest'];
export const CELL = ['depths.jail', 'depths.cells'];

export function canFly({ broom = false, map = null, inside = false, near = null, fog = false, script = false, spotted = false } = {}) {
  if (!broom) return { ok: false, why: '' };
  if (CELL.includes(near)) return { ok: false, why: 'Da una cella non si vola via.' };
  if (inside) return { ok: false, why: 'Al chiuso la scopa non si alza: devo uscire all\'aperto.' };
  if (!OUTDOOR.includes(map)) return { ok: false, why: 'Qui sotto non c\'è cielo: devo tornare in superficie.' };
  if (fog) return { ok: false, why: 'Nella nebbia fitta non vedrei dove atterrare.' };
  if (spotted) return { ok: false, why: 'Mi stanno guardando: non è il momento di volare.' };
  if (script) return { ok: false, why: 'Adesso no: prima devo finire quello che sto facendo.' };
  return { ok: true, why: '' };
}

// seenPlace: the caller already knows she has seen it (the map counts a place seen from its doors too)
export const canLand = (anchor, { seen = {}, seenPlace = false } = {}) => typeof anchor === 'string' && OUTDOOR.includes(anchor.split('.')[0]) && (seenPlace || !!seen[anchor]);
