// Entry point. It only wires modules together: every module registers its services on import
// (core/services.js). The integration (boot order, title, world start) is written by the lead.
import './core/fonts.js';
import { state } from './core/state.js';
console.log('[salem] scaffold', state.v);
