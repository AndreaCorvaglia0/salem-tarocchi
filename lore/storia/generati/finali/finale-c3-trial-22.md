---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: Quella era nel deposito, e credo che appartenga a…"
dove: "end.js#c3.trial"
condizione: "flag trial.won"
si_guadagna:
  - { serve: "flag trial.won", dove: "end.js#c3.trial" }
---

Una variante del finale in `c3.trial` (end.js).

- se flag trial.won: Quella era nel deposito, e credo che appartenga a lei. Dicono che queste carte vadano da …
- altrimenti: La prendo io, e la infilo sotto il mantello. Mentre tutti gridano al buio, nessuno guarda…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
