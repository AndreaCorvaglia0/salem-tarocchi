---
tipo: "persona"
nome: "Comare Malva"
id: "malva"
ruolo:
  - { t: "La levatrice di Salem: fa nascere i bambini e prepara unguenti.", fonte: copione, scena: "c1.js#c1.back, trials/main.js#night" }
  - { t: "Prende in casa la protagonista e le insegna la lettura a carta singola.", fonte: copione, scena: "c1.js#c1.malva, c1.read" }
  - { t: "Aggiusta anche le ossa.", fonte: copione, scena: "lessons.js#minors.3.lesson" }
  - { t: "È una delle tre maestre che si riuniscono sotto il villaggio.", fonte: copione, scena: "c3.js#c3.coven" }
vuole:
  - { t: "Non lasciare Ginepra al Giudice: «una così a quel signore del tribunale non la lascio».", fonte: copione, scena: "c3.js#c3.trapdoor" }
  - { t: "Che la ragazza nuova non si perda nelle cantine prima di essere pronta.", fonte: copione, scena: "c3.js#c3.trapdoor (ramo gate2.refused)" }
  - { t: "Far uscire dal villaggio un cesto di unguenti prima che i conestabili entrino nelle case.", fonte: copione, scena: "trials/main.js#night" }
teme:
  - { t: "Perdere anche lei: «se là sotto ti perdi, poi ne ho due da tirare fuori».", fonte: copione, scena: "c3.js#c3.trapdoor (ramo gate2.refused)" }
  - { t: "Dice di aver avuto paura «a ogni parto andato storto».", fonte: copione, scena: "opinions.js#hale, risposta di Malva" }
nasconde:
  - { t: "Quando è sola canta, e ha una bella voce; se glielo dici nega.", fonte: copione, scena: "c2.js#ortica.chat" }
  - { t: "La sua prima volta sulla scopa non andò bene: «questo non andarlo a raccontare a Ortica».", fonte: copione, scena: "lessons.js#fly.lesson" }
  - { t: "Di notte porta fuori dal villaggio unguenti e «una cosa o due che un conestabile chiamerebbe con un altro nome».", fonte: copione, scena: "trials.js#trial.night.door" }
  - { t: "Va di notte dai Proctor, di nascosto dal padre.", fonte: copione, scena: "trials/side.js#vigil" }
voce:
  - { tratto: "Non ringrazia, perché porta male", esempio: "«Non ti ringrazio, perché ringraziare porta male»", scena: "c1.js#c1.malva", fonte: copione }
  - { tratto: "Dà ordini brevi con un perché pratico", esempio: "«Entra e chiudi, che il caldo costa.»", scena: "c1.js#c1.malva", fonte: copione }
  - { tratto: "Dice le cose una volta sola", esempio: "«io le cose le dico una volta sola»", scena: "c1.js#c1.malva", fonte: copione }
  - { tratto: "Paragona tutto al suo mestiere e alla campagna", esempio: "«Anche far nascere un vitello sembra facile, a guardarlo da fuori.»", scena: "c1.js#c1.read", fonte: copione }
  - { tratto: "Copre l'affetto con un rimprovero", esempio: "«Non dire sciocchezze, che sto a mezz'ora di strada.»", scena: "c1b.js#c1.gate", fonte: copione }
tic:
  - { t: "Prima di una decisione gira una carta, per sé, e le dà retta (Temperanza, Il Matto, La Forza, L'Appeso).", fonte: copione, scena: "c1.js#c1.back, c1b.js#c1.gate, c3.js#c3.trapdoor" }
  - { t: "Dopo aver ringraziato tocca il ferro della pentola tre volte.", fonte: copione, scena: "end.js#f.last" }
  - { t: "Si asciuga le mani nel grembiule; ha una treccia girata intorno alla testa.", fonte: copione, scena: "c1.js#c1.malva, c1.read" }
incontro: "step c1.malva (c1.js#c1.malva)"
arco:
  - "[[accolta-da-malva]]"
  - "[[prima-lettura-per-malva]]"
  - "[[ritorno-da-malva]]"
  - "[[bivio-della-piazza]]"
  - "[[malva-apre-il-cancello]]"
  - "[[prima-visita-in-biblioteca]]"
  - "[[prova-del-cesto]]"
  - "[[prova-dai-proctor]]"
  - "[[lezione-di-volo]]"
  - "[[lezione-quattro-cinque-sei]]"
  - "[[discesa-dalla-botola]]"
  - "[[consiglio-delle-maestre]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[epilogo-al-bivacco]]"
legami:
  - { con: "[[protagonista]]", prova: "La prende in casa «per la legna», le regala due carte, le dà la capanna; non lo ammette ma la guarda lavorare.", fonte: copione, scena: "c1.js#c1.malva, c1b.js#c1.gate" }
  - { con: "[[ortica]]", prova: "Dice che Ortica parla tutto il giorno ma «in mezzo alle chiacchiere dice cose giuste».", fonte: copione, scena: "c1b.js#c1.gate" }
  - { con: "[[edera]]", prova: "La descrive «più vecchia del villaggio e più elegante di tutte noi»; spolvera i suoi libri una volta al mese.", fonte: copione, scena: "c3.js#c3.trapdoor, trials/intro.js#library.first" }
  - { con: "[[ginepra]]", prova: "«Ginepra è una sciocca, e lo dico con tutto il bene che le voglio.»", fonte: copione, scena: "c3.js#c3.trapdoor" }
  - { con: "[[tartufo]]", prova: "«Non è mio e non è di nessuno»; gli lascia il lardo sulla madia.", fonte: copione, scena: "c1.js#c1.malva, c1b.js#malva.chat" }
  - { con: "[[tabita]]", prova: "Le ha fatto nascere sei figli senza farsi pagare; Tabita le fa il bucato da vent'anni.", fonte: copione, scena: "c1.js#c1.back, c1.deliver" }
  - { con: "[[bottegaio]]", prova: "Controlla sempre il suo incenso, perché lui a volte ci mescola la segatura.", fonte: copione, scena: "c1.js#c1.back, c1.shop" }
  - { con: "[[giudice]]", prova: "Ha fatto nascere i nipoti del Giudice, e a lui non fa paura.", fonte: copione, scena: "c3.js#c3.coven" }
  - { con: "[[conestabile-della-piazza]]", prova: "Lo ha fatto nascere lei, dice lui.", fonte: copione, scena: "c1b.js#c1.exam1" }
  - { con: "[[levatrice-di-allora]]", prova: "Quando arrivò a Salem la levatrice di allora la mandò alla stessa bottega.", fonte: copione, scena: "c1.js#c1.back" }
  - { con: "[[madre-di-malva]]", prova: "Il lume cieco era di sua madre; un consiglio sul ripasso viene da lei.", fonte: copione, scena: "trials/main.js#night, trials/intro.js#library.first" }
  - { con: "[[famiglia-proctor]]", prova: "Ha fatto nascere il bambino dei Proctor cinque anni fa.", fonte: copione, scena: "trials.js#trial.vigil.door" }
  - { con: "[[comare-goodwin]]", prova: "Ha fatto nascere il bambino della Goodwin e l'ha mandata alla capanna.", fonte: copione, scena: "clients.js#c2.mother" }
  - { con: "[[gemelli-pike]]", prova: "È stata la levatrice dei gemelli.", fonte: copione, scena: "clients.js#c2.twins" }
  - { con: "[[afflitte]]", prova: "Sono «figlie di gente che conosco da quando è nata, ed è proprio questo il guaio».", fonte: copione, scena: "c1b.js#c1.square" }
sa:
  - { fatto: "[[carta-nella-neve]]", da: "[[accolta-da-malva]]", come: "Capisce dalle dita rosse o dalle scarpe se l'ha raccolta subito o si è guardata intorno." }
  - { fatto: "[[fagotto-per-tabita]]", da: "[[malva-apre-il-cancello]]", come: "Tabita le ha detto del nodo e delle monete rifiutate." }
  - { fatto: "[[notti-in-cella]]", da: "[[notti-in-cella]]", come: "In malva.chat dice «So che ti hanno tenuta in cella» (c1b.js#malva.chat)." }
  - { fatto: "[[arresto-di-ginepra]]", da: "[[discesa-dalla-botola]]", come: "«Ho saputo tutto stanotte.»" }
  - { fatto: "[[bivio-del-deposito]]", da: "[[discesa-dalla-botola]]", come: "Sa se la ragazza è entrata nel deposito o no, e del fischio del palo." }
  - { fatto: "[[lezione-di-volo]]", da: "[[lezione-di-volo]]", come: "È lei a insegnare." }
luoghi:
  - "[[casa-di-malva]]"
  - "[[orto-di-malva]]"
  - "[[vicolo-di-sotto]]"
  - "[[cancello-del-bosco]]"
  - "[[botola]]"
  - "[[biblioteca]]"
carte:
  - { carta: "m03 L'Imperatrice", perche: "La carta che incarna.", fonte: deciso, scena: "DESIGN.md, Le streghe e la storia" }
  - { carta: "m14 La Temperanza", perche: "La gira prima di mandare il fagotto a Tabita.", fonte: copione, scena: "c1.js#c1.back" }
  - { carta: "m00 Il Matto", perche: "La gira prima di aprire il cancello del bosco.", fonte: copione, scena: "c1b.js#c1.gate" }
  - { carta: "m08 La Forza / m12 L'Appeso", perche: "Sul coperchio della botola: La Forza apre, L'Appeso tiene chiuso.", fonte: copione, scena: "c3.js#c3.trapdoor" }
aperto:
  - "Proposto (18 novembre): [[la-salvia-di-malva]], il mazzo di salvia al posto dell'incenso del bottegaio; non ringrazia, ma lo tiene accanto al focolare."
  - "Quanti anni ha Malva? DESIGN.md dice «sui quaranta», ma nei copioni ha fatto nascere un conestabile con vent'anni di ronde e conosce Ortica da trent'anni (vedi notes/lore-story.md, Contraddizioni)."
  - "Che cosa teme Malva per sé? Nei copioni teme per le ragazze, mai per sé."
  - "Chi riceve il cesto oltre il cancello («una che conosco», trials/main.js#night)?"
  - "Perché aspettava la ragazza «la settimana scorsa», e chi gliel'aveva mandata?"
  - "Che cosa è successo alla levatrice di allora?"
  - "Vola ancora? Ginepra lo chiede (end.js#f.dawn, risposta speciale) e nessuno risponde."
---

Comare Malva è la levatrice di Salem: ha una treccia girata a corona, mani forti e una casa con la tovaglia rossa. Brusca, non ringrazia mai perché dice che porta male, e copre ogni gentilezza con un ordine o un rimprovero. Prende in casa la protagonista «per la legna», le insegna a leggere una carta sola e la manda nel mondo con commissioni sempre più grandi. Nel terzo capitolo è lei a calarla nelle cantine, e al processo veglia in fondo all'aula.
