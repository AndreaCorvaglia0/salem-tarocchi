// How she plays feeds the portrait (docs/CONTRACT.md "Portrait and visits", behaviour): pure rules,
// no bus, no state writes. glue/traits.js wires them. Tests: tests/glue.traits.test.mjs.
//   const f = createFeeds({ gap, direct })
//   f.seen(anchor, pathAnchors, now)        a new place: off the main path -> { esplora: +1 }
//   f.talk(at, stepAt, now)                 a chat not on the way of the current step -> { esplora: +1 }
//   f.step(walked, now)                     a step reached: straight there, no detour -> { esplora: -1 }
//   f.patrol(now) / f.stun(now)             -> { rischio: +1 }      f.bottle(now) -> { rischio: -1 }
// Each returns the delta for addTrait, or null; each kind at most once per `gap` ms.
export const GAP = 3 * 60000;
export const DIRECT = 70; // tiles walked between two steps that still count as "straight there"

export function createFeeds({ gap = GAP, direct = DIRECT } = {}) {
  const last = {};
  let detour = false; // since the last step: an off-path place or an optional chat
  const once = (k, now, delta) => {
    if (last[k] != null && now - last[k] < gap) return null;
    last[k] = now;
    return delta;
  };
  return {
    seen(anchor, pathAnchors = [], now = Date.now()) {
      if (!anchor || pathAnchors.includes(anchor) || /\.door$/.test(anchor)) return null;
      detour = true;
      return once('seen', now, { esplora: 1 });
    },
    talk(at, stepAt, now = Date.now()) {
      if (!at || at === stepAt) return null;
      detour = true;
      return once('talk', now, { esplora: 1 });
    },
    step(walked, now = Date.now()) {
      const straight = !detour && walked > 0 && walked <= direct;
      detour = false;
      return straight ? once('step', now, { esplora: -1 }) : null;
    },
    patrol(now = Date.now()) { return once('patrol', now, { rischio: 1 }); },
    stun(now = Date.now()) { return once('stun', now, { rischio: 1 }); },
    bottle(now = Date.now()) { return once('bottle', now, { rischio: -1 }); },
  };
}
