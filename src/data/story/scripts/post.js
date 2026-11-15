// Optional encounters that reward wandering (one-line worries, a rumour, a little xp) and the
// lines after the ending (Ginepra by the fire, the Minors). Villagers speak through 'narra'.
import { N, T, ginepra, cat, cop, opt, choice, IF, xp, flag, tool } from '../h.js';

const reward = (k) => [xp(5), flag(`enc.${k}`)];

export const POST = {
  'enc.child': [
    N('Un bambino col naso rosso ti fissa. «Sei una strega? La nonna dice che le streghe non hanno ombra.»'),
    choice(
      opt('Mostrargli la mia ombra.', 'm19', 'w', [N('«Ce l\'hai. Allora sei solo strana.» Sembra deluso.')]),
      opt('Fare una faccia spaventosa.', 'm18', 'c', [N('Scappa urlando. Poi torna. «Rifallo.»')]),
    ),
    IF({ lacks: 'm02' },
      [N('«Dietro la tenda della sarta c\'è una carta con una signora seduta. L\'ho vista io.»')],
      [N('«Il bottegaio vende cose che non dovrebbero esserci. Lo dice la mamma.»')]),
    ...reward('child'),
  ],
  'enc.washer': [
    N('Una lavandaia rompe il ghiaccio del secchio. «Il pozzo gela e mio marito russa. Cos\'è peggio?»'),
    choice(
      opt('Il marito.', 'm04', 'p', [N('«Lo sapevo.» Ride, per la prima volta da novembre.')]),
      opt('Il pozzo.', 'm03', 'p', [N('«Allora lo sposo, il pozzo.» Ride, per la prima volta da novembre.')]),
    ),
    IF({ lacks: 'm05' },
      [N('«Nella sala delle riunioni c\'è una Bibbia. Dentro, una carta. Il pastore non lo sa.»')],
      [N('«Comare Malva? Brusca. Ha fatto nascere tutti i miei figli. Sei. Senza dire grazie.»')]),
    ...reward('washer'),
  ],
  'enc.hale': [
    N('Comare Hale, quella delle candele. Ti mette in mano un pacchetto. Non dice niente.'),
    choice(
      opt('«Non dovevate.»', 'm03', 'c', [N('«Dovevo.» Torna al banco senza voltarsi.')]),
      opt('Sorridere e basta.', 'm14', 'c', [N('Ti sorride. Ha le mani che tremano ancora un po\'.')]),
    ),
    N('Nel pacchetto c\'è dell\'incenso. Per calmare chi ti ferma.'),
    tool('incense', 1),
    ...reward('hale'),
  ],
  'enc.gravedigger': [
    N('Un becchino si appoggia alla vanga. «Non guardarmi così. Io li metto giù, non li faccio cadere.»'),
    choice(
      opt('«Non ha paura, qui di notte?»', 'm13', 'c', [N('«Dei morti? No. Dei vivi, un po\'. E dei gatti.»')]),
      opt('«Le serve una mano?»', 'm09', 'p', [N('«Con la vanga? Hai le mani da strega, non da becchino. Ma grazie.»')]),
    ),
    IF({ power: 'cat' }, [cat('(Ha paura di me. Mi piace questo cimitero.)')]),
    IF({ lacks: 'm13' },
      [N('«C\'è una carta tra le lapidi. Uno scheletro a cavallo. Non la tocco: non è mia.»')],
      [N('«Ortica dice che sai tutto. Allora dimmi tu quando tocca a me.» Ride. Tu no.')]),
    ...reward('gravedigger'),
  ],
  'enc.miller': [
    N('Il mugnaio guarda la ruota. «Gira al contrario. Mia moglie dice che bevo. Io dico che è la ruota.»'),
    choice(
      opt('«È la ruota.»', 'm10', 'w', [N('«Visto? Lo dicevo!» Ti offre un sorso. Di cosa, meglio non saperlo.')]),
      opt('«È lei che ha ragione.»', 'm11', 's', [N('«Anche tu?» Sospira. Posa la fiaschetta.')]),
    ),
    IF({ lacks: 'm10' }, [N('«Ogni tanto, tra le pale, vedo una carta che gira. Come la ruota. Al contrario.»')]),
    ...reward('miller'),
  ],
  'enc.guard': [
    cop('Zzz. Eh? Chi è? Non sto dormendo. Sto pensando a occhi chiusi.'),
    choice(
      opt('«Sono il fantasma del pozzo.»', 'm18', 'c', [cop('Ah. Buonasera, fantasma. Io non ho visto niente.')]),
      opt('«Torni a pensare. Io passo.»', 'm00', 'w', [cop('Grazie. Pensare stanca. Lei capisce.')]),
    ),
    IF({ lacks: 'm17' }, [cop('Nel pozzo c\'è una luce, la notte. Una stella. Io non scendo. Io penso.')]),
    ...reward('guard'),
  ],

  // after the ending
  'post.ginepra': [
    IF({ flag: 'post.met' },
      [ginepra('Hai dei doppioni? Io ne ho tre del Due di Coppe. Tre! Il Due! Ironia.')],
      [ginepra('Ci sono altre carte. Cinquantasei! Piccole, nell\'erba alta. Bastoni nel bosco, Coppe al fiume.'),
        ginepra('Spade sulle alture, Denari al mercato. Facciamo a gara? Chi trova i doppioni, li scambia.'),
        flag('post.met')]),
    choice(
      opt('Facciamo a gara.', null, null, [ginepra('Ah ah! Ho già vinto. Cioè, non ancora. Ma vincerò.')]),
      opt('Scambiamo con calma.', null, null, [ginepra('Con calma. Va bene. Io non so cosa vuol dire, ma va bene.')]),
    ),
    T('La Gran Maestra che fa a gara con la sua amica nell\'erba. Va benissimo così.'),
  ],
};
