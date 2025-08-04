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
      entry: resolve(__dirname, 'src/main.ts'), // CDN용은 main.ts 사용
      formats: ['es'], // ES Module만 사용
      fileName: () => 'index.js',
      name: 'SeoSelect' // UMD 글로벌 변수명
    },
    rollupOptions: {
      external: [], // CDN용이므로 모든 의존성 번들링
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        entryFileNames: (chunkInfo) => {
          const format = chunkInfo.facadeModuleId?.includes('umd') ? 'umd' : 'es';
          return format === 'umd' ? 'seo-select.umd.js' : 'index.js';
        },
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css'; // 단일 CSS 파일명으로 단순화
          }
          return 'assets/[name][extname]';
        },
        // UMD용 글로벌 설정
        globals: {
          // 외부 라이브러리가 있다면 여기에 추가
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: true,
    chunkSizeWarningLimit: 2000,
    // 더 나은 트리쉐이킹을 위한 설정
    target: 'es2020'
  },
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS 옵션이 필요하다면 여기에 추가
      }
    }
  },
  // 개발 서버 설정 (개발 시 유용)
  server: {
    port: 3000,
    open: true
  }
});