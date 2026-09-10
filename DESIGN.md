---
name: Curly
description: A contemporary type specimen with care for the written word.
colors:
  paper: "#f6f2ec"
  sheet: "#fffdf9"
  ink: "#302923"
  muted: "#6b5e53"
  rule: "#d9d0c4"
  soft: "#ece5db"
  accent: "#302923"
  accent-wash: "#e8dfd3"
  selection: "#dfd2c1"
  source-ink: "#5e5248"
  scrollbar: "#9a8878"
  code-hover: "#4a3f35"
  code-ink: "#f3ede4"
  code-muted: "#c4b6a7"
typography:
  display:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "clamp(54px, 6.25vw, 88px)"
    fontWeight: 450
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "clamp(34px, 3.6vw, 48px)"
    fontWeight: 450
    lineHeight: 1.13
    letterSpacing: "-0.04em"
  body:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "21px"
    fontWeight: 380
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  body-ui:
    fontFamily: "'DM Sans Variable', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'DM Sans Variable', sans-serif"
    fontSize: "11px"
    fontWeight: 400
  source:
    fontFamily: "'DM Mono', monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.85
  wordmark:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "35px"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.04em"
  preview-display:
    fontFamily: "'PP Kyoto', Georgia, serif"
    fontSize: "clamp(54px, 6.25vw, 88px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  preview-body:
    fontFamily: "'PP Kyoto', Georgia, serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  preview-wordmark:
    fontFamily: "'PP Kyoto', Georgia, serif"
    fontSize: "35px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  preview-ui:
    fontFamily: "'PP Neue Montreal', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  none: "0"
  mark: "1px"
  small: "2px"
  control: "3px"
  group: "4px"
spacing:
  compact: "4px"
  icon-gap: "6px"
  small: "8px"
  control-gap: "12px"
  medium: "16px"
  mobile-gutter: "20px"
  pane-inset: "24px"
  tablet-gutter: "36px"
  desktop-gutter: "64px"
components:
  button-text:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "0"
    height: "36px"
  button-icon:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    width: "32px"
    height: "36px"
  button-replay:
    textColor: "{colors.accent}"
    padding: "8px 0"
    height: "40px"
  preview-switch:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.group}"
    padding: "3px"
  preview-switch-selected:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.small}"
    padding: "5px 12px"
  input-source:
    textColor: "#5e5248"
    typography: "{typography.source}"
    padding: "27px 26px 24px"
    width: "100%"
    height: "396px"
  navigation:
    textColor: "{colors.ink}"
    padding: "12px 0"
  decision-chip:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
    height: "36px"
  change-mark:
    backgroundColor: "#e8dfd3"
    textColor: "{colors.accent}"
    rounded: "{rounded.mark}"
    padding: "0"
  code-panel:
    backgroundColor: "{colors.ink}"
    textColor: "#f3ede4"
    rounded: "{rounded.none}"
  field-note:
    textColor: "{colors.ink}"
    padding: "20px 0"
---

# Design System: Curly

## Overview

**Creative North Star: "A Contemporary Type Specimen"**

Curly pairs expressive serif letters with precise, quiet controls. Warm paper and brown-black ink carry a restrained Western print influence. The material is a flat reading sheet defined by typography, tonal surfaces, and space.

Punctuation is the signature: two Kyoto quotes form a face’s eyes, a breve forms its smile, and a small tilde supplies its wink. These are live font characters, arranged with CSS beside the Curly name. Italic emphasis and inspectable marks carry that identity into real text. Generous spacing surrounds a denser working area.

**Key Characteristics:**

- Expressive serif identity, readable specimen text, and sober controls.
- A monochromatic family of warm paper, brown-black ink, and soft brown surfaces.
- Visible, labeled controls attached to the content they affect.

This document records the implemented values in the [stylesheet](apps/playground/src/styles.css#L38) and [playground](apps/playground/src/main.tsx#L34). The frontmatter is the token reference; component dimensions describe the desktop baseline and may be minimum sizes in CSS.

## Colors

### Primary

**Brown-black ink** (`ink`, also used by `accent`) carries text, marks, the face, caret, focus, and active controls. **Soft brown wash** (`accent-wash`) supports selected and hovered decisions.

**The Marks Rule.** Use weight, a tonal wash, or an underline to direct attention to punctuation and interaction states. Keep the palette monochromatic.

### Secondary

The local-processing status dot uses the same brown-black ink. Status does not introduce another hue.

### Neutral

**Warm paper** (`paper`) is the page surface; **reading sheet** (`sheet`) is the lighter output surface and selected comparison button. **Brown-black ink** (`ink`) also backs the integration panel. **Muted brown ink** (`muted`) carries annotations. **Soft brown** (`soft`) distinguishes the source pane and backs segmented controls, decision chips, and inline code. **Warm rule** (`rule`) remains for prose tables, blockquotes, and the replay speed selector. **Selection** supplies the text-selection wash.

## Typography

The production build uses Fraunces Variable for identity, headings, italics, and the reading specimen, with DM Sans Variable for controls and explanations. DM Mono (400) supplies editable source and integration code; code ligatures are disabled. These open fonts are [bundled through Fontsource](apps/playground/src/fonts.css#L1). The frontmatter records these fallback font values; the current local preview uses the supplied pairing below. The hosted release predates this design pass.

The requested pairing is implemented in the [local personal-font preview](apps/playground/src/personal-fonts.css#L1): PP Kyoto Medium (500) for reading, display, and real italics; Kyoto Extrabold (800) for the Curly name, specimen headings, and strong emphasis; PP Neue Montreal Regular (400) and Semibold (600) for the interface. Sizes, line heights, and inspection geometry follow the same layout. The [typography setup and license notes](docs/typography.md) explain why the supplied personal-use files remain local pending public-use clarification.

- **Display and headline:** balanced serif lines with tight tracking. Italic emphasis shares the ink color and uses the actual italic face (500 in the local Kyoto preview, 400 in the fallback).
- **Body:** the reading specimen uses the frontmatter `body` role. Its paragraphs have a one-em bottom margin; specimen headings use 1.35em, at weight 800 in Kyoto and 500 in the fallback.
- **Interface body and labels:** regular sans-serif annotations; stronger labels use weights 500–600. Most controls sit at 11–13px.
- **Source and code:** airy monospace line spacing separates literal text from the reading preview. Integration code uses 12px, becoming 11px on smaller layouts.
- **Wordmark:** the punctuation face at 36px next to the Curly name at 35px, with a 6px gap and a minimum 44px link height. On mobile the face is 30px and the name is 29px; the gap stays 6px. The name uses weight 800 in Kyoto and 650 in the fallback.

**The Fair Comparison Rule.** Original and With Curly share the same specimen typeface and container. Optional reading styles affect the same preview independently of punctuation conversion.

## Layout

The shared container is capped at 1408px with 64px horizontal gutters. At 1150px and below, gutters become 36px; at 620px and below, they become 20px. Spacing tokens capture recurring insets and gaps, rather than requiring every dimension to follow a single scale.

The playground uses equal source and output columns. Toolbars and footers remain attached to their panes; both content areas start at 396px high. Tonal surfaces separate the panes; their outer border, central rule, and toolbar/footer rules are removed. Section, footer, and disclosure rules are also removed. Text wraps within the preview, while code and tables scroll locally. Supporting editorial sections use open columns and approximately 86px vertical section spacing.

At 850px and below, the introduction stacks, masthead navigation hides, and supporting sections tighten. At 620px and below, the working panes and supporting sections stack. Source starts at 248px and remains vertically resizable down to 170px; the preview grows between 300px and 600px with local scrolling. Rules and replay controls wrap, and section spacing becomes 49px. Above 1500px, the introduction gains top space.

The optional [reading stylesheet](packages/curly/prose.css#L1) inherits fonts and colors, limits prose to 70ch, and supplies paragraph rhythm and overflow behavior. Keep it scoped to prose containers.

## Elevation & Depth

**The Flat Sheet Rule.** Separate regions through paper tones and generous space. Reserve rules for content where they aid reading, and shadows for the selected comparison button and temporary feedback.

The selected comparison button uses a small shadow (`0 1px 3px #30292312`). The toast uses a soft floating shadow (`0 8px 22px #30292322`). There are no elevated card stacks or decorative surface effects.

## Shapes

Sheets, code panels, and fields are square. Small corners soften controls: 1px for annotated marks, 2px for comparison buttons and focus outlines, 3px for icon buttons and decision chips, and 4px for the comparison group and toast. The status dot alone is circular. Icons are restrained line drawings with a 1.6 stroke width.

## Components

- **Actions:** text and icon buttons inherit their context. Icon actions gain a soft background on hover. Replay uses ink and underlines on hover. Icon targets are at least 32px by 36px; text actions are at least 36px high and replay is at least 40px high. Disabled buttons use 0.45 opacity and a disabled cursor.
- **Focus and state:** interactive elements use a brown-black two-pixel outline with a four-pixel offset. Source editing moves the outline inside the field. Keep native labels, checked/pressed states, and explicit names when visible labels disappear.
- **Source field and selectors:** the source is a borderless, resizable monospace textarea with a brown-black caret and an attached helper/count footer. Native selects use an understated label and chevron. Native checkboxes use brown-black ink.
- **Comparison and inspection:** the soft comparison group contains Original and With Curly; the selected button is a lighter sheet. See changes is a nearby pressed-state action. At intermediate widths it becomes an icon while retaining its accessible name.
- **Annotated marks and decision chips:** annotation spans remain in the text in both reading and inspection states. Highlighting changes paint only, with no padding, margin, or border to alter line boxes or wrapping. Inspection adds keyboard button semantics; selection preserves focus. Decision chips pair the glyph change with a plain-language label. Selecting either reveals the explanation below.
- **Navigation:** small sans-serif anchor links sit in a quiet masthead alongside the serif wordmark and Cowboy attribution. The mobile masthead retains the face, name, and Cowboy attribution.
- **Integration panel:** a square ink block contains a native integration selector, copy action, locally scrolling monospace code, and a muted note. The selected punctuation options also determine the shown snippet.
- **Field notes:** native disclosure rows use space and weight to separate questions, and a plus that turns to a cross when open. The explanation stays under its question with a maximum line length of 66ch.
- **Feedback and motion:** clipboard/download feedback appears in a bottom-centered status toast. General color/background transitions last 150ms; punctuation highlights fade over 180ms. The inspection panel opens below the stable preview over 240ms, using a grid-row transition and a 180ms fade. Its collapsed content is inert and hidden from assistive technology. The toast uses 180ms opacity and a 12px rise. Only an active replay blinks its brown-black caret (1s, step-end). Reduced-motion preferences disable transitions, animation, and smooth scrolling.

### Punctuation face

The [logo component](apps/playground/src/CurlyLogo.tsx) uses ordinary text spans: `‘` (U+2018) for the eyes, `˜` (U+02DC, small tilde) for the wink, and `˘` (U+02D8, breve) for the mouth. It inherits the serif family at weight 800. The face is 36px square on desktop and 30px on mobile, with a 6px gap before the name. Its proportions are defined in em units, so the characters scale together.

One 720ms CSS sequence runs after the logo first becomes visible, or on mouse hover / primary pointer press. The right quote squashes and crossfades into the small tilde, preserving the real font shapes. The mouth lifts by 0.03em, shifts by 0.02em, and rotates −18° toward the winking eye, then settles through a small 2° return. The easing is `cubic-bezier(0.77, 0, 0.175, 1)`. Only transform and opacity animate; there is no SVG, animation library, per-frame JavaScript, or perpetual loop. The animation-end event resets the expression, and repeated triggers let the current gesture finish. Offscreen and hidden-document states stop it. Reduced motion keeps the face still. The face is decorative to assistive technology; the enclosing home link retains its accessible name and focus treatment.

A [static PNG mark](apps/playground/public/curly-mark.png) and two theme-specific PNG favicons are rendered directly from the same Kyoto text. Their source is PP Kyoto Extrabold supplied by Caleb; Pillow draws the characters without tracing or an intermediate SVG. The reproducible render script and font binary stay in the ignored `apps/playground/.local` directory. The interface itself renders live text, independent of these raster exports.

## Do's and Don'ts

### Do

- Do make punctuation, real text, and its explanations the expressive content.
- Do keep related controls attached to their source, preview, or code region.
- Do preserve native control semantics, visible focus, and accessible names at every breakpoint.
- Do use sentence case for labels and brand attribution. Credit Caleb Durenberger and link his name to calebduren.com.
- Do keep long code and tables scrolling inside their own region.

### Don't

- Don't change the specimen typeface between Original and With Curly.
- Don't turn the flat sheet into a stack of rounded, elevated cards.
- Don't add continuous idle motion or simulated paper texture. The face gives a brief greeting and responds to pointer interaction.
- Don't use formatting counts or samples as invented performance or adoption claims.
- Don't use all-uppercase styling. The logo is the supplied Kyoto punctuation face alongside the Curly name.
