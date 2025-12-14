/**
 * SSR (Server-Side Rendering) 환경 호환성을 위한 유틸리티 함수들
 * Next.js, Nuxt, SvelteKit 등에서 안전하게 브라우저 API를 사용하기 위함
 */

/**
 * 브라우저 환경인지 확인
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * customElements API 사용 가능 여부 확인
 */
export const canUseCustomElements = (): boolean => {
  return isBrowser() && typeof customElements !== 'undefined';
};

/**
 * requestAnimationFrame의 SSR-safe 버전
 */
export const safeRequestAnimationFrame = (callback: FrameRequestCallback): number => {
  if (isBrowser() && typeof requestAnimationFrame !== 'undefined') {
    return requestAnimationFrame(callback);
  }
  // SSR 환경에서는 setTimeout으로 대체
  return setTimeout(callback, 16) as unknown as number;
};

/**
 * cancelAnimationFrame의 SSR-safe 버전
 */
export const safeCancelAnimationFrame = (handle: number): void => {
  if (isBrowser() && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(handle);
  } else {
    clearTimeout(handle);
  }
};

/**
 * 개발 환경인지 확인 (Vite/Webpack/Node.js 모두 호환)
 */
export const isDev = (): boolean => {
  try {
    // Vite 환경
    // @ts-ignore - import.meta.env는 Vite 환경에서만 존재
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env.DEV === true;
    }
  } catch {
    // import.meta 접근 실패 시 무시
  }
  try {
    // Webpack/Node.js 환경
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV !== 'production';
    }
  } catch {
    // process 접근 실패 시 무시
  }
  return false;
};

/**
 * 커스텀 엘리먼트를 안전하게 등록
 * SSR 환경에서는 아무 동작도 하지 않음
 */
export const safeDefineCustomElement = (
  name: string,
  constructor: CustomElementConstructor,
  options?: ElementDefinitionOptions
): boolean => {
  if (!canUseCustomElements()) {
    return false;
  }

  if (!customElements.get(name)) {
    customElements.define(name, constructor, options);
    return true;
  }

  return false;
};
