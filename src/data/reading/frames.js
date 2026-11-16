// Italian frames for the reader's voice: lead-ins, opening, scan sentences, closings.
// Rules for LEADS (see docs/WRITING.md and the tests): a lead-in is put in front of a voice sentence whose
// first letter is lowercased. A lead ending with "," or ":" keeps it; any other lead is followed directly
// by the sentence. Sentences start with very different verbs, so a bare lead must read with every one of
// them: only plain adverbials of time or place are bare. Roles whose sentences are risky (ostacolo,
// consiglio) use leads that end with a comma or a colon. '' means "no lead-in": the sentence stands alone.

// LEADS[group][role]. Groups: base (first step and plain continuation), contrasto (sign flips), svolta (before the last arrivo).
export const LEADS = {
  base: {
    origine: ['Alle tue spalle', 'Nel passato', 'Prima di tutto questo', "All'inizio", '', ''],
    situazione: ['Adesso', 'In questo momento', 'Oggi', 'Ora', '', ''],
    ostacolo: ['Di traverso,', 'Per ora,', 'Intanto,', 'A frenarti c\'è questo:', '', ''],
    arrivo: ['Più avanti', 'Davanti a te', 'Tra non molto', 'Col tempo', '', ''],
    consiglio: ['Se vuoi un consiglio,', 'Il passo da fare è questo:', 'Per ora,', 'Ti dico solo questo:', '', ''],
  },
  contrasto: {
    origine: ['Prima però', 'In passato invece', 'Alle tue spalle invece'],
    situazione: ['Adesso però', 'Oggi invece', 'Ora invece', 'In questo momento però'],
    ostacolo: ['Di traverso però,', 'Per ora però,', 'Intanto però,'],
    arrivo: ['Più avanti invece', 'Davanti a te però', 'Col tempo però', 'Tra non molto invece'],
    consiglio: ['Ti dico però questo:', 'Un consiglio, però:', "Però un passo da fare c'è:"],
  },
  svolta: {
    arrivo: ['E poi', 'Da qui in poi', 'Alla fine', 'Dopo tutto questo'],
  },
};

// Lead-ins for the advice sentence that follows the closing (forms fare and scelta). Same joining rule.
export const ADVICE_LEADS = ['Se vuoi un consiglio,', 'Il passo da fare è questo:', 'Ti dico solo questo:', 'Per ora,'];

// Openings, used only when the request has a detail ({di} = "del campo").
export const OPENINGS = {
  sino: ['Mi chiedi {di}, e vuoi un sì o un no.', 'Mi chiedi {di}: vuoi sapere se è proprio così.'],
  scelta: ['Mi chiedi {di}, e se è il momento di decidere.', 'Mi chiedi {di}: devi scegliere, e vuoi sapere da che parte.'],
  andra: ['Mi chiedi {di}, e come andrà a finire.', 'Mi chiedi {di}: vuoi sapere come andrà.'],
  perche: ['Mi chiedi {di}, e perché è andata così.', 'Mi chiedi {di}: vuoi capire da dove viene.'],
  fare: ['Mi chiedi {di}, e che cosa puoi fare.', 'Mi chiedi {di}: vuoi sapere come muoverti.'],
  quadro: ['Non mi fai una domanda precisa, ma mi parli {di}: guardiamo come stanno le cose.', 'Mi parli {di} senza una domanda, e allora guardiamo insieme come stanno le cose.'],
};

// Suits named in Italian, with the number and gender agreements the scan sentences need.
export const SUIT_TXT = {
  w: { pl: 'Bastoni', tanti: 'Tanti Bastoni', molti: 'molti Bastoni', one: 'un solo Bastone', none: 'nessun Bastone', trait: 'la volontà' },
  c: { pl: 'Coppe', tanti: 'Tante Coppe', molti: 'molte Coppe', one: 'una sola Coppa', none: 'nessuna Coppa', trait: 'il cuore' },
  s: { pl: 'Spade', tanti: 'Tante Spade', molti: 'molte Spade', one: 'una sola Spada', none: 'nessuna Spada', trait: 'la testa' },
  p: { pl: 'Denari', tanti: 'Tanti Denari', molti: 'molti Denari', one: 'un solo Denaro', none: 'nessun Denaro', trait: 'la concretezza' },
};
// The field of the question after "Mi chiedi" and after "una domanda".
export const AMBITO_DI = { amore: "d'amore", lavoro: 'di lavoro', casa: 'di casa', altri: 'degli altri', se: 'di te' };
export const AMBITO_SU = { amore: "sull'amore", lavoro: 'sul lavoro', casa: 'sulla casa', altri: 'sugli altri', se: 'su di te' };

// Scan sentences name what is seen, in the reader's voice. Placeholders: {tanti} {molti} {pl} {one} {none}
// {trait} (of the suit seen), {nativo_one} {nativo_none} (the suit the question calls for), {di} {su}, {numero}, {volte}.
export const SCAN = {
  majors: [
    'Sono uscite molte carte maggiori: sono vicende grandi, di quelle che capitano più di quanto si scelgano.',
    'Le carte maggiori sono più della metà: forze grandi, e meno controllo di quanto vorresti.',
    'Tante carte maggiori insieme: ci sono cose che non dipendono da te.',
  ],
  dominant: [
    '{tanti} insieme: qui comanda {trait}.',
    'Escono soprattutto {pl}, e in questa storia pesa molto {trait}.',
  ],
  foreign: [
    'Mi chiedi {di} e non c\'è {nativo_one}: la questione è un\'altra.',
    'Per una domanda {su} vedo {molti} e {nativo_none}: forse la questione è un\'altra.',
  ],
  missing: [
    'Tra tutte queste non c\'è {nativo_one}: manca del tutto {trait}.',
    'Non esce {nativo_one}, e quello che manca è proprio {trait}.',
  ],
  number: [
    'Si ripete il numero {numero_nome}, {volte}: riguarda {significato}.',
    'Il numero {numero_nome} torna {volte}, e riguarda {significato}.',
  ],
  courts: [
    'Quante figure, tutte insieme: in questa storia c\'è molta gente di mezzo.',
    'Ci sono molte figure, cioè molte persone: non dipende da te soltanto.',
  ],
  reversed: [
    'Più di metà sono rovesciate: c\'è molto di trattenuto, o di non detto.',
    'Tante rovesciate: l\'energia c\'è, ma resta bloccata o arriva in ritardo.',
  ],
};

export const NUMERO_NOME = { 1: 'uno', 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque', 6: 'sei', 7: 'sette', 8: 'otto', 9: 'nove', 10: 'dieci' };
export const VOLTE = { 2: 'due volte', 3: 'tre volte', 4: 'quattro volte', 5: 'cinque volte' };
// Number -> phrase that follows "riguarda" / "parla di".
export const NUMERI = {
  1: 'un nuovo inizio',
  2: 'una scelta tra due strade',
  3: 'qualcosa che cresce',
  4: 'il bisogno di stabilità',
  5: 'un cambiamento che scuote',
  6: 'uno scambio che trova equilibrio',
  7: 'una prova di pazienza',
  8: 'un lavoro che avanza',
  9: 'una cosa quasi finita',
  10: 'un compimento',
};

// CLOSINGS[forma][code]: four variants. A variant with {di} is used only when the request has a detail,
// so every cell keeps at least two plain variants.
export const CLOSINGS = {
  sino: {
    si: ['Alla tua domanda rispondo di sì.', 'A proposito {di}, la risposta è sì.', 'La risposta è sì, e puoi andare avanti con serenità.', 'Parlando {di}, posso dirti di sì.'],
    si_piano: ['Rispondo di sì, ma con calma: non è una cosa da fare di corsa.', "A proposito {di}, la risposta è sì, ma ci vorrà un po' di tempo.", 'La risposta è sì, però non adesso e non in fretta.', "Parlando {di}, direi di sì, ma lasciando passare un po' di tempo."],
    dipende: ['Non posso dirti né sì né no, perché dipende da quello che farai tu.', 'A proposito {di}, la risposta non è già scritta e dipende da te.', 'La risposta non è ancora decisa, e a deciderla sarai tu.', "Parlando {di}, non c'è un sì o un no già pronto, perché dipende da te."],
    no_cosi: ["Così com'è rispondo di no, ma qualcosa può ancora cambiare.", 'A proposito {di}, per ora la risposta è no, anche se non è detta per sempre.', 'Per adesso la risposta è no, ma le cose possono ancora muoversi.', "Parlando {di}, così com'è direi di no, ma non è l'ultima parola."],
    no: ['Alla tua domanda rispondo di no.', 'A proposito {di}, la risposta è no, ed è meglio che tu lo sappia adesso.', 'La risposta è no, ed è meglio saperlo subito che sperarci a lungo.', 'Parlando {di}, devo dirti di no.'],
  },
  scelta: {
    si: ['Se devi scegliere, scegli e vai: il momento è buono.', 'A proposito {di}, puoi decidere senza paura, perché il momento è buono.', 'Puoi decidere adesso, perché le cose sono dalla tua parte.', 'Parlando {di}, io deciderei adesso, e con fiducia.'],
    si_piano: ['Puoi andare, ma fai un passo alla volta.', 'A proposito {di}, puoi decidere, ma senza correre.', "La scelta è buona, però non c'è bisogno di farla di fretta.", "Parlando {di}, vai pure, ma un po' alla volta."],
    dipende: ['Aspetta ancora un poco, finché non ti è più chiaro.', 'A proposito {di}, aspetta ancora un poco prima di decidere.', 'Non scegliere oggi, perché ti manca ancora qualcosa per farlo bene.', "Parlando {di}, prenditi un altro po' di tempo prima di rispondere."],
    no_cosi: ["Così com'è non ti consiglio di farlo: aspetta che cambi qualcosa.", 'A proposito {di}, non decidere adesso e aspetta che cambi qualcosa.', 'Per ora non farlo, ma tieni aperta la possibilità di tornarci.', 'Parlando {di}, per ora meglio di no, ma ne puoi riparlare più avanti.'],
    no: ['Lascia stare: non è il momento e non lo sarà a breve.', 'A proposito {di}, io lascerei stare, perché adesso non conviene.', 'Non farlo, perché da questa strada non ti arriva niente di buono.', 'Parlando {di}, la mia risposta è di lasciar perdere.'],
  },
  andra: {
    si: ['Andrà bene, meglio di come temi.', 'A proposito {di}, andrà bene, meglio di come temi.', 'Alla fine andrà a finire bene, e ti toglierai un peso.', 'Parlando {di}, le cose si metteranno bene.'],
    si_piano: ['Andrà bene, ma ci vorrà più tempo di quanto pensi.', 'A proposito {di}, andrà bene, ma non subito.', 'Andrà bene, però dovrai avere pazienza.', 'Parlando {di}, le cose si sistemeranno, ma piano piano.'],
    dipende: ['Può andare in due modi, e la differenza la farai tu.', 'A proposito {di}, può andare in due modi, e dipende da te.', 'Non è già scritto come andrà, perché conterà molto quello che farai.', 'Parlando {di}, la strada si divide, e sceglierai tu da che parte andare.'],
    no_cosi: ["Se non cambi qualcosa andrà male, ma c'è ancora tempo.", "A proposito {di}, così non andrà bene, ma c'è ancora tempo per cambiarla.", "Così com'è la strada non porta dove speri, ma si può correggere.", "Parlando {di}, se tutto resta com'è non andrà bene, ma c'è ancora margine."],
    no: ['Non andrà come speri, ed è meglio che tu lo sappia adesso.', 'A proposito {di}, non andrà come speri, e conviene prepararsi.', 'Non andrà come speri, ma sapendolo adesso puoi proteggerti.', 'Parlando {di}, non vedo andare le cose come vorresti.'],
  },
  perche: {
    si: ['Il perché sta lì, in quello che hai alle spalle, e la cosa si sta già sistemando.', 'Quello che è successo nasce da quello che hai alle spalle, e adesso si sta aggiustando.', 'A proposito {di}, il perché è nel passato, e ormai si sta aggiustando.', 'Parlando {di}, tutto nasce da prima, e adesso le cose si stanno sistemando.'],
    si_piano: ['Il perché sta lì, in quello che hai alle spalle, e col tempo si sistemerà.', "La causa è nel passato, e con un po' di pazienza le cose si rimetteranno a posto.", 'A proposito {di}, il perché è nel passato, e col tempo si sistemerà.', 'Parlando {di}, tutto nasce da prima, e con pazienza si rimetterà a posto.'],
    dipende: ['Il perché sta lì, in quello che hai alle spalle, ma cosa ne farai adesso dipende da te.', 'La causa è nel passato, e quello che succederà dipende da come la prendi.', 'A proposito {di}, il perché è nel passato, e il resto dipende da te.', 'Parlando {di}, tutto nasce da prima, e adesso sta a te decidere cosa farne.'],
    no_cosi: ['Il perché sta lì, in quello che hai alle spalle, e finché non lo affronti tornerà a farsi sentire.', 'La causa è nel passato, e se non la guardi in faccia si ripeterà.', 'A proposito {di}, il perché è nel passato, e finché non lo affronti si ripeterà.', 'Parlando {di}, tutto nasce da prima, e va guardato in faccia per non ripetersi.'],
    no: ['Il perché sta lì, in quello che hai alle spalle, ed è una cosa che non si cambia in fretta.', 'La causa è nel passato ed è profonda, quindi non pretendere di risolverla in poco tempo.', 'A proposito {di}, il perché è nel passato ed è profondo, quindi ci vorrà tempo.', 'Parlando {di}, tutto nasce da molto prima, e non si cambia in poco tempo.'],
  },
  fare: {
    si: ['La strada è buona, e puoi muoverti con fiducia.', 'A proposito {di}, vai avanti con fiducia, perché la strada è buona.', 'Muoviti con fiducia, perché le cose sono dalla tua parte.', 'Parlando {di}, puoi fare il passo senza paura.'],
    si_piano: ['Si può fare, ma un passo alla volta.', 'A proposito {di}, muoviti con calma e non avere fretta.', 'Puoi muoverti, ma senza fretta e guardando dove metti i piedi.', 'Parlando {di}, vai avanti piano e vedrai che basta.'],
    dipende: ['Quello che puoi fare è ascoltarti ancora un poco, e poi deciderai tu.', 'A proposito {di}, prima di muoverti ascolta cosa hai dentro, e poi deciderai tu.', 'Prima di fare qualcosa prenditi il tempo di capire cosa vuoi davvero.', "Parlando {di}, ti conviene aspettare un po' di chiarezza prima di agire."],
    no_cosi: ['Per ora non spingere, perché così le cose si complicano.', 'A proposito {di}, per ora non forzare niente, perché così le cose si complicano.', 'Per ora non forzare niente, e aspetta che il momento giri.', 'Parlando {di}, per adesso evita le mosse brusche.'],
    no: ['Non fare niente adesso, e lascia che le cose si calmino.', "A proposito {di}, adesso fermati e lascia che passi un po' di tempo.", 'Ferma tutto per ora, e lascia che le cose si assestino da sole.', 'Parlando {di}, la mossa migliore adesso è non muoversi.'],
  },
  quadro: {
    si: ['Nel complesso è un buon momento, e ti conviene approfittarne.', 'A proposito {di}, vedo le cose andare nella direzione giusta.', 'Per quello che vedo, le cose stanno andando nella direzione giusta.', 'Parlando {di}, è un buon momento e conviene approfittarne.'],
    si_piano: ['Nel complesso le cose vanno bene, ma si muovono con calma.', 'A proposito {di}, vedo cose buone, ma arrivano piano.', 'Per quello che vedo, il buono arriverà, ma piano.', 'Parlando {di}, le cose vanno bene, anche se senza fretta.'],
    dipende: ['Nel complesso la situazione è aperta, e molto dipenderà da te.', 'A proposito {di}, la situazione è aperta, e molto dipenderà da te.', 'Per quello che vedo, ci sono cose buone e cose difficili, e nessuna delle due prevale.', 'Parlando {di}, vedo cose buone e cose difficili in parti uguali.'],
    no_cosi: ['Nel complesso il momento è faticoso, ma si può ancora aggiustare.', 'A proposito {di}, il momento è faticoso, ma non è detto che resti così.', 'Per quello che vedo, ci sono più difficoltà che aiuti, ma niente è deciso.', "Parlando {di}, vedo parecchia fatica, ma c'è ancora spazio per cambiare."],
    no: ['Nel complesso è un momento pesante, e conviene andarci piano.', 'A proposito {di}, è un periodo pesante, e conviene andarci piano.', 'Per quello che vedo, questo è un periodo difficile, e passerà con il tempo.', 'Parlando {di}, vedo un momento duro, che col tempo passerà.'],
  },
};
