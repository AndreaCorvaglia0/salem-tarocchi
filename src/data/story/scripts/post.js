// Optional encounters that reward wandering (a worry, a rumour that leads to a card, a little xp),
// the small cards in the tall grass (the first Minor, the first duplicate, swapping with Ginepra) and
// the lines after the ending. Villagers speak through the narrator, in «».
import { N, T, ginepra, cat, cop, o, tg, choice, IF, xp, coins, flag, tool, open, sp } from '../h.js';

const reward = (k) => [xp(5), flag(`enc.${k}`)];

export const POST = {
  'enc.child': [
    N('Davanti alla porta nera c\'è un bambino col naso rosso, che ti fissa senza nessuna vergogna. «Tu sei una strega? La nonna dice che le streghe non hanno l\'ombra.»'),
    choice(
      o('Gli faccio vedere la mia ombra sul muro.', { tono: 1 }, [
        N('La guarda a lungo, poi alza le spalle, deluso. «Allora ce l\'hai, e non sei una strega: sei soltanto una forestiera.»'),
      ], { tag: tg('m19', 'w') }),
      o('Gli faccio la faccia più spaventosa che so fare.', { tono: -1 }, [
        N('Scappa urlando fino all\'angolo della via. Poi torna indietro, piano, ti tira il mantello e ti chiede di rifarla.'),
      ], { tag: tg('m18', 'c') }),
      // special answers: two ways to show him that she is a witch, and he pays like for a show
      sp('magic', { power: 'fire' }, 'Gli accendo una fiammella sul palmo, e gliela faccio vedere.', { rischio: 1 }, [
        N('Il bambino guarda la fiamma senza fiatare, poi guarda te, e fa un passo indietro e due avanti. «Allora sei una strega vera! Non lo dico a nessuno, giuro, nemmeno alla nonna.»'),
        N('Poi fruga in tasca e ti mette in mano due monete calde. «Per vedere le streghe vere si paga, lo dice anche il pastore, soltanto che lui lo dice arrabbiato.»'),
        coins(2),
      ]),
      sp('tartufo', { tartufo: 1 }, 'Gli faccio accarezzare Tartufo, che sbuffa ma lo lascia fare.', { esplora: 1 }, [
        N('Tartufo si lascia toccare con l\'aria di chi fa un favore a tutto il villaggio. «È un gatto nero, ed è tuo! Allora sei una strega davvero, e sull\'ombra la nonna si sbagliava.»'),
        cat('(Diglielo tu, che non sono di nessuno. Anzi no, lascia stare: ha le mani calde e sa dove grattare, per essere uno così piccolo.)'),
        N('Prima di lasciarti andare ti apre la mano e ci mette due monete calde di tasca. «Queste sono per il gatto, non per te.»'),
        coins(2),
      ]),
    ),
    IF({ lacks: 'm02' }, [
      N('«Io un segreto lo so. Dietro la tenda della sarta c\'è una figura con una signora seduta tra due colonne, che tiene un rotolo sulle ginocchia e non lo fa leggere a nessuno.»'),
      N('«La sarta dice che è una che sa le cose e sta zitta. Io non sarei capace.»'),
      flag('side.m02'),
    ], [
      N('«Il bottegaio della porta nera vende cose che non dovrebbero esistere. Lo dice la mamma, e poi ci va lo stesso.»'),
    ]),
    ...reward('child'),
  ],
  'enc.washer': [
    N('La lavandaia Tabita è ancora davanti al suo secchio. «Senti un po\', tu che sei nuova: il pozzo è gelato e mio marito russa. Secondo te cos\'è peggio?»'),
    choice(
      o('«Secondo me è peggio il marito.»', { tono: -1 }, [
        N('«Lo dicevo io!» Ride forte, e dice che non le capitava da novembre.'),
      ], { tag: tg('m04', 'p') }),
      o('«Il pozzo, perché senz\'acqua non si lava niente.»', { guida: -1 }, [
        N('«Allora vuol dire che mi tengo il marito.» Ci pensa su, poi ride, e dice che non le capitava da novembre.'),
      ], { tag: tg('m03', 'p') }),
    ),
    N('«Comare Malva è brusca, sì, ma con questo unguento domani ho le mani nuove. Dille che il bucato di questa settimana glielo porto stirato.»'),
    ...reward('washer'),
  ],
  'enc.hale': [
    N('Al banco del mercato c\'è Comare Hale, quella delle candele. Quando ti riconosce esce da dietro il banco e ti mette in mano un pacchetto legato con lo spago, senza dire una parola.'),
    choice(
      o('«Non dovevate disturbarvi, davvero.»', { parola: -1 }, [
        N('«Invece dovevo, e come.» Lo dice piano, guardandoti bene in faccia, e poi torna dietro il banco come se non fosse successo niente.'),
      ], { tag: tg('m03', 'c') }),
      o('Le sorrido, e non dico niente nemmeno io.', { guida: 1 }, [
        N('Ti sorride anche lei. Ha ancora le mani che tremano un poco, e le nasconde sotto il grembiule.'),
      ], { tag: tg('m14', 'c') }),
    ),
    N('Nel pacchetto c\'è dell\'incenso, di quello buono, che calma i nervi a chi lo respira. Hale lo sa meglio di chiunque altro, dopo quella sera.'),
    tool('incense', 1),
    ...reward('hale'),
  ],
  'enc.gravedigger': [
    N('Tra le lapidi c\'è un becchino appoggiato alla vanga. «Non guardarmi in quel modo, ragazza. Io la gente la metto giù con rispetto; a farla cadere ci pensano altri.»'),
    choice(
      o('«Non avete paura, qui da solo, di notte?»', { esplora: 1 }, [
        N('«Dei morti no, sono i vicini più tranquilli che ho. Dei vivi un poco, e dei gatti parecchio.»'),
      ], { tag: tg('m13', 'c') }),
      o('«Vi serve una mano con quella vanga?»', { tono: 1 }, [
        N('«Hai le mani da strega, non da becchino, e qui la terra è dura. Però è la prima volta che qualcuno me lo chiede, e ti ringrazio.»'),
      ], { tag: tg('m09', 'p') }),
      // special answer: he is afraid of cats, and pays to have this one kept away
      sp('tartufo', { tartufo: 1 }, 'Lascio che Tartufo gli si strusci contro gli stivali.', { tono: -1 }, [
        N('Il becchino diventa bianco come le sue lapidi e alza la vanga tra sé e il gatto. «Portalo via, per carità! Seppellisco la gente da trent\'anni, ma quelle bestie mi guardano come se sapessero la data.»'),
        cat('(La so, infatti, ma non gliela dico. Intanto che trema fatti pagare il disturbo: è la prima volta che la mia faccia rende qualcosa.)'),
        N('Ti allunga tre monete tenendole per il bordo, senza staccare gli occhi da Tartufo. «Queste sono per il disturbo di tenerlo dall\'altra parte del cancello.»'),
        coins(3),
      ]),
    ),
    IF({ power: 'cat' }, [
      N('Mentre parla tiene d\'occhio Tartufo, e fa mezzo passo indietro ogni volta che il gatto muove la coda.'),
      cat('(Ha paura di me, hai visto? Questo cimitero comincia a piacermi.)'),
    ]),
    N('«L\'anno scorso ho sepolto due fratelli che si erano ammazzati per un palmo di terra. Sulla pietra di confine tra i loro campi qualcuno ha lasciato una carta, con una donna che tiene una bilancia e una spada.»'),
    N('«Dicono che pesi quello che uno ha fatto e gli renda il conto, né più né meno. A quei due l\'ha reso, questo è sicuro.»'),
    flag('side.m11'),
    IF({ lacks: 'm13' }, [N('«Ce n\'è una anche qui, tra le lapidi vecchie, con uno scheletro a cavallo. Io non la tocco: quello che non è mio lo lascio dov\'è.»')]),
    ...reward('gravedigger'),
  ],
  'enc.miller': [
    N('Il mugnaio è di nuovo davanti alla sua ruota. «Gira sempre al contrario, se vuoi saperlo. Ma da quando metto l\'unguento di Ortica almeno le ginocchia mi girano dalla parte giusta.»'),
    choice(
      o('«E vostra moglie cosa dice?»', { esplora: 1 }, [
        N('«Dice che se la ruota gira al contrario, allora anche i debiti dovrebbero tornare indietro. Ha sempre avuto più testa di me.»'),
      ]),
      o('«Finché macina, lasciatela girare come vuole.»', { guida: -1 }, [
        N('«È quello che diceva mio nonno, parola per parola. Tu sei sicura di non essere di qui?»'),
      ]),
    ),
    ...reward('miller'),
  ],
  'enc.guard': [
    cop('Eh, chi va là? Non stavo dormendo, sia chiaro: stavo pensando con gli occhi chiusi, che si pensa meglio.'),
    choice(
      o('«Sono il fantasma del pozzo. Torna a dormire.»', { rischio: 1 }, [
        cop('Ah, buonasera, signor fantasma. Io non ho visto niente e non ho sentito niente, e se me lo chiedono giuro che ero sveglio.'),
      ], { tag: tg('m18', 'c') }),
      o('«Continuate pure a pensare. Io passo, e non disturbo.»', { rischio: -1 }, [
        cop('La ringrazio, signorina. Pensare stanca molto, sa, e non tutti lo capiscono. Lei mi sembra una persona comprensiva.'),
      ], { tag: tg('m00', 'w') }),
    ),
    cop('Già che è qui, le dico perché non dormo. Dalla palude, di notte, vengono su due cani che abbaiano alla luna, e in mezzo al fango c\'è un sentiero che passa tra due torri.'),
    cop('In fondo a quel sentiero qualcuno ha visto una carta. Mia nonna diceva che con la luna le cose non sono mai come sembrano, e che metà della paura uno se la fa da solo. Io comunque non ci vado.'),
    flag('side.m18'),
    IF({ lacks: 'm17' }, [cop('E qui nel pozzo, la notte, c\'è una luce che sembra una stella. Non scendo a guardare nemmeno quella, perché sono di guardia. E perché sto pensando.')]),
    ...reward('guard'),
  ],

  // ---- the small cards in the tall grass: the world plays these on the first Minor and on the first duplicate
  'minor.first': [
    N('Nell\'erba alta c\'è una carta più piccola di quelle che conosci. Non ha una figura solenne: soltanto i segni di un seme, come le carte con cui si gioca all\'osteria.'),
    IF({ power: 'cat' },
      [cat('Questa è una delle piccole. Ce ne sono cinquantasei, sparse nell\'erba di tutta Salem, e parlano dei giorni qualunque. Conviene raccoglierle, perché i giorni qualunque sono quasi tutti.')],
      [T('Dev\'essere una delle cinquantasei piccole di cui parlava Malva, quelle dei giorni qualunque. Questa la tengo io.')]),
    IF({ flag: 'met.ginepra' }, [T('Ginepra ne avrà già un mucchio, conoscendola. Appena la vedo gliela faccio vedere.')]),
    flag('minor.first'),
  ],
  'minor.dup': [
    IF({ power: 'cat' },
      [cat('Questa ce l\'hai già, uguale identica. Non buttarla, però: Ginepra per un doppione darebbe via anche i guanti.')],
      [T('Questa ce l\'ho già, uguale identica. La tengo lo stesso: a qualcuno un doppione farà comodo.')]),
    flag('minor.dup'),
  ],

  // Ginepra swaps duplicates (from chapter 2, at the campfire, and after the ending)
  'trade.ginepra': [
    IF({ step: 'c2.plan' }, [ginepra('Al tribunale non stanotte: prima ripassiamo. Io delle mie carte ne so la metà, e a te ne mancano ancora del bosco. Se proprio ci devono prendere, almeno facciamo bella figura.')]),
    IF([{ flag: 'minor.first' }, { notFlag: 'ginepra.minor' }], [
      ginepra('Hai trovato la tua prima piccola! Lo sapevo che prima o poi ti saresti chinata nell\'erba anche tu. Io ho cominciato dalle Coppe, perché stanno vicino all\'acqua e mi piace bagnarmi i piedi.'),
      flag('ginepra.minor'),
    ]),
    IF([{ flag: 'minor.dup' }, { notFlag: 'ginepra.dup' }], [
      ginepra('E hai già un doppione! Allora sei ufficialmente una di noi: metà del divertimento è averne due uguali e non sapere a chi darle.'),
      flag('ginepra.dup'),
    ]),
    ginepra('Facciamo così: i doppioni ce li scambiamo. Tu mi dai quelli che hai due volte, io ti do i miei, e nessuna delle due resta con i buchi nel mazzo.'),
    choice(
      o('Va bene, vediamo cos\'hai.', null, [open('trade.open')]),
      o('Adesso no, magari più tardi.', null, [
        ginepra('Quando vuoi tu. Io sono qui, e i doppioni non scappano: l\'ho imparato a mie spese, perché su tre mi ci sono seduta sopra.'),
      ]),
    ),
  ],

  // ---- after the ending
  'post.ginepra': [
    IF({ flag: 'post.met' },
      [ginepra('Hai dei doppioni da scambiare? Io ho trovato tre volte il Due di Coppe, quello dei due innamorati. Tre volte, a me! Le carte mi prendono in giro.')],
      [ginepra('Lo sai che non sono finite? Oltre alle ventidue ce ne sono altre cinquantasei, più piccole, nascoste nell\'erba alta. I Bastoni stanno nel bosco e le Coppe lungo l\'acqua.'),
        ginepra('Le Spade invece sono nella parte alta del villaggio e i Denari al mercato. Facciamo a gara a chi ne trova di più? I doppioni ce li scambiamo, così nessuna resta indietro.'),
        flag('post.met')]),
    IF({ torn: 'tono' }, [ginepra('Con te non si capisce mai se stai per abbracciarmi o per mordermi. Non cambiare, eh: è il motivo per cui non mi annoio.')]),
    choice(
      o('Facciamo a gara, e stavolta arrivo prima io.', null, [
        ginepra('Ah ah, guarda che ho già vinto! Cioè, non ancora, ma mi sono portata avanti: ho cominciato a cercare stamattina.'),
      ]),
      o('Scambiamo i doppioni, con calma.', null, [
        ginepra('Con calma, va bene. Io non so bene cosa voglia dire, ma tu fai strada e io ti vengo dietro, per una volta.'),
        open('trade.open'),
      ]),
      // special answers: a race on the brooms, and a walk with one who knows every corner
      sp('broom', [{ power: 'broom' }, { flag: 'lesson.fly' }], 'Facciamo a gara in volo, fino al mulino e ritorno.', null, [
        ginepra('In volo, contro di me? Guarda che da quando ho quella scopa ho perso soltanto due cappelli, e uno l\'ho anche ritrovato.'),
        ginepra('Ah ah, hai vinto tu, e non lo dico a nessuno. Però il mulino da sopra l\'hai guardato anche tu? La ruota gira al contrario davvero, e adesso lo sappiamo in tre.'),
      ]),
      sp('explore', { explored: 25 }, 'Ti porto io dove cercare: ormai conosco ogni angolo di Salem.', null, [
        ginepra('Ogni angolo, senti questa! E va bene, fai strada tu, che io gli angoli li conosco soltanto di corsa, mentre scappo da qualcuno.'),
        IF({ notFlag: 'post.shared' },
          [ginepra('Lo vedi che in due si fa prima? Tieni, queste le ho trovate io mentre guardavi dall\'altra parte: facciamo a metà, come le persone serie.'), coins(4), flag('post.shared')],
          [ginepra('Oggi non ho trovato una moneta nemmeno a cercarla, ma ho visto tre posti che non conoscevo. Per una che corre sempre, è già un bel bottino.')]),
      ]),
    ),
    T('Sono una Gran Maestra, e passo le giornate a fare a gara con la mia amica nell\'erba alta. Mi sembra che vada benissimo così.'),
  ],
};
