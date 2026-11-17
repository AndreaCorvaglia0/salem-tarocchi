// One entry point for every block's picture: buildings, outdoor props and furniture.
import { hut } from './houses.js';
import { townHouse, courtHouse, libraryHouse, meetingHouse, blackShop, millHouse, bigTree } from './facades.js';
import { malvaHouse, cottageHome, orticaHut } from './witchhomes.js';
import { PROPS } from './props.js';
import { INSIDE } from './inside.js';
import { WILD } from './wild.js';
import { MARKS } from './marks.js';
import { ELSEWHERE } from './elsewhere.js';

// the buildings (notes/buildings.md): every one you can enter has its own shape and its sign; `house` is the
// ordinary one in its variants (plain, rich, ruined). The older painters (houses.js, civic.js) stay for the
// proof board.
const PAINTERS = {
  house: townHouse, cottage: cottageHome, malva: malvaHouse, library: libraryHouse, court: courtHouse, meeting: meetingHouse,
  shop: blackShop, mill: millHouse, ortica: orticaHut, bigtree: bigTree, hut, ...PROPS, ...INSIDE, ...WILD, ...MARKS, ...ELSEWHERE };

// -> { canvas, over, ox?, windows?, smoke?, wall? }
export function paintBlock(b, season) {
  const fn = PAINTERS[b.kind];
  if (!fn) throw new Error(`no art for block kind "${b.kind}"`);
  return { windows: [], smoke: null, ...fn(b, season) };
}
export const hasArt = (kind) => !!PAINTERS[kind];
