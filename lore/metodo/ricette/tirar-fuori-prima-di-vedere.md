---
tipo: ricetta
nome: "Prima si prova a ricordare, poi si vede"
famiglia: imparare
ambito: generale
problema: "Se la risposta è sullo schermo, o arriva prima del tentativo, lei la riconosce e non la cerca nella memoria."
soluzione: "Ogni domanda nasconde la sua risposta: il titolo stampato si copre. Gli aiuti arrivano dopo un tentativo o costano qualcosa. Il riscontro arriva subito dopo la risposta."
in_salem:
  - "[[la-domanda-non-mostra-la-risposta]]"
  - "[[pratica-di-recupero]]"
  - "[[difficolta-desiderabile]]"
  - "[[rispondere-a-memoria]]"
  - "[[riprendere-le-carte-sequestrate]]"
si_controlla_con: "tests/cards.questions.test.mjs (le domande sul nome e sul dettaglio coprono il titolo; le risposte sul significato non contengono il nome della carta)"
rischi: "Quasi tutto è a scelta tra tre o quattro risposte: è riconoscere, non ricordare da sola. L'aiuto «Ricordamela» nelle letture non costa niente; dal 18 novembre dà un indizio per ricordare (il posto, il disegno), non le parole della carta (src/systems/consult.rules.js helpNote)."
fonte: "DESIGN.md, Le regole 5; RESEARCH.md, Tecniche di apprendimento (Roediger e Karpicke 2006; Hays, Kornell e Bjork)"
---

Nella carta di oggi (src/ui/daycard.js) la carta si copre, arriva la domanda, poi la carta si scopre e si ingrandisce sul punto giusto: la scoperta è già il riscontro. Lo stesso succede negli Esami e al deposito del tribunale (src/systems/recover.js), dove si risponde proprio sulla carta da riprendere.

Il passo che manca è il richiamo senza opzioni, cioè dire la cosa da sola. Le sue tre parole, salvate in `state.cards[id].words`, sono il materiale pronto: «Le tue parole erano queste: che carta è?» (proposta in notes/lore-design.md, parte e).

Per un altro gioco: Mnemopolis ha già i lucchetti con la risposta scritta a mano, ma solo fuori dal percorso principale. Le altre domande seguono la stessa regola: niente risposta visibile, riscontro subito dopo.
