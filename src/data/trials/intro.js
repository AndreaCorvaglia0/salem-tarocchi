// The first visit to the library (a key in the registry: `library.first`): the scene runs once, then the
// library's book opens (glue/trials.js). The books are Edera's, left upstairs in the slate house the day she
// went to live below; Malva dusts them once a month. The three ribbons are the topics the library suggests.
import { N, T, malva, cat, o, choice } from '../story/h.js';

export const LIBRARY_SCRIPTS = {
  'library.first': [
    N('La stanza sopra la casa di ardesia è stretta e alta, con i libri che arrivano al soffitto e una sola finestra, e sa di cera, di polvere e di mele messe a seccare.'),
    N('Malva è in piedi su uno sgabello con uno straccio in mano, e spolvera un ripiano senza voltarsi, come una che ti ha sentita salire dal terzo gradino.'),
    malva('Chiudi la porta, che entra il freddo. Questi sono i libri di Edera, che li ha lasciati qui il giorno in cui è andata a stare di sotto, e da allora li spolvero io una volta al mese, perché nessun altro lo farebbe.'),
    choice(
      o('Le chiedo perché Edera non se li è portati con sé.', { esplora: 1 }, [malva('Perché di sotto la carta ammuffisce in un inverno, e perché dice che tanto li sa a memoria. La seconda ragione è vera soltanto a metà, ma non sarò io a dirglielo.')]),
      o('Le dico che pensavo fossero suoi.', { parola: 1 }, [malva('Miei no di certo: io ho un quaderno solo, ed è unto di strutto. Edera invece ha scritto tutto quello che ha visto in settant\'anni, con una calligrafia che una volta era bella.')]),
    ),
    N('Tartufo salta sul tavolo, gira due volte su sé stesso e si sdraia sul cuscino che c\'è sopra, con una zampa sul libro aperto.'),
    cat('(Su questo tavolo c\'era un cuscino, e non credo fosse per te. Tu leggi pure, che io intanto controllo che sia comodo.)'),
    malva('Ti dico una cosa che a me disse mia madre, e che allora mi fece arrabbiare. Una strega che esce di casa senza aver riguardato le sue carte è come una che va al mercato senza aver contato i soldi: può andarle bene, ma non per merito suo.'),
    malva('Io ci vengo ancora, prima di una notte difficile. Alla mia età di cose nuove ne entrano poche, ma vengo perché quello che so mi torni in mano al momento giusto, e non mezz\'ora dopo.'),
    choice(
      o('Le chiedo che cosa riguarda lei, prima di una notte difficile.', { esplora: 1 }, [malva('Le carte che credo di sapere meglio, perché sono quelle che mi tradiscono. Quelle che so male le tratto con rispetto, e allora non mi fanno scherzi.')]),
      o('Le dico che io le mie carte le so già.', { rischio: 1 }, [malva('Lo dicevo anch\'io, e poi una sera ho confuso una carta dritta con la stessa capovolta, davanti a una che piangeva. Siediti, e vediamo quanto le sai.')]),
    ),
    malva('C\'è qualcosa che ti aspetta, e si vede da come tieni la borsa. Edera aveva l\'abitudine di lasciare un nastro alle pagine che servivano a chi saliva, e non chiedermi come facesse a saperlo: guarda se ce n\'è qualcuno anche per te.'),
    N('Fra le pagine del libro su cui dorme Tartufo spuntano dei nastrini rossi, e uno ha ancora attaccato un filo di polvere.'),
    T('Mi siedo al tavolo, sposto con delicatezza una zampa nera, e apro il libro al primo nastro.'),
  ],
};
