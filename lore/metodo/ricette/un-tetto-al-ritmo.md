---
tipo: ricetta
nome: "Un tetto al ritmo"
famiglia: variare
ambito: generale
problema: "Una cosa bella che arriva troppo spesso diventa rumore, e poi fastidio."
soluzione: "Ogni cosa che si ripete ha un tetto scritto nel codice con un nome: una domanda sulle persone al giorno, una riga su qualcuno ogni due chiacchierate, due novità alla volta nel registro, uno spicchio di luna al giorno."
in_salem:
  - "[[mai-assillare]]"
  - "[[dire-cosa-pensa-degli-altri]]"
  - "[[far-crescere-la-luna]]"
  - "[[leggere-per-se]]"
  - "[[studiare-in-biblioteca]]"
si_controlla_con: "tests/opinions.test.mjs; tests/threshold.test.mjs; tests/core.bonds.test.mjs (MAX_NEW); tests/world.patrol.test.mjs (quanto spesso una ronda la ferma)"
rischi: "Tetti diversi in posti diversi si sommano male: dopo la domanda della Lettrice al letto può arrivare subito l'offerta della lezione di volo (notes/opinions.md). Nessuno strumento guarda il ritmo di tutto insieme."
fonte: "DESIGN.md, Che ne pensi di lei? («Misura»); La soglia; Il registro delle cose in più"
---

I numeri stanno in cima ai file di regole: `VOICE_GAP = 2` e una domanda al giorno in src/glue/opinions.rules.js; `MAX_NEW = 2` in src/core/extras.js; `SELF_XP` solo per la prima lettura per sé del giorno in src/glue/selfread.rules.js; gli argomenti della biblioteca danno punti una volta al giorno (src/trials/topics.js). Per chi cammina distratta, un Esame ogni due o tre minuti.

Per un altro gioco: in Mnemopolis le frasi dei passanti e i minigiochi potrebbero avere lo stesso tipo di tetto, scritto come costante con un nome e controllato da un test.
