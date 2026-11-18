---
tipo: ricetta
nome: "Agenti economici, ognuno nella sua cartella"
legge: "[[legge-chiaro-vero-curato]]"
famiglia: far-crescere
ambito: generale
problema: "Più agenti che toccano gli stessi file si pestano i piedi; un agente solo che fa tutto costa di più e sbaglia di più."
soluzione: "I compiti ben descritti vanno ad agenti meno costosi, al massimo due insieme, ognuno con le sue cartelle. Le parti del codice si parlano per nome, non importandosi a vicenda. Chi guida guarda le schermate, unisce, fa girare i test e pubblica."
in_salem: []
si_controlla_con: "tests/map.test.mjs (un servizio chiamato ma non fornito); node scripts/map.mjs --check (docs/MAP.md aggiornato)"
rischi: "Un agente che corregge fuori dalla sua cartella per far passare un test. Le decisioni prese da un agente e non scritte in una nota (notes/<area>.md) si perdono."
fonte: "Andrea, istruzioni del progetto; AGENTS.md; CONTRACT.md, Working rules"
---

In CONTRACT.md ogni area ha la sua cartella e i suoi servizi: si offre una funzione con `provide('x.y')` e la si usa con `call('x.y')` (src/core/services.js). Gli agenti non usano git, non toccano fuori dalle loro cartelle e chiudono con un resoconto breve: che cosa esiste, che cosa hanno controllato e come, che cosa no. docs/MAP.md, scritto da scripts/map.mjs, dice chi chiama chi.

Per un altro gioco: Mnemopolis divide già il lavoro in passi (base di conoscenza, gioco, aspetto) in AGENTS.md. Un generatore di storie sarebbe un'area in più, con le sue cartelle e i suoi controlli.
