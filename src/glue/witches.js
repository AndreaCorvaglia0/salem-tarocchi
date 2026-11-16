// The witches' two axes in play (core/witches.js): the trust the story gives with its choices also builds the
// bond, the page «Le streghe» opens from Io, and the story can change a bond directly.
//   witches.open()               the page (ui/witches.js)
//   witches.bond(who, n, why?)   change a bond (story node `bond`, trial outcomes use core/witches.js addBond)
import { on } from '../core/bus.js';
import { provide } from '../core/services.js';
import { addBond } from '../core/witches.js';
import { openWitches } from '../ui/witches.js';

on('trust', ({ who, n } = {}) => { if (n) addBond(who, n, 'trust'); });
provide('witches.open', () => openWitches());
provide('witches.bond', (who, n, why) => Promise.resolve(addBond(who, n, why || 'story')));
