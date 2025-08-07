// react/vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.ts'),
        SeoSelect: resolve(__dirname, 'wrapper/SeoSelect.tsx'),
        SeoSelectSearch: resolve(__dirname, 'wrapper/SeoSelectSearch.tsx')
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // React와 seo-select를 외부 의존성으로 처리 (중요!)
      external: [
        'react', 
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'seo-select',
        'seo-select/components/seo-select-search',
        'seo-select/types'
      ],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          exports: 'named',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
            'seo-select': 'SeoSelect',
            'seo-select/components/seo-select-search': 'SeoSelectSearch',
            'seo-select/types': 'SeoSelectTypes'
          }
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          exports: 'named',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
            'seo-select': 'SeoSelect',
            'seo-select/components/seo-select-search': 'SeoSelectSearch',
            'seo-select/types': 'SeoSelectTypes'
          }
        }
      ]
    },
    outDir: 'dist',
    emptyOutDir: true,
    // 소스맵 비활성화로 번들 크기 줄이기
    sourcemap: false
  },
  plugins: [
    dts({
      include: ['wrapper/**/*.tsx', 'index.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
      // React와 seo-select 타입도 외부화
      compilerOptions: {
        baseUrl: '.',
        paths: {
          'react': ['node_modules/@types/react'],
          'react-dom': ['node_modules/@types/react-dom'],
          'seo-select': ['../dist/types'],
          'seo-select/*': ['../dist/*']
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@parent': resolve(__dirname, '..'),
      '@parent-dist': resolve(__dirname, '../dist'),
      '@parent-types': resolve(__dirname, '../dist/types')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  // 개발 서버에서도 React와 seo-select 외부화 적용
  optimizeDeps: {
    exclude: ['react', 'react-dom', 'seo-select']
  }
});