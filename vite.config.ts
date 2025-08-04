import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [
    libInjectCss(),
  ],
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
        chunkFileNames: 'index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: false, 
    minify: true, 
    chunkSizeWarningLimit: 2000
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  }
});