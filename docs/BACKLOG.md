# Backlog

Che cosa viene dopo, in ordine. Ogni voce: che cos'è, perché (quale obiettivo o lezione serve), la versione
più piccola che vale la pena fare, la ragione nel mondo di Salem, da che cosa dipende, quanto costa
(piccolo / medio / grande), come si verifica. Le idee non ancora scelte stanno in fondo.
Aggiornato il 17 novembre 2026 sera. I perché generali sono in `docs/LEZIONI.md`.

## In corso

- **Edifici con una personalità e la capanna che cresce** (`notes/orientarsi.md`, `notes/buildings.md`).
- **Le cose in più sulla mappa** al posto della lista (`notes/missions-design.md`): pronta, in attesa di
  pubblicazione insieme agli edifici.

## 1. Mantenere le promesse che il gioco fa già (prima di aggiungere altro)

**1.1 Il carattere non pende più.** *Medio, scrittura.*
Le risposte scritte pendono (gentile 57 / pungente 26; curiosa 48 / dritta 19) e il seme finale esce Coppe
due volte su tre. Riscrivere le scelte dove un polo è la versione antipatica dell'altro: ogni opzione deve
essere bella da scegliere. Si verifica con `npm run coverage` (i quattro semi tra il 15% e il 35% a caso).

**1.2 L'affinità con le streghe conta.** *Medio, scrittura.*
Oggi la legge solo la storia del mulino. Per ogni strega due o tre battute o gesti che cambiano con
l'affinità, presi dai retroscena. Si verifica con `lore/tratti/` (ogni affinità letta in almeno tre scene).

**1.3 Le nove domande della Lettrice che non escono mai.** *Piccolo.* Capire perché (forse le visite nel
capitolo 3) e sistemare.

**1.4 Fiducia e legame: un numero solo. «Ricordamela» non mostra più la risposta.** *Piccolo.*

## 2. Imparare meglio, con poco (da `notes/lore-design.md`)

**2.1 Le sue tre parole tornano nel ripasso.** *Piccolo.* «Le tue parole erano: … Che carta è?». Copre
«dire l'idea con parole sue». I dati sono già nel salvataggio.

**2.2 La carta di oggi entra nel ripasso.** *Piccolo.* La risposta a memoria aggiorna la carta; una volta su
tre la carta di oggi è una scaduta.

**2.3 «Prova tu prima» nella lettura per sé.** *Piccolo.* Sceglie l'idea di ogni carta prima di vedere il
testo. È il passo verso il mazzo vero.

**2.4 La Lettrice chiede prima di raccontare.** *Piccolo.* «Ti ricordi che cosa ti avevo detto del Carro?»

## 3. Modi nuovi di giocare (scelti il 17 novembre)

**3.1 Raccontare con tre carte.** *Medio.*
- *Che cos'è:* il bambino della porta nera vuole una storia. Lei pesca tre carte, sceglie l'ordine e, per
  ogni passaggio, uno fra tre modi di legarle. Ne esce una storia breve, sua.
- *Perché:* è l'obiettivo che nessuna meccanica verifica: unire più carte in un discorso.
- *Più piccola:* tre carte, solo Maggiori che conosce, un ascoltatore; la storia finisce nel diario.
- *Nel mondo:* un bambino che non dorme; poi altri ascoltatori (Tartufo, la vedova) con gusti diversi.
- *Dipende da:* i «ponti» tra idee, da scrivere; il motore delle letture ha già i pezzi.
- *Verifica:* test sui dati; lettori ingenui: «la storia ha un senso?».

**3.2 Il volo a corsie.** *Medio.* (idea di Andrea)
- *Che cos'è:* vola e le carte le vengono incontro; sale o scende per prendere la corrente giusta.
  Trenta secondi, facoltativo.
- *Perché:* fissa in fretta seme ed elemento, e dritta/capovolta; è l'unico momento veloce in un gioco calmo.
- *Più piccola:* quattro correnti (aria in alto, fuoco, acqua, terra rasoterra), dieci carte per volo, solo
  toccare in alto o in basso; nessun punteggio che pesi sul resto, solo un record suo.
- *Nel mondo:* la lezione di volo c'è già; Malva volava, Ortica no (e la storia del cappello dice perché).
  Una gara con Ginepra.
- *Dipende da:* una scena nuova nel mondo (costo vero: animazione).
- *Attenzione:* l'abbinamento semi-elementi è **una convenzione**, non un fatto (vedi sotto). Nel gioco lo
  dice un personaggio («io l'ho imparata così»), e almeno un altro la pensa diversamente.
- *Verifica:* si prova a mano; chi non ha riflessi non resta indietro (non sblocca niente).

**3.3 I tarocchi come gioco, all'osteria.** *Grande.*
- *Che cos'è:* una partita a prese con il bottegaio o il mugnaio, a regole semplificate: si risponde al seme;
  chi non può, gioca un trionfo; il trionfo più alto vince; il Matto si gioca quando si vuole e non prende.
- *Perché:* fa vedere le stesse carte in un modo del tutto diverso, ed è la loro storia vera; giocando si
  impara l'ordine dei Maggiori e i semi.
- *Più piccola:* due giocatori, una mano di dodici carte, solo «chi prende», senza punti delle carte.
- *Nel mondo:* a Salem le carte per leggere sono proibite, quelle per giocare tollerate: è un buon paradosso
  per il Giudice. Chi gioca non crede che dicano qualcosa.
- *Dipende da:* un avversario che giochi in modo sensato; una schermata nuova.
- *Verifica:* test delle regole; partite automatiche.

**3.4 I sacchetti.** *Medio.*
- *Che cos'è:* con i mazzetti dell'orto e una carta si cuce un sacchetto per qualcuno: un'erba e una carta
  che «vanno d'accordo» (pianeta ed elemento sono già nell'erbario).
- *Perché:* dà un senso alla dispensa, lega erbario e carte, è richiamo attivo con una ragione.
- *Più piccola:* tre richieste di personaggi, una scelta di erba e una di carta, una risposta di chi lo riceve.
- *Nel mondo:* portafortuna da appendere a una porta. **Mai un rimedio:** resta la regola sulle erbe (storia e
  tradizione, nessuna dose, nessuna cura).
- *Verifica:* test sui dati (ogni abbinamento ha una fonte in `RESEARCH.md` o è detto «tradizione di Ortica»).

## 4. Il mondo e le persone

**4.1 Il segno sopra chi ha qualcosa per lei** (seconda metà delle missioni «alla GTA»). *Medio.*
**4.2 Il tavolo per leggere nella capanna:** i clienti vengono da lei, al terzo stadio della casa. *Medio.*
**4.3 «Leggi per qualcuno»** (due persone, un telefono): lei legge il mazzo vero per una persona vera, il
gioco guida e l'altro dice che cosa gli è tornato. *Medio.* Poi, a distanza, con un link. *Medio.*
**4.4 Altre storie secondarie dai retroscena** (cinque spunti in `notes/retroscena.md`). *Medio l'una.*
**4.5 Seconda prova del kit:** un mondo nuovo di Altrove scritto con il solo kit. *Medio.*

## 5. Minori

Carte antiche accanto agli sguardi di storia; tavole botaniche mancanti; ambiente del bosco di notte; la voce
della Lettrice (esclusa per ora); `scripts/savecheck.mjs` da aggiornare; una pila di foglietti che dice a quale
luogo appartiene.

## Idee non ancora scelte

Sogni dentro la carta del giorno; lo specchio d'acqua (riconoscere una carta dalla sagoma); Tartufo che
descrive una carta a modo suo; letture diverse con la luna nuova e la piena; la congrega che legge la stessa
carta in quattro modi; due carte che litigano; «che cosa vedi?» (una lettura da tre dettagli toccati);
scegliere la stesa prima di leggere; il villaggio capovolto per una notte; le coppie con Tartufo; un mazzo di
sibille dell'ambulante; le minchiate e lo zodiaco; lei maestra e un'altra persona allieva; l'Esame a due
contro il Giudice.

## Fatti controllati per queste idee (17 novembre; dettagli in `RESEARCH.md`)

- I tarocchi nascono come gioco di carte nell'Italia del nord, nella prima metà del Quattrocento; la lettura
  si diffonde solo dalla fine del Settecento (Court de Gébelin, 1781; Etteilla).
- Regola comune a tutti i giochi di tarocchi: si risponde al seme; chi non può, deve giocare un trionfo se ne
  ha; vince il trionfo più alto, altrimenti la carta più alta del seme giocato. Il Matto, nei giochi italiani,
  è una «scusa»: si gioca quando si vuole e non prende.
- Le minchiate fiorentine: 97 carte, con i dodici segni dello zodiaco, i quattro elementi e le virtù.
- Semi ed elementi (Bastoni fuoco, Coppe acqua, Spade aria, Denari terra): è l'abbinamento reso comune dalla
  Golden Dawn a fine Ottocento, non l'unico; altri scambiano aria e fuoco, altri negano che i semi siano gli
  elementi. Va presentato come una tradizione.
- Non verificato: le sibille italiane e i mazzi «da salotto»; il romanzo delle storie raccontate con le carte
  (citato a memoria: da controllare prima di nominarlo nel gioco).
