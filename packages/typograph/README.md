# Typograph

**Type with intention.** Practical typography tools and principles for people and the agents building with them.

Typograph combines an inspectable English punctuation engine, optional reading CSS adapted from shadcn Typeset, an interactive specimen, and a portable agent skill. The pieces work independently. The text engine is local and has no runtime dependencies.

This is the **2.0.0-next.1 preview**. The intended home is [typograph.dev](https://typograph.dev); `typograph.ing` is configured as a secondary address. Domain configuration is separate from deployment. Source: [calebduren/typograph](https://github.com/calebduren/typograph).

## Try it locally

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173/`. The specimen explores rhythm and measure, hierarchy, punctuation, and numbers. It includes explanations, configurable CSS recipes, real Markdown rendering, a punctuation inspector, and streaming replay. Font synthesis is disabled, and small caps are deliberately absent.

## Install the preview package

The npm name `typograph` belongs to another project. This package is named `@calebduren/typograph`; registry publication has not been verified. Build and verify the archive:

```sh
npm run check
npm install ./release/calebduren-typograph-2.0.0-next.1.tgz
```

The specimen also provides the generated package and skill archives as downloads. Do not use `npm install typograph` for this project.

## Reading styles

```tsx
import '@calebduren/typograph/typography.css';

<article className="typeset typeset-article type-measure">{children}</article>;
```

Start with `typeset-article`, `typeset-docs`, or `typeset-chat`. The layout owns measure: `typeset` alone does not constrain width. Families and colors follow the application. Set the body, heading, and mono variables explicitly when those roles use different faces.

```css
.typeset-article {
  --typeset-font-body: var(--font-body);
  --typeset-font-heading: var(--font-heading);
  --typeset-font-mono: var(--font-mono);
  --typeset-size: 1.125rem;
  --typeset-leading: 1.666667;
  --typograph-measure: 64ch;
  --typograph-paragraph: 1;
}
```

Paragraph space is derived from body size × leading × paragraph fraction. This establishes related intervals; it does not promise a shared baseline across arbitrary mixed content. `ch` measures the zero glyph’s advance, not literal character count. Relative sizes preserve the reader’s root font preferences. There is no hidden mobile size multiplier.

```ts
import { createTypeset, typesets } from '@calebduren/typograph/typography';

const style = createTypeset({ size: 18, leading: 30 / 18, measure: 64, paragraph: 1 });
// CSS custom properties suitable for a typeset container's style.
```

Utilities include `type-measure`, `type-balance`, `type-pretty`, `type-hang`, `type-numbers`, `type-proportional`, `type-ui`, `type-caption`, `type-trim`, and `type-no-synthesis`. Hanging punctuation and text trimming enhance browsers that support them. Font features depend on the actual delivered font. Small caps are unavailable by default and must never be synthesized.

Use `not-typeset` or `data-not-typeset` to exempt a component and its descendants. Use a `typeset-scroll` wrapper when a wide table should scroll. Tables retain their semantics. Appended blocks add their own space; existing blocks are not restyled by last-child layout rules. A growing paragraph can still rewrap; use ordinary wrapping while streaming if that matters.

If the app already has shadcn Typeset, adapt its owned CSS and add the desired presets rather than loading two versions. See [third-party notices](./THIRD_PARTY_NOTICES.md) for the source revision and modifications. The lightweight `prose.css` / `.typograph-prose` stylesheet is also available for inherited typography without a preset.

## Agent skill

The distributable skill lives at [skills/typograph](https://github.com/calebduren/typograph/tree/main/skills/typograph). Copy that entire folder into a supported skill directory such as `.agents/skills/` in a consuming project, preserving `references/`.

> Use $typograph to improve the typography on this page. Keep our fonts. Explain the changes.

The skill connects intent, context, observable evidence, action, verification, and exceptions. Its guidance preserves existing product identities. The website and skill reference share the same [principle source](https://github.com/calebduren/typograph/blob/main/packages/typograph/src/principles.ts). `npm run build:resources` regenerates the reference and download archives.

## Punctuation

```ts
import { smarten, analyze } from '@calebduren/typograph';

smarten(`"Don't overlook the details," she said.`);
// “Don’t overlook the details,” she said.

const { text, changes, decisions } = analyze(`"Hello." 6"`);
```

Quotes and apostrophes are enabled by default. `primes: true` enables clear measurement primes; `ellipses: true` converts exactly three prose dots to an ellipsis. Ambiguous marks and existing Unicode punctuation remain unchanged. Spelling, whitespace, dashes, and punctuation placement are preserved.

Each decision carries original UTF-16 `start` and `end` offsets, `original`, `replacement`, `kind`, and a readable `reason`. Decisions include protected and ambiguous spans. No confidence or taste score is invented.

Plain `smarten()` assumes prose. For literal spans, pass validated `protectedRanges: [{ start, end }]`. URLs and conventional email addresses are protected. Use adapters for Markdown or HTML; raw markup passed to the plain-text function is not automatically parsed or protected.

### Markdown and AI interfaces

```tsx
import Markdown from 'react-markdown';
import remarkTypograph from '@calebduren/typograph/remark';

<Markdown remarkPlugins={[remarkTypograph]}>{message}</Markdown>;
```

Quote context survives emphasis, links, and other inline nodes. Fenced and inline code, raw HTML, frontmatter, MDX expressions, and parsed math nodes are protected. Math protection needs a math parser such as `remark-math`.

```tsx
import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import remarkTypograph from '@calebduren/typograph/remark';

<Streamdown
  remarkPlugins={[...Object.values(defaultRemarkPlugins), [remarkTypograph, { primes: true }]]}
  isAnimating={isStreaming}
>
  {message}
</Streamdown>;
```

Preserve the renderer’s defaults. Incomplete Markdown remains provisional. Keep transport events, tool arguments, JSON, and raw SSE outside the prose transformation boundary.

### HTML

Use the default export from `@calebduren/typograph/rehype` in your existing pipeline. Attributes, code, scripts, styles, math, SVG, form controls, and editable regions remain protected. Add `data-typograph="off"` to skip any subtree. Both adapters also accept `skip(node)`.

The adapters expose reports at `tree.data.typograph`; `transformTree(tree, 'markdown' | 'html', options)` returns the same report. Tree offsets refer to each inline `context`, with a `block` identifier, not the original Markdown or HTML source. Opt-in `annotate: true` emits semantic marks with `data-typograph-id`, `data-typograph-kind`, and `data-typograph-reason`. It adds no styling. Keep the host’s HTML sanitization policy.

### Plain-text streaming

```ts
import { createQuoteStream, typographTransformStream } from '@calebduren/typograph/stream';

const stream = createQuoteStream();
stream.write('"Don'); // ''
stream.preview().text; // provisional
stream.end('\'t stop."'); // “Don’t stop.”
```

`write()` commits complete paragraphs separated by blank lines. `end()` flushes the remainder and closes the stream. Concatenated committed output matches batch conversion across chunk boundaries. A long paragraph increases buffering and latency; callers handling unbounded input should set their own limits. `preview()` reanalyzes the pending paragraph; call it at display cadence. `typographTransformStream()` uses the same policy in a Web TransformStream.

## API and limits

- Import from `@calebduren/typograph` and its subpaths. Use `TypographOptions`, `TypographResult`, and `typographTransformStream` for the typed and streaming APIs.
- Use `data-typograph="off"` to protect HTML subtrees. Adapter reports are available at `tree.data.typograph`; custom inspectors can read the `data-typograph-*` annotation attributes.
- English punctuation conventions are the initial scope. Do not apply them globally to multilingual content. Quote balance resets at paragraph boundaries; multi-paragraph literary quotation conventions remain outside the heuristic engine.
- No automatic DOM observers, editor typing interception, or undo/selection management.
- The package supports Node 18+ and modern browsers; the CSS requires modern CSS nesting and color support. Optional newer properties have ordinary layout fallbacks. Development uses Node 22.12+ or Node 24.

## Development

`npm run check` builds both deliverables, typechecks, runs the test suite, and installs the actual archive in a clean consumer to check ESM, CommonJS, types, CSS, adapters, and runtime dependency boundaries. See [CONTRIBUTING.md](https://github.com/calebduren/typograph/blob/main/CONTRIBUTING.md) and [release instructions](https://github.com/calebduren/typograph/blob/main/docs/releasing.md).

The principles are original guidance informed by Robert Bringhurst through [Richard Rutter’s web adaptation](https://webtypography.net/), [Impeccable](https://impeccable.style/docs/typeset/), and current browser documentation. Reading CSS adapts [shadcn Typeset](https://ui.shadcn.com/docs/typeset). The preserved punctuation engine shares prior art with SmartyPants, smartquotes, retext-smartypants, and Punctilio.

MIT © 2026 [Caleb Durenberger](https://calebduren.com).
