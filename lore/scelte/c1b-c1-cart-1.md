---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c1.cart"
dove: "c1b.js#c1.cart"
fatto: "[[ginepra-soffia-il-carro]]"
classe: "entrambe"
opzioni:
  - { t: "Quella carta è mia, quindi ridammela subito.", imposta: "flag ginepra.chased, rischio +1, tono -1, punto m07, seme w" }
  - { t: "Tienila pure, per stasera. Poi però ne riparliamo.", imposta: "flag ginepra.let, rischio -1, tono +1, fiducia ginepra +1, punto m14, seme c" }
  - { t: "Faccio un cenno a Tartufo, che è più svelto di tutte e due.", quando: "tartufo 1", imposta: "flag cart.cat, esplora +1, fiducia ginepra +1" }
---

Scelta 1 della scena `c1.cart` (c1b.js).

1. «Quella carta è mia, quindi ridammela subito.»: flag ginepra.chased, rischio +1, tono -1, punto m07, seme w.
2. «Tienila pure, per stasera. Poi però ne riparliamo.»: flag ginepra.let, rischio -1, tono +1, fiducia ginepra +1, punto m14, seme c.
3. «Faccio un cenno a Tartufo, che è più svelto di tutte e due.» (solo se tartufo 1): flag cart.cat, esplora +1, fiducia ginepra +1.
