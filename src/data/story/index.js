// The story as data: scripts, sessions, the main path, the side missions, who stands where, clients, barks.
// Shapes: docs/CONTRACT.md, "Data: story". Map of the path: notes/story.md.
import { C0 } from './scripts/c0.js';
import { C1 } from './scripts/c1.js';
import { C1B } from './scripts/c1b.js';
import { C2 } from './scripts/c2.js';
import { C3 } from './scripts/c3.js';
import { END } from './scripts/end.js';
import { POST } from './scripts/post.js';
import { PROPS } from './scripts/props.js';
import { LESSON_SCRIPTS } from './scripts/lessons.js';
import { TRIAL_SCRIPTS } from './scripts/trials.js';
import { CLIENTS, CLIENT_SCRIPTS } from './clients.js';

export const SCRIPTS = { ...C0, ...C1, ...C1B, ...C2, ...C3, ...END, ...POST, ...PROPS, ...LESSON_SCRIPTS, ...TRIAL_SCRIPTS, ...CLIENT_SCRIPTS };
export { LESSON_MISSIONS } from './missions.js';
export { SESSIONS } from './sessions.js';
export { STEPS, SIDE } from './steps.js';
export { CAST } from './cast.js';
export { BARKS } from './barks.js';
export { CLIENTS };
