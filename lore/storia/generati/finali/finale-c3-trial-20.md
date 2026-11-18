---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: risposta ««I suoi conestabili me ne hanno già fat…»"
dove: "end.js#c3.trial"
condizione: "stat examsPassed >= 5 e stat examsFailed == 0"
si_guadagna:
  - { serve: "stat examsPassed >= 5", dove: "il codice dei sistemi (esami, celle, letture: src/systems, src/glue)" }
  - { serve: "stat examsFailed == 0", dove: "il codice dei sistemi (esami, celle, letture: src/systems, src/glue)" }
---

Una variante del finale in `c3.trial` (end.js).

- risposta speciale ««I suoi conestabili me ne hanno già fatte tante, di domande…»

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
