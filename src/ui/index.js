// The grimoire area: the title screen, the HUD, the grimoire (the only menu), the found ceremony,
// a card's page and the shop. Registers its services (docs/CONTRACT.md, "Services").
import { provide } from '../core/services.js';
import { openTitle } from './title.js';
import { mountHud, toast } from './hud.js';
import { openGrimoire } from './grimoire.js';
import { foundCeremony } from './found.js';
import { showCard } from './cardpage.js';
import { openShop } from './shop.js';
import './hint.js'; // interface hints on bus 'hint'

provide('title.open', () => openTitle());
provide('hud.mount', () => { mountHud(); return Promise.resolve(); });
provide('hud.toast', (text, opts) => { toast(text, opts); return Promise.resolve(); });
provide('grimoire.open', (opts) => openGrimoire(opts || {}));
provide('card.found', (id) => foundCeremony(id));
provide('card.show', (id) => showCard(id));
provide('shop.open', () => openShop());
