---
name: Typograph
description: Type with intention. A minimalist system shaped by proportion and geometric construction.
colors:
  gray: '#8d8d8d'
  hover: '#444444'
  paper: '#fcfcfc'
  sheet: '#f7f7f7'
  soft: '#ededed'
  ink: '#242424'
  muted: '#666666'
  line: '#d8d8d8'
  accent: '#242424'
  accent-soft: '#dedede'
  guide: '#8d8d8d30'
  dark-hover: '#dedede'
  dark-paper: '#242424'
  dark-sheet: '#292929'
  dark-soft: '#333333'
  dark-ink: '#fcfcfc'
  dark-muted: '#b5b5b5'
  dark-line: '#4b4b4b'
  dark-accent: '#fcfcfc'
  dark-accent-soft: '#454545'
  dark-guide: '#8d8d8d33'
typography:
  display:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.625rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: normal
  display-mobile:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.625rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: normal
  headline:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.625rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: normal
  wordmark:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: normal
  body:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: normal
  intro:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: normal
  label:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: normal
  annotation:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: normal
  reading:
    fontFamily: "'Serrif', 'Fraunces Variable', Georgia, serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6666666666666667
    letterSpacing: normal
  reading-title:
    fontFamily: "'Serrif', 'Fraunces Variable', Georgia, serif"
    fontSize: min(1.5em, 1.625rem)
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: normal
  code:
    fontFamily: "'Saans', 'DM Mono', ui-monospace, monospace"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  body-small:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: normal
  wordmark-mobile:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: normal
  prompt-mobile:
    fontFamily: "'Saans', 'DM Sans Variable', sans-serif"
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: normal
rounded:
  control: 0.125rem
  track: 1rem
  circle: 50%
  annotation: 1px
spacing:
  compact: 0.5rem
  inline: 0.75rem
  unit: 1rem
  label: 1.25rem
  group: 1.5rem
  panel: 2rem
  column: 3rem
  mobile-section: 3.5rem
  section: 6rem
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 0.65rem 1rem
  button-primary-hover:
    backgroundColor: '{colors.hover}'
    textColor: '{colors.sheet}'
  button-secondary:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 0.65rem 1rem
  select:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: 0.625rem
  specimen-nav:
    textColor: '{colors.muted}'
    typography: '{typography.label}'
    padding: 1.25rem 0
  prompt-panel:
    backgroundColor: '{colors.soft}'
    textColor: '{colors.ink}'
    padding: 2rem
  switch:
    textColor: '{colors.ink}'
    size: 1.75rem 1rem
    rounded: '{rounded.track}'
---

# Design System: Typograph

## Overview

**Creative North Star: "Type with intention"**

Typograph uses geometric construction, asymmetric proportion, a monochrome palette, and restrained tonal emphasis. The identity follows the approved minimalist/Bauhaus direction. The small T and point are the recurring mark; typography supplies the expression.

The interface uses a clear sans serif voice. The reading specimen introduces a contrasting serif so people can see the relationships among size, measure, leading, and space. These are Typograph’s own brand choices; the portable skill preserves the identity of the product where it is used.

**Key Characteristics:**

- Geometric T and gray point.
- Sentence-case labels with natural tracking.
- Asymmetric layouts and grouped space.
- Flat surfaces, visible controls, and inspectable text.

## Colors

The palette is anchored by #242424 ink, #8d8d8d gray, and #fcfcfc paper. All supporting tones are neutral grays. Paper is the page, sheet is the reading surface, soft is the inset panel, muted is supporting text, and line is the fine boundary. Gray supplies the large display emphasis and mark point; the darker muted token keeps small supporting text readable. The soft accent supports selection and the translucent guide marks line intervals. Dark-prefixed tokens are the automatic dark-mode values, activated by `prefers-color-scheme`.

**The Monochrome Rule.** Use neutral tones derived from the three palette anchors. Never use pure black, pure white, or colored accents. Use ink for reading and active states; reserve middle gray for large type and accents.

## Typography

Saans carries the display, labels, interface prose, and numeral study. Serrif is the reading voice, with Saans available in the specimen. Two variable WOFF2 files supply the pair: Saans supports weights 300–900; Serrif supports 100–900. Both have an actual slant axis from −10 to 0. Body text uses 400 and emphasis uses 600; semantic italics use the supplied 10-degree slant with synthesis disabled. Serrif’s width is explicitly set to 100%. Source and code use Saans’s `MONO` axis at 100. Vite uses the local brand files when present; clean checkouts use self-hosted DM Sans, Fraunces, and DM Mono, plus Source Serif 4 for the numeral study. Both supplied Displaay fonts have verified proportional and tabular forms.

The site’s authored type scale tops out at 1.625rem, about 26px at the default root size. Display and section headings share this ceiling; reading headings, lead text, Markdown headings, and enlarged numeral comparisons use capped relative sizes. At widths up to 430px, the wordmark becomes 1.25rem. Browser zoom and reader text preferences remain effective because the cap is relative. The site has no tracked-uppercase styling. The root uses `font-synthesis: none` and normal caps. Footer attribution links Serrif, Saans, and Displaay Type Foundry.

The article starts at 18/30 with 64ch maximum measure and one line of paragraph space. Documentation starts at 16/26 and 68ch, conversation at 16/24 and 58ch; their paragraph gap is three quarters of a line. These are optional toolkit starting points. The specimen exports rem sizes and a unitless line-height. A `ch` is a zero-glyph advance, not a character count.

**The Compact Scale Rule.** Keep authored site type at or below 1.625rem while preserving reader scaling. Establish hierarchy through weight, spacing, and structure.

**The Real Forms Rule.** Assume true small caps are unavailable. Never synthesize small caps, and use the weights and italics actually loaded.

**The Relationship Rule.** Choose size, measure, leading, and paragraph space together, then inspect actual text. A guide interval is not proof of baseline alignment.

## Layout

Page content is capped at 80rem with a fluid gutter from 1.25rem to 4rem. The desktop specimen pairs a 17rem control rail with a flexible reading surface; the rail becomes 15rem at 1050px. Supporting sections use unequal columns and the section spacing token. At 760px, the page and specimen stack, controls use two columns, and sections use the mobile spacing token. The smallest breakpoint is 430px.

Keep repeated role spacing consistent while allowing each reading context its own rhythm. Preserve native text resizing and reflow. Desktop-only breaks require explicit word spaces for the narrow layout. Source and code scroll locally when their literal content cannot wrap.

## Elevation & Depth

**The Flat Surface Rule.** Use tonal surfaces and fine boundaries to group content. The implemented system has no box shadows.

The reading sheet, subdued code panel, and prompt panel establish grouping through tone. The functional rhythm overlay is a measuring aid, not a background treatment for other surfaces.

## Shapes

The geometric T is made of rectangular strokes and a separate gray point. Panels are rectangular; buttons and native selects have slight corner relief using the control radius. Rounded switch tracks and circular thumbs describe an on/off mechanism. Preserve that functional exception instead of rounding unrelated panels.

## Components

Buttons use clear labels, a minimum 2.75rem height, and a fine boundary. Primary actions reverse paper on ink and use the hover tone on hover; secondary actions gain the soft surface. Icon actions have at least a 2rem target. Focus is a 2px accent outline with 4px offset; disabled actions visibly reduce emphasis.

Native selects retain their semantics and use the paper surface and control radius. Sliders keep labeled values next to the control. Topic navigation uses neutral labels and a 2px ink active underline, with a 180ms ease-out transition. Its actual interaction is a group of pressed-state buttons, not a tab panel.

Switches move their thumb over 160ms after pointer input. Principle disclosures expand over 220ms, rotate their plus over 180ms, and make collapsed content inert. Keyboard changes remain immediate where the component tracks input modality. Reduced-motion preferences remove transitions and smooth scrolling. The numeral study and punctuation inspector demonstrate actual changes; unsupported enhancements remain clearly explained.

## Do's and Don'ts

### Do

- Do use the semantic light and dark colors together.
- Do keep headings and labels in sentence case and preserve real acronyms.
- Do connect spacing to the local reading rhythm.
- Do preserve word boundaries when responsive line breaks disappear.
- Do show observable changes and explain font or browser limitations.

### Don’t

- Don’t use pure black, pure white, or colored accents.
- Don’t add mascots or decorative landscape imagery.
- Don’t add tracked uppercase eyebrows or synthetic small caps.
- Don’t treat a valid CSS declaration as proof that a font contains the feature.
- Don’t impose this site’s visual identity on products using the skill.
