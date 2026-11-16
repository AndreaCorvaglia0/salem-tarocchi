// The library's book (docs/DESIGN.md, "La biblioteca"), on the grimoire's paper. The first page lists what a
// witch or Tartufo sensed for the coming trial (three or four topics, of which about two are really needed)
// and, below, everything she can go over («Ripasso»). A topic opens one short page made of what the game
// already knows (src/trials/topics.js) and two quick questions; finishing them marks the topic as fresh
// (state.studied) and gives a little xp once per topic per day. openLibrary({ trial, topics }) -> Promise.
import { h, css, cardUrl } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { addXp, todayKey } from '../core/progress.js';
import { topicTitle, topicPage, topicQuestions, taughtTopics, isTopic, isFresh, studyXp } from '../trials/topics.js';
import { INK, PENCIL, RED } from './paper.js';
import { openSheet } from './sheet.js';

const CSS = `
.lb-list{list-style:none;padding:0;margin:8px 0 0!important}
.lb-list li{line-height:30px}
.lb-list .ok{color:${PENCIL};font-size:18px;margin-left:6px}
.lb-intro{margin-top:6px!important}
.lb-cards{display:flex;gap:10px;margin:12px 0 4px}
.lb-cards i{display:block;width:62px;aspect-ratio:350/600;border-radius:4px;background:#2a2430 center/cover no-repeat;box-shadow:0 2px 6px #5a452c88;border:2px solid #fbf5e6}
.lb-cards i.rev{transform:rotate(180deg)}
.lb-rows{list-style:none;padding:0;margin:8px 0 0!important}
.lb-rows li{line-height:26px;margin-bottom:6px}
.lb-rows b{font-weight:700}
.lb-q{margin-top:16px}
.lb-q .pr{font-weight:700}
.lb-q .opts{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.lb-q .opts button{min-height:46px;padding:6px 12px;border-radius:12px 9px 13px 10px;border:2px solid ${INK}55;background:#f8f0dc;color:${INK};font:inherit;font-size:20px;line-height:24px;text-align:left;cursor:pointer}
.lb-q .opts button.ok{border-color:#3d7a52;background:#dfeccf}
.lb-q .opts button.no{border-color:${RED};background:#f1d6cc}
.lb-q .opts button:disabled{cursor:default}
.lb-q .sh{display:block;width:58px;aspect-ratio:350/600;margin:6px 0;border-radius:4px;background:#2a2430 center/cover no-repeat;border:2px solid #fbf5e6}
.lb-q .sh.rev{transform:rotate(180deg)}
.lb-done{margin-top:14px!important;color:${RED}}
`;

export function openLibrary({ trial = null, topics = [] } = {}) {
  css('ui-library', CSS);
  let open = null; // the topic shown, or null for the list
  const shown = topics.filter(isTopic);
  return openSheet({
    label: 'La biblioteca', mid: 'La biblioteca',
    build: (sheet) => {
      const link = (t) => h('li', h('button.gx-link', { type: 'button', onclick: () => { open = t; sheet.refill(); } },
        h('span.ar', { 'aria-hidden': 'true' }, '→'), h('span.t', {}, topicTitle(t))), isFresh(t, state) ? h('span.ok', {}, '(ripassato)') : null);
      if (!open) {
        const all = taughtTopics(state).filter((t) => !shown.includes(t));
        const L = [h('h2', {}, 'La biblioteca')];
        if (trial && shown.length) L.push(h('p.lb-intro', {}, `Prima di «${trial.title}» conviene ripassare queste cose:`), h('ul.lb-list', shown.map(link)));
        else L.push(h('p.lb-intro.pencil', {}, 'Per ora non c\'è niente in vista. Posso ripassare quello che voglio.'));
        const R = [h('h3', {}, 'Ripasso'), all.length ? h('ul.lb-list', all.map(link)) : h('p.pencil', {}, 'Non ho ancora niente da ripassare.')];
        return { L, R, single: true };
      }
      const p = topicPage(open);
      const back = h('button.gx-link', { type: 'button', onclick: () => { open = null; sheet.refill(); } }, h('span.ar', { 'aria-hidden': 'true' }, '←'), h('span.t', {}, 'Torno all\'elenco'));
      const L = [back, h('h2', {}, p.title),
        p.cards.length ? h('div.lb-cards', p.cards.map((c) => h(`i${c.rev ? '.rev' : ''}`, { style: { backgroundImage: `url(${cardUrl(c.id)})` } }))) : null,
        ...p.paras.map((t) => h('p', {}, t)),
        p.rows.length ? h('ul.lb-rows', p.rows.map((r) => h('li', h('b', {}, `${r.k}: `), r.v))) : null];
      const R = [h('h3', {}, 'Due domande')];
      const qs = topicQuestions(open, Math.random);
      const topic = open;
      let answered = 0;
      const done = h('p.lb-done', {}, '');
      qs.forEach((q) => {
        const box = h('div.lb-q', h('p.pr', {}, q.prompt), q.show ? h(`i.sh${q.show.rev ? '.rev' : ''}`, { style: { backgroundImage: `url(${cardUrl(q.show.id)})` } }) : null);
        const opts = h('div.opts');
        const btns = q.options.map((o) => h('button', { type: 'button', onclick: () => {
          btns.forEach((b, i) => { b.disabled = true; if (q.options[i].ok) b.classList.add('ok'); });
          if (!o.ok) btns[q.options.indexOf(o)].classList.add('no');
          if (++answered === qs.length) {
            const today = todayKey(), xp = studyXp(topic, state, today);
            state.studied[topic] = Date.now();
            if (xp) { state.studiedXp[topic] = today; addXp(xp, 'study'); }
            save();
            done.textContent = xp ? `Ripassato. +${xp} punti esperienza.` : 'Ripassato.';
          }
        } }, o.t));
        opts.append(...btns);
        box.append(opts);
        R.push(box);
      });
      R.push(done);
      return { L, R, single: true };
    },
  });
}
