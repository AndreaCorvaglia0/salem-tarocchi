// The trials, as data (format: src/trials/run.js). A new trial: write its file and add it to the list.
// Real trials (not `debug`) are registered in the extras registry by glue/trials.js (kind 'trial'), so a
// trial added later reaches old saves: give it a `when` that depends on what she HAS, never on the step.
import demo from './demo.js';

const LIST = [demo];
export const TRIALS = Object.fromEntries(LIST.map((t) => [t.id, t]));
export { LIBRARY_SCRIPTS } from './intro.js';
export { WITCH_LINES } from './witches.js';
