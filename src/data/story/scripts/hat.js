// «Un sacco dal mulino» (the trial is data: src/data/trials/hat.js): the scenes round it, in the shape of the
// doors of scripts/trials.js (merged into TRIAL_SCRIPTS at the end of that file).
//   the first time  at the mill: the miller gives her a flour sack for Ortica and does not say what is in it
//                   (a choice by character, a special answer by trait), Tartufo senses what to go over in the
//                   library, a diary line; flag `trial.hat.offered`;
//   then            at Ortica's hut: the trial (`trial.start`); after a failed try Ortica remembers it first;
//                   afterwards, once, a gesture if Ortica sees herself in her (`affinity`), else she goes back
//                   to talking; a diary line by outcome;
//   later           at the mill, once: the miller, who remembers the prize (or its absence).
// A story in two places: the door at the mill (`trial.hat`, where the registry points) until she has the sack,
// then Ortica at her hut. The mill entry is pushed here, at import, before glue/trials.js adds its own entry
// with that id: the world shows the first matching entry per id, so this one wins and the glue's (which would
// start the trial at the mill) stays behind. Ortica's entry goes first in CAST (see below).
// The miller speaks through the narrator, in «», as in c2.js#c2.mill.
import { N, ortica, cat, o, sp, choice, IF, flag, diary, open } from '../h.js';
import { CAST } from '../cast.js';
import { hat } from '../../trials/hat.js';

const f = (k) => `trial.hat.${k}`;
const won = { any: [{ flag: f('pass') }, { flag: f('perfect') }] };
const failedOnly = [{ flag: f('fail') }, { notFlag: f('pass') }, { notFlag: f('perfect') }];
const yours = { tag: '[È da te]' };
const RIBBON = `item.${hat.outcomes.perfect.reward.item}`;
const coda = (d) => ['perfect', 'pass', 'fail'].map((k) => IF([{ flag: f(k) }, { notFlag: f(`${k}.told`) }], [diary(d[k]), flag(f(`${k}.told`))]));

export const HAT_SCRIPTS = {
  'trial.hat.door': [
    IF({ notFlag: f('offered') }, [
      N('Bussi alla porta del mulino, e ti apre il mugnaio con un sacco da farina piegato sotto il braccio. Lo tiene stretto, come uno che da stamattina ha cambiato idea tre volte.'),
      N('«L\'altra mattina sopra il salice è passata una scopa, e sopra la scopa c\'eri tu. Io ero lì sotto, e sono rimasto a guardare in su finché mi ha fatto male il collo, che alla mia età non si dovrebbe.»'),
      N('«Questo è di Ortica. Non te lo do perché tu lo apra, e nemmeno per sapere che cosa ne pensa lei: deve soltanto tornare a casa sua, che in soffitta c\'è stato abbastanza.»'),
      N('Ti mette in mano il sacco. È leggero, ha una punta che tira la tela, e prima di lasciarlo andare il mugnaio ci passa sopra la mano due volte, a togliere una farina che non c\'è.'),
      choice(
        o('Gli chiedo che cosa c\'è dentro.', { esplora: 1 }, [
          N('«È roba sua.» Guarda il torrente, e poi di nuovo te. «Se te lo vuole dire, te lo dice lei. Ortica di solito dice tutto, quindi non c\'è da preoccuparsi.»'),
        ]),
        o('Me lo metto sotto il braccio senza fare domande.', { esplora: -1 }, [
          N('Il mugnaio annuisce, come uno a cui hai risparmiato una fatica. «Meglio così, perché alle domande poi bisogna rispondere, e io con le parole non ci so fare come lei.»'),
        ]),
        sp('trait', { trait: ['esplora', '>=', 3] }, 'Tasto la punta attraverso la tela, per capire che forma ha.', { esplora: 1, guida: -1 }, [
          N('Il mugnaio ti riprende il sacco un momento e lo raddrizza. «Le cose a punta si portano con la punta in su, se no si piegano.» Non aggiunge altro, ma adesso sai che cosa stai portando.'),
        ], yours),
      ),
      N('«Vai, che col buio il sentiero della capanna ha più radici che sassi. E a mia moglie, se la incontri, dille che eri qui per la farina.»'),
      IF({ power: 'cat' }, [cat('(Quel sacco sa di soffitta, e di Coppe. Se passi dai libri prima di andare da lei, guarda le Coppe, e i due che si scelgono, e quel vecchio con la lanterna.)')]),
      open('trial.sense', 'hat'),
      flag(f('offered')),
      diary('Il mugnaio mi ha dato un sacco da portare a Ortica, nella sua capanna nel bosco, e non mi ha detto che cosa c\'è dentro. Se voglio, prima passo dalla biblioteca.'),
    ], [
      IF(failedOnly, [
        ortica('Il sacco l\'ho tenuto chiuso, guarda, col nodo di prima, perché l\'altra sera non era sera. Stasera riproviamo, e stavolta le carte le tiri tu dall\'inizio.'),
      ]),
      open('trial.start', 'hat'),
      // afterwards, once: what Ortica does with the hat depends on how much she sees herself in her
      IF([won, { notFlag: 'hat.after' }], [
        IF({ affinity: { ortica: 2 } }, [
          N('Sulla porta Ortica ti ferma, stacca il cappello dal chiodo e te lo posa in testa con tutte e due le mani, per un momento solo.'),
          ortica('Ecco, è come pensavo: ti sta come stava a me. Adesso però lo rimetto al chiodo, perché i cappelli si affezionano, e poi non vogliono più scendere.'),
        ], [
          ortica('E adesso basta con i cappelli. Ti ho mai raccontato di quando il merlo ha rubato il ditale alla moglie del fabbro? Siediti, che è lunga.'),
        ]),
        flag('hat.after'),
      ]),
      ...coda({
        perfect: 'Ho portato a Ortica il sacco del mugnaio. Dentro c\'era un cappello nero a punta, che adesso sta appeso al chiodo dietro la sua porta, e a me ha dato il nastro, di velluto rosso scuro.',
        pass: 'Ho portato a Ortica il sacco del mugnaio. Dentro c\'era un vecchio cappello a punta: Ortica non se l\'è messo, e l\'ha appeso al chiodo dietro la porta.',
        fail: 'Ho portato a Ortica il sacco del mugnaio, ma stasera non era sera. Il sacco è rimasto da lei, chiuso, e un altro giorno potrò riprovare.',
      }),
    ]),
  ],
  // at the mill again while the sack is still to be delivered
  'trial.hat.wait': [
    N('Il mugnaio socchiude la porta e ti guarda le mani. «Il sacco va a casa di Ortica, nel bosco, non qui. Qui ha già aspettato abbastanza.»'),
  ],
  // later, once, at the mill: he asks nothing, and the prize says the rest
  'trial.hat.after': [
    IF({ flag: RIBBON }, [
      N('Il mugnaio ti apre, vede il nastro rosso legato al manico della tua scopa e resta fermo un momento con la mano sulla porta. Poi guarda il torrente, e si schiarisce la voce.'),
    ], [
      N('Il mugnaio ti apre, ti guarda le mani vuote e annuisce, come uno che ha avuto la risposta che aspettava.'),
    ]),
    N('«Ortica mi ha fatto sapere che domani passa lei con l\'unguento, e che stavolta le tre storie me le finisce tutte. Speriamo di no, perché poi non avrebbe più una ragione per venire.»'),
    flag('hat.miller'),
  ],
};

// the door in the world: same conditions as the entry glue/trials.js adds for `start.at`, split in two places
const open3 = [{ notFlag: f('perfect') }, { notFlag: f('pass') }];
CAST.push(
  { id: 'trial.hat', kind: 'prop', at: hat.start.at, when: [...hat.when, ...open3, { notFlag: f('offered') }], script: 'trial.hat.door', label: hat.start.label, verb: hat.start.verb },
  // after she has the sack, the same door only sends her on (else the glue's entry would start the trial here)
  { id: 'trial.hat', kind: 'prop', at: hat.start.at, when: [...hat.when, ...open3, { flag: f('offered') }], script: 'trial.hat.wait', label: hat.start.label, verb: hat.start.verb },
  { id: 'hat.after', kind: 'prop', at: hat.start.at, when: won, once: true, script: 'trial.hat.after', label: 'La porta del mulino', verb: 'Bussa' },
);
// at the hut the door is Ortica herself: an entry with her id, first in CAST, so it wins over her lessons and
// her chat while she waits for the sack (and only then: from `offered` until the trial is passed)
CAST.unshift({ id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: [...hat.when, ...open3, { flag: f('offered') }], script: 'trial.hat.door', label: 'Ortica' });
