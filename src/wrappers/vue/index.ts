/**
 * Vue 3 Wrapper for seo-select components
 * Provides Vue-friendly interface with proper event handling
 */

import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  h,
  type PropType,
  type SetupContext,
} from 'vue';

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

// Common props definition
const commonProps = {
  id: String,
  name: String,
  required: Boolean,
  width: String,
  height: String,
  optionItems: Array as PropType<VirtualSelectOption[]>,
  showReset: Boolean,
  multiple: Boolean,
  theme: String as PropType<SelectTheme>,
  dark: Boolean,
  language: String as PropType<SupportedLanguage>,
  texts: Object as PropType<Partial<LocalizedTexts>>,
  autoWidth: Boolean,
};

/**
 * SeoSelect Vue Component
 */
export const SeoSelect = defineComponent({
  name: 'SeoSelect',
  props: commonProps,
  emits: ['select', 'deselect', 'reset', 'change'],
  setup(props, { emit, slots, expose }: SetupContext) {
    const elementRef = ref<HTMLElement | null>(null);

    // Event handlers
    const handleSelect = (e: Event) => {
      emit('select', (e as CustomEvent).detail);
    };
    const handleDeselect = (e: Event) => {
      emit('deselect', (e as CustomEvent).detail);
    };
    const handleReset = (e: Event) => {
      emit('reset', (e as CustomEvent).detail);
    };
    const handleChange = (e: Event) => {
      emit('change', e);
    };

    onMounted(() => {
      const el = elementRef.value;
      if (!el) return;

      // Set object properties
      if (props.optionItems) {
        (el as any).optionItems = props.optionItems;
      }
      if (props.texts) {
        (el as any).texts = props.texts;
      }

      // Add event listeners
      el.addEventListener('onSelect', handleSelect);
      el.addEventListener('onDeselect', handleDeselect);
      el.addEventListener('onReset', handleReset);
      el.addEventListener('change', handleChange);
    });

    onBeforeUnmount(() => {
      const el = elementRef.value;
      if (!el) return;

      el.removeEventListener('onSelect', handleSelect);
      el.removeEventListener('onDeselect', handleDeselect);
      el.removeEventListener('onReset', handleReset);
      el.removeEventListener('change', handleChange);
    });

    // Watch for prop changes
    watch(() => props.optionItems, (newVal) => {
      if (elementRef.value && newVal) {
        (elementRef.value as any).optionItems = newVal;
      }
    }, { deep: true });

    watch(() => props.texts, (newVal) => {
      if (elementRef.value && newVal) {
        (elementRef.value as any).texts = newVal;
      }
    }, { deep: true });

    // Expose methods
    expose({
      element: elementRef,
      reset: () => {
        if (elementRef.value) {
          (elementRef.value as any).reset?.();
        }
      },
      getValue: () => {
        if (elementRef.value) {
          return (elementRef.value as any).value;
        }
        return undefined;
      },
      setValue: (value: string | string[]) => {
        if (elementRef.value) {
          (elementRef.value as any).value = value;
        }
      },
    });

    return () => h('seo-select', {
      ref: elementRef,
      id: props.id,
      name: props.name,
      required: props.required || undefined,
      width: props.width,
      height: props.height,
      'show-reset': props.showReset || undefined,
      multiple: props.multiple || undefined,
      theme: props.theme,
      dark: props.dark || undefined,
      language: props.language,
      'auto-width': props.autoWidth || undefined,
    }, slots.default?.());
  },
});

/**
 * SeoSelectSearch Vue Component
 */
export const SeoSelectSearch = defineComponent({
  name: 'SeoSelectSearch',
  props: {
    ...commonProps,
    searchTexts: Object as PropType<Partial<SearchLocalizedTexts>>,
  },
  emits: ['select', 'deselect', 'reset', 'change', 'searchChange'],
  setup(props, { emit, slots, expose }: SetupContext) {
    const elementRef = ref<HTMLElement | null>(null);

    // Event handlers
    const handleSelect = (e: Event) => {
      emit('select', (e as CustomEvent).detail);
    };
    const handleDeselect = (e: Event) => {
      emit('deselect', (e as CustomEvent).detail);
    };
    const handleReset = (e: Event) => {
      emit('reset', (e as CustomEvent).detail);
    };
    const handleChange = (e: Event) => {
      emit('change', e);
    };
    const handleSearchChange = (e: Event) => {
      emit('searchChange', (e as CustomEvent).detail);
    };

    onMounted(() => {
      const el = elementRef.value;
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

      // Add event listeners
      el.addEventListener('onSelect', handleSelect);
      el.addEventListener('onDeselect', handleDeselect);
      el.addEventListener('onReset', handleReset);
      el.addEventListener('change', handleChange);
      el.addEventListener('onSearchChange', handleSearchChange);
    });

    onBeforeUnmount(() => {
      const el = elementRef.value;
      if (!el) return;

      el.removeEventListener('onSelect', handleSelect);
      el.removeEventListener('onDeselect', handleDeselect);
      el.removeEventListener('onReset', handleReset);
      el.removeEventListener('change', handleChange);
      el.removeEventListener('onSearchChange', handleSearchChange);
    });

    // Watch for prop changes
    watch(() => props.optionItems, (newVal) => {
      if (elementRef.value && newVal) {
        (elementRef.value as any).optionItems = newVal;
      }
    }, { deep: true });

    watch(() => props.texts, (newVal) => {
      if (elementRef.value && newVal) {
        (elementRef.value as any).texts = newVal;
      }
    }, { deep: true });

    watch(() => props.searchTexts, (newVal) => {
      if (elementRef.value && newVal) {
        (elementRef.value as any).searchTexts = newVal;
      }
    }, { deep: true });

    // Expose methods
    expose({
      element: elementRef,
      reset: () => {
        if (elementRef.value) {
          (elementRef.value as any).reset?.();
        }
      },
      getValue: () => {
        if (elementRef.value) {
          return (elementRef.value as any).value;
        }
        return undefined;
      },
      setValue: (value: string | string[]) => {
        if (elementRef.value) {
          (elementRef.value as any).value = value;
        }
      },
    });

    return () => h('seo-select-search', {
      ref: elementRef,
      id: props.id,
      name: props.name,
      required: props.required || undefined,
      width: props.width,
      height: props.height,
      'show-reset': props.showReset || undefined,
      multiple: props.multiple || undefined,
      theme: props.theme,
      dark: props.dark || undefined,
      language: props.language,
      'auto-width': props.autoWidth || undefined,
    }, slots.default?.());
  },
});

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};

// Vue custom element declaration
declare module 'vue' {
  export interface GlobalComponents {
    SeoSelect: typeof SeoSelect;
    SeoSelectSearch: typeof SeoSelectSearch;
  }
}
