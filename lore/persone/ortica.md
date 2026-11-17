---
tipo: "persona"
nome: "Ortica"
id: "ortica"
ruolo:
  - { t: "Strega che vive in una capanna nel bosco, «mezza casa e mezza cespuglio».", fonte: copione, scena: "c2.js#c2.ortica" }
  - { t: "Maestra di Ginepra; insegna la stesa passato-presente-futuro.", fonte: copione, scena: "c1b.js#c1.cart, c2.js#c2.ortica" }
  - { t: "Fa unguenti (per il mugnaio) e taglia la barba di bosco nel bosco fitto da trent'anni.", fonte: copione, scena: "c2.js#c2.ortica, trials/main.js#fog" }
  - { t: "Tiene un orto di erbe e dà lezioni di giardinaggio.", fonte: copione, scena: "garden.js#garden.ortica, garden-lessons.js" }
vuole:
  - { t: "Essere ascoltata: «a me non mi ascolta nessuno, da trent'anni».", fonte: copione, scena: "c2.js#c2.ortica" }
  - { t: "Riavere il paiolo di sua madre dal calderaio.", fonte: copione, scena: "trials/side.js#kettle" }
teme:
  - { t: "Il silenzio: l'unica volta che si è fermata «mi sono spaventata da sola».", fonte: copione, scena: "c2.js#c2.ortica" }
  - { t: "Nella nebbia del bosco fitto ammette di avere paura «da quando è sceso il buio».", fonte: copione, scena: "trials/main.js#fog" }
nasconde:
  - { t: "Perché tiene al paiolo: sua madre ci fece la zuppa il giorno in cui lei nacque, e lei ci fece l'ultima per la madre. Lo dice solo a chi si fida.", fonte: copione, scena: "trials.js#trial.kettle.door" }
  - { t: "Un sacchetto di monete nascosto anni fa in un faggio e dimenticato.", fonte: copione, scena: "trials/main.js#fog, good.beech" }
voce:
  - { tratto: "Cita il merlo come fonte delle notizie", esempio: "«il merlo di solito è bene informato.»", scena: "c2.js#c2.ortica", fonte: copione }
  - { tratto: "Parla di quanto parla", esempio: "«Sempre, anche quando dormo!»", scena: "c2.js#c2.ortica", fonte: copione }
  - { tratto: "Si corregge a metà frase", esempio: "«Va bene, non passo, ho la schiena a pezzi»", scena: "garden.js#garden.ortica", fonte: copione }
  - { tratto: "Promette storie lunghe", esempio: "«Allora un giorno ti racconto del mugnaio»", scena: "c2.js#c2.ortica", fonte: copione }
  - { tratto: "Esclama e accoglie di slancio", esempio: "«Eccoti, sei la ragazza di Malva!»", scena: "c2.js#c2.ortica", fonte: copione }
tic:
  - { t: "Ripete la sua battuta: «sì, pungo, ma curo anche, come la pianta».", fonte: copione, scena: "c2.js#c2.ortica" }
  - { t: "Gira una carta prima di dare o di scegliere la strada (L'Imperatrice, Otto di Bastoni).", fonte: copione, scena: "c2.js#c2.ortica, lessons.js#minors.4.lesson" }
  - { t: "Racconta a tutto il bosco quello che sa.", fonte: copione, scena: "c2.js#c2.ortica, end.js#f.last" }
incontro: "step c2.ortica (c2.js#c2.ortica)"
arco:
  - "[[arrivo-da-ortica]]"
  - "[[ortica-racconta-i-segreti]]"
  - "[[ortica-premia-l-onesta]]"
  - "[[dono-dell-orto]]"
  - "[[lezioni-dell-orto]]"
  - "[[lezione-dei-semi]]"
  - "[[lezione-dal-sette-al-dieci]]"
  - "[[prova-della-nebbia]]"
  - "[[prova-del-paiolo]]"
  - "[[ortica-ascolta-una-storia]]"
  - "[[consiglio-delle-maestre]]"
  - "[[salvataggio-dalle-cantine]]"
  - "[[ingresso-in-tribunale]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[volo-all-alba]]"
  - "[[epilogo-al-bivacco]]"
legami:
  - { con: "[[protagonista]]", prova: "La accoglie, le insegna, le chiede pareri; se la ragazza le dà un compito al consiglio, è la prima volta in trent'anni che qualcuno le chiede di parlare.", fonte: copione, scena: "c2.js#c2.ortica, c3.js#c3.coven" }
  - { con: "[[ginepra]]", prova: "È la sua novizia; le ha passato le regole della Luna e del fuoco.", fonte: copione, scena: "c1b.js#c1.cart, c1.venus" }
  - { con: "[[malva]]", prova: "Malva in trent'anni le ha detto «soltanto che parlo»; sa che Malva canta di nascosto.", fonte: copione, scena: "c2.js#c2.ortica, ortica.chat" }
  - { con: "[[edera]]", prova: "Siede con lei al consiglio delle maestre.", fonte: copione, scena: "c3.js#c3.coven" }
  - { con: "[[mugnaio]]", prova: "Gli porta l'unguento per le ginocchia e gli deve «tre storie lasciate a metà».", fonte: copione, scena: "c2.js#c2.ortica, c2.mill" }
  - { con: "[[merlo-di-ortica]]", prova: "Il merlo le porta tutte le notizie.", fonte: copione, scena: "c2.js#c2.ortica" }
  - { con: "[[comare-hale]]", prova: "Ha sempre detto che la Hale con gli spilli non c'entra.", fonte: copione, scena: "c2.js#c2.ortica" }
  - { con: "[[calderaio]]", prova: "Il calderaio ha il paiolo di sua madre e le dice «domani» da tre settimane.", fonte: copione, scena: "trials/side.js#kettle" }
  - { con: "[[madre-di-ortica]]", prova: "Il paiolo era di sua madre.", fonte: copione, scena: "trials/side.js#kettle" }
  - { con: "[[nonna-di-ortica]]", prova: "Le regole per la nebbia e per i calderai vengono da sua nonna.", fonte: copione, scena: "trials/main.js#fog, trials.js#trial.kettle.door" }
sa:
  - { fatto: "[[accolta-da-malva]]", da: "[[arrivo-da-ortica]]", come: "Malva le ha raccontato della legna spaccata storta o delle mani delicate." }
  - { fatto: "[[bivio-della-piazza]]", da: "[[arrivo-da-ortica]]", come: "«lo sa tutto il bosco»; l'ha detto lei." }
  - { fatto: "[[malva-apre-il-cancello]]", da: "[[arrivo-da-ortica]]", come: "Il merlo le ha detto della scopa al cancello (gate.flew)." }
  - { fatto: "[[notte-al-bivacco]]", da: "[[ortica-racconta-i-segreti]]", come: "Ginepra le ha detto della promessa al fuoco (fire.promised)." }
  - { fatto: "[[arresto-di-ginepra]]", da: "[[ortica-racconta-i-segreti]]", come: "«L'hanno presa, lo so, lo sa tutto il bosco.»" }
  - { fatto: "[[unguento-al-mulino]]", da: "[[ortica-premia-l-onesta]]", come: "Riceve le quattro monete del mugnaio, se la ragazza gliele porta." }
luoghi:
  - "[[capanna-di-ortica]]"
  - "[[bosco]]"
  - "[[mulino]]"
  - "[[stagno]]"
  - "[[bosco-fitto]]"
  - "[[orto-della-capanna]]"
  - "[[capanna]]"
carte:
  - { carta: "m01 Il Mago", perche: "La carta che incarna.", fonte: deciso, scena: "DESIGN.md, Le streghe e la storia" }
  - { carta: "m01 Il Mago", perche: "«Il Mago, dritto, che poi sarebbe la mia carta!»", fonte: copione, scena: "trials/side.js#kettle" }
  - { carta: "m03 L'Imperatrice", perche: "La gira prima di regalare le carte.", fonte: copione, scena: "c2.js#c2.ortica" }
  - { carta: "m18 La Luna", perche: "Esce prima della nebbia, e va lo stesso.", fonte: copione, scena: "trials/main.js#fog" }
aperto:
  - "Perché Ortica ha lasciato la capanna al limite del bosco per vivere nel bosco? Malva lo accenna (c1.js#c1.back), nessuno lo spiega."
  - "Che cosa vuole Ortica oltre a essere ascoltata?"
  - "Quanti anni ha? Dice «trent'anni» di bosco e «me a vent'anni» (c2.js#ortica.chat)."
  - "Perché non usa più la scopa? Solo «da quando ho perso il cappello sopra il mulino» (c2.js#ortica.chat)."
  - "Com'è il suo rapporto con Edera fuori dal consiglio? Nei copioni non si vedono mai da sole."
---

Ortica vive nel bosco in una capanna coperta di erbe appese, e non smette mai di parlare: divaga, si corregge, cita il merlo, promette storie che non finisce. Dietro la chiacchiera c'è una strega precisa, che insegna a leggere il tempo in tre carte, cura le ginocchia del mugnaio, conosce ogni sasso del bosco e ogni pianta dell'orto. Le pesa che nessuno la ascolti da trent'anni, e quando la protagonista le chiede di parlare per una buona causa lo vive come un onore.
