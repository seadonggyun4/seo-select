import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [],
  publicDir: false,
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/seo-select/index': resolve(__dirname, 'src/components/seo-select/index.ts'),
        'components/seo-select-search/index': resolve(__dirname, 'src/components/seo-select-search/index.ts'),
        'event/index': resolve(__dirname, 'src/event/index.ts'),
        'types/index': resolve(__dirname, 'src/types/index.ts')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
      name: 'SeoSelect'
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        exports: 'named',
        interop: 'auto'
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    reportCompressedSize: true,
    assetsInlineLimit: 0
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  server: {
    port: 3000,
    open: true
  },
  esbuild: {
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    drop: ['console', 'debugger']
  }
});