// react/wrapper/SeoSelect.tsx
import * as React from 'react';
import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useLayoutEffect } from 'react';

// 정적 임포트로 seo-select 라이브러리 로드
import '../../dist/index.js';

// 타입 정의
export interface VirtualSelectOption {
  value: string;
  label: string;
}

export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh';
export type SelectTheme = 'basic' | 'float';

export interface SeoSelectElement extends HTMLElement {
  optionItems: VirtualSelectOption[];
  value: string;
  selectedValues: string[];
  multiple: boolean;
  theme: SelectTheme;
  dark: boolean;
  language: SupportedLanguage;
  showReset: boolean;
  width: string | null;
  
  // 메서드들
  addOptions: (options: VirtualSelectOption[], preserveSelection?: boolean) => void;
  addOption: (option: VirtualSelectOption, index?: number) => void;
  clearOption: (value: string) => void;
  clearAllOptions: () => void;
  resetToDefaultValue: () => void;
  setLanguage: (language: SupportedLanguage) => void;
  setTexts: (texts: any) => void;
  setAutoWidth: (enabled: boolean) => void;
  clearCaches: () => void;
}

export interface SeoSelectProps {
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
  
  // React 이벤트 핸들러
  onSelect?: (event: { label: string; value: string }) => void;
  onDeselect?: (event: { label: string; value: string }) => void;
  onReset?: (event: { value?: string; label?: string; values?: string[]; labels?: string[] }) => void;
  onChange?: () => void;
  onOpen?: () => void;
  
  // HTML 속성
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export interface SeoSelectRef {
  element: SeoSelectElement | null;
  addOptions: (options: VirtualSelectOption[], preserveSelection?: boolean) => void;
  addOption: (option: VirtualSelectOption, index?: number) => void;
  clearOption: (value: string) => void;
  clearAllOptions: () => void;
  resetToDefaultValue: () => void;
  setLanguage: (language: SupportedLanguage) => void;
  setTexts: (texts: any) => void;
  setAutoWidth: (enabled: boolean) => void;
  clearCaches: () => void;
  getValue: () => string | null;
  setValue: (value: string) => void;
  getSelectedValues: () => string[];
  setSelectedValues: (values: string[]) => void;
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

const SeoSelect = forwardRef<SeoSelectRef, SeoSelectProps>((props, ref) => {
  const elementRef = useRef<SeoSelectElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  
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
    ...restProps
  } = props;

  // useLayoutEffect로 동기적 초기화
  useLayoutEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      try {
        const isRegistered = await waitForCustomElement('seo-select', 10000);
        
        if (mounted) {
          if (isRegistered) {
            setIsReady(true);
            setHasError(false);
          } else {
            // 등록되지 않았어도 일단 시도 (fallback)
            setIsReady(true);
            setHasError(true);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to initialize seo-select:', error);
          setHasError(true);
          setIsReady(true); // 에러여도 렌더링 시도
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
    element: elementRef.current,
    addOptions: (options: VirtualSelectOption[], preserveSelection = false) => {
      elementRef.current?.addOptions(options, preserveSelection);
    },
    addOption: (option: VirtualSelectOption, index?: number) => {
      elementRef.current?.addOption(option, index);
    },
    clearOption: (value: string) => {
      elementRef.current?.clearOption(value);
    },
    clearAllOptions: () => {
      elementRef.current?.clearAllOptions();
    },
    resetToDefaultValue: () => {
      elementRef.current?.resetToDefaultValue();
    },
    setLanguage: (language: SupportedLanguage) => {
      elementRef.current?.setLanguage(language);
    },
    setTexts: (texts: any) => {
      elementRef.current?.setTexts(texts);
    },
    setAutoWidth: (enabled: boolean) => {
      elementRef.current?.setAutoWidth(enabled);
    },
    clearCaches: () => {
      elementRef.current?.clearCaches();
    },
    getValue: () => elementRef.current?.value || null,
    setValue: (newValue: string) => {
      if (elementRef.current) {
        elementRef.current.value = newValue;
      }
    },
    getSelectedValues: () => elementRef.current?.selectedValues || [],
    setSelectedValues: (values: string[]) => {
      if (elementRef.current) {
        elementRef.current.selectedValues = values;
      }
    },
  }), []);

  // 이벤트 리스너 설정
  useEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;

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

    if (onSelect) element.addEventListener('onSelect', handleSelect);
    if (onDeselect) element.addEventListener('onDeselect', handleDeselect);
    if (onReset) element.addEventListener('onReset', handleReset);
    if (onChange) element.addEventListener('onChange', handleChange);
    if (onOpen) element.addEventListener('onOpen', handleOpen);

    return () => {
      if (onSelect) element.removeEventListener('onSelect', handleSelect);
      if (onDeselect) element.removeEventListener('onDeselect', handleDeselect);
      if (onReset) element.removeEventListener('onReset', handleReset);
      if (onChange) element.removeEventListener('onChange', handleChange);
      if (onOpen) element.removeEventListener('onOpen', handleOpen);
    };
  }, [onSelect, onDeselect, onReset, onChange, onOpen]);

  // Props 동기화
  useEffect(() => {
    if (elementRef.current && optionItems && Array.isArray(optionItems)) {
      try {
        elementRef.current.optionItems = optionItems;
      } catch (err) {
        console.error('Failed to set optionItems:', err);
      }
    }
  }, [optionItems]);

  useEffect(() => {
    if (elementRef.current && value !== undefined) {
      try {
        if (Array.isArray(value)) {
          elementRef.current.selectedValues = value;
        } else {
          elementRef.current.value = String(value);
        }
      } catch (err) {
        console.error('Failed to set value:', err);
      }
    }
  }, [value]);

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

  // children 처리 - selected 속성 제거
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === 'option') {
      // selected 속성 제거하고 복사
      const { selected, ...otherProps } = child.props;
      return React.cloneElement(child, otherProps);
    }
    return child;
  });

  // 웹 컴포넌트를 직접 JSX로 렌더링
  return (
    <seo-select
      ref={elementRef}
      id={id}
      className={className}
      style={style}
      name={name}
      required={required}
      disabled={disabled}
      multiple={multiple}
      theme={theme}
      dark={dark}
      language={language}
      show-reset={showReset}
      width={width}
      {...restProps}
    >
      {processedChildren}
    </seo-select>
  );
});

SeoSelect.displayName = 'SeoSelect';
export default SeoSelect;