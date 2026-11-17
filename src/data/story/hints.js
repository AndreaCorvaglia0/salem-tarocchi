// Interface lines, outside the fiction (docs/WRITING.md, rule 7): one plain sentence each, shown once
// near the bottom of the screen (ui/hint.js), written for someone who has never played a game.
// HINTS is the touch wording; HINTS_KEYS replaces it where there is a keyboard and no touch screen.
// Which hint is shown when: notes/story.md, "Hints I need".
export const HINTS = {
  move: "Per camminare, tocca il punto della strada dove vuoi andare.",
  action: "Quando sei vicina a una persona o a una cosa, tocca il pulsante in basso per parlarle o per prenderla.",
  grimoire: "La carta adesso è nel tuo grimorio: tocca il libro in alto per aprirlo.",
  exam: "Scegli con calma la risposta che ti sembra giusta: non c'è fretta, ma ogni errore fa crescere il sospetto.",
  reading: "Per ogni carta scegli prima l'idea che porta, poi che cosa vuol dire per chi hai davanti.",
  tap: "Quando hai finito di leggere, tocca lo schermo per andare avanti.",
  detail: "Tocca il punto dell'immagine che ti colpisce di più: qui non ci sono scelte sbagliate.",
  words: "Scrivi tre parole tue per questa carta, le prime che ti vengono in mente.",
  number: "Tocca un numero da uno a ventidue.",
  guide: "Se non sai dove andare, tocca il foglietto in alto: una scia di luci ti mostrerà la strada.",
  patrol: "Se un conestabile ti vede ti ferma: per evitarlo, resta fuori dalla sua luce.",
  draw: "Tocca una delle carte coperte per sceglierla.",
  shop: "Tocca un oggetto per vedere quanto costa: le monete si guadagnano leggendo le carte a chi bussa alla capanna.",
  map: "Nel grimorio c'è una mappa: il cerchio rosso segna il posto dove devi andare.",
  book: "Puoi riaprire il grimorio quando vuoi, toccando il libro in alto.",
  rank: "Per crescere leggi le carte ai clienti, ripassa quelle che hai e cercane di nuove: la barra in alto dice quanto manca.",
  side: "Sulla mappa del grimorio è comparso un foglietto appuntato: è una cosa in più, da fare se ti va, e toccandolo la leggi.",
  fly: "Adesso sai volare: apri la mappa nel grimorio e tocca un posto all'aperto che hai già visto.",
  lesson: "Nel grimorio, sulla mappa, c'è un foglietto nuovo: toccalo per leggerlo, e poi seguilo se ti va.",
  trade: "Tocca un tuo doppione e poi la carta di Ginepra che vuoi in cambio.",
  // the trials (shown by glue/trials.js when it asks for them)
  trial: "A ogni bivio pesca una carta: è lei a dirti quale strada prendere, e ogni errore si paga.",
  library: "Tocca uno dei primi argomenti dell'elenco per ripassarlo: ti servirà nella prossima prova.",
  news: "Sulla mappa del grimorio c'è un foglietto nuovo: è una prova, toccalo per sapere dove comincia.",
  escape: "Tocca la strada per correre verso la luce: se ti fermi, chi ti insegue ti raggiunge.",
};
export const HINTS_KEYS = {
  move: "Per camminare usa le frecce della tastiera, oppure fai clic sul punto dove vuoi andare.",
  action: "Quando sei vicina a una persona o a una cosa, premi la barra spaziatrice per parlarle o per prenderla.",
  grimoire: "La carta adesso è nel tuo grimorio: fai clic sul libro in alto per aprirlo.",
  tap: "Quando hai finito di leggere, premi la barra spaziatrice o fai clic per andare avanti.",
  detail: "Fai clic sul punto dell'immagine che ti colpisce di più: qui non ci sono scelte sbagliate.",
  number: "Fai clic su un numero da uno a ventidue.",
  guide: "Se non sai dove andare, fai clic sul foglietto in alto: una scia di luci ti mostrerà la strada.",
};
