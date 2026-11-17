---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.vigil.door"
dove: "trials.js#trial.vigil.door"
fatto: "[[prova-dai-proctor]]"
classe: "entrambe"
opzioni:
  - { t: "Le dico che vengo, e che porto io la borsa.", imposta: "tono +1" }
  - { t: "Le chiedo che cosa succede se il marito si sveglia.", imposta: "rischio -1" }
  - { t: "Le chiedo perché ci va, se in quella casa la disprezzano.", quando: "trust malva >= 2", imposta: "parola +1" }
  - { t: "Le chiedo come sta la madre.", quando: "trait tono >= 3", imposta: "tono +1, guida +1" }
---

Scelta 1 della scena `trial.vigil.door` (trials.js), dentro un ramo: notFlag trial.vigil.offered.

1. «Le dico che vengo, e che porto io la borsa.»: tono +1.
2. «Le chiedo che cosa succede se il marito si sveglia.»: rischio -1.
3. «Le chiedo perché ci va, se in quella casa la disprezzano.» (solo se trust malva >= 2): parola +1.
4. «Le chiedo come sta la madre.» (solo se trait tono >= 3): tono +1, guida +1.
