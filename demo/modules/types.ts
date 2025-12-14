/**
 * Demo 페이지 타입 정의
 */

export interface LanguageNames {
  ko: string;
  en: string;
  ja: string;
  zh: string;
}

export interface SampleLanguage {
  prefix: string;
  code: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface SeoSelectElement extends HTMLElement {
  optionItems: OptionItem[];
  value: string;
  selectedValues: string[];
  dark: boolean;
  showReset: boolean;
  name: string;
  id: string;
  setLanguage?: (lang: string) => void;
  calculateAutoWidth?: () => void;
  addSeoSelectEventListener?: (eventType: string, handler: (event: SeoSelectEvent) => void) => void;
  addOptions?: (options: OptionItem[], preserveSelection?: boolean) => void;
  addOption?: (option: OptionItem, index?: number) => void;
  clearOption?: (value: string) => void;
  clearAllOptions?: () => void;
  batchUpdateOptions?: (updates: Array<{
    action: 'add' | 'remove' | 'update';
    option?: OptionItem;
    value?: string;
    index?: number;
  }>) => void;
  loadOptionsForSearch?: (searchText: string, loader: (search: string) => Promise<OptionItem[]>) => Promise<void>;
  dataset: DOMStringMap & {
    eventListenersInitialized?: string;
  };
}

export interface SeoSelectEvent extends Event {
  label?: string;
  value?: string;
  values?: string[];
  labels?: string[];
  detail?: {
    label?: string;
    value?: string;
    values?: string[];
    labels?: string[];
  };
}

export interface EventHandlers {
  [key: string]: (event: SeoSelectEvent) => void;
}
