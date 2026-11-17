// Minimal markdown for the vault's notes: headings, paragraphs, lists (two levels), bold, italic, inline
// code, tables, blockquotes, rules, [[wikilinks]] and [text](url). Everything is escaped first.
//   md(text, link) -> html      link(id, alias) -> html of one wikilink (the app knows titles and types)
//   inline(text, link) -> html  one line, no blocks

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function inline(text, link) {
  const keep = [];
  const hold = (h) => `\u0000${keep.push(h) - 1}\u0000`;
  let s = String(text ?? '');
  s = s.replace(/`([^`]+)`/g, (_, c) => hold(`<code>${esc(c)}</code>`));
  s = s.replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (_, t, a) => hold(link(t.trim(), a ? a.trim() : null)));
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_, t, u) => hold(`<a href="${esc(u)}" rel="noopener" target="_blank">${esc(t)}</a>`));
  s = esc(s);
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/__(.+?)__/g, '<b>$1</b>');
  s = s.replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1<i>$2</i>').replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1<i>$2</i>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[i]);
}

const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

export function md(text, link) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '), link)}</p>`); para.length = 0; } };
  while (i < lines.length) {
    const l = lines[i], t = l.trim();
    if (!t) { flush(); i++; continue; }
    let m;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(t))) { flush(); const n = Math.min(6, m[1].length + 1); out.push(`<h${n}>${inline(m[2], link)}</h${n}>`); i++; continue; }
    if (/^(-{3,}|\*{3,})$/.test(t)) { flush(); out.push('<hr>'); i++; continue; }
    if (t.startsWith('|') && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1].trim())) {
      flush();
      const head = cells(t);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      out.push(`<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c, link)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, link)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (t.startsWith('>')) {
      flush();
      const q = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) q.push(lines[i++].trim().replace(/^>\s?/, ''));
      out.push(`<blockquote>${md(q.join('\n'), link)}</blockquote>`);
      continue;
    }
    if (/^([-*+]|\d+[.)])\s/.test(t)) {
      flush();
      const items = []; // [{ depth, ordered, html }]
      while (i < lines.length) {
        const r = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
        if (r) { items.push({ depth: r[1].replace(/\t/g, '  ').length >= 2 ? 1 : 0, ordered: /\d/.test(r[2]), text: r[3] }); i++; continue; }
        if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) { items[items.length - 1].text += ` ${lines[i].trim()}`; i++; continue; }
        break;
      }
      const tag = (o) => (o ? 'ol' : 'ul');
      let html = `<${tag(items[0].ordered)}>`, open = null; // open: the tag of the nested list, if any
      items.forEach((it, k) => {
        if (it.depth === 1 && !open) { html = html.replace(/<\/li>$/, ''); open = tag(it.ordered); html += `<${open}>`; }
        if (it.depth === 0 && open) { html += `</${open}></li>`; open = null; }
        html += `<li>${inline(it.text, link)}</li>`;
        if (k === items.length - 1 && open) html += `</${open}></li>`;
      });
      out.push(`${html}</${tag(items[0].ordered)}>`);
      continue;
    }
    para.push(t);
    i++;
  }
  flush();
  return out.join('\n');
}
