/** Curly’s deterministic English punctuation engine. Offsets are UTF-16. */
export interface ProtectedRange {
  start: number;
  end: number;
  reason?: string;
}
export interface CurlyOptions {
  quotes?: boolean;
  apostrophes?: boolean;
  primes?: boolean;
  ellipses?: boolean;
  protectedRanges?: readonly ProtectedRange[];
}
export type DecisionKind =
  | 'opening-quote'
  | 'closing-quote'
  | 'apostrophe'
  | 'prime'
  | 'ellipsis'
  | 'protected'
  | 'ambiguous';
export interface Decision {
  start: number;
  end: number;
  original: string;
  replacement: string;
  kind: DecisionKind;
  reason: string;
}
export interface CurlyResult {
  text: string;
  decisions: Decision[];
  changes: Decision[];
}

const letter = /[\p{L}\p{M}]/u;
const digit = /[0-9]/;
const word = /[\p{L}\p{M}\p{N}]/u;
const openingBoundary = /[\s([{<\u2014\u2013:;,]/u;
const closingBoundary = /[\s)\]}>.,!?;:\u2014\u2013]/u;
const opening: Record<string, string> = { '"': '“', "'": '‘' };
const closing: Record<string, string> = { '"': '”', "'": '’' };
const urlPattern = /(?:https?:\/\/|www\.)[^\s<>"`]+/g;
const emailLocal = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]/;
const emailHost = /[a-zA-Z0-9.-]/;

function before(text: string, i: number): string {
  if (i <= 0) return '';
  const last = text.charCodeAt(i - 1);
  return last >= 0xdc00 && last <= 0xdfff && i > 1 ? text.slice(i - 2, i) : text[i - 1];
}
function after(text: string, i: number): string {
  return i >= text.length ? '' : String.fromCodePoint(text.codePointAt(i)!);
}
function escaped(text: string, i: number): boolean {
  let count = 0;
  while (i > 0 && text[--i] === '\\') count++;
  return count % 2 === 1;
}
function rangesFor(text: string, given: readonly ProtectedRange[]): ProtectedRange[] {
  const ranges = given
    .map((range) => {
      if (
        !Number.isInteger(range.start) ||
        !Number.isInteger(range.end) ||
        range.start < 0 ||
        range.end > text.length ||
        range.end < range.start
      ) {
        throw new RangeError(
          'Curly protected ranges must use valid UTF-16 offsets within the input.',
        );
      }
      return { ...range };
    })
    .filter((r) => r.start < r.end);
  for (const match of text.matchAll(urlPattern)) {
    let end = match.index + match[0].length;
    while (end > match.index && /[.,;:!?)\]]/.test(text[end - 1])) end--;
    if (text[match.index - 1] === "'" && text[end - 1] === "'") end--;
    ranges.push({ start: match.index, end, reason: 'A URL or email address stays exact.' });
  }
  // Scan from @ signs so a long ordinary word cannot trigger quadratic regex backtracking.
  for (let at = text.indexOf('@'); at >= 0; at = text.indexOf('@', at + 1)) {
    let start = at,
      end = at + 1;
    while (start > 0 && emailLocal.test(text[start - 1])) start--;
    while (end < text.length && emailHost.test(text[end])) end++;
    while (text[end - 1] === '.') end--;
    // Paired prose quotes can enclose an address whose local part contains apostrophes.
    if (
      text[start] === "'" &&
      text[end] === "'" &&
      (!text[start - 1] || openingBoundary.test(text[start - 1]))
    )
      start++;
    const host = text.slice(at + 1, end);
    const dot = host.lastIndexOf('.');
    if (start < at && dot > 0 && /^[a-zA-Z]{2,63}$/.test(host.slice(dot + 1))) {
      ranges.push({ start, end, reason: 'A URL or email address stays exact.' });
    }
  }
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: ProtectedRange[] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start < last.end) last.end = Math.max(last.end, range.end);
    else merged.push(range);
  }
  return merged;
}

/** Format declared prose. Use the AST integrations for Markdown or HTML. */
export function analyze(text: string, options: CurlyOptions = {}): CurlyResult {
  if (typeof text !== 'string') throw new TypeError('Curly expects a string.');
  const { quotes = true, apostrophes = true, primes = false, ellipses = false } = options;
  const ranges = rangesFor(text, options.protectedRanges ?? []);
  const decisions: Decision[] = [];
  const depth: Record<string, number> = { '"': 0, "'": 0 };
  let rangeIndex = 0;
  let newlines = 0;
  const record = (
    start: number,
    end: number,
    replacement: string,
    kind: DecisionKind,
    reason: string,
  ) => {
    decisions.push({ start, end, original: text.slice(start, end), replacement, kind, reason });
  };

  for (let i = 0; i < text.length; i++) {
    const range = ranges[rangeIndex];
    if (range && i === range.start) {
      record(
        i,
        range.end,
        text.slice(i, range.end),
        'protected',
        range.reason ?? 'This span was marked as literal content.',
      );
      i = range.end - 1;
      rangeIndex++;
      continue;
    }
    const c = text[i];
    if (c === '\n') {
      if (++newlines >= 2) {
        depth['"'] = 0;
        depth["'"] = 0;
      }
      continue;
    }
    if (!/[\r\t ]/.test(c)) newlines = 0;
    // Existing directional quotation marks participate in balancing but are never rewritten.
    if (c === '“' || c === '‘') {
      depth[c === '“' ? '"' : "'"]++;
      continue;
    }
    if (c === '”' || c === '’') {
      const kind = c === '”' ? '"' : "'";
      if (!(c === '’' && word.test(before(text, i)) && letter.test(after(text, i + 1)))) {
        if (depth[kind]) depth[kind]--;
      }
      continue;
    }
    if (
      ellipses &&
      c === '.' &&
      text.slice(i, i + 3) === '...' &&
      text[i - 1] !== '.' &&
      text[i + 3] !== '.' &&
      !escaped(text, i) &&
      (!range || i + 3 <= range.start)
    ) {
      if (digit.test(text[i - 1] ?? '') && digit.test(text[i + 3] ?? '')) continue;
      record(i, i + 3, '…', 'ellipsis', 'Three prose dots become one ellipsis.');
      i += 2;
      continue;
    }
    if (c !== "'" && c !== '"') continue;
    if (escaped(text, i)) {
      record(i, i + 1, c, 'protected', 'An escaped quote stays literal.');
      continue;
    }
    const prev = before(text, i);
    const next = after(text, i + 1);
    const leftEdge = !prev || openingBoundary.test(prev) || /[‘’“”"']/.test(prev);
    const rightEdge = !next || closingBoundary.test(next) || /[‘’“”"']/.test(next);
    const match = depth[c] ? 0 : -1;
    const tail = text.slice(i + 1, i + 25);

    if (c === "'" && word.test(prev) && letter.test(next)) {
      if (apostrophes)
        record(
          i,
          i + 1,
          '’',
          'apostrophe',
          'An apostrophe joins a contraction, possessive, or name.',
        );
      continue;
    }
    if (
      c === "'" &&
      leftEdge &&
      (/^(?:tis|twas|twere|twill|twould|cause|em|round|bout|til|n)\b/i.test(tail) ||
        /^\d{2}s?\b/.test(tail))
    ) {
      const token = tail.match(/^(?:[a-z]+|\d{2}s?)/i)?.[0] ?? '';
      // '90' and 'em' may be ordinary paired quotes; 'n' is a conventional elision.
      if (text[i + 1 + token.length] !== "'" || token.toLowerCase() === 'n') {
        if (apostrophes)
          record(
            i,
            i + 1,
            '’',
            'apostrophe',
            'A leading apostrophe marks omitted letters or a shortened year.',
          );
        continue;
      }
    }
    const prefix = text.slice(Math.max(0, i - 64), i);
    const feetPair = c === "'" && /^\s*\d+(?:\.\d+)?["″]/.test(tail);
    const inchPair = c === '"' && /\d['′]\s*\d+(?:\.\d+)?$/.test(prefix);
    const measurementWords =
      /^(?:\s*)(?:wide|tall|long|deep|thick|screen|display|board|panel|clearance|diameter)\b/i.test(
        tail,
      ) ||
      /\b(?:width|height|depth|length|diameter)\s*(?:is|of|:|=)?\s*\d+(?:\.\d+)?$/i.test(prefix);
    const coordinate = /\d°\s*\d+$/.test(prefix) || /\d°\s*\d+['′]\s*\d+$/.test(prefix);
    if (
      digit.test(prev) &&
      (feetPair || inchPair || coordinate || (match < 0 && measurementWords))
    ) {
      if (primes)
        record(
          i,
          i + 1,
          c === "'" ? '′' : '″',
          'prime',
          'Explicit measurement context calls for a prime symbol.',
        );
      else
        record(
          i,
          i + 1,
          c,
          'protected',
          'Measurement notation is preserved; prime conversion is off.',
        );
      continue;
    }
    if (match >= 0 && rightEdge && !leftEdge) {
      depth[c]--;
      if (quotes)
        record(i, i + 1, closing[c], 'closing-quote', 'This mark closes an earlier quotation.');
      continue;
    }
    if (c === "'" && letter.test(prev) && rightEdge && match < 0) {
      const token = prefix.match(/[\p{L}\p{M}]+$/u)?.[0] ?? '';
      if (token.length > 1 || (token.toLowerCase() === 'n' && /['’]n$/i.test(prefix))) {
        if (apostrophes)
          record(
            i,
            i + 1,
            '’',
            'apostrophe',
            'A trailing apostrophe marks possession or omitted letters.',
          );
        continue;
      }
    }
    if (leftEdge && next && !/\s/.test(next)) {
      depth[c]++;
      if (quotes) record(i, i + 1, opening[c], 'opening-quote', 'This mark opens a quotation.');
      continue;
    }
    if (match >= 0 && rightEdge) {
      depth[c]--;
      if (quotes)
        record(i, i + 1, closing[c], 'closing-quote', 'This mark closes an earlier quotation.');
      continue;
    }
    if ((c === "'" && apostrophes) || quotes || primes) {
      record(
        i,
        i + 1,
        c,
        'ambiguous',
        'The context does not settle this mark; Curly leaves it alone.',
      );
    }
  }
  const changes = decisions.filter((d) => d.original !== d.replacement);
  let cursor = 0;
  const output: string[] = [];
  for (const change of changes) {
    output.push(text.slice(cursor, change.start), change.replacement);
    cursor = change.end;
  }
  output.push(text.slice(cursor));
  return { text: changes.length ? output.join('') : text, decisions, changes };
}

export function smarten(text: string, options: CurlyOptions = {}): string {
  return analyze(text, options).text;
}

export default smarten;
