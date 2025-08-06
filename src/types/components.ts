import { SupportedLanguage, SelectTheme, LocalizedTexts, SearchLocalizedTexts } from './config';
import { VirtualSelectOption } from './options';

export interface SeoSelectProps {
  id?: string;
  name?: string;
  required?: boolean;
  width?: string | null;
  height?: string;
  optionItems?: VirtualSelectOption[];
  showReset?: boolean;
  multiple?: boolean;
  theme?: SelectTheme;
  dark?: boolean;
  language?: SupportedLanguage;
  texts?: Partial<LocalizedTexts>;
  autoWidth?: boolean;
}

export interface SeoSelectSearchProps extends SeoSelectProps {
  searchTexts?: Partial<SearchLocalizedTexts>;
}

export interface SeoSelectState {
  open: boolean;
  labelText: string;
  selectedValues: string[];
  isLoading: boolean;
}

export interface SeoSelectSearchState extends SeoSelectState {
  searchText: string;
  noMatchVisible: boolean;
}