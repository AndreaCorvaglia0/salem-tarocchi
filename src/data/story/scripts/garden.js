// The garden (docs/DESIGN.md "L'orto"): Ortica gives her four beds at the cottage and three seedlings.
// A side thing (glue/garden.js registers it in core/extras.js and puts Ortica at her hut for it), so it
// also reaches a player who is already past chapter 2. The seedlings are named by the game afterwards.
import { N, ortica, flag, open, trust } from '../h.js';

export const GARDEN_SCRIPTS = {
  'garden.ortica': [
    ortica('Aspetta, non scappare subito, che ho una cosa per te. Il merlo dice che vai in giro a guardare le piante, e che ti fermi anche davanti a quelle che gli altri calpestano.'),
    ortica('Accanto alla tua capanna, ai miei tempi, c\'era un orto: quattro aiuole contro il muro, due al sole, una che lo prende solo la mattina e una all\'ombra del noce.'),
    ortica('Ci ho messo le mani per vent\'anni, e la terra è rimasta buona, anche se adesso ci cresce soltanto la gramigna.'),
    N('Ortica rientra nella capanna e torna con tre vasetti di coccio, ciascuno con dentro una piantina ancora piccola, e te li mette in mano uno sopra l\'altro.'),
    ortica('Sono piante buone per cominciare, di quelle che crescono anche a chi non ha mai avuto un orto. Se vuoi sapere da dove vengono chiedimelo pure, che il tempo per raccontarlo io ce l\'ho sempre.'),
    ortica('Trattale bene, che io passo a controllare. Va bene, non passo, ho la schiena a pezzi: però passa il merlo, e il merlo mi racconta tutto.'),
    flag('garden.given'), trust('ortica', 1), open('garden.unlock'),
  ],
  // the beds in the world, by the cottage door
  'garden.look': [open('garden.open')],
};
