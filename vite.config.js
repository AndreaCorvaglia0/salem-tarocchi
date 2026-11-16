import { defineConfig } from 'vite';
// Multi-file build with relative paths (index.html + assets + cards/ + music/), served by GitHub Pages.
// Every build has a stamp: the page compares it with version.json and reloads itself when a newer one is out
// (src/main.js), so the icon on the Home screen never stays on an old copy.
const BUILD = String(Date.now());
export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [{ name: 'version-file', generateBundle() { this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ v: BUILD }) }); } }],
  build: { outDir: process.env.OUT || 'dist', chunkSizeWarningLimit: 4000, target: 'es2020' },
  server: { host: '127.0.0.1' },
});
