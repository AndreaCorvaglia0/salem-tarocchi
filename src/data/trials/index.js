// The trials, as data (format: src/trials/run.js). A new trial: write its file and add it to the list.
// Real trials (not `debug`) are registered in the extras registry by glue/trials.js (kind 'trial'), so a
// trial added later reaches old saves: give it a `when` that depends on what she HAS, never on the step.
// Order: the three main trials first (the library suggests the first open one), then the side chain.
import demo from './demo.js';
import { night, fog, cellars } from './main.js';
import { vigil, well, kettle, grave, room, dare } from './side.js';
import { hat } from './hat.js'; // a small side story, outside the chain (data/story/scripts/hat.js)

const LIST = [demo, night, fog, cellars, vigil, well, kettle, grave, room, dare, hat];
export const TRIALS = Object.fromEntries(LIST.map((t) => [t.id, t]));
export { LIBRARY_SCRIPTS } from './intro.js';
export { WITCH_LINES } from './witches.js';
