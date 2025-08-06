import { EVENT_NAMES } from '../constants/constants';
import type {
  SeoSelectEvent,
  SeoDeselectEvent,
  SeoResetEvent,
  SeoChangeEvent,
  SeoOpenEvent
} from '../event/SeoSelectEvent';
import type {
  SeoSearchChangeEvent,
  SeoSearchFilterEvent
} from '../event/SeoSearchEvent';

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

// 글로벌 타입 확장 - HTMLElementEventMap에 커스텀 이벤트 추가
declare global {
  interface HTMLElementEventMap {
    [EVENT_NAMES.SELECT]: SeoSelectEvent;
    [EVENT_NAMES.DESELECT]: SeoDeselectEvent;
    [EVENT_NAMES.RESET]: SeoResetEvent;
    [EVENT_NAMES.CHANGE]: SeoChangeEvent;
    [EVENT_NAMES.SELECT_OPEN]: SeoOpenEvent;
    [EVENT_NAMES.SEARCH_CHANGE]: SeoSearchChangeEvent;
    [EVENT_NAMES.SEARCH_FILTER]: SeoSearchFilterEvent;
  }
}