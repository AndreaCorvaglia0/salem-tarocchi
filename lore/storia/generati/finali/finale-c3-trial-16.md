---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: E saluto la mia cuoca, là in fondo, che stamattin…"
dove: "end.js#c3.trial"
condizione: "flag court.cook"
si_guadagna:
  - { serve: "flag court.cook", dove: "c3.js#c3.court [[c3-c3-court-1]]" }
---

Una variante del finale in `c3.trial` (end.js).

- se flag court.cook: E saluto la mia cuoca, là in fondo, che stamattina ha trovato il tempo di venire in aula …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
