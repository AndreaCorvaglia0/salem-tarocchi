---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Accanto al fuoco c'è una cesta di candele nuove, …"
dove: "end.js#f.last"
condizione: "flag b1.candles"
si_guadagna:
  - { serve: "flag b1.candles", dove: "c1b.js#c1.square [[c1b-c1-square-1]]" }
---

Una variante del finale in `f.last` (end.js).

- se flag b1.candles: Accanto al fuoco c'è una cesta di candele nuove, con un biglietto senza firma. Le hai rac…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
