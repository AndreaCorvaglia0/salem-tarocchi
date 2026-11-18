---
tipo: "fatto"
nome: "Il bicchiere di Venere"
flag: "step c1.venus → c1.square; flag venus.looked / venus.refused / venus.card, ginepra.returned; giveCard m07"
capitolo: 1
quando: 160
scena: "c1b.js#c1.venus"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ginepra]]", come: "Ne riparla all'alba (venus.looked) e al fuoco (venus.card).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Può chiederne (opinions.js#READER glass).", fonte: copione }
conseguenze:
  - "[[seconda-visita-della-lettrice]]"
  - "[[bivio-della-piazza]]"
rami:
  - { scelta: "Guardiamo / Io non guardo / Appoggio Gli Amanti", flag: "venus.looked / venus.refused / venus.card", esito: "La protagonista ci ripensa in piazza." }
aperto:
---

Dietro la canonica Ginepra versa il bianco d'uovo in un bicchiere per sapere chi sposerà. Prima gira La Luna, che dice di lasciar stare, e va lo stesso. Nell'acqua si forma una bara. Poi Ginepra rende Il Carro e lascia Gli Amanti.
