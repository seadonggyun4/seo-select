/**
 * React Wrapper Type Definitions for seo-select components
 */

import type { ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react';
import type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
} from '../../types/index';

// Event detail types
export interface SelectEventDetail {
  label: string;
  value: string;
}

export interface DeselectEventDetail {
  label: string;
  value: string;
}

export interface ResetEventDetail {
  label?: string;
  value?: string;
  values?: string[];
  labels?: string[];
}

export interface SearchChangeEventDetail {
  searchText: string;
}

// Component ref interface
export interface SeoSelectRef {
  element: HTMLElement | null;
  reset: () => void;
  getValue: () => string | string[] | undefined;
  setValue: (value: string | string[]) => void;
}

// Props interface for SeoSelect
export interface SeoSelectReactProps {
  id?: string;
  name?: string;
  required?: boolean;
  width?: string;
  height?: string;
  optionItems?: VirtualSelectOption[];
  showReset?: boolean;
  multiple?: boolean;
  theme?: SelectTheme;
  dark?: boolean;
  language?: SupportedLanguage;
  texts?: Partial<LocalizedTexts>;
  autoWidth?: boolean;

  // Events
  onSelect?: (event: CustomEvent<SelectEventDetail>) => void;
  onDeselect?: (event: CustomEvent<DeselectEventDetail>) => void;
  onReset?: (event: CustomEvent<ResetEventDetail>) => void;
  onChange?: (event: Event) => void;

  // Children
  children?: ReactNode;
}

// Props interface for SeoSelectSearch
export interface SeoSelectSearchReactProps extends SeoSelectReactProps {
  searchTexts?: Partial<SearchLocalizedTexts>;
  onSearchChange?: (event: CustomEvent<SearchChangeEventDetail>) => void;
}

/**
 * SeoSelect React Component
 */
export declare const SeoSelect: ForwardRefExoticComponent<SeoSelectReactProps & RefAttributes<SeoSelectRef>>;

/**
 * SeoSelectSearch React Component
 */
export declare const SeoSelectSearch: ForwardRefExoticComponent<SeoSelectSearchReactProps & RefAttributes<SeoSelectRef>>;

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};
