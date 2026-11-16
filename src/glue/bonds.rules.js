// Pure rules for glue/bonds.js (tests/glue.bonds.test.mjs).

// The popularity line a person says now: the highest level reached that is theirs and not said yet.
// lines: [{ level, who, t }]; said(level) -> bool.
export function popLine({ who, level = 0, said = () => false, lines = [] } = {}) {
  return (lines || []).filter((l) => l && l.who === who && l.level <= level && !said(l.level))
    .sort((a, b) => b.level - a.level)[0] || null;
}

// Does a script move the main path (a step, a chapter, a jump to one that does)? Then it is a scene, not
// a free talk. scripts: { id: nodes }.
export function movesStory(id, scripts, seen = new Set()) {
  if (!id || seen.has(id)) return false;
  seen.add(id);
  const walk = (nodes) => Array.isArray(nodes) && nodes.some((n) => {
    if (!n || typeof n !== 'object') return false;
    if (n.do === 'step' || n.do === 'chapter') return true;
    if (n.do === 'goto') return movesStory(n.script, scripts, seen);
    if (walk(n.then) || walk(n.else)) return true;
    if (Array.isArray(n.choice)) return n.choice.some((o) => walk(o?.then));
    return false;
  });
  return walk(scripts?.[id]);
}
