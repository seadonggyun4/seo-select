// react/wrapper/SeoSelectSearch.tsx
import * as React from 'react';
import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';

// seo-select/types에서 기본 타입들 import
import type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
  BatchUpdateOption,
  SeoSelectSearchElement as BaseSeoSelectSearchElement,
} from 'seo-select/types';

// 기존 SeoSelect에서 ResetEventData import
import type { ResetEventData } from './SeoSelect';

// React option element props 타입 정의
interface OptionElementProps {
  value?: string;
  children?: React.ReactNode;
  selected?: boolean;
  [key: string]: any;
}

// SeoSelectSearchElement 인터페이스를 BaseSeoSelectSearchElement로 확장
export interface SeoSelectSearchElement extends BaseSeoSelectSearchElement {}

// Props
export interface SeoSelectSearchProps {
  // 기본 HTML 속성
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // seo-select 특화 속성
  multiple?: boolean;
  theme?: SelectTheme;
  dark?: boolean;
  language?: SupportedLanguage;
  showReset?: boolean;
  width?: string;
  height?: string;
  autoWidth?: boolean;

  // 데이터 관련
  optionItems?: VirtualSelectOption[];
  value?: string | string[];

  // 다국어 지원
  texts?: Partial<LocalizedTexts>;
  searchTexts?: Partial<SearchLocalizedTexts>;

  // 검색 텍스트
  /** 초기 1회만 반영되는 검색어(이벤트 발생). searchText가 주어지면 무시됨. */
  defaultSearchText?: string;
  /** 제어 모드 검색어. 값이 바뀌면 항상 컴포넌트에 반영(이벤트 발생). */
  searchText?: string;

  // React 이벤트 핸들러
  onSelect?: (event: { label: string; value: string }) => void;
  onDeselect?: (event: { label: string; value: string }) => void;
  onReset?: (event: ResetEventData) => void;
  onChange?: () => void;
  onOpen?: () => void;

  // 검색 전용 이벤트 핸들러
  onSearchChange?: (searchText: string) => void;
  onSearchFilter?: (
    filteredOptions: VirtualSelectOption[],
    searchText: string,
    hasMatches: boolean
  ) => void;

  // HTML option elements
  children?: React.ReactNode;

  // 기타 속성들
  [key: string]: any;
}

export interface SeoSelectSearchRef {
  element: SeoSelectSearchElement | null;

  // 기본 메서드들
  addOptions: (options: VirtualSelectOption[], preserveSelection?: boolean) => void;
  addOption: (option: VirtualSelectOption, index?: number) => void;
  clearOption: (value: string) => void;
  clearAllOptions: () => void;
  resetToDefaultValue: () => void;
  setLanguage: (language: SupportedLanguage) => void;
  setTexts: (texts: Partial<LocalizedTexts>) => void;
  setAutoWidth: (enabled: boolean) => void;
  clearCaches: () => void;
  batchUpdateOptions: (updates: BatchUpdateOption[]) => void;

  // 검색 전용 메서드들
  setSearchTexts: (searchTexts: Partial<SearchLocalizedTexts>) => void;
  getSearchText: () => string;
  setSearchText: (searchText: string) => void;
  clearSearchText: () => void;
  updateOptionsWithSearch: (options: VirtualSelectOption[], preserveSearch?: boolean) => void;
  loadOptionsForSearch: (
    searchText: string,
    optionLoader: (search: string) => Promise<VirtualSelectOption[]>
  ) => Promise<void>;

  // 값 관리 메서드
  getValue: () => string | null;
  setValue: (value: string) => void;
  getSelectedValues: () => string[];
  setSelectedValues: (values: string[]) => void;

  // 상태 확인 메서드
  hasNoOptions: () => boolean;
  getOptions: () => HTMLOptionElement[];
  getSelectedIndex: () => number;
  getDefaultValue: () => string | null;

  // 드롭다운 제어 메서드
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;

  // 계산 메서드들
  calculateAutoWidth: () => void;
  calculateDropdownHeight: () => string;
  getEffectiveWidth: () => string;
  getEffectiveHeight: () => string;

  // 고급 메서드들
  getLocalizedText: () => LocalizedTexts;
  getAllOptionData: () => VirtualSelectOption[];

  // 상태 접근
  isOpen: () => boolean;
  isLoading: () => boolean;
  getTheme: () => SelectTheme;
  isDark: () => boolean;
  getLanguage: () => SupportedLanguage;
  isAutoWidth: () => boolean;

  // 검색 상태 접근
  isNoMatchVisible: () => boolean;
}

// React에서 웹 컴포넌트 JSX 타입 선언
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select-search': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        name?: string;
        required?: boolean;
        disabled?: boolean;
        multiple?: boolean;
        theme?: SelectTheme;
        dark?: boolean;
        language?: SupportedLanguage;
        'show-reset'?: boolean;
        width?: string;
        height?: string;
        'auto-width'?: boolean;
        ref?: React.Ref<SeoSelectSearchElement>;
      };
    }
  }
}

// 웹 컴포넌트 등록 대기를 위한 Promise 기반 유틸리티
const waitForCustomElement = (tagName: string, timeout = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (customElements.get(tagName)) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const maxAttempts = timeout / 50; // 50ms 간격

    const check = () => {
      if (customElements.get(tagName)) {
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.warn(`${tagName} custom element not registered within ${timeout}ms`);
        resolve(false);
      } else {
        attempts++;
        setTimeout(check, 50);
      }
    };

    check();
  });
};

// 동적으로 seo-select-search 로드하는 함수
const loadSeoSelectSearch = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  if (customElements.get('seo-select-search')) {
    return true;
  }

  try {
    await import('seo-select/components/seo-select-search');
    return true;
  } catch (error) {
    console.error('Failed to load seo-select-search:', error);
    console.warn('Please install seo-select: npm install seo-select');
    return false;
  }
};

const SeoSelectSearch = forwardRef<SeoSelectSearchRef, SeoSelectSearchProps>((props, ref) => {
  // 모든 Hook 선언
  const elementRef = useRef<SeoSelectSearchElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webComponentInstance, setWebComponentInstance] =
    useState<SeoSelectSearchElement | null>(null);

  // 이전 값 추적
  const prevValueRef = useRef<string | string[] | undefined>();
  const prevOptionItemsRef = useRef<VirtualSelectOption[] | undefined>();
  const prevSearchTextRef = useRef<string | undefined>(undefined);
  const isInitializingRef = useRef(false);
  const defaultSearchAppliedRef = useRef(false);

  const {
    onSelect,
    onDeselect,
    onReset,
    onChange,
    onOpen,
    onSearchChange,
    onSearchFilter,
    children,
    optionItems,
    value,
    className,
    style,
    id,
    name,
    required,
    disabled,
    multiple,
    theme = 'float',
    dark = false,
    language = 'en',
    showReset = false,
    width,
    height,
    autoWidth = false,
    texts,
    searchTexts,
    defaultSearchText, // 초기 1회
    searchText, // 제어 모드
    ...restProps
  } = props;

  // 동기적 초기화: 컴포넌트 로드/등록
  useLayoutEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      try {
        const loaded = await loadSeoSelectSearch();

        if (!loaded) {
          if (mounted) {
            setLoadError(
              'seo-select-search could not be loaded. Please ensure seo-select is installed.'
            );
            setHasError(true);
            setIsReady(true);
          }
          return;
        }

        const isRegistered = await waitForCustomElement('seo-select-search', 10000);

        if (mounted) {
          if (isRegistered) {
            setIsReady(true);
            setHasError(false);
            setLoadError(null);
          } else {
            setLoadError('seo-select-search web component registration timeout');
            setHasError(true);
            setIsReady(true);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to initialize seo-select-search:', error);
          setLoadError(error instanceof Error ? error.message : 'Unknown error occurred');
          setHasError(true);
          setIsReady(true);
        }
      }
    };

    initializeComponent();

    return () => {
      mounted = false;
    };
  }, []);

  // optionItems 변경 감지
  const optionItemsChanged = useCallback(
    (prev: VirtualSelectOption[] | undefined, current: VirtualSelectOption[] | undefined) => {
      if (!prev && !current) return false;
      if (!prev || !current) return true;
      if (prev.length !== current.length) return true;

      return prev.some(
        (item, index) =>
          item.value !== current[index]?.value || item.label !== current[index]?.label
      );
    },
    []
  );

  // value 변경 감지
  const valueChanged = useCallback(
    (prev: string | string[] | undefined, current: string | string[] | undefined) => {
      if (prev === current) return false;
      if (!prev && !current) return false;
      if (!prev || !current) return true;

      if (Array.isArray(prev) && Array.isArray(current)) {
        if (prev.length !== current.length) return true;
        return prev.some((val, idx) => val !== current[idx]);
        }
      return String(prev) !== String(current);
    },
    []
  );

  // imperative handle
  useImperativeHandle(
    ref,
    () => ({
      element: webComponentInstance,

      // 기본 메서드들
      addOptions: (options, preserveSelection = false) =>
        webComponentInstance?.addOptions(options, preserveSelection),
      addOption: (option, index) => webComponentInstance?.addOption(option, index),
      clearOption: (val) => webComponentInstance?.clearOption(val),
      clearAllOptions: () => webComponentInstance?.clearAllOptions(),
      resetToDefaultValue: () => webComponentInstance?.resetToDefaultValue(),
      setLanguage: (lng) => webComponentInstance?.setLanguage(lng),
      setTexts: (t) => webComponentInstance?.setTexts(t),
      setAutoWidth: (enabled) => webComponentInstance?.setAutoWidth(enabled),
      clearCaches: () => webComponentInstance?.clearCaches(),
      batchUpdateOptions: (updates) => webComponentInstance?.batchUpdateOptions(updates),

      // 검색 메서드들
      setSearchTexts: (st) => webComponentInstance?.setSearchTexts(st),
      getSearchText: () => webComponentInstance?.getSearchText() || '',
      setSearchText: (st) => webComponentInstance?.setSearchText(st),
      clearSearchText: () => webComponentInstance?.clearSearchText(),
      updateOptionsWithSearch: (opts, preserve = true) =>
        webComponentInstance?.updateOptionsWithSearch(opts, preserve),
      loadOptionsForSearch: async (st, loader) =>
        webComponentInstance?.loadOptionsForSearch
          ? webComponentInstance.loadOptionsForSearch(st, loader)
          : Promise.resolve(),

      // 값 관리
      getValue: () => webComponentInstance?.value || null,
      setValue: (newValue) => {
        if (webComponentInstance) webComponentInstance.value = newValue;
      },
      getSelectedValues: () => webComponentInstance?.selectedValues || [],
      setSelectedValues: (vals) => {
        if (webComponentInstance) webComponentInstance.selectedValues = vals;
      },

      // 상태 확인
      hasNoOptions: () => webComponentInstance?.hasNoOptions() ?? false,
      getOptions: () => webComponentInstance?.options || [],
      getSelectedIndex: () => webComponentInstance?.selectedIndex || -1,
      getDefaultValue: () => webComponentInstance?.defaultValue || null,

      // 드롭다운 제어
      openDropdown: () => webComponentInstance?.openDropdown?.(),
      closeDropdown: () => webComponentInstance?.closeDropdown?.(),
      toggleDropdown: () => webComponentInstance?.toggleDropdown?.(),

      // 계산
      calculateAutoWidth: () => webComponentInstance?.calculateAutoWidth?.(),
      calculateDropdownHeight: () => webComponentInstance?.calculateDropdownHeight?.() || 'auto',
      getEffectiveWidth: () => webComponentInstance?.getEffectiveWidth?.() || 'auto',
      getEffectiveHeight: () => webComponentInstance?.getEffectiveHeight?.() || 'auto',

      // 고급
      getLocalizedText: () =>
        webComponentInstance?.getLocalizedText?.() || {
          placeholder: 'Select...',
          noDataText: 'No data available',
          loadingText: 'Loading...',
          removeTag: 'Remove',
          clearAll: 'Clear all',
          resetToDefault: 'Reset to default',
          required: 'This field is required',
        },
      getAllOptionData: () => webComponentInstance?.getAllOptionData?.() || [],

      // 상태 접근
      isOpen: () => webComponentInstance?.open || false,
      isLoading: () => (webComponentInstance as any)?._isLoading || false,
      getTheme: () => webComponentInstance?.theme || 'float',
      isDark: () => webComponentInstance?.dark || false,
      getLanguage: () => webComponentInstance?.language || 'en',
      isAutoWidth: () => webComponentInstance?.autoWidth || false,

      // 검색 상태
      isNoMatchVisible: () => (webComponentInstance as any)?._noMatchVisible || false,
    }),
    [webComponentInstance]
  );

  // 이벤트 리스너
  useEffect(() => {
    if (!webComponentInstance) return;
    const el = webComponentInstance;

    const handleSelect = (e: Event) => {
      const { label = '', value = '' } = (e as CustomEvent).detail ?? {};
      onSelect?.({ label: String(label), value: String(value) });
    };
    const handleDeselect = (e: Event) => {
      const { label = '', value = '' } = (e as CustomEvent).detail ?? {};
      onDeselect?.({ label: String(label), value: String(value) });
    };
    const handleReset = (e: Event) => onReset?.((e as CustomEvent).detail);
    const handleChange = () => onChange?.();
    const handleOpen = () => onOpen?.();

    const handleSearchChange = (e: Event) => {
      const d =
        (e as CustomEvent).detail as
          | { searchText: string }
          | { searchText: string; previousSearchText: string }
          | undefined;
      if (d && typeof d === 'object' && typeof (d as any).searchText === 'string') {
        onSearchChange?.((d as any).searchText);
      }
    };

    const handleSearchFilter = (e: Event) => {
      const { filteredOptions = [], searchText = '', hasMatches = false } =
        (e as CustomEvent).detail ?? {};
      onSearchFilter?.(filteredOptions, searchText, hasMatches);
    };

    const added: Array<[string, EventListener]> = [];

    if (onSelect) {
      el.addEventListener('onSelect', handleSelect);
      added.push(['onSelect', handleSelect]);
    }
    if (onDeselect) {
      el.addEventListener('onDeselect', handleDeselect);
      added.push(['onDeselect', handleDeselect]);
    }
    if (onReset) {
      el.addEventListener('onReset', handleReset);
      added.push(['onReset', handleReset]);
    }
    if (onChange) {
      el.addEventListener('onChange', handleChange);
      added.push(['onChange', handleChange]);
    }
    if (onOpen) {
      el.addEventListener('onOpen', handleOpen);
      added.push(['onOpen', handleOpen]);
    }
    if (onSearchChange) {
      el.addEventListener('onSearchChange', handleSearchChange);
      added.push(['onSearchChange', handleSearchChange]);
    }
    if (onSearchFilter) {
      el.addEventListener('onSearchFilter', handleSearchFilter);
      added.push(['onSearchFilter', handleSearchFilter]);
    }

    return () => {
      added.forEach(([name, h]) => el.removeEventListener(name, h));
    };
  }, [webComponentInstance, onSelect, onDeselect, onReset, onChange, onOpen, onSearchChange, onSearchFilter]);

  // 시각/외관/동작 Props 동기화
  useEffect(() => {
    if (!webComponentInstance || isInitializingRef.current) return;

    try {
      if (theme && webComponentInstance.theme !== theme) {
        webComponentInstance.theme = theme;
      }
      if (typeof dark === 'boolean' && webComponentInstance.dark !== dark) {
        webComponentInstance.dark = dark;
      }
      if (language && webComponentInstance.language !== language) {
        webComponentInstance.language = language;
      }
      if (typeof showReset === 'boolean' && webComponentInstance.showReset !== showReset) {
        webComponentInstance.showReset = showReset;
      }
      if (typeof autoWidth === 'boolean' && webComponentInstance.autoWidth !== autoWidth) {
        webComponentInstance.autoWidth = autoWidth;
      }

      if (width && webComponentInstance.width !== width) {
        webComponentInstance.width = width;
      }
      if (height && webComponentInstance.height !== height) {
        webComponentInstance.height = height;
      }

      if (texts && JSON.stringify(webComponentInstance.texts) !== JSON.stringify(texts)) {
        webComponentInstance.texts = texts;
      }
      if (
        searchTexts &&
        JSON.stringify(webComponentInstance.searchTexts) !== JSON.stringify(searchTexts)
      ) {
        webComponentInstance.searchTexts = searchTexts;
      }

      if (typeof required === 'boolean' && webComponentInstance.required !== required) {
        webComponentInstance.required = required;
      }
      if (typeof multiple === 'boolean' && webComponentInstance.multiple !== multiple) {
        webComponentInstance.multiple = multiple;
      }
    } catch (err) {
      console.error('Failed to sync props:', err);
    }
  }, [
    webComponentInstance,
    theme,
    dark,
    language,
    showReset,
    autoWidth,
    width,
    height,
    texts,
    searchTexts,
    required,
    multiple,
  ]);

  // optionItems 동기화
  useEffect(() => {
    if (!webComponentInstance || isInitializingRef.current) return;

    if (optionItemsChanged(prevOptionItemsRef.current, optionItems)) {
      prevOptionItemsRef.current = optionItems ? [...optionItems] : undefined;

      try {
        if (optionItems && Array.isArray(optionItems)) {
          const hasCurrentSelection = multiple
            ? (webComponentInstance.selectedValues || []).length > 0
            : Boolean(webComponentInstance.value);

          webComponentInstance.optionItems = optionItems;

          if (hasCurrentSelection) {
            if (multiple) {
              const currentSelectedValues = webComponentInstance.selectedValues || [];
              const validValues = currentSelectedValues.filter((val) =>
                optionItems.some((opt) => opt.value === val)
              );
              if (validValues.length !== currentSelectedValues.length) {
                webComponentInstance.selectedValues = validValues;
              }
            } else {
              const currentValue = webComponentInstance.value;
              if (currentValue && !optionItems.some((opt) => opt.value === currentValue)) {
                if (optionItems.length > 0) {
                  webComponentInstance.value = optionItems[0].value;
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync optionItems:', err);
      }
    }
  }, [webComponentInstance, optionItems, multiple, optionItemsChanged]);

  // value 동기화
  useEffect(() => {
    if (!webComponentInstance || isInitializingRef.current) return;

    if (value !== undefined && valueChanged(prevValueRef.current, value)) {
      prevValueRef.current = value;

      try {
        if (Array.isArray(value)) {
          if (multiple) {
            const currentSelectedValues = webComponentInstance.selectedValues || [];
            if (JSON.stringify(currentSelectedValues) !== JSON.stringify(value)) {
              webComponentInstance.selectedValues = [...value];
            }
          }
        } else {
          if (!multiple) {
            const stringValue = String(value);
            if (webComponentInstance.value !== stringValue) {
              webComponentInstance.value = stringValue;
            }
          }
        }
      } catch (err) {
        console.error('Failed to set value:', err);
      }
    }
  }, [webComponentInstance, value, multiple, valueChanged]);

  // children 처리 - selected 속성 제거
  const processedChildren = React.useMemo(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const childProps = child.props as OptionElementProps;
        const { selected, ...otherProps } = childProps;
        return React.cloneElement(child, otherProps);
      }
      return child;
    });
  }, [children]);

  // 웹 컴포넌트 생성/초기 설정 (searchText 세팅은 여기서 하지 않음!)
  useEffect(() => {
    if (!containerRef.current || !isReady || hasError) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const attributes: string[] = [];
    if (id) attributes.push(`id="${id}"`);
    if (className) attributes.push(`class="${className}"`);
    if (name) attributes.push(`name="${name}"`);
    if (theme) attributes.push(`theme="${theme}"`);
    if (dark === true) attributes.push('dark');
    if (language) attributes.push(`language="${language}"`);
    if (showReset === true) attributes.push('show-reset');
    if (width) attributes.push(`width="${width}"`);
    if (height) attributes.push(`height="${height}"`);
    if (autoWidth === true) attributes.push('auto-width');
    if (multiple === true) attributes.push('multiple');
    if (required === true) attributes.push('required');
    if (disabled === true) attributes.push('disabled');

    const attributeString = attributes.join(' ');

    // children HTML 생성
    let childrenHtml = '';
    if (processedChildren) {
      React.Children.forEach(processedChildren, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const childProps = child.props as OptionElementProps;
          const value = childProps.value || '';
          let text = '';
          if (typeof childProps.children === 'string' || typeof childProps.children === 'number') {
            text = String(childProps.children);
          }
          const escapedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
          const escapedValue = value.replace(/"/g, '&quot;');

          childrenHtml += `<option value="${escapedValue}">${escapedText}</option>`;
        }
      });
    }

    container.innerHTML = `<seo-select-search ${attributeString}>${childrenHtml}</seo-select-search>`;

    const webComponent = container.querySelector('seo-select-search') as SeoSelectSearchElement;
    if (webComponent) {
      isInitializingRef.current = true;

      setWebComponentInstance(webComponent);

      if (style) {
        Object.assign(webComponent.style, style);
      }

      // 초기 설정: optionItems/value/texts만 세팅(리스너가 먼저 붙고 난 뒤에 searchText 세팅)
      requestAnimationFrame(() => {
        try {
          if (optionItems && Array.isArray(optionItems)) {
            webComponent.optionItems = optionItems;
            prevOptionItemsRef.current = [...optionItems];
          }

          if (value !== undefined) {
            if (Array.isArray(value) && multiple) {
              webComponent.selectedValues = [...value];
            } else if (!Array.isArray(value) && !multiple) {
              webComponent.value = String(value);
            }
            prevValueRef.current = value;
          }

          if (texts) webComponent.texts = texts;
          if (searchTexts) webComponent.searchTexts = searchTexts;
        } catch (err) {
          console.error('Failed to initialize web component:', err);
        } finally {
          isInitializingRef.current = false;
        }
      });
    }

    return () => {
      container.innerHTML = '';
      setWebComponentInstance(null);
      isInitializingRef.current = false;
      defaultSearchAppliedRef.current = false;
      prevSearchTextRef.current = undefined;
    };
  }, [
    isReady,
    hasError,
    id,
    className,
    name,
    theme,
    dark,
    language,
    showReset,
    width,
    height,
    autoWidth,
    multiple,
    required,
    disabled,
    style,
    processedChildren,
    optionItems,
    value,
    texts,
    searchTexts,
  ]);

  // ✅ 리스너가 붙은 뒤 → 초기 검색어(defaultSearchText) 1회 설정 (이벤트 발생)
  useEffect(() => {
    if (!webComponentInstance) return;
    if (defaultSearchAppliedRef.current) return;
    if (!defaultSearchText) return;
    if (searchText !== undefined) return; // controlled가 있으면 default 무시

    requestAnimationFrame(() => {
      if (!webComponentInstance) return;
      webComponentInstance._searchText = String(defaultSearchText); // setter → onSearchChange 발생
      defaultSearchAppliedRef.current = true;
      prevSearchTextRef.current = String(defaultSearchText);
    });
  }, [webComponentInstance, defaultSearchText, searchText]);

  // ✅ controlled searchText 동기화 (이벤트 발생)
  useEffect(() => {
    if (!webComponentInstance) return;
    if (searchText === undefined) return;

    const next = String(searchText);
    if (prevSearchTextRef.current === next) return;

    webComponentInstance._searchText = next; // setter → onSearchChange 발생
    prevSearchTextRef.current = next;
  }, [webComponentInstance, searchText]);

  // SSR 플레이스홀더
  if (typeof window === 'undefined') {
    return (
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          color: '#6c757d',
          fontSize: '14px',
          display: 'inline-block',
          minWidth: '120px',
        }}
      >
        seo-select-search (SSR)
      </div>
    );
  }

  // 로딩 중
  if (!isReady) {
    return (
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          color: '#666',
          fontSize: '14px',
          display: 'inline-block',
          minWidth: '120px',
        }}
      >
        Loading seo-select-search...
      </div>
    );
  }

  // 에러
  if (hasError && loadError) {
    return (
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          fontSize: '14px',
          display: 'inline-block',
          minWidth: '120px',
        }}
      >
        Error: {loadError}
      </div>
    );
  }

  return <div ref={containerRef} style={{ display: 'contents' }} />;
});

SeoSelectSearch.displayName = 'SeoSelectSearch';

// 정적 메서드들
(SeoSelectSearch as any).getSupportedLanguages = (): SupportedLanguage[] => {
  return ['en', 'ko', 'ja', 'zh'];
};

(SeoSelectSearch as any).getDefaultTexts = (): Record<SupportedLanguage, LocalizedTexts> => {
  return {
    en: {
      placeholder: 'Select...',
      noDataText: 'No data available',
      loadingText: 'Loading...',
      removeTag: 'Remove',
      clearAll: 'Clear all',
      resetToDefault: 'Reset to default',
      required: 'This field is required',
    },
    ko: {
      placeholder: '선택하세요...',
      noDataText: '데이터가 없습니다',
      loadingText: '로딩 중...',
      removeTag: '제거',
      clearAll: '모두 지우기',
      resetToDefault: '기본값으로 재설정',
      required: '필수 입력 항목입니다',
    },
    ja: {
      placeholder: '選択してください...',
      noDataText: 'データがありません',
      loadingText: '読み込み中...',
      removeTag: '削除',
      clearAll: 'すべてクリア',
      resetToDefault: 'デフォルトにリセット',
      required: 'この項目は必須です',
    },
    zh: {
      placeholder: '请选择...',
      noDataText: '无数据',
      loadingText: '加载中...',
      removeTag: '删除',
      clearAll: '清除全部',
      resetToDefault: '重置为默认值',
      required: '此字段为必填项',
    },
  };
};

(SeoSelectSearch as any).getDefaultSearchTexts = (): Record<
  SupportedLanguage,
  SearchLocalizedTexts
> => {
  return {
    en: {
      searchPlaceholder: 'Type to search...',
      noMatchText: 'No matches found',
    },
    ko: {
      searchPlaceholder: '검색어를 입력하세요...',
      noMatchText: '검색 결과가 없습니다',
    },
    ja: {
      searchPlaceholder: '検索してください...',
      noMatchText: '該当する結果がありません',
    },
    zh: {
      searchPlaceholder: '输入搜索内容...',
      noMatchText: '未找到匹配结果',
    },
  };
};

export default SeoSelectSearch;
