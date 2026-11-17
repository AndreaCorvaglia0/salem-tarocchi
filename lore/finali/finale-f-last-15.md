---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: A proposito del pane della prima sera: non che mi…"
dove: "end.js#f.last"
condizione: "flag cat.fed"
si_guadagna:
  - { serve: "flag cat.fed", dove: "c1.js#c1.cottage [[c1-c1-cottage-2]]" }
---

Una variante del finale in `f.last` (end.js).

- se flag cat.fed: A proposito del pane della prima sera: non che mi interessi, ma non ne hai più offerto. L…
- altrimenti: Io non dico niente. Va bene, una cosa la dico: sono fiero di te. E adesso dimentichiamoce…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
