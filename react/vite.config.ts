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
        // CSS 파일을 별도로 추출
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // CSS를 별도 파일로 추출
    cssCodeSplit: false,
    // 상위 디렉토리의 CSS 파일을 복사
    copyPublicDir: false,
  },
  resolve: {
    alias: {
      '@parent': resolve(__dirname, '..'),
    },
  },
});