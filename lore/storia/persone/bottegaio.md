---
tipo: "persona"
nome: "Il bottegaio"
id: "bottegaio"
ruolo:
  - { t: "Tiene la bottega con la porta nera, in fondo alla strada: erbe, barattoli, bottiglie, incenso.", fonte: copione, scena: "c1.js#c1.shop" }
vuole:
teme:
nasconde:
  - { t: "Mescola la segatura all'incenso per chi non controlla.", fonte: copione, scena: "c1.js#c1.shop" }
voce:
  - { tratto: "Non fa credito", esempio: "«non faccio credito nemmeno a lei.»", scena: "c1.js#c1.shop", fonte: copione }
  - { tratto: "Commerciante ironico", esempio: "«guardare non costa niente.»", scena: "c1.js#c1.shop", fonte: copione }
tic:
  - { t: "Pulisce un bicchiere mentre ti guarda arrivare.", fonte: copione, scena: "c1.js#c1.shop" }
incontro: "step c1.shop (c1.js#c1.shop)"
arco:
  - "[[incenso-alla-bottega]]"
  - "[[dicerie-delle-carte]]"
legami:
  - { con: "[[malva]]", prova: "«Malva purtroppo controlla sempre.»", fonte: copione, scena: "c1.js#c1.shop" }
  - { con: "[[merciaio]]", prova: "Dice che il merciaio tiene una carta sotto il banco senza capire che cosa ha.", fonte: copione, scena: "c1.js#c1.shop" }
  - { con: "[[tartufo]]", prova: "Il gatto entra quando gli pare e non ha mai rotto niente.", fonte: copione, scena: "opinions.js#tartufo, voce del bottegaio" }
sa:
luoghi:
  - "[[bottega]]"
carte:
aperto:
  - "Che cosa vende davvero «che non dovrebbe esistere» (post.js#enc.child)?"
  - "Ha una famiglia? (opinions.js: «nessuno che lo aspetti la sera» è proposto)"
---

Un uomo magro dietro il banco di una bottega stretta e piena fino al soffitto. Sa chi entra e chi no, non fa credito a nessuno, e quando può mescola la segatura all'incenso. È lui a dare la prima diceria su una carta nascosta.
