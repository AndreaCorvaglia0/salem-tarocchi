---
tipo: ricetta
nome: "Usare quello che sa in un caso nuovo"
famiglia: imparare
ambito: generale
problema: "Saper rispondere a una domanda su una carta non vuol dire saperla leggere per qualcuno."
soluzione: "Lo stesso sapere torna in situazioni diverse: una lettura per un cliente che ha una domanda sua, una lettura per sé, una carta pescata per decidere a un bivio."
in_salem:
  - "[[trasferimento-con-la-pratica]]"
  - "[[leggere-e-l-attivita-vera]]"
  - "[[leggere-ai-clienti]]"
  - "[[leggere-per-strada]]"
  - "[[leggere-per-se]]"
  - "[[chiedere-alle-carte]]"
  - "[[decidere-con-una-carta]]"
si_controlla_con: "tests/reading.engine.test.mjs; tests/play.consult.test.mjs; tests/trials.test.mjs"
rischi: "Le letture ai clienti offrono sempre tre scelte, mentre a casa lei dovrà dire la frase da sola. Il passaggio al caso nuovo riesce solo se il riscontro è ricco e il compito somiglia a quello vero."
fonte: "READING.md; DESIGN.md, Un solo gesto: chiedere alle carte; RESEARCH.md, Tecniche di apprendimento (Pan e Rickard 2018)"
---

Una lettura (src/reading/, src/systems/consult.js) chiede tre gesti: che idea porta la carta, che cosa vuol dire in quel posto, che cosa rispondi alla persona. Le alternative sbagliate (src/reading/wrong.js) sono sempre altre carte, lontane per significato, così si può ragionare invece di tirare a indovinare.

A un bivio (src/trials/ask.js) la carta pescata decide in tre gradi: il segno (favorevole o contraria), l'idea (le strade sono descritte con cose, come acqua che scorre o una porta murata), il quesito (una regola detta chiara).

Per un altro gioco: in un corso di Mnemopolis il caso nuovo è una persona con un problema vero da risolvere con il concetto della casa, non un'altra domanda sulla definizione.
