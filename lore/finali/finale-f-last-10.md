---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: E continua a dire le cose in faccia, mi raccomand…"
dove: "end.js#f.last"
condizione: "trait parola >= 3"
si_guadagna:
  - { serve: "trait parola >= 3", dove: "[[tratto-parola]]" }
---

Una variante del finale in `f.last` (end.js).

- se trait parola >= 3: E continua a dire le cose in faccia, mi raccomando. In questo paese siamo rimaste in poch…
- altrimenti: E tu, che pesi ogni parola da quando ti conosco: stasera una di troppo puoi anche dirla, …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
