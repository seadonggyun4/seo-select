    import { 
  SeoSelectEvent, 
  SeoDeselectEvent, 
  SeoResetEvent, 
  SeoChangeEvent,
  SeoOpenEvent
} from './SeoSelectEvent.js';
import { EVENT_NAMES } from '../constants/constants.js';

/**
 * 선택 이벤트 발생 헬퍼
 */
export function triggerSelectEvent(element: HTMLElement, label: string, value: string): void {
  const event = new SeoSelectEvent(EVENT_NAMES.SELECT, label, value);
  element.dispatchEvent(event);
}

/**
 * 선택 해제 이벤트 발생 헬퍼
 */
export function triggerDeselectEvent(element: HTMLElement, label: string, value: string): void {
  const event = new SeoDeselectEvent(label, value);
  element.dispatchEvent(event);
}

/**
 * 리셋 이벤트 발생 헬퍼
 */
export function triggerResetEvent(
  element: HTMLElement, 
  data: { 
    label?: string; 
    value?: string; 
    labels?: string[]; 
    values?: string[] 
  }
): void {
  const event = new SeoResetEvent(data);
  element.dispatchEvent(event);
}

/**
 * 변경 이벤트 발생 헬퍼
 */
export function triggerChangeEvent(element: HTMLElement): void {
  const event = new SeoChangeEvent();
  element.dispatchEvent(event);
}

/**
 * 드롭다운 열기 이벤트 발생 헬퍼 (내부용)
 */
export function triggerOpenEvent(selectInstance: any): void {
  const event = new SeoOpenEvent(selectInstance);
  window.dispatchEvent(event);
}

/**
 * 모든 이벤트 헬퍼 함수를 한번에 export
 */
export const SeoSelectEventHelpers = {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
} as const;