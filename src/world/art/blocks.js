// One entry point for every block's picture: buildings, outdoor props and furniture.
import { house, cottage, shop, hut } from './houses.js';
import { meeting, court, mill } from './civic.js';
import { PROPS } from './props.js';
import { INSIDE } from './inside.js';
import { WILD } from './wild.js';
import { MARKS } from './marks.js';

const PAINTERS = { house, cottage, shop, hut, meeting, court, mill, ...PROPS, ...INSIDE, ...WILD, ...MARKS };

// -> { canvas, over, ox?, windows?, smoke?, wall? }
export function paintBlock(b, season) {
  const fn = PAINTERS[b.kind];
  if (!fn) throw new Error(`no art for block kind "${b.kind}"`);
  return { windows: [], smoke: null, ...fn(b, season) };
}
export const hasArt = (kind) => !!PAINTERS[kind];
