---
tipo: ricetta
nome: "Prima l'immagine, poi la parola"
legge: "[[legge-si-vede-e-si-tocca]]"
famiglia: imparare
ambito: generale
problema: "Una definizione letta prima di aver guardato resta una parola senza appiglio."
soluzione: "Una carta si impara in tre passi: la si guarda e si tocca un dettaglio, poi qualcuno la racconta, poi si aggiunge il sapere più astratto. Il gioco chiede il significato solo dopo il racconto."
in_salem:
  - "[[doppia-codifica]]"
  - "[[trovare-una-carta]]"
  - "[[farsi-leggere-dalla-lettrice]]"
  - "[[riconoscere-una-carta]]"
  - "[[ricordare-i-dettagli]]"
si_controlla_con: "tests/play.told.test.mjs (l'Esame chiede che cosa dice una carta solo dopo che la Lettrice l'ha raccontata)"
rischi: "I Minori numerali non hanno un titolo stampato, quindi manca la seconda strada, il nome. Attenzione a non confondere questo con le «immagini mentali» per studiare un testo, che hanno poca utilità: qui l'immagine è vera, è la carta."
fonte: "DESIGN.md, Le carte («prima si guarda l'immagine, poi si impara cosa dice»); RESEARCH.md, Tecniche di apprendimento (Oates e Reder 2010)"
---

Le tre stelle di DESIGN.md sono trovata, raccontata, conosciuta. In src/core/progress.js `answer()` fa salire una stella solo con il tipo di risposta giusto (immagine, significato, pianeta) e in ordine; `tellCard()` dà la seconda stella quando la Lettrice racconta la carta.

La carta di oggi fa lo stesso in piccolo: prima la carta grande, poi lo sguardo su un dettaglio del disegno (i punti sono in src/data/daily/visual.js), e solo alla fine il significato.

Per un altro gioco: in Mnemopolis il laboratorio viene prima delle domande («Understanding comes before memory»), ed è la stessa idea. Dove il corso ha figure, come i colori o gli accordi, la figura si mostra prima del nome.
