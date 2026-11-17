// HER notes on the places of the grimoire's map (src/ui/mappa.js shows them when she taps a place).
// The rule (lore/principi/vede-solo-quello-che-sa.md): a place shows only what she has seen or been told.
// Three states:
//   never seen         blank, as the map already does (sketch.js draws nothing there)
//   seen, not known    `unknown`: one plain line in her voice, about what anyone sees or hears from outside;
//                      the heading is «?» unless the name is plain to see (`named`: a street, the square)
//   known              the notes whose condition holds (keys of src/core/cond.js), in the order she learns
//                      them; the caption shows the last three
// Sources: lore/luoghi (what a place is), lore/fatti (what happened where), the scripts. NEVER lore/retroscena
// or the hidden fields (`non_affiora`, `nasconde`). tests/knows-only.test.mjs checks conditions, lengths and
// that every proper name in a note appears in the scripts.
// A note is first person, as she would jot it, under 70 characters. Notes about a rumoured card are on the
// map's slips (src/ui/missions/titles.js), not here.
import { STEPS } from '../story/steps.js';

const ORDER = STEPS.map((s) => s.id);
// she is past that step of the main story (the step after it was reached, or the story is over)
export const past = (id) => {
  const i = ORDER.indexOf(id);
  if (i < 0) throw new Error(`notes.js: no step ${id}`);
  return { any: [{ stepIn: ORDER.slice(i + 1) }, { chapterMin: 4 }] };
};
const F = (flag) => ({ flag });
const JAILED = { stat: ['jailed', '>=', 1] };
const AT_JAIL = { any: [F('jail.chains'), F('jail.barrels')] };
const N = (cond, t) => ({ if: cond, t });

export const PLACE_NOTES = {
  // ---- the village ---------------------------------------------------------------------------------
  'village.arrival': { named: true, unknown: 'Una strada nella neve, che scende verso il porto.', notes: [
    N(past('p.session'), 'Sono arrivata a Salem da qui, a piedi, una notte di neve.'),
    N(past('p.road'), 'Sul bordo della strada brillava la mia prima carta.'),
    N({ power: 'cat' }, 'Qui mi ha trovata Tartufo, e da allora non mi molla.'),
  ] },
  'village.malva_door': { unknown: 'Una finestra accesa, e sulla porta c\'è scritto di non bussare.', notes: [
    N(past('c1.malva'), 'Qui abita Malva, la levatrice. Mi ha presa con sé.'),
    N(past('c1.read'), 'Le ho letto la mia prima carta, sulla tovaglia rossa.'),
    N(F('lesson.fly'), 'Nell\'orto dietro casa mi ha insegnato a volare.'),
    N(F('lesson.minors.3'), 'Accanto al focolare mi ha spiegato il quattro, il cinque e il sei.'),
  ] },
  'village.shop_door': { unknown: 'Una porta nera. Dietro, qualcuno ride piano.', notes: [
    N(past('c1.shop'), 'Il bottegaio vende cose per chi gira di notte.'),
    N(past('c1.shop'), 'Non fa credito a nessuno, nemmeno a Malva.'),
    N(F('shop.open'), 'Posso tornarci a comprare quando voglio.'),
  ] },
  'village.market': { named: true, unknown: 'Banchi sotto le tende, e un carretto di fieno.', notes: [
    N(past('c1.cart'), 'Sotto il carretto del fieno Ginepra mi ha soffiato una carta.'),
    N({ has: 'm01' }, 'La carta del merciaio adesso è nel mio mazzo.'),
  ] },
  'village.square': { named: true, unknown: 'Un pozzo, una gogna, e un conestabile che gira in tondo.', notes: [
    N(F('exam1.done'), 'Qui un conestabile mi ha fermata e interrogata sulle carte.'),
    N(past('c1.square'), 'Un\'Afflitta ha indicato Comare Hale davanti a tutta la piazza.'),
    N({ trial: 'well' }, 'Nel pozzo c\'è una scala di ferro: ci sono scesa di notte.'),
  ] },
  'village.lane': { named: true, unknown: 'Un vicolo stretto sotto la piazza, con una finestra a tende.', notes: [
    N(past('c1.venus'), 'Al davanzale Ginepra ha versato un uovo in un bicchiere.'),
    N(F('side.m02'), 'Qui abita la sarta, quella della tenda.'),
    N({ trial: 'night' }, 'Da qui è partita la notte del cesto di Malva.'),
  ] },
  'village.upper': { named: true, unknown: 'Un lavatoio, aiuole recintate, e una ronda che passa.', notes: [
    N(F('library.first'), 'Quassù, nella casa di ardesia, c\'è la biblioteca.'),
    N({ trial: 'vigil' }, 'Qui abitano i Proctor. Ci sono stata di notte, con Malva.'),
  ] },
  'village.meeting_door': { unknown: 'Una casa grande e chiusa, nella parte alta.', notes: [
    N(past('c1.deliver'), 'Qui davanti ho dato il fagotto di Malva alla lavandaia.'),
    N(past('c1.deliver'), 'Il pastore sfoglia la Bibbia grande ogni domenica.'),
    N({ has: 'm05' }, 'Nella Bibbia grande c\'era davvero una carta.'),
  ] },
  'village.court_door': { unknown: 'Un palazzo con le finestre alte, che non invita a entrare.', notes: [
    N(JAILED, 'Ho dormito nelle sue celle, sulla paglia. Non ci torno volentieri.'),
    N(JAILED, 'Nel deposito tengono le carte sequestrate, col mio nome.'),
    N(past('c2.plan'), 'Di notte Ginepra è entrata qui a riprendersi un mazzo.'),
    N(past('c3.trial'), 'Qui il Giudice mi ha interrogata davanti a tutti.'),
  ] },
  'village.trapdoor': { unknown: 'Una botola di legno dietro il tribunale. Sotto, qualcosa respira.', notes: [
    N(past('c3.trapdoor'), 'Di qui Malva mi ha calata nelle cantine.'),
    N(past('c3.edera'), 'Sotto c\'è Nonna Edera, più vecchia del villaggio.'),
  ] },
  'village.library_door': { unknown: 'Una casa di ardesia con la porta chiusa, e nessuna luce dentro.', notes: [
    N(F('library.first'), 'Di sopra ci sono i libri di Edera. Malva li spolvera.'),
    N(F('library.first'), 'Ci ripasso le carte prima di una notte difficile.'),
    N(F('elsewhere.book.done'), 'Da un libro su quel tavolo sono finita dentro una storia.'),
  ] },
  'village.cottage_door': { unknown: 'Una capanna storta, al limite del bosco.', notes: [
    N(past('c1.cottage'), 'È la mia capanna: storta, piena di spifferi, ma mia.'),
    N(past('c1.client'), 'Al tavolo leggo le carte a chi bussa.'),
    N(past('c2.ortica'), 'Prima di me ci ha abitato Ortica, da giovane.'),
  ] },
  'village.orto': { unknown: 'Quattro aiuole contro il muro della capanna.', notes: [
    N(F('garden.given'), 'Le aiuole di Ortica: due al sole, una al mattino, una all\'ombra.'),
    N(F('garden.given'), 'Ci pianto le mie erbe, e passo a bagnarle.'),
    N(F('garden.lesson.acqua'), 'Ogni lezione di Ortica mi lascia una nota sotto le aiuole.'),
  ] },
  'village.forest_gate': { named: true, unknown: 'Un cancello ghiacciato in cima al villaggio.', notes: [
    N(past('c1.gate'), 'Malva me l\'ha aperto quando sono diventata fattucchiera.'),
    N(past('f.dawn'), 'All\'alba sono volata via da qui, con Ginepra.'),
  ] },
  // ---- the wood ------------------------------------------------------------------------------------
  'forest.entry': { named: true, unknown: 'Il punto dove il sentiero entra fra gli alberi.', notes: [
    N(past('c1.gate'), 'Di qui comincia il bosco, e il sentiero per Ortica.'),
    N({ trial: 'grave' }, 'Qui mi aspettava la vedova Bray, la notte della tomba.'),
    N({ chapterMin: 4 }, 'Da qui comincio a cercare le carte piccole nell\'erba.'),
  ] },
  'forest.ortica_hut': { unknown: 'Mezza casa e mezza cespuglio, con le erbe appese al tetto.', notes: [
    N(past('c2.ortica'), 'Qui abita Ortica. Parla da sola prima ancora che arrivi.'),
    N(F('lesson.minors.1'), 'Mi ha spiegato i quattro semi delle carte piccole.'),
    N(F('garden.given'), 'Mi ha dato le prime piantine per il mio orto.'),
    N(F('garden.lesson.acqua'), 'Dietro la capanna mi insegna come si tengono le erbe.'),
  ] },
  'forest.campfire': { named: true, unknown: 'Una radura con un tronco e dei sassi anneriti.', notes: [
    N(past('c2.fire'), 'La sera Ginepra accende il fuoco qui. Il fumo va in faccia.'),
    N(past('c2.fire'), 'Mi ha raccontato del mazzo di sua nonna, preso a ottobre.'),
    N(past('f.last'), 'Alla fine ci siamo ritrovate tutte qui, intorno al fuoco.'),
  ] },
  'forest.grove': { named: true, unknown: 'Erba alta fino alle ginocchia, vicino al bivacco.', notes: [
    N(F('lesson.minors.2'), 'Qui ho imparato i primi tre numeri delle carte piccole.'),
    N({ chapterMin: 4 }, 'Ci cerco le carte piccole, facendo a gara con Ginepra.'),
  ] },
  'forest.den': { unknown: 'Dove il sentiero finisce c\'è un buco nero che sa di pelo.', notes: [
    N(F('trial.dare.offered'), 'In fondo Ginepra ha inciso il suo nome, a dodici anni.'),
    N({ trial: 'dare' }, 'Ci sono arrivata in fondo anch\'io, con lei.'),
  ] },
  'forest.pond': { named: true, unknown: 'Uno stagno con un salice che pende sull\'acqua.', notes: [
    N(past('c2.mill'), 'Il mugnaio da ragazzo si appendeva al salice per i piedi.'),
    N(F('trial.fog.offered'), 'Qui Ortica affila la falce prima della nebbia.'),
  ] },
  'forest.mill': { named: true, unknown: 'Un mulino sul torrente, con una ruota che cigola.', notes: [
    N(past('c2.mill'), 'Il mugnaio giura che la ruota gira al contrario.'),
    N(past('c2.mill'), 'L\'ha tirato su suo nonno, con le pietre della vecchia chiesa.'),
    N(F('mill.read'), 'Una volta, sul muretto, ho letto le carte alla ruota.'),
    N({ trial: 'hat' }, 'Il mugnaio mi ha dato una cosa da portare a Ortica.'),
  ] },
  'forest.boundary': { unknown: 'Una pietra in piedi, dove finiscono i campi.', notes: [
    N(F('side.m11'), 'Due fratelli si sono ammazzati qui, per un palmo di terra.'),
    N(F('trial.kettle.offered'), 'Di là dalla pietra comincia la strada del mare.'),
    N({ trial: 'kettle' }, 'Di notte, qui, abbiamo ripreso il paiolo di Ortica.'),
  ] },
  'forest.graveyard': { named: true, unknown: 'Lapidi vecchie e una fila di sassi bianchi, senza muro.', notes: [
    N(F('enc.gravedigger'), 'Ci lavora il becchino, da trent\'anni.'),
    N(F('trial.grave.offered'), 'Qui è sepolto Josiah Bray, il marito della vedova.'),
    N({ trial: 'grave' }, 'Di notte le pietre sembrano tutte uguali. Ci sono stata.'),
  ] },
  'forest.spring': { named: true, unknown: 'Due ruscelli che si incontrano, in alto oltre lo stagno.', notes: [
    N({ has: 'm14' }, 'Sul bordo della fonte c\'era una carta, con un angelo.'),
  ] },
  'forest.deep': { unknown: 'Faggi vecchi, e una nebbia che non si alza mai.', notes: [
    N(F('fog.lost'), 'La nebbia mi ha riportata indietro, da dove ero partita.'),
    N({ trial: 'fog' }, 'Al limite cresce la barba di bosco. Ci sono stata con Ortica.'),
    N({ power: 'stun' }, 'Adesso, con un soffio d\'aria, la nebbia si apre.'),
  ] },
  // ---- the cellars ---------------------------------------------------------------------------------
  'depths.entry': { named: true, unknown: 'Una scala di pietra che scende nel buio.', notes: [
    N(past('c3.trapdoor'), 'In fondo c\'è una cantina con le botti, che sa di vino.'),
    N(F('trial.room.offered'), 'A sinistra della scala c\'è un arco murato, più chiaro.'),
    N({ trial: 'room' }, 'Dietro l\'arco c\'era la stanza della nonna di Edera.'),
  ] },
  'depths.edera_nook': { unknown: 'In fondo alla galleria brilla una candela sola.', notes: [
    N(past('c3.edera'), 'Qui vive Nonna Edera. Mi chiama Rosalba.'),
    N(past('c3.edera'), 'Mi ha insegnato la croce celtica.'),
    N(F('lesson.minors.5'), 'Mi ha parlato delle figure: re, regine, cavalli e fanti.'),
    N(F('lesson.reversed'), 'Qui ho imparato a leggere le carte capovolte.'),
  ] },
  'depths.coven': { unknown: 'Una sala tonda con un calderone in mezzo.', notes: [
    N(past('c3.coven'), 'Qui le tre maestre si riuniscono intorno al calderone.'),
    N(past('c3.coven'), 'Hanno aspettato la mia parola, per la prima volta.'),
  ] },
  'depths.chains': { unknown: 'Si sente del ferro che batte contro il muro.', notes: [
    N(F('jail.chains'), 'Ci sono passata di corsa: il ferro suona a ogni soffio.'),
    N({ has: 'm15' }, 'Tra un anello e l\'altro c\'era una carta, appesa a un chiodo.'),
  ] },
  'depths.tower': { unknown: 'La base di una torre. Dall\'alto cade ancora qualche pietra.', notes: [
    N(F('ortica.gossip'), 'Ortica dice che la Torre è finita qui sotto.'),
    N(AT_JAIL, 'È la torre della prigione, accanto alle celle.'),
  ] },
  'depths.well': { named: true, unknown: 'Un pozzo aperto in alto: ci cade dentro un raggio di luna.', notes: [
    N({ has: 'm17' }, 'Sul fondo del pozzo vecchio luccicava una carta.'),
  ] },
  'depths.swamp': { named: true, unknown: 'Canne e fuochi fatui, in una nebbia fitta.', notes: [
    N(F('side.m18'), 'Di notte ci abbaiano due cani. La guardia non ci va.'),
    N({ has: 'm18' }, 'Sono arrivata in fondo al sentiero, tra le due torri.'),
  ] },
  'depths.cells': { unknown: 'Una scala stretta che sale verso l\'alto.', notes: [
    N(JAILED, 'Ci sono salita al mattino, dopo una notte in cella.'),
    N(AT_JAIL, 'Dalle celle questa scala sale dritta in tribunale.'),
  ] },
  'depths.jail': { unknown: 'Una grata chiusa. Dall\'altra parte gocciola qualcosa.', notes: [
    N(JAILED, 'Paglia umida e pane di pietra: ci ho passato una notte.'),
    N(AT_JAIL, 'Qui ho ritrovato Ginepra, che cantava stonando.'),
  ] },
};
