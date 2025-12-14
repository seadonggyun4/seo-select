/**
 * Demo 모듈 통합 진입점
 */

// 타입 내보내기
export type {
  LanguageNames,
  SampleLanguage,
  OptionItem,
  SeoSelectElement,
  SeoSelectEvent,
  EventHandlers
} from './types';

// 상수 내보내기
export {
  CONFIG,
  ORIGINAL_WIDTH_KEY,
  LANGUAGE_NAMES,
  SAMPLE_LANGUAGES,
  DEMO_DATA,
  TECH_STACK_OPTIONS,
  LANGUAGE_OPTIONS,
  FRAMEWORK_OPTIONS,
  USER_DATA,
  COUNTRY_DATA
} from './constants';

// 유틸리티 내보내기
export {
  isSeoSelectElement,
  isHTMLButtonElement,
  debounce,
  simulateDelay,
  getSeoSelectElement
} from './utils';

// 알림 시스템 내보내기
export { showNotification } from './notification';

// 이벤트 헬퍼 내보내기
export {
  addSeoSelectListener,
  addMultipleEventListeners,
  logSeoSelectEvent
} from './event-helpers';

// 클래스들 내보내기
export { PageLoaderManager, initializeLoaderSafety } from './page-loader';
export { ResponsiveWidthManager } from './responsive-manager';
export { GlobalEventManager } from './global-events';
export { DemoManager } from './demo-manager';

// 텍스트 애니메이터 내보내기
export {
  SimpleTextAnimator,
  initializeTextAnimator,
  createGlobalAnimator,
  getGlobalAnimator,
  setGlobalAnimator
} from './text-animator';

// 클립보드 내보내기
export { copyToClipboard, copyCodeBlock } from './clipboard';

// 액션 내보내기
export { DemoActions } from './demo-actions';
export { DynamicDemoActions } from './dynamic-demo-actions';

// 환영 메시지 내보내기
export { printWelcomeMessage } from './welcome-message';
