/**
 * Vue 3 Wrapper Type Definitions for seo-select components
 */

import type { DefineComponent, Ref } from 'vue';
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

// Props interfaces
export interface SeoSelectVueProps {
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
}

export interface SeoSelectSearchVueProps extends SeoSelectVueProps {
  searchTexts?: Partial<SearchLocalizedTexts>;
}

// Exposed methods interface
export interface SeoSelectExposed {
  element: Ref<HTMLElement | null>;
  reset: () => void;
  getValue: () => string | string[] | undefined;
  setValue: (value: string | string[]) => void;
}

/**
 * SeoSelect Vue Component
 */
export declare const SeoSelect: DefineComponent<
  SeoSelectVueProps,
  SeoSelectExposed,
  {},
  {},
  {},
  {},
  {},
  {
    select: (detail: SelectEventDetail) => void;
    deselect: (detail: DeselectEventDetail) => void;
    reset: (detail: ResetEventDetail) => void;
    change: (event: Event) => void;
  }
>;

/**
 * SeoSelectSearch Vue Component
 */
export declare const SeoSelectSearch: DefineComponent<
  SeoSelectSearchVueProps,
  SeoSelectExposed,
  {},
  {},
  {},
  {},
  {},
  {
    select: (detail: SelectEventDetail) => void;
    deselect: (detail: DeselectEventDetail) => void;
    reset: (detail: ResetEventDetail) => void;
    change: (event: Event) => void;
    searchChange: (detail: SearchChangeEventDetail) => void;
  }
>;

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};
