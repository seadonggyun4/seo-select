/**
 * SEO Select Demo 애플리케이션 진입점
 *
 * 모든 기능은 demo/modules/ 디렉토리에 기능별로 분리되어 있습니다.
 */

import {
  // 클래스들
  DemoManager,
  SimpleTextAnimator,

  // 함수들
  initializeLoaderSafety,
  createGlobalAnimator,
  getGlobalAnimator,
  initializeTextAnimator,
  copyToClipboard,
  copyCodeBlock,

  // 액션들
  DemoActions,
  DynamicDemoActions,
} from './modules';

// 전역 애니메이터 참조
let globalAnimator: SimpleTextAnimator | null = null;

/**
 * 전체 애플리케이션 초기화 함수
 */
function initializeApp(): void {
  console.log('🚀 Initializing SEO Select Demo App...');

  // Text Animator 초기화
  if (document.querySelector('.text-item')) {
    globalAnimator = createGlobalAnimator();
    console.log('✅ Text Animator initialized');
  }

  // Demo Manager 초기화 (Page Loader 포함)
  new DemoManager();
  console.log('✅ Demo Manager initialized');
}

// Window 객체에 전역 등록
declare global {
  interface Window {
    SimpleTextAnimator: typeof SimpleTextAnimator;
    initializeTextAnimator: typeof initializeTextAnimator;
    createGlobalAnimator: typeof createGlobalAnimator;
    getGlobalAnimator: typeof getGlobalAnimator;
    DemoActions: typeof DemoActions;
    DynamicDemoActions: typeof DynamicDemoActions;
    initializeApp: typeof initializeApp;
    copyToClipboard: typeof copyToClipboard;
    copyCodeBlock: typeof copyCodeBlock;
  }
}

// 브라우저 환경에서 전역 등록
if (typeof window !== 'undefined') {
  window.SimpleTextAnimator = SimpleTextAnimator;
  window.initializeTextAnimator = initializeTextAnimator;
  window.createGlobalAnimator = createGlobalAnimator;
  window.getGlobalAnimator = getGlobalAnimator;
  window.DemoActions = DemoActions;
  window.DynamicDemoActions = DynamicDemoActions;
  window.initializeApp = initializeApp;
  window.copyToClipboard = copyToClipboard;
  window.copyCodeBlock = copyCodeBlock;
}

// 페이지 로더 안전 장치 초기화 (즉시 실행)
initializeLoaderSafety();

// DOM 준비 상태에 따른 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    setTimeout(() => {
      try {
        initializeApp();
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        const loader = document.querySelector('.page-loder') as HTMLElement | null;
        if (loader) {
          loader.style.display = 'none';
        }
      }
    }, 100);
  });
} else {
  console.log('📄 DOM already loaded');
  setTimeout(() => {
    try {
      initializeApp();
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      const loader = document.querySelector('.page-loder') as HTMLElement | null;
      if (loader) {
        loader.style.display = 'none';
      }
    }
  }, 50);
}
