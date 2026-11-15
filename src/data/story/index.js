// STUB by the lead; the story agent replaces the whole folder (docs/CONTRACT.md, "Data: story").
export const SCRIPTS = {
  'demo.malva': [
    { say: 'malva', t: 'Chiudi la porta, {name}. Entra il freddo.' },
    { choice: [
      { t: 'Scusa.', tag: { card: 'm14', suit: 'c' }, trust: { malva: 1 }, then: [{ say: 'malva', t: 'Non scusarti. Chiudila.' }] },
      { t: "L'ho chiusa.", tag: { card: 'm04', suit: 's' }, then: [{ say: 'malva', t: 'Allora è il freddo che ce l\'ha con me.' }] } ] },
    { do: 'diary', t: 'Malva non ringrazia mai. Dice che porta male.' },
  ],
};
export const SESSIONS = {
  s0: [{ say: 'lettrice', t: 'Siediti. Non ti chiedo perché sei qui.' }, { ask: 'name' }, { ask: 'birth' }, { turn: 'm00' }, { say: 'lettrice', t: 'Questa sei tu, {name}.' }],
};
export const STEPS = [{ id: 'p.session', chapter: 0, text: 'Sedermi al tavolo.', at: null }, { id: 'c1.malva', chapter: 1, text: 'Bussare da Comare Malva.', at: 'village.malva_door' }];
export const CAST = [{ id: 'malva.home', kind: 'npc', who: 'malva', at: 'malva.hearth', script: 'demo.malva' }];
export const CLIENTS = [{ id: 'c1.widow', name: 'La vedova Bray', look: 'scialle nero', chapter: 1, question: 'Devo vendere il campo?', theme: 'scelta', hello: 'Non dovrei essere qui.', thanks: 'Non ci siamo mai viste.', pay: 5 }];
export const BARKS = { tartufo: [{ when: null, t: 'Miao. (Tradotto: sbrigati.)' }], constable: [{ when: null, t: 'Ferma lì. Due domande.' }], diaryFor: {} };
