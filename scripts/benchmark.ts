import { performance } from 'node:perf_hooks';
import { cpus } from 'node:os';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { smarten } from '../packages/curly/src/index';
import { createQuoteStream } from '../packages/curly/src/stream';
import { transform as punctilio } from 'punctilio';
import { retext } from 'retext';
import retextSmartypants from 'retext-smartypants';

const require = createRequire(import.meta.url);
const smartquotes = require('smartquotes') as (s: string) => string;
const processor = retext().use(retextSmartypants, { dashes: false, ellipses: false });
const prose =
  '"Good words deserve good type," she said. It\'s a small detail, and we don\'t overlook the little things.\n\n';
const configs = [
  {
    name: 'cowboy-curly',
    run: (s: string) => smarten(s),
    options: 'defaults: quotes and apostrophes',
  },
  { name: 'smartquotes', run: smartquotes, options: 'defaults' },
  {
    name: 'punctilio',
    run: (s: string) =>
      punctilio(s, { symbols: false, collapseSpaces: false, dashStyle: 'none', nbsp: false }),
    options: 'symbols/collapseSpaces/nbsp off; dashStyle none; American quotes',
  },
  {
    name: 'retext-smartypants',
    run: (s: string) => String(processor.processSync(s)),
    options: 'retext pipeline; dashes and ellipses off',
  },
];
function measure(fn: () => unknown) {
  for (let i = 0; i < 5; i++) fn();
  const start = performance.now();
  for (let i = 0; i < 3; i++) fn();
  const estimate = (performance.now() - start) / 3;
  const count = Math.max(1, Math.min(500, Math.ceil(8 / Math.max(estimate, 0.001))));
  const runs = [];
  for (let r = 0; r < 9; r++) {
    const t = performance.now();
    for (let i = 0; i < count; i++) fn();
    runs.push((performance.now() - t) / count);
  }
  runs.sort((a, b) => a - b);
  return { medianMs: +runs[4].toFixed(4), p95Ms: +runs[8].toFixed(4), iterationsPerRound: count };
}
const versions: Record<string, string> = {};
for (const c of configs)
  versions[c.name] =
    c.name === 'cowboy-curly'
      ? '1.0.0'
      : JSON.parse(
          await readFile(
            new URL('../node_modules/' + c.name + '/package.json', import.meta.url),
            'utf8',
          ),
        ).version;
const timings: ({ library: string; inputCodeUnits: number } & ReturnType<typeof measure>)[] = [];
for (const length of [1024, 10240, 102400]) {
  const input = prose.repeat(Math.ceil(length / prose.length)).slice(0, length);
  for (const config of configs)
    timings.push({
      library: config.name,
      inputCodeUnits: length,
      ...measure(() => config.run(input)),
    });
}
const bundle = [];
for (const entry of ['index', 'remark', 'rehype', 'stream']) {
  const result = await build({
    entryPoints: ['packages/curly/dist/' + entry + '.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    platform: 'browser',
    write: false,
  });
  const bytes = result.outputFiles![0].contents;
  bundle.push({ entry, bytes: bytes.length, gzipBytes: gzipSync(bytes).length });
}
const stress = ['a'.repeat(100000), '"\' '.repeat(33000), 'x@'.repeat(50000)];
const adversarial = stress.map((s, i) => ({
  case: ['100k ordinary word', '99k adjacent quotes', '100k repeated at signs'][i],
  ...measure(() => smarten(s)),
}));
const streamed = 'a'.repeat(100000) + ' "done"';
const streaming = measure(() => {
  const s = createQuoteStream();
  for (const c of streamed) s.write(c);
  return s.end();
});
const facts = {
  date: new Date().toISOString().slice(0, 10),
  runtime: process.version,
  cpu: cpus()[0].model,
  versions,
  configurations: configs.map(({ name, options }) => ({ name, options })),
  rounds: 9,
  bundle,
  timings,
  adversarial,
  streaming,
};
await mkdir('benchmarks', { recursive: true });
await writeFile('benchmarks/results.json', JSON.stringify(facts, null, 2) + '\n');
const lines = [
  '# Curly performance report',
  '',
  `Measured ${facts.date} on ${facts.cpu}, Node ${facts.runtime}. Run \`npm run build -w cowboy-curly && npm run bench\` to reproduce.`,
  '',
  'These are local measurements, not guarantees for every browser or device. Nine warmed rounds; each table reports the median per call. Workloads are synthetic English prose. Allocation, parsing, and diagnostics are included in the API being timed. Different libraries have different semantics; this is not a correctness ranking.',
  '',
  '## Browser bundle size',
  '',
  'esbuild bundles each public ESM entry independently, minified with gzip. Sizes include Curly’s shared code, exclude your existing renderer, and are not additive when bundled together. No runtime dependencies.',
  '',
  '| Entry | Minified bytes | Gzip bytes |',
  '| --- | ---: | ---: |',
  ...bundle.map((r) => `| ${r.entry} | ${r.bytes} | ${r.gzipBytes} |`),
  '',
  '## Prose conversion',
  '',
  '| Library | Version | 1 KiB | 10 KiB | 100 KiB |',
  '| --- | --- | ---: | ---: | ---: |',
  ...configs.map(
    (c) =>
      `| ${c.name} | ${versions[c.name]} | ${timings
        .filter((r) => r.library === c.name)
        .map((r) => r.medianMs + ' ms')
        .join(' | ')} |`,
  ),
  '',
  ...configs.map((c) => `- **${c.name}:** ${c.options}.`),
  '',
  'Curly includes its inspectable decision records. retext includes its parser/stringifier pipeline. Punctilio can do substantially more typography work than Curly; unrelated transforms are disabled here. All input is ASCII, so code-unit counts equal bytes. Dependency versions are pinned in the lockfile.',
  '',
  '## Stress cases',
  '',
  '| Input | Curly median |',
  '| --- | ---: |',
  ...adversarial.map((r) => `| ${r.case} | ${r.medianMs} ms |`),
  `| 100k paragraph, one-character chunks, one final flush | ${streaming.medianMs} ms |`,
  '',
  'The streaming measurement excludes preview calls. Calling preview after every character reparses the pending paragraph; render it at display cadence. An unbroken paragraph is buffered until end, so pending memory grows with paragraph size. The scanner visits each character once; sorting caller-supplied/protected ranges costs O(r log r).',
  '',
  '## Scope and comparison',
  '',
  'Curly intentionally concentrates on English quotes/apostrophes, optional primes/ellipses, exact spans, AST integrations, and explainable decisions. Smartquotes is a compact quote converter. retext-smartypants fits natural-language processing pipelines. Punctilio offers a much broader typography system and localization. Use the library whose behavior fits your project.',
  '',
  'The correctness corpus is authored for Curly’s documented rules and should not be presented as an independent competition. Contributions with failing examples are welcome.',
];
await writeFile('benchmarks/README.md', lines.join('\n') + '\n');
console.log(JSON.stringify({ bundle, timings, adversarial, streaming }, null, 2));
