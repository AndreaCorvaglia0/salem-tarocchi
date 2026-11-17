---
tipo: "persona"
nome: "La protagonista"
id: "tu"
ruolo:
  - { t: "Una ragazza arrivata a Salem a piedi dalla strada del porto, di notte, con una borsa e il nome di una levatrice.", fonte: copione, scena: "c0.js#p.arrive" }
  - { t: "Diventa novizia di Malva, poi fattucchiera, poi strega; legge le carte a chi bussa alla sua capanna.", fonte: copione, scena: "c1.js#c1.read, c1b.js#c1.gate, c3.js#c3.trapdoor" }
vuole:
teme:
nasconde:
voce:
  - { tratto: "Le sue battute sono scelte della giocatrice: frasi intere in prima persona, mai un solo verbo.", scena: "docs/WRITING.md regola 11", fonte: deciso }
  - { tratto: "I pensieri sono in prima persona, pratici", esempio: "«Questa la tengo io.»", scena: "post.js#minor.first", fonte: copione }
tic:
incontro: "step p.session (sessions.js#s0)"
arco:
  - "[[prima-seduta]]"
  - "[[arrivo-a-salem]]"
  - "[[carta-nella-neve]]"
  - "[[incontro-con-tartufo]]"
  - "[[accolta-da-malva]]"
  - "[[prima-lettura-per-malva]]"
  - "[[arrivo-alla-capanna]]"
  - "[[lettura-vedova-bray]]"
  - "[[ginepra-soffia-il-carro]]"
  - "[[primo-esame]]"
  - "[[bicchiere-di-venere]]"
  - "[[bivio-della-piazza]]"
  - "[[malva-apre-il-cancello]]"
  - "[[arrivo-da-ortica]]"
  - "[[notte-al-bivacco]]"
  - "[[bivio-del-deposito]]"
  - "[[arresto-di-ginepra]]"
  - "[[discesa-dalla-botola]]"
  - "[[incontro-con-edera]]"
  - "[[consiglio-delle-maestre]]"
  - "[[salvataggio-dalle-cantine]]"
  - "[[ingresso-in-tribunale]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[volo-all-alba]]"
  - "[[epilogo-al-bivacco]]"
  - "[[seduta-finale]]"
  - "[[dopo-il-finale]]"
legami:
  - { con: "[[malva]]", prova: "Malva la prende in casa, le dà la capanna e le insegna la carta singola; lei le legge la prima carta.", fonte: copione, scena: "c1.js#c1.malva, c1.read, c1.back" }
  - { con: "[[tartufo]]", prova: "Il gatto la segue dalla prima sera; lei può dividere con lui il pane.", fonte: copione, scena: "c0.js#p.road, c1.js#c1.cottage" }
  - { con: "[[ginepra]]", prova: "Rivale per una carta, poi amica; Ginepra si fa arrestare al suo posto e lei la salva.", fonte: copione, scena: "c1b.js#c1.cart, c2.js#c2.arrest, end.js#f.dawn" }
  - { con: "[[ortica]]", prova: "Ortica le insegna le tre carte e le affida una commissione.", fonte: copione, scena: "c2.js#c2.ortica" }
  - { con: "[[edera]]", prova: "Edera la chiama Rosalba e le insegna la croce celtica.", fonte: copione, scena: "c3.js#c3.edera" }
  - { con: "[[lettrice]]", prova: "La Lettrice la interroga in cinque sedute e sei visite e alla fine le passa il mazzo.", fonte: copione, scena: "sessions.js#s0-s4" }
  - { con: "[[giudice]]", prova: "Il Giudice la processa insieme a Ginepra.", fonte: copione, scena: "end.js#c3.trial" }
  - { con: "[[comare-hale]]", prova: "In piazza sceglie se parlare per lei, raccogliere le sue candele o restare zitta.", fonte: copione, scena: "c1b.js#c1.square" }
  - { con: "[[conestabile-della-piazza]]", prova: "Gli risponde la prima notte: dice la verità, mente o nomina la Bray.", fonte: copione, scena: "c1b.js#c1.exam1" }
  - { con: "[[tabita]]", prova: "Le porta il fagotto; può lasciarle le sue tre monete.", fonte: copione, scena: "c1.js#c1.deliver" }
  - { con: "[[vedova-bray]]", prova: "Le legge la prima carta; più avanti la accompagna al cimitero.", fonte: copione, scena: "clients.js#c1.widow, trials/side.js#grave" }
  - { con: "[[il-vento]]", prova: "Trova il tè caldo con il suo nome: «lassù qualcuno mi aspetta per il tè».", fonte: copione, scena: "elsewhere/clouds.js" }
sa:
  - { fatto: "[[ortica-racconta-i-segreti]]", da: "[[ortica-racconta-i-segreti]]", come: "Ortica le dice che Malva canta quando è sola." }
  - { fatto: "[[prova-della-scommessa]]", da: "[[prova-della-scommessa]]", come: "Legge sotto il nome di Ginepra la riga sul pianto." }
  - { fatto: "[[edera-racconta-del-giudice]]", da: "[[edera-racconta-del-giudice]]", come: "Edera le racconta delle candele mangiate dal Giudice bambino." }
luoghi:
  - "[[strada-d-arrivo]]"
  - "[[capanna]]"
  - "[[casa-di-malva]]"
  - "[[villaggio]]"
  - "[[bosco]]"
  - "[[cantine]]"
carte:
  - { carta: "m00 Il Matto", perche: "La Lettrice gliela dà la prima sera: «capita a tutte all'inizio».", fonte: copione, scena: "sessions.js#s0" }
  - { carta: "m00 Il Matto", perche: "Tu: una strega giovane e bella, cappello a punta. Il Matto.", fonte: deciso, scena: "DESIGN.md, Le streghe e la storia" }
aperto:
  - "Perché è venuta a Salem, e da dove? Nei copioni arriva dal porto con il nome di una levatrice, nient'altro (c0.js#p.arrive)."
  - "Chi l'ha mandata da Malva? Malva dice che «doveva arrivare la settimana scorsa» (c1.js#c1.malva), ma nessuno dice chi l'aveva annunciata."
  - "Che cosa vuole e che cosa teme la protagonista? Lo decide la giocatrice con le risposte: va deciso se esiste un desiderio fisso della storia."
  - "Che cosa ha lasciato a casa? Il quaderno «che mi porto dietro da casa» (c1.js#c1.grimoire) è l'unica traccia."
---

La protagonista non ha un nome scritto: il gioco usa quello che la giocatrice dà alla Lettrice. Nei copioni arriva a Salem una notte d'inverno, a piedi, con una borsa in cui tiene pane e calze di ricambio, e un quaderno portato da casa che diventa il grimorio. Malva la prende in casa, i conestabili la fermano, Ginepra le ruba e le rende Il Carro, e alla fine salva l'amica e riceve il mazzo intero dalla Lettrice. Quasi tutto il resto (carattere, scelte, desideri) lo decide chi gioca.

## Note

Dettagli fisici visti nei copioni: ha un mantello (c0.js#p.road), la gonna (elsewhere/clouds.js, esito pass), le dita gelate la prima sera (c1.js#c1.grimoire). Il cappello a punta è solo in DESIGN.md. Edera la chiama «Rosalba» (c3.js#c3.edera). Il bottegaio dice che «si capisce subito che non sei di Salem» (c1.js#c1.shop).
