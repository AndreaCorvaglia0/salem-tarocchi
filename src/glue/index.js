// Glue owned by the lead: small behaviours that sit between areas. Each file registers itself on
// import; main.js imports this after every area, so wrap() finds the services already provided.
import './finale.js'; // the final reading's ten cards
import './diary.js'; // diary lines, Tartufo's remarks, the wake-up in the cell
import './mood.js'; // sound.back: the music of the current map
import './tools.js'; // tool.use: the bottle
import './day.js'; // day.draw: the card of the day at the cottage bed
import './clients.js'; // clients.next: the returning clients at the cottage table
import './traits.js'; // behaviour feeds the portrait (esplora, rischio)
import './fly.js'; // the broom: fly.check, fly.to (the grimoire's map)
import './hints.js'; // the interface hints and the trail of lights
import './wire.js'; // fog, small cards, obstacles, trading, the last hints
import './debug.js'; // ?debug only: window.__salem and ?skip=
export { bootSkip } from './debug.js';
