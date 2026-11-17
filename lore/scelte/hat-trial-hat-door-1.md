---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.hat.door"
dove: "hat.js#trial.hat.door"
fatto: "[[cappello-in-soffitta]]"
classe: "entrambe"
opzioni:
  - { t: "Gli chiedo che cosa c'è dentro.", imposta: "esplora +1" }
  - { t: "Me lo metto sotto il braccio senza fare domande.", imposta: "esplora -1" }
  - { t: "Tasto la punta attraverso la tela, per capire che forma ha.", quando: "trait esplora >= 3", imposta: "esplora +1, guida -1" }
---

Scelta 1 della scena `trial.hat.door` (hat.js), dentro un ramo: notFlag trial.hat.offered.

1. «Gli chiedo che cosa c'è dentro.»: esplora +1.
2. «Me lo metto sotto il braccio senza fare domande.»: esplora -1.
3. «Tasto la punta attraverso la tela, per capire che forma ha.» (solo se trait esplora >= 3): esplora +1, guida -1.
