# Curly performance report

Measured 2026-09-10 on Apple M3 Max, Node v26.7.0. Run `npm run build -w cowboy-curly && npm run bench` to reproduce.

These are local measurements, not guarantees for every browser or device. Nine warmed rounds; each table reports the median per call. Workloads are synthetic English prose. Allocation, parsing, and diagnostics are included in the API being timed. Different libraries have different semantics; this is not a correctness ranking.

## Browser bundle size

esbuild bundles each public ESM entry independently, minified with gzip. Sizes include Curly’s shared code, exclude your existing renderer, and are not additive when bundled together. No runtime dependencies.

| Entry | Minified bytes | Gzip bytes |
| --- | ---: | ---: |
| index | 4758 | 2334 |
| remark | 7544 | 3477 |
| rehype | 7521 | 3464 |
| stream | 5530 | 2671 |

## Prose conversion

| Library | Version | 1 KiB | 10 KiB | 100 KiB |
| --- | --- | ---: | ---: | ---: |
| cowboy-curly | 1.0.0 | 0.0391 ms | 0.2342 ms | 2.3099 ms |
| smartquotes | 2.3.2 | 0.0072 ms | 0.0611 ms | 0.5937 ms |
| punctilio | 5.4.4 | 0.0999 ms | 0.987 ms | 10.6169 ms |
| retext-smartypants | 6.2.0 | 0.3595 ms | 3.5251 ms | 46.7359 ms |

- **cowboy-curly:** defaults: quotes and apostrophes.
- **smartquotes:** defaults.
- **punctilio:** symbols/collapseSpaces/nbsp off; dashStyle none; American quotes.
- **retext-smartypants:** retext pipeline; dashes and ellipses off.

Curly includes its inspectable decision records. retext includes its parser/stringifier pipeline. Punctilio can do substantially more typography work than Curly; unrelated transforms are disabled here. All input is ASCII, so code-unit counts equal bytes. Dependency versions are pinned in the lockfile.

## Stress cases

| Input | Curly median |
| --- | ---: |
| 100k ordinary word | 1.2218 ms |
| 99k adjacent quotes | 20.2869 ms |
| 100k repeated at signs | 4.8903 ms |
| 100k paragraph, one-character chunks, one final flush | 3.6421 ms |

The streaming measurement excludes preview calls. Calling preview after every character reparses the pending paragraph; render it at display cadence. An unbroken paragraph is buffered until end, so pending memory grows with paragraph size. The scanner visits each character once; sorting caller-supplied/protected ranges costs O(r log r).

## Scope and comparison

Curly intentionally concentrates on English quotes/apostrophes, optional primes/ellipses, exact spans, AST integrations, and explainable decisions. Smartquotes is a compact quote converter. retext-smartypants fits natural-language processing pipelines. Punctilio offers a much broader typography system and localization. Use the library whose behavior fits your project.

The correctness corpus is authored for Curly’s documented rules and should not be presented as an independent competition. Contributions with failing examples are welcome.
