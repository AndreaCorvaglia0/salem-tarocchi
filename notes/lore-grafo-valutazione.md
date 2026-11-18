# Il grafo della lore: valutazione (18 novembre, 10:55)

Domanda di Andrea: i contenuti dei nodi e le connessioni sembrano poco sensati. Misura rapida (script sui file
`lore/`, link `[[...]]` contati una volta per nodo; «orfani» = al massimo un link entrante).

| cartella | nodi | link in uscita (mediana) | link entranti (mediana) | quasi orfani | parole nel corpo (mediana) |
|---|---|---|---|---|---|
| fatti | 96 | 4 | 6 | 0 | 31 |
| finali | 94 | 1 | 1 | 94 | 43 |
| luoghi | 48 | 1 | 2 | 12 | **14** |
| meccaniche | 32 | 9 | 11 | 3 | 22 |
| metodo | 36 | 4 | 1 | **35** | 97 |
| obiettivi | 14 | 3 | 7 | 0 | 20 |
| persone | 57 | 3 | 4 | 0 | 33 |
| principi | 17 | 4 | 9 | 0 | 75 |
| retroscena | 35 | 1 | 0 | **34** | 101 |
| sapere | 104 | 5 | 2 | **44** | 61 |
| scelte | 166 | 1 | 6 | 22 | 35 |
| tecniche | 14 | 5 | 8 | 0 | 25 |
| tratti | 15 | 51 | 3 | 2 | 47 |

## Che cosa dice

1. **Luoghi e persone sono schede vuote.** 14 e 33 parole: un nome, un tipo, due righe. Il grafo li mostra come
   nodi grossi (molti link entranti) ma aprendoli non c'è niente da leggere. È la causa principale
   dell'impressione «poco sensato».
2. **I retroscena sono isole.** 34 su 35 non sono collegati da nessuno: le persone non puntano al loro
   retroscena (scelta nata per non farli «affiorare» nel gioco, ma nel vault il link serve).
3. **Metodo, finali e metà del sapere pendono nel vuoto:** 35 schede di metodo senza entranti; i 94 finali
   generati sono foglie; 44 schede del sapere hanno un solo collegamento.
4. **Troppi nodi generati** (scelte 166, finali 94, tratti 15 con 51 link ciascuno) schiacciano il grafo: sono
   tabelle utili ai test, non concetti, e nel disegno fanno da rumore.
5. Funzionano bene: meccaniche, obiettivi, tecniche, principi (pochi, densi, ben collegati).

## Proposta (da approvare, non fatta)

- Arricchire **persone e luoghi** (chi è, cosa vuole, dove sta, con chi ha a che fare, in che scene compare),
  ricavando dai copioni dove possibile, con `fonte`.
- Collegare ogni persona al suo retroscena, e ogni retroscena ai fatti e ai luoghi che tocca.
- Collegare il metodo ai principi e alle meccaniche che lo usano; il sapere ai luoghi e alle persone (Ortica →
  erbe, Edera → pietre).
- Nel grafo di Obsidian e del visore: nascondere per default `scelte/`, `finali/`, `tratti/` (filtro), o
  raggrupparli in un nodo indice.
- Aggiungere al controllo (`lore.mjs check`) due avvisi: scheda sotto 40 parole; scheda senza link entranti.

## Prima la domanda giusta: a che cosa serve, e a chi (Andrea, 10:56)

| Chi lo usa | Per fare che cosa | Che cosa gli serve dal grafo | Oggi |
|---|---|---|---|
| Andrea, per sviluppare la storia | capire chi è chi, che cosa sa, che cosa è successo, dove; trovare spunti | schede leggibili di persone e luoghi; legami persona–persona, persona–fatto–luogo; i retroscena accanto | **scarso**: schede vuote, retroscena staccati |
| Agenti che scrivono scene e missioni | non contraddire il canone, sapere che cosa lei può sapere | fatti con fonte e condizione; chi sa che cosa; controlli automatici | **buono a metà**: fatti e controlli ci sono, persone e luoghi no |
| Il gioco | dati che diventano gioco (il sapere → `sapere.js`) | completezza e coerenza del cerchio | **buono**: c'è il test del cerchio |
| Mnemopolis / generatore di storie | riusare metodo e schema | metodo legato a principi, meccaniche, obiettivi | **medio**: meccaniche ben legate, metodo isolato |

Conclusione: il grafo non è uno solo. Servono tre **viste** dello stesso vault, ognuna con il suo filtro:
**la storia** (persone, luoghi, fatti, retroscena, decisioni), **il gioco che insegna** (obiettivi, meccaniche,
tecniche, principi, metodo), **il sapere** (il cerchio). Scelte, finali e tratti restano fuori dal disegno:
sono tabelle per i test. La misura di qualità cambia per vista: nella storia conta che ogni persona abbia una
scheda piena e legami con altre persone e fatti; nel gioco che ogni obiettivo sia servito da una meccanica;
nel sapere che il cerchio si chiuda.
