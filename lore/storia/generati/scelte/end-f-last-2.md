---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 2 di f.last"
dove: "end.js#f.last"
fatto: "[[epilogo-al-bivacco]]"
classe: "entrambe"
opzioni:
  - { t: "Mi alzo e vado verso la candela.", imposta: "guida -1, punto m00, seme w" }
  - { t: "Prima abbraccio Ginepra.", imposta: "guida +1, fiducia ginepra +1, punto m07, seme c" }
  - { t: "Prima ringrazio le maestre, una per una, anche se porta mal…", quando: "trust malva >= 2 e trust ortica >= 2 e trust edera >= 2", imposta: "tono +1" }
---

Scelta 2 della scena `f.last` (end.js).

1. «Mi alzo e vado verso la candela.»: guida -1, punto m00, seme w.
2. «Prima abbraccio Ginepra.»: guida +1, fiducia ginepra +1, punto m07, seme c.
3. «Prima ringrazio le maestre, una per una, anche se porta mal…» (solo se trust malva >= 2 e trust ortica >= 2 e trust edera >= 2): tono +1.
