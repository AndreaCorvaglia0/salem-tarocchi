---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c1.gate"
dove: "c1b.js#c1.gate"
fatto: "[[malva-apre-il-cancello]]"
classe: "entrambe"
opzioni:
  - { t: "Grazie di tutto, Malva.", imposta: "tono +1, punto m03, seme c" }
  - { t: "Mi mancherai, anche se non lo vuoi sentire.", imposta: "parola +1, guida +1, fiducia malva +1, punto m06, seme c" }
  - { t: "Non serve che mi apri il cancello: passo da sopra.", quando: "power broom", imposta: "flag gate.flew, rischio +1" }
  - { t: "Dammi un consiglio per Ortica, Malva, ma uno vero.", quando: "trust malva >= 2", imposta: "flag gate.advice, guida -1, tool incense" }
---

Scelta 1 della scena `c1.gate` (c1b.js), dentro un ramo: majorsMin 6 e level 4.

1. «Grazie di tutto, Malva.»: tono +1, punto m03, seme c.
2. «Mi mancherai, anche se non lo vuoi sentire.»: parola +1, guida +1, fiducia malva +1, punto m06, seme c.
3. «Non serve che mi apri il cancello: passo da sopra.» (solo se power broom): flag gate.flew, rischio +1.
4. «Dammi un consiglio per Ortica, Malva, ma uno vero.» (solo se trust malva >= 2): flag gate.advice, guida -1, tool incense.
