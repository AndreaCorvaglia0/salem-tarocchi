---
tipo: ricetta
nome: "Che cosa pensa degli altri dice chi è"
legge: "[[legge-e-lei-a-decidere]]"
famiglia: personalizzare
ambito: generale
problema: "Chiedere direttamente «chi sei?» mette a disagio e dà risposte di maniera."
soluzione: "Le persone parlano l'una dell'altra e ogni tanto chiedono «E tu, che ne pensi di lei?». Tre risposte vere, nessuna giusta. La Lettrice poi rimanda indietro: quello che le piace o la urta negli altri dice qualcosa di lei."
in_salem:
  - "[[dire-cosa-pensa-degli-altri]]"
  - "[[mai-assillare]]"
  - "[[lettrice]]"
  - "[[tartufo]]"
si_controlla_con: "tests/opinions.test.mjs"
rischi: "Per riempire le battute si inventano dettagli sulle persone: notes/lore-story.md ne elenca 24 da confermare. Le frasi generali della Lettrice rischiano di diventare massime."
fonte: "DESIGN.md, Che ne pensi di lei? (Andrea: «per conoscere i personaggi, e anche per conoscerti per confronto con gli altri»)"
---

Il testo è in src/data/story/opinions.js: `PEOPLE_OP` dice per ogni persona quando lei l'ha incontrata (`met`), che cosa ne dicono gli altri (`voci`) e la domanda con tre risposte e la reazione di chi chiede. Le regole sono pure, in src/glue/opinions.rules.js: solo persone già incontrate, mai nel prologo, mai due volte la stessa domanda. Le sue note restano nel grimorio, nella pagina «Le persone» (src/ui/people.js).

Per un altro gioco: in Mnemopolis i proprietari delle case potrebbero dire una cosa del vicino, e così presentarlo prima che lei ci entri. La domanda «tu che ne pensi?» servirebbe solo se il gioco avrà un ritratto.
