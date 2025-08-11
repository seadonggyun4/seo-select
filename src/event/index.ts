// 이벤트 클래스들
export {
  SeoSelectEvent,
  SeoDeselectEvent,
  SeoResetEvent,
  SeoChangeEvent,
  SeoOpenEvent,
} from './SeoSelectEvent.js';

// 검색 이벤트 클래스들
export {
  SeoSearchChangeEvent,
  SeoSearchFilterEvent,
} from './SeoSearchEvent.js';

// 헬퍼 함수들
export {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
  triggerSearchChangeEvent,
  triggerSearchFilterEvent,
} from './eventHelpers.js';

// 타입 안전한 이벤트 리스너 타입 (선택적 사용)
export type SeoSelectEventListener<T extends keyof HTMLElementEventMap> = (
  event: HTMLElementEventMap[T]
) => void;