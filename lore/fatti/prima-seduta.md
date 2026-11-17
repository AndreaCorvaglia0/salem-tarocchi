---
tipo: "fatto"
nome: "La prima seduta con la Lettrice"
flag: "step p.session; flag s0.knock / s0.window, s0.wait / s0.leave / s0.enter / s0.back, s0.believes / s0.doubts"
capitolo: 0
quando: 10
scena: "sessions.js#s0"
chi_c_e:
  - "[[protagonista]]"
  - "[[lettrice]]"
chi_lo_sa:
  - { chi: "[[lettrice]]", come: "Ripete le risposte della prima sera in quasi tutte le sedute (s1-s4).", fonte: copione }
  - { chi: "[[protagonista]]", come: "C'è; se ne ricorda aprendo la porta al primo cliente (c1.js#c1.grimoire).", fonte: copione }
conseguenze:
  - "[[arrivo-a-salem]]"
  - "[[apertura-del-grimorio]]"
  - "[[seduta-finale]]"
rami:
  - { scelta: "Busso alla porta / Cerco una finestra", flag: "s0.knock / s0.window", esito: "La Lettrice lo confronta con piazza, processo e finale." }
  - { scelta: "Aspetto / Me ne vado (dopo aver bussato)", flag: "s0.wait / s0.leave", esito: "Ripreso nelle visite (visits.js#THREAD door2)." }
  - { scelta: "Entro lo stesso / Torno indietro (dalla finestra)", flag: "s0.enter / s0.back", esito: "Ripreso nelle visite." }
  - { scelta: "Ci credo un po' / Preferisco vedere", flag: "s0.believes / s0.doubts", esito: "Ripreso nella seduta finale." }
aperto:
---

Prima di tutto la protagonista si siede al tavolo della Lettrice: dice il suo nome e la data di nascita, riceve Il Matto, e risponde alla domanda della porta chiusa. La Lettrice si fa una prima idea della sua carta e la manda sulla strada del villaggio, dove nevica.
