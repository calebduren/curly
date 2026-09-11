# Integration

Typograph is a preview package named `@calebduren/typograph`. The unscoped npm name `typograph` belongs to an unrelated project. Do not install that package as a substitute. Until registry publication is verified, use the tested archive produced by this repository or supplied by the user.

## Optional reading CSS

```tsx
import '@calebduren/typograph/typography.css';

<article className="typeset typeset-article type-measure">{children}</article>;
```

Choose `typeset-article`, `typeset-docs`, or `typeset-chat` for a starting recipe. The layout opts into measure with `type-measure`. Set `--typeset-font-body`, `--typeset-font-heading`, and `--typeset-font-mono` to the application’s fonts. Size and leading are explicit; there is no hidden mobile size multiplier.

If shadcn Typeset is already installed, use the preset values or translate the relevant overrides into that owned CSS. Avoid importing two copies. The adapted Typeset file retains low-specificity selectors, theme variables, `not-typeset` / `data-not-typeset` opt-outs, real tables, and spacing that flows forward. Add `typeset-scroll` around wide tables when horizontal scrolling is appropriate.

```ts
import { createTypeset } from '@calebduren/typograph/typography';

const variables = createTypeset({ size: 18, leading: 30 / 18, measure: 64, paragraph: 1 });
// Apply the returned CSS custom properties to the typeset container.
```

`size` uses CSS pixels at the default 16px root; output uses rem and follows the reader’s root text size. `leading` is unitless. `paragraph` expresses paragraph space as a fraction of the body leading. `measure` uses ch, the zero glyph’s advance, not a literal character count. Inputs must be finite and positive; paragraph space may be zero.

Utilities: `type-measure`, `type-balance`, `type-pretty`, `type-hang`, `type-numbers`, `type-proportional`, `type-ui`, `type-caption`, `type-trim`, `type-no-synthesis`. Small caps are intentionally absent. New page styles should set `font-synthesis: none` and `font-variant-caps: normal` at the root. Keep existing brand fonts; do not assume every OpenType feature exists.

## Punctuation

For known English prose, use `smarten(text, options)`. Use `analyze` for changes and reasons. Quotes and apostrophes are enabled by default; primes and ellipses are explicit options. Existing Unicode marks remain unchanged. Dashes, spelling, and whitespace are preserved.

For Markdown, run the remark adapter inside the renderer:

```tsx
import Markdown from 'react-markdown';
import remarkTypograph from '@calebduren/typograph/remark';

<Markdown remarkPlugins={[remarkTypograph]}>{message}</Markdown>;
```

Retain the renderer’s existing plugins. Math protection needs a parser that creates math nodes. In Streamdown, preserve `defaultRemarkPlugins`. In HTML, use the rehype adapter and keep the existing sanitization policy. `data-typograph="off"` protects a subtree. Both adapters accept `skip(node)`.

With `annotate: true`, adapters emit semantic marks carrying `data-typograph-id`, `data-typograph-kind`, and `data-typograph-reason`. Avoid geometry-changing styles on inspector marks. Reports are available at `tree.data.typograph` and as the return value of `transformTree`.

## Streaming

Markdown rendering is provisional and can reinterpret the incomplete block. The separate `createQuoteStream()` buffers plain prose to paragraph boundaries; `preview()` is provisional, and `end()` flushes the final paragraph. `typographTransformStream()` exposes the same policy as a Web TransformStream. Decode AI transport data first; never feed raw JSON, SSE, or tool arguments into a prose formatter.

## Sources and updates

The principles are original guidance informed by Robert Bringhurst through Richard Rutter’s web adaptation, Impeccable, and current MDN documentation. The CSS foundation is an attributed adaptation of shadcn Typeset. Read the current browser documentation when support affects an implementation decision. Preserve attribution when distributing the adapted CSS.
