---
tipo: retroscena
persona: "[[vedova-bray]]"
fonte: "deciso"
in_breve: "Trent'anni accanto a un uomo che teneva una carta nel libro delle preghiere e non le disse mai perché; la settimana dopo il funerale consegnò il mazzo di lui al tribunale, per obbedienza, e non se lo perdona."
vuole: "Sapere chi era suo marito nelle cose che non le ha detto. E riavere quello che ha dato via."
teme: "Di scoprire che c'era un'altra. Sotto, di scoprire che non c'era niente e che è stata lei a non chiedere mai."
ferita: "Il mazzo di Josiah, consegnato ai conestabili ancora caldo delle sue mani perché il pastore aveva detto dal pulpito che andava fatto."
non_direbbe_mai: "Che il mazzo c'era. Che la sera, quando lui girava una carta prima di dormire, lei guardava."
bugia_che_si_racconta: "Che è una donna di chiesa e che con quelle figure non ha mai avuto a che fare."
cosa_pensa:
  - { di: "[[malva]]", cosa: "La levatrice a cui non ha mai avuto motivo di bussare. Le manda le monete per la ragazza e non chiede niente." }
  - { di: "[[giudice]]", cosa: "Un signore a cui si può mentire sorridendo, se lui ha già deciso di crederti." }
  - { di: "[[conestabile-della-piazza]]", cosa: "Quello a cui ha messo in mano il mazzo. Gli ha detto che dormiva, quando gliel'hanno chiesto, e lo ridirebbe." }
  - { di: "[[tabita]]", cosa: "Al lavatoio la ascolta e non riporta. Per questo parla troppo proprio lì." }
  - { di: "[[comare-hale]]", cosa: "Quella delle candele da poco. Non sa che cosa le hanno fatto, o fa finta." }
  - { di: "[[bottegaio]]", cosa: "Il tabacco di Josiah. Non entra più." }
  - { di: "[[tartufo]]", cosa: "Il gatto della ragazza. Lo guarda di traverso e gli lascia una crosta." }
  - { di: "[[ortica]]", cosa: "Una chiacchierona del bosco, da non frequentare." }
  - { di: "[[edera]]", cosa: "La figlia del pastore di una volta. Josiah la nominava con rispetto, e lei non ha mai chiesto perché." }
  - { di: "[[ginepra]]", cosa: "Una ragazza senza giudizio. Le è grata, senza sapere di che." }
  - { di: "[[mugnaio]]", cosa: "Macinava il grano del campo di Josiah. Quest'anno non sa che cosa seminare." }
  - { di: "[[protagonista]]", cosa: "«Figliola.» La sola a cui abbia fatto una domanda vera da novembre. Dice in giro che le ha fatto bene, e a lei dice che non si sono mai viste." }
ipotesi:
  - { su: "le carte", cosa: "Vengono dal mare. Le portano i marinai nelle casse, da porti dove la gente parla un'altra lingua, come Josiah portò la sua. Per questo nessuno a Salem sa dire chi le fa.", perche: "L'unico mazzo che abbia visto è sbarcato insieme a suo marito." }
  - { su: "le afflitte", cosa: "È il castigo per aver giocato con quelle cose, come dice il pastore. Lo ripete, e intanto va dalla ragazza della capanna.", perche: "Ha bisogno che il pastore abbia ragione su qualcosa, dopo quello che gli ha dato retta a fare." }
  - { su: "tartufo", cosa: "Un gatto nero. Si segna, e poi lo lascia stare.", perche: "Josiah diceva che sulle navi portano bene." }
  - { su: "la ragazza nuova", cosa: "L'ha mandata la Provvidenza, nell'inverno in cui a lei serviva una persona con cui non dover fare bella figura.", perche: "Mette in conto alla Provvidenza anche le cose che il pastore non approverebbe." }
sente_tartufo: "no: nemmeno quando lui parla forte a due passi da lei."
affiora:
  - "Tocca il rosario quando mente e quando dice la verità, allo stesso modo."
  - "Dice «il mio Josiah faceva sempre» e non finisce la frase."
  - "Se vede un mazzo, guarda prima il dorso."
non_affiora:
  - "Che fu lei a consegnare il mazzo."
  - "Che non hanno avuto figli: si capisce da come dice «figliola»."
sostiene:
  - { dove: "clients.js#c1.widow", cosa: "«Non dovrei nemmeno essere qui, e se il pastore lo viene a sapere mi toglie il saluto»; «Noi due non ci siamo mai viste, siamo intese?»" }
  - { dove: "trials.js#trial.grave.door", cosa: "«Di una donna, se proprio volete saperlo. Trent'anni di matrimonio, e adesso mi viene questo pensiero.»; «Per questo vengo da voi, e non dal ministro.»" }
  - { dove: "trials/side.js#grave", cosa: "«una cosa che il mio Josiah faceva sempre, e che il ministro non deve sapere»; il segno della carta nel libro, «rimasta per vent'anni»; la bussola." }
  - { dove: "c2.js#c2.plan", cosa: "il cartellino «Bray, vedova»." }
  - { dove: "c3.js#c3.trapdoor", cosa: "«ha trovato il suo mazzo sul davanzale. Non ha chiesto chi ce l'ha messo, ma mi ha lasciato queste per te.»" }
  - { dove: "end.js#c3.trial", cosa: "«ha risposto che non ne ha mai avuto uno, e lo ha detto sorridendo»: è vero alla lettera, perché era di lui." }
  - { dove: "c1b.js#c1.exam1", cosa: "«Quella non parla bene di nessuno da quando le è morto il marito.»" }
  - { dove: "barks.js#pop", cosa: "«La Bray va dicendo in giro che le hai fatto bene.»" }
corregge:
  - { contraddizione: "Buco: perché ha un mazzo nel deposito se dice di non averne mai avuto uno", come: "Era di Josiah, e lo consegnò lei. «Mai avuto uno» è vero alla lettera.", cambia: "niente." }
  - { contraddizione: "9. La vedova e il segreto", come: "È fatta così: chiede il silenzio e poi al lavatoio non resiste.", cambia: "barks.js#pop: «La Bray va dicendo in giro che le hai fatto bene» diventa «La Bray giura di non conoscerti e intanto va dicendo in giro che le hai fatto bene»." }
  - { contraddizione: "8. Josiah Bray", come: "La candela compare ogni mese, nel giorno in cui fu sepolto: così la prova vale in ogni stagione.", cambia: "trials.js#trial.grave.door: «Domani notte fa un anno che ho seppellito Josiah» diventa «Domani notte è il giorno del mese in cui ho seppellito Josiah». trials/side.js#grave: «Stanotte fa un anno che l'ho messo sotto terra» diventa «Stanotte è il giorno del mese in cui l'ho messo sotto terra», e «da un anno» diventa «da mesi»." }
---

Si sposò trent'anni fa, a ventisei, con un marinaio che aveva deciso di restare a terra. Josiah Bray aveva una bussola d'ottone, un campo comprato con la paga di dieci viaggi e, in fondo alla cassa, un mazzo di carte preso in un porto di cui lei non imparò mai il nome. Era un uomo che scaldava le mani a sua moglie senza dire niente. I figli non vennero, e non ne parlarono.

La sera, prima di dormire, lui girava una carta sul comodino, la guardava e la rimetteva via. Lei faceva finta di pregare, e guardava. Vent'anni fa una di quelle carte, un vecchio con la lanterna, finì nel libro delle preghiere e ci restò. Lei non chiese, perché chiedere voleva dire ammettere di aver visto.

Josiah morì a novembre, in tre giorni, di una tosse. La domenica dopo il pastore disse che chi teneva in casa quelle figure doveva portarle al tribunale. Lei prese il mazzo dalla cassa, lo avvolse in un fazzoletto e lo mise in mano al conestabile sulla porta di casa. Scrissero il suo nome sul cartellino. Tornata dentro si accorse che il cassetto aveva ancora l'odore del tabacco di lui, e che il mazzo no.

Da allora non parla bene di nessuno, a cominciare da sé. Ha un campo da vendere o da tenere, una candela sulla tomba che non ha acceso lei, e nessuno a cui chiederne conto.
