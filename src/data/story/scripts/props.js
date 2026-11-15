// Props and people that only open a system: the shop counter, the court deposit, the cottage bed
// (card of the day). The work is done by services called with { do: 'call' } (src/glue/).
import { N, cat, cop, IF } from '../h.js';

export const PROPS = {
  'prop.shop': [{ do: 'call', name: 'shop.open' }],
  'prop.deposit': [
    IF({ stat: ['jailed', '>=', 1] }, [N('Scaffali di carte sequestrate, ognuna con un cartellino. Alcune hanno il tuo nome.')],
      [N('Scaffali di carte sequestrate, ognuna con un cartellino. Nessuna è tua. Per ora.')]),
    { do: 'call', name: 'exam.recover' },
  ],
  'arrest.wait': [cop('Tu. Ferma lì. Vieni verso la porta, piano.')],
  'coven.wait': [N('Le tre maestre ti guardano. Aspettano che entri nel cerchio, davanti al calderone.')],
  'prop.bed': [
    IF({ power: 'cat' }, [cat('(Prima di dormire, una carta. Per domani. Così sogni giusto.)')]),
    { do: 'call', name: 'day.draw' },
  ],
};
