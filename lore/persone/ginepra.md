---
tipo: "persona"
nome: "Ginepra"
id: "ginepra"
ruolo:
  - { t: "Novizia di Ortica, coetanea della protagonista.", fonte: copione, scena: "c1b.js#c1.cart" }
  - { t: "Le soffia Il Carro, poi glielo rende; diventa sua amica; si fa arrestare al suo posto.", fonte: copione, scena: "c1b.js#c1.cart, c1.venus, c2.js#c2.arrest" }
  - { t: "Scambia i doppioni delle carte piccole.", fonte: copione, scena: "post.js#trade.ginepra" }
vuole:
  - { t: "Riavere il mazzo di sua nonna, sequestrato a ottobre e chiuso nel deposito.", fonte: copione, scena: "c2.js#c2.fire" }
  - { t: "Andarsene da Salem con l'amica, nella sua lettura sbagliata della Ruota.", fonte: copione, scena: "c2.js#c2.fire (fire.carriage)" }
  - { t: "Rivedere la tana dei dodici anni con un'amica accanto.", fonte: copione, scena: "trials.js#trial.dare.door" }
teme:
  - { t: "Sembrare paurosa: in cella ha pensato «a tutte le cose che avevo fatto per paura di sembrare paurosa».", fonte: copione, scena: "trials.js#trial.dare.door" }
  - { t: "Quando ha paura ride.", fonte: copione, scena: "c1b.js#c1.venus" }
nasconde:
  - { t: "A dodici anni, nella tana, ha pianto per tutta la strada, e l'ha inciso sotto il suo nome.", fonte: copione, scena: "trials/side.js#dare" }
  - { t: "Nel guanto tiene l'unica carta che i conestabili non le hanno trovato.", fonte: copione, scena: "c2.js#c2.plan" }
voce:
  - { tratto: "Ride, anche nel momento sbagliato", esempio: "«Ah ah, sei matta da legare»", scena: "c1b.js#c1.square", fonte: copione }
  - { tratto: "Si corregge con «cioè»", esempio: "«Lo sapevo, io. Cioè, lo speravo»", scena: "c2.js#c2.fire", fonte: copione }
  - { tratto: "Spiega da sola perché ride", esempio: "«quando ho paura mi viene da ridere»", scena: "c1b.js#c1.venus", fonte: copione }
  - { tratto: "Inventa regole al volo", esempio: "«ma io sono arrivata prima, e conta chi arriva.»", scena: "c1b.js#c1.cart", fonte: copione }
  - { tratto: "Supplica senza giri", esempio: "«ti prego: qualunque cosa succeda, non dire una parola.»", scena: "c2.js#c2.plan", fonte: copione }
tic:
  - { t: "Porta guanti blu (di lana).", fonte: copione, scena: "c1b.js#c1.cart, c2.js#c2.arrest" }
  - { t: "Ricci rossi.", fonte: copione, scena: "lessons.js#minors.2.lesson" }
  - { t: "Gira una carta e poi va lo stesso, anche se è contraria (La Luna, La Ruota capovolta, Il Carro capovolto).", fonte: copione, scena: "c1b.js#c1.venus, c2.js#c2.plan, trials/side.js#dare" }
incontro: "flag met.ginepra (c1b.js#c1.cart)"
arco:
  - "[[ginepra-soffia-il-carro]]"
  - "[[bicchiere-di-venere]]"
  - "[[bivio-della-piazza]]"
  - "[[notte-al-bivacco]]"
  - "[[bivio-del-deposito]]"
  - "[[arresto-di-ginepra]]"
  - "[[lezione-uno-due-tre]]"
  - "[[salvataggio-dalle-cantine]]"
  - "[[ingresso-in-tribunale]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[volo-all-alba]]"
  - "[[epilogo-al-bivacco]]"
  - "[[dopo-il-finale]]"
  - "[[prova-della-scommessa]]"
legami:
  - { con: "[[protagonista]]", prova: "Rivale per un'ora, poi amica; al fuoco le chiede se verrebbe a cercarla; dice «Sono io» per lei.", fonte: copione, scena: "c1b.js#c1.cart, c2.js#c2.fire, c2.arrest" }
  - { con: "[[ortica]]", prova: "È la sua novizia; ripete quello che Ortica dice delle carte.", fonte: copione, scena: "c1b.js#c1.cart, c1.venus" }
  - { con: "[[tartufo]]", prova: "«mi fido più di te che di me»; dopo la fuga dice che il gatto è stato il più bravo (jail.keys).", fonte: copione, scena: "c1b.js#c1.cart, end.js#f.dawn" }
  - { con: "[[malva]]", prova: "Dopo il volo scopre che Malva vola: «questa me la devi raccontare tutta».", fonte: copione, scena: "end.js#f.dawn (risposta speciale)" }
  - { con: "[[giudice]]", prova: "In cella chiama Giudice un topo, «perché mangia le candele».", fonte: copione, scena: "c3.js#c3.jail" }
  - { con: "[[edera]]", prova: "Trova l'amica «più misteriosa di Edera».", fonte: copione, scena: "trials/side.js#dare" }
  - { con: "[[conestabile-della-piazza]]", prova: "«a me mi conosce già».", fonte: copione, scena: "c1b.js#c1.cart" }
  - { con: "[[nonna-di-ginepra]]", prova: "Il mazzo sequestrato era di sua nonna e «ha ancora l'odore della sua cucina».", fonte: copione, scena: "c2.js#c2.fire" }
sa:
  - { fatto: "[[primo-esame]]", da: "[[bicchiere-di-venere]]", come: "Ha guardato tutto «da dietro il fienile»." }
  - { fatto: "[[unguento-al-mulino]]", da: "[[notte-al-bivacco]]", come: "Da Ortica sa delle monete riportate; dal mugnaio, della strega scesa in cortile." }
  - { fatto: "[[lezione-di-volo]]", da: "[[volo-all-alba]]", come: "Lo sa solo se la ragazza glielo dice (risposta speciale)." }
luoghi:
  - "[[bivacco]]"
  - "[[davanzale-della-canonica]]"
  - "[[celle]]"
  - "[[tana]]"
  - "[[mercato]]"
carte:
  - { carta: "m07 Il Carro", perche: "«Dicono tutti che mi somiglia.»", fonte: copione, scena: "c1b.js#c1.cart" }
  - { carta: "m07 Il Carro", perche: "«sarebbe pure la mia carta»", fonte: copione, scena: "trials/side.js#dare" }
  - { carta: "m10 La Ruota della Fortuna", perche: "La legge male al fuoco; la gira capovolta prima del deposito.", fonte: copione, scena: "c2.js#c2.fire, c2.plan" }
aperto:
  - "Da dove viene Ginepra e chi è la sua famiglia? Si sa solo della nonna e che «a casa mia ero quella coraggiosa» (c1b.js#c1.square)."
  - "Da quanto è novizia di Ortica?"
  - "Perché i conestabili le hanno preso il mazzo a ottobre?"
  - "Che cosa ha detto in cella al Giudice, e lui a lei? Nei copioni non si vede (la riga in opinions.js è proposta)."
---

Ginepra ha i ricci rossi, i guanti blu e una risata che arriva sempre nel momento sbagliato, perché ride quando ha paura. Novizia di Ortica, soffia Il Carro sotto il naso alla protagonista e poi glielo rende, la trascina al bicchiere di Venere e al deposito del tribunale, e quando i conestabili vengono alla capanna dice «Sono io» al posto suo. Dietro la spavalderia c'è una bambina che a dodici anni ha pianto per tutta la strada in una tana, e non l'ha mai detto a nessuno.
