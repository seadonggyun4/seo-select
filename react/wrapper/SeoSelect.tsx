// react/wrapper/SeoSelect.tsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// 런타임에 상위 디렉토리의 빌드된 파일 import
// 이 방식으로 하면 빌드 시에 실제 파일을 찾을 수 있습니다
const loadSeoSelect = async () => {
  try {
    await import('../../dist/index.js');
  } catch (error) {
    console.warn('Could not load seo-select from parent directory, trying alternative path');
  }
};

// 타입은 컴파일 타임에만 사용되므로 type-only import 사용
import type { 
  SeoSelectElement, 
  VirtualSelectOption, 
  SupportedLanguage, 
  SelectTheme 
} from '../../dist/types/index.js';

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
}

export interface SeoSelectRef {
  element: SeoSelectElement | null;
  addOptions: (options: VirtualSelectOption[], preserveSelection?: boolean) => void;
  addOption: (option: VirtualSelectOption, index?: number) => void;
  clearOption: (value: string) => void;
  clearAllOptions: () => void;
  resetToDefaultValue: () => void;
  setLanguage: (language: SupportedLanguage) => void;
  getValue: () => string | null;
  setValue: (value: string) => void;
  getSelectedValues: () => string[];
  setSelectedValues: (values: string[]) => void;
}

const SeoSelect = forwardRef<SeoSelectRef, SeoSelectProps>((props, ref) => {
  const elementRef = useRef<SeoSelectElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  const {
    onSelect, onDeselect, onReset, onChange, onOpen,
    children, optionItems, value, className, style,
    ...otherProps
  } = props;

  // 컴포넌트 마운트 시 seo-select 로드
  useEffect(() => {
    loadSeoSelect().then(() => {
      setIsLoaded(true);
    }).catch(console.error);
  }, []);

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
    if (!isLoaded) return;
    
    const element = elementRef.current;
    if (!element) return;

    const handleSelect = (event: any) => onSelect?.(event.detail || event);
    const handleDeselect = (event: any) => onDeselect?.(event.detail || event);
    const handleReset = (event: any) => onReset?.(event.detail || event);
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
  }, [isLoaded, onSelect, onDeselect, onReset, onChange, onOpen]);

  // optionItems 동기화
  useEffect(() => {
    if (isLoaded && elementRef.current && optionItems) {
      elementRef.current.optionItems = optionItems;
    }
  }, [isLoaded, optionItems]);

  // value 동기화
  useEffect(() => {
    if (isLoaded && elementRef.current && value !== undefined) {
      if (Array.isArray(value)) {
        elementRef.current.selectedValues = value;
      } else {
        elementRef.current.value = value;
      }
    }
  }, [isLoaded, value]);

  // 로딩 중이면 placeholder 렌더링
  if (!isLoaded) {
    return `<div>Loading...</div>`;
  }

  return React.createElement(
    'seo-select',
    { ref: elementRef, className, style, ...otherProps },
    children
  );
});

SeoSelect.displayName = 'SeoSelect';
export default SeoSelect;