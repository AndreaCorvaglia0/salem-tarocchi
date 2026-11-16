// The worlds of Altrove (docs/DESIGN.md "Altrove"), in the order she meets them (a chain in the registry).
// A new world: its map(s) in src/data/world, its trial here, and it is on (glue/elsewhere.js does the rest).
import book from './book.js';
import clouds from './clouds.js';

export const WORLD_LIST = [book, clouds];
export const WORLDS = Object.fromEntries(WORLD_LIST.map((w) => [w.id, w]));
