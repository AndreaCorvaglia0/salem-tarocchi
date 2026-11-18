---
tipo: "fatto"
nome: "L'unguento per il mugnaio"
flag: "step c2.mill → c2.client; flag mill.read, mill.honest, side.m12"
capitolo: 2
quando: 230
scena: "c2.js#c2.mill"
chi_c_e:
  - "[[protagonista]]"
  - "[[mugnaio]]"
chi_lo_sa:
  - { chi: "[[ortica]]", come: "Riceve le monete (mill.honest) e lo racconta a tutto il bosco.", fonte: copione }
  - { chi: "[[ginepra]]", come: "Lo sa da Ortica e dal mugnaio (c2.js#c2.fire).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Cita l'onestà (visits.js#OPENERS honest).", fonte: copione }
conseguenze:
  - "[[ortica-premia-l-onesta]]"
  - "[[mugnaio-di-nuovo]]"
  - "[[dicerie-delle-carte]]"
rami:
  - { scelta: "Gira proprio al contrario / Ha ragione vostra moglie / Leggo una carta per la ruota", flag: "— / — / mill.read", esito: "Con mill.read il mugnaio paga il debito del nonno." }
  - { scelta: "Tiene le monete / Le porta a Ortica", flag: "— / mill.honest", esito: "Ortica gliene dà sei." }
aperto:
---

La terza e ultima commissione. Il mugnaio dice che la ruota gira al contrario da un mese e racconta del salice dello stagno con la carta dell'Appeso.
