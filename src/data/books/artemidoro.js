// Artemidoro di Daldi, «Dell'interpretatione de' sogni», tradotto da Pietro Lauro (Venezia, Giolito, 1547),
// retold in our words. Passages read in the OCR of the 1547 scan (archive.org artemidoro-interpretatione-de-sogni):
// the preface (travels, the despised diviners), I.1-2 (insogni and sogni; speculativi and allegorici), I.31-32
// (teeth), II (wolf and fox, the wolf as the year), IV (the habits of the dreamer), I.75 (judge by likeness).
// The woodcuts are NOT from this book: Hypnerotomachia Poliphili (Venezia 1499), facsimile at the Wellcome.
export default {
  id: 'artemidoro',
  spine: 'Dei sogni',
  title: 'Dell\'interpretatione de\' sogni',
  author: 'Artemidoro di Daldi',
  place: 'Venezia',
  year: 1547,
  leather: '#3a3f63',
  from: 'dalla vedova Bray',
  pages: [
    { img: 'books/artemidoro/1.webp', alt: 'Il frontespizio: il titolo e sotto la fenice dello stampatore, che rinasce dal fuoco', tall: true,
      text: 'Dell\'interpretatione de\' sogni di Artemidoro Daldiano, tradotto di greco in volgare da Pietro Lauro modenese. In Vinegia, appresso Gabriel Giolito de\' Ferrari, 1547.' },
    { img: 'books/artemidoro/2.webp', alt: 'Xilografia: un giovane addormentato sotto un albero, in un prato',
      text: 'Ho letto tutti i libri sui sogni che ho potuto trovare, e per molti anni ho girato le città, in Asia, in Italia e nelle isole piene di gente, ad ascoltare gli indovini di piazza, che tutti disprezzano. Senza ascoltare, questo mestiere non s\'impara.' },
    { img: 'books/artemidoro/3.webp', alt: 'Xilografia: un uomo smarrito in un bosco fitto',
      text: 'Tra insogni e sogni c\'è differenza. L\'insogno dice soltanto quello che c\'è adesso: l\'innamorato sogna l\'amata, chi ha paura vede quello che teme, l\'affamato mangia, e finito il sonno non vale più niente. Il sogno, invece, predice quello che deve venire.' },
    { img: 'books/artemidoro/4.webp', alt: 'Xilografia: un uomo inginocchiato a bere da un ruscello, al limite del bosco',
      text: 'Dei sogni, alcuni sono speculativi e si avverano come si sono visti: uno sognò di fare naufragio, e così gli accadde. Altri sono allegorici: significano una cosa per un\'altra, e mostrano all\'anima qualcosa di oscuro che bisogna sapere leggere.' },
    { img: 'books/artemidoro/5.webp', alt: 'Xilografia: un giovane davanti a un gruppo di donne, vicino a una porta nella roccia',
      text: 'Chi interpreta deve conoscere i costumi di chi sogna, e cercarli con diligenza; e se non conviene domandarli a lui, aspetti e li domandi ad altri. Una volta un sogno non si avverò, e me ne meravigliai, finché seppi le abitudini di chi l\'aveva fatto.',
      note: { by: 'ignota', t: 'Come le carte.' } },
    { img: 'books/artemidoro/6.webp', alt: 'Xilografia: un grande portale antico con colonne e un frontone',
      text: 'La bocca è la casa, e i denti sono quelli che ci abitano. Quelli di sopra sono i più importanti, quelli di sotto i più umili; a destra gli uomini, a sinistra le donne; davanti i giovani, in mezzo quelli di mezza età, in fondo i vecchi. Chi perde un dente, perde una di quelle persone.' },
    { img: 'books/artemidoro/7.webp', alt: 'Xilografia: un giovane tra rovine antiche e palme, e dietro di lui un lupo',
      text: 'Il lupo è un nemico violento e rapace, che ti viene contro a fronte aperta. La volpe è lo stesso, ma non un nemico dichiarato: sono agguati nascosti. Il lupo, però, è anche l\'anno, perché i lupi passano i fiumi uno dopo l\'altro, in fila, come le ore dell\'anno.',
      note: { by: 'ignota', t: 'Tre notti di fila, il lupo. Poi più niente.' } },
    { img: 'books/artemidoro/8.webp', alt: 'Xilografia: due piccoli geni alati che tengono una mela, dentro una cornice',
      text: 'Tenete a mente gli esempi che vi ho dato. Con quelli giudicherete anche i sogni che qui non sono scritti, portando il ragionamento da una cosa a quella che le somiglia.' },
  ],
  truth: {
    text: 'Il libro è vero: Artemidoro di Daldi scrisse sui sogni nel II secolo, e Pietro Lauro lo tradusse in italiano (Venezia, Giolito, 1547); il frontespizio viene da una scansione di Google su Internet Archive. Le figure non sono di questo libro: sono le xilografie della «Hypnerotomachia Poliphili» (Venezia, Aldo, 1499), il romanzo di un sogno, dal facsimile della Wellcome Collection (pubblico dominio). Le parole e le note sono nostre.',
    links: [{ t: 'La traduzione del 1547 su Internet Archive', url: 'https://archive.org/details/artemidoro-interpretatione-de-sogni' },
      { t: 'Il facsimile della Hypnerotomachia', url: 'https://wellcomecollection.org/works?query=b21781059' }],
  },
};
