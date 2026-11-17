---
tipo: "fatto"
nome: "Prova: la stanza che non c'è più"
flag: "trial.room.perfect / pass / fail"
capitolo: 3
quando: 314
scena: "trials.js#trial.room.door, trials/side.js#room"
chi_c_e:
  - "[[protagonista]]"
  - "[[edera]]"
chi_lo_sa:
  - { chi: "[[edera]]", come: "Riceve le tre carte (o le sa lette).", fonte: copione }
conseguenze:
  - "[[prova-della-scommessa]]"
rami:
  - { scelta: "Porta le carte coperte / Le gira", flag: "—", esito: "Sono tre carte liete." }
  - { scelta: "Perfetta", flag: "trial.room.perfect", esito: "Il pendolo della nonna di Edera." }
aperto:
---

Dietro un arco murato c'è la stanza dove la nonna di Edera leggeva le carte: tre carte coperte stanno ancora sul tavolo per la Edera di sei anni.
