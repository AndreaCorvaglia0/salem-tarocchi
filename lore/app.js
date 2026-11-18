// The lore viewer: reads data.json once (built from lore/ by scripts/lore/site.mjs) and shows the vault
// with hash routes, so the back button works and a link can be shared:
//   #/  home · #/n/<id> a note · #/t/<tipo> a list · #/grafo[/<id>] the whole graph · #/cerca/<q> search
import { md, inline, esc } from './md.js?v=1794985176491';
import { graphView } from './graph.js?v=1794985176491';
import { layout } from './layout.js?v=1794985176491';

const app = document.getElementById('app');
const FONTI = ['copione', 'deciso', 'proposto'];
const HIDDEN_FIELDS = ['non_affiora', 'non_direbbe_mai'];
const HIDDEN_MARK = '<span class="hid" title="Canone nascosto: serve a chi scrive, non compare nel gioco">nascosto: non si dice nel gioco</span>';
let D = null, byId = new Map(), T = new Map(), hay = new Map(), deg = new Map();
let graphOn = null; // the types shown in the full graph (kept while the page is open)
let current = null; // the graph view on screen, destroyed on the next render

// ---------- small helpers ----------
const fold = (s) => String(s ?? '').toLowerCase().replace(/[^\x00-\x7f]/g, (c) => c.normalize('NFD')[0]); // same length as s
const href = (id) => `#/n/${encodeURIComponent(id)}`;
const colorOf = (tipo) => T.get(tipo)?.color || '#8a8173';
const labelOf = (tipo) => T.get(tipo)?.label || tipo;
const one = (tipo) => ({ persona: 'persona', retroscena: 'retroscena', luogo: 'luogo', fatto: 'fatto', meccanica: 'meccanica', obiettivo: 'obiettivo', tecnica: 'tecnica', principio: 'principio', metodo: 'metodo', tratto: 'tratto', scelta: 'scelta', finale: 'finale', decisione: 'decisione', indice: 'indice' }[tipo] || tipo);
const chip = (tipo, big = false) => `<a class="chip${big ? ' big' : ''}" href="#/t/${tipo}" style="--c:${colorOf(tipo)}"><span class="dot"></span>${esc(big ? labelOf(tipo) : one(tipo))}</a>`;
const badge = (f) => (FONTI.includes(f) ? `<span class="fonte f-${f}" title="fonte">${f}</span>` : '');
const link = (id, alias) => {
  const n = byId.get(id);
  if (!n) return `<span class="wl broken" title="Nessuna nota con questo nome">${esc(alias || id)}</span>`;
  return `<a class="wl" href="${href(id)}" style="--c:${colorOf(n.tipo)}">${esc(alias || n.title)}</a>`;
};
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out)); return out; };
const plain = (s) => String(s).replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (_, t, a) => a || byId.get(t.trim())?.title || t);
const isLink = (s) => typeof s === 'string' && /^\s*\[\[[^\]]+\]\]\s*$/.test(s);

// ---------- frontmatter as a card ----------
const LABELS = { chi_c_e: "chi c'è", cosa_e: "cos'è", perche: 'perché', sa: 'sa', non_affiora: 'non affiora' };
const label = (k) => esc(LABELS[k] || k.replace(/_/g, ' '));
const CODE_FIELDS = ['id', 'flag', 'scena', 'dove'];
const empty = (v) => v == null || v === '' || (Array.isArray(v) && v.every(empty)) || (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length);
function scalar(v) {
  if (typeof v === 'boolean') return v ? 'sì' : 'no';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return inline(v, link);
  if (Array.isArray(v)) return v.map(scalar).join(', ');
  return esc(JSON.stringify(v));
}
// one-line objects ({ t, fonte, scena }, { con, prova, fonte }...): the text first, then where it comes from
// on a small second line; `t` is the text itself and needs no label
const META = ['scena', 'fonte'];
function row(o) {
  const parts = [], meta = [];
  for (const [k, v] of Object.entries(o)) {
    if (empty(v)) continue;
    if (k === 'fonte') { meta.push(FONTI.includes(v) ? badge(v) : `<span class="rf"><span class="rk">fonte</span> ${scalar(v)}</span>`); continue; }
    if (k === 'scena') { meta.push(`<span class="src">${esc(Array.isArray(v) ? v.join(', ') : v)}</span>`); continue; }
    parts.push(k === 't' ? `<span class="rf">${scalar(v)}</span>` : `<span class="rf"><span class="rk">${label(k)}</span> ${scalar(v)}</span>`);
  }
  return `<div class="row">${parts.join(' ')}${meta.length ? `<div class="rm">${meta.join(' ')}</div>` : ''}</div>`;
}
function value(v) {
  if (Array.isArray(v)) {
    const items = v.filter((x) => !empty(x));
    if (items.every(isLink)) return `<div class="links">${items.map((s) => inline(s, link)).join('')}</div>`;
    if (items.every((x) => typeof x !== 'object')) return `<ul>${items.map((x) => `<li>${scalar(x)}</li>`).join('')}</ul>`;
    return items.map((x) => (x && typeof x === 'object' && !Array.isArray(x) ? row(x) : `<div class="row">${scalar(x)}</div>`)).join('');
  }
  if (v && typeof v === 'object') return row(v);
  if (isLink(v)) return `<div class="links">${inline(v, link)}</div>`;
  return `<div class="val">${scalar(v)}</div>`;
}
const codeValue = (v) => `<div class="val src">${esc(Array.isArray(v) ? v.join(', ') : v)}</div>`;
function fmCard(n) {
  if (!n.fm) return '';
  const out = [];
  for (const [k, v] of Object.entries(n.fm)) {
    if (k === 'tipo' || k === 'nome' || empty(v)) continue;
    if (k === 'fonte' && FONTI.includes(v)) continue; // shown as a badge under the title
    out.push(`<div class="f${HIDDEN_FIELDS.includes(k) ? ' secret' : ''}"><div class="fk">${label(k)}${HIDDEN_FIELDS.includes(k) ? ` ${HIDDEN_MARK}` : ''}</div>${CODE_FIELDS.includes(k) && (typeof v === 'string' || typeof v === 'number') && !/\[\[/.test(v) ? codeValue(v) : value(v)}</div>`);
  }
  return out.length ? `<section class="card fm">${out.join('')}</section>` : '';
}

// ---------- lists ----------
const noteRow = (n, extra = '', withSub = true) => `<a class="item" href="${href(n.id)}" style="--c:${colorOf(n.tipo)}"><span class="dot"></span><span class="it"><span class="tt">${extra}${esc(n.title)} ${badge(n.fonte)}${n.hidden ? ' <span class="hid sm">nascosto</span>' : ''}</span>${withSub && n.sub ? `<span class="sub">${esc(n.sub)}</span>` : ''}</span></a>`;
const byTitle = (a, b) => a.title.localeCompare(b.title, 'it', { sensitivity: 'base' });

// ---------- pages ----------
function home(q = '') {
  const start = D.home && byId.get(D.home);
  app.innerHTML = `<div class="page">
<div class="search"><input id="q" type="search" placeholder="Cerca nel vault: titoli e testo" value="${esc(q)}" autocomplete="off" enterkeyhint="search" aria-label="Cerca"></div>
<div id="res"></div>
<div id="home"${q ? ' hidden' : ''}>
<section class="types">${D.types.map((t) => `<a class="tchip" href="#/t/${t.tipo}" style="--c:${t.color}"><span class="dot"></span><span>${esc(t.label)}</span><b>${t.count}</b></a>`).join('')}<a class="tchip graph" href="#/grafo"><span>Grafo di tutto</span><b>›</b></a></section>
${start ? `<article class="body">${md(start.body, link)}</article>` : ''}
</div></div>`;
  const input = app.querySelector('#q'), res = app.querySelector('#res'), hm = app.querySelector('#home');
  let first = !q;
  const run = () => {
    const v = input.value;
    res.innerHTML = v.trim() ? results(v) : '';
    hm.hidden = !!v.trim();
    const h = `#/cerca/${encodeURIComponent(v)}`;
    if (first && v) { history.pushState(null, '', h); first = false; } else history.replaceState(null, '', h);
  };
  input.addEventListener('input', run);
  if (q) res.innerHTML = results(q);
  if (location.hash.startsWith('#/cerca')) input.focus({ preventScroll: true });
}

function results(q) {
  const words = fold(q).split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const hits = [];
  for (const n of D.notes) {
    const h = hay.get(n.id);
    if (!words.every((w) => h.title.includes(w) || h.text.includes(w))) continue;
    let score = 0;
    for (const w of words) {
      if (h.title.startsWith(w)) score += 100; else if (new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(h.title)) score += 80; else if (h.title.includes(w)) score += 50;
      if (h.text.includes(w)) score += 5;
    }
    hits.push({ n, score });
  }
  hits.sort((a, b) => b.score - a.score || byTitle(a.n, b.n));
  if (!hits.length) return `<p class="none">Niente per «${esc(q)}».</p>`;
  const w = words[0];
  const snip = (n) => {
    const h = hay.get(n.id), i = h.text.indexOf(w);
    if (i < 0) return n.sub ? esc(n.sub) : '';
    const a = Math.max(0, i - 50), b = Math.min(h.raw.length, i + w.length + 80);
    return `${a ? '…' : ''}${esc(h.raw.slice(a, i))}<mark>${esc(h.raw.slice(i, i + w.length))}</mark>${esc(h.raw.slice(i + w.length, b))}${b < h.raw.length ? '…' : ''}`;
  };
  const shown = hits.slice(0, 80);
  return `<p class="count">${hits.length} ${hits.length === 1 ? 'nota' : 'note'}</p><div class="list">${shown.map(({ n }) => `<a class="item" href="${href(n.id)}" style="--c:${colorOf(n.tipo)}"><span class="dot"></span><span class="it"><span class="tt">${esc(n.title)} <span class="ty">${esc(one(n.tipo))}</span> ${badge(n.fonte)}</span><span class="sub">${snip(n)}</span></span></a>`).join('')}</div>${hits.length > shown.length ? `<p class="count">e altre ${hits.length - shown.length}: scrivi una parola in più.</p>` : ''}`;
}

function typePage(tipo) {
  const t = T.get(tipo);
  if (!t) return notFound();
  let list = D.notes.filter((n) => n.tipo === tipo);
  let html;
  if (tipo === 'fatto') {
    list.sort((a, b) => (a.fm?.quando ?? 1e9) - (b.fm?.quando ?? 1e9) || byTitle(a, b));
    const groups = new Map();
    for (const n of list) { const c = n.fm?.capitolo ?? '—'; if (!groups.has(c)) groups.set(c, []); groups.get(c).push(n); }
    html = [...groups].map(([c, ns]) => `<h2 class="grp">${c === 0 ? 'Prologo' : c === '—' ? 'Senza capitolo' : `Capitolo ${esc(c)}`}</h2><div class="list">${ns.map((n) => noteRow(n, n.fm?.quando != null ? `<span class="when">${esc(n.fm.quando)}</span>` : '')).join('')}</div>`).join('');
  } else {
    list.sort(byTitle);
    html = `<div class="list">${list.map((n) => noteRow(n)).join('')}</div>`;
  }
  app.innerHTML = `<div class="page"><h1 class="title">${esc(t.label)} <small>${t.count}</small></h1>${tipo === 'fatto' ? '<p class="hint">In ordine di tempo (il numero è il campo <code>quando</code>).</p>' : ''}${tipo === 'retroscena' ? `<p class="hint">${HIDDEN_MARK} Quello che sanno solo gli autori.</p>` : ''}${html}</div>`;
}

function notePage(id) {
  const n = byId.get(id);
  if (!n) return notFound(id);
  const groups = new Map();
  for (const b of n.back.map((x) => byId.get(x)).sort(byTitle)) { if (!groups.has(b.tipo)) groups.set(b.tipo, []); groups.get(b.tipo).push(b); }
  const order = D.types.map((t) => t.tipo);
  const body = n.body.replace(/^#\s+(.+)\n/, (all, h) => (h.trim() === n.title ? '' : all)); // the title is already above
  const back = [...groups].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  app.innerHTML = `<div class="page note">
<article class="main">
<div class="meta">${chip(n.tipo)} ${badge(n.fonte)} ${n.hidden ? HIDDEN_MARK : ''}${n.generated ? '<span class="gen">generata dai copioni</span>' : ''}</div>
<h1 class="title">${esc(n.title)}</h1>
<p class="path">lore/${esc(n.folder ? `${n.folder}/` : '')}${esc(n.id)}.md</p>
${n.errors.length ? `<div class="warn">La testa di questa nota non si legge bene:<br>${n.errors.map(esc).join('<br>')}</div>` : ''}
${fmCard(n)}
${body.trim() ? `<section class="body">${md(body, link)}</section>` : ''}
${back.length ? `<section class="back"><h2>Collegato da <small>${n.back.length}</small></h2>${back.map(([t, ns]) => `<h3>${chip(t)} <small>${ns.length}</small></h3><div class="list compact">${ns.map((b) => noteRow(b, '', false)).join('')}</div>`).join('')}</section>` : ''}
</article>
<aside class="side"><h2>Vicini <small>${new Set([...n.links, ...n.back]).size}</small></h2><div class="hops" role="group"><button class="btn on" data-h="1">1 passo</button><button class="btn" data-h="2">2 passi</button><a class="btn" href="#/grafo/${encodeURIComponent(n.id)}">Nel grafo</a></div><p class="hint small" id="lgn"></p><div class="local"></div></aside>
</div>`;
  const host = app.querySelector('.local'), btns = [...app.querySelectorAll('.hops button')];
  const draw = (hops) => {
    current?.destroy();
    const sub = neighbourhood(n.id, hops);
    app.querySelector('#lgn').textContent = sub.cut ? `Troppi vicini a 2 passi (${sub.cut}): mostro i ${sub.ids.length} più collegati.` : '';
    current = graphView(host, { ...sub.graph, center: 0, labels: 'all', onOpen: go, typeLabel: one });
    btns.forEach((b) => b.classList.toggle('on', Number(b.dataset.h) === hops));
  };
  btns.forEach((b) => b.addEventListener('click', () => draw(Number(b.dataset.h))));
  draw(1);
}

const MAX_LOCAL = 160;
function neighbourhood(id, hops) {
  const near = (x) => { const n = byId.get(x); return [...n.links, ...n.back]; };
  let ids = [id, ...new Set(near(id))].filter((x, i, a) => a.indexOf(x) === i);
  let cut = 0;
  if (hops === 2) {
    const more = new Set();
    for (const x of ids.slice(1)) if (byId.get(x).tipo !== 'indice') for (const y of near(x)) if (!ids.includes(y)) more.add(y); // an index links to everything: do not walk through it
    let extra = [...more];
    if (ids.length + extra.length > MAX_LOCAL) { cut = ids.length + extra.length; extra = extra.sort((a, b) => (deg.get(b) || 0) - (deg.get(a) || 0)).slice(0, Math.max(0, MAX_LOCAL - ids.length)); }
    ids = ids.concat(extra);
  }
  const ix = new Map(ids.map((x, i) => [x, i]));
  const seen = new Set(), edges = [];
  for (const x of ids) for (const y of byId.get(x).links) if (ix.has(y) && x !== y) {
    const a = ix.get(x), b = ix.get(y), k = a < b ? `${a},${b}` : `${b},${a}`;
    if (!seen.has(k)) { seen.add(k); edges.push([a, b]); }
  }
  const pos = layout(ids.length, edges, { iterations: ids.length > 80 ? 160 : 260, dist: 60 });
  const nodes = ids.map((x, i) => { const n = byId.get(x); return { id: x, title: n.title, tipo: n.tipo, color: colorOf(n.tipo), x: pos[2 * i], y: pos[2 * i + 1], r: i === 0 ? 11 : 4 + Math.min(6, Math.sqrt(deg.get(x) || 0)) }; });
  return { ids, cut, graph: { nodes, edges } };
}

function graphPage(focus) {
  graphOn ??= new Set(D.types.filter((t) => t.graph).map((t) => t.tipo));
  const f = focus && byId.get(focus);
  if (f) graphOn.add(f.tipo);
  app.innerHTML = `<div class="gpage"><div class="legend" role="group" aria-label="Tipi nel grafo">${D.types.map((t) => `<button class="lchip${graphOn.has(t.tipo) ? ' on' : ''}" data-t="${t.tipo}" style="--c:${t.color}" aria-pressed="${graphOn.has(t.tipo)}"><span class="dot"></span>${esc(t.label)} <small>${t.count}</small></button>`).join('')}</div><div class="gwrap"></div></div>`;
  // the layout is wider than tall: on a phone held upright, turn it a quarter so it fills the screen
  const xs = D.notes.map((n) => n.x), ys = D.notes.map((n) => n.y);
  const turn = innerHeight > innerWidth && Math.max(...xs) - Math.min(...xs) > Math.max(...ys) - Math.min(...ys);
  const nodes = D.notes.map((n) => ({ id: n.id, title: n.title, tipo: n.tipo, color: colorOf(n.tipo), x: turn ? -n.y : n.x, y: turn ? n.x : n.y, r: 3 + Math.min(8, Math.sqrt(deg.get(n.id) || 0)) }));
  current = graphView(app.querySelector('.gwrap'), { nodes, edges: D.edges, onOpen: go, typeLabel: one });
  const apply = () => current.setVisible((n) => graphOn.has(n.tipo));
  apply();
  if (f) current.focus(D.notes.indexOf(f));
  else current.fit();
  app.querySelector('.legend').addEventListener('click', (e) => {
    const b = e.target.closest('.lchip');
    if (!b) return;
    const t = b.dataset.t;
    if (graphOn.has(t)) graphOn.delete(t); else graphOn.add(t);
    b.classList.toggle('on', graphOn.has(t)); b.setAttribute('aria-pressed', String(graphOn.has(t)));
    apply();
  });
}

function notFound(id) {
  app.innerHTML = `<div class="page"><h1 class="title">Non c'è</h1><p>${id ? `Nessuna nota si chiama <code>${esc(id)}</code>.` : 'Questa pagina non esiste.'}</p><p><a class="btn" href="#/">Torna all'inizio</a></p></div>`;
}

// ---------- routing ----------
const go = (id) => { location.hash = href(id); };
const scrolls = new Map();
let lastHash = null, fresh = false;
document.addEventListener('click', (e) => { if (e.target.closest('a[href^="#/"]')) fresh = true; }, true);
function route() {
  if (lastHash != null) scrolls.set(lastHash, window.scrollY);
  current?.destroy(); current = null;
  const h = location.hash.replace(/^#\/?/, '');
  const [kind, ...rest] = h.split('/');
  const arg = decodeURIComponent(rest.join('/'));
  document.body.classList.toggle('full', kind === 'grafo');
  if (!kind) home();
  else if (kind === 'n') notePage(arg);
  else if (kind === 't') typePage(arg);
  else if (kind === 'grafo') graphPage(arg);
  else if (kind === 'cerca') home(arg);
  else notFound();
  const n = kind === 'n' && byId.get(arg);
  document.title = n ? `${n.title} · vault di Salem` : 'Le carte di Salem · il vault';
  window.scrollTo(0, fresh ? 0 : scrolls.get(location.hash) || 0);
  fresh = false; lastHash = location.hash;
}

async function start() {
  try {
    const res = await fetch('./data.json?v=1794985176491');
    D = await res.json();
    if (D.bodies) { const b = await (await fetch('./bodies.json?v=1794985176491')).json(); for (const n of D.notes) n.body = b[n.id] || ''; }
  } catch (e) {
    app.innerHTML = `<div class="page"><p class="warn">Non riesco a leggere il vault (${esc(e.message)}).</p></div>`;
    return;
  }
  byId = new Map(D.notes.map((n) => [n.id, n]));
  T = new Map(D.types.map((t) => [t.tipo, t]));
  for (const [a, b] of D.edges) { const x = D.notes[a].id, y = D.notes[b].id; deg.set(x, (deg.get(x) || 0) + 1); deg.set(y, (deg.get(y) || 0) + 1); }
  for (const n of D.notes) {
    const raw = [n.sub, ...strings({ ...n.fm, tipo: null }).map(plain), plain(n.body).replace(/[#*_`|>]+/g, ' ')].join(' · ').replace(/\s+/g, ' ');
    hay.set(n.id, { title: fold(n.title), raw, text: fold(raw) });
  }
  window.addEventListener('hashchange', route);
  route();
}
start();
