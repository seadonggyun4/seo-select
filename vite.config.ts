import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [
    libInjectCss(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ],
  publicDir: false,
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/seo-select/index': resolve(__dirname, 'src/components/seo-select/index.ts'),
        'components/seo-select-search/index': resolve(__dirname, 'src/components/seo-select-search/index.ts')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'esbuild'
  },
  css: {
    preprocessorOptions: {
      scss: {
      }
    }
  }
});