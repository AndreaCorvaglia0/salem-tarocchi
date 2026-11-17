---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.dare.door"
dove: "trials.js#trial.dare.door"
fatto: "[[prova-della-scommessa]]"
classe: "entrambe"
opzioni:
  - { t: "Accetto la scommessa, e le dico di tenere pronto il cappell…", imposta: "rischio +1" }
  - { t: "Le chiedo che cosa c'è davvero, in quella tana.", imposta: "rischio -1" }
  - { t: "Le dico che se vinco voglio il cappello e anche le scuse pe…", quando: "trait tono <= -3", imposta: "tono -1" }
  - { t: "Le chiedo perché ci vuole tornare proprio adesso.", quando: "trust ginepra >= 2", imposta: "tono +1" }
---

Scelta 1 della scena `trial.dare.door` (trials.js), dentro un ramo: notFlag trial.dare.offered.

1. «Accetto la scommessa, e le dico di tenere pronto il cappell…»: rischio +1.
2. «Le chiedo che cosa c'è davvero, in quella tana.»: rischio -1.
3. «Le dico che se vinco voglio il cappello e anche le scuse pe…» (solo se trait tono <= -3): tono -1.
4. «Le chiedo perché ci vuole tornare proprio adesso.» (solo se trust ginepra >= 2): tono +1.
