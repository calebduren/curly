import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const publicFonts = fileURLToPath(new URL('./src/fonts.css', import.meta.url));
const localFonts = fileURLToPath(new URL('./.local/fonts.css', import.meta.url));

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: '/curly/',
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      // Personal font trials stay in local development; public builds use open fonts.
      '@curly/fonts.css':
        command === 'serve' && !isPreview && existsSync(localFonts) ? localFonts : publicFonts,
    },
  },
  optimizeDeps: { include: ['streamdown', 'react-markdown'] },
  build: { sourcemap: true },
  server: { port: 4173 },
}));
