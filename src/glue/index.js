// Glue owned by the lead: small behaviours that sit between areas. Each file registers itself on
// import; main.js imports this after every area, so wrap() finds the services already provided.
import './finale.js'; // the final reading's ten cards
import './diary.js'; // diary lines, Tartufo's remarks, the wake-up in the cell
import './mood.js'; // sound.back: the music of the current map
import './tools.js'; // tool.use: the bottle
import './herbs.js'; // herb.look: a plant noticed in the world goes into the herbarium
import './garden.js'; // the garden at the cottage: Ortica's gift, garden.open, the beds in the world
import './day.js'; // day.draw: the card of the day at the cottage bed
import './clients.js'; // clients.next: story, returning and generated clients at the cottage table
import './street.js'; // someone she read for stops her in the street for one card
import './traits.js'; // behaviour feeds the portrait (esplora, rischio)
import './fly.js'; // the broom: fly.check, fly.to (the grimoire's map)
import './hints.js'; // the interface hints and the trail of lights
import './bonds.js'; // popularity, Tartufo's points and treats, the tracked side mission
import './selfread.js'; // the diary of readings: client readings kept, readings for herself saved
import './wire.js'; // fog, small cards, obstacles, trading, the last hints
import './lessons.js'; // the lessons as missions (flying, Minors, reversed) and the chapter card
import './trials.js'; // asking the cards, the trials, the library (src/trials)
import './witches.js'; // affinity and bond with the witches, their page
import './elsewhere.js'; // Altrove: the small worlds outside Salem (the clouds, inside a book)
import './debug.js'; // ?debug only: window.__salem and ?skip=
export { bootSkip } from './debug.js';
