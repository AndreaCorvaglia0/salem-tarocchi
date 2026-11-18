---
tipo: "persona"
nome: "La vedova Bray"
id: "c1.widow"
ruolo:
  - { t: "Vedova, prima cliente della capanna; chiede se vendere il campo del marito.", fonte: copione, scena: "clients.js#c1.widow" }
vuole:
  - { t: "Sapere chi accende una candela ogni mese sulla tomba del marito.", fonte: copione, scena: "trials/side.js#grave" }
teme:
  - { t: "Che sia una donna: «Di una donna, se proprio volete saperlo.»", fonte: copione, scena: "trials.js#trial.grave.door" }
nasconde:
  - { t: "Va dalla strega di nascosto dal pastore: «Noi due non ci siamo mai viste, siamo intese?»", fonte: copione, scena: "clients.js#c1.widow" }
voce:
  - { tratto: "Dà del voi e chiama «figliola»", esempio: "«Figliola, speravo proprio che passaste di qui.»", scena: "trials.js#trial.grave.door", fonte: copione }
tic:
  - { t: "Scialle nero, un rosario tra le dita.", fonte: copione, scena: "clients.js#c1.widow, c1.js#c1.grimoire" }
incontro: "step c1.client (clients.js#c1.widow)"
arco:
  - "[[lettura-vedova-bray]]"
  - "[[primo-esame]]"
  - "[[bivio-del-deposito]]"
  - "[[prova-della-tomba]]"
legami:
  - { con: "[[josiah-bray]]", prova: "Sposata con lui trent'anni; è morto a novembre.", fonte: copione, scena: "clients.js#c1.widow, trials.js#trial.grave.door" }
  - { con: "[[protagonista]]", prova: "Dice che la sua lettura si è avverata; le dà la bussola del marito.", fonte: copione, scena: "trials/side.js#grave" }
  - { con: "[[becchino]]", prova: "Scopre che è lui ad accendere la candela.", fonte: copione, scena: "trials/side.js#grave" }
  - { con: "[[conestabili]]", prova: "Interrogata, dice che «a quell'ora dormiva»; poi che un mazzo non l'ha mai avuto.", fonte: copione, scena: "c2.js#c2.arrest, end.js#c3.trial" }
sa:
  - { fatto: "[[bivio-del-deposito]]", da: "[[discesa-dalla-botola]]", come: "Trova il suo mazzo sul davanzale e manda sei monete tramite Malva, senza chiedere chi è stato (depot.bray)." }
luoghi:
  - "[[capanna]]"
  - "[[cimitero]]"
carte:
  - { t: "Il marito teneva L'Eremita nel libro delle preghiere.", fonte: copione, scena: "trials/side.js#grave" }
aperto:
  - "Perché ha un mazzo nel deposito del tribunale se dice di non averne mai avuto uno?"
---

La vedova Bray è la prima persona che bussa alla capanna: scialle nero, rosario, mani screpolate, e la paura che il pastore lo venga a sapere. Più avanti chiede alla protagonista di accompagnarla di notte al cimitero, per scoprire chi accende una candela sulla tomba del marito.
