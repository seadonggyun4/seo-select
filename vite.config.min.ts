import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: false, // public 폴더 제외
  build: {
    outDir: 'min',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SeoSelect',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      // 외부 의존성을 번들에 포함시키지 않고 모두 내장
      external: [],
      output: {
        // CSS를 별도 파일로 추출
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'seo-select.css';
          }
          return assetInfo.name as string;
        }
      }
    },
    minify: 'terser',
    sourcemap: false,
    target: 'es2020'
  }
});