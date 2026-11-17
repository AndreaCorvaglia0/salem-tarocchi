// A tiny frontmatter reader for the subset of YAML the lore vault uses (lore/README.md). No dependency.
//   ---
//   key: value            value: "quoted" | 'quoted' | bare word | number | true/false | [] | {} | empty (null)
//   key:                  followed by a list:
//     - "item"            a scalar
//     - { a: "x", b: y }  a one-line object (values: scalars or [ ... ] of scalars)
//   ---
//   body
// parse(text) -> { data, body, errors: [{ line, msg }] }. Anything outside the subset is an error with its
// line number, never a guess. stringify is not needed: generated files write their own frontmatter.

const err = (errors, line, msg) => errors.push({ line, msg });

// Reads one scalar or inline collection starting at s[i]; returns { value, i } with i after it.
function readValue(s, i, stops) {
  while (s[i] === ' ') i++;
  const c = s[i];
  if (c === '"' || c === "'") {
    let out = '', j = i + 1;
    for (; j < s.length; j++) {
      const ch = s[j];
      if (c === '"' && ch === '\\' && j + 1 < s.length) {
        const n = s[++j];
        out += n === 'n' ? '\n' : n === 't' ? '\t' : n;
        continue;
      }
      if (c === "'" && ch === "'" && s[j + 1] === "'") { out += "'"; j++; continue; }
      if (ch === c) return { value: out, i: j + 1 };
      out += ch;
    }
    throw new Error('unterminated string');
  }
  if (c === '[') {
    const arr = [];
    let j = i + 1;
    while (true) {
      while (s[j] === ' ') j++;
      if (s[j] === ']') return { value: arr, i: j + 1 };
      if (j >= s.length) throw new Error('unterminated [');
      const r = readValue(s, j, ',]');
      arr.push(r.value);
      j = r.i;
      while (s[j] === ' ') j++;
      if (s[j] === ',') j++;
      else if (s[j] !== ']') throw new Error(`expected , or ] at column ${j + 1}`);
    }
  }
  if (c === '{') {
    const obj = {};
    let j = i + 1;
    while (true) {
      while (s[j] === ' ') j++;
      if (s[j] === '}') return { value: obj, i: j + 1 };
      if (j >= s.length) throw new Error('unterminated {');
      const m = /^([A-Za-z_][\w-]*)\s*:/.exec(s.slice(j));
      if (!m) throw new Error(`expected key at column ${j + 1}`);
      j += m[0].length;
      const r = readValue(s, j, ',}');
      obj[m[1]] = r.value;
      j = r.i;
      while (s[j] === ' ') j++;
      if (s[j] === ',') j++;
      else if (s[j] !== '}') throw new Error(`expected , or } at column ${j + 1}`);
    }
  }
  // a bare scalar runs to the next stop character (or the end of the line)
  let j = i;
  while (j < s.length && !stops.includes(s[j])) j++;
  return { value: bare(s.slice(i, j).trim()), i: j };
}

function bare(t) {
  if (t === '' || t === '~' || t === 'null') return null;
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return t;
}

function readLine(s, line, errors) {
  try {
    const r = readValue(s, 0, '');
    if (s.slice(r.i).trim() !== '' && !s.slice(r.i).trim().startsWith('#')) err(errors, line, `unexpected text after value: "${s.slice(r.i).trim()}"`);
    return r.value;
  } catch (e) { err(errors, line, e.message); return null; }
}

export function parse(text) {
  const errors = [];
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') return { data: null, body: String(text), errors };
  const end = lines.indexOf('---', 1);
  if (end < 0) { err(errors, 1, 'frontmatter not closed with ---'); return { data: null, body: '', errors }; }
  const data = {};
  let key = null; // the key whose list we are filling
  for (let n = 1; n < end; n++) {
    const raw = lines[n], ln = n + 1;
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const item = /^\s+-\s(.*)$/.exec(raw) || /^-\s(.*)$/.exec(raw);
    if (item) {
      if (!key) { err(errors, ln, 'list item without a key'); continue; }
      if (data[key] == null) data[key] = [];
      if (!Array.isArray(data[key])) { err(errors, ln, `"${key}" has a value and a list`); continue; }
      data[key].push(readLine(item[1], ln, errors));
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):(?:\s(.*))?$/.exec(raw);
    if (!kv) { err(errors, ln, `cannot read: "${raw.trim()}"`); continue; }
    if (kv[1] in data) err(errors, ln, `duplicate key "${kv[1]}"`);
    key = kv[1];
    const rest = (kv[2] || '').trim();
    data[key] = rest === '' ? null : readLine(rest, ln, errors);
  }
  return { data, body: lines.slice(end + 1).join('\n'), errors };
}
