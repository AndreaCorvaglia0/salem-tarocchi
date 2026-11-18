---
tipo: ricetta
nome: "Strettoie alla fine dei capitoli"
legge: "[[legge-strati-indipendenti]]"
famiglia: variare
ambito: generale
problema: "Se ogni scelta apre una strada sua, la storia si allarga senza fine e non si riesce più a scriverla bene."
soluzione: "Dentro un capitolo i rami si allargano; alla fine si stringono tutti in un punto fisso: la seduta con la Lettrice e un cancello di rango. Il capitolo dopo parte uguale per tutte, con fatti diversi."
in_salem:
  - "[[salire-di-rango]]"
  - "[[farsi-leggere-dalla-lettrice]]"
  - "[[sempre-chiaro-cosa-fare]]"
  - "[[consiglio-delle-maestre]]"
si_controlla_con: "tests/story.path.test.mjs (il percorso principale intero); tests/story.data.test.mjs (due cancelli di rango, le sedute chiudono i capitoli); tests/balance.test.mjs (a che livello si arriva ai cancelli)"
rischi: "Un cancello che la tiene ferma troppo a lungo. Prima della taratura la scopa arrivava nella prima mezz'ora (DESIGN.md, Emerso dalla prova)."
fonte: "DESIGN.md, Il rango («I due cancelli»); La Lettrice («Le sedute… a fine capitolo»)"
---

I cancelli sono `{ level: 4 }` e `{ level: 7 }`, più cinque delle sette carte del capitolo. Finché lei non li passa, una maestra glielo dice con parole sue e la manda a studiare. scripts/balance.mjs simula tre giocatrici (dritta, normale, esploratrice) e dice a che livello arriva ognuna a ogni cancello; notes/balance.md tiene i numeri.

Per un altro gioco: in Mnemopolis la strettoia c'è già (tutte le case principali prima del faro). Un generatore di storie dovrebbe produrre un capitolo alla volta, tra due strettoie, così ogni pezzo si controlla da solo.
