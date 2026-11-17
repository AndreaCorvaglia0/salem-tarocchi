---
tipo: "persona"
nome: "La Lettrice"
id: "lettrice"
ruolo:
  - { t: "Una donna che legge le carte a un tavolo con una candela; interroga la protagonista in cinque sedute e sei visite.", fonte: copione, scena: "sessions.js#s0-s4, visits.js" }
  - { t: "Le dà la prima carta (Il Matto) e l'ultima (Il Mondo), e alla fine le passa il mazzo.", fonte: copione, scena: "sessions.js#s0, s4" }
  - { t: "Voce fuori dal gioco, senza volto né nome.", fonte: deciso, dove: "DESIGN.md, La Lettrice" }
vuole:
  - { t: "Capire chi è la protagonista: «io credo che in te ci sia dell'altro, e mi piacerebbe capire che cosa».", fonte: copione, scena: "sessions.js#s0" }
teme:
nasconde:
  - { t: "Chi è: alla domanda «Chi sei, tu?» risponde «Guarda bene il tavolo, e lo capirai da sola».", fonte: copione, scena: "sessions.js#s4" }
  - { t: "Tiene da parte l'ultima carta: «Quello che manca lo tengo io ancora per un po'».", fonte: copione, scena: "sessions.js#s3" }
voce:
  - { tratto: "Accoglie con calma", esempio: "«Vieni avanti e siediti, non c'è fretta.»", scena: "sessions.js#s0", fonte: copione }
  - { tratto: "Chiude con un giudizio provvisorio", esempio: "«Vedremo se andando avanti mi farai cambiare idea.»", scena: "sessions.js#s0", fonte: copione }
  - { tratto: "Prende nota di quello che sente", esempio: "«Me lo segno, perché mi piace.»", scena: "sessions.js#s0", fonte: copione }
  - { tratto: "Non approva tutto", esempio: "«Ne riparleremo, perché non sempre è una virtù.»", scena: "sessions.js#s0", fonte: copione }
  - { tratto: "Sa le notizie di Salem senza esserci", esempio: "«Ho saputo che una notte l'hai passata in cella.»", scena: "sessions.js#s1", fonte: copione }
tic:
  - { t: "Chiede «dimmi un numero da uno a ventidue» e legge la carta che esce.", fonte: copione, scena: "sessions.js#s1-s3" }
  - { t: "Tiene un quaderno dove scrive le parole della ragazza.", fonte: copione, scena: "sessions.js#s4, visits.js#THREAD notebook" }
  - { t: "Usa il segno, la luna di nascita, il giorno della settimana.", fonte: copione, scena: "sessions.js#s1, s2, visits.js#RITUALS" }
incontro: "step p.session (sessions.js#s0)"
arco:
  - "[[prima-seduta]]"
  - "[[prima-visita-della-lettrice]]"
  - "[[seconda-visita-della-lettrice]]"
  - "[[seduta-dei-valori]]"
  - "[[terza-visita-della-lettrice]]"
  - "[[quarta-visita-della-lettrice]]"
  - "[[seduta-delle-paure]]"
  - "[[quinta-visita-della-lettrice]]"
  - "[[sesta-visita-della-lettrice]]"
  - "[[seduta-dei-sogni]]"
  - "[[seduta-finale]]"
legami:
  - { con: "[[protagonista]]", prova: "La osserva per tutto il gioco, le dice «la tua carta», e alla fine le lascia il posto al tavolo.", fonte: copione, scena: "sessions.js#s0-s4" }
sa:
  - { fatto: "[[notti-in-cella]]", da: "[[seduta-dei-valori]]", come: "«Ho saputo che una notte l'hai passata in cella.»" }
  - { fatto: "[[bivio-della-piazza]]", da: "[[seduta-dei-valori]]", come: "Sa che cosa ha fatto in piazza; però dice «in piazza non c'ero» (opinions.js#READER square)." }
  - { fatto: "[[arresto-di-ginepra]]", da: "[[seduta-delle-paure]]", come: "«So che hanno portato via Ginepra, e so che eri lì.»" }
  - { fatto: "[[processo-davanti-al-giudice]]", da: "[[seduta-dei-sogni]]", come: "«So come hai risposto al Giudice.»" }
  - { fatto: "[[ingresso-in-tribunale]]", da: "[[seduta-dei-sogni]]", come: "Sa che in aula ha detto la sua carta (court.card)." }
luoghi:
  - "[[tavolo-della-lettrice]]"
carte:
  - { carta: "m00 Il Matto", perche: "La prima che le dà.", fonte: copione, scena: "sessions.js#s0" }
  - { carta: "m21 Il Mondo", perche: "L'ultima, tenuta da parte fino al finale.", fonte: copione, scena: "sessions.js#s4" }
aperto:
  - "Chi è la Lettrice? Il finale (sessions.js#s4) lascia intendere che la protagonista prenda il suo posto, ma non lo dice."
  - "Come sa quello che succede a Salem («Ho saputo», «mi dicono»), se in piazza «non c'era»? Chi glielo racconta?"
  - "Dov'è il suo tavolo? La protagonista ci arriva chiudendo gli occhi (c1b.js#c1.venus) e nel finale lo trova nel bosco (end.js#f.last)."
  - "Ha altri clienti? Dice «che cosa trova al tuo tavolo che non trova al mio» (visits.js#OPENERS pop)."
  - "Qualcuno a Salem la conosce? Nei copioni nessuno la nomina; la scelta di notes/opinions.md non è canone."
---

La Lettrice è una donna velata e immobile davanti a una candela, l'unica che la protagonista vede quando chiude gli occhi. Parla con calma, dà del tu, fa due o tre domande per seduta e non approva tutto: prende nota, confronta le risposte con quello che è successo, e chiude ogni volta con un giudizio provvisorio sulla «tua carta». Sa le notizie di Salem senza esserci stata. Alla fine non fa più domande: le passa il mazzo, le dà Il Mondo e sparisce, e la protagonista si ritrova a guardare il tavolo dall'altra parte.

## Note

L'aspetto «velata, ferma» viene dal commento dei quadri del teatro d'ombre (src/story/stage/tableaux.js), non da una battuta.
