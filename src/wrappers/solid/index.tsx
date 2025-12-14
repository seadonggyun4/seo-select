/**
 * Solid.js Wrapper for seo-select components
 * Provides Solid-friendly interface with proper event handling
 */

import {
  createEffect,
  onMount,
  onCleanup,
  type Component,
  type JSX,
} from 'solid-js';

// Import the actual web components to register them
import '../../components/seo-select/index';
import '../../components/seo-select-search/index';

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
export const SeoSelect: Component<SeoSelectProps> = (props) => {
  let element: HTMLElement | undefined;

  onMount(() => {
    if (!element) return;

    // Set object properties
    if (props.optionItems) {
      (element as any).optionItems = props.optionItems;
    }
    if (props.texts) {
      (element as any).texts = props.texts;
    }

    // Set up event listeners
    if (props.onSelect) {
      element.addEventListener('onSelect', props.onSelect as EventListener);
    }
    if (props.onDeselect) {
      element.addEventListener('onDeselect', props.onDeselect as EventListener);
    }
    if (props.onReset) {
      element.addEventListener('onReset', props.onReset as EventListener);
    }
    if (props.onChange) {
      element.addEventListener('change', props.onChange as EventListener);
    }

    // Call ref if provided
    if (props.ref) {
      props.ref(element);
    }
  });

  onCleanup(() => {
    if (!element) return;

    if (props.onSelect) {
      element.removeEventListener('onSelect', props.onSelect as EventListener);
    }
    if (props.onDeselect) {
      element.removeEventListener('onDeselect', props.onDeselect as EventListener);
    }
    if (props.onReset) {
      element.removeEventListener('onReset', props.onReset as EventListener);
    }
    if (props.onChange) {
      element.removeEventListener('change', props.onChange as EventListener);
    }
  });

  // Reactive updates for optionItems
  createEffect(() => {
    if (element && props.optionItems) {
      (element as any).optionItems = props.optionItems;
    }
  });

  // Reactive updates for texts
  createEffect(() => {
    if (element && props.texts) {
      (element as any).texts = props.texts;
    }
  });

  return (
    <seo-select
      ref={(el: HTMLElement) => { element = el; }}
      id={props.id}
      name={props.name}
      required={props.required || undefined}
      width={props.width}
      height={props.height}
      show-reset={props.showReset || undefined}
      multiple={props.multiple || undefined}
      theme={props.theme}
      dark={props.dark || undefined}
      language={props.language}
      auto-width={props.autoWidth || undefined}
    >
      {props.children}
    </seo-select>
  );
};

/**
 * SeoSelectSearch Solid Component
 */
export const SeoSelectSearch: Component<SeoSelectSearchProps> = (props) => {
  let element: HTMLElement | undefined;

  onMount(() => {
    if (!element) return;

    // Set object properties
    if (props.optionItems) {
      (element as any).optionItems = props.optionItems;
    }
    if (props.texts) {
      (element as any).texts = props.texts;
    }
    if (props.searchTexts) {
      (element as any).searchTexts = props.searchTexts;
    }

    // Set up event listeners
    if (props.onSelect) {
      element.addEventListener('onSelect', props.onSelect as EventListener);
    }
    if (props.onDeselect) {
      element.addEventListener('onDeselect', props.onDeselect as EventListener);
    }
    if (props.onReset) {
      element.addEventListener('onReset', props.onReset as EventListener);
    }
    if (props.onChange) {
      element.addEventListener('change', props.onChange as EventListener);
    }
    if (props.onSearchChange) {
      element.addEventListener('onSearchChange', props.onSearchChange as EventListener);
    }

    // Call ref if provided
    if (props.ref) {
      props.ref(element);
    }
  });

  onCleanup(() => {
    if (!element) return;

    if (props.onSelect) {
      element.removeEventListener('onSelect', props.onSelect as EventListener);
    }
    if (props.onDeselect) {
      element.removeEventListener('onDeselect', props.onDeselect as EventListener);
    }
    if (props.onReset) {
      element.removeEventListener('onReset', props.onReset as EventListener);
    }
    if (props.onChange) {
      element.removeEventListener('change', props.onChange as EventListener);
    }
    if (props.onSearchChange) {
      element.removeEventListener('onSearchChange', props.onSearchChange as EventListener);
    }
  });

  // Reactive updates
  createEffect(() => {
    if (element && props.optionItems) {
      (element as any).optionItems = props.optionItems;
    }
  });

  createEffect(() => {
    if (element && props.texts) {
      (element as any).texts = props.texts;
    }
  });

  createEffect(() => {
    if (element && props.searchTexts) {
      (element as any).searchTexts = props.searchTexts;
    }
  });

  return (
    <seo-select-search
      ref={(el: HTMLElement) => { element = el; }}
      id={props.id}
      name={props.name}
      required={props.required || undefined}
      width={props.width}
      height={props.height}
      show-reset={props.showReset || undefined}
      multiple={props.multiple || undefined}
      theme={props.theme}
      dark={props.dark || undefined}
      language={props.language}
      auto-width={props.autoWidth || undefined}
    >
      {props.children}
    </seo-select-search>
  );
};

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};

// Declare JSX intrinsic elements for Solid
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': any;
      'seo-select-search': any;
    }
  }
}
