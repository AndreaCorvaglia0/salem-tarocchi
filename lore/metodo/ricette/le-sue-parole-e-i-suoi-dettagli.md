---
tipo: ricetta
nome: "Le sue parole e il suo dettaglio"
famiglia: imparare
ambito: generale
problema: "Quello che si legge si dimentica più in fretta di quello che si produce da sé."
soluzione: "Quando trova una carta lei tocca il dettaglio che la colpisce e scrive tre parole sue. Il gioco riparte da lì: la Lettrice racconta la carta cominciando dal suo dettaglio e dalle sue parole."
in_salem:
  - "[[effetto-generazione]]"
  - "[[trovare-una-carta]]"
  - "[[farsi-leggere-dalla-lettrice]]"
  - "[[lettrice]]"
si_controlla_con: "tests/story.visit.test.mjs (la visita usa il dettaglio e le parole quando ci sono)"
rischi: "Si generano una volta sola e non tornano mai come domanda. Il tasto «Salta» lascia la carta senza parole: il gioco deve reggere anche così."
fonte: "DESIGN.md, Le carte; RESEARCH.md, Tecniche di apprendimento (Bertsch e altri 2007)"
---

Il dettaglio sta in `state.cards[id].detail` e le parole in `state.cards[id].words` (src/core/progress.js, `setDetail` e `setWords`). src/story/visit.plan.js sceglie la riga scritta per quel dettaglio e la riga sulle parole, quando lei le ha date.

La condizione `{ wrote: 'm10' }` di src/core/cond.js apre una risposta speciale, «[L'hai scritto tu]», al fuoco con Ginepra (notes/paths.md). È un esempio piccolo di come le sue parole possono tornare.

Per un altro gioco: in un corso di Mnemopolis, dopo il primo laboratorio di una casa, si può chiedere una riga sua («che cosa hai visto?») e ripresentarla più tardi come indizio, per esempio davanti al lucchetto.
