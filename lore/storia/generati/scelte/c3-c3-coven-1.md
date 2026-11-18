---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c3.coven"
dove: "c3.js#c3.coven"
fatto: "[[consiglio-delle-maestre]]"
classe: "entrambe"
opzioni:
  - { t: "Edera, dimmi cos'altro ricordi di lui: può servirmi.", imposta: "esplora +1, fiducia edera +1, punto m02, seme s" }
  - { t: "Edera, delle candele parliamo dopo. Adesso serve altro.", imposta: "esplora -1, tono -1, punto m07, seme w" }
  - { t: "Le celle le conosco, perché ci ho dormito. Ditemi piuttosto…", quando: "stat jailed >= 1", imposta: "flag coven.cells, parola +1" }
---

Scelta 1 della scena `c3.coven` (c3.js), dentro un ramo: majorsMin 19.

1. «Edera, dimmi cos'altro ricordi di lui: può servirmi.»: esplora +1, fiducia edera +1, punto m02, seme s.
2. «Edera, delle candele parliamo dopo. Adesso serve altro.»: esplora -1, tono -1, punto m07, seme w.
3. «Le celle le conosco, perché ci ho dormito. Ditemi piuttosto…» (solo se stat jailed >= 1): flag coven.cells, parola +1.
