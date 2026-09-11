# Typograph's typography

The interface uses [Saans](https://displaay.net/typeface/saans); [Serrif](https://displaay.net/typeface/serrif) is the reading face. Both are by [Displaay Type Foundry](https://displaay.net/), linked in the footer. The site uses the two supplied variable WOFF2 files. The duplicate TTF files are not needed for web delivery.

Font inspection establishes Saans’s weight range of 300–900, slant range of −10–0, and custom `MONO` range of 0–100. Serrif provides weight 100–900, slant −10–0, and width 50–100. Both use regular 400 and strong 600 in the current design. Serrif is explicitly set to 100% width: its file’s default is compressed. Semantic emphasis uses `font-style: oblique 10deg`, mapped to the actual `slnt` axis through the face’s declared range; `font-synthesis: none` prevents fabricated forms. Source and code use Saans with `MONO` at 100. Weight, width, and slant remain controlled through their normal CSS properties rather than locked by a global variation setting.

Vite loads the two brand files from the ignored `apps/playground/.local/fonts/` directory in development and production builds. Clean checkouts without them use self-hosted DM Sans, Fraunces, and DM Mono from Fontsource. Labels reflect font availability. The supplied trial files remain outside the toolkit package.

Both supplied fonts contain real proportional and tabular numeral substitutions. The numbers study uses Saans. When brand files are absent, it uses Adobe’s complete Source Serif 4 Roman variable WOFF2; its source revision and SIL Open Font License are beside the asset in `apps/playground/public/fonts/`. A valid CSS declaration alone does not prove feature support.

The site’s maximum authored size is `--type-max: 1.625rem`, equal to 26px at a 16px root. The title, section headings, rendered Markdown headings, reading lead, and numeral comparison respect this ceiling, including at the largest specimen body size. The cap scales with reader preferences and zoom; it is a site preference, not a limit imposed by the portable toolkit.

## Relationships

The article starting point is 18px text, 30px leading, a maximum measure of 64ch, and one line of paragraph space, expressed in scalable units. Documentation begins at 16/26 with a 68ch measure; conversation begins at 16/24 with 58ch. These are starting relationships, not universal optimums. The specimen lets the reader change them independently and exports the actual values.

Paragraph spacing derives from size × unitless leading × the chosen paragraph interval. Forward spacing avoids changing the previous block's margin when another arrives. The optional guide repeats at the line interval. It is explicitly not an exact baseline grid: font metrics, headings, fallback fonts, and responsive wrapping still require visual judgment.

The heading scale, sentence-case labels, natural tracking, and grouped space provide hierarchy. Small caps are assumed unavailable. `font-synthesis: none` and normal cap variants prevent browser-generated small caps, weights, and slants in the scoped reading surface. Use real weights and italic faces when those distinctions are needed.

## Progressive enhancement

- Balanced headings and prettier prose are optional wrapping utilities, with normal wrapping as the fallback.
- Hanging punctuation is opt-in. The specimen disables its switch where the browser rejects the property. Even a supported declaration needs visual inspection.
- Text-edge trimming is opt-in and guarded by `@supports`; it is for isolated labels and headings, not a substitute for prose rhythm.
- Numeric utilities require the selected font to contain suitable forms. CSS support detection cannot establish font feature support.

The library inherits the host application's fonts. It includes no font binaries and does not impose Typograph's brand on the consumer. See the package README and the shared principles for integration and contextual exceptions.
