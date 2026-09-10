# Designing Curly

Curly starts from a small conviction: the punctuation in an interface deserves the same care as its layout. A model can write a good sentence and still leave it feeling unfinished. The product brings that final bit of typographic judgment to the place where the sentence is rendered.

## A useful constraint

The first version concentrates on English quotes and apostrophes. Primes and ellipses are explicit options. Broader typography tools already exist; Curly earns its place through a small surface area, inspectable decisions, and integrations that respect mixed prose and code.

That focus is also a trust decision. Applying a global replacement to an AI response can corrupt a code sample or JSON field. The plain-text function asks its caller to identify prose. Markdown and HTML adapters understand the document’s structure and carry quotation context across emphasis and links.

## Make the judgment visible

The playground uses the same package that developers install. Visitors can edit a sentence, switch between original and formatted punctuation without changing the preview’s typeface, and select a mark to read why it changed. Preserved code and ambiguous marks are included in the inspector. The interface exposes the tradeoff instead of hiding behind an accuracy score.

The measurement sample demonstrates this distinction: `24" wide` can become `24″ wide`, while `"Model 3"` remains a quotation and an isolated `6"` is left for the writer. These are authored examples, not a claim of perfect language understanding.

## A restrained visual world

Warm chalk, ink, and warm orange brown tie the product to Cowboy without turning a writing tool into a costume. Fraunces supplies the expressive voice; DM Sans carries the controls and explanations. Monospace is reserved for editable source, code, and measurements.

The desktop layout behaves like a type specimen with an attached control rail. Mobile stacks the source and reading view. The reading preview expands to fit ordinary samples, while long input and code scroll inside their own boundaries.

## Streaming is a product decision

A quote at the end of an unfinished chunk may change meaning when the next character arrives. The Markdown demonstration labels itself as a replay and lets the renderer revise incomplete content. The separate prose stream offers settled output at paragraph boundaries and an explicitly provisional preview. The API makes the latency/context tradeoff visible.

## Evidence, and its limits

The repository includes fixtures, randomized idempotence and chunk-boundary checks, actual renderer tests, a clean package-consumer check, and a public CI workflow. The browser checks exercise editing, comparison, inspection, prime/ellipsis options, replay, copying, and export. [The performance report](../benchmarks/README.md) records the hardware, versions, inputs, and comparable library configurations.

This is engineering and interface verification, not a user study. There are no adoption numbers or task-success claims yet. The next useful research is to watch developers integrate the package into existing rendering pipelines and ask writers which ambiguous cases they want left alone.

## What stays outside V1

International quotation styles need locale-specific rules and tests. Automatic replacement inside text editors needs careful selection, composition, and undo handling. Dashes and spacing have more editorial consequences than their size suggests. Each deserves its own evidence before becoming a default.
