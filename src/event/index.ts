import { EVENT_NAMES } from '../constants/constants.js';
import { SeoSelectEvent, SeoDeselectEvent, SeoResetEvent, SeoChangeEvent, SeoOpenEvent } from './SeoSelectEvent.js';

// 이벤트 클래스들
export {
  SeoSelectEvent,
  SeoDeselectEvent,
  SeoResetEvent,
  SeoChangeEvent,
  SeoOpenEvent,
} from './SeoSelectEvent.js';

// 헬퍼 함수들
export {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
  SeoSelectEventHelpers,
} from './eventHelpers.js';

// 타입 정의들
export interface SeoSelectEventMap {
  [EVENT_NAMES.SELECT]: SeoSelectEvent;
  [EVENT_NAMES.DESELECT]: SeoDeselectEvent;
  [EVENT_NAMES.RESET]: SeoResetEvent;
  [EVENT_NAMES.CHANGE]: SeoChangeEvent;
  [EVENT_NAMES.SELECT_OPEN]: SeoOpenEvent;
}

/**
 * 이벤트 리스너 타입 헬퍼
 */
export type SeoSelectEventListener<T extends keyof SeoSelectEventMap> = (
  event: SeoSelectEventMap[T]
) => void;