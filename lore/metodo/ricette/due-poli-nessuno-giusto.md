---
tipo: ricetta
nome: "Due poli, e nessuno è quello giusto"
famiglia: personalizzare
ambito: generale
problema: "Un punteggio di bontà fa sentire giudicata chi gioca, e la spinge a rispondere come crede che il gioco voglia."
soluzione: "Il carattere è fatto di cinque linee tra due poli: curiosa o dritta al punto, schietta o accorta, gentile o pungente, audace o prudente, cuore o testa. Ogni polo ha i suoi vantaggi e le sue battute."
in_salem:
  - "[[la-lettrice-legge-lei]]"
  - "[[protagonista]]"
  - "[[lettrice]]"
si_controlla_con: "tests/core.portrait.test.mjs; tests/glue.traits.test.mjs; tests/story.data.test.mjs (le due opzioni tirano da parti diverse)"
rischi: "Un polo che apre più cose dell'altro diventa quello giusto senza che nessuno lo dica. Il polo «pungente» è il più facile da scrivere male."
fonte: "DESIGN.md, Il ritratto"
---

`AXES` e `addTrait` sono in src/core/progress.js: ogni tratto va da -6 a 6, e `state.hits` conta a parte le spinte da una parte e dall'altra. Le risposte dei copioni portano il loro `trait`; il modo di giocare aggiunge il suo (src/glue/traits.rules.js: posti fuori strada, chiacchiere facoltative, ronde sfidate o evitate, la bottiglia).

Il catalogo dei tratti, con che cosa li muove, sta in lore/storia/generati/tratti, che scrive un altro agente.

Per un altro gioco: in Mnemopolis potrebbero bastare due o tre assi, per esempio «prova subito» o «guarda prima», letti dal modo in cui si usano i laboratori.
