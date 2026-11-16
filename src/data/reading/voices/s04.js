// Quattro di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: quattro (ci si ferma) × Spade (la mente). Upright: a pause, the mind rests and recovers.
// Reversed: the rest is missing or cut short, a tiredness that does not pass or a start made too early.
export default {
  id: 's04',
  up: {
    favore: 1, moto: 'ferma',
    essenza: "Una pausa: la mente si riposa e recupera.",
    amore: {
      situazione: "Vi state prendendo una pausa dalle discussioni, e a tutti e due fa bene.",
      origine: "Hai avuto bisogno di una pausa per te, lontano dalle faccende di cuore.",
      ostacolo: "Ti serve ancora riposo dopo un periodo difficile, e l'amore deve aspettare un poco.",
      arrivo: "Verrà un tempo di quiete in amore, buono per riposare senza grandi novità.",
      consiglio: "Concedi una pausa a questo amore, senza decidere niente finché la testa non riposa.",
    },
    lavoro: {
      situazione: "Stai tirando il fiato dopo una grande fatica, e questa pausa ti serve.",
      origine: "Avevi lavorato troppo, e hai dovuto fermarti per recuperare le forze.",
      ostacolo: "Resta tutto in pausa per un po', perché prima devi recuperare le energie.",
      arrivo: "Avrai un periodo tranquillo nel lavoro, buono per riposare e riordinare le idee.",
      consiglio: "Fermati qualche giorno prima di ripartire, perché a mente riposata lavori meglio.",
    },
    casa: {
      situazione: "C'è silenzio in casa, quello buono, in cui ognuno riposa e riprende le forze.",
      origine: "Qualcuno in famiglia si è messo da parte per un po', per riposare la mente.",
      ostacolo: "Serve calma in casa, e le decisioni grosse vanno lasciate riposare.",
      arrivo: "Tornerà la quiete in casa dopo giorni agitati, e potrete riposare tutti.",
      consiglio: "Fai della tua casa un posto dove riposare, e lascia fuori le preoccupazioni.",
    },
    altri: {
      situazione: "Ti tieni in disparte per un poco, perché hai bisogno di quiete e di riposo.",
      origine: "Hai lasciato perdere per un periodo feste e compagnia, e quella pausa ti ha fatto bene.",
      ostacolo: "Ti manca la forza per stare in mezzo alla gente, e devi prima recuperare.",
      arrivo: "Sentirai il bisogno di ritirarti a riposare per un po', e gli amici capiranno.",
      consiglio: "Prenditi una pausa dalla compagnia senza sentirti in colpa, e torna a mente fresca.",
    },
    se: {
      situazione: "Hai bisogno di fermarti e riposare, e una parte di te lo sa bene.",
      origine: "È venuto un periodo di riposo dopo una prova dura, e ti ha ridato le forze.",
      ostacolo: "Pesa la stanchezza della mente, che chiede riposo prima di ogni altra cosa.",
      arrivo: "Troverai un momento di pace per recuperare, e dopo avrai la mente più chiara.",
      consiglio: "Stai in silenzio per qualche giorno e lascia riposare i pensieri, prima di decidere.",
    },
  },
  rev: {
    favore: -1, moto: 'torna',
    essenza: "Il riposo che manca: stanchezza, o ripartenza affrettata.",
    amore: {
      situazione: "Riprendi i discorsi difficili troppo presto, quando la stanchezza non è ancora passata.",
      origine: "Hai ripreso una storia senza concederti prima il tempo di riposare.",
      ostacolo: "Ti pesa una stanchezza che non passa, e ti lascia poche energie per chi ami.",
      arrivo: "Finirà la pausa tra voi, forse prima che abbiate riposato abbastanza.",
      consiglio: "Aspetta ancora un poco prima di rimetterti in gioco, perché la stanchezza ti tradirebbe.",
    },
    lavoro: {
      situazione: "Lavori senza mai fermarti, e la stanchezza si accumula giorno dopo giorno.",
      origine: "Avevi bisogno di una sosta e non te la sei concessa, così la fatica è cresciuta.",
      ostacolo: "Manca il riposo, e a mente stanca ogni faccenda sembra più grossa.",
      arrivo: "Tornerai al lavoro troppo presto, con la fretta di recuperare e poche forze.",
      consiglio: "Riparti piano dopo la sosta, senza pretendere subito il passo di prima.",
    },
    casa: {
      situazione: "Nessuno riposa davvero in casa, e la stanchezza rende tutti nervosi.",
      origine: "La famiglia ha tirato avanti a lungo senza riposo, finché le forze sono mancate.",
      ostacolo: "Pesa in casa una stanchezza vecchia, perché nessuno si ferma mai.",
      arrivo: "Finirà un periodo di calma in casa, e ci sarà da ripartire prima del previsto.",
      consiglio: "Dividi le fatiche di casa con gli altri, così riposa anche chi non si ferma mai.",
    },
    altri: {
      situazione: "Stai tornando tra la gente dopo un periodo in disparte, con le forze ancora poche.",
      origine: "Hai passato troppo tempo per conto tuo, e il riposo è diventato isolamento.",
      ostacolo: "Ti stanca la compagnia più del solito, perché non hai ancora recuperato.",
      arrivo: "Qualcuno verrà a tirarti fuori dal tuo ritiro, quando ancora ti manca il riposo.",
      consiglio: "Rientra in compagnia un passo alla volta, e riposa tra un invito e l'altro.",
    },
    se: {
      situazione: "Senti una stanchezza che il sonno non toglie, e la mente non si ferma.",
      origine: "Hai voluto ripartire troppo presto dopo un periodo duro, e la stanchezza è rimasta.",
      ostacolo: "L'inquietudine ti impedisce di riposare, e ti fa alzare prima del tempo.",
      arrivo: "Sentirai la voglia di ripartire subito, anche se il riposo non sarà bastato.",
      consiglio: "Ascolta la stanchezza prima che decida lei per te, e riposa sul serio.",
    },
  },
};
