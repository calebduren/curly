---
name: typograph
description: Compose, improve, or review web typography using context, reading rhythm, hierarchy, font capabilities, and inspectable punctuation. Use for typography work in existing interfaces, reading surfaces, or agent-built websites.
---

# Typograph

Make the relationships between type, content, and space deliberate. Preserve the product’s identity and the user’s choices. Typograph’s own minimalist identity is not a template to impose on other products.

## Start with the reading situation

Inspect the existing font files or font setup, role tokens, styles, renderer, and representative content. Identify whether people are reading sustained prose, scanning an interface, comparing data, or watching text arrive. Establish the language and relevant browser targets. State only consequential assumptions; keep ordinary decisions within the authorized task.

Choose the fewest text roles needed to make the structure clear. Coordinate face, size, measure, leading, weight, and space. A scale ratio or spacing grid is a starting tool; examine the rendered result before treating it as successful.

## House defaults and firm constraints

- Prefer sentence-case headings and labels. Preserve actual acronyms, proper names, and identifiers. Omit decorative eyebrows that add no information. Avoid automatic tracked-uppercase styling.
- Assume the delivered font does **not** support true small caps. Do not add `small-caps`, `all-small-caps`, `smcp`, or `c2sc` as a default, enhancement, or substitute for an eyebrow. Do not recommend changing fonts merely to obtain small caps.
- Never permit synthesized small caps. Use `font-synthesis: none` on the relevant typography scope, including the page root when establishing a new design system. If preserving unrelated bold/italic synthesis is essential in an existing product, use `font-synthesis-small-caps: none`. Check computed styles and inherited behavior. A CSS `@supports` result only establishes syntax support, not glyph support. Only revisit true small caps after an explicit request and verification of the actual delivered font; synthesis stays disabled.
- Use the real weights and italics the project loads. Keep fallbacks readable and preserve browser zoom and text scaling.
- Keep semantic heading levels independent of visual size. Keep prose punctuation transforms away from code, attributes, identifiers, editor input, and structured transport data.

## Apply the relevant principles

Read [principles.md](references/principles.md) for the concern you are addressing. Each entry gives intent, conditions, evidence, action, verification, exceptions, and primary sources. It distinguishes general principles, house preferences, and technical constraints.

- **Composition:** relationships, rhythm, hierarchy.
- **Details:** case, numbers, edges, wrapping.
- **Integration:** integrity, plus [integration.md](references/integration.md) when installing or configuring Typograph.

Use existing project CSS and tokens when they can express the decision. Typograph’s optional CSS supports familiar Typeset variables and does not require React, Tailwind, or a runtime dependency. Do not install a second prose stylesheet over an existing system without resolving overlapping rules. Prefer a preset or a small local override.

Keep findings concrete: identify the element or selector, the observed issue, the reason it matters, and the proposed change. Separate deterministic corrections from editorial suggestions and browser enhancements. Do not invent a numerical “taste score.”

## Verify the result

Inspect real text at the relevant narrow and wide widths. Check wrapped headings, paragraphs, lists, tables, long values, font fallback, larger text, and user-adjusted spacing when affected. Confirm structure, legibility, and the visible relationship between gaps. A rhythm guide does not prove baseline alignment.

For streaming, verify the active paragraph and appended blocks independently: balanced or pretty wrapping can change earlier lines within a growing block. Use ordinary wrapping while streaming when stability matters. Hanging punctuation and text trimming must have a readable fallback.

Run checks proportional to the change. Report observable improvements and any relevant browser or language limits. Preserve the scope of the request; reviews do not imply permission to rewrite a whole interface.
