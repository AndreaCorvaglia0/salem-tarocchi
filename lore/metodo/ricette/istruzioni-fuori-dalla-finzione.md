---
tipo: ricetta
nome: "Le istruzioni stanno fuori dalla storia"
legge: "[[legge-da-molti-lati]]"
famiglia: scrivere
ambito: generale
problema: "Una regola del gioco in bocca a un personaggio rompe la finzione e suona come un manuale."
soluzione: "I personaggi dicono solo quello che direbbe una persona in quella stanza. Un'indicazione pratica è una riga dell'interfaccia, breve, che compare una volta sola."
in_salem:
  - "[[i-personaggi-non-spiegano]]"
  - "[[sempre-chiaro-cosa-fare]]"
  - "[[volare-con-la-scopa]]"
si_controlla_con: "a mano: nessun test lo riconosce; `hintOnce` in src/core/progress.js fa uscire una riga dell'interfaccia una volta per partita"
rischi: "Oggi la regola è rotta da Malva nella lezione di volo, che spiega la mappa del quaderno, e da Tartufo alla fine del ripasso (notes/lore-design.md, parte d)."
fonte: "DESIGN.md, Le regole 2; WRITING.md, regole 6 e 7"
---

Esempio giusto (WRITING.md, l'arrivo): il quadro dice «È una notte d'inverno, e a Salem nevica ormai da tre giorni.»; l'interfaccia, a parte, dice «Tocca un punto della strada per camminare.». Le righe dell'interfaccia passano da `hintOnce(id)` e da src/ui/hint.js.

La regola vale anche per l'intenzione di chi scrive: nessun personaggio dice «le tue risposte contano».

Per un altro gioco: nella città semplice di Mnemopolis la guida spiega l'obiettivo in tre righe all'arrivo (docs/DESIGN.md di Mnemopolis). Con questa regola quelle righe passerebbero all'interfaccia o al quaderno.
