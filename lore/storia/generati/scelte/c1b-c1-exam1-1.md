---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c1.exam1"
dove: "c1b.js#c1.exam1"
fatto: "[[primo-esame]]"
classe: "entrambe"
opzioni:
  - { t: "Sto da Comare Malva, la levatrice. Sono arrivata ieri sera.", imposta: "flag exam1.malva, parola +1, punto m03, seme p" }
  - { t: "Sono solo di passaggio, e riparto domattina.", imposta: "flag lied.constable, parola -1, punto m18, seme c" }
  - { t: "Chiedete alla vedova Bray, che ieri sera era al mio tavolo.", quando: "pop 1", imposta: "flag exam1.bray, guida -1" }
---

Scelta 1 della scena `c1.exam1` (c1b.js).

1. «Sto da Comare Malva, la levatrice. Sono arrivata ieri sera.»: flag exam1.malva, parola +1, punto m03, seme p.
2. «Sono solo di passaggio, e riparto domattina.»: flag lied.constable, parola -1, punto m18, seme c.
3. «Chiedete alla vedova Bray, che ieri sera era al mio tavolo.» (solo se pop 1): flag exam1.bray, guida -1.
