---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "s4: La prima sera non sapevi ancora perché eri venuta…"
dove: "sessions.js#s4"
condizione: "flag s0.window"
si_guadagna:
  - { serve: "flag s0.window", dove: "sessions.js#s0 [[sessions-s0-1]]" }
---

Una variante del finale in `s4` (sessions.js).

- se flag s0.window: La prima sera non sapevi ancora perché eri venuta. Mi hai detto il tuo nome, e poi che da…
- altrimenti: La prima sera non sapevi ancora perché eri venuta. Mi hai detto il tuo nome, e poi che da…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
