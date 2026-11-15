// Registers the services of the play area: exam, lock, drawing, readings, review.
import { provide } from '../core/services.js';
import { startExam } from './exam.js';
import { recoverCards } from './recover.js';
import { ask } from './lock.js';
import { pick } from './draw.js';
import { open } from './reading.js';
import { free } from './free.js';
import { review } from './review.js';

provide('exam.start', (o) => startExam(o));
provide('exam.recover', () => recoverCards());
provide('lock.ask', (o) => ask(o));
provide('draw.pick', (o) => pick(o));
provide('reading.open', (o) => open(o));
provide('reading.free', (o) => free(o));
provide('review.open', (o) => review(o));
