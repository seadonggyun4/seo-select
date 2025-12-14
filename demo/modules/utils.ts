/**
 * Demo 페이지 유틸리티 함수
 */

import type { SeoSelectElement } from './types';

/**
 * SeoSelect 요소인지 타입 가드
 */
export function isSeoSelectElement(element: Element | null): element is SeoSelectElement {
  return element !== null && (
    element.tagName === 'SEO-SELECT' ||
    element.tagName === 'SEO-SELECT-SEARCH'
  );
}

/**
 * HTMLButtonElement인지 타입 가드
 */
export function isHTMLButtonElement(element: EventTarget | null): element is HTMLButtonElement {
  return element !== null && element instanceof HTMLButtonElement;
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Promise 기반 딜레이
 */
export function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ID로 SeoSelect 요소 가져오기
 */
export function getSeoSelectElement(id: string): SeoSelectElement | null {
  const element = document.getElementById(id);
  return isSeoSelectElement(element) ? element : null;
}
