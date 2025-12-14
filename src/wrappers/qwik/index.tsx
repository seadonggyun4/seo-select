/**
 * Qwik Wrapper for seo-select components
 * Provides Qwik-friendly interface with proper event handling
 */

import {
  component$,
  useSignal,
  useVisibleTask$,
  Slot,
  type QRL,
} from '@builder.io/qwik';

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
export const SeoSelect = component$<SeoSelectProps>((props) => {
  const elementRef = useSignal<HTMLElement>();

  useVisibleTask$(({ track, cleanup }) => {
    const el = track(() => elementRef.value);
    if (!el) return;

    // Set object properties
    if (props.optionItems) {
      (el as any).optionItems = props.optionItems;
    }
    if (props.texts) {
      (el as any).texts = props.texts;
    }

    // Event handlers
    const handleSelect = (e: Event) => {
      props.onSelect$?.(e as CustomEvent);
    };
    const handleDeselect = (e: Event) => {
      props.onDeselect$?.(e as CustomEvent);
    };
    const handleReset = (e: Event) => {
      props.onReset$?.(e as CustomEvent);
    };
    const handleChange = (e: Event) => {
      props.onChange$?.(e);
    };

    // Add event listeners
    el.addEventListener('onSelect', handleSelect);
    el.addEventListener('onDeselect', handleDeselect);
    el.addEventListener('onReset', handleReset);
    el.addEventListener('change', handleChange);

    cleanup(() => {
      el.removeEventListener('onSelect', handleSelect);
      el.removeEventListener('onDeselect', handleDeselect);
      el.removeEventListener('onReset', handleReset);
      el.removeEventListener('change', handleChange);
    });
  });

  // Update optionItems when changed
  useVisibleTask$(({ track }) => {
    const el = elementRef.value;
    const items = track(() => props.optionItems);
    if (el && items) {
      (el as any).optionItems = items;
    }
  });

  // Update texts when changed
  useVisibleTask$(({ track }) => {
    const el = elementRef.value;
    const texts = track(() => props.texts);
    if (el && texts) {
      (el as any).texts = texts;
    }
  });

  return (
    <seo-select
      ref={elementRef}
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
      <Slot />
    </seo-select>
  );
});

/**
 * SeoSelectSearch Qwik Component
 */
export const SeoSelectSearch = component$<SeoSelectSearchProps>((props) => {
  const elementRef = useSignal<HTMLElement>();

  useVisibleTask$(({ track, cleanup }) => {
    const el = track(() => elementRef.value);
    if (!el) return;

    // Set object properties
    if (props.optionItems) {
      (el as any).optionItems = props.optionItems;
    }
    if (props.texts) {
      (el as any).texts = props.texts;
    }
    if (props.searchTexts) {
      (el as any).searchTexts = props.searchTexts;
    }

    // Event handlers
    const handleSelect = (e: Event) => {
      props.onSelect$?.(e as CustomEvent);
    };
    const handleDeselect = (e: Event) => {
      props.onDeselect$?.(e as CustomEvent);
    };
    const handleReset = (e: Event) => {
      props.onReset$?.(e as CustomEvent);
    };
    const handleChange = (e: Event) => {
      props.onChange$?.(e);
    };
    const handleSearchChange = (e: Event) => {
      props.onSearchChange$?.(e as CustomEvent);
    };

    // Add event listeners
    el.addEventListener('onSelect', handleSelect);
    el.addEventListener('onDeselect', handleDeselect);
    el.addEventListener('onReset', handleReset);
    el.addEventListener('change', handleChange);
    el.addEventListener('onSearchChange', handleSearchChange);

    cleanup(() => {
      el.removeEventListener('onSelect', handleSelect);
      el.removeEventListener('onDeselect', handleDeselect);
      el.removeEventListener('onReset', handleReset);
      el.removeEventListener('change', handleChange);
      el.removeEventListener('onSearchChange', handleSearchChange);
    });
  });

  // Update optionItems when changed
  useVisibleTask$(({ track }) => {
    const el = elementRef.value;
    const items = track(() => props.optionItems);
    if (el && items) {
      (el as any).optionItems = items;
    }
  });

  // Update texts when changed
  useVisibleTask$(({ track }) => {
    const el = elementRef.value;
    const texts = track(() => props.texts);
    if (el && texts) {
      (el as any).texts = texts;
    }
  });

  // Update searchTexts when changed
  useVisibleTask$(({ track }) => {
    const el = elementRef.value;
    const searchTexts = track(() => props.searchTexts);
    if (el && searchTexts) {
      (el as any).searchTexts = searchTexts;
    }
  });

  return (
    <seo-select-search
      ref={elementRef}
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
      <Slot />
    </seo-select-search>
  );
});

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};
