---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 5 di c3.edera"
dove: "c3.js#c3.edera"
fatto: "[[incontro-con-edera]]"
classe: "entrambe"
opzioni:
  - { t: "Lo ripeterò volentieri, tutte le volte che serve.", imposta: "tono +1, fiducia edera +1, punto m02, seme c" }
  - { t: "Io i nomi me li scrivo. Potrei scriverli anche per te.", imposta: "guida -1, esplora -1, punto m09, seme p" }
  - { t: "Legalo a una cosa che ricordi: sono nata sotto il segno {si…", quando: "hasBirth true", imposta: "flag edera.sign, esplora +1, fiducia edera +1" }
---

Scelta 5 della scena `c3.edera` (c3.js).

1. «Lo ripeterò volentieri, tutte le volte che serve.»: tono +1, fiducia edera +1, punto m02, seme c.
2. «Io i nomi me li scrivo. Potrei scriverli anche per te.»: guida -1, esplora -1, punto m09, seme p.
3. «Legalo a una cosa che ricordi: sono nata sotto il segno {si…» (solo se hasBirth true): flag edera.sign, esplora +1, fiducia edera +1.
