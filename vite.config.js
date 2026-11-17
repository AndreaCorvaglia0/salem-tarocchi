import { defineConfig } from 'vite';
import { buildSite, siteFiles } from './scripts/lore/site.mjs';
// Multi-file build with relative paths (index.html + assets + cards/ + music/), served by GitHub Pages.
// Every build has a stamp: the page compares it with version.json and reloads itself when a newer one is out
// (src/main.js), so the icon on the Home screen never stays on an old copy.
const BUILD = String(Date.now());

// The lore viewer (lore-site/, docs/TOOLS.md): built from the vault at every build and served at /lore/.
// In dev the data is rebuilt on each request, so an edited note shows on reload.
const TYPES = { html: 'text/html', js: 'text/javascript', css: 'text/css', json: 'application/json', woff2: 'font/woff2' };
function loreServe() {
  return (req, res, next) => {
    const url = (req.url || '').split('?')[0];
    if (url === '/lore') { res.statusCode = 302; res.setHeader('Location', '/lore/'); return res.end(); }
    if (!url.startsWith('/lore/')) return next();
    const name = url.slice(6) || 'index.html';
    const file = siteFiles(buildSite(), BUILD).find((f) => f.fileName === `lore/${name}`);
    if (!file) return next();
    res.setHeader('Content-Type', TYPES[name.split('.').pop()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(file.source);
  };
}
export const lorePlugin = () => ({
  name: 'lore-site',
  configureServer(server) { server.middlewares.use(loreServe()); },
  configurePreviewServer(server) { server.middlewares.use((req, res, next) => { if ((req.url || '').split('?')[0] === '/lore') { res.statusCode = 302; res.setHeader('Location', '/lore/'); return res.end(); } next(); }); },
  generateBundle() { for (const f of siteFiles(buildSite(), BUILD)) this.emitFile({ type: 'asset', ...f }); },
});

export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [{ name: 'version-file', generateBundle() { this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ v: BUILD }) }); } }, lorePlugin()],
  build: { outDir: process.env.OUT || 'dist', chunkSizeWarningLimit: 4000, target: 'es2020' },
  server: { host: '127.0.0.1' },
});
