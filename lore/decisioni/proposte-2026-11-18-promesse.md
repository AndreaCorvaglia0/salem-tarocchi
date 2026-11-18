---
tipo: decisione
nome: "Mantenere le promesse del gioco (BACKLOG 1), 18 novembre 2026"
fonte: proposto
---

Scelte fatte lavorando alla sezione 1 di `docs/BACKLOG.md`. Sono proposte: valgono finché Andrea non dice
altrimenti, e le righe nuove dei copioni restano `proposto` finché non le legge.

## 1. Il carattere non pende (1.1)

Il polo «pungente» non è più la versione antipatica di «gentile»: è la battuta pronta, l'ironia affettuosa,
la franchezza che fa ridere. Lo stesso per «dritta» (va al punto, pratica) e «accorta» (pesa le parole,
lascia correre). Dove una risposta era già di quel tipo ma segnata su un altro asse, ha preso anche
quel tratto. Le scelte che i copioni ricordano dopo (`malva.cheeky`, `fire.joked`, `cat.proud`...) dicono
la stessa cosa con parole nuove. Misura: `npm run coverage`, i quattro semi tra il 15% e il 35%
(`tests/coverage.test.mjs`).

## 2. L'affinità si vede (1.2)

Ogni strega ha da due a quattro righe o gesti che cambiano con l'affinità (`{ affinity: { <strega>: 2 } }`),
in tre scene ciascuna. Il tono viene dai retroscena (`affiora`), mai un fatto: Malva le passa l'unguento
sulle mani o le sistema il colletto; Ortica si ferma a metà di una frase e la lascia parlare; Edera le
dà un nastro da libro; Ginepra le stringe la mano prima di saltare. Chi non le somiglia sente una riga
diversa, mai fredda: Malva «la testa svelta», Ortica «ascolti con la faccia», Edera «vai di fretta»,
Ginepra «ci pensi prima di saltare».

## 3. La Lettrice torna dopo la fine (1.3)

Dopo il finale le carte non ancora raccontate (quasi tutta la terza fila) arrivano nel sonno: al letto della
capanna, dopo la carta del giorno, la Lettrice fa una visita con tre carte alla volta, anche con una sola
(Il Mondo arriva per ultimo, da solo). Prima della fine non succede, così le visite della storia tengono le
loro carte. Quando due carte della stessa visita hanno la domanda sullo stesso asse, quale delle due
chiede non è più sempre la più vecchia.

## 4. Fiducia e legame sono un numero solo (1.4)

Il numero vero è il legame (`state.bonds`). `state.trust` resta come copia per chi la legge ancora
(`core/cond.js`, `core/progress.js`), riscritta a ogni cambio del legame e a ogni caricamento. Un
salvataggio vecchio tiene il più grande dei due: niente di quello che ha costruito si perde.

## 5. «Ricordamela» aiuta a ricordare, non dà la risposta (1.4)

Il biglietto si apre prima della risposta, quindi non contiene più le parole della carta. Per una Maggiore
dice dove l'ha trovata e due cose da guardare nel disegno, con la loro domanda; per una Minore il posto del
numero nella fila (che cosa viene prima) e l'elemento del seme. Nessuna parola chiave della carta può
comparire: lo controlla un test.
