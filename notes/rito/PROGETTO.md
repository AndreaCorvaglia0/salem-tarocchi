# Il rito del fumo: il progetto scelto

17 novembre 2026, notte. Quattro proposte (`proposta-a…d.md`), cinque giudici alla cieca (`giudizio-*.md`).
Decisione del capofila, con il mandato di Andrea. Questo file è la specifica da costruire.

## Com'è andata

| Proposta | Rito | Lei | Peso | Imparare | Costruire |
|---|---|---|---|---|---|
| A. Un respiro, un gesto | 4ª | 4ª | **1ª** | 4ª | **1ª** |
| B. Il braciere tra le mani | **1ª** | 3ª | 2ª | **1ª** | 2ª |
| C. A orecchio, prima del nome | 2ª | **1ª** | 3ª | 2ª | 3ª |
| D. Un rito che si impara da qualcuno | 3ª | 2ª | 4ª | 3ª | 4ª |

Nessuna vince da sola. Tutti e cinque i giudici, partendo da lenti diverse, propongono lo stesso innesto:
**lo scheletro leggero di A, la scelta senza nomi di C, la pulizia dentro il respiro, niente quiz.**
I tempi dichiarati erano tutti ottimisti (ricalcolati dal giudice del peso: C alla ventesima volta 22-27 s).

## Decisioni sui punti dove i giudici non concordano

1. **La domanda «Secondo te, che cosa avrebbe acceso Malva?»: no.** Per imparare sarebbe la tecnica giusta, ma
   mette sotto esame la sua intuizione un attimo dopo averla chiesta. «Quale incenso quando» si impara dove
   una risposta giusta ha senso, cioè componendo qualcosa per qualcuno (i sacchetti, backlog 3.4). Nel rito
   resta solo l'incontro: il nome dopo la scelta, e Malva a richiesta.
2. **Nessuno specchio che interpreta lei.** Niente «ti è sembrata un addio». Solo il fatto: «Per questa
   domanda hai acceso la rosa.»
3. **La pulizia con la mano: solo col mazzo vero**, a richiesta. Nelle letture per i clienti la pulizia è il
   respiro.
4. **Il respiro a mano libera**, non tenendo premuto: tenere premuto sembra una barra di caricamento.
5. **Nessun fumo si accende per immobilità** o per caso: se lascia fuori da una brace non succede niente.
6. **Si può leggere senza fumo**, dalla quarta volta, con una scritta quieta. Si conta quante volte lo fa: se
   lo fa spesso, è il rito che ha sbagliato, non lei.
7. **Deve reggere a volume zero:** ogni aria si distingue anche solo per colore e movimento del fumo.

## La sequenza

Si apre dal pulsante che c'è già («Mescolo», «Avanti»): il pulsante resta, con la sua protezione dai tocchi, e
apre uno strato a tutto schermo che non scorre (`touch-action: none`).

| | Che cosa fa | Che cosa vede e sente |
|---|---|---|
| 1. Bussare | tocca la brace e tiene un secondo | la brace si accende; **il motivo d'apertura**, sempre lo stesso; sale il fumo chiaro del grano d'incenso |
| 2. Respirare | niente: la mano è libera | un cerchio si allarga e si stringe piano; a ogni espiro il velo colorato dell'ultimo fumo acceso si assottiglia ed esce. Tre respiri le prime tre volte, due fino alla nona, poi uno. Mai zero. |
| 3. Cercare | appoggia il dito e scorre **solo in orizzontale** sopra la brace | cinque braci su un arco, **senza nome e senza parola**. Sopra una brace: la luce della stanza, il colore e il modo di muoversi del fumo, una nota vera di uno strumento. Tra due braci: solo il fuoco. |
| 4. Accendere | solleva il dito sopra una brace | il segno dell'elemento si disegna da solo nel fumo; compare il nome: «Quest'aria è la rosa.»; entra la musica di quell'aria e resta per tutta la lettura. Chi vuole può tracciare il segno: è un di più, non un requisito. |
| 5. Leggere | come oggi | nell'aria che ha scelto |
| 6. Dopo | niente, o un tocco su «E Malva?» | al massimo una volta al giorno, una riga di fatto. «E Malva?»: che cosa avrebbe acceso lei e perché, con quattro secondi di quell'aria. |

Stessa seduta (un altro rito entro venti minuti): «la brace è ancora accesa»: niente motivo, un respiro, si
cerca subito.

**Tempi da rispettare** (misurati nel salvataggio, fase per fase): prima volta ≤ 22 s; dalla quarta alla nona
≤ 14 s; dalla decima ≤ 8 s; stessa seduta ≤ 5 s.

**Col mazzo vero** («Leggi le tue carte»), in più e solo a richiesta: «Passa il fumo sul tuo mazzo»: lei muove
il dito e il fumo lo segue sopra il disegno del mazzo. E una riga che la invita a farlo davvero, con la mano,
sulle sue carte.

## Le arie

Prese dalla base di conoscenza (`src/data/sapere.js`), una per elemento più una. Si parte da **tre**, le più
lontane tra loro; le altre due arrivano dopo, una alla volta, come doni con una riga di chi le porta.

| Aria | Pianeta, elemento | Che cosa si dice che fa | Colore e fumo | La ricetta per scegliere la musica | Quando arriva |
|---|---|---|---|---|---|
| (apertura) olibano | Sole, fuoco | purifica, protegge | chiaro, dritto | il motivo: un colpo o tre note, sempre uguale | subito |
| rosa | Venere, acqua | amore, conforto | rosa caldo; fumo lento, a onde | lento, maggiore, legato, timbro caldo | subito |
| alloro | Sole, fuoco | chiarezza, coraggio | oro; fumo che sale svelto e dritto | moderato, maggiore, pizzicato o staccato leggero | subito |
| cipresso | Saturno, terra | purifica, consola chi lascia andare | verde scuro; fumo basso, pesante | lento, minore, grave, legato | subito |
| salvia | Giove, aria | purifica, schiarisce | grigio argento; fumo largo, che si apre | poche note, registro alto, molto spazio | dono di Ortica (ha la salvia nell'orto) |
| mirra | Luna, acqua | conforta, veglia | ambra scuro; fumo denso, quasi fermo | lento, modo ambiguo, voce sola | dono di Edera |

Il segno dell'elemento: fuoco △, acqua ▽, aria △ con la sbarra, terra ▽ con la sbarra.

## La sua tradizione

Il gioco ricorda, per ogni tipo di domanda (i cinque ambiti che usa già), quale aria ha acceso. Dopo **tre**
volte la stessa aria per lo stesso ambito, diversa da quella di Malva, nel grimorio compare una riga in prima
persona: «Per le domande di casa io accendo il cipresso. Malva accende la salvia.» Nessun premio se coincide,
nessuna perdita se no. Queste scelte entrano nel ritratto come fatti, senza interpretazione.

## La musica (prima di tutto il resto)

Brani **veri** e **nuovi per il gioco** (quelli già usati altrove porterebbero con sé un altro luogo). Per ogni
aria: molti candidati liberi, misurati con il codice (tempo, modo, altezza media, intensità), scartati quelli
fuori ricetta; ne restano due o tre. **Poi la prova d'ascolto alla cieca**: una paginetta sul sito con i
candidati senza etichetta; Andrea e lei dicono a quale aria li darebbero e quali preferiscono; la risposta torna
come un codice. Senza questa prova il rito esce con i candidati meglio misurati, dichiarati provvisori.
Una nota vera di strumento per brace (per la ricerca dell'aria); lo strato del fuoco (`beds.js`).

## Che cosa si salva

`state.rite`: quante volte, l'ultima aria e quando (per la tinta e per «la brace è ancora accesa»), le arie
possedute, per ambito le ultime scelte, quante volte «senza fumo», i tempi delle fasi (medie), se ha visto la
riga di oggi. Tutto con valori di default: una partita vecchia parte dal primo rito, con tre arie.

## Ordine di costruzione (ogni passo si prova dal telefono)

1. I candidati musicali misurati e la pagina d'ascolto alla cieca.
2. Lo strato del rito in «Leggi le tue carte»: bussare, respirare, cercare tra tre arie, accendere, il nome.
3. Lo stesso nelle letture per i clienti; la riga dopo; «E Malva?»; la sua tradizione nel grimorio.
4. La passata sul mazzo; salvia e mirra come doni.

## Che cosa guardare dopo

Quante volte sceglie «senza fumo». I tempi veri delle fasi. Se accende sempre la stessa aria (l'arco è diventato
una manopola?). E la sola misura che conta: se, dopo qualche sera, il motivo d'apertura le fa abbassare le spalle.
