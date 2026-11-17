// PROTOTYPE: the pencil symbols of the optional things on the grimoire's map, one per kind (titles.js KIND),
// plus the ink star of the main story. Each is an SVG path on a 24 x 24 box centred at 12,12, drawn with a
// soft pencil stroke; on the map it sits on a small slip of paper pinned beside its place (page.js), so it
// never reads as one of the place drawings (ink, no paper behind) or as the red marks (circle, «io»).
const P = {
  // a card standing a little tilted, a small star on its face
  carta: 'M7 4.5 L16.5 3.5 L18 19.5 L8.5 20.5 Z M12.6 8.6 L13.3 10.9 L15.6 11 L13.8 12.4 L14.4 14.7 L12.5 13.4 L10.6 14.8 L11.2 12.5 L9.4 11.1 L11.8 10.9 Z',
  // an open book
  lezione: 'M12 7 C9 5 6 5 3.5 6 L3.5 18.5 C6 17.5 9 17.5 12 19.5 C15 17.5 18 17.5 20.5 18.5 L20.5 6 C18 5 15 5 12 7 Z M12 7 L12 19.5',
  // a candle with its flame
  prova: 'M9 21 L9 11 L15 11 L15 21 Z M7 21 L17 21 M12 11 L12 9.5 M12 9.5 C9.6 7.6 10.8 5 12 2.8 C13.2 5 14.4 7.6 12 9.5 Z',
  // a sprout: two leaves on a stem
  orto: 'M12 21 L12 10 M12 14 C8 14 5.5 11.5 5 7.5 C9 7.5 11.5 10 12 14 M12 11.5 C12.5 7.5 15 5 19 4.5 C18.6 8.6 16 11.2 12 11.5 M8 21 L16 21',
  // a spiral: a door to somewhere else
  altrove: 'M12 12 C12 10.6 13.8 10.6 13.8 12 C13.8 14 10.4 14 10.4 12 C10.4 8.8 15.6 8.8 15.6 12 C15.6 16.4 8.4 16.4 8.4 12 C8.4 6.6 17.6 6.6 17.6 12 C17.6 18.6 6.4 18.6 6.4 12 C6.4 7 9 4.4 12 4',
  // a speech bubble with three dots: somebody's small story
  storia: 'M4 6 C4 4.5 5 3.8 6.5 3.8 L17.5 3.8 C19 3.8 20 4.5 20 6 L20 13.5 C20 15 19 15.8 17.5 15.8 L10 15.8 L6 20 L7 15.8 L6.5 15.8 C5 15.8 4 15 4 13.5 Z M8.5 9.8 L8.6 9.9 M12 9.8 L12.1 9.9 M15.5 9.8 L15.6 9.9',
  // the main story: a five-pointed star
  storiaMain: 'M12 2.5 L14.6 9 L21.5 9.3 L16.1 13.6 L18 20.5 L12 16.6 L6 20.5 L7.9 13.6 L2.5 9.3 L9.4 9 Z',
  // a tick, for a thing done since the grimoire was last opened
  fatta: 'M5 13 L10 18 L19 6',
};
export const SYMBOLS = Object.keys(P);

const NS = 'http://www.w3.org/2000/svg';
// an <svg> of a symbol; size in px, colour a CSS colour
export function symbol(kind, { size = 22, color = '#5b5246', width = 1.7, fill = 'none' } = {}) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', P[kind] || P.carta);
  p.setAttribute('fill', fill); p.setAttribute('stroke', color); p.setAttribute('stroke-width', width);
  p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
  s.append(p);
  return s;
}
