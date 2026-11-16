// THE WORKED EXAMPLE of a trial (debug only: `window.__salem.call('trial.start', 'demo')`). One of each piece:
// a witch's gesture, a `segno` fork, an `idea` fork with three doors, a `quesito`, a good and a bad room, an
// escape, a choice, the three outcomes. The format is in src/trials/run.js. The lines are placeholders that
// show the shape; the writer replaces them (TODO-writer).
export default {
  id: 'demo',
  title: 'La cantina del mulino',
  with: 'ortica',
  debug: true, // never offered in the real game, never in the registry
  // what Ortica "senses" before going: four topics, of which the trial really uses two (the sign, and the
  // beginning or end that the quesito turns on: a card's idea)
  study: ['sign', 'm16', 'reversed', '1-3'],
  steps: [
    { lines: [
      ['ortica', 'La cantina del vecchio mulino è qui sotto, e da quando il mugnaio se n\'è andato nessuno ci scende più. Io però ci ho lasciato una cosa, l\'inverno scorso, e stanotte me la vado a riprendere.'],
      ['ortica', 'Prima di scendere, però, si chiede alle carte: lo faccio sempre, anche quando so già che andrò lo stesso.'],
    ] },
    { witchDraw: { who: 'ortica', card: 'm16', rev: false, t: 'La Torre, dritta. Non è il segno che speravo, e lo so benissimo che cosa vuol dire, ma la cosa che ho lasciato là sotto mi serve: andiamo.' } },
    { say: 'tu', t: 'Le scale scendono nel buio, e il primo gradino scricchiola sotto il mio peso.' },
    { fork: { kind: 'segno', options: [
      { text: 'Scendo senza pensarci troppo.', sign: 'go' },
      { text: 'Scendo piano, tenendomi al muro.', sign: 'slow' },
      { text: 'Aspetto qui che Ortica faccia luce.', sign: 'stop' },
    ] }, who: 'ortica', t: 'Tira fuori una carta anche tu, e dimmi se scendiamo.', wrong: 'bad.stairs' },
    { say: 'narra', t: 'In fondo alle scale ci sono tre porte, una accanto all\'altra.' },
    { fork: { kind: 'idea', options: [
      { text: 'Una scala stretta che sale verso una luce.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Una porta murata, con un lucchetto vecchio.', tags: { moto: ['ferma', 'chiude'], favore: '-' } },
      { text: 'Una porta socchiusa, da cui torna indietro un profumo di pane.', tags: { moto: 'torna' } },
    ] }, who: 'ortica', t: 'Io queste tre porte non me le ricordo proprio. Chiedi tu, che hai la mano più fresca della mia.', right: 'good.pantry', wrong: 'bad.cellar' },
    { fork: { kind: 'quesito', by: 'moto', rule: 'Se la carta parla di un inizio o di qualcosa che cresce, si va a destra; se parla di una fine o di qualcosa che si ferma, a sinistra; se parla di un ritorno, si torna indietro.', options: [
      { text: 'Vado a destra.', tags: { moto: ['inizia', 'cresce'] } },
      { text: 'Vado a sinistra.', tags: { moto: ['ferma', 'chiude'] } },
      { text: 'Torno indietro.', tags: { moto: 'torna' } },
    ] }, who: 'ortica', t: 'Il mugnaio aveva una regola per questo corridoio, e l\'ha scritta sul muro col carbone. Leggila, e poi pesca.' },
    { choice: [
      { t: 'Le chiedo che cosa ha lasciato quaggiù.', bond: 1, trait: { esplora: 1 }, then: [['ortica', 'Un barattolo di miele, se vuoi saperlo. Ridi pure, ma quello del mugnaio era il migliore di Salem.']] },
      { t: 'Le dico di sbrigarsi.', trait: { parola: 1 }, then: [['ortica', 'Hai ragione, ma non dirlo con quel tono: sembri Malva.']] },
    ], who: 'narra', t: 'Ortica si ferma davanti a uno scaffale, e frugando borbotta fra sé.' },
    { lines: [['narra', 'Sopra di voi una porta sbatte, e qualcuno comincia a scendere le scale.'], ['ortica', 'È il guardiano. Scappa verso la luce e non voltarti, io ti raggiungo.']] },
    { escape: { to: 'auto', seconds: 30 }, safe: [['ortica', 'Ce l\'abbiamo fatta, e nessuno ci ha viste in faccia.']], caught: { error: 1, lines: [['narra', 'Il guardiano ti afferra per il mantello, e prima di lasciarti andare si prende qualche moneta.']], loss: { coins: 2 } } },
  ],
  rooms: {
    'bad.stairs': { good: false, lines: [['narra', 'Il gradino marcio cede, e scivoli fino in fondo sbucciandoti un ginocchio.'], ['ortica', 'Te l\'avevo detto, io? No, non te l\'avevo detto. Però la carta sì.']] },
    'good.pantry': { good: true, lines: [['narra', 'Dietro la porta c\'è una dispensa asciutta, e in un angolo qualcuno ha dimenticato un sacchetto di monete.']], gain: { coins: 3 } },
    'bad.cellar': { good: false, lines: [['narra', 'La porta dà su una stanza allagata: l\'acqua gelata ti arriva alle caviglie, e una moneta ti scivola via dalla tasca.']], loss: { coins: 1 } },
  },
  outcomes: {
    perfect: { lines: [['ortica', 'Non hai sbagliato niente, e io sono uscita con il mio miele. Tieni questo, che a me non serve.']], reward: { xp: 30, tool: 'incense', bond: 1 } },
    pass: { lines: [['ortica', 'Qualche livido ce lo siamo fatto, ma il miele è salvo. La prossima volta ascolta le carte un po\' di più.']], reward: { xp: 10 } },
    fail: { lines: [['ortica', 'Che disastro, e il miele è rimasto là sotto. Tu sei salva, almeno, ma qualcosa per strada l\'hai perso.']], loss: { coins: 3, bond: 1, loseCard: 'random-minor' } },
  },
};
