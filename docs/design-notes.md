# Designing Curly

Curly starts from a small conviction: the punctuation in an interface deserves the same care as its layout. A model can write a good sentence and still leave it feeling unfinished. The product brings that final bit of typographic judgment to the place where the sentence is rendered.

## A useful constraint

The first version concentrates on English quotes and apostrophes. Primes and ellipses are explicit options. Broader typography tools already exist; Curly earns its place through a small surface area, inspectable decisions, and integrations that respect mixed prose and code.

That focus is also a trust decision. Applying a global replacement to an AI response can corrupt a code sample or JSON field. The plain-text function asks its caller to identify prose. Markdown and HTML adapters understand the document’s structure and carry quotation context across emphasis and links.

## Make the judgment visible

The playground uses the same package that developers install. Visitors can edit a sentence, switch between original and formatted punctuation without changing the preview’s typeface, and select a mark to read why it changed. Preserved code and ambiguous marks are included in the inspector. The interface exposes the tradeoff instead of hiding behind an accuracy score.

The measurement sample demonstrates this distinction: `24" wide` can become `24″ wide`, while `"Model 6"` remains a quotation because its opening mark supplies context. Curly tracks unclosed opening quotes within each paragraph, including across inline formatting. A bare `6"` without an opening quote or a clear measurement cue is left for the writer. These are authored examples, not a claim of perfect language understanding.

## A restrained visual world

Desaturated warm-gray paper and brown-black ink tie the product to Cowboy without turning a writing tool into a costume. The intended pairing uses PP Kyoto for its expressive serif voice and PP Neue Montreal for the controls and explanations. It is available in the local design preview; the public build uses Fraunces and DM Sans while the supplied personal-use licenses are clarified. [Typography notes](typography.md) record the distinction. Monospace is reserved for editable source, code, and measurements.

The header uses Caleb’s supplied looping SVG mark. The earlier logo remains a small footer character made from the font itself: `‘` for eyes, `˜` for a wink, and `˘` for a smile. CSS transitions let the quote squish and crossfade into the small tilde while the breve lifts and tilts toward it. The close is quick and the return softer; repeated pointer interaction retargets the current pose. The compact face greets the visitor and responds to pointer interaction, with a still version for reduced-motion preferences.

The Serif / Sans serif control changes only the reading preview, including its headings, emphasis, and replay. It lets people judge the punctuation in either typographic voice while keeping Original / With Curly as a fair comparison in the same selected typeface.

The desktop playground pairs source and reading panes with attached switches and replay controls. Editorial sections use a centered column capped at 65ch. Body and interface text use 13, 15, and 17px, with no added tracking. Color separates the intro’s promise and supporting copy at the same size. Smaller screens stack the workspace; the reading preview keeps a stable height while long content scrolls locally. Highlights paint on a layer behind every glyph, so a quote’s background cannot obscure an adjacent comma.

A dedicated “How it works” section makes installation a considered decision: it explains document boundaries, quote context, protected content, integration choices, streaming tradeoffs, measured bundle sizes, and known limits. The install command has its own labeled copy action. Field-note disclosures use short, reversible transitions for pointer interaction and respond immediately to the keyboard.

The masthead keeps only the new mark. Attribution and the punctuation face live in the footer, above a faint, full-width ASCII desert with a brief passing tumbleweed. Automatic dark mode carries the same desaturated warmth through native controls, reading surfaces, highlights, code, and browser chrome without a preference toggle. Both gestures respect reduced-motion preferences. The playground uses switches and text feedback instead of checkmark icons; its only copy action copies the visible reading preview.

## Streaming is a product decision

A quote at the end of an unfinished chunk may change meaning when the next character arrives. The Markdown demonstration labels itself as a replay and lets the renderer revise incomplete content. The separate prose stream offers settled output at paragraph boundaries and an explicitly provisional preview. The API makes the latency/context tradeoff visible.

## Evidence, and its limits

The repository includes fixtures, randomized idempotence and chunk-boundary checks, actual renderer tests, a clean package-consumer check, and a public CI workflow. The browser checks exercise editing, comparison, inspection, prime/ellipsis options, replay, and copying. Earlier releases also offered text export; the refined playground consolidates this into copying the visible preview. [The performance report](../benchmarks/README.md) records the hardware, versions, inputs, and comparable library configurations.

This is engineering and interface verification, not a user study. There are no adoption numbers or task-success claims yet. The next useful research is to watch developers integrate the package into existing rendering pipelines and ask writers which ambiguous cases they want left alone.

## What stays outside V1

International quotation styles need locale-specific rules and tests. Automatic replacement inside text editors needs careful selection, composition, and undo handling. Dashes and spacing have more editorial consequences than their size suggests. Each deserves its own evidence before becoming a default.
