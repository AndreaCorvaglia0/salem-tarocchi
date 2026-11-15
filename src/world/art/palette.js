// Colours. The same art re-tints by season (winter village, spring forest, autumn depths) and
// everything is painted for the night: cool, a little desaturated, warm only where there is light.
export const INK = '#120f1c';
export const NIGHT = { tint: 0x070a24, outside: 0.6, inside: 0.36, dark: 0.94 };

export const SEASONS = {
  winter: {
    ground: ['#59688c', '#7787ab', '#94a4c6', '#b3c1dc'], // deep .. light snow
    path: ['#363a50', '#42465e', '#4f546c'],
    soil: ['#3d3240', '#51424f'],
    leaf: ['#22323a', '#2e4448', '#3f5a5a', '#5a7774'], // evergreen
    crown: null, // deciduous trees are bare
    snow: '#d5deee', snowShade: '#a3b2cf',
    grass: ['#6e5f48', '#94805c', '#c2ad7c'], // dry reeds through the snow
    water: ['#6f88a8', '#8fa7c4', '#c7d6ea'], ice: true,
    bark: ['#2b2129', '#43333a', '#5c4a4c'],
    flower: ['#c7d6ea', '#dfe7f4'],
  },
  spring: {
    ground: ['#23402f', '#2f5338', '#3d6843', '#527d4e'],
    path: ['#4f4334', '#665642', '#7d6a50'],
    soil: ['#3a2d26', '#4c3a2f'],
    leaf: ['#1c3328', '#27452f', '#36603b', '#4f7f48'],
    crown: ['#1c3328', '#2a4a30', '#3c6b3d', '#5c8e4f', '#d9a6c4'], // with a few blossoms
    snow: null,
    grass: ['#24452a', '#356138', '#5d8c4a'],
    water: ['#1d3a4e', '#2a5068', '#5f8fa8'],
    bark: ['#2b2125', '#3f3030', '#56443d'],
    flower: ['#d9a6c4', '#e8d98a', '#b9c8f0'],
  },
  autumn: {
    ground: ['#2b2024', '#3b2b2a', '#4e3a31', '#66493a'],
    path: ['#2f2a2c', '#403838', '#524744'],
    soil: ['#2a1f1f', '#3a2b28'],
    leaf: ['#2a2a22', '#3b3a2a', '#545033', '#6e6a40'],
    crown: ['#3a1d18', '#5c2a1c', '#8a4423', '#b5662e', '#d99a45'],
    snow: null,
    grass: ['#4a2c1e', '#6b3f24', '#93602f'],
    water: ['#141e1c', '#1f2d29', '#3c5048'],
    bark: ['#1f191b', '#2f2627', '#433636'],
    flower: ['#b5662e', '#d99a45'],
  },
};

// Hand-made materials that do not change with the season.
export const M = {
  wood: ['#2a1c19', '#3e2a22', '#56392b', '#6e4a35', '#8a6243'],
  stone: ['#262531', '#36353f', '#4a4854', '#615e69', '#7d7984'],
  cobble: ['#23222c', '#34333e', '#45444f', '#56545f'],
  plaster: ['#4c4651', '#625b66', '#7a727b'],
  clap: ['#20232f', '#2b2f3d', '#373c4c', '#454b5c'], // dark clapboard, the Salem houses
  roof: { plum: ['#2a1a2c', '#3d2540', '#553457'], slate: ['#1d2230', '#283044', '#35405a'], moss: ['#1d2a24', '#283a30', '#36503f'], brown: ['#2a1d19', '#3c2a22', '#523a2d'], red: ['#2e1617', '#432023', '#5c2c2e'] },
  lit: ['#f2b14a', '#ffd683', '#fff1c4'], litDim: '#a8692c',
  dark: ['#121522', '#1b2033'],
  metal: ['#1d1f26', '#2f323b', '#4a4e59', '#6d7280'],
  cloth: { violet: ['#3a2348', '#553368', '#734a88'], ochre: ['#6b4a1d', '#8f6527', '#b88935'], red: ['#4a1d22', '#6b2a2e', '#8f3d3c'], cream: ['#8f8778', '#b3aa98', '#d3cab6'] },
  fire: ['#7a2a14', '#c4521c', '#f08a2c', '#ffd27a', '#fff3c8'],
  bone: ['#8a8578', '#b4ad9c', '#d8d1bf'],
  herb: ['#2c4a30', '#3f6a3f', '#6b8f4f', '#a08ab8'],
  inside: { floor: ['#2e211d', '#3d2c25', '#4d382d', '#5b4434'], flag: ['#2a2830', '#36343d', '#45424c', '#55525c'], rug: ['#3f1f2a', '#5c2c38', '#7a3d45', '#9a6a4a'] },
};
