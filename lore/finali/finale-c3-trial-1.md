---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: Del resto noi due ci conosciamo già: lei ha dormi…"
dove: "end.js#c3.trial"
condizione: "stat jailed >= 2"
si_guadagna:
  - { serve: "stat jailed >= 2", dove: "il codice dei sistemi (esami, celle, letture: src/systems, src/glue)" }
---

Una variante del finale in `c3.trial` (end.js).

- se stat jailed >= 2: Del resto noi due ci conosciamo già: lei ha dormito nelle mie celle {stat:jailed} volte. …
- altrimenti: Del resto noi due ci conosciamo già: lei ha dormito una notte nelle mie celle. Spero che …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
