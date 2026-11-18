---
tipo: "fatto"
nome: "Le dicerie sulle carte nascoste"
flag: "flag side.m01, side.m05, side.m02, side.m03, side.m12, side.m09, side.m11, side.m18 (steps.js#SIDE)"
capitolo: 1
quando: 75
scena: "steps.js#SIDE"
chi_c_e:
  - "[[protagonista]]"
  - "[[bottegaio]]"
  - "[[tabita]]"
  - "[[bambino-della-porta-nera]]"
  - "[[malva]]"
  - "[[mugnaio]]"
  - "[[ortica]]"
  - "[[becchino]]"
  - "[[conestabile-del-pozzo]]"
chi_lo_sa:
  - { chi: "[[protagonista]]", come: "Le segna a matita sulla mappa del grimorio.", fonte: copione }
conseguenze:
rami:
  - { scelta: "Il Mago dal merciaio", flag: "side.m01", esito: "bottegaio" }
  - { scelta: "Il Papa nella Bibbia", flag: "side.m05", esito: "Tabita" }
  - { scelta: "La Sacerdotessa dietro la tenda", flag: "side.m02", esito: "bambino" }
  - { scelta: "L'Imperatrice nell'orto", flag: "side.m03", esito: "Malva (malva.chat)" }
  - { scelta: "L'Appeso al salice", flag: "side.m12", esito: "mugnaio" }
  - { scelta: "L'Eremita nel folto", flag: "side.m09", esito: "Ortica (ortica.chat)" }
  - { scelta: "La Giustizia sulla pietra di confine", flag: "side.m11", esito: "becchino" }
  - { scelta: "La Luna alla palude", flag: "side.m18", esito: "guardia del pozzo" }
aperto:
---

Otto persone raccontano, ognuna a modo suo, dove hanno visto una delle carte grandi, e intanto dicono che cosa significa. Sono appunti a matita sulla mappa: ogni carta si trova anche senza.
