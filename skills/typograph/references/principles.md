# Typography principles

Generated from `packages/typograph/src/principles.ts`. Change that source, then run `npm run build:resources`.

## Set relationships before values.

The face, size, measure, and leading belong to one decision.

**Category:** principle

**Intent:** Make sustained reading comfortable and give the product an appropriate voice.

**When:** Establishing or changing a reading surface.

**Observe:** Read real paragraphs in the actual font. Inspect line length, x-height, leading, and the container at narrow and wide sizes.

**Action:** Choose body size and measure together, then tune leading. Treat 45–75 characters per line as a starting range for Latin prose. Use local role tokens and preserve established families unless a change is requested.

**Verify:** Read several paragraphs at narrow and wide widths and with larger text. A ch is the advance of the zero glyph, so a 64ch box is not a promise of 64 characters per line.

**Exceptions:** Short labels, code, data tables, and other writing systems need their own measures. A modular ratio is a tool, not proof of good hierarchy.

**Sources:** [Richard Rutter · Measure](https://webtypography.net/2.1.2) · [MDN · Font-relative lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)

## Give the page a rhythm.

Let the leading establish a unit for the space around the text.

**Category:** principle

**Intent:** Make paragraphs and changes in hierarchy feel related as the reader moves down the page.

**When:** Setting paragraph, heading, list, quotation, and caption spacing.

**Observe:** Compare computed leading with visible inter-block gaps. Check both the line box and the glyphs; a font may carry considerable internal space.

**Action:** Choose leading for the face and measure. Relate paragraph and section gaps to that unit. Use unitless line-height and scalable spacing. Put more space before a heading than between it and the passage it introduces.

**Verify:** Inspect mixed headings, lists, and multi-line captions. A rhythm overlay measures intervals; it does not prove that mixed-font baselines align. Recheck after font loading and text resizing.

**Exceptions:** A responsive interface can have several local rhythms. Preserve comfortable reflow and user text settings when a strict grid would cause collisions or excess space.

**Sources:** [Richard Rutter · Leading](https://webtypography.net/2.2.1) · [Richard Rutter · Vertical intervals](https://webtypography.net/2.2.2)

## Make the structure visible.

Size, weight, and space should tell the same story.

**Category:** principle

**Intent:** Let readers find the page structure without having to read every word.

**When:** Defining headings, body text, controls, labels, and supporting details.

**Observe:** Identify the jobs the text performs and compare repeated roles across pages. Look for competing emphasis and headings that blend into body copy.

**Action:** Use a small set of semantic roles. Coordinate weight, size, space, and color. Keep heading levels faithful to the document structure, with visual styles chosen separately.

**Verify:** Scan the rendered page, then read its heading outline. Check long titles, links, strong text, and narrow containers.

**Exceptions:** An expressive display heading may depart from the reading scale when its content and product identity justify it.

**Sources:** [Impeccable · Typeset](https://impeccable.style/docs/typeset/)

## Keep the case considered.

Sentence case by default. Small caps are unavailable unless proven otherwise.

**Category:** house preference

**Intent:** Keep labels quiet and readable without relying on a familiar decorative treatment.

**When:** Styling labels, eyebrows, headings, and abbreviations.

**Observe:** Look for automatic uppercase transforms, added tracking, small-cap declarations, and font synthesis. Distinguish real acronyms and identifiers from decorative casing.

**Action:** Use sentence case for interface labels and headings. Omit an eyebrow that adds no information. Assume fonts lack true small caps: do not request small-caps or all-small-caps. Disable synthesis with font-synthesis: none on the typography scope. Preserve the spelling of acronyms and identifiers.

**Verify:** Inspect computed font-variant-caps and font-synthesis, including fallback fonts and pseudo-elements. No browser-generated small caps are acceptable. CSS feature detection cannot establish that a font contains a feature.

**Exceptions:** An explicit brand brief can require capitals. A later, explicit request for true small caps needs verified glyphs in the delivered font file; synthesis remains disabled. Bringhurst’s discussion of spaced capitals is a contextual convention, not this project’s default.

**Sources:** [MDN · Small-cap synthesis](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-synthesis-small-caps) · [Richard Rutter · Capital spacing](https://webtypography.net/2.1.6)

## Give numbers the right job.

Aligned columns and changing values benefit from steady numeral widths.

**Category:** principle

**Intent:** Make quantities easy to compare without introducing distracting movement.

**When:** Styling numeric columns, counters, measurements, or figures within prose.

**Observe:** Check the font’s numeral features and compare narrow and wide digit strings. Identify whether readers scan by column or read the numbers in a sentence.

**Action:** Use lining tabular numerals for aligned data and changing counters when the delivered font supports them. Align comparable numeric columns to the inline end and reserve sufficient space. Use proportional numerals for ordinary prose where appropriate.

**Verify:** Compare values such as 1,111 and 8,888. Change the number of digits and check decimal alignment, signs, units, and long localized values.

**Exceptions:** Tabular numerals do not align decimal separators by themselves or prevent a longer value from widening. Do not replace a brand font solely to enable a decorative numeral style.

**Sources:** [MDN · Numeric variants](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric)

## Consider the edge of the text.

The visible edge of a letter is different from the edge of its box.

**Category:** technical constraint

**Intent:** Align the visible text thoughtfully while keeping content and selection intact.

**When:** An opening quote interrupts a reading edge, or a display heading needs optical alignment.

**Observe:** Inspect actual glyph positions, container padding, clipping, and browser support. Compare after fonts load.

**Action:** Use hanging-punctuation: first as an optional enhancement for opening punctuation. Use text-box-trim with text-box-edge selectively for optical block alignment. Let unsupported browsers use ordinary text layout.

**Verify:** Check leading quotes, nested emphasis, wrapped headings, selection, and narrow containers. Distinguish syntax support from verified rendering. Keep enough room in the gutter for overhanging marks.

**Exceptions:** Do not apply a fixed negative text-indent to every paragraph or add duplicate punctuation with generated content. Text trimming is not a complete baseline-grid system.

**Sources:** [MDN · Hanging punctuation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hanging-punctuation) · [MDN · Text box trimming](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box-trim)

## Let the lines breathe.

A good line ending should survive a different screen.

**Category:** principle

**Intent:** Keep headings composed and prose easy to follow across changing widths.

**When:** A heading has a stranded word or paragraph line endings need attention.

**Observe:** Read the rag at multiple container widths. Determine whether content is finished, being edited, or streaming.

**Action:** Try text-wrap: balance on short headings and text-wrap: pretty on settled prose where supported. Prefer natural reflow to hard-coded line breaks. Keep links, commands, and identifiers exact.

**Verify:** Test long words and narrow containers. Browser algorithms differ. Pretty wrapping can reconsider earlier lines as content grows; verify streaming separately and use ordinary wrapping while content is arriving if needed.

**Exceptions:** Use nonbreaking spaces only when a specific semantic group must stay together and still fits. Avoid blanket last-two-word joining. Paged-media widows and orphans properties do not guarantee a better last line in a scrolling page.

**Sources:** [MDN · Text wrapping](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap)

## Keep the words intact.

A formatting decision should have a reason and a boundary.

**Category:** technical constraint

**Intent:** Improve reading without corrupting code, exact data, or editorial meaning.

**When:** Formatting punctuation or integrating with Markdown, HTML, and AI output.

**Observe:** Locate the rendering boundary, parser, prose nodes, literal content, and language. Identify whether final output or a provisional stream is being shown.

**Action:** Use the remark or rehype adapter for structured content and smarten only for known plain prose. Keep English punctuation rules scoped to English. Protect exact spans. Preserve existing Unicode punctuation and leave ambiguous marks unchanged.

**Verify:** Inspect analyze() or the tree report. Confirm code, URLs, attributes, math nodes, and explicit opt-outs remain exact. Preserve renderer defaults and distinguish provisional Markdown from paragraph-buffered prose.

**Exceptions:** Do not automatically rewrite dashes, whitespace, sentence wording, editor input, or transport data. Punctuation formatting does not sanitize HTML.

**Sources:** [Typograph · Punctuation source](https://github.com/calebduren/typograph)
