---
tipo: "fatto"
nome: "L'incenso alla bottega"
flag: "step c1.shop; flag shop.sniffed, side.m01"
capitolo: 1
quando: 70
scena: "c1.js#c1.shop"
chi_c_e:
  - "[[protagonista]]"
  - "[[bottegaio]]"
chi_lo_sa:
  - { chi: "[[malva]]", come: "Riconosce che l'incenso è quello buono e se il nodo è stato aperto (c1.js#c1.back).", fonte: copione }
conseguenze:
  - "[[ritorno-da-malva]]"
  - "[[dicerie-delle-carte]]"
rami:
aperto:
---

La prima commissione: la bottega con la porta nera. Il bottegaio sa già chi è, vende dieci monete d'incenso e racconta della carta che il merciaio tiene sotto il banco.
