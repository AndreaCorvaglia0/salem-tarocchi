// Drawing a card: 'fan' (face-down cards in a fan, she taps one), 'number' (she says a number, the deck
// is cut there), 'top' (the top card turns on tap). Rules: draw.rules.js. Resolves with the card id.
import { h, css } from '../core/dom.js';
import { stat } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { screen, btn, sleep } from './theme.js';
import { cardBack, flipCard } from './cardback.js';
import { weightedPick, weightedSample, numberToCard, numberRange } from './draw.rules.js';

const CSS = `
.sxd{display:flex;flex-direction:column;align-items:center;gap:14px;padding-top:6px}
.sxd-title{margin:0;text-align:center;font-size:23px;font-weight:400}
.sxd-help{margin:0;text-align:center;color:var(--dim);font-size:17px;font-style:italic;min-height:24px}
.sxd-fan{position:relative;width:min(360px,94vw);height:min(390px,50vh);margin-top:8px}
.sxd-fc{position:absolute;left:50%;bottom:0;width:124px;margin-left:-62px;padding:0;border:0;background:none;cursor:pointer;transform-origin:50% 135%;transition:transform .7s cubic-bezier(.3,.1,.2,1),opacity .4s}
.sxd-fc .sxf{width:100%}
.sxd-fc.gone{opacity:0;pointer-events:none}
.sxd-fc.chosen{transform-origin:50% 50%}
.sxd-stage{width:min(190px,48vw)}.sxd-stage .sxb{aspect-ratio:350/600}
.sxd-stack{position:relative;width:min(170px,44vw);aspect-ratio:350/600;margin-top:6px;cursor:pointer;border:0;padding:0;background:none}
.sxd-stack>.sxb,.sxd-stack>.sxf{position:absolute;inset:0}
.sxd-stack .sxb:nth-child(1){transform:translate(-7px,7px)}.sxd-stack .sxb:nth-child(2){transform:translate(-3px,3px)}
.sxd-stack.hold .sxf{animation:sxlift 1.6s ease-in-out infinite}
@keyframes sxlift{50%{transform:translateY(-8px)}}
.sxd-name{text-align:center;font-size:26px;margin:0}
.sxd-name small{display:block;color:var(--dim);font-size:17px;margin-top:2px}
.sxd-num{display:flex;flex-direction:column;align-items:center;gap:12px;width:100%}
.sxd-big{font-family:Georgia,'Times New Roman',serif;font-variant-numeric:lining-nums;font-size:84px;line-height:1;color:var(--gold);text-shadow:0 0 24px #e0b95e55;min-width:2ch;text-align:center}
.sxd-rng{width:100%;max-width:340px;height:48px;accent-color:#e0b95e}
.sxd-pm{display:flex;gap:14px;align-items:center}
.sxd-pm .sx-btn{width:64px;min-height:56px;font-size:28px;padding:0}
`;

const CENTER = { transform: 'translateY(-70px) rotate(0deg) scale(1.55)' };

export async function pick({ mode = 'fan', pool, weights, title, quick = false, rng = Math.random } = {}) {
  css('sxd', CSS);
  const ids = pool?.length ? [...new Set(pool)] : Object.keys(CARD).filter((id) => /^m\d\d$/.test(id));
  const scr = screen({ cls: 'sxdraw' });
  const root = h('div.sxd');
  scr.setBody(root);
  const head = (t, help) => { const p = h('p.sxd-help', help || ''); root.append(h('h2.sxd-title', t || 'Pesca una carta'), p); return p; };
  let id;

  const reveal = async (flip, cardId) => {
    flip.flip(cardId);
    await sleep(800);
    root.append(h('p.sxd-name.sx-in', CARD[cardId]?.name || cardId, CARD[cardId]?.arcana === 'major' ? h('small', `${CARD[cardId].roman || ''}`) : null));
    scr.scrollDown();
  };

  if (mode === 'fan') {
    const n = Math.min(5, ids.length);
    const under = weightedSample(ids, n, weights, rng);
    const help = head(title, 'Tocca la carta che ti chiama.');
    const fan = h('div.sxd-fan');
    root.append(fan);
    const angle = (i) => (n === 1 ? 0 : -26 + (52 * i) / (n - 1));
    const flips = under.map((cid, i) => {
      const f = flipCard(cid);
      const b = h('button.sxd-fc', { type: 'button', 'aria-label': `Carta ${i + 1}`, style: { transform: `rotate(${angle(i)}deg)` } }, f.el);
      fan.append(b);
      return { b, f, cid };
    });
    id = await new Promise((res) => {
      for (const x of flips) x.b.addEventListener('click', () => {
        for (const y of flips) { if (y !== x) y.b.classList.add('gone'); y.b.disabled = true; }
        x.b.classList.add('chosen');
        x.b.style.transform = CENTER.transform;
        help.textContent = '';
        res(x.cid);
        reveal(x.f, x.cid);
      }, { once: true });
    });
    await sleep(1300);
  } else if (mode === 'number') {
    const max = numberRange(ids.length);
    const help = head(title, `Dimmi un numero da uno a ${max}.`);
    let n = Math.ceil(max / 2);
    const big = h('div.sxd-big', String(n));
    const rng_ = h('input.sxd-rng', { type: 'range', min: 1, max, value: n, 'aria-label': 'Numero', oninput: () => { n = Number(rng_.value); big.textContent = String(n); } });
    const step = (d) => { n = Math.min(max, Math.max(1, n + d)); rng_.value = n; big.textContent = String(n); };
    const stage = h('div.sxd-stage', cardBack());
    const num = h('div.sxd-num', big, rng_, h('div.sxd-pm', btn('−', () => step(-1)), btn('+', () => step(1))));
    root.append(num, stage);
    await new Promise((res) => scr.setFoot(btn('Taglia qui', res, 'go')));
    scr.setFoot();
    id = numberToCard(n, ids, weights, max);
    help.textContent = `Tagli il mazzo al ${n}.`;
    num.hidden = true;
    const f = flipCard(id);
    stage.replaceChildren(f.el);
    await sleep(500);
    await reveal(f, id);
    await sleep(900);
  } else {
    id = weightedPick(ids, weights, rng);
    const help = head(title, 'Tocca il mazzo: gira la prima carta.');
    const f = flipCard(id);
    const stack = h('button.sxd-stack.hold', { type: 'button', 'aria-label': 'Gira la carta' }, cardBack(), cardBack(), f.el);
    root.append(stack);
    await new Promise((res) => stack.addEventListener('click', res, { once: true }));
    stack.classList.remove('hold');
    help.textContent = '';
    await reveal(f, id);
    await sleep(quick ? 700 : 400);
  }
  stat('draws');
  if (!quick) await new Promise((res) => scr.setFoot(btn('Tengo questa', res, 'go')));
  scr.close();
  return id;
}
