import { EVENT_NAMES } from '../constants/constants';
import type {
  SeoSelectEvent,
  SeoDeselectEvent,
  SeoResetEvent,
  SeoChangeEvent,
  SeoOpenEvent
} from '../event/SeoSelectEvent';
import type {
  SeoSearchChangeEvent,
  SeoSearchFilterEvent
} from '../event/SeoSearchEvent';
import type {
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts
} from './config';
import type { SeoSelectElement, SeoSelectSearchElement } from './index';
import { VirtualSelectOption } from './options';

// 글로벌 타입 확장
declare global {
  // HTMLElementEventMap에 커스텀 이벤트 추가
  interface HTMLElementEventMap {
    [EVENT_NAMES.SELECT]: SeoSelectEvent;
    [EVENT_NAMES.DESELECT]: SeoDeselectEvent;
    [EVENT_NAMES.RESET]: SeoResetEvent;
    [EVENT_NAMES.CHANGE]: SeoChangeEvent;
    [EVENT_NAMES.SELECT_OPEN]: SeoOpenEvent;
    [EVENT_NAMES.SEARCH_CHANGE]: SeoSearchChangeEvent;
    [EVENT_NAMES.SEARCH_FILTER]: SeoSearchFilterEvent;
  }

  // HTML 표준 - 모든 환경에서 사용 가능 (Vanilla JS, Remix, Next.js, Qwik 등)
  interface HTMLElementTagNameMap {
    'seo-select': SeoSelectElement;
    'seo-select-search': SeoSelectSearchElement;
  }

  interface Document {
    createElement(tagName: 'seo-select'): SeoSelectElement;
    createElement(tagName: 'seo-select-search'): SeoSelectSearchElement;
  }

  // React JSX 타입 확장 (React, Next.js, Remix 지원)
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': any & {
        // 기본 속성들
        name?: string;
        required?: boolean;
        width?: string;
        height?: string;
        multiple?: boolean;
        theme?: SelectTheme;
        dark?: boolean;
        language?: SupportedLanguage;
        'show-reset'?: boolean;
        'auto-width'?: boolean;

        // ref 속성
        ref?: any;

        // React 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
        onSelect?: (event: CustomEvent<{ label: string; value: string }>) => void;
        onDeselect?: (event: CustomEvent<{ label: string; value: string }>) => void;
        onReset?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
        onChange?: (event: CustomEvent) => void;
        onOpen?: (event: CustomEvent) => void;
      };

      'seo-select-search': any & {
        // 기본 속성들 (seo-select 상속)
        name?: string;
        required?: boolean;
        width?: string;
        height?: string;
        multiple?: boolean;
        theme?: SelectTheme;
        dark?: boolean;
        language?: SupportedLanguage;
        'show-reset'?: boolean;
        'auto-width'?: boolean;

        // ref 속성
        ref?: any;

        // React 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
        onSelect?: (event: CustomEvent<{ label: string; value: string }>) => void;
        onDeselect?: (event: CustomEvent<{ label: string; value: string }>) => void;
        onReset?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
        onChange?: (event: CustomEvent) => void;
        onOpen?: (event: CustomEvent) => void;
        onSearchChange?: (event: CustomEvent<{ searchText: string }>) => void;
        onSearchFilter?: (event: CustomEvent<{
          filteredOptions: VirtualSelectOption[];
          searchText: string;
          hasResults: boolean;
        }>) => void;
      };
    }
  }
}

// Vue 3 타입 확장 (Nuxt 3도 지원)
// @ts-ignore - Vue가 설치되지 않은 환경에서는 이 모듈 확장이 무시됩니다
declare module '@vue/runtime-core' {
  interface GlobalComponents {
    'seo-select': {
      // 기본 속성들
      name?: string;
      required?: boolean;
      width?: string;
      height?: string;
      multiple?: boolean;
      theme?: SelectTheme;
      dark?: boolean;
      language?: SupportedLanguage;
      'show-reset'?: boolean;
      'auto-width'?: boolean;

      // Vue에서는 프로퍼티도 직접 바인딩 가능
      optionItems?: VirtualSelectOption[];
      texts?: Partial<LocalizedTexts>;

      // Vue 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
      onSelect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onDeselect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onReset?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
      onChange?: (event: CustomEvent) => void;
      onOpen?: (event: CustomEvent) => void;
    };

    'seo-select-search': {
      // 기본 속성들 (seo-select 상속)
      name?: string;
      required?: boolean;
      width?: string;
      height?: string;
      multiple?: boolean;
      theme?: SelectTheme;
      dark?: boolean;
      language?: SupportedLanguage;
      'show-reset'?: boolean;
      'auto-width'?: boolean;

      // Vue에서는 프로퍼티도 직접 바인딩 가능
      optionItems?: VirtualSelectOption[];
      texts?: Partial<LocalizedTexts>;
      searchTexts?: Partial<SearchLocalizedTexts>;

      // Vue 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
      onSelect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onDeselect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onReset?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
      onChange?: (event: CustomEvent) => void;
      onOpen?: (event: CustomEvent) => void;
      onSearchChange?: (event: CustomEvent<{ searchText: string }>) => void;
      onSearchFilter?: (event: CustomEvent<{
        filteredOptions: VirtualSelectOption[];
        searchText: string;
        hasResults: boolean;
      }>) => void;
    };
  }
}

// Vue 2 타입 확장 (Vue.js 2.x, Nuxt 2 지원)
// @ts-ignore - Vue 2가 설치되지 않은 환경에서는 이 모듈 확장이 무시됩니다
declare module 'vue/types/vue' {
  interface Vue {
    $refs: {
      [key: string]: Vue | Element | Vue[] | Element[] | SeoSelectElement | SeoSelectSearchElement;
    };
  }
}

// Angular 타입 확장 (ElementRef 타입 안전성)
// @ts-ignore - Angular가 설치되지 않은 환경에서는 이 모듈 확장이 무시됩니다
declare module '@angular/core' {
  interface ElementRef<T = any> {
    nativeElement: T extends 'seo-select' ? SeoSelectElement :
                  T extends 'seo-select-search' ? SeoSelectSearchElement :
                  T;
  }
}

// Svelte 타입 확장 (SvelteKit도 지원)
// @ts-ignore - Svelte가 설치되지 않은 환경에서는 이 네임스페이스 확장이 무시됩니다
declare namespace svelte.JSX {
  interface IntrinsicElements {
    'seo-select': {
      // 기본 속성들
      name?: string;
      required?: boolean;
      width?: string;
      height?: string;
      multiple?: boolean;
      theme?: SelectTheme;
      dark?: boolean;
      language?: SupportedLanguage;
      'show-reset'?: boolean;
      'auto-width'?: boolean;

      // Svelte 바인딩 (bind:this)
      this?: SeoSelectElement;

      // Svelte 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
      'on:onSelect'?: (event: CustomEvent<{ label: string; value: string }>) => void;
      'on:onDeselect'?: (event: CustomEvent<{ label: string; value: string }>) => void;
      'on:onReset'?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
      'on:onChange'?: (event: CustomEvent) => void;
      'on:onOpen'?: (event: CustomEvent) => void;
    };

    'seo-select-search': {
      // 기본 속성들 (seo-select 상속)
      name?: string;
      required?: boolean;
      width?: string;
      height?: string;
      multiple?: boolean;
      theme?: SelectTheme;
      dark?: boolean;
      language?: SupportedLanguage;
      'show-reset'?: boolean;
      'auto-width'?: boolean;

      // Svelte 바인딩 (bind:this)
      this?: SeoSelectSearchElement;

      // Svelte 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
      'on:onSelect'?: (event: CustomEvent<{ label: string; value: string }>) => void;
      'on:onDeselect'?: (event: CustomEvent<{ label: string; value: string }>) => void;
      'on:onReset'?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
      'on:onChange'?: (event: CustomEvent) => void;
      'on:onOpen'?: (event: CustomEvent) => void;
      'on:onSearchChange'?: (event: CustomEvent<{ searchText: string }>) => void;
      'on:onSearchFilter'?: (event: CustomEvent<{
        filteredOptions: VirtualSelectOption[];
        searchText: string;
        hasResults: boolean;
      }>) => void;
    };
  }
}

// Qwik 타입 확장 (QwikCity도 지원)
// @ts-ignore - Qwik이 설치되지 않은 환경에서는 이 모듈 확장이 무시됩니다
declare module '@builder.io/qwik' {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': any & {
        // 기본 속성들
        name?: string;
        required?: boolean;
        width?: string;
        height?: string;
        multiple?: boolean;
        theme?: SelectTheme;
        dark?: boolean;
        language?: SupportedLanguage;
        'show-reset'?: boolean;
        'auto-width'?: boolean;

        // Qwik ref
        ref?: any;

        // Qwik 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
        'document:onSelect$'?: any;
        'document:onDeselect$'?: any;
        'document:onReset$'?: any;
        'document:onChange$'?: any;
        'document:onOpen$'?: any;
      };

      'seo-select-search': any & {
        // 기본 속성들 (seo-select 상속)
        name?: string;
        required?: boolean;
        width?: string;
        height?: string;
        multiple?: boolean;
        theme?: SelectTheme;
        dark?: boolean;
        language?: SupportedLanguage;
        'show-reset'?: boolean;
        'auto-width'?: boolean;

        // Qwik ref
        ref?: any;

        // Qwik 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
        'document:onSelect$'?: any;
        'document:onDeselect$'?: any;
        'document:onReset$'?: any;
        'document:onChange$'?: any;
        'document:onOpen$'?: any;
        'document:onSearchChange$'?: any;
        'document:onSearchFilter$'?: any;
      };
    }
  }
}

// Stencil 타입 확장 (StencilJS 프로젝트 지원)
// @ts-ignore - Stencil이 설치되지 않은 환경에서는 이 네임스페이스 확장이 무시됩니다
declare namespace JSX {
  interface StencilIntrinsicElements {
    'seo-select': {
      // 기본 속성들
      name?: string;
      required?: boolean;
      width?: string;
      height?: string;
      multiple?: boolean;
      theme?: SelectTheme;
      dark?: boolean;
      language?: SupportedLanguage;
      'show-reset'?: boolean;
      'auto-width'?: boolean;

      // Stencil 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
      onOnSelect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onOnDeselect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onOnReset?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
      onOnChange?: (event: CustomEvent) => void;
      onOnOpen?: (event: CustomEvent) => void;
    };

    'seo-select-search': {
      // 기본 속성들 (seo-select 상속)
      name?: string;
      required?: boolean;
      width?: string;
      height?: string;
      multiple?: boolean;
      theme?: SelectTheme;
      dark?: boolean;
      language?: SupportedLanguage;
      'show-reset'?: boolean;
      'auto-width'?: boolean;

      // Stencil 스타일 이벤트 핸들러들 (올바른 이벤트 이름 사용)
      onOnSelect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onOnDeselect?: (event: CustomEvent<{ label: string; value: string }>) => void;
      onOnReset?: (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => void;
      onOnChange?: (event: CustomEvent) => void;
      onOnOpen?: (event: CustomEvent) => void;
      onOnSearchChange?: (event: CustomEvent<{ searchText: string }>) => void;
      onOnSearchFilter?: (event: CustomEvent<{
        filteredOptions: VirtualSelectOption[];
        searchText: string;
        hasResults: boolean;
      }>) => void;
    };
  }
}