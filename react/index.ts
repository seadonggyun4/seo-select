// react/index.ts
export { default as SeoSelect } from './wrapper/SeoSelect';
export { default as SeoSelectSearch } from './wrapper/SeoSelectSearch';

// 타입 exports
export type {
  SeoSelectProps,
  SeoSelectRef,
  SeoSelectElement,
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme
} from './wrapper/SeoSelect';

export type {
  SeoSelectSearchProps,
  SeoSelectSearchRef,
  SeoSelectSearchElement,
  SearchLocalizedTexts
} from './wrapper/SeoSelectSearch';

// 스타일 로딩 유틸리티 함수
export const loadSeoSelectStyles = (): void => {
  if (typeof document === 'undefined') return; // SSR 지원
  
  const existingStylesheet = document.querySelector('link[href*="seo-select"]');
  
  if (!existingStylesheet) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('../dist/styles/style.css', import.meta.url).href;
    document.head.appendChild(link);
  }
};

// 컴포넌트 준비 확인 함수
export const waitForSeoSelectReady = async (): Promise<void> => {
  if (typeof window === 'undefined') return; // SSR 지원
  
  await Promise.all([
    customElements.whenDefined('seo-select'),
    customElements.whenDefined('seo-select-search')
  ]);
};