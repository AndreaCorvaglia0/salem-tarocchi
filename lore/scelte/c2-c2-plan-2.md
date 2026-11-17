---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 2 di c2.plan"
dove: "c2.js#c2.plan"
fatto: "[[bivio-del-deposito]]"
classe: "entrambe"
opzioni:
  - { t: "Dalla porta laterale, come avevi pensato tu.", imposta: "flag depot.door, esplora -1" }
  - { t: "Dalla finestra della legnaia, anche se è stretta.", imposta: "flag depot.window, esplora +1" }
  - { t: "Dalla porta: prima però soffio piano verso la guardia svegl…", quando: "power stun", imposta: "flag depot.door, tono -1" }
  - { t: "Mando avanti Tartufo, a vedere quale delle due guardie dorm…", quando: "tartufo 2", imposta: "flag depot.door, guida -1" }
---

Scelta 2 della scena `c2.plan` (c2.js), dentro un ramo: majorsMin 11.

1. «Dalla porta laterale, come avevi pensato tu.»: flag depot.door, esplora -1.
2. «Dalla finestra della legnaia, anche se è stretta.»: flag depot.window, esplora +1.
3. «Dalla porta: prima però soffio piano verso la guardia svegl…» (solo se power stun): flag depot.door, tono -1.
4. «Mando avanti Tartufo, a vedere quale delle due guardie dorm…» (solo se tartufo 2): flag depot.door, guida -1.
