// Which season and which light a map has in a chapter. Pure: the scene, the harness and the
// tests read it. The village follows the story: winter (prologue, chapter 1), spring (2), autumn
// (3), and after the ending (4) an autumn dawn, the only time it is not night. The forest is in
// spring and summer in chapter 2 and in autumn from chapter 3. The depths are always autumn and dark.
// Rooms keep the season of the area outside (it only shows through their windows).
const OUTSIDE = { malva: 'village', cottage: 'village', court: 'village', meeting: 'village', shop: 'village' };

export function seasonFor(mapId, chapter = 1) {
  const id = OUTSIDE[mapId] || mapId;
  if (id === 'depths') return 'autumn';
  if (id === 'forest') return chapter >= 3 ? 'autumn' : 'spring';
  return chapter >= 3 ? 'autumn' : chapter === 2 ? 'spring' : 'winter';
}

// 'night' everywhere, 'dawn' only in the village after the ending.
export const lightFor = (mapId, chapter = 1) => ((OUTSIDE[mapId] || mapId) === 'village' && chapter >= 4 ? 'dawn' : 'night');
