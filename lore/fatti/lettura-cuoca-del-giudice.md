---
tipo: "fatto"
nome: "La lettura per la cuoca del Giudice"
flag: "flag client.c3.cook.done"
capitolo: 3
quando: 316
scena: "clients.js#c3.cook"
chi_c_e:
  - "[[protagonista]]"
  - "[[cuoca-del-giudice]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[cuoca-del-giudice]]", come: "C'è.", fonte: copione }
  - { chi: "[[giudice]]", come: "Lo scopre solo se lei lo dice in aula (court.cook): «Vedo che lei ha delle amicizie perfino nella mia cucina».", fonte: copione }
conseguenze:
  - "[[ingresso-in-tribunale]]"
rami:
aperto:
  - "Momento variabile: i clienti dopo il primo arrivano in ordine casuale (glue/clients.js)."
---

La cuoca chiede se il Giudice le darà l'aumento; il Giudice non deve sapere che è venuta. La legge al tavolo della capanna, con la stesa del capitolo.
