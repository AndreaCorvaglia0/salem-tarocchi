// Cinque di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: cinque (scossa) × Bastoni (la volontà). Upright: a confused clash of wills, rivalry, everyone
// pushing their own idea. Reversed: a truce, the clash avoided, or the grudge kept inside.
export default {
  id: 'w05',
  up: {
    favore: -1, moto: 'ferma',
    essenza: "Uno scontro confuso: ognuno spinge la sua idea.",
    amore: {
      situazione: "Litigate spesso per cose piccole, e ognuno vuole avere l'ultima parola.",
      origine: "Avete vissuto un periodo di continui litigi, e ognuno tirava dalla sua parte.",
      ostacolo: "Ti frena la voglia di vincere ogni discussione, anche con chi ami.",
      arrivo: "Verrà una discussione accesa con chi ami, e ognuno spingerà la sua idea.",
      consiglio: "Ascolta l'idea dell'altra persona, invece di spingere soltanto la tua.",
    },
    lavoro: {
      situazione: "C'è molta competizione intorno al tuo lavoro, e ognuno spinge per sé.",
      origine: "Hai dovuto farti largo tra tanti rivali, e ogni giorno era una gara.",
      ostacolo: "Regna la confusione, perché tutti vogliono comandare e il lavoro non va avanti.",
      arrivo: "Dovrai misurarti con dei rivali, e non sarà chiaro chi ha ragione.",
      consiglio: "Mettiti in gara senza cattiveria, e fai vedere quanto vali.",
    },
    casa: {
      situazione: "Si discute per ogni cosa in casa, e tutti parlano insieme senza ascoltarsi.",
      origine: "Hai vissuto in una casa dove si litigava spesso, ognuno per la sua idea.",
      ostacolo: "Pesa in casa un disaccordo confuso, e nessuno sa più da che cosa è nato.",
      arrivo: "Scoppierà una lite in famiglia per una sciocchezza, e ognuno dirà la sua.",
      consiglio: "Fai parlare in casa uno alla volta, e la lite si scioglierà.",
    },
    altri: {
      situazione: "Stai in mezzo a un gruppo litigioso, dove ognuno tira dalla sua parte.",
      origine: "Qualcuno ti ha lanciato una sfida davanti a tutti, e ne è nata una rivalità.",
      ostacolo: "Ti stancano i continui battibecchi tra vicini, e non si decide mai niente.",
      arrivo: "Nascerà una rivalità con qualcuno del paese, più rumorosa che seria.",
      consiglio: "Resta fuori dalle liti che non ti riguardano, e scegli per quali idee batterti.",
    },
    se: {
      situazione: "Hai in testa troppe idee in lotta fra loro, e nessuna riesce a prevalere.",
      origine: "Hai sempre dovuto lottare per farti ascoltare, e ti è rimasta l'abitudine.",
      ostacolo: "Ti porta via le forze uno scontro continuo, anche dove non serve.",
      arrivo: "Attraverserai un periodo di contrasti, e ne uscirai con le idee più chiare.",
      consiglio: "Scegli una sola battaglia, e lascia perdere tutte le altre.",
    },
  },
  rev: {
    favore: 0, moto: 'chiude',
    essenza: "Una tregua: lo scontro evitato, o tenuto dentro.",
    amore: {
      situazione: "Avete smesso di litigare, e tra voi c'è finalmente una tregua.",
      origine: "Hai evitato uno scontro con chi amavi, e il rancore ti è rimasto dentro.",
      ostacolo: "Ti pesa quello che hai tenuto dentro per evitare la lite.",
      arrivo: "Verrà una tregua tra voi, e potrete parlare senza alzare la voce.",
      consiglio: "Fai pace davvero, dicendo con calma quello che finora hai taciuto.",
    },
    lavoro: {
      situazione: "Si è calmata la rivalità nel lavoro, e si riesce di nuovo a collaborare.",
      origine: "Hai rinunciato a una gara per stare in pace, e hai perso un'occasione.",
      ostacolo: "Cova un malumore sotto la calma, perché nessuno dice quello che pensa.",
      arrivo: "Troverete un accordo che mette fine alle discussioni, e il lavoro riprenderà.",
      consiglio: "Proponi una tregua ai tuoi rivali, perché la gara non conviene a nessuno.",
    },
    casa: {
      situazione: "Regna una pace fragile in casa, fatta di cose non dette.",
      origine: "Avete chiuso una lite di famiglia senza chiarirla, e il rancore è rimasto.",
      ostacolo: "Pesa in casa il silenzio di chi evita lo scontro e tiene tutto dentro.",
      arrivo: "Tornerà la calma in casa, e i litigi continui saranno un ricordo.",
      consiglio: "Tira fuori con garbo quello che in casa si tace, prima che scoppi.",
    },
    altri: {
      situazione: "Eviti le discussioni con amici e vicini, e mandi giù più di un boccone.",
      origine: "Qualcuno ti ha offerto la pace dopo una lunga lite, e hai accettato.",
      ostacolo: "Ti pesa uno scontro mai affrontato con qualcuno, che tieni dentro da molto tempo.",
      arrivo: "Finirà una rivalità che durava da tempo, e nessuno avrà vinto.",
      consiglio: "Accetta la tregua che ti offrono, e lascia cadere i vecchi rancori.",
    },
    se: {
      situazione: "Stai uscendo da un periodo di lotte, e ritrovi un po' di calma.",
      origine: "Hai tenuto dentro la rabbia per non litigare, e ti è costato fatica.",
      ostacolo: "Resta la paura dello scontro, che ti fa cedere anche quando hai ragione.",
      arrivo: "Smetterai di lottare contro tutto, e avrai più forze per quello che conta.",
      consiglio: "Di' quello che pensi senza alzare la voce, invece di tenerlo dentro.",
    },
  },
};
