// The request: two labels (ambito, forma), a short either/or tree to find them, and the question object.

export const AMBITI = ['amore', 'lavoro', 'casa', 'altri', 'se'];
export const FORME = ['sino', 'scelta', 'andra', 'perche', 'fare', 'quadro'];

export const AMBITO_LABEL = {
  amore: 'Amore',
  lavoro: 'Lavoro e denaro',
  casa: 'Casa e famiglia',
  altri: 'Gli altri',
  se: 'Te e la tua strada',
};
export const FORMA_LABEL = {
  sino: 'Un sì o un no',
  scelta: 'Una scelta',
  andra: 'Come andrà',
  perche: 'Il perché',
  fare: 'Cosa fare',
  quadro: 'Un quadro generale',
};

// A node is { q, options: [{ label, set?, next? }, { ... }] }. An option may set part of the result
// (`set`) and lead to another node (`next`); the walk ends when there is no `next`.
const opt = (label, set, next) => ({ label, set, next });

// Second half: the form. Three taps at most.
const FORMA_TREE = {
  q: 'La tua domanda guarda avanti, o vuoi capire come stanno le cose?',
  options: [
    opt('Guarda avanti', null, {
      q: 'Ti basta un sì o un no?',
      options: [
        opt('Sì, mi basta', { forma: 'sino' }),
        opt('No, voglio di più', null, {
          q: 'Vuoi sapere come andrà, o hai una scelta da fare?',
          options: [opt('Come andrà', { forma: 'andra' }), opt('Una scelta', { forma: 'scelta' })],
        }),
      ],
    }),
    opt('Voglio capire', null, {
      q: 'Hai una domanda precisa?',
      options: [
        opt('No, guarda tu', { forma: 'quadro' }),
        opt('Sì', null, {
          q: 'Cerchi il perché di qualcosa, o cosa fare?',
          options: [opt('Il perché', { forma: 'perche' }), opt('Cosa fare', { forma: 'fare' })],
        }),
      ],
    }),
  ],
};

// First half: the field. Three taps at most, then the form questions follow.
export const TREE = {
  q: 'Riguarda una persona o una cosa tua?',
  options: [
    opt('Una persona', null, {
      q: 'È qualcuno a cui tieni in modo speciale?',
      options: [
        opt('Sì', { ambito: 'amore' }, FORMA_TREE),
        opt('No', null, {
          q: 'È qualcuno della tua famiglia o di casa?',
          options: [opt('Sì', { ambito: 'casa' }, FORMA_TREE), opt('No', { ambito: 'altri' }, FORMA_TREE)],
        }),
      ],
    }),
    opt('Una cosa mia', null, {
      q: 'Si tratta di lavoro, di soldi o di un impegno?',
      options: [
        opt('Sì', { ambito: 'lavoro' }, FORMA_TREE),
        opt('No', null, {
          q: 'Riguarda la casa e la famiglia?',
          options: [opt('Sì', { ambito: 'casa' }, FORMA_TREE), opt('No, riguarda me', { ambito: 'se' }, FORMA_TREE)],
        }),
      ],
    }),
  ],
};

// Follow answers (0 or 1 per question). Returns { done, node, ambito, forma }:
// `node` is the next question to ask (null when done).
export const walk = (tree, answers = []) => {
  let node = tree;
  let result = {};
  for (const a of answers) {
    if (!node) throw new Error('walk: more answers than questions');
    const chosen = node.options[a];
    if (!chosen) throw new Error(`walk: bad answer ${a}`);
    result = { ...result, ...chosen.set };
    node = chosen.next ?? null;
  }
  return { done: node === null, node, ambito: result.ambito ?? null, forma: result.forma ?? null };
};

// Every path of the tree with the pair it ends on (used by tests and by the lead to check coverage).
export const allPaths = (tree) => {
  const out = [];
  const go = (node, path, result) => {
    node.options.forEach((o, a) => {
      const next = { ...result, ...o.set };
      if (o.next) go(o.next, [...path, a], next);
      else out.push({ path: [...path, a], ambito: next.ambito, forma: next.forma });
    });
  };
  go(tree, [], {});
  return out;
};

// ref (optional): { di: 'del campo', chi: 'tuo marito' }
export const makeQuestion = ({ ambito, forma, ref } = {}) => {
  if (!AMBITI.includes(ambito)) throw new Error(`makeQuestion: unknown ambito "${ambito}"`);
  if (!FORME.includes(forma)) throw new Error(`makeQuestion: unknown forma "${forma}"`);
  const q = { ambito, forma };
  if (ref && (ref.di || ref.chi)) q.ref = { ...ref };
  return q;
};
