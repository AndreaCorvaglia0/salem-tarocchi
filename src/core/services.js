// Service locator: modules never import each other, they register what they offer here and
// call each other by name. main.js imports every module once, which registers them.
// The list of services and their signatures is in docs/CONTRACT.md.
const table = new Map();
export const provide = (name, fn) => { table.set(name, fn); };
export const has = (name) => table.has(name);
export const call = (name, ...args) => {
  const fn = table.get(name);
  if (!fn) { console.warn(`[services] "${name}" is not provided yet`); return Promise.resolve(undefined); }
  return fn(...args);
};
