---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "s4: È la carta del tuo segno. Hai fatto tutto questo …"
dove: "sessions.js#s4"
condizione: "yourCardIsBirth true"
si_guadagna:
  - { serve: "yourCardIsBirth true", dove: "la sua carta, dai tratti e dai punti di tutte le scelte (core/progress.js yourCard)" }
---

Una variante del finale in `s4` (sessions.js).

- se yourCardIsBirth true: È la carta del tuo segno. Hai fatto tutto questo giro per tornare da dove eri partita, pe…
- altrimenti: Sei nata sotto {birthCard} e sei diventata {yourCard}. Nessuna delle due è sbagliata: una…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
