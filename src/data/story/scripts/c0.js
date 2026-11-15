// Prologue: the night arrival in the snow and the first card on the road.
// Session s0 (sessions.js) comes before this and turns Il Matto.
import { N, T, cat, opt, choice, IF, xp, flag, diary, step, chapter, draw, cinema, wait } from '../h.js';

// the Majors of the village that can lie on the road (Il Carro is kept for Ginepra)
export const ROAD_POOL = ['m01', 'm02', 'm03', 'm04', 'm05', 'm06'];

export const C0 = {
  'p.road': [
    cinema(['Salem. Inverno. Notte.', 'La neve copre la strada e i passi di chi è passato prima.',
      'Hai una borsa, un nome, e nessuna idea di cosa ti aspetta.'], 'village.arrival'),
    T('Qualcosa brilla nella neve, sul ciglio della strada. Un foglio? Una carta.'),
    choice(
      opt('Raccoglierla subito.', 'm00', 'w', [T('Fredda come un pesce. Ma la tengo.')], { flag: 'p.grab' }),
      opt('Guardarmi intorno, prima.', 'm02', 's', [
        N('Nessuno. Solo i tuoi passi, e quelli piccoli di un gatto.'),
        T('Un gatto. A mezzanotte. Benissimo.'),
      ], { flag: 'p.looked' }),
    ),
    draw(ROAD_POOL, 'Una carta nella neve'),
    N('Nessuno sa da dove arrivino le carte, a Salem.'),
    N('Si dice che arrivino a chi le sa guardare.'),
    choice(
      opt('Allora qualcuno mi aspettava.', 'm00', 'w', [T('O qualcosa. Meglio non pensarci.')]),
      opt('Allora le guarderò bene.', 'm09', 'p', [T('Una alla volta. Con calma. Come i biscotti.')]),
    ),
    wait(500),
    N('Una finestra accesa, in fondo alla via. Sulla porta, a gesso:'),
    N('«MALVA. LEVATRICE. NON BUSSARE.»'),
    IF({ flag: 'p.looked' }, [T('Le orme del gatto vanno proprio lì. Traditore.')]),
    diary('Sono arrivata a Salem con la neve alle caviglie. Ho trovato una carta.'),
    chapter(1),
    step('c1.malva'),
    xp(5),
  ],
  // an idle bark on the road if she walks back to the arrival
  'p.road.again': [
    T('La strada da cui sono arrivata. La neve ha già coperto i miei passi.'),
    IF({ power: 'cat' }, [cat('(Non si torna indietro. Si torna avanti, al massimo.)')]),
    flag('seen.road'),
  ],
};
