---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 2 di c3.jail"
dove: "c3.js#c3.jail"
fatto: "[[salvataggio-dalle-cantine]]"
classe: "entrambe"
opzioni:
  - { t: "Parla piano, che adesso provo ad aprire.", imposta: "guida -1, parola -1, punto m01, seme w" }
  - { t: "Prima dimmi come stai.", imposta: "guida +1, fiducia ginepra +1, punto m14, seme c" }
  - { t: "Chiedo ai cardini di farsi da parte, come si chiede a una p…", quando: "power move", imposta: "flag jail.hinges, esplora -1, xp +5" }
  - { t: "Mando Tartufo a prendere le chiavi dal chiodo, in fondo al …", quando: "tartufo 2", imposta: "flag jail.keys, rischio +1, xp +5" }
  - { t: "Fischio piano verso la scala, come mi ha insegnato Ortica.", quando: "flag coven.ortica.talk e trust ortica >= 2", imposta: "flag jail.ortica, parola -1, xp +5" }
  - { t: "Busso piano alla porta del carceriere: a sua moglie ho lett…", quando: "pop 2", imposta: "flag jail.jailer, parola +1, xp +5" }
---

Scelta 2 della scena `c3.jail` (c3.js).

1. «Parla piano, che adesso provo ad aprire.»: guida -1, parola -1, punto m01, seme w.
2. «Prima dimmi come stai.»: guida +1, fiducia ginepra +1, punto m14, seme c.
3. «Chiedo ai cardini di farsi da parte, come si chiede a una p…» (solo se power move): flag jail.hinges, esplora -1, xp +5.
4. «Mando Tartufo a prendere le chiavi dal chiodo, in fondo al …» (solo se tartufo 2): flag jail.keys, rischio +1, xp +5.
5. «Fischio piano verso la scala, come mi ha insegnato Ortica.» (solo se flag coven.ortica.talk e trust ortica >= 2): flag jail.ortica, parola -1, xp +5.
6. «Busso piano alla porta del carceriere: a sua moglie ho lett…» (solo se pop 2): flag jail.jailer, parola +1, xp +5.
