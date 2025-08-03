import { EVENT_NAMES } from '../constants/constants.js';

export interface ResetEventData {
  label?: string;
  value?: string;
  labels?: string[];
  values?: string[];
}

export const SeoSelectEvents = {
  SELECT: EVENT_NAMES.SELECT,
  DESELECT: EVENT_NAMES.DESELECT,
  RESET: EVENT_NAMES.RESET,
  CHANGE: EVENT_NAMES.CHANGE,
  SELECT_OPEN: EVENT_NAMES.SELECT_OPEN,
} as const;

export type SeoSelectEventType = typeof SeoSelectEvents[keyof typeof SeoSelectEvents];

// 표준 addEventListener에서 사용할 수 있는 타입 정의
declare global {
  interface HTMLElementEventMap {
    [EVENT_NAMES.SELECT]: SeoSelectEvent;
    [EVENT_NAMES.DESELECT]: SeoDeselectEvent;
    [EVENT_NAMES.RESET]: SeoResetEvent;
    [EVENT_NAMES.CHANGE]: SeoChangeEvent;
    [EVENT_NAMES.SELECT_OPEN]: SeoOpenEvent;
  }
}

// 커스텀 이벤트 클래스들을 import해서 타입 확장
import { 
  SeoSelectEvent, 
  SeoDeselectEvent, 
  SeoResetEvent, 
  SeoChangeEvent, 
  SeoOpenEvent 
} from './SeoSelectEvent.js';