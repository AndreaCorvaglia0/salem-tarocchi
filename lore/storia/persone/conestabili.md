---
tipo: "persona"
nome: "I conestabili"
id: "conestabile"
ruolo:
  - { t: "Le guardie di Salem: girano di notte con le lanterne, fanno domande sulle carte, portano in cella chi esita.", fonte: copione, scena: "c1.js#c1.back, barks.js#constable" }
  - { t: "Tre di loro aspettano davanti alla capanna con un foglio col sigillo rosso.", fonte: copione, scena: "c2.js#c2.arrest" }
  - { t: "Due guardie dormono nel deposito; un terzo fa il giro con la lanterna.", fonte: copione, scena: "c2.js#c2.plan" }
vuole:
teme:
nasconde:
voce:
  - { tratto: "Si segnano le bugie", esempio: "«noi le bugie ce le segniamo.»", scena: "c2.js#c2.arrest", fonte: copione }
  - { tratto: "Comandano di avvicinarsi piano", esempio: "«tieni le mani dove possiamo vederle.»", scena: "props.js#arrest.wait", fonte: copione }
tic:
  - { t: "Si riconoscono dalla lanterna; misurano le impronte.", fonte: copione, scena: "c2.js#c2.arrest" }
incontro: "flag exam1.done (c1b.js#c1.exam1) e ogni Esame successivo"
arco:
  - "[[primo-esame]]"
  - "[[fermate-dei-conestabili]]"
  - "[[notti-in-cella]]"
  - "[[bivio-della-piazza]]"
  - "[[arresto-di-ginepra]]"
legami:
  - { con: "[[giudice]]", prova: "Il Giudice legge i loro rapporti.", fonte: copione, scena: "end.js#c3.trial" }
  - { con: "[[vedova-bray]]", prova: "Hanno interrogato la Bray: «dice che a quell'ora dormiva».", fonte: copione, scena: "c2.js#c2.arrest" }
  - { con: "[[comare-hale]]", prova: "Portano Hale al tribunale.", fonte: copione, scena: "c1b.js#c1.square" }
sa:
  - { fatto: "[[primo-esame]]", da: "[[arresto-di-ginepra]]", come: "Sanno se ha mentito al collega o nominato la Bray." }
  - { fatto: "[[bivio-del-deposito]]", da: "[[arresto-di-ginepra]]", come: "Hanno seguito le impronte fino alla capanna." }
luoghi:
  - "[[piazza]]"
  - "[[tribunale]]"
  - "[[celle]]"
  - "[[capanna]]"
carte:
aperto:
  - "Quanti sono? Chi li comanda oltre al Giudice?"
---

I conestabili sono le guardie di Salem: girano di notte con la lanterna e fermano le ragazze sole per interrogarle sulle carte. Chi esita finisce in cella e perde qualche carta, che va al deposito del tribunale. Tre di loro vengono alla capanna con un mandato, e se ne vanno con Ginepra.
