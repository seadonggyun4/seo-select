import { html } from 'lit';

// 지원되는 언어 타입
export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh';

// 테마 타입
export type SelectTheme = 'basic' | 'float';

// 기본 다국어 텍스트 인터페이스
export interface LocalizedTexts {
  placeholder: string;
  loadingText: string;
  noDataText: string;
  removeTag: string;
  clearAll: string;
  resetToDefault: string;
  required: string;
}

// 검색 관련 다국어 텍스트 인터페이스
export interface SearchLocalizedTexts {
  searchPlaceholder: string;
  noMatchText: string;
}

// 기본 다국어 텍스트 상수
export const LOCALIZED_TEXTS: Record<SupportedLanguage, LocalizedTexts> = {
  en: {
    placeholder: 'Please select',
    loadingText: 'Loading options...',
    noDataText: 'No data available',
    removeTag: 'Remove',
    clearAll: 'Clear all',
    resetToDefault: 'Reset to default',
    required: 'This field is required.'
  },
  ko: {
    placeholder: '선택해주세요',
    loadingText: '옵션 로딩 중...',
    noDataText: '데이터 없음',
    removeTag: '제거',
    clearAll: '모두 지우기',
    resetToDefault: '기본값으로 되돌리기',
    required: '필수 항목입니다.'
  },
  ja: {
    placeholder: '選択してください',
    loadingText: 'オプションを読み込み中...',
    noDataText: 'データがありません',
    removeTag: '削除',
    clearAll: 'すべてクリア',
    resetToDefault: 'デフォルトに戻す',
    required: 'この項目は必須です。'
  },
  zh: {
    placeholder: '请选择',
    loadingText: '正在加载选项...',
    noDataText: '无数据',
    removeTag: '移除',
    clearAll: '清除全部',
    resetToDefault: '恢复默认',
    required: '此项为必填项。'
  }
};

// 검색 관련 다국어 텍스트 상수
export const SEARCH_LOCALIZED_TEXTS: Record<SupportedLanguage, SearchLocalizedTexts> = {
  en: {
    searchPlaceholder: 'Search...',
    noMatchText: 'No matching data found.',
  },
  ko: {
    searchPlaceholder: '검색하세요',
    noMatchText: '데이터가 없습니다.',
  },
  ja: {
    searchPlaceholder: '検索してください',
    noMatchText: '一致するデータがありません。',
  },
  zh: {
    searchPlaceholder: '请搜索',
    noMatchText: '未找到匹配数据。',
  }
};

// 지원되는 언어 목록
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ko', 'ja', 'zh'];

// 기본 설정값
export const DEFAULT_CONFIG = {
  language: 'en' as SupportedLanguage,
  theme: 'float' as SelectTheme,
  height: '100%',
  showReset: true,
  multiple: false,
  dark: false,
  required: false,
} as const;

// 이벤트 이름 상수
export const EVENT_NAMES = {
  SELECT_OPEN: 'onOpen',
  SELECT: 'onSelect',
  DESELECT: 'onDeselect',
  RESET: 'onReset',
  CHANGE: 'onChange',
  SEARCH_CHANGE: 'onSearchChange',
  SEARCH_FILTER: 'onSearchFilter',
} as const;

// CSS 클래스 상수
export const CSS_CLASSES = {
  SELECT: 'seo-select',
  MULTI_SELECT: 'multi-select',
  OPEN: 'open',
  HIDDEN: 'hidden',
  SELECTED_CONTAINER: 'selected-container',
  SELECTED_TAGS: 'selected-tags',
  TAG: 'tag',
  TAG_REMOVE: 'tag-remove',
  PLACEHOLDER: 'placeholder',
  ARROW: 'arrow',
  LISTBOX: 'seo-select-listbox',
  SCROLL: 'seo-select-scroll',
  LOADING_CONTAINER: 'loading-container',
  LOADING_DOTS: 'loading-dots',
  LOADING_TEXT: 'loading-text',
  NO_DATA_CONTAINER: 'no-data-container',
  NO_DATA_TEXT: 'no-data-text',
  SEARCH_INPUT: 'select-search-input',
  SEARCH_ICON: 'search-icon',
  WITH_RESET: 'with-reset',
  RESET_BUTTON: 'reset-button',
  MULTI_RESET_BUTTON: 'multi-reset-button',
  SELECTED: 'selected',
  CHECK_MARK: 'check-mark',
  DOT: 'dot',
} as const;

// 타이밍 상수
export const TIMING = {
  LOADING_MIN: 500,
  LOADING_MAX: 1500,
  SELECT_DELAY: 0,
} as const;


// 아이콘 SVG 상수 (Lit TemplateResult로 반환)
export const ICONS = {
  CLOSE: () => html`
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  CHEVRON_DOWN: () => html`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  CHEVRON_UP: () => html`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  SEARCH: () => html`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
} as const;