import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [],
  publicDir: false,
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        // Core entries
        index: resolve(__dirname, 'src/index.ts'),
        'components/seo-select/index': resolve(__dirname, 'src/components/seo-select/index.ts'),
        'components/seo-select-search/index': resolve(__dirname, 'src/components/seo-select-search/index.ts'),
        'event/index': resolve(__dirname, 'src/event/index.ts'),
        'types/index': resolve(__dirname, 'src/types/index.ts'),
        // Framework wrappers
        'wrappers/react/index': resolve(__dirname, 'src/wrappers/react/index.tsx'),
        'wrappers/vue/index': resolve(__dirname, 'src/wrappers/vue/index.ts'),
        'wrappers/angular/index': resolve(__dirname, 'src/wrappers/angular/index.ts'),
        'wrappers/solid/index': resolve(__dirname, 'src/wrappers/solid/index.tsx'),
        'wrappers/qwik/index': resolve(__dirname, 'src/wrappers/qwik/index.tsx'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
      name: 'SeoSelect'
    },
    rollupOptions: {
      external: [
        'lit',
        // React
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Vue
        'vue',
        // Angular
        '@angular/core',
        '@angular/common',
        // Solid
        'solid-js',
        'solid-js/web',
        // Qwik
        '@builder.io/qwik',
      ],
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
        moduleSideEffects: (id) => {
          // Keep side effects for component imports in wrappers
          if (id.includes('components/seo-select')) return true;
          return false;
        },
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