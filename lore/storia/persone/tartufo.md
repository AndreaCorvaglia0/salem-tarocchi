---
tipo: "persona"
nome: "Tartufo"
id: "tartufo"
ruolo:
  - { t: "Gatto nero che parla; decide di restare con la protagonista la prima sera.", fonte: copione, scena: "c0.js#p.road" }
  - { t: "Fiuta le carte nascoste e avverte dei conestabili rizzando il pelo.", fonte: copione, scena: "c1.js#c1.cottage" }
  - { t: "Dormiva da tre inverni nella capanna prima che arrivasse lei.", fonte: copione, scena: "c1.js#c1.cottage" }
vuole:
  - { t: "Stare con lei: «direi che da stanotte mi conviene stare con te».", fonte: copione, scena: "c0.js#p.road" }
  - { t: "Salvare il gatto del Giudice caduto nel pozzo, anche se gli è nemico.", fonte: copione, scena: "trials/side.js#well" }
teme:
  - { t: "Il Giudice: «Questo fa più paura di tutti i conestabili messi insieme».", fonte: copione, scena: "c3.js#c3.jail" }
nasconde:
  - { t: "Fa le fusa pianissimo «soltanto quando ha paura e non vuole che si sappia».", fonte: copione, scena: "end.js#c3.trial" }
  - { t: "È fiero di lei, e lo dice una volta sola.", fonte: copione, scena: "end.js#f.last" }
voce:
  - { tratto: "Pensa tra parentesi, e avverte senza imporsi", esempio: "«Io te l'ho detto; poi fai come credi.»", scena: "c2.js#c2.fire", fonte: copione }
  - { tratto: "Finge indifferenza davanti ai doni", esempio: "«Lo accetto soltanto per non offenderti.»", scena: "c1.js#c1.cottage", fonte: copione }
  - { tratto: "Ogni gentilezza è «per comodo suo»", esempio: "«ma soltanto perché fa comodo a me.»", scena: "props.js#prop.bed", fonte: copione }
  - { tratto: "Il pelo come allarme", esempio: "«Mi si è rizzato il pelo»", scena: "barks.js#tartufo.patrol", fonte: copione }
  - { tratto: "Si commuove e se ne pente subito", esempio: "«E adesso dimentichiamocelo tutti e due.»", scena: "end.js#f.last", fonte: copione }
tic:
  - { t: "Si lava una zampa quando non c'è niente da fare.", fonte: copione, scena: "barks.js#tartufo.idle" }
  - { t: "Chiede cibo con finta dignità.", fonte: copione, scena: "barks.js#tartufo.treat" }
incontro: "power cat (c0.js#p.road)"
arco:
  - "[[incontro-con-tartufo]]"
  - "[[arrivo-alla-capanna]]"
  - "[[ginepra-soffia-il-carro]]"
  - "[[primo-esame]]"
  - "[[prova-del-pozzo]]"
  - "[[consiglio-delle-maestre]]"
  - "[[salvataggio-dalle-cantine]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[epilogo-al-bivacco]]"
legami:
  - { con: "[[protagonista]]", prova: "La segue dalla prima sera e la consiglia; lei può nutrirlo, coccolarlo, portarlo sotto il mantello in aula.", fonte: copione, scena: "c0.js#p.road, c1.js#c1.cottage, c3.js#c3.coven" }
  - { con: "[[malva]]", prova: "Malva dice che «non è di nessuno»; lui dice che Malva gli lascia il lardo; con Malva non ha mai fatto le fusa.", fonte: copione, scena: "c1.js#c1.malva, c1b.js#malva.chat" }
  - { con: "[[ginepra]]", prova: "La giudica «simpatica» con sarcasmo la prima sera; poi aiuta a liberarla.", fonte: copione, scena: "c1b.js#c1.cart, c3.js#c3.jail" }
  - { con: "[[edera]]", prova: "Si siede sulle sue ginocchia; lei ricorda il suo nome.", fonte: copione, scena: "c3.js#edera.chat" }
  - { con: "[[gatto-del-giudice]]", prova: "Il grigio lo cacciava dai tetti e gli ha segnato un orecchio; Tartufo lo salva dal pozzo.", fonte: copione, scena: "trials/side.js#well" }
  - { con: "[[becchino]]", prova: "Il becchino ha paura dei gatti; Tartufo se ne diverte.", fonte: copione, scena: "post.js#enc.gravedigger" }
  - { con: "[[merlo-di-ortica]]", prova: "Il merlo lo trattiene mezz'ora per dirgli una cosa sola.", fonte: copione, scena: "lessons.js#minors.1.offer" }
  - { con: "[[bottegaio]]", prova: "«vende cose che non dovrebbero esistere a gente che giura di non comprarle».", fonte: copione, scena: "opinions.js#bottegaio, voce di Tartufo" }
sa:
  - { fatto: "[[carta-nella-neve]]", da: "[[carta-nella-neve]]", come: "Le sue impronte erano accanto a quelle di lei: la guardava da prima." }
  - { fatto: "[[primo-esame]]", da: "[[primo-esame]]", come: "Le parla tra parentesi durante l'Esame." }
  - { fatto: "[[prova-del-pozzo]]", da: "[[prova-del-pozzo]]", come: "È lui a chiedere aiuto." }
luoghi:
  - "[[capanna]]"
  - "[[strada-d-arrivo]]"
  - "[[pozzo-della-piazza]]"
carte:
  - { carta: "m18 La Luna", perche: "La carta che incarna.", fonte: deciso, scena: "DESIGN.md, Le streghe e la storia" }
  - { carta: "m08 La Forza", perche: "La tira fuori dalla borsa con la zampa prima del pozzo.", fonte: copione, scena: "trials/side.js#well" }
aperto:
  - "Chi sente parlare Tartufo? Lei sì; Ginepra dice di sentirlo «soltanto quando mi prende in giro» (opinions.js); le sue frasi sono quasi sempre tra parentesi (vedi Contraddizioni)."
  - "Da dove viene Tartufo, e perché ha scelto proprio lei?"
  - "Sa leggere? Dice di no (c1.js#c1.grimoire) ma conosce la scritta sulla porta di Malva (c0.js#p.road)."
  - "Sa della Lettrice? Nei copioni non la nomina mai."
---

Tartufo è un gatto nero che la sera dell'arrivo si siede in mezzo alla strada e decide di restare. Sarcastico, finge di fare tutto per comodo suo, ma fiuta le carte nascoste, avverte dei conestabili con il pelo dritto e la consiglia a voce bassa, quasi sempre tra parentesi. Viveva da tre inverni nella capanna che diventa la casa di lei. Ha paura del Giudice più che di ogni lanterna, e una notte scende in un pozzo per salvare il gatto che lo cacciava dai tetti.
