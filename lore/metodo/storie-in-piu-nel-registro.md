---
tipo: metodo
nome: "Le storie in più sono voci di un registro, e arrivano anche a chi è avanti"
famiglia: variare
ambito: generale
problema: "Chi sta già giocando non vedrebbe mai un pezzo nuovo legato a un passo che ha già superato; dieci pezzi nuovi insieme la sommergerebbero."
soluzione: "Ogni pezzo facoltativo è una voce con un id e una condizione su quello che lei ha, mai sul punto della storia. I pezzi in ordine sono una catena (`after`); quelli che servono per andare avanti sono chiavi (`key`). Il gioco ne mostra al massimo due nuovi alla volta."
in_salem:
  - "[[arriva-a-chi-e-avanti]]"
  - "[[andare-altrove]]"
  - "[[affrontare-le-prove]]"
  - "[[seguire-le-lezioni]]"
  - "[[imparare-da-ortica]]"
  - "[[trovare-una-carta]]"
si_controlla_con: "tests/core.bonds.test.mjs (una catena mostra solo il primo anello, le chiavi non aspettano, al massimo MAX_NEW nuove); tests/story.lessons.test.mjs; tests/elsewhere.test.mjs (la catena degli Altrove); tests/missions.page.test.mjs (ogni voce ha la sua scheda sulla mappa, in src/ui/missions/titles.js); tests/knows-only.test.mjs (la scheda dice solo quello che lei sa)"
rischi: "Una voce con `when: { step: … }` non arriva a chi è avanti. Le note a matita della storia (kind 'side') e le chiavi non contano nel tetto di due: se crescono, il tetto non le ferma."
fonte: "DESIGN.md, Il registro delle cose in più; Recuperare quello che si aggiunge dopo"
---

Il registro è src/core/extras.js. Le voci arrivano da quattro posti: le missioni secondarie (`SIDE` in src/data/story/steps.js), le lezioni (`LESSON_MISSIONS` in src/data/story/missions.js), le prove (src/data/trials/, registrate da src/glue/trials.js), i mondi Altrove (src/glue/elsewhere.rules.js). Le prove secondarie sono una catena: vigil, well, kettle, grave, room, dare, hat.

Sulla mappa ogni voce è un foglietto con la sua scheda, e la scheda dice solo quello che lei sa: un titolo che evoca, chi gliel'ha detto, dove, quello che le hanno detto con le sue parole, a volte un presentimento. Mai che cosa ci guadagna; il tipo (una carta, una lezione) solo se qualcuno gliel'ha detto, altrimenti un foglietto neutro ([[vede-solo-quello-che-sa]]).

Se una cosa piccola salta per chi è molto avanti, pazienza: conta che possa continuare.

Per un altro gioco: in Mnemopolis gli extra sono case e lucchetti decisi dal corso. Un registro con `when`, `after` e `key` è la forma giusta per quello che un generatore di storie dovrebbe produrre: una voce per ogni pezzo.
