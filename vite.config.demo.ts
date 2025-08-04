import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'demo', // demo 폴더를 루트로 설정
  publicDir: '../public', // public 폴더 경로 조정
  build: {
    outDir: '../output', // 빌드 결과를 output 폴더에
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '/src': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3500,
    open: true,
    host: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
});