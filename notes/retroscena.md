# Retroscena: che cosa c'è e che cosa devi scegliere

I fogli stanno in `lore/retroscena/` (35, tutti `fonte: proposto`). Niente di questo si dice nel gioco: serve a scrivere le battute. Nessun copione è stato toccato.

Non hanno un foglio: la Lettrice e la protagonista (canone). Nessun personaggio ha un'ipotesi sulla Lettrice, perché nessuno la conosce.

## a) La rete in dieci righe

1. Trent'anni fa una sposa giovane morì di febbre dopo il parto. La piazza se la prese con **Ruta**, la levatrice di allora, che passò l'inverno in cella e ne uscì con le mani rovinate.
2. La sposa era la moglie dello scrivano del tribunale, che oggi è il **Giudice**. Fu lui a far chiudere Ruta «per proteggerla dalla piazza».
3. **Malva** era la ragazza di Ruta: aveva letto male una carta alla madre della sposa, e Ruta le ordinò di tacere. Da lì «ringraziare porta male».
4. **Ortica** era la ragazza di Malva: teneva occupato il carceriere mentre le altre portavano il cesto. Crede di aver detto una frase di troppo. Malva le disse solo: «Tu parli.»
5. **Edera**, figlia del vecchio pastore, aveva la chiave della cantina. Crede di aver risposto male a una domanda gentile dello scrivano.
6. Edera è anche quella che ha insegnato le figure al Giudice quando era un bambino povero che mangiava le candele. Le domande degli Esami sono le sue.
7. Dieci anni fa, quando cominciarono gli Esami, le tre si divisero: Malva in paese, Ortica nel bosco, Edera sotto il tribunale.
8. **Rosalba** era una ragazzina di Boston, quarant'anni fa: allieva di Edera, amica di Ortica, sorella del **bottegaio**.
9. **Ginepra** perse il mazzo della nonna a ottobre perché non sapeva le figure; glielo prese il **conestabile della piazza**, che ha una figlia della stessa età e la interroga ogni sera.
10. Il **mugnaio** e Ortica: un cappello caduto nella gora ventotto anni fa. **Tabita** e Malva: un conto mai chiuso, e una figlia che Tabita vorrebbe da Malva. La **vedova Bray** consegnò lei il mazzo del marito. La **Hale** fu indicata per una gentilezza.

## b) Una riga per personaggio

- **Malva**: sbagliò una carta, un'altra pagò per lei; cerca una ragazza a cui lasciare le mani.
- **Ortica**: parla sempre perché nessuna parola pesi più; dice «il merlo» per non fare nomi.
- **Edera**: ha dato al Giudice tutto quello che sa; teme che i suoi ricordi siano sogni, come le diceva suo padre.
- **Ginepra**: «quella coraggiosa» tra quattro fratelli; non aveva mai studiato le carte della nonna.
- **Il Giudice**: crede di essere il muro tra la piazza e le donne. Sa tutte le carte e non ne ha mai trovata una.
- **Il conestabile**: ha paura del buio, e che sua figlia non sappia rispondere.
- **Il bottegaio**: fece credito un inverno, nessuno pagò tranne Malva; tiene un registro senza nomi.
- **Tabita**: da novembre mantiene la casa da sola; non chiederà mai a Malva di prendere sua figlia.
- **Comare Hale**: balbettava da bambina; l'unica frase lunga dell'inverno l'ha detta alla ragazza sbagliata.
- **Il mugnaio**: il figlio è partito per Boston dopo una lite; guarda la ruota per non guardare il posto vuoto.
- **La vedova Bray**: non chiese mai niente al marito; ha dato via il suo mazzo e non se lo perdona.
- **Tartufo**: solo comportamento. Lo sentono lei, le tre maestre, Ginepra a volte; gli altri no.

## c) Contraddizioni e correzione più piccola

Numeri come in `notes/lore-story.md`.

1. **Malva sapeva?** Aspettava *una* ragazza, non *questa*. `c0.js#p.arrive`: «che non sa ancora di aspettarti» → «che non sa ancora chi sta aspettando».
2. **Mazzo di Ginepra.** Le resta una carta sola della nonna, la Ruota, nel guanto. `c2.js#c2.fire`: «Pesca dal suo mazzo» → «Sfila una carta dal guanto». (La Luna del bicchiere di Venere l'ha trovata dopo ottobre: niente da cambiare.)
3. **Cella: giorni o mesi?** Giorni. Il capitolo 2 dura primavera ed estate, e l'arresto è a fine estate. Nessuna battuta cambia (all'arresto dicono già «Sono passati dei mesi»). Cambia l'etichetta in DESIGN.md: «Capitolo 2 (primavera)» → «(primavera ed estate)». Vedi però d4.
4. **Torre.** `c3.js#c3.edera`: «la Torre a nord» → «la Torre più in basso».
5. **Tartufo e la scritta.** Non sa leggere: lo sa perché Malva lo ripete a tutte. Si può lasciare, oppure `c0.js#p.road`: «Sulla porta ha scritto» → «Sulla porta, dice lei, ha scritto».
6. **Età di Malva.** Vicina ai sessanta. DESIGN.md: «sui quaranta» → «vicina ai sessanta». I copioni restano.
7. **Chi sente Tartufo.** Parentesi = voce bassa, solo per lei. Senza parentesi = voce piena: la sentono le streghe e, se lui vuole, Ginepra. Ho controllato tutte le battute senza parentesi: tornano. Cambia solo il commento in testa a `barks.js`.
8. **Josiah.** `trials.js#trial.grave.door`: «Domani notte fa un anno che ho seppellito Josiah» → «Domani notte è il giorno del mese in cui ho seppellito Josiah». In `trials/side.js#grave`: «Stanotte fa un anno» → «Stanotte è il giorno del mese», e «da un anno» → «da mesi».
9. **La Bray e il segreto.** È fatta così. `barks.js#pop`: aggiungere «giura di non conoscerti e intanto» prima di «va dicendo in giro».
10. **Goodwin.** `lessons.js#minors.3.lesson`: «dalla Goodwin» → «dalla moglie del fabbro».
11. **Volate via?** Volano via dal paese e tornano. Se il processo va male, il Giudice firma un foglio al mese e non manda nessuno: non vuole trovarle. `steps.js#f.dawn`: «via da Salem» → «via dal paese».
12. **«La prima sera».** `c2.js#c2.arrest`: «La prima sera» → «La prima volta».
13. **Capanna o cottage.** Non c'entra coi retroscena: «capanna» ovunque (etichetta della mappa, `elsewhere/clouds.js`, `visits.js` riga 397).
14. **Tartufo e le ragazze.** In dieci anni dalla capanna ne sono passate quattro, nessuna è rimasta. Niente da cambiare.
15. **Edera e il Sole.** Stesso pomeriggio. Niente da cambiare.

Buchi chiusi senza toccare niente: perché Ortica sta nel bosco, perché Edera sta di sotto, come il Giudice sa le carte, perché a Ginepra presero il mazzo, i mazzi di Hale e Bray nel deposito, chi ritira il cesto (Ortica), se Malva vola (volava: la scopa col nastro verde è la sua), chi è «l'altra» che fa notare le dimenticanze (Ortica), la cuoca, lo scrivano.

## d) Dove ho scelto tra due strade buone

1. **L'inverno di Ruta: tre colpe o una?**
   - Scelta: tre. Malva (la carta), Ortica (la frase), Edera (la risposta), e nessuna sa delle altre.
   - Alternativa: una sola, quella di Ortica. Più semplice, ma Malva e Edera perdono la ferita.
2. **La sposa morta: moglie del Giudice o no?**
   - Scelta: sua moglie. Gli dà una ragione che non è cattiveria, e spiega «l'ho imparato da una levatrice».
   - Alternativa: una famiglia qualunque, e lui solo lo scrivano che eseguì. Meno melodramma, Giudice più freddo.
3. **Rosalba: una persona o un nome?**
   - Scelta: la ragazzina di Boston di quarant'anni fa, viva, sorella del bottegaio. Lega Edera, Ortica e la bottega.
   - Alternativa: un nome che non porta a niente, come adesso. Più mistero, meno rete.
4. **Arresto a fine estate, o mesi in cella?**
   - Scelta: fine estate, nessuna battuta cambia. Resta il fatto che nel gioco il capitolo 2 si vede «primavera».
   - Alternativa: Ginepra sta in cella tutta l'estate. Si cambiano tre battute di `c3.js` («stanotte», «due giorni», la forcina) ed è più cupo.

In più, minore: chi ritira il cesto. Ho messo Ortica (fischietto d'osso, «gliene ho affidate»). L'alternativa è una donna dei carbonai, che apre un personaggio nuovo.

## e) Sei semi per storie secondarie

1. **Edera → Ortica.** Edera chiede di portare a Ortica una frase sola, a voce, sul lucchetto. Si scopre il dubbio di Edera. Carte: Sei di Coppe, Cinque di Coppe, Il Giudizio.
2. **Malva e L'Imperatrice.** Malva chiede una lettura fatta bene, capovolte comprese, sulla carta che non raccoglie dall'orto. Si scopre la carta sbagliata. Carte: L'Imperatrice dritta e capovolta, La Stella.
3. **Il cappello in soffitta.** Il mugnaio chiede di riportare una cosa a Ortica senza dire che cos'è. Si scopre perché lei non vola. Carte: Due di Coppe, Otto di Coppe, Cavaliere di Coppe.
4. **La figlia di Tabita.** Tabita chiede una carta «per una ragazza che conosco»: deve chiedere a Malva? Si scopre che cosa vuole Tabita. Carte: Fante di Denari, Tre di Denari, Il Papa.
5. **La figlia del conestabile.** Bussa di nascosto: vuole imparare le figure per non esitare. Si scopre la paura del padre. Carte: Fante di Spade, Otto di Spade, La Giustizia.
6. **La lettera da Boston.** Il bottegaio chiede di leggergli una carta prima di aprire la lettera di quest'anno. Si scopre Rosalba, e il registro. Carte: Sei di Spade, Quattro di Denari, Re di Denari.

## Dettagli proposti (notes/opinions.md): quali tengono

Tengono tutti, e ognuno ha un appoggio in un retroscena (campo `sostiene`). I più utili: il guanto ricucito (Malva ha sentito la Ruota dentro), «hai freddo?» (il Giudice lo chiede a tutti da quando vide le mani di Ruta), il resto mai sbagliato, la ragazza di Boston, Ortica che scende da Edera, il «voi» a Tartufo.

Due vanno messi in ordine, non tolti:
- Hale portata via: «il banco è ancora vuoto» (Malva) vale durante la storia; «qualcun altro ha riaperto» (`end.js#f.last`) vale all'epilogo.
- «Tartufo non si è mai affezionato a nessuna» regge solo con le quattro ragazze passate dalla capanna.

Nessuno stride.

## Che cosa non torna ancora

- La prova del cimitero si apre dal capitolo 2: senza la correzione al punto 8 dice «un anno» in primavera.
- Il capitolo 2 nel mondo è primavera (`world/season.js`), e con la scelta d4 l'arresto cade a fine estate: è una stonatura visiva, non di testo.
- Il sagrestano: se è lo stesso a cui il Giudice bambino chiedeva scusa ha più di ottant'anni. Ho proposto che sia il figlio; lo scrivano sarebbe suo figlio a sua volta.
- L'età di Malva all'arrivo non è scritta da nessuna parte, apposta: lei dice «avevo la tua età», e l'età della ragazza non si dà.

## Che cosa ho verificato

- Tutti i `[[link]]` portano a un file di `lore/` (208). Tutte le scene citate in `sostiene` esistono in `src` (149). Nomi di file unici. `node scripts/lore.mjs check` senza scrivere: 0 errori; `tests/lore.test.mjs`: passa.
- Non verificato: il resto dei test, e come suonano le battute nuove, che non ho scritto.
- Nota: `lore/README.md` ora chiede `persona`, `vuole`, `teme` per ogni retroscena; nei due fogli collettivi (`salem`, `le-tre-maestre`) li ho riempiti con il villaggio e con le tre insieme.
