---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "s4: Sei nata sotto {birthCard} e sei diventata {yourC…"
dove: "sessions.js#s4"
condizione: "hasBirth true"
si_guadagna:
  - { serve: "hasBirth true", dove: "stato del gioco" }
---

Una variante del finale in `s4` (sessions.js).

- se hasBirth true: Sei nata sotto {birthCard} e sei diventata {yourCard}. Nessuna delle due è sbagliata: una…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
