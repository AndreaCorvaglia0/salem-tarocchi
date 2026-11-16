// Small random helpers. Every function that needs chance takes an `rng` (a () => [0, 1) function).

// mulberry32: a tiny seeded generator, so a reading can be reproduced from a number.
export const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const pick = (list, rng = Math.random) => list[Math.floor(rng() * list.length)];

// Fisher-Yates on a copy.
export const shuffle = (list, rng = Math.random) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
