# Typograph 2.0.0-next.1 preview

Typograph brings together a deterministic English punctuation engine, optional reading styles, and a portable typography skill for agents. The specimen uses a monochrome palette, a compact type scale, and Serrif and Saans by Displaay.

## Included

- Article, documentation, and conversation reading presets with adjustable size, measure, leading, and paragraph space.
- Small optical and numeric utilities, with font synthesis disabled.
- Shared principles covering rhythm, hierarchy, case, numerals, punctuation, and browser limits.
- Inspectable punctuation, remark/rehype adapters, and paragraph-buffered streaming.
- Downloadable, locally built package and skill archives.

## Integration

Use `@calebduren/typograph` and its documented subpaths. The current public names are `TypographOptions`, `TypographResult`, and `typographTransformStream`. HTML opt-outs use `data-typograph="off"`, adapter reports use `tree.data.typograph`, and annotations use `data-typograph-*`. The lightweight inherited stylesheet uses `.typograph-prose`.

See the [README](../README.md) for installation and examples, and [release instructions](releasing.md) for validation and publication. The source repository is [calebduren/typograph](https://github.com/calebduren/typograph). Domain routing and npm metadata are configured; deployment and registry publication are separate steps.
