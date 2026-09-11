# Playground typography

The local design preview pairs PP Kyoto Medium (500) and Extrabold (800), with their real italics, with PP Neue Montreal Regular (400) and Semibold (600), also with real italics. DM Mono remains the source/code face. The supplied OTF files are used unchanged, with `font-display: swap` and no synthetic weights or italics.

The reading preview defaults to Serif and can switch to Sans serif. This applies to original and formatted prose, headings, emphasis, and replay. Source/code and page branding keep their own fonts. The public build offers the same choice using Fraunces and DM Sans.

## Interface scale

The page uses 13, 15, and 17px for body and interface roles, with 13px as the minimum at every breakpoint. Display headings have a separate, smaller scale than the original design. Letter spacing is zero throughout; headings use upright type. Introductory promise and supporting copy share a size and weight, with color providing hierarchy. Editorial sections form centered reading columns capped at 65ch.

The masthead uses Caleb’s supplied SVG mark, independent of the fonts. The footer retains the punctuation face as a character: live Kyoto glyphs, with the small tilde `˜` and breve `˘`. Neither includes visible wordmark text. Both inherit the page’s automatic light or dark theme.

## Local preview

Obtain the fonts directly from [Pangram Pangram](https://pangrampangram.com/), then put these files in `apps/playground/.local/fonts/`:

- `PPKyoto-Extrabold.otf`
- `PPKyoto-ExtraboldItalic.otf`
- `PPKyoto-Medium.otf`
- `PPKyoto-MediumItalic.otf`
- `PPNeueMontreal-Regular.otf`
- `PPNeueMontreal-Italic.otf`
- `PPNeueMontreal-Semibold.otf`
- `PPNeueMontreal-SemiboldItalic.otf`

Create `apps/playground/.local/fonts.css` containing:

```css
@import '../src/personal-fonts.css';
```

Run `npm run dev`. The Vite configuration uses this optional stylesheet only in the development server. Without it, development uses Fraunces, DM Sans, and DM Mono from Fontsource. Production builds and `vite preview` always use those open fonts. No proprietary assets are needed to clone, build, or test the project.

The `.local` directory is ignored by Git. Font files must not be added to this repository or to the MIT-licensed `cowboy-curly` package. The package’s reading CSS inherits the application’s own typefaces.

## Publication status

Checked September 10, 2026. Both supplied personal-use downloads include `EULA-PangramPangram-FreeForPersonalUse-MAY2021.pdf`. Its Free License clause excludes publicly available websites and applications, and its conditions prohibit public redistribution of font files.

The foundry’s [current FAQ](https://pangrampangram.com/pages/faq) expressly permits personal web portfolios and personal projects. Its [current EULA](https://pangrampangram.com/pages/eula) separately describes paid Web and App licenses. These sources leave an unresolved conflict for a public interactive playground. The personal-use files are therefore enabled for local evaluation only; public embedding awaits clarification from the foundry or the appropriate license and font delivery. The FAQ alone is not recorded here as clearance for Curly’s public app.

When public use is confirmed, prefer the foundry’s supplied WOFF2 files for the selected styles, update the build’s font entry, and verify the resulting downloads and fallback behavior. Keep the binaries separate from the open-source package and repository.
