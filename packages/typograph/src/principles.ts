export interface TypographyPrinciple {
  id: string;
  title: string;
  summary: string;
  kind: 'principle' | 'house preference' | 'technical constraint';
  intent: string;
  when: string;
  observe: string;
  action: string;
  verify: string;
  exception: string;
  sources: readonly { title: string; url: string }[];
}

/** Original guidance, shared by the specimen, reference export, and agent skill. */
export const principles = [
  {
    id: 'relationships',
    title: 'Set relationships before values.',
    summary: 'The face, size, measure, and leading belong to one decision.',
    kind: 'principle',
    intent: 'Make sustained reading comfortable and give the product an appropriate voice.',
    when: 'Establishing or changing a reading surface.',
    observe:
      'Read real paragraphs in the actual font. Inspect line length, x-height, leading, and the container at narrow and wide sizes.',
    action:
      'Choose body size and measure together, then tune leading. Treat 45–75 characters per line as a starting range for Latin prose. Use local role tokens and preserve established families unless a change is requested.',
    verify:
      'Read several paragraphs at narrow and wide widths and with larger text. A ch is the advance of the zero glyph, so a 64ch box is not a promise of 64 characters per line.',
    exception:
      'Short labels, code, data tables, and other writing systems need their own measures. A modular ratio is a tool, not proof of good hierarchy.',
    sources: [
      { title: 'Richard Rutter · Measure', url: 'https://webtypography.net/2.1.2' },
      {
        title: 'MDN · Font-relative lengths',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length',
      },
    ],
  },
  {
    id: 'rhythm',
    title: 'Give the page a rhythm.',
    summary: 'Let the leading establish a unit for the space around the text.',
    kind: 'principle',
    intent:
      'Make paragraphs and changes in hierarchy feel related as the reader moves down the page.',
    when: 'Setting paragraph, heading, list, quotation, and caption spacing.',
    observe:
      'Compare computed leading with visible inter-block gaps. Check both the line box and the glyphs; a font may carry considerable internal space.',
    action:
      'Choose leading for the face and measure. Relate paragraph and section gaps to that unit. Use unitless line-height and scalable spacing. Put more space before a heading than between it and the passage it introduces.',
    verify:
      'Inspect mixed headings, lists, and multi-line captions. A rhythm overlay measures intervals; it does not prove that mixed-font baselines align. Recheck after font loading and text resizing.',
    exception:
      'A responsive interface can have several local rhythms. Preserve comfortable reflow and user text settings when a strict grid would cause collisions or excess space.',
    sources: [
      { title: 'Richard Rutter · Leading', url: 'https://webtypography.net/2.2.1' },
      { title: 'Richard Rutter · Vertical intervals', url: 'https://webtypography.net/2.2.2' },
    ],
  },
  {
    id: 'hierarchy',
    title: 'Make the structure visible.',
    summary: 'Size, weight, and space should tell the same story.',
    kind: 'principle',
    intent: 'Let readers find the page structure without having to read every word.',
    when: 'Defining headings, body text, controls, labels, and supporting details.',
    observe:
      'Identify the jobs the text performs and compare repeated roles across pages. Look for competing emphasis and headings that blend into body copy.',
    action:
      'Use a small set of semantic roles. Coordinate weight, size, space, and color. Keep heading levels faithful to the document structure, with visual styles chosen separately.',
    verify:
      'Scan the rendered page, then read its heading outline. Check long titles, links, strong text, and narrow containers.',
    exception:
      'An expressive display heading may depart from the reading scale when its content and product identity justify it.',
    sources: [{ title: 'Impeccable · Typeset', url: 'https://impeccable.style/docs/typeset/' }],
  },
  {
    id: 'case',
    title: 'Keep the case considered.',
    summary: 'Sentence case by default. Small caps are unavailable unless proven otherwise.',
    kind: 'house preference',
    intent: 'Keep labels quiet and readable without relying on a familiar decorative treatment.',
    when: 'Styling labels, eyebrows, headings, and abbreviations.',
    observe:
      'Look for automatic uppercase transforms, added tracking, small-cap declarations, and font synthesis. Distinguish real acronyms and identifiers from decorative casing.',
    action:
      'Use sentence case for interface labels and headings. Omit an eyebrow that adds no information. Assume fonts lack true small caps: do not request small-caps or all-small-caps. Disable synthesis with font-synthesis: none on the typography scope. Preserve the spelling of acronyms and identifiers.',
    verify:
      'Inspect computed font-variant-caps and font-synthesis, including fallback fonts and pseudo-elements. No browser-generated small caps are acceptable. CSS feature detection cannot establish that a font contains a feature.',
    exception:
      'An explicit brand brief can require capitals. A later, explicit request for true small caps needs verified glyphs in the delivered font file; synthesis remains disabled. Bringhurst’s discussion of spaced capitals is a contextual convention, not this project’s default.',
    sources: [
      {
        title: 'MDN · Small-cap synthesis',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-synthesis-small-caps',
      },
      { title: 'Richard Rutter · Capital spacing', url: 'https://webtypography.net/2.1.6' },
    ],
  },
  {
    id: 'numbers',
    title: 'Give numbers the right job.',
    summary: 'Aligned columns and changing values benefit from steady numeral widths.',
    kind: 'principle',
    intent: 'Make quantities easy to compare without introducing distracting movement.',
    when: 'Styling numeric columns, counters, measurements, or figures within prose.',
    observe:
      'Check the font’s numeral features and compare narrow and wide digit strings. Identify whether readers scan by column or read the numbers in a sentence.',
    action:
      'Use lining tabular numerals for aligned data and changing counters when the delivered font supports them. Align comparable numeric columns to the inline end and reserve sufficient space. Use proportional numerals for ordinary prose where appropriate.',
    verify:
      'Compare values such as 1,111 and 8,888. Change the number of digits and check decimal alignment, signs, units, and long localized values.',
    exception:
      'Tabular numerals do not align decimal separators by themselves or prevent a longer value from widening. Do not replace a brand font solely to enable a decorative numeral style.',
    sources: [
      {
        title: 'MDN · Numeric variants',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric',
      },
    ],
  },
  {
    id: 'edges',
    title: 'Consider the edge of the text.',
    summary: 'The visible edge of a letter is different from the edge of its box.',
    kind: 'technical constraint',
    intent: 'Align the visible text thoughtfully while keeping content and selection intact.',
    when: 'An opening quote interrupts a reading edge, or a display heading needs optical alignment.',
    observe:
      'Inspect actual glyph positions, container padding, clipping, and browser support. Compare after fonts load.',
    action:
      'Use hanging-punctuation: first as an optional enhancement for opening punctuation. Use text-box-trim with text-box-edge selectively for optical block alignment. Let unsupported browsers use ordinary text layout.',
    verify:
      'Check leading quotes, nested emphasis, wrapped headings, selection, and narrow containers. Distinguish syntax support from verified rendering. Keep enough room in the gutter for overhanging marks.',
    exception:
      'Do not apply a fixed negative text-indent to every paragraph or add duplicate punctuation with generated content. Text trimming is not a complete baseline-grid system.',
    sources: [
      {
        title: 'MDN · Hanging punctuation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hanging-punctuation',
      },
      {
        title: 'MDN · Text box trimming',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box-trim',
      },
    ],
  },
  {
    id: 'wrapping',
    title: 'Let the lines breathe.',
    summary: 'A good line ending should survive a different screen.',
    kind: 'principle',
    intent: 'Keep headings composed and prose easy to follow across changing widths.',
    when: 'A heading has a stranded word or paragraph line endings need attention.',
    observe:
      'Read the rag at multiple container widths. Determine whether content is finished, being edited, or streaming.',
    action:
      'Try text-wrap: balance on short headings and text-wrap: pretty on settled prose where supported. Prefer natural reflow to hard-coded line breaks. Keep links, commands, and identifiers exact.',
    verify:
      'Test long words and narrow containers. Browser algorithms differ. Pretty wrapping can reconsider earlier lines as content grows; verify streaming separately and use ordinary wrapping while content is arriving if needed.',
    exception:
      'Use nonbreaking spaces only when a specific semantic group must stay together and still fits. Avoid blanket last-two-word joining. Paged-media widows and orphans properties do not guarantee a better last line in a scrolling page.',
    sources: [
      {
        title: 'MDN · Text wrapping',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap',
      },
    ],
  },
  {
    id: 'integrity',
    title: 'Keep the words intact.',
    summary: 'A formatting decision should have a reason and a boundary.',
    kind: 'technical constraint',
    intent: 'Improve reading without corrupting code, exact data, or editorial meaning.',
    when: 'Formatting punctuation or integrating with Markdown, HTML, and AI output.',
    observe:
      'Locate the rendering boundary, parser, prose nodes, literal content, and language. Identify whether final output or a provisional stream is being shown.',
    action:
      'Use the remark or rehype adapter for structured content and smarten only for known plain prose. Keep English punctuation rules scoped to English. Protect exact spans. Preserve existing Unicode punctuation and leave ambiguous marks unchanged.',
    verify:
      'Inspect analyze() or the tree report. Confirm code, URLs, attributes, math nodes, and explicit opt-outs remain exact. Preserve renderer defaults and distinguish provisional Markdown from paragraph-buffered prose.',
    exception:
      'Do not automatically rewrite dashes, whitespace, sentence wording, editor input, or transport data. Punctuation formatting does not sanitize HTML.',
    sources: [
      { title: 'Typograph · Punctuation source', url: 'https://github.com/calebduren/typograph' },
    ],
  },
] as const satisfies readonly TypographyPrinciple[];
