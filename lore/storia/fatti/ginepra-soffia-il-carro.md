---
tipo: "fatto"
nome: "Ginepra soffia Il Carro"
flag: "step c1.cart → c1.explore; flag met.ginepra, ginepra.snatched, ginepra.chased / ginepra.let / cart.cat, square.front / square.wall"
capitolo: 1
quando: 140
scena: "c1b.js#c1.cart"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ginepra]]", come: "Ne riparla al bicchiere di Venere e nella scommessa.", fonte: copione }
  - { chi: "[[tartufo]]", come: "Commenta (cart.cat).", fonte: copione }
conseguenze:
  - "[[primo-esame]]"
  - "[[bicchiere-di-venere]]"
rami:
  - { scelta: "Ridammela / Tienila per stasera / Tartufo la prende", flag: "ginepra.chased / ginepra.let / cart.cat", esito: "Ginepra la rende comunque al davanzale." }
  - { scelta: "Attraverso la piazza / Passo lungo il muro", flag: "square.front / square.wall", esito: "Cambia l'arrivo del conestabile." }
aperto:
---

Sotto il carretto del fieno c'è una carta, ma una mano con un guanto blu arriva prima: è Ginepra, novizia di Ortica, che ride e promette di renderla. La manda ad attraversare la piazza dove c'è un conestabile, «perché la prima volta è meglio togliersela subito».
