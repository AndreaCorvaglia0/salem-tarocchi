import { defineConfig } from 'vite';
// Multi-file build with relative paths: it is published as a private artifact (index.html + assets + cards/).
export default defineConfig({
  base: './',
  build: { outDir: process.env.OUT || 'dist', chunkSizeWarningLimit: 4000, target: 'es2020' },
  server: { host: '127.0.0.1' },
});
