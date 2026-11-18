---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.dawn: E il tuo gatto che arriva con le chiavi in bocca,…"
dove: "end.js#f.dawn"
condizione: "flag jail.keys"
si_guadagna:
  - { serve: "flag jail.keys", dove: "c3.js#c3.jail [[c3-c3-jail-2]]" }
---

Una variante del finale in `f.dawn` (end.js).

- se flag jail.keys: E il tuo gatto che arriva con le chiavi in bocca, come un cane da caccia! Non glielo dico…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
