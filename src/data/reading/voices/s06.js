// Sei di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sei (si va verso il meglio) × Spade (pensieri e conflitti). Upright: a passage, leaving troubles
// behind and moving towards calm. Reversed: the passage is blocked or put off, and the troubles come along.
export default {
  id: 's06',
  up: {
    favore: 1, moto: 'torna',
    essenza: "Un passaggio: lasciare i guai, verso la calma.",
    amore: {
      situazione: "Ti stai lasciando alle spalle un periodo agitato, e in amore torna la calma.",
      origine: "Hai lasciato una storia piena di litigi, per cercare un po' di calma.",
      ostacolo: "Ti accompagna ancora la tristezza di quello che lasci, anche se vai verso il meglio.",
      arrivo: "Andrete verso giorni più calmi, dopo un passaggio che richiede pazienza.",
      consiglio: "Allontanati da quello che ti fa stare male, senza fretta e senza voltarti troppo.",
    },
    lavoro: {
      situazione: "Stai passando da un lavoro pieno di guai a una sistemazione più tranquilla.",
      origine: "Avevi lasciato un posto dove c'erano solo contrasti, e hai trovato più calma.",
      ostacolo: "Va lento questo passaggio, e a metà strada non vedi ancora dove arrivi.",
      arrivo: "Troverai una situazione più calma, lasciando un affare che dava solo pensieri.",
      consiglio: "Cambia strada con calma, portando con te solo quello che ti serve.",
    },
    casa: {
      situazione: "State uscendo insieme da un brutto periodo, e in casa c'è più calma.",
      origine: "La tua famiglia ha lasciato un periodo di guai, per cercare una vita più quieta.",
      ostacolo: "Pesa lasciare un luogo o un'abitudine di famiglia, anche se è per stare meglio.",
      arrivo: "Ci sarà un trasloco o un cambiamento in famiglia, e porterà giorni più calmi.",
      consiglio: "Accompagna i tuoi in questo passaggio, e lascia che ognuno saluti quello che lascia.",
    },
    altri: {
      situazione: "Ti allontani da compagnie che portavano guai, e cerchi gente più tranquilla.",
      origine: "Hai avuto accanto qualcuno che ti ha aiutato a lasciare un momento brutto.",
      ostacolo: "Costa fatica lasciare certe persone, anche quando portano soltanto guai.",
      arrivo: "Qualcuno ti darà una mano a passare oltre i guai, verso giorni più sereni.",
      consiglio: "Accetta l'aiuto di chi ti accompagna, perché questo passaggio è meglio farlo in due.",
    },
    se: {
      situazione: "Senti i pensieri calmarsi dopo un periodo agitato, e vai verso giorni migliori.",
      origine: "Hai attraversato un momento duro, e un passo alla volta hai ritrovato la calma.",
      ostacolo: "Resta la malinconia del distacco, che fa parte del passaggio e poi svanisce.",
      arrivo: "Arriverai a una mente più quieta, lasciando indietro le preoccupazioni di adesso.",
      consiglio: "Parti verso quello che ti dà pace, e non aspettare che i guai finiscano da soli.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Un passaggio bloccato: i guai restano addosso.",
    amore: {
      situazione: "Vorresti lasciarti alle spalle una storia che ti agita, e non ci riesci.",
      origine: "Hai provato ad allontanarti da un amore difficile, e ogni volta ci hai ripensato.",
      ostacolo: "Ti trattiene la paura del cambiamento, e resti dove sai di stare male.",
      arrivo: "Tarderà la calma in amore, finché non chiudi i conti con il passato.",
      consiglio: "Risolvi quello che è rimasto in sospeso, perché scappare non lo cancella.",
    },
    lavoro: {
      situazione: "Resti in una situazione di lavoro che ti pesa, perché non trovi il modo di lasciarla.",
      origine: "Avevi cambiato posto per sfuggire ai guai, e i guai ti hanno seguito.",
      ostacolo: "Un affare lasciato a metà blocca il cambiamento, e ti tiene dentro i guai di prima.",
      arrivo: "Sarà rimandato un cambiamento che aspettavi, e i guai dureranno ancora un poco.",
      consiglio: "Sistema le faccende vecchie prima di andartene, così non te le porti dietro.",
    },
    casa: {
      situazione: "Si parla di cambiare in casa, ma nessuno si muove e i guai restano.",
      origine: "Qualcuno in famiglia se n'è andato senza chiarire, e il problema è rimasto lì.",
      ostacolo: "Pesa in casa un cambiamento che non arriva, e tutti restano bloccati ad aspettarlo.",
      arrivo: "Slitterà una partenza o un trasloco, e ci vorrà più tempo del previsto.",
      consiglio: "Affronta in casa il guaio da cui tutti vorrebbero scappare.",
    },
    altri: {
      situazione: "Torni sempre dalle stesse persone, anche se sai che ti portano guai.",
      origine: "Hai lasciato un gruppo sbattendo la porta, e i vecchi guai ti sono venuti dietro.",
      ostacolo: "Ti blocca l'abitudine alle compagnie di sempre, e non riesci a staccartene.",
      arrivo: "Ritroverai sulla tua strada un vecchio guaio con qualcuno, che credevi lontano.",
      consiglio: "Chiarisci con chi devi chiarire, e solo allora prendi la tua strada.",
    },
    se: {
      situazione: "Stai cercando di andare avanti, ma ti porti dietro tutti i vecchi pensieri.",
      origine: "Hai rimandato un cambiamento necessario, e i guai sono rimasti gli stessi.",
      ostacolo: "Ti pesa un carico di pensieri vecchi, che ti impedisce di passare oltre.",
      arrivo: "Capirai che i guai ti seguono finché non li risolvi, dovunque tu vada.",
      consiglio: "Smetti di rimandare la partenza, e lascia a terra quello che non ti serve più.",
    },
  },
};
