---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 3 di c2.fire"
dove: "c2.js#c2.fire"
fatto: "[[notte-al-bivacco]]"
classe: "entrambe"
opzioni:
  - { t: "Sì. Verrei subito, senza pensarci.", imposta: "flag fire.promised, guida +1, rischio +1, fiducia ginepra +1, punto m07, seme w" }
  - { t: "Dipende da quanto sei stata scema per farti prendere.", imposta: "flag fire.joked, tono -1, punto m00, seme w" }
  - { t: "Verrei, e ti porterei il pane: quello delle celle lo conosc…", quando: "stat jailed >= 1", imposta: "flag fire.promised, tono +1, fiducia ginepra +1" }
---

Scelta 3 della scena `c2.fire` (c2.js), dentro un ramo: power fire.

1. «Sì. Verrei subito, senza pensarci.»: flag fire.promised, guida +1, rischio +1, fiducia ginepra +1, punto m07, seme w.
2. «Dipende da quanto sei stata scema per farti prendere.»: flag fire.joked, tono -1, punto m00, seme w.
3. «Verrei, e ti porterei il pane: quello delle celle lo conosc…» (solo se stat jailed >= 1): flag fire.promised, tono +1, fiducia ginepra +1.
