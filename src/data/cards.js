// Full card sheets: what you see, hotspots, what it says, keywords, reversed, how it reads in each
// spread position, confusables and the rumour (Majors); compact versions for the 56 Minors.
// Schema: docs/CONTRACT.md ("Data: cards"). The base facts (names, astrology, words) are cards.base.js.
import { CARD } from './cards.base.js';
import { MAJORS_A } from './cards/majors-a.js';
import { MAJORS_B } from './cards/majors-b.js';
import { MAJORS_C } from './cards/majors-c.js';
import { MINOR_SHEETS } from './cards/minors.js';

export { AS_KEYS, asFromGist } from './cards/minors.js';
export const SHEETS = { ...MAJORS_A, ...MAJORS_B, ...MAJORS_C, ...MINOR_SHEETS };
export const sheet = (id) => ({ ...CARD[id], ...SHEETS[id] });
