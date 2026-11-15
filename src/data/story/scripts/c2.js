// Chapter 2, the forest in spring and summer: Ortica, the campfire night with Ginepra,
// the seized deck (fork 2), the arrest at the cottage ("Sono io.").
import {
  N, T, ortica, ginepra, cat, cop, opt, choice, IF, xp, flag, diary, step, chapter, travel,
  draw, teach, lesson, session, cinema, wait, trust,
} from '../h.js';

export const C2 = {
  'c2.ortica': [
    ortica('Eccola! La nuova di Malva! So tutto, sai. Tutto. Siediti, o resta in piedi, come vuoi.'),
    IF({ flag: 'malva.wood' }, [ortica('Malva dice che spacchi la legna storta. Detto da Malva è un complimento enorme.')]),
    IF({ flag: 'malva.cheeky' }, [ortica('Malva dice che hai le mani delicate. Ha riso. Malva! Ha riso! Due volte in trent\'anni.')]),
    IF({ flag: 'b1.spoke' },
      [ortica('E in piazza hai parlato! Lo sa tutto il bosco. Anche le volpi. Soprattutto le volpi.')],
      [ortica('E in piazza sei stata zitta. Saggia. O fifona. Le volpi sono divise.')]),
    ortica('Io sono Ortica. Pungo, ma curo. Come la pianta. Sì, lo so, battuta vecchia, la faccio lo stesso.'),
    choice(
      opt('Cosa mi insegni?', 'm01', 's', [ortica('Il tempo! Passato, presente, futuro. Tre carte, una storia.')]),
      opt('Parli sempre così tanto?', 'm00', 'w', [ortica('Sempre. Anche dormendo. Chiedi al gufo, ha fatto ricorso.')], { trust: { ortica: 1 } }),
    ),
    ortica('Prima un dono. Il bosco ne ha sette, di carte. Pescane una. Senza sbirciare. Io sbircio sempre.'),
    draw('row', 'Il dono di Ortica'),
    teach('ppf'),
    lesson('ppf'),
    ortica('La prima dice da dove viene. La seconda dov\'è. La terza dove VA. Non dove finisce: dove va.'),
    lesson('suits'),
    IF({ power: 'fire' },
      [ortica('Sai fare il fuoco, vedo. Allora puoi andare anche dove è buio. Il bosco è quasi tutto buio.')],
      [ortica('Il fuoco ancora no, eh? Arriva, crescendo. Intanto sta\' nella luce, che nell\'erba alta non si vede niente.')]),
    ortica('Ah, Ginepra è passata ieri. Ha chiesto di te. Tre volte. Io conto. Conto tutto.'),
    ortica('Vai al cottage e leggi a qualcuno le tre carte. Poi torna nel bosco, al bivacco.'),
    diary('Ortica mi ha insegnato il tempo in tre carte. E la vita intera del mugnaio.'),
    step('c2.client'),
  ],

  'c2.fire': [
    IF({ power: 'fire' }, [
      N('Ginepra è già lì, con un ramo in mano e nessuna idea di come accenderlo.'),
      ginepra('Tu sai fare il fuoco? Ah ah. Certo che sai. Tu sai sempre.'),
      choice(
        opt('Accenderlo io.', 'm08', 'w', [N('Una scintilla, poi tutto. Ginepra applaude, da sola, nel bosco.')]),
        opt('Insegnarle come.', 'm14', 'c', [ginepra('Così? Così! Ho fatto il fuoco! L\'ho fatto io! Ah ah!')], { trust: { ginepra: 1 } }),
      ),
      ginepra('Adesso ti leggo io una carta. Ho studiato. Un pochino. Nel senso di quasi niente.'),
      N('Pesca, gira. La Ruota della Fortuna.'),
      ginepra('Allora. Vuol dire che... farai un viaggio in carrozza. Rossa.'),
      choice(
        opt('Correggerla: è un cambio di giro.', 'm10', 's', [ginepra('Un cambio di giro. Meglio della carrozza. Forse. La carrozza era bella.')]),
        opt('Lasciarla parlare.', 'm14', 'c', [ginepra('Una carrozza rossa, con dentro noi due che scappiamo. Ah ah. Bella, no?')], { flag: 'fire.carriage', trust: { ginepra: 1 } }),
      ),
      ginepra('Posso chiederti una cosa? Seria. Cioè, quasi seria.'),
      ginepra('Se mi prendessero, verresti a cercarmi?'),
      choice(
        opt('Sì. Subito.', 'm07', 'w', [ginepra('Lo sapevo. Cioè, lo speravo. È uguale.')], { flag: 'fire.promised', trust: { ginepra: 1 } }),
        opt('Dipende da quanto sei stata scema.', 'm00', 'w', [ginepra('Molto. Sarò stata molto scema. Ah ah. Allora vieni di sicuro.')], { flag: 'fire.joked' }),
      ),
      ginepra('A ottobre mi hanno preso il mazzo. È nel deposito del tribunale. Lo rivoglio.'),
      ginepra('Dopodomani, di notte, davanti al tribunale. Pensaci. Ma non troppo.'),
      IF({ power: 'cat' }, [cat('(Brutta idea. Bellissima. Brutta.)')]),
      diary('Al fuoco Ginepra mi ha letto la Ruota. Malissimo. Mi è piaciuto.'),
      xp(10),
      step('c2.plan'),
    ], [
      N('Il bivacco è spento. Intorno, buio fitto.'),
      IF({ power: 'cat' }, [cat('(Qui serve il fuoco. Arriva crescendo: trova carte, guadagna stelle, leggi ai clienti.)')],
        [T('Qui serve il fuoco. Lo imparerò, crescendo.')]),
    ]),
  ],

  'c2.plan': [
    IF({ majorsMin: 11 }, [
      ginepra('Sei venuta! Cioè, sei venuta a dirmi di no?'),
      IF({ power: 'cat' }, [cat('(Pelo dritto. Due guardie dentro. Una dorme, l\'altra quasi.)')]),
      IF({ flag: 'b1.hid' }, [ginepra('Tu sai stare nell\'ombra. Ti ho vista, in piazza. Stanotte serve quello.')]),
      IF({ flag: 'b1.spoke' }, [ginepra('In piazza hai parlato davanti a tutti. Stanotte, ti prego, stai zitta.')]),
      choice(
        opt('Vengo con te.', 'm07', 'w', [
          cinema(['Il deposito sa di cera e di carta umida.', 'Ginepra trova il suo mazzo. Lo stringe come un gatto.',
            'In fondo, una lanterna si accende. Qualcuno ha visto due ombre.']),
          ginepra('Corri! Ah ah. Corri!'),
          diary('Sono entrata al tribunale con Ginepra. Ci hanno viste.'),
        ], { flag: 'b2.went', trust: { ginepra: 1 } }),
        opt('Non vengo. È troppo.', 'm11', 's', [
          ginepra('Va bene. Va bene. Vado da sola. Sono veloce, lo sai.'),
          N('La guardi sparire dietro la porta laterale. Torni verso casa.'),
          N('Più tardi, lontano, suona una campana.'),
          diary('Ginepra è andata da sola al tribunale. Io no.'),
        ], { flag: 'b2.stayed' }),
      ),
      IF({ power: 'cat' }, [cat('(A casa. Adesso. Non mi piace quella campana.)')]),
      xp(5),
      step('c2.home'),
    ], [
      ginepra('Aspetta. Prima di entrare lì dentro dobbiamo sapere le carte. Tutte e due.'),
      ginepra('Trova almeno cinque carte del bosco. Se ci prendono, almeno rispondiamo bene. Ah ah.'),
    ]),
  ],

  'c2.arrest': [
    cinema(['Lanterne intorno al cottage.', 'Tre conestabili. Uno ha un foglio con un sigillo rosso.'], 'village.cottage_door'),
    IF({ flag: 'b2.went' },
      [cop('Due ombre al deposito, stanotte. Una era la tua. Abbiamo seguito le impronte.')],
      [cop('Una strega è entrata al deposito, stanotte. Le impronte portano qui.')]),
    IF({ stat: ['jailed', '>=', 1] }, [cop('E tu in cella ci sei già stata. Ti ricordiamo bene.')]),
    cop('Sei tu la strega del cottage?'),
    choice(
      opt('«Sì. Sono io.»', 'm11', 's', [N('Apri la bocca per dirlo. Qualcuno lo dice prima di te.')]),
      opt('«Non so di cosa parlate.»', 'm18', 'c', [N('Lui fa un passo verso di te. Qualcuno ne fa uno più veloce.')]),
    ),
    ginepra('Sono io.'),
    wait(700),
    cop('Tu?'),
    ginepra('Sono io. Lei non c\'entra. Lei spacca la legna e basta.'),
    IF({ flag: 'b1.spoke' },
      [ginepra('In piazza hai parlato per una che non conoscevi. Stavolta parlo io per te.')],
      [ginepra('In piazza sei stata zitta. Fallo anche adesso. Ti prego.')]),
    IF({ flag: 'fire.promised' }, [ginepra('Hai detto che saresti venuta a cercarmi. Me lo ricordo, eh.')]),
    IF({ flag: 'fire.joked' }, [ginepra('Te l\'avevo detto che sarei stata molto scema. Ah ah.')]),
    N('La portano via. Ride anche adesso. Nel momento sbagliato, come sempre.'),
    choice(
      opt('Gridare il suo nome.', 'm07', 'w', [N('Lei si gira. Ti fa l\'occhiolino. Poi il buio della strada se la prende.')]),
      opt('Stringere i pugni e tacere.', 'm15', 'p', [cat('(Brava. Adesso pensa. Si urla dopo.)')]),
    ),
    cat('(Ci sono tre maestre. Una vive sotto il villaggio, e non l\'hai mai vista.)'),
    flag('ginepra.taken'),
    diary('Hanno preso Ginepra. Ha detto «Sono io». Non era lei.'),
    xp(10),
    session('s2'),
    chapter(3),
    step('c3.trapdoor'),
  ],

  // Ortica in her hut, later in chapter 2 and after
  'ortica.chat': [
    IF({ flag: 'ginepra.taken' },
      [ortica('L\'hanno presa. Lo so. Lo sa il bosco. Il bosco è furioso, guarda le ortiche: pungono doppio.')],
      [IF({ flag: 'fire.promised' },
        [ortica('Ginepra dice che le hai promesso una cosa. Non mi ha detto cosa. Cioè sì, me l\'ha detto.')],
        [ortica('Il mugnaio dice che la ruota gira al contrario. Io dico che beve. Tu che dici?')])]),
    choice(
      opt('Mi ripeti le tre carte?', null, null, [ortica('Da dove viene, dov\'è, dove va. Te l\'ho detto quaranta volte. Quarantuno.')]),
      opt('Raccontami un pettegolezzo.', null, null, [
        ortica('La Torre è nelle cantine, il becchino ha paura dei gatti, e Malva canta. Di nascosto.'),
        IF({ notFlag: 'ortica.gossip' }, [trust('ortica', 1), flag('ortica.gossip')]),
      ]),
    ),
  ],
};
