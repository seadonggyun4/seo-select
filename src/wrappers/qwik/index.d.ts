/**
 * Qwik Wrapper Type Definitions for seo-select components
 */

import type { Component, QRL } from '@builder.io/qwik';
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
export interface SeoSelectProps {
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
  onSelect$?: QRL<(event: CustomEvent<SelectEventDetail>) => void>;
  onDeselect$?: QRL<(event: CustomEvent<DeselectEventDetail>) => void>;
  onReset$?: QRL<(event: CustomEvent<ResetEventDetail>) => void>;
  onChange$?: QRL<(event: Event) => void>;
}

export interface SeoSelectSearchProps extends SeoSelectProps {
  searchTexts?: Partial<SearchLocalizedTexts>;
  onSearchChange$?: QRL<(event: CustomEvent<SearchChangeEventDetail>) => void>;
}

/**
 * SeoSelect Qwik Component
 */
export declare const SeoSelect: Component<SeoSelectProps>;

/**
 * SeoSelectSearch Qwik Component
 */
export declare const SeoSelectSearch: Component<SeoSelectSearchProps>;

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};
