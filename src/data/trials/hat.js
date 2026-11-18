// A SMALL SIDE STORY with the miller and Ortica: «Il cappello in soffitta» (notes/retroscena.md, e, seed 3).
// The miller gives her a flour sack for Ortica and does not say what is inside; at the hut it is the pointed
// hat Ortica lost over the mill twenty-eight years ago. Nobody tells why she stopped flying: it shows in two
// hands passed twice over the same thing, and in Ortica falling silent (lore/storia/retroscena: mugnaio, ortica).
// Format: src/trials/run.js. The opening at the mill, the door at the hut, what Ortica does afterwards (a line
// that reads her affinity) and the miller later are in data/story/scripts/hat.js.
// Cards it teaches: Due di Coppe, Otto di Coppe, Cavaliere di Coppe (Ortica pulls each, upright). The three
// forks ask for their three ideas (an understanding between equals; leaving what is no longer enough; coming
// forward with the heart): each idea has its cup card and two Majors close to it, so a player who has not had
// the lessons on the Minors draws the Majors and still applies the idea she has just seen; with the Minors
// taught the cups themselves come into the fan.
// The last link of the side chain (after Ginepra's dare, so after the ending, when the miller has seen her
// fly over the willow at dawn): one side trial at a time, as for the others. It also asks for what the
// scenes need: the miller met (c2.mill), the broom and the flying lesson. Pools assumed in
// tests/trials.content.test.mjs: twenty or more Majors, with and without the Minors and reversed faces.
// No `with`: the bond with Ortica is given and taken through `reward.with` / `loss.with`, so the side trial
// that is hers stays the kettle.

const HEART = { cards: ['c02', 'm06', 'm11'], rev: false }; // un'intesa alla pari; un'unione col cuore; a ognuno il giusto
const LEAVE = { cards: ['c08', 'm09', 'm12'], rev: false }; // lasciare quello che non basta più; ritirarsi da sola; arrendersi
const AHEAD = { cards: ['c12', 'm00', 'm01'], rev: false }; // farsi avanti col cuore; saltare; agire

export const hat = {
  id: 'hat',
  title: 'Un sacco dal mulino',
  after: ['trial.dare'],
  when: [{ flag: 'side.m12' }, { power: 'broom' }, { flag: 'lesson.fly' }, { any: [{ flag: 'trial.dare.pass' }, { flag: 'trial.dare.perfect' }] }],
  note: 'Il mugnaio mi ha fatto sapere che ha una cosa da far portare a Ortica, e che la vuole dare a me. Devo passare dal mulino.',
  start: { at: 'forest.mill', label: 'La porta del mulino', verb: 'Bussa' },
  study: ['c', 'm06', 'm09'],
  steps: [
    { lines: [
      ['narra', 'Ortica è sulla soglia della capanna con il merlo sulla spalla, e comincia a parlare quando sei ancora in fondo al sentiero.'],
      ['ortica', 'Il merlo mi ha detto che arrivavi dal mulino, e io gli ho detto che non poteva essere, perché al mulino ci vado io. E invece eccoti qua, con un sacco del mugnaio sotto il braccio. Che cos\'è, farina? Io la farina non gliel\'ho chiesta.'],
      ['narra', 'Le porgi il sacco. Ortica lo prende per la punta, sente com\'è fatto attraverso la tela, e smette di parlare a metà di una parola.'],
      ['narra', 'Per un poco si sente soltanto il merlo, che dal tetto ripete l\'ultima sillaba come se aspettasse il resto della frase.'],
    ] },
    { witchDraw: { who: 'ortica', card: 'c02', rev: false, t: 'Prima di aprirlo tiro una carta, che con le cose che tornano indietro si fa così. È il Due di Coppe, dritto: due che si guardano alla pari e si scambiano la coppa, e nessuno dei due dà più dell\'altro. Una volta questa la rimettevo nel mazzo in fretta.' } },
    { fork: { kind: 'idea', options: [
      { text: 'Le dico di aprirlo insieme a me: io tengo il sacco, e lei scioglie il nodo.', tags: HEART },
      { text: 'Le dico di uscire un momento da sola sulla soglia, prima di aprirlo.', tags: LEAVE },
      { text: 'Le dico di aprirlo subito, con tutte e due le mani, senza pensarci sopra.', tags: AHEAD },
    ] }, who: 'ortica', t: 'Adesso tira tu, e dimmi come lo devo aprire, questo sacco, che a me tremano le mani e non so nemmeno perché.', right: 'good.open', wrong: 'bad.open' },
    { lines: [
      ['narra', 'Dentro, piegato in due e senza un granello di farina, c\'è un cappello nero a punta, di quelli che in paese non porta più nessuno. La tesa è dritta, la punta un po\' storta, e la fodera sa di soffitta e di grano.'],
      ['ortica', 'Ventotto anni in una soffitta, e non ha preso nemmeno un tarlo. Si vede che qualcuno, ogni tanto, saliva a spolverarlo.'],
      ['narra', 'Lo rigira fra le mani e ci passa sopra il palmo due volte, piano, come ha fatto il mugnaio con il sacco prima di dartelo. In testa non se lo mette.'],
    ] },
    { witchDraw: { who: 'ortica', card: 'c08', rev: false, t: 'L\'Otto di Coppe, dritto. Uno che lascia le sue coppe in fila sulla riva e se ne va di notte con il bastone, perché quello che c\'era non gli bastava più. La so a memoria, questa, e non mi è mai piaciuta.' } },
    { fork: { kind: 'idea', options: [
      { text: 'Le dico di riportarglielo lei, domani, e di farsi offrire da bere come sempre.', tags: HEART },
      { text: 'Le dico di appenderlo al chiodo dietro la porta, dove si vede, e di lasciarlo lì.', tags: LEAVE },
      { text: 'Le dico di metterselo in testa adesso, e di vedere se la scopa se lo ricorda.', tags: AHEAD },
    ] }, who: 'ortica', t: 'Tira un\'altra carta, perché io stasera con le carte non ci vedo. Che cosa ci faccio, con questo cappello?', right: 'good.hat', wrong: 'bad.hat' },
    { lines: [
      ['narra', 'Alla fine Ortica lo appende al chiodo dietro la porta, dove stava la padella, e la padella la posa per terra. Poi resta a guardarlo, e il silenzio dura tanto che il merlo scende dal tetto a controllare.'],
    ] },
    { choice: [
      { t: 'Le chiedo perché non se lo mette.', trait: { parola: 1 }, then: [['ortica', 'Perché nel frattempo la testa è cambiata, e il cappello no. Richiedimelo fra qualche anno, che magari ti rispondo meglio.']] },
      { t: 'Non le chiedo niente, e mi siedo sulla panca accanto a lei.', trait: { parola: -1 }, then: [['ortica', 'È la prima volta che qualcuno sta zitto in questa capanna senza che io debba pregarlo. Il merlo è scandalizzato, guardalo.']] },
    ], who: 'narra', t: 'Ortica non ti guarda, ma si capisce che aspetta che sia tu a dire qualcosa, o a non dirlo.' },
    { witchDraw: { who: 'ortica', card: 'c12', rev: false, t: 'Questa la tiro per te. Il Cavaliere di Coppe, dritto: uno che si fa avanti piano, con la coppa in mano e il cuore dentro, attento a non versarne una goccia. Stasera eri tu, con quel sacco sotto il braccio per tutto il sentiero.' } },
    { fork: { kind: 'idea', options: [
      { text: 'Gli riporto un vasetto del suo unguento, così sono pari.', tags: HEART },
      { text: 'Gli riporto il sacco vuoto, piegato bene, e nient\'altro.', tags: LEAVE },
      { text: 'Gli dico che domani viene lei, a finire una delle tre storie lasciate a metà.', tags: AHEAD },
    ] }, who: 'ortica', t: 'Al mugnaio però qualcosa bisogna riportare, che ha aspettato abbastanza. Tira l\'ultima, e dimmi tu che cosa.', right: 'good.reply', wrong: 'bad.reply' },
  ],
  rooms: {
    'good.open': { good: true, lines: [['narra', 'Era quello che diceva la carta. Ortica fa come le hai detto senza discutere, che per lei è già moltissimo, e il nodo si scioglie al primo tentativo.']], gain: { xp: 5 } },
    'bad.open': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Il nodo si stringe invece di sciogliersi, Ortica ci mette i denti, e intanto racconta tutta la storia di un nodo di sua nonna che non si è mai sciolto.']] },
    'good.hat': { good: true, lines: [['narra', 'Era quello che diceva la carta. Ortica ti ascolta fino in fondo senza interromperti nemmeno una volta, e chi la conosce sa che vale più di un grazie.']], gain: { xp: 5 } },
    'bad.hat': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa, e Ortica se ne accorge prima di te. Ricomincia a parlare del merlo, della segale, della moglie del fabbro, e per un quarto d\'ora del cappello non si parla più.']] },
    'good.reply': { good: true, lines: [['narra', 'Era quello che diceva la carta. Ortica annuisce due volte, come quando una ricetta le torna, e ti mette in mano il sacco piegato.']], gain: { xp: 5 } },
    'bad.reply': { good: false, lines: [['narra', 'La carta diceva un\'altra cosa. Ortica dice che sì, va bene, e intanto cambia idea tre volte ad alta voce, e alla fine non si è capito che cosa si riporta al mulino.']] },
  },
  outcomes: {
    perfect: { lines: [
      ['ortica', 'Tieni, questo è per te. Era il nastro del cappello, e visto che il cappello resta al chiodo, almeno il nastro tanto vale che voli.'],
      ['narra', 'È un nastro di velluto rosso scuro, scolorito in un punto solo, dove una mano lo teneva stretto per non far volare via la tesa.'],
    ], reward: { item: 'il nastro del cappello di Ortica', bond: 1, with: 'ortica', xp: 15 } },
    pass: { lines: [['ortica', 'Il mugnaio avrà la sua risposta, e io il mio cappello al chiodo. Qualcosa l\'abbiamo sbagliato, ma con i cappelli vecchi succede.']], reward: { xp: 8, coins: 3 } },
    fail: { lines: [
      ['narra', 'Quando Ortica smette di parlare è notte fonda. Hai in mano due mazzetti di erbe che non ti servono, pagati quattro monete, e il sacco richiuso con il cappello dentro.'],
      ['ortica', 'Riportalo al mugnaio, e digli che stasera non era sera. Lui capisce, è uno che sa aspettare.'],
    ], loss: { coins: 4, bond: 1, with: 'ortica' } },
  },
};
