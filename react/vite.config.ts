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
      // React와 React-DOM을 외부 의존성으로 처리 (중요!)
      external: [
        'react', 
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
      ],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          exports: 'named',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime'
          }
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          exports: 'named',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime'
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
      // React 타입도 외부화
      compilerOptions: {
        baseUrl: '.',
        paths: {
          'react': ['node_modules/@types/react'],
          'react-dom': ['node_modules/@types/react-dom']
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
  // 개발 서버에서도 React 외부화 적용
  optimizeDeps: {
    exclude: ['react', 'react-dom']
  }
});