/**
 * React Wrapper for seo-select components
 * Provides React-friendly interface with proper event handling and types
 */

import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ReactNode,
} from 'react';

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

// Component ref interface for imperative methods
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
 * Wrapper for the seo-select web component
 */
export const SeoSelect = forwardRef<SeoSelectRef, SeoSelectReactProps>(
  (props, ref) => {
    const elementRef = useRef<HTMLElement>(null);

    const {
      id,
      name,
      required,
      width,
      height,
      optionItems,
      showReset,
      multiple,
      theme,
      dark,
      language,
      texts,
      autoWidth,
      onSelect,
      onDeselect,
      onReset,
      onChange,
      children,
    } = props;

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      element: elementRef.current,
      reset: () => {
        if (elementRef.current) {
          (elementRef.current as any).reset?.();
        }
      },
      getValue: () => {
        if (elementRef.current) {
          return (elementRef.current as any).value;
        }
        return undefined;
      },
      setValue: (value: string | string[]) => {
        if (elementRef.current) {
          (elementRef.current as any).value = value;
        }
      },
    }));

    // Set up object properties (not attributes)
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (optionItems) {
        (element as any).optionItems = optionItems;
      }
    }, [optionItems]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (texts) {
        (element as any).texts = texts;
      }
    }, [texts]);

    // Set up event listeners
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (onSelect) {
        element.addEventListener('onSelect', onSelect as EventListener);
      }
      if (onDeselect) {
        element.addEventListener('onDeselect', onDeselect as EventListener);
      }
      if (onReset) {
        element.addEventListener('onReset', onReset as EventListener);
      }
      if (onChange) {
        element.addEventListener('change', onChange as EventListener);
      }

      return () => {
        if (onSelect) {
          element.removeEventListener('onSelect', onSelect as EventListener);
        }
        if (onDeselect) {
          element.removeEventListener('onDeselect', onDeselect as EventListener);
        }
        if (onReset) {
          element.removeEventListener('onReset', onReset as EventListener);
        }
        if (onChange) {
          element.removeEventListener('change', onChange as EventListener);
        }
      };
    }, [onSelect, onDeselect, onReset, onChange]);

    return (
      <seo-select
        ref={elementRef as React.RefObject<any>}
        id={id}
        name={name}
        required={required ? '' : undefined}
        width={width}
        height={height}
        show-reset={showReset ? '' : undefined}
        multiple={multiple ? '' : undefined}
        theme={theme}
        dark={dark ? '' : undefined}
        language={language}
        auto-width={autoWidth ? '' : undefined}
      >
        {children}
      </seo-select>
    );
  }
);

SeoSelect.displayName = 'SeoSelect';

/**
 * SeoSelectSearch React Component
 * Wrapper for the seo-select-search web component
 */
export const SeoSelectSearch = forwardRef<SeoSelectRef, SeoSelectSearchReactProps>(
  (props, ref) => {
    const elementRef = useRef<HTMLElement>(null);

    const {
      id,
      name,
      required,
      width,
      height,
      optionItems,
      showReset,
      multiple,
      theme,
      dark,
      language,
      texts,
      searchTexts,
      autoWidth,
      onSelect,
      onDeselect,
      onReset,
      onChange,
      onSearchChange,
      children,
    } = props;

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      element: elementRef.current,
      reset: () => {
        if (elementRef.current) {
          (elementRef.current as any).reset?.();
        }
      },
      getValue: () => {
        if (elementRef.current) {
          return (elementRef.current as any).value;
        }
        return undefined;
      },
      setValue: (value: string | string[]) => {
        if (elementRef.current) {
          (elementRef.current as any).value = value;
        }
      },
    }));

    // Set up object properties
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (optionItems) {
        (element as any).optionItems = optionItems;
      }
    }, [optionItems]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (texts) {
        (element as any).texts = texts;
      }
    }, [texts]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (searchTexts) {
        (element as any).searchTexts = searchTexts;
      }
    }, [searchTexts]);

    // Set up event listeners
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (onSelect) {
        element.addEventListener('onSelect', onSelect as EventListener);
      }
      if (onDeselect) {
        element.addEventListener('onDeselect', onDeselect as EventListener);
      }
      if (onReset) {
        element.addEventListener('onReset', onReset as EventListener);
      }
      if (onChange) {
        element.addEventListener('change', onChange as EventListener);
      }
      if (onSearchChange) {
        element.addEventListener('onSearchChange', onSearchChange as EventListener);
      }

      return () => {
        if (onSelect) {
          element.removeEventListener('onSelect', onSelect as EventListener);
        }
        if (onDeselect) {
          element.removeEventListener('onDeselect', onDeselect as EventListener);
        }
        if (onReset) {
          element.removeEventListener('onReset', onReset as EventListener);
        }
        if (onChange) {
          element.removeEventListener('change', onChange as EventListener);
        }
        if (onSearchChange) {
          element.removeEventListener('onSearchChange', onSearchChange as EventListener);
        }
      };
    }, [onSelect, onDeselect, onReset, onChange, onSearchChange]);

    return (
      <seo-select-search
        ref={elementRef as React.RefObject<any>}
        id={id}
        name={name}
        required={required ? '' : undefined}
        width={width}
        height={height}
        show-reset={showReset ? '' : undefined}
        multiple={multiple ? '' : undefined}
        theme={theme}
        dark={dark ? '' : undefined}
        language={language}
        auto-width={autoWidth ? '' : undefined}
      >
        {children}
      </seo-select-search>
    );
  }
);

SeoSelectSearch.displayName = 'SeoSelectSearch';

// Re-export types
export type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
};

// Declare JSX intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.RefObject<any>;
        id?: string;
        name?: string;
        required?: string;
        width?: string;
        height?: string;
        'show-reset'?: string;
        multiple?: string;
        theme?: string;
        dark?: string;
        language?: string;
        'auto-width'?: string;
      };
      'seo-select-search': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.RefObject<any>;
        id?: string;
        name?: string;
        required?: string;
        width?: string;
        height?: string;
        'show-reset'?: string;
        multiple?: string;
        theme?: string;
        dark?: string;
        language?: string;
        'auto-width'?: string;
      };
    }
  }
}
