---
tipo: metodo
nome: "Scelte che dicono chi è, scelte che provano che cosa sa"
famiglia: variare
ambito: generale
problema: "Se una domanda sul carattere ha una risposta giusta, lei risponde per vincere e il ritratto mente. Se una domanda sul sapere muove il carattere, un errore diventa un giudizio."
soluzione: "Due tipi di scelta, tenuti separati. Quelle di carattere non hanno risposta giusta e muovono un tratto. Quelle di sapere hanno una risposta giusta, un riscontro e a volte una posta, e non toccano il ritratto."
in_salem:
  - "[[la-lettrice-legge-lei]]"
  - "[[dire-cosa-pensa-degli-altri]]"
  - "[[superare-l-esame]]"
  - "[[affrontare-le-prove]]"
si_controlla_con: "tests/story.data.test.mjs (ogni opzione dei copioni porta un tratto, e le due opzioni tirano da parti diverse)"
rischi: "Il tono «con garbo o male» nelle letture mescolava i due tipi: è stato tolto (src/systems/consult.js). Alcune scelte delle prove muovono un tratto: vanno tenute fuori dal conto degli errori."
fonte: "DESIGN.md, Il ritratto («nessuno dei due è quello giusto»); La logica del gioco, ridefinita («le scelte pesino»)"
---

Una scelta di carattere: la prima seduta (WRITING.md, «Bussi, oppure fai il giro per cercare una finestra?»). Ogni risposta ha la sua replica e il suo tratto, e nessuna perde niente. Una scelta di sapere: l'Esame (src/systems/exam.rules.js), dove una risposta sbagliata alza il sospetto.

I due tipi si incontrano solo nelle risposte speciali: un tratto marcato apre un'opzione in più, con l'etichetta «[È da te]», e non è mai una risposta giusta (notes/paths.md).

Per un altro gioco: in Mnemopolis quasi tutte le scelte sono di sapere. Una scelta di carattere nei dialoghi con i proprietari darebbe voce a chi gioca, senza toccare il punteggio.
