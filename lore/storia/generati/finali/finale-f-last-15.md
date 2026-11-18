---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Ho scritto il tuo nome sulla prima pagina del mio…"
dove: "end.js#f.last"
condizione: "trust edera >= 2"
si_guadagna:
  - { serve: "trust edera >= 2", dove: "[[tratto-legame-edera]]" }
---

Una variante del finale in `f.last` (end.js).

- se trust edera >= 2: Ho scritto il tuo nome sulla prima pagina del mio libro, per non perderlo più: Rosalba. N…
- altrimenti: Che bella serata. E tu chi sei, cara? Ah, sì, certo: la ragazza delle carte. Hai la mano …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
