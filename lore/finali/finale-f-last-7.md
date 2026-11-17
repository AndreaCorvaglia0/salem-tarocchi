---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Il Giudice, dopo avervi assolte, fa meno processi…"
dove: "end.js#f.last"
condizione: "flag trial.won"
si_guadagna:
  - { serve: "flag trial.won", dove: "end.js#c3.trial" }
---

Una variante del finale in `f.last` (end.js).

- se flag trial.won: Il Giudice, dopo avervi assolte, fa meno processi di prima. Lui dice che l'età lo stanca;…
- altrimenti: Il Giudice vi fa ancora cercare, con il garbo di sempre, e ogni mese firma un foglio nuov…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
