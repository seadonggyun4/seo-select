import { InteractiveVirtualSelect } from '../../core/InteractiveVirtualSelect.js';
import '../../styles/components/style.scss';
import {
  LOCALIZED_TEXTS,
  SUPPORTED_LANGUAGES,
  DEFAULT_CONFIG,
  EVENT_NAMES,
  CSS_CLASSES,
  TIMING,
  ICONS
} from '../../constants/constants.js';
import {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
  SeoSelectEventListener
} from '../../event/index.js';

import type {
  VirtualSelectOption,
  BatchUpdateOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts
} from '../../types/index.js';

// SSR/Browser detection
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// Safe custom element definition
function safeDefineCustomElement(name: string, constructor: CustomElementConstructor): void {
  if (isBrowser() && !customElements.get(name)) {
    customElements.define(name, constructor);
  }
}

export class SeoSelect extends HTMLElement {
  static formAssociated = true;

  static get observedAttributes(): string[] {
    return ['id', 'name', 'required', 'width', 'height', 'show-reset', 'multiple', 'theme', 'dark', 'language', 'auto-width'];
  }

  declare id: string;
  declare name: string;
  declare required: boolean;
  declare width: string | null;
  declare height: string;
  private _optionItems: VirtualSelectOption[] = [];
  declare showReset: boolean;
  declare multiple: boolean;
  declare theme: SelectTheme;
  declare dark: boolean;
  declare language: SupportedLanguage;
  declare texts: Partial<LocalizedTexts>;
  declare autoWidth: boolean;

  declare open: boolean;
  declare _labelText: string;
  declare _selectedValues: string[];
  declare _isLoading: boolean;

  declare _value: string | null;
  declare _initialValue: string | null;
  declare _initialLabel: string | null;
  declare _virtual: InteractiveVirtualSelect | null;
  // Option 데이터를 순수 객체 배열로 저장 (DOM 참조 대신)
  declare _optionData: VirtualSelectOption[];
  declare _internals: ElementInternals;
  declare _pendingActiveIndex: number | null;
  declare _calculatedWidth: string | null;
  declare _calculatedHeight: string | null;

  // 레거시 호환성을 위한 getter (HTMLOptionElement[] 대신 VirtualSelectOption[] 사용)
  public _optionsCache: Map<string, VirtualSelectOption> = new Map();
  private _localizedTextCache: LocalizedTexts | null = null;
  private _lastLanguage: string = '';
  private _lastTextsHash: string = '';
  protected _widthCalculationCache: Map<string, number> = new Map();
  protected _isUpdating: boolean = false;
  private _updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _handleKeydownBound: (e: KeyboardEvent) => void;
  private _initialized: boolean = false;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._value = null;
    this._initialValue = null;
    this._initialLabel = null;
    this._virtual = null;
    this._optionData = [];
    this.width = null;
    this.required = DEFAULT_CONFIG.required;
    this._optionItems = [];
    this.open = false;
    this._labelText = '';
    this.showReset = DEFAULT_CONFIG.showReset;
    this.multiple = DEFAULT_CONFIG.multiple;
    this._selectedValues = [];
    this._isLoading = false;
    this.theme = DEFAULT_CONFIG.theme;
    this.dark = DEFAULT_CONFIG.dark;
    this.language = DEFAULT_CONFIG.language;
    this.texts = {};
    this.autoWidth = false;
    this._calculatedWidth = null;
    this._calculatedHeight = null;
    this._handleKeydownBound = (e: KeyboardEvent) => this._virtual?.handleKeydown(e);
    this.tabIndex = 0;
    this._pendingActiveIndex = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'id':
        // id is handled natively
        break;
      case 'name':
        this.name = newValue || '';
        break;
      case 'required':
        this.required = newValue !== null;
        break;
      case 'width':
        this.width = newValue;
        break;
      case 'height':
        this.height = newValue || DEFAULT_CONFIG.height;
        break;
      case 'show-reset':
        this.showReset = newValue !== null;
        break;
      case 'multiple':
        this.multiple = newValue !== null;
        break;
      case 'theme':
        this.theme = (newValue as SelectTheme) || DEFAULT_CONFIG.theme;
        break;
      case 'dark':
        this.dark = newValue !== null;
        break;
      case 'language':
        this.language = (newValue as SupportedLanguage) || DEFAULT_CONFIG.language;
        this._localizedTextCache = null;
        break;
      case 'auto-width':
        this.autoWidth = newValue !== null;
        break;
    }

    if (this._initialized) {
      this._render();
    }
  }

  connectedCallback(): void {
    if (!isBrowser()) return;

    this.style.width = this.width !== '100%' ? '' : '100%';
    this.initializeOptionsFromPropsOrSlot();
    this._render();
    this._initialized = true;

    window.addEventListener(EVENT_NAMES.SELECT_OPEN, this.onOtherSelectOpened);
    window.addEventListener('click', this.handleOutsideClick, true);
    this.addEventListener('keydown', this._handleKeydownBound);
  }

  disconnectedCallback(): void {
    window.removeEventListener(EVENT_NAMES.SELECT_OPEN, this.onOtherSelectOpened);
    window.removeEventListener('click', this.handleOutsideClick);
    this.removeEventListener('keydown', this._handleKeydownBound);
    this._virtual?.destroy();
    this._virtual = null;
    this._optionsCache.clear();
    this._widthCalculationCache.clear();
    this._localizedTextCache = null;

    if (this._updateDebounceTimer) {
      clearTimeout(this._updateDebounceTimer);
    }

    if (this.multiple) {
      this._selectedValues = [];
    } else {
      this.value = '';
    }
  }

  protected _render(): void {
    if (this.multiple) {
      this._renderMultiSelect();
    } else {
      this._renderSingleSelect();
    }
    this._bindEvents();
  }

  protected _renderMultiSelect(): void {
    const texts = this.getLocalizedText();
    const showResetButton = this.showReset && this._selectedValues.length > 0;
    const effectiveWidth = this.getEffectiveWidth();
    const effectiveHeight = this.getEffectiveHeight();

    const tagsHtml = this._selectedValues.map(value => {
      const option = this._optionsCache.get(value) || this._optionData.find(opt => opt.value === value);
      const label = option?.label || value;
      return `
        <span class="${CSS_CLASSES.TAG}">
          ${this._escapeHtml(label)}
          <button
            type="button"
            class="${CSS_CLASSES.TAG_REMOVE}"
            data-value="${this._escapeHtml(value)}"
            title="${texts.removeTag}"
          >${ICONS.CLOSE()}</button>
        </span>
      `;
    }).join('');

    const placeholderHtml = this._selectedValues.length === 0
      ? `<span class="${CSS_CLASSES.PLACEHOLDER}">${texts.placeholder}</span>`
      : '';

    const resetButtonHtml = showResetButton
      ? `<button
          type="button"
          class="${CSS_CLASSES.MULTI_RESET_BUTTON}"
          data-action="reset"
          title="${texts.clearAll}"
        >${ICONS.CLOSE()}</button>`
      : '';

    const dropdownContent = this._getDropdownContent();

    this.innerHTML = `
      <div class="${CSS_CLASSES.SELECT} ${CSS_CLASSES.MULTI_SELECT} ${this._getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED_CONTAINER} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" data-action="toggle">
          <div class="${CSS_CLASSES.SELECTED_TAGS}">
            ${tagsHtml}
            ${placeholderHtml}
          </div>
          ${resetButtonHtml}
          <span class="${CSS_CLASSES.ARROW}">${this.open ? ICONS.CHEVRON_UP() : ICONS.CHEVRON_DOWN()}</span>
        </div>
        <div class="${CSS_CLASSES.LISTBOX} ${CSS_CLASSES.SCROLL} ${this.open ? '' : CSS_CLASSES.HIDDEN}"
             role="listbox"
             style="width: ${effectiveWidth}; height: ${effectiveHeight};">
          ${dropdownContent}
        </div>
      </div>
    `;
  }

  protected _renderSingleSelect(): void {
    const texts = this.getLocalizedText();
    const firstOptionValue = this._optionData.length > 0 ? this._optionData[0].value : null;
    const showResetButton = this.showReset &&
                          this._value !== null &&
                          firstOptionValue !== null &&
                          this._value !== firstOptionValue;
    const effectiveWidth = this.getEffectiveWidth();
    const effectiveHeight = this.getEffectiveHeight();

    const resetButtonHtml = showResetButton
      ? `<button
          type="button"
          class="${CSS_CLASSES.RESET_BUTTON}"
          data-action="reset"
          title="${texts.resetToDefault}"
        >${ICONS.CLOSE()}</button>`
      : '';

    const dropdownContent = this._getDropdownContent();

    this.innerHTML = `
      <div class="${CSS_CLASSES.SELECT} ${this._getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" data-action="toggle">
          ${this._escapeHtml(this._labelText)}
          ${resetButtonHtml}
          <span class="${CSS_CLASSES.ARROW}">${this.open ? ICONS.CHEVRON_UP() : ICONS.CHEVRON_DOWN()}</span>
        </div>
        <div class="${CSS_CLASSES.LISTBOX} ${CSS_CLASSES.SCROLL} ${this.open ? '' : CSS_CLASSES.HIDDEN}"
             role="listbox"
             style="width: ${effectiveWidth}; height: ${effectiveHeight};">
          ${dropdownContent}
        </div>
      </div>
    `;
  }

  protected _getDropdownContent(): string {
    const hasOptions = this.getAllOptionData().length > 0;
    const showNoData = this.multiple && !this._isLoading && !hasOptions;

    if (this._isLoading) {
      return this._renderLoadingSpinner();
    }
    if (showNoData) {
      return this._renderNoData();
    }
    return '';
  }

  protected _renderLoadingSpinner(): string {
    const texts = this.getLocalizedText();
    return `
      <div class="${CSS_CLASSES.LOADING_CONTAINER}">
        <div class="${CSS_CLASSES.LOADING_DOTS}">
          <div class="${CSS_CLASSES.DOT}"></div>
          <div class="${CSS_CLASSES.DOT}"></div>
          <div class="${CSS_CLASSES.DOT}"></div>
        </div>
        <span class="${CSS_CLASSES.LOADING_TEXT}">${texts.loadingText}</span>
      </div>
    `;
  }

  protected _renderNoData(): string {
    const texts = this.getLocalizedText();
    return `
      <div class="${CSS_CLASSES.NO_DATA_CONTAINER}">
        <span class="${CSS_CLASSES.NO_DATA_TEXT}">${texts.noDataText}</span>
      </div>
    `;
  }

  protected _bindEvents(): void {
    // Toggle dropdown
    const toggleEl = this.querySelector('[data-action="toggle"]');
    if (toggleEl) {
      toggleEl.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        // Don't toggle if clicking reset or remove buttons
        if (target.closest('[data-action="reset"]') || target.closest(`.${CSS_CLASSES.TAG_REMOVE}`)) {
          return;
        }
        this.toggleDropdown();
      });
    }

    // Reset button
    const resetBtn = this.querySelector('[data-action="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e: Event) => this.resetToDefault(e));
    }

    // Tag remove buttons
    const tagRemoveBtns = this.querySelectorAll(`.${CSS_CLASSES.TAG_REMOVE}`);
    tagRemoveBtns.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        const value = (btn as HTMLElement).dataset.value;
        if (value) {
          this.removeTag(e, value);
        }
      });
    });
  }

  protected _getThemeClass(): string {
    const themeClass = `theme-${this.theme}`;
    const darkClass = this.dark ? 'dark' : '';
    return `${themeClass} ${darkClass}`.trim();
  }

  protected _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public addSeoSelectEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: AddEventListenerOptions
  ): void {
    this.addEventListener(type, listener as EventListener, options);
  }

  public removeSeoSelectEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: EventListenerOptions
  ): void {
    this.removeEventListener(type, listener as EventListener, options);
  }

  public getLocalizedText(): LocalizedTexts {
    const textsHash = JSON.stringify(this.texts);

    if (this._localizedTextCache &&
        this._lastLanguage === this.language &&
        this._lastTextsHash === textsHash) {
      return this._localizedTextCache;
    }

    const baseTexts = LOCALIZED_TEXTS[this.language] || LOCALIZED_TEXTS.en;
    this._localizedTextCache = {
      ...baseTexts,
      ...this.texts
    };
    this._lastLanguage = this.language;
    this._lastTextsHash = textsHash;

    return this._localizedTextCache;
  }

  public _debouncedUpdate(): void {
    if (this._updateDebounceTimer) {
      clearTimeout(this._updateDebounceTimer);
    }

    this._updateDebounceTimer = setTimeout(() => {
      this._render();
      this._updateDebounceTimer = null;
    }, 16) as ReturnType<typeof setTimeout>;
  }

  public calculateDropdownHeight(): string {
    if (this._isLoading) {
      return '80px';
    }

    if (this._optionData.length === 0) {
      if (this.multiple) {
        return '60px';
      }
      return 'auto';
    }

    const rowHeight = 36;
    const maxHeight = 360;
    const computedHeight = this._optionData.length * rowHeight;
    const finalHeight = this._optionData.length > 10 ? maxHeight : computedHeight;

    return `${finalHeight + 5}px`;
  }

  public getEffectiveHeight(): string {
    if (this._calculatedHeight) {
      return this._calculatedHeight;
    }
    return this.calculateDropdownHeight();
  }

  public calculateAutoWidth(): void {
    if (this.width || this._optionData.length === 0) {
      this._calculatedWidth = null;
      return;
    }

    const optionTexts = this._optionData.map(opt => opt.label || '');
    const cacheKey = optionTexts.join('|') + `|${this.multiple}`;

    if (this._widthCalculationCache.has(cacheKey)) {
      const cachedWidth = this._widthCalculationCache.get(cacheKey)!;
      this._calculatedWidth = `${cachedWidth}px`;
      return;
    }

    requestAnimationFrame(() => {
      const texts = this.getLocalizedText();
      const textsToMeasure = [...optionTexts];

      if (this.multiple) {
        textsToMeasure.push(texts.placeholder);
      }

      const computedStyle = window.getComputedStyle(this);
      const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

      const maxTextWidth = this.getMaxOptionWidth(textsToMeasure, font);
      const additionalSpace = this.multiple ? 120 : 80;
      const totalWidth = Math.max(maxTextWidth + additionalSpace, 150);

      this._widthCalculationCache.set(cacheKey, totalWidth);
      this._calculatedWidth = `${totalWidth}px`;

      if (this.isConnected) {
        this._debouncedUpdate();
      }
    });
  }

  public getEffectiveWidth(): string {
    if (this.width) {
      return this.width;
    }
    if (!this.width && this._calculatedWidth) {
      return this._calculatedWidth;
    }
    return 'auto';
  }

  public removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._optionsCache.get(valueToRemove) || this._optionData.find(opt => opt.value === valueToRemove);

    if (this.open) {
      this._virtual?.destroy();
      this._virtual = null;

      const optionData = this.getAllOptionData();
      if (optionData.length > 0) {
        const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
        if (scrollEl) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      }

      this._calculatedHeight = this.calculateDropdownHeight();
    }

    triggerDeselectEvent(this, option?.label || '', valueToRemove);

    this._debouncedUpdate();
  };

  public resetToDefault = (e: Event): void => {
    e.stopPropagation();

    if (this.multiple) {
      this._selectedValues = [];
      this.updateFormValue();

      if (this.open) {
        this._virtual?.destroy();
        this._virtual = null;

        const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
        if (scrollEl) {
          const optionData = this.getAllOptionData();
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }

        this._calculatedHeight = this.calculateDropdownHeight();
      } else {
        this._pendingActiveIndex = 0;
      }

      triggerResetEvent(this, { values: [], labels: [] });
    } else {
      if (this._optionData.length > 0) {
        const firstOption = this._optionData[0];
        this.value = firstOption.value;
        this._labelText = firstOption.label || '';

        if (this.open && this._virtual) {
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
            if (this._virtual) {
              this._virtual.setActiveAndFocusedIndex(0);
              this._virtual.applyHighlight();
            }
          });
        } else {
          this._pendingActiveIndex = 0;

          if (this._virtual) {
            this._virtual.destroy();
            this._virtual = null;
          }
        }

        triggerResetEvent(this, { value: firstOption.value, label: firstOption.label || '' });
      }
    }

    this._debouncedUpdate();
  };

  public toggleDropdown = (): void => {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  };

  public hasNoOptions(): boolean {
    return this._optionData.length === 0;
  }

  /**
   * Option 초기화 - Slot Method와 Array Method 둘 다 지원
   *
   * Slot Method (권장): HTML에서 <option> 요소를 직접 선언
   * <seo-select>
   *   <option value="1">Option 1</option>
   *   <option value="2" selected>Option 2</option>
   * </seo-select>
   *
   * Array Method (대체): optionItems 속성으로 전달
   * element.optionItems = [{ value: '1', label: 'Option 1' }]
   */
  public initializeOptionsFromPropsOrSlot(): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      // 캐시 초기화
      this._optionsCache.clear();
      this._widthCalculationCache.clear();
      this._optionData = [];

      // 초기 선택 값 추적용 배열
      const selectedValues: string[] = [];

      // 1. Slot Method: HTML에서 <option> 요소 읽기
      const slotOptions = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

      if (slotOptions.length > 0) {
        // Slot에서 option 데이터 추출
        this._optionData = slotOptions.map(opt => {
          const optionItem: VirtualSelectOption = {
            value: opt.value,
            label: opt.textContent || opt.value
          };

          // 선택된 option 추적
          if (opt.selected) {
            selectedValues.push(opt.value);
          }

          // 캐시에 저장
          this._optionsCache.set(opt.value, optionItem);

          return optionItem;
        });

        // 원본 option 요소 제거 (innerHTML 렌더링과 충돌 방지)
        slotOptions.forEach(el => el.remove());
      }
      // 2. Array Method: optionItems 속성에서 읽기
      else if (Array.isArray(this.optionItems) && this.optionItems.length > 0) {
        this._optionData = this.optionItems.map(opt => {
          const optionItem: VirtualSelectOption = {
            value: opt.value,
            label: opt.label
          };

          // 캐시에 저장
          this._optionsCache.set(opt.value, optionItem);

          return optionItem;
        });
      }

      // 로딩 상태 업데이트
      this._isLoading = this._optionData.length === 0;

      // 초기 선택 상태 설정
      if (this.multiple) {
        this._selectedValues = selectedValues;
      } else {
        // single select: 선택된 값이 있으면 사용, 없으면 첫 번째 option 선택
        if (selectedValues.length > 0) {
          this._setValue(selectedValues[0], false);
        } else if (this._optionData.length > 0) {
          this._setValue(this._optionData[0].value, false);
        } else {
          this._setValue('', false);
          this._labelText = '';
        }
      }

      // 초기값 저장 (reset 기능용)
      if (this._optionData.length > 0) {
        this._initialValue = this._optionData[0].value;
        this._initialLabel = this._optionData[0].label;
      }

      // 높이 및 너비 계산
      this._calculatedHeight = this.calculateDropdownHeight();
      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
    }
  }

  public openDropdown(): void {
    triggerOpenEvent(this);
    this.open = true;
    this._render();

    if (this.hasNoOptions()) {
      this._isLoading = true;
      this._calculatedHeight = this.calculateDropdownHeight();
      this._render();

      this.loadOptionsAsync().then(() => {
        this._calculatedHeight = this.calculateDropdownHeight();
        this.initializeVirtualSelect();
      }).catch(() => {
        this._isLoading = false;
        this._calculatedHeight = this.calculateDropdownHeight();
        this._render();
      });
    } else {
      if (this._virtual) {
        this._virtual.destroy();
        this._virtual = null;
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      this.initializeVirtualSelect();
    }
  }

  public closeDropdown(): void {
    this.open = false;

    if (this._virtual) {
      this._virtual.destroy();
      this._virtual = null;
    }

    this._calculatedHeight = null;

    this._render();
  }

  protected initializeVirtualSelect(): void {
    const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
    const optionData = this.getAllOptionData();

    this._calculatedHeight = this.calculateDropdownHeight();

    if (this.multiple && optionData.length === 0) {
      return;
    }

    if (!this._virtual && scrollEl && !this._isLoading && optionData.length > 0) {
      this._virtual = this._createVirtualSelect(optionData, scrollEl);

      if (this.multiple) {
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      } else {
        const selectedIndex = optionData.findIndex((opt) => opt.value === this._value);
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        });
      }
    }
  }

  public async loadOptionsAsync(): Promise<void> {
    return new Promise((resolve) => {
      const loadingTime = Math.min(
        Math.random() * (TIMING.LOADING_MAX - TIMING.LOADING_MIN) + TIMING.LOADING_MIN,
        500
      );

      setTimeout(() => {
        this._calculatedHeight = this.calculateDropdownHeight();
        this._render();
        resolve();
      }, loadingTime);
    });
  }

  public selectOption(value: string, label: string): void {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, value];
      this.updateFormValue();
      this._render();

      this._virtual?.destroy();
      this._virtual = null;

      const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
      if (scrollEl) {
        const optionData = this.getAllOptionData();
        if (optionData.length > 0) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      triggerSelectEvent(this, label, value);

    } else {
      this._labelText = label;
      this._setValue(value);
      this.closeDropdown();

      triggerSelectEvent(this, label, value);
    }
  }

  protected updateFormValue(): void {
    const texts = this.getLocalizedText();

    if (this.multiple) {
      const formValue = this._selectedValues.join(',');
      this._internals.setFormValue(formValue);

      if (this.required && this._selectedValues.length === 0) {
        this._internals.setValidity({ valueMissing: true }, texts.required);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  public handleOutsideClick = async (e: MouseEvent) => {
    const target = e.target as Node;
    const box = this.querySelector(`.${CSS_CLASSES.SELECT}`) as HTMLDivElement;
    if (box?.contains(target)) return;
    if (!this.contains(target)) await this.closeDropdown();
  };

  public onOtherSelectOpened = (e: Event): void => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail !== this && this.open) {
      this.closeDropdown();
    }
  };

  public getMaxOptionWidth(texts: string[], font: string): number {
    const cacheKey = `${texts.join('|')}|${font}`;

    if (this._widthCalculationCache.has(cacheKey)) {
      return this._widthCalculationCache.get(cacheKey)!;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;

    const maxWidth = Math.max(...texts.map((t) => {
      const width = ctx.measureText(t).width;
      return width > 100 ? width : 100;
    }));

    this._widthCalculationCache.set(cacheKey, maxWidth);
    return maxWidth;
  }

  public getAllOptionData(): VirtualSelectOption[] {
    if (this.multiple) {
      // multi-select: 이미 선택된 항목 제외
      return this._optionData.filter(opt => !this._selectedValues.includes(opt.value));
    } else {
      // single select: 모든 옵션 반환
      return this._optionData;
    }
  }

  public _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    return new InteractiveVirtualSelect(container, options, {
      isMultiple: this.multiple,
      renderOption: (el: HTMLElement, opt: VirtualSelectOption) => {
        el.textContent = opt.label;

        if (this.multiple) {
          const isSelected = this._selectedValues.includes(opt.value);
          el.classList.toggle(CSS_CLASSES.SELECTED, isSelected);
          if (isSelected) {
            el.innerHTML = `<span class="${CSS_CLASSES.CHECK_MARK}">✓</span> ${opt.label}`;
          }
        }
      },
      onClick: (opt: VirtualSelectOption) => setTimeout(() => this.selectOption(opt.value, opt.label), TIMING.SELECT_DELAY),
      onEscape: () => this.closeDropdown(),
    });
  }

  public _setValue(newVal: string, emit: boolean = true): void {
    if (this._value === newVal) return;

    this._value = newVal;
    const matched = this._optionsCache.get(newVal) || this._optionData.find((opt) => opt.value === newVal);
    // 문자열인지 확인하여 [object Object] 방지
    const label = matched?.label;
    this._labelText = typeof label === 'string' ? label : (this._labelText || '');

    this._internals.setFormValue(this._value || '');

    const texts = this.getLocalizedText();
    if (this.required && !this._value) {
      this._internals.setValidity({ valueMissing: true }, texts.required);
    } else {
      this._internals.setValidity({});
    }

    if (emit) triggerChangeEvent(this);
  }

  // 레거시 호환성을 위한 getter - VirtualSelectOption[] 반환
  get options(): VirtualSelectOption[] {
    return this._optionData;
  }

  // 레거시 호환성을 위한 _options getter
  get _options(): VirtualSelectOption[] {
    return this._optionData;
  }

  get selectedIndex(): number {
    if (this.multiple) {
      return -1;
    }
    return this._optionData.findIndex((opt) => opt.value === this._value);
  }

  get value(): string | null {
    if (this.multiple) {
      return this._selectedValues.join(',');
    }
    return this._value;
  }

  set value(newVal: string) {
    if (this.multiple) {
      this._selectedValues = newVal ? newVal.split(',').filter(v => v.trim()) : [];
      this.updateFormValue();
      this._debouncedUpdate();
    } else {
      this._setValue(newVal, true);
    }
  }

  get defaultValue(): string | null {
    return this._optionData.length > 0 ? this._optionData[0].value : null;
  }

  get selectedValues(): string[] {
    return this.multiple ? [...this._selectedValues] : [];
  }

  set selectedValues(values: string[]) {
    if (this.multiple) {
      this._selectedValues = [...values];
      this.updateFormValue();
      this._debouncedUpdate();
    }
  }

  // optionItems getter/setter - Array Method 지원
  get optionItems(): VirtualSelectOption[] {
    return this._optionItems;
  }

  set optionItems(items: VirtualSelectOption[]) {
    this._optionItems = items;
    // 이미 초기화된 상태에서 optionItems가 설정되면 옵션 다시 초기화
    if (this._initialized && Array.isArray(items) && items.length > 0) {
      this.addOptions(items, false);
    }
  }

  public resetToDefaultValue(): void {
    this.resetToDefault(new Event('reset'));
  }

  public setLanguage(language: SupportedLanguage): void {
    this.language = language;
    this._localizedTextCache = null;
    this._debouncedUpdate();
  }

  public setTexts(customTexts: Partial<LocalizedTexts>): void {
    this.texts = { ...this.texts, ...customTexts };
    this._localizedTextCache = null;
    this._debouncedUpdate();
  }

  public setAutoWidth(enabled: boolean): void {
    this.autoWidth = enabled;
    this.calculateAutoWidth();
    this._debouncedUpdate();
  }

  public addOptions(options: VirtualSelectOption[], preserveSelection: boolean = false): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      let previousValue: string | null = null;
      let previousSelectedValues: string[] = [];

      if (preserveSelection) {
        if (this.multiple) {
          previousSelectedValues = [...this._selectedValues];
        } else {
          previousValue = this._value;
        }
      }

      // 캐시 및 데이터 초기화
      this._optionsCache.clear();
      this._widthCalculationCache.clear();
      this._optionData = [];

      if (Array.isArray(options) && options.length > 0) {
        // 옵션 데이터 저장
        this._optionData = options.map(opt => {
          const optionItem: VirtualSelectOption = {
            value: opt.value,
            label: opt.label
          };
          this._optionsCache.set(opt.value, optionItem);
          return optionItem;
        });
        this._isLoading = false;
      } else {
        this._isLoading = true;
        if (!this.multiple) {
          this._labelText = '';
        }
      }

      if (preserveSelection && options.length > 0) {
        if (this.multiple) {
          const validValues = previousSelectedValues.filter(value =>
            this._optionData.some(opt => opt.value === value)
          );
          this._selectedValues = validValues;
          this.updateFormValue();
        } else {
          if (previousValue && this._optionData.some(opt => opt.value === previousValue)) {
            this._setValue(previousValue, false);
          } else if (this._optionData.length > 0) {
            this._setValue(this._optionData[0].value, false);
          } else {
            this._setValue('', false);
            this._labelText = '';
          }
        }
      } else {
        if (this.multiple) {
          this._selectedValues = [];
          this.updateFormValue();
        } else if (this._optionData.length > 0) {
          this._setValue(this._optionData[0].value, false);
        } else {
          this._setValue('', false);
          this._labelText = '';
        }
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      if (this.open) {
        this._updateVirtualScrollData();
      }

      if (this._optionData.length > 0) {
        this._initialValue = this._optionData[0].value;
        this._initialLabel = this._optionData[0].label;
      } else {
        this._initialValue = null;
        this._initialLabel = null;
      }

      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public addOption(option: VirtualSelectOption, index?: number): void {
    if (this._isUpdating) return;

    if (this._optionData.some(opt => opt.value === option.value)) {
      console.warn(`Option with value "${option.value}" already exists`);
      return;
    }

    this._isUpdating = true;

    try {
      const optionItem: VirtualSelectOption = {
        value: option.value,
        label: option.label
      };
      this._optionsCache.set(option.value, optionItem);

      const insertIndex = index !== undefined ? Math.max(0, Math.min(index, this._optionData.length)) : this._optionData.length;

      if (insertIndex >= this._optionData.length) {
        this._optionData.push(optionItem);
      } else {
        this._optionData.splice(insertIndex, 0, optionItem);
      }

      this._widthCalculationCache.clear();
      this._isLoading = false;

      this._calculatedHeight = this.calculateDropdownHeight();

      if (this.open) {
        this._updateVirtualScrollData();
      }

      if (this._optionData.length === 1) {
        this._initialValue = option.value;
        this._initialLabel = option.label;

        if (!this.multiple && !this._value) {
          this._setValue(option.value, false);
        }
      }

      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public clearOption(value: string): void {
    if (this._isUpdating) return;

    const optionIndex = this._optionData.findIndex(opt => opt.value === value);
    if (optionIndex === -1) return;

    this._isUpdating = true;

    try {
      const removedOption = this._optionData[optionIndex];
      this._optionData.splice(optionIndex, 1);
      this._optionsCache.delete(value);
      this._widthCalculationCache.clear();

      if (this.multiple) {
        const selectedIndex = this._selectedValues.indexOf(value);
        if (selectedIndex > -1) {
          this._selectedValues.splice(selectedIndex, 1);
          this.updateFormValue();
          triggerDeselectEvent(this, removedOption.label || '', value);
        }
      } else {
        if (this._value === value) {
          if (this._optionData.length > 0) {
            this._setValue(this._optionData[0].value, true);
          } else {
            this._setValue('', true);
            this._labelText = '';
          }
        }
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      if (this.open) {
        this._updateVirtualScrollData();
      }

      if (this._optionData.length > 0) {
        this._initialValue = this._optionData[0].value;
        this._initialLabel = this._optionData[0].label;
      } else {
        this._initialValue = null;
        this._initialLabel = null;
        this._isLoading = true;
        if (!this.multiple) {
          this._labelText = '';
        }
      }

      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public clearAllOptions(): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      this._optionData = [];
      this._optionsCache.clear();
      this._widthCalculationCache.clear();

      if (this.multiple) {
        const previousSelectedValues = [...this._selectedValues];
        this._selectedValues = [];
        this.updateFormValue();

        if (previousSelectedValues.length > 0) {
          triggerResetEvent(this, { values: [], labels: [] });
        }
      } else {
        const previousValue = this._value;
        this._setValue('', true);
        this._labelText = '';

        if (previousValue) {
          triggerResetEvent(this, { value: '', label: '' });
        }
      }

      this._calculatedHeight = 'auto';

      if (this.open && this._virtual) {
        this._virtual.clearData();
      }

      this._initialValue = null;
      this._initialLabel = null;
      this._isLoading = true;
      this._calculatedWidth = null;

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  private _updateVirtualScrollData(): void {
    if (!this._virtual) return;

    const optionData = this.getAllOptionData();

    if (optionData.length > 0) {
      const activeValue = this.multiple ? undefined : this._value || undefined;
      this._virtual.setData(optionData, activeValue);

      requestAnimationFrame(() => {
        if (!this._virtual) return;

        if (this.multiple) {
          this._virtual.setActiveIndex(0);
        } else {
          const selectedIndex = optionData.findIndex(opt => opt.value === this._value);
          this._virtual.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        }
      });
    } else {
      this._virtual.clearData();
    }
  }

  public batchUpdateOptions(updates: Array<BatchUpdateOption>): void {
    if (this._isUpdating) return;
    this._isUpdating = true;
    let hasChanges = false;

    try {
      updates.forEach(update => {
        switch (update.action) {
          case 'add':
            if (update.option && !this._optionData.some(opt => opt.value === update.option!.value)) {
              const optionItem: VirtualSelectOption = {
                value: update.option.value,
                label: update.option.label
              };
              this._optionsCache.set(update.option.value, optionItem);

              const insertIndex = update.index !== undefined ?
                Math.max(0, Math.min(update.index, this._optionData.length)) :
                this._optionData.length;

              if (insertIndex >= this._optionData.length) {
                this._optionData.push(optionItem);
              } else {
                this._optionData.splice(insertIndex, 0, optionItem);
              }
              hasChanges = true;
            }
            break;

          case 'remove':
            if (update.value) {
              const optionIndex = this._optionData.findIndex(opt => opt.value === update.value);
              if (optionIndex !== -1) {
                this._optionData.splice(optionIndex, 1);
                this._optionsCache.delete(update.value);

                if (this.multiple) {
                  const selectedIndex = this._selectedValues.indexOf(update.value);
                  if (selectedIndex > -1) {
                    this._selectedValues.splice(selectedIndex, 1);
                  }
                } else {
                  if (this._value === update.value) {
                    if (this._optionData.length > 0) {
                      this._setValue(this._optionData[0].value, false);
                    } else {
                      this._setValue('', false);
                      this._labelText = '';
                    }
                  }
                }
                hasChanges = true;
              }
            }
            break;

          case 'update':
            if (update.option && update.value) {
              const existingOption = this._optionData.find(opt => opt.value === update.value);
              if (existingOption) {
                existingOption.label = update.option.label;
                this._optionsCache.set(update.value, existingOption);
                if (!this.multiple && this._value === update.value) {
                  this._labelText = update.option.label;
                }
                hasChanges = true;
              }
            }
            break;
        }
      });

      if (hasChanges) {
        this._widthCalculationCache.clear();
        this._isLoading = this._optionData.length === 0;

        this._calculatedHeight = this.calculateDropdownHeight();

        if (this.open) {
          this._updateVirtualScrollData();
        }

        if (this._optionData.length > 0) {
          this._initialValue = this._optionData[0].value;
          this._initialLabel = this._optionData[0].label;
        } else {
          this._initialValue = null;
          this._initialLabel = null;
          if (!this.multiple) {
            this._labelText = '';
          }
        }

        if (this.multiple) {
          this.updateFormValue();
        }

        this.calculateAutoWidth();
      }

    } finally {
      this._isUpdating = false;
      if (hasChanges) {
        this._debouncedUpdate();
      }
    }
  }

  public clearCaches(): void {
    this._optionsCache.clear();
    this._widthCalculationCache.clear();
    this._localizedTextCache = null;
    this._lastLanguage = '';
    this._lastTextsHash = '';
    this._calculatedHeight = null;
  }

  public onSelect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT, handler as EventListener);
  }

  public onDeselect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.DESELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.DESELECT, handler as EventListener);
  }

  public onReset(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.RESET]) => void): void {
    this.addEventListener(EVENT_NAMES.RESET, handler as EventListener);
  }

  public onOpen(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT_OPEN]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT_OPEN, handler as EventListener);
  }

  public onChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.CHANGE]) => void): void {
    this.addEventListener(EVENT_NAMES.CHANGE, handler as EventListener);
  }

  static getSupportedLanguages(): SupportedLanguage[] {
    return SUPPORTED_LANGUAGES;
  }

  static getDefaultTexts(): Record<SupportedLanguage, LocalizedTexts> {
    return LOCALIZED_TEXTS;
  }
}

safeDefineCustomElement('seo-select', SeoSelect);
