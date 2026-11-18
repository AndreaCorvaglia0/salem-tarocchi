---
tipo: principio
nome: "Lei vede solo quello che sa"
in_breve: "Ogni schermata mostra quello che lei ha visto o le hanno detto: mai il premio, il contenuto o i retroscena. Quello che non sa è un «?» o una riga misteriosa, mai un vuoto e mai una spiegazione."
perche: "Andrea, 18 novembre: sulla mappa «posso vedere quello che già so sulla missione e che mi hanno detto. Qualche presentimento vago. Ma mai il premio o il contenuto. Al massimo un titolo evocativo». Sapere prima che cosa si vince o che cosa succede toglie la scoperta; non sapere niente di un posto toglie la voglia di andarci."
fonte: "Deciso da Andrea il 18 novembre 2026"
si_rompe_se: "Un biglietto dice che cosa si guadagna o che cosa accadrà; un titolo racconta la fine; una nota cita un fatto che lei non ha vissuto o un nome che esiste solo nei retroscena; toccando un posto esce solo il nome."
---

Il gioco sa più di lei: ha il copione, i premi, i retroscena. L'errore viene facile a chi scrive, perché scrive dal punto di vista del gioco. Prima di mostrare una riga ci si chiede: **come lo sa, lei?** Le risposte buone sono tre: l'ha visto, gliel'hanno detto, lo sente (un presentimento vago, a parole sue). Se non c'è risposta, la riga non si mostra.

In pratica:

- Ogni testo che parla del mondo (biglietti, note dei luoghi, pagine delle persone, diario) ha una **condizione** scritta con le chiavi di `src/core/cond.js`. Un testo senza condizione è un testo che lei vede sempre: va giustificato.
- Tre stati, non due: **mai visto** (bianco), **visto ma non conosciuto** («?» e una riga misteriosa), **conosciuto** (appunti brevi che crescono).
- Premi e conseguenze si scoprono vivendoli. Un titolo evoca, non riassume.
- I testi si scrivono con la sua voce, in prima persona, come appunti: così è difficile metterci quello che non sa.
- `lore/storia/retroscena` e i campi nascosti (`non_affiora`, `nasconde`) non sono mai una fonte per quello che si vede. Un test lo controlla.
- Arricchire è il caso normale: dove lei tocca qualcosa, il solo nome non basta.

## Note

Meccaniche che lo servono:

- [[raccogliere-pietre-e-figurine]] — Raccogliere pietre e figurine della sibilla
