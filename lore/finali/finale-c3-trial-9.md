---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: Malva è in piedi in fondo all'aula, dove le avevi…"
dove: "end.js#c3.trial"
condizione: "flag coven.watch.malva"
si_guadagna:
  - { serve: "flag coven.watch.malva", dove: "c3.js#c3.coven [[c3-c3-coven-3]]" }
---

Una variante del finale in `c3.trial` (end.js).

- se flag coven.watch.malva: Malva è in piedi in fondo all'aula, dove le avevi chiesto di stare, e non stacca gli occh…
- altrimenti: In fondo all'aula, in piedi contro il muro, c'è Malva con le braccia conserte. Ti guarda …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
