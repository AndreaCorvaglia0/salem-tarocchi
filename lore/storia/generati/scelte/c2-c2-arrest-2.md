---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 2 di c2.arrest"
dove: "c2.js#c2.arrest"
fatto: "[[arresto-di-ginepra]]"
classe: "entrambe"
opzioni:
  - { t: "«Sì, sono io.»", imposta: "parola +1, rischio +1, punto m11, seme s" }
  - { t: "«Non so di cosa state parlando.»", imposta: "parola -1, rischio -1, punto m18, seme c" }
  - { t: "Soffio piano verso la lanterna di quello col foglio.", quando: "power stun", imposta: "esplora +1" }
  - { t: "«Chiedete in paese chi sono: ve lo dirà mezza Salem.»", quando: "pop 2", imposta: "tono -1" }
---

Scelta 2 della scena `c2.arrest` (c2.js).

1. ««Sì, sono io.»»: parola +1, rischio +1, punto m11, seme s.
2. ««Non so di cosa state parlando.»»: parola -1, rischio -1, punto m18, seme c.
3. «Soffio piano verso la lanterna di quello col foglio.» (solo se power stun): esplora +1.
4. ««Chiedete in paese chi sono: ve lo dirà mezza Salem.»» (solo se pop 2): tono -1.
