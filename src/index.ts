// Main components export
export { SeoSelect } from './components/seo-select/index.js';
export { SeoSelectSearch } from './components/seo-select-search/index.js';

// Types export
export type {
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts
} from './constants/constants.js';

// Constants export (optional, for advanced users)
export {
  LOCALIZED_TEXTS,
  SEARCH_LOCALIZED_TEXTS,
  SUPPORTED_LANGUAGES,
  DEFAULT_CONFIG,
  EVENT_NAMES
} from './constants/constants.js';

// Utils export (optional)
export { isMultilingualMatch } from './utils/search.js';