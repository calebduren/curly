# Curly, by Cowboy

**Mind your marks.** A small, local typography kit for English prose and AI interfaces.

Curly turns straight quotation marks and apostrophes into considered punctuation. It preserves code through Markdown/HTML integrations, explains its decisions, and leaves unresolved marks alone. No model, network request, or runtime dependency.

[Playground](https://cowboy-curly.caleb-9b2.workers.dev/curly/) · [Source](https://github.com/calebduren/curly) · [Measurements](https://github.com/calebduren/curly/tree/main/benchmarks)

```sh
npm install https://github.com/calebduren/curly/releases/download/v1.0.0/cowboy-curly-1.0.0.tgz
```

The tested release archive is installable now. The shorter registry command, `npm install cowboy-curly`, will become available after npm publication. Imports remain `cowboy-curly` with either distribution.

```ts
import { smarten } from 'cowboy-curly';

smarten(`"Don't overlook the little things," she said.`);
// “Don’t overlook the little things,” she said.
```

## Put it where prose is rendered

For AI Markdown, use the remark integration inside your renderer. Let your AI SDK decode the response and separate text from tool calls. Curly is independent of the model provider.

```tsx
import Markdown from 'react-markdown';
import remarkCurly from 'cowboy-curly/remark';

<Markdown remarkPlugins={[remarkCurly]}>{message}</Markdown>;
```

Quote context survives emphasis, links, and other inline nodes. Fenced/inline code, HTML markup, math nodes, frontmatter, and MDX expressions are protected. Math protection requires your parser to create math nodes, such as with `remark-math`. Raw Markdown passed to `smarten()` is not automatically parsed or protected.

### Streamdown

```tsx
import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import remarkCurly from 'cowboy-curly/remark';

<Streamdown
  remarkPlugins={[...Object.values(defaultRemarkPlugins), [remarkCurly, { primes: true }]]}
  isAnimating={isStreaming}
>
  {message}
</Streamdown>;
```

Keep the renderer’s default plugins. The incomplete block may change as new Markdown arrives; Curly transforms the parsed prose for each render. This is separate from the paragraph-buffered plain-text API below. See the [integration examples](https://github.com/calebduren/curly/tree/main/examples).

### HTML / rehype

```ts
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeCurly from 'cowboy-curly/rehype';

const html = await unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeCurly)
  .use(rehypeStringify)
  .process('<p>"One <em>good</em> day."</p>');
// <p>“One <em>good</em> day.”</p>
```

Attributes remain untouched. `code`, `pre`, `script`, `style`, `kbd`, `samp`, `var`, math, SVG, form controls, and editable regions are protected. Add `data-curly="off"` to protect any subtree. Curly is a text transform, not an HTML sanitizer; keep your existing sanitization policy.

## Options

| Option            | Default | Behavior                                                   |
| ----------------- | ------- | ---------------------------------------------------------- |
| `quotes`          | `true`  | Directional single and double quotation marks              |
| `apostrophes`     | `true`  | Contractions, possessives, names, common elisions          |
| `primes`          | `false` | Convert marks in clear measurement contexts to `′` and `″` |
| `ellipses`        | `false` | Convert exactly three prose dots to `…`                    |
| `protectedRanges` | `[]`    | Plain-text API only: literal UTF-16 spans                  |

```ts
smarten(`The screen is 24" wide...`, { primes: true, ellipses: true });
// The screen is 24″ wide…

smarten(`The label says "Model 3". An isolated 6".`, { primes: true });
// The label says “Model 3”. An isolated 6".
```

Existing Unicode punctuation, spelling, whitespace, and punctuation placement are preserved. Curly does not rewrite dashes, normalize spacing, or enforce American comma placement. URLs and conventional email addresses are protected in prose. Supply ranges for other exact strings such as identifiers, commands, citations, and data values.

```ts
const prose = `She wrote "hello" and ran "echo hi".`;
const start = prose.indexOf('"echo hi"');
smarten(prose, {
  protectedRanges: [{ start, end: start + '"echo hi"'.length }],
});
```

Ranges use JavaScript string offsets (UTF-16), are validated, and are not mutated. Overlapping ranges are merged. Invalid ranges throw `RangeError`.

## Inspect the judgment

```ts
import { analyze } from 'cowboy-curly';

const { text, changes, decisions } = analyze(`"Hello." 6"`);
// text: “Hello.” 6"
```

Each decision includes `start`, `end`, `original`, `replacement`, `kind`, and a human-readable `reason`. Offsets refer to the original input. `changes` contains only replacements; `decisions` also includes protected and ambiguous spans. No probabilistic confidence score is invented.

Kinds: `opening-quote`, `closing-quote`, `apostrophe`, `prime`, `ellipsis`, `protected`, `ambiguous`. Already-correct punctuation does not generate a decision.

The AST plugins attach decisions to `tree.data.curly`. Every tree decision includes `block` and `context`; its offsets refer to that inline context, not to the original Markdown/HTML source. `transformTree(tree, 'markdown' | 'html', options)` also returns this report. The tree is transformed in place.

Both plugins accept `skip: (node) => boolean` to protect a subtree. Opt-in `annotate: true` wraps changed characters in semantic `<mark>` elements with `data-curly-id`, `data-curly-kind`, and `data-curly-reason`. It adds no styling. Annotation is intended for inspectors; omit it from normal reading views.

## Plain-text streaming

```ts
import { createQuoteStream } from 'cowboy-curly/stream';

const stream = createQuoteStream();
stream.write('"Don'); // ''
stream.write("'t stop."); // ''
stream.preview().text; // “Don’t stop. (provisional)
stream.end('"'); // “Don’t stop.”
```

`write()` emits only completed paragraphs, separated by blank lines. `end()` flushes the final paragraph and closes the stream. Concatenate returned strings. Final output matches batch conversion regardless of chunk boundaries, including split surrogate pairs and CRLF. A closed stream rejects further writes.

`preview()` returns an analysis of the pending paragraph and may change as text arrives. It does not commit text. `pendingLength` reports buffered UTF-16 code units. The scanner does not rescan the growing tail on each write; preview does analyze the whole pending paragraph, so call it at display cadence.

A paragraph without a blank line stays buffered until `end()`. Memory and committed-output latency grow with that paragraph. V1 does not impose a silent flush limit, which would change quotation context. Callers handling unbounded streams should enforce their own input limits or render a provisional preview.

`curlyTransformStream(options)` exposes the same policy as a Web `TransformStream<string, string>`. Feed decoded prose, never raw JSON, SSE envelopes, Markdown, or tool arguments. Transform selected display fields after parsing structured responses, and preserve the original data when exact comparison or round trips matter.

## Optional reading styles

```tsx
import 'cowboy-curly/prose.css';

<article className="curly-prose">{children}</article>;
```

The scoped stylesheet adds a readable measure, paragraph rhythm, balanced headings, and sensible code/table overflow. It inherits your fonts and colors. It works independently of punctuation conversion and is optional; no CSS ships through the JavaScript imports.

## Boundaries worth knowing

- English conventions only in V1. Do not apply English quote rules globally to multilingual content.
- This is a deterministic heuristic formatter. Ambiguous quotations, uncommon elisions, quoted numeric expressions, and context spanning separate paragraphs can require editorial intent. Supply the desired Unicode mark or protect the span.
- Quote balance resets at paragraph boundaries. Multi-paragraph literary quotations are outside the initial scope.
- The plain-text function assumes prose. It cannot infer whether a string is code, a database identifier, or a signature.
- Existing smart punctuation is preserved, including punctuation that was incorrect before Curly ran.
- No automatic typing replacement, DOM mutation observer, or contenteditable interception. Integrate at a rendering or explicit formatting boundary to preserve selection and undo behavior.
- The core and AST adapters support modern browsers and Node 18+. The Web stream wrapper needs `TransformStream` (available in Node 18+ and current browsers). React integrations use your separately installed renderer.

## Development and contribution

The repository includes a playground, fixtures, randomized invariant tests, real-renderer checks, a reproducible benchmark, and package-consumer checks. Start with [CONTRIBUTING.md](https://github.com/calebduren/curly/blob/main/CONTRIBUTING.md). A small counterexample with its intended output is especially useful.

Curly shares a long tradition with SmartyPants, smartquotes, retext-smartypants, and other typography tools. [Punctilio](https://github.com/AlexanderMattTurner/punctilio) offers broader typography and localization. Curly’s focus is a restrained, explainable layer for prose in modern interfaces.

MIT © 2026 Caleb Duren.
