---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: Bene. Molto bene, signorina. Forse perfino troppo…"
dove: "end.js#c3.trial"
condizione: "flag exam.passed"
si_guadagna:
  - { serve: "flag exam.passed", dove: "c1b.js#c1.exam1" }
  - { serve: "flag exam.passed", dove: "end.js#c3.trial" }
---

Una variante del finale in `c3.trial` (end.js).

- se flag exam.passed: Bene. Molto bene, signorina. Forse perfino troppo bene, per una ragazza arrivata a Salem …
- altrimenti: Che peccato, signorina. Glielo dico sinceramente: speravo che andasse in un altro modo.

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
