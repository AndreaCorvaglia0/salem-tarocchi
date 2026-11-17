---
tipo: "persona"
nome: "Il Giudice"
id: "giudice"
ruolo:
  - { t: "Presiede il tribunale di Salem; processa Ginepra e la protagonista.", fonte: copione, scena: "end.js#c3.trial" }
  - { t: "Di notte sta nello studio sopra le celle, con una candela sola.", fonte: copione, scena: "c3.js#c3.coven (coven.cells)" }
  - { t: "Cortese, paziente, convinto di fare il bene.", fonte: deciso, dove: "DESIGN.md, Le streghe e la storia" }
vuole:
  - { t: "Dice di cercare «soltanto la verità».", fonte: copione, scena: "end.js#c3.trial" }
teme:
nasconde:
voce:
  - { tratto: "Dà del lei e rassicura", esempio: "«Non abbia paura di me.»", scena: "end.js#c3.trial", fonte: copione }
  - { tratto: "Cortesia esagerata anche nel pericolo", esempio: "«Non correte, ve ne prego»", scena: "c3.js#c3.jail", fonte: copione }
  - { tratto: "Aneddoti domestici fuori luogo", esempio: "«Mia madre aveva una capretta che si chiamava quasi allo stesso modo»", scena: "end.js#c3.trial", fonte: copione }
  - { tratto: "Dice di sapere tutto", esempio: "«Io so quasi tutto quello che succede a Salem»", scena: "end.js#c3.trial", fonte: copione }
  - { tratto: "Minaccia in forma di consiglio", esempio: "«Mi permetto un consiglio da amico»", scena: "end.js#c3.trial", fonte: copione }
tic:
  - { t: "Riordina i fogli «con molta cura» prima di parlare.", fonte: copione, scena: "end.js#c3.trial" }
  - { t: "Da bambino sorrideva prima di soffiare su una candela, «come per scusarsi», e lo fa ancora con le persone.", fonte: copione, scena: "c3.js#c3.coven" }
incontro: "c3.jail (b3.stealth) oppure c3.court (b3.open)"
arco:
  - "[[salvataggio-dalle-cantine]]"
  - "[[ingresso-in-tribunale]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[epilogo-al-bivacco]]"
legami:
  - { con: "[[edera]]", prova: "Davanti a Edera gli tornano in mente «certe candele».", fonte: copione, scena: "end.js#c3.trial" }
  - { con: "[[malva]]", prova: "Ha imparato che ringraziare porta male «da una levatrice che conosce anche lei».", fonte: copione, scena: "end.js#c3.trial" }
  - { con: "[[cuoca-del-giudice]]", prova: "La saluta in aula: è venuta, ma non gli ha scaldato il caffè.", fonte: copione, scena: "end.js#c3.trial" }
  - { con: "[[gatto-del-giudice]]", prova: "Il gatto grigio col sonaglio è suo e dorme sotto il portico del tribunale.", fonte: copione, scena: "trials/side.js#well" }
  - { con: "[[protagonista]]", prova: "Dice di sapere chi era «dalla prima sera»; la assolve o la condanna.", fonte: copione, scena: "c3.js#c3.court, end.js#c3.trial" }
  - { con: "[[ginepra]]", prova: "La processa per il furto al deposito.", fonte: copione, scena: "c3.js#c3.court" }
  - { con: "[[conestabili]]", prova: "Legge i loro rapporti sugli Esami.", fonte: copione, scena: "end.js#c3.trial" }
  - { con: "[[sagrestano]]", prova: "Da bambino gli chiedeva scusa dopo aver mangiato le candele (lo racconta Edera).", fonte: copione, scena: "c3.js#edera.chat" }
sa:
  - { fatto: "[[bivio-della-piazza]]", da: "[[processo-davanti-al-giudice]]", come: "Sa se ha parlato per Hale o se è rimasta zitta, e se ha guardato tutti in faccia." }
  - { fatto: "[[bivio-del-deposito]]", da: "[[processo-davanti-al-giudice]]", come: "Sa che le ombre nel deposito erano due (b2.went)." }
  - { fatto: "[[notti-in-cella]]", da: "[[processo-davanti-al-giudice]]", come: "Sa quante notti ha passato in cella." }
  - { fatto: "[[fermate-dei-conestabili]]", da: "[[processo-davanti-al-giudice]]", come: "Ha letto i rapporti degli Esami." }
luoghi:
  - "[[tribunale]]"
  - "[[celle]]"
  - "[[studio-del-giudice]]"
carte:
  - { carta: "m04 L'Imperatore", perche: "La carta che incarna.", fonte: deciso, scena: "DESIGN.md, Le streghe e la storia" }
  - { carta: "m04 L'Imperatore", perche: "La carta è nascosta sul suo scranno.", fonte: copione, scena: "cards.base.js (spot court.chair)" }
  - { carta: "m20 Il Giudizio", perche: "È sul suo banco a fine processo.", fonte: copione, scena: "end.js#c3.trial" }
aperto:
  - "Che cosa vuole davvero il Giudice? Nei copioni parla solo di «verità»."
  - "Che cosa teme? Edera dice che «dorme poco» (c3.coven); non è detto perché."
  - "Come conosce «tutte» le carte (c3.trapdoor, c3.trial)?"
  - "Ha un nome?"
  - "Il Giudice sa che lo scrivano tiene un foglio a parte con quello che lui non dice? Il copione mostra solo il lato dello scrivano (clients.js#c3.clerk)."
  - "Se il processo va male, continua a cercarle (end.js#f.last): le troverà?"
---

Il Giudice è l'uomo più gentile di Salem e quello che fa più paura: dà del lei, chiede scusa prima di disturbare, raccomanda di non scivolare sui gradini bagnati mentre manda le persone sulla collina. Sa quasi tutto quello che succede in paese, conosce le carte una per una, e da bambino mangiava le candele della chiesa chiedendo scusa al sagrestano. Al processo interroga la protagonista sulle carte, come i suoi conestabili, e alla fine la assolve o la vede fuggire al buio.
