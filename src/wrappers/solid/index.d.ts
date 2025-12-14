/**
 * Solid.js Wrapper Type Definitions for seo-select components
 */

import type { Component, JSX } from 'solid-js';
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
  onSelect?: (event: CustomEvent<SelectEventDetail>) => void;
  onDeselect?: (event: CustomEvent<DeselectEventDetail>) => void;
  onReset?: (event: CustomEvent<ResetEventDetail>) => void;
  onChange?: (event: Event) => void;

  // Element ref
  ref?: (el: HTMLElement) => void;

  // Children
  children?: JSX.Element;
}

export interface SeoSelectSearchProps extends SeoSelectProps {
  searchTexts?: Partial<SearchLocalizedTexts>;
  onSearchChange?: (event: CustomEvent<SearchChangeEventDetail>) => void;
}

/**
 * SeoSelect Solid Component
 */
export declare const SeoSelect: Component<SeoSelectProps>;

/**
 * SeoSelectSearch Solid Component
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
