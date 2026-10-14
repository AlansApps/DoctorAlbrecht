import { defineConfig } from 'vitest/config';
import type { Plugin, ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

/**
 * Writes `sw.js` after the build from scripts/sw-template.js. The precache list is
 * every emitted shell file (JS, CSS, HTML, manifest, icons, fonts) and the version
 * is a hash of their CONTENTS, so any change (even only in index.html or public/)
 * yields a new service worker. `content/` is excluded: packs live in IndexedDB.
 */
function serviceWorker(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'tarjetalan-sw',
    apply: 'build',
    configResolved(c) {
      config = c;
    },
    closeBundle() {
      const outDir = config.build.outDir;
      const files = listFiles(outDir)
        .map((f) => relative(outDir, f).split(sep).join('/'))
        .filter((f) => !f.startsWith('content/') && f !== 'sw.js' && !f.endsWith('.map'))
        .sort();
      const hash = createHash('sha256');
      for (const f of files) hash.update(f).update(readFileSync(join(outDir, f)));
      const version = hash.digest('hex').slice(0, 12);
      const source = readFileSync('scripts/sw-template.js', 'utf8')
        .replace('__SHELL_VERSION__', () => version)
        .replace('__PRECACHE__', () => JSON.stringify(['./', ...files]));
      writeFileSync(join(outDir, 'sw.js'), source);
      // Expose the version to the app for "update available" messages.
      writeFileSync(join(outDir, 'version.json'), JSON.stringify({ shell: version }));
    },
  };
}

export default defineConfig({
  // Relative base: works on the GitHub Pages subpath (/DoctorAlbrecht/) and any host.
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
