---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Ginepra ha di nuovo il suo mazzo. Lo mescola mali…"
dove: "end.js#f.last"
condizione: "flag b2.went"
si_guadagna:
  - { serve: "flag b2.went", dove: "c2.js#c2.plan [[c2-c2-plan-1]]" }
---

Una variante del finale in `f.last` (end.js).

- se flag b2.went: Ginepra ha di nuovo il suo mazzo. Lo mescola malissimo, facendo cadere metà delle carte, …
- altrimenti: Ginepra si è fatta un mazzo nuovo. Dice che quello vecchio le portava sfortuna, e nessuna…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
