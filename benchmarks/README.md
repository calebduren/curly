# Typograph performance report

Measured 2026-09-11 on Apple M3 Max, Node v22.19.0. Run `npm run build -w @calebduren/typograph && npm run bench` to reproduce.

These are local measurements, not guarantees for every browser or device. Nine warmed rounds; each table reports the median per call. Workloads are synthetic English prose. Allocation, parsing, and diagnostics are included in the API being timed. Different libraries have different semantics; this is not a correctness ranking.

## Browser bundle size

Punctuation entrypoints only. Reading CSS and the typography/principles entrypoints are outside this benchmark.

esbuild bundles each public ESM entry independently, minified with gzip. Sizes include Typograph’s shared code, exclude your existing renderer, and are not additive when bundled together. No runtime dependencies.

| Entry | Minified bytes | Gzip bytes |
| --- | ---: | ---: |
| index | 4770 | 2339 |
| remark | 7580 | 3480 |
| rehype | 7557 | 3467 |
| stream | 5554 | 2676 |

## Prose conversion

| Library | Version | 1 KiB | 10 KiB | 100 KiB |
| --- | --- | ---: | ---: | ---: |
| @calebduren/typograph | 2.0.0-next.1 | 0.028 ms | 0.2493 ms | 2.5633 ms |
| smartquotes | 2.3.2 | 0.0082 ms | 0.0643 ms | 0.7295 ms |
| punctilio | 5.4.4 | 0.1322 ms | 1.188 ms | 13.7163 ms |
| retext-smartypants | 6.2.0 | 0.3311 ms | 2.9949 ms | 41.6703 ms |

- **@calebduren/typograph:** defaults: quotes and apostrophes.
- **smartquotes:** defaults.
- **punctilio:** symbols/collapseSpaces/nbsp off; dashStyle none; American quotes.
- **retext-smartypants:** retext pipeline; dashes and ellipses off.

Typograph includes its inspectable decision records. retext includes its parser/stringifier pipeline. Punctilio can do substantially more typography work than Typograph; unrelated transforms are disabled here. All input is ASCII, so code-unit counts equal bytes. Dependency versions are pinned in the lockfile.

## Stress cases

| Input | Typograph median |
| --- | ---: |
| 100k ordinary word | 1.3634 ms |
| 99k adjacent quotes | 22.1537 ms |
| 100k repeated at signs | 5.501 ms |
| 100k paragraph, one-character chunks, one final flush | 4.0524 ms |

The streaming measurement excludes preview calls. Calling preview after every character reparses the pending paragraph; render it at display cadence. An unbroken paragraph is buffered until end, so pending memory grows with paragraph size. The scanner visits each character once; sorting caller-supplied/protected ranges costs O(r log r).

## Scope and comparison

Typograph intentionally concentrates on English quotes/apostrophes, optional primes/ellipses, exact spans, AST integrations, and explainable decisions. Smartquotes is a compact quote converter. retext-smartypants fits natural-language processing pipelines. Punctilio offers a much broader typography system and localization. Use the library whose behavior fits your project.

The correctness corpus is authored for Typograph’s documented rules and should not be presented as an independent competition. Contributions with failing examples are welcome.
