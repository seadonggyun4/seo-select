// react/wrapper/SeoSelectSearch.tsx
import * as React from 'react';
import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useLayoutEffect } from 'react';
import type { VirtualSelectOption, SupportedLanguage, SelectTheme } from './SeoSelect';

// React option element props 타입 정의
interface OptionElementProps {
  value?: string;
  children?: React.ReactNode;
  selected?: boolean;
  [key: string]: any;
}

// 검색 관련 타입 정의
export interface SearchLocalizedTexts {
  searchPlaceholder: string;
  noMatchText: string;
}

// 배치 업데이트 타입 정의
export interface BatchUpdateOption {
  action: 'add' | 'remove' | 'update';
  option?: VirtualSelectOption;
  value?: string;
  index?: number;
}

export interface SeoSelectSearchElement extends HTMLElement {
  optionItems: VirtualSelectOption[];
  value: string;
  selectedValues: string[];
  multiple: boolean;
  theme: SelectTheme;
  dark: boolean;
  language: SupportedLanguage;
  showReset: boolean;
  width: string | null;
  searchTexts: Partial<SearchLocalizedTexts>;
  
  // 기본 메서드들
  addOptions: (options: VirtualSelectOption[], preserveSelection?: boolean) => void;
  addOption: (option: VirtualSelectOption, index?: number) => void;
  clearOption: (value: string) => void;
  clearAllOptions: () => void;
  resetToDefaultValue: () => void;
  setLanguage: (language: SupportedLanguage) => void;
  setTexts: (texts: any) => void;
  setAutoWidth: (enabled: boolean) => void;
  clearCaches: () => void;
  batchUpdateOptions: (updates: BatchUpdateOption[]) => void;
  
  // 검색 전용 메서드들
  getSearchText: () => string;
  setSearchText: (searchText: string) => void;
  clearSearchText: () => void;
  setSearchTexts: (searchTexts: Partial<SearchLocalizedTexts>) => void;
  updateOptionsWithSearch: (options: VirtualSelectOption[], preserveSearch?: boolean) => void;
  loadOptionsForSearch: (searchText: string, optionLoader: (search: string) => Promise<VirtualSelectOption[]>) => Promise<void>;
  
  // 유틸리티 메서드들
  hasNoOptions: () => boolean;
  options: HTMLOptionElement[];
  selectedIndex: number;
  defaultValue: string | null;
}

export interface SeoSelectSearchProps {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  theme?: SelectTheme;
  dark?: boolean;
  language?: SupportedLanguage;
  showReset?: boolean;
  width?: string;
  optionItems?: VirtualSelectOption[];
  value?: string | string[];
  searchTexts?: Partial<SearchLocalizedTexts>;
  
  // React 이벤트 핸들러
  onSelect?: (event: { label: string; value: string }) => void;
  onDeselect?: (event: { label: string; value: string }) => void;
  onReset?: (event: { value?: string; label?: string; values?: string[]; labels?: string[] }) => void;
  onChange?: () => void;
  onOpen?: () => void;
  onSearchChange?: (searchText: string) => void;
  onSearchFilter?: (filteredOptions: VirtualSelectOption[]) => void;
  
  // HTML 속성
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
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
  setTexts: (texts: any) => void;
  setAutoWidth: (enabled: boolean) => void;
  clearCaches: () => void;
  batchUpdateOptions: (updates: BatchUpdateOption[]) => void;
  
  // 검색 전용 메서드들
  getSearchText: () => string;
  setSearchText: (searchText: string) => void;
  clearSearchText: () => void;
  setSearchTexts: (searchTexts: Partial<SearchLocalizedTexts>) => void;
  updateOptionsWithSearch: (options: VirtualSelectOption[], preserveSearch?: boolean) => void;
  loadOptionsForSearch: (searchText: string, optionLoader: (search: string) => Promise<VirtualSelectOption[]>) => Promise<void>;
  
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
  
  // 고급 메서드들
  calculateAutoWidth: () => void;
  getEffectiveWidth: () => string;
  getEffectiveHeight: () => string;
}

// React에서 웹 컴포넌트 JSX 타입 선언
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select-search': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        required?: boolean;
        disabled?: boolean;
        multiple?: boolean;
        theme?: SelectTheme;
        dark?: boolean;
        language?: SupportedLanguage;
        'show-reset'?: boolean;
        width?: string;
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
    // 동적 임포트로 seo-select-search 로드
    await import('seo-select/components/seo-select-search');
    return true;
  } catch (error) {
    console.error('Failed to load seo-select-search:', error);
    console.warn('Please install seo-select: npm install seo-select');
    return false;
  }
};

const SeoSelectSearch = forwardRef<SeoSelectSearchRef, SeoSelectSearchProps>((props, ref) => {
  // 🔥 모든 Hook을 맨 앞에 선언 - 조건부 return 전에 호출
  const elementRef = useRef<SeoSelectSearchElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // 이 Hook을 맨 앞으로 이동
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webComponentInstance, setWebComponentInstance] = useState<SeoSelectSearchElement | null>(null);
  
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
    searchTexts,
    name,
    required,
    disabled,
    multiple,
    theme = 'float',
    dark = false,
    language = 'en',
    showReset = false,
    width,
    ...restProps
  } = props;

  // useLayoutEffect로 동기적 초기화
  useLayoutEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      try {
        // seo-select-search 로드 시도
        const loaded = await loadSeoSelectSearch();
        
        if (!loaded) {
          if (mounted) {
            setLoadError('seo-select-search could not be loaded. Please ensure seo-select is installed.');
            setHasError(true);
            setIsReady(true);
          }
          return;
        }

        // 웹 컴포넌트 등록 대기
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

  // imperative handle 설정
  useImperativeHandle(ref, () => ({
    element: webComponentInstance,
    
    // 기본 메서드들
    addOptions: (options: VirtualSelectOption[], preserveSelection = false) => {
      webComponentInstance?.addOptions(options, preserveSelection);
    },
    addOption: (option: VirtualSelectOption, index?: number) => {
      webComponentInstance?.addOption(option, index);
    },
    clearOption: (value: string) => {
      webComponentInstance?.clearOption(value);
    },
    clearAllOptions: () => {
      webComponentInstance?.clearAllOptions();
    },
    resetToDefaultValue: () => {
      webComponentInstance?.resetToDefaultValue();
    },
    setLanguage: (language: SupportedLanguage) => {
      webComponentInstance?.setLanguage(language);
    },
    setTexts: (texts: any) => {
      webComponentInstance?.setTexts(texts);
    },
    setAutoWidth: (enabled: boolean) => {
      webComponentInstance?.setAutoWidth(enabled);
    },
    clearCaches: () => {
      webComponentInstance?.clearCaches();
    },
    batchUpdateOptions: (updates: BatchUpdateOption[]) => {
      webComponentInstance?.batchUpdateOptions(updates);
    },
    
    // 검색 전용 메서드들
    getSearchText: () => webComponentInstance?.getSearchText() || '',
    setSearchText: (searchText: string) => {
      webComponentInstance?.setSearchText(searchText);
    },
    clearSearchText: () => {
      webComponentInstance?.clearSearchText();
    },
    setSearchTexts: (searchTexts: Partial<SearchLocalizedTexts>) => {
      webComponentInstance?.setSearchTexts(searchTexts);
    },
    updateOptionsWithSearch: (options: VirtualSelectOption[], preserveSearch = true) => {
      webComponentInstance?.updateOptionsWithSearch(options, preserveSearch);
    },
    loadOptionsForSearch: async (searchText: string, optionLoader: (search: string) => Promise<VirtualSelectOption[]>) => {
      return webComponentInstance?.loadOptionsForSearch(searchText, optionLoader);
    },
    
    // 값 관리 메서드
    getValue: () => webComponentInstance?.value || null,
    setValue: (newValue: string) => {
      if (webComponentInstance) {
        webComponentInstance.value = newValue;
      }
    },
    getSelectedValues: () => webComponentInstance?.selectedValues || [],
    setSelectedValues: (values: string[]) => {
      if (webComponentInstance) {
        webComponentInstance.selectedValues = values;
      }
    },
    
    // 상태 확인 메서드
    hasNoOptions: () => webComponentInstance?.hasNoOptions() || true,
    getOptions: () => webComponentInstance?.options || [],
    getSelectedIndex: () => webComponentInstance?.selectedIndex || -1,
    getDefaultValue: () => webComponentInstance?.defaultValue || null,
    
    // 드롭다운 제어 메서드
    openDropdown: () => {
      (webComponentInstance as any)?.openDropdown?.();
    },
    closeDropdown: () => {
      (webComponentInstance as any)?.closeDropdown?.();
    },
    toggleDropdown: () => {
      (webComponentInstance as any)?.toggleDropdown?.();
    },
    
    // 고급 메서드들
    calculateAutoWidth: () => {
      (webComponentInstance as any)?.calculateAutoWidth?.();
    },
    getEffectiveWidth: () => {
      return (webComponentInstance as any)?.getEffectiveWidth?.() || 'auto';
    },
    getEffectiveHeight: () => {
      return (webComponentInstance as any)?.getEffectiveHeight?.() || 'auto';
    },
  }), [webComponentInstance]);

  // 이벤트 리스너 설정
  useEffect(() => {
    if (!webComponentInstance) return;
    
    const element = webComponentInstance;

    const handleSelect = (event: Event) => {
      const customEvent = event as CustomEvent<{ label: string; value: string }>;
      onSelect?.(customEvent.detail);
    };
    
    const handleDeselect = (event: Event) => {
      const customEvent = event as CustomEvent<{ label: string; value: string }>;
      onDeselect?.(customEvent.detail);
    };
    
    const handleReset = (event: Event) => {
      const customEvent = event as CustomEvent;
      onReset?.(customEvent.detail);
    };
    
    const handleChange = () => onChange?.();
    const handleOpen = () => onOpen?.();
    
    const handleSearchChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      onSearchChange?.(customEvent.detail);
    };
    
    const handleSearchFilter = (event: Event) => {
      const customEvent = event as CustomEvent<VirtualSelectOption[]>;
      onSearchFilter?.(customEvent.detail);
    };

    if (onSelect) element.addEventListener('onSelect', handleSelect);
    if (onDeselect) element.addEventListener('onDeselect', handleDeselect);
    if (onReset) element.addEventListener('onReset', handleReset);
    if (onChange) element.addEventListener('onChange', handleChange);
    if (onOpen) element.addEventListener('onOpen', handleOpen);
    if (onSearchChange) element.addEventListener('onSearchChange', handleSearchChange);
    if (onSearchFilter) element.addEventListener('onSearchFilter', handleSearchFilter);

    return () => {
      if (onSelect) element.removeEventListener('onSelect', handleSelect);
      if (onDeselect) element.removeEventListener('onDeselect', handleDeselect);
      if (onReset) element.removeEventListener('onReset', handleReset);
      if (onChange) element.removeEventListener('onChange', handleChange);
      if (onOpen) element.removeEventListener('onOpen', handleOpen);
      if (onSearchChange) element.removeEventListener('onSearchChange', handleSearchChange);
      if (onSearchFilter) element.removeEventListener('onSearchFilter', handleSearchFilter);
    };
  }, [webComponentInstance, onSelect, onDeselect, onReset, onChange, onOpen, onSearchChange, onSearchFilter]);

  // Props 동기화
  useEffect(() => {
    if (webComponentInstance && optionItems && Array.isArray(optionItems)) {
      try {
        webComponentInstance.optionItems = optionItems;
      } catch (err) {
        console.error('Failed to set optionItems:', err);
      }
    }
  }, [webComponentInstance, optionItems]);

  useEffect(() => {
    if (webComponentInstance && value !== undefined) {
      try {
        if (Array.isArray(value)) {
          webComponentInstance.selectedValues = value;
        } else {
          webComponentInstance.value = String(value);
        }
      } catch (err) {
        console.error('Failed to set value:', err);
      }
    }
  }, [webComponentInstance, value]);

  useEffect(() => {
    if (webComponentInstance && searchTexts) {
      try {
        webComponentInstance.setSearchTexts(searchTexts);
      } catch (err) {
        console.error('Failed to set searchTexts:', err);
      }
    }
  }, [webComponentInstance, searchTexts]);

  // children 처리 - selected 속성 제거 (useMemo로 최적화)
  const processedChildren = React.useMemo(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const childProps = child.props as OptionElementProps;
        // selected 속성 제거하고 복사
        const { selected, ...otherProps } = childProps;
        return React.cloneElement(child, otherProps);
      }
      return child;
    });
  }, [children]);

  // 웹 컴포넌트를 DOM에서 직접 생성 - innerHTML 방식 사용
  useEffect(() => {
    if (!containerRef.current || !isReady || hasError) return;
    
    const container = containerRef.current;
    
    // 기존 내용 제거
    container.innerHTML = '';
    
    // 속성 문자열 생성
    const attributes = [];
    if (id) attributes.push(`id="${id}"`);
    if (className) attributes.push(`class="${className}"`);
    if (name) attributes.push(`name="${name}"`);
    if (theme) attributes.push(`theme="${theme}"`);
    if (typeof dark === 'boolean') attributes.push(`dark="${dark}"`);
    if (language) attributes.push(`language="${language}"`);
    if (typeof showReset === 'boolean') attributes.push(`show-reset="${showReset}"`);
    if (width) attributes.push(`width="${width}"`);
    if (typeof multiple === 'boolean') attributes.push(`multiple="${multiple}"`);
    if (typeof required === 'boolean') attributes.push(`required="${required}"`);
    if (typeof disabled === 'boolean') attributes.push(`disabled="${disabled}"`);
    
    const attributeString = attributes.join(' ');
    
    // children HTML 생성
    let childrenHtml = '';
    if (processedChildren) {
      React.Children.forEach(processedChildren, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const childProps = child.props as OptionElementProps;
          const value = childProps.value || '';
          let text = '';
          // 문자열이나 숫자인 경우만 텍스트 설정
          if (
            typeof childProps.children === 'string' ||
            typeof childProps.children === 'number'
          ) {
            text = String(childProps.children);
          }
          // HTML 이스케이프 처리
          const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          const escapedValue = value.replace(/"/g, '&quot;');
          
          childrenHtml += `<option value="${escapedValue}">${escapedText}</option>`;
        }
      });
    }
    
    // HTML로 웹 컴포넌트 생성
    container.innerHTML = `<seo-select-search ${attributeString}>${childrenHtml}</seo-select-search>`;
    
    // 생성된 요소에 대한 참조 설정
    const webComponent = container.querySelector('seo-select-search') as SeoSelectSearchElement;
    if (webComponent) {
      setWebComponentInstance(webComponent);
      
      // 스타일 적용
      if (style) {
        Object.assign(webComponent.style, style);
      }
    }
    
    return () => {
      container.innerHTML = '';
      setWebComponentInstance(null);
    };
  }, [isReady, hasError, id, className, name, theme, dark, language, showReset, width, multiple, required, disabled, style, processedChildren]);

  // 🔥 조건부 렌더링을 Hook 호출 이후에 배치
  // SSR 환경에서는 플레이스홀더 렌더링
  if (typeof window === 'undefined') {
    return (
      <div style={{ 
        padding: '8px 12px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        color: '#6c757d',
        fontSize: '14px',
        display: 'inline-block',
        minWidth: '120px'
      }}>
        seo-select-search (SSR)
      </div>
    );
  }

  // 로딩 중
  if (!isReady) {
    return (
      <div style={{ 
        padding: '8px 12px', 
        backgroundColor: '#f5f5f5', 
        border: '1px solid #ddd',
        borderRadius: '4px',
        color: '#666',
        fontSize: '14px',
        display: 'inline-block',
        minWidth: '120px'
      }}>
        Loading seo-select-search...
      </div>
    );
  }

  // 에러 상태 표시
  if (hasError && loadError) {
    return (
      <div style={{ 
        padding: '8px 12px', 
        backgroundColor: '#f8d7da', 
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        color: '#721c24',
        fontSize: '14px',
        display: 'inline-block',
        minWidth: '120px'
      }}>
        Error: {loadError}
      </div>
    );
  }

  return <div ref={containerRef} style={{ display: 'contents' }} />;
});

SeoSelectSearch.displayName = 'SeoSelectSearch';
export default SeoSelectSearch;