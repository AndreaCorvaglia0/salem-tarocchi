---
tipo: "persona"
nome: "Nonna Edera"
id: "edera"
ruolo:
  - { t: "La più anziana delle tre maestre; vive in una nicchia in fondo alle cantine sotto il villaggio.", fonte: copione, scena: "c3.js#c3.edera" }
  - { t: "Insegna la croce celtica, i pianeti e i segni, le figure e le carte capovolte.", fonte: copione, scena: "c3.js#c3.edera, lessons.js#minors.5.lesson, reversed.lesson" }
  - { t: "I libri della biblioteca sono suoi: li ha lasciati di sopra quando è andata a vivere sotto.", fonte: copione, scena: "trials/intro.js#library.first" }
vuole:
  - { t: "Rivedere la Stella: «Sono vent'anni che non vedo la Stella da vicino».", fonte: copione, scena: "c3.js#c3.edera" }
  - { t: "Sapere se la stanza di sua nonna esiste ancora, o se l'ha sognata.", fonte: copione, scena: "trials/side.js#room" }
  - { t: "Che quando dimentica un nome glielo si ripeta piano, senza farglielo pesare.", fonte: copione, scena: "c3.js#c3.edera" }
  - { t: "Sapere che le porte di sotto sono come le ricorda.", fonte: copione, scena: "trials/main.js#cellars" }
teme:
nasconde:
  - { t: "Il sagrestano le porta di nascosto l'incenso della chiesa da quando gli ha letto le carte per il figlio.", fonte: copione, scena: "c3.js#edera.chat" }
voce:
  - { tratto: "Chiama tutte «cara»", esempio: "«Vieni avanti, cara.»", scena: "c3.js#c3.edera", fonte: copione }
  - { tratto: "Sbaglia i nomi con sicurezza", esempio: "«Rosalba, mi pare.»", scena: "c3.js#c3.edera", fonte: copione }
  - { tratto: "Ricorda le carte, non le persone", esempio: "«Io ricordo ogni carta che ho girato in settant'anni.»", scena: "c3.js#c3.edera", fonte: copione }
  - { tratto: "Chiede con garbo", esempio: "«Posso chiederti un piacere, cara?»", scena: "c3.js#c3.edera", fonte: copione }
  - { tratto: "Racconta il Giudice bambino", esempio: "«Era un bambino educato, che chiedeva sempre permesso»", scena: "c3.js#c3.coven", fonte: copione }
tic:
  - { t: "Non trova gli occhiali, che ha sulla testa.", fonte: copione, scena: "c3.js#c3.edera" }
  - { t: "Gira una carta «con la mano lenta» prima che il consiglio si muova (La Giustizia).", fonte: copione, scena: "c3.js#c3.coven" }
  - { t: "Quando vuole qualcuno lascia il suo bastone al posto suo.", fonte: copione, scena: "trials.js#trial.cellars.door" }
incontro: "step c3.edera (c3.js#c3.edera)"
arco:
  - "[[incontro-con-edera]]"
  - "[[edera-riceve-la-stella]]"
  - "[[edera-racconta-del-giudice]]"
  - "[[lezione-delle-figure]]"
  - "[[lezione-delle-capovolte]]"
  - "[[prova-delle-porte-di-sotto]]"
  - "[[prova-della-stanza-murata]]"
  - "[[consiglio-delle-maestre]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[epilogo-al-bivacco]]"
legami:
  - { con: "[[protagonista]]", prova: "La chiama Rosalba, le insegna la croce, le affida le porte di sotto e la stanza della nonna.", fonte: copione, scena: "c3.js#c3.edera, trials/side.js#room" }
  - { con: "[[giudice]]", prova: "Lo conosce «da quando era alto così»: da bambino mangiava le candele della chiesa e chiedeva scusa.", fonte: copione, scena: "c3.js#c3.coven, edera.chat" }
  - { con: "[[malva]]", prova: "Malva le ha parlato della ragazza; Edera la descrive come «una levatrice che non ringrazia mai, il cui nome adesso mi sfugge».", fonte: copione, scena: "c3.js#c3.edera, lessons.js#minors.5.lesson" }
  - { con: "[[ortica]]", prova: "Siede con lei al consiglio.", fonte: copione, scena: "c3.js#c3.coven" }
  - { con: "[[ginepra]]", prova: "Per il Cavaliere di Bastoni dice di pensare «a una ragazza coi ricci rossi».", fonte: copione, scena: "lessons.js#minors.5.lesson" }
  - { con: "[[tartufo]]", prova: "Il nome di Tartufo se lo ricorda: «I nomi delle bestie mi restano».", fonte: copione, scena: "c3.js#edera.chat" }
  - { con: "[[sagrestano]]", prova: "Le porta l'incenso di nascosto.", fonte: copione, scena: "c3.js#edera.chat" }
  - { con: "[[rosalba]]", prova: "Usa questo nome per la protagonista, e se ne affeziona.", fonte: copione, scena: "c3.js#c3.edera" }
  - { con: "[[nonna-di-edera]]", prova: "A sei anni girò la prima carta sul tavolo della nonna; la stanza della nonna fu murata.", fonte: copione, scena: "c3.js#c3.edera, trials/side.js#room" }
sa:
  - { fatto: "[[nebbia-del-bosco-fitto]]", da: "[[incontro-con-edera]]", come: "«Mi dicono che nel bosco la nebbia ti ha già riportata indietro.»" }
  - { fatto: "[[discesa-dalla-botola]]", da: "[[incontro-con-edera]]", come: "Vede arrivare la fiammella, se la ragazza scende facendosi luce." }
luoghi:
  - "[[nicchia-di-edera]]"
  - "[[cantine]]"
  - "[[pozzo-vecchio]]"
  - "[[stanza-della-nonna-di-edera]]"
  - "[[biblioteca]]"
carte:
  - { carta: "m02 La Sacerdotessa", perche: "La carta che incarna.", fonte: deciso, scena: "DESIGN.md, Le streghe e la storia" }
  - { carta: "m19 Il Sole", perche: "La prima carta che girò, a sei anni.", fonte: copione, scena: "c3.js#c3.edera" }
  - { carta: "m11 La Giustizia", perche: "La gira al consiglio.", fonte: copione, scena: "c3.js#c3.coven" }
  - { carta: "m17 La Stella", perche: "Vuole rivederla; la gira prima delle porte di sotto.", fonte: copione, scena: "c3.js#c3.edera, trials/main.js#cellars" }
aperto:
  - "Che cosa teme Edera? Nei copioni le pesa dimenticare (c3.edera, prova della stanza) ma non lo chiama mai paura."
  - "Perché Edera vive sotto il villaggio? La biblioteca dice solo «il giorno in cui è andata a stare di sotto» (trials/intro.js)."
  - "Chi è Rosalba? Edera usa quel nome per la protagonista e non si dice se fosse una persona vera."
  - "Chi è l'altra delle tre che le fa notare ad alta voce quando dimentica (c3.js#c3.edera)?"
  - "Quanti anni ha? «Settant'anni» di carte, la prima a sei anni: almeno settantasei."
  - "Ha avuto un marito? Dice solo che nelle figure cercava un marito (lessons.js#minors.5.lesson)."
  - "Proposto, da confermare: aveva un lapislazzuli di sua nonna, perso nelle cantine e ritrovato dalla ragazza; ora lo porta al collo sotto lo scialle (interests.edera.js#int.edera.1, [[la-pietra-della-nonna]])."
  - "Proposto, da confermare: delle sue pietre, sullo scaffale della biblioteca, ricorda il colore e non il nome (interests.edera.js#int.edera.2, [[i-cartellini]])."
  - "Deciso il 18 novembre (decisioni-2026-11-18, interessi 2): alla fine del ramo delle pietre la chiama una volta col suo nome vero invece che Rosalba; la scena (missione 6) non è ancora scritta."
---

Nonna Edera è la più anziana delle maestre: capelli d'argento raccolti in alto, dritta come una regina, una candela sola nella nicchia in fondo alle cantine. Sbaglia i nomi di tutti (chiama la protagonista Rosalba) ma ricorda ogni carta girata in settant'anni. Conosce il Giudice da quando era un bambino che mangiava le candele della chiesa, e questo ricordo, al processo, diventa un'arma gentile.
