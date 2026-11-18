---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 4 di c3.coven"
dove: "c3.js#c3.coven"
fatto: "[[consiglio-delle-maestre]]"
classe: "entrambe"
opzioni:
  - { t: "Ortica, tu trova le guardie e parlaci finché non si dimenti…", imposta: "flag coven.ortica.talk, tono +1, fiducia ortica +1, punto m01, seme c" }
  - { t: "Ortica, tu porti una scopa per Ginepra al cancello del bosc…", imposta: "flag coven.ortica.brooms, tono -1, punto m18, seme s" }
  - { t: "Ortica, tu fai quello che ti riesce meglio: scegli tu, e no…", quando: "trust ortica >= 2", imposta: "flag coven.ortica.free, parola -1" }
---

Scelta 4 della scena `c3.coven` (c3.js), dentro un ramo: majorsMin 19.

1. «Ortica, tu trova le guardie e parlaci finché non si dimenti…»: flag coven.ortica.talk, tono +1, fiducia ortica +1, punto m01, seme c.
2. «Ortica, tu porti una scopa per Ginepra al cancello del bosc…»: flag coven.ortica.brooms, tono -1, punto m18, seme s.
3. «Ortica, tu fai quello che ti riesce meglio: scegli tu, e no…» (solo se trust ortica >= 2): flag coven.ortica.free, parola -1.
