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
      // CDN용이므로 모든 의존성을 번들에 포함
      external: [], 
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        entryFileNames: 'index.js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css';
          }
          return 'assets/[name][extname]';
        },
        // 모든 의존성을 단일 파일로 번들링 강제
        format: 'es'
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