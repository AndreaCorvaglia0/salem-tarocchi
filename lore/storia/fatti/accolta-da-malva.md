---
tipo: "fatto"
nome: "Malva la prende in casa"
flag: "step c1.malva → c1.read; flag malva.wood / malva.cheeky"
capitolo: 1
quando: 50
scena: "c1.js#c1.malva"
chi_c_e:
  - "[[protagonista]]"
  - "[[malva]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ortica]]", come: "Malva le ha raccontato della legna storta o delle mani delicate (c2.js#c2.ortica).", fonte: copione }
conseguenze:
  - "[[prima-lettura-per-malva]]"
rami:
  - { scelta: "La legna la spacco io / Ho le mani delicate", flag: "malva.wood / malva.cheeky", esito: "Malva e Ortica lo ricordano al cancello, alla botola e nel bosco." }
aperto:
---

Malva apre subito e nota che ha bussato nonostante il cartello (Tartufo aveva detto che serve a capire se una ragazza le serve). Dice che la aspettava da una settimana e che la tiene per la legna. Le fa scegliere due carte coperte tra le sue e le dice che in un mazzo intero ce ne sono settantotto.
