import {
  SeoSelectEvent, SeoDeselectEvent, SeoResetEvent, SeoChangeEvent, SeoOpenEvent
} from './SeoSelectEvent';
import { SeoSearchChangeEvent, SeoSearchFilterEvent } from './SeoSearchEvent';

// 선택/해제
export const triggerSelectEvent    = (host: HTMLElement, label: string, value: string) => host.dispatchEvent(new SeoSelectEvent(label, value));
export const triggerDeselectEvent  = (host: HTMLElement, label: string, value: string) => host.dispatchEvent(new SeoDeselectEvent(label, value));

// 리셋(단일/다중 모두 지원)
export const triggerResetEvent     = (host: HTMLElement, detail: { value: string; label: string } | { values: string[]; labels: string[] }) =>
  host.dispatchEvent(new SeoResetEvent(detail));

// 값 변경/열림
export const triggerChangeEvent    = (host: HTMLElement) => host.dispatchEvent(new SeoChangeEvent());
export const triggerOpenEvent      = (host: HTMLElement, selectInstance?: any) => host.dispatchEvent(new SeoOpenEvent(selectInstance));

// 검색 전용
export const triggerSearchChangeEvent  = (host: HTMLElement, searchText: string, previousSearchText?: string) =>
  host.dispatchEvent(new SeoSearchChangeEvent(searchText, previousSearchText));

export const triggerSearchFilterEvent  = (host: HTMLElement, filteredOptions: Array<{ value: string; label: string }>, searchText: string, hasResults: boolean) =>
  host.dispatchEvent(new SeoSearchFilterEvent(filteredOptions, searchText, hasResults));
