// react/vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['wrapper/**/*'],
      exclude: ['node_modules/**', '../**'],
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'wrapper/index.ts'),
        SeoSelect: resolve(__dirname, 'wrapper/SeoSelect.tsx'),
        SeoSelectSearch: resolve(__dirname, 'wrapper/SeoSelectSearch.tsx'),
      },
      name: 'SeoSelectReact',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@parent': resolve(__dirname, '..'),
    },
  },
});