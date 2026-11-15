// The narrative area: registers its services (docs/CONTRACT.md). main.js imports this once.
import { provide, call } from '../core/services.js';
import { SCRIPTS } from '../data/story/index.js';
import { createRunner } from './runner.js';
import * as dialogue from './dialogue.js';
import { cinema as barsCinema } from './cinema.js';
import { playTableau } from './stage/index.js';
import { sceneFor } from './stage/tableaux.js';
import { playSession } from './session.js';

// a shadow-theatre tableau when the node has (or implies) a scene, else the black-bars fallback
const cinema = (lines, node = {}) => { const s = sceneFor(node); return s ? playTableau(s, lines) : barsCinema(lines); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const runner = createRunner({
  ui: { say: dialogue.say, choose: dialogue.choose, moment: dialogue.moment, cinema, sleep, end: dialogue.end },
  call, getScript: (id) => SCRIPTS[id],
});

provide('story.run', (scriptId) => runner.run(scriptId));
provide('story.say', (who, text) => dialogue.say(who, text).then(() => dialogue.end()));
provide('story.choose', (options) => dialogue.choose(options.map((o) => o.t)).then((i) => { dialogue.end(); return i; }));
provide('story.session', (id) => playSession(id));
export { runner, dialogue, cinema };
