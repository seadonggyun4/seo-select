// react/wrapper/SeoSelect.tsx
import * as React from 'react';
import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useLayoutEffect, useCallback } from 'react';

// seo-select/types에서 타입들 import
import type { 
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  BatchUpdateOption,
  SeoSelectElement as BaseSeoSelectElement
} from 'seo-select/types';

// React option element props 타입 정의
interface OptionElementProps {
  value?: string;
  children?: React.ReactNode;
  selected?: boolean;
  [key: string]: any;
}

// ResetEventData 타입 정의 (React용 확장)
export interface ResetEventData {
  value?: string;
  label?: string;
  values?: string[];
  labels?: string[];
}

// SeoSelectElement 인터페이스를 BaseSeoSelectElement로 확장
export interface SeoSelectElement extends BaseSeoSelectElement {
  // 추가적인 React 전용 속성이나 메서드가 있다면 여기에 정의
}

export interface SeoSelectProps {
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
  
  // React 이벤트 핸들러
  onSelect?: (event: { label: string; value: string }) => void;
  onDeselect?: (event: { label: string; value: string }) => void;
  onReset?: (event: ResetEventData) => void;
  onChange?: () => void;
  onOpen?: () => void;
  
  // HTML option elements
  children?: React.ReactNode;
  
  // 기타 속성들
  [key: string]: any;
}

export interface SeoSelectRef {
  element: SeoSelectElement | null;
  
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
}

// React에서 웹 컴포넌트 JSX 타입 선언
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
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
        ref?: React.Ref<SeoSelectElement>;
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

// 동적으로 seo-select 로드하는 함수
const loadSeoSelect = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  if (customElements.get('seo-select')) {
    return true;
  }

  try {
    // 동적 임포트로 seo-select 로드
    await import('seo-select');
    return true;
  } catch (error) {
    console.error('Failed to load seo-select:', error);
    console.warn('Please install seo-select: npm install seo-select');
    return false;
  }
};

const SeoSelect = forwardRef<SeoSelectRef, SeoSelectProps>((props, ref) => {
  // 모든 Hook을 맨 앞에 선언 - 조건부 return 전에 호출
  const elementRef = useRef<SeoSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webComponentInstance, setWebComponentInstance] = useState<SeoSelectElement | null>(null);
  
  // 이전 값들을 추적하기 위한 ref들
  const prevValueRef = useRef<string | string[] | undefined>();
  const prevOptionItemsRef = useRef<VirtualSelectOption[] | undefined>();
  const isInitializingRef = useRef(false);
  const syncInProgressRef = useRef(false);
  
  const {
    onSelect, 
    onDeselect, 
    onReset, 
    onChange, 
    onOpen,
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
    ...restProps
  } = props;

  // useLayoutEffect로 동기적 초기화
  useLayoutEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      try {
        // seo-select 로드 시도
        const loaded = await loadSeoSelect();
        
        if (!loaded) {
          if (mounted) {
            setLoadError('seo-select could not be loaded. Please ensure seo-select is installed.');
            setHasError(true);
            setIsReady(true);
          }
          return;
        }

        // 웹 컴포넌트 등록 대기
        const isRegistered = await waitForCustomElement('seo-select', 10000);
        
        if (mounted) {
          if (isRegistered) {
            setIsReady(true);
            setHasError(false);
            setLoadError(null);
          } else {
            setLoadError('seo-select web component registration timeout');
            setHasError(true);
            setIsReady(true);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to initialize seo-select:', error);
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

  // optionItems 변경 감지를 위한 안전한 비교 함수
  const optionItemsChanged = useCallback((
    prev: VirtualSelectOption[] | undefined, 
    current: VirtualSelectOption[] | undefined
  ): boolean => {
    if (!prev && !current) return false;
    if (!prev || !current) return true;
    if (prev.length !== current.length) return true;
    
    return prev.some((item, index) => 
      item.value !== current[index]?.value || 
      item.label !== current[index]?.label
    );
  }, []);

  // 값 변경 감지를 위한 안전한 비교 함수 - 개선됨
  const valueChanged = useCallback((
    prev: string | string[] | undefined, 
    current: string | string[] | undefined
  ): boolean => {
    if (prev === current) return false;
    if (!prev && !current) return false;
    if (!prev || !current) return true;
    
    if (Array.isArray(prev) && Array.isArray(current)) {
      if (prev.length !== current.length) return true;
      return prev.some((val, idx) => val !== current[idx]);
    }
    
    return String(prev) !== String(current);
  }, []);

  // imperative handle 설정 - 모든 기능 포함
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
    setTexts: (texts: Partial<LocalizedTexts>) => {
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
      if (webComponentInstance) {
        try {
          webComponentInstance.openDropdown?.();
        } catch (error) {
          console.error('Failed to open dropdown:', error);
        }
      }
    },
    closeDropdown: () => {
      webComponentInstance?.closeDropdown?.();
    },
    toggleDropdown: () => {
      if (webComponentInstance) {
        if (webComponentInstance.open) {
          webComponentInstance.closeDropdown?.();
        } else {
          webComponentInstance.openDropdown?.();
        }
      }
    },
    
    // 계산 메서드들
    calculateAutoWidth: () => {
      webComponentInstance?.calculateAutoWidth?.();
    },
    calculateDropdownHeight: () => {
      return webComponentInstance?.calculateDropdownHeight?.() || 'auto';
    },
    getEffectiveWidth: () => {
      return webComponentInstance?.getEffectiveWidth?.() || 'auto';
    },
    getEffectiveHeight: () => {
      return webComponentInstance?.getEffectiveHeight?.() || 'auto';
    },
    
    // 고급 메서드들
    getLocalizedText: () => {
      return webComponentInstance?.getLocalizedText?.() || {
        placeholder: 'Select...',
        noDataText: 'No data available',
        loadingText: 'Loading...',
        removeTag: 'Remove',
        clearAll: 'Clear all',
        resetToDefault: 'Reset to default',
        required: 'This field is required'
      };
    },
    getAllOptionData: () => {
      return webComponentInstance?.getAllOptionData?.() || [];
    },
    
    // 상태 접근
    isOpen: () => webComponentInstance?.open || false,
    isLoading: () => (webComponentInstance as any)?._isLoading || false,
    getTheme: () => webComponentInstance?.theme || 'float',
    isDark: () => webComponentInstance?.dark || false,
    getLanguage: () => webComponentInstance?.language || 'en',
    isAutoWidth: () => webComponentInstance?.autoWidth || false,
  }), [webComponentInstance]);

  // 이벤트 리스너 설정 - React 이벤트 충돌 방지 최적화
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
    
    const handleReset = (e: Event) => {
      onReset?.((e as CustomEvent).detail);
    };
    
    const handleChange = () => {
      onChange?.();
    };
    
    const handleOpen = () => {
      onOpen?.();
    };

    // 이벤트 리스너 등록
    const eventListeners: Array<[string, EventListener]> = [];
    
    if (onSelect) { 
      el.addEventListener('onSelect', handleSelect); 
      eventListeners.push(['onSelect', handleSelect]);
    }
    if (onDeselect) { 
      el.addEventListener('onDeselect', handleDeselect); 
      eventListeners.push(['onDeselect', handleDeselect]);
    }
    if (onReset) { 
      el.addEventListener('onReset', handleReset); 
      eventListeners.push(['onReset', handleReset]);
    }
    if (onChange) { 
      el.addEventListener('onChange', handleChange); 
      eventListeners.push(['onChange', handleChange]);
    }
    if (onOpen) { 
      el.addEventListener('onOpen', handleOpen); 
      eventListeners.push(['onOpen', handleOpen]);
    }

    return () => { 
      eventListeners.forEach(([name, handler]) => {
        el.removeEventListener(name, handler);
      });
    };
  }, [webComponentInstance, onSelect, onDeselect, onReset, onChange, onOpen]);

  useEffect(() => {
    if (!webComponentInstance || isInitializingRef.current || syncInProgressRef.current) return;

    syncInProgressRef.current = true;

    try {
      // 객체 속성 설정
      if (typeof multiple === 'boolean' && webComponentInstance.multiple !== multiple) {
        webComponentInstance.multiple = multiple;
      }

      // 테마 및 외관 관련 속성
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
      
      // 크기 관련 속성
      if (width && webComponentInstance.width !== width) {
        webComponentInstance.width = width;
      }
      if (height && webComponentInstance.height !== height) {
        webComponentInstance.height = height;
      }
      
      // 다국어 텍스트
      if (texts && JSON.stringify(webComponentInstance.texts) !== JSON.stringify(texts)) {
        webComponentInstance.texts = texts;
      }
      
      // 폼 관련 속성
      if (typeof required === 'boolean' && webComponentInstance.required !== required) {
        webComponentInstance.required = required;
      }

      // 업데이트 요청
      webComponentInstance.requestUpdate?.();

    } catch (err) {
      console.error('Failed to sync props:', err);
    } finally {
      syncInProgressRef.current = false;
    }
  }, [webComponentInstance, theme, dark, language, showReset, autoWidth, width, height, texts, required, multiple, disabled]);

  // optionItems 동기화 - 다중 선택 개선
  useEffect(() => {
    if (!webComponentInstance || isInitializingRef.current || syncInProgressRef.current) return;
    
    if (optionItemsChanged(prevOptionItemsRef.current, optionItems)) {
      prevOptionItemsRef.current = optionItems ? [...optionItems] : undefined;
      
      syncInProgressRef.current = true;
      
      try {
        if (optionItems && Array.isArray(optionItems)) {
          // 기존 선택값 보존 여부 결정
          const hasCurrentSelection = multiple 
            ? (webComponentInstance.selectedValues || []).length > 0
            : Boolean(webComponentInstance.value);
          
          webComponentInstance.optionItems = optionItems;
          
          // 다중 선택에서 선택값 유효성 검사 개선
          if (hasCurrentSelection) {
            if (multiple) {
              const currentSelectedValues = webComponentInstance.selectedValues || [];
              const availableValues = new Set(optionItems.map(opt => opt.value));
              const validValues = currentSelectedValues.filter(val => availableValues.has(val));
              
              // 유효하지 않은 값이 있는 경우에만 업데이트
              if (validValues.length !== currentSelectedValues.length) {
                webComponentInstance.selectedValues = validValues;
              }
            } else {
              const currentValue = webComponentInstance.value;
              if (currentValue && !optionItems.some(opt => opt.value === currentValue)) {
                // 단일 선택에서 현재 값이 유효하지 않으면 첫 번째 옵션으로 설정하거나 빈 값으로 설정
                webComponentInstance.value = '';
              }
            }
          }
          
          // 비동기 업데이트
          Promise.resolve().then(() => {
            webComponentInstance.requestUpdate?.();
          });
        }
      } catch (err) {
        console.error('Failed to sync optionItems:', err);
      } finally {
        syncInProgressRef.current = false;
      }
    }
  }, [webComponentInstance, optionItems, multiple, optionItemsChanged]);

  // 값 동기화 - 다중 선택 최적화
  useEffect(() => {
    if (!webComponentInstance || isInitializingRef.current || syncInProgressRef.current) return;
    
    if (value !== undefined && valueChanged(prevValueRef.current, value)) {
      prevValueRef.current = value;
      
      syncInProgressRef.current = true;
      
      try {
        if (Array.isArray(value)) {
          // 다중 선택의 경우
          if (multiple) {
            const currentSelectedValues = webComponentInstance.selectedValues || [];
            // 배열 값 비교 개선
            const arraysEqual = currentSelectedValues.length === value.length && 
              currentSelectedValues.every((val, idx) => val === value[idx]);
            
            if (!arraysEqual) {
              webComponentInstance.selectedValues = [...value];
              Promise.resolve().then(() => {
                webComponentInstance.requestUpdate?.();
              });
            }
          } else {
            console.warn('Array value provided for single select');
          }
        } else {
          // 단일 선택의 경우
          if (!multiple) {
            const stringValue = String(value);
            if (webComponentInstance.value !== stringValue) {
              webComponentInstance.value = stringValue;
              Promise.resolve().then(() => {
                webComponentInstance.requestUpdate?.();
              });
            }
          } else {
            // 단일 값이지만 다중 선택인 경우 배열로 변환
            const arrayValue = value ? [String(value)] : [];
            const currentSelectedValues = webComponentInstance.selectedValues || [];
            const arraysEqual = currentSelectedValues.length === arrayValue.length && 
              currentSelectedValues.every((val, idx) => val === arrayValue[idx]);
            
            if (!arraysEqual) {
              webComponentInstance.selectedValues = arrayValue;
              Promise.resolve().then(() => {
                webComponentInstance.requestUpdate?.();
              });
            }
          }
        }
      } catch (err) {
        console.error('Failed to set value:', err);
      } finally {
        syncInProgressRef.current = false;
      }
    }
  }, [webComponentInstance, value, multiple, valueChanged]);

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

  // 웹 컴포넌트 생성 및 관리 - 이벤트 충돌 방지 최적화
  useEffect(() => {
    if (!containerRef.current || !isReady || hasError) return;
    
    const container = containerRef.current;
    
    // 기존 내용 제거
    container.innerHTML = '';
    
    // Boolean 속성은 true일 때만 추가
    const booleanAttrs: string[] = [];
    if (dark === true) booleanAttrs.push('dark');
    if (showReset === true) booleanAttrs.push('show-reset');
    if (autoWidth === true) booleanAttrs.push('auto-width');
    if (multiple === true) booleanAttrs.push('multiple');
    if (required === true) booleanAttrs.push('required');
    if (disabled === true) booleanAttrs.push('disabled');
    
    // 문자열 속성들
    const stringAttrs: string[] = [];
    if (id) stringAttrs.push(`id="${id}"`);
    if (className) stringAttrs.push(`class="${className}"`);
    if (name) stringAttrs.push(`name="${name}"`);
    if (theme) stringAttrs.push(`theme="${theme}"`);
    if (language) stringAttrs.push(`language="${language}"`);
    if (width) stringAttrs.push(`width="${width}"`);
    if (height) stringAttrs.push(`height="${height}"`);
    
    const allAttrs = [...stringAttrs, ...booleanAttrs];
    const attributeString = allAttrs.join(' ');
    
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
    const componentHtml = `<seo-select ${attributeString}>${childrenHtml}</seo-select>`;
    container.innerHTML = componentHtml;
    
    // 생성된 요소에 대한 참조 설정
    const webComponent = container.querySelector('seo-select') as SeoSelectElement;
    if (webComponent) {
      // 초기화 플래그 설정
      isInitializingRef.current = true;
      
      setWebComponentInstance(webComponent);
      
      // 스타일 적용
      if (style) {
        Object.assign(webComponent.style, style);
      }
      
      // 초기값 설정 - 다중 선택 최적화
      requestAnimationFrame(() => {
        try {
          // 먼저 multiple 속성 확실히 설정 - DOM과 객체 속성 모두
          if (typeof multiple === 'boolean') {
            if (multiple) {
              webComponent.setAttribute('multiple', '');
            } else {
              webComponent.removeAttribute('multiple');
            }
            webComponent.multiple = multiple;
          }
          
          // optionItems 설정
          if (optionItems && Array.isArray(optionItems)) {
            webComponent.optionItems = optionItems;
            prevOptionItemsRef.current = [...optionItems];
          }
          
          // 초기 값 설정 - 다중 선택 우선 처리
          if (value !== undefined) {
            if (Array.isArray(value) && multiple) {
              webComponent.selectedValues = [...value];
            } else if (!Array.isArray(value) && !multiple) {
              webComponent.value = String(value);
            } else if (Array.isArray(value) && !multiple) {
              // 배열이지만 단일 선택인 경우 첫 번째 값 사용
              webComponent.value = value.length > 0 ? String(value[0]) : '';
            } else if (!Array.isArray(value) && multiple) {
              // 단일 값이지만 다중 선택인 경우 배열로 변환
              webComponent.selectedValues = value ? [String(value)] : [];
            }
            prevValueRef.current = value;
          }
          
          // Props 동기화
          if (texts) webComponent.texts = texts;
          
          // 여러 번 강제 업데이트 - 다중 선택에서 중요
          webComponent.requestUpdate?.();
          
          // 추가 업데이트 - 마이크로태스크에서
          Promise.resolve().then(() => {
            webComponent.requestUpdate?.();
          });
          
        } catch (err) {
          console.error('Failed to initialize web component:', err);
        } finally {
          isInitializingRef.current = false;
        }
      });
    } else {
      console.error('Failed to find created web component');
    }
    
    return () => {
      container.innerHTML = '';
      setWebComponentInstance(null);
      isInitializingRef.current = false;
      syncInProgressRef.current = false;
    };
  }, [isReady, hasError, id, className, name, theme, dark, language, showReset, width, height, autoWidth, multiple, required, disabled, style, processedChildren]);

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
        seo-select (SSR)
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
        Loading seo-select...
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

  // React 이벤트와 웹 컴포넌트 이벤트 분리를 위한 래퍼
  return (
    <div 
      ref={containerRef} 
      style={{ display: 'contents' }}
      onMouseDownCapture={(e) => {
        const target = e.target as Element;
        if (target.closest('seo-select')) {
          e.stopPropagation();
        }
      }}
    />
  );
});

SeoSelect.displayName = 'SeoSelect';

// 정적 메서드들 추가
(SeoSelect as any).getSupportedLanguages = (): SupportedLanguage[] => {
  return ['en', 'ko', 'ja', 'zh'];
};

(SeoSelect as any).getDefaultTexts = (): Record<SupportedLanguage, LocalizedTexts> => {
  return {
    en: {
      placeholder: 'Select...',
      noDataText: 'No data available',
      loadingText: 'Loading...',
      removeTag: 'Remove',
      clearAll: 'Clear all',
      resetToDefault: 'Reset to default',
      required: 'This field is required'
    },
    ko: {
      placeholder: '선택하세요...',
      noDataText: '데이터가 없습니다',
      loadingText: '로딩 중...',
      removeTag: '제거',
      clearAll: '모두 지우기',
      resetToDefault: '기본값으로 재설정',
      required: '필수 입력 항목입니다'
    },
    ja: {
      placeholder: '選択してください...',
      noDataText: 'データがありません',
      loadingText: '読み込み中...',
      removeTag: '削除',
      clearAll: 'すべてクリア',
      resetToDefault: 'デフォルトにリセット',
      required: 'この項目は必須です'
    },
    zh: {
      placeholder: '请选择...',
      noDataText: '无数据',
      loadingText: '加载中...',
      removeTag: '删除',
      clearAll: '清除全部',
      resetToDefault: '重置为默认值',
      required: '此字段为必填项'
    }
  };
};

export default SeoSelect;