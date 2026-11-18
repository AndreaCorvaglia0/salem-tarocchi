// Prologue: the night arrival in the snow, the first card on the verge of the road, and the black cat
// who decides to stay. Session s0 (sessions.js) comes before this: it turns Il Matto, sets the step
// p.road and puts her on the road at village.arrival.
import { N, T, cat, o, tg, choice, IF, xp, flag, diary, step, chapter, draw, cinema, power } from '../h.js';

// the Majors of the village that can lie on the road (Il Carro is kept for Ginepra)
export const ROAD_POOL = ['m01', 'm02', 'm03', 'm04', 'm05', 'm06'];

export const C0 = {
  // the tableau where she appears: two calm lines, then she is free to walk
  'p.arrive': [
    cinema([
      "È una notte d'inverno, e a Salem nevica ormai da tre giorni.",
      'Sei arrivata a piedi dalla strada del porto, con una borsa in spalla e il nome di una levatrice che non sa ancora chi sta aspettando.',
    ], 'village.arrival'),
  ],

  // a few steps ahead, on the verge: a thought, a choice, the first card, and Tartufo
  'p.road': [
    T("C'è qualcosa che brilla nella neve, proprio sul bordo della strada. Sembra un foglio, ma è troppo rigido per essere un foglio."),
    choice(
      o('Lo raccolgo subito, prima che la neve lo copra.', { rischio: 1 }, [
        T('È una carta, grande quanto la mia mano e fredda come un sasso di fiume. Chissà da quanto tempo era qui.'),
      ], { flag: 'p.grab', tag: tg('m00', 'w') }),
      o("Prima mi guardo intorno: magari l'ha persa qualcuno.", { rischio: -1 }, [
        N('Sulla strada non c\'è nessuno. Nella neve ci sono soltanto le tue impronte e, accanto, quelle piccole e rotonde di un gatto.'),
        T('Se ha un padrone, non è qui a reclamarla. La raccolgo io, e pazienza.'),
      ], { flag: 'p.looked', tag: tg('m02', 's') }),
    ),
    draw(ROAD_POOL, 'Una carta nella neve'),
    N('A Salem nessuno sa dire da dove vengano queste carte. Chi ne parla lo fa sottovoce, e dice soltanto che arrivano a chi le sa guardare.'),
    choice(
      o('Mi piace pensare che sia arrivata apposta per me.', { guida: 1 }, [
        T('La infilo sotto il mantello, dalla parte del cuore, dove tengo le cose che non voglio perdere.'),
      ], { tag: tg('m00', 'c') }),
      o('Sarà caduta a qualcuno. Però adesso la tengo io.', { guida: -1 }, [
        T('La metto in borsa, tra il pane e le calze di ricambio, che è il posto più sicuro che ho.'),
      ], { tag: tg('m09', 'p') }),
    ),
    N("Quando rialzi gli occhi, seduto in mezzo alla strada c'è un gatto nero che ti guarda. Non ha l'aria di essere capitato lì per caso."),
    IF({ flag: 'p.looked' }, [T('Le impronte nella neve erano le sue, allora. Mi stava guardando da prima che io vedessi la carta.')]),
    cat('Hai trovato una carta la prima sera, e senza nemmeno cercarla. Qui c\'è gente che ci prova da anni. Io mi chiamo Tartufo, e direi che da stanotte mi conviene stare con te.'),
    choice(
      o('Ma tu parli! I gatti non parlano!', { parola: 1 }, [
        cat('I gatti parlano eccome. È che di solito non trovano nessuno con cui valga la pena, e io stasera ho fatto un\'eccezione. Gradirei però che non strillassi.'),
      ], { flag: 'cat.shout', tag: tg('m18', 'c') }),
      o('Buonasera, Tartufo: io mi chiamo {name}.', { tono: 1, parola: -1 }, [
        cat('Piacere mio, {name}: vedo che ti hanno insegnato l\'educazione, ed è già più di quanto mi aspettassi da una che arriva a piedi con questo tempo.'),
      ], { tag: tg('m00', 'w') }),
    ),
    power('cat'),
    cat('Vedi quella finestra accesa, poco più avanti? È la casa di Malva, la levatrice. Sulla porta, dice lei, ha scritto di non bussare, ma tu bussa lo stesso: è così che capisce se una ragazza le serve.'),
    diary('Sono arrivata a Salem di notte, con la neve alle caviglie. Sul bordo della strada ho trovato una carta, e un gatto nero ha trovato me.'),
    chapter(1),
    step('c1.malva'),
    xp(5),
  ],

  // if she walks back to where she arrived
  'p.road.again': [
    T('Questa è la strada da cui sono arrivata. La neve ha già coperto le mie impronte, come se non fossi mai passata di qui.'),
    IF({ power: 'cat' }, [cat('Indietro non si torna, e comunque al porto fa più freddo che qui. Vieni via, che ti prendi un malanno.')]),
    flag('seen.road'),
  ],
};
