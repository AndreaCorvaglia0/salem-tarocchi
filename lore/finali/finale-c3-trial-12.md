---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: Edera è seduta in prima fila, col vestito buono, …"
dove: "end.js#c3.trial"
condizione: "flag coven.watch.edera"
si_guadagna:
  - { serve: "flag coven.watch.edera", dove: "c3.js#c3.coven [[c3-c3-coven-3]]" }
---

Una variante del finale in `c3.trial` (end.js).

- se flag coven.watch.edera: Edera è seduta in prima fila, col vestito buono, proprio dove le avevi chiesto di metters…
- altrimenti: Edera è vicino alla finestra, dritta sulla sedia. Quando incontra i tuoi occhi muove appe…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
