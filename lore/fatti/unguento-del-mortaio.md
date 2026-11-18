---
tipo: "fatto"
nome: "L'unguento del mortaio (le erbe di Ortica, 2)"
flag: "flag int.ortica.2.made, int.ortica.2, int.ortica.miller"
capitolo: 2
quando: 256
scena: "interests.ortica.js#int.ortica.2, interests.ortica.js#int.ortica.miller"
fonte: proposto
chi_c_e:
  - "[[protagonista]]"
  - "[[ortica]]"
  - "[[mugnaio]]"
chi_lo_sa:
  - { chi: "[[mugnaio]]", come: "Riceve l'unguento nel cestino calato dalla finestra, e il giorno dopo lo racconta in piazza (interests.ortica.js#int.ortica.miller).", fonte: proposto }
  - { chi: "[[ortica]]", come: "Ha i vasetti e il mortaio, e manda lei al mulino (interests.ortica.js#int.ortica.2).", fonte: proposto }
conseguenze:
  - "[[la-salvia-di-malva]]"
rami:
  - { scelta: "Due vasetti su quattro (calendula, melissa, ruta, verbena)", flag: "int.ortica.2.made (calendula e melissa)", esito: "Con un'erba che non guarisce Ortica dice a che cosa serve, e lei riprova." }
  - { scelta: "In piazza: chiede della ruota / dice che l'unguento è di Ortica", flag: "int.ortica.miller", esito: "Esplora o gentilezza; il mugnaio dice che adesso è lui a dovere una storia a Ortica." }
aperto:
  - "Proposto, da confermare: il mugnaio sta in cima alle scale per tre giorni, con le ginocchia gonfie, e cala un cestino dalla finestra."
  - "Proposto, da confermare: il giorno dopo l'unguento il mugnaio scende in piazza col bastone nuovo e racconta a tutti della ruota."
  - "Proposto, da confermare: Ortica gli deve la fine della storia «della volpe e del parroco»."
---

La seconda missione: per le ginocchia del mugnaio ci vuole un'erba che guarisce e consola, non una che protegge. Lei sceglie due vasetti su quattro nel mortaio di Ortica e pesta tre giri; la giusta coppia si ricava dal cerchio (src/data/sapere.js, «guarigione e conforto»). Dopo questa missione arriva il primo gradino: una risposta in più a chi bussa per una malattia.
