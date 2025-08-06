export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh';

export type SelectTheme = 'basic' | 'float';

export interface LocalizedTexts {
  placeholder: string;
  required: string;
  resetToDefault: string;
  clearAll: string;
  removeTag: string;
  loadingText: string;
  noDataText: string;
}

export interface SearchLocalizedTexts {
  searchPlaceholder: string;
  noMatchText: string;
}