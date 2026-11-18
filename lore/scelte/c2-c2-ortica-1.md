---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c2.ortica"
dove: "c2.js#c2.ortica"
fatto: "[[arrivo-da-ortica]]"
classe: "entrambe"
opzioni:
  - { t: "Malva dice che hai qualcosa da insegnarmi.", imposta: "esplora -1, punto m01, seme s" }
  - { t: "Parli sempre così tanto, o lo fai per me?", imposta: "parola +1, tono -1, fiducia ortica +1, punto m00, seme w" }
  - { t: "Prima dimmi cosa pende dal tetto: quelle erbe non le ho mai…", quando: "trait esplora >= 3", imposta: "esplora +1, fiducia ortica +1" }
---

Scelta 1 della scena `c2.ortica` (c2.js).

1. «Malva dice che hai qualcosa da insegnarmi.»: esplora -1, punto m01, seme s.
2. «Parli sempre così tanto, o lo fai per me?»: parola +1, tono -1, fiducia ortica +1, punto m00, seme w.
3. «Prima dimmi cosa pende dal tetto: quelle erbe non le ho mai…» (solo se trait esplora >= 3): esplora +1, fiducia ortica +1.
