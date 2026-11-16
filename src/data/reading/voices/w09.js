// Nove di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: nove (quasi in fondo) × Bastoni (la volontà). Upright: tired and wary, but still standing,
// with little left to go. Reversed: the strength runs out, wariness turns to mistrust, one wants to quit near the end.
export default {
  id: 'w09',
  up: {
    favore: 0, moto: 'ferma',
    essenza: "Resistere, anche con la stanchezza: manca poco.",
    amore: {
      situazione: "Resisti in una storia faticosa, e stai in guardia per non soffrire ancora.",
      origine: "Hai avuto delle delusioni in amore, e hai resistito senza chiuderti del tutto.",
      ostacolo: "Ti frena la cautela di chi ha già sofferto, e tieni tutti a distanza.",
      arrivo: "Verrà un'ultima prova per la vostra storia, e avrete la forza di resistere.",
      consiglio: "Resisti ancora un poco, perché il momento più difficile sta per finire.",
    },
    lavoro: {
      situazione: "Stai facendo l'ultimo sforzo, con la stanchezza addosso e la fine vicina.",
      origine: "Hai lavorato a lungo tra mille difficoltà, e hai resistito senza mollare.",
      ostacolo: "Pesa la stanchezza accumulata, e ogni nuovo intoppo sembra più grande di quello che è.",
      arrivo: "Dovrai resistere ancora per un tratto, e il lavoro sarà finito.",
      consiglio: "Raccogli le forze che ti restano, e porta in fondo quello che hai cominciato.",
    },
    casa: {
      situazione: "Tieni in piedi la casa in un periodo duro, e resisti anche con la stanchezza.",
      origine: "Avete attraversato anni difficili in famiglia, e avete resistito insieme.",
      ostacolo: "Regna in casa una stanchezza guardinga, e ognuno si aspetta il prossimo guaio.",
      arrivo: "Supererete un'ultima difficoltà in famiglia, e potrete finalmente riposare.",
      consiglio: "Fai coraggio ai tuoi, perché manca poco e avete già resistito al peggio.",
    },
    altri: {
      situazione: "Resisti in mezzo alla gente con la guardia alzata, anche se la stanchezza si fa sentire.",
      origine: "Qualcuno ha tradito la tua fiducia più di una volta, e hai imparato la cautela.",
      ostacolo: "Ti chiude agli altri la troppa prudenza, anche verso chi vorrebbe aiutarti.",
      arrivo: "Affronterai un'ultima resistenza da parte di qualcuno, e avrai pace.",
      consiglio: "Tieni gli occhi aperti, ma lascia entrare chi ha dimostrato di meritarlo.",
    },
    se: {
      situazione: "Senti la stanchezza di una lunga prova, ma hai ancora forza per resistere.",
      origine: "Hai superato molte prove una dopo l'altra, e da ognuna hai imparato a resistere.",
      ostacolo: "Resta la paura di un altro colpo, che ti tiene sempre sul chi vive.",
      arrivo: "Arriverai in fondo con le ultime forze, e capirai che ne valeva la pena.",
      consiglio: "Continua anche se la stanchezza è tanta, perché manca davvero poco.",
    },
  },
  rev: {
    favore: -1, moto: 'chiude',
    essenza: "Forze esaurite: voglia di mollare sul più bello.",
    amore: {
      situazione: "Hai finito le forze per questa storia, e ti viene voglia di mollare.",
      origine: "Hai lasciato una storia per sfinimento, proprio quando poteva aggiustarsi.",
      ostacolo: "Ti frena una diffidenza esagerata, che vede un pericolo in ogni gesto d'affetto.",
      arrivo: "Verrà la tentazione di mollare con chi ami, a un passo dalla pace.",
      consiglio: "Abbassa la guardia con chi ami, perché a forza di difenderti ti sfinisci.",
    },
    lavoro: {
      situazione: "Stai per mollare un lavoro quasi finito, perché non ne puoi più.",
      origine: "Avevi dato tutto fino a sfinirti, e hai lasciato a un passo dalla fine.",
      ostacolo: "Mancano le forze per l'ultimo tratto, e ogni cosa ti sembra troppo.",
      arrivo: "Finirai le forze prima della fine del lavoro, e dovrai fermarti a riprendere fiato.",
      consiglio: "Prenditi un giorno di riposo, prima di mollare il lavoro a metà.",
    },
    casa: {
      situazione: "Regge a stento la pazienza in casa, perché tutti sono sfiniti.",
      origine: "Avete resistito in famiglia fino allo sfinimento, e qualcuno ha ceduto a un passo dalla fine.",
      ostacolo: "Pesa in casa la diffidenza di chi è sfinito, e nessuno crede più alle buone notizie.",
      arrivo: "Finiranno le forze di chi regge la casa, e servirà l'aiuto di tutti.",
      consiglio: "Dividi le fatiche di casa con gli altri, prima di restare senza forze.",
    },
    altri: {
      situazione: "Ti aspetti il peggio da tutti, e questa diffidenza ti lascia senza amici.",
      origine: "Qualcuno ha approfittato della tua stanchezza, e da allora sospetti di tutti.",
      ostacolo: "Ti logora lo stare sempre in guardia, anche con chi non ti minaccia.",
      arrivo: "Mollerai una vecchia contesa, perché non avrai più forze per combattere.",
      consiglio: "Accetta l'aiuto di qualcuno per l'ultimo tratto, invece di fare tutto tu.",
    },
    se: {
      situazione: "Stai finendo le energie, e pensi di mollare proprio sul più bello.",
      origine: "Hai resistito oltre il ragionevole, e alla fine le forze sono mancate.",
      ostacolo: "Resta solo la stanchezza, e non vedi quanto poco manca alla fine.",
      arrivo: "Arriverai allo stremo, e dovrai scegliere tra un ultimo sforzo e il riposo.",
      consiglio: "Riposa e poi riprendi, perché mollare a un passo dalla fine sarebbe un peccato.",
    },
  },
};
