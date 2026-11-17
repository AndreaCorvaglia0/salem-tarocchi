---
tipo: "fatto"
nome: "Il cappello in soffitta (un sacco dal mulino)"
flag: "cast trial.hat; cast hat.after; flag trial.hat.offered / trial.hat.perfect / trial.hat.pass / trial.hat.fail / hat.after / hat.miller"
capitolo: 4
quando: 420
scena: "trials.js#trial.hat.door, trials.js#trial.hat.after, trials/hat.js#hat"
fonte: proposto
chi_c_e:
  - "[[protagonista]]"
  - "[[mugnaio]]"
  - "[[ortica]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[mugnaio]]", come: "Ha dato lui il sacco, e ha conservato il cappello per ventotto anni (trials.js#trial.hat.door).", fonte: proposto }
  - { chi: "[[ortica]]", come: "Apre il sacco e riconosce il cappello (trials/hat.js#hat).", fonte: proposto }
conseguenze:
rami:
  - { scelta: "Chiede che cosa c'è nel sacco / Non fa domande / [È da te] Tasta la punta", flag: "—", esito: "Esplora più o meno; con il tratto marcato capisce prima di Ortica che cosa porta." }
  - { scelta: "Chiede a Ortica perché non se lo mette / Si siede accanto a lei in silenzio", flag: "—", esito: "Parola schietta o accorta, che è uno dei poli dell'affinità con Ortica." }
  - { scelta: "Affinità con Ortica almeno 2 / meno", flag: "hat.after", esito: "Ortica le posa il cappello in testa per un momento, oppure ricomincia a parlare d'altro." }
  - { scelta: "Perfetta", flag: "trial.hat.perfect", esito: "Il nastro del cappello di Ortica, che il mugnaio riconosce più tardi sulla sua scopa." }
aperto:
  - "Proposto, da confermare: il mugnaio decide di restituire il cappello perché all'alba l'ha vista volare sopra il salice."
  - "Proposto, da confermare: il mugnaio saliva in soffitta a spolverarlo; Prudenza non sa del sacco («dille che eri qui per la farina»)."
  - "Proposto, da confermare: il nastro del cappello è di velluto rosso scuro (non verde: il nastro verde è della scopa di Malva)."
  - "Proposto, da confermare: dopo, Ortica manda a dire al mugnaio che passerà lei con l'unguento e finirà le tre storie."
  - "Da decidere con Andrea: se la storia resta l'ultimo anello della catena delle prove secondarie (dopo la scommessa di Ginepra) o se deve arrivare anche a chi non le ha fatte."
---

Dopo il finale il mugnaio, che all'alba ha visto la ragazza passare in volo sopra il salice, le dà un sacco da farina per Ortica e non dice che cosa c'è dentro. Nella capanna Ortica lo prende per la punta e smette di parlare: dentro c'è il cappello nero a punta che perse sopra il mulino ventotto anni fa, asciugato e tenuto in soffitta. Ci passa sopra la mano due volte, come il mugnaio prima di consegnare il sacco, e non se lo mette: lo appende al chiodo dietro la porta. Nessuno dice perché non vola più. Lei tira per sé il Due e l'Otto di Coppe, e per la ragazza il Cavaliere di Coppe; la ragazza legge tre carte per decidere come aprire il sacco, che cosa fare del cappello e che cosa riportare al mulino.

## Note

Il retroscena resta nascosto, come chiedono [[mugnaio-retroscena]] e [[ortica-retroscena]] (`non_affiora`: il figlio, la sera del fidanzamento, il volo «per farsi vedere»). Affiora solo in due gesti (le due mani passate due volte sullo stesso sacco, il silenzio di Ortica) e in due battute: «Ventotto anni in una soffitta, e non ha preso nemmeno un tarlo» e, se Ortica si rivede in lei, «ti sta come stava a me». Le decisioni del 17 novembre ([[decisioni-2026-11-17]]) valgono per tutto: niente viene spiegato.
