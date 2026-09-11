import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const brandFontFiles = ['SaansCollectionVF-TRIAL.woff2', 'SerrifCollectionVF-TRIAL.woff2'];
const hasBrandFonts = brandFontFiles.every((filename) =>
  existsSync(new URL(`./.local/fonts/${filename}`, import.meta.url)),
);
const fontEntry = fileURLToPath(
  new URL(hasBrandFonts ? './src/personal-fonts.css' : './src/font-fallback.css', import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: { dedupe: ['react', 'react-dom'], alias: { '@typograph/brand-fonts': fontEntry } },
  define: { 'import.meta.env.VITE_TYPOGRAPH_BRAND_FONTS': JSON.stringify(String(hasBrandFonts)) },
  optimizeDeps: { include: ['streamdown', 'react-markdown'] },
  build: { sourcemap: true },
  server: { port: 4173 },
});
