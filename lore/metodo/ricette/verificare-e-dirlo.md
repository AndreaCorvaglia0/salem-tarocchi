---
tipo: ricetta
nome: "Dire che cosa è stato verificato, e come"
famiglia: far-crescere
ambito: generale
problema: "«Funziona» detto senza prove nasconde quello che nessuno ha guardato: il telefono vero, l'audio, una persona che non conosce il gioco."
soluzione: "Ogni consegna dice che cosa è stato verificato e con che cosa (test, schermate, fonti), e che cosa no. Le schermate si provano anche con lettori ingenui, che vedono solo le immagini."
in_salem:
  - "[[prima-di-tutto-corretto]]"
  - "[[sempre-chiaro-cosa-fare]]"
si_controlla_con: "npm test; node scripts/shot.mjs <url> <out.png> --phone; node scripts/playthrough.mjs; a mano per il resto"
rischi: "Nessuno strumento ascolta l'audio o prova un telefono vero: quelle prove le fa Andrea. Un lettore artificiale ingenuo non è una persona vera."
fonte: "AGENTS.md; DESIGN.md, La carta di oggi, in grande («Provata con due lettori artificiali “ingenui” sulle sole schermate»)"
---

Esempio: la carta di oggi è stata mostrata a due lettori artificiali che avevano solo le schermate. Capivano il percorso, e hanno fatto correggere la didascalia della luna, il tasto durante la domanda, le scritte piccole e i puntini. RESEARCH.md separa quello che è stato controllato su una pagina da quello scritto a memoria. scripts/playthrough.mjs gioca una partita intera su uno schermo da telefono.

Per un altro gioco: Mnemopolis ha `npm run shots` e `npm run play`. Il lettore ingenuo sulle schermate è il controllo più economico prima di chiedere ad Andrea.
