---
tipo: metodo
nome: "Un obiettivo diventa un gesto con un motivo nel mondo"
famiglia: imparare
ambito: generale
problema: "Un esercizio fatto per il voto si fa una volta e si dimentica; dentro un gioco sembra un compito."
soluzione: "Ogni obiettivo diventa una cosa che lei fa nella storia, e il mondo le dà un motivo per farla: un conestabile la ferma, un baule è sigillato, un cliente aspetta una risposta."
in_salem:
  - "[[le-carte-servono-a-muoversi]]"
  - "[[superare-l-esame]]"
  - "[[aprire-i-sigilli]]"
  - "[[leggere-ai-clienti]]"
  - "[[chiedere-alle-carte]]"
si_controlla_con: "a mano: il campo ragione_nel_gioco di ogni meccanica e le tabelle di lore/meccaniche/_matrice.md"
rischi: "Il motivo diventa un pretesto («rispondi o non passi») e la scena non ha più bisogno di quel sapere. Oggi sette obiettivi non hanno una meccanica che li verifichi (notes/lore-design.md, parte a)."
fonte: "DESIGN.md, La logica del gioco, ridefinita"
---

Si parte dall'obiettivo, cioè da che cosa saprà fare lei in modo che si veda. Poi si cerca il posto di Salem in cui quel sapere servirebbe davvero. Le carte tengono in piedi l'incantesimo all'Esame (src/systems/exam.js), aprono i bauli (src/systems/lock.js) e indicano la strada ai bivi delle prove (src/trials/ask.js).

Nel vault il legame è scritto: ogni file di lore/obiettivi elenca le sue meccaniche, e ogni meccanica ha `insegna` e `ragione_nel_gioco`. Un obiettivo senza meccaniche è un buco da segnare, non da nascondere.

Per un altro gioco: in una città di Mnemopolis ogni casa ha già il suo concetto. Per ogni obiettivo del corso ci si chiede chi, in città, ne avrebbe bisogno e perché.
