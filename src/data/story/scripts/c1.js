// Chapter 1, the village in winter: Malva, the cottage, Tartufo, the first Exam, Ginepra and
// Il Carro, the Venus glass, the square (fork 1), the gate to the forest.
import {
  bell, N, T, malva, ginepra, cat, cop, say, opt, choice, IF, xp, flag, diary, step, chapter, travel, give,
  draw, teach, lesson, exam, session, power, cinema, wait, trust, point,
} from '../h.js';
import { ROAD_POOL } from './c0.js';

export const C1 = {
  'c1.malva': [
    travel('malva.hearth'),
    malva('Ho scritto NON BUSSARE. E tu bussi.'),
    malva('Bene. Almeno sai leggere. È già qualcosa.'),
    malva('Sei la nuova. Ti aspettavo la settimana scorsa.'),
    choice(
      opt('Ho perso la strada.', 'm00', 'w', [malva('Si perdono tutte. Le brave la ritrovano. Le altre le ritrovo io.')]),
      opt('Nessuno mi aspettava.', 'm09', 'p', [malva('Io sì. Non montarti la testa.')]),
    ),
    malva('Ti tengo perché qualcuno deve spaccare la legna. Io ho le mani per i neonati.'),
    choice(
      opt('Spacco io. Dov\'è l\'ascia?', 'm03', 'p', [malva('Dietro la porta. Non ti ringrazio. Porta male.')], { flag: 'malva.wood', trust: { malva: 1 } }),
      opt('Ho le mani delicate.', 'm01', 'w', [malva('Le farai meno delicate. In una settimana. Garantito.')], { flag: 'malva.cheeky' }),
    ),
    malva('Hai trovato una carta per strada. Si vede: hai la faccia di chi ha visto un fantasma.'),
    malva('Le carte non si comprano. Ti trovano. Siediti.'),
    lesson('deck'),
    malva('Coperte. Non guardare. Scegli con la mano, non con la testa.'),
    draw(ROAD_POOL, 'Il dono di Malva'),
    malva('Un\'altra. Due è il numero di chi impara.'),
    draw(ROAD_POOL, 'Il dono di Malva'),
    teach('single'),
    lesson('single'),
    malva('Una domanda, una carta. Prima guardi l\'immagine e dici cosa vedi. Il libro dopo.'),
    choice(
      opt('E se sbaglio?', 'm00', 'c', [malva('Sbagli. Poi sbagli meglio. Poi smetti. Funziona così.')]),
      opt('Sembra facile.', 'm07', 'w', [malva('Lo sembra anche far nascere un vitello. Chiedi alla vacca.')]),
    ),
    malva('Ti ho preparato la capanna al limite del bosco. Ha il tetto. Quasi tutto.'),
    malva('E di notte non girare. Ci sono i conestabili. E le ragazze che urlano.'),
    diary('Malva mi ha preso in casa. Dice che è per la legna.'),
    step('c1.cottage'),
  ],

  'c1.cottage': [
    travel('cottage.table'),
    N('Un tavolo, un letto, una candela. Odore di fumo vecchio e di mele.'),
    choice(
      opt('Mi piace.', 'm03', 'c', [T('Piccola, storta, mia.')]),
      opt('Ci vorrà del lavoro.', 'm04', 'p', [T('Prima il tetto. Poi tutto il resto.')]),
    ),
    N('Qualcosa si muove sotto il letto. Due occhi gialli.'),
    cat('Finalmente. Ti aspetto da tre inverni.'),
    choice(
      opt('Un gatto che parla?!', 'm18', 'c', [cat('Un gatto che parla, sì. E una strega che strilla. Siamo pari.')]),
      opt('Ciao, gatto.', 'm00', 'w', [cat('Tartufo. Non «gatto». Abbiamo appena cominciato e già mi offendi.')]),
    ),
    cat('Io fiuto le carte nascoste. Quando drizzo le orecchie, cerca lì.'),
    cat('E quando mi si rizza il pelo, sparisci. Vuol dire conestabili.'),
    choice(
      opt('Dargli un pezzo di pane.', 'm14', 'c', [cat('Pane. A un gatto. (Lo mangia tutto, briciole comprese.)')], { flag: 'cat.fed' }),
      opt('Lasciarlo stare: sembra fiero.', 'm08', 'w', [cat('Brava. Rispetto. Il pane me lo prendo da solo, dopo.')], { flag: 'cat.proud' }),
    ),
    power('cat'),
    cat('Senti? Bussano. A quest\'ora vengono solo i disperati. Pagano bene.'),
    cat('Siediti al tavolo. Una domanda, una carta: come ti ha detto Malva.'),
    diary('Ho un gatto. O lui ha me. Si chiama Tartufo e ha opinioni.'),
    step('c1.client'),
  ],

  'c1.exam1': [
    cop('Ehi, tu. Ferma lì.'),
    IF({ power: 'cat' }, [cat('(Pelo dritto. Te l\'avevo detto.)')]),
    cop('Faccia nuova. Di notte. Con un gatto nero. Non promette bene.'),
    choice(
      opt('Sono qui per la levatrice, Malva.', 'm03', 'p', [cop('Malva? Allora sei nei guai due volte.')], { flag: 'exam1.malva' }),
      opt('Sono solo di passaggio.', 'm18', 'c', [cop('Tutti di passaggio. Poi restano. Poi urlano.')], { flag: 'lied.constable' }),
    ),
    cop('Due domande sulle carte. Chi le teme balbetta. Chi balbetta è stregata.'),
    cat('(È l\'Esame. Rispondi sicura e sembri una ragazza istruita. Esita e la barra sale.)'),
    cat('(Se sale troppo, ti svegli in cella e ti prendono qualche carta. Si riprendono, al tribunale.)'),
    cat('(Il primo è indulgente. Respira.)'),
    exam('constable', 'village.square'),
    IF({ flag: 'exam.passed' },
      [cop('Mh. Istruita. Va\' a dormire, istruita.'), cat('(Visto? Più carte conosci, meno ti fermano.)')],
      [cat('(Andata male. Succede. La prossima va meglio: ripassa le carte nel grimorio.)')]),
    IF({ flag: 'lied.constable' }, [diary('Ho mentito al conestabile. Lo rifarei.')]),
    cat('(Laggiù, sotto il carro. Sento qualcosa. Orecchie dritte.)'),
    xp(5),
    step('c1.cart'),
  ],

  'c1.cart': [
    N('Sotto la ruota del carro, una carta mezza sepolta. Ti chini.'),
    N('Una mano arriva prima della tua.'),
    ginepra('Mia! Ah ah. Scusa. Cioè, non scusa: mia.'),
    ginepra('Ginepra. Novizia. Più veloce di te, a quanto pare.'),
    choice(
      opt('Ridammela!', 'm07', 'w', [ginepra('Prendimi, allora! No, aspetta, c\'è il ghiaccio. Non prendermi.')], { flag: 'ginepra.chased' }),
      opt('Tienila. Per ora.', 'm14', 'c', [ginepra('«Per ora». Mi piace. Sa di sfida.')], { flag: 'ginepra.let', trust: { ginepra: 1 } }),
    ),
    ginepra('Il Carro. Va avanti e non si ferma mai. Mi somiglia.'),
    ginepra('Te lo ridò, giuro. Ma non gratis. Stanotte, al bicchiere di Venere. Dietro la canonica.'),
    ginepra('Porta coraggio. Io porto l\'uovo.'),
    flag('met.ginepra'),
    flag('ginepra.snatched'),
    IF({ power: 'cat' }, [cat('(Ride nei momenti sbagliati. Mi piace.)')]),
    diary('Una certa Ginepra mi ha soffiato Il Carro sotto il naso. Ride sempre.'),
    step('c1.venus'),
  ],

  'c1.venus': [
    N('Ginepra tiene un bicchiere d\'acqua alla luce della luna. Ci lascia cadere un albume.'),
    ginepra('Il bicchiere di Venere. Guardi la forma e sai chi sposerai.'),
    ginepra('Le ragazze del villaggio lo fanno di nascosto. Il pastore dice che è peccato.'),
    choice(
      opt('Guardiamo insieme.', 'm06', 'c', [N('L\'albume si apre piano nell\'acqua, come una mano.')], { flag: 'venus.looked' }),
      opt('Questo non è un gioco.', 'm02', 's', [ginepra('Tutto è un gioco finché qualcuno non urla. Guardo io.')], { flag: 'venus.refused' }),
    ),
    N('La forma si allunga. Si stringe. Diventa una cassa stretta e lunga.'),
    ginepra('È una... bara? Ah ah. Ah.'),
    ginepra('Non rido. Cioè, rido perché non rido.'),
    ginepra('Le ragazze che l\'hanno fatto prima di me adesso urlano in piazza.'),
    choice(
      opt('Buttiamo via il bicchiere.', 'm14', 'c', [ginepra('Sì. Buttalo tu. Io non lo tocco più.')], { trust: { ginepra: 1 } }),
      opt('È solo un albume.', 'm01', 's', [ginepra('Hai ragione. Solo un albume. Che sembra una bara. Normale.')]),
    ),
    ginepra('Patti chiari. Il Carro è tuo. Ma la prossima la prendo io.'),
    give('m07'),
    flag('ginepra.returned'),
    IF({ lacks: 'm06' }, [ginepra('E quella sul davanzale lì dietro, Gli Amanti, te la lascio. Non sono pronta.')]),
    ginepra('Domani c\'è gente in piazza. Gente che urla. Vieni?'),
    diary('Nel bicchiere di Venere c\'era una bara. Ginepra ha riso. Io no.'),
    xp(5),
    step('c1.square'),
  ],

  'c1.square': [
    bell,
    cinema(['La piazza è piena. Nessuno parla forte.', 'Una ragazza trema davanti alla chiesa. È un\'Afflitta.',
      'Ha guardato nel bicchiere di Venere. Ora vede streghe ovunque.'], 'village.square'),
    say('afflitta', 'Lei! La vedo! Mi punge con gli spilli!'),
    N('Il dito indica Comare Hale, quella delle candele. Le candele le cadono nella neve.'),
    cop('Comare Hale. Verrete con noi.'),
    IF({ flag: 'venus.looked' }, [T('La bara nell\'albume. L\'abbiamo guardata anche noi.')]),
    IF({ power: 'cat' }, [cat('(Se parli, guardano te. Se taci, guardano lei.)')]),
    choice(
      opt('Farmi avanti: «Le candele non pungono.»', 'm11', 's', [
        say('afflitta', 'Anche lei! Ha gli occhi di quella!'),
        N('Cento facce si girano verso di te. Il dito trema. Poi si abbassa.'),
        cop('Tu. Mi ricorderò la tua faccia.'),
        N('Stanotte Comare Hale torna a casa. Raccoglie le candele una per una.'),
        point('m11', 's'),
        diary('In piazza ho parlato. Mi tremava la voce. Hale è tornata a casa.'),
      ], { flag: 'b1.spoke', trust: { ginepra: 1 } }),
      opt('Restare nell\'ombra.', 'm02', 'c', [
        N('Ti stringi nel mantello. Nessuno ti vede.'),
        N('Comare Hale passa tra due conestabili. Le candele restano nella neve.'),
        T('Avrei potuto dire qualcosa. Lo so.'),
        point('m02', 'c'),
        diary('In piazza sono rimasta zitta. Hale l\'hanno portata via.'),
      ], { flag: 'b1.hid' }),
    ),
    IF({ flag: 'b1.spoke' },
      [ginepra('Sei matta. Ah ah. Sei matta e ti voglio bene.')],
      [ginepra('Hai fatto bene. Credo. Non lo so. Io non ho fatto niente uguale.')]),
    malva('Basta piazza. A casa, tutte e due.'),
    IF({ flag: 'b1.spoke' }, [malva('Coraggiosa e stupida. Le due cose vanno spesso a braccetto.')]),
    malva('Quando avrai almeno cinque carte del villaggio, va\' nel bosco. C\'è Ortica.'),
    xp(10),
    step('c1.gate'),
  ],

  'c1.gate': [
    IF({ majorsMin: 6 }, [
      malva('Allora vai. Ortica parla troppo. Ascoltala lo stesso.'),
      IF({ flag: 'malva.wood' }, [malva('La legna l\'hai spaccata storta. Ma l\'hai spaccata.')]),
      choice(
        opt('Grazie, Malva.', 'm03', 'c', [malva('Non ringraziarmi. Porta male. Te l\'ho detto.')]),
        opt('Mi mancherai.', 'm06', 'c', [malva('Non dire scemenze. E mettiti la sciarpa.')], { trust: { malva: 1 } }),
      ),
      diary('Ho lasciato il villaggio. Malva ha fatto finta di non guardare.'),
      session('s1'),
      chapter(2),
      xp(10),
      step('c2.ortica'),
      travel('forest.entry'),
    ], [
      N('Il cancello del bosco è chiuso con un nodo di spago e di paura.'),
      IF({ power: 'cat' }, [cat('(Non ancora. Prima almeno cinque carte del villaggio. Il grimorio ti dice quali mancano.)')],
        [T('Non ancora. Prima almeno cinque carte del villaggio.')]),
    ]),
  ],

  // Malva at home, any time in chapter 1 after the first scene
  'malva.chat': [
    IF({ stat: ['jailed', '>=', 1] },
      [malva('Ti hanno messa in cella. Lo so. So sempre tutto. Mangia, almeno.')],
      [IF({ flag: 'b1.spoke' },
        [malva('Mezzo villaggio parla di te. L\'altra metà parla di me. Contenta?')],
        [malva('Che c\'è? Hai fame? Prendi il pane. Non ringraziare.')])]),
    choice(
      opt('Cosa vuol dire, una carta sola?', null, null, [malva('Che non hai scuse. Una domanda, una risposta. Guarda l\'immagine.')]),
      opt('Niente. Passavo.', null, null, [malva('Allora passa. La porta è lì.')]),
    ),
  ],
};
