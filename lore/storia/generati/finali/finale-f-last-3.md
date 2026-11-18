---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Sul tronco c'è una coperta piegata, lavata e stir…"
dove: "end.js#f.last"
condizione: "flag tabita.owes"
si_guadagna:
  - { serve: "flag tabita.owes", dove: "c1.js#c1.deliver [[c1-c1-deliver-3]]" }
---

Una variante del finale in `f.last` (end.js).

- se flag tabita.owes: Sul tronco c'è una coperta piegata, lavata e stirata di fresco. Tabita la lavandaia conti…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
