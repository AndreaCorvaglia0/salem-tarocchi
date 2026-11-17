---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c2.mill"
dove: "c2.js#c2.mill"
fatto: "[[unguento-al-mulino]]"
classe: "entrambe"
opzioni:
  - { t: "«Avete ragione voi: gira proprio al contrario.»", imposta: "tono +1, punto m10, seme w" }
  - { t: "«Mi sa che ha ragione vostra moglie.»", imposta: "parola +1, punto m11, seme s" }
  - { t: "Giro una carta per la ruota, qui sul muretto, e gliela legg…", quando: "stat readings >= 3", imposta: "flag mill.read, guida +1" }
---

Scelta 1 della scena `c2.mill` (c2.js).

1. ««Avete ragione voi: gira proprio al contrario.»»: tono +1, punto m10, seme w.
2. ««Mi sa che ha ragione vostra moglie.»»: parola +1, punto m11, seme s.
3. «Giro una carta per la ruota, qui sul muretto, e gliela legg…» (solo se stat readings >= 3): flag mill.read, guida +1.
