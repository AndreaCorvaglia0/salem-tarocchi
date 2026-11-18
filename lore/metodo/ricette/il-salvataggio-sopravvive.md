---
tipo: ricetta
nome: "Il salvataggio sopravvive a ogni versione"
legge: "[[legge-strati-indipendenti]]"
famiglia: far-crescere
ambito: generale
problema: "Qualcuno sta già giocando: una versione nuova che rompe il salvataggio le fa perdere la partita."
soluzione: "Ogni chiave nuova dello stato ha un valore di partenza. I vecchi salvataggi si aggiustano al caricamento, senza mai togliere quello che lei aveva. Il gioco è tenuto in più posti."
in_salem:
  - "[[arriva-a-chi-e-avanti]]"
si_controlla_con: "tests/core.bonds.test.mjs («old saves get the new keys»); tests/core.test.mjs; node scripts/savecheck.mjs <url>"
rischi: "Una tabella cambiata, come quella dei punti dei livelli il 16 novembre, può abbassare il livello di chi gioca: `keepLevel` lo impedisce. Una pagina chiusa a metà di un Altrove deve riportarla in Salem (`restore`)."
fonte: "DESIGN.md, Recuperare quello che si aggiunge dopo; AGENTS.md; MAP.md, Where a thing goes («A new key in the save»)"
---

In src/core/state.js `fresh()` ha tutte le chiavi, `migrate()` aggiusta i valori che romperebbero i conti, `parseSave` unisce il vecchio al nuovo. src/core/progress.js ha `keepLevel` e `syncPowers`; src/core/witches.js ha `carryTrust`, che fa partire il legame dalla fiducia di prima. src/core/vault.js tiene il gioco anche in IndexedDB, nell'archivio dell'artefatto e in un codice da copiare.

Per un altro gioco: Mnemopolis salva nel browser. Se un generatore di storie aggiunge pezzi a una partita già iniziata, questa disciplina diventa obbligatoria.
