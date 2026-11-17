---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.dawn: Sei venuta a prendermi dalle cantine, al buio, in…"
dove: "end.js#f.dawn"
condizione: "flag b3.stealth"
si_guadagna:
  - { serve: "flag b3.stealth", dove: "c3.js#c3.coven [[c3-c3-coven-2]]" }
---

Una variante del finale in `f.dawn` (end.js).

- se flag b3.stealth: Sei venuta a prendermi dalle cantine, al buio, in mezzo ai topi. Sei la persona più roman…
- altrimenti: Sei entrata dalla porta grande, davanti a tutto il villaggio, e hai detto il tuo nome. Qu…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
