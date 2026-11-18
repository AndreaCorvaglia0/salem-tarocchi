---
tipo: ricetta
nome: "Una voce che legge chi gioca"
famiglia: personalizzare
ambito: generale
problema: "Il ritratto calcolato è invisibile se nessuno lo racconta, e un racconto finto («ti conosco») suona vuoto."
soluzione: "Una voce fuori dalla storia torna a intervalli regolari. Apre con un'osservazione vera su come lei ha giocato, riprende il discorso dell'altra volta, fa un'ipotesi e la corregge quando i fatti la smentiscono."
in_salem:
  - "[[la-lettrice-legge-lei]]"
  - "[[farsi-leggere-dalla-lettrice]]"
  - "[[i-personaggi-non-spiegano]]"
  - "[[lettrice]]"
si_controlla_con: "tests/story.reader.test.mjs; tests/story.visit.test.mjs; tests/story.portrait.test.mjs"
rischi: "Collegare una risposta a un fatto che non è successo. Approvare tutto. Spiegare come funziona («le tue risposte spostano la carta»): non si fa."
fonte: "DESIGN.md, La Lettrice; WRITING.md, La Lettrice"
---

Sono undici incontri: il prologo, due visite e una seduta per capitolo, il finale. src/story/visit.plan.js compone una visita: `opener` (la prima riga la cui condizione vale, per esempio la scelta del fagotto), `thread`, le carte nuove, `ritual`, `closer`. Tra le carte, la domanda va su quella che muove il tratto meno esplorato (`pickAsk`). La seduta chiude con un giudizio provvisorio: «Per ora la tua carta è questa. Vedremo se mi farai cambiare idea.»

Per un altro gioco: in Mnemopolis il guardiano del faro e il commissario di bordo commentano già quanto si è giocato. Potrebbero commentare anche come: i laboratori rifatti, le domande sbagliate e poi giuste.
