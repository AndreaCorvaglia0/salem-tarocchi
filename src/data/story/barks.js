// Short lines the systems pick at the right moment (the world, the Exam, the jail, the HUD).
// tartufo: `on` is the situation ('card' near a hidden card, 'patrol' a constable near, 'failed' after a
// failed Exam, 'passed' after a passed one, 'idle' standing still, 'minor' a small card found in the
// grass, 'minor.dup' a duplicate), `when` a cond.
// constable / afflicted: said when they have seen her, and as the opening line of their Exam.
// judge: the opening line of the trial Exam. jail: waking up in a cell.
// pop: what Malva or Ginepra says, once, the first time she talks to them in the world after reaching a
// popularity level (glue/bonds.js); `who` speaks it, `level` is the level it announces.
// tartufo.treat / tartufo.pat / tartufo.found: toasts when she gives him a treat, pats him with empty
// hands, or he finds a treat while they explore (he never speaks: his thoughts, in parentheses).
// Who hears Tartufo (lore/retroscena/tartufo-retroscena.md): a line in parentheses is a low voice, only for her.
// A line without parentheses is his full voice: the three teachers hear it and, when he wants, Ginepra; never
// the village, the constables or the Judge.
// diaryFor: event or flag -> first-person diary line (the scripts already write the fork lines).

export const BARKS = {
  // home.2 / home.3: the first time she sees her cottage at a new stage (glue/home.js, world/home.js), once:
  // Tartufo when she has him (`who: 'tartufo'`, his low voice), else her own thought (`who: 'tu'`)
  'home.2': [
    { who: 'tartufo', t: '(Da quando ci abiti tu il camino tira e dal tetto non entra più la neve. Per tre inverni ci ho dormito da solo, e non era la stessa cosa.)' },
    { who: 'tu', t: 'Da quando ci abito io la capanna sta più dritta: il camino tira, e dal tetto non entra più la neve.' },
  ],
  'home.3': [
    { who: 'tartufo', t: '(Adesso sì che sembra la casa di una strega, e chiunque passi lo capisce da lontano. Il gatto sul tetto, però, io l\'avrei fatto più somigliante.)' },
    { who: 'tu', t: 'Guardo la capanna dalla strada e mi sembra la casa di una strega, di una strega che conosco bene.' },
  ],
  tartufo: [
    { on: 'card', t: '(Ho le orecchie dritte, e non è per il vento. Qui vicino c\'è nascosta una carta.)' },
    { on: 'card', t: '(Sento odore di carta vecchia, e anche di topo. Tu cerca la carta, che al topo penso io.)' },
    { on: 'card', when: { chapter: 3 }, t: '(Anche con questo buio una carta si sente. Fruga da quella parte, dove l\'aria sa di inchiostro.)' },
    { on: 'card', when: { power: 'sense' }, t: '(La senti anche tu, adesso, come un filo d\'acqua che tira da quella parte. Seguilo, che io ti vengo dietro.)' },
    { on: 'patrol', t: '(Mi si è rizzato il pelo: da quella parte sta arrivando un conestabile.)' },
    { on: 'patrol', t: '(Vedo una lanterna che viene verso di noi. Se non hai voglia di domande, è il momento di cambiare strada.)' },
    { on: 'patrol', when: { tool: 'bottle' }, t: '(In borsa hai la bottiglia della strega. Se non ti va di rispondere a quello lì, stappala adesso.)' },
    { on: 'patrol', when: { power: 'stun' }, t: '(Soffiagli addosso un po\' della tua aria, se vuoi, purché tu lo faccia con garbo. Io mi giro dall\'altra parte.)' },
    { on: 'failed', t: '(È andata male, ma capita a tutte. Riguardiamo le figure sul quaderno, e poi torniamo fuori.)' },
    { on: 'failed', t: '(Davanti a lui non piangere, mi raccomando. Se proprio devi, piangi dopo, che il mio pelo asciuga in fretta.)' },
    { on: 'failed', when: { stat: ['examsFailed', '>=', 3] }, t: '(Ormai ci hanno prese più volte di quante ne voglia contare. Le carte che sbagli sono sempre le stesse: riguardiamo quelle, prima di uscire.)' },
    { on: 'passed', t: '(Hai visto che per lui adesso sei una ragazza istruita? Ha perfino fatto luce lui stesso, per accertarsene.)' },
    { on: 'passed', t: '(Hai fatto bene così. Adesso cammina tranquilla, come una che non ha appena avuto il cuore in gola.)' },
    { on: 'idle', t: '(Tu stai ferma e io pure. La differenza è che per un gatto stare fermo è un mestiere.)' },
    { on: 'idle', t: '(Se non sai cosa fare, apri il quaderno e riguarda le tue carte. Io intanto mi lavo una zampa.)' },
    { on: 'idle', when: { chapter: 1 }, t: '(Fa un freddo che spacca i baffi. Camminiamo, che almeno ci scaldiamo.)' },
    { on: 'idle', when: { chapter: 2 }, t: '(In questo bosco ogni cespuglio ha una storia, e Ortica le sa tutte. Se ti annoi, passa da lei.)' },
    { on: 'idle', when: { chapter: 3 }, t: '(Qui sotto c\'è un silenzio più grande di me, e io non sono un gatto piccolo.)' },
    { on: 'idle', when: { flag: 'cart.cat' }, t: '(Quella carta sotto il carretto l\'ho presa io, se ti ricordi. Non chiedo un monumento, ma un boccone ogni tanto sarebbe un pensiero gentile.)' },
    { on: 'idle', when: { flag: 'coven.cat.in' }, t: '(Sotto il tuo mantello, in tribunale, ho contato i punti della fodera. Sono quarantadue, e uno si sta scucendo.)' },
    { on: 'idle', when: { flag: 'cat.fed' }, t: '(Di quel pane della prima sera ne hai ancora, per caso? Chiedo per un amico che mi somiglia.)' },
    { on: 'idle', when: { steady: 'esplora' }, t: '(Con te non ci si annoia mai, questo te lo riconosco: o si gira dappertutto o si tira dritto, ma a metà strada non ti ho mai vista.)' },
    // the trials: prizes she keeps, and nights that went badly (src/data/trials)
    { on: 'idle', when: { flag: 'item.il sonaglio d\'argento' }, t: '(Quel sonaglio che hai in borsa suona a ogni tuo passo. Io lo sento, e lo sente anche un certo gatto grigio, che da allora sui tetti mi lascia la destra.)' },
    { on: 'idle', when: { flag: 'item.il cappello di Ginepra' }, t: '(Con il cappello di Ginepra in testa sembri più alta, e anche più incosciente. A lei non dirlo, che è capace di rivolerlo indietro.)' },
    { on: 'idle', when: { flag: 'item.la bussola di Josiah Bray' }, t: '(La bussola del vecchio Bray segna il nord anche dentro la borsa. Io il nord lo sento con i baffi, ma capisco che a te faccia comodo.)' },
    { on: 'idle', when: { flag: 'item.il coperchio con la faccia' }, t: '(Quel coperchio con la faccia di carbone mi guarda da quando l\'hai messo sulla mensola. Stanotte lo giro verso il muro, e tu fai finta di non accorgertene.)' },
    { on: 'idle', when: { flag: 'item.il lume cieco di Malva' }, t: '(Il lume di Malva, con lo sportello chiuso, non fa luce nemmeno per me. È la prima cosa tua che riesce a nascondersi meglio di un gatto.)' },
    { on: 'idle', when: { flag: 'item.il fischietto d\'osso di Ortica' }, t: '(Quel fischietto di Ortica non provarlo qui, per favore. L\'ultima volta che l\'hai fatto mi si sono piegate le orecchie, e lei è arrivata davvero.)' },
    { on: 'idle', when: { flag: 'item.la chiave della cantina grande' }, t: '(Con la chiave di Edera in tasca, di sotto, cammini come una che ha pagato l\'affitto. Ti dona, e ai topi fa impressione.)' },
    { on: 'idle', when: [{ flag: 'trial.well.fail' }, { notFlag: 'trial.well.pass' }, { notFlag: 'trial.well.perfect' }], t: '(Il grigio è tornato sui tetti, e zoppica appena. Di quella notte al pozzo ti devo ancora qualcosa, e non credere che me ne sia dimenticato.)' },
    { on: 'idle', when: [{ flag: 'trial.night.fail' }], t: '(Malva brontola ancora per quelle boccette, ma stamattina ha chiesto se mangi abbastanza. Con lei è così che finiscono le arrabbiature.)' },
    { on: 'idle', when: [{ flag: 'trial.cellars.fail' }], t: '(Se dopo le cantine ti manca una carta, è al deposito del tribunale con il tuo nome sul cartellino. Ci andiamo quando vuoi, e stavolta guardo io le spalle a te.)' },
    { on: 'minor', t: '(Un\'altra delle piccole. Mettila con le altre, che a forza di giorni qualunque si fa un mazzo intero.)' },
    { on: 'minor', t: '(Questa ti mancava ancora. Lo vedi che conviene frugare nell\'erba alta, anche se bagna le zampe?)' },
    { on: 'minor.dup', t: '(Questa ce l\'hai già. Tienila da parte per Ginepra, che in cambio ti darà una delle sue.)' },
  ],
  pop: [
    { level: 1, who: 'malva', t: '«La Bray giura di non conoscerti e intanto va dicendo in giro che le hai fatto bene, e ieri un\'altra mi ha chiesto dove abiti. Tieni il lume acceso, la sera.»' },
    { level: 2, who: 'ginepra', t: '«Al lavatoio stamattina parlavano di te, e nessuna ti chiamava più "quella nuova". Il tuo nome sta girando, e se bussano alla capanna io non mi stupirei.»' },
    { level: 3, who: 'malva', t: '«Stanotte ne sono passati due a chiedere di te prima ancora di chiedere di me. Non montarti la testa, e non lasciarli aspettare al freddo.»' },
  ],
  'tartufo.treat': [
    { t: '(Questo lo mangio, ma non pensare che basti un boccone per comprarmi. Domani ne voglio un altro, possibilmente più grosso.)' },
    { t: '(Adesso girati dall\'altra parte mentre mangio, che un gatto ha la sua dignità. Comunque era buono, questo te lo concedo.)' },
    { t: '(Sa di pesce e di bottega, e a me va benissimo così. Se in borsa ne hai un altro, io resto qui ad aspettare.)' },
    { t: '(Sto facendo le fusa solo perché ho la bocca piena, e tu non andarlo a raccontare alle altre streghe.)' },
  ],
  'tartufo.pat': [
    { t: '(Va bene, una carezza la sopporto. Però dietro le orecchie, e senza tirarla per le lunghe.)' },
    { t: '(Mi hai lisciato il pelo al contrario, e adesso devo rimettermelo a posto da capo. Lo faccio volentieri, ma ricordati che è colpa tua.)' },
    { t: '(Vedo che hai le mani vuote. La carezza te la perdono, ma la prossima volta porta qualcosa da mangiare.)' },
  ],
  'tartufo.found': [
    { t: '(Sotto quel cespuglio c\'era un boccone che nessuno reclamava. Te lo affido perché tu lo porti in borsa, ma ricordati che è mio.)' },
    { t: '(Mentre tu guardavi il paesaggio io ho trovato da mangiare. Tienilo tu, che me lo dai quando te lo chiedo.)' },
    { t: '(Qualcuno ha perso un pezzo di formaggio, e io l\'ho trovato prima dei topi. Mettilo via, che più tardi lo voglio.)' },
  ],
  constable: [
    { t: 'Ferma lì, ragazza. Ti faccio qualche domanda, e poi vai per la tua strada.' },
    { t: 'In giro da sola a quest\'ora? Vediamo un po\' se sai quello che dovresti sapere.' },
    { when: { stat: ['jailed', '>=', 1] }, t: 'Sei di nuovo tu. Stavolta cerca di rispondere meglio, che in cella c\'è corrente.' },
    { when: { flag: 'b1.spoke' }, t: 'Tu sei quella che ha parlato in piazza, la tua faccia me la ricordo. Adesso parla con me.' },
    { when: { chapter: 3 }, t: 'Cosa ci fai nelle cantine a quest\'ora? Rispondi alle mie domande, e fallo in fretta.' },
    { when: { trait: ['tono', '<=', -3] }, t: 'Mi hanno detto che hai la risposta pronta. Vediamo se ce l\'hai anche sulle carte.' },
    { when: [{ chapterMax: 1 }, { flag: 'exam1.bray' }], t: 'Tu sei quella della vedova Bray. Lei garantisce per te, e io intanto qualche domanda te la faccio lo stesso.' },
    { when: [{ chapterMin: 2 }, { flag: 'lied.constable' }], t: 'Tu sei quella che era soltanto di passaggio, me l\'hanno riferito. Vediamo se sulle carte dici la verità più volentieri.' },
    { when: [{ chapter: 3 }, { flag: 'guard.ghost' }], t: 'Il collega di guardia al pozzo giura di aver parlato con un fantasma. Io ai fantasmi non credo, quindi alle mie domande rispondi tu.' },
    { when: [{ chapter: 3 }, { flag: 'guard.asleep' }], t: 'Il collega del pozzo dorme da ieri e sorride nel sonno. Non so che cosa gli sia preso, ma tu mi sembri una che potrebbe saperlo.' },
  ],
  afflicted: [
    { t: 'È lei, è proprio lei! La sento che mi punge anche da qui!' },
    { t: 'Ha gli occhi di una strega, guardatela! Fatela parlare, e sentirete anche voi!' },
    { when: { flag: 'b1.spoke' }, t: 'Tu in piazza hai difeso quella delle candele! Allora sei come lei!' },
    { when: { chapterMin: 2 }, t: 'L\'ho vista nel bicchiere, in fondo all\'acqua! C\'era una bara, e accanto c\'era lei!' },
  ],
  judge: [
    { t: 'Prenda pure tutto il tempo che le serve, signorina. Io ne ho moltissimo, e l\'aula è nostra fino a sera.' },
    { t: 'Risponda come se fossimo soli, la prego. In fondo qui ci siamo soltanto io, lei e la verità.' },
    { t: 'Sbagliare è umano, signorina, e nessuno qui glielo rimprovera. È l\'esitazione, che mi dà da pensare.' },
    { t: 'Cominciamo dalle più facili, così prende confidenza. Per ora non c\'è niente di cui preoccuparsi.' },
    { when: { trust: ['malva', '>=', 2] }, t: 'Signora Malva, la prego di non sbuffare in aula. La sento benissimo anche da qui.' },
    { when: { trust: ['ortica', '>=', 2] }, t: 'Signora Ortica, ho capito: se continua a parlare una domanda la saltiamo, pur di sentire come finisce.' },
    { when: { trust: ['edera', '>=', 2] }, t: 'La signora Edera desidera dire qualcosa? Mi pare di no, anzi mi pare che dorma. Allora proseguiamo senza svegliarla.' },
  ],
  jail: [
    { t: 'Ti svegli su un mucchio di paglia umida, tra quattro muri di pietra fredda. È una cella del tribunale.' },
    { t: 'Ti svegli in cella, con la borsa più leggera. Qualche carta te l\'hanno presa, e l\'hanno messa nel deposito del tribunale, qui sopra.' },
    { when: { stat: ['jailed', '>=', 2] }, t: 'Sei di nuovo nella stessa cella. La paglia, ormai, ha preso la forma della tua schiena.' },
    { when: { power: 'cat' }, t: 'Dalla grata in alto ti guarda Tartufo. «Io ti aspetto qui fuori. Fai pure con comodo, che tanto la notte è lunga.»' },
    { when: { flag: 'ginepra.taken' }, t: 'Dall\'altra parte del muro qualcuno canticchia una canzone, stonando. Potrebbe essere Ginepra.' },
  ],
  diaryFor: {
    'card:found': 'Ho trovato una carta nuova. Mi è sembrato che fosse lei a guardare me per prima.',
    'card:star': 'Una delle mie carte, oggi, mi ha detto qualcosa in più di ieri.',
    'cards:confiscated': 'I conestabili mi hanno preso delle carte. Sono al deposito del tribunale, e le rivoglio.',
    'card:recovered': 'Ho ripreso una carta dal deposito del tribunale. Era mia, e adesso lo sanno anche loro.',
    'yourcard:changed': 'Mi sembra che le carte, da qualche giorno, mi vedano in un altro modo.',
    'level:up': 'Oggi mi sento un po\' più strega di ieri.',
    'exam.passed': 'Un conestabile mi ha fermata per strada, e ho risposto bene a tutto.',
    'exam.failed': 'Un conestabile mi ha fermata, e davanti a lui mi sono messa a balbettare.',
    'jailed': 'Ho dormito in una cella del tribunale. Il pane sembrava di pietra.',
    'stun': 'Ho soffiato un po\' d\'aria addosso a un conestabile, e per un momento non ha più saputo dov\'era.',
    'fire': 'Ho acceso la fiammella dove era buio, e ho visto dove mettevo i piedi.',
    'reading': 'Ho letto le carte a una persona che aveva bussato, e mi ha pagata.',
    'lock': 'Una serratura si è aperta perché conoscevo la risposta.',
    'shop.open': 'La bottega con la porta nera, finalmente, mi ha fatta entrare.',
    'power.broom': 'Adesso ho una scopa, e la scopa vola davvero.',
    'power.sense': 'Quando una carta nascosta è vicina la sento, come si sente l\'acqua che scorre sotto il ghiaccio.',
    'power.move': 'Ho chiesto a un masso di farsi da parte, e si è fatto da parte.',
    'cat.fed': 'Ho diviso il mio pane con Tartufo. Ha fatto finta che non gli importasse.',
    'ortica.gossip': 'Ortica mi ha raccontato i fatti di tutto il bosco, compreso che Malva canta di nascosto.',
    'enc.hale': 'Comare Hale mi ha regalato un pacchetto di incenso, senza dire una parola.',
    'minor.first': 'Nell\'erba alta ho trovato la mia prima carta piccola, di quelle dei giorni qualunque.',
    'fog.lost': 'Nel folto la nebbia mi ha fatta girare in tondo e mi ha riportata dov\'ero partita. Mi manca ancora qualcosa.',
    'gate1.refused': 'Malva dice che non sono ancora pronta per il bosco. Devo leggere per chi bussa e riguardare le mie carte.',
    'gate2.refused': 'Malva non mi porta nelle cantine finché non sono una strega fatta. Devo leggere ancora, e ripassare.',
  },
};
