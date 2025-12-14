/**
 * Angular Wrapper Type Definitions for seo-select components
 */

import type { ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
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

/**
 * SeoSelect Angular Component
 */
export declare class SeoSelectComponent {
  selectElement: ElementRef<HTMLElement>;

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

  selectEvent: EventEmitter<SelectEventDetail>;
  deselectEvent: EventEmitter<DeselectEventDetail>;
  resetEvent: EventEmitter<ResetEventDetail>;
  changeEvent: EventEmitter<Event>;

  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  ngOnChanges(changes: SimpleChanges): void;

  reset(): void;
  getValue(): string | string[] | undefined;
  setValue(value: string | string[]): void;
}

/**
 * SeoSelectSearch Angular Component
 */
export declare class SeoSelectSearchComponent {
  selectElement: ElementRef<HTMLElement>;

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
  searchTexts?: Partial<SearchLocalizedTexts>;
  autoWidth?: boolean;

  selectEvent: EventEmitter<SelectEventDetail>;
  deselectEvent: EventEmitter<DeselectEventDetail>;
  resetEvent: EventEmitter<ResetEventDetail>;
  changeEvent: EventEmitter<Event>;
  searchChangeEvent: EventEmitter<SearchChangeEventDetail>;

  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  ngOnChanges(changes: SimpleChanges): void;

  reset(): void;
  getValue(): string | string[] | undefined;
  setValue(value: string | string[]): void;
}

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};
