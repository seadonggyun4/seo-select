import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      name: 'SeoSelect'
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        entryFileNames: 'index.js',
        chunkFileNames: '[name].js',
        assetFileNames: 'styles.css'
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: true,
    chunkSizeWarningLimit: 2000,
    target: 'es2020'
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  server: {
    port: 3000,
    open: true
  }
});