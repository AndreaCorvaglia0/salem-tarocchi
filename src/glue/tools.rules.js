// Words for the sieve: which way the nearest hidden card lies, from a tile offset (dx right, dy down).
export const BOTTLE_MS = 3 * 60000;

export function direction(dx, dy) {
  if (!dx && !dy) return 'proprio qui, sotto i tuoi piedi';
  const ns = dy < -0.5 * Math.abs(dx) ? 'nord' : dy > 0.5 * Math.abs(dx) ? 'sud' : '';
  const ew = dx > 0.5 * Math.abs(dy) ? 'est' : dx < -0.5 * Math.abs(dy) ? 'ovest' : '';
  const where = ns && ew ? `a ${ns}-${ew}` : `a ${ns || ew}`;
  return where;
}
export function distance(d) { return d <= 3 ? 'vicinissima' : d <= 8 ? 'vicina' : d <= 16 ? 'a qualche passo' : 'lontana'; }
export function sieveLine(h) {
  if (!h) return 'Il setaccio non trema. Qui non c\'è nessuna carta nascosta: prova in un altro luogo.';
  if (h.dist < 0.5) return 'Il setaccio trema forte: la carta è proprio qui. Guarda bene.';
  return `Le cesoie si girano ${direction(h.dx, h.dy)}. La carta è ${distance(h.dist)}.`;
}
