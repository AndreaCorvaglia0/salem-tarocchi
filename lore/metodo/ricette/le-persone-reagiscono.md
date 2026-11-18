---
tipo: ricetta
nome: "Le persone reagiscono a chi è"
famiglia: personalizzare
ambito: generale
problema: "Se tutti la trattano allo stesso modo, il ritratto resta un numero nascosto."
soluzione: "Ogni strega la guarda in due modi: l'affinità (quanto si rivede in lei, dai tratti) e il legame (quello che hanno fatto insieme). Le due cose insieme danno quattro modi di trattarla, e ogni strega li recita a modo suo."
in_salem:
  - "[[legarsi-alle-streghe]]"
  - "[[malva]]"
  - "[[ortica]]"
  - "[[edera]]"
  - "[[ginepra]]"
si_controlla_con: "tests/witches.test.mjs"
rischi: "Fiducia e legame sono due numeri per la stessa cosa: gli aiuti al processo guardano la fiducia, il grimorio il legame (notes/lore-design.md, parte d). In un punto più vecchio DESIGN.md dice che a Malva piace chi è schietta; il codice dice gentile, prudente e di cuore."
fonte: "DESIGN.md, Le streghe: affinità e legame, due assi diversi"
---

In src/core/witches.js `AFFINITY` dà i tre poli in cui ogni strega si rivede, e `attitude()` restituisce uno di quattro modi: «pari» (affine e legata), «prova» (affine, non legata), «brontola» (legata, non affine), «fredda». Le scene leggono la condizione `{ attitude: { edera: 'brontola' } }` di src/core/cond.js. In più, un tratto marcato apre risposte speciali con l'etichetta «[È da te]» (notes/paths.md).

Per un altro gioco: in Mnemopolis i proprietari hanno un temperamento fisso. Un'affinità calcolata dal modo di giocare cambierebbe la battuta all'ingresso e il modo di dare la chiave.
