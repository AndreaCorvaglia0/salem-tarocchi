---
tipo: "fatto"
nome: "La guardia che dorme al pozzo"
flag: "cast enc.guard (capitolo 3+); flag enc.guard, side.m18, guard.ghost / guard.asleep"
capitolo: 3
quando: 305
scena: "post.js#enc.guard"
chi_c_e:
  - "[[protagonista]]"
  - "[[conestabile-del-pozzo]]"
chi_lo_sa:
  - { chi: "[[conestabili]]", come: "Un collega racconta del fantasma (guard.ghost) o del sonno (guard.asleep) (barks.js#constable).", fonte: copione }
conseguenze:
  - "[[dicerie-delle-carte]]"
rami:
  - { scelta: "Sono il fantasma del pozzo / Continuate a pensare / Soffio d'aria", flag: "guard.ghost / — / guard.asleep", esito: "Gli altri conestabili ne parlano." }
aperto:
---

Una guardia giura di non dormire, e racconta della palude, dei cani che abbaiano alla luna e di una carta tra due torri.
