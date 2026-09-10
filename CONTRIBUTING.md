# Contributing to Curly

Bring a sentence that behaves badly. Include the exact input, expected output, options, and whether it is prose, Markdown, or HTML. Explain your editorial intention when more than one mark could be correct. Keep real private text out of issues; a minimal invented example is ideal.

## Work locally

Use Node 22.12+ (or 24 LTS) and npm. The published package supports Node 18+; development tools have newer requirements.

```sh
npm ci
npm run build -w cowboy-curly
npm run dev
```

The playground lives at `http://127.0.0.1:4173/curly/`. It imports the built workspace package; rebuild that package after engine changes.

```sh
npm run typecheck
npm test
npm run build
npm run bench
npm run check:package
```

- `packages/curly/src/index.ts`: prose rules and original-offset decisions.
- `packages/curly/src/tree.ts`: shared inline context for remark/rehype.
- `packages/curly/src/stream.ts`: append-only prose streaming.
- `tests/corpus.ts`: input/output fixtures. Add a case here for changed punctuation behavior; it also runs at every two-way chunk split.
- `tests/renderers.test.tsx`: actual integration rendering.
- `apps/playground`: the public specimen, examples, controls, and field notes.

A rule change should include a useful failing example, preservation tests for neighboring syntax, idempotence, and streaming equivalence where relevant. Keep the default rule set small. Locale-specific behavior belongs in a separately designed future locale system, not an English exception pile.

Do not replace assertions with implementation mirrors or suppress failing randomized seeds. Preserve the input that exposed the problem as a readable regression fixture.

## Publishing and hosting

Build and pass the consumer check before publishing from `packages/curly`. Run `npm pack --dry-run` to inspect contents. The npm package intentionally includes only distributable JavaScript/types, the optional CSS, README, license, and changelog.

The playground deploys through `npx wrangler deploy` after `npm run build`. A dedicated Worker serves `/curly/`; it does not own sibling app paths. The custom domain route is configured in the owning Cloudflare zone. `workers.dev` is usable before domain setup.

See [the release guide](docs/releasing.md) for the full repeatable sequence. Contributions are MIT licensed.
