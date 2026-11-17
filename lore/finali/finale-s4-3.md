---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "s4: Chi legge sceglie sempre una carta che rappresent…"
dove: "sessions.js#s4"
condizione: "verdict changed"
si_guadagna:
  - { serve: "verdict changed", dove: "la sua carta, dai tratti e dai punti di tutte le scelte (core/progress.js yourCard)" }
---

Una variante del finale in `s4` (sessions.js).

- se verdict changed: Chi legge sceglie sempre una carta che rappresenta chi chiede, e la mette al centro. L'ul…
- altrimenti: Chi legge sceglie sempre una carta che rappresenta chi chiede, e la mette al centro. La t…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
