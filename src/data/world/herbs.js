// Where the real herbs grow in the world (src/data/herbs/base.js; sprites in src/world/art/herbs.js,
// behaviour in src/world/scene/herbs.js). One entry per plant on a tile: kitchen herbs by the houses and
// gardens of the village, wayside and woodland plants along the forest paths and round Ortica's hut, the
// poisonous ones in shady corners (behind the court, the graveyard, the den, the forest edge).
// Plants are not solid; a spot is never a path, a door, an anchor or a tile of something usable
// (tests/world.herbs.test.mjs checks it against the maps).
export const HERB_SPOTS = [
  // ---- the village ----
  // Malva's house and her garden (the herb bed by her door)
  { id: 'lavanda', map: 'village', x: 17, y: 36 },
  { id: 'rosmarino', map: 'village', x: 16, y: 35 },
  { id: 'salvia', map: 'village', x: 26, y: 35 },
  { id: 'melissa', map: 'village', x: 20, y: 39 },
  { id: 'timo', map: 'village', x: 28, y: 36 },
  { id: 'menta', map: 'village', x: 28, y: 37 },
  { id: 'alloro', map: 'village', x: 23, y: 38 },
  { id: 'calendula', map: 'village', x: 24, y: 38 },
  { id: 'camomilla', map: 'village', x: 22, y: 39 },
  // the arrival road (seen from the first minutes, usable later)
  { id: 'camomilla', map: 'village', x: 17, y: 41 },
  { id: 'achillea', map: 'village', x: 21, y: 42 },
  // the cottage
  { id: 'rosmarino', map: 'village', x: 6, y: 6 },
  { id: 'timo', map: 'village', x: 8, y: 4 }, // clear of the cottage's roof
  { id: 'alloro', map: 'village', x: 7, y: 5 },
  // the fenced herb beds of the upper village
  { id: 'lavanda', map: 'village', x: 35, y: 5 },
  { id: 'salvia', map: 'village', x: 34, y: 6 },
  // by the forest gate
  { id: 'artemisia', map: 'village', x: 16, y: 5 }, // clear of the bell tower
  { id: 'assenzio', map: 'village', x: 21, y: 6 },
  // the houses of the lower village
  { id: 'melissa', map: 'village', x: 10, y: 28 },
  { id: 'valeriana', map: 'village', x: 16, y: 29 },
  { id: 'verbena', map: 'village', x: 21, y: 29 },
  { id: 'achillea', map: 'village', x: 27, y: 28 },
  { id: 'calendula', map: 'village', x: 27, y: 30 },
  // round the black door of the shop
  { id: 'rosmarino', map: 'village', x: 13, y: 38 },
  { id: 'ruta', map: 'village', x: 14, y: 39 },
  { id: 'ortica', map: 'village', x: 3, y: 40 },
  { id: 'calendula', map: 'village', x: 5, y: 40 },
  { id: 'ruta', map: 'village', x: 36, y: 36 },
  // behind the court, in the dark yard by the trapdoor
  { id: 'belladonna', map: 'village', x: 39, y: 14 },
  { id: 'giusquiamo', map: 'village', x: 39, y: 18 },
  { id: 'stramonio', map: 'village', x: 37, y: 19 },

  // ---- the forest ----
  // Ortica's hut and her herb patch
  { id: 'ortica', map: 'forest', x: 12, y: 20 },
  { id: 'valeriana', map: 'forest', x: 11, y: 19 },
  { id: 'menta', map: 'forest', x: 10, y: 21 }, // a tile right of the beech round Ortica's hut
  { id: 'melissa', map: 'forest', x: 5, y: 22 },
  { id: 'camomilla', map: 'forest', x: 4, y: 23 },
  { id: 'artemisia', map: 'forest', x: 2, y: 18 },
  // along the path to the den and the graveyard
  { id: 'achillea', map: 'forest', x: 9, y: 11 },
  { id: 'verbena', map: 'forest', x: 15, y: 11 },
  { id: 'camomilla', map: 'forest', x: 16, y: 9 },
  // by the pond
  { id: 'menta', map: 'forest', x: 17, y: 16 },
  { id: 'valeriana', map: 'forest', x: 16, y: 17 },
  // the crossing and the spring
  { id: 'ortica', map: 'forest', x: 22, y: 19 },
  { id: 'verbena', map: 'forest', x: 29, y: 7 },
  // the campfire clearing and the boundary stone
  { id: 'assenzio', map: 'forest', x: 13, y: 29 },
  { id: 'achillea', map: 'forest', x: 16, y: 29 },
  { id: 'artemisia', map: 'forest', x: 34, y: 29 },
  // the graveyard (behind the brambles)
  { id: 'cicuta', map: 'forest', x: 8, y: 3 },
  { id: 'aconito', map: 'forest', x: 8, y: 5 },
  { id: 'belladonna', map: 'forest', x: 14, y: 5 },
  { id: 'giusquiamo', map: 'forest', x: 10, y: 7 },
  { id: 'stramonio', map: 'forest', x: 12, y: 5 },
  // the den, the forest edge
  { id: 'cicuta', map: 'forest', x: 5, y: 9 },
  { id: 'aconito', map: 'forest', x: 22, y: 36 },
];
