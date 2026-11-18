// Props and people that only open a system: the shop counter, the court deposit, the cottage bed
// (card of the day), and the people who wait in a scene. The work is done by services called with
// { do: 'call' } (src/glue/).
import { N, cat, cop, IF, open, visit } from '../h.js';

export const PROPS = {
  'prop.shop': [open('shop.open')],
  'prop.deposit': [
    IF({ stat: ['jailed', '>=', 1] },
      [N('Il deposito è una stanza di scaffali pieni di mazzi sequestrati, ognuno con il suo cartellino. Su qualcuno, in bella calligrafia, c\'è scritto il tuo nome.')],
      [N('Il deposito è una stanza di scaffali pieni di mazzi sequestrati, ognuno con il suo cartellino. Per adesso su nessuno c\'è scritto il tuo nome.')]),
    open('exam.recover'),
  ],
  'arrest.wait': [cop('Tu, ferma dove sei. Adesso vieni verso la porta, piano, e tieni le mani dove possiamo vederle.')],
  'coven.wait': [N('Le tre maestre ti guardano senza dire niente. Aspettano che tu ti sieda nel cerchio insieme a loro, davanti al calderone.')],
  'prop.bed': [
    IF({ power: 'cat' }, [
      cat('Prima di dormire gira una carta per domani, come fanno le streghe serie. Io intanto ti scaldo i piedi, ma soltanto perché fa comodo a me.'),
      IF({ trait: ['rischio', '>=', 3] }, [cat('E domani, se ti riesce, prova a non sfidare nessuno prima di colazione. Lo dico per il mio pelo, che a forza di rizzarsi si consuma.')]),
      IF({ trait: ['rischio', '<=', -3] }, [cat('Tu sei una che controlla due volte il chiavistello, l\'ho notato. Per stanotte puoi stare tranquilla: di guardia ci sono io.')]),
    ]),
    open('day.draw'),
    // after the ending the story has no more visits of the Reader: the cards still untold (the third row,
    // mostly) come to her in her sleep, three at a time (docs/BACKLOG.md 1.3).
    // `force`: even one card is enough (Il Mondo comes last, alone); with none the visit plays nothing, and the
    // bed stays the card of the day.
    IF({ chapterMin: 4 }, [{ ...visit, force: true }]),
  ],
};
