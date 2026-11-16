// Public API of the reading engine (pure functions, no UI). See notes/reading.md.
export { AMBITI, FORME, AMBITO_LABEL, FORMA_LABEL, TREE, walk, allPaths, makeQuestion } from './ask.js';
export { voice, hasVoice, voiceIds, line, validateVoice, useStubs, ROLES, MOTI } from './voices.js';
export { ROLE, SINGLE_ROLE, roleOf, drawCards, plan, linkOf, verdictOf, scan, seeded } from './plan.js';
export { say, sayStep, joinLead, closingFor } from './say.js';
export { alternatives, recall, verdictChoices, LEVEL } from './wrong.js';
