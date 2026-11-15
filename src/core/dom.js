// DOM helpers for everything that is not the pixel world: overlays live in #ui, above the canvas.
// h('div.box', { onclick }, 'text', child)   class names after dots, an id after '#'.
export const h = (spec, props, ...kids) => {
  const [tagId, ...cls] = spec.split('.');
  const [tag, id] = tagId.split('#');
  const el = document.createElement(tag || 'div');
  if (id) el.id = id;
  if (cls.length) el.className = cls.join(' ');
  if (props && (typeof props !== 'object' || props instanceof Node || Array.isArray(props))) { kids.unshift(props); props = null; }
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k in el && k !== 'list') el[k] = v;
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : String(kid));
  return el;
};

const added = new Set();
export const css = (id, text) => { if (added.has(id)) return; added.add(id); document.head.append(h('style', { 'data-id': id }, text)); };

export const root = () => document.getElementById('ui') || document.body;

// Overlays block the world while they are open. openOverlay(el) returns close().
let depth = 0;
const watchers = new Set();
export const blocked = () => depth > 0;
export const onBlock = (fn) => { watchers.add(fn); return () => watchers.delete(fn); };
export const openOverlay = (el, { block = true } = {}) => {
  root().append(el);
  if (block) { depth += 1; for (const fn of watchers) fn(true); }
  let open = true;
  return () => { if (!open) return; open = false; el.remove(); if (block) { depth -= 1; if (depth === 0) for (const fn of watchers) fn(false); } };
};
export const isTouch = () => globalThis.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in globalThis;
export const isNarrow = () => globalThis.innerWidth < 720;
export const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export const cardUrl = (id) => `cards/${id}.webp`;
