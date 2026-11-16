// Due di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: due (due cose si incontrano) × Coppe (il cuore). Upright: a mutual understanding between equals.
// Reversed: the understanding cracks, one gives more than the other.
export default {
  id: 'c02',
  up: {
    favore: 2, moto: 'cresce',
    essenza: "Un'intesa alla pari tra due persone.",
    amore: {
      situazione: "Vivi un'intesa vera con un'altra persona: quello che dai ti viene ricambiato.",
      origine: "Hai incontrato qualcuno con cui è bastato uno sguardo, e l'intesa è stata reciproca.",
      ostacolo: "Ti frena la paura di rovinare un'intesa così bella, e pesi troppo le parole.",
      arrivo: "Nascerà un legame alla pari, in cui tu e l'altra persona vi cercherete allo stesso modo.",
      consiglio: "Vai incontro all'altra persona a metà strada, e lascia che faccia lo stesso.",
    },
    lavoro: {
      situazione: "Lavori bene insieme a un'altra persona, e fra voi c'è un'intesa alla pari.",
      origine: "Hai stretto un patto giusto con qualcuno, e ci avete guadagnato tutti e due.",
      ostacolo: "Ti rallenta la cura di non scontentare l'altro, in un'intesa che vuoi tenere alla pari.",
      arrivo: "Troverai un socio o un aiuto fidato, e vi intenderete con poche parole.",
      consiglio: "Cerca un accordo alla pari, che convenga a tutti e due, e stringi la mano.",
    },
    casa: {
      situazione: "C'è intesa in casa tra due persone, e questo tiene in pace anche gli altri.",
      origine: "È cominciato tutto dall'intesa di due persone, e la casa è cresciuta su quella.",
      ostacolo: "Pesa agli altri di casa un'intesa così stretta fra due, che li lascia a guardare.",
      arrivo: "Tornerà l'intesa fra due persone di casa che si parlavano poco.",
      consiglio: "Dividi alla pari i pesi di casa con chi ti sta accanto, e ditevi grazie.",
    },
    altri: {
      situazione: "Coltivi un'amicizia in cui ci si aiuta alla pari, e nessuno tiene il conto.",
      origine: "Qualcuno ti ha teso la mano quando serviva, e tu hai ricambiato alla pari.",
      ostacolo: "Ti basta l'intesa con una persona, e così gli altri li conosci poco.",
      arrivo: "Farai pace con qualcuno, e ritroverete l'intesa di prima.",
      consiglio: "Ricambia la gentilezza che hai ricevuto, e proponi tu un incontro.",
    },
    se: {
      situazione: "Stai bene in due, e l'intesa con qualcuno ti dà forza.",
      origine: "Hai imparato a conoscerti grazie a qualcuno che ti trattava alla pari.",
      ostacolo: "Ti appoggi troppo all'intesa con un'altra persona, e decidere per conto tuo ti costa.",
      arrivo: "Incontrerai una persona che ti somiglia, e nell'intesa con lei ti capirai meglio.",
      consiglio: "Scegli chi ti tratta alla pari, e dai agli altri quanto ricevi.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "L'intesa si incrina: uno dà più dell'altro.",
    amore: {
      situazione: "Dai più di quanto ricevi, e l'intesa che c'era si sta incrinando.",
      origine: "Hai amato una persona che non ricambiava allo stesso modo, e ne hai sofferto.",
      ostacolo: "Ti frena uno squilibrio: uno dei due cerca l'altro, e l'altro si lascia cercare.",
      arrivo: "Verrà un'incomprensione fra voi, e si vedrà chi dei due tiene di più al legame.",
      consiglio: "Di' chiaramente che cosa ti manca, invece di dare di più sperando che l'altro capisca.",
    },
    lavoro: {
      situazione: "Porti tu il peso più grosso di un accordo che doveva essere alla pari.",
      origine: "Hai fatto un patto sbilanciato, in cui l'altro ha preso più di quanto ha dato.",
      ostacolo: "Manca l'intesa fra te e chi lavora con te, e ognuno tira dalla sua parte.",
      arrivo: "Si romperà un accordo, o andrà rivisto, perché uno dà più dell'altro.",
      consiglio: "Rimetti in pari i conti con chi lavora con te, prima che l'intesa si guasti.",
    },
    casa: {
      situazione: "C'è chi in casa dà tanto e chi dà poco, e la cosa comincia a pesare.",
      origine: "Avete avuto in casa due persone che non si intendevano più, e ne hanno risentito tutti.",
      ostacolo: "Pesa un'intesa che si è incrinata fra due di casa, e nessuno dei due cede.",
      arrivo: "Usciranno i malumori di chi, in casa, dà più di quanto riceve.",
      consiglio: "Chiedi a chi vive con te di fare la sua parte, con calma e senza rinfacciare.",
    },
    altri: {
      situazione: "Cerchi sempre tu una persona che non ti cerca mai, e l'amicizia zoppica.",
      origine: "Qualcuno ha preso molto da te senza ricambiare, e l'intesa fra voi si è guastata.",
      ostacolo: "Ti pesa un malinteso con una persona cara, e nessuno dei due fa il primo passo.",
      arrivo: "Si raffredderà un'amicizia in cui davi soltanto tu, e ti costerà meno del previsto.",
      consiglio: "Smetti di rincorrere chi non ricambia, e guarda chi ti viene incontro.",
    },
    se: {
      situazione: "Dai agli altri molto più di quanto dai a te, e ti resta poco.",
      origine: "Hai messo sempre un'altra persona davanti a te, e lo squilibrio ti è costato caro.",
      ostacolo: "Ti trattiene un legame sbilanciato, in cui conti meno dell'altra persona.",
      arrivo: "Capirai di avere dato troppo a chi dava poco, e vorrai rimettere le cose in pari.",
      consiglio: "Tieni per te una parte di quello che dai, finché l'altro non fa la sua.",
    },
  },
};
