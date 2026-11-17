---
tipo: "fatto"
nome: "Bivio 3: dalla porta del tribunale"
flag: "step c3.court → c3.trial; flag court.cook / court.card"
capitolo: 3
quando: 341
scena: "c3.js#c3.court"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[giudice]]"
  - "[[cuoca-del-giudice]]"
chi_lo_sa:
  - { chi: "[[lettrice]]", come: "Sa che ha detto la sua carta in aula (court.card, s3).", fonte: copione }
  - { chi: "[[ginepra]]", come: "Ne parla all'alba.", fonte: copione }
conseguenze:
  - "[[processo-davanti-al-giudice]]"
rami:
  - { scelta: "Mi chiamo {name}, processate me / La strega sono io / Cerco la cuoca / Dico la mia carta", flag: "— / — / court.cook / court.card", esito: "La cuoca apre poi una locanda." }
aperto:
---

La mattina dopo il tribunale è pieno; Ginepra è in piedi, legata, davanti al Giudice. La protagonista entra dalla porta principale e dice il suo nome davanti a tutti.
