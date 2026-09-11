# Contributing to Typograph

Bring a sentence or a reading surface that behaves badly. Include the exact input, expected result, context, and the reason a change would help. Use invented examples instead of private text.

## Work locally

Use Node 22.12+ and npm. The distributed JavaScript supports Node 18+; the development tools require a newer runtime.

```sh
npm ci
npm run dev
```

The specimen is at `http://127.0.0.1:4173/`. The dev command builds the workspace library, generates the downloadable archives, then starts Vite. After changing library code, rebuild it with `npm run build -w @calebduren/typograph`; after changing skill content, run `npm run build:resources`.

```sh
npm run check
```

This builds the library, resources, and site; typechecks; runs the correctness suite; and installs the real package archive into a clean consumer to check ESM, CommonJS, TypeScript, CSS, and adapters.

- `packages/typograph/src/index.ts`: prose rules and original-offset decisions.
- `packages/typograph/src/tree.ts`: shared inline context for remark/rehype.
- `packages/typograph/src/stream.ts`: paragraph-buffered prose streaming.
- `packages/typograph/src/typography.ts`: validated reading presets and CSS variables.
- `packages/typograph/src/principles.ts`: original guidance shared by the site and skill.
- `packages/typograph/typography.css`: optional reading presets and optical utilities.
- `skills/typograph`: portable skill and integration guidance. `references/principles.md` is generated from the shared records.
- `apps/playground`: the interactive specimen, integration examples, and downloads.

## Change a rule deliberately

Punctuation changes need a useful failing example, preservation tests for neighboring syntax, idempotence, and streaming equivalence where relevant. Add corpus examples in `tests/corpus.ts`; they also run at every two-way chunk split. Do not suppress failing randomized seeds or replace assertions with implementation mirrors.

For typography, record the intention, observation, action, verification, and exception. Distinguish a principle from a house preference or technical constraint. A CSS feature being recognized does not prove the selected font provides the required glyphs. Assume small caps are unavailable and never synthesize them.

Check reading styles with real prose, headings, lists, tables, code, mixed inline formatting, narrow widths, larger text, and fallback fonts. Keep forward spacing stable as streaming content is appended. Preserve opt-outs and literal data. A utility should stay useful without this site's fonts or visual identity.

## Sources and releases

Keep shadcn's MIT attribution in `THIRD_PARTY_NOTICES.md` when updating the adapted stylesheet. Link primary sources for new technical guidance and write original explanations. Font licenses belong with the site's font assets; the library ships no fonts.

See [the release guide](docs/releasing.md) for archives, registry publication, and hosting. Contributions are MIT licensed.
