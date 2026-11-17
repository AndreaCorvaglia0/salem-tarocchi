// Ortica's garden lessons (docs/DESIGN.md "L'orto insegna davvero"): five short scenes at her herb patch, behind
// the hut. Real plant care for a balcony or a windowsill; every statement is sourced in notes/garden-lessons.md.
// An optional chain (glue/garden.js registers it in core/extras.js and puts Ortica at her hut for each), one
// lesson a day at most. Each scene: she shows something, asks ONE question with three things to do (the right
// one carries `ok: true`; a wrong one is answered by what would happen, and the scene goes on), and ends with
// one thing to do in the player's own garden. Nothing in the text says whether the player is a woman or a man.
// At the end: a diary line, a little XP, the bond with Ortica (+1, as her other side scene gives), and the
// service `garden.lesson`, which marks state.garden.lessons[key] and, after the last one, gives the rare seed.
import { N, ortica, choice, xp, diary, open } from '../h.js';

const right = (t, ...re) => ({ t, ok: true, then: [...re.map((x) => ortica(x)), xp(5)] });
const wrong = (t, ...re) => ({ t, then: re.map((x) => ortica(x)) });
const done = (key, note) => [diary(note), xp(5), { do: 'bond', who: 'ortica', n: 1, why: 'garden.lesson' }, open('garden.lesson', key)];

export const GARDEN_LESSON_SCRIPTS = {
  // ---- 1: water when the soil says so -----------------------------------------------------------
  'garden.lesson.acqua': [
    N('Dietro la capanna Ortica tiene una fila di vasi di coccio e due strisce di terra scura. La trovi china su un vaso di salvia che ha tutte le foglie afflosciate.'),
    ortica('Arrivi al momento giusto, perché il merlo sostiene che questa salvia ha sete. Prima di dargli ragione, però, infila un dito nella terra, fino alla seconda nocca.'),
    N('In superficie la terra è chiara e sembra asciutta, ma più giù il dito la trova fredda e bagnata, e quando lo tiri fuori ti resta attaccata alla pelle.'),
    ortica('Allora dimmelo tu che cosa ne facciamo, visto che le foglie pendono e la terra là sotto è ancora bagnata.'),
    choice(
      wrong('Le do subito un po\' d\'acqua, perché le foglie pendono.',
        'È quello che farebbe il merlo, e la finirebbe di annegare. Una pianta con troppa acqua si affloscia proprio come una che ha sete, perché le radici a mollo marciscono e non bevono più.'),
      right('Aspetto che la terra si asciughi, e intanto non la bagno.',
        'Si aspetta, proprio così. Le foglie flosce le fa anche la troppa acqua, perché le radici a mollo marciscono e non bevono più: per questo io le foglie le guardo, ma poi credo al dito.'),
      wrong('La sposto in pieno sole, così si riprende.',
        'Il sole le piace, ma adesso non è quello che le manca. Ha le radici a mollo, e finché la terra non si asciuga non bevono: la lasciamo in pace qualche giorno, senza bagnarla.'),
    ),
    ortica('Guarda il sottovaso, che è pieno fino all\'orlo da ieri sera per colpa mia. Va vuotato ogni volta dopo aver bagnato, perché un vaso che sta con i piedi nell\'acqua non si asciuga mai.'),
    ortica('Io non ho giorni fissi per bagnare. Quando la terra è asciutta anche là sotto bagno piano e a lungo, finché l\'acqua esce dal buco del vaso, e poi aspetto che si asciughi di nuovo.'),
    ortica('Con poca acqua tutti i giorni le radici restano in superficie, mentre così scendono a cercarla. E l\'acqua va versata sulla terra, ai piedi della pianta, perché le foglie bagnate si ammalano.'),
    ortica('Bagno la mattina presto, oppure la sera se proprio non ho potuto. In pieno giorno, con il sole addosso, buona parte dell\'acqua se ne va in aria prima di arrivare alle radici.'),
    ortica('Stasera, nel tuo orto, tocca la terra prima di prendere l\'annaffiatoio. Se un\'aiuola è ancora bagnata lasciala stare, anche se la pianta ti guarda storto.'),
    ...done('acqua', 'Ortica mi ha fatto vedere come si bagna: tocco la terra con un dito, bagno a fondo soltanto quando è asciutta anche sotto, e vuoto sempre il sottovaso.'),
  ],

  // ---- 2: what the light is, and a plant that asks for it ------------------------------------------
  'garden.lesson.luce': [
    N('Ortica ha messo due vasi di rosmarino uno accanto all\'altro sul ceppo. Uno è basso e fitto, mentre l\'altro ha i rami lunghi e radi, con le foglie di un verde pallido.'),
    ortica('Sono fratelli, nati dallo stesso rametto due primavere fa. Quello fitto è rimasto qui davanti, mentre quello lungo l\'avevo dimenticato dietro la legnaia, e me l\'ha fatto notare il merlo.'),
    N('Li tocchi tutti e due. Quello fitto ha i rami duri e dritti, mentre l\'altro si piega tra le dita come un filo d\'erba.'),
    ortica('Secondo te che cosa gli è mancato, a questo qui con i rami lunghi e pallidi?'),
    choice(
      wrong('Gli è mancata l\'acqua, quindi lo bagnerei di più.',
        'Di acqua ne ha avuta quanta il fratello, e a dargliene di più gli farei marcire le radici. Una pianta che si allunga e impallidisce sta cercando la luce, e dietro la legnaia non ne trovava.'),
      wrong('Gli è mancato il concime, quindi gliene darei un po\'.',
        'La terra è la stessa del fratello, quindi da mangiare ne ha avuto abbastanza. Una pianta che si allunga e impallidisce sta cercando la luce, e dietro la legnaia non ne trovava.'),
      right('Gli è mancata la luce, quindi lo porterei al sole.',
        'La luce, certo. Una pianta che resta al buio si allunga per cercarla, e intanto fa rami deboli, foglie chiare e pochi fiori.'),
    ),
    ortica('Adesso lo rimetto qui davanti, ma i rami lunghi non tornano corti da soli. Glieli accorcerò dopo la fioritura, e quelli nuovi verranno fitti come quelli del fratello.'),
    ortica('Quando dico pieno sole intendo più di sei ore di sole diretto in una giornata d\'estate. La mezz\'ombra sono da tre a sei ore, e sotto le tre per me è ombra, anche se c\'è chiaro.'),
    ortica('In casa conta da che parte guarda la finestra. A sud il sole batte per buona parte del giorno, a est e a ovest per mezza giornata, e a nord non arriva quasi mai.'),
    ortica('Il rosmarino, la lavanda, il timo e la salvia vengono da posti assolati, e vogliono il posto più luminoso che hai. La menta e la melissa invece stanno volentieri anche a mezz\'ombra.'),
    ortica('Domani guarda il tuo orto la mattina, a mezzogiorno e verso sera, e conta per quante ore il sole batte su ogni aiuola. Poi chiediti se ogni pianta sta dove starebbe volentieri.'),
    ...done('luce', 'Ortica mi ha fatto vedere due rosmarini, uno cresciuto al sole e uno all\'ombra. Pieno sole vuol dire più di sei ore di sole diretto, e una pianta che si allunga e impallidisce chiede luce.'),
  ],

  // ---- 3: the soil and the drainage ----------------------------------------------------------------
  'garden.lesson.terra': [
    N('Sul tavolaccio dietro la capanna ci sono un sacco di terriccio, un secchio di ghiaino e qualche vaso vuoto. Ortica ne prende uno, lo capovolge e ti fa vedere il fondo.'),
    ortica('La prima cosa che guardo in un vaso è il buco, perché senza il buco l\'acqua non ha dove andare e le radici restano a mollo. Un vaso senza buco per me è una tazza, e ci tengo il latte.'),
    N('Poi riempie due vasetti, uno con la terra presa dall\'orto e uno con il terriccio mescolato al ghiaino, e versa in tutti e due la stessa acqua.'),
    N('Nel secondo l\'acqua passa subito e gocciola dal fondo. Nel primo resta ferma in cima come in una pozzanghera, e scende così piano che Ortica fa in tempo a sbuffare due volte.'),
    ortica('La terra dell\'orto, chiusa in un vaso, si schiaccia e diventa dura, e l\'acqua non passa più. Quando poi si secca si ritira e si stacca dalle pareti, e bagnarla diventa un\'impresa.'),
    ortica('Adesso c\'è da mettere in vaso questa lavanda, che alle radici non sopporta l\'umido. Tu come glielo prepareresti?'),
    choice(
      wrong('Metto uno strato di sassi sul fondo, e sopra il terriccio.',
        'L\'ho fatto anch\'io per anni, come mia madre, ma i sassi sul fondo non aiutano, perché la terra sopra resta zuppa lo stesso. Il ghiaino serve dentro la terra, mescolato, ed è lì che fa scorrere l\'acqua.'),
      right('Mescolo il ghiaino al terriccio, una parte ogni tre.',
        'Una parte di ghiaino ogni tre di terriccio, mescolate bene: è così che la preparo anch\'io. L\'acqua passa in fretta, e le radici bevono senza restare a mollo.'),
      wrong('Uso soltanto terriccio ricco, così è ben nutrita.',
        'Al basilico piacerebbe, ma la lavanda viene da terre povere e sassose, e in un terriccio ricco resta bagnata troppo a lungo. Per lei ci mescolo del ghiaino, una parte ogni tre di terriccio.'),
    ),
    ortica('La stessa terra magra e sassosa va bene per il rosmarino, il timo e la salvia. Il basilico, il prezzemolo e la menta invece vogliono una terra più ricca, e la menta la vuole anche sempre umida.'),
    ortica('Sotto i vasi che stanno fuori metto due pezzi di coccio, per tenerli sollevati da terra. Così il buco resta libero, e l\'acqua che deve uscire esce davvero.'),
    ortica('Quando torni al tuo orto bagna un\'aiuola, e guarda quanto ci mette l\'acqua a sparire. Se resta lì a fare la pozzanghera, quella non è una terra per la lavanda.'),
    ...done('terra', 'Ortica mi ha fatto vedere perché in vaso non va la terra dell\'orto. Per le piante che amano l\'asciutto si mescola al terriccio una parte di ghiaino ogni tre, e il vaso deve avere il buco.'),
  ],

  // ---- 4: the pot, and the scissors ----------------------------------------------------------------
  'garden.lesson.vaso': [
    N('Ortica è seduta sul ceppo con un vaso di menta rovesciato sulle ginocchia. Dà due colpi sul fondo, e la pianta esce tutta intera, con la forma del vaso.'),
    N('Di terra se ne vede poca. Le radici bianche girano in tondo lungo il fondo, fitte come un gomitolo, e qualcuna era già uscita dal buco.'),
    ortica('Quando le radici girano così, o escono dal buco, la pianta ha finito il posto. La menta lo finisce presto perché corre sotto terra, ed è per questo che la tengo in un vaso tutto suo.'),
    ortica('Le serve un vaso nuovo, e qui ne ho di tutte le misure. Tu che cosa faresti?'),
    choice(
      right('La metto in un vaso appena più largo di questo.',
        'Appena più largo, sì, e al massimo un terzo in più. Le radici lo riempiono presto, e la terra fa in tempo ad asciugarsi tra una bagnata e l\'altra.'),
      wrong('La metto in un vaso grande il doppio, così non ci penso più.',
        'Ci penseresti presto, invece. In un vaso troppo grande c\'è tanta terra senza radici, che resta bagnata a lungo e le fa marcire: meglio uno appena più largo, e cambiarlo più spesso.'),
      wrong('La lascio nel suo vaso, e le do più acqua.',
        'Con le radici così fitte il fondo è tappato, e l\'acqua in più non riuscirebbe nemmeno a uscire. Le serve un vaso appena più largo, con della terra nuova tutto intorno.'),
    ),
    ortica('I vasi li cambio in primavera, quando le piante ripartono. Se posso scelgo il coccio, che asciuga prima della plastica: alla lavanda piace, mentre la menta lì dentro va bagnata più spesso.'),
    N('Poi Ortica ti porta davanti a una lavanda vecchia, che ha i rami bassi grigi e nudi come zampe di gallina, e il verde soltanto in cima.'),
    ortica('Questa l\'ho lasciata fare per troppi anni, e adesso ha le gambe di legno. La lavanda si accorcia ogni anno appena sfiorita, restando nel verde, perché dal legno vecchio non ributta quasi mai.'),
    ortica('Per la salvia vale lo stesso discorso: le tolgo gli steli sfioriti a fine estate e la accorcio un poco in primavera, senza mai arrivare al legno nudo.'),
    ortica('Al basilico invece stacco le cime con due dita, appena sopra una coppia di foglie, perché così si infittisce invece di salire. Alla menta basta raccogliere spesso le punte, e resta bassa e folta.'),
    ortica('Oggi, quando passi dal tuo orto, guarda da vicino i rami bassi di ogni pianta. Se ne trovi una con le gambe di legno vieni a dirmelo, prima di prendere le forbici.'),
    ...done('vaso', 'Ortica mi ha fatto vedere quando si cambia il vaso: le radici girano in tondo o escono dal buco, e quello nuovo è appena più largo. La lavanda si accorcia appena sfiorita, senza toccare il legno vecchio.'),
  ],

  // ---- 5: sowing, and a plant from a twig; the rare seed ---------------------------------------------
  'garden.lesson.semina': [
    N('Sul tavolaccio Ortica ha preparato una cassetta bassa piena di terra fine, una ciotola di semi di calendula ricurvi come piccole falci, e un mazzetto di rametti di rosmarino.'),
    ortica('I semi li spargo radi, e li copro con un velo di terra che non sia più spesso del seme. Quelli fini come polvere li appoggio soltanto e li premo con il palmo, perché a molti serve la luce per nascere.'),
    ortica('Poi la terra deve restare umida come uno straccio strizzato, senza seccare del tutto e senza diventare fango. Quando le piantine si lasciano prendere con due dita, do a ciascuna il suo vasetto.'),
    ortica('Per il rosmarino, la lavanda e la salvia però io non aspetto i semi: stacco un rametto e ne faccio una pianta nuova. Sceglilo tu da questo mazzetto, che sono curiosa.'),
    choice(
      wrong('Prendo quello con i fiori in cima, che è il più bello.',
        'È il più bello, ma un rametto in fiore fa radici a fatica. Quello mettilo in un bicchiere sul tavolo, e per la pianta nuova prendiamo un getto di quest\'anno, senza fiori.'),
      wrong('Prendo il ramo più grosso e legnoso, che è il più forte.',
        'Sembra il più forte, ma io scelgo sempre i getti di quest\'anno, con la base che comincia a indurire e la punta ancora tenera. Sono quelli che ho sempre visto radicare.'),
      right('Prendo un getto giovane, di quest\'anno, senza fiori.',
        'Un getto di quest\'anno e senza fiori, lungo più o meno quanto un dito: è quello che radica più volentieri, e l\'avrei scelto anch\'io.'),
    ),
    ortica('Adesso gli tolgo le foglie in basso, lo taglio appena sotto un nodo e lo infilo in terriccio e sabbia, metà e metà, già bagnati. Resta in un posto luminoso ma senza sole diretto, finché non ha fatto le radici.'),
    ortica('I getti teneri si prendono in primavera, e fanno le radici in poche settimane. A fine estate si prendono quelli un po\' più duri, ed è il momento buono per il rosmarino, la lavanda e la salvia.'),
    ortica('La menta è la più facile di tutte, perché a un suo rametto basta un bicchiere d\'acqua per fare le radici, e poi lo si mette in terra.'),
    N('Ortica fruga nella tasca del grembiule e ne tira fuori un cartoccio piegato in quattro, legato con un filo rosso, che ti mette nel palmo e ti chiude dentro le dita.'),
    ortica('Questo non lo do a chiunque, perché è il seme di una pianta che avvelena, e io ne tengo pochi. In questi giorni però ti ho guardato le mani nella terra, e so che la tratterai con i guanti e con rispetto.'),
    ortica('Mettilo in un\'aiuola libera del tuo orto, coprilo appena e tieni la terra umida finché non spunta. Dopo, ogni volta che la tocchi, mettiti i guanti, anche quando è ancora piccola.'),
    ...done('semina', 'Ortica mi ha insegnato a seminare e a fare una pianta da un rametto senza fiori. Poi mi ha messo in mano un seme che non dà a chiunque, di una pianta velenosa.'),
  ],
};
