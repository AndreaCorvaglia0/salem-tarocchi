---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c1.venus"
dove: "c1b.js#c1.venus"
fatto: "[[bicchiere-di-venere]]"
classe: "entrambe"
opzioni:
  - { t: "Dai, guardiamo insieme cosa viene fuori.", imposta: "flag venus.looked, esplora +1, punto m06, seme c" }
  - { t: "Io non guardo: queste cose non mi sembrano un gioco.", imposta: "flag venus.refused, rischio -1, punto m02, seme s" }
  - { t: "Appoggio Gli Amanti accanto al bicchiere, e guardiamo anche…", quando: "has m06", imposta: "flag venus.looked, guida +1, flag venus.card" }
---

Scelta 1 della scena `c1.venus` (c1b.js).

1. «Dai, guardiamo insieme cosa viene fuori.»: flag venus.looked, esplora +1, punto m06, seme c.
2. «Io non guardo: queste cose non mi sembrano un gioco.»: flag venus.refused, rischio -1, punto m02, seme s.
3. «Appoggio Gli Amanti accanto al bicchiere, e guardiamo anche…» (solo se has m06): flag venus.looked, guida +1, flag venus.card.
