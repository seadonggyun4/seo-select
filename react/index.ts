// react/wrapper/index.ts
export { default as SeoSelect } from './wrapper/SeoSelect';
export { default as SeoSelectSearch } from './wrapper/SeoSelectSearch';

// 타입들 export
export type {
  SeoSelectProps,
  SeoSelectRef,
  SeoSelectElement,
  ResetEventData
} from './wrapper/SeoSelect';

export type {
  SeoSelectSearchProps,
  SeoSelectSearchRef,
  SeoSelectSearchElement
} from './wrapper/SeoSelectSearch';

// seo-select 기본 타입들 re-export (편의를 위해)
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
  BatchUpdateOption
} from 'seo-select/types';