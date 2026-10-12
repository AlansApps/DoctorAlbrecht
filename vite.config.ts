import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

/**
 * Generates `sw.js` from scripts/sw-template.js with the list of hashed build
 * assets (the app shell). Content packs are NOT precached here: they live in
 * IndexedDB (see src/domain/content/store.ts) to avoid duplicating storage.
 */
function serviceWorker(): Plugin {
  return {
    name: 'tarjetalan-sw',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const shell = Object.keys(bundle)
        .filter((f) => !f.endsWith('.map') && !f.startsWith('content/'))
        .concat(['./', 'index.html', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png']);
      const unique = [...new Set(shell)].sort();
      const version = createHash('sha256').update(unique.join('|')).digest('hex').slice(0, 12);
      const source = readFileSync('scripts/sw-template.js', 'utf8')
        .replace('__SHELL_VERSION__', version)
        .replace('__PRECACHE__', JSON.stringify(unique));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  // Relative base: works on GitHub Pages subpath (/TarjetAlan/) and any host.
  base: './',
  plugins: [react(), serviceWorker()],
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.ts'],
  },
});
