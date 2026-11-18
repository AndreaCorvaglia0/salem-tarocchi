---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c1.square"
dove: "c1b.js#c1.square"
fatto: "[[bivio-della-piazza]]"
classe: "entrambe"
opzioni:
  - { t: "Mi faccio avanti e lo dico forte: «Le candele non hanno mai…", imposta: "flag b1.spoke, rischio +1, parola +1, fiducia ginepra +1, punto m11, seme s" }
  - { t: "Resto dove sono, nell'ombra del portico, e non dico niente.", imposta: "flag b1.hid, rischio -1, parola -1, punto m02, seme c" }
  - { t: "Raccolgo le candele dalla neve, e dico forte che sono solta…", quando: "trait rischio >= 3", imposta: "flag b1.spoke, rischio +1, tono +1, fiducia ginepra +1, flag b1.candles" }
  - { t: "Resto zitta, ma guardo bene in faccia chi accusa e chi port…", quando: "trait parola <= -3", imposta: "flag b1.hid, parola -1, esplora +1, flag b1.watched" }
---

Scelta 1 della scena `c1.square` (c1b.js).

1. «Mi faccio avanti e lo dico forte: «Le candele non hanno mai…»: flag b1.spoke, rischio +1, parola +1, fiducia ginepra +1, punto m11, seme s.
2. «Resto dove sono, nell'ombra del portico, e non dico niente.»: flag b1.hid, rischio -1, parola -1, punto m02, seme c.
3. «Raccolgo le candele dalla neve, e dico forte che sono solta…» (solo se trait rischio >= 3): flag b1.spoke, rischio +1, tono +1, fiducia ginepra +1, flag b1.candles.
4. «Resto zitta, ma guardo bene in faccia chi accusa e chi port…» (solo se trait parola <= -3): flag b1.hid, parola -1, esplora +1, flag b1.watched.
