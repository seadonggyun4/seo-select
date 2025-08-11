import { 
  SeoSelectEvent, 
  SeoDeselectEvent, 
  SeoResetEvent, 
  SeoChangeEvent,
  SeoOpenEvent
} from './SeoSelectEvent.js';
import {
  SeoSearchChangeEvent,
  SeoSearchFilterEvent
} from './SeoSearchEvent.js';
import { EVENT_NAMES } from '../constants/constants.js';

// 선택
export function triggerSelectEvent(element: HTMLElement, label: string, value: string) {
  element.dispatchEvent(new SeoSelectEvent(EVENT_NAMES.SELECT, label, value));
}

// 선택 해제
export function triggerDeselectEvent(element: HTMLElement, label: string, value: string) {
  element.dispatchEvent(new SeoDeselectEvent(EVENT_NAMES.DESELECT, label, value));
}

// 리셋
export function triggerResetEvent(element: HTMLElement, detail?: unknown) {
  element.dispatchEvent(new SeoResetEvent(detail));
}

// 변경
export function triggerChangeEvent(element: HTMLElement) {
  element.dispatchEvent(new SeoChangeEvent());
}

// 열림 — 호환성 위해 'open'과 'select-open' 둘 다 쏴주기(원하면 유지)
export function triggerOpenEvent(element: HTMLElement, selectInstance?: any) {
  // select-open
  element.dispatchEvent(new SeoOpenEvent(selectInstance));
  // open (레거시/호환)
  element.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
}

// 검색 변경
export function triggerSearchChangeEvent(element: HTMLElement, searchText: string, previousSearchText?: string) {
  element.dispatchEvent(new SeoSearchChangeEvent(searchText, previousSearchText));
}

// 검색 필터링
export function triggerSearchFilterEvent(
  element: HTMLElement,
  filteredOptions: Array<{ value: string; label: string }>,
  searchText: string,
  hasResults: boolean
) {
  element.dispatchEvent(new SeoSearchFilterEvent(filteredOptions, searchText, hasResults));
}
