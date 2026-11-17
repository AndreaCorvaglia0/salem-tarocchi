---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di edera.chat"
dove: "c3.js#edera.chat"
fatto: "[[edera-racconta-del-giudice]]"
classe: "entrambe"
opzioni:
  - { t: "Mi ripeti le posizioni della croce?", imposta: "-" }
  - { t: "Mi racconti ancora del Giudice?", imposta: "fiducia edera +1, flag edera.told" }
  - { t: "Ti lascio Tartufo sulle ginocchia, finché parliamo.", quando: "tartufo 2", imposta: "fiducia edera +1, flag edera.cat" }
  - { t: "Ho girato tutte le cantine: dimmi tu se ho dimenticato un a…", quando: "explored 20", imposta: "-" }
---

Scelta 1 della scena `edera.chat` (c3.js).

1. «Mi ripeti le posizioni della croce?»: niente.
2. «Mi racconti ancora del Giudice?»: fiducia edera +1, flag edera.told; quello che segue dipende dallo stato.
3. «Ti lascio Tartufo sulle ginocchia, finché parliamo.» (solo se tartufo 2): fiducia edera +1, flag edera.cat.
4. «Ho girato tutte le cantine: dimmi tu se ho dimenticato un a…» (solo se explored 20): niente.
