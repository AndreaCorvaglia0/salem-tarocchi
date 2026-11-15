// Chapter 3, the dark in autumn: the trapdoor, Nonna Edera and the Celtic cross, the three
// mistresses (fork 3: by the cellars or in the open), the jail or the court door.
import {
  N, T, malva, ortica, edera, ginepra, cat, judge, opt, choice, IF, xp, flag, diary, step, travel,
  draw, teach, lesson, cinema, goto, wait, trust,
} from '../h.js';

// the hidden Majors of the cellars (Il Sole, Il Giudizio, Il Mondo come from the story)
export const DEPTHS_POOL = ['m15', 'm16', 'm17', 'm18'];

export const C3 = {
  'c3.trapdoor': [
    malva('Di qua. Sotto. Non fare domande.'),
    IF({ flag: 'malva.cheeky' }, [malva('Mani delicate, eh? Tieniti forte alla scala.')]),
    malva('Ginepra è una scema. Una scema coraggiosa. Andiamo a riprendercela.'),
    choice(
      opt('Grazie, Malva.', 'm03', 'c', [malva('Te l\'ho detto mille volte. Porta male. Scendi.')]),
      opt('Chi c\'è, là sotto?', 'm02', 's', [malva('Edera. Più vecchia del villaggio. Ti chiamerà con un altro nome. Lasciala fare.')]),
    ),
    travel('depths.entry'),
    N('Scale umide. Odore di terra, di vino vecchio, di qualcosa che aspetta.'),
    diary('Sono scesa sotto il villaggio. Malva mi teneva la lanterna.'),
    xp(5),
    step('c3.edera'),
  ],

  'c3.edera': [
    edera('Chi sei? Ah. La ragazza. Rosalba.'),
    choice(
      opt('Mi chiamo {name}.', 'm00', 'w', [edera('{name}. Lo scordo entro sera. Le carte no: quelle non le scordo mai.')]),
      opt('Rosalba va bene.', 'm02', 'c', [edera('Brava. Non si contraddice una vecchia. Si aspetta che si contraddica da sola.')], { trust: { edera: 1 }, flag: 'edera.rosalba' }),
    ),
    edera('Il Diavolo sta alle catene. La Torre a nord. La Stella in fondo al pozzo. La Luna nella palude.'),
    edera('Io ricordo tutto. Tranne i nomi. E dove ho messo gli occhiali. E perché sono qui.'),
    draw(DEPTHS_POOL, 'Il dono di Edera'),
    teach('celtic'),
    lesson('celtic'),
    edera('Dieci carte. Una croce e un bastone. È una vita intera, sul tavolo.'),
    edera('La seconda si mette di traverso. Ti attraversa. A volte ti aiuta, a volte ti sbarra.'),
    lesson('astro'),
    edera('La tua carta, adesso, è {yourCard}. Le carte ti guardano, Rosalba. Cioè. Come ti chiami.'),
    edera('Vai al cottage, leggi la croce a qualcuno. Poi torna, quando hai tutte le carte. Ci riuniamo.'),
    diary('Nonna Edera mi chiama Rosalba. Le carte invece se le ricorda tutte.'),
    step('c3.client'),
  ],

  'c3.coven': [
    IF({ majorsMin: 19 }, [
      cinema(['Tre maestre intorno a un tavolo che zoppica.', 'Nessuna è d\'accordo con le altre due.'], 'depths.coven'),
      ortica('Io dico: entriamo dalle cantine, la prendiamo, usciamo, e intanto...'),
      malva('Intanto niente. Tu parli e ci sentono fino a Boston.'),
      edera('Il Giudice. L\'ho conosciuto bambino. Mangiava le candele.'),
      ortica('Ecco, vedi? Anche lei divaga. Non sono solo io.'),
      malva('Basta. Decide lei.'),
      N('Tre teste si girano verso di te.'),
      IF({ trust: ['malva', '>=', 2] }, [malva('Spacca la legna e non si lamenta. Di lei mi fido.')]),
      IF({ trust: ['ortica', '>=', 2] }, [ortica('Io mi fido. L\'ho già detto a tutto il bosco, quindi è vero.')]),
      IF({ trust: ['edera', '>=', 2] }, [edera('Rosalba ha buone mani. Mi fido delle mani.')]),
      edera('Al processo ti aiuta chi si fida di te. Malva cancella un errore. Ortica fa saltare una domanda.'),
      edera('E io tolgo una risposta sbagliata. Se mi ricordo. Mi ricordo.'),
      choice(
        opt('Dalle cantine. Di nascosto.', 'm18', 'c', [
          ortica('Lo sapevo! Cioè, lo speravo. Cioè, ho vinto io.'),
          malva('Non fare rumore. Non respirare, se riesci.'),
          edera('Le celle sono oltre le catene. Il Diavolo sa aspettare. Tu no.'),
          diary('Ho scelto il buio. Andrò a prendere Ginepra dalle cantine.'),
          step('c3.jail'),
        ], { flag: 'b3.stealth' }),
        opt('A viso aperto. Al processo.', 'm11', 's', [
          IF({ flag: 'b1.spoke' },
            [malva('Davanti a tutti. Come in piazza. L\'hai già fatto una volta.')],
            [malva('Davanti a tutti. In piazza hai taciuto. Stavolta no, eh?')]),
          edera('Il Giudice ama le domande. Rispondi meglio di lui.'),
          diary('Ho scelto di entrare in tribunale dalla porta. Col mio nome.'),
          step('c3.court'),
        ], { flag: 'b3.open' }),
      ),
      IF({ power: 'cat' }, [cat('(Comunque vada, finisce davanti al Giudice. Ripassa, finché sei in tempo.)')]),
      xp(10),
    ], [
      edera('Mancano carte, Rosalba. Il Giudice le conosce tutte, una per una.'),
      edera('Torna quando le hai trovate tutte. Tutte quelle che si possono trovare.'),
      IF({ power: 'cat' }, [cat('(Nel grimorio, le caselle vuote dicono dove cercare. E se te ne hanno prese, sono al deposito.)')]),
    ]),
  ],

  'c3.jail': [
    cinema(['Le cantine finiscono contro un cancello arrugginito.', 'Dietro, una cella. Dentro, qualcuno che canticchia.'], 'depths.jail'),
    ginepra('Sei venuta! Lo sapevo! Cioè, lo speravo. È uguale, te l\'ho detto.'),
    IF({ flag: 'fire.promised' }, [ginepra('L\'avevi promesso, al fuoco. Visto? Me lo ricordo.')]),
    choice(
      opt('Zitta. Apro.', 'm01', 'w', [N('La serratura cede al terzo tentativo. Con un cigolio lunghissimo.')]),
      opt('Stai bene?', 'm14', 'c', [ginepra('Benissimo. Il pane è di pietra e il topo è simpatico. Ah ah.')], { trust: { ginepra: 1 } }),
    ),
    N('Una voce gentile, dietro di voi. Gentile davvero.'),
    judge('Buonasera. Non correte, vi prego. Si scivola, qui sotto.'),
    judge('Due ragazze di notte nelle mie celle. Ne parleremo domattina. Con calma.'),
    IF({ power: 'cat' }, [cat('(Tutto il pelo. Tutto. Anche quello che non sapevo di avere.)')]),
    diary('Sono arrivata alle celle dalle cantine. Il Giudice ci aspettava, gentile.'),
    travel('court.dock'),
    xp(5),
    step('c3.trial'),
    goto('c3.trial'),
  ],

  'c3.court': [
    cinema(['Il tribunale è pieno. È mattina presto.', 'Ginepra è sul banco degli accusati, con le mani legate.'], 'court.dock'),
    N('Entri. Le teste si girano. Stavolta lo sai: guardano te.'),
    choice(
      opt('«Mi chiamo {name}. Processate me.»', 'm11', 's', [judge('Che gentile. Prego, si accomodi. Abbiamo una sedia apposta.')]),
      opt('«Lei non c\'entra. La strega del cottage sono io.»', 'm07', 'w', [judge('Lo so. Lo sapevo. Ma è bello sentirlo dire.')]),
    ),
    ginepra('Sei matta. Ah ah. Sei proprio matta.'),
    diary('Sono entrata in tribunale e ho detto il mio nome. Ad alta voce.'),
    travel('court.dock'),
    xp(5),
    step('c3.trial'),
    goto('c3.trial'),
  ],

  // the trapdoor after the first descent: down again
  'c3.trapdoor.again': [
    T('La botola. Sotto, le cantine. Scendo.'),
    travel('depths.entry'),
  ],

  // Edera in her nook, later in chapter 3
  'edera.chat': [
    IF({ flag: 'edera.rosalba' },
      [edera('Rosalba! Sei tornata. Sei Rosalba, vero? Sì. Lo sento.')],
      [edera('Tu sei... non dirmelo. {name}. No. Sì. Forse.')]),
    choice(
      opt('Mi ripeti la croce?', null, null, [edera('Presente, ciò che attraversa, fondamenta, passato, possibilità, futuro. Poi la colonna: tu, gli altri, speranze e paure, esito.')]),
      opt('Mi racconti del Giudice?', null, null, [
        edera('Da bambino mangiava le candele. Da grande spegne le persone. Con garbo, però.'),
        IF({ notFlag: 'edera.told' }, [trust('edera', 1), flag('edera.told')]),
      ]),
    ),
  ],
};
