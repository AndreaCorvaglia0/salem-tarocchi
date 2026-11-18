---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.room.door"
dove: "trials.js#trial.room.door"
fatto: "[[prova-della-stanza-murata]]"
classe: "entrambe"
opzioni:
  - { t: "Appoggio l'orecchio ai mattoni, per sentire se dietro c'è i…", imposta: "esplora +1" }
  - { t: "Ripeto a mente quello che Edera ha detto, parola per parola.", imposta: "guida -1" }
  - { t: "Cerco sul muro il segno di chi l'ha chiuso.", quando: "trait esplora >= 3", imposta: "esplora +1, parola -1" }
  - { t: "Penso a come le tremava la voce, e decido che ci vado comun…", quando: "trust edera >= 2", imposta: "tono +1" }
---

Scelta 1 della scena `trial.room.door` (trials.js), dentro un ramo: notFlag trial.room.offered.

1. «Appoggio l'orecchio ai mattoni, per sentire se dietro c'è i…»: esplora +1.
2. «Ripeto a mente quello che Edera ha detto, parola per parola.»: guida -1.
3. «Cerco sul muro il segno di chi l'ha chiuso.» (solo se trait esplora >= 3): esplora +1, parola -1.
4. «Penso a come le tremava la voce, e decido che ci vado comun…» (solo se trust edera >= 2): tono +1.
