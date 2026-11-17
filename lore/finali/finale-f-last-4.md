---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Comare Hale vende ancora le sue candele sotto il …"
dove: "end.js#f.last"
condizione: "flag b1.spoke"
si_guadagna:
  - { serve: "flag b1.spoke", dove: "c1b.js#c1.square [[c1b-c1-square-1]]" }
---

Una variante del finale in `f.last` (end.js).

- se flag b1.spoke: Comare Hale vende ancora le sue candele sotto il portico. Ogni settimana ne lascia una su…
- altrimenti: Di Comare Hale non si è più saputo niente. Sotto il portico qualcun altro ha riaperto il …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
