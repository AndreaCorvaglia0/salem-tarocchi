---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di enc.guard"
dove: "post.js#enc.guard"
fatto: "[[guardia-del-pozzo]]"
classe: "entrambe"
opzioni:
  - { t: "«Sono il fantasma del pozzo. Torna a dormire.»", imposta: "flag guard.ghost, rischio +1, punto m18, seme c" }
  - { t: "«Continuate pure a pensare. Io passo, e non disturbo.»", imposta: "rischio -1, punto m00, seme w" }
  - { t: "Gli soffio addosso un filo d'aria, perché si riaddormenti t…", quando: "power stun", imposta: "flag guard.asleep, tono +1" }
---

Scelta 1 della scena `enc.guard` (post.js).

1. ««Sono il fantasma del pozzo. Torna a dormire.»»: flag guard.ghost, rischio +1, punto m18, seme c.
2. ««Continuate pure a pensare. Io passo, e non disturbo.»»: rischio -1, punto m00, seme w.
3. «Gli soffio addosso un filo d'aria, perché si riaddormenti t…» (solo se power stun): flag guard.asleep, tono +1.
