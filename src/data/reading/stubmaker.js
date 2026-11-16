// Builds the stub voices used only by tests and samples (ids start with "_"; they are not real cards).
import { AMBITI } from '../../reading/ask.js';

const TOPIC = {
  amore: 'una questione di cuore', lavoro: 'una faccenda di lavoro', casa: 'una cosa che riguarda la casa',
  altri: 'un rapporto con gli altri', se: 'un momento tutto tuo',
};
const ROLE_TEXT = {
  situazione: (t, f) => `Stai attraversando ${t} ${f}, e per ora non hai nessuna fretta di cambiare le cose.`,
  origine: (t, f) => `Hai portato avanti ${t} ${f} per parecchio tempo, e da allora le cose sono cambiate poco.`,
  ostacolo: (t, f) => `Ti blocca il modo in cui vivi ${t} ${f}, perché ti riporta sempre allo stesso punto.`,
  arrivo: (t, f) => `Vedrai cambiare ${t} ${f}, e tra qualche tempo ti sembrerà tutto più chiaro.`,
  consiglio: (t, f) => `Affronta ${t} ${f}, senza correre, e dai a ogni cosa il tempo che le serve.`,
};

// flavour: [upright, reversed] phrase; up/rev: { favore, moto }.
export const makeStub = (id, flavour, up, rev) => {
  const side = (flav, meta) => ({
    ...meta,
    ...Object.fromEntries(AMBITI.map((a) => [a, Object.fromEntries(Object.entries(ROLE_TEXT).map(([r, fn]) => [r, fn(TOPIC[a], flav)]))])),
  });
  return { id, up: side(flavour[0], up), rev: side(flavour[1], rev) };
};
