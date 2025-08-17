import './global'

// 설정 관련 타입들
export type {
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts
} from './config';

// 옵션 관련 타입들
export type {
  VirtualSelectOption,
  OptionItem,
  BatchUpdateOption
} from './options';

// 컴포넌트 관련 타입들
export type {
  SeoSelectProps,
  SeoSelectSearchProps,
  SeoSelectState,
  SeoSelectSearchState
} from './components';

export {
  SeoSelectEvents
} from './event';

// 컴포넌트 클래스 타입 (외부에서 createElement 등으로 생성할 때 필요)
export type SeoSelectElement = import('../components/seo-select/index').SeoSelect;
export type SeoSelectSearchElement = import('../components/seo-select-search/index').SeoSelectSearch;

