// What lies on the ground to be picked up for the grimoire's albums (notes/collezioni.md): a stone, or one to
// three figures of the peddler's sibyl (a bundle is tied with string). Sprites in src/world/art/finds.js,
// behaviour in src/world/scene/finds.js, taking them in src/glue/collect.js.
//   id     never changes (state.world.once['find.<id>'] remembers it was taken)
//   stone  a stone id (src/data/stones.js), or sibyl: [card numbers] (src/data/sibyl.js)
//   map, x, y   an outdoor tile of open ground: not a path, a door, an anchor, a herb, a patrol's round
//               (tests/world.finds.test.mjs checks it, and that she can walk there)
//   when   a condition on what she has (src/core/cond.js): some places only give something later
//   where  where she found it, in her words, for the album page
// Stones lie where their element and planet make sense, one of each kind at most; the other stones and most
// of the figures are given by people (src/data/gifts.js). The pencil map never marks these spots.
export const FIND_SPOTS = [
  // ---- stones ----
  { id: 'st.pond', stone: 'ametista', map: 'forest', x: 20, y: 14, where: "sulla riva dello stagno, nel bosco" }, // water, Jupiter
  { id: 'st.stream', stone: 'pietra-forata', map: 'forest', x: 31, y: 21, when: { chapterMin: 2 }, where: 'sulla sponda del ruscello, vicino al mulino' }, // water
  { id: 'st.spring', stone: 'quarzo-ialino', map: 'forest', x: 27, y: 6, when: { power: 'sense' }, where: 'accanto alla fonte, in alto nel bosco' }, // water, Moon
  { id: 'st.graves', stone: 'tormalina-nera', map: 'forest', x: 14, y: 7, when: { chapterMin: 2 }, where: 'tra le tombe del cimitero del bosco' }, // earth, Saturn
  { id: 'st.fire', stone: 'occhio-di-tigre', map: 'forest', x: 17, y: 30, where: 'vicino al fuoco del bivacco' }, // fire, Sun
  { id: 'st.board', stone: 'agata', map: 'village', x: 14, y: 13, where: 'vicino alla bacheca degli avvisi, sotto la casa delle riunioni' }, // air, Mercury: words and notices
  { id: 'st.venus', stone: 'lapislazzuli', map: 'village', x: 26, y: 33, when: { flag: 'met.ginepra' }, where: 'dietro la canonica, sotto il davanzale del bicchiere di Venere' }, // water, Venus
  // ---- the peddler's figures ----
  { id: 'sb.cottage', sibyl: [1, 2], map: 'village', x: 9, y: 6, where: "accanto all'orto della mia capanna" },
  { id: 'sb.road', sibyl: [3, 35, 34], map: 'village', x: 7, y: 42, where: 'sul bordo della strada che viene dal porto' },
  { id: 'sb.garden', sibyl: [9, 20], map: 'village', x: 28, y: 39, where: "vicino all'orto di Malva" },
  { id: 'sb.houses', sibyl: [4, 13, 17], map: 'village', x: 16, y: 27, when: { chapterMin: 2 }, where: 'davanti alle case di sotto, vicino a una soglia' },
  { id: 'sb.roots', sibyl: [5, 21], map: 'forest', x: 6, y: 12, where: 'tra le radici, vicino alla tana' },
  { id: 'sb.cross', sibyl: [22, 16], map: 'forest', x: 17, y: 23, when: { chapterMin: 2 }, where: 'al bivio del bosco, sotto il cartello' },
  { id: 'sb.ruin', sibyl: [28, 29, 24], map: 'depths', x: 18, y: 20, where: 'nelle cantine, ai piedi della torre della prigione' },
  { id: 'sb.marsh', sibyl: [7, 10], map: 'depths', x: 33, y: 25, when: { power: 'move' }, where: 'tra i sassi, vicino al pozzo vecchio delle cantine' },
];
