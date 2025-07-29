import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// 웹 문서 빌드용 설정 (패키지 빌드와 별도)
export default defineConfig({
  build: {
    outDir: 'output',
    emptyOutDir: false, // build-docs.js에서 이미 정리함
    lib: false, // 앱으로 빌드 (라이브러리 아님)
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'src/main.ts')
      },
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          // CSS 파일을 components.css로 통일
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'components.css';
          }
          return '[name].[ext]';
        }
      }
    },
    minify: false, // 개발자가 읽기 쉽게
    sourcemap: false,
    target: 'es2020'
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  esbuild: {
    target: 'es2020'
  }
});