---
tipo: ricetta
nome: "Tornare con un piccolo rito di ogni giorno"
famiglia: imparare
ambito: generale
problema: "Il ripasso a distanza di giorni funziona solo se lei torna, e un gioco che costringe a tornare diventa un dovere."
soluzione: "Fuori dalla partita c'è un tavolo con cose da venti secondi: la carta di oggi, due carte da ripassare, l'orto. Ognuna fa crescere la luna, e saltare un giorno non toglie niente. Le carte tornano da ripassare dopo 1, 3, 7 e 16 giorni."
in_salem:
  - "[[ripetizione-distanziata]]"
  - "[[mai-assillare]]"
  - "[[girare-la-carta-di-oggi]]"
  - "[[ripassare]]"
  - "[[far-crescere-la-luna]]"
  - "[[curare-l-orto]]"
si_controlla_con: "tests/threshold.test.mjs (la luna cresce una volta al giorno; le due carte del ripasso)"
rischi: "La carta di oggi è scelta a caso tra le 78 e la sua domanda a memoria non aggiorna il ripasso. Gli intervalli 1, 3, 7, 16 sono una scelta nostra, non un numero della ricerca."
fonte: "DESIGN.md, La soglia; RESEARCH.md, Tecniche di apprendimento (Cepeda e altri 2006)"
---

La soglia è src/ui/title.js, con le regole in src/glue/threshold.rules.js: `growMoon` aggiunge uno spicchio al giorno, e a luna piena arriva un dono fatto di cose che esistono già. Il ripasso legge `INTERVALS` e `dueIds()` in src/core/progress.js; un errore rimette la carta a domani.

Tutto si regge su [[mai-assillare]]: niente notifiche, niente serie che si spezzano, niente premi che crescono solo se torni ogni giorno.

Per un altro gioco: Mnemopolis ha già la nebbia che torna sulle case dopo 1, 3, 7 e 16 giorni, ma solo dopo il finale e dentro la partita. Una soglia fuori dalla partita, con un concetto al giorno, porterebbe il ritorno prima.
