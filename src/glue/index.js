// Glue owned by the lead: small behaviours that sit between areas. Each file registers itself on
// import; main.js imports this after every area, so wrap() finds the services already provided.
import './finale.js'; // the final reading's ten cards
import './diary.js'; // diary lines, Tartufo's remarks, the wake-up in the cell
import './tools.js'; // tool.use: the bottle and the sieve
import './day.js'; // day.draw: the card of the day at the cottage bed
import './clients.js'; // clients.next: the returning clients at the cottage table
import './debug.js'; // ?debug only: window.__salem and ?skip=
export { bootSkip } from './debug.js';
