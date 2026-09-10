---
name: Curly
description: A contemporary type specimen with care for the written word.
colors:
  paper: '#f5f4f1'
  sheet: '#fdfcfb'
  ink: '#302d29'
  muted: '#68645e'
  rule: '#d8d5ce'
  soft: '#eae8e3'
  accent: '#302d29'
  accent-wash: '#e1dcd3'
  selection: '#d4cfc5'
  source-ink: '#57534d'
  scrollbar: '#96918a'
  code-ink: '#fdfcfb'
  code-muted: '#c5c0b8'
typography:
  display:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: 'clamp(38px, 4.2vw, 54px)'
    fontWeight: 450
    lineHeight: 1.15
    letterSpacing: '0'
  headline:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: 'clamp(30px, 3vw, 38px)'
    fontWeight: 450
    lineHeight: 1.2
    letterSpacing: '0'
  body:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: '17px'
    fontWeight: 450
    lineHeight: 1.65
    letterSpacing: '0'
  body-ui:
    fontFamily: "'DM Sans Variable', sans-serif"
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "'DM Sans Variable', sans-serif"
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'DM Sans Variable', sans-serif"
    fontSize: '13px'
    fontWeight: 400
  source:
    fontFamily: "'DM Mono', monospace"
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.85
  face:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: '36px'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '0'
rounded:
  mark: '1px'
  small: '2px'
  control: '3px'
  group: '4px'
  switch: '12px'
spacing:
  mobile-gutter: '20px'
  pane-inset: '24px'
  tablet-gutter: '36px'
  desktop-gutter: '64px'
  editorial-section: '64px'
components:
  reading-column:
    maxWidth: '65ch'
    typography: '{typography.lead}'
  button-text:
    typography: '{typography.label}'
    height: '36px'
  button-icon:
    width: '36px'
    height: '36px'
  switch-track:
    width: '30px'
    height: '18px'
  switch-thumb:
    width: '12px'
    height: '12px'
  input-source:
    typography: '{typography.source}'
    height: '356px'
  preview:
    typography: '{typography.body}'
    height: '356px'
  install-command:
    backgroundColor: '{colors.soft}'
    padding: '16px 20px 20px'
  code-panel:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.sheet}'
---

# Design System: Curly

Curly pairs expressive serif letters with quiet controls. The signature is a face made from punctuation; a restrained ASCII desert in the footer connects the product to Cowboy. Flat tonal surfaces, space, and typography define the page. No uppercase styling, added letter spacing, checkmark icons, or italic display headings.

## Color and type

The palette is desaturated warm gray with brown-black ink. The output sheet is lighter than the page; the source pane, options, and install command use soft gray. Borders remain only where they help read formatted tables or blockquotes. Focus uses a two-pixel ink outline.

Body and interface sizes are 13, 15, and 17px. No readable interface text drops below 13px, including source, code, annotations, footer, and responsive controls. Headings use their separate display scale. Introductory promise and supporting text share 17px and weight 400; color supplies hierarchy. Letter spacing is zero throughout.

The public build uses Fraunces Variable, DM Sans Variable, and DM Mono. The local preview uses supplied PP Kyoto Medium (500) and Extrabold (800), plus PP Neue Montreal Regular (400) and Semibold (600), including their real italics. Font binaries remain local; [typography notes](docs/typography.md) describe the setup. The reading preview’s Serif / Sans serif choice also applies to emphasis, headings, and replay. Source and code retain monospace.

## Page structure

The page container is capped at 1408px with 64px gutters, becoming 36px at 1250px and 20px at 620px. The masthead contains the face and three links: Playground, How it works, and Install. Attribution appears in the footer.

Introductory and supporting sections form centered single columns capped at 65ch. The introduction is centered; explanatory prose aligns left. The editorial point of view has no decorative apostrophe. Installation and field notes follow the same reading column instead of repeating the playground’s split layout.

“How it works” explains the actual transform boundary, context rules, inspectable decisions, protected content, each integration, streaming tradeoffs, size measurements, and limitations. Authored before/after examples are checked against the package. Measured bundle sizes link to the reproducible report and exclude the host renderer. No probabilistic accuracy or adoption claim is made.

## Playground

The desktop workspace has source and reading panes with attached toolbars and footers. Their content areas are 356px high. At 980px and below, the panes stack and source starts at 236px, resizable down to 180px. The preview retains its height and scrolls locally. Code and tables scroll within their containers.

Original / With Curly and Serif / Sans serif form a left-aligned cluster in the output toolbar. The right-aligned Highlight changes switch controls inspection. At intermediate desktop widths, both pane headers reserve a second control row. Small screens wrap the controls without hiding their labels or reducing type size.

The native sample selector is 32px high with a compact focus outline. The input footer explicitly says that its text is processed in the browser and isn’t uploaded. The reading preview has one “Copy text” action; copy success says “Copied.” There is no source copy or download action.

Primes, ellipses, and reading styles use button switches with checked-state semantics. Quotes and apostrophes remain defaults, without a redundant fixed control. Optional formatting and replay sit in a continuous surface attached to the workspace. Natural replay advances small chunks every 90ms; one-character replay advances every 110ms. Pause, step, speed, and end controls remain available. No blinking caret is added.

### Highlights and inspection

Annotation spans remain in the formatted text in both modes, with unchanged font metrics, padding, and margins. Each highlight is an absolutely positioned pseudo-element at z-index −1. The preview supplies an isolated stacking context, so highlights paint behind all glyphs, including neighboring overhanging commas. Selected marks retain dark text over a slightly stronger wash.

Inspecting a mark adds keyboard button semantics and a reason. The explanation panel opens below the fixed preview; collapsed content is inert and hidden from assistive technology. Markdown task states use empty or filled circles rather than checkmark icons.

## Installation and field notes

The install command has a soft background with a visible “Copy install command” action inside it. It uses the actual published GitHub release archive. The integration panel offers React Markdown, Streamdown, plain text, and HTML examples using the selected punctuation options, with its own “Copy code” action.

Field notes use accessible disclosure buttons, unique control IDs, and expanded states. Content remains mounted for reversible grid-row transitions; closed content is inert and hidden. The plus rotates into a cross. Pointer interaction animates over 240ms with `cubic-bezier(0.23, 1, 0.32, 1)` and a coordinated 180ms fade. Keyboard activation switches immediately.

Internal links use down arrows where an icon is useful. External footer links to GitHub, releases, Cowboy, and Caleb Durenberger use up-right arrows. Caleb’s name links to calebduren.com.

## Motion and identity

The face is live font text: `‘` (U+2018) for eyes, `˜` (U+02DC) for the wink, and `˘` (U+02D8) for the smile. No SVG is used. It is 36px on desktop and 30px on mobile, inside a 44px home link. The visible Curly name is omitted.

A brief greeting runs on first visibility or pointer interaction. The right quote squashes and crossfades into the small tilde while the mouth lifts and rotates −18°. Retargetable CSS transitions close the eye over 180ms and tilt the mouth over 280ms. After 320ms, the face returns to rest, with a 240ms eye release and a 440ms mouth settle. Offscreen, hidden-document, and reduced-motion states stop the gesture. Keyboard activation doesn’t trigger it.

The footer’s decorative ASCII cactus landscape sits behind the attribution with no pointer or accessibility target. A punctuation tumbleweed passes through once when the footer comes into view and can repeat on fine-pointer entry. Its 3.8-second animation uses only transform and opacity; it is not an endless loop. It adds no per-frame React work or animation dependency.

Switch thumbs use a 220ms ease-out transition for pointer interaction and switch immediately from the keyboard. Highlights fade over 180ms. General color changes use 150ms. Reduced-motion preferences disable transitions, animations, and smooth scrolling. Existing static PNG marks and favicon assets retain their recorded provenance; this revision adds no raster assets.
