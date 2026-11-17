---
tipo: metodo
nome: "Una posta vera, ma che si può riprendere"
famiglia: imparare
ambito: salem
problema: "Senza rischio le scelte non pesano e sapere le carte non conta; con un rischio troppo duro lei smette di giocare."
soluzione: "Nelle prove e negli Esami si può perdere qualcosa (monete, uno strumento, il legame con una strega, a volte una carta), ma ogni perdita grossa si riprende: la carta sequestrata torna rispondendo proprio su di lei."
in_salem:
  - "[[nelle-prove-si-perde]]"
  - "[[prova-con-la-posta]]"
  - "[[superare-l-esame]]"
  - "[[riprendere-le-carte-sequestrate]]"
  - "[[affrontare-le-prove]]"
si_controlla_con: "tests/trials.test.mjs (esiti e perdite); tests/trials.content.test.mjs (prove giuste rispetto alle carte che lei può avere a quel punto); tests/play.exam.test.mjs"
rischi: "Con troppa pressione il vantaggio del ripasso si riduce (letto solo in un riassunto: da prendere con prudenza). Una perdita non deve mai togliere una carta che serve a un cancello: gateCards in src/trials/run.js lo impedisce."
fonte: "DESIGN.md, Le prove («Il gioco non è una favola: deve poter fare paura»); RESEARCH.md, Lette solo in un riassunto (Hinze e Rapp 2014; Smith, Floerke e Thomas 2016)"
---

I primi Esami perdonano un errore. Ogni errore alza il sospetto (src/systems/exam.rules.js); se l'Esame va male lei finisce in cella e perde una o due carte, mai Il Matto, e le riprende al deposito (src/systems/recover.js). L'orto appassisce di un passo ma non muore.

È una scelta di Salem, non una regola generale: Mnemopolis ha il principio opposto, «Mistakes cost nothing but a turn» (docs/DESIGN.md di Mnemopolis).

Per un altro gioco: in Mnemopolis la posta si potrebbe provare solo in un posto facoltativo, per esempio una prova dietro un lucchetto, lasciando senza perdite il percorso principale. È una decisione di Andrea.
