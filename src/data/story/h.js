// Tiny builders for story nodes, so the scripts read like a screenplay.
// Shapes: docs/CONTRACT.md, "Data: story". Nothing here has logic: it only returns plain objects.

export const say = (who, t) => ({ say: who, t });
export const N = (t) => ({ say: 'narra', t }); // the narrator
export const T = (t) => ({ say: 'tu', t }); // the player's thought
export const malva = (t) => say('malva', t);
export const ortica = (t) => say('ortica', t);
export const edera = (t) => say('edera', t);
export const ginepra = (t) => say('ginepra', t);
export const cat = (t) => say('tartufo', t);
export const judge = (t) => say('giudice', t);
export const cop = (t) => say('conestabile', t);
export const reader = (t) => say('lettrice', t);

// one option of a choice: opt('Testo', 'm07', 'w', [nodes], { trust: { ginepra: 1 }, flag: 'x' })
export const opt = (t, card, suit, then = [], extra = {}) => ({ t, ...(card ? { tag: { card, suit } } : {}), then, ...extra });
export const choice = (...options) => ({ choice: options });
export const IF = (cond, then, els) => (els ? { if: cond, then, else: els } : { if: cond, then });

export const xp = (n) => ({ do: 'xp', n });
export const coins = (n) => ({ do: 'coins', n });
export const flag = (k) => ({ do: 'flag', k });
export const trust = (who, n = 1) => ({ do: 'trust', who, n });
export const point = (card, suit) => ({ do: 'point', card, suit });
export const diary = (t) => ({ do: 'diary', t });
export const step = (id) => ({ do: 'step', id });
export const chapter = (n) => ({ do: 'chapter', n });
export const travel = (to) => ({ do: 'travel', to });
export const give = (id) => ({ do: 'giveCard', id });
export const draw = (pool, title) => ({ do: 'draw', mode: 'fan', pool, give: true, title });
export const teach = (spread) => ({ do: 'teach', spread });
export const lesson = (id) => ({ do: 'lesson', id });
export const reading = (spread, client) => ({ do: 'reading', spread, client });
export const exam = (kind, place) => ({ do: 'exam', kind, ...(place ? { place } : {}) });
export const session = (id) => ({ do: 'session', id });
export const power = (id) => ({ do: 'power', id });
export const tool = (id, n = 1) => ({ do: 'tool', id, n });
export const cinema = (lines, pan) => ({ do: 'cinema', lines, ...(pan ? { pan } : {}) });
export const wait = (ms = 600) => ({ do: 'wait', ms });
export const goto = (script) => ({ do: 'goto', script });

// "her card did not move from the birth card": one pair per sign card
export const SIGN_CARDS = ['m04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm11', 'm13', 'm14', 'm15', 'm17', 'm18'];
export const SAME_CARD = { any: SIGN_CARDS.map((c) => [{ birthCard: c }, { yourCard: c }]) };
